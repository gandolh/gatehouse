# Design references

The approved design for Gatehouse's page, kept as the spec for the page briefs (03 to 06). On
2026-11-23 the owner picked all three looks: Profile is the default, and Terminal and
Ninety-six sit behind a switcher ([decisions](../corpus/wiki/decisions.md)). Nobody edits these
files; they record what was approved.

## What is here

| Path | What it is |
| --- | --- |
| `sketches/A/` | Profile: `sketch.html` (open it in a browser) and `tokens.md` (colours by role, contrast) |
| `sketches/B/` | Terminal, the same two files |
| `sketches/C/` | Ninety-six, the same two files. `?ground=slate` shows the slate ground, which was not picked: the teal ground stays |
| `shots/` | Renders of each sketch: `<letter>-<mode>-<width>.webp` at 1280 x 800 and 390 x 844. `c-light-1280-slate.webp` is the slate ground that was not picked |
| `directions.md` | The brief the sketchers worked from: the shared structure, the floor, and what each look is |
| `critique.md` | The design-critic pass on the first sketches, with the fixes it asked for |

The pictures the sketches show are the card pictures in `content/images/`, and the words are
the ones in `content/cards.json`.

## Which file wins

1. The decisions in `corpus/wiki/decisions.md` and the briefs.
2. `sketch.html` and `tokens.md`. The critique's fixes are already in them: the picture is a
   link, the section row sticks on the phone, sign-in and owner cards draw Open as a secondary
   button, Profile's ground is darker, and Ninety-six's nav is one row on a desktop.
3. `critique.md`, for why each of those fixes was made.
4. `directions.md`, where the later files don't say.

## What is out of date

- The directions count 33 cards in 4 sections. The list has 38 cards in 5 sections; the sketches
  follow the list.
- The directions put an Updated date in See more. Nothing on the page is live: no date, no up
  or down label.
- The sketches switch light and dark with `.theme-light` and `.theme-dark` classes. The page uses
  `data-look` and `data-mode` on `<html>`.
- In the sketches, a path link is relative (`/solstice/`), a host link points at
  `<name>.example.org`, a GitHub link at `github.com/owner/`, and the wordmark reads "wordmark".
  The real values are in `content/cards.json` and in the build's origin.
- The sketches show the owner's four hosts (Grafana, the vault, mail, brief-board) to everyone.
  On the page they show only after the owner signs in.
- The sketches have no look switcher and no sign-in entry. Both sit in the footer and were never
  drawn; brief 04 adds the switcher and brief 06 the sign-in.
