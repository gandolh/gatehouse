import type { FastifyPluginAsyncZod } from "@fastify/type-provider-zod";
import { z } from "zod";

/** What `GET /v1/health` answers. The page never reads it, so it lives here rather than in `shared`. */
const healthSchema = z.object({ ok: z.literal(true) });

/**
 *   GET /v1/health     open to anyone: the deploy's check and the container's health check
 */
export const healthRoutes: FastifyPluginAsyncZod = async (app) => {
  app.get("/v1/health", { schema: { response: { 200: healthSchema } } }, () => ({ ok: true as const }));
};
