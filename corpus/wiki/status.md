---
summary: Where Gatehouse stands, per area, as of 2026-11-24. The skeleton (brief 01), the card list with its schema and live check (brief 02) and the public page in Profile with DESIGN.md, the card module and the build guard (brief 03), and Terminal with the look switcher (brief 04) are built; Ninety-six, the owner part and the docs are not started. Each area with the brief that builds it; what waits outside the repo (a local Ward client entry for brief 08, vps-deploy's brief 34 for the first deploy); the owner's steps in order.
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
  look switcher done 2026-11-24 (brief 04). Next: Ninety-six (brief 05).
- **The owner part**: drawn against a fake API in brief 06, served by the API in brief 07, wired to
  Ward in brief 08. Not started.
- **README and docs**: brief 09.
- **Deploy**: vps-deploy's brief 34 serves the page at `/`, its files, the API and checks the card
  list against the stacks. Written 2026-11-24, not built.

## Waiting outside the repo

- A Gatehouse client in Ward's local seed (the `wzd_auth` repo), with the dev page
  `http://localhost:5182/` and the API prefix `/gatehouse-api`. Brief 08 needs it and stops without
  it.
- vps-deploy's brief 34, for the first deploy.

## Owner steps, in order

1. After brief 06: judge the sign-in entry and the owner part's states on the board (Ready for test).
2. After brief 08 and vps-deploy's brief 34: the rollout from vps-deploy, which registers the Ward
   client, grants the owner `admin`, builds the page with the origin and starts the API.
