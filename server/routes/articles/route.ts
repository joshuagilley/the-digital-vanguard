import { FastifyInstance } from "fastify";
import { Server } from "http";
import { IParams, IHeaders, IReply } from "./query";

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
      .find({ "articles.articleId": articleId, userId: userId })
      .toArray();
    if (!result || result.length === 0)
      reply.code(404).send({ error: "Not found" });
    else reply.code(200).send(JSON.stringify(result[0]));
  });
};

export default articleRoutes;
