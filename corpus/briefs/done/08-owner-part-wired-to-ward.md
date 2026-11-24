# Task 08: The owner part wired to Ward, end to end

**Depends on:** 06, 07, and a Gatehouse client in Ward's local seed (outside this repo; step 1
checks it).

**Runs before:** 09.

**Builder:** Opus ([routing.md](../../routing.md)).

## Context

Brief 06 built the page's owner part against a fake API; brief 07 built the real API. This brief
runs the two together against the local Ward, walks every state the owner judged at brief 06 with
real answers, and fixes what differs. It is the last brief before the first deploy, so it ends at
Ready for deploy.

The local Ward runs in Docker (the `wzd_auth` repo's local setup) and acts as the OIDC provider. Its
seed, `infrastructure/local/seed.mjs` in that repo, registers each app's dev client and writes the
app's `WARD_OIDC_*` values. Gatehouse's entry (dev page `http://localhost:5182/`, API prefix
`/gatehouse-api`) is added by the controller or the owner, never by this brief.

How sign-in works here: `corpus/wiki/sign-in.md` (brief 07 wrote it) and
[architecture.md](../../wiki/architecture.md).

## Files you OWN

- `web/src/` and `server/src/`: fixes the walk finds
- Corpus: `corpus/wiki/sign-in.md`, `corpus/wiki/page.md`, `corpus/wiki/status.md`, `corpus/log.md`

## Files you must NOT touch

- The `wzd_auth` repo, its seed included: read only.
- The repo's `.env`: don't read or write it. The walk's settings come from your own shell's
  environment, from the values the seed printed for Gatehouse.
- `design/`, `content/cards.json`, `docs/owner-setup.md` (unless the walk proves it wrong, which the
  outcome then names), vps-deploy.

## Steps

1. **Check the precondition.** Ward's local seed has a `gatehouse` client with the dev page
   `http://localhost:5182/` and the API prefix `/gatehouse-api`, and the local Ward answers. If not,
   stop before changing anything and hand back saying so: the controller adds the entry.
2. **Run both** with `npm run dev` (the real API, not the fake), the API configured for the local
   Ward. A local Ward user with an `admin` grant on Gatehouse plays the owner; one with a plain grant
   plays "not the owner"; one with no grant plays the refusal. Use the seed's users where they fit;
   make the rest in the local Ward's console.
3. **Walk each state** brief 06 drew, in Profile at 1280 x 800: sign in from the footer, land back on
   `/` with the four owner cards; reload (the session holds, no flash of the signed-out footer longer
   than the waking note); sign out; sign in as "not the owner"; sign in as the refused user; restart
   the API with `WARD_OIDC_ISSUER` on a closed local port and sign in (Ward unreachable). Never stop
   the local Ward container: other apps use it. Clear the hint and reload: no request to
   `/gatehouse-api`.
4. **Fix** what differs from brief 06's screens, in the page or the API. A real code or status the
   fake didn't send gets its message in the same words as the nearest drawn state.
5. **The build** once more: `npm run build` with `GATEHOUSE_ORIGIN`; the guard passes.
6. The corpus: `sign-in.md` (the walk, with dates and what each user saw), `page.md`, `status.md`, a
   `log.md` entry.

## Acceptance

- [ ] Step 1's precondition held, or the run stopped there and said so.
- [ ] The walk in step 3 matches brief 06's screens state for state; each difference fixed or listed.
- [ ] With no hint, no request goes to `/gatehouse-api`.
- [ ] `npm run check` and `npm run build` pass; `bash corpus/lint.sh` passes.
- [ ] End move `ready_for_deploy`, with the deploy steps below.

## Owner steps

- Deploy with vps-deploy once its brief 34 is built: `npm run rollout` from the vps-deploy checkout,
  with Gatehouse's steps ticked. It registers the Ward client, grants the owner `admin`, builds the
  page with the origin, and starts the API. Then open the root of the domain, sign in from the
  footer, and check the four owner cards appear.

## Owner decisions

- Settled 2026-11-23: the owner part shows only after Sign in with Ward.
- Settled 2026-11-24 (the plan): Ward-only sign-in, the `admin` role, sign-out ends Gatehouse's
  session only.

## Outcome (2026-11-24)

Walked; on the board at Ready for deploy, waiting for vps-deploy's brief 34. Details in
[sign-in.md](../../wiki/sign-in.md), "The walk against the local Ward".

- **Step 1 held.** Ward's local seed has the `gatehouse` client (dev page `http://localhost:5182/`, API
  `/gatehouse-api`); the local Ward answered with the expected issuer; the API logged that Sign in with Ward is on.
- **The walk** (`npm run dev`, the real API, Profile at 1280 x 800, three throwaway local Ward users: `admin`,
  `member`, no grant, disabled afterwards). Every state matched brief 06's screens: signed in with the three owner
  cards; reload (the session held, the checking line a blink, a reload past 30 s made Ward's first real session
  check); sign out (204, cards gone, Ward's chooser on the next sign-in); not the owner (403); the no-grant refusal
  (Ward calls back with `access_denied`, the page lands on `/` with the refusal focused); Ward unreachable on a fresh
  sign-in (the start answers 503).
- **No hint, no request**: a reload with the hint cleared and the session cookie still set makes no request to
  `/gatehouse-api`.
- **One difference, fixed** (01ad87a): with a live session and Ward down, the owner route answers 401 with
  `reason: ward_unavailable` and keeps the session; the page dropped the hint without a word. It now shows the Ward
  unreachable words with the failed state's Try again and Sign out, and keeps the hint. Walked live: Try again
  recovers once Ward is back with no new round trip, and Sign out works while Ward is down. Two hydration cases test
  it and the plain 401.
- **Listed, not changed**: a cancel at Ward ("Back to Gatehouse") reads as the refusal; Ward sends `access_denied`
  for both and the library passes only the code.

Checks: `npm run check` (twice), `npm run build` with `GATEHOUSE_ORIGIN` (the path check and the owner-part guard
pass) and the corpus lint pass. Not run: the waking note live (the local API answers in milliseconds; it was judged on
the fake), and the phone and other looks against the real API (outside this brief's walk).

Deviations:
- `shared/src/api.ts`: `errorBodySchema` takes an optional `reason`, outside the files this brief owned; the page
  can't read the 401's reason without it.
- Corpus pages beyond the four named: `owner-part.md` (the new row, its "Against the real API" section) and
  `architecture.md` (the 401 line).
- The test users were made by the controller (this session's permission check refused the console login), and only
  disabled: Ward's console does have `DELETE /console/accounts/:subject`, unlike the run's note.
