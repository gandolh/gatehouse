import { existsSync } from "node:fs";
import { isAbsolute, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { z } from "zod";
import { parseTrustedProxies, wardClientOptionsFromEnv, type WardClientOptions } from "../vendor/ward/ward-auth.js";

/** The repo root. `src/` (tsx) and `dist/` (built) sit at the same depth under `server/`, so this holds for both. */
const REPO_ROOT = fileURLToPath(new URL("../../", import.meta.url));

/** The repo's `.env`, found from this file, never from the working directory. */
const ENV_FILE = resolve(REPO_ROOT, ".env");

/** Where Ward's library mounts its routes, as Fastify sees them; the browser reaches them under the API prefix. */
export const AUTH_ROUTE_PREFIX = "/auth";

/** The Ward callback under the API prefix: `WARD_OIDC_REDIRECT_URI` is the page's origin, the prefix, then this. */
const WARD_CALLBACK_PATH = `${AUTH_ROUTE_PREFIX}/ward/callback`;

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
  /**
   * `GATEHOUSE_CARDS_FILE`, absolute (a relative value is taken from the repo root): the card list the owner route reads
   * once at start. Default `content/cards.json` at the repo root, which is `/app/content/cards.json` in the image.
   */
  cardsFile: string;
  /**
   * Sign in with Ward, from the five `WARD_OIDC_*` variables, or undefined while `WARD_OIDC_ISSUER` is empty. Gatehouse
   * has no local accounts, so without it nobody can sign in. `clientKey` is a secret: never log it.
   */
  ward: WardClientOptions | undefined;
  /** `AUTH_TRUSTED_PROXIES`: peers besides loopback whose `X-Forwarded-For` the sign-in lockout believes. */
  trustedProxies: string[];
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
  GATEHOUSE_CARDS_FILE: z.preprocess(unset, z.string().trim().default("content/cards.json")),
  AUTH_TRUSTED_PROXIES: z.preprocess(
    unset,
    z
      .string()
      .refine(isProxyList, {
        error: "AUTH_TRUSTED_PROXIES must be addresses or CIDR ranges, comma-separated, with no /0 among them.",
      })
      .optional(),
  ),
});

/** Whether the library takes `value` as its trusted proxies: each entry an address or a CIDR range, and no `/0`. */
function isProxyList(value: string): boolean {
  try {
    parseTrustedProxies(value);
    return true;
  } catch {
    return false;
  }
}

/** `AUTH_TRUSTED_PROXIES` as a list, blanks dropped. */
function proxyList(value: string | undefined): string[] {
  return (value ?? "")
    .split(",")
    .map((entry) => entry.trim())
    .filter((entry) => entry !== "");
}

/** A path from the environment, absolute; a relative one is taken from the repo root. */
function fromRoot(path: string): string {
  return isAbsolute(path) ? path : resolve(REPO_ROOT, path);
}

/**
 * Sign in with Ward's settings, read by the library's own reader so its rules hold (an empty `WARD_OIDC_ISSUER` means
 * off; with it set, the client id, the key and the redirect URI must be set too). On top: the redirect URI must be the
 * callback as the browser reaches it, on the page's origin and under the API prefix, where the session cookie lives.
 * The messages name variables, never a value.
 */
function wardSettings(
  env: NodeJS.ProcessEnv,
  where: { publicOrigin: string; apiPrefix: string } | undefined,
  problems: string[],
): WardClientOptions | undefined {
  let ward: WardClientOptions | undefined;
  try {
    ward = wardClientOptionsFromEnv(env);
  } catch (error) {
    problems.push(
      `${error instanceof Error ? error.message : String(error)}. Set all of them, or leave WARD_OIDC_ISSUER empty to run without Sign in with Ward.`,
    );
    return undefined;
  }
  if (ward === undefined || where === undefined) return ward;
  const callback = `${where.publicOrigin}${where.apiPrefix}${WARD_CALLBACK_PATH}`;
  if (ward.redirectUri !== callback) {
    problems.push(
      `WARD_OIDC_REDIRECT_URI must be the callback as the browser reaches it: PUBLIC_ORIGIN, then ${where.apiPrefix}${WARD_CALLBACK_PATH}.`,
    );
  }
  return ward;
}

/** One line per problem, starting with the variable's name. Never the value. */
function describeIssue(issue: z.core.$ZodIssue): string {
  const key = String(issue.path[0] ?? "");
  return issue.message.startsWith(key) ? issue.message : `${key}: ${issue.message}`;
}

/** The settings from `env`, or a `ConfigError` naming every variable that is wrong. Tests pass their own `env`. */
export function loadConfig(env: NodeJS.ProcessEnv = process.env): Config {
  const problems: string[] = [];
  const parsed = envSchema.safeParse(env);
  if (!parsed.success) problems.push(...parsed.error.issues.map(describeIssue));
  const where = parsed.success
    ? { publicOrigin: parsed.data.PUBLIC_ORIGIN, apiPrefix: parsed.data.GATEHOUSE_API_PREFIX }
    : undefined;
  const ward = wardSettings(env, where, problems);
  if (!parsed.success || problems.length > 0) throw new ConfigError(problems.join("\n"));
  const values = parsed.data;
  return {
    host: values.HOST,
    port: values.PORT,
    publicOrigin: values.PUBLIC_ORIGIN,
    apiPrefix: values.GATEHOUSE_API_PREFIX,
    dataDir: fromRoot(values.GATEHOUSE_DATA_DIR),
    cardsFile: fromRoot(values.GATEHOUSE_CARDS_FILE),
    ward,
    trustedProxies: proxyList(values.AUTH_TRUSTED_PROXIES),
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
