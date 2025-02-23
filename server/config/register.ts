import { FastifyInstance } from "fastify";
import { Server } from "http";
import articleRoutes from "routes/articles";
import dbConnector from "config";

const fastifyRegister = (fastify: FastifyInstance<Server>) => {
  fastify.register(dbConnector); // register mongodb db connection
  fastify.register(articleRoutes);
};

export default fastifyRegister;
