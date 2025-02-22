import Fastify from "fastify";
import dotenv from "dotenv";
import handleCors from "./config/cors";
import fastifyRegister from "./config/register";

const fastify = Fastify({ logger: true });
dotenv.config();
handleCors(fastify);
fastifyRegister(fastify);

const start = async () => {
  try {
    await fastify.listen({ port: Number(process.env.PORT) });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
