import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import type { FastifyInstance } from "fastify";
import type { Accounts } from "../../vendor/ward/ward-auth.js";
import { buildApp } from "../app.js";
import { loadConfig } from "../config.js";
import { openAccounts } from "../db/accounts.js";
import { SESSION_COOKIE } from "../plugins/auth.js";

export interface TestAppOptions {
  /** Settings on top of the test's own data folder, as the environment would give them. */
  env?: NodeJS.ProcessEnv;
  /** Routes a test adds before the app is ready (none can be added after). */
  extend?: (app: FastifyInstance) => void;
  /** Ward's `fetch`, when the env turns Sign in with Ward on: the test answers Ward itself. */
  wardFetch?: typeof fetch;
}

/** A test's app, and the accounts its routes use. */
export interface TestApp {
  app: FastifyInstance;
  accounts: Accounts;
}

/**
 * The whole app for one test, on a fresh temporary `GATEHOUSE_DATA_DIR`, never listening. Close it after the test: that
 * closes the database and deletes the folder.
 *
 *     const { app } = await buildTestApp();
 *     const res = await app.inject({ method: "GET", url: "/gatehouse-api/v1/health" });
 *     await app.close();
 */
export async function buildTestApp(options: TestAppOptions = {}): Promise<TestApp> {
  const dataDir = await mkdtemp(join(tmpdir(), "gatehouse-test-"));
  const database = openAccounts(dataDir);
  let app: FastifyInstance;
  try {
    app = await buildApp(loadConfig({ GATEHOUSE_DATA_DIR: dataDir, ...options.env }), {
      accounts: database,
      ...(options.wardFetch && { wardFetch: options.wardFetch }),
    });
  } catch (error) {
    // The app never got to close the database or the folder.
    database.close();
    await rm(dataDir, { recursive: true, force: true });
    throw error;
  }
  options.extend?.(app);
  app.addHook("onClose", async () => {
    await rm(dataDir, { recursive: true, force: true });
  });
  return { app, accounts: database.accounts };
}

/**
 * A user with `role` and no password, as a first Sign in with Ward makes one, and a live session for them, as the
 * `cookie` header that carries it. The session is a local one, so no request asks Ward about it.
 */
export async function sessionCookie(accounts: Accounts, role: string, username = `user-${role}`): Promise<string> {
  const user = await accounts.createUser({ username, role });
  const { token } = await accounts.startSession(user.id);
  return `${SESSION_COOKIE}=${token}`;
}
