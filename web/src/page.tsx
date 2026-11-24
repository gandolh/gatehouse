import { StrictMode, useEffect } from "react";
import { App } from "./App";
import type { PageData } from "./features/cards";

/**
 * Marks `<html data-hydrated>` once React has hydrated and settled, and from then on the stylesheet's `pressed`
 * variant follows Base UI's `data-checked`. Until then it follows what the head script set. The mark waits a frame,
 * so the settings' re-render from the stored value has been committed first.
 */
function HydrationMark() {
  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      document.documentElement.setAttribute("data-hydrated", "");
    });
    return () => {
      cancelAnimationFrame(frame);
    };
  }, []);
  return null;
}

/** The page's tree, the same for the prerender (`entry-server.tsx`), the browser (`main.tsx`) and the tests. */
export function page(data: PageData) {
  return (
    <StrictMode>
      <HydrationMark />
      <App {...data} />
    </StrictMode>
  );
}
