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

  it("create new detail (markdown file) for user", async () => {
    const request = supertest(app.server);
    const payload = {
      markdownText: "## Hello World!",
      sortValue: 1,
    };
    const response = await request
      .post(
        `/api/users/${process.env.TEST_USER_ID}/articles/${process.env.TEST_ARTICLE_ID_WITH_DETAILS}`
      )
      .send(payload)
      .set("Content-Type", "application/json")
      .set("Authorization", `Bearer ${process.env.JWT_CREDENTIAL_TEST}`)
      .set("Accept", "application/json");
    expect(response.statusCode).toBe(200);
  });

  it("delete a detail", async () => {
    const request = supertest(app.server);
    const response = await request
      .delete(
        `/api/users/${process.env.TEST_USER_ID}/details/${process.env.TEST_DETAIL_ID}`
      )
      .set("Authorization", `Bearer ${process.env.JWT_CREDENTIAL_TEST}`);
    expect(response.statusCode).toBe(200);
  });

  it("sort details", async () => {
    const request = supertest(app.server);
    const payload = {
      sortValue: 1,
    };
    const response = await request
      .put(
        `/api/users/${process.env.TEST_USER_ID}/articles/${process.env.TEST_ARTICLE_ID}/detail-sort`
      )
      .send(payload)
      .set("Content-Type", "application/json")
      .set("Authorization", `Bearer ${process.env.JWT_CREDENTIAL_TEST}`)
      .set("Accept", "application/json");
    expect(response.statusCode).toBe(200);
  });

  it("update detail", async () => {
    const request = supertest(app.server);
    const payload = {
      changeValue: "hello world!",
      property: "markdown",
      sortValue: 1,
    };
    const response = await request
      .put(
        `/api/users/${process.env.TEST_USER_ID}/articles/${process.env.TEST_ARTICLE_ID_WITH_DETAILS}/details/${process.env.TEST_DETAIL_ID}`
      )
      .send(payload)
      .set("Content-Type", "application/json")
      .set("Authorization", `Bearer ${process.env.JWT_CREDENTIAL_TEST}`)
      .set("Accept", "application/json");
    expect(response.statusCode).toBe(400);
  });
});
