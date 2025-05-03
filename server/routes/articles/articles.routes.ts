import { FastifyInstance, FastifyRequest } from "fastify";
import { Server } from "http";
import { IParams, IHeaders, IReply, NewArticleBody } from "./query";
import { simpleObjectKeyConversion } from "../../utils";
import { validUserCheck } from "../../utils/authentication";

const articleRoutes = async (fastify: FastifyInstance<Server>) => {
  fastify.get<{
    Params: IParams;
    Headers: IHeaders;
    Reply: IReply;
  }>("/api/users/:id/articles", async (request, reply) => {
    const { id: userId } = request.params;

    try {
      const { rows }: { rows: { [key: string]: string }[] } =
        await fastify.pg.query(
          `
        SELECT 
          t1.user_id, t1.username, t1.email, t1.picture, 
          t2.article_id, t2.article_name, t2.summary, t2.tag
          FROM users t1 
          LEFT JOIN articles t2 ON t2.user_id = t1.user_id 
          WHERE t1.user_id = $1
          ORDER BY t2.date ASC;
      `,
          [userId]
        );

      const convertedCaseRows =
        rows.length > 0
          ? rows.map((row) => simpleObjectKeyConversion(row, true))
          : [];

      reply.code(200).send(JSON.stringify(convertedCaseRows));
    } catch (error) {
      fastify.log.error(error);
      reply.code(404).send({ error: "Not found" });
    }
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
          `SELECT t1.article_id, t1.user_id, t1.url, t1.article_name, t1.summary, t1.tag, 
              t2.detail_id, t2.markdown, t2.sort_value 
       FROM articles t1
       LEFT JOIN details t2 ON t2.article_id = $1
       WHERE t1.user_id = $2 
       AND t1.article_id = $1
       ORDER BY t2.sort_value ASC;`,
          [articleId, userId]
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

  fastify.post<{
    Params: IParams;
    Headers: { Authorization: string };
    Body: NewArticleBody;
  }>("/api/users/:id", async (request, reply) => {
    const { id: userId } = request.params;
    const credential = request.headers.authorization?.split(" ")[1];
    const { articleName, articleSummary, articleUrl, tag } = request.body;
    const client = await fastify.pg.connect();
    const authenticatedUser = await validUserCheck(client, credential, userId);

    try {
      if (!authenticatedUser) throw new Error("Unauthorized");

      const response = await client.query(
        `
        INSERT INTO articles (user_id, url, article_name, tag, summary) 
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *
        `,
        [userId, articleUrl, articleName, tag, articleSummary]
      );

      reply.code(200).send(JSON.stringify(response));
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
        `DELETE FROM articles WHERE article_id = $1;`,
        [articleId]
      );
      reply.code(200).send(JSON.stringify(res));
    } catch (error) {
      console.log(error);
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
          `UPDATE articles SET ${property} = $1 WHERE article_id = $2;`,
          [changeText, articleId]
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
};

export default articleRoutes;
