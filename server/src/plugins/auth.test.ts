import { generateKeyPairSync } from "node:crypto";
import type { FastifyInstance } from "fastify";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { createWardIdentities, type Accounts } from "../../vendor/ward/ward-auth.js";
import { buildTestApp, sessionCookie } from "../testing/buildTestApp.js";
import { keepWardRole, OWNER_ROLE, SESSION_COOKIE } from "./auth.js";

const ISSUER = "https://ward.example.com/ward-api/oidc";
const ORIGIN = "http://localhost:5182";
const CALLBACK = `${ORIGIN}/gatehouse-api/auth/ward/callback`;

/** A client key Ward would have issued: an Ed25519 private JWK, base64url. */
function clientKey(): string {
  const jwk = { ...generateKeyPairSync("ed25519").privateKey.export({ format: "jwk" }), kid: "test-key" };
  return Buffer.from(JSON.stringify(jwk)).toString("base64url");
}

/** Ward's discovery document, the only thing a sign-in start asks of Ward. */
const fakeWard: typeof fetch = (input) => {
  const url = String(input instanceof Request ? input.url : input);
  if (!url.endsWith("/.well-known/openid-configuration")) return Promise.resolve(new Response("{}", { status: 404 }));
  return Promise.resolve(
    Response.json({
      issuer: ISSUER,
      authorization_endpoint: `${ISSUER}/auth`,
      token_endpoint: `${ISSUER}/token`,
      jwks_uri: `${ISSUER}/jwks`,
      id_token_signing_alg_values_supported: ["EdDSA"],
    }),
  );
};

let app: FastifyInstance;
let accounts: Accounts;

beforeEach(async () => {
  ({ app, accounts } = await buildTestApp({
    env: {
      PUBLIC_ORIGIN: ORIGIN,
      WARD_OIDC_ISSUER: ISSUER,
      WARD_OIDC_CLIENT_ID: "gatehouse",
      WARD_OIDC_CLIENT_KEY: clientKey(),
      WARD_OIDC_REDIRECT_URI: CALLBACK,
      WARD_OIDC_POST_LOGOUT_REDIRECT_URI: `${ORIGIN}/`,
    },
    wardFetch: fakeWard,
  }));
});
afterEach(async () => {
  await app.close();
});

/** A first Sign in with Ward for a grant with `role`, through the library's own path, and a session for that user. */
async function signedInThroughWard(role: string, subject: string): Promise<string> {
  const identities = createWardIdentities({ accounts });
  const { user, created } = await identities.userForSignIn(
    { subject, username: "someone", role, wardSid: `sid-${subject}`, idToken: "unused" },
    keepWardRole,
  );
  expect(created).toBe(true);
  expect(user.role).toBe(role);
  expect(user.hasPassword).toBe(false);
  const { token } = await accounts.startSession(user.id);
  return `${SESSION_COOKIE}=${token}`;
}

describe("Sign in with Ward and nothing else", () => {
  it("starts with Ward on and no user, and answers health", async () => {
    const res = await app.inject({ method: "GET", url: "/gatehouse-api/v1/health" });
    expect(res.statusCode).toBe(200);
    expect(res.json()).toEqual({ ok: true });
  });

  it("signs nobody in locally: any name fails", async () => {
    for (const username of ["owner", "admin", "gatehouse"]) {
      const res = await app.inject({
        method: "POST",
        url: "/gatehouse-api/auth/login",
        payload: { username, password: "a-password-long-enough" },
      });
      expect(res.statusCode, username).toBe(401);
      expect(res.json(), username).toEqual({ error: "invalid_credentials" });
      expect(res.headers["set-cookie"], username).toBeUndefined();
    }
  });

  it("answers the owner route 401 with no session", async () => {
    const res = await app.inject({ method: "GET", url: "/gatehouse-api/v1/owner/cards" });
    expect(res.statusCode).toBe(401);
    expect(res.json()).toEqual({ error: "unauthorized" });
  });

  it("sends the browser to Ward from a start with no body, as the page posts it", async () => {
    const res = await app.inject({ method: "POST", url: "/gatehouse-api/auth/ward/start" });
    expect(res.statusCode).toBe(200);
    const { url } = res.json<{ url: string }>();
    const target = new URL(url);
    expect(`${target.origin}${target.pathname}`).toBe(`${ISSUER}/auth`);
    expect(target.searchParams.get("client_id")).toBe("gatehouse");
    expect(target.searchParams.get("redirect_uri")).toBe(CALLBACK);
  });

  it("has no registration and no rename, even for a signed-in user", async () => {
    const cookie = await sessionCookie(accounts, OWNER_ROLE);
    for (const url of ["/gatehouse-api/auth/register", "/gatehouse-api/auth/username"]) {
      const res = await app.inject({ method: "POST", url, headers: { cookie }, payload: { username: "x" } });
      expect(res.statusCode, url).toBe(404);
    }
  });

  it("keeps Ward's grant role on a first sign-in: admin reads the owner's cards, another role doesn't", async () => {
    const owner = await signedInThroughWard(OWNER_ROLE, "subject-owner");
    const ownerRes = await app.inject({
      method: "GET",
      url: "/gatehouse-api/v1/owner/cards",
      headers: { cookie: owner },
    });
    expect(ownerRes.statusCode).toBe(200);

    const member = await signedInThroughWard("member", "subject-member");
    const memberRes = await app.inject({
      method: "GET",
      url: "/gatehouse-api/v1/owner/cards",
      headers: { cookie: member },
    });
    expect(memberRes.statusCode).toBe(403);
    expect(memberRes.json()).toEqual({ error: "forbidden" });
  });

  it("signs out with no body: 204, and the session is over", async () => {
    const cookie = await sessionCookie(accounts, OWNER_ROLE);
    const out = await app.inject({ method: "POST", url: "/gatehouse-api/auth/logout", headers: { cookie } });
    expect(out.statusCode).toBe(204);
    const cleared = String(out.headers["set-cookie"]);
    expect(cleared).toContain(`${SESSION_COOKIE}=;`);
    expect(cleared).toContain("Path=/gatehouse-api;");
    const after = await app.inject({ method: "GET", url: "/gatehouse-api/v1/owner/cards", headers: { cookie } });
    expect(after.statusCode).toBe(401);
  });

  it("refuses a POST that a browser says came from another site", async () => {
    const cookie = await sessionCookie(accounts, OWNER_ROLE);
    for (const url of ["/gatehouse-api/auth/ward/start", "/gatehouse-api/auth/logout"]) {
      for (const headers of [{ origin: "https://elsewhere.example" }, { "sec-fetch-site": "cross-site" }]) {
        const res = await app.inject({ method: "POST", url, headers: { ...headers, cookie } });
        expect(res.statusCode, `${url} ${JSON.stringify(headers)}`).toBe(403);
        expect(res.json()).toEqual({ error: "cross_site" });
      }
    }
    // The refused logout ended nothing.
    const still = await app.inject({ method: "GET", url: "/gatehouse-api/v1/owner/cards", headers: { cookie } });
    expect(still.statusCode).toBe(200);
  });

  it("keeps the sign-in's flow cookie to the callback's path", async () => {
    const start = await app.inject({ method: "POST", url: "/gatehouse-api/auth/ward/start" });
    const flow = String(start.headers["set-cookie"]);
    expect(flow).toContain(`${SESSION_COOKIE}_ward=`);
    expect(flow).toContain("Path=/gatehouse-api/auth/ward/callback");
    expect(flow).toContain("HttpOnly");
  });
});
