---
paths:
  - "web/src/**"
---

# The page (`web/src`)

- React 19 on Vite 8, one page, no client router. The build renders `<App />` to HTML
  (`entry-server.tsx`, then `web/scripts/prerender.ts` into `web/dist/index.html`) and the browser hydrates it
  (`main.tsx`). Every public card is in the HTML, so the page works with scripting off.
- Read the `base-ui` skill before you add or change a component. Base UI goes only through the wrappers in
  `web/src/components/ui/`, imported from subpaths. `check-base-ui` runs strict.
- Styling is Tailwind 4 in `web/src/styles/index.css`, the one stylesheet. Colours, fonts, radii and type sizes come
  from its tokens, per look and per mode; never a raw colour in a class (`bg-[#…]`). ESLint checks every class against
  the stylesheet, and their order.
- `<html>` carries `data-look` (`profile`, `terminal`, `ninety-six`) and `data-theme` (the mode: `light`, `dark`,
  `system`). The head script in `web/index.html` sets both before the first paint; React never sets them. `data-theme`
  is a code name only: anything a reader sees says "mode", never "theme" ([glossary](../../corpus/wiki/glossary.md)).
- Nothing read from localStorage or the address (the stored look and mode, the owner hint, `?look=`) is read during
  render: the HTML was rendered without it, and the first client render must match. Read it in an effect, after
  mount.
- No `public/` folder (`publicDir` is off). Every file the page loads is imported, so Vite fingerprints it under
  `/gatehouse/`; the build's path check (`web/scripts/check-paths.ts`) fails on any URL outside it.
- Never import `content/cards.json`: the bundle would ship the owner cards. The page gets the public cards from the
  build-time card module.
- The domain is never written here. A `host:` link resolves against `GATEHOUSE_ORIGIN` at build time.
- Tests sit beside their source as `*.test.tsx`; one that needs a DOM starts with `// @vitest-environment jsdom`.
  They assert on roles and text, never on class names.
- `npm run typecheck` runs `tsc -p web --noEmit` after `tsc -b`.
