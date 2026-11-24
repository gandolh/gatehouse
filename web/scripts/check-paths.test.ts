import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { checkPaths } from "./check-paths.ts";

/** A build output shaped like Vite's: the page, a script with a lazy chunk, a stylesheet with a font, two pictures. */
const GOOD: Record<string, string> = {
  "index.html": [
    "<!doctype html><html><head>",
    '<script type="module" crossorigin src="/gatehouse/assets/index-a1.js"></script>',
    '<link rel="stylesheet" crossorigin href="/gatehouse/assets/index-b2.css">',
    '<link rel="icon" href="/gatehouse/assets/icon-c3.svg">',
    '<link rel="canonical" href="https://example.org/">',
    '</head><body><div id="root">',
    '<link rel="preload" as="image" imageSrcSet="/gatehouse/assets/small-d4.webp 400w, /gatehouse/assets/big-e5.webp 800w"/>',
    '<img src="/gatehouse/assets/big-e5.webp" srcSet="/gatehouse/assets/small-d4.webp 400w, /gatehouse/assets/big-e5.webp 800w">',
    '<a href="/trips/">Trips</a></div></body></html>',
  ].join(""),
  "assets/index-a1.js": [
    'const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/later-f6.js","assets/later-g7.css"])))=>i.map(i=>d[i]);',
    "const load=()=>import(`./later-f6.js`);",
    'const picture="/gatehouse/assets/big-e5.webp";',
    'fetch("/gatehouse-api/v1/health");',
  ].join("\n"),
  "assets/later-f6.js": "export const later = 1;",
  "assets/later-g7.css": ".later{outline:1px solid}",
  "assets/index-b2.css":
    '@font-face{src:url(/gatehouse/assets/font-h8.woff2) format("woff2"),url(./font-h8.woff2)}.x{background:url(data:image/png;base64,AAAA)}',
  "assets/font-h8.woff2": "font",
  "assets/icon-c3.svg": "<svg/>",
  "assets/small-d4.webp": "webp",
  "assets/big-e5.webp": "webp",
};

let dist: string;
afterEach(() => {
  rmSync(dist, { recursive: true, force: true });
});

/** Writes the good build output, with `changes` laid over it (a file set to undefined is left out). */
function buildOutput(changes: Record<string, string | undefined> = {}): string {
  dist = mkdtempSync(join(tmpdir(), "gatehouse-dist-"));
  for (const [file, text] of Object.entries({ ...GOOD, ...changes })) {
    if (text === undefined) continue;
    mkdirSync(dirname(join(dist, file)), { recursive: true });
    writeFileSync(join(dist, file), text);
  }
  return dist;
}

describe("checkPaths", () => {
  it("passes a build whose every file is under /gatehouse/, and leaves links and API paths alone", () => {
    const report = checkPaths(buildOutput());
    expect(report.problems).toEqual([]);
    expect(report.checked).toBeGreaterThanOrEqual(14);
  });

  it("fails a script tag outside the prefix", () => {
    const html = GOOD["index.html"]?.replace("/gatehouse/assets/index-a1.js", "/assets/index-a1.js");
    expect(checkPaths(buildOutput({ "index.html": html })).problems).toEqual([
      "index.html: /assets/index-a1.js reaches /assets/index-a1.js, outside /gatehouse/",
    ]);
  });

  it("fails a srcset candidate, a CSS url() and a lazy chunk that name no file", () => {
    const report = checkPaths(
      buildOutput({
        "assets/small-d4.webp": undefined,
        "assets/font-h8.woff2": undefined,
        "assets/later-f6.js": undefined,
      }),
    );
    expect(report.problems).toEqual(
      expect.arrayContaining([
        "index.html: /gatehouse/assets/small-d4.webp reaches /gatehouse/assets/small-d4.webp, which names no file in dist/",
        "assets/index-b2.css: ./font-h8.woff2 reaches /gatehouse/assets/font-h8.woff2, which names no file in dist/",
        "assets/index-a1.js: ./later-f6.js reaches /gatehouse/assets/later-f6.js, which names no file in dist/",
        "assets/index-a1.js: assets/later-f6.js reaches /gatehouse/assets/later-f6.js, which names no file in dist/",
      ]),
    );
  });

  it("fails a file on another origin and a relative URL in the page, which is served at /", () => {
    const html = GOOD["index.html"]
      ?.replace("/gatehouse/assets/index-b2.css", "https://cdn.example.org/site.css")
      .replace("/gatehouse/assets/icon-c3.svg", "assets/icon-c3.svg");
    expect(checkPaths(buildOutput({ "index.html": html })).problems).toEqual([
      "index.html: https://cdn.example.org/site.css is on another origin; the page loads its files from /gatehouse/",
      "index.html: assets/icon-c3.svg reaches /assets/icon-c3.svg, outside /gatehouse/",
    ]);
  });

  it("fails anything beside index.html and assets/ at the top", () => {
    expect(checkPaths(buildOutput({ "robots.txt": "User-agent: *" })).problems).toEqual([
      "robots.txt: only index.html and assets/ may sit at the top of dist/",
    ]);
  });
});
