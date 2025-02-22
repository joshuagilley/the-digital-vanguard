import Fastify from "fastify";
import dotenv from "dotenv";
dotenv.config();
const fastify = Fastify({ logger: true });
const uri = process.env.MONGO_DB_CONNECTION_STRING || "";
import articles from "./routes/articles/index";
import dbConnector from "./config/index";
import handleCors from "./config/cors";

handleCors(fastify);

fastify.register(dbConnector);

fastify.register(articles);

const start = async () => {
  try {
    await fastify.listen({ port: 8080 });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
