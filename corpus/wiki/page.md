---
summary: The page as built on 2026-11-24 (briefs 03 to 05), with the View control added on 2026-11-26 (brief 13), its structure and behaviour in every look; the look switcher, Terminal and Ninety-six are on looks.md, the owner part on owner-part.md. Its components and where they live; the public card module (a Vite plugin, picture sizes from the webp header); the head script, data-look, data-theme, data-view and data-scripted; the compact variant; hydration (nothing read in render, a jsdom test that runs the real head script); See more with scripting off (Base UI's Collapsible can't, so a hand-built disclosure); the filters, the View (Cards or Compact), the two-line section row, row levelling and the phone's sticky row; fonts; the prerender's title; the build guard; how each acceptance check was run; what still differs from sketches A, B and C; Ninety-six's tokens, bevels and traps.
updated: 2026-11-26
---

# The page

Built in the Profile look (brief 03), then Terminal and the look switcher (brief 04), then Ninety-six (brief 05). The
owner part (brief 06: Owner sign-in, the owner's cards, their states and the fake API) is on
[owner-part.md](owner-part.md), and its walk against the real API and the local Ward (brief 08) on
[sign-in.md](sign-in.md); the look switcher, Terminal's and Ninety-six's rules and the design critic's fixes
are on [looks.md](looks.md). The View control (Cards or Compact, brief 13) joined the section row on 2026-11-26. It is
React 19 on Vite, rendered to HTML at build time and hydrated
([architecture.md](architecture.md)); `DESIGN.md` at the repo root is the locked system for all three looks.

## Where things live

```
web/src/
  main.tsx, entry-server.tsx   the two entries; the only importers of the card module
  page.tsx                     the tree both entries render (StrictMode + App); the tests render it too
  App.tsx                      skip link, Header (with the mode control), CardListing, Footer
  card-module.d.ts             types `virtual:gatehouse-cards` as PageData, so a fresh clone typechecks
  components/Header.tsx, Footer.tsx   the footer's slots hold the look switcher and Owner sign-in
  components/ui/               RadioGroup (the one Base UI wrapper), icons, looks.ts (button looks, page width)
  features/cards/              CardListing (filter state, live region), SectionNav, CardSection, Card,
                               AccessLabel, filters.ts, useLevelRows.ts, types.ts (PageData, PageCard)
  features/mode/               ModeControl, mode.ts (the store, the browser-bar colours)
  features/view/               ViewControl, view.ts (the store: data-view and gatehouse.view)
  features/owner/              the owner part ([owner-part.md](owner-part.md)); lib/api.ts, the API client
  lib/cn.ts                    cn(), tailwind-merge told the page's token names
  styles/index.css             the one stylesheet: Profile's tokens, the look variants, `dark`, `scripted`
```

`Card` takes one card's data and its label's words as props. The owner's cards reach it through `CardListing`, which
adds them to their section, so it stays inside the cards feature.

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

`web/index.html` says `data-look="profile" data-theme="light"`. Its inline script reads `gatehouse.look`,
`gatehouse.mode` and `gatehouse.view` (in a try), lets `?look=` and `?mode=` override the first two for one load, sets
both attributes, sets `data-view="compact"` only when the stored view is `compact` (anything else, or blocked storage,
is Cards), sets `data-scripted`, and colours the `theme-color` meta from a table of each look's ground, light and dark. `mode.ts`
holds the same table; `mode.test.ts` keeps the two equal, and Profile's pair equal to `--color-ground`.

The stylesheet's variants: `dark` (Dark, or System while the device is dark), `profile`, `terminal`, `ninety-six`,
`compact` and `scripted`. An element only one look draws is `hidden` plus that look's variant, so Profile never shows it:
Terminal's command line and item count in each section head, the address line under a card's name, the brackets
around the access words and the wordmark's cursor; Ninety-six's globe, key and book icons and the Docs button's
book; the check icon on a chosen mode, filter or view. See more's Address row is `terminal:hidden`.

`compact` is a section drawn compact: inside a `<section data-compact>` (Behind the scenes, On GitHub), or inside any
section while `<html>` has `data-view="compact"`. Its selector is `:is(:where(section)[data-compact] *,
:where([data-view="compact"] section) *)`, one attribute heavier than a plain class whichever matched, the weight the
group-data-compact variant it replaced had. The card's picture link is `compact:hidden`, so Compact hides the pictures
of the three full sections with the markup unchanged; a hidden lazy picture never loads.

## Hydration

Nothing reads storage or the address during render. The mode control reads `data-theme` through
`useSyncExternalStore` with a server snapshot of light, so the first client render matches the HTML and the control
then moves to the stored mode. Until hydration ends, the control shows the stored choice already pressed: the
`pressed` and `not-pressed` variants match `[data-checked]`, and before `<html data-hydrated>` (set by the page's
`HydrationMark`) they match the group's own option against `data-theme` or `data-look` instead.

`web/src/page.test.tsx` renders the page with `renderToString`, builds a document from it, stores dark and Terminal,
runs index.html's own head script, hydrates with `hydrateRoot`, and expects no recoverable error, no
`console.error`, Dark chosen and the Terminal dark bar colour. A planted text change in the HTML fails it. The View
control does the same over `data-view` (server snapshot Cards; `data-view-option` for the pre-hydration `pressed`
match). Its tests: the head script sets `data-view` for a stored `compact` and leaves it off for nothing, `cards`,
an unknown value or blocked storage; the HTML is the same string with `compact` stored and has no `data-view`; a
stored Compact hydrates with no recoverable error, `console.error` or `console.warn`, pressed before and chosen after;
a click writes `gatehouse.view` and the attribute; the `compact` selector matches a full section's card only under
`data-view`. Its owner
cases (the 200, a plain 401, a 401 whose reason is `ward_unavailable`, no hint) are on [owner-part.md](owner-part.md).

## See more with scripting off

Checked 2026-11-24 with `renderToString` on Base UI 1.9.0's `Collapsible`: a closed panel isn't rendered at all by
default, and with `keepMounted` or `hiddenUntilFound` it is rendered with `hidden=""` (the until-found value is set
by an effect in the browser). Tailwind's Preflight makes `[hidden]` `display: none !important` in the base layer,
which no later layer can undo. So Collapsible can't show its text without scripts.

See more is a hand-built disclosure: a `<button aria-expanded aria-controls>` and a panel that is always rendered.
The panel carries `data-open` while open and the class `scripted:not-data-open:hidden`: with scripts it hides until
opened, without them it shows. The button, the filters and View (one wrapper) and the mode control are
`hidden scripted:…`, as the sketch's `.js` rules hid them.

## Behaviour

- **Filters:** a `RadioGroup` labelled Show. All; Open to anyone (`open`, `docs`, `repo`: 22 cards); Needs sign-in
  (`sign-in`, `owner`: 12). A section with no card left hides, and so does its link; counts follow the filter. The
  live region says "Showing N cards" after a change and is empty in the HTML.
- **View:** a `RadioGroup` labelled View after the filters, Cards and Compact, each with an icon and its word, drawn
  as the filters' chips. A choice sets or removes `data-view` and writes `gatehouse.view`; nothing re-renders the
  sections. A filter keeps the view; the owner's cards follow it.
- **The section row:** the links on its first line, the filters and View on the second (View at its end, by
  `justify-between`, wrapping to a line of its own where the two don't fit: a phone, Terminal at 640 px). It was one
  line from 1240 px until View joined it; that line had 23 to 76 px left, so the row is two lines at every width.
- **Levelled rows:** `useLevelRows` gives each card's head, blurb and actions (`data-level`) the height of the
  tallest in its row, after mount, on a filter change, a width change, a view change (a MutationObserver on
  `data-view`) and when the fonts load. See more sits below them, so an opened card grows alone. Without scripts the
  rows are unlevelled.
- **Phone:** below 640 px the section row's wrappers are `display: contents`, so only the links stick (`top: 0`,
  48 px links); the filters and View scroll away, View on its own line with its words. Sections set
  `scroll-margin-top` 60 px (92 from 900 px, where the row sticks as a whole: at 84 a jump left Profile's two-line row
  5 px over the title). There is no phone navigation panel, so base-ui rule 15 has nothing to apply to.
- **Pictures:** the first section's first three load eagerly (React preloads them); the rest are lazy. A fresh
  visit in Compact fetches those three and no other, scrolled to the end.

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

- The built HTML: 5 sections, all 36 public cards by id, each `more` text, none of the 4 owner cards.
- Scripting off (headless Chrome, the preview): 5 sections, 36 cards and 36 See more texts shown; no See more
  button, filter or mode control. The only failed request is `/favicon.ico`: the page links no icon yet.
- Scripting on, `gatehouse.mode` dark and `gatehouse.look` terminal stored: no console error, Dark chosen.
- sloplint (`--scope app --url http://localhost:5182/ --render`): clean after one fix (below).
- Shots at 1280 x 800 light and 390 x 844 dark beside `design/shots/`: the light one differs in 0.27% of pixels
  (the Behind the scenes count and the heading weight). The dark one differs in 13.8%, and in 0.3% once the build is
  shifted up 6 px: the approved render sits 6 px higher. Measured in Chrome at 390 px, the build's header, section
  row and first card stand where `sketch.html`'s do (the wordmark's top at 29 px in both).

