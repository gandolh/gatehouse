# Task 01: The skeleton and the house-style harness

**Depends on:** nothing. This brief runs first.

**Runs before:** every other brief.

**Builder:** Opus ([routing.md](../../routing.md)).

## Context

Gatehouse has no code: the repo holds `design/`, `content/` and the corpus. This brief lays down
three npm workspaces, the house-style harness, a health route and a placeholder page at `/`, so the
later briefs only add features. How the parts fit: [architecture.md](../../wiki/architecture.md).

Models to copy from, by repo name:

- **Gazette** (the freshest estate repo, 2026-11-20): the root `package.json` scripts,
  `scripts/check.mjs` and `scripts/check-fast.mjs`, `tsconfig.base.json`, `knip.config.js`,
  `.dependency-cruiser.cjs`, `.prettierignore`, `.npmrc`, `.gitignore`, `scripts/conventions.json`
  and `.claude/rules/`. Its pins are the estate's.
- **Lantern** and Gazette for the server: `server/src/config.ts`, the errors plugin,
  `server/src/features/health/`, `server/src/testing/buildTestApp.ts`.
- **presentation-sites** for Astro: Astro 7.3.5 and `@astrojs/check` 0.9.10, and the house-style
  skill's Astro recipe ("Astro, a fourth repo shape" in its recipes reference):
  `prettier-plugin-astro`, `eslint-plugin-astro` and the recipe's ESLint block for `.astro` files.

Copy patterns, not features. Where a model and a skill disagree, the skill wins, except where this
brief says otherwise below.

### Where this brief overrides a skill

- **No React and no Base UI.** The page is static Astro with a small script. The `base-ui` skill's
  rules don't apply; `check-base-ui` finds no React files, which is expected.
- **No `data-theme`.** The page's attributes are `data-look` and `data-mode` (brief 03); "theme" is
  kept out by the glossary.

## Files you OWN

- Root: `package.json` (name `gatehouse`, workspaces `shared`, `server`, `web`, Node 24 or later),
  `package-lock.json`, `.npmrc`, `.gitignore`, `.prettierignore`, `.env.example`,
  `tsconfig.base.json`, `tsconfig.json`, `eslint.config.js`, `prettier.config.js`,
  `vitest.config.ts`, `knip.config.js`, `.dependency-cruiser.cjs`, `.git-blame-ignore-revs` (only if
  a reformat commit happens), `scripts/`, `vendor/house-style/`, `.claude/rules/`
- `shared/` (`@gatehouse/shared`), `server/` (`@gatehouse/server`), `web/` (`@gatehouse/web`)
- The root `CLAUDE.md`: its Commands and Places that mislead sections only
- Corpus: `corpus/.planned-roots` (drop the roots this brief creates), `corpus/wiki/architecture.md`,
  `corpus/wiki/status.md`, `corpus/log.md`

## Files you must NOT touch

- `design/` and `content/`.
- The root `CLAUDE.md`'s Hard rules and brief-board sections.

## Steps

1. **Check `assetsPrefix` first.** In a scratch folder outside the repo, make the smallest Astro
   7.3.5 project with `build.assetsPrefix: "/gatehouse/"`, one page at `index.astro`, a
   stylesheet, a script, an image imported through `astro:assets`, and one `@fontsource` font. Run
   `astro build` and list every URL in `dist/index.html` and in the built CSS. Every file URL must
   start with `/gatehouse/`, the page must be `dist/index.html`, and nothing else may sit at the top
   of `dist/` apart from the assets folder. If any URL misses the prefix, try the fallback:
   `base: "/gatehouse/"` with the page kept at `/` (Astro's options for the output path); write down
   which settings worked. Record the result in `architecture.md` under Addresses and in the outcome.
2. **Workspaces and the harness.** Gazette's root scripts (`dev`, `build`, `test`, `typecheck`,
   `lint`, `format`, `format:check`, `check`, `check:fast`, `check:conventions`, `house-style:sync`),
   with `astro check` in the typecheck for `web`. Vendor house-style 1.3.0: the first time, run the
   skills library's `house-style/bin/sync.mjs house-style-v1.3.0` from the repo root, then
   `npm run house-style:sync -- --check` must pass. Exact pins (`save-exact=true`,
   `engine-strict=true`). There is no existing code, so there is no reformat commit.
3. **`shared`.** An empty barrel that builds (`tsc -b`), ready for brief 02.
4. **`server`.** Settings in `server/src/config.ts`: `HOST` (`127.0.0.1`), `PORT` (`8815`),
   `PUBLIC_ORIGIN` (`http://localhost:5182`), `GATEHOUSE_API_PREFIX` (`/gatehouse-api`),
   `GATEHOUSE_DATA_DIR` (default `data/` at the repo root, gitignored). An empty value counts as
   unset; a bad value stops the start naming the variable; values are never printed. The repo's
   `.env` is read for what the environment leaves unset. `GET /v1/health` answers `{ "ok": true }`,
   with and without the prefix, so one build runs behind Caddy and on its own. Errors as the
   `code-structure` skill says. No database yet: brief 07 adds it with Ward's library.
5. **`web`.** Astro 7.3.5, static output, `build.assetsPrefix` as step 1 found. Tailwind 4 through
   `@tailwindcss/vite`, one stylesheet with `@source not` for `vendor/`. No `public/` folder. A
   placeholder `web/src/pages/index.astro`: `<html lang="en" data-look="profile" data-mode="system">`, a
   title "Gatehouse", one heading. The dev server on 5182 (`strictPort`) at `/`, forwarding
   `/gatehouse-api` to `127.0.0.1:8815` without stripping (the API accepts both). `GATEHOUSE_ORIGIN`
   read by the build: `npm run build` fails naming it when it is unset; `astro dev` falls back to
   `https://example.org`.
6. **`.claude/rules/`**: `web.md` (paths `web/src/**`: static Astro, no React, Tailwind, tokens
   through the stylesheet) and `server.md` (paths `server/src/**`: the code-structure rules), each
   under about 40 lines. `.gitignore` keeps `.claude/rules/` if it ignores `.claude`.
7. **The root `CLAUDE.md`**: make Commands and Places that mislead match what was built.
8. **The corpus**: `architecture.md` (the workspaces, the commands, the ports, the settings, and
   step 1's finding), `status.md`, a `log.md` entry.

## Acceptance

- [ ] Step 1's finding is written in `architecture.md`: which settings put every file under
      `/gatehouse/` and keep the page at `dist/index.html`, with the URL list it was read from.
- [ ] `npm run check` exits 0: typecheck (with `astro check`), lint, format, conventions (knip,
      dependency-cruiser, both house checkers), tests.
- [ ] Tests cover the settings (defaults, an empty value, a bad port named in the error) and health
      with and without the prefix.
- [ ] `GATEHOUSE_ORIGIN=https://example.org npm run build` writes `web/dist/index.html` and only
      prefixed asset URLs; without the variable the build fails naming it.
- [ ] `npm run dev` serves the placeholder at `http://localhost:5182/` and health through the proxy
      at `http://localhost:5182/gatehouse-api/v1/health`.
- [ ] `bash corpus/lint.sh` passes. No domain, account name or machine path outside
      `content/cards.json`: `git grep -n` for the account name in `site.github` lists only that
      file.

## Owner steps

- None.

## Owner decisions

- Settled 2026-11-24 (the plan): static Astro, no React; the page at `/` with files under
  `/gatehouse/`; ports 8815 and 5182.
- Settled 2026-11-24 (this run): Tailwind 4, as the estate's other sites use it.
