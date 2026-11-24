import { z } from "zod";
import { accessLabels, ownerCards, publicCards, type CardList } from "./cards.js";
import { displayAddress, resolveLink } from "./links.js";

/**
 * The API's contract with the page: the owner part's answer, the sign-in start's answer, and the error body. The page
 * parses each answer with these; the API declares the owner answer as its route's response. No transform, no strict
 * object, no default: a response schema only checks and encodes.
 */

/**
 * An owner-part card as the API sends it and the page draws it, the shape the card module gives a public card: the link
 * resolved against the public origin, the address as the card shows it, and no picture (the owner part sits in a
 * compact section, and pictures are fingerprinted by the page's build, which never sees an owner card).
 */
export const ownerCardSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  href: z.string().min(1),
  address: z.string().min(1),
  ownAddress: z.boolean(),
  access: z.enum(accessLabels),
  image: z.null(),
  blurb: z.string().min(1),
  more: z.string().min(1),
  docs: z.string().min(1).nullable(),
  source: z.string().min(1).nullable(),
});

/** `GET /gatehouse-api/v1/owner/cards`'s 200: the owner part's cards, in page order. */
export const ownerCardsSchema = z.object({ cards: z.array(ownerCardSchema) });

/** `POST /gatehouse-api/auth/ward/start`'s 200: where to send the browser to sign in with Ward. */
export const wardStartSchema = z.object({ url: z.string().min(1) });

/**
 * Every error the API sends. Its own errors carry a `message`; Ward's library answers `{ error }` alone
 * (`unauthorized`, `forbidden`, `ward_unavailable`), so the message is optional. The library's 401 adds a `reason`
 * when a live session was refused by a check, such as `ward_unavailable` when Ward couldn't vouch for it.
 */
export const errorBodySchema = z.object({
  error: z.string().min(1),
  message: z.string().optional(),
  reason: z.string().optional(),
});

export type OwnerCard = z.infer<typeof ownerCardSchema>;
export type OwnerCards = z.infer<typeof ownerCardsSchema>;

/** The owner route's answer: the owner part of the card list, each card's link resolved against `origin`. */
export function ownerCardsAnswer(list: CardList, origin: string): OwnerCards {
  return {
    cards: ownerCards(list).map((card) => ({
      id: card.id,
      name: card.name,
      href: resolveLink(card.href, origin),
      address: displayAddress(card.href),
      ownAddress: card.href.startsWith("host:"),
      access: card.access,
      image: null,
      blurb: card.blurb,
      more: card.more,
      docs: card.docs,
      source: card.source,
    })),
  };
}

/**
 * The section the owner part joins on the page, after its public cards: the one section that holds owner cards, or
 * `null` when the list has none. The page knows it before the API answers, to say there that the cards are on their
 * way. It throws when the owner part spans sections, or sits in one with no public card, which the page never shows.
 */
export function ownerSection(list: CardList): string | null {
  const holding = list.sections.filter((section) => section.cards.some((card) => card.part === "owner"));
  const [section, ...more] = holding;
  if (section === undefined) return null;
  if (more.length > 0) {
    throw new Error(`the owner part must sit in one section; it spans ${holding.map((s) => s.id).join(", ")}`);
  }
  if (!publicCards(list).some((shown) => shown.id === section.id)) {
    throw new Error(`the owner part sits in ${section.id}, which has no public card, so the page never shows it`);
  }
  return section.id;
}
