import { describe, it, expect } from "vitest";
import supertest from "supertest";
import createServer from "./server";

describe("Server startup", async () => {
  const app = await createServer();
  await app.listen({ port: 8080 });
  it("should start the server successfully", async () => {
    const request = supertest(app.server);
    const response = await request.get("/api/users");
    expect(response.statusCode).toBe(200);
  });

  it("should start the server successfully", async () => {
    const request = supertest(app.server);
    const response = await request.get(
      `/api/users/${process.env.USER_ID}/articles/${process.env.TEST_ARTICLE_ID}`
    );
    expect(response.statusCode).toBe(200);
  });

  it("should start the server successfully", async () => {
    const request = supertest(app.server);
    const response = await request.get(
      `/api/users/${process.env.USER_ID}/articles`
    );
    expect(response.statusCode).toBe(200);
  });
});
