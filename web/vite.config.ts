import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig, type Plugin, type ProxyOptions } from "vite";

/** Where the built page's files live. The page itself answers exactly `/`. */
const BASE = "/gatehouse/";

/** The origin the dev server stands in with, so a `host:` link shows as a placeholder there. */
const DEV_ORIGIN = "https://example.org";

/**
 * `GATEHOUSE_ORIGIN`, the domain's origin, bare. A build needs it to turn `host:<name>` links into addresses, and fails
 * naming it when it is unset or empty; the dev server and the preview fall back to `DEV_ORIGIN`. A value that isn't a
 * bare origin fails both.
 */
function gatehouseOrigin(building: boolean): string {
  const value = process.env.GATEHOUSE_ORIGIN?.trim() || undefined;
  if (value === undefined) {
    if (building) {
      throw new Error("GATEHOUSE_ORIGIN is not set: the build needs the domain's origin, such as https://example.org.");
    }
    return DEV_ORIGIN;
  }
  if (!URL.canParse(value) || new URL(value).origin !== value) {
    throw new Error("GATEHOUSE_ORIGIN must be a bare origin such as https://example.org: no path, no trailing slash.");
  }
  return value;
}

/**
 * Checks `GATEHOUSE_ORIGIN` once Vite knows what it is running, so a tool that only loads this file (knip, ESLint)
 * never needs it.
 */
function requireOrigin(): Plugin {
  return {
    name: "gatehouse-origin",
    config(_config, { command, isPreview }) {
      gatehouseOrigin(command === "build" && isPreview !== true);
    },
  };
}

/** The API, as the page reaches it. The prefix stays on: the API strips it itself, as it does behind Caddy. */
const proxy: Record<string, ProxyOptions> = { "/gatehouse-api": { target: "http://127.0.0.1:8815" } };

/**
 * The page is React, rendered to HTML at build time (`scripts/prerender.ts`) and hydrated in the browser.
 *
 * - The build and the preview use `base: "/gatehouse/"`, so every file the page loads has a URL under it; the files
 *   themselves sit in `dist/assets/`, and the deploy serves `/gatehouse/<file>` from `dist/` (never the `index.html`
 *   beside them). There is no `public/` folder: every file is imported, so Vite fingerprints it under the base.
 * - The dev server runs at http://localhost:5182/ with base `/`, and the preview at http://localhost:4182/gatehouse/
 *   (its `/` redirects there).
 */
export default defineConfig(({ command, isPreview }) => ({
  base: command === "build" || isPreview === true ? BASE : "/",
  plugins: [react(), tailwindcss(), requireOrigin()],
  publicDir: false,
  server: { port: 5182, strictPort: true, proxy },
  preview: { port: 4182, strictPort: true, proxy },
}));
