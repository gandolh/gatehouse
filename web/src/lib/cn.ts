import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

/**
 * tailwind-merge, told the page's own @theme names. Without the `text` list it reads `text-body` as a colour, so
 * `cn("text-body", "text-ink")` would drop the size; without the others it can't tell that two radii or two shadows
 * clash.
 */
const twMerge = extendTailwindMerge({
  extend: {
    theme: {
      text: ["wordmark", "section", "lead", "lead-phone", "name", "body", "sub", "control", "fact", "label", "code"],
      radius: ["control", "card", "picture", "track", "segment"],
      shadow: ["card"],
      tracking: ["wordmark", "section", "name"],
      font: ["ui"],
      "font-weight": ["normal", "medium", "strong", "bold"],
      breakpoint: ["sm", "md", "lg", "xl"],
      container: ["page", "measure", "prose"],
    },
    classGroups: {
      z: [{ z: ["sticky", "skip"] }],
    },
  },
});

/** Joins class names, and lets a later class win over an earlier one it conflicts with. */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
