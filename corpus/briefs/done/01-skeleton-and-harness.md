# Task 01: The skeleton and the house-style harness

**Depends on:** nothing. This brief runs first.

**Runs before:** every other brief.

**Builder:** Opus ([routing.md](../../routing.md)).

## Context

Gatehouse has no committed code: the repo holds `design/`, `content/` and the corpus. This brief
lays down three npm workspaces, the house-style harness, a health route and a placeholder page at
`/`, so the later briefs only add features. How the parts fit:
[architecture.md](../../wiki/architecture.md).

The page is React on Vite, rendered to HTML at build time and hydrated
([decisions.md](../../wiki/decisions.md), the owner's call of 2026-11-24). A first run of this brief
was written for Astro and stopped before its first commit; its work may still be in the working
tree. Keep what matches the target state below and change the rest. The steps describe where the
repo ends, not what to undo.

Models to copy from, by repo name:

- **Gazette** (the freshest estate repo, 2026-11-20): the root `package.json` scripts,
  `scripts/check.mjs` and `scripts/check-fast.mjs`, `tsconfig.base.json`, `knip.config.js`,
  `.dependency-cruiser.cjs`, `.prettierignore`, `.npmrc`, `.gitignore`, `scripts/conventions.json`
  and `.claude/rules/`. Its pins are the estate's.
- **Lantern** and Gazette for the server: `server/src/config.ts`, the errors plugin,
  `server/src/features/health/`, `server/src/testing/buildTestApp.ts`.
- **Lantern** for the React app on Vite: `web/vite.config.ts`, `web/tsconfig.json`, the boot script
  in `web/index.html`, `.claude/rules/web.md`, and the root `eslint.config.js` and
  `prettier.config.js` (the house's, with nothing added). Lantern's proxy strips the API prefix;
  Gatehouse's doesn't.

Copy patterns, not features. Where a model and a skill disagree, the skill wins, except where this
brief says otherwise below.

### Pins

Exact, the estate's (Lantern, Gazette, and the first run's checks on 2026-11-24):

- Root: `typescript` 6.0.3, `vitest` 4.1.12, `concurrently` 10.0.5, `@types/node` 24.19.1, and the
  override `"shell-quote": "1.11.0"`: without it `concurrently` pulls a critical advisory.
- `server`: `fastify` 5.12.8, `@fastify/type-provider-zod` 1.0.3 with `@fastify/swagger` 9.9.3 and
  `openapi-types` 12.1.3, `zod` 4.6.7, `fastify-plugin` 6.0.1, `close-with-grace` 2.5.0, `tsx`
  4.23.13.
- `web`: `react` and `react-dom` 19.2.8, `vite` 8.3.5, `@vitejs/plugin-react` 6.1.1, `tailwindcss`
  and `@tailwindcss/vite` 4.3.5, `@types/react` 19.2.18, `@types/react-dom` 19.2.7. `@base-ui/react`
  1.9.0 arrives with the first component (brief 03), so knip has nothing unused to report here.

### Where this brief differs from a skill

- **`check-base-ui` runs strict from the start.** The `base-ui` skill gives a new harness
  `--warn-only` until the repo's own Base UI brief. Gatehouse has no code to convert, and its first
  component (brief 03) is written on Base UI, so there is nothing to warn about first.

## Files you OWN

- Root: `package.json` (name `gatehouse`, workspaces `shared`, `server`, `web`, Node 24 or later),
  `package-lock.json`, `.npmrc`, `.gitignore`, `.prettierignore`, `.env.example`,
  `tsconfig.base.json`, `tsconfig.json`, `eslint.config.js`, `prettier.config.js`,
  `vitest.config.ts`, `knip.config.js`, `.dependency-cruiser.cjs`, `.git-blame-ignore-revs` (only if
  a reformat commit happens), `scripts/`, `vendor/house-style/`, `.claude/rules/` (`web.md` and
  `server.md`)
- `shared/` (`@gatehouse/shared`), `server/` (`@gatehouse/server`), `web/` (`@gatehouse/web`)
- The root `CLAUDE.md`: its opening paragraph, Commands and Places that mislead, rewritten for
  React
- Corpus: `corpus/.planned-roots` (drop the roots this brief creates), `corpus/wiki/architecture.md`,
  `corpus/wiki/open-questions.md`, `corpus/wiki/status.md`, `corpus/log.md`

## Files you must NOT touch

- `design/` and `content/`.
- The root `CLAUDE.md`'s Hard rules and brief-board sections.

## Steps

1. **Check the paths first.** In a scratch folder outside the repo, make the smallest React app on
   Vite with the pins above: `base: "/gatehouse/"` for the build only, no `public/` folder, a
   stylesheet through `@tailwindcss/vite` that imports one `@fontsource` font, an imported image
   shown in an `<img>` with a `srcSet`, a dynamic `import()`, and the prerender of step 5 (client
   build, SSR build of `entry-server`, the render into `dist/index.html`). Build it and run the path
   check of step 5 on `dist/`. Write down:
   - every URL in the scope [architecture.md](../../wiki/architecture.md) gives the path check
     (scripts, stylesheets, preloads, the icon, `src` and `srcset`, CSS `url()`, chunk and
     dynamic-import references), and that each starts with `/gatehouse/` and names a file in
     `dist/`. Links a visitor follows and API paths are out of scope;
   - that the URLs the SSR render writes are the ones the client build wrote;
   - that the page is `dist/index.html`, only the assets folder sits beside it, and the SSR bundle
     is outside `dist/`;
   - whether Vite needs a `public/` folder for anything (the expectation is no; if it does, say how
     its files map under `/gatehouse/`);
   - where `vite preview` shows the built page.

   If a URL misses the prefix, find the Vite setting that fixes it (`experimental.renderBuiltUrl`
   first); if none does, stop and report. Record the settings and the URL list in
   `architecture.md` under Addresses, and the answers in `open-questions.md`.
2. **Workspaces and the harness.** Gazette's root scripts (`dev`, `build`, `test`, `typecheck`,
   `lint`, `format`, `format:check`, `check`, `check:fast`, `check:conventions`, `house-style:sync`),
   with Lantern's typecheck (`tsc -b && tsc -p web --noEmit`). Vendor house-style 1.3.0: the first
   time, run the skills library's `house-style/bin/sync.mjs house-style-v1.3.0` from the repo root,
   then `npm run house-style:sync -- --check` must pass. `check:conventions` runs knip,
   dependency-cruiser over `server/src`, `web/src` and `shared/src`, `check-base-ui` strict and
   `check-structure`. ESLint and Prettier as the house gives them for a React `web`: the house config
   given `web: ["web/src"]` adds the React hooks and Tailwind rules, and nothing Astro remains (no
   plugin, no `.astro` block, no `.astro/` ignore). Exact pins (`save-exact=true`,
   `engine-strict=true`). There is no existing code, so there is no reformat commit.
