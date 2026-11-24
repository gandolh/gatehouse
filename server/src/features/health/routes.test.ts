import type { FastifyInstance } from "fastify";
import { afterEach, describe, expect, it } from "vitest";
import { buildTestApp } from "../../testing/buildTestApp.js";

let app: FastifyInstance;
afterEach(async () => {
  await app.close();
});

describe("GET /v1/health", () => {
  it("answers { ok: true } bare, as Caddy passes it, and under the prefix, as the dev proxy passes it", async () => {
    app = await buildTestApp();
    for (const url of ["/v1/health", "/gatehouse-api/v1/health"]) {
      const res = await app.inject({ method: "GET", url });
      expect(res.statusCode, url).toBe(200);
      expect(res.json(), url).toEqual({ ok: true });
    }
  });

  it("follows GATEHOUSE_API_PREFIX", async () => {
    app = await buildTestApp({ env: { GATEHOUSE_API_PREFIX: "/elsewhere" } });
    expect((await app.inject({ method: "GET", url: "/elsewhere/v1/health" })).statusCode).toBe(200);
    expect((await app.inject({ method: "GET", url: "/gatehouse-api/v1/health" })).statusCode).toBe(404);
  });

  it("strips the prefix only as a whole path segment", async () => {
    app = await buildTestApp();
    const res = await app.inject({ method: "GET", url: "/gatehouse-apix/v1/health" });
    expect(res.statusCode).toBe(404);
    expect(res.json()).toMatchObject({ error: "not_found" });
  });
});
