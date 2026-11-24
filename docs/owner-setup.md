# Owner setup

Everything it takes to put Gatehouse on the VPS, and what the vps-deploy stack needs to know.
Nothing in this repo deploys, registers a Ward client or writes a secret: those are the owner's
steps, written down here. Commands run on your machine unless a step says otherwise.

Gatehouse is two things. The page is static: built once with the domain's origin, and served by
Caddy at exactly `/`, with its files under `/gatehouse/`. The API runs as one container from
[`infrastructure/docker-compose.yml`](../infrastructure/docker-compose.yml): `gatehouse-api` (Sign in
with Ward, and the owner's cards) on `127.0.0.1:8815`. Caddy forwards `/gatehouse-api/` to it with the
prefix stripped.

`<production origin>` below means `https://` plus the main domain's host, with no path.

## 1. Register Gatehouse in production Ward

The adoption guide is `shared-library/README.md` in the Ward repo (`wzd_auth`). Lantern, Wicket and
brief-board were registered the same way.

1. Open the console on Ward's own host (`/console`) and sign in as the break-glass superuser.
2. Create an app with slug `gatehouse` and name `Gatehouse`, with public registration closed.
3. Make the client's key pair, from Ward's checkout:

   ```
   cd path/to/wzd_auth && npm run oidc-client-key --workspace=api -- gatehouse
   ```

   It prints a private `WARD_OIDC_CLIENT_KEY=...` line and a public JWK. Keep the private line
   for section 2. Never paste it into Ward.
4. On the app's page, under "Sign in with Ward", register a client with the public JWK and these
   addresses:
   - redirect URI: `<production origin>/gatehouse-api/auth/ward/callback`
   - sign-out return URI: `<production origin>/`
5. Grant the role `admin` on the app to your own Ward account. Grant `admin` itself, not another
   role first: section 6 says why.

## 2. The secrets

One secret, for `gatehouse-api`:

| Variable | What | Where it comes from |
|---|---|---|
| `WARD_OIDC_CLIENT_KEY` | Ward client private key | section 1, step 3 |

With vps-deploy, it goes in its secrets file for the stack (`secrets/gatehouse.env`, `chmod 600`).

## 3. What the vps-deploy stack needs

| Setting | Value |
|---|---|
| Source repo | `gatehouse`, built from the workspace root |
| Container | `gatehouse-api`, built from `infrastructure/Dockerfile` (target `prod`), image `gatehouse-api:1.0`, from `infrastructure/docker-compose.yml` (compose project `gatehouse`) |
| Image sources | What the Dockerfile copies, build context the repo root: `package.json`, `package-lock.json`, `.npmrc`, `tsconfig.base.json`, `shared`, `server` (with `server/vendor`), `web/package.json`, `content/cards.json`, `infrastructure` |
| Server dir | `/srv/gatehouse-api` (the compose file's `.env` goes in `infrastructure/`, 0600) |
| Port | `127.0.0.1:8815`, loopback only; the deploy's loopback check should cover it |
| Page build | `npm run build` at the repo root with `GATEHOUSE_ORIGIN=<production origin>` in the environment (`.env` doesn't reach it); it fails naming the variable without one. It writes `web/dist/index.html` and `web/dist/assets/`, and checks that every file the page loads is under `/gatehouse/` and that no owner card reached `web/dist` |
| Page route | `web/dist/index.html` at exactly `/`. Nothing else at the root: an unknown path is the plain 404 |
| Page files | `/gatehouse/*` from `web/dist` (the URLs say `/gatehouse/assets/...`, the files sit in `web/dist/assets/`). No SPA fallback. `/gatehouse` and `/gatehouse/` answer the plain 404, as does `/gatehouse/index.html` |
| API route | `/gatehouse-api/*` to `127.0.0.1:8815`, prefix stripped (the API answers with or without it) |
| Health check | `GET http://127.0.0.1:8815/v1/health`, expecting `"ok":true` (through Caddy: `/gatehouse-api/v1/health`) |
| Data | `/srv/gatehouse-api/data` bind-mounted at `/data` (`GATEHOUSE_HOST_DATA_DIR`): `gatehouse.sqlite`, Ward's library's sessions and the users Ward's sign-in made. Nothing else; back up this one directory if you like, or lose it and sign in again |
| Secrets | `WARD_OIDC_CLIENT_KEY` (section 2) |
| Plain env | `PUBLIC_ORIGIN=<production origin>`; `WARD_OIDC_ISSUER` (Ward's issuer, ending in `/oidc`), `WARD_OIDC_CLIENT_ID=gatehouse`, `WARD_OIDC_REDIRECT_URI=<production origin>/gatehouse-api/auth/ward/callback`, `WARD_OIDC_POST_LOGOUT_REDIRECT_URI=<production origin>/`; `AUTH_TRUSTED_PROXIES` = the range Caddy reaches containers from, as for the other apps. vps-deploy's `useWard` writes all of these |
| Set by compose | `HOST`, `PORT`, `GATEHOUSE_DATA_DIR=/data`, `GATEHOUSE_CARDS_FILE=/app/content/cards.json`; they beat the `.env` |
| Optional env | `GATEHOUSE_PORT` (the published port, default 8815), `GATEHOUSE_HOST_DATA_DIR` (the host's data folder, default `../data` from `infrastructure/`). Not `GATEHOUSE_DATA_DIR`: that is the server's own setting, fixed to `/data` in the container |
| Left to defaults | `GATEHOUSE_API_PREFIX` (`/gatehouse-api`, this stack's) |
| Outbound | HTTPS to Ward's host from the server: discovery, the code exchange, and the session check (at most once every 30 s per Ward session). The browser goes to Ward itself for the sign-in |
| Idle | No timers, no WebSockets: the container does work only while answering a request, so it may sleep behind Sablier. Visitors never call the API; only the owner's browser does, after Owner sign-in, and the page shows a waking note while the first request waits |
| Ward client | slug `gatehouse`, the owner granted `admin` |
| The card list | `content/cards.json` is in the image, read once at start: a changed list needs `server` as well as the page's `deploy` |

## 4. Check the container locally

Docker Desktop's WSL integration must be on. From the repo root, with a scratch data directory (no
`.env` is needed: without one the API starts without Sign in with Ward):

```
GATEHOUSE_HOST_DATA_DIR="$(mktemp -d)" docker compose -f infrastructure/docker-compose.yml up --build -d
curl -s http://127.0.0.1:8815/v1/health
```

Expect `{"ok":true}`. Stop it with `docker compose -f infrastructure/docker-compose.yml down`.
Stop a local `npm run dev` first: it uses the same port.

## 5. Deploy

Once the vps-deploy stack exists, from vps-deploy (check the stack's CLI name in its `cli.ts`):

```
node cli.ts gatehouse all --dry-run
node cli.ts gatehouse all
```

Then:

```
curl -s <production origin>/gatehouse-api/v1/health
curl -sI <production origin>/
curl -sI <production origin>/gatehouse/
```

Expect `{"ok":true}`, a `200`, and a `404`.

## 6. Your account

There is no seed, no register page and no password: Sign in with Ward is the only way in. Open
`<production origin>/`, press Owner sign-in in the footer, and sign in at Ward. Your first sign-in
makes your Gatehouse user with the role your Ward grant carries (`admin`), and the owner's cards
appear in Behind the scenes.

- **Grant `admin` first.** With no grant at all, Ward refuses the sign-in (`access_denied`; the page
  says Ward didn't sign you in) and Gatehouse makes no user, so a sign-in after the grant works. But
  the role is copied once, when your first sign-in makes the user, and never read from Ward again:
  signed in under a grant with another role, you stay "not the owner" after Ward's grant changes to
  `admin`. To start over, on the box as the services account:

  ```
  export DOCKER_HOST=unix:///run/user/$(id -u)/docker.sock
  cd /srv/gatehouse-api
  docker compose -f infrastructure/docker-compose.yml stop gatehouse-api
  rm -f data/gatehouse.sqlite data/gatehouse.sqlite-wal data/gatehouse.sqlite-shm
  docker compose -f infrastructure/docker-compose.yml start gatehouse-api
  ```

  The file holds only the sessions and the users; nothing else is lost. Then sign in again.
- **Ward down hides the cards, not the session.** A session made by Ward is checked against Ward at most
  every 30 s. While Ward can't answer, the owner route answers 401 and the page says Ward can't be
  reached, with Try again and Sign out; the session is kept, so Try again or a reload brings the cards
  back once Ward is back, with no new sign-in.
- **Sign out** ends Gatehouse's session only, not your Ward session.

Once after the deploy, check that the library's sign-in lockout sees each visitor's own address. Its
local sign-in route still answers (and always fails: there are no local accounts), so one failed try
makes it look:

```
curl -s -X POST <production origin>/gatehouse-api/auth/login -H 'content-type: application/json' \
  -d '{"username":"nobody","password":"not-a-password"}'
docker compose -f infrastructure/docker-compose.yml logs gatehouse-api | grep -i "X-Forwarded-For"
```

The first answers `{"error":"invalid_credentials"}`. No output from the second is right. A line
saying every caller shares one failure counter means `AUTH_TRUSTED_PROXIES` doesn't name the range
Caddy comes from. Run the second on the box as the services account, from `/srv/gatehouse-api`.
