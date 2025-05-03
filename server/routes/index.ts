import { FastifyInstance } from "fastify";
import articlesRoutes from "./articles/articles.routes";
import userRoutes from "./users/users.routes";
import utilsRoutes from "./utils/utils.routes";
import detailRoutes from "./details/details.routes";

const registerRoutes = async (fastify: FastifyInstance) => {
  await fastify.register(articlesRoutes);
  await fastify.register(userRoutes);
  await fastify.register(utilsRoutes);
  await fastify.register(detailRoutes);
};

export default registerRoutes;
