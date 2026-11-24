import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import type { FastifyInstance } from "fastify";
import { buildApp } from "../app.js";
import { loadConfig } from "../config.js";

export interface TestAppOptions {
  /** Settings on top of the test's own data folder, as the environment would give them. */
  env?: NodeJS.ProcessEnv;
  /** Routes a test adds before the app is ready (none can be added after). */
  extend?: (app: FastifyInstance) => void;
}

/**
 * The whole app for one test, on a fresh temporary `GATEHOUSE_DATA_DIR`, never listening. Close it after the test: that
 * deletes the folder.
 *
 *     const app = await buildTestApp();
 *     const res = await app.inject({ method: "GET", url: "/gatehouse-api/v1/health" });
 *     await app.close();
 */
export async function buildTestApp(options: TestAppOptions = {}): Promise<FastifyInstance> {
  const dataDir = await mkdtemp(join(tmpdir(), "gatehouse-test-"));
  const app = await buildApp(loadConfig({ GATEHOUSE_DATA_DIR: dataDir, ...options.env }));
  options.extend?.(app);
  app.addHook("onClose", async () => {
    await rm(dataDir, { recursive: true, force: true });
  });
  return app;
}
