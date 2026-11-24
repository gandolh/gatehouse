# Direction A (Profile): tokens

Fonts: Geist (all text) and Geist Mono (addresses and dates in See more only), from Google Fonts, with system fallbacks.
All colours are declared once in a palette block on `:root`; `.theme-light` and `.theme-dark` map the roles below onto it. With neither class set, `prefers-color-scheme` picks the roles. The page defaults to System (light unless the OS is dark).

## Palette by role

| Role | Light | Dark |
| --- | --- | --- |
| ground | #e5e8ee | #0d0f13 |
| surface (cards, nav bar, pressed toggle) | #fbfbfd | #181b21 |
| surface-2 (hover, toggle track) | #eef0f4 | #20242c |
| line (card and bar hairline) | #c4cad4 | #2f3540 |
| line-ui (button, chip and toggle outlines) | #737c8b | #7e8797 |
| ink (names, headings) | #14171c | #eceef2 |
| body (blurbs, See more text) | #3a414c | #c5cad3 |
| muted (lines under titles, labels, counts) | #566070 | #9aa3b1 |
| accent (links, focus ring) | #1b57c9 | #7fb0ff |
| button fill / button text (primary, pressed chip) | #171a20 / #f6f7f9 | #eceef2 / #12151a |
| ok text / ok outline (Public chip) | #135c2d / #2f8553 | #7bd9a0 / #43a06c |
| shade 1, shade 2 (card shadow) | 10% and 4% blue-black | 40% and 25% black |

## Contrast (measured from computed styles)

| Pair | Need | Light | Dark |
| --- | --- | --- | --- |
| ink on card | 4.5 | 17.38 | 14.85 |
| body on card | 4.5 | 9.96 | 10.48 |
| muted on ground (header sub line) | 4.5 | 5.18 | 7.53 |
| muted on card (fact labels, counts) | 4.5 | 6.15 | 6.77 |
| link on card | 4.5 | 6.25 | 7.85 |
| Public chip text on card | 4.5 | 7.83 | 10.08 |
| Public chip outline on card | 3 | 4.42 | 5.32 |
| Neutral chip text on card | 4.5 | 9.96 | 10.48 |
| Neutral chip outline on card | 3 | 4.08 | 4.76 |
| Primary button text on its fill | 4.5 | 16.26 | 15.75 |
| Primary button fill on card | 3 | 16.86 | 14.85 |
| Secondary button outline on card | 3 | 4.08 | 4.76 |
| Filter chip outline on bar | 3 | 4.08 | 4.76 |
| Focus ring (accent) on card / ground | 3 | 6.25 / 5.26 | 7.85 / 8.73 |
| GitHub button outline on ground (header, footer) | 3 | 3.43 | 5.30 |
| Surface on ground | 1.09 | 1.19 | 1.11 |
| Card hairline on ground (alternative) | 1.3 | 1.34 | 1.56 |

Cards are separated twice: by the lighter surface (1.19 light, 1.11 dark) and by a 1 px hairline that also clears 1.3 against the ground.

Sign-in and Owner only cards draw their primary button as a surface face with the line-ui outline (ink text on surface 17.38 light / 14.85 dark, outline 4.08 / 4.76 on the card), so the filled button means a public link.
