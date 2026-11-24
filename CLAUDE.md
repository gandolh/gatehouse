# Gatehouse

The page at the root of the owner's domain: every app, site and docs page the server answers, as
grouped cards, in three looks (Profile, Terminal, Ninety-six). The owner's own hosts appear only
after Sign in with Ward and come from a small API. A static Astro page and a Fastify API, three npm
workspaces (`shared`, `server`, `web`). Read [corpus/index.md](corpus/index.md) first.

## Commands

Brief 01 adds these; until it is built the repo holds no code.

- `npm run dev`: the API on 8815 and the page on 5182 at `/`.
- `npm run check`: typecheck, lint, format check, conventions, tests. Run it before every hand-back.
  It keeps going after a failing step; the whole output stays in `node_modules/.cache/check/last.log`.
  While you work, `npm run check:fast` and the test files you touched are enough.
- `npm run build`: the page into `web/dist`. Needs `GATEHOUSE_ORIGIN`, and fails if any built file
  holds an owner-part card.
- `npx vitest run <file>`: one test file.
- `npm run format`: Prettier writes every file it covers (Markdown stays out).

## Places that mislead

- The page answers exactly `/`, but its files live under `/gatehouse/`, and `/gatehouse/` itself is a
  404. The API is under `/gatehouse-api/`.
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
