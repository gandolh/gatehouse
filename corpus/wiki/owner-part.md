---
summary: The owner part on the page as built on 2026-11-24 (brief 06), against a fake API until brief 07's server and brief 08's Ward wiring. The contract in shared (the owner answer's schema, the start's answer, the error body, ownerCardsAnswer, ownerSection); the page's side in web/src/features/owner (the owner hint, a store read after mount, the three calls loaded on demand so visitors download neither them nor zod, the footer's Owner sign-in and its live line, the waking note); the states and their words (a cancel at Ward a quiet line of its own since brief 10, on ward-auth 1.2.0); where the owner's cards join Behind the scenes; the fake API (web/scripts/fake-owner-api.ts, GATEHOUSE_FAKE, dev:fake and fake-api) and how to open each state; the hydration test's owner case; how it was checked; the walk against the real API (brief 08) and the 401 reason it added.
updated: 2026-11-24
---

# The owner part on the page

Built on 2026-11-24 (brief 06) against a fake API. The flow and the API's routes are in
[architecture.md](architecture.md), "The owner part"; the looks' rules for these states are in `DESIGN.md`'s
controls section. The page's other parts are in [page.md](page.md).

## The contract, in `shared`

`shared/src/api.ts`, exported from the barrel, is what the page parses and what brief 07's route declares:

- `ownerCardSchema` and `ownerCardsSchema` (`{ cards }`): the owner route's 200, in the shape the card module gives a
  public card: `href` resolved, `address` from `displayAddress`, `ownAddress`, and `image` always `null` (the owner
  part sits in a compact section, and pictures are fingerprinted by a build that never sees an owner card).
- `wardStartSchema` (`{ url }`) and `errorBodySchema` (`{ error, message?, reason? }`): Ward's library answers its 401, 403
  and 503 as `{ error }` alone, so the message is optional.
- `ownerCardsAnswer(list, origin)`: the owner route's answer from the card list. The fake sends it; brief 07's route
  can send it with `PUBLIC_ORIGIN`.
- `ownerSection(list)`: the id of the one section holding owner cards (`estate`, Behind the scenes), or `null`. It
  throws when the owner part spans sections or sits in one with no public card. The card module puts it in the
  page's data as `ownerSection`: an id only, never a card.

No schema has a transform, a strict object or a default, so each can stand as a response schema.

## The page's side

`web/src/features/owner/`, used through its `index.ts`:

- `hint.ts`: `gatehouse.owner` in localStorage (set, read, drop, each in a try), and `takeWardError()`, which reads
  `?ward_error=` and removes it and `ward_return_to` from the address with `replaceState`, keeping `?look=` and
  `?mode=`.
- `owner.ts`: one store per page, made in `useState`, read with `useSyncExternalStore` whose server snapshot is the
  visitor's page, so the HTML and the first client render match. `resume()` runs from an effect, once (the page's
  StrictMode runs effects twice). The store changes from the calls' answers, never from an effect, which keeps
  the hooks lint's `set-state-in-effect` rule quiet.
- `api.ts`: the three calls, through `web/src/lib/api.ts` (the `code-structure` skill's client, every answer parsed
  with shared's schemas). The store loads it with `import()`, only when the hint is set or the sign-in is pressed,
  so the visitor's main chunk holds no zod (287.6 kB before the owner part, 294.4 kB after; the calls' chunk is
  85.6 kB). Each call answers what to do next rather than throwing.
- In dev, `web/vite.config.ts` pre-bundles zod (`optimizeDeps.include`): found only at the first sign-in, it made
  Vite re-optimise and reload the page before the start was posted.
- `OwnerEntry.tsx`: the footer's line and buttons, in the footer's `signIn` slot. `OwnerNote.tsx`: the waking note.
  `words.ts`: every word the states use.

