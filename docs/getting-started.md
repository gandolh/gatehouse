# Getting started

## Prerequisites

- Node 24.2 or newer, with npm.
- For the owner part against the real thing: a running Ward. Without one, use the fake API below.

## Install

```bash
npm install
```

## Configure

The page needs no settings in dev. The build and the API read these:

| Variable | Used by | Purpose |
|---|---|---|
| `GATEHOUSE_ORIGIN` | the page build | The domain's origin, which turns `host:<name>` links into addresses. The build fails without it; dev falls back to a placeholder, so host links show `example.org`. |
| `PUBLIC_ORIGIN` | the API | The origin the API is reached at; `http://localhost:5182` by default. |
| `HOST`, `PORT` | the API | Where it listens; `127.0.0.1` and `8815`. |
| `GATEHOUSE_API_PREFIX` | the API | `/gatehouse-api` by default. |
| `GATEHOUSE_DATA_DIR` | the API | Where `gatehouse.sqlite` lives; `data/` by default. |
| `WARD_OIDC_*`, `AUTH_TRUSTED_PROXIES` | the API | Sign in with Ward. Their names and meaning: [sign-in.md](../corpus/wiki/sign-in.md). |

Never write a value for a secret into the repo.

## Run

```bash
npm run dev
```

The API listens on 8815 and the page on `http://localhost:5182/`, which forwards `/gatehouse-api` to the API. Pick a
look and mode with `?look=profile|terminal|ninety-six` and `?mode=light|dark|system`; the query applies to one load and
is not stored.

To see the owner part without Ward, run the fake API and the page together:

```bash
npm run dev:fake -w @gatehouse/web
```

Press Owner sign-in in the footer, or set `gatehouse.owner` to `1` in the browser's localStorage and reload. The
scenario comes from `GATEHOUSE_FAKE` (`owner`, `slow`, `none`, `not-owner`, `ward-down`, `refused`); the list is at the
top of `web/scripts/fake-owner-api.ts`.

The built page: `GATEHOUSE_ORIGIN=https://example.org npm run build`, then `npm run preview -w @gatehouse/web` for
`http://localhost:4182/gatehouse/`. The preview shows the page at `/gatehouse/`; production answers `/` and 404s
`/gatehouse/`.

## Check

```bash
npm run check
```

It runs the typecheck, lint, the format check, the conventions (knip, dependency-cruiser and the house-style checkers)
and the tests, and keeps going after a failing step. The whole output is in `node_modules/.cache/check/last.log`.
While you work, `npm run check:fast` and `npx vitest run <file>` are enough. `npm run format` writes Prettier's changes.

## Add a card

1. Add the card to a section of `content/cards.json`. Its fields: [card-list.md](../corpus/wiki/card-list.md#a-card).
2. Put its picture in `content/images/` as a webp, unless the section is compact (a compact section's cards have none).
3. `npm run check` reads the list through the schema and fails on a bad field, a repeated id or a picture in a compact
   section. vps-deploy checks the same file against its stacks.
4. A card in the owner part (`"part": "owner"`) never reaches the built page; the build fails if it does.

## Common problems

- `npm run build` stops naming `GATEHOUSE_ORIGIN`: set it in the environment. The repo's `.env` doesn't reach the build.
- The page looks unstyled or a file 404s in the preview: open `/gatehouse/`, not `/`.
