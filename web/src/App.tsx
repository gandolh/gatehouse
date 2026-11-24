import { Footer } from "./components/Footer";
import { Header } from "./components/Header";
import { CardListing, type PageData } from "./features/cards";
import { ModeControl } from "./features/mode";

/**
 * The page. Rendered to HTML at build time by `entry-server.tsx`, and hydrated by `main.tsx`. React renders inside
 * the root element only: `<html>`'s look and mode are the head script's, read after mount.
 */
export function App({ site, access, sections }: PageData) {
  return (
    <>
      <a
        href="#cards"
        className="absolute -top-15 left-2 z-skip inline-flex min-h-11 items-center rounded-control bg-button px-4 text-control font-medium text-on-button no-underline focus:top-2"
      >
        Skip to the cards
      </a>
      <Header site={site}>
        <ModeControl />
      </Header>
      <CardListing sections={sections} access={access} filterLabels={site.filters} />
      <Footer site={site} />
    </>
  );
}
