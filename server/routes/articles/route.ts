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
    let collection = users.collection("articles");
    let query = { user_id: id };
    let result = await collection.findOne(query);
    if (!result) reply.code(404).send({ error: "Not found" });
    else reply.code(200).send(JSON.stringify(result));
  });
};

export default articleRoutes;
