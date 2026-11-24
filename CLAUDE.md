# Gatehouse

The page at the root of the owner's domain: every app, site and docs page the server answers, as
grouped cards, in three looks (Profile, Terminal, Ninety-six). The owner's own hosts appear only
after Sign in with Ward and come from a small API. A React page on Vite, rendered to HTML at build
time and hydrated, and a Fastify API: three npm workspaces (`shared`, `server`, `web`). Read
[corpus/index.md](corpus/index.md) first.

## Commands

- `npm run dev`: the API on 8815 and the page on 5182 at `http://localhost:5182/`; the page's dev
  server forwards `/gatehouse-api` to the API.
- `npm run check`: typecheck (`tsc -b`, then `tsc -p web`), lint, format check, conventions (knip,
  dependency-cruiser, both house-style checkers, strict), tests. Run it before every hand-back. It
  keeps going after a failing step; the whole output stays in `node_modules/.cache/check/last.log`.
  While you work, `npm run check:fast` and the test files you touched are enough.
- `npm run build`: the API into `server/dist`; the page's client build into `web/dist`, its SSR
  build into `web/dist-ssr`, the prerender into `web/dist/index.html`, then the path check. Needs
  `GATEHOUSE_ORIGIN` in the environment (`.env` doesn't reach it), and fails naming it without one.
- `npm run preview -w @gatehouse/web`: the built page at `http://localhost:4182/gatehouse/`.
- `npx vitest run <file>`: one test file.
- `npm run format`: Prettier writes every file it covers (Markdown stays out).
- `npm run house-style:sync -- --check`: the vendored `vendor/house-style/` against its commit.

## Places that mislead

- The page answers exactly `/`, but its files live under `/gatehouse/`, and `/gatehouse/` itself is a
  404. The API is under `/gatehouse-api/`.
- The built files sit in `web/dist/assets/`, yet their URLs say `/gatehouse/assets/` (Vite's `base`,
  set for the build and the preview only): the deploy serves `/gatehouse/<file>` from `web/dist/`.
  The dev server uses `/`. There is no `web/public/`, and there must not be one.
- The preview is not production: it shows the page at `/gatehouse/` and redirects `/` there, where
  production answers `/` and 404s `/gatehouse/`.
- The page's HTML comes from the prerender, so a render that reads localStorage or the address
  breaks hydration. Read those after mount.
- The API answers `/v1/health` and `/gatehouse-api/v1/health` alike: it strips its own prefix, since
  Caddy strips it and the dev proxy doesn't.
- `content/cards.json` is the one card list. The page build, the API and vps-deploy's check all read
  it. A card's access label (Owner only) and its part (`owner`) are different fields: imbatranimOS is
  labelled Owner only, yet it is public.
- The owner part never reaches the public HTML. Visitors never call the API: the page calls it only
  when the browser holds the owner hint.
- A look is Profile, Terminal or Ninety-six; a mode is light, dark or system. Don't call either a
  theme ([glossary](corpus/wiki/glossary.md)).
- `design/` is the approved design, read only. `design/README.md` says which file wins.

## Hard rules

- **No secrets.** Never write a key, token or password into the repo. Name a secret by its variable.
- **No domain, no account names, no machine paths** in any file but `content/cards.json`, which holds
  the GitHub links and the wordmark. The domain reaches the build as `GATEHOUSE_ORIGIN` and the API
  as `PUBLIC_ORIGIN`. Name other repos by name: "vps-deploy", "Ward" (the `wzd_auth` repo).
- **No remote, no pushes, no deploys.** The repo is local; commit on `main`. The owner deploys.
- **No CI.** Don't add GitHub Actions, runners or other GitHub-specific automation.

## brief-board

Brief progress goes on brief-board. Run `brief-board guide` before you start or resume a brief, and
follow it.
