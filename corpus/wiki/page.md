---
summary: The page as built on 2026-11-24 (briefs 03 to 05), in Profile, Terminal and Ninety-six; the look switcher and Terminal's rules. Its components and where they live; the public card module (a Vite plugin, picture sizes from the webp header); the head script, data-look, data-theme and data-scripted; hydration (nothing read in render, a jsdom test that runs the real head script); See more with scripting off (Base UI's Collapsible can't, so a hand-built disclosure); the filters, row levelling and the phone's sticky row; fonts; the prerender's title; the build guard; how each acceptance check was run; what still differs from sketches A, B and C; Ninety-six's tokens, bevels and traps.
updated: 2026-11-24
---

# The page

Built in the Profile look (brief 03), then Terminal and the look switcher (brief 04), then Ninety-six (brief 05). It is React 19 on Vite, rendered to HTML at build time and hydrated
([architecture.md](architecture.md)); `DESIGN.md` at the repo root is the locked system for all three looks.

## Where things live

```
web/src/
  main.tsx, entry-server.tsx   the two entries; the only importers of the card module
  page.tsx                     the tree both entries render (StrictMode + App); the tests render it too
  App.tsx                      skip link, Header (with the mode control), CardListing, Footer
  card-module.d.ts             types `virtual:gatehouse-cards` as PageData, so a fresh clone typechecks
  components/Header.tsx, Footer.tsx   the footer takes `lookSwitcher` and `signIn` slots, empty today
  components/ui/               RadioGroup (the one Base UI wrapper), icons, looks.ts (button looks, page width)
  features/cards/              CardListing (filter state, live region), SectionNav, CardSection, Card,
                               AccessLabel, filters.ts, useLevelRows.ts, types.ts (PageData, PageCard)
  features/mode/               ModeControl, mode.ts (the store, the browser-bar colours)
  lib/cn.ts                    cn(), tailwind-merge told the page's token names
  styles/index.css             the one stylesheet: Profile's tokens, the look variants, `dark`, `scripted`
```

