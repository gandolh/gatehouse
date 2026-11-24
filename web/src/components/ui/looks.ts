/** The page's width: capped and centred, its gutters growing with the screen. The header, the section row, the
 * sections and the footer share it. */
export const pageWidth = "mx-auto w-full max-w-page px-4 sm:px-6 lg:px-8 terminal:lg:px-6";

const buttonBase = [
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-control border px-4 font-ui text-control font-medium",
  "whitespace-nowrap no-underline select-none sm:min-h-9.5 sm:pointer-coarse:min-h-11",
  "motion-safe:transition-colors motion-safe:duration-120",
].join(" ");

const buttonLooks = {
  /** Opens a card for anyone: filled. */
  primary: "border-button bg-button text-on-button hover:brightness-118 terminal:font-[600] terminal:hover:underline",
  /** Docs, GitHub, and Open on a card behind a sign-in: an outline on the surface. */
  secondary: "border-line-ui bg-transparent text-ink hover:bg-surface-2 active:bg-line",
  /** See more: no outline until hover, pushed to the end of its row. */
  quiet: "ms-auto border-transparent px-3 text-ink-body hover:border-line hover:bg-surface-2 active:bg-line",
} as const;

/** A link or a button drawn as one of the page's buttons. */
export function button(look: keyof typeof buttonLooks): string {
  return `${buttonBase} ${buttonLooks[look]}`;
}
