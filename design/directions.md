# Front page: directions

The page goes at the root of the owner's domain, which today answers with a plain 404.
It lists every app, site and docs page the server answers, grouped in sections, as
cards. A visitor opens the root, sees everything grouped, clicks a card to go to the
app, and can open "See more" on a card for an explanation and its other links.

The owner asked for "something similar to my GitHub profile", "dev-ish, or maybe
something retro 80-90s". The owner picks from these sketches; there are no judges.

## Inputs

- Content: the shared fixture, which became `content/cards.json` at the repo root. Use it
  exactly: every section, every card, the same order and words. 33 cards in 4 sections.
- Pictures: `content/images/<file>.webp` at the repo root, 800 px wide, mostly 16:10, a few 2:1 or square.
  Show them in a fixed 16:10 frame with `object-fit: cover; object-position: top`.
- The baseline is the owner's GitHub profile README, which this page grows out of:
  a card grid grouped by purpose, each card a screenshot, a bold name, one sentence
  and a small status line. It is calm, structured and readable on a phone.
  (The raw copy the sketchers had stays out of this repo.)

## What the owner has told us before (binding)

- A metaphor must never become the navigation. A past portfolio built as "model kits
  on a shelf" was rejected as hard to navigate, and the owner asked for a simpler,
  more common UI. The style is a skin. The structure below is the same in all three.
- The owner prefers visible structure: cards and surfaces that read as separate
  islands, never one flat sheet.
- Default to light, with dark following the system and a toggle in the header.
- Visitors are mostly non-developers arriving from a link, often on a phone.
- Restrained colour. One accent at most besides the access colours.

## The structure every direction keeps

1. **Header:** the wordmark, the fixture's `line` and `sub`, a GitHub link, and a
   three-way theme toggle (Light, Dark, System). No hero image, no big headline
   competing with the cards; the first screen at 1280x800 must already show the
   first row of cards.
2. **Section nav:** anchor links to the four sections with their card counts, and
   the filter chips from the fixture (`All`, `Open to anyone`, `Needs sign-in`).
   The chips filter cards in place with a few lines of JS; content stays visible
   with scripting off. Sticky on desktop is fine; on the phone it scrolls
   horizontally inside its own box.
3. **Sections** in fixture order, each with its title, its line and its cards.
   Grid: 3 columns at 1280, 2 at tablet, 1 on the phone. `minmax(0, 1fr)` tracks.
4. **Card:** the picture (when the card has one), the name, the access chip, the
   blurb, then a row of actions: the primary link "Open" (the card's `href`; for
   `docs` access it says "Read the docs"), "Docs" when `docs` is set, and a
   "See more" toggle. The whole card is not one giant link; the actions are real
   `<a>` and `<button>` elements.
5. **See more** expands inside the card, pushing the cards below it down (a
   `<details>` or a button with `aria-expanded`). It shows the `more` text and a
   small fact list: the address (path or host, shown as text without the domain,
   for example `/solstice/` or `satchel.` + "own address"), Docs, Source on GitHub
   (when set), Updated (the date, written as 23 Nov 2026). The card named in
   `expandedInSketch` is drawn open in the sketch.
6. **Access chip:** text always, never colour alone: Open, Sign-in, Owner only,
   Docs only. Open and the rest must be told apart at a glance.
7. **Behind the scenes** is `compact`: smaller cards without pictures (or a dense
   list of rows), so the operational hosts don't take a screen each.
8. **Footer:** the fixture's `footer` line and the GitHub link.

## Floor for every sketch (Hallmark's Floor, applied to an app screen)

Read the hallmark skill's `SKILL.md`,
section "The Floor", and keep it, with these readings for this page:
- Every colour and font through tokens; two theme classes on the root
  (`.theme-light`, `.theme-dark`) plus `prefers-color-scheme` when neither is set.
- No eyebrows, no tracked capitals for labels (rule 9). Rule 9's exception applies
  to direction B only, where mono is the material.
- No decorative dots, no middle-dot meta strings, no emoji, no drawn browser or
  OS windows around anything (rule 11). This binds direction C most.
