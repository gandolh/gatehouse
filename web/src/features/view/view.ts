import { useSyncExternalStore } from "react";

/** Cards, the page as drawn on a first visit, or Compact: every section drawn as a compact section. */
export type View = "cards" | "compact";

/** Where the choice is kept, on this device only. */
const KEY = "gatehouse.view";

/** The view in force: what the head script set on `<html>` before the first paint (`data-view="compact"`, or nothing for
 * Cards), or a choice since. Read only after mount: the page's HTML was rendered in Cards. */
function currentView(): View {
  return document.documentElement.dataset.view === "compact" ? "compact" : "cards";
}

const listeners = new Set<() => void>();

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

/** The view in force, re-rendering when it changes. Cards while hydrating, as the HTML was rendered. */
export function useView(): View {
  return useSyncExternalStore(subscribe, currentView, () => "cards");
}

/**
 * Applies a view to `<html>` the way the head script does (`data-view="compact"` for Compact, no attribute for Cards),
 * keeps it on this device and tells every subscriber. The sections follow through the stylesheet's `compact` variant.
 */
export function setView(view: View): void {
  const root = document.documentElement;
  if (view === "compact") root.dataset.view = "compact";
  else delete root.dataset.view;
  try {
    localStorage.setItem(KEY, view);
  } catch {
    // Storage is blocked (a private window): the choice lasts until the page closes.
  }
  for (const listener of listeners) listener();
}
