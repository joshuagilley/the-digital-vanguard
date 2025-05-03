import { FastifyInstance, FastifyRequest } from "fastify";
import { Server } from "http";
import { jwtDecode } from "jwt-decode";
import { v4 as uuidv4 } from "uuid";
import { IParams, IHeaders, IReply } from "./query";
import { simpleObjectKeyConversion } from "../../utils";
import { JWT } from "../../types/auth";
import { validUserCheck } from "../../utils/authentication";

const userRoutes = async (fastify: FastifyInstance<Server>) => {
  fastify.get<{
    Params: IParams;
    Headers: IHeaders;
    Reply: IReply;
  }>("/api/users", async (_request, reply) => {
    const client = await fastify.pg.connect();
    try {
      const { rows }: { rows: { [key: string]: string }[] } =
        await fastify.pg.query(
          `
        SELECT DISTINCT t1.user_id, t1.username, t1.email
        FROM users t1
        LEFT JOIN articles t2 ON t1.user_id = t2.user_id
        WHERE t2.article_id IS NOT NULL AND t1.email != $1
      `,
          [process.env.ROOT_EMAIL]
        );
      const convertedCaseRows = rows.map((row) =>
        simpleObjectKeyConversion(row, true)
      );
      reply.code(200).send(JSON.stringify(convertedCaseRows));
    } catch (error) {
      console.log(error);
      reply.code(404).send({ error: "Not found" });
    }
    client.release();
  });

  fastify.get("/api/newuser", {
    handler: async (
      request: FastifyRequest<{
        Headers: { Authorization: string };
        Body: { credential: string };
      }>,
      reply
    ) => {
      const credential = request.headers.authorization.split(" ")[1];
      const { email, picture, given_name, family_name }: JWT = await jwtDecode(
        credential
      );

      const client = await fastify.pg.connect();
      try {
        // Use parameterized query to avoid SQL injection
        const { rows }: { rows: { user_id: string }[] } = await client.query(
          "SELECT user_id FROM users WHERE email = $1;",
          [email]
        );

        // If user is not found, generate a new user_id
        const userId = rows.length > 0 ? rows[0].user_id : uuidv4();
        const userNotFound = rows.length === 0;

        if (userNotFound) {
          // Insert new user with parameterized query
          await client.query(
            "INSERT INTO users (user_id, username, email, picture) VALUES ($1, $2, $3, $4);",
            [userId, `${given_name} ${family_name}`, email, picture]
          );
        }

        reply.code(200).send(userId);
      } catch (error) {
        console.log(error);
        reply
          .code(404)
          .send({ error: "Issue finding user or creating new user.." });
      } finally {
        client.release();
      }
    },
  });

  fastify.get("/api/auth/:id", {
    handler: async (
      request: FastifyRequest<{
        Params: IParams;
        Headers: { Authorization: string };
      }>,
      reply
    ) => {
      const { id: userId } = request.params;
      const credential = request.headers.authorization?.split(" ")[1];
      const client = await fastify.pg.connect();
      const authenticatedUser = await validUserCheck(
        client,
        credential,
        userId
      );
      client.release();
      if (!authenticatedUser) reply.code(401).send({ error: "Unauthorized" });
      else reply.code(200).send({ success: "Authorized" });
    },
  });
};

export default userRoutes;
