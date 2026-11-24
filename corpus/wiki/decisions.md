---
summary: Locked calls for Gatehouse, settled with the owner on 2026-11-23 and planned on 2026-11-24, each with what was rejected and why. The owner's four hosts show only after Sign in with Ward, from an API, never in the public HTML; Gatehouse is its own repo with a vps-deploy stack, not a page inside vps-deploy; three looks ship, Profile by default, look and mode stored apart; the page answers exactly / with its files under /gatehouse/ so unknown paths keep the plain 404; a React page on Vite, rendered to HTML at build time and hydrated (the owner's call, superseding the static Astro page the same day); data-theme holds the mode, the word stays mode; one card list read by the page, the API and vps-deploy's check; visitors never call the API (the owner hint). Read before proposing to change any of these.
updated: 2026-11-24
---

# Decisions

Each entry passed three tests: hard to reverse, surprising without context, and a real trade-off.
Changing one needs an explicit revisit and a [log.md](../log.md) entry. The first three were the
owner's, in the grill of 2026-11-23; the rest are technical calls from the plan of 2026-11-24,
reported to the owner, except the React page, which was the owner's call that day.

## The owner's hosts show only after Sign in with Ward, from an API
_2026-11-23, owner._ Visitors see the public list. The owner-only hosts (the vault, the mail admin,
brief-board; Grafana until monitoring left the box on 2026-11-24) appear only after the owner signs in with Ward, and they come from a small API,
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
_2026-11-24._ **Status: superseded by "A React page on Vite, rendered at build time" below**, the
owner's call the same day. Kept for the record.
Astro 7.3.5, as presentation-sites pins it, builds plain HTML with every public card in
it, so the page works with scripting off and costs no framework runtime. The filters, See more, the
look and mode controls and the owner part are a small script. Tailwind 4 as in the estate's other
sites.
Rejected: a React page on Vite like the estate's apps (a runtime and a blank page without scripts,
for a page that is mostly a list).

## A React page on Vite, rendered at build time
_2026-11-24, the owner's call._ The owner asked for React instead of Astro. The page is React
19.2.8 on Vite 8.3.5 with Base UI 1.9.0 and Tailwind 4.3.5, the estate's pins (Lantern, Gazette).
The build renders it to HTML: a client build, an SSR build of `entry-server`, and a small script
that writes the rendered page into `web/dist/index.html`. The browser hydrates it. Every public
card and its See more text are in the HTML, so the page still works with scripting off. The page
imports a public-only card module made at build time, never `content/cards.json`, and the build
guard reads the scripts as well as the HTML.
Rejected: a client-only single-page app (a blank page without scripts, and the owner cards one
import away from the bundle), and Astro with React islands (the owner asked for React instead of
Astro).
Cost accepted: a React runtime on a page that is mostly a list; a prerender step; and a rule that
nothing read from localStorage or the address (the stored look and mode, the owner hint) is read
during render, only after mount.
Supersedes: "A static Astro page, no React".

## `data-theme` holds the mode; the word stays mode
_2026-11-24._ With React and Base UI, the `base-ui` skill applies in full. Its rule 14 keys the
`dark` variant off `data-theme` on `<html>`. Its checker doesn't test that; review does, and an app
that bends it records an exception. Gatehouse follows the rule: `<html data-theme>` carries light,
dark or system, as the skill's theme reference sets it, next to `data-look`. "Mode" stays the word
in the glossary, the page's labels and the docs; `data-theme` and the `dark` variant are code names
only. The stored key stays `gatehouse.mode`.
Rejected: `data-mode` with a `conventions.json` exception (the skill's boot script, store and
`@custom-variant dark` would each need translating, and every reviewer would meet a second name for
one thing).
Cost accepted: one code name that differs from the glossary's word.

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
Revisited 2026-11-24 (brief 08's walk): a 401 whose reason is `ward_unavailable` or `ward_misconfigured`
keeps the hint, because the API keeps the session while Ward is down; the page shows Ward unreachable with
Try again and Sign out. Any other 401 still drops it.
Cost accepted: an owner on a new browser presses sign in once.
