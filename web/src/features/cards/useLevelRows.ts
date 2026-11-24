import { useEffect, type RefObject } from "react";

/** The parts of a card levelled across its row, each marked `data-level` on the card. */
const PARTS = ["head", "blurb", "actions"] as const;

/**
 * Gives each part the height of the tallest of its kind in the row, so the names, blurbs and buttons line up across a
 * row of cards. A card's See more text sits below the levelled parts, so an opened card grows alone and never
 * stretches its neighbours. Parts out of sight (a filtered card) are left alone.
 */
function level(root: HTMLElement): void {
  for (const grid of root.querySelectorAll<HTMLElement>("[data-grid]")) {
    for (const part of PARTS) {
      const elements = [...grid.querySelectorAll<HTMLElement>(`[data-level="${part}"]`)];
      for (const element of elements) element.style.minHeight = "";
      const rows = new Map<number, HTMLElement[]>();
      for (const element of elements) {
        const card = element.closest("article");
        if (card === null || element.offsetParent === null) continue;
        const top = Math.round(card.offsetTop);
        rows.set(top, [...(rows.get(top) ?? []), element]);
      }
      for (const row of rows.values()) {
        if (row.length < 2) continue;
        const tallest = Math.max(...row.map((element) => element.offsetHeight));
        for (const element of row) element.style.minHeight = `${tallest}px`;
      }
    }
  }
}

/**
 * Levels the rows of cards under `root` after mount, again when the filter changes, when the width changes (the
 * columns may change with it) and when the fonts have loaded. Without scripts the rows are simply unlevelled.
 */
export function useLevelRows(root: RefObject<HTMLElement | null>, filter: string): void {
  useEffect(() => {
    const element = root.current;
    if (element === null) return undefined;
    let frame = 0;
    const later = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        level(element);
      });
    };
    level(element);
    let width = element.clientWidth;
    const resize =
      typeof ResizeObserver === "undefined"
        ? undefined
        : new ResizeObserver(() => {
            if (element.clientWidth === width) return;
            width = element.clientWidth;
            later();
          });
    resize?.observe(element);
    if ("fonts" in document) void document.fonts.ready.then(later);
    return () => {
      resize?.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [root, filter]);
}
