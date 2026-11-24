---
summary: How Gatehouse is put together, as planned on 2026-11-24 (nothing built yet). Three npm workspaces (shared card schema and link resolver, a Fastify 5 API, a static Astro 7.3.5 page with Tailwind 4 and no React); the addresses (the page at exactly /, its files under /gatehouse/ through Astro's assetsPrefix, the API under /gatehouse-api/, /gatehouse/ itself a 404); ports 8815 and 5182; the settings GATEHOUSE_ORIGIN, PUBLIC_ORIGIN and the data folder; looks and modes as data attributes set before first paint; fonts per look; the owner part (the owner hint, the API call, the template, sign-out); the build guard; the container behind Sablier.
updated: 2026-11-24
---

# Architecture

Planned on 2026-11-24; the briefs build it. Each point names the brief that settles it, and the
brief's outcome note wins over this page until the page catches up.

## Workspaces

- `shared` (`@gatehouse/shared`): the card list's zod schema, its loader, and the link resolver.
  The page build and the API import it. vps-deploy reads `content/cards.json` on its own and
  imports nothing from here.
- `server` (`@gatehouse/server`): Fastify 5 with the zod type provider, laid out as the
  `code-structure` skill says. Ward's vendored library (`ward-auth` 1.1.0) holds the sessions in
  SQLite through better-sqlite3.
- `web` (`@gatehouse/web`): a static Astro 7.3.5 page (the version presentation-sites pins), no
  React, no client router. Tailwind 4 through `@tailwindcss/vite`, one stylesheet.

The tooling is the `house-style` harness with its Astro recipe (brief 01).

## Addresses

| Address | What answers |
| --- | --- |
| `/` exactly | `web/dist/index.html`, the page |
| `/gatehouse/...` | The page's files: styles, scripts, fonts, pictures. Astro's `build.assetsPrefix` writes these URLs into the HTML. |
| `/gatehouse` and `/gatehouse/` | The plain 404, like every unknown path |
| `/gatehouse-api/...` | The API, with the prefix stripped before Fastify sees it |

There is no `public/` folder, so nothing else lands at the root. Brief 01 first checks that
`assetsPrefix` puts every file under `/gatehouse/`; the fallback is `base: "/gatehouse/"` with a
setting that keeps the page itself at `/`. vps-deploy's brief 34 adds the route that serves
one file at exactly `/`.

## Ports and settings

- Dev: the API on 8815, the page on 5182 at `http://localhost:5182/`. Astro's dev server forwards
  `/gatehouse-api` to the API. Gazette has 8814 and 5181; both were free on 2026-11-24.
- `GATEHOUSE_ORIGIN`, build time: the domain's origin, used to turn `host:<name>` links into
  addresses. vps-deploy passes it; `npm run build` fails without it; `astro dev` falls back to
  `https://example.org`, so a host link in dev shows as a placeholder. Path links stay relative.
- The API reads `PUBLIC_ORIGIN` (written by vps-deploy's `useWard`), the five `WARD_OIDC_*`
  settings, its prefix (`/gatehouse-api`) and its data folder (`/data` in the container).

## Looks and modes

- `<html>` carries `data-look` (`profile`, `terminal`, `ninety-six`) and `data-mode` (`light`,
  `dark`, `system`). The server-rendered HTML says `profile` and `system`, so the page is right
  with scripting off.
- An inline script in `<head>` reads `gatehouse.look` and `gatehouse.mode` from localStorage and sets
  both attributes before the first paint. A `?look=` or `?mode=` query parameter overrides the
  stored pick for one load without storing it, for shots and sloplint runs.
- The tokens live in the one stylesheet, per look and per mode; `system` follows
  `prefers-color-scheme`. Tailwind's `@custom-variant` gives each look and the dark mode a variant.
- `data-mode`, not `data-theme`: the glossary keeps "theme" out. The `base-ui` skill's rule 14 names
  `data-theme` for React apps; this page has no React.
- Fonts are self-hosted with `@fontsource`. A browser downloads a font only when rendered text uses
  it, so a look's fonts load only in that look; checked in the network panel.

## The owner part

1. The footer's sign-in sets the owner hint (`gatehouse.owner` in localStorage), then posts to
   `/gatehouse-api/auth/ward/start` and sends the browser to the URL it answers.
2. Ward signs the owner in and calls back to the API, which sets the `gatehouse_session` cookie
   (path `/gatehouse-api`) and sends the browser to `/`.
3. On load, only when the hint is set, the page calls `GET /gatehouse-api/v1/owner/cards`. A visitor
   never calls the API, so the API sleeps unless the owner wakes it.
4. 200: the page clones each card from a `<template>` the Card component rendered, and adds it to
   Behind the scenes. 401: the page drops the hint. 403: signed in, but not the owner.
   `?ward_error=<code>` on the return also drops the hint.
5. Sign-out posts to `/gatehouse-api/auth/logout`, which ends Gatehouse's session only, and drops
   the hint.

The API's owner route needs the `admin` role, which the owner's Ward grant carries. No local
accounts and no seed: Sign in with Ward is the only way in.

## The build guard

`npm run build` fails when any built file holds an owner-part card's link, blurb, See more text or
id in the form the Card component writes it. The `<template>` holds no card data, only markup.

## The container

`gatehouse-api` on loopback 8815, data at `/srv/gatehouse-api/data` mounted as `/data`, health at
`GET /v1/health`. It sleeps behind Sablier when idle; the page shows a waking state while the first
request waits. `docs/owner-setup.md` (brief 07) is what vps-deploy's stack reads.
