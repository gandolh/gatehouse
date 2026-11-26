import { Footer } from "./components/Footer";
import { Header } from "./components/Header";
import { CardListing, type PageData } from "./features/cards";
import { LookSwitcher } from "./features/look";
import { ModeControl } from "./features/mode";
import { OwnerEntry, OwnerNote, useOwnerPart } from "./features/owner";
import { ViewControl } from "./features/view";

/**
 * The page. Rendered to HTML at build time by `entry-server.tsx`, and hydrated by `main.tsx`. React renders inside
 * the root element only: `<html>`'s look, mode and view are the head script's, read after mount. The owner part
 * starts as a visitor's page and asks the API for the owner's cards after mount, only when the browser holds the owner
 * hint.
 */
export function App({ site, access, sections, ownerSection }: PageData) {
  const owner = useOwnerPart();
  const sectionTitle = sections.find((section) => section.id === ownerSection)?.title ?? "the page";
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
      <CardListing
        sections={sections}
        access={access}
        filterLabels={site.filters}
        ownerSection={ownerSection}
        ownerCards={owner.cards}
        ownerNote={<OwnerNote status={owner.status} />}
        view={<ViewControl />}
      />
      <Footer
        site={site}
        lookSwitcher={<LookSwitcher />}
        signIn={ownerSection === null ? undefined : <OwnerEntry part={owner} section={sectionTitle} />}
      />
    </>
  );
}
