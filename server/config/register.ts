import { FastifyInstance } from "fastify";
import { Server } from "http";
import articleRoutes from "routes/articles";
import pgConnector from "config/postgres";

const fastifyRegister = (fastify: FastifyInstance<Server>) => {
  fastify.register(pgConnector);
  fastify.register(articleRoutes);
};

export default fastifyRegister;
