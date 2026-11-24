# Front page sketches: critique

All three keep the shared structure and none turns its metaphor into the navigation. Each needs fixes before the owner picks. I looked at the renders first, then measured in headless Chromium (file://, 1280x800 and 390x844).
The brief's "33 cards in 4 sections" is out of date: the fixture has 38 cards in 5 sections, and the sketches follow the fixture.

## First screen and regressions against the README

| | A Profile | B Terminal | C Ninety-six |
| --- | --- | --- | --- |
| 1280: first card top | 261 px | 334 px | 335 px |
| 1280: whole cards / second row showing | 3 / 136 px of pictures | 3 / 34 px | 3 / 65 px |
| 390: first card top | 422 px | 470 px | 469 px |
| 390: first card's actions above the fold | yes (card ends 821) | **no** (buttons cut at 844, card ends 875) | just (buttons end ~843) |
| 390: page length | 14,273 px, about 17 screens | 14,729 px, about 17.5 | 13,733 px, about 16 |
| 1280: sticky nav height | 52 px | 46 px | **96 px** |

There is no render of the README, so the comparison below is of structure only. In the README, the picture and the bold name are both links. Cards sit 2-3 across, each with a short status line and no row of buttons.
All three sketches beat the README on the phone, where its tables squeeze. They lose to it in three places:

- **R1 (A, B): the screenshot is not a link.** In the README, tapping the picture opens the project. In A and B a tap on the picture does nothing, and the picture is the biggest target on a phone card. C does it right: `<a class="shot" href="{href}" tabindex="-1" aria-hidden="true"><img ...></a>`. This adds no tab stop and no duplicate name. Copy that pattern into A's `.pic` and B's `.shot`.
- **R2 (all): on the phone there is no way between sections.** A 16-17.5 screen page has its section links only at the very top, and nothing is sticky at 390. Make only the scrolling row of section links sticky on the phone (about 48 px, `top:0`, background from the direction's ground or surface token). Let the filter chips scroll away. Set `section{scroll-margin-top:60px}`. The links don't fit across, so the row keeps its horizontal scroll.
- **R3 (all): a sign-in card is as inviting as a public one.** The README's status line warned the reader. Here the 16 sign-in and owner-only cards carry the same filled primary "Open" as the games, and only a small chip warns a non-developer that the button leads to a sign-in wall. Keep the filled primary on `open`, `docs` and `repo` cards. On `[data-access=sign-in]` and `[data-access=owner]` cards, draw it in the direction's secondary style. The fix for each direction is below. The labels and the actions stay as they are.

Checked and fine in all three: filtering hides nav links whose count drops to 0 (no dead anchors); a desktop anchor jump clears the sticky nav; nothing is truncated or clamped.

## A Profile: fix

1. **High, picture not a link (R1). Phone and desktop.** Wrap `.pic img` in `<a class="pic" href tabindex="-1" aria-hidden="true">`. Add `.pic:hover img{opacity:.92}` so the picture shows it can be clicked.
2. **High, no section access on the phone (R2), 390.** `.navwrap` is sticky only on desktop (line 222). Below 640 px:
   - make the section scroller row `position:sticky;top:0;z-index:5;background:var(--surface);border-bottom:1px solid var(--line)`;
   - move the chips row out of the sticky part;
   - set `.sec{scroll-margin-top:60px}`.
3. **Medium, sign-in cards look as inviting as public ones (R3), every viewport.** Add `.card[data-access=sign-in] .btn-primary, .card[data-access=owner] .btn-primary{background:var(--surface);color:var(--ink);border:1px solid var(--line-ui)}`. In dark this also removes 16 of the 38 near-white pills, which are the brightest things on the dark page after the pictures.
4. **Medium, the islands are the quietest of the three, light 1280.** Cards are only 1.12 lighter than the ground, with a 7%/4% shadow. The owner asked for visible islands, not flat minimalism. Fix: `--light-ground:#e5e8ee`, `--light-line:#c4cad4`, `--light-shade-1:rgb(20 28 44/.10)`. The cards stay white and the look stays calm. Dark already separates (#181b21 on #0d0f13 with a hairline).
5. **Low, phone header, 390.** At 17 px, `.line` runs to 3 lines and `.sub` adds 2 more. The nav box is 117 px tall with an inner hairline. The first card fits with only 23 px to spare, so the next card gives no hint below the fold. Fix: on phones set `.line{font-size:16px}` and give the nav box 8 px of padding. This buys about 30 px, so the top of the next picture shows. All text stays whole.

## B Terminal: fix

1. **High, the first phone card loses its buttons below the fold, 390.**
   - The cause: the full-width Light/Dark/System row (44 px plus gaps) sits between the wordmark and the intro, and the section head (prompt line, title, line, dashed rule) takes about 150 px.
   - Theme toggle: at 480 px and below, move `.seg` into the `.bar` row as three icon-only 44x44 cells, with the labels in `.sr`.
   - Section head on phones: `.sec{padding-top:24px}`, `.sechead{margin-bottom:12px;padding-bottom:10px}`.
   - This buys about 80 px, so the buttons end near 795.
   - On desktop the same section-head trim lifts the first card from 334 to about 300 px.
2. **High, picture not a link (R1), everywhere.** Turn `.shot` into a link, as in R1. Keep the 1 px frame.
3. **Medium, sign-in cards look as inviting as public ones (R3).** Add `.card[data-access=sign-in] .btn.primary, .card[data-access=owner] .btn.primary{background:var(--surface);color:var(--ink);border:1px solid var(--edge)}`. That box is the printout's own secondary button.
4. **Medium, black lines everywhere, light 1280.** Each card stacks four ink lines: the card border, the 3 px hard shadow, the picture frame, and the outlined Docs and See more buttons. Across 38 cards they make a black grid, and the name no longer leads. Fix: `.shot{border-color:var(--rule)}` and `.btn:not(.primary){border-color:var(--rule)}`. Keep the ink border and shadow on the card, which is the printout look.
5. **Medium, the address is shown twice, and host addresses are cryptic, every viewport.** The detector's `repeated-container-text` flags `/just-a-bot/docs/` three times in one card. A host shows as a bare `satchel.`, `ward.` or `uptime.`, which means nothing to a non-developer.
   - Drop the Address row from B's See more, since the line under the name already shows it.
   - Write host addresses as `satchel.` followed by `<span class="muted"> own address</span>`, as the brief specifies.
6. **Low, dark 390/1280: the screenshots glare.**
   - Light-ground screenshots (Almanac, Shelfmark, Postern, Lantern, newspapper, CivicMap) are the brightest blocks on the dark amber page.
   - Add `.theme-dark .shot img{filter:brightness(.85)}`, repeat it in the `prefers-color-scheme` block, and restore it with `.card:hover .shot img,.card:focus-within .shot img{filter:none}`. The pictures keep their colour.
   - Also add `<p class="sr" role="status">` for the filter result. A and C announce it; B is silent.

## C Ninety-six: fix

1. **High, the sticky nav is two rows and 96 px tall, 1280.** The section links take one row and the filter chips a second, though both fit on one. The nav costs 96 px of every scrolled screen, and the GitHub button sits alone on a second header row.
   - At 1024 px and up, put both in one row in `.nav`: sections on the left, then a 2 px groove (`border-left:2px groove`), then the filters. Give the panel 6 px of padding, for about 52 px in all.
   - Put GitHub in the theme buttons' row.
   - This buys about 44 px on the first screen and on every scroll.
2. **High, access chips look like buttons, every viewport.**
   - Chips are filled boxes with a 1 px edge, sitting beside bevelled buttons, so a visitor may tap one.
   - The black "Owner only" chip (#262626) is the loudest thing on its card.
   - In dark, the Sign-in chip (#4a5aae) is close to the primary blue (#3347c4).
   - Fix: draw the chips as sunken status fields, the period's read-only label. Use `background:transparent;border:0;box-shadow:inset 1px 1px var(--bevel-inner-dark),inset -1px -1px var(--bevel-inner-light)` with ink text and the icon. Only Open keeps its green face.
3. **Medium, the selected filter and theme barely show, light 1280/390.** "All" and "System" differ from the others only by #e4e4e4 against #c8c8c8 and bold text. Fix: on `[aria-pressed=true]`, keep the inset bevel and add a leading check icon, as B does. A dotted inner focus-style rectangle, as on period toggles, would also work.
4. **Medium, the phone fold is one pixel from cutting the first card, 390.**
   - The full-width theme row (48 px) and the two-row nav panel (128 px) put the first card at 469 px. Its buttons end at about 843 against an 844 fold, so a font fallback or a longer line cuts them.
   - Move the theme buttons into the top row as icon-only 44x44 bevel buttons next to GitHub (about 56 px saved).
   - Halve the nav panel's padding.
5. **Medium, sign-in cards look as inviting as public ones (R3).** On `[data-access=sign-in]` and `[data-access=owner]`, draw `.btn.primary` as the ordinary grey bevel face with ink text. The navy face stays on public cards only, so navy means "you can use this".
6. **Low, a stored theme flashes, any viewport.** C reads `localStorage` at the end of the body (line 656), so a visitor who picked Dark sees the light theme first. Move that read into the head script, as A and B do.

## Heuristics (0-4) and detector

| # | Heuristic | A | B | C | Key issue |
| --- | --- | --- | --- | --- | --- |
| 1 | System status | 3 | 3 | 2 | C's pressed filter is faint; B has no live result |
| 2 | Match real world | 4 | 2 | 3 | B: `$ ls`, `[owner]`, `satchel.` |
| 3 | User control | 3 | 3 | 3 | All can be reset; See more toggles |
| 4 | Consistency | 3 | 3 | 2 | C's chips look like buttons |
| 5 | Error prevention | 2 | 2 | 2 | Same filled Open on sign-in cards (R3) |
| 6 | Recognition | 3 | 3 | 3 | Chips and counts are visible |
| 7 | Flexibility | 2 | 2 | 2 | Filters and anchors, nothing sticky on the phone (R2) |
| 8 | Minimalist design | 3 | 3 | 2 | B's ink grid; C's colour load |
| 9 | Error recovery | n/a | n/a | n/a | No error states on a static index |
| 10 | Help | 3 | 3 | 3 | The sub line explains access; Docs links |
| | **Total** | **26/36** | **24/36** | **22/36** | |

I ran the detector with its parser modules, from a scratch copy linked to an installed `node_modules`.
- **A: 3.** `cramped-padding` on the nav scroller is a false positive (compact toolbar). `overused-font` (Geist) is the brief's choice. `flat-type-hierarchy` (12.5-24 px) is mild: the wordmark (24) barely outranks the section titles (21).
- **B: 12.**
  - `dark-glow` ×6: allowed by the brief (wordmark and section titles only, confirmed in the source).
  - `cramped-padding` ×2 (`.seg`, `.navbar`): false positives, compact toolbars.
  - `clipped-overflow-container` ×2: false positives (`overflow-x:clip` on html and body).
  - `repeated-container-text`: real, see B5.
  - `flat-type-hierarchy`: mild.
- **C: 1.** `flat-type-hierarchy` (13-20 px): a false positive here, because the display face and the navy bars carry the hierarchy.

## Strongest point and biggest risk

- **A, strongest:** the closest to the README the owner named. The pictures lead, it is the calmest to scan, and its phone is the only one with the first card whole and room to spare.
- **A, biggest risk:** it may read as a generic, almost flat template. The islands are faint (A4), and nothing but the screenshots says whose page this is.
- **B, strongest:** a real point of view in both themes, the paper printout and the amber phosphor. The command-style section heads give it character without touching the navigation.
- **B, biggest risk:** for non-developers on a phone, `$ ls ~/play`, `[sign-in]` and the bare addresses are jargon. Mono in every label makes the page feel like it is for someone else.
- **C, strongest:** the most fun and the most distinct. The bevelled islands are the most visible of the three, and the picture links are already right.
- **C, biggest risk:** it breaks the owner's restrained-colour rule. Teal, navy, green, black and link blue all compete, and the owner called busy palettes "too much" before. If C is a contender, offer the slate ground the brief allows as a swap: `--l-ground:#4f5f6e`, white text at 6.6:1.

Do not dilute while fixing: the screenshots as the hero of every card, the visible islands, and each direction's own material (A's calm, B's printout and phosphor, C's bevels).
