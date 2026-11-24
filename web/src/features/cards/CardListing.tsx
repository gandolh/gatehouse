import type { CardList } from "@gatehouse/shared";
import { useRef, useState } from "react";
import { pageWidth } from "../../components/ui/looks";
import { CardSection } from "./CardSection";
import { shows, type Filter } from "./filters";
import { SectionNav } from "./SectionNav";
import type { PageSection } from "./types";
import { useLevelRows } from "./useLevelRows";

export interface CardListingProps {
  sections: PageSection[];
  access: CardList["access"];
  filterLabels: readonly [string, string, string];
}

/**
 * The section row and the sections, with the filter they share. A change of filter is announced in a live region
 * ("Showing 22 cards"), which stays empty until the first change, so the HTML and the first render agree.
 */
export function CardListing({ sections, access, filterLabels }: CardListingProps) {
  const [filter, setFilter] = useState<Filter>("all");
  const [announcement, setAnnouncement] = useState("");
  const main = useRef<HTMLElement>(null);
  useLevelRows(main, filter);

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
          <CardSection key={section.id} section={section} access={access} filter={filter} first={index === 0} />
        ))}
      </main>
      <p role="status" className="sr-only">
        {announcement}
      </p>
    </>
  );
}
