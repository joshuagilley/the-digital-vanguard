import { FastifyInstance } from "fastify";
import { Server } from "http";
import articleRoutes from "routes/articles";
import dbConnector from "config/db";

const fastifyRegister = (fastify: FastifyInstance<Server>) => {
  fastify.register(dbConnector);
  fastify.register(articleRoutes);
};

export default fastifyRegister;
