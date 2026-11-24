# Task 02: The card list: schema, links, pictures, and a check against the live site

**Depends on:** 01.

**Runs before:** 03, 07, and vps-deploy's brief 34 (its card check reads the file this brief locks).

**Builder:** Sonnet ([routing.md](../../routing.md)).

## Context

`content/cards.json` was seeded on 2026-11-24 from the fixture the sketches were drawn from: 38
cards in 5 sections, 4 of them in the owner part, 25 pictures in `content/images/`. Its shape, the
link forms, the access label against the part, and the rules a schema must hold are in
[card-list.md](../../wiki/card-list.md). Nothing checks the file yet.

Two facts need a live look:

- The Mercatus card (id `piataro`, at `/piataro/`) is named after the live site, which became
  Mercatus on 2026-11-23. Its picture, `content/images/piataro.webp`, still shows the old brand.
- Each access label says what a logged-out visitor gets. A 200 from a single-page app says nothing
  about a sign-in wall, so only a browser can tell. CivicMap has its own accounts plus Ward;
  Mercatus browses read-only without an account.

The live origin comes from your dispatch prompt or the environment (`GATEHOUSE_ORIGIN`). Never write
it into the repo: notes and the outcome name paths only (`/piataro/`, `ward.`).

## Files you OWN

- `shared/src/`: the card schema, the loader, the link resolver and their tests
- `shared/package.json`: the loader's subpath export
- `content/cards.json` (fixes the live check finds, and its formatting) and
  `content/images/piataro.webp`
- `.prettierignore`: the `content/cards.json` line only
- Corpus: `corpus/wiki/card-list.md`, `corpus/wiki/status.md`, `corpus/log.md`

## Files you must NOT touch

- `design/`. `web/` and `server/` beyond what the typecheck needs.

## Steps

1. **The schema** in `shared` with zod, as [card-list.md](../../wiki/card-list.md) describes it:
   `site`, `access`, `sections` and each card's fields, `part` and `access` as unions. Export the
   types, a `loadCards(path)` that reads and validates the file (an invalid file throws, naming the
   card id and the field), and `publicCards` / `ownerCards` helpers. The page is React and its
   components import from `shared` in the browser, so the barrel holds nothing from `node:`:
   `loadCards`, which reads the file, sits behind a subpath export of its own (for example
   `@gatehouse/shared/load`), used by the page's build step and the API.
2. **The link resolver**: `resolveLink(link, origin)` returns a path link unchanged, `host:<name>`
   as `https://<name>.<origin's host>/`, and an `https` address as it is; anything else throws.
   `displayAddress(link)` returns `/path/`, `<name>.`, or the address without `https://`. The page
   build and the API both use these two.
3. **Tests** for the rules in card-list.md: every card validates; ids are unique; exactly
   `brief-board`, `grafana`, `vault` and `mail` are `part: owner`, all in `estate`; every image
   exists in `content/images/` and every file there is used; compact sections have no image; every
   link is one of the three forms and none holds a domain; the resolver and `displayAddress` on each
   form, including a bad link.
4. **The Mercatus picture.** Open `/piataro/` logged out at 1280 x 800, light, and capture the first
   screen. Save it as `content/images/piataro.webp`, 800 px wide, the same format and quality as the
   neighbours (read one with `sharp` or `identify` first). Look at it: the new brand shows, no
   personal data, no cookie banner covering the page.
5. **The live access check.** For each of the 33 cards that aren't On GitHub, open its `href` once,
   logged out, in a real browser (agent-browser or Playwright), and read what a visitor gets: the app
   itself, its sign-in screen, or the docs. One load per card, no link following, no crawling. Compare
   with the card's access label. Fix a wrong label in `cards.json`; a card that answers nothing
   (404, error page) is a finding for the owner, not a fix. Write a table into `card-list.md`: card
   id, path or host, what a visitor gets, label before and after.
6. **Format the list.** `content/cards.json` fails Prettier as seeded, so `.prettierignore` keeps
   it out for now. Run Prettier on it, drop that line, and check that only whitespace changed
   (`loadCards` reads the same 38 cards).
7. The corpus: `card-list.md` (the schema's file names, the check's table and date), `status.md`, a
   `log.md` entry.

## Acceptance

- [ ] `loadCards` validates `content/cards.json`; the tests in step 3 pass; `npm run check` exits 0.
- [ ] The barrel imports nothing from `node:`; `loadCards` comes from its own subpath.
- [ ] `content/cards.json` passes `npm run format:check`, and `.prettierignore` no longer names it.
- [ ] `content/images/piataro.webp` shows the Mercatus brand, 800 px wide, webp.
- [ ] The table in `card-list.md` has one row per non-GitHub card (33), dated, with paths only.
- [ ] Every label change in `cards.json` matches a row in that table.
- [ ] `bash corpus/lint.sh` passes; the live origin appears in no committed file.

## Owner steps

- None. A card that answers nothing goes to the owner as a `--question` on the end move.

## Owner decisions

- Settled 2026-11-23: the access labels are Public, Sign-in, Owner only, Docs only, On GitHub; the
  owner part is the vault, Grafana, the mail admin and brief-board; Trips links only to `/trips/`.
- Settled 2026-11-23: name the Mercatus card after what is live at build time.
