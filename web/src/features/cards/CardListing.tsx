import type { CardList } from "@gatehouse/shared";
import { useRef, useState, type ReactNode } from "react";
import { pageWidth } from "../../components/ui/looks";
import { CardSection } from "./CardSection";
import { shows, type Filter } from "./filters";
import { SectionNav } from "./SectionNav";
import type { PageCard, PageSection } from "./types";
import { useLevelRows } from "./useLevelRows";

export interface CardListingProps {
  sections: PageSection[];
  access: CardList["access"];
  filterLabels: readonly [string, string, string];
  /** The id of the section the owner part joins, or `null` when the list has none. */
  ownerSection: string | null;
  /** The owner's cards, once the API has answered; they follow that section's public cards. */
  ownerCards: readonly PageCard[];
  /** A note in that section while the owner's cards are on their way; shown where owner cards would show. */
  ownerNote: ReactNode;
}

/**
 * The section row and the sections, with the filter they share. A change of filter is announced in a live region
 * ("Showing 22 cards"), which stays empty until the first change, so the HTML and the first render agree. The owner's
 * cards join their section after its public cards, so its count, the filters and that announcement count them too.
 */
export function CardListing({
  sections: publicSections,
  access,
  filterLabels,
  ownerSection,
  ownerCards,
  ownerNote,
}: CardListingProps) {
  const [filter, setFilter] = useState<Filter>("all");
  const [announcement, setAnnouncement] = useState("");
  const main = useRef<HTMLElement>(null);
  const sections =
    ownerCards.length === 0
      ? publicSections
      : publicSections.map((section) =>
          section.id === ownerSection ? { ...section, cards: [...section.cards, ...ownerCards] } : section,
        );
  useLevelRows(main, `${filter} ${ownerCards.length}`);

  const countsUnder = (chosen: Filter) =>
    sections.map((section) => section.cards.filter((card) => shows(chosen, card.access)).length);
  const choose = (chosen: Filter) => {
    setFilter(chosen);
    setAnnouncement(`Showing ${countsUnder(chosen).reduce((sum, count) => sum + count, 0)} cards`);
  };

  return (
    <>
      <SectionNav
        sections={sections}
        counts={countsUnder(filter)}
        filter={filter}
        onFilterChange={choose}
        filterLabels={filterLabels}
      />
      <main ref={main} id="cards" className={pageWidth}>
        {sections.map((section, index) => (
          <CardSection
            key={section.id}
            section={section}
            access={access}
            filter={filter}
            first={index === 0}
            note={section.id === ownerSection ? (shows(filter, "owner") ? ownerNote : null) : undefined}
          />
        ))}
      </main>
      <p role="status" className="sr-only">
        {announcement}
      </p>
    </>
  );
}