3. **Where tests live.** Vitest collects `*/src/**/*.test.{ts,tsx}` and the tests of the build
   scripts in `web/scripts/`; a `.tsx` test that needs a DOM sets jsdom in a
   `// @vitest-environment jsdom` docblock, as Lantern's do. ESLint's `tests` and `scripts` globs
   and `web/tsconfig.json` cover the same files, so no test or script goes unlinted or untyped.
4. **`shared`** and **`server`.**
   - `shared`: an empty barrel that builds (`tsc -b`), ready for brief 02.
   - `server`: settings in `server/src/config.ts`: `HOST` (`127.0.0.1`), `PORT` (`8815`),
     `PUBLIC_ORIGIN` (`http://localhost:5182`), `GATEHOUSE_API_PREFIX` (`/gatehouse-api`),
     `GATEHOUSE_DATA_DIR` (default `data/` at the repo root, gitignored). An empty value counts as
     unset; a bad value stops the start naming the variable; values are never printed. The repo's
     `.env` is read for what the environment leaves unset. `GET /v1/health` answers
     `{ "ok": true }`, with and without the prefix, so one build runs behind Caddy and on its own.
     Errors as the `code-structure` skill says. No database yet: brief 07 adds it with Ward's
     library.
5. **`web`**, a React app on Vite rendered at build time.
   - `web/vite.config.ts`: `@vitejs/plugin-react` and `@tailwindcss/vite`; `base: "/gatehouse/"`
     for the build only, `/` in dev; no `public/` folder; the dev server on 5182 with `strictPort`,
     forwarding `/gatehouse-api` to `127.0.0.1:8815` without stripping (the API strips it itself);
     `vite preview` on 4182 with `strictPort` and the same proxy. `GATEHOUSE_ORIGIN` read here: a
     value must be a bare origin, `npm run build` fails naming it when it is unset, and the dev
     server falls back to `https://example.org`.
   - `web/index.html`: `<html lang="en" data-look="profile" data-theme="light">`, the title
     "Gatehouse", and a root element holding the placeholder the prerender fills.
   - `web/src/main.tsx` hydrates the prerendered markup with `hydrateRoot`; in dev, where nothing
     is prerendered, it mounts with `createRoot`. `web/src/entry-server.tsx` renders the same
     `<App />` to HTML. `App.tsx`: one heading. `web/src/styles/index.css`: the one stylesheet,
     `@import "tailwindcss"`, `@source not` for `vendor/`.
   - `npm run build -w @gatehouse/web`: the client build into `web/dist/`; the SSR build of
     `entry-server` outside it (for example `web/dist-ssr/`, gitignored); `web/scripts/prerender.*`
     renders `<App />` with React's server or static API (`react-dom`) into `web/dist/index.html`;
     then `web/scripts/check-paths.*`, step 1's check, fails the build on any URL in its scope that
     misses `/gatehouse/` or names no file. The check has a test that plants a bad URL.
