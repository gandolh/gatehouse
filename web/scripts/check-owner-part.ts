// The build guard, after the path check in `npm run build -w @gatehouse/web`: no file in web/dist/ may hold an owner
// card. The owner part (the vault, Grafana, the mail admin, brief-board) comes only from the API after the owner signs
// in; a card of it in the HTML or a script would show every visitor what the split keeps off the page.
//
// For each owner card it looks for the link as written (`host:vault`) and as resolved against GATEHOUSE_ORIGIN, the
// blurb, the See more text, and the id as the Card component writes it in HTML (`id="c-vault"`, `id="more-vault"`) and
// as an object literal holds it in a script (`id:"vault"`, `"id":"vault"`, the minifier's `` id:`vault` ``). Not the
// bare word: "mail" is in Postern's blurb. Text is matched as written and as HTML or a script escapes it (React writes
// an apostrophe as `&#x27;`).
//
//   GATEHOUSE_ORIGIN=https://example.org node scripts/check-owner-part.ts [dist folder]
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { ownerCards, resolveLink, type Card } from "@gatehouse/shared";
import { loadCards } from "@gatehouse/shared/load";

/** Files that hold no text: pictures and fonts. Everything else in dist/ is read, source maps included. */
const BINARY = /\.(webp|avif|png|jpe?g|gif|ico|woff2?|ttf|otf)$/i;

/** One thing an owner card must never leave in the build, and the card it belongs to. */
interface Needle {
  card: string;
  what: string;
  pattern: RegExp;
}

const literal = (text: string) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/** What to look for, per owner card. */
export function needlesFor(cards: readonly Card[], origin: string): Needle[] {
  return cards.flatMap((card) => {
    const id = literal(card.id);
    const text = (what: string, value: string): Needle => ({
      card: card.id,
      what,
      pattern: new RegExp(literal(value)),
    });
    return [
      text("link", card.href),
      text("resolved link", resolveLink(card.href, origin)),
      text("blurb", card.blurb),
      text("See more text", card.more),
      { card: card.id, what: "id in HTML", pattern: new RegExp(`\\bid="(?:c|more)-${id}"`) },
      { card: card.id, what: "id in a script", pattern: new RegExp(`["'\`]?\\bid["'\`]?\\s*:\\s*(["'\`])${id}\\1`) },
    ];
  });
}

/** HTML's escapes undone: the named five and every numeric one. */
function unescapeHtml(text: string): string {
  return text
    .replace(/&#x([0-9a-f]+);/gi, (_match, hex: string) => String.fromCodePoint(Number.parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (_match, decimal: string) => String.fromCodePoint(Number.parseInt(decimal, 10)))
    .replaceAll("&quot;", '"')
    .replaceAll("&apos;", "'")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">")
    .replaceAll("&amp;", "&");
}

/** A script's string escapes undone: `\uXXXX`, `\u{…}`, `\xXX` and a backslash before any other character. */
function unescapeScript(text: string): string {
  return text
    .replace(/\\u\{([0-9a-f]+)\}/gi, (_match, hex: string) => String.fromCodePoint(Number.parseInt(hex, 16)))
    .replace(/\\u([0-9a-f]{4})/gi, (_match, hex: string) => String.fromCodePoint(Number.parseInt(hex, 16)))
    .replace(/\\x([0-9a-f]{2})/gi, (_match, hex: string) => String.fromCodePoint(Number.parseInt(hex, 16)))
    .replace(/\\(.)/g, "$1");
}

/** Every leak in the build output at `dist`, one line each, starting with the file it was found in. */
export function findOwnerLeaks(dist: string, needles: readonly Needle[]): string[] {
  const leaks: string[] = [];
  const files = readdirSync(dist, { recursive: true, encoding: "utf8" })
    .filter((name) => statSync(join(dist, name)).isFile() && !BINARY.test(name))
    .map((name) => name.split(sep).join("/"))
    .sort();
  for (const file of files) {
    const raw = readFileSync(join(dist, file), "utf8");
    const readings = [raw, unescapeHtml(raw), unescapeScript(raw)];
    for (const { card, what, pattern } of needles) {
      if (readings.some((reading) => pattern.test(reading))) leaks.push(`${file}: the owner card ${card}'s ${what}`);
    }
  }
  return leaks;
}

if (import.meta.main) {
  const origin = process.env.GATEHOUSE_ORIGIN?.trim();
  if (origin === undefined || origin === "") {
    console.error(
      "check-owner-part: GATEHOUSE_ORIGIN is not set; the guard needs it to resolve the owner cards' links.",
    );
    process.exit(1);
  }
  const dist =
    process.argv[2] === undefined ? fileURLToPath(new URL("../dist", import.meta.url)) : resolve(process.argv[2]);
  const list = loadCards(fileURLToPath(new URL("../../content/cards.json", import.meta.url)));
  const owner = ownerCards(list);
  const leaks = findOwnerLeaks(dist, needlesFor(owner, origin));
  if (leaks.length > 0) {
    console.error(`check-owner-part: ${leaks.length} leak(s) of the owner part in ${dist}:`);
    for (const leak of leaks) console.error(`  ${leak}`);
    process.exit(1);
  }
  console.log(`check-owner-part: none of the ${owner.length} owner cards is in dist/`);
}
