import { houseStyle } from "./vendor/house-style/eslint.config.js";

/**
 * The house config from the vendored house-style copy, given Gatehouse's folders. Thin on purpose: the compiler is the
 * first gate, and the house adds only what it cannot see. The rules and the reason for each are in the copy.
 */
export default [
  ...houseStyle({
    root: import.meta.dirname,
    web: "web/src",
    // better-tailwindcss reads the page's one stylesheet for its classes: an unknown or deprecated class is an error,
    // and so is a class string out of Tailwind's order.
    tailwind: { css: "web/src/styles/index.css", order: true },
    server: "server/src",
    // Run by hand or by the build: they may print and read the environment.
    scripts: ["scripts", "web/scripts"],
    // Allowed to print: the API's entry, which reports bad settings before its logger exists.
    console: ["server/src/server.ts"],
    tests: ["**/*.test.{ts,tsx}", "server/src/testing/**"],
    // data/ is the API's local data folder; dist-ssr/ is the page's server build, read only by the prerender.
    ignores: ["data/**", "web/dist-ssr/**"],
  }),
];
