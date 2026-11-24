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
