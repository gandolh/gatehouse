import type { CardList } from "@gatehouse/shared";
import type { ReactNode } from "react";
import { cn } from "../lib/cn";
import { GitHubIcon } from "./ui/icons";
import { button, pageWidth } from "./ui/looks";

export interface FooterProps {
  site: CardList["site"];
  /** The look switcher, when the page has one. */
  lookSwitcher?: ReactNode;
  /** The owner's sign-in, when the page has one. */
  signIn?: ReactNode;
}

/** The footer: how the apps are built, the GitHub link, and room for the look switcher and the owner's sign-in. */
export function Footer({ site, lookSwitcher, signIn }: FooterProps) {
  return (
    <footer className="mt-6 border-t border-edge terminal:mt-14 terminal:bg-surface">
      <div className={cn(pageWidth, "flex flex-col items-start gap-4 pt-6 pb-9")}>
        <p className="max-w-prose text-ink-muted">{site.footer}</p>
        <a href={site.github} className={cn(button("secondary"), "px-3")}>
          <GitHubIcon />
          GitHub
        </a>
        {(lookSwitcher !== undefined || signIn !== undefined) && (
          <div className="hidden flex-wrap items-center gap-x-6 gap-y-3 scripted:flex">
            {lookSwitcher}
            {signIn}
          </div>
        )}
      </div>
    </footer>
  );
}
