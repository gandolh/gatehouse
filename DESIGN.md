# Design: Gatehouse

The locked system. Every Hallmark run reads this first, and the three looks share it. Change it on purpose; the file is
the rule. It was written on 2026-11-24 from the approved sketches in `design/` (their `tokens.md` files) and the
decisions in `corpus/wiki/decisions.md`, which win over the sketches where they differ.

## System

- Genre: modern-minimal (Profile), with two skins over the same markup: Terminal and Ninety-six.
- Shape of the first page: app screen. One page of grouped cards: a header, a row of section links and filters, five
  sections, a footer. No hero.
- Theme: custom, three looks (vibe: "a GitHub profile grown into a page"; "a listing on a well-kept machine"; "a 1990s
  homepage done with care"). Profile is the default; a visitor picks another in the footer.
- Axes: tinted cool paper / sans display / one blue accent (Profile) · posture: restrained.
- Mode: light, dark or system within each look. A first visit is light. `<html data-theme>` holds the mode and
  `<html data-look>` the look; both are set by the head script before the first paint. Labels say "Mode", never
  "Theme".

## The structure every look keeps

From `design/directions.md` and the critique. A look changes tokens and skin rules, never the markup or the navigation.

1. **Header:** the wordmark, the card list's `line` and `sub`, a GitHub link, and the mode control (Light, Dark,
   System). No hero image, no headline competing with the cards: at 1280 x 800 the first row of cards shows.
2. **Section row:** links to the five sections with their card counts, and the filters All, Open to anyone, Needs
   sign-in. A filter hides empty sections and their links and announces "Showing N cards". Sticky on a desktop.
3. **Sections** in the list's order, each with its title, its line and its cards: 3 columns at 1000 px and up, 2 from
   640 px, 1 on a phone, `minmax(0, 1fr)` tracks. Behind the scenes and On GitHub are compact: no pictures.
4. **Card:** the picture (a link), the name, the access label, the blurb, then the actions: Open (Read the docs on a
   docs card, View on GitHub on a repo card), Docs when set, and See more. The whole card is never one link.
5. **See more** opens inside the card and pushes the cards below it down: the `more` text, the address without the
   domain (a host shows as `satchel.` and "own address"), Docs and Source on GitHub. Nothing live: no date.
6. **Access label:** words and an icon, never colour alone. Public alone carries the access colour.
7. **Footer:** the list's `footer` line, the GitHub link, the look switcher and the owner's sign-in.
8. **With scripting off** every public card and its See more text show; the mode control, the filters and the See more
   buttons hide.

### The critique's fixes (in every look)

- **R1, the picture is a link:** `<a href tabindex="-1" aria-hidden="true">` around the `<img>`, no extra tab stop.
- **R2, the phone keeps a way between sections:** at 390 px only the row of section links sticks (`top: 0`, the
  look's surface behind it); the filters scroll away; sections set `scroll-margin-top` so a jump clears the row.
- **R3, a sign-in card is not as inviting as a public one:** on `sign-in` and `owner` cards Open is drawn as the
  look's secondary button. The filled primary means the card opens for anyone (`open`, `docs`, `repo`).

## Profile (the default)

Tokens by role. `web/src/styles/index.css` is the source of truth: each colour is `light-dark(<light>, <dark>)`, and
`color-scheme` from `data-theme` picks one.

| Role | Token | Light | Dark |
| --- | --- | --- | --- |
| ground | `--color-ground` | #e5e8ee | #0d0f13 |
| surface (cards, section row, pressed mode) | `--color-surface` | #fbfbfd | #181b21 |
| surface-2 (hover, mode track) | `--color-surface-2` | #eef0f4 | #20242c |
| line (card and row hairline) | `--color-line` | #c4cad4 | #2f3540 |
| line-ui (button, chip and mode outlines) | `--color-line-ui` | #737c8b | #7e8797 |
| ink (names, headings) | `--color-ink` | #14171c | #eceef2 |
| body (blurbs, See more text) | `--color-ink-body` | #3a414c | #c5cad3 |
| muted (lines under titles, labels, counts) | `--color-ink-muted` | #566070 | #9aa3b1 |
| accent (links, focus ring) | `--color-accent` | #1b57c9 | #7fb0ff |
| button fill / button text | `--color-button` / `--color-on-button` | #171a20 / #f6f7f9 | #eceef2 / #12151a |
| ok text / ok outline (Public) | `--color-ok` / `--color-ok-line` | #135c2d / #2f8553 | #7bd9a0 / #43a06c |
| shade 1, shade 2 (card shadow) | `--color-shade-1`, `--color-shade-2` | 10% and 4% blue-black | 40% and 25% black |

- Fonts: Geist for all text, Geist Mono for addresses in See more, self-hosted (`@fontsource-variable`). Weights 400,
  500 (controls), 700 (names, section titles, wordmark). The approved renders drew the 650 the sketch asked for as 700, since
  its font file has no 650.
- Type: wordmark 24/1.2, section title 21/1.25, the header line 17/1.45 (16 on a phone), card name 17/1.3, body
  15/1.5, sub line 14.5, controls 14, facts 13.5, access label 12.5.
- Radii: cards and the section row 12 px, controls 8, the mode track 10 and its buttons 7, labels and filters a pill.
- Shadow: `0 1px 2px shade-1, 0 2px 8px shade-2` on cards, the section row and the pressed mode.
- Page: capped at 1232 px, gutters 16 / 24 (640 up) / 32 (1000 up).

## Terminal

From `design/sketches/B/tokens.md`. Light is a paper printout, dark is amber phosphor.

| Role | Light | Dark |
| --- | --- | --- |
| ground | #f4eee0 | #0e0905 |
| surface (cards, footer, mode) | #fffcf5 | #1d1509 |
| surface-sunk (picture backing, hover) | #ece4cf | #2a1e0d |
| ink (text) | #1c1912 | #ffb53d |
| muted (address, labels but Public, captions) | #5a5242 | #cc9835 |
| edge (card, button, row borders) | #1c1912 | #b3832a |
| rule (dashed rules, picture frame, secondary button border) | #857b60 | #8f6a24 |
| shadow (3 px offset, hard) | #1c1912 | #5f4614 |
| accent ([public], prompt, cursor), focus ring | #0b6a3a | #ffe08a |
| primary button and pressed filter | #1c1912 fill, #fffcf5 text | #ffb53d fill, #130d03 text |
| picture dim (dark only, lifted on card hover or focus) | none | brightness(0.85) |
| glow (headings and wordmark only) | none | rgba(255,181,61,0.45) |

- Fonts: IBM Plex Mono (400, 600, 700) for names, labels, access labels, the section row, buttons and section heads;
  IBM Plex Sans (400, 600) for blurbs, See more text, the header lines and the footer.
- The markup it adds, hidden in Profile: the section head's command and its output (`$ ls ~/play`, `6 items`, the
  count of cards shown), the address line under each card's name (`satchel.` with "own address"), the brackets around
  the access words (`[public]`, lower case), the cursor after the wordmark, the check icon on the pressed filter.
