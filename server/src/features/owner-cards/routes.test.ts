import { fileURLToPath } from "node:url";
import { ownerCards, ownerCardsSchema, publicCards } from "@gatehouse/shared";
import { loadCards } from "@gatehouse/shared/load";
import type { FastifyInstance } from "fastify";
import { afterEach, describe, expect, it } from "vitest";
import type { Accounts } from "../../../vendor/ward/ward-auth.js";
import { OWNER_ROLE } from "../../plugins/auth.js";
import { buildTestApp, sessionCookie } from "../../testing/buildTestApp.js";

/** The card list the route reads by default, found from this file. */
const CARD_LIST = loadCards(fileURLToPath(new URL("../../../../content/cards.json", import.meta.url)));
const URL_PATH = "/gatehouse-api/v1/owner/cards";

/** The apps the tests opened, closed after each test. */
const opened: FastifyInstance[] = [];
afterEach(async () => {
  for (const app of opened.splice(0)) await app.close();
});

async function build(env: NodeJS.ProcessEnv = {}): Promise<{ app: FastifyInstance; accounts: Accounts }> {
  const built = await buildTestApp({ env: { PUBLIC_ORIGIN: "https://example.org", ...env } });
  opened.push(built.app);
  return built;
}

describe("GET /v1/owner/cards", () => {
  it("answers 401 with no session, and with a session that doesn't exist", async () => {
    const { app } = await build();
    for (const headers of [{}, { cookie: "gatehouse_session=not-a-session" }]) {
      const res = await app.inject({ method: "GET", url: URL_PATH, headers });
      expect(res.statusCode).toBe(401);
      expect(res.json()).toEqual({ error: "unauthorized" });
    }
  });

  it("answers 403 to a signed-in user without the owner's role", async () => {
    const { app, accounts } = await build();
    const cookie = await sessionCookie(accounts, "member");
    const res = await app.inject({ method: "GET", url: URL_PATH, headers: { cookie } });
    expect(res.statusCode).toBe(403);
    expect(res.json()).toEqual({ error: "forbidden" });
  });

  it("answers the owner the three owner cards, links resolved against PUBLIC_ORIGIN, and no public card", async () => {
    const { app, accounts } = await build();
    const cookie = await sessionCookie(accounts, OWNER_ROLE);
    // Bare, as Caddy passes it, and under the prefix, as the dev proxy does.
    for (const url of [URL_PATH, "/v1/owner/cards"]) {
      const res = await app.inject({ method: "GET", url, headers: { cookie } });
      expect(res.statusCode, url).toBe(200);
      expect(res.headers["cache-control"], url).toBe("no-store");
      const body = ownerCardsSchema.parse(res.json());
      expect(body.cards.map((card) => card.id)).toEqual(["brief-board", "vault", "mail"]);
      expect(body.cards.map((card) => card.id)).toEqual(ownerCards(CARD_LIST).map((card) => card.id));

      const byId = new Map(body.cards.map((card) => [card.id, card]));
      expect(byId.get("vault")).toMatchObject({
        href: "https://vault.example.org/",
        address: "vault.",
        ownAddress: true,
      });
      expect(byId.get("mail")).toMatchObject({ href: "https://mail.example.org/", address: "mail.", ownAddress: true });
      expect(byId.get("brief-board")).toMatchObject({ href: "/brief-board/", ownAddress: false });
      for (const card of body.cards) expect(card.image).toBeNull();

      const publicIds = new Set(publicCards(CARD_LIST).flatMap((section) => section.cards.map((card) => card.id)));
      for (const card of body.cards) expect(publicIds.has(card.id), card.id).toBe(false);
    }
  });

  it("resolves the host links against whatever PUBLIC_ORIGIN says", async () => {
    const { app, accounts } = await build({ PUBLIC_ORIGIN: "https://elsewhere.example.net" });
    const cookie = await sessionCookie(accounts, OWNER_ROLE);
    const res = await app.inject({ method: "GET", url: URL_PATH, headers: { cookie } });
    const hrefs = ownerCardsSchema.parse(res.json()).cards.map((card) => card.href);
    expect(hrefs).toEqual([
      "/brief-board/",
      "https://vault.elsewhere.example.net/",
      "https://mail.elsewhere.example.net/",
    ]);
  });

  it("sends only the fields the schema names", async () => {
    const { app, accounts } = await build();
    const cookie = await sessionCookie(accounts, OWNER_ROLE);
    const res = await app.inject({ method: "GET", url: URL_PATH, headers: { cookie } });
    const [card] = res.json<{ cards: Record<string, unknown>[] }>().cards;
    expect(Object.keys(card ?? {}).sort()).toEqual(
      ["access", "address", "blurb", "docs", "href", "id", "image", "more", "name", "ownAddress", "source"].sort(),
    );
  });
});

describe("the card list", () => {
  it("stops the start when it can't be read", async () => {
    await expect(buildTestApp({ env: { GATEHOUSE_CARDS_FILE: "content/missing.json" } })).rejects.toThrow(/missing/);
  });
});
