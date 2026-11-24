import preset from "./vendor/house-style/knip.json" with { type: "json" };

// knip has no `extends`, so this spreads the house preset. The page's server entry is named only by the build's
// `vite build --ssr src/entry-server.tsx`, which knip doesn't read as a file reference.
export default {
  ...preset,
  workspaces: {
    web: { entry: ["src/entry-server.tsx"] },
  },
};
