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
    <header className="pt-4 pb-3 max-sm:pb-4 lg:pt-5">
      <div className={pageWidth}>
        <div className="flex min-h-11 items-center justify-between gap-3 sm:min-h-11.5">
          <h1 className="min-w-0 font-ui text-wordmark font-bold tracking-wordmark text-ink terminal:text-shadow-glow">
            {site.wordmark}
            <span
              aria-hidden="true"
              className="ml-1 hidden h-[1.05em] w-[0.6em] bg-accent align-middle terminal:inline-block"
            />
          </h1>
          <div className="flex items-center gap-2">
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
        <p className="mt-2 max-w-measure text-lead wrap-break-word text-ink max-sm:text-lead-phone">{site.line}</p>
        <p className="mt-1 max-w-measure text-sub text-ink-muted">{site.sub}</p>
      </div>
    </header>
  );
}
