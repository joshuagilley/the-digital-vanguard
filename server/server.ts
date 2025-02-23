import Fastify from "fastify";
import dotenv from "dotenv";
import handleCors from "config/cors";
import fastifyRegister from "config/register";

export async function createServer() {
  const fastify = Fastify({ logger: true });
  dotenv.config();
  handleCors(fastify);
  fastifyRegister(fastify);
  return fastify;
}

export const start = async () => {
  const server = await createServer();
  try {
    await server.listen({ port: Number(process.env.PORT) });
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

if (require.main === module) {
  start();
}

export default createServer;
