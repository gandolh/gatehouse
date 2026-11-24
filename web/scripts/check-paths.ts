// The path check, the last step of `npm run build -w @gatehouse/web`: every file the built page loads must have a URL
// under /gatehouse/ that names a file in web/dist/, and only index.html and the assets folder may sit at the top of
// web/dist/. The page answers exactly / and its files are served from /gatehouse/, so a URL outside that prefix is a
// file the deploy never serves.
//
//   node scripts/check-paths.ts [dist folder]
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

/** Where the page's files are served from (Vite's `base` in the build). */
export const BASE = "/gatehouse/";

/** What may sit at the top of the build output. */
const TOP_LEVEL = new Set(["index.html", "assets"]);

/** The link relations whose `href` the browser loads. Any other `<link>` (canonical, alternate) is a link, not a file. */
const LOADED_RELS = new Set(["stylesheet", "preload", "modulepreload", "icon", "apple-touch-icon", "manifest"]);

/** A tag whose attributes can name a file the page loads. */
const TAG = /<(script|link|img|source)\b([^>]*)>/gi;
const ATTRIBUTE = /([\w:-]+)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'>]+))/g;
const CSS_URL = /url\(\s*(["']?)([^"')]+)\1\s*\)/g;
/** In a script: a path-like string ending in a file type the page loads (a chunk, a stylesheet, a font, a picture). */
const SCRIPT_REFERENCE =
  /(["'`])((?:\.{1,2}\/|\/)?[\w@.-]+(?:\/[\w@.-]+)*\.(?:m?js|css|woff2?|ttf|otf|webp|avif|png|jpe?g|gif|svg|ico|webmanifest))\1/g;
/** Vite's preload helper keeps a lazy chunk's dependencies in a list of paths taken from the base. */
const PRELOAD_DEPENDENCIES = /__vite__mapDeps\s*=\s*\([^)]*\[([^\]]*)\]/g;

/** One reference to a file, and where it came from. */
interface Reference {
  /** The file it was read from, relative to the build output. */
  file: string;
  /** As written. */
  url: string;
  /** The URL path it reaches, or undefined when it reaches no path on this server (another origin). */
  path: string | undefined;
}

/** What the check found. */
export interface PathReport {
  /** How many references were checked: inline data and fragments aside. */
  checked: number;
  /** One line per problem, starting with the file it was found in. */
  problems: string[];
}

/** Every file under `folder`, as paths relative to it with forward slashes. */
function filesIn(folder: string): string[] {
  return readdirSync(folder, { recursive: true, encoding: "utf8" })
    .filter((name) => statSync(join(folder, name)).isFile())
    .map((name) => name.split(sep).join("/"));
}

/** The URL path a reference reaches from a file served at `from`, or undefined for another origin. */
function pathOf(url: string, from: string): string | undefined {
  const resolved = new URL(url, `http://gatehouse.invalid${from}`);
  return resolved.origin === "http://gatehouse.invalid" ? resolved.pathname : undefined;
}

/** Whether a reference names no file to check: inline data, a fragment, an empty value. */
function isInline(url: string): boolean {
  return url === "" || url.startsWith("#") || /^(data|blob):/i.test(url);
}

function attributesOf(tag: string): Map<string, string> {
  const attributes = new Map<string, string>();
  for (const [, name = "", double, single, bare] of tag.matchAll(ATTRIBUTE)) {
    attributes.set(name.toLowerCase(), (double ?? single ?? bare ?? "").replaceAll("&amp;", "&"));
  }
  return attributes;
}

/** The URLs in a `srcset`: each candidate's first word. */
function srcsetUrls(value: string): string[] {
  return value
    .split(",")
    .map((candidate) => candidate.trim().split(/\s+/)[0] ?? "")
    .filter((url) => url !== "");
}

/** The URLs an HTML file loads: scripts, the stylesheets, preloads and icon of `<link>`, pictures, and CSS `url()`. */
function htmlUrls(html: string): string[] {
  const urls: string[] = [];
  for (const [, tagName = "", body = ""] of html.matchAll(TAG)) {
    const attributes = attributesOf(body);
    const tag = tagName.toLowerCase();
    if (tag === "link") {
      const rels = (attributes.get("rel") ?? "").toLowerCase().split(/\s+/);
      if (!rels.some((rel) => LOADED_RELS.has(rel))) continue;
      const href = attributes.get("href");
      if (href !== undefined) urls.push(href);
      urls.push(...srcsetUrls(attributes.get("imagesrcset") ?? ""));
    } else {
      const src = attributes.get("src");
      if (src !== undefined) urls.push(src);
      urls.push(...srcsetUrls(attributes.get("srcset") ?? ""));
    }
  }
  return [...urls, ...cssUrls(html)];
}

function cssUrls(css: string): string[] {
  return [...css.matchAll(CSS_URL)].map((match) => (match[2] ?? "").trim());
}

/** A script's references: a bare path in the preload list is taken from the base, the rest from the script. */
function scriptReferences(script: string, from: string): { url: string; path: string | undefined }[] {
  const preloads = new Set<string>();
  for (const [, list = ""] of script.matchAll(PRELOAD_DEPENDENCIES)) {
    for (const [, , url = ""] of list.matchAll(SCRIPT_REFERENCE)) preloads.add(url);
  }
  return [...script.matchAll(SCRIPT_REFERENCE)].map(([, , url = ""]) => {
    const bare = !url.startsWith("/") && !url.startsWith(".");
    return { url, path: bare && preloads.has(url) ? `${BASE}${url}` : pathOf(url, from) };
  });
}

/** Reads every reference in the build output at `dist` and checks it. */
export function checkPaths(dist: string): PathReport {
  const problems: string[] = [];
  if (!existsSync(join(dist, "index.html"))) problems.push("index.html: missing; the page must be dist/index.html");
  for (const name of readdirSync(dist)) {
    if (!TOP_LEVEL.has(name)) problems.push(`${name}: only index.html and assets/ may sit at the top of dist/`);
  }

  const references: Reference[] = [];
  for (const file of filesIn(dist)) {
    // index.html is served at exactly /; every other file under the base.
    const from = file === "index.html" ? "/" : `${BASE}${file}`;
    const text = () => readFileSync(join(dist, file), "utf8");
    if (file.endsWith(".html")) {
      for (const url of htmlUrls(text())) references.push({ file, url, path: pathOf(url, from) });
    } else if (file.endsWith(".css")) {
      for (const url of cssUrls(text())) references.push({ file, url, path: pathOf(url, from) });
    } else if (/\.m?js$/.test(file)) {
      for (const reference of scriptReferences(text(), from)) references.push({ file, ...reference });
    }
  }

  const checked = references.filter((reference) => !isInline(reference.url));
  for (const { file, url, path } of checked) {
    if (path === undefined) {
      problems.push(`${file}: ${url} is on another origin; the page loads its files from ${BASE}`);
    } else if (!path.startsWith(BASE)) {
      problems.push(`${file}: ${url} reaches ${path}, outside ${BASE}`);
    } else {
      const target = join(dist, decodeURIComponent(path.slice(BASE.length)));
      if (relative(dist, target).startsWith("..") || !existsSync(target) || !statSync(target).isFile()) {
        problems.push(`${file}: ${url} reaches ${path}, which names no file in dist/`);
      }
    }
  }
  return { checked: checked.length, problems };
}

if (import.meta.main) {
  const dist =
    process.argv[2] === undefined ? fileURLToPath(new URL("../dist", import.meta.url)) : resolve(process.argv[2]);
  const { checked, problems } = checkPaths(dist);
  if (problems.length > 0) {
    console.error(`check-paths: ${problems.length} problem(s) in ${dist}:`);
    for (const problem of problems) console.error(`  ${problem}`);
    process.exit(1);
  }
  console.log(`check-paths: ${checked} references, each under ${BASE} and naming a file in dist/`);
}
