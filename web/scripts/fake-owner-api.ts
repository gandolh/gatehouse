// A stand-in for Gatehouse's API, for drawing the owner part in development: the four routes the page calls, each
// answering as the real API will, with the scenario picked by GATEHOUSE_FAKE. It listens where the API does
// (127.0.0.1:8815), so the dev server's and the preview's proxies reach it. It never ships: nothing in src/ imports it.
//
//   GATEHOUSE_FAKE=<scenario> npm run dev:fake -w @gatehouse/web    (the fake and the dev server)
//   GATEHOUSE_FAKE=<scenario> npm run fake-api -w @gatehouse/web    (the fake alone, beside the preview)
//
// Scenarios:
//   owner      the owner route answers the owner part's cards (the default)
//   slow       the same after 4 s, as when the API is waking
//   none       the owner route answers 401: no session
//   not-owner  the owner route answers 403: a session that isn't the owner's
//   ward-down  the sign-in start answers 503 ward_unavailable
//   refused    the sign-in start sends the browser back with ?ward_error=access_denied
//
// The sign-in start sends the browser back to the page it was pressed on, where the real one goes to Ward first.
import { createServer, type IncomingMessage, type ServerResponse } from "node:http";
import { fileURLToPath } from "node:url";
import { ownerCardsAnswer } from "@gatehouse/shared";
import { loadCards } from "@gatehouse/shared/load";

const SCENARIOS = ["owner", "slow", "none", "not-owner", "ward-down", "refused"] as const;
type Scenario = (typeof SCENARIOS)[number];

const HOST = "127.0.0.1";
const PORT = 8815;
const PREFIX = "/gatehouse-api";
/** How long the `slow` scenario's owner route takes: longer than the page waits before it shows the waking note. */
const SLOW_MS = 4000;

function isScenario(value: string): value is Scenario {
  return (SCENARIOS as readonly string[]).includes(value);
}

const picked = process.env.GATEHOUSE_FAKE?.trim() || "owner";
if (!isScenario(picked)) {
  console.error(`GATEHOUSE_FAKE must be one of ${SCENARIOS.join(", ")}; it is ${picked}.`);
  process.exit(1);
}
const scenario: Scenario = picked;

// The answer the real route will give: the owner part of the one card list, links resolved against the origin the
// dev server stands in with (or GATEHOUSE_ORIGIN, as a build would).
const origin = process.env.GATEHOUSE_ORIGIN?.trim() || "https://example.org";
const list = loadCards(fileURLToPath(new URL("../../content/cards.json", import.meta.url)));
const answer = ownerCardsAnswer(list, origin);

function send(response: ServerResponse, status: number, body?: unknown): void {
  response.statusCode = status;
  response.setHeader("cache-control", "no-store");
  if (body === undefined) {
    response.end();
    return;
  }
  response.setHeader("content-type", "application/json; charset=utf-8");
  response.end(JSON.stringify(body));
}

/** The page the sign-in was pressed on, from the request's Referer: Ward's callback lands the browser back there. */
function landing(request: IncomingMessage, wardError?: string): string {
  const referer = request.headers.referer;
  const page = referer !== undefined && URL.canParse(referer) ? new URL(referer) : new URL("http://localhost:5182/");
  page.hash = "";
  if (wardError !== undefined) page.searchParams.set("ward_error", wardError);
  return page.href;
}

function ownerCards(response: ServerResponse): void {
  if (scenario === "owner") send(response, 200, answer);
  else if (scenario === "slow") setTimeout(() => send(response, 200, answer), SLOW_MS);
  else if (scenario === "not-owner") send(response, 403, { error: "forbidden" });
  else send(response, 401, { error: "unauthorized" });
}

function start(request: IncomingMessage, response: ServerResponse): void {
  if (scenario === "ward-down") send(response, 503, { error: "ward_unavailable" });
  else if (scenario === "refused") send(response, 200, { url: landing(request, "access_denied") });
  else send(response, 200, { url: landing(request) });
}

const server = createServer((request, response) => {
  const path = new URL(request.url ?? "/", "http://fake").pathname.replace(PREFIX, "");
  const route = `${request.method ?? "GET"} ${path}`;
  console.log(`${scenario}: ${route}`);
  if (route === "GET /v1/owner/cards") ownerCards(response);
  else if (route === "POST /auth/ward/start") start(request, response);
  else if (route === "POST /auth/logout") send(response, 204);
  else send(response, 404, { error: "not_found", message: `The fake API has no ${route}.` });
});

server.listen(PORT, HOST, () => {
  console.log(`The fake owner API answers on http://${HOST}:${PORT}${PREFIX}/ as "${scenario}".`);
});
