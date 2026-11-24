# Log

## [2026-11-23] decision | The page at the root, grilled and sketched

The owner asked for a page at the root of the domain listing every app as grouped cards, "something
similar to my GitHub profile", "dev-ish, or maybe something retro 80-90s". A grill settled the
scope (what the server answers, plus five repos On GitHub), the sections, See more inside the card,
nothing live, English only, the access labels, and that the owner's four hosts show only after Sign
in with Ward, from an API. That split made the page a repo of its own, named Gatehouse. Three
directions were sketched (Profile, Terminal, Ninety-six), critiqued and fixed; the owner chose to
ship all three, Profile by default. See [wiki/decisions.md](wiki/decisions.md).

## [2026-11-24] start | Repo, corpus and briefs 01-09

The plan of 2026-11-24 checked the facts against vps-deploy (every card's link matches a served
route; showcase is gone; the Mercatus card takes its new name) and made the technical calls: a
static Astro page, the page at exactly `/` with its files under `/gatehouse/`, one card list, a
Fastify API on 8815 behind Sablier, visitors never calling it, and a build guard against owner
cards in the HTML. The repo was started with the cleaned design references in `design/`, the card
list in `content/cards.json` with its pictures, this corpus, and briefs 01 to 09. vps-deploy's
brief 34 covers the deploy side. Nothing built.

## [2026-11-24] decision | A first visit opens in light

The sketches draw the mode control with System pressed, and the planner left the first visit's
mode open. The owner's estate-wide answer of 2026-11-10 already settles it: every app with a
Light / Dark / System switch opens a first visit in light (the `base-ui` skill's rule 14), with
3D-sandbox and the client sites as the only exceptions. Brief 03 now builds light first, and the
question left `open-questions.md`. Found in the controller's design read of briefs 03 to 06.

## [2026-11-24] decision | The page stack moves from Astro to React (owner, 2026-11-24)

The owner asked for React instead of Astro. Brief 01's first run, written for Astro, was stopped
before its first commit; its uncommitted work stays in the tree for the next run. The page is now
React 19.2.8 on Vite 8.3.5 with Base UI 1.9.0 and Tailwind 4.3.5, the estate's pins, rendered to
HTML at build time (client build, SSR build, a prerender script) and hydrated, so every public card
and its See more text still work with scripting off. What changed:

- `wiki/decisions.md`: "A static Astro page, no React" is superseded by "A React page on Vite,
  rendered at build time". A new entry: `data-theme` holds the mode, as the `base-ui` skill's rule
  14 names it, and the word stays mode. The glossary's mode entry says so.
- `wiki/architecture.md`: Vite's `base` (build only) in place of Astro's `assetsPrefix`; the build
  steps and hydration; a public-only card module, so the owner cards can't reach the scripts; the
  path check's scope; the build guard reading scripts as well as HTML; the owner part rendered by
  the same Card component after mount, in place of the `<template>`.
- `wiki/open-questions.md`: Vite's base and the prerender (brief 01), and See more with scripting
  off under Base UI (brief 03). `routing.md`: the `base-ui` skill, the house-style shape for React.
- Briefs: 01 (React on Vite, the pins, the path check, strict `check-base-ui`, nothing Astro left,
  the root `CLAUDE.md` rewritten), 02 (a browser-safe barrel, and formatting `content/cards.json`),
  03 (React components on Base UI, the card module, hydration, See more, the guard over every
  built file), 04 and 05 (radio groups and look variants), 06 (the owner cards through the Card
  component, the answer's schema in `shared`), 07 (no Ward React hooks; the answer's schema). 08
  and 09 were checked and needed nothing.
- vps-deploy's brief 34 now names the page as a React page rendered at build time.

## [2026-11-24] done | Brief 01: the skeleton and the house-style harness

Built for the React page after the stack change: the three workspaces with the house-style 1.3.0
harness (`check-base-ui` strict from the start), the API's settings, error plugin and
`GET /v1/health`, and a placeholder page in React on Vite, prerendered into `web/dist/index.html`
and hydrated. Step 1 settled the open question on a scratch app: `base: "/gatehouse/"` puts every
file the page loads under `/gatehouse/`, the SSR render names the client build's files, and no
`public/` folder is needed. The preview needs the base too, so it applies to the build and the
preview, and the preview shows the page at `/gatehouse/`. The build ends with a path check that
fails on any URL outside the prefix. Node 24.2 is the floor, for `import.meta.main`. Open: the
vendored house-style LICENSE holds the account name, asked on the board. Findings in
[wiki/architecture.md](wiki/architecture.md) and [wiki/open-questions.md](wiki/open-questions.md).
