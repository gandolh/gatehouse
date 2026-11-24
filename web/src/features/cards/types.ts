import type { Card, CardList, Section } from "@gatehouse/shared";

/** A card's picture: its fingerprinted URL and the size read from the file, so the page reserves its box. */
interface Picture {
  src: string;
  width: number;
  height: number;
}

/**
 * A card as the page draws it: its link resolved against the origin, the address as the page shows it, the picture
 * as a URL. A public card has no `part` to carry; an owner card from the API takes the same shape.
 */
export type PageCard = Omit<Card, "part" | "image"> & {
  /** How the link shows: `/path/`, `<name>.` or a GitHub address without `https://`. */
  address: string;
  /** Whether the link is a host of its own, shown with "own address". */
  ownAddress: boolean;
  image: Picture | null;
};

export type PageSection = Omit<Section, "cards" | "compact"> & { compact: boolean; cards: PageCard[] };

/** What the page draws: the header's and footer's words, the access labels' words, the sections. */
export interface PageData {
  site: CardList["site"];
  access: CardList["access"];
  sections: PageSection[];
}
