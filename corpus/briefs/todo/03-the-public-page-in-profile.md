# Task 03: The public page in Profile

**Depends on:** 01, 02.

**Runs before:** 04, 05, 06.

**Builder:** Opus ([routing.md](../../routing.md)).

**Visual work.** This brief builds an approved design. Follow the sketch; don't redesign it.

## Context

The page's first look is Profile, the default, drawn in `design/sketches/A/sketch.html` with its
tokens in `design/sketches/A/tokens.md` and renders in `design/shots/a-*.webp`. Read
`design/README.md` first: it says which file wins and what in the sketches is out of date. What the
page holds and who sees what: [overview.md](../../wiki/overview.md),
[card-list.md](../../wiki/card-list.md); how it is built: [architecture.md](../../wiki/architecture.md).

This brief writes the markup that all three looks share, so briefs 04 and 05 add only tokens, skin
rules and fonts. Every element the Terminal and Ninety-six sketches need is in the markup now,
hidden in Profile. Read sketches B and C before you write a component: Terminal's command line and
item count in each section head and its address line under a card's name; Ninety-six's sunken
access fields and the check icon on a pressed toggle; each sketch's icon-only mode buttons on a
phone.

### Where this brief overrides a skill or a sketch

- **`data-mode`, not `data-theme`,** on `<html>`, next to `data-look`. The `base-ui` skill's rule
  14 names `data-theme`; this page has no React, and the glossary keeps "theme" out.
- **A first visit is System** (light unless the device asks for dark), as the sketches draw it.
  The `base-ui` skill's rule 14 says light first; the owner hasn't ruled between the two, so it
  is in `open-questions.md`. Build System; switching later is one default in the head script.
- **No Hallmark deal.** `DESIGN.md` at the root (step 1) is a locked system, so the hallmark skill
  reads it instead of dealing a theme.
- **The sketches' `.theme-light` / `.theme-dark` classes** become the data attributes; the sloplint
  gate that misreads those classes doesn't apply.
- **Not in this brief:** the look switcher (04) and the sign-in entry (06). Leave room for both in
  the footer.

## Files you OWN

- `DESIGN.md` at the repo root (new)
- `web/src/`: the page, its components, the stylesheet, the inline head script and the page script
- `web/astro.config.*` and `web/package.json` for fonts and the build guard
- The build guard script and its test
- Corpus: `corpus/wiki/architecture.md`, `corpus/wiki/status.md`, `corpus/log.md`, and a new
  `corpus/wiki/page.md` for the page's components and checks

## Files you must NOT touch

- `design/`, `content/cards.json`, `server/`.

## Steps

1. **`DESIGN.md`**, in the shape the hallmark skill's design-md reference gives, with one block
   per look: Profile, Terminal and Ninety-six, each with its tokens by role for light and dark,
   copied from the three `tokens.md` files, its fonts, and its controls. Add the structure all
   three share (from `design/directions.md`, "The structure every direction keeps") and the
   critique's fixes R1 to R3. This is the locked system for every later page brief.
2. **Components** in `web/src/components/`: the header (wordmark, `line`, `sub`, GitHub link, mode
   control), the section row (section links with counts, filter chips), a section (title, line,
   Terminal's command line, cards), a card, and the footer (the `footer` line, the GitHub link, an
   empty slot for the look switcher and one for the sign-in). The page renders the public part
   only (`publicCards` from `shared`), with links resolved against `GATEHOUSE_ORIGIN`.
3. **The card**, as sketch A draws it: the picture as a link (`<a href tabindex="-1"
   aria-hidden="true">`, critique R1) in a 16:10 frame with `object-fit: cover; object-position:
   top`; the name; the access label as words and an icon; the blurb; the actions (`Open`, `Read the
   docs` or `View on GitHub`; `Docs` when set; See more). On `sign-in` and `owner` cards Open is the
   secondary button (R3). See more opens inside the card: the `more` text, the address from
   `displayAddress` (a host shows as `satchel.` and "own address"), Docs and Source on GitHub.
   With scripting off, the See more text is shown. Pictures go through `astro:assets` with width and
   height.
