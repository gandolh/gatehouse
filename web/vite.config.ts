import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { displayAddress, publicCards, resolveLink } from "@gatehouse/shared";
import { loadCards } from "@gatehouse/shared/load";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig, type Plugin, type ProxyOptions } from "vite";

/** Where the built page's files live. The page itself answers exactly `/`. */
const BASE = "/gatehouse/";

/** The origin the dev server stands in with, so a `host:` link shows as a placeholder there. */
const DEV_ORIGIN = "https://example.org";

/** The one card list, and the folder of its pictures. */
const CARD_LIST = fileURLToPath(new URL("../content/cards.json", import.meta.url));
const PICTURES = fileURLToPath(new URL("../content/images/", import.meta.url));

/** The page's public card module, as the entries import it, and its id inside Vite. */
const CARD_MODULE = "virtual:gatehouse-cards";
const CARD_MODULE_ID = `\0${CARD_MODULE}`;

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
 * A picture's width and height, read from its lossy webp header (the `VP8 ` chunk's frame header), so the `<img>`
 * reserves its box. Vite gives an imported picture only a URL; the pictures are 800 px wide or less already, so
 * nothing is resized. Any other kind of webp fails, naming the file.
 */
function webpSize(file: string): { width: number; height: number } {
  const bytes = readFileSync(file);
  const lossy =
    bytes.toString("latin1", 0, 4) === "RIFF" &&
    bytes.toString("latin1", 8, 16) === "WEBPVP8 " &&
    bytes[23] === 0x9d &&
    bytes[24] === 0x01 &&
    bytes[25] === 0x2a;
  if (!lossy) throw new Error(`${file}: not a lossy webp (a VP8 chunk); convert it before it goes on a card.`);
  return { width: bytes.readUInt16LE(26) & 0x3fff, height: bytes.readUInt16LE(28) & 0x3fff };
}

/**
 * The page's card module, `virtual:gatehouse-cards`, in dev and in the build: the public part of the card list only
 * (the owner part never reaches the page's HTML or its scripts), each link resolved against the origin, the address
 * as the card shows it, and each picture imported, so Vite fingerprints it under the base, with its size. It also
 * checks `GATEHOUSE_ORIGIN` once Vite knows what it is running, so a tool that only loads this file (knip, ESLint)
 * never needs it.
 */
function cardModule(): Plugin {
  let origin = DEV_ORIGIN;
  return {
    name: "gatehouse-cards",
    config(_config, { command, isPreview }) {
      origin = gatehouseOrigin(command === "build" && isPreview !== true);
    },
    resolveId(id) {
      return id === CARD_MODULE ? CARD_MODULE_ID : undefined;
    },
    load(id) {
      if (id !== CARD_MODULE_ID) return undefined;
      this.addWatchFile(CARD_LIST);
      const list = loadCards(CARD_LIST);
      const pictures: string[] = [];
      const picture = (image: string) => {
        const file = `${PICTURES}${image}`;
        this.addWatchFile(file);
        pictures.push(file);
        return { src: `\0picture:${pictures.length - 1}`, ...webpSize(file) };
      };
      // Field by field, so nothing the page doesn't draw (the part) reaches it.
      const sections = publicCards(list).map((section) => ({
        id: section.id,
        title: section.title,
        line: section.line,
        compact: section.compact === true,
        cards: section.cards.map((card) => ({
          id: card.id,
          name: card.name,
          href: resolveLink(card.href, origin),
          address: displayAddress(card.href),
          ownAddress: card.href.startsWith("host:"),
          access: card.access,
          image: card.image === null ? null : picture(card.image),
          blurb: card.blurb,
          more: card.more,
          docs: card.docs,
          source: card.source,
        })),
      }));
      const data = JSON.stringify({ site: list.site, access: list.access, sections }, null, 2);
      // Each picture's URL is the default export of its import: the placeholder string becomes that binding.
      const body = data.replace(/"\\u0000picture:(\d+)"/g, (_match, index: string) => `picture${index}`);
      const imports = pictures.map((file, index) => `import picture${index} from ${JSON.stringify(file)};`);
      return `${imports.join("\n")}\nexport default ${body};\n`;
    },
  };
}

/** The page's icon: a gate's arch in the primary button's colours (Profile's tokens), small enough to inline. */
const FAVICON = [
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">',
  '<rect width="32" height="32" rx="7" fill="#171a20"/>',
  '<path d="M9 25V15a7 7 0 0 1 14 0v10" fill="none" stroke="#f6f7f9" stroke-width="3" stroke-linecap="round"/>',
  "</svg>",
].join("");

/**
 * The page's head, from what the build emitted: a preload for the Geist latin font file the page's text uses in Profile (without
 * it the fallback font draws first and the layout jumps when Geist arrives), and the icon, emitted as an asset so it
 * is served under the base like the rest. Terminal's fonts are not preloaded: Profile is the default look. The dev
 * server has no build, so it inlines the icon.
 */
function headAssets(): Plugin {
  let base = "/";
  let icon: string | undefined;
  return {
    name: "gatehouse-head",
    configResolved(config) {
      base = config.base;
    },
    generateBundle() {
      icon = this.getFileName(this.emitFile({ type: "asset", name: "favicon.svg", source: FAVICON }));
    },
    transformIndexHtml: {
      order: "post",
      handler(_html, context) {
        const tags: { tag: string; attrs?: Record<string, string | boolean>; children?: string; injectTo: "head" }[] =
          [];
        const bundle = context.bundle;
        if (bundle === undefined) {
          const href = `data:image/svg+xml,${encodeURIComponent(FAVICON)}`;
          return [{ tag: "link", attrs: { rel: "icon", type: "image/svg+xml", href }, injectTo: "head" }];
        }
        const font = Object.keys(bundle).find((name) => /(^|\/)geist-latin-wght-normal-[\w-]+\.woff2$/.test(name));
        if (font === undefined) throw new Error("the build holds no Geist latin font file to preload");
        // Added by a script, once the head script has set the look: Geist is Profile's font only, and a stored Terminal
        // must not download it. A link in the HTML would be fetched before any script runs.
        const preload = `var l=document.createElement("link");l.rel="preload";l.as="font";l.type="font/woff2";l.crossOrigin="";l.href=${JSON.stringify(`${base}${font}`)};document.head.appendChild(l);`;
        tags.push({
          tag: "script",
          children: `if(document.documentElement.dataset.look==="profile"){${preload}}`,
          injectTo: "head",
        });
        if (icon !== undefined) {
          tags.push({
            tag: "link",
            attrs: { rel: "icon", type: "image/svg+xml", href: `${base}${icon}` },
            injectTo: "head",
          });
        }
        return tags;
      },
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
  plugins: [react(), tailwindcss(), cardModule(), headAssets()],
  publicDir: false,
  server: { port: 5182, strictPort: true, proxy },
  preview: { port: 4182, strictPort: true, proxy },
}));
