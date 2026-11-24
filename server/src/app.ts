import { serializerCompiler, validatorCompiler } from "@fastify/type-provider-zod";
import Fastify, { type FastifyInstance, type FastifyServerOptions } from "fastify";
import type { Config } from "./config.js";
import { openAccounts, type AccountsDb } from "./db/accounts.js";
import { healthRoutes } from "./features/health/index.js";
import { ownerCardRoutes } from "./features/owner-cards/index.js";
import { stripPrefix } from "./lib/url.js";
import { auth } from "./plugins/auth.js";
import { errors } from "./plugins/errors.js";

/** Fastify's options that belong to the process. server.ts sets them; a test leaves them out. */
type ServerOptions = Pick<
  FastifyServerOptions,
  "logger" | "trustProxy" | "connectionTimeout" | "requestTimeout" | "keepAliveTimeout"
>;

export interface BuildAppOptions {
  server?: ServerOptions;
  /**
   * The accounts' database. By default the app opens it in `config.dataDir`. Either way the app closes it when it
   * closes; a test passes one it opened, to mint sessions in it.
   */
  accounts?: AccountsDb;
  /** Ward's `fetch`, for a test that answers Ward itself. */
  wardFetch?: typeof fetch;
}

/**
 * The Gatehouse API, ready and not listening. Every route sits under `/v1`: `GET /v1/health` is open to anyone, and
 * `GET /v1/owner/cards` answers the owner only. Sign in with Ward's routes sit under `/auth`.
 *
 * The browser reaches the API under `config.apiPrefix` (`/gatehouse-api`). Caddy strips that prefix in production and
 * the dev page's proxy doesn't, so the API strips it too, before routing: one build answers both ways.
 *
 * It registers in a fixed order: the zod compilers, the app's own plugins (the error handler, then the session
 * guard, so every route after it is behind it), then the features.
 */
export async function buildApp(config: Config, options: BuildAppOptions = {}): Promise<FastifyInstance> {
  const database = options.accounts ?? openAccounts(config.dataDir);
  const app = Fastify({
    ...options.server,
    rewriteUrl: (request) => stripPrefix(request.url ?? "/", config.apiPrefix),
  });
  app.addHook("onClose", async () => {
    database.close();
  });
  // Zod checks every request and encodes every reply, in every plugin registered below.
  app.setValidatorCompiler(validatorCompiler);
  app.setSerializerCompiler(serializerCompiler);

  // The app's own plugins, fastify-plugin wrapped so they reach every feature. The error handler comes first.
  await app.register(errors);
  const ward = config.ward && options.wardFetch ? { ...config.ward, fetch: options.wardFetch } : config.ward;
  await app.register(auth, {
    accounts: database.accounts,
    ward,
    publicOrigin: config.publicOrigin,
    apiPrefix: config.apiPrefix,
    trustedProxies: config.trustedProxies,
  });

  // The features, each encapsulated: its hooks stay inside it.
  await app.register(healthRoutes);
  await app.register(ownerCardRoutes, { cardsFile: config.cardsFile, publicOrigin: config.publicOrigin });

  return app;
}
