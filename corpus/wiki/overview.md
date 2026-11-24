---
summary: What Gatehouse is and what its first version does, as planned on 2026-11-24. One page at the root of the domain listing every app, site and docs page as cards in five sections, in three looks (Profile by default, Terminal, Ninety-six) with a light, dark or system mode; See more inside each card; the owner's four hosts shown only after Sign in with Ward, from a small API; what is left out (nothing live, no dates); the nine briefs that build it and vps-deploy's brief 34.
updated: 2026-11-24
---

# Overview

Gatehouse is the page a visitor gets at the root of the owner's domain, which answered a plain 404
until now. It lists everything the server answers, grouped by what each thing is, so someone
arriving from a link can find the app they were sent to and see what else is there. The owner
asked for something like their GitHub profile, "dev-ish, or maybe something retro 80-90s".

## What a visitor sees

- A short header: the wordmark, one line on what the page is, one on what sign-in means, a GitHub
  link and the mode control (light, dark, system).
- A row of section links with their card counts, and three filters: All, Open to anyone, Needs
  sign-in. The row stays at the top while the page scrolls; on a phone only the section links stay.
- Five sections, in this order: Games and toys, Apps for home, Sites for other people, Behind the
  scenes, On GitHub. The last two are compact: smaller cards, no pictures.
- A card: the picture (a link to the app), the name, the access label, one sentence, and the
  actions: Open (or Read the docs), Docs when there are any, and See more. See more opens inside
  the card: a longer text, the address written without the domain, and the GitHub source.
- A footer with one line on how the apps are built, the GitHub link, the look switcher and the
  owner's sign-in.

The page works with scripting off: every public card is in the HTML. The script adds the filters,
See more, the look and mode controls, and the owner part.

The card list, its fields and who sees which card: [card-list.md](card-list.md).

## Three looks

The owner picked all three sketched looks on 2026-11-23 ([decisions.md](decisions.md)). The markup
is the same for all three; only the tokens and the skin rules change.

- **Profile**, the default: the GitHub profile made into a page. Cool grey ground, white cards with
  a hairline, Geist.
- **Terminal**: a listing on a well-kept machine. A paper printout in light, amber phosphor in dark;
  IBM Plex Mono for names and labels, Plex Sans for reading text; each section head written as a
  command and its output.
- **Ninety-six**: a 1990s homepage done with care. Teal ground, bevelled grey panels, navy section
  bars, Pixelify Sans for the wordmark and the bars, Arimo for the rest.

The approved sketches and their token tables are in the repo's `design/` folder.

## The owner part

Four cards (the vault, Grafana, the mail admin and brief-board) are for the owner alone. They are
never in the public HTML. After the owner signs in with Ward from the footer, the page asks the API
for them and adds them to Behind the scenes. How that works: [architecture.md](architecture.md).

## Left out on purpose

- Nothing live: no up or down label, no Updated date.
- English only.
- Older GitHub repos stay off; On GitHub lists five.
- No search: 38 cards fit the section links and the filters.

## The work

Briefs 01 to 09, in order: the skeleton, the card list, the page in Profile, the look switcher and
Terminal, Ninety-six, the sign-in entry and the owner part drawn against a fake API, the owner API
and its container, the owner part wired to Ward, and the README. vps-deploy's brief 34 serves the
page and the API and checks the card list against the stacks. Where each stands:
[status.md](status.md).
