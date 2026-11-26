import type { CardList } from "@gatehouse/shared";
import type { ReactNode } from "react";
import { Card } from "./Card";
import { shows, type Filter } from "./filters";
import type { PageSection } from "./types";

/** The cards in the first row on a wide screen, whose pictures a visitor sees before scrolling. */
const FIRST_ROW = 3;

export interface CardSectionProps {
  section: PageSection;
  access: CardList["access"];
  filter: Filter;
  /** The first section: its first row's pictures load at once. */
  first: boolean;
  /**
   * The owner part's section only: a live region after its cards, where a note stands while the owner's cards are on
   * their way. `null` keeps the region empty; `undefined` (any other section) leaves it out.
   */
  note?: ReactNode;
}

/**
 * A section: its title and line, then its cards in a grid of 1, 2 or 3 columns. A filter that hides every card hides
 * the section too. Terminal writes the head as a command and its output (`$ ls ~/play`, `6 items`); the markup carries
 * that line, hidden in Profile and from screen readers.
 */
export function CardSection({ section, access, filter, first, note }: CardSectionProps) {
  const shown = section.cards.filter((card) => shows(filter, card.access)).length;
  return (
    <section
      id={section.id}
      aria-labelledby={`h-${section.id}`}
      data-compact={section.compact ? "" : undefined}
      hidden={shown === 0}
      className="scroll-mt-15 pt-7 md:scroll-mt-23 ninety-six:max-sm:first-of-type:pt-3"
    >
      <header className="mb-4 flex flex-col gap-0.5 md:flex-row md:items-baseline md:gap-4 terminal:flex-col terminal:items-stretch terminal:gap-1 terminal:border-b terminal:border-dashed terminal:border-line terminal:pb-3 ninety-six:md:flex-col ninety-six:md:items-stretch ninety-six:md:gap-3">
        <h2
          id={`h-${section.id}`}
          className="font-display text-section font-strong tracking-section text-ink terminal:text-[1.6rem] terminal:leading-tight terminal:text-shadow-glow terminal:max-sm:text-[1.4rem] ninety-six:bg-bar ninety-six:px-4 ninety-six:py-2.5 ninety-six:font-[600] ninety-six:text-on-bar ninety-six:shadow-panel ninety-six:max-sm:py-2"
        >
          <span
            aria-hidden="true"
            className="hidden flex-wrap items-baseline gap-x-4 text-[0.95rem] leading-normal font-[600] text-shadow-none terminal:flex"
          >
            <span>
              <span className="font-bold text-accent">$</span> ls ~/{section.id}
            </span>
            <span className="text-fact font-normal text-ink-muted">
              {shown} {shown === 1 ? "item" : "items"}
            </span>
          </span>
          <span>{section.title}</span>
        </h2>
        <p className="text-sub text-ink-muted terminal:text-[1rem] ninety-six:text-[1.0625rem] ninety-six:text-on-ground ninety-six:max-sm:mt-2.5">
          {section.line}
        </p>
      </header>
      <div data-grid className="grid grid-cols-1 gap-x-5 sm:grid-cols-2 lg:grid-cols-3">
        {section.cards.map((card, index) => (
          <Card
            key={card.id}
            card={card}
            accessLabel={access[card.access]}
            hidden={!shows(filter, card.access)}
            eager={first && index < FIRST_ROW}
          />
        ))}
        {note !== undefined && (
          <div role="status" className="min-w-0 self-start">
            {note}
          </div>
        )}
      </div>
    </section>
  );
}
