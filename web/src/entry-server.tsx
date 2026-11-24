import { StrictMode } from "react";
import { renderToString } from "react-dom/server";
import { App } from "./App";

/** The page as HTML, for the build's prerender: the same tree `main.tsx` hydrates. */
export function render(): string {
  return renderToString(
    <StrictMode>
      <App />
    </StrictMode>,
  );
}
