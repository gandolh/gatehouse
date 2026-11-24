import { StrictMode } from "react";
import { App } from "./App";
import type { PageData } from "./features/cards";

/** The page's tree, the same for the prerender (`entry-server.tsx`), the browser (`main.tsx`) and the tests. */
export function page(data: PageData) {
  return (
    <StrictMode>
      <App {...data} />
    </StrictMode>
  );
}
