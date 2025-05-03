import { FastifyInstance, FastifyRequest } from "fastify";
import { Server } from "http";
import { IParams, IHeaders, IReply, TagBody } from "./query";
import { validUserCheck } from "../../utils/authentication";

const utilsRoutes = async (fastify: FastifyInstance<Server>) => {
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

export default utilsRoutes;
