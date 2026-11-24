---
summary: What is still open for Gatehouse as of 2026-11-24, taste kept apart from technical. Taste, for the owner when brief 06 reaches Ready for test - the look switcher in the footer and the sign-in entry, neither drawn, and whether a first visit opens in System or in light. Technical, each checked first by the brief that meets it - whether Astro's assetsPrefix puts every file under /gatehouse/ (01), whether Ward's library runs with no local account and the admin role arrives through the grant (07).
updated: 2026-11-24
---

# Open questions

## Taste, for the owner

- **The look switcher.** It sits in the footer and was never drawn. Brief 04 draws it plainly in
  each look; the owner judges it with brief 06's screens.
- **The first visit's mode.** The sketches open in System (light unless the device asks for
  dark); the estate's `base-ui` rule 14 opens every app in light. Brief 03 builds System. One
  default in the head script changes it.
- **The sign-in entry.** How the footer's sign-in reads to a visitor who isn't the owner, and what
  the signed-in page looks like. Brief 06 draws the states; the owner judges them at Ready for test.

## Technical, checked by the brief that meets them

- **Astro's `assetsPrefix`.** Whether it puts every file the page loads under `/gatehouse/`, fonts
  and pictures included. Brief 01 checks it on a placeholder; brief 03 checks again once fonts and
  pictures exist. The fallback is in [architecture.md](architecture.md).
- **Sign in with Ward and nothing else.** Ward's library has no switch that turns local sign-in
  off. Brief 07 checks that the API runs with no local account and no seed, and that the owner's
  `admin` role arrives through Ward's grant on the first sign-in.
