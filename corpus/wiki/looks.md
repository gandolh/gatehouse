---
summary: The look switcher and the two looks beside Profile, as built on 2026-11-24 (briefs 04 and 05) and corrected after the design critic's pass (with brief 06); the Compact view in each look (brief 13, 2026-11-26). The switcher (a RadioGroup in the footer, gatehouse.look); Terminal's and Ninety-six's tokens, skins and traps (inlined theme shadows, bevels from colour tokens, pressed variants after the base ones, fonts per look); how each was checked against sketches B and C, and what still differs; the critic's fixes (compact sections through the compact variant, the 44 px target kept off coarse pointers, Terminal's full-bleed row, Ninety-six's inline label and bold primary); the View control and Compact in each look; the footer layout left for the owner.
updated: 2026-11-26
---

# The look switcher, Terminal and Ninety-six

The page's structure and behaviour, the same in every look, are on [page.md](page.md); `DESIGN.md` at the repo root
holds every look's tokens.

## The look switcher

`web/src/features/look/`: `look.ts` is the store (`useSyncExternalStore` over `data-look` on `<html>`, server
snapshot Profile; a pick sets the attribute and writes `gatehouse.look`), `LookSwitcher.tsx` a Base UI `RadioGroup`
labelled Look with Profile, Terminal and Ninety-six, drawn as a row of buttons (RadioGroup's `row` look) in the
footer's `lookSwitcher` slot. The slot is `hidden scripted:flex`, so it is gone without scripts. Each option carries
`data-look-option`, which the pre-hydration `pressed` variant reads.

## Terminal

Tokens in `index.css` under `:root[data-look="terminal"]`; the skin is the `terminal:` Tailwind variant on the
components (Card, CardSection, SectionNav, AccessLabel, Header, Footer, RadioGroup, `looks.ts`). Rules worth knowing:

- Tailwind inlines a theme shadow into its utility, so a look can't swap `--shadow-card`. Terminal's hard offset is
  `terminal:shadow-hard`, whose colour is `--color-offset`.
- The section row is full width in Terminal (ink rules above and below, the content aligned to the page's width), the
  one place the row leaves the page width, as in the sketch.
- Access labels are `[public]`, lowercased, in brackets the markup carries hidden in the other looks.
- The pressed chip (a filter or a view) shows a check icon in Terminal; `terminal:pressed:*` beats `pressed:*`.
- Dark: glow on the wordmark and section titles only; pictures at `brightness(.85)` until the card is hovered or
  focused.

How it was checked on 2026-11-24 (preview, headless Chrome): Terminal light 1280 x 800 and dark 390 x 844 against
`design/shots/b-light-1280.webp` and `b-dark-390.webp`; the Terminal dark 1280 combo once. Fresh browser, Terminal:
only Plex files download; Profile: only Geist. With the page script blocked and Dark and Terminal stored, the
pressed Dark and Terminal chips are already amber, so the first paint is right. sloplint with `--render` on
`?look=terminal` (light and dark): 0 FAIL, one WARN (four font weights in use: Plex 400, 500 from controls, 600, 700).

Differences from sketch B: the GitHub link in the header has no underline; the card names and mono lines sit a pixel
or two off; the sketch drew System pressed, the page defaults to Light; Behind the scenes counts 4 for a visitor.

## Ninety-six

Tokens in `index.css` under `:root[data-look="ninety-six"]`; the skin is the `ninety-six:` variant on the components.
Square corners and the type scale of the sketch come from the same overrides (`--text-*`, `--radius-*`,
`--container-page` 75rem). Rules worth knowing:

- The bevels are theme shadows built from colour tokens (`--color-bevel-1` to `-4`, `--color-drop`): `shadow-raised`
  (buttons), `shadow-sunken` (pressed, picture frame), `shadow-panel` (raised plus the 4 px drop), `shadow-field` and
  `shadow-field-ok` (access labels). Profile and Terminal leave those colour tokens transparent.
- Text on the teal ground (wordmark, header lines, section lines) is `text-on-ground`; panels keep `ink`.
- `font-display` is the wordmark and the section titles: Pixelify Sans here, Plex Mono in Terminal, Geist in Profile.
  Arimo is `font-sans` and `font-ui`, Cousine `font-mono`.
- A pressed option is `ninety-six:pressed:*`, which must come after the base `pressed:*`; the check icon shows on a
  chosen option (not on the phone's icon-only mode buttons, which draw a heavier icon stroke instead).
- The header is a three-column grid from 1024 px (`display: contents` on the flex row); the footer is a panel the
  width of the cards. The section row is one panel, the links on its first line and the filters and View on the
  second. Until View joined it (2026-11-26) the links and filters shared one line from 1240 px, split by a 2 px groove;
  that groove went with the one-line row.
- Focus: 3 px, `--color-focus` (black in light, white in dark), 2 px gap.

Checked 2026-11-24 (dev server, headless Chrome): light 1280 x 800 and dark 390 x 844 against `design/shots/c-light-1280.webp`
and `c-dark-390.webp`; a fresh browser downloads only Pixelify and Arimo (Cousine loads once an address shows in See more). sloplint `--render` on `?look=ninety-six`, light and dark: 0 FAIL.

Differences from sketch C: the mode and look pressed state follows Light (the page's default), the sketch drew System;
the title bar of a section is 4 px taller; the filters on a phone keep their own width; Behind the scenes counts 4
for a visitor; buttons have no one-pixel padding shift when pressed.

## The design critic's fixes (2026-11-24)

Made with brief 06, from the critic's pass on Terminal and Ninety-six; Profile's shots stayed pixel-identical.

- Compact sections: `<section>` carries `data-compact`, and the stylesheet's `compact` variant sets sketch B's and C's
  compact padding, type and buttons (Terminal 36 px, Ninety-six 34 px). It was the group-data-compact variant on a
  section group until 2026-11-26, when `compact` replaced it so the Compact view reuses the same rules
  ([page.md](page.md)). The variant outweighs a plain or responsive class by one attribute, so the 44 px target is
  kept with `sm:not-pointer-coarse:` (not `pointer-fine:`: headless Chrome reports `pointer: none`, which matches
  neither fine nor coarse).
- Terminal: the row's rules run edge to edge at every width (`terminal:lg:px-0` beats `pageWidth`'s gutter), links
  44 px, chips 36 px; the phone's wordmark 1.3rem and titles 1.4rem; the section line 16 px.
- Ninety-six: the access label follows the name (no `justify-between`); filled buttons at 700, the others at 400; no
  blurb minimum; the first section 12 px under the row on a phone; the row's links 14 px from 1240 px.
- Left for the owner: the footer stacks its text, GitHub and the look row in every look, where sketches B and C put
  GitHub on the right.

## The View in each look (2026-11-26)

The View control is the filters' chips (`RadioGroup`'s `chips` look) with an icon before each word: a filled pill in
Profile, a square chip with a check on the pressed one in Terminal, a raised button that sinks and shows a check in
Ninety-six. Compact adds no rules of its own: every section takes the `compact` variant the two compact sections
already had, so a Compact card in Games and toys is drawn like one in Behind the scenes in each look (Profile: the card
without its picture; Terminal: 12 px above and below, no gap above the name, 36 px buttons; Ninety-six: 10 px padding,
the name at 18 px, the blurb at 15, 34 px buttons). Checked in the preview, headless Chrome, at 1280 x 800 light and
390 x 844 dark in both views. In Cards, the header, the cards and the footer match the build before the change pixel
for pixel at eight widths from 390 to 1440 in every look and mode, the section row aside. Where the taller row moved
the page, the capture differed by rasterising noise only: single rows inside pictures (up to 42 levels), Terminal's
wordmark glow and footer key icon (1 to 6 levels); the old build against itself differed nowhere.
