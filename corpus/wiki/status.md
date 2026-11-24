---
summary: Where Gatehouse stands, per area, as of 2026-11-24. The skeleton (brief 01), the card list with its schema and live check (brief 02) and the public page in Profile with DESIGN.md, the card module and the build guard (brief 03), Terminal with the look switcher (brief 04) and Ninety-six (brief 05) are built; the owner part's page side is built against a fake API and waits at Ready for test for the owner's judgement (brief 06); the owner API with Sign in with Ward only, the owner route, its container and docs/owner-setup.md are built (brief 07); the page's wiring to the real API and the README are not started. Each area with the brief that builds it; what waits outside the repo (a local Ward client entry for brief 08, vps-deploy's brief 34 for the first deploy); the owner's steps in order.
updated: 2026-11-24
---

# Status

_2026-11-24._ **The public page is built in Profile** (brief 03), on the skeleton (brief 01) and the card list
(brief 02). Beside it the repo holds the approved design (`design/`), `DESIGN.md`, the card list
(`content/cards.json` and 25 pictures), this corpus, and briefs 04 to 09. It has no remote.

## By area

- **Skeleton and harness**: done 2026-11-24 (brief 01). Three workspaces and the house-style 1.3.0
  harness (`npm run check` green, `check-base-ui` strict); the API's settings and `GET /v1/health`;
  a placeholder React page, prerendered at build time, whose files the path check holds under
  `/gatehouse/`. One question on the board: the vendored house-style LICENSE holds the account
  name.
- **The card list**: done 2026-11-24 (brief 02). 38 cards in 5 sections, 4 in the owner part, now
  checked by a zod schema in `shared` (`loadCards` at `@gatehouse/shared/load`, `resolveLink`,
  `displayAddress`) and its tests. All 33 non-GitHub access labels were read live, logged out, and
  held; the Mercatus picture was retaken ([card-list.md](card-list.md)).
- **The page**: Profile done 2026-11-24 (brief 03): every public card in the prerendered HTML, hydrated; the mode
  control, filters, See more (which shows with scripting off), the phone's sticky section row, Geist self-hosted,
  and a build guard that fails on any owner card in `web/dist/`. `DESIGN.md` locks all three looks' tokens; the
  markup already carries Terminal's and Ninety-six's elements, hidden ([page.md](page.md)). Terminal and the footer
  look switcher done 2026-11-24 (brief 04). Ninety-six done 2026-11-24 (brief 05).
- **The owner part**: the page's side built 2026-11-24 against a fake API (brief 06): Owner sign-in
  in the footer, the owner's cards in Behind the scenes, the states (waking, signed in, refused, Ward
  unreachable, not the owner, failed, signed out again), the contract in `shared`, and
  `npm run dev:fake -w @gatehouse/web` ([owner-part.md](owner-part.md)). Ready for test: the owner
  judges the screens and the footer's layout. The API's side built 2026-11-24 (brief 07): Sign in with
  Ward only (checked: no local sign-in, the grant's role copied at the first sign-in), `GET
  /v1/owner/cards` for `admin` with the three owner cards, the vendored ward-auth 1.1.0, and the
  container (`docker compose ... config` parses; the image not built yet) ([sign-in.md](sign-in.md)).
  The page is wired to it, and to a local Ward, in brief 08.
- **README and docs**: brief 09.
- **Deploy**: vps-deploy's brief 34 serves the page at `/`, its files, the API and checks the card
  list against the stacks. Written 2026-11-24, not built; its spec is `docs/owner-setup.md` (brief 07).

## Waiting outside the repo

- A Gatehouse client in Ward's local seed (the `wzd_auth` repo), with the dev page
  `http://localhost:5182/` and the API prefix `/gatehouse-api`. Brief 08 needs it and stops without
  it.
- vps-deploy's brief 34, for the first deploy.

## Owner steps, in order

1. Now: judge the sign-in entry, the look switcher and the owner part's states on the board (brief
   06, Ready for test), and answer its question on the footer's layout.
2. After brief 08 and vps-deploy's brief 34: the rollout from vps-deploy, which registers the Ward
   client, grants the owner `admin`, builds the page with the origin and starts the API. Grant
   `admin` itself, never another role first: the role is copied once, at the first Owner sign-in
   (`docs/owner-setup.md`, section 6).
