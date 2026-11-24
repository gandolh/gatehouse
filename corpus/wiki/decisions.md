---
summary: Locked calls for Gatehouse, settled with the owner on 2026-11-23 and planned on 2026-11-24, each with what was rejected and why. The owner's four hosts show only after Sign in with Ward, from an API, never in the public HTML; Gatehouse is its own repo with a vps-deploy stack, not a page inside vps-deploy; three looks ship, Profile by default, look and mode stored apart; the page answers exactly / with its files under /gatehouse/ so unknown paths keep the plain 404; a static Astro page with no React; one card list read by the page, the API and vps-deploy's check; visitors never call the API (the owner hint). Read before proposing to change any of these.
updated: 2026-11-24
---

# Decisions

Each entry passed three tests: hard to reverse, surprising without context, and a real trade-off.
Changing one needs an explicit revisit and a [log.md](../log.md) entry. The first three were the
owner's, in the grill of 2026-11-23; the rest are technical calls from the plan of 2026-11-24,
reported to the owner.

## The owner's hosts show only after Sign in with Ward, from an API
_2026-11-23, owner._ Visitors see the public list. The owner-only hosts (the vault, Grafana, the mail
admin, brief-board) appear only after the owner signs in with Ward, and they come from a small API,
never from the public HTML.
Rejected: a page for visitors only (the owner wants one place for both), and a public launcher that
lists everything (it tells strangers what to aim at).
Cost accepted: a service, a Ward client and a repo instead of a static file.
Limit: the hosts' names are already public in the certificate transparency logs, since every Let's
Encrypt certificate is logged. The split keeps them off the page; it does not make them secret.

## Gatehouse is its own repo, not a page inside vps-deploy
_2026-11-23._ The sign-in split needs a service, and vps-deploy keeps a service's Dockerfile and
compose file in the project's own repo, so Gatehouse is a repo with a vps-deploy stack. vps-deploy
checks Gatehouse's card list against its stacks, so a removed app can't stay on the page.
Rejected: a static page generated inside vps-deploy, the first proposal, withdrawn once the sign-in
split was chosen.

## Three looks, Profile by default
_2026-11-23, owner._ The page ships all three sketched looks: Profile (the default), Terminal and
Ninety-six. A visitor picks one with a switcher, and the pick is kept in localStorage. Mode (light,
dark, system) is a separate control, also kept. Both apply before the first paint. Ninety-six keeps
the teal ground as drawn; the slate ground only on the owner's word.
Rejected: one look only.
Cost accepted: one markup carrying three sets of tokens and skin rules, kept in step.

## The page answers exactly `/`; everything else keeps the plain 404
_2026-11-24._ The page is served at `/` and nowhere else. Its files live under `/gatehouse/`, the API
under `/gatehouse-api/`, and `/gatehouse/` itself is a 404. The owner asked on 2026-10-27 that the
404 page stop listing routes, and it stays plain.
Rejected: the page at `/gatehouse/` with `/` redirecting to it (two addresses for one page), and a
catch-all that serves the page for every unknown path (a typo would land on the index, not a 404).
Cost accepted: vps-deploy gains a route type that serves one file at exactly `/`.

## A static Astro page, no React
_2026-11-24._ Astro 7.3.5, as presentation-sites pins it, builds plain HTML with every public card in
it, so the page works with scripting off and costs no framework runtime. The filters, See more, the
look and mode controls and the owner part are a small script. Tailwind 4 as in the estate's other
sites.
Rejected: a React page on Vite like the estate's apps (a runtime and a blank page without scripts,
for a page that is mostly a list).

## One card list for the page, the API and vps-deploy's check
_2026-11-24._ `content/cards.json` holds every card, public and owner. The page build renders the
public part, the API serves the owner part, and vps-deploy's check fails when a card points at
nothing served. The file is the only place the GitHub links and the wordmark are written; the
domain arrives at build time.
Rejected: a list per reader (they drift), and the owner cards in the API's code (the check couldn't
see them).

## Visitors never call the API
_2026-11-24._ The page calls the API only when the browser holds the owner hint, set when the owner
presses sign in and dropped on sign-out, a 401 or a `ward_error`. The API sleeps behind Sablier, and
a visitor's load never wakes it. Sign-out ends Gatehouse's session only, not the owner's Ward
session.
Rejected: a session check on every load (every visitor would wake the container, and the page would
wait on it).
Cost accepted: an owner on a new browser presses sign in once.
