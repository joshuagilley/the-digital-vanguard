import { describe, it, expect, afterAll, beforeAll } from "vitest";
import supertest from "supertest";
import createServer from "../../server";
import { FastifyInstance } from "fastify";
import { Server } from "http";

describe("Server startup", async () => {
  let app: FastifyInstance<Server>;

  beforeAll(async () => {
    app = await createServer();
    await app.listen();
  });

  afterAll(async () => {
    await app.close(); // Ensure the server is closed after tests
  });

  it("authenticate login", async () => {
    const request = supertest(app.server);
    const response = await request
      .get(`/api/auth/${process.env.TEST_USER_ID}`)
      .set("Authorization", `Bearer ${process.env.JWT_CREDENTIAL_TEST}`);
    expect(response.statusCode).toBe(200);
  });

  it("new user", async () => {
    const request = supertest(app.server);
    const response = await request
      .get(`/api/newuser`)
      .set("Authorization", `Bearer ${process.env.JWT_CREDENTIAL_TEST}`);
    expect(response.statusCode).toBe(200);
  });

  it("get all users route", async () => {
    const request = supertest(app.server);
    const response = await request.get("/api/users");
    expect(response.statusCode).toBe(200);
  });
});
