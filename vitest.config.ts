import { defineConfig } from "vitest/config";

// One Vitest project at the root: every workspace's tests sit beside their source, and the page's build scripts have
// theirs in web/scripts/. A test that needs a DOM says so in a `// @vitest-environment jsdom` docblock.
export default defineConfig({
  test: {
    include: ["*/src/**/*.test.{ts,tsx}", "web/scripts/**/*.test.ts"],
  },
});
