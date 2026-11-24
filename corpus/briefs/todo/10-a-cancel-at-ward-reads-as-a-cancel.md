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
