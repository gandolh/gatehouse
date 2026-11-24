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
[card-list.md](../../wiki/card-list.md); how it is built, rendered and hydrated:
[architecture.md](../../wiki/architecture.md).

The page is React 19 on Vite with Base UI and Tailwind 4, rendered to HTML at build time and
hydrated ([decisions.md](../../wiki/decisions.md)). Brief 01 left a placeholder `App`, the
prerender and the path check. Follow the `base-ui` skill in full (its checker runs strict) and the
`code-structure` skill's web skeleton for where files go.

This brief writes the markup that all three looks share, so briefs 04 and 05 add only tokens, skin
and fonts. Every element the Terminal and Ninety-six sketches need is in the markup now, hidden in
Profile. Read sketches B and C before you write a component: Terminal's command line and item count
in each section head and its address line under a card's name; Ninety-six's sunken access fields
and the check icon on a checked option; each sketch's icon-only mode buttons on a phone.

### Where this brief overrides a skill or a sketch

- **A first visit is light**, though the sketches draw System pressed. The owner's estate-wide
  answer of 2026-11-10 (the `base-ui` skill's rule 14) settles it. The HTML says
  `data-theme="light"` until a stored pick or `?mode=` says otherwise, and the mode control shows
  Light chosen on a first visit.
- **`data-theme` holds the mode** ([decisions.md](../../wiki/decisions.md)). `design/README.md`
  still says `data-mode`; it was written before the move to React, and the decisions rank above it.
  The page's labels say Mode, never Theme.
- **The sketches' pressed buttons are radios.** The mode control and the filters are Base UI
  `RadioGroup`s (rule 16: one is always chosen, nothing is saved to the server), drawn as the
  sketch's buttons; the pressed look keys off `data-checked`.
- **No Hallmark deal.** `DESIGN.md` at the root (step 1) is a locked system, so the hallmark skill
  reads it instead of dealing a theme.
- **The sketches' `.theme-light` / `.theme-dark` classes** become the data attributes; the sloplint
  gate that misreads those classes doesn't apply.
- **Not in this brief:** the look switcher (04) and the sign-in entry (06). Leave room for both in
  the footer.

## Files you OWN

- `DESIGN.md` at the repo root (new)
- `web/src/`: the components, the Base UI wrappers, the card module's type, the stylesheet, the
  entries, the hydration test
- `web/index.html` (the head script), `web/vite.config.ts` (the card module plugin),
  `web/package.json` (Base UI, `cn()`'s two packages, fonts, jsdom)
- `web/scripts/`: the build guard and its test; the prerender if the page needs a change there
- Corpus: `corpus/wiki/architecture.md`, `corpus/wiki/open-questions.md`, `corpus/wiki/status.md`,
  `corpus/log.md`, and a new `corpus/wiki/page.md` for the page's components and checks

## Files you must NOT touch

- `design/`, `content/cards.json`, `server/`.

## Steps

1. **`DESIGN.md`**, in the shape the hallmark skill's design-md reference gives, with one block
   per look: Profile, Terminal and Ninety-six, each with its tokens by role for light and dark,
   copied from the three `tokens.md` files, its fonts, and its controls. Add the structure all
   three share (from `design/directions.md`, "The structure every direction keeps") and the
   critique's fixes R1 to R3. This is the locked system for every later page brief.
2. **The card module.** A small Vite plugin in `web/vite.config.ts` gives the page a virtual
   module, in dev and in the build: the public part only (`publicCards` through `shared`'s
   loader), links resolved against `GATEHOUSE_ORIGIN`, the address from `displayAddress`, and each
   picture imported so Vite fingerprints it under `/gatehouse/`. Vite gives a picture only a URL,
   so the plugin reads each one's width and height from its webp header (no image package; the
   pictures are 800 px wide or less already, so nothing is resized). Only `main.tsx` and
   `entry-server.tsx` import the module; `App` takes the cards as props. An ambient declaration in
   `web/src/` types the module, so the typecheck passes on a fresh clone. Nothing under `web/src`
   imports `content/cards.json`, the loader or `ownerCards`.
3. **Components**, laid out as the `code-structure` skill's web skeleton: a feature folder per
   domain under `web/src/features/`, Base UI wrappers in `web/src/components/ui/` (copied from the
   `base-ui` skill's references and restyled with the page's tokens), `cn()` in `web/src/lib/`. The
   header (wordmark, `line`, `sub`, GitHub link, mode control), the section row (section links with
   counts, filters), a section (title, line, Terminal's command line, cards), a card, and the
   footer (the `footer` line, the GitHub link, an empty slot for the look switcher and one for the
   sign-in). Base UI 1.9.0, `clsx` 2.1.1 and `tailwind-merge` 3.7.0, the estate's pins.
4. **The card**, as sketch A draws it: the picture as a link (`<a href tabindex="-1"
   aria-hidden="true">`, critique R1) in a 16:10 frame with `object-fit: cover; object-position:
   top`, the `<img>` carrying its width and height; the name; the access label as words and an
   icon; the blurb; the actions (`Open`, `Read the docs` or `View on GitHub`; `Docs` when set; See
   more). On `sign-in` and `owner` cards Open is the secondary button (R3). The card takes the
   card's data as props, so brief 06 renders the owner cards with it unchanged. See more opens
   inside the card: the `more` text, the address (a host shows as `satchel.` and "own address"),
   Docs and Source on GitHub, behind a button with `aria-expanded`.
5. **See more with scripting off.** The `more` text must be in the HTML and shown when scripts
   don't run, while the server HTML and the first client render stay equal. First check what Base
   UI's `Collapsible` renders on the server for a closed panel: it hides one with the `hidden`
   attribute (or `hidden="until-found"`), and Tailwind's Preflight makes `[hidden]`
   `display: none !important`. If it can't show without scripts, build the disclosure by hand: a
   button with `aria-expanded` and `aria-controls`, the panel always rendered, hidden by a class the
   stylesheet applies only once the head script has marked `<html>` as scripted. A disclosure isn't
   among the widgets rule 13 sends to Base UI. Record the finding in `open-questions.md` and
   `page.md`.
6. **Looks and modes.** `web/index.html` keeps `<html data-look="profile" data-theme="light">`. Its
   inline `<head>` script reads `gatehouse.look` and `gatehouse.mode` from localStorage (inside
   try/catch), sets both attributes before the first paint, and marks `<html>` as scripted. A
   `?look=` or `?mode=` query parameter overrides the stored pick for that load without storing it,
   so a shot or a sloplint run can open any look (sketch C does the same with `?ground=slate`). The
   stylesheet holds the tokens per look, light and dark as the `base-ui` skill's theme reference sets
   them; `system` follows `prefers-color-scheme`. Tailwind's `@custom-variant` gives `dark` (keyed
   off `data-theme`) and one variant per look. The mode control is a `RadioGroup` labelled Mode,
   drawn as the sketch's three-way Light / Dark / System group; a choice sets `data-theme` and
   stores `gatehouse.mode`. The `theme-color` meta follows the look and the mode.
7. **The page's behaviour**, in the components: the filters (All; Open to anyone shows `open`,
   `docs`, `repo`; Needs sign-in shows `sign-in`, `owner`) hide empty sections and their links and
   announce "Showing N cards" in a live region; See more; the equal-height rows the sketch levels;
   the mode control.
