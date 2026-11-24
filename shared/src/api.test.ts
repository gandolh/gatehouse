import { describe, expect, it } from "vitest";
import { errorBodySchema, ownerCardsAnswer, ownerCardsSchema, ownerSection } from "./api.js";
import type { CardList } from "./cards.js";
import { loadCards } from "./load.js";

const list = loadCards(new URL("../../content/cards.json", import.meta.url).pathname);

describe("the owner answer", () => {
  const answer = ownerCardsAnswer(list, "https://example.org");

  it("holds the owner part only, in page order, and passes its own schema", () => {
    expect(answer.cards.map((card) => card.id)).toEqual(["brief-board", "vault", "mail"]);
    expect(ownerCardsSchema.safeParse(answer).success).toBe(true);
  });

  it("resolves host links against the origin and shows the address as a card does", () => {
    const vault = answer.cards.find((card) => card.id === "vault");
    expect(vault).toMatchObject({
      href: "https://vault.example.org/",
      address: "vault.",
      ownAddress: true,
      image: null,
    });
    const board = answer.cards.find((card) => card.id === "brief-board");
    expect(board).toMatchObject({ href: "/brief-board/", address: "/brief-board/", ownAddress: false });
  });

  it("refuses an answer with a picture or a missing field", () => {
    const [first] = answer.cards;
    expect(ownerCardsSchema.safeParse({ cards: [{ ...first, image: { src: "/x.webp" } }] }).success).toBe(false);
    expect(ownerCardsSchema.safeParse({ cards: [{ ...first, name: undefined }] }).success).toBe(false);
  });

  it("reads Ward's bare error bodies and the API's own", () => {
    expect(errorBodySchema.safeParse({ error: "forbidden" }).success).toBe(true);
    expect(errorBodySchema.safeParse({ error: "not_found", message: "No such route." }).success).toBe(true);
    expect(errorBodySchema.safeParse({ message: "no code" }).success).toBe(false);
  });
});

describe("the owner part's section", () => {
  it("is Behind the scenes in the card list", () => {
    expect(ownerSection(list)).toBe("estate");
  });

  it("is null without an owner part, and refuses one spread over sections or alone in one", () => {
    const publicOnly: CardList = {
      ...list,
      sections: list.sections.map((s) => ({ ...s, cards: s.cards.filter((c) => c.part === "public") })),
    };
    expect(ownerSection(publicOnly)).toBeNull();

    const [first, second, ...rest] = list.sections;
    if (first === undefined || second === undefined) throw new Error("the list has fewer than two sections");
    const owner = list.sections.flatMap((s) => s.cards).find((c) => c.part === "owner");
    if (owner === undefined) throw new Error("the list has no owner card");
    const spread: CardList = { ...list, sections: [first, { ...second, cards: [...second.cards, owner] }, ...rest] };
    expect(() => ownerSection(spread)).toThrow(/spans/);

    const alone: CardList = { ...list, sections: [{ ...first, cards: [owner] }] };
    expect(() => ownerSection(alone)).toThrow(/no public card/);
  });
});
