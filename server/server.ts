require("dotenv").config();
import Fastify from "fastify";
const server = Fastify({ logger: true });

server.addHook("onRequest", async (request, reply) => {
  reply.header("Access-Control-Allow-Origin", process.env.ALLOW_ORIGIN);
  reply.header("Access-Control-Allow-Credentials", true);
  reply.header(
    "Access-Control-Allow-Headers",
    "Authorization, Origin, X-Requested-With, Content-Type, Accept, X-Slug, X-UID"
  );
  reply.header(
    "Access-Control-Allow-Methods",
    "OPTIONS, POST, PUT, PATCH, GET, DELETE"
  );
  if (request.method === "OPTIONS") {
    reply.send();
  }
});

server.get("/api", async (request, reply) => {
  reply.send({ fruits: ["apple", "orange", "banana"] });
});

const start = async () => {
  try {
    await server.listen({ port: 8080 });
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

start();