8. **Hydration.** React renders inside the root element, never `<html>`. Nothing is read from
   localStorage or the address during render: the stored mode, a look and the query overrides are
   read after mount (an effect, or `useSyncExternalStore` with a server snapshot), from the
   attributes the head script set. Add a jsdom test: render the page as the prerender does, set a
   stored dark mode and the Terminal look the way the head script would, hydrate with
   `hydrateRoot`, and expect no recoverable error and the mode control showing Dark after mount.
9. **The phone.** Only the row of section links sticks at 390 px (critique R2); the filters scroll
   away; `scroll-margin-top` on sections as the sketch sets it. There is no phone navigation panel,
   so rule 15's drawer has nothing to apply to.
10. **Fonts.** Geist and Geist Mono through `@fontsource` (check the package names on npm first),
    imported from the stylesheet so they apply only under the Profile look. No Google Fonts link.
11. **The build guard.** After the prerender, `web/scripts/` gets a script that reads every file in
    `web/dist` (HTML, scripts, styles, and source maps if any are written; Vite writes none by
    default) and fails the build when it finds an owner-part card's:
    - link, as written (`host:vault`) and as resolved against `GATEHOUSE_ORIGIN`;
    - blurb or `more` text;
    - id, in the form the Card component writes it in HTML (`id="c-<id>"` or whatever you chose)
      and in the form an object literal holds it in a script (`id:"vault"`, `"id":"vault"`).

    Not the bare word: "mail" appears in Postern's blurb. Its test plants an owner card's blurb in
    a scratch `dist`'s HTML, another's `more` text and id in a scratch script, and expects each
    to fail. `npm run build` runs the guard after the path check.
12. **Check the addresses again**: with fonts and pictures in, the path check passes, and its
    URL list now holds the font files and the pictures.
