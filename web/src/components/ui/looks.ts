/** The page's width: capped and centred, its gutters growing with the screen. The header, the section row, the
 * sections and the footer share it. */
export const pageWidth = "mx-auto w-full max-w-page px-4 sm:px-6 lg:px-8 terminal:lg:px-6 ninety-six:lg:px-6";

const buttonBase = [
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-control border px-4 font-ui text-control font-medium",
  "whitespace-nowrap no-underline select-none sm:min-h-9.5 sm:pointer-coarse:min-h-11",
  "motion-safe:transition-colors motion-safe:duration-120",
  "ninety-six:border-0 ninety-six:shadow-raised ninety-six:active:shadow-sunken",
  // Inside a section drawn compact (Behind the scenes, On GitHub, every section in the Compact view) Terminal and
  // Ninety-six draw smaller buttons, as their sketches do; a phone or a coarse pointer keeps the 44 px target.
  "terminal:sm:not-pointer-coarse:compact:min-h-9",
  "ninety-six:sm:compact:text-[0.875rem] ninety-six:sm:not-pointer-coarse:compact:min-h-8.5",
].join(" ");

const buttonLooks = {
  /** Opens a card for anyone: filled. */
  primary:
    "border-button bg-button text-on-button hover:brightness-118 terminal:font-[600] terminal:hover:underline ninety-six:font-bold",
  /** Docs, GitHub, and Open on a card behind a sign-in: an outline on the surface. */
  secondary:
    "border-line-ui bg-transparent text-ink hover:bg-surface-2 active:bg-line ninety-six:bg-face ninety-six:font-normal ninety-six:active:bg-surface-2",
  /** See more: no outline until hover, pushed to the end of its row. */
  quiet:
    "ms-auto border-transparent px-3 text-ink-body hover:border-line hover:bg-surface-2 active:bg-line ninety-six:bg-face ninety-six:ms-0 ninety-six:font-normal ninety-six:px-3.5 ninety-six:aria-expanded:bg-surface-2 ninety-six:aria-expanded:shadow-sunken ninety-six:active:bg-surface-2",
} as const;

/** A link or a button drawn as one of the page's buttons. */
export function button(look: keyof typeof buttonLooks): string {
  return `${buttonBase} ${buttonLooks[look]}`;
}
