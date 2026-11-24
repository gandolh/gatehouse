---
summary: Where Gatehouse stands, per area, as of 2026-11-24. The skeleton is built (brief 01): the workspaces, the harness, the API's health route and a placeholder page prerendered with its files under /gatehouse/; the rest is not started. Each area with the brief that builds it; what waits outside the repo (a local Ward client entry for brief 08, vps-deploy's brief 34 for the first deploy); the owner's steps in order.
updated: 2026-11-24
---

# Status

_2026-11-24._ **The skeleton is built** (brief 01). Beside it the repo holds the approved design
(`design/`), the card list (`content/cards.json` and 25 pictures), this corpus, and briefs 02 to 09.
It has no remote.

## By area

- **Skeleton and harness**: done 2026-11-24 (brief 01). Three workspaces and the house-style 1.3.0
  harness (`npm run check` green, `check-base-ui` strict); the API's settings and `GET /v1/health`;
  a placeholder React page, prerendered at build time, whose files the path check holds under
  `/gatehouse/`. One question on the board: the vendored house-style LICENSE holds the account
  name.
- **The card list**: seeded from the sketches' fixture, 38 cards in 5 sections, 4 in the owner part
  ([card-list.md](card-list.md)). No schema yet; the Mercatus picture still shows the old brand, and
  no access label has been checked against the live site (brief 02).
- **The page**: a React page on Vite, rendered at build time; a placeholder heading so far. Profile
  (brief 03), the look switcher and Terminal (brief 04), Ninety-six (brief 05). Not started; the
  sketches in `design/` are the spec.
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
