# Task 10: A cancel at Ward reads as a cancel, not a refusal

**Depends on:** 08 (the owner part wired to Ward).

**Builder:** Opus ([routing.md](../../routing.md)): a change in Ward's shared library first (the `wzd_auth` repo),
then the re-vendor here.

## Context

Brief 08's walk found that "Back to Gatehouse" on Ward's login page lands on `/?ward_error=access_denied`, the same
code as a refusal, so the footer says "Ward didn't sign you in" for both. On 2026-11-24 the owner chose to tell them
apart in Ward.

Ward already tells them apart on the wire: its interaction routes answer a cancel with `error=access_denied` and
`error_description` "the person cancelled the sign-in" (`api/src/oidc/interaction.ts`, `DENIAL_DESCRIPTIONS`), and a
refusal with the other two descriptions. Ward's shared library (`shared-library/`, ward-auth 1.1.0) passes the
provider's `error` through as the app's `ward_error` code and drops the description, so every app sees
`access_denied`.

## The change

1. **Ward (`wzd_auth`, public, no corpus: plain commits, no board).** The library maps a provider `access_denied`
   whose description marks a cancel to the code `cancelled`; every other `access_denied` stays `access_denied`. The
   marker must not be a free-text match that a wording change would break: share one exported constant between the
   interaction routes and the library (both live in the repo), or a short machine token the routes put first in the
   description. Tests on both sides. Bump the library to 1.2.0 the way Ward versions it, build it, and regenerate
   its `SHA256SUMS`. Ward's server needs no deploy if its routes don't change; say so in the commit if they do.
2. **Gatehouse.** Re-vendor ward-auth 1.2.0 into `server/vendor/ward/` (the six files, checked against its sums).
   The page shows `ward_error=cancelled` as a quiet line in the footer's sign-in slot (suggested: "Sign-in
   cancelled."), not focused, with the owner hint dropped, as for a refusal. Words, tests, `owner-part.md`'s state
   table and `sign-in.md`.
3. Other apps keep ward-auth 1.1.0 and still see `access_denied` for a cancel until each re-vendors: name that in
   the outcome; no change to them here.

## Files you OWN

- In `wzd_auth`: `shared-library/` (source, tests, version, build output), `api/src/oidc/interaction.ts` only if the
  shared constant needs it.
- Here: `server/vendor/ward/`, `web/src/features/owner/`, the corpus pages above, the closeout.

## Acceptance

- [ ] Ward: the library's tests cover cancel → `cancelled` and refusal → `access_denied`; Ward's `npm run check`
      exits 0; the 1.2.0 build and its `SHA256SUMS` are committed.
- [ ] Gatehouse: the vendored copy passes `sha256sum -c`; a walk against the local Ward shows the quiet line after
      "Back to Gatehouse", and the refusal line for a user with no grant (throwaway users, disabled or deleted at the
      end; the local Ward's console scripts are in the controller's scratch folder).
- [ ] `npm run check` exits 0 here; `bash corpus/lint.sh` passes.

## Owner steps

- None for Ward's server unless its routes changed. Gatehouse ships with `node cli.ts gatehouse all` after its first
  deploy (vps-deploy 34).

## Outcome (2026-11-24)

Built. Done on the board, since Gatehouse isn't deployed yet. Details are in [owner-part.md](../../wiki/owner-part.md)
("A cancel at Ward") and [sign-in.md](../../wiki/sign-in.md) ("The vendored copy").

- **Ward** (two local commits, not pushed: bd4ca40, then 16ef3eb "ward-auth 1.2.0"). The three denial descriptions
  moved out of the interaction routes into a new file in Ward's OIDC folder that imports nothing. The library imports
  the cancel's constant from it, and the build copies that one string into the server bundle. An `access_denied`
  whose description equals it becomes `cancelled`; every other `access_denied` stays. The Ward image builds only the
  API, so the API can't import from the library, which is why the constant lives on the API's side. Ward's routes
  send the same codes and words as before, so its server needs no deploy. Tests: the API checks each denial's
  description, with the cancel's words spelled out, and that no refusal shares them. The library maps a cancel to
  `cancelled` and leaves a refusal, a missing or reworded description and another code alone. Against the
  in-process Ward, Back to the app lands `cancelled` (with `ward_return_to`), and a cancelled link lands on settings
  and links nothing. `AuthErrorCode` gains `"cancelled"`. The CHANGELOG has the 1.2.0 entry and its upgrade notes.
  Between 1.1.0 and 1.2.0 the bundles differ in the banner, the comments, the mapping and one inlined string.
- **The 1.2.0 build** came from Ward's vendor script at 16ef3eb on a clean tree. Before the change, the script
  rebuilt HEAD byte for byte to 1.1.0's sums. The six files and their `SHA256SUMS` are staged in the controller's
  scratch folder for this brief.
- **Gatehouse**: `server/vendor/ward/` holds 1.2.0, and `sha256sum -c` passes for all six files. The page shows
  `ward_error=cancelled` as "Sign-in cancelled." in the muted style, without focus, with the hint dropped and Owner
  sign-in offered. Two hydration cases cover cancelled and access_denied.
- **Walk** against the local Ward, in Profile at 1280 x 800, with throwaway users (disabled, then deleted). Back to
  Gatehouse from Ward's form landed on `/?ward_error=cancelled` and showed the quiet line. The same link from Ward's
  "Continue as …" chooser did the same. The user with no grant landed on `/?ward_error=access_denied` and saw the
  refusal, focused. The owner still signed in and got the three cards. Terminal and Ninety-six show the quiet line.

Not met as written: "the 1.2.0 build and its `SHA256SUMS` are committed". Ward ignores its build folder, and its
version commits touch only the version, the lockfile and the CHANGELOG. The build is committed here as the vendored
copy. Its sums live with the staged copy, as 1.1.0's did. A sums file can't go in `server/vendor/ward/`, because
Ward's vendor script refuses any file there that isn't part of a copy.

Other apps keep ward-auth 1.1.0 and see a cancel as `access_denied` until each one re-vendors. Nothing changed in
them here.

Checks: Ward's `npm run check` exits 0 at 16ef3eb. Its first run timed out once in a config test that starts child
processes, under a load average of 12; that file passed alone, and the rerun passed in full. Gatehouse's `npm run
check` exits 0 with 78 tests. The vendored copy's sums pass, and the corpus lint passes.

Deviations:
- Files outside the owned list. In Ward: the new descriptions file, the OIDC test file and `package-lock.json`. Here:
  `DESIGN.md`, whose footer-line rule said every return from Ward takes focus, and `web/src/page.test.tsx`.
- Extra: a library test for a cancelled link, and walk steps for the chooser's cancel, the owner's sign-in and two
  more looks.
- Ward's own wiki still says the library passes `access_denied` through. Ward keeps no corpus work for builders, so
  it is left for the controller.
