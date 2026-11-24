import { useSyncExternalStore } from "react";

/** Light, dark, or system, which follows the device. In code it is `data-theme` on `<html>`; the page says "mode". */
export type Mode = "light" | "dark" | "system";

/** Where the choice is kept, on this device only. */
const KEY = "gatehouse.mode";

/**
 * Each look's page colour, light then dark, for the phone's browser bar (the `theme-color` meta). The head script in
 * index.html holds the same table; mode.test.ts keeps the two, and Profile's ground in the stylesheet, equal.
 */
export const GROUNDS = {
  profile: ["#e5e8ee", "#0d0f13"],
  terminal: ["#f4eee0", "#0e0905"],
  "ninety-six": ["#008080", "#0a1033"],
} as const;

function isMode(value: unknown): value is Mode {
  return value === "light" || value === "dark" || value === "system";
}

/** The mode in force: what the head script set on `<html>` before the first paint (from storage or `?mode=`), or a
 * choice since. Read only after mount: the page's HTML was rendered in light. */
function currentMode(): Mode {
  const value = document.documentElement.dataset.theme;
  return isMode(value) ? value : "light";
}

const listeners = new Set<() => void>();

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

/** The mode in force, re-rendering when it changes. Light while hydrating, as the HTML was rendered. */
export function useMode(): Mode {
  return useSyncExternalStore(subscribe, currentMode, () => "light");
}

/** Colours the phone's browser bar with the page colour of the look and mode in force; System asks the device. */
export function paintBrowserBar(): void {
  const root = document.documentElement;
  const look = root.dataset.look;
  const grounds = look === "terminal" || look === "ninety-six" ? GROUNDS[look] : GROUNDS.profile;
  const mode = currentMode();
  const dark = mode === "dark" || (mode === "system" && matchMedia("(prefers-color-scheme: dark)").matches);
  document.querySelector('meta[name="theme-color"]')?.setAttribute("content", grounds[dark ? 1 : 0]);
}

/** Applies a mode to `<html>`, keeps it on this device, recolours the browser bar and tells every subscriber. */
export function setMode(mode: Mode): void {
  document.documentElement.dataset.theme = mode;
  try {
    localStorage.setItem(KEY, mode);
  } catch {
    // Storage is blocked (a private window): the choice lasts until the page closes.
  }
  paintBrowserBar();
  for (const listener of listeners) listener();
}
