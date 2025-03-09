// import { describe, it, expect } from "vitest";
// import request from "supertest";
// import createServer from "../../server";

// describe("GET /users", () => {
//   it("should return a list of users", async () => {
//     const app = await createServer();
//     await app.listen({ port: 8081 });
//     const response = await request(app.server)
//       .get("/api/users")
//       .expect(200)
//       .expect("Content-Type", /json/);
//     expect(response.body).toHaveLength(2);
//   });
// });
