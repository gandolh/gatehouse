import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import type { Card } from "@gatehouse/shared";
import { afterEach, describe, expect, it } from "vitest";
import { findOwnerLeaks, needlesFor } from "./check-owner-part.ts";

const ORIGIN = "https://example.org";

/** Two owner cards shaped like the real ones: a host link, and a blurb with an apostrophe React escapes. */
const OWNER: Card[] = [
  {
    id: "vault",
    name: "Vault",
    href: "host:vault",
    access: "owner",
    part: "owner",
    image: null,
    blurb: "The password vault, a Vaultwarden server.",
    more: "Bitwarden apps on the phone and laptop sync to it.",
    docs: null,
    source: null,
  },
  {
    id: "mail",
    name: "Mail",
    href: "host:mail",
    access: "owner",
    part: "owner",
    image: null,
    blurb: "The mail server's admin, a Stalwart server.",
    more: "Postern reads the mail. This is where the accounts and domains are set up.",
    docs: null,
    source: null,
  },
];

/** A clean build: a public card that says "mail" and links a host, in the HTML and in a minified script. */
const CLEAN: Record<string, string> = {
  "index.html":
    '<!doctype html><html><body><div id="root"><article id="c-postern"><h3>Postern</h3><p>Gmail-style webmail for this server&#x27;s own mail.</p><a href="https://postern.example.org/">Open</a></article></div></body></html>',
  "assets/index-a1.js":
    "const e={id:`postern`,name:`Postern`,href:`https://postern.example.org/`,blurb:`Gmail-style webmail for this server's own mail.`};",
  "assets/index-b2.css": ".x{color:red}",
  "assets/font-c3.woff2": "binary",
};

let dist: string;
afterEach(() => {
  rmSync(dist, { recursive: true, force: true });
});

function buildOutput(changes: Record<string, string> = {}): string {
  dist = mkdtempSync(join(tmpdir(), "gatehouse-guard-"));
  for (const [file, text] of Object.entries({ ...CLEAN, ...changes })) {
    mkdirSync(dirname(join(dist, file)), { recursive: true });
    writeFileSync(join(dist, file), text);
  }
  return dist;
}

const leaks = (changes: Record<string, string>) => findOwnerLeaks(buildOutput(changes), needlesFor(OWNER, ORIGIN));

describe("the owner part's build guard", () => {
  it("passes a build that holds only public cards, though one says mail", () => {
    expect(leaks({})).toEqual([]);
  });

  it("fails an owner card's blurb in the HTML, written as React escapes it", () => {
    const html = CLEAN["index.html"]?.replace(
      "</div></body>",
      "<p>The mail server&#x27;s admin, a Stalwart server.</p></div></body>",
    );
    expect(leaks({ "index.html": html ?? "" })).toEqual(["index.html: the owner card mail's blurb"]);
  });

  it("fails another card's See more text and its id in a script", () => {
    const script = `${CLEAN["assets/index-a1.js"]}const v={id:\`vault\`,more:\`Bitwarden apps on the phone and laptop sync to it.\`};`;
    expect(leaks({ "assets/index-a1.js": script })).toEqual([
      "assets/index-a1.js: the owner card vault's See more text",
      "assets/index-a1.js: the owner card vault's id in a script",
    ]);
  });

  it("fails a card's link as written and resolved, its id in HTML, and its id as JSON in a source map", () => {
    expect(
      leaks({
        "index.html": `${CLEAN["index.html"]}<article id="c-vault"><a href="https://vault.example.org/">Open</a></article>`,
        "assets/index-a1.js.map": '{"sourcesContent":["{\\"id\\":\\"mail\\",\\"href\\":\\"host:mail\\"}"]}',
      }),
    ).toEqual([
      "assets/index-a1.js.map: the owner card mail's link",
      "assets/index-a1.js.map: the owner card mail's id in a script",
      "index.html: the owner card vault's resolved link",
      "index.html: the owner card vault's id in HTML",
    ]);
  });
});
