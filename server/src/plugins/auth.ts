import type { FastifyPluginAsync } from "fastify";
import fp from "fastify-plugin";
import {
  createWardClient,
  requireRole,
  wardAuth,
  type Accounts,
  type WardClientOptions,
} from "../../vendor/ward/ward-auth.js";
import { AUTH_ROUTE_PREFIX } from "../config.js";
import { isUnder, pathOf } from "../lib/url.js";

/** The session cookie's name. Unique in the estate: every app shares one origin. */
export const SESSION_COOKIE = "gatehouse_session";

/** The role the owner route needs: the one vps-deploy's setup grants the owner on Gatehouse's Ward client. */
export const OWNER_ROLE = "admin";

/** A route's `preHandler` that lets only the owner through: `403 { error: "forbidden" }` for anyone else. */
export const ownerOnly = requireRole(OWNER_ROLE);

/**
 * The role a user made by a first Sign in with Ward starts with: Ward's grant role, as it is. The owner, whom
 * vps-deploy grants `admin`, arrives as `admin`. The library calls it only when it creates the user; after that the
 * user's row is the only truth, and a changed grant at Ward never reaches it.
 */
export function keepWardRole(wardRole: string): string {
  return wardRole;
}

export interface AuthOptions {
  accounts: Accounts;
  /** Sign in with Ward, or undefined to run without it (nobody can sign in then). */
  ward: WardClientOptions | undefined;
  /** The page's origin as the browser sees it. */
  publicOrigin: string;
  /** The API prefix as the browser sees it: the session cookie's path. */
  apiPrefix: string;
  /** Peers besides loopback whose `X-Forwarded-For` the sign-in lockout believes. */
  trustedProxies: readonly string[];
}

/**
 * The session guard and the sign-in routes under `/auth`, from Ward's vendored library. Sign in with Ward is the only
 * way in: no registration (the library's default), no rename, and no seed, so no account has a password and the
 * library's local sign-in finds nobody.
 *
 * The guard covers everything under `/v1` and `/auth` but `GET /v1/health` and the library's own public routes (the
 * Ward start and callback, login, logout, session). Anything else is a 404 for anyone. Wrapped in fastify-plugin, and
 * registered before the features, so its hook reaches every route.
 */
const authPlugin: FastifyPluginAsync<AuthOptions> = async (app, options) => {
  // Checks the settings and imports the key now; talks to Ward only on first use, so the API starts while Ward is down.
  const ward = options.ward && (await createWardClient(options.ward));
  await app.register(wardAuth, {
    accounts: options.accounts,
    cookieName: SESSION_COOKIE,
    cookiePath: options.apiPrefix,
    publicOrigin: options.publicOrigin,
    routePrefix: AUTH_ROUTE_PREFIX,
    publicRoutes: ["GET /v1/health"],
    allowRename: false,
    isPublic: (request) => {
      const path = pathOf(request.url);
      return !isUnder(path, "/v1") && !isUnder(path, AUTH_ROUTE_PREFIX);
    },
    // Always given, even empty: absent, the library would read the environment itself.
    trustedProxies: options.trustedProxies,
    ...(ward && {
      ward: {
        client: ward,
        // The page is one address: a failed sign-in lands on `/?ward_error=<code>`, and so would a link's result.
        loginPath: "/",
        settingsPath: "/",
        afterSignInPath: "/",
        roleFor: keepWardRole,
      },
    }),
  });
};

export const auth = fp(authPlugin, { name: "gatehouse-auth" });
