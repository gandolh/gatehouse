---
summary: What is still open for Gatehouse as of 2026-11-24, taste kept apart from technical. Taste, for the owner when brief 06 reaches Ready for test - the look switcher in the footer and the sign-in entry, neither drawn. The first visit's mode is settled (light, the owner's estate-wide answer of 2026-11-10). Technical, each checked first by the brief that meets it - Vite's base, the SSR build and the prerender answered by 01 (every file under /gatehouse/ with base set for the build and the preview, the page at dist/index.html, no public/ folder, the preview at /gatehouse/; 03 checks again), whether a closed Base UI Collapsible can show its text with scripting off (answered by 03: no, so See more is a hand-built disclosure), whether Ward's library runs with no local account and the admin role arrives through the grant (07).
updated: 2026-11-24
---

# Open questions

## Taste, for the owner

- **The look switcher.** It sits in the footer and was never drawn. Brief 04 draws it plainly in
  each look; the owner judges it with brief 06's screens.
- **The sign-in entry.** How the footer's sign-in reads to a visitor who isn't the owner, and what
  the signed-in page looks like. Brief 06 draws the states; the owner judges them at Ready for test.

## Technical, checked by the brief that meets them

- **Vite's `base` and the prerender: answered 2026-11-24 (brief 01).** On a scratch app with a
  font, two pictures in a `srcset`, an icon and a dynamic import:
  - `base: "/gatehouse/"` for the build and the preview (`command === "build" || isPreview`), `/`
    in dev, put every file the page loads under `/gatehouse/`; `experimental.renderBuiltUrl`
    wasn't needed. The URL list is in [architecture.md](architecture.md), Addresses.
  - The SSR render writes the URLs the client build wrote: the hashes come from the content.
  - The page is `dist/index.html` with only `assets/` beside it; the SSR bundle goes to
    `dist-ssr/`. No `public/` folder is needed (`publicDir` is off): an icon linked from
    `index.html` as a source file is fingerprinted under the base like the rest.
  - `vite preview` shows the built page at `http://localhost:4182/gatehouse/` and redirects `/`
    there. Without the base in the preview, the page's files fell through to `index.html`.

  Brief 03 ran the path check again with the page's fonts and pictures in: 66 references, all under
  `/gatehouse/`, the 11 Geist and Geist Mono files and the 25 pictures among them.
- **See more with scripting off: answered 2026-11-24 (brief 03).** No. On the server, Base UI
  1.9.0's `Collapsible` leaves a closed panel out of the HTML by default, and with `keepMounted` or
  `hiddenUntilFound` writes it with `hidden=""` (the until-found value comes from an effect in the
  browser). Preflight's `[hidden]` rule is `display: none !important` in the base layer, which no
  later layer can undo. See more is a hand-built disclosure instead: a button with `aria-expanded`
  and `aria-controls`, the panel always rendered and hidden by `scripted:not-data-open:hidden` only
  once the head script has set `data-scripted`. With scripting off the preview shows all 34 See more
  texts ([page.md](page.md)).
- **Sign in with Ward and nothing else.** Ward's library has no switch that turns local sign-in
  off. Brief 07 checks that the API runs with no local account and no seed, and that the owner's
  `admin` role arrives through Ward's grant on the first sign-in.
