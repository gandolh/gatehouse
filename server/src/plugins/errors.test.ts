import type { ZodTypeProvider } from "@fastify/type-provider-zod";
import type { FastifyInstance } from "fastify";
import { afterEach, describe, expect, it } from "vitest";
import { z } from "zod";
import { ApiError } from "../lib/api-error.js";
import { buildTestApp } from "../testing/buildTestApp.js";

/** Routes that fail each way the error handler tells apart, added to the real app. */
function failingRoutes(built: FastifyInstance): void {
  const app = built.withTypeProvider<ZodTypeProvider>();
  app.get(
    "/v1/test/look",
    { schema: { querystring: z.object({ look: z.enum(["profile", "terminal"]) }), response: { 200: z.object({}) } } },
    () => ({}),
  );
  app.get("/v1/test/wrong-shape", { schema: { response: { 200: z.object({ ok: z.literal(true) }) } } }, () =>
    // A reply that breaks its own schema, as a handler bug would.
    JSON.parse('{ "nope": 1 }'),
  );
  app.get("/v1/test/forbidden", { schema: { response: { 200: z.object({}) } } }, () => {
    throw new ApiError("forbidden", "Only the owner sees these.");
  });
  app.get("/v1/test/crash", { schema: { response: { 200: z.object({}) } } }, () => {
    throw new Error("a secret detail");
  });
  app.post(
    "/v1/test/echo",
    { schema: { body: z.object({ name: z.string() }), response: { 200: z.object({}) } } },
    () => ({}),
  );
}

let app: FastifyInstance;
afterEach(async () => {
  await app.close();
});

describe("the error plugin", () => {
  it("answers a request that fails its schema with 400 and every issue", async () => {
    app = await buildTestApp({ extend: failingRoutes });
    const res = await app.inject({ method: "GET", url: "/gatehouse-api/v1/test/look?look=neon" });
    expect(res.statusCode).toBe(400);
    expect(res.json()).toMatchObject({ error: "validation", issues: [{ path: "querystring/look" }] });
  });

  it("answers a reply that breaks its schema with a 500 and no detail", async () => {
    app = await buildTestApp({ extend: failingRoutes });
    const res = await app.inject({ method: "GET", url: "/v1/test/wrong-shape" });
    expect(res.statusCode).toBe(500);
    expect(res.json()).toEqual({ error: "internal", message: "Gatehouse's API hit an error; its log says why." });
  });

  it("answers an ApiError with its code's status and its message", async () => {
    app = await buildTestApp({ extend: failingRoutes });
    const res = await app.inject({ method: "GET", url: "/v1/test/forbidden" });
    expect(res.statusCode).toBe(403);
    expect(res.json()).toEqual({ error: "forbidden", message: "Only the owner sees these." });
  });

  it("keeps a thrown message out of a 500", async () => {
    app = await buildTestApp({ extend: failingRoutes });
    const res = await app.inject({ method: "GET", url: "/v1/test/crash" });
    expect(res.statusCode).toBe(500);
    expect(res.body).not.toContain("secret");
  });

  it("keeps Fastify's 400 for a body that isn't JSON, without quoting the body", async () => {
    app = await buildTestApp({ extend: failingRoutes });
    const res = await app.inject({
      method: "POST",
      url: "/v1/test/echo",
      headers: { "content-type": "application/json" },
      payload: "{ secret",
    });
    expect(res.statusCode).toBe(400);
    expect(res.json()).toMatchObject({ error: "bad_request" });
    expect(res.body).not.toContain("secret");
  });

  it("answers an unknown route with the same body", async () => {
    app = await buildTestApp();
    const res = await app.inject({ method: "GET", url: "/gatehouse-api/v1/nothing" });
    expect(res.statusCode).toBe(404);
    expect(res.json()).toEqual({ error: "not_found", message: "There is no route GET /v1/nothing." });
  });
});
