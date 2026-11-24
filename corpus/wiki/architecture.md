---
summary: How Gatehouse is put together, as planned on 2026-11-24 and re-planned the same day for React (nothing built yet). Three npm workspaces (shared card schema and link resolver, a Fastify 5 API, a React 19 page on Vite 8 with Base UI and Tailwind 4); the addresses (the page at exactly /, its files under /gatehouse/ through Vite's base, the API under /gatehouse-api/, /gatehouse/ itself a 404); the build (client build, SSR build, prerender, path check, guard) and hydration; the public-only card module; ports 8815, 5182 and 4182; the settings GATEHOUSE_ORIGIN, PUBLIC_ORIGIN and the data folder; looks and modes as data-look and data-theme set before first paint, read by React only after mount; fonts per look; the owner part (the owner hint, the API call, the Card component after mount, sign-out); the build guard; the container behind Sablier.
updated: 2026-11-24
---

# Architecture

Planned on 2026-11-24, and re-planned the same day when the page moved from Astro to React
([decisions.md](decisions.md)). The briefs build it. Each point names the brief that settles it, and
the brief's outcome note wins over this page until the page catches up.

## Workspaces

- `shared` (`@gatehouse/shared`): the card list's zod schema, its loader, and the link resolver.
  The page build and the API import it; the barrel stays safe for the browser, and the loader,
  which reads the file, sits behind a subpath of its own (brief 02). vps-deploy reads
  `content/cards.json` on its own and imports nothing from here.
- `server` (`@gatehouse/server`): Fastify 5 with the zod type provider, laid out as the
  `code-structure` skill says. Ward's vendored library (`ward-auth` 1.1.0) holds the sessions in
  SQLite through better-sqlite3.
- `web` (`@gatehouse/web`): a React 19.2.8 page on Vite 8.3.5, rendered to HTML at build time and
  hydrated in the browser. Base UI 1.9.0 for the controls, Tailwind 4.3.5 through
  `@tailwindcss/vite`, one stylesheet. One page, no client router.

The tooling is the `house-style` harness in its usual three-workspace shape, with `check-base-ui`
strict from the start (brief 01).

## Addresses

| Address | What answers |
| --- | --- |
| `/` exactly | `web/dist/index.html`, the page |
| `/gatehouse/...` | The page's files: scripts, styles, fonts, pictures. Vite's `base`, `/gatehouse/` in the build only, writes these URLs. |
| `/gatehouse` and `/gatehouse/` | The plain 404, like every unknown path |
| `/gatehouse-api/...` | The API, with the prefix stripped before Fastify sees it |

There is no `public/` folder: every file the page loads is imported, so Vite fingerprints it under
the base, and nothing but `index.html` and the assets folder sits at the top of `web/dist/`. The
SSR bundle is written outside `web/dist/`, so the deploy can't serve it. vps-deploy's brief 34 adds
the route that serves one file at exactly `/`.

**The path check** runs in every build and reads the files the page loads: `<script src>`,
`<link href>` (stylesheets, preloads, the icon), `<img src>` and `srcset`, CSS `url()`, and the
chunk, preload and dynamic-import references in the scripts. Each must start with `/gatehouse/`
(a relative reference counts by where it resolves) and name a file that exists in `web/dist/`.
Links a visitor follows (`<a href>`: `/trips/`, hosts, GitHub) and the API's paths
(`/gatehouse-api/...`) are out of its scope. Brief 01 runs it first on a scratch app with a font, a
picture with a `srcset` and a dynamic import, and records the settings that pass here; brief 03
runs it again once the page has fonts and pictures.

## The build

`npm run build` at the root, with `GATEHOUSE_ORIGIN` set:

1. `tsc -b` builds `shared` and `server`.
2. Vite's client build writes `web/dist/index.html`, with an empty root, and the assets.
3. Vite's SSR build of `web/src/entry-server.tsx` writes outside `web/dist/`.
4. The prerender script renders the page with React's server or static API into the root of
   `web/dist/index.html`.
5. The path check (brief 01) and the build guard (brief 03) read every file in `web/dist/`.

In the browser, `web/src/main.tsx` hydrates that HTML with `hydrateRoot`. In dev nothing is
prerendered, so it mounts with `createRoot`. A hydration test in jsdom (brief 03) renders the page
as the prerender does, then hydrates it with a stored look and mode (and, from brief 06, the owner
hint) and expects no recoverable error.

## The card module

The page never imports `content/cards.json`: bundling it would ship the owner cards in the scripts.
A small Vite plugin gives the page a virtual module, in dev and in the build, made through
`shared`'s loader: the public part only, links resolved against `GATEHOUSE_ORIGIN`, the address as
`displayAddress` writes it, and each picture imported (so Vite fingerprints it) with the width and
height read from its webp header. Only the two entries, `main.tsx` and `entry-server.tsx`, import
it; the page takes the cards as props. An ambient declaration types it, so the typecheck passes on
a fresh clone. Brief 03 builds it.

## Ports and settings

- Dev: the API on 8815, the page on 5182 at `http://localhost:5182/` (`strictPort`). Vite's dev
  server forwards `/gatehouse-api` to the API without stripping it: the API strips its own prefix
  and answers `/v1/health` with or without it. `npm run preview -w @gatehouse/web` serves the built
  page on 4182; where it shows the page is a finding of brief 01. Gazette has 8814, 5181 and 4181.
- `GATEHOUSE_ORIGIN`, build time: the domain's origin, used to turn `host:<name>` links into
  addresses. vps-deploy passes it; `npm run build` fails without it; the dev server falls back to
  `https://example.org`, so a host link in dev shows as a placeholder. Path links stay relative.
- The API reads `PUBLIC_ORIGIN` (written by vps-deploy's `useWard`), the five `WARD_OIDC_*`
  settings, its prefix (`/gatehouse-api`) and its data folder (`/data` in the container).

## Looks and modes

- `<html>` carries `data-look` (`profile`, `terminal`, `ninety-six`) and `data-theme` (`light`,
  `dark`, `system`). `data-theme` holds the mode: the `base-ui` skill's rule 14 names the
  attribute, and the page and its docs still say mode ([decisions.md](decisions.md)). The HTML says
  `profile` and `light`: a first visit is light, and the page is right with scripting off.
- An inline script in `web/index.html`'s `<head>` reads `gatehouse.look` and `gatehouse.mode` from
  localStorage and sets both attributes before the first paint. A `?look=` or `?mode=` query
  parameter overrides the stored pick for one load without storing it, for shots and sloplint runs.
  The same script marks `<html>` as scripted, so the stylesheet can show what only works without
  scripts (the See more text).
- React renders inside the root element, never `<html>`, so the attributes stay the head script's.
  What React reads from localStorage or the address (the stored look and mode, the owner hint) it
  reads after mount, never during render: the HTML was rendered without it, and the first client
  render must match the HTML.
- The tokens live in the one stylesheet, per look, light and dark as the `base-ui` skill's theme
  reference sets them; `system` follows `prefers-color-scheme`. Tailwind's `@custom-variant` gives
  `dark` and one variant per look; a look's skin is those variants on the components' classes.
- The mode control, the look switcher and the filters are Base UI `RadioGroup`s (rule 16: one is
  always chosen, and nothing is saved to the server).
- Fonts are self-hosted with `@fontsource`. A browser downloads a font only when rendered text uses
  it, so a look's fonts load only in that look; checked in the network panel.

## The owner part

1. The footer's sign-in sets the owner hint (`gatehouse.owner` in localStorage), then posts to
   `/gatehouse-api/auth/ward/start` and sends the browser to the URL it answers.
2. Ward signs the owner in and calls back to the API, which sets the `gatehouse_session` cookie
   (path `/gatehouse-api`) and sends the browser to `/`.
3. After mount, only when the hint is set, the page calls `GET /gatehouse-api/v1/owner/cards`. A
   visitor never calls the API, so the API sleeps unless the owner wakes it.
4. 200: the page renders each owner card with the same Card component and adds it to Behind the
   scenes, after the public cards. 401: the page drops the hint. 403: signed in, but not the owner.
   `?ward_error=<code>` on the return also drops the hint.
5. Sign-out posts to `/gatehouse-api/auth/logout`, which ends Gatehouse's session only, and drops
   the hint.

The API's owner route needs the `admin` role, which the owner's Ward grant carries. No local
accounts and no seed: Sign in with Ward is the only way in.

## The build guard

After the prerender, `npm run build` fails when any file in `web/dist/` (HTML, scripts, styles, and
source maps if any are written) holds an owner-part card's link, as written (`host:vault`) or
resolved, its blurb, its See more text, or its id in the form the Card component writes it in HTML
or an object literal writes it in a script. Its test plants a leak in a script as well as in the
HTML (brief 03).

## The container

`gatehouse-api` on loopback 8815, data at `/srv/gatehouse-api/data` mounted as `/data`, health at
`GET /v1/health`. It sleeps behind Sablier when idle; the page shows a waking state while the first
request waits. `docs/owner-setup.md` (brief 07) is what vps-deploy's stack reads.
