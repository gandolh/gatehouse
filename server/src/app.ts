import { serializerCompiler, validatorCompiler } from "@fastify/type-provider-zod";
import Fastify, { type FastifyInstance, type FastifyServerOptions } from "fastify";
import type { Config } from "./config.js";
import { healthRoutes } from "./features/health/index.js";
import { stripPrefix } from "./lib/url.js";
import { errors } from "./plugins/errors.js";

/** Fastify's options that belong to the process. server.ts sets them; a test leaves them out. */
type ServerOptions = Pick<
  FastifyServerOptions,
  "logger" | "trustProxy" | "connectionTimeout" | "requestTimeout" | "keepAliveTimeout"
>;

export interface BuildAppOptions {
  server?: ServerOptions;
}

/**
 * The Gatehouse API, ready and not listening. Every route sits under `/v1`; `GET /v1/health` is open to anyone.
 *
 * The browser reaches the API under `config.apiPrefix` (`/gatehouse-api`). Caddy strips that prefix in production and
 * the dev page's proxy doesn't, so the API strips it too, before routing: one build answers both ways.
 *
 * It registers in a fixed order: the zod compilers, the app's own plugins, then the features.
 */
export async function buildApp(config: Config, options: BuildAppOptions = {}): Promise<FastifyInstance> {
  const app = Fastify({
    ...options.server,
    rewriteUrl: (request) => stripPrefix(request.url ?? "/", config.apiPrefix),
  });
  // Zod checks every request and encodes every reply, in every plugin registered below.
  app.setValidatorCompiler(validatorCompiler);
  app.setSerializerCompiler(serializerCompiler);

  // The app's own plugins, fastify-plugin wrapped so they reach every feature. The error handler comes first.
  await app.register(errors);

  // The features, each encapsulated: its hooks stay inside it.
  await app.register(healthRoutes);

  return app;
}
