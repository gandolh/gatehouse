# Task 07: The owner API and its container

**Depends on:** 01, 02.

**Runs before:** 08, and vps-deploy's brief 34 (its stack reads `docs/owner-setup.md`).

**Builder:** Opus ([routing.md](../../routing.md)).

## Context

The owner part comes from a small API ([decisions.md](../../wiki/decisions.md)). Brief 01 left a
server with settings and a health route; this brief adds Ward's sign-in, the one owner route, the
container, and the setup doc that vps-deploy's brief 34 reads as its spec, the way Lantern's
`docs/owner-setup.md` was the spec for its stack.

The plan's calls ([architecture.md](../../wiki/architecture.md)):

- Fastify 5, the zod type provider, the `code-structure` layout; Lantern's server is the nearest
  working example (`server/src/plugins/auth/`).
- Ward's library, ward-auth 1.1.0, vendored into `server/vendor/ward/` with Ward's vendor script
  from the `wzd_auth` checkout (`npm run vendor -- <this repo>/server/vendor/ward`). Its sessions
  and users live in SQLite through better-sqlite3 (`createSqliteStore`).
- **Sign in with Ward only:** no seed, no registration (`registration` off), no rename
  (`allowRename: false`). The library has no switch that turns local sign-in off; with no local
  account, nothing can sign in locally.
