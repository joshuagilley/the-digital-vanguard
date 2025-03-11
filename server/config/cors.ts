import { FastifyInstance } from "fastify";
import { Server } from "http";

const handleCors = (fastify: FastifyInstance<Server>) => {
  fastify.addHook("onRequest", async (request, reply) => {
    reply.header("Access-Control-Allow-Origin", "*");
    reply.header("Access-Control-Allow-Credentials", true);
    reply.header(
      "Access-Control-Allow-Headers",
      "Authorization, Origin, X-Requested-With, Content-Type, Accept, X-Slug, X-UID"
    );
    reply.header("X-Frame-Options", "DENY");
    reply.header(
      "Access-Control-Allow-Methods",
      "OPTIONS, POST, PUT, PATCH, GET, DELETE"
    );
    reply.header(
      "Content-Security-Policy",
      "default-src 'self'; script-src 'self'; style-src 'self'"
    );
    if (request.method === "OPTIONS") {
      reply.send();
    }
  });
};

export default handleCors;
