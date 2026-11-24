# Direction B, Terminal: tokens

Faces: `--font-display` IBM Plex Mono (400, 600, 700) for names, labels, chips, nav, buttons, section heads; `--font-body` IBM Plex Sans (400, 600) for blurbs, See more text, header lines, footer. Both from Google Fonts.
Theme classes `.theme-light` and `.theme-dark` on the root; `prefers-color-scheme` decides when neither is set (light is the default tokens). Toggle: Light, Dark, System (stored in localStorage; System removes the class).

| Role | Light (paper printout) | Dark (amber phosphor) |
| --- | --- | --- |
| ground | #f4eee0 | #0e0905 |
| surface (cards, footer, toggle) | #fffcf5 | #1d1509 |
| surface-sunk (picture backing, hover) | #ece4cf | #2a1e0d |
| ink (text) | #1c1912 | #ffb53d |
| muted (address, chips except open, captions) | #5a5242 | #cc9835 |
| edge (card, picture, button, nav borders) | #1c1912 | #b3832a |
| rule (dashed rules, picture frame, secondary button border) | #857b60 | #8f6a24 |
| shadow (3 px offset, hard) | #1c1912 | #5f4614 |
| accent (the [open] tag, prompt, cursor) | #0b6a3a | #ffe08a |
| primary button and pressed chip | #1c1912 on #fffcf5 text | #ffb53d with #130d03 text |
| focus ring | #0b6a3a | #ffe08a |
| picture dim (dark only, lifted on card hover or focus) | none | brightness(0.85) |
| glow (headings and wordmark only) | none | rgba(255,181,61,0.45) |

## Contrast (computed from the token values)

| Pair | Light | Dark | Needs |
| --- | --- | --- | --- |
| ink on ground | 15.16 | 11.25 | 4.5 |
| ink on surface | 17.12 | 10.25 | 4.5 |
| muted on ground | 6.67 | 7.65 | 4.5 |
| muted on surface | 7.53 | 6.97 | 4.5 |
| muted on surface-sunk | 6.09 | 6.29 | 4.5 |
| accent [open] on surface | 6.53 | 13.99 | 4.5 |
| accent on ground | 5.79 | 15.36 | 4.5 |
| primary button text on button | 17.12 | 10.98 | 4.5 |
| focus ring on surface | 6.53 | 13.99 | 3 |
| focus ring on ground | 5.79 | 15.36 | 3 |
| focus ring on pressed toggle/filter (ring = button text colour on button fill) | 17.12 | 10.98 | 3 |
| card edge on ground (UI part) | 15.16 | 5.85 | 3 |
| card edge on surface | 17.12 | 5.33 | 3 |
| picture frame edge on surface-sunk | 13.84 | 4.80 | 3 |
| surface on ground | 1.13 | 1.10 | 1.09 (the 1 px edge adds the 1.3+ backup) |
| rule (secondary button border, picture frame) on surface | 4.10 | 3.66 | 3 |
| rule on surface-sunk (button hover) | 3.31 | 3.30 | 3 |

Access tags are plain words in brackets: `[public]` (accent, bold), `[sign-in]`, `[owner only]`, `[docs only]`, `[on github]` (muted, regular). The filled primary button is for public, docs and repo cards; sign-in and owner cards draw it as the boxed secondary button.
