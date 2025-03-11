import { FastifyInstance, FastifyRequest } from "fastify";
import { Server } from "http";
import { jwtDecode } from "jwt-decode";
import { v4 as uuidv4 } from "uuid";
import {
  IParams,
  IHeaders,
  IReply,
  NewArticleBody,
  NewFileBody,
} from "./query";
import { simpleObjectKeyConversion } from "utils";

interface JWT {
  email: string;
  picture: string;
  given_name: string;
  family_name: string;
}

const validUserCheck = async (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  client: any,
  credential: string,
  userId: string
) => {
  const { email } = (await jwtDecode(credential)) as JWT;
  const { rows: users }: { rows: { [key: string]: string }[] } =
    await client.query(`SELECT user_id FROM users WHERE email = '${email}';`);
  return users.length > 0 && users[0].user_id === userId;
};

const articleRoutes = async (fastify: FastifyInstance<Server>) => {
  fastify.get<{
    Params: IParams;
    Headers: IHeaders;
    Reply: IReply;
  }>("/api/users", async (request, reply) => {
    const client = await fastify.pg.connect();
    const { rows }: { rows: { [key: string]: string }[] } = await client.query(
      `SELECT * FROM users WHERE username != 'maintestuser';`
    );
    const convertedCaseRows = rows.map((row) =>
      simpleObjectKeyConversion(row, true)
    );

    // Note: avoid doing expensive computation here, this will block releasing the client
    client.release();
    if (!rows) reply.code(404).send({ error: "Not found" });
    else reply.code(200).send(JSON.stringify(convertedCaseRows));
  });

  fastify.get<{
    Params: IParams;
    Headers: IHeaders;
    Reply: IReply;
  }>("/api/users/:id/articles", async (request, reply) => {
    const { id: userId } = request.params;
    const client = await fastify.pg.connect();
    const { rows }: { rows: { [key: string]: string }[] } = await client.query(
      `  SELECT * FROM users LEFT JOIN articles ON articles.user_id = users.user_id WHERE users.user_id = '${userId}';`
    );
    const convertedCaseRows =
      rows.length > 0
        ? rows.map((row) => simpleObjectKeyConversion(row, true))
        : [];
    client.release();
    if (!convertedCaseRows) reply.code(404).send({ error: "Not found" });
    else reply.code(200).send(JSON.stringify(convertedCaseRows));
  });

  fastify.get<{
    Params: IParams;
    Headers: IHeaders;
    Reply: IReply;
  }>("/api/users/:id/articles/:aid", async (request, reply) => {
    const { id: userId, aid: articleId } = request.params;
    const client = await fastify.pg.connect();
    const { rows }: { rows: { [key: string]: string }[] } = await client.query(
      `SELECT * FROM articles 
      LEFT JOIN details 
      ON details.article_id = '${articleId}'
      WHERE user_id = '${userId}' 
      AND articles.article_id = '${articleId}';`
    );
    const convertedCaseRows = rows.map((row) =>
      simpleObjectKeyConversion(row, true)
    );
    client.release();
    if (!convertedCaseRows) reply.code(404).send({ error: "Not found" });
    else reply.code(200).send(JSON.stringify(convertedCaseRows));
  });

  fastify.post("/api/users/:id", {
    handler: async (
      request: FastifyRequest<{
        Params: IParams;
        Headers: { Authorization: string };
        Body: NewArticleBody;
      }>,
      reply
    ) => {
      const { id: userId } = request.params;
      const credential = request.headers.authorization.split(" ")[1];
      const { articleName, articleSummary, articleUrl, tag } = request.body;
      const client = await fastify.pg.connect();
      const authenticatedUser = await validUserCheck(
        client,
        credential,
        userId
      );

      const { rows }: { rows: { [key: string]: string }[] } =
        authenticatedUser &&
        (await client.query(
          `INSERT INTO articles (user_id, url, article_name, tag, summary) 
          VALUES (
          '${userId}', 
          '${articleUrl}',
          '${articleName}',
          '${tag}',
          '${articleSummary}'
          );`
        ));
      const convertedCaseRows = rows?.map((row) =>
        simpleObjectKeyConversion(row, true)
      );
      client.release();
      if (!authenticatedUser) reply.code(401).send({ error: "Unauthorized" });
      else if (!convertedCaseRows) reply.code(404).send({ error: "Not found" });
      else reply.code(200).send(JSON.stringify(convertedCaseRows));
    },
  });

  fastify.post("/api/users/:id/articles/:aid", {
    handler: async (
      request: FastifyRequest<{
        Params: IParams;
        Headers: { Authorization: string };
        Body: NewFileBody;
      }>,
      reply
    ) => {
      let convertedCaseRows: { [key: string]: string }[] = [];
      const { id: userId, aid: articleId } = request.params;
      const credential = request.headers.authorization.split(" ")[1];
      const { markdownText, sortValue } = request.body;
      const client = await fastify.pg.connect();

      // logged in user is valid check
      const authenticatedUser =
        credential && (await validUserCheck(client, credential, userId));

      if (credential && authenticatedUser) {
        const { rows }: { rows: { [key: string]: string }[] } =
          await client.query(
            `INSERT INTO details (article_id, markdown, sort_value) 
            VALUES ('${articleId}', '${markdownText}', ${sortValue});`
          );
        convertedCaseRows = rows.map((row) =>
          simpleObjectKeyConversion(row, true)
        );
      }
      client.release();

      if (!credential || !authenticatedUser)
        reply.code(401).send({ error: "Unauthorized" });
      else if (!convertedCaseRows) reply.code(404).send({ error: "Not found" });
      else
        reply
          .code(200)
          .send(JSON.stringify({ convertedCaseRows, authenticated: true }));
    },
  });

  fastify.delete<{
    Params: IParams;
    Headers: IHeaders;
    Reply: IReply;
  }>("/api/users/:id/articles/:aid", async (request, reply) => {
    const { id: userId, aid: articleId } = request.params;
    const credential = request.headers.authorization?.split(" ")[1];
    const client = await fastify.pg.connect();
    const authenticatedUser =
      credential && (await validUserCheck(client, credential, userId));
    const res =
      authenticatedUser &&
      (await client.query(
        `DELETE FROM articles WHERE article_id = '${articleId}';`
      ));
    client.release();
    if (!res) reply.code(404).send({ error: "Not found" });
    else reply.code(200).send(JSON.stringify(res));
  });

  fastify.delete<{
    Params: IParams;
    Headers: IHeaders;
    Reply: IReply;
  }>("/api/users/:id/details/:did", async (request, reply) => {
    const { id: userId, did: detailId } = request.params;
    const credential = request.headers.authorization?.split(" ")[1];
    const client = await fastify.pg.connect();
    const authenticatedUser =
      credential && (await validUserCheck(client, credential, userId));
    const res =
      authenticatedUser &&
      (await client.query(
        `DELETE FROM details WHERE detail_id = '${detailId}';`
      ));
    client.release();
    if (!authenticatedUser) reply.code(401).send({ error: "Unauthorized" });
    else if (!res) reply.code(404).send({ error: "Not found" });
    else reply.code(200).send(JSON.stringify(res));
  });

  fastify.put("/api/users/:id/articles/:aid", {
    handler: async (
      request: FastifyRequest<{
        Params: IParams;
        Body: { changeText: string; property: string };
      }>,
      reply
    ) => {
      const { id: userId, aid: articleId } = request.params;
      const credential = request.headers.authorization?.split(" ")[1];
      const { changeText, property } = request.body;
      const client = await fastify.pg.connect();
      const authenticatedUser =
        credential && (await validUserCheck(client, credential, userId));
      const res =
        authenticatedUser &&
        (await client.query(
          `UPDATE articles SET ${property} = '${changeText}' WHERE article_id = '${articleId}';`
        ));

      client.release();
      if (!authenticatedUser) reply.code(401).send({ error: "Unauthorized" });
      if (!res) reply.code(404).send({ error: "Not found" });
      else reply.code(200).send(JSON.stringify(res));
    },
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
      const { email, picture, given_name, family_name } = (await jwtDecode(
        credential
      )) as JWT;
      const client = await fastify.pg.connect();
      const { rows }: { rows: { [key: string]: string }[] } =
        await client.query(`SELECT * FROM users WHERE email = '${email}';`);
      const userId = rows.length > 0 ? rows[0].user_id : uuidv4();
      const userNotFound = rows.length === 0;
      if (userNotFound) {
        try {
          await client.query(
            `INSERT INTO users (user_id, username, email, picture)
                VALUES ('${userId}', '${given_name} ${family_name}', '${email}', '${picture}');`
          );
        } catch (error) {
          console.log(error);
          reply.code(404).send({ error: "Not found" });
        }
      }
      client.release();

      reply.code(200).send(userId);
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

      const authenticatedUser =
        credential && (await validUserCheck(client, credential, userId));
      client.release();
      if (!authenticatedUser) reply.code(401).send({ error: "Unauthorized" });
      else reply.code(200).send({ success: "Authorized" });
    },
  });
};

export default articleRoutes;
