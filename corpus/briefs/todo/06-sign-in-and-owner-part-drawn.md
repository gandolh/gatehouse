# Task 06: The sign-in entry and the owner part, drawn against a fake API

**Depends on:** 05.

**Runs before:** 08.

**Builder:** Opus ([routing.md](../../routing.md)).

**Visual work, and the owner judges it.** The sign-in entry and the signed-in page were never drawn.
This brief draws them in all three looks, in the language `DESIGN.md` already sets, and ends at
Ready for test so the owner judges the screens.

## Context

Four cards (the vault, Grafana, the mail admin, brief-board) are the owner part: they show only
after the owner signs in with Ward, and they come from the API, never from the public HTML
([decisions.md](../../wiki/decisions.md)). The flow, the owner hint and the API calls are in
[architecture.md](../../wiki/architecture.md), "The owner part". The real API arrives in brief 07;
this brief builds the page's side against a fake that answers the same way, so brief 08 only swaps
the fake for the real thing.

The API's answers, from Ward's library (ward-auth 1.1.0) as brief 07 will vendor it:

- `POST /gatehouse-api/auth/ward/start` answers `{ url }`; the page sends the browser there.
- After Ward, the browser lands on `/`, or on `/?ward_error=<code>` when the sign-in failed.
- `GET /gatehouse-api/v1/owner/cards`: 200 with the owner cards; 401 `unauthorized` with no session;
  403 `forbidden` when the session isn't the owner's (no `admin` role).
- `POST /gatehouse-api/auth/logout` ends Gatehouse's session.

Read the `ward_error` codes from the library itself before drawing: Lantern vendors the same version
(`server/vendor/ward/ward-auth.d.ts`, the `WardSignInError` notes and the Ward routes table, and the
codes in `ward-auth.js`), or Ward's `shared-library/` source in the `wzd_auth` repo. Read only;
never edit either repo.

## Files you OWN

- `web/src/`: the footer's sign-in entry, the owner part's template and script, the states' words
- `web/scripts/` (new): the dev-only fake API, and a `dev:fake` script in `web/package.json`
- Corpus: `corpus/wiki/page.md`, `corpus/wiki/status.md`, `corpus/log.md`

## Files you must NOT touch

- `design/`, `content/`, `server/`, other repos.
- `DESIGN.md`, except to add the new states' rules in its controls section.

## Steps

1. **The fake API**, `web/scripts/fake-owner-api.*`, on 127.0.0.1:8815 so the dev proxy reaches it.
   It answers the four routes above. A scenario, picked with an environment variable, sets what
   the owner route and the start answer: `owner` (200 with the four cards from `ownerCards` and the
   resolver in `shared`), `slow` (the same after 4 s, for the waking state), `none` (401),
   `not-owner` (403), `ward-down` (the start answers 503 `ward_unavailable`), and `refused` (the
   start answers a URL back to `/?ward_error=` with a refusal code). It never ships: it is outside
   `src/`, and the build guard still passes.
2. **The sign-in entry** in the footer's slot: words that tell a visitor it is for the owner (for
   example "Owner sign-in"), in each look's quiet link or button style. Pressing it sets
   `gatehouse.owner`, posts the start, and sends the browser to the answered URL.
3. **The owner part.** A `<template>` the Card component renders with no card data in it. On load,
   only when `gatehouse.owner` is set, the script calls the owner route and, on 200, clones one card
   per answer into Behind the scenes, after the public cards, with the same markup, access label and
   secondary Open. The section's count, the filter counts and the live region follow.
4. **The states**, each drawn in all three looks, light and dark, on desktop and phone:
   - signed out: the footer entry, nothing else changes;
   - waking: the owner route is slow (the container sleeps behind Sablier); a quiet note in Behind
     the scenes says the owner's cards are on their way;
   - signed in: the four cards in place, and the footer reads signed in with a Sign out button;
   - refused: back from Ward with a refusal code; a short message near the footer entry, hint
     dropped;
   - Ward unreachable: the start fails or `ward_error=ward_unavailable`; a message that says to try
     later, hint dropped;
   - not the owner: the owner route answers 403; a message that these cards are the owner's, and
     Sign out;
   - signed out again: Sign out posts the logout, drops the hint, removes the owner cards.
   A 401 drops the hint quietly. Every message is plain words, reachable by keyboard, announced in a
   live region, and has no `ward_error` code in it. Clean `ward_error` out of the address bar after
   reading it.
5. **Visitors never call the API.** With no hint set, a page load makes no request to
   `/gatehouse-api` (checked in the network panel).
6. **Shots** for the owner, outside the repo: each state in Profile at 1280 x 800 light and 390 x 844
   dark, plus signed in at 1280 x 800 in Terminal and in Ninety-six. Name the folder in the test
   notes.
7. The corpus: `page.md` (the owner part, the states, the fake API), `status.md`, a `log.md` entry.

## Acceptance

- [ ] Each scenario of the fake API shows its state in all three looks; the shots in step 6 exist.
- [ ] With no hint, no request goes to `/gatehouse-api`.
- [ ] The built `web/dist` holds no owner card and no fake API code: the guard passes, and a grep
      for the fake's file name in `web/dist` finds nothing.
- [ ] Every new control works by keyboard, with a visible focus ring in each look.
- [ ] `npm run check` and `npm run build` pass; `bash corpus/lint.sh` passes.
- [ ] End move `ready_for_test`, with test notes: how to start the page on each scenario, and the
      shots' folder.

## Owner steps

- Judge the sign-in entry, the look switcher and the seven states from the shots or the fake
  server. Say what to change on the ticket.

## Owner decisions

- Settled 2026-11-23: the owner part shows only after Sign in with Ward, from the API; the look
  switcher and the sign-in sit in the footer.
- Settled 2026-11-24 (the plan): sign-out ends Gatehouse's session only; visitors never call the
  API.
- Open, taste: how the sign-in entry reads, and the look switcher (both judged here).