4. **Looks and modes.** `<html data-look="profile" data-mode="system">` in the HTML. An inline
   script in `<head>` reads `gatehouse.look` and `gatehouse.mode` from localStorage (inside
   try/catch) and sets both before the first paint. A `?look=` or `?mode=` query parameter
   overrides the stored pick for that load without storing it, so a shot or a sloplint run can
   open any look (sketch C does the same with `?ground=slate`). The stylesheet holds the tokens per look and
   mode as CSS variables; `system` follows `prefers-color-scheme`. Tailwind's `@custom-variant`
   gives `dark` (an explicit dark mode, or system on a dark device) and one variant per look. The
   mode control is a three-way Light / Dark / System group with `aria-pressed`, as drawn; it stores
   the pick. The `theme-color` meta follows the mode.
5. **The page script**, plain TypeScript in an Astro `<script>`: the filters (Open to anyone shows
   `open`, `docs`, `repo`; Needs sign-in shows `sign-in`, `owner`), which hide empty sections and
   their links and announce "Showing N cards" in a live region; See more with `aria-expanded`; the
   equal-height rows the sketch levels; the mode control.
6. **The phone.** Only the row of section links sticks at 390 px (critique R2); the chips scroll
   away; `scroll-margin-top` on sections as the sketch sets it.
7. **Fonts.** Geist and Geist Mono through `@fontsource` (check the package names on npm first),
   imported so they apply only under `[data-look="profile"]`. No Google Fonts link.
8. **The build guard.** After `astro build`, a script reads every file in `web/dist` and fails the
   build when it finds an owner-part card's resolved link, its blurb, its `more` text, or its id in
   the form the card component writes it (`id="c-<id>"` or whatever you chose). Not the bare word:
   "mail" appears in Postern's blurb. A test plants an owner card's blurb in a scratch `dist` and
   expects the failure. `npm run build` runs the guard.
9. **Check the addresses again**: with fonts and pictures in, every URL in the built HTML and CSS
   starts with `/gatehouse/`, as brief 01 found.
10. **Floor and sloplint.** Run the hallmark skill's `scripts/sloplint.mjs --scope app --url
    http://localhost:5182/ --render` against the dev server. Fix every FAIL; list each REFLEX you
    keep with its reason in the outcome.
11. **Shots.** Light at 1280 x 800 and dark at 390 x 844, placed beside `design/shots/a-light-1280.webp`
    and `a-dark-390.webp`. Read them side by side for drift. Keep the shots out of git.
12. The corpus: `page.md` (components, the script, the guard, the checks), `architecture.md`,
    `status.md`, a `log.md` entry.

## Acceptance

- [ ] `DESIGN.md` holds all three looks' tokens for light and dark, matching the three `tokens.md`.
- [ ] With scripting off, the page lists all 34 public cards in 5 sections, each with its See more
      text, and none of the 4 owner cards.
- [ ] `npm run build` with `GATEHOUSE_ORIGIN` set passes; the guard's test passes; every built URL
      starts with `/gatehouse/`.
- [ ] At 1280 x 800 light, the first row of cards shows on the first screen. At 390 x 844 dark, the
      first card's buttons are above the fold, and the section links stick while scrolling.
- [ ] A stored mode applies before the first paint: no light flash with `gatehouse.mode` set to
      dark (checked with a throttled reload).
- [ ] In the network panel, only Geist and Geist Mono download.
- [ ] sloplint: no FAIL. Shots read against the sketch's renders, with differences listed in the
      outcome.
- [ ] `npm run check` exits 0; `bash corpus/lint.sh` passes.

## Owner steps

- None. The owner judges the page with brief 06's screens.

## Owner decisions

- Settled 2026-11-23: Profile is the default look; the structure, the access labels, See more
  inside the card, nothing live.
- Settled 2026-11-23: look and mode are two controls, both stored, both applied before the first
  paint; the look switcher and the sign-in sit in the footer.
