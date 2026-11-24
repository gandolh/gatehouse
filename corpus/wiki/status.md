---
summary: Where Gatehouse stands, per area, as of 2026-11-24. The skeleton (brief 01), the card list with its schema and live check (brief 02) and the public page in Profile with DESIGN.md, the card module and the build guard (brief 03), Terminal with the look switcher (brief 04) and Ninety-six (brief 05) are built; the owner part's page side, built against a fake API, was approved by the owner (brief 06); the owner API with Sign in with Ward only, the owner route, its container and docs/owner-setup.md are built (brief 07); the page and the API were walked together against the local Ward, every state matching, and wait at Ready for deploy (brief 08); the README and docs are written (brief 09). Each area with the brief that builds it; what waits outside the repo (vps-deploy's brief 34 for the first deploy); the owner's steps in order.
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
  `npm run dev:fake -w @gatehouse/web` ([owner-part.md](owner-part.md)); the owner approved the screens and
  the stacked footer. The API's side built 2026-11-24 (brief 07): Sign in with
  Ward only (checked: no local sign-in, the grant's role copied at the first sign-in), `GET
  /v1/owner/cards` for `admin` with the three owner cards, the vendored ward-auth (1.2.0 since brief 10), and the
  container (`docker compose ... config` parses; the image not built yet) ([sign-in.md](sign-in.md)).
  Walked end to end on 2026-11-24 (brief 08): the real API and the local Ward, an owner, a user with another grant
  and one with none, Ward down with and without a live session. Every state matched brief 06's screens; a 401 whose
  `reason` says Ward couldn't vouch for the session now reads as Ward unreachable with the hint kept
  ([sign-in.md](sign-in.md)). Ready for deploy, with vps-deploy's brief 34. A cancel at Ward reads as a cancel since
  2026-11-24 (brief 10): ward-auth 1.2.0 re-vendored, "Sign-in cancelled." as a quiet line
  ([owner-part.md](owner-part.md)).
- **README and docs**: done 2026-11-24 (brief 09): `README.md`, `docs/` (getting started, architecture, design, an index) and four shots in `docs/images/` taken from the page with the fake API.
- **Deploy**: vps-deploy's brief 34 serves the page at `/`, its files, the API and checks the card
  list against the stacks. Written 2026-11-24, not built; its spec is `docs/owner-setup.md` (brief 07).

## Waiting outside the repo

- vps-deploy's brief 34, for the first deploy.

## Owner steps, in order

1. After vps-deploy's brief 34: the rollout from vps-deploy, which registers the Ward
   client, grants the owner `admin`, builds the page with the origin and starts the API. Grant
   `admin` itself, never another role first: the role is copied once, at the first Owner sign-in
   (`docs/owner-setup.md`, section 6). Then open the root of the domain, press Owner sign-in in the
   footer, and check the three owner cards join Behind the scenes.