## The View, checked 2026-11-26

In the preview, headless Chrome. A first visit is Cards with no `data-view`. Compact by a click, then a filter, then a
reload: the view, `gatehouse.view` and no picture shown, every row level after each step (heads, blurbs and actions
end at one height per row). With the page script blocked and Compact stored, the first paint already has
`data-view`, no picture and Compact pressed in all three looks. A fresh visit in Compact fetches only the first row's
three eager pictures, scrolled to the end. Tab reaches View (on its tab stop) and the arrows choose. No console error
or warning in either view, any look, 1280 and 390. Scripting off with Compact stored: Cards, 36 See more texts, no
View. Blocked storage: Cards, and a choice holds for the visit. With Compact stored, the group's tab stop stays on
Cards after hydration while Compact is chosen; the mode control does the same with Dark stored (Light keeps the tab
stop), so it is the `RadioGroup` wrapper's, left as it is.

## Where it differs from sketch A

- **Headings at a true 650 weight**, the one difference that is a choice: the sketch asks for 650, but Google's
  fixed weights drew it as 700 in the approved renders. One token switches it: `--font-weight-strong` in the
  stylesheet (700 draws the renders' weight).
- Light is chosen on a first visit; the sketch drew System (rule 14, the decisions).
- Behind the scenes counts 4 for a visitor and 7 once the owner signs in; the sketch drew 8, Grafana included.
- No card is drawn open: the sketch opened Solstice to show See more.
- Pictures after the first three load lazily; the sketch loaded all of them at once.
- A skip link ("Skip to the cards", from sketch B), off screen until focused. sloplint failed it as `sr-only`
  (text under the header), so it sits above the page instead.
- The title is the wordmark and the description the header's line, as in the sketch; the favicon is emitted as a build asset.
- The mode control and filters are radio groups: one tab stop each, arrows move and choose.
