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

  it("get all markdown associated with article", async () => {
    const request = supertest(app.server);
    const response = await request.get(
      `/api/get-markdown/${process.env.TEST_ARTICLE_ID_WITH_DETAILS}`
    );
    expect(response.statusCode).toBe(200);
  });

  it("get dynamic tags for specific article", async () => {
    const request = supertest(app.server);
    const response = await request.get(
      `/api/articles/${process.env.TEST_ARTICLE_ID}/tags`
    );
    expect(response.statusCode).toBe(200);
  });

  it("generate new dynamic tags", async () => {
    const request = supertest(app.server);
    const payload = {
      tags: ["test"],
      tagId: process.env.TEST_TAG_ID,
    };
    const response = await request
      .post(
        `/api/users/${process.env.TEST_USER_ID}/articles/${process.env.TEST_ARTICLE_ID}/generate-dynamic-tags`
      )
      .send(payload)
      .set("Content-Type", "application/json")
      .set("Authorization", `Bearer ${process.env.JWT_CREDENTIAL_TEST}`)
      .set("Accept", "application/json");
    expect(response.statusCode).toBe(200);
  });
});
