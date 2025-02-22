import fastifyPlugin from "fastify-plugin";
import fastifyMongo from "@fastify/mongodb";
import { FastifyInstance } from "fastify";
import { Server } from "http";

const dbConnector = async (fastify: FastifyInstance<Server>) => {
  fastify.register(fastifyMongo, {
    url: process.env.MONGO_DB_CONNECTION_STRING,
  });
};

export default fastifyPlugin(dbConnector);
