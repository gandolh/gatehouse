import { existsSync } from "node:fs";
import { isAbsolute, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { z } from "zod";

/** The repo root. `src/` (tsx) and `dist/` (built) sit at the same depth under `server/`, so this holds for both. */
const REPO_ROOT = fileURLToPath(new URL("../../", import.meta.url));

/** The repo's `.env`, found from this file, never from the working directory. */
const ENV_FILE = resolve(REPO_ROOT, ".env");

/** The API's settings, parsed once at start. No other file reads the environment. */
export interface Config {
  /** `HOST`, default `127.0.0.1`. A container sets `0.0.0.0`, where the proxy reaches the API over the network. */
  host: string;
  /** `PORT`, default 8815. */
  port: number;
  /** `PUBLIC_ORIGIN`: the page's origin as the browser sees it, bare. Default `http://localhost:5182`, the dev page. */
  publicOrigin: string;
  /** `GATEHOUSE_API_PREFIX`: where the browser reaches the API. Default `/gatehouse-api`. */
  apiPrefix: string;
  /** `GATEHOUSE_DATA_DIR`, absolute (a relative value is taken from the repo root). Default `data/` at the repo root. */
  dataDir: string;
}

/** The environment can't run the API. The message names every variable at fault, never a value. */
export class ConfigError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ConfigError";
  }
}

/** `KEY=` copied from `.env.example` counts as unset, so the default applies rather than an empty string. */
function unset(value: unknown): unknown {
  return typeof value === "string" && value.trim() === "" ? undefined : value;
}

const envSchema = z.object({
  HOST: z.preprocess(unset, z.string().trim().default("127.0.0.1")),
  PORT: z.preprocess(
    unset,
    z.coerce
      .number<string>({ error: "PORT must be a port number (1-65535)." })
      .int({ error: "PORT must be a port number (1-65535)." })
      .min(1, { error: "PORT must be a port number (1-65535)." })
      .max(65535, { error: "PORT must be a port number (1-65535)." })
      .default(8815),
  ),
  PUBLIC_ORIGIN: z.preprocess(
    unset,
    z
      .string()
      .refine((value) => URL.canParse(value) && new URL(value).origin === value, {
        error: "PUBLIC_ORIGIN must be a bare origin such as https://example.org: no path and no trailing slash.",
      })
      .default("http://localhost:5182"),
  ),
  GATEHOUSE_API_PREFIX: z.preprocess(
    unset,
    z
      .string()
      .regex(/^\/[^\s?#]*[^/\s?#]$/, {
        error: "GATEHOUSE_API_PREFIX must be a path such as /gatehouse-api: a leading slash and no trailing slash.",
      })
      .default("/gatehouse-api"),
  ),
  GATEHOUSE_DATA_DIR: z.preprocess(unset, z.string().trim().default("data")),
});

/** One line per problem, starting with the variable's name. Never the value. */
function describeIssue(issue: z.core.$ZodIssue): string {
  const key = String(issue.path[0] ?? "");
  return issue.message.startsWith(key) ? issue.message : `${key}: ${issue.message}`;
}

/** The settings from `env`, or a `ConfigError` naming every variable that is wrong. Tests pass their own `env`. */
export function loadConfig(env: NodeJS.ProcessEnv = process.env): Config {
  const parsed = envSchema.safeParse(env);
  if (!parsed.success) throw new ConfigError(parsed.error.issues.map(describeIssue).join("\n"));
  const values = parsed.data;
  return {
    host: values.HOST,
    port: values.PORT,
    publicOrigin: values.PUBLIC_ORIGIN,
    apiPrefix: values.GATEHOUSE_API_PREFIX,
    dataDir: isAbsolute(values.GATEHOUSE_DATA_DIR)
      ? values.GATEHOUSE_DATA_DIR
      : resolve(REPO_ROOT, values.GATEHOUSE_DATA_DIR),
  };
}

/**
 * Reads the repo's `.env` into the environment when there is one, and returns its path. A variable the environment
 * already has keeps its value, so `.env` fills only what the environment leaves unset. A container has no `.env`: the
 * deploy sets its environment.
 */
export function readEnvFile(path: string = ENV_FILE): string | undefined {
  if (!existsSync(path)) return undefined;
  process.loadEnvFile(path);
  return path;
}
