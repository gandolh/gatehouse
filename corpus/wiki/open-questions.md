---
summary: What is still open for Gatehouse as of 2026-11-24, taste kept apart from technical. Taste, for the owner when brief 06 reaches Ready for test - the look switcher in the footer and the sign-in entry, neither drawn. The first visit's mode is settled (light, the owner's estate-wide answer of 2026-11-10). Technical, each checked first by the brief that meets it - whether Vite's base, the SSR build and the prerender put every file the page loads under /gatehouse/ with the page at dist/index.html (01, again in 03), whether a closed Base UI Collapsible can show its text with scripting off (03), whether Ward's library runs with no local account and the admin role arrives through the grant (07).
updated: 2026-11-24
---

# Open questions

## Taste, for the owner

- **The look switcher.** It sits in the footer and was never drawn. Brief 04 draws it plainly in
  each look; the owner judges it with brief 06's screens.
- **The sign-in entry.** How the footer's sign-in reads to a visitor who isn't the owner, and what
  the signed-in page looks like. Brief 06 draws the states; the owner judges them at Ready for test.

## Technical, checked by the brief that meets them

- **Vite's `base` and the prerender.** Nothing here has been built yet. Brief 01 checks on a
  scratch app, with a font, a picture with a `srcset` and a dynamic import:
  - that `base: "/gatehouse/"` in the build only puts every file the page loads under
    `/gatehouse/` (the path check's scope is in [architecture.md](architecture.md));
  - that the URLs the SSR render writes name the files the client build wrote;
  - that the page is `dist/index.html` with only the assets folder beside it, and no `public/`
    folder is needed;
  - where `vite preview` shows the built page.

  Brief 03 runs the check again once the page has fonts and pictures.
- **See more with scripting off.** Base UI's `Collapsible` hides a closed panel with the `hidden`
  attribute, and Tailwind's Preflight makes `[hidden]` `display: none !important`. Brief 03 checks
  what a closed panel renders on the server; the fallback is a hand-built disclosure (a button with
  `aria-expanded`, the panel hidden only once the head script has marked the page as scripted).
- **Sign in with Ward and nothing else.** Ward's library has no switch that turns local sign-in
  off. Brief 07 checks that the API runs with no local account and no seed, and that the owner's
  `admin` role arrives through Ward's grant on the first sign-in.