6. **`.claude/rules/`**: `web.md` (paths `web/src/**`) and `server.md` (paths `server/src/**`: the
   code-structure rules), each under about 40 lines. `web.md` says: React on Vite, rendered at build
   time and hydrated; the `base-ui` skill's rules, Base UI only under `web/src/components/ui/`;
   Tailwind, tokens through the one stylesheet, no raw colour; `data-look` and `data-theme` on `<html>`, set by
   the head script and never by React, and "mode", not "theme", in anything a reader sees; nothing
   read from localStorage or the address during render; no `public/` folder; never import
   `content/cards.json`. `.gitignore` keeps `.claude/rules/` if it ignores `.claude`.
7. **The root `CLAUDE.md`**: the opening paragraph (a React page rendered at build time and a
   Fastify API), Commands and Places that mislead, matching what was built. Nothing about Astro
   remains.
8. **The corpus**: `architecture.md` (the workspaces, the commands, the ports, the settings, and
   step 1's findings), `open-questions.md` (step 1's answers), `status.md`, a `log.md` entry.

## Acceptance

- [ ] Step 1's findings are written in `architecture.md` and `open-questions.md`: the settings that
      put every file under `/gatehouse/` and keep the page at `dist/index.html`, with the URL list
      they were read from.
- [ ] `npm run check` exits 0: typecheck (`tsc -b`, then `tsc -p web`), lint, format, conventions
      (knip, dependency-cruiser, `check-base-ui` strict, `check-structure`), tests.
- [ ] Tests cover the settings (defaults, an empty value, a bad port named in the error), health
      with and without the prefix, and the path check failing on a planted URL.
- [ ] `GATEHOUSE_ORIGIN=https://example.org npm run build` writes `web/dist/index.html` with the
      heading in its HTML (prerendered, not only in a script), passes the path check, and leaves
      only `index.html` and the assets folder at the top of `web/dist/`. Without the variable the
      build fails naming it.
- [ ] `npm run dev` serves the placeholder at `http://localhost:5182/` and health through the proxy
      at `http://localhost:5182/gatehouse-api/v1/health`.
- [ ] The preview of the built page shows the heading with JavaScript off, and with it on the
      console shows no hydration error.
- [ ] Nothing Astro remains: no `astro`, `@astrojs/*`, `eslint-plugin-astro` or
      `prettier-plugin-astro` in any `package.json` or the lockfile, and
      `grep -ril astro web .claude CLAUDE.md *.config.* .prettierignore .gitignore --exclude-dir=node_modules`
      finds nothing.
- [ ] `bash corpus/lint.sh` passes. No domain, account name or machine path outside
      `content/cards.json`: `git grep -n` for the account name in `site.github` lists only that
      file.

## Owner steps

- None.

## Owner decisions

- Settled 2026-11-24 (the plan): the page at `/` with files under `/gatehouse/`; ports 8815 and
  5182.
- Settled 2026-11-24 (the owner): React instead of Astro. The page is rendered at build time and
  hydrated ([decisions.md](../../wiki/decisions.md)).
- Settled 2026-11-24 (this run): Tailwind 4, as the estate's other sites use it.

## Outcome

_Done 2026-11-24, on the board at Done (nothing deploys before vps-deploy's brief 34)._

- **Step 1.** On a scratch app (React 19.2.8, Vite 8.3.5, a `@fontsource` font, two pictures in a
  `srcSet`, an icon linked from `index.html`, a dynamic `import()` with its own CSS), `base:
  "/gatehouse/"` put every file the page loads under `/gatehouse/`, with no `renderBuiltUrl`. The
  SSR render named the client build's files; `dist/` held `index.html` and `assets/`; no `public/`
  folder was needed. The URL list is in [architecture.md](../../wiki/architecture.md), Addresses.
- **The preview** needs the base too: with the base for the build only, `vite preview` served the
  page's files as `index.html`. So the base is `/gatehouse/` when `command` is `build` or
  `isPreview` is set (`web/vite.config.ts`), and the preview shows the page at
  `http://localhost:4182/gatehouse/` and redirects `/` there. `publicDir` is off.
- **Built:** the workspaces and the house-style 1.3.0 harness, `check-base-ui` strict; the API's
  settings, error plugin and `GET /v1/health` (bare and prefixed); the placeholder page
  (`App.tsx`, `main.tsx` hydrating, `entry-server.tsx`), `web/scripts/prerender.ts` and
  `web/scripts/check-paths.ts` with its test. 24 tests.
- **Deviations:** the base also in the preview (above); knip names `src/entry-server.tsx` as an
  entry, since it doesn't read `vite build --ssr <file>`; `web/tsconfig.json` takes the `node`
  types and `allowImportingTsExtensions` for the build scripts, which Node runs as TypeScript;
  `engines` is Node 24.2 or later, where `import.meta.main` arrived; `content/cards.json` stays out
  of Prettier until brief 02 formats it; `corpus/index.md` regenerated.
- **Open:** `vendor/house-style/LICENSE` carries the account name, so the acceptance's `git grep`
  finds it beside `content/cards.json`. It is the generated copy, so it stays; asked on the board.
- **Checks:** `npm run check` exit 0; the build with and without `GATEHOUSE_ORIGIN`; dev and the
  preview in headless Chrome (heading with scripting off, no hydration error with it on, a planted
  mismatch caught). Not run: `npm start`, the preview's proxy, `strictPort` on 4182.
