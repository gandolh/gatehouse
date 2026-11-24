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
