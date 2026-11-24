import type { CardList } from "@gatehouse/shared";
import type { ReactNode } from "react";
import { cn } from "../lib/cn";
import { GitHubIcon } from "./ui/icons";
import { button, pageWidth } from "./ui/looks";

/**
 * The header: the wordmark, the card list's two lines, the GitHub link and the controls passed in (the mode control).
 * No hero: at 1280 x 800 the first row of cards shows below it. Terminal draws a cursor after the wordmark; the markup
 * carries it, hidden in Profile.
 */
export function Header({ site, children }: { site: CardList["site"]; children?: ReactNode }) {
  return (
    <header className="pt-4 pb-3 max-sm:pb-4 lg:pt-5 terminal:max-sm:pt-2 terminal:lg:pt-4 ninety-six:max-sm:pt-3 ninety-six:max-sm:pb-2 ninety-six:lg:pt-3.5">
      <div
        className={cn(
          pageWidth,
          "ninety-six:lg:grid ninety-six:lg:grid-cols-[auto_minmax(0,1fr)_auto] ninety-six:lg:grid-rows-[auto_auto] ninety-six:lg:items-center ninety-six:lg:gap-x-7",
        )}
      >
        <div className="flex min-h-11 items-center justify-between gap-3 sm:min-h-11.5 ninety-six:lg:contents">
          <h1 className="min-w-0 font-display text-wordmark font-bold tracking-wordmark text-ink terminal:text-shadow-glow terminal:max-sm:text-[1.3rem] ninety-six:text-on-ground ninety-six:text-shadow-wordmark ninety-six:lg:col-1 ninety-six:lg:row-span-2 ninety-six:lg:row-start-1">
            {site.wordmark}
            <span
              aria-hidden="true"
              className="ml-1 hidden h-[1.05em] w-[0.6em] bg-accent align-middle terminal:inline-block"
            />
          </h1>
          <div className="flex items-center gap-2 ninety-six:max-sm:gap-1 ninety-six:lg:col-3 ninety-six:lg:row-span-2 ninety-six:lg:row-start-1">
            <a
              href={site.github}
              className={cn(button("secondary"), "w-11 px-0 sm:w-auto sm:px-3 terminal:border-transparent")}
            >
              <GitHubIcon />
              <span className="max-sm:sr-only">GitHub</span>
            </a>
            {children}
          </div>
        </div>
        <p className="mt-2 max-w-measure text-lead wrap-break-word text-ink max-sm:text-lead-phone terminal:mt-0.5 ninety-six:font-bold ninety-six:text-on-ground ninety-six:max-sm:mt-1 ninety-six:lg:col-2 ninety-six:lg:row-1 ninety-six:lg:mt-0 ninety-six:lg:self-end">
          {site.line}
        </p>
        <p className="mt-1 max-w-measure text-sub text-ink-muted ninety-six:text-on-ground ninety-six:lg:col-2 ninety-six:lg:row-2 ninety-six:lg:self-start">
          {site.sub}
        </p>
      </div>
    </header>
  );
}
