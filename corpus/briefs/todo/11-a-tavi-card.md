# Task 11: A card for Tavi's site

**Depends on:** vps-deploy's brief 43 (the `tavi` stack) and Tavi's first deploy.

**Builder:** Sonnet ([routing.md](../../routing.md)): one card in the list.

## Context

Tavi Ceasornicaru is a new presentation site at `/tavi/` (the presentation-sites repo, briefs 09-21). vps-deploy's
card check warns while a served app route has no card. On 2026-11-24 the owner said yes to a card, in "Sites for
other people", added with Tavi's first deploy.

## Steps

1. Add the card to `content/cards.json` in "Sites for other people", in the order the section keeps: name "Tavi
   Ceasornicaru", the `/tavi/` link, Public, a one-line blurb in the card list's voice (an interactive wristwatch
   movement you can wind, slow down and take apart), its picture from the site's social card or a fresh shot of the
   hero, and no docs link until its docs site exists (presentation-sites brief 21).
2. The section counts and the tests that lock them (brief 02's card tests) move by one.

## Acceptance

- [ ] `npm run check` exits 0 (the card list's tests); `npm run build` with `GATEHOUSE_ORIGIN` passes its guard.
- [ ] vps-deploy's `npm run check` shows no warning for `/tavi/` (read only there).
- [ ] `bash corpus/lint.sh` passes.

## Owner steps

- `node cli.ts gatehouse all` from vps-deploy (a changed card list ships with `all`).
