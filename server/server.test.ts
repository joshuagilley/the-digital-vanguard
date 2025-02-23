import { FastifyInstance } from "fastify";
import createServer from "./server";
import supertest from "supertest";

describe("Server tests", () => {
  let server: FastifyInstance;

  beforeAll(async () => {
    server = await createServer();
    await server.ready();
  });

  afterAll(async () => {
    await server.close();
  });

  it("will get a 404 for now, will develop further with different routes", async () => {
    const response = await supertest(server.server).get("/hello");
    expect(response.statusCode).toBe(404);
  });
});