- Cookie `gatehouse_session` on path `/gatehouse-api`; the library's routes under `/auth`, so the
  callback is `/gatehouse-api/auth/ward/callback` (vps-deploy's default callback path).
  `loginPath`, `settingsPath` and `afterSignInPath` are all `/`.
- `roleFor` keeps Ward's grant role, so the owner, whom vps-deploy's setup grants `admin`, arrives
  as `admin`.
- `GET /v1/health` public; `GET /v1/owner/cards` behind `requireRole("admin")`, answering the
  owner-part cards with links resolved against `PUBLIC_ORIGIN` by `shared`'s resolver, in the shape
  the page's Card component takes. That shape's zod schema lives in `shared`: brief 06 writes it,
  or this brief does if it runs first, and the route declares it as its response. 401 and 403
  in the API's error shape, keeping the library's codes (`unauthorized`, `forbidden`), since brief
  06's page reads them.
- No timers, no WebSockets, so the container may sleep behind Sablier.

## Files you OWN

- `shared/src/`: the owner answer's schema, if brief 06 hasn't written it
- `server/`: the auth plugin, `server/src/features/owner-cards/`, the vendored `server/vendor/ward/`, settings
  for the five `WARD_OIDC_*` variables and `AUTH_TRUSTED_PROXIES`, tests
- `infrastructure/Dockerfile`, `infrastructure/docker-compose.yml`, `.dockerignore`
- `docs/owner-setup.md` (new), `.env.example`
- Corpus: `corpus/wiki/architecture.md`, a new `corpus/wiki/sign-in.md`, `corpus/wiki/status.md`,
  `corpus/wiki/open-questions.md`, `corpus/log.md`

## Files you must NOT touch

- `web/`, `design/`, `content/cards.json`.
- The `wzd_auth` repo: read only. Its vendor script writes only into this repo.
- vps-deploy.

## Steps

1. **Check the Ward-only setup first.** In a test: build the app with Ward options set against a fake
   discovery (as Lantern's `ward-link.test.ts` does) and an empty user table. It starts, health
   answers, `POST /gatehouse-api/auth/login` with any name fails, and the owner route answers 401.
   Then read the library's first-sign-in path (`userForSignIn`, `roleFor`) and confirm that a user
   created by a Ward sign-in takes the grant's role. Write what you found in `sign-in.md` and drop
   the item from `open-questions.md`. If either fails, stop and report: the plan needs a change.
2. **Vendor** ward-auth 1.1.0 into `server/vendor/ward/` and check it against the build's
   `SHA256SUMS`. Only the server copy: the page makes its three calls itself (brief 06) and needs
   none of the library's React hooks, since the owner hint, not a session check on load, decides
   when it calls the API.
3. **The auth plugin and the owner route** as the Context says. The owner route reads the card list
   once at start through `loadCards`; the path comes from a setting (default `content/cards.json`
   at the repo root, `/app/content/cards.json` in the image).
4. **Tests**: health with and without the prefix; the owner route 401 with no session, 403 for a
   user without `admin`, 200 with the four owner cards for `admin` (sessions minted through the
   library's accounts in a test store), host links resolved against `PUBLIC_ORIGIN`, no public card
   in the answer; a `POST` from another origin refused.
5. **The container.** `infrastructure/Dockerfile` (build context the repo root, Node 24 alpine, a
   `prod` target running `server/dist/server.js`) copying the root manifests, `shared`, `server`,
   `content/cards.json` and `web/package.json`; `infrastructure/docker-compose.yml` with the
   `gatehouse-api` service on 127.0.0.1:8815, `/srv/gatehouse-api/data` mounted at `/data`, and a
   health check on `/v1/health`. Copy Lantern's two files for the shape. Builders don't build
   images: check the compose file with `docker compose -f infrastructure/docker-compose.yml config`
   and say in the outcome that the image wasn't built.
6. **`docs/owner-setup.md`**, the spec for vps-deploy's stack, in Lantern's shape: the image and
   service; the port; the routes (the page `web/dist/index.html` at exactly `/`, the files under
   `/gatehouse/` from `web/dist`, `/gatehouse` and `/gatehouse/` answering the plain 404, the API
   under `/gatehouse-api/` with the prefix stripped); the build (`npm run build` at the root with
   `GATEHOUSE_ORIGIN`); health; the data folder; the Ward client (name, redirect URI
   `<production origin>/gatehouse-api/auth/ward/callback`, post-logout URI `<production origin>/`,
   the owner granted `admin`); the secrets by variable name; that it may sleep. Write
   `<production origin>`, never the domain.
7. The corpus: `sign-in.md`, `architecture.md`, `status.md`, `open-questions.md`, a `log.md` entry.

## Acceptance

- [ ] Step 1's finding is in `sign-in.md`, and the open question is closed.
- [ ] The vendored copy matches its `SHA256SUMS`.
- [ ] The tests in step 4 pass; `npm run check` exits 0.
- [ ] `docker compose -f infrastructure/docker-compose.yml config` parses.
- [ ] `docs/owner-setup.md` names every secret by variable only and has no domain.
- [ ] `bash corpus/lint.sh` passes.

## Owner steps

- None here. vps-deploy's brief 34 registers the Ward client and deploys.

## Owner decisions

- Settled 2026-11-23: the owner part comes from an API behind Sign in with Ward.
- Settled 2026-11-24 (the plan): Ward-only sign-in, no local accounts; the owner route needs
  `admin`; the container sleeps behind Sablier; sign-out ends Gatehouse's session only.

## Outcome (2026-11-24)

Built; on the board at Done (Gatehouse isn't deployed yet). Details in [sign-in.md](../../wiki/sign-in.md).

- **Step 1 held.** With Ward's settings against a fake discovery and an empty database, the API starts, answers
  health, answers `POST /gatehouse-api/auth/login` 401 `invalid_credentials` for any name, and the owner route 401. A
  first Ward sign-in makes the user with `roleFor(ward_role)`; `keepWardRole` keeps it, so `admin` arrives as
  `admin` (read in `userForSignIn`, tested through it). The role is copied once; Ward refuses a user with no grant
  (`access_denied`), so the stuck case is a first sign-in under another role, and the fix is deleting
  `gatehouse.sqlite`. The open question is dropped from open-questions.md.
- `server/vendor/ward/`: ward-auth 1.1.0, six files, `sha256sum -c` against the build's `SHA256SUMS` all OK.
- `server/src/plugins/auth.ts` (cookie `gatehouse_session` on `/gatehouse-api`, routes under `/auth`, no
  registration, no rename, the guard over `/v1` and `/auth` but health), `server/src/db/accounts.ts`
  (`gatehouse.sqlite`), `server/src/features/owner-cards/` (`GET /v1/owner/cards`, `requireRole("admin")`, 200
  declared as `ownerCardsSchema`, the card list read once at start from `GATEHOUSE_CARDS_FILE`), `config.ts` (the
  five `WARD_OIDC_*`, `AUTH_TRUSTED_PROXIES`, `GATEHOUSE_CARDS_FILE`), `.env.example`.
- Tests: the Ward-only start, the role, no register or rename, logout, cross-site POSTs refused (403 `cross_site`);
  the owner route 401, 403, and 200 with the three cards bare and prefixed, host links against `PUBLIC_ORIGIN`, no
  public card; the settings.
- `infrastructure/Dockerfile`, `infrastructure/docker-compose.yml`, `.dockerignore`. **The image wasn't built**:
  `docker compose -f infrastructure/docker-compose.yml config` parses, and the built server started from the image's
  file layout outside Docker (health 200, owner route 401, exit 0 on SIGTERM).
- `docs/owner-setup.md`, vps-deploy 34's spec, with `<production origin>` and no domain; one secret,
  `WARD_OIDC_CLIENT_KEY`, named by variable only.

Checks: `npm run check`, `npm run build` (with `GATEHOUSE_ORIGIN`), the compose config, the sums and the corpus lint
pass. Not run: the image build and boot, and a real Ward round trip (no local Ward client for Gatehouse until brief
08; every test session is a local one).

Deviations:
- Vendored by copying the controller's staged output of Ward's vendor script (wzd_auth 66998b7), not by running the
  script: it rebuilds the build folder in the Ward checkout, which this brief only reads. Ward's own build output
  matched the same sums. The React pair comes with the copy (a copy is six files); nothing imports it.
- Steps 1, 3 and 4 are one commit: the step 1 test needs the plugin and the owner route.
- Three owner cards, not four: Grafana left the card list on 2026-11-24.
- 401 and 403 keep the library's bare bodies (`{ error }`, a 401 with a `reason` when a session check refused it);
  brief 06's page reads the status, and shared's `errorBodySchema` takes them. No rewrite as Lantern's.
- An unknown path under `/v1` answers 401 without a session (404 with one); `buildTestApp` returns `{ app, accounts }`
  and the health and error tests changed for it (the error tests sign in).
- `server.ts`'s `trustProxy` adds `AUTH_TRUSTED_PROXIES` to loopback.
- The compose file differs from Lantern's: an optional `.env` (`required: false`, as imbatranimOS's), the host's data
  folder as `GATEHOUSE_HOST_DATA_DIR` (the server's `GATEHOUSE_DATA_DIR` is pinned to `/data`), and
  `GATEHOUSE_CARDS_FILE` pinned too.
- Files outside the owned list: `.prettierignore` (skips `server/vendor/`), `corpus/index.md`, `corpus/.planned-roots`
  (`docs` and `infrastructure` now exist), `server/tsconfig.json` and `server/package.json` (the reference to
  shared and the new dependencies).
- The vendored banners and LICENSE name the library's source account, which the root `CLAUDE.md` allows in two
  files only; asked on the board.