- See more drops its Address row (the line under the name shows it). Square corners, a 1 px ink border and a 3 px
  hard shadow on cards; pictures framed in `rule`; secondary buttons boxed in `rule`.
- Phone: the mode control is three icon-only 44 x 44 cells.

## Ninety-six

From `design/sketches/C/tokens.md`. The teal ground stays; the slate ground only on the owner's word.

| Role | Light | Dark |
| --- | --- | --- |
| ground (page) | #008080 | #0a1033 |
| text on ground | #ffffff | #eef1ff |
| wordmark hard shadow | #003f5c | #02040f |
| panel (cards, section row, footer) | #c8c8c8 | #243066 |
| button face / pressed face | #c8c8c8 / #e4e4e4 | #2e3b7a / #141c47 |
| ink / soft ink | #000000 / #262626 | #f2f4ff / #d3d9f5 |
| bevel: outer light, outer dark, inner light, inner dark | #ffffff, #1a1a1a, #e8e8e8, #808080 | #7685d6, #02040f, #4a5aae, #121a45 |
| hard drop shadow | #005050 | #02040f |
| section bar / its text | #000080 / #f6f8ff | #3347c4 / #f6f8ff |
| primary button / its text | #000080 / #f6f8ff | #3347c4 / #f6f8ff |
| link / visited | #0000d0 / #551a8b | #9bc0ff / #d9b3ff |
| Public label face / text | #006400 / #f6f8ff | #1c7f3c / #f6f8ff |
| sign-in and owner cards: primary button | button face (#c8c8c8), ink text | button face (#2e3b7a), ink text |
| picture frame | #7a7a7a | #02040f |
| focus: inner ring, outer ring | #000000, #ffff66 | #ffffff, #ffdd33 |
| slate ground, not picked (`?ground=slate` in the sketch, light only) | #4f5f6e, shadow #1c2630, drop #2b3640 | n/a |

- Fonts: Pixelify Sans for the wordmark and the section bars only; Arimo for everything else; Cousine for addresses.
- Access labels are sunken fields (inset bevel, no face, ink text and icon); only Public keeps its green face. Icons:
  globe (Public), lock (Sign-in), key (Owner only), book (Docs only), the GitHub mark; the markup carries these beside
  Profile's, hidden in Profile, and a book icon on the Docs button.
- Pressed filters and modes show the inset bevel, the pressed face and a check icon (in the markup, hidden in Profile).
- At 1024 px and up the section links and the filters share one row, split by a 2 px groove. Phone: the mode control
  is three icon-only 44 x 44 bevel buttons beside GitHub.

## Controls

- Primary: Profile fills with `button` (8 px radius, 38 px tall, 44 on a phone or a coarse pointer); Terminal fills
  with ink, square; Ninety-six fills navy with a raised bevel.
- Secondary: the look's outline on the surface, same radius and height. On `sign-in` and `owner` cards Open is the
  secondary button (R3).
- Quiet: See more, no outline until hover, pushed to the end of the row; its chevron turns when open.
- The mode control and the filters are radio groups drawn as buttons: the pressed look keys off `data-checked`.

## Motion

- Character: still. Colour transitions of 120 ms on controls and the chevron's turn; nothing else moves. Under reduced
  motion nothing transitions and the page jumps instead of scrolling smoothly.

## Exports

`web/src/styles/index.css` in this project: Tailwind 4's `@theme`, with `light-dark()` pairs, one `@custom-variant` per
look and `dark` keyed off `data-theme`.
