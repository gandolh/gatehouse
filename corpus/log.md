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

## [2026-11-24] done | Brief 02: the card list's schema, links, pictures and live check

Added the zod schema, `loadCards` (behind `@gatehouse/shared/load`, so the barrel stays free of
`node:`), `publicCards` / `ownerCards`, `resolveLink` and `displayAddress` to `shared`, with tests for
every rule in [wiki/card-list.md](wiki/card-list.md). `cards.json` was formatted with Prettier (only the filter
labels changed layout) and left `.prettierignore`. The Mercatus picture was retaken logged out, cropped above the
page's cookie notice. All 33 non-GitHub access labels were read live and held, so none changed; the
table is in the card-list page.

## [2026-11-24] done | Brief 03: the public page in Profile

Built the page in Profile from sketch A: `DESIGN.md` as the locked system for all three looks; a Vite plugin that
gives the page the public cards only (links resolved, pictures fingerprinted with their sizes); the header, section
row, sections, cards and footer on Base UI radio groups and Tailwind tokens, with Terminal's and Ninety-six's
elements in the markup, hidden; the head script with `data-look`, `data-theme` and `data-scripted`; hydration that
reads them only after mount, tested in jsdom with the real head script; and a build guard over every built file.
The open question is answered: Base UI's Collapsible can't show its text without scripts, so See more is a
hand-built disclosure. Geist comes from the variable Fontsource packages, so headings draw at 650 where the renders
drew 700. Findings in [wiki/page.md](wiki/page.md).


## [2026-11-24] change | The Grafana card leaves the card list

The owner took monitoring (Prometheus, Grafana and the exporters) off the box on 2026-11-24, until a
stronger machine exists (vps-deploy's briefs 35 and 36). The `grafana` card, one of the four
owner-part cards, would point at a host the box no longer serves, and vps-deploy's card check would
flag it. It is gone from `content/cards.json`: 37 cards, and the owner part is brief-board, the vault
and the mail admin. The tests, card-list.md, overview, decisions, glossary and brief 06 follow.

## [2026-11-24] build | Brief 04: the look switcher and Terminal

The footer's look switcher (a Base UI `RadioGroup`, the pick kept as `gatehouse.look`) and the Terminal look:
tokens under `data-look="terminal"`, the skin as the `terminal:` variant on the components, IBM Plex Mono and Sans
from `@fontsource` (latin and latin-ext only). Ahead of it, brief 03's design-critic fixes: headings at 700 with
DESIGN.md's weight line corrected, the switch pressed from the first frame (`pressed` variants and a
`data-hydrated` mark), a Geist preload and a favicon. The preload is an inline script that adds the link only in
Profile, so Terminal never fetches Geist. Findings in [wiki/page.md](wiki/page.md).

## [2026-11-24] build | Brief 05: Ninety-six

The third look: tokens under `data-look="ninety-six"`, the skin as the `ninety-six:` variant, bevels as theme shadows
over colour tokens, Pixelify Sans, Arimo and Cousine from `@fontsource` (latin and latin-ext), a 3 px focus ring.
Only its own fonts download in it. sloplint clean in light and dark. Findings in [wiki/page.md](wiki/page.md).

## [2026-11-24] build | Brief 06: Owner sign-in and the owner part, against a fake API

The page's side of the owner part: Owner sign-in in the footer (the look's quiet button), the owner's cards in Behind
the scenes from the API's answer (drawn by the same Card, counted by the section, the filters and Terminal's item
count), and the states (waking, signed in, refused, Ward unreachable, not the owner, failed, signed out again). The
answer's schema and `ownerCardsAnswer` live in `shared` for brief 07's route. The calls load on demand, so a visitor
downloads neither them nor zod, and a visitor's page makes no API request. A dev-only fake API answers the four
routes (`GATEHOUSE_FAKE`, `npm run dev:fake -w @gatehouse/web`). Ahead of it, briefs 04 and 05's design-critic fixes
(Ninety-six's inline label and bold primary, Terminal's full-bleed row and spacing, compact sections). The brief is in
done/ while its ticket waits at Ready for test for the owner's judgement and a question on the footer's layout.
Findings in [wiki/owner-part.md](wiki/owner-part.md) and [wiki/looks.md](wiki/looks.md).

## [2026-11-24] build | Brief 07: the owner API and its container

Sign in with Ward as the only way in, checked first: with no local account the API starts and local sign-in fails
for any name, and a first Ward sign-in makes the user with the grant's role, copied once (Ward refuses a user with
no grant, so the stuck case is a first sign-in under another role). ward-auth 1.1.0 vendored in `server/vendor/ward/`
(sums checked); the session guard and the library's routes under `/auth`; `GET /v1/owner/cards` answers `admin` the
three owner cards with their links resolved against `PUBLIC_ORIGIN`. The container (`gatehouse-api` on 127.0.0.1:8815,
data at `/data`), not built here; `docs/owner-setup.md` is vps-deploy's spec. The open question on Ward-only
sign-in is closed. Findings in [wiki/sign-in.md](wiki/sign-in.md).

## [2026-11-24] decision | The owner approved the design; vendored Ward joins the naming exceptions

The owner approved brief 06's screens: the look switcher, the Owner sign-in entry, the owner part's states and the
stacked footer stay as built ([open-questions.md](wiki/open-questions.md)). Brief 07's board question answered by
the controller: `server/vendor/ward/` joins `CLAUDE.md`'s exceptions to the no-account-names rule, because its
banners and LICENSE name the library's source repo and its SHA256SUMS keep the copy byte-identical, as in every
other app that vendors it.

## [2026-11-24] build | Brief 08: the owner part walked end to end against the local Ward

The page and the real API (`npm run dev`) against the local Ward, with three throwaway Ward users: the owner
(`admin`), a user with another grant, and one with none. Every state brief 06 drew matched in Profile at 1280 x 800:
signed in with the three owner cards, a reload (the session held; a reload past 30 s made the first real Ward check),
sign-out, not the owner (403), the no-grant refusal (Ward calls back with `access_denied`), Ward unreachable on a
fresh sign-in, and no request to `/gatehouse-api` without the hint, even with a session cookie. One difference, fixed:
with a live session and Ward down, the owner route answers 401 with `reason: ward_unavailable` and keeps the session;
the page now shows the Ward unreachable words with Try again and Sign out and keeps the hint, where it used to drop
it without a word. A cancel at Ward reads as the refusal (both arrive as `access_denied`). Ready for deploy with
vps-deploy's brief 34. Findings in [wiki/sign-in.md](wiki/sign-in.md).
