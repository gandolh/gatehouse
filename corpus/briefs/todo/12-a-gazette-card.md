# Task 12: A card for Gazette

**Depends on:** vps-deploy's brief 44 (the `gazette` stack, which serves `/gazette/`). vps-deploy's card check fails
on a card whose path no route answers, so this card lands after that stack.

**Runs before:** the next `node cli.ts gatehouse all`.

**Builder:** Sonnet ([routing.md](../../routing.md)): one card in the list and its picture.

## Context

Gazette is the web app that makes an influencer's monthly campaign report: a gallery of reports, a slide editor where
you click a text or a picture to change it, and the PDF and PowerPoint files on demand. It lives in the gazette repo
(local only, no remote) and is served at `/gazette/` behind sign-in (Ward, with a grant). On 2026-11-24 the owner said
it goes on the front page.

The influencer is a real person. The card names neither him nor the brand his reports are for, in the blurb, the
`more` line or the picture.

## Files you OWN

- `content/cards.json` (the one card), `content/images/gazette.webp` (new)
- The card list's tests that count cards per section
- `corpus/wiki/card-list.md` if it lists the cards or counts them, `corpus/wiki/status.md`, `corpus/log.md`

## Files you must NOT touch

- `design/` (read only), the page's components and styles: a card is data.
- The gazette and vps-deploy repos (read only).

## Steps

1. Add the card to `content/cards.json` in "Apps for home", in the order the section keeps: name "Gazette", the
   `/gazette/` link, `sign-in` access, part `public`, `docs: null` (it has no docs site), `source: null` (it has no
   remote). A one-line blurb in the card list's voice (a monthly social-media report for a friend: edit the slides in
   the browser, download a PDF or a PowerPoint file), and a `more` line on what the app does. Its page is in
   Romanian; say so if the other cards say it for theirs.
2. **The picture**, `content/images/gazette.webp`, 800 x 500 like the others: from the gazette repo's README shots
   (`docs/images/`, invented data, see its `shots.md`), cropped and scaled so no brand name and no person's name is
   readable at the card's size (the editor's footer line and the cover slide's subtitle carry the brand: crop them
   out, or take the editor shot from the top of the page down to above the footer). Encode it the way brief 02's
   images were made (`corpus/wiki/card-list.md`). Look at the result at full size before committing it.
3. The section counts and the tests that lock them (brief 02's card tests) move by one.

## Acceptance

- [ ] `npm run check` exits 0 (the card list's tests); `npm run build` with `GATEHOUSE_ORIGIN` passes its guard.
- [ ] vps-deploy's `npm run check` shows no failure and no warning for `/gazette/` (read only there).
- [ ] The picture, opened at 800 x 500, has no readable brand or person's name; the outcome says how it was cropped.
- [ ] `bash corpus/lint.sh` passes.

## Owner steps

- `node cli.ts gatehouse all` from vps-deploy, with or after `node cli.ts gazette all` (a card whose page isn't live
  yet leads to a 404).

## Owner decisions

- Settled 2026-11-24 (owner): "gazzete should be on the root page". The section, access and wording are the
  controller's, by how the other sign-in apps show.
