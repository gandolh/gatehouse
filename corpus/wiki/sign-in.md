---
summary: Sign in with Ward on Gatehouse's API, as built on 2026-11-24 (brief 07). Ward only, checked first - the API starts with no user, local sign-in fails for any name, and a first Ward sign-in takes the grant's role (read in ward-auth 1.1.0's userForSignIn, tested through it), copied once and never refreshed, so the grant comes first. The wiring (plugins/auth.ts, db/accounts.ts, the gatehouse_session cookie on /gatehouse-api, the library's routes under /auth, the guard over /v1 and /auth, the library's 401 and 403 bodies kept, cross-site POSTs refused, Ward sessions rechecked every 30 s); the owner route (GET /v1/owner/cards, admin, the card list read once, three cards); the settings (five WARD_OIDC_*, AUTH_TRUSTED_PROXIES, GATEHOUSE_CARDS_FILE); the data file; the vendored copy and its sums; the tests; the container, not built here.
updated: 2026-11-24
---

# Sign in with Ward on the API

Built on 2026-11-24 (brief 07). The page's side is [owner-part.md](owner-part.md); the flow is in
[architecture.md](architecture.md), "The owner part"; what vps-deploy needs is `docs/owner-setup.md`.

## Ward only, checked first

The plan wanted Sign in with Ward as the only way in, and Ward's library has no switch that turns
local sign-in off. Two things had to hold, and both do (`server/src/plugins/auth.test.ts`):

- **With no local account, nothing signs in locally.** The app built with Ward's settings against a
  fake discovery document and a fresh, empty database starts, answers health, answers
  `POST /gatehouse-api/auth/login` with `401 invalid_credentials` for any name (no cookie set), and
  answers the owner route `401 unauthorized`. The Ward start answers `{ url }` at Ward's
  `/auth` with `client_id=gatehouse` and the callback. `/auth/register` and `/auth/username` are 404
  even for a signed-in user: registration is off by default, and rename is off.
- **A user made by a first Ward sign-in takes the grant's role.** Read in the vendored bundle: the
  callback, after a verified code exchange, calls `identities.userForSignIn(identity, ward.roleFor,
  …)`. A subject already linked gets its user as it is. A new subject gets a user with no password,
  linked to the subject, whose role is `roleFor(identity.role)`, where `identity.role` is the ID
  token's `ward_role` claim (a token without it fails as `invalid_callback`). Gatehouse's `roleFor` is
  `keepWardRole`, the identity, so the owner's `admin` grant arrives as `admin`. The test calls the
  same function with the same `roleFor`: an `admin` grant reads the owner's cards, a `member` grant
  gets 403.

What follows from it:

- **The role is copied once.** After the user exists, its row is the only truth; a changed grant at
  Ward never reaches it. Signed in before the `admin` grant existed, the owner stays "not the owner".
  There is no seed or admin screen to fix it: stop the container, delete `gatehouse.sqlite` (and its
  `-wal` and `-shm`), start it, sign in again. `docs/owner-setup.md` says to grant first.
- The local sign-in route stays and always fails, at one scrypt each, under the library's lockout
  (five failures per address, then 429). No account can ever have a password: nothing sets one, and
  setting one from Ward needs a reauthentication the page never offers.

## How it is wired

- `server/src/plugins/auth.ts`: the library's `wardAuth` plugin, wrapped in fastify-plugin, registered
  after the error plugin and before the features. Cookie `gatehouse_session` on `/gatehouse-api`
  (`HttpOnly`, `SameSite=Lax`, `Secure` except plain HTTP on loopback); the library's routes under
  `/auth`; `allowRename: false`; no `registration`; `loginPath`, `settingsPath` and `afterSignInPath`
  all `/`, so a sign-in lands on `/` and a failed one on `/?ward_error=<code>`. `trustedProxies` is
  always passed (empty locally): absent, the library would read the environment itself.
- `server/src/db/accounts.ts`: `gatehouse.sqlite` in the data folder, WAL, the library's store and
  accounts on it. The library migrates its own tables (`auth_users`, `auth_sessions`,
  `auth_ward_links`, `auth_migrations`); Gatehouse keeps no data of its own.
- **The guard** covers every path under `/v1` and `/auth`, except `GET /v1/health` and the library's
  own public routes (login, logout, session, the Ward start and callback). Anything else answers 404
  to anyone. So an unknown path under `/v1` answers 401 without a session and 404 with one.
- **401 and 403 keep the library's bodies**: `{ error: "unauthorized" }` (with a `reason` when a
  session check refused it) and `{ error: "forbidden" }` from `requireRole("admin")`. The API's own
  errors carry a `message` too; shared's `errorBodySchema` (`{ error, message? }`) takes both, and the
  page reads the status. Lantern and Wicket rewrite theirs because their contract's body differs.
- **Cross-site writes**: the library's POST routes answer `403 cross_site` when a browser says the
  request came from another site (an `Origin` other than `PUBLIC_ORIGIN`, or a `Sec-Fetch-Site` other
  than `same-origin`). A request with neither header passes (a script). The owner route is a GET and
  changes nothing.
