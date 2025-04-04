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
  TagBody,
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

  fastify.get<{
    Params: IParams;
    Headers: IHeaders;
    Reply: IReply;
  }>("/api/articles/:aid/tags", async (request, reply) => {
    const { aid: articleId } = request.params;
    const client = await fastify.pg.connect();
    try {
      const { rows }: { rows: { [key: string]: string }[] } =
        await client.query(
          `SELECT * FROM dynamic_tags WHERE article_id = $1;`,
          [articleId]
        );
      reply
        .code(200)
        .send(JSON.stringify(rows?.length > 0 ? rows[0].tags : []));
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

  fastify.post("/api/users/:id/articles/:aid/generate-dynamic-tags", {
    handler: async (
      request: FastifyRequest<{
        Params: IParams;
        Headers: { Authorization: string };
        Body: TagBody;
      }>,
      reply
    ) => {
      const { id: userId, aid: articleId } = request.params;
      const credential = request.headers.authorization?.split(" ")[1];
      const { tags, tagId } = request.body;

      const client = await fastify.pg.connect();

      try {
        const authenticatedUser = await validUserCheck(
          client,
          credential,
          userId
        );
        if (!authenticatedUser) {
          return reply.code(401).send({ error: "Unauthorized" });
        }

        let queryText: string;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let queryValues: any[];

        if (tagId === "") {
          queryText = `INSERT INTO dynamic_tags (article_id, tags) VALUES ($1, $2)`;
          queryValues = [articleId, tags];
        } else {
          queryText = `UPDATE dynamic_tags SET tags = $1 WHERE article_id = $2 AND tag_id = $3`;
          queryValues = [tags, articleId, tagId];
        }

        const response = await client.query(queryText, queryValues);

        reply.code(200).send({ response, authenticated: true });
      } catch (error) {
        console.error("Error generating dynamic tags:", error);
        reply.code(400).send({ error: "Invalid data" });
      } finally {
        client.release();
      }
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

  // GET ALL MARKDOWN ASSOCIATED WITH ARTICLE SEND ONE LONG STRING
  fastify.get<{
    Params: IParams;
    Headers: IHeaders;
    Reply: IReply;
  }>("/api/get-markdown/:aid", async (request, reply) => {
    const { aid: articleId } = request.params;
    const client = await fastify.pg.connect();
    try {
      const { rows }: { rows: { [key: string]: string }[] } =
        await client.query(
          `SELECT details.markdown
            FROM details
            JOIN articles ON articles.article_id = details.article_id
            WHERE articles.article_id = $1;`,
          [articleId]
        );
      reply
        .code(200)
        .send(
          JSON.stringify({ text: rows.map((item) => item.markdown).join("") })
        );
    } catch (error) {
      console.log(error);
      reply.code(404).send({ error: "Not found" });
    }
    client.release();
  });
};

export default articleRoutes;
