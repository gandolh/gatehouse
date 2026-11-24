// @vitest-environment jsdom
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { act } from "react";
import { hydrateRoot } from "react-dom/client";
import { renderToString } from "react-dom/server";
import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import type { PageData } from "./features/cards";
import { page } from "./page";

/** A small page: a section with a picture, a compact one with a host link and a sign-in card. */
const DATA: PageData = {
  site: {
    wordmark: "home",
    line: "Apps on this server.",
    sub: "Public ones work for anyone.",
    github: "https://github.com/someone",
    filters: ["All", "Open to anyone", "Needs sign-in"],
    footer: "Built in TypeScript.",
  },
  access: { open: "Public", "sign-in": "Sign-in", owner: "Owner only", docs: "Docs only", repo: "On GitHub" },
  sections: [
    {
      id: "play",
      title: "Games and toys",
      line: "Play in the browser.",
      compact: false,
      cards: [
        {
          id: "games",
          name: "Games portal",
          href: "/games/",
          address: "/games/",
          ownAddress: false,
          access: "open",
          image: { src: "/gatehouse/assets/games.webp", width: 800, height: 500 },
          blurb: "The games on one page.",
          more: "Each opens on its own page.",
          docs: "/games/docs/",
          source: "https://github.com/someone/games",
        },
      ],
    },
    {
      id: "estate",
      title: "Behind the scenes",
      line: "What keeps the apps running.",
      compact: true,
      cards: [
        {
          id: "ward",
          name: "Ward",
          href: "https://ward.example.org/",
          address: "ward.",
          ownAddress: true,
          access: "sign-in",
          image: null,
          blurb: "The shared sign-in.",
          more: "An OpenID Connect provider.",
          docs: null,
          source: null,
        },
      ],
    },
  ],
};

/** The head script from index.html, as the browser runs it before the first paint. */
function headScript(): string {
  const html = readFileSync(join(import.meta.dirname, "../index.html"), "utf8");
  const script = /<script>([\s\S]*?)<\/script>/.exec(html)?.[1];
  if (script === undefined) throw new Error("index.html has no inline head script");
  return script;
}

beforeAll(() => {
  (globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;
});

afterEach(() => {
  localStorage.clear();
  vi.restoreAllMocks();
});

describe("the page", () => {
  it("hydrates a stored dark mode and Terminal look without a mismatch, then shows Dark chosen", async () => {
    const html = renderToString(page(DATA));

    // The document as the build serves it, with a stored pick the head script applies before the first paint.
    const root = document.documentElement;
    root.setAttribute("data-look", "profile");
    root.setAttribute("data-theme", "light");
    document.head.innerHTML = '<meta name="theme-color" content="#e5e8ee">';
    document.body.innerHTML = `<div id="root">${html}</div>`;
    localStorage.setItem("gatehouse.mode", "dark");
    localStorage.setItem("gatehouse.look", "terminal");
    // index.html's own head script, run as the browser runs it before the first paint.
    new Function(headScript())();
    expect(root.dataset.theme).toBe("dark");
    expect(root.dataset.look).toBe("terminal");
    expect(root.hasAttribute("data-scripted")).toBe(true);

    const recoverable: unknown[] = [];
    const logged = vi.spyOn(console, "error");
    const container = document.getElementById("root");
    if (container === null) throw new Error("no root");
    await act(async () => {
      hydrateRoot(container, page(DATA), { onRecoverableError: (error) => recoverable.push(error) });
      await Promise.resolve();
    });

    expect(recoverable).toEqual([]);
    expect(logged).not.toHaveBeenCalled();
    const dark = [...container.querySelectorAll('[role="radio"]')].find((radio) => radio.textContent === "Dark");
    expect(dark?.getAttribute("aria-checked")).toBe("true");
    expect(document.querySelector('meta[name="theme-color"]')?.getAttribute("content")).toBe("#0e0905");
  });

  it("puts every card's See more text in the HTML, and no live text", () => {
    const html = renderToString(page(DATA));
    expect(html).toContain("Each opens on its own page.");
    expect(html).toContain("An OpenID Connect provider.");
    expect(html).toMatch(/role="status"[^>]*><\/p>/);
  });
});
