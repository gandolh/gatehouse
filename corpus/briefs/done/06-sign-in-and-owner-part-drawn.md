# Task 06: The sign-in entry and the owner part, drawn against a fake API

**Depends on:** 05.

**Runs before:** 08.

**Builder:** Opus ([routing.md](../../routing.md)).

**Visual work, and the owner judges it.** The sign-in entry and the signed-in page were never drawn.
This brief draws them in all three looks, in the language `DESIGN.md` already sets, and ends at
Ready for test so the owner judges the screens.

## Context

Three cards (the vault, the mail admin, brief-board) are the owner part: they show only
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

- `shared/src/`: the owner answer's schema, if brief 07 hasn't written it
- `web/src/`: the footer's sign-in entry, the owner part (its calls, its states, the owner cards
  through the Card component), the states' words, the hydration test's owner case
- `web/scripts/fake-owner-api.*`: the dev-only fake API, beside brief 01's build scripts, and a
  `dev:fake` script in `web/package.json`
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
   start answers a URL back to `/?ward_error=` with a refusal code). Its owner answer has the shape
   the Card component takes (what the card module gives a public card: links resolved, the address
   from `displayAddress`); that shape's zod schema goes in `shared`, unless brief 07 wrote it
   first, so the page parses the answer with it and the real route declares it. It never ships: it is outside
   `src/`, nothing in `src/` imports it, and the build guard still passes.
2. **The sign-in entry** in the footer's slot: words that tell a visitor it is for the owner (for
   example "Owner sign-in"), in each look's quiet link or button style. Pressing it sets
   `gatehouse.owner`, posts the start, and sends the browser to the answered URL.
3. **The owner part.** After mount, and only when `gatehouse.owner` is set, the page calls the
   owner route and, on 200, renders one card per answer with brief 03's Card component, in Behind
   the scenes after the public cards, with the same access label and secondary Open. The answer is
   parsed with step 1's schema, as the `code-structure` skill's web client parses every answer. The section's count, the filter counts and the live region follow. The hint and
   `?ward_error=` are read after mount, never during render, so the HTML and the first client render
   stay equal: extend brief 03's hydration test with the hint set and a faked 200, and expect no
   recoverable error and the four cards after the answer.
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
6. **Shots** for the owner, outside the repo, each look and mode opened with `?look=` and
   `?mode=`: each state in Profile at 1280 x 800 light and 390 x 844
   dark, plus signed in at 1280 x 800 in Terminal and in Ninety-six. Name the folder in the test
   notes.
7. The corpus: `page.md` (the owner part, the states, the fake API), `status.md`, a `log.md` entry.

## Acceptance

- [ ] Each scenario of the fake API shows its state in all three looks; the shots in step 6 exist.
- [ ] With no hint, no request goes to `/gatehouse-api`.
- [ ] The hydration test passes with the hint set: no recoverable error, and the four owner cards
      rendered by the Card component after the answer.
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

## Outcome (2026-11-24)

Built against the fake API; on the board at Ready for test, for the owner to judge the screens. Details in
[owner-part.md](../../wiki/owner-part.md).

- `shared/src/api.ts`: the owner answer's schema (`ownerCardsSchema`, `image` always null), the start's and the
  error body's, `ownerCardsAnswer` for brief 07's route, and `ownerSection` (the one section the owner part joins).
- `web/src/features/owner/`: the owner hint, a store read after mount, the three calls loaded on demand (a visitor
  downloads neither them nor zod: the main chunk 287.6 kB before, 294.4 kB after), Owner sign-in and its live line
  in the footer, the waking note in Behind the scenes. `web/src/lib/api.ts` is the API client.
- `web/scripts/fake-owner-api.ts` with `GATEHOUSE_FAKE` (owner, slow, none, not-owner, ward-down, refused);
  `dev:fake` and `fake-api` in `web/package.json`.
- The hydration test's owner case and a no-hint case; `DESIGN.md`'s controls section has the states' rules.

Also in this run: briefs 04 and 05's design-critic fixes (8297590), recorded on [looks.md](../../wiki/looks.md).
The footer's layout (the critic's nit 10) was left as it is and asked on the board.

Checks: `npm run check`, `npm run build` (the guard, and no fake file name in `web/dist`) and the corpus lint pass.
Every scenario was opened in all three looks on the preview with the fake, and sign-in, sign-out and a refusal on
the dev server. A visitor's loads make no request to `/gatehouse-api`. The new buttons work by keyboard with each
look's focus ring. sloplint was not run (not in the acceptance).

Deviations:
- Three owner cards, not four: Grafana left the card list on 2026-11-24. The hydration test's fixture uses two.
- `web/vite.config.ts`, outside the files this brief owned: the card module passes `ownerSection` (the page must
  know where the note goes before the API answers), and `optimizeDeps` pre-bundles zod (else the dev server reloads
  the page at the first sign-in).
- An extra `fake-api` script, so the fake runs beside the preview, and so knip sees the file.
- An extra state, failed (no answer in 30 s, a 5xx, a refused answer): Try again and Sign out, the hint kept. The
  brief named none for it.
- The fake's start sends the browser back to the page it came from, so `?look=` survives; a real round trip lands
  on `/` and keeps only the stored look.
- Sign out is offered once the owner route has answered, not while it is still checking or waking.
- Corpus pages beyond the three named: `owner-part.md` and `looks.md` (new; `page.md` was past 200 lines) and
  `open-questions.md`.
