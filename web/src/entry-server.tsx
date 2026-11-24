import cards from "virtual:gatehouse-cards";
import { renderToString } from "react-dom/server";
import { page } from "./page";

/** The page as HTML, for the build's prerender: the same tree `main.tsx` hydrates. */
export function render(): string {
  return renderToString(page(cards));
}

const escape = (text: string) =>
  text.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");

/** The page's title and description, for the prerender to put in `<head>`: the wordmark and the header's line. */
export function head(): string {
  return `<title>${escape(cards.site.wordmark)}</title>\n    <meta name="description" content="${escape(cards.site.line)}" />`;
}
