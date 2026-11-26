import type { ReactNode } from "react";
import { RadioGroup } from "../../components/ui/RadioGroup";
import { pageWidth } from "../../components/ui/looks";
import { cn } from "../../lib/cn";
import type { Filter } from "./filters";
import type { PageSection } from "./types";

export interface SectionNavProps {
  sections: PageSection[];
  /** How many cards each section shows under the filter, in the same order. */
  counts: number[];
  filter: Filter;
  onFilterChange: (filter: Filter) => void;
  /** The three filters' words: All, Open to anyone, Needs sign-in. */
  filterLabels: readonly [string, string, string];
  /** The View control, after the filters, when the page has one. */
  view?: ReactNode;
}

/**
 * The section row: a link to each section with its count on the first line, then the filters and the View control on
 * the second, View at its end, or on a line of its own where the two don't fit. It sticks on a desktop. On a phone only
 * the links stick, flush to the top, and the filters and View scroll away (the critique's R2). A section the filter
 * empties loses its link. The filters and View hide without scripts, since they can't work there.
 */
export function SectionNav({ sections, counts, filter, onFilterChange, filterLabels, view }: SectionNavProps) {
  const [all, open, signIn] = filterLabels;
  const options = [
    { value: "all", label: all },
    { value: "open", label: open },
    { value: "sign-in", label: signIn },
  ] as const;
  return (
    <div
      className={cn(
        pageWidth,
        "relative z-sticky max-sm:contents md:sticky md:top-3 terminal:max-w-none terminal:px-0 terminal:md:top-0 terminal:lg:px-0 ninety-six:md:top-2",
      )}
    >
      <nav
        aria-label="Sections and filters"
        className="flex flex-col rounded-card border border-edge bg-surface p-1 shadow-card max-sm:contents terminal:border-x-0 terminal:bg-ground terminal:px-[max(1.5rem,calc((100%-var(--container-page))/2+1.5rem))] terminal:py-0 terminal:shadow-none ninety-six:border-0 ninety-six:p-1.5 ninety-six:shadow-panel"
      >
        <div className="flex [scrollbar-width:thin] gap-1 overflow-x-auto p-0.5 max-sm:sticky max-sm:top-0 max-sm:z-sticky max-sm:scroll-px-2 max-sm:border-y max-sm:border-edge max-sm:bg-surface max-sm:px-4 max-sm:py-0 terminal:max-sm:bg-ground ninety-six:max-sm:mx-3 ninety-six:max-sm:mt-2 ninety-six:max-sm:[scrollbar-color:var(--color-bevel-4)_var(--color-surface)] ninety-six:max-sm:gap-1.5 ninety-six:max-sm:border-0 ninety-six:max-sm:p-1.5 ninety-six:max-sm:shadow-panel">
          {sections.map((section, index) => (
            <a
              key={section.id}
              href={`#${section.id}`}
              hidden={counts[index] === 0}
              className="inline-flex min-h-11 flex-none items-center gap-2 rounded-control border border-transparent px-3 font-ui text-control font-medium whitespace-nowrap text-ink no-underline hover:bg-surface-2 active:bg-line max-sm:min-h-12 sm:min-h-9.5 sm:pointer-coarse:min-h-11 terminal:min-h-11 terminal:px-2 terminal:text-label terminal:hover:bg-transparent terminal:hover:underline ninety-six:border-0 ninety-six:bg-face ninety-six:px-2.5 ninety-six:font-normal ninety-six:shadow-raised ninety-six:hover:bg-surface-2 ninety-six:active:bg-surface-2 ninety-six:active:shadow-sunken ninety-six:xl:px-2 ninety-six:xl:text-[0.875rem]"
            >
              {section.title}
              <span className="font-normal text-ink-muted tabular-nums ninety-six:min-w-[1.7em] ninety-six:bg-field ninety-six:px-1.25 ninety-six:text-center ninety-six:text-[0.8125rem] ninety-six:leading-normal ninety-six:font-bold ninety-six:text-on-field ninety-six:shadow-sunken">
                {counts[index]}
              </span>
            </a>
          ))}
        </div>
        <div className="mt-1 hidden flex-wrap items-center justify-between gap-x-4 gap-y-2 border-t border-line pt-1.5 max-sm:m-0 max-sm:border-t-0 max-sm:px-3.5 max-sm:pt-2.5 ninety-six:border-t-0 ninety-six:pt-0 ninety-six:max-sm:mx-3 ninety-six:max-sm:mt-2 ninety-six:max-sm:bg-surface ninety-six:max-sm:p-1.5 ninety-six:max-sm:shadow-panel scripted:flex">
          <RadioGroup
            label="Show"
            look="chips"
            options={options}
            value={filter}
            onValueChange={onFilterChange}
            className="min-w-0 overflow-x-auto p-0.5 max-sm:pb-0 ninety-six:p-0"
          />
          {view}
        </div>
      </nav>
    </div>
  );
}
