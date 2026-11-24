# Index

The front door to Gatehouse's wiki and work tracker. Rules: [CLAUDE.md](CLAUDE.md). History:
[log.md](log.md). Routing: [routing.md](routing.md). Triage on the summary lines below and open at
most two or three pages.

## Wiki

<!-- BEGIN CATALOG -->

- [wiki/architecture.md](wiki/architecture.md) - How Gatehouse is put together, as planned on 2026-11-24 (nothing built yet). Three npm workspaces (shared card schema and link resolver, a Fastify 5 API, a static Astro 7.3.5 page with Tailwind 4 and no React); the addresses (the page at exactly /, its files under /gatehouse/ through Astro's assetsPrefix, the API under /gatehouse-api/, /gatehouse/ itself a 404); ports 8815 and 5182; the settings GATEHOUSE_ORIGIN, PUBLIC_ORIGIN and the data folder; looks and modes as data attributes set before first paint; fonts per look; the owner part (the owner hint, the API call, the template, sign-out); the build guard; the container behind Sablier.
- [wiki/card-list.md](wiki/card-list.md) - The card list in content/cards.json, as seeded on 2026-11-24 from the approved sketches' fixture. Its shape (site, access labels, five sections, 38 cards); each card's fields; the three link forms (/path/, host:<name>, an https address off the domain) and how each is resolved and shown; the access label against the part (34 public cards, 4 in the owner part); which filter takes which label; who reads the file (the page build, the API, vps-deploy's check); the rules the schema and its tests hold.
- [wiki/decisions.md](wiki/decisions.md) - Locked calls for Gatehouse, settled with the owner on 2026-11-23 and planned on 2026-11-24, each with what was rejected and why. The owner's four hosts show only after Sign in with Ward, from an API, never in the public HTML; Gatehouse is its own repo with a vps-deploy stack, not a page inside vps-deploy; three looks ship, Profile by default, look and mode stored apart; the page answers exactly / with its files under /gatehouse/ so unknown paths keep the plain 404; a static Astro page with no React; one card list read by the page, the API and vps-deploy's check; visitors never call the API (the owner hint). Read before proposing to change any of these.
- [wiki/glossary.md](wiki/glossary.md) - Gatehouse's vocabulary, settled in the grill of 2026-11-23 and the plan of 2026-11-24. Look (Profile, Terminal, Ninety-six) and mode (light, dark, system), never "theme"; access label (Public, Sign-in, Owner only, Docs only, On GitHub), never status or badge; part (public, owner) and the owner part; owner hint; card, section and compact section; See more.
- [wiki/open-questions.md](wiki/open-questions.md) - What is still open for Gatehouse as of 2026-11-24, taste kept apart from technical. Taste, for the owner when brief 06 reaches Ready for test - the look switcher in the footer and the sign-in entry, neither drawn, and whether a first visit opens in System or in light. Technical, each checked first by the brief that meets it - whether Astro's assetsPrefix puts every file under /gatehouse/ (01), whether Ward's library runs with no local account and the admin role arrives through the grant (07).
- [wiki/overview.md](wiki/overview.md) - What Gatehouse is and what its first version does, as planned on 2026-11-24. One page at the root of the domain listing every app, site and docs page as cards in five sections, in three looks (Profile by default, Terminal, Ninety-six) with a light, dark or system mode; See more inside each card; the owner's four hosts shown only after Sign in with Ward, from a small API; what is left out (nothing live, no dates); the nine briefs that build it and vps-deploy's brief 34.
- [wiki/status.md](wiki/status.md) - Where Gatehouse stands, per area, as of 2026-11-24. Nothing built; the repo holds the approved design, the card list, the corpus and briefs 01-09. Each area with the brief that builds it; what waits outside the repo (a local Ward client entry for brief 08, vps-deploy's brief 34 for the first deploy); the owner's steps in order.

<!-- END CATALOG -->

## Work

- Where the work stands, per area: [wiki/status.md](wiki/status.md).
- [briefs/todo/](briefs/todo/): open work specs, run in number order.
- [briefs/done/](briefs/done/), [briefs/blocked/](briefs/blocked/) and
  [briefs/superseded/](briefs/superseded/): the rest, kept with their numbers.
- The approved design: the repo's `design/` folder, starting at its `README.md`.
