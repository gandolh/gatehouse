import { useState, type ReactNode } from "react";
import { BookIcon, ChevronDownIcon } from "../../components/ui/icons";
import { button } from "../../components/ui/looks";
import { cn } from "../../lib/cn";
import { AccessLabel } from "./AccessLabel";
import type { PageCard } from "./types";

export interface CardProps {
  card: PageCard;
  /** The words of the card's access label. */
  accessLabel: string;
  /** Hidden by a filter. */
  hidden?: boolean;
  /** Load the picture at once: the first row's, which a visitor sees first. The rest load as they near the screen. */
  eager?: boolean;
}

/** What the primary button says: the card's link is the app, its docs, or its repo. */
function openLabel(card: PageCard): string {
  if (card.access === "docs") return "Read the docs";
  if (card.access === "repo") return "View on GitHub";
  return "Open";
}

/** One line of See more's facts: a label and its value. */
function Fact({ label, className, children }: { label: string; className?: string; children: ReactNode }) {
  return (
    <div className={cn("grid grid-cols-[76px_minmax(0,1fr)] items-baseline gap-2", className)}>
      <dt className="font-ui text-fact text-ink-muted ninety-six:font-bold ninety-six:text-ink">{label}</dt>
      <dd className="min-w-0 wrap-anywhere">{children}</dd>
    </div>
  );
}

const factLink =
  "inline-flex min-h-11 items-center text-accent underline underline-offset-3 sm:min-h-0 ninety-six:visited:text-visited";
const code = "font-mono text-code wrap-anywhere text-ink";

/**
 * A card: the picture (a link, outside the tab order), the name, the access label, one sentence, and the actions.
 * The filled Open is for cards anyone can use; behind a sign-in it is the outlined button, so a visitor isn't invited
 * into a sign-in wall. See more opens inside the card: its text is in the HTML and shows without scripts; with them it
 * stays hidden until opened. The owner part's cards come from the API in this same shape.
 */
export function Card({ card, accessLabel, hidden = false, eager = false }: CardProps) {
  const [open, setOpen] = useState(false);
  const moreId = `more-${card.id}`;
  const forAnyone = card.access === "open" || card.access === "docs" || card.access === "repo";
  const docs = card.docs !== null && card.docs !== card.href ? card.docs : null;
  const source = card.source !== null && card.source !== card.href ? card.source : null;
  const ownAddress = card.ownAddress ? <span className="text-fact text-ink-muted"> own address</span> : null;
  return (
    <article
      id={`c-${card.id}`}
      data-access={card.access}
      hidden={hidden}
      className="group/card mb-5 flex min-w-0 flex-col self-start rounded-card border border-edge bg-surface text-ink-body shadow-card terminal:p-4 terminal:text-ink terminal:shadow-hard ninety-six:gap-2.5 ninety-six:border-0 ninety-six:p-3 ninety-six:shadow-panel"
    >
      {card.image && (
        <a
          href={card.href}
          tabIndex={-1}
          aria-hidden="true"
          className="group/picture block overflow-hidden rounded-t-picture border-b border-line bg-surface-2 terminal:border ninety-six:border-0 ninety-six:bg-frame ninety-six:p-0.75 ninety-six:shadow-sunken"
        >
          <img
            src={card.image.src}
            width={card.image.width}
            height={card.image.height}
            alt=""
            loading={eager ? "eager" : "lazy"}
            decoding="async"
            className="block aspect-16/10 h-auto w-full object-cover object-top group-hover/picture:opacity-92 terminal:dark:brightness-85 terminal:dark:group-focus-within/card:brightness-100 terminal:dark:group-hover/card:brightness-100 ninety-six:bg-frame"
          />
        </a>
      )}
      <div
        data-level="head"
        className="flex flex-wrap items-start justify-between gap-x-3 gap-y-2 px-5 pt-4 terminal:px-0 terminal:pt-3 ninety-six:items-center ninety-six:gap-y-1.5 ninety-six:px-0 ninety-six:pt-0"
      >
        <h3 className="min-w-0 flex-auto font-ui text-name font-strong tracking-name wrap-break-word text-ink terminal:font-[600] ninety-six:font-bold">
          {card.name}
        </h3>
        <AccessLabel access={card.access} label={accessLabel} />
      </div>
      <p className="hidden px-5 pt-1 font-ui text-fact wrap-anywhere text-ink-muted terminal:block terminal:px-0 terminal:pt-0.5">
        {card.address}
        {ownAddress}
      </p>
      <p
        data-level="blurb"
        className="px-5 pt-2 wrap-break-word sm:min-h-[calc(3em+8px)] terminal:px-0 ninety-six:px-0 ninety-six:pt-0"
      >
        {card.blurb}
      </p>
      <div
        data-level="actions"
        className="flex flex-wrap content-start items-center gap-2 px-5 pt-4 pb-5 terminal:px-0 terminal:pb-0 ninety-six:px-0 ninety-six:pt-0.5 ninety-six:pb-0"
      >
        <a href={card.href} className={button(forAnyone ? "primary" : "secondary")}>
          {openLabel(card)}
          <span className="sr-only"> {card.name}</span>
        </a>
        {docs !== null && (
          <a href={docs} className={button("secondary")}>
            <BookIcon className="hidden ninety-six:block" />
            Docs<span className="sr-only"> for {card.name}</span>
          </a>
        )}
        <button
          type="button"
          aria-expanded={open}
          aria-controls={moreId}
          onClick={() => {
            setOpen(!open);
          }}
          className={cn("group/toggle cursor-pointer", button("quiet"), "hidden scripted:inline-flex")}
        >
          See more<span className="sr-only"> about {card.name}</span>
          <ChevronDownIcon className="size-4 group-aria-expanded/toggle:rotate-180 motion-safe:transition-transform motion-safe:duration-150 sm:size-3.75" />
        </button>
      </div>
      <div
        id={moreId}
        data-open={open ? "" : undefined}
        className="border-t border-line px-5 pt-4 pb-5 terminal:mt-4 terminal:border-dashed terminal:px-0 terminal:pt-3 terminal:pb-0 ninety-six:mt-0.5 ninety-six:border-bevel-4 ninety-six:px-0 ninety-six:pt-3 ninety-six:pb-0 ninety-six:shadow-[inset_0_1px_var(--color-bevel-1)] scripted:not-data-open:hidden"
      >
        <p>{card.more}</p>
        <dl className="mt-4 grid gap-2 border-t border-dashed border-line pt-4 terminal:mt-3 terminal:border-t-0 terminal:pt-0 ninety-six:mt-3 ninety-six:border-t-0 ninety-six:pt-0">
          <Fact label="Address" className="terminal:hidden">
            <code className={code}>{card.address}</code>
            {ownAddress}
          </Fact>
          {docs !== null && (
            <Fact label="Docs">
              <a href={docs} className={factLink}>
                <code className={code}>{docs}</code>
              </a>
            </Fact>
          )}
          {source !== null && (
            <Fact label="Source">
              <a href={source} className={factLink}>
                Source on GitHub
              </a>
            </Fact>
          )}
        </dl>
      </div>
    </article>
  );
}
