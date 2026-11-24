# Task 05: Ninety-six

**Depends on:** 04.

**Runs before:** 06.

**Builder:** Sonnet ([routing.md](../../routing.md)).

**Visual work.** This brief builds an approved design. Follow the sketch; don't redesign it.

## Context

The third look, Ninety-six: a 1990s homepage done with care, drawn in `design/sketches/C/sketch.html`
(tokens in its `tokens.md`, renders in `design/shots/c-*.webp`). Brief 03 built the markup and
Profile, brief 04 Terminal and the look switcher. Read `design/README.md` and
`corpus/wiki/page.md` first.

What makes it Ninety-six, from the sketch and its tokens:

- the **teal ground** as drawn (`#008080` in light, deep navy in dark). The slate ground in
  `c-light-1280-slate.webp` was not picked;
- every card a raised panel with a two-tone bevel, every button a bevel that presses in;
- navy section bars; Pixelify Sans for the wordmark and the bars only, Arimo for everything else,
  Cousine for addresses;
- access labels as sunken read-only fields with an icon, only Public with its green face
  (critique C2);
- a pressed filter or mode button shows the inset bevel, a lighter face and a check icon (C3);
- on a desktop the section links and the filters share one row, split by a groove (C1);
- on a phone the mode buttons are icon-only 44 x 44 bevels beside GitHub (C4);
- sign-in and owner cards draw Open as the plain grey bevel, so navy means "you can use this" (C5);
- pictures in a 2 px inset frame; link blue and visited purple for text links;
- no title bars, no window controls, no desktop, no marquee, no counters.

## Files you OWN

- `web/src/`: Ninety-six's tokens and skin rules in the stylesheet
- `web/package.json` for the three fonts
- Corpus: `corpus/wiki/page.md`, `corpus/wiki/status.md`, `corpus/log.md`

## Files you must NOT touch

- `design/`, `content/`, `DESIGN.md` (unless a token there is wrong, which the outcome then names),
  `server/`.
- The markup's structure, as in brief 04.

## Steps

1. **Ninety-six's tokens and rules** from `DESIGN.md` and sketch C, light and dark, under its
   variant. The look switcher's buttons take the bevel too.
2. **Fonts.** Pixelify Sans, Arimo and Cousine through `@fontsource`, used only under
   `[data-look="ninety-six"]`.
3. **Focus.** The sketch's ring: 3 px in the inner colour with a 2 px gap, readable on the panel and
   on the teal ground.
4. **Shots**, opened with `?look=ninety-six&mode=light` and `&mode=dark`. Light at 1280 x 800
   and dark at 390 x 844 beside `design/shots/c-light-1280.webp` and
   `c-dark-390.webp`; Profile and Terminal again at the same sizes. Keep them out of git.
5. **sloplint** as brief 03 ran it, on `http://localhost:5182/?look=ninety-six`. Fix every FAIL.
6. The corpus: `page.md`, `status.md`, a `log.md` entry.

## Acceptance

- [ ] At 1280 x 800 the sticky nav is one row; at 390 x 844 the first card's buttons are above the
      fold.
- [ ] The access labels read as fields, not buttons: none has a raised bevel, and only Public has a
      coloured face.
- [ ] In the network panel, only Ninety-six's three fonts download in Ninety-six.
- [ ] Profile's and Terminal's shots match brief 04's.
- [ ] sloplint: no FAIL. Shots read against the sketch's renders, with differences listed in the
      outcome.
- [ ] `npm run check` and `npm run build` pass; `bash corpus/lint.sh` passes.

## Owner steps

- None. The owner judges the page with brief 06's screens.

## Owner decisions

- Settled 2026-11-23: Ninety-six keeps the teal ground as drawn; the slate ground only on the
  owner's word.
