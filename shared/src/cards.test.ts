import { readdirSync, existsSync, readFileSync, writeFileSync, mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { cardListSchema, ownerCards, publicCards } from "./cards.js";
import { loadCards } from "./load.js";
import { displayAddress, resolveLink } from "./links.js";

const cardsFile = new URL("../../content/cards.json", import.meta.url);
const imagesDir = new URL("../../content/images/", import.meta.url);
const list = loadCards(cardsFile.pathname);
const all = list.sections.flatMap((section) => section.cards);

describe("the card list", () => {
  it("validates and holds 39 cards in 5 sections", () => {
    expect(list.sections).toHaveLength(5);
    expect(all).toHaveLength(39);
  });

  it("has unique ids", () => {
    expect(new Set(all.map((card) => card.id)).size).toBe(all.length);
  });

  it("puts exactly brief-board, vault and mail in the owner part, all in estate", () => {
    const owner = ownerCards(list).map((card) => card.id);
    expect(owner.toSorted()).toEqual(["brief-board", "mail", "vault"]);
    const estate = list.sections.find((section) => section.id === "estate");
    expect(estate?.cards.filter((card) => card.part === "owner")).toHaveLength(3);
    expect(publicCards(list).flatMap((section) => section.cards)).toHaveLength(36);
  });

  it("uses every image file, and every image exists", () => {
    const used = all.flatMap((card) => (card.image === null ? [] : [card.image]));
    for (const image of used) expect(existsSync(new URL(image, imagesDir)), image).toBe(true);
    expect(readdirSync(imagesDir).toSorted()).toEqual([...new Set(used)].toSorted());
  });

  it("gives compact sections no image", () => {
    for (const section of list.sections.filter((s) => s.compact === true)) {
      for (const card of section.cards) expect(card.image, card.id).toBeNull();
    }
  });

  it("holds only the three link forms and no domain", () => {
    const links = all.flatMap((card) => [card.href, card.docs, card.source].filter((l) => l !== null));
    for (const link of links) {
      expect(() => resolveLink(link, "https://example.org"), link).not.toThrow();
      if (link.startsWith("https://")) expect(new URL(link).host, link).toBe("github.com");
    }
    expect(JSON.stringify(list)).not.toMatch(/\.ro\b/);
  });
});

describe("loadCards", () => {
  const write = (value: unknown): string => {
    const file = join(mkdtempSync(join(tmpdir(), "cards-")), "cards.json");
    writeFileSync(file, JSON.stringify(value));
    return file;
  };
  const base = JSON.parse(readFileSync(cardsFile, "utf8")) as { sections: { cards: Record<string, unknown>[] }[] };

  it("names the card id and the field of an invalid file", () => {
    const copy = structuredClone(base);
    copy.sections[0]!.cards[1]!.access = "nope";
    expect(() => loadCards(write(copy))).toThrow(/card farm-valley, field access/);
  });

  it("rejects a duplicate id and an image in a compact section", () => {
    const dup = structuredClone(base);
    dup.sections[0]!.cards[1]!.id = "games";
    expect(cardListSchema.safeParse(dup).success).toBe(false);
    const img = structuredClone(base);
    img.sections[4]!.cards[0]!.image = "x.webp";
    expect(cardListSchema.safeParse(img).success).toBe(false);
  });
});

describe("links", () => {
  const origin = "https://example.org";
  it("resolves each form", () => {
    expect(resolveLink("/trips/", origin)).toBe("/trips/");
    expect(resolveLink("host:ward", origin)).toBe("https://ward.example.org/");
    expect(resolveLink("https://github.com/x/y", origin)).toBe("https://github.com/x/y");
  });
  it("shows each form", () => {
    expect(displayAddress("/trips/")).toBe("/trips/");
    expect(displayAddress("host:ward")).toBe("ward.");
    expect(displayAddress("https://github.com/x/y")).toBe("github.com/x/y");
  });
  it("throws on a bad link", () => {
    expect(() => resolveLink("trips", origin)).toThrow();
    expect(() => resolveLink("http://example.org/", origin)).toThrow();
    expect(() => displayAddress("ftp://x")).toThrow();
  });
});
