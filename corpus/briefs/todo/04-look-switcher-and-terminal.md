# Task 04: The look switcher and Terminal

**Depends on:** 03.

**Runs before:** 05.

**Builder:** Sonnet ([routing.md](../../routing.md)).

**Visual work.** This brief builds an approved design. Follow the sketch; don't redesign it.

## Context

Brief 03 built the shared markup and Profile in React, and wrote every look's tokens into
`DESIGN.md`. This brief adds the second look, Terminal, drawn in `design/sketches/B/sketch.html` (tokens in its
`tokens.md`, renders in `design/shots/b-*.webp`), and the footer control that switches looks. Read
`design/README.md` and the page notes brief 03 wrote in `corpus/wiki/page.md` first.

Terminal is a paper printout in light and amber phosphor in dark: IBM Plex Mono for names, labels,
the nav and the buttons; IBM Plex Sans for blurbs, See more and the header lines. Its own elements,
already in the markup and hidden in Profile:

- each section head as a command and its output (`ls ~/play`, then "6 items"); the count follows
  the filters;
- the card's address as a mono line under its name; host addresses as `satchel.` and "own address";
- the access labels as bracketed words (`[public]`, `[sign-in]`, `[owner only]`, `[docs only]`,
  `[on github]`), public in the accent;
- no Address row in See more (the line under the name shows it);
- in dark, a glow on the wordmark and section titles only, and pictures at `brightness(.85)` until
  the card is hovered or focused; no scanlines;
- on a phone, the mode control as three icon-only 44 x 44 buttons in the top bar.

The look switcher was never drawn. It is a taste item the owner judges later
([open-questions.md](../../wiki/open-questions.md)), so draw it plainly: a Base UI `RadioGroup`
labelled Look, with Profile, Terminal and Ninety-six, drawn as a row of three buttons in the footer
in each look's own button style. A `RadioGroup` because the look is a setting kept on the device
(the `base-ui` skill's rule 16), like the mode control brief 03 built.

A look's skin follows the `base-ui` skill: tokens in the one stylesheet, and the rest as the look's
Tailwind variant on the components' classes (`terminal:`), never a CSS selector aimed at a Base UI
part or a raw colour (rules 4 to 6).

## Files you OWN

- `web/src/`: Terminal's tokens in the stylesheet, its skin as `terminal:` variants on the
  components, the look switcher in the footer and the look's store
- `web/package.json` for the Plex fonts
- Corpus: `corpus/wiki/page.md`, `corpus/wiki/status.md`, `corpus/log.md`

## Files you must NOT touch

- `design/`, `content/`, `DESIGN.md` (unless a token there is wrong, which the outcome then names),
  `server/`.
- The markup's structure: a look changes tokens and skin rules, not elements. If Terminal needs an
  element brief 03 left out, add it hidden in the other looks and say so in the outcome.

## Steps

1. **The switcher.** The `RadioGroup` in the footer's slot. A choice sets `data-look` on `<html>`
   and stores `gatehouse.look`; the inline head script already applies it before the first paint.
   The chosen value is read after mount, from `<html>`, never during render, so hydration stays
   clean with a stored look (brief 03's hydration test covers it). With scripting off the group is
   hidden, by the head script's scripted mark, and the page stays in Profile.
2. **Terminal's tokens and skin** from `DESIGN.md` and sketch B, light and dark: the tokens under
   the Terminal look in the stylesheet, the skin as `terminal:` classes. Card edges in ink with the
   hard offset shadow; picture frames and secondary buttons in the rule colour (critique B4).
3. **Fonts.** IBM Plex Mono (400, 600, 700) and IBM Plex Sans (400, 600) through `@fontsource`,
   used only under `[data-look="terminal"]`.
4. **The filter result** is announced in Terminal too (critique B6).
5. **Shots**, opened with `?look=terminal&mode=light` and `?look=terminal&mode=dark`. Terminal
   light at 1280 x 800 and dark at 390 x 844 beside `design/shots/b-light-1280.webp`
   and `b-dark-390.webp`; Profile again at the same two sizes to show nothing moved. Keep them out of
   git.
6. **sloplint** as brief 03 ran it, on `http://localhost:5182/?look=terminal`. The `dark-glow` findings on the wordmark
   and section titles are allowed; fix every other FAIL.
7. The corpus: `page.md` (the switcher, Terminal's rules), `status.md`, a `log.md` entry.

## Acceptance

- [ ] The switcher changes the look in place and the pick survives a reload with no flash of
      Profile (checked with a throttled reload).
- [ ] At 390 x 844 dark in Terminal, the first card's buttons are above the fold.
- [ ] In the network panel: in Profile only Geist downloads; in Terminal only the Plex fonts.
- [ ] Profile's shots match brief 03's.
- [ ] sloplint: no FAIL beyond the allowed glow. Terminal's shots read against the sketch's renders,
      with differences listed in the outcome.
- [ ] `npm run check` and `npm run build` pass; `bash corpus/lint.sh` passes.

## Owner steps

- None. The owner judges the switcher with brief 06's screens.

## Owner decisions

- Settled 2026-11-23: all three looks ship, picked with a switcher in the footer and kept in
  localStorage.
