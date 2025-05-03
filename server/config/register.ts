import { FastifyInstance } from "fastify";
import { Server } from "http";
import pgConnector from "config/postgres";
import registerRoutes from "../routes";

const fastifyRegister = (fastify: FastifyInstance<Server>) => {
  fastify.register(pgConnector);
  fastify.register(registerRoutes);
};

export default fastifyRegister;
