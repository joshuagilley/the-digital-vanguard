import { FastifyInstance, FastifyRequest } from "fastify";
import { Server } from "http";
import { IParams, IHeaders, IReply, NewFileBody } from "./query";
import { validUserCheck } from "../../utils/authentication";

const detailRoutes = async (fastify: FastifyInstance<Server>) => {
  fastify.post("/api/users/:id/articles/:aid", {
    handler: async (
      request: FastifyRequest<{
        Params: IParams;
        Headers: { Authorization: string };
        Body: NewFileBody;
      }>,
      reply
    ) => {
      const { id: userId, aid: articleId } = request.params;
      const credential = request.headers.authorization.split(" ")[1];
      const { markdownText, sortValue } = request.body;
      const client = await fastify.pg.connect();
      const authenticatedUser = await validUserCheck(
        client,
        credential,
        userId
      );
      try {
        if (!authenticatedUser) throw Error("Unauthorized");
        const response = await client.query(
          `INSERT INTO details (article_id, markdown, sort_value) 
            VALUES ($1, $2, $3);`,
          [articleId, markdownText, sortValue]
        );
        reply.code(200).send(JSON.stringify({ response, authenticated: true }));
      } catch (error) {
        console.log(error);
        if (!authenticatedUser) reply.code(401).send({ error: "Unauthorized" });
        else reply.code(400).send({ error: "Invalid data" });
      }
      client.release();
    },
  });

  fastify.delete<{
    Params: IParams;
    Headers: IHeaders;
    Reply: IReply;
  }>("/api/users/:id/details/:did", async (request, reply) => {
    const { id: userId, did: detailId } = request.params;
    const credential = request.headers.authorization?.split(" ")[1] || "";
    const client = await fastify.pg.connect();
    const authenticatedUser = await validUserCheck(client, credential, userId);
    try {
      if (!authenticatedUser) throw Error("Unauthorized");
      const res =
        authenticatedUser &&
        (await client.query(`DELETE FROM details WHERE detail_id = $1;`, [
          detailId,
        ]));
      reply.code(200).send(JSON.stringify(res));
    } catch (error) {
      console.log(error);
      if (!authenticatedUser) reply.code(401).send({ error: "Unauthorized" });
      else reply.code(404).send({ error: "Not found" });
    }
    client.release();
  });

  fastify.put("/api/users/:id/articles/:aid/detail-sort", {
    handler: async (
      request: FastifyRequest<{
        Params: IParams;
        Body: { sortValue: number };
      }>,
      reply
    ) => {
      const { id: userId, aid: articleId } = request.params;
      const { sortValue } = request.body;
      const credential = request.headers.authorization?.split(" ")[1] || "";
      const client = await fastify.pg.connect();
      const authenticatedUser = await validUserCheck(
        client,
        credential,
        userId
      );
      try {
        if (!authenticatedUser) throw Error("Unauthorized");
        const res = await client.query(
          `UPDATE details
            SET sort_value = sort_value - 1
            WHERE article_id = $1 AND sort_value > $2;`,
          [articleId, sortValue]
        );
        reply.code(200).send(JSON.stringify(res));
      } catch (error) {
        console.log(error);
        if (!authenticatedUser) reply.code(401).send({ error: "Unauthorized" });
        else reply.code(404).send({ error: "Not found" });
      }
      client.release();
    },
  });

  fastify.put<{
    Params: IParams;
    Headers: { Authorization: string };
    Body: { changeValue: string; property: string; sortValue: number };
  }>("/api/users/:id/articles/:aid/details/:did", async (request, reply) => {
    const { id: userId, aid: articleId, did: detailId } = request.params;
    const { changeValue, property, sortValue } = request.body;
    const credential = request.headers.authorization?.split(" ")[1] || "";

    const client = await fastify.pg.connect();
    const authenticatedUser = await validUserCheck(client, credential, userId);

    try {
      if (!authenticatedUser) throw new Error("Unauthorized");

      // Optional: Whitelist allowed column names to prevent SQL injection
      const allowedProperties = ["title", "content", "notes", "status"];
      if (!allowedProperties.includes(property)) {
        reply.code(400).send({ error: "Invalid property name" });
        return;
      }

      const res = await client.query(
        `
        UPDATE details 
        SET ${property} = $1 
        WHERE article_id = $2 
          AND detail_id = $3 
          AND sort_value = $4
        `,
        [changeValue, articleId, detailId, sortValue]
      );

      reply.code(200).send(JSON.stringify(res));
    } catch (error) {
      fastify.log.error(error);
      if (!authenticatedUser) {
        reply.code(401).send({ error: "Unauthorized" });
      } else {
        reply.code(404).send({ error: "Not found" });
      }
    } finally {
      client.release();
    }
  });
};

export default detailRoutes;
