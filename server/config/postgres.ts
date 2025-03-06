import fastifyPlugin from "fastify-plugin";
import fastifyPg from "@fastify/postgres";
import { FastifyInstance } from "fastify";
import { Server } from "http";

const pgConnector = async (fastify: FastifyInstance<Server>) => {
  fastify.register(fastifyPg, {
    connectionString: process.env.POSTGRES_CONNECTION_STRING,
  });
};

export default fastifyPlugin(pgConnector);
