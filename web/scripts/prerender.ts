// The build's prerender: renders the page through the SSR build's entry and writes the HTML into the root element of
// web/dist/index.html, so the page is whole with scripting off and the browser hydrates it, and puts the page's title
// and description in its head (index.html's own title is the dev server's). Run by `npm run build -w @gatehouse/web`
// after the client build and the SSR build.
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

/** What the client build leaves in the root element for the rendered page. */
export const PLACEHOLDER = "<!--app-->";

/** `html` with the rendered page in place of the placeholder, which must be there exactly once. */
export function fillRoot(html: string, rendered: string): string {
  const parts = html.split(PLACEHOLDER);
  if (parts.length !== 2) {
    throw new Error(`index.html must hold ${PLACEHOLDER} exactly once; it holds it ${parts.length - 1} times.`);
  }
  // Joined, never String.replace: a `$&` or `$'` in the rendered text would be read as a pattern.
  return `${parts[0]}${rendered}${parts[1]}`;
}

/** What index.html holds in place of the page's title and description. */
const TITLE = "<title>Gatehouse</title>";

/** `html` with `head` (the title and description) in place of index.html's title, which must be there exactly once. */
export function fillHead(html: string, head: string): string {
  const parts = html.split(TITLE);
  if (parts.length !== 2) {
    throw new Error(`index.html must hold ${TITLE} exactly once; it holds it ${parts.length - 1} times.`);
  }
  return `${parts[0]}${head}${parts[1]}`;
}

if (import.meta.main) {
  const page = fileURLToPath(new URL("../dist/index.html", import.meta.url));
  const entry = new URL("../dist-ssr/entry-server.js", import.meta.url);
  const server: unknown = await import(entry.href);
  if (typeof server !== "object" || server === null || !("render" in server) || typeof server.render !== "function") {
    throw new Error("dist-ssr/entry-server.js exports no render()");
  }
  if (!("head" in server) || typeof server.head !== "function") {
    throw new Error("dist-ssr/entry-server.js exports no head()");
  }
  const rendered: unknown = server.render();
  const head: unknown = server.head();
  if (typeof rendered !== "string") throw new Error("render() returned no HTML");
  if (typeof head !== "string") throw new Error("head() returned no HTML");
  writeFileSync(page, fillHead(fillRoot(readFileSync(page, "utf8"), rendered), head));
  console.log(`prerender: wrote the page into dist/index.html (${rendered.length} characters)`);
}
