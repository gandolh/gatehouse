import type { CardList } from "@gatehouse/shared";
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
}

/**
 * A section: its title and line, then its cards in a grid of 1, 2 or 3 columns. A filter that hides every card hides
 * the section too. Terminal writes the head as a command and its output (`$ ls ~/play`, `6 items`); the markup carries
 * that line, hidden in Profile and from screen readers.
 */
export function CardSection({ section, access, filter, first }: CardSectionProps) {
  const shown = section.cards.filter((card) => shows(filter, card.access)).length;
  return (
    <section
      id={section.id}
      aria-labelledby={`h-${section.id}`}
      data-compact={section.compact ? "" : undefined}
      hidden={shown === 0}
      className="scroll-mt-15 pt-7 md:scroll-mt-21"
    >
      <header className="mb-4 flex flex-col gap-0.5 md:flex-row md:items-baseline md:gap-4">
        <h2 id={`h-${section.id}`} className="text-section font-strong tracking-section text-ink">
          <span aria-hidden="true" className="hidden flex-wrap items-baseline gap-x-4 terminal:flex">
            <span>
              <span>$</span> ls ~/{section.id}
            </span>
            <span>
              {shown} {shown === 1 ? "item" : "items"}
            </span>
          </span>
          <span>{section.title}</span>
        </h2>
        <p className="text-sub text-ink-muted">{section.line}</p>
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
      </div>
    </section>
  );
}
