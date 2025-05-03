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

  it("get all articles for user route", async () => {
    const request = supertest(app.server);
    const response = await request.get(
      `/api/users/${process.env.TEST_USER_ID}/articles`
    );
    expect(response.statusCode).toBe(200);
  });

  it("get specific article for user", async () => {
    const request = supertest(app.server);
    const response = await request.get(
      `/api/users/${process.env.TEST_USER_ID}/articles/${process.env.TEST_ARTICLE_ID_WITH_DETAILS}`
    );
    expect(response.statusCode).toBe(200);
  });

  it("create new article for user", async () => {
    const request = supertest(app.server);
    const payload = {
      articleName: "test",
      articleSummary: "test",
      articleUrl: "www.google.com",
      tag: "test",
    };
    const response = await request
      .post(`/api/users/${process.env.TEST_USER_ID}`)
      .send(payload)
      .set("Content-Type", "application/json")
      .set("Authorization", `Bearer ${process.env.JWT_CREDENTIAL_TEST}`)
      .set("Accept", "application/json");
    expect(response.statusCode).toBe(200);
  });

  it("delete an article", async () => {
    const request = supertest(app.server);
    const response = await request
      .delete(
        `/api/users/${process.env.TEST_USER_ID}/articles/${process.env.TEST_ARTICLE_ID}`
      )
      .set("Authorization", `Bearer ${process.env.JWT_CREDENTIAL_TEST}`);
    expect(response.statusCode).toBe(200);
  });

  it("update article props", async () => {
    const request = supertest(app.server);
    const payload = {
      changeText: "hello world!",
      property: "article_name",
    };
    const response = await request
      .put(
        `/api/users/${process.env.TEST_USER_ID}/articles/${process.env.TEST_ARTICLE_ID}`
      )
      .send(payload)
      .set("Content-Type", "application/json")
      .set("Authorization", `Bearer ${process.env.JWT_CREDENTIAL_TEST}`)
      .set("Accept", "application/json");
    expect(response.statusCode).toBe(200);
  });
});
