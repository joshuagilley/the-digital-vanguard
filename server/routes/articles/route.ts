import { FastifyInstance, FastifyRequest } from "fastify";
import { Server } from "http";
import {
  IParams,
  IHeaders,
  IReply,
  ParamsType,
  NewArticleBody,
  NewFileBody,
} from "./query";
import { v4 as uuidv4 } from "uuid";
import { PushOperator } from "mongodb";

const articleRoutes = async (fastify: FastifyInstance<Server>) => {
  fastify.get<{
    Params: IParams;
    Headers: IHeaders;
    Reply: IReply;
  }>("/api/users/:id/articles", async (request, reply) => {
    const { id: userId } = request.params;
    const users = fastify.mongo.client.db("users");
    const collection = users.collection("articles");
    const query = { userId };
    const result = await collection.findOne(query);
    if (!result) reply.code(404).send({ error: "Not found" });
    else reply.code(200).send(JSON.stringify(result));
  });

  fastify.get<{
    Params: IParams;
    Headers: IHeaders;
    Reply: IReply;
  }>("/api/users/:id/articles/:aid", async (request, reply) => {
    const { id: userId, aid: articleId } = request.params;
    const users = fastify.mongo.client.db("users");
    const collection = users.collection("articles");
    const result = await collection
      .find(
        { userId, "articles.articleId": articleId },
        { projection: { "articles.$": 1 } }
      )
      .toArray();
    if (!result || result.length === 0 || result[0].articles.length === 0)
      reply.code(404).send({ error: "Not found" });
    else reply.code(200).send(JSON.stringify(result[0].articles[0]));
  });

  fastify.get<{
    Params: IParams;
    Headers: IHeaders;
    Reply: IReply;
  }>("/api/users", async (request, reply) => {
    const users = fastify.mongo.client.db("users");
    const collection = users.collection("articles");
    const result = await collection.find().toArray();
    if (!result || result.length === 0)
      reply.code(404).send({ error: "Not found" });
    else reply.code(200).send(JSON.stringify(result));
  });

  fastify.post("/api/users/:id", {
    handler: async (
      request: FastifyRequest<{ Params: ParamsType; Body: NewArticleBody }>,
      reply
    ) => {
      const { id: userId } = request.params;
      const { articleName, articleSummary, articleUrl, imageUrl } =
        request.body;
      const users = fastify.mongo.client.db("users");
      const collection = users.collection("articles");
      const updateResponse = await collection.updateOne(
        { userId },
        {
          $push: {
            articles: {
              $each: [
                {
                  articleId: uuidv4(),
                  articleName,
                  url: articleUrl,
                  articleDetails: [],
                  imageUrl,
                  summary: articleSummary,
                },
              ],
            },
          } as unknown as PushOperator<Document>,
        }
      );
      if (!updateResponse.acknowledged)
        reply.code(404).send({ error: "Not found" });
      else reply.code(200).send(JSON.stringify(updateResponse));
    },
  });

  fastify.post("/api/users/:id/articles/:aid", {
    handler: async (
      request: FastifyRequest<{ Params: ParamsType; Body: NewFileBody }>,
      reply
    ) => {
      const { id: userId, aid: articleId } = request.params;
      const { markdownText } = request.body;
      const users = fastify.mongo.client.db("users");
      const collection = users.collection("articles");

      const updateResponse = await collection.updateOne(
        { userId, "articles.articleId": articleId },
        {
          $push: {
            "articles.$[].articleDetails": markdownText,
          } as unknown as PushOperator<Document>,
        }
      );

      if (!updateResponse.acknowledged)
        reply.code(404).send({ error: "Not found" });
      else reply.code(200).send(JSON.stringify(updateResponse));
    },
  });
};

export default articleRoutes;