`CardListing` takes `ownerSection`, `ownerCards` and `ownerNote`. The owner's cards join their section after its
public cards, drawn by the same `Card`, so the section's count, Terminal's item count, the filters (Needs sign-in:
12 public cards, 15 with the owner's) and "Showing N cards" count them. `useLevelRows` re-levels when they arrive or
leave. The owner section always holds an empty `role="status"` cell after its cards, where the waking note shows; it
stays empty under Open to anyone.

## The states

| State | When | The footer | Behind the scenes |
| --- | --- | --- | --- |
| signed out | no hint | Owner sign-in (key icon) | its public cards |
| starting | sign-in pressed | the button reads "Opening Ward…" | unchanged |
| checking | the hint set, the owner route called | "Checking the owner sign-in…", no button | unchanged |
| waking | the owner route past 1 s | the same | a note where the cards will go |
| signed in | 200 | "Signed in as the owner: 3 cards added to Behind the scenes." and Sign out | the owner's cards |
| not the owner | 403 | a message that the cards are the owner's, and Sign out | unchanged |
| failed | no answer in 30 s, a 5xx, a refused answer | "The owner's cards didn't load." Try again, Sign out | unchanged |
| Ward can't vouch | 401 with `reason` `ward_unavailable` / `ward_misconfigured` | "Ward can't be reached right now. Try again later." Try again, Sign out | unchanged |
| refused | back with any other `ward_error` | "Ward didn't sign you in…", Owner sign-in | unchanged |
| cancelled | back with `ward_error=cancelled`: Back to Gatehouse at Ward | "Sign-in cancelled.", muted, Owner sign-in | unchanged |
| Ward unreachable | the start fails, or `ward_unavailable` / `ward_misconfigured` | "Ward can't be reached right now. Try again later." | unchanged |
| signed out again | Sign out answered | "Signed out. The owner's cards are off the page." | the cards gone |

- A 401 drops the hint and shows the signed-out page with no message, unless its `reason` says Ward couldn't vouch for
  a live session: the API keeps that session, so the page keeps the hint and offers Try again and Sign out.
- Refused, cancelled, Ward unreachable and signed out again drop the hint. Not the owner, failed and Ward can't vouch keep it,
  so Sign out works.
- The footer's line is a live region, empty in the HTML; the note's cell is another. No line ever shows a code.
- Owner sign-in, Sign out and their busy words are one `<button>` element, so focus stays on it when it changes. Back
  from Ward with an error, the line takes focus (`tabIndex={-1}`), which scrolls the footer into view. A cancel is not
  an error: its line stays muted, like where the sign-in stands, and takes no focus.
- Sign out is offered once the owner route has answered; while it is pending the button hides.
- Back from Ward through the back-forward cache, a page still "starting" drops the hint and returns to signed out.

## The fake API

`web/scripts/fake-owner-api.ts` listens on 127.0.0.1:8815, where the API does, so the dev server's and the
preview's proxies reach it. `GATEHOUSE_FAKE` picks the scenario: `owner` (the default), `slow` (the same after 4 s),
`none` (401), `not-owner` (403), `ward-down` (the start answers 503 `ward_unavailable`), `refused` (the start sends
the browser back with `ward_error=access_denied`). The start sends the browser back to the page it was pressed on,
read from the Referer, where the real one goes to Ward. Logout answers 204.

- `GATEHOUSE_FAKE=<scenario> npm run dev:fake -w @gatehouse/web`: the fake and the dev server, at
  `http://localhost:5182/`.
- `GATEHOUSE_FAKE=<scenario> npm run fake-api -w @gatehouse/web`: the fake alone, beside `npm run preview -w
  @gatehouse/web` after a build.

To open a state: signed in, not the owner, failed and waking need the hint (press Owner sign-in once with `owner`, or
set `gatehouse.owner` in localStorage); failed needs the fake stopped; refused, cancelled and Ward unreachable also
open directly with `?ward_error=access_denied`, `?ward_error=cancelled` or `?ward_error=ward_unavailable`.

## The checks, as run on 2026-11-24

- The hydration test (`web/src/page.test.tsx`) stores the hint, fakes `fetch` with a 200, hydrates: no recoverable
  error, no `console.error`, one request to the owner route, the cards drawn by `Card` in their section after its
  public card, the count and the footer's line following. A second case with no hint makes no request.
- The preview with the fake, headless Chrome: every scenario in all three looks. A visitor's loads make no request
  to `/gatehouse-api` and never fetch the calls' chunk. Owner sign-in and Sign out work by keyboard, and Tab lands
  on each with the look's ring (2 px, 3 px in Ninety-six).
- The build guard passes, and `fake-owner-api` appears nowhere in `web/dist`.

## Against the real API

Walked on 2026-11-24 (brief 08) against brief 07's API and the local Ward: every state above matched, and the page's
calls and paths needed no change ([sign-in.md](sign-in.md), "The walk against the local Ward"). The one difference,
a 401 whose `reason` says Ward couldn't vouch for a live session, is the "Ward can't vouch" row above. The fake stays
as a drawing aid, and doesn't show two things: the real start goes to Ward first, and Ward lands the browser on `/`,
so `?look=` doesn't survive a real round trip (the stored look does). The checks above gained two hydration cases: a
plain 401 (hint dropped, no message) and a 401 with `reason: ward_unavailable` (the Ward unreachable line, Try again
and Sign out, hint kept).

## A cancel at Ward (2026-11-24, brief 10)

Back to Gatehouse on Ward's login page used to land on `?ward_error=access_denied`, the refusal's code, so the footer
said "Ward didn't sign you in" to someone who had only changed their mind. Ward's library 1.2.0 maps Ward's cancel to
its own code, `cancelled` ([sign-in.md](sign-in.md), "The vendored copy"), and the page shows it as the cancelled row
above: "Sign-in cancelled." in the muted style, no focus, the hint dropped, Owner sign-in offered. Every other code
reads as before. Two hydration cases cover it: back with `cancelled` (the words, muted, not focused, the hint dropped,
the address cleaned to its `?look=`, no request) and back with `access_denied` (the refusal's words, focused). Walked
against the local Ward the same day: Back to Gatehouse from Ward's form and from its "Continue as …" chooser both
landed on `/?ward_error=cancelled` and showed the quiet line; a user with no grant still got the refusal, focused.