- Rules 12 and 13 (hero, 80 words) are for landing pages: here the header is short
  and the cards are the content.
- Run the hallmark skill's `scripts/sloplint.mjs sketch.html --scope app --render`
  if it runs, and fix every FAIL. If it does not run, say so in your report.
- Plain English copy. Use the fixture's words; do not add taglines.

---

## A. Profile

**The feel:** the GitHub profile README, made into a real page. Calm, familiar,
quick to scan. This is the restrained option and the closest to what the owner named.

- Calibrate on `vercel` and `linear.app` in
  the design-md-library skill's `references/design-md/`
  for restraint and hairlines. Borrow relationships, never their palettes.
- Neutral, slightly cool ground; white cards with a 1 px border and a faint shadow;
  one accent for links and focus. In dark, cards are lighter than the ground.
- A clean sans for everything (Geist or Mona Sans from Google Fonts, with a system
  fallback), a mono only for the address and the date in See more.
- The one structural move: the screenshot is the hero of each card, large and crisp,
  with the name in bold under it, like the README's table cells, but in a real grid
  with equal heights per row.
- Access chips as small outlined pills: Open in a green family, the others neutral
  with a lock icon (inline stroke SVG).

## B. Terminal

**The feel:** dev-ish. The page reads like a listing on a well-kept machine, with
an 80s phosphor screen in dark mode. Still a normal web page: anchor nav, cards,
buttons.

- Calibrate on `warp` and `opencode.ai` in the design-md library.
- Mono is the material: IBM Plex Mono or JetBrains Mono for names, labels and the
  nav; a plain sans (IBM Plex Sans) for blurbs and the See more text so the reading
  text stays easy.
- Light: paper. Off-white ground with a faint warm tint, ink text, cards as boxes
  with a 1 px ink border and a 2 px offset shadow, like a printout.
  Dark: amber phosphor. Near-black warm ground, amber text and borders, a very
  subtle glow on headings only, and no scanline overlay on body text (legibility).
- The one structural move: each section title is written as a command and its
  output, for example `ls ~/play` with `6 items` after it, and each card shows its
  address (`/solstice/`, `satchel.`) as a mono line under the name. Do not turn
  the nav into a fake prompt the visitor must type into.
- Access chips as bracketed tags: `[open]`, `[sign-in]`, `[owner]`, `[docs]`, with
  open in the accent and the rest muted.
- Pictures stay in colour; a 1 px border frames them.

## C. Ninety-six

**The feel:** a 1990s personal homepage done with care: bevelled buttons, a tiled
or flat period ground, chunky type, the joy of the early web, without the clutter.
Reads at a glance and still works on a phone.

- Calibrate on `dell-1996` (and `nintendo-2001` for the bright end) in the
  design-md library. This is a deliberate period piece.
- Period palette: a teal or slate ground, light grey panels with a two-tone bevel
  (light top-left, dark bottom-right edges), navy section bars, link blue and
  visited purple for text links. In dark, a deep navy ground with darker raised
  panels and the same bevel logic.
- Type: a period display face for the wordmark and section bars only (for example
  Silkscreen, Pixelify Sans or VT323 from Google Fonts, large enough to read), and
  a plain readable face for everything else (Arimo or Tinos, the metric twins of
  Arial and Times).
- The one structural move: every card is a raised bevelled panel and every action is
  a bevelled button that presses in on click. No title bars with fake window
  controls, no desktop, no icons to double-click: that is rule 11 and the
  model-kit lesson.
- Small honest period touches are welcome: an "Updated" line in the footer, a
  "best viewed in any browser" joke is not. No marquee, no blink, no hit counter.
- Pictures get a 2 px inset frame, like an image in an old page.

---

## What to make

In your folder (`sketches/<letter>/`): `sketch.html`, the four viewport renders and
the two full-page renders the design-sketcher agent defines, and `tokens.md`.
`sketch.html` must work standalone in a browser from that folder (relative image
paths, now `../../../content/images/`). Inline the CSS and JS. Fonts from Google Fonts only.
