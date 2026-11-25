# Task 13: A compact view for every section

**Depends on:** nothing.
**Runs before:** the next `node cli.ts gatehouse all`.
**Builder:** Opus. It touches the head script, hydration and all three looks at once.
**Before you start:** run `brief-board guide` (the repo's `CLAUDE.md` says so).

Filed 2026-11-25. The owner asked for a way to switch between the cards as they are and a denser view, "like in an
image gallery". Asked what a card should become, the owner picked compact cards (2026-11-25): every section drawn the
way Behind the scenes and On GitHub already are.

## Context

The page shows 39 cards in five sections. Three sections draw full cards with a picture. Behind the scenes and On
GitHub are compact sections: smaller cards with no picture, set by `data-compact` on the `<section>`. Every look
already styles that variant (`group-data-compact`, [looks.md](../../wiki/looks.md); Terminal 36 px and Ninety-six
34 px buttons). The look and the mode are kept on the device (`gatehouse.look`, `gatehouse.mode`). The head script
in `web/index.html` sets `data-look` and `data-theme` on `<html>` before the first paint, and nothing reads storage
during render ([page.md](../../wiki/page.md), Hydration).

## Decisions

All settled. None of them is open.

- **The control is View, with two choices: Cards and Compact.** Cards is today's page and the default on a first
  visit. Compact draws every section as a compact section. Behind the scenes and On GitHub are compact in both
  views. "Compact section" keeps its glossary meaning. The glossary gets **View** (Cards, Compact).
  _Avoid:_ layout, density, grid/list.
- **It is a setting kept on the device**, like the look and the mode: `gatehouse.view` in localStorage, `cards` or
  `compact`, anything else reads as `cards`. The head script reads it and sets `data-view` on `<html>` before the
  first paint, so a compact choice never flashes full cards. Sections draw compact from `data-view`, not from React
  state read in render. The control reads `data-view` after mount, the way the mode control reads `data-theme`, so
  the prerendered HTML stays the same for every visitor.
- **The widget is the page's `RadioGroup`** (base-ui rule 16: a view mode kept only on the device is a radio group),
  drawn like the filters in each look: pressed state off `data-checked`, the check icon in Ninety-six.
- **It sits in the section row, after the filters**, where a gallery puts its view switch. At 1024 px and up it shares
  the row with the section links and the filters. On a phone it scrolls away with the filters (R2: only the section
  links stick). Each choice has an icon and its word. If the row overflows at 390 px, the choices become icon-only
  44 x 44 cells with their words as accessible names, as the mode control does on a phone.
- **Scripting off shows Cards** and hides the control, the same as the mode control and the filters.
- **Columns don't change:** 3 from 1000 px, 2 from 640 px, 1 on a phone, as compact sections are today. See more,
  the access labels, Open, Docs and the filters work the same in both views. A filter keeps the chosen view.
- **Nothing else moves.** The header, the first row of cards at 1280 x 800 in Cards, the footer and the owner part
  stay as `DESIGN.md` locks them. The owner's cards in Behind the scenes follow the view like every other card.

## Files you OWN

- `web/index.html` (the head script), `web/src/features/cards/` (the listing, sections, the section row), a new
  `web/src/features/view/` for the control and its store, `web/src/styles/index.css`
- The page's tests (`web/src/page.test.tsx` and the cards feature's tests)
- `DESIGN.md` (the section row and the structure list gain the View control), `corpus/wiki/page.md`,
  `corpus/wiki/looks.md`, `corpus/wiki/glossary.md`, `corpus/wiki/status.md`, `corpus/log.md`

## Files you must NOT touch

- `design/` (the approved design, read only), `content/cards.json`, `server/`, `shared/`
- The look switcher and the mode control's behaviour

## Steps

1. Extend the head script: read `gatehouse.view` inside the existing `try`, set `data-view="compact"` only for
   `compact`. Extend the jsdom test that runs the real head script to cover it.
2. Make a section compact when it is a compact section or when `<html>` has `data-view="compact"`, in CSS (a
   variant keyed off `data-view`), so no render reads storage. Hide the pictures in compact view the same way the
   compact sections do. Don't keep a second copy of the compact styles.
3. Add the View control to the section row after the filters, with the store in `web/src/features/view/` (read and write
   `gatehouse.view` with try/catch, set `data-view`), mirroring `web/src/features/mode/`.
4. Check row levelling (`useLevelRows.ts`) in both views, after a switch and after a filter.
5. Update `DESIGN.md`, the glossary, `page.md` and `looks.md`.

## Acceptance

- [ ] `npm run check` exits 0; `npm run build` with `GATEHOUSE_ORIGIN` set passes the path check and the owner-part
      guard.
- [ ] Tests: the head script sets `data-view` from storage, and leaves it off for a missing, blocked or unknown
      value; the control writes `gatehouse.view`; the prerendered HTML has no `data-view` and is the same for every
      visitor; hydration logs no mismatch with `compact` stored.
- [ ] A first visit shows Cards. Choosing Compact and reloading shows Compact with no flash of pictures. Checked in
      the preview, headless Chrome.
- [ ] Shots of each look in each view at 1280 x 800 light and 390 x 844 dark (12 images), kept outside the repo and
      named in the outcome. Nothing clipped, no horizontal scroll at 390 px, the control
      reachable by Tab and arrow keys.
- [ ] Scripting off: Cards, every See more text shown, no View control.
- [ ] `bash corpus/lint.sh` passes.
- [ ] Before Ready for deploy, the controller runs a design-critic pass on the 12 shots against `design/shots/` and
      `DESIGN.md`: Cards must match today's page, and Compact must read as the compact sections already do in each
      look.

## Owner steps

- `node cli.ts gatehouse all` from vps-deploy.

## Owner decisions

- Settled 2026-11-25 (owner): compact view = compact cards in every section (not list rows, not picture tiles).
- The name, default, placement, storage and scripting-off behaviour are the controller's calls, taken from the
  approved design and how the look and the mode already work.
