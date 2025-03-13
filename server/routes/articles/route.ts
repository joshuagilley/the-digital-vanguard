/* eslint-disable @typescript-eslint/no-unused-vars */
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
import { JWT } from "../../types/auth";
import { validUserCheck } from "../../utils/authentication";

const articleRoutes = async (fastify: FastifyInstance<Server>) => {
  fastify.get<{
    Params: IParams;
    Headers: IHeaders;
    Reply: IReply;
  }>("/api/users", async (_request, reply) => {
    const client = await fastify.pg.connect();
    try {
      const { rows }: { rows: { [key: string]: string }[] } =
        await client.query(
          `SELECT t1.user_id, t1.username, t1.email, t2.article_id, t2.article_name, t2.summary, t2.tag FROM users t1 LEFT OUTER JOIN articles t2 ON t1.user_id = t2.user_id WHERE t2.article_id IS NOT NULL AND t1.email != 'joshgilleytest@gmail.com';`
        );
      const convertedCaseRows = rows.map((row) =>
        simpleObjectKeyConversion(row, true)
      );
      reply.code(200).send(JSON.stringify(convertedCaseRows));
    } catch (error) {
      reply.code(404).send({ error: "Not found" });
    }
    client.release();
  });

  fastify.get<{
    Params: IParams;
    Headers: IHeaders;
    Reply: IReply;
  }>("/api/users/:id/articles", async (request, reply) => {
    const { id: userId } = request.params;
    const client = await fastify.pg.connect();
    try {
      const { rows }: { rows: { [key: string]: string }[] } =
        await client.query(
          `  SELECT t1.user_id, t1.username, t1.email, t2.article_id, t2.article_name, t2.summary, t2.tag FROM users t1 LEFT JOIN articles t2 ON t2.user_id = t1.user_id WHERE t1.user_id = '${userId}';`
        );
      const convertedCaseRows =
        rows.length > 0
          ? rows.map((row) => simpleObjectKeyConversion(row, true))
          : [];

      reply.code(200).send(JSON.stringify(convertedCaseRows));
    } catch (error) {
      reply.code(404).send({ error: "Not found" });
    }
    client.release();
  });

  fastify.get<{
    Params: IParams;
    Headers: IHeaders;
    Reply: IReply;
  }>("/api/users/:id/articles/:aid", async (request, reply) => {
    const { id: userId, aid: articleId } = request.params;
    const client = await fastify.pg.connect();
    try {
      const { rows }: { rows: { [key: string]: string }[] } =
        await client.query(
          `SELECT t1.article_id, t1.user_id, t1.url, t1.article_name, t1.summary, t1.tag, t2.detail_id, t2.markdown, t2.sort_value FROM articles t1
        LEFT JOIN details t2
        ON t2.article_id = '${articleId}'
        WHERE t1.user_id = '${userId}' 
        AND t1.article_id = '${articleId}';`
        );
      const convertedCaseRows = rows.map((row) =>
        simpleObjectKeyConversion(row, true)
      );
      reply.code(200).send(JSON.stringify(convertedCaseRows));
    } catch (error) {
      reply.code(404).send({ error: "Not found" });
    }
    client.release();
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

      try {
        if (!authenticatedUser) throw Error("Unauthorized");
        const response = await client.query(
          `INSERT INTO articles (user_id, url, article_name, tag, summary) 
          VALUES (
          '${userId}', 
          '${articleUrl}',
          '${articleName}',
          '${tag}',
          '${articleSummary}'
          );`
        );
        reply.code(200).send(JSON.stringify(response));
      } catch (error) {
        if (!authenticatedUser) reply.code(401).send({ error: "Unauthorized" });
        else reply.code(404).send({ error: "Not found" });
      }
      client.release();
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
            VALUES ('${articleId}', '${markdownText}', ${sortValue});`
        );
        reply.code(200).send(JSON.stringify({ response, authenticated: true }));
      } catch (error) {
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
  }>("/api/users/:id/articles/:aid", async (request, reply) => {
    const { id: userId, aid: articleId } = request.params;
    const credential = request.headers.authorization?.split(" ")[1] || "";
    const client = await fastify.pg.connect();
    const authenticatedUser = await validUserCheck(client, credential, userId);
    try {
      if (!authenticatedUser) throw Error("Unauthorized");
      const res = await client.query(
        `DELETE FROM articles WHERE article_id = '${articleId}';`
      );
      reply.code(200).send(JSON.stringify(res));
    } catch (error) {
      if (!authenticatedUser) reply.code(401).send({ error: "Unauthorized" });
      else reply.code(404).send({ error: "Not found" });
    }
    client.release();
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
        (await client.query(
          `DELETE FROM details WHERE detail_id = '${detailId}';`
        ));
      reply.code(200).send(JSON.stringify(res));
    } catch (error) {
      if (!authenticatedUser) reply.code(401).send({ error: "Unauthorized" });
      else reply.code(404).send({ error: "Not found" });
    }
    client.release();
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
      const { changeText, property } = request.body;
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
          `UPDATE articles SET ${property} = '${changeText}' WHERE article_id = '${articleId}';`
        );
        reply.code(200).send(JSON.stringify(res));
      } catch (error) {
        if (!authenticatedUser) reply.code(401).send({ error: "Unauthorized" });
        else reply.code(404).send({ error: "Not found" });
      }
      client.release();
    },
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
          ` UPDATE details
            SET sort_value = sort_value - 1
            WHERE article_id = '${articleId}' AND sort_value > ${sortValue};`
        );
        reply.code(200).send(JSON.stringify(res));
      } catch (error) {
        if (!authenticatedUser) reply.code(401).send({ error: "Unauthorized" });
        else reply.code(404).send({ error: "Not found" });
      }
      client.release();
    },
  });

  fastify.put("/api/users/:id/articles/:aid/details/:did", {
    handler: async (
      request: FastifyRequest<{
        Params: IParams;
        Body: { changeValue: string; property: string; sortValue: number };
      }>,
      reply
    ) => {
      const { id: userId, aid: articleId, did: detailId } = request.params;
      const { changeValue, property, sortValue } = request.body;
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
          `UPDATE details SET ${property} = '${changeValue}' WHERE article_id = '${articleId}' AND detail_id = '${detailId}' AND sort_value = ${sortValue};`
        );
        reply.code(200).send(JSON.stringify(res));
      } catch (error) {
        if (!authenticatedUser) reply.code(401).send({ error: "Unauthorized" });
        else reply.code(404).send({ error: "Not found" });
      }
      client.release();
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
      const { email, picture, given_name, family_name }: JWT = await jwtDecode(
        credential
      );
      const client = await fastify.pg.connect();
      try {
        const { rows }: { rows: { [key: string]: string }[] } =
          await client.query(
            `SELECT user_id FROM users WHERE email = '${email}';`
          );
        const userId = rows.length > 0 ? rows[0].user_id : uuidv4();
        const userNotFound = rows.length === 0;
        if (userNotFound) {
          await client.query(
            `INSERT INTO users (user_id, username, email, picture)
                VALUES ('${userId}', '${given_name} ${family_name}', '${email}', '${picture}');`
          );
        }
        reply.code(200).send(userId);
      } catch (error) {
        reply
          .code(404)
          .send({ error: "Issue finding user or creating new user.." });
      }

      client.release();
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

export default articleRoutes;