`Card` takes one card's data and its label's words as props, so brief 06 can draw the owner cards with it; export it
from `web/src/features/cards/index.ts` then (it isn't today, so knip stays quiet).

## The card module

`cardModule()` in `web/vite.config.ts` answers `virtual:gatehouse-cards` in dev and in both builds. It reads the list
through `loadCards`, keeps `publicCards` only, copies each card field by field (no `part`), resolves `href` against
`GATEHOUSE_ORIGIN` (`https://example.org` in dev), adds `address` (`displayAddress`) and `ownAddress` (a `host:`
link), and imports each picture by its file path so Vite fingerprints it under `/gatehouse/`. The width and height
come from the picture's `VP8 ` frame header; any other webp fails the build naming the file. The SSR build names the
same files, so the HTML and the scripts agree.

Rolldown's minifier writes the module's strings with backticks (`` id:`games` ``), which is why the guard matches
backtick ids too.

## Looks, modes and the head script

`web/index.html` says `data-look="profile" data-theme="light"`. Its inline script reads `gatehouse.look` and
`gatehouse.mode` (in a try), lets `?look=` and `?mode=` override them for one load, sets both attributes, sets
`data-scripted`, and colours the `theme-color` meta from a table of each look's ground, light and dark. `mode.ts`
holds the same table; `mode.test.ts` keeps the two equal, and Profile's pair equal to `--color-ground`.

The stylesheet's variants: `dark` (Dark, or System while the device is dark), `profile`, `terminal`, `ninety-six`
and `scripted`. An element only one look draws is `hidden` plus that look's variant, so Profile never shows it:
Terminal's command line and item count in each section head, the address line under a card's name, the brackets
around the access words and the wordmark's cursor; Ninety-six's globe, key and book icons and the Docs button's
book; the check icon on a chosen mode or filter. See more's Address row is `terminal:hidden`. Each section carries
`data-compact` when it is compact.

## Hydration

Nothing reads storage or the address during render. The mode control reads `data-theme` through
`useSyncExternalStore` with a server snapshot of light, so the first client render matches the HTML and the control
then moves to the stored mode. Until hydration ends, the control shows the stored choice already pressed: the
`pressed` and `not-pressed` variants match `[data-checked]`, and before `<html data-hydrated>` (set by the page's
`HydrationMark`) they match the group's own option against `data-theme` or `data-look` instead.

`web/src/page.test.tsx` renders the page with `renderToString`, builds a document from it, stores dark and Terminal,
runs index.html's own head script, hydrates with `hydrateRoot`, and expects no recoverable error, no
`console.error`, Dark chosen and the Terminal dark bar colour. A planted text change in the HTML fails it.

## See more with scripting off

Checked 2026-11-24 with `renderToString` on Base UI 1.9.0's `Collapsible`: a closed panel isn't rendered at all by
default, and with `keepMounted` or `hiddenUntilFound` it is rendered with `hidden=""` (the until-found value is set
by an effect in the browser). Tailwind's Preflight makes `[hidden]` `display: none !important` in the base layer,
which no later layer can undo. So Collapsible can't show its text without scripts.

See more is a hand-built disclosure: a `<button aria-expanded aria-controls>` and a panel that is always rendered.
The panel carries `data-open` while open and the class `scripted:not-data-open:hidden`: with scripts it hides until
opened, without them it shows. The button, the filters and the mode control are `hidden scripted:…`, as the sketch's
`.js` rules hid them.

## Behaviour

- **Filters:** a `RadioGroup` labelled Show. All; Open to anyone (`open`, `docs`, `repo`: 22 cards); Needs sign-in
  (`sign-in`, `owner`: 12). A section with no card left hides, and so does its link; counts follow the filter. The
  live region says "Showing N cards" after a change and is empty in the HTML.
- **Levelled rows:** `useLevelRows` gives each card's head, blurb and actions (`data-level`) the height of the
  tallest in its row, after mount, on a filter change, a width change and when the fonts load. See more sits below
  them, so an opened card grows alone. Without scripts the rows are unlevelled.
- **Phone:** below 640 px the section row's wrappers are `display: contents`, so only the links stick (`top: 0`,
  48 px links); the filters scroll away. Sections set `scroll-margin-top` 60 px (84 from 900 px). The row sticks
  as a whole from 900 px. There is no phone navigation panel, so base-ui rule 15 has nothing to apply to.
- **Pictures:** the first section's first three load eagerly (React preloads them); the rest are lazy.

## Fonts

Geist and Geist Mono are self-hosted from the variable Fontsource packages, imported into the vendor layer. The
packages hold every subset; a browser fetches only what the page's text uses: Geist latin and latin-ext (the
Romanian letters), and Geist Mono latin once a See more panel shows an address. The variable files draw the
sketch's 650 weight as 650; the sketch, on Google's fixed weights, drew it as 700, so headings are set at 700 to
match the renders (`--font-weight-strong`, and DESIGN.md's weight line was corrected).

IBM Plex Mono (400, 600, 700) and IBM Plex Sans (400, 600) come from `@fontsource`, only the latin and latin-ext
files imported. They apply only under `data-look="terminal"`, and a browser fetches a face only when text uses it, so
Profile downloads Geist alone and Terminal Plex alone. The Geist latin preload is a small inline script in the head
that adds the `<link rel=preload>` only when `data-look` is profile; a static link would download Geist in Terminal.

## The prerender's head

`entry-server.tsx` also exports `head()`, the wordmark as `<title>` and the header's line as the description;
`web/scripts/prerender.ts` puts them in place of index.html's `<title>Gatehouse</title>`, which must be there
exactly once. The dev server keeps "Gatehouse".

## The build guard

`web/scripts/check-owner-part.ts` runs last in the page's build. For each owner card it looks in every text file in
`web/dist/` (pictures and fonts aside) for the link as written and as resolved, the blurb, the See more text, the id
as `id="c-<id>"` or `id="more-<id>"`, and the id as an object key in a script (double, single or back quotes). Each
file is read as written, with HTML's escapes undone (React writes `'` as `&#x27;`) and with a script's escapes
undone. Its test plants leaks in the HTML, a script and a source map, and passes a page where Postern's blurb says
mail.

## The checks, as run on 2026-11-24

- The built HTML: 5 sections, all 34 public cards by id, each `more` text, none of the 4 owner cards.
- Scripting off (headless Chrome, the preview): 5 sections, 34 cards and 34 See more texts shown; no See more
  button, filter or mode control. The only failed request is `/favicon.ico`: the page links no icon yet.
- Scripting on, `gatehouse.mode` dark and `gatehouse.look` terminal stored: no console error, Dark chosen.
- sloplint (`--scope app --url http://localhost:5182/ --render`): clean after one fix (below).
- Shots at 1280 x 800 light and 390 x 844 dark beside `design/shots/`: the light one differs in 0.27% of pixels
  (the Behind the scenes count and the heading weight). The dark one differs in 13.8%, and in 0.3% once the build is
  shifted up 6 px: the approved render sits 6 px higher. Measured in Chrome at 390 px, the build's header, section
  row and first card stand where `sketch.html`'s do (the wordmark's top at 29 px in both).

