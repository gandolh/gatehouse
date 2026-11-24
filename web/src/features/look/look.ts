import { useSyncExternalStore } from "react";
import { paintBrowserBar } from "../mode";

/** Profile, Terminal or Ninety-six. In code it is `data-look` on `<html>`. */
export type Look = "profile" | "terminal" | "ninety-six";

/** Where the choice is kept, on this device only. */
const KEY = "gatehouse.look";

function isLook(value: unknown): value is Look {
  return value === "profile" || value === "terminal" || value === "ninety-six";
}

/** The look in force: what the head script set on `<html>` before the first paint (from storage or `?look=`), or a
 * choice since. Read only after mount: the page's HTML was rendered in Profile. */
function currentLook(): Look {
  const value = document.documentElement.dataset.look;
  return isLook(value) ? value : "profile";
}

const listeners = new Set<() => void>();

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

/** The look in force, re-rendering when it changes. Profile while hydrating, as the HTML was rendered. */
export function useLook(): Look {
  return useSyncExternalStore(subscribe, currentLook, () => "profile");
}

/** Applies a look to `<html>`, keeps it on this device, recolours the browser bar and tells every subscriber. */
export function setLook(look: Look): void {
  document.documentElement.dataset.look = look;
  try {
    localStorage.setItem(KEY, look);
  } catch {
    // Storage is blocked (a private window): the choice lasts until the page closes.
  }
  paintBrowserBar();
  for (const listener of listeners) listener();
}
