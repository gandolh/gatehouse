---
summary: Where Gatehouse stands, per area, as of 2026-11-24. Nothing built; the repo holds the approved design, the card list, the corpus and briefs 01-09. Each area with the brief that builds it; what waits outside the repo (a local Ward client entry for brief 08, vps-deploy's brief 34 for the first deploy); the owner's steps in order.
updated: 2026-11-24
---

# Status

_2026-11-24._ **Nothing is built.** The repo holds the approved design (`design/`), the card list
(`content/cards.json` and 25 pictures), this corpus, and briefs 01 to 09. It has no remote.

## By area

- **Skeleton and harness**: brief 01's first run stopped before its first commit on 2026-11-24,
  when the page moved from Astro to React; its uncommitted work is in the tree for the next run.
- **The card list**: seeded from the sketches' fixture, 38 cards in 5 sections, 4 in the owner part
  ([card-list.md](card-list.md)). No schema yet; the Mercatus picture still shows the old brand, and
  no access label has been checked against the live site (brief 02).
- **The page**: a React page on Vite, rendered at build time. Profile (brief 03), the look
  switcher and Terminal (brief 04), Ninety-six (brief 05). Not started; the sketches in `design/`
  are the spec.
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