## Where it differs from sketch A

- **Headings at a true 650 weight**, the one difference that is a choice: the sketch asks for 650, but Google's
  fixed weights drew it as 700 in the approved renders. One token switches it: `--font-weight-strong` in the
  stylesheet (700 draws the renders' weight).
- Light is chosen on a first visit; the sketch drew System (rule 14, the decisions).
- Behind the scenes counts 4, not 8: the owner part is off the page until brief 06.
- No card is drawn open: the sketch opened Solstice to show See more.
- Pictures after the first three load lazily; the sketch loaded all of them at once.
- A skip link ("Skip to the cards", from sketch B), off screen until focused. sloplint failed it as `sr-only`
  (text under the header), so it sits above the page instead.
- The title is the wordmark and the description the header's line, as in the sketch; the favicon is emitted as a build asset.
- The mode control and filters are radio groups: one tab stop each, arrows move and choose.

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
- The pressed chip shows a check icon in Terminal; `terminal:pressed:*` beats `pressed:*`.
- Dark: glow on the wordmark and section titles only; pictures at `brightness(.85)` until the card is hovered or
  focused.

How it was checked on 2026-11-24 (preview, headless Chrome): Terminal light 1280 x 800 and dark 390 x 844 against
`design/shots/b-light-1280.webp` and `b-dark-390.webp`; the Terminal dark 1280 combo once. Fresh browser, Terminal:
only Plex files download; Profile: only Geist. With the page script blocked and Dark and Terminal stored, the
pressed Dark and Terminal chips are already amber, so the first paint is right. sloplint with `--render` on
`?look=terminal` (light and dark): 0 FAIL, one WARN (four font weights in use: Plex 400, 500 from controls, 600, 700).

Differences from sketch B: the GitHub link in the header has no underline; the card names and mono lines sit a pixel
or two off; the sketch drew System pressed, the page defaults to Light; Behind the scenes counts 4 (the owner part is
off the page until brief 06).

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
  width of the cards. The section links and filters share one row from 1240 px, split by a 2 px groove.
- Focus: 3 px, `--color-focus` (black in light, white in dark), 2 px gap.

Checked 2026-11-24 (dev server, headless Chrome): light 1280 x 800 and dark 390 x 844 against `design/shots/c-light-1280.webp`
and `c-dark-390.webp`; a fresh browser downloads only Pixelify and Arimo (Cousine loads once an address shows in See more). sloplint `--render` on `?look=ninety-six`, light and dark: 0 FAIL.

Differences from sketch C: the mode and look pressed state follows Light (the page's default), the sketch drew System;
the title bar of a section is 4 px taller; the filters on a phone keep their own width; Behind the scenes counts 4;
buttons have no one-pixel padding shift when pressed.
