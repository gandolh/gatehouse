# Tokens

Faces: display (wordmark and section bars only) Pixelify Sans; body Arimo; address and path text Cousine. All Google Fonts, fallbacks Arial Black, Arial, Courier New.

Theme: tokens are declared once at `:root` as palette primitives (`--l-*` light, `--d-*` dark) and mapped to role names (`--ground`, `--panel`, `--ink`, ...) by `:root` (light), `.theme-light`, `.theme-dark` and a `prefers-color-scheme: dark` rule for a root with neither class. Default is System (light unless the OS asks for dark).

## Roles

| Role | Light | Dark |
| --- | --- | --- |
| ground (page) | #008080 teal | #0a1033 deep navy |
| text on ground | #ffffff | #eef1ff |
| wordmark hard shadow | #003f5c | #02040f |
| panel (cards, nav, footer) | #c8c8c8 | #243066 |
| button face / pressed face | #c8c8c8 / #e4e4e4 | #2e3b7a / #141c47 |
| ink / soft ink | #000000 / #262626 | #f2f4ff / #d3d9f5 |
| bevel: outer light, outer dark, inner light, inner dark | #ffffff, #1a1a1a, #e8e8e8, #808080 | #7685d6, #02040f, #4a5aae, #121a45 |
| hard drop shadow | #005050 | #02040f |
| section bar / its text | #000080 / #f6f8ff | #3347c4 / #f6f8ff |
| primary button / its text | #000080 / #f6f8ff | #3347c4 / #f6f8ff |
| link / visited | #0000d0 / #551a8b | #9bc0ff / #d9b3ff |
| Public chip (the one access colour) | #006400 face, #f6f8ff text | #1c7f3c face, #f6f8ff text |
| Sign-in, Owner only, Docs only, On GitHub chips | sunken field, no face, ink text and icon | same, ink text and icon |
| sign-in and owner cards: primary button | button face (#c8c8c8), ink text | button face (#2e3b7a), ink text |
| optional slate ground (`?ground=slate`, light only) | #4f5f6e, shadow #1c2630, drop #2b3640 | n/a |
| picture frame | #7a7a7a | #02040f |
| focus: inner ring, outer ring | #000000, #ffff66 | #ffffff, #ffdd33 |

Access is always text plus an icon (globe, lock, key, book, GitHub mark); only Public carries a colour.
Dark panels are lighter than the ground (the Floor), not darker as the directions text says; the bevel keeps the same logic with a pale top-left edge.

## Contrast (WCAG 2.x ratio)

### Light

| Pair | Values | Ratio | Needs | Result |
| --- | --- | --- | --- | --- |
| Text on ground | #ffffff on #008080 | 4.77 | 4.5 | pass |
| Wordmark on its shadow | #ffffff on #003f5c | 11.26 | 3 | pass |
| Ink on panel | #000000 on #c8c8c8 | 12.55 | 4.5 | pass |
| Soft ink on panel | #262626 on #c8c8c8 | 9.05 | 4.5 | pass |
| Ink on button face | #000000 on #c8c8c8 | 12.55 | 4.5 | pass |
| Ink on pressed face | #000000 on #e4e4e4 | 16.52 | 4.5 | pass |
| Link on panel | #0000d0 on #c8c8c8 | 6.57 | 4.5 | pass |
| Visited on panel | #551a8b on #c8c8c8 | 6.58 | 4.5 | pass |
| Section bar text | #f6f8ff on #000080 | 15.09 | 4.5 | pass |
| Primary button text | #f6f8ff on #000080 | 15.09 | 4.5 | pass |
| Public chip text on its face | #f6f8ff on #006400 | 7.01 | 4.5 | pass |
| Sign-in, Owner only, Docs only, On GitHub chip text (ink on panel) | #000000 on #c8c8c8 | 12.55 | 4.5 | pass |
| Count badge | #000000 on #ffffff | 21.00 | 4.5 | pass |
| Chip edge vs panel (UI) | #262626 on #c8c8c8 | 9.05 | 3 | pass |
| Primary button face vs panel (UI) | #000080 on #c8c8c8 | 9.57 | 3 | pass |
| Button dark bevel edge vs panel (UI) | #1a1a1a on #c8c8c8 | 10.40 | 3 | pass |
| Focus ring vs panel | #000000 on #c8c8c8 | 12.55 | 3 | pass |
| Focus ring vs ground | #000000 on #008080 | 4.40 | 3 | pass |
| Slate ground: text on ground | #ffffff on #4f5f6e | 6.57 | 4.5 | pass |
| Slate ground: panel on ground | #c8c8c8 on #4f5f6e | 3.93 | 1.09 | pass |
| Slate ground: wordmark on its shadow | #ffffff on #1c2630 | 15.34 | 3 | pass |
| Surface (panel) on ground | #c8c8c8 on #008080 | 2.85 | 1.09 | pass |
| Section bar on ground | #000080 on #008080 | 3.35 | 1.09 | pass |
| Picture frame on panel | #7a7a7a on #c8c8c8 | 2.57 | 1.09 | pass |

### Dark

| Pair | Values | Ratio | Needs | Result |
| --- | --- | --- | --- | --- |
| Text on ground | #eef1ff on #0a1033 | 16.44 | 4.5 | pass |
| Wordmark on its shadow | #eef1ff on #02040f | 18.17 | 3 | pass |
| Ink on panel | #f2f4ff on #243066 | 11.34 | 4.5 | pass |
| Soft ink on panel | #d3d9f5 on #243066 | 8.89 | 4.5 | pass |
| Ink on button face | #f2f4ff on #2e3b7a | 9.47 | 4.5 | pass |
| Ink on pressed face | #f2f4ff on #141c47 | 14.89 | 4.5 | pass |
| Link on panel | #9bc0ff on #243066 | 6.73 | 4.5 | pass |
| Visited on panel | #d9b3ff on #243066 | 7.01 | 4.5 | pass |
| Section bar text | #f6f8ff on #3347c4 | 6.97 | 4.5 | pass |
| Primary button text | #f6f8ff on #3347c4 | 6.97 | 4.5 | pass |
| Public chip text on its face | #f6f8ff on #1c7f3c | 4.77 | 4.5 | pass |
| Sign-in, Owner only, Docs only, On GitHub chip text (ink on panel) | #f2f4ff on #243066 | 11.34 | 4.5 | pass |
| Count badge | #0a1033 on #f2f4ff | 16.88 | 4.5 | pass |
| Chip edge vs panel (UI) | #d3d9f5 on #243066 | 8.89 | 3 | pass |
| Button pale bevel edge vs panel (UI) | #7685d6 on #243066 | 3.61 | 3 | pass |
| Focus ring vs panel | #ffffff on #243066 | 12.43 | 3 | pass |
| Focus ring vs ground | #ffffff on #0a1033 | 18.51 | 3 | pass |
| Surface (panel) on ground | #243066 on #0a1033 | 1.49 | 1.09 | pass |
| Section bar on ground | #3347c4 on #0a1033 | 2.50 | 1.09 | pass |
| Picture frame on panel | #02040f on #243066 | 1.65 | 1.09 | pass |

Notes:
- A button's edge is the bevel edge that stands out from the panel: the dark bottom-right edge in light, the pale top-left edge in dark. In dark the primary button face (#3347c4) is only 1.68 against the panel, so it relies on that pale edge (3.61) and its text (6.97).
- Focus is a 3 px outline in the inner colour (black in light, white in dark) with a 2 px gap, so it reads on both the panel and the ground.
- Pressed toggles (filter, theme) show an inset bevel, a lighter or darker face, and a check icon; on the phone the icon-only theme buttons show the inset bevel, the face and a heavier icon stroke.

## Floor numbers (script, Chromium, scale factor 1)

- Page overflow at 390, 360, 820 and 1280: 0 px, light and dark.
- Control overflow: none. Every button, chip, badge, heading and line of copy has scrollWidth within clientWidth and children inside its box. On the phone the section links scroll inside their own sticky 56 px box; the filter chips fit whole (366 of 366 at 390, 336 of 336 at 360).
- Ellipsis or line clamp: none on the page.
- Phone targets: every button is 44 px tall; the icon buttons are 44 by 44; the fact-list links are 44 to 45 px. Desktop buttons are 34 to 36 px.
- First screens: at 1280 by 800 the nav is one 48 px row, the first card starts at 302 px, its action buttons end at 669 px, and the second row shows 97 px of pictures. At 390 by 844 the first card starts at 417 px and its buttons end at 790 px.
- Anchor jumps land the section bar just below the sticky nav (76 px against a nav ending at 56 px at 1280; 72 px against 56 px at 390).
