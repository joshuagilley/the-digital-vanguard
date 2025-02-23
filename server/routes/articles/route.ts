import { FastifyInstance } from "fastify";
import { Server } from "http";
import { IParams, IHeaders, IReply } from "./query";

const articleRoutes = async (fastify: FastifyInstance<Server>) => {
  fastify.get<{
    Params: IParams;
    Headers: IHeaders;
    Reply: IReply;
  }>("/api/users/:id/articles", async (request, reply) => {
    const { id } = request.params;
    const users = fastify.mongo.client.db("users");
    const collection = users.collection("articles");
    const query = { user_id: id };
    const result = await collection.findOne(query);
    if (!result) reply.code(404).send({ error: "Not found" });
    else reply.code(200).send(JSON.stringify(result));
  });
};

export default articleRoutes;