13. **Floor and sloplint.** Run the hallmark skill's `scripts/sloplint.mjs --scope app --url
    http://localhost:5182/ --render` against the dev server. Fix every FAIL; list each REFLEX you
    keep with its reason in the outcome.
14. **Shots.** Light at 1280 x 800 and dark at 390 x 844, placed beside
    `design/shots/a-light-1280.webp` and `a-dark-390.webp`. Read them side by side for drift. Keep
    the shots out of git.
15. The corpus: `page.md` (components, the card module, hydration, See more, the guard, the
    checks), `architecture.md`, `open-questions.md`, `status.md`, a `log.md` entry.

## Acceptance

- [ ] `DESIGN.md` holds all three looks' tokens for light and dark, matching the three `tokens.md`.
- [ ] The built `web/dist/index.html`, read as text, holds all 34 public cards in 5 sections, each
      with its `more` text, and none of the 4 owner cards. With JavaScript off, the preview of the
      built page shows them and each See more text.
- [ ] `git grep -nE "cards\.json|ownerCards|loadCards" -- web/src` finds nothing.
- [ ] `npm run build` with `GATEHOUSE_ORIGIN` set passes; the guard's test fails on a planted leak
      in the HTML and in a script; the path check passes with the fonts and pictures in its list.
- [ ] The hydration test passes. With JavaScript on, the preview of the built page shows no
      hydration error in the console, with a stored mode and look set.
- [ ] At 1280 x 800 light, the first row of cards shows on the first screen. At 390 x 844 dark, the
      first card's buttons are above the fold, and the section links stick while scrolling.
- [ ] A stored mode applies before the first paint: no light flash with `gatehouse.mode` set to
      dark (checked with a throttled reload).
- [ ] In the network panel, only Geist and Geist Mono download.
- [ ] sloplint: no FAIL. Shots read against the sketch's renders, with differences listed in the
      outcome.
- [ ] `npm run check` exits 0, `check-base-ui` strict included; `bash corpus/lint.sh` passes.

## Owner steps

- None. The owner judges the page with brief 06's screens.

## Owner decisions

- Settled 2026-11-23: Profile is the default look; the structure, the access labels, See more
  inside the card, nothing live.
- Settled 2026-11-23: look and mode are two controls, both stored, both applied before the first
  paint; the look switcher and the sign-in sit in the footer.
- Settled 2026-11-24 (the owner): React instead of Astro, rendered at build time and hydrated.

## Outcome (2026-11-24)

Built as written, Done on the board (nothing deploys yet). Details in [page.md](../../wiki/page.md).

- `DESIGN.md` holds all three looks' tokens by role, light and dark, from the three `tokens.md`, with the shared
  structure, R1 to R3 and each look's controls.
- The card module is `cardModule()` in `web/vite.config.ts` (`virtual:gatehouse-cards`, typed by
  `web/src/card-module.d.ts`); picture sizes come from the `VP8 ` header. Only the two entries import it.
- The page: `web/src/components/` (Header, Footer with `lookSwitcher` and `signIn` slots, the `RadioGroup` wrapper,
  icons, looks), `web/src/features/cards/` and `web/src/features/mode/`. Terminal's and Ninety-six's elements are in
  the markup, hidden in Profile. `Card` is not yet exported from the feature's index (brief 06 adds it).
- See more: Base UI's `Collapsible` can't show its text without scripts (a closed panel is absent, or `hidden=""`,
  which Preflight hides with `!important`), so it is a hand-built disclosure; recorded in
  [open-questions.md](../../wiki/open-questions.md).
- The guard is `web/scripts/check-owner-part.ts`, last in the page's build; it fails on a planted dist (exit 1).
- Checks: `npm run check` exit 0 (`check-base-ui` strict, 43 tests); `bash corpus/lint.sh` clean; the build passes
  with `GATEHOUSE_ORIGIN` (66 path references, the guard clean); the acceptance grep finds nothing; the built HTML
  holds 34 public cards in 5 sections with every See more text and no owner card; scripting off shows them all;
  hydration with a stored dark mode and Terminal look logs nothing; a throttled reload is dark from its first
  frame; only Geist and Geist Mono download; sloplint is clean.

Deviations: the variable Fontsource packages (one file for every weight) where the brief said `@fontsource`; the
prerender also writes the wordmark as the title and the header's line as the description (the sketch's head), from
`head()` in `entry-server.tsx`; a skip link from sketch B, off screen until focused (sloplint failed it as
`sr-only`); `CLAUDE.md`'s build line names the guard (not an owned file). Differences from sketch A, for the design
critic: [page.md](../../wiki/page.md), "Where it differs from sketch A"; the one real choice is the 650 heading
weight, where the renders drew 700 (`--font-weight-strong` switches it).
