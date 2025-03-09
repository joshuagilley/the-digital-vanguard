import { FastifyInstance, FastifyRequest } from "fastify";
import { Server } from "http";
import {
  IParams,
  IHeaders,
  IReply,
  NewArticleBody,
  NewFileBody,
} from "./query";
import { simpleObjectKeyConversion } from "utils";

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
    if (!rows || rows.length === 0)
      reply.code(404).send({ error: "Not found" });
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
    const convertedCaseRows = rows.map((row) =>
      simpleObjectKeyConversion(row, true)
    );
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
      request: FastifyRequest<{ Params: IParams; Body: NewArticleBody }>,
      reply
    ) => {
      const { id: userId } = request.params;
      const { articleName, articleSummary, articleUrl, tag } = request.body;
      const client = await fastify.pg.connect();
      const { rows }: { rows: { [key: string]: string }[] } =
        await client.query(
          `INSERT INTO articles (user_id, url, article_name, tag, summary) 
          VALUES (
          '${userId}', 
          '${articleUrl}',
          '${articleName}',
          '${tag}',
          '${articleSummary}'
          );`
        );
      const convertedCaseRows = rows.map((row) =>
        simpleObjectKeyConversion(row, true)
      );
      client.release();
      if (!convertedCaseRows) reply.code(404).send({ error: "Not found" });
      else reply.code(200).send(JSON.stringify(convertedCaseRows));
    },
  });

  fastify.post("/api/articles/:aid", {
    handler: async (
      request: FastifyRequest<{ Params: IParams; Body: NewFileBody }>,
      reply
    ) => {
      const { aid: articleId } = request.params;
      const { markdownText, sortValue } = request.body;

      const client = await fastify.pg.connect();
      const { rows }: { rows: { [key: string]: string }[] } =
        await client.query(
          `INSERT INTO details (article_id, markdown, sort_value) 
            VALUES ('${articleId}', '${markdownText}', ${sortValue});`
        );
      const convertedCaseRows = rows.map((row) =>
        simpleObjectKeyConversion(row, true)
      );
      client.release();

      if (!convertedCaseRows) reply.code(404).send({ error: "Not found" });
      else reply.code(200).send(JSON.stringify(convertedCaseRows));
    },
  });

  fastify.delete<{
    Params: IParams;
    Headers: IHeaders;
    Reply: IReply;
  }>("/api/articles/:aid", async (request, reply) => {
    const { aid: articleId } = request.params;
    const client = await fastify.pg.connect();
    const res = await client.query(
      `DELETE FROM articles WHERE article_id = '${articleId}';`
    );
    client.release();
    if (!res) reply.code(404).send({ error: "Not found" });
    else reply.code(200).send(JSON.stringify(res));
  });

  fastify.delete<{
    Params: IParams;
    Headers: IHeaders;
    Reply: IReply;
  }>("/api/details/:did", async (request, reply) => {
    const { did: detailId } = request.params;
    const client = await fastify.pg.connect();
    const res = await client.query(
      `DELETE FROM details WHERE detail_id = '${detailId}';`
    );
    client.release();
    if (!res) reply.code(404).send({ error: "Not found" });
    else reply.code(200).send(JSON.stringify(res));
  });

  fastify.put("/api/articles/:aid", {
    handler: async (
      request: FastifyRequest<{
        Params: IParams;
        Body: { changeText: string; property: string };
      }>,
      reply
    ) => {
      const { aid: articleId } = request.params;
      const { changeText, property } = request.body;

      const client = await fastify.pg.connect();
      const res = await client.query(
        `UPDATE articles SET ${property} = '${changeText}' WHERE article_id = '${articleId}';`
      );
      client.release();

      if (!res) reply.code(404).send({ error: "Not found" });
      else reply.code(200).send(JSON.stringify(res));
    },
  });
};

export default articleRoutes;