- **Ward sessions are rechecked**: a session a Ward sign-in made is checked against Ward at most once
  every 30 s. Ward unreachable: 401 with `reason: ward_unavailable`, the session kept for when Ward is
  back. Ward session ended: 401, and the session ends. The page drops the hint on any 401.
- **Sign-out**: `POST /auth/logout`, no body, answers 204, ends Gatehouse's session and clears the
  cookie. Ward's session stays (the owner's call). `POST /auth/ward/logout` exists; the page doesn't
  use it.
- **Without `WARD_OIDC_ISSUER`** the API starts, logs that Sign in with Ward is off, and nobody can
  sign in. The Ward routes don't exist then, so the start answers 401 (the guard covers `/auth`),
  which the page shows as Ward unreachable.

## The owner route

`server/src/features/owner-cards/`: `GET /v1/owner/cards`, `preHandler: ownerOnly`
(`requireRole("admin")`), response 200 declared as shared's `ownerCardsSchema`, `Cache-Control:
no-store`. The answer is made once at start: `ownerCardsAnswer(loadCards(GATEHOUSE_CARDS_FILE),
PUBLIC_ORIGIN)`. A bad or missing card list stops the start. Three cards, in page order: brief-board
(its link a path, `/brief-board/`, as it is), the vault and the mail admin (`host:` links resolved to
`https://vault.<host>/`). A changed card list reaches the API only with a restart, which on the VPS is
the stack's `server` phase.

## Settings added

| Variable | Default | What |
| --- | --- | --- |
| `WARD_OIDC_ISSUER` | empty: Ward off | Ward's issuer, ending in `/oidc`; `http` only on loopback |
| `WARD_OIDC_CLIENT_ID` | | `gatehouse` |
| `WARD_OIDC_CLIENT_KEY` | | the client's private key: a secret |
| `WARD_OIDC_REDIRECT_URI` | | exactly `PUBLIC_ORIGIN` + `/gatehouse-api/auth/ward/callback` (follows `GATEHOUSE_API_PREFIX`) |
| `WARD_OIDC_POST_LOGOUT_REDIRECT_URI` | | `PUBLIC_ORIGIN` + `/`, optional |
| `AUTH_TRUSTED_PROXIES` | none | peers besides loopback whose `X-Forwarded-For` the lockout believes |
| `GATEHOUSE_CARDS_FILE` | `content/cards.json` from the repo root | the card list |

`config.ts` reads the five Ward variables with the library's own `wardClientOptionsFromEnv`, so its
rules hold: with the issuer set, the id, key and redirect URI must be too. A wrong redirect URI or a
bad proxy list stops the start with a message that names the variable and never its value.
`server.ts` also gives `AUTH_TRUSTED_PROXIES` to Fastify's `trustProxy`, so the log shows the
visitor's address.

## The vendored copy

`server/vendor/ward/` holds the six files of a ward-auth 1.1.0 copy: the two bundles, their types,
the README and the LICENSE. They were copied from the controller's staged output of Ward's vendor
script (built at wzd_auth 66998b7, no library change since) and checked with `sha256sum -c` against
that build's `SHA256SUMS`: all six OK. Ward's own build output matched the same sums. The script itself
wasn't run, since it rebuilds the build folder in the Ward checkout, which this brief only reads. The
React pair comes with any copy, and nothing imports it: the page makes its three calls itself.
Prettier skips the folder; ESLint, knip and dependency-cruiser skip any `vendor/`. The bundles' banner
and the LICENSE name the library's source account, which the root `CLAUDE.md` allows in only two
files; the copies can't be edited without breaking the sums (asked on the board, 2026-11-24).

To upgrade: run Ward's `npm run vendor -- <this repo>/server/vendor/ward` (or copy a staged build),
check the sums, and read the library's CHANGELOG in the Ward repo (its shared library folder) from 1.1.0 on.

## The tests

- `server/src/plugins/auth.test.ts`: the Ward-only start, the first sign-in's role, no register or
  rename, logout (204, the session over, the cookie cleared on `/gatehouse-api`), cross-site POSTs
  to the start and the logout refused, the flow cookie kept to the callback's path.
- `server/src/features/owner-cards/routes.test.ts`: 401 with no session or a dead one, 403 without
  `admin`, 200 with the three cards bare and under the prefix, links against `PUBLIC_ORIGIN`, no
  public card, only the schema's fields, and a missing card list stopping the start.
- `server/src/config.test.ts`: the new settings and their messages. Sessions in tests are minted with
  `sessionCookie(accounts, role)` from `server/src/testing/buildTestApp.ts`, which now returns
  `{ app, accounts }`.

## The container

`infrastructure/Dockerfile` (every stage `node:24.22.1-alpine`, the server's scoped `npm ci`, a
`prod` target running `server/dist/server.js`, `content/cards.json` copied in and the pictures left
out) and `infrastructure/docker-compose.yml` (`gatehouse-api` on `127.0.0.1:8815`, the host's
`GATEHOUSE_HOST_DATA_DIR` at `/data`, health on `/v1/health`, an optional `.env`). Brief 07 didn't
build the image: `docker compose -f infrastructure/docker-compose.yml config` parses, and the built
server started from the image's file layout outside Docker. `docs/owner-setup.md` has the rest.
