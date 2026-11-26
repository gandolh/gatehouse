import type { ReactNode } from "react";
import { CardsIcon, CompactIcon } from "../../components/ui/icons";
import { RadioGroup } from "../../components/ui/RadioGroup";
import { setView, useView, type View } from "./view";

const VIEWS = [
  { value: "cards", label: "Cards", icon: <CardsIcon /> },
  { value: "compact", label: "Compact", icon: <CompactIcon /> },
] as const satisfies readonly { value: View; label: string; icon: ReactNode }[];

/**
 * Cards or Compact, kept on this device: a RadioGroup, since nothing goes to the server (base-ui rule 16), drawn like
 * the filters it follows in the section row, and padded as they are so the two line up. The row hides it without
 * scripts, which keep the page in Cards.
 */
export function ViewControl() {
  const view = useView();
  return (
    <RadioGroup
      label="View"
      look="chips"
      setting="view"
      options={VIEWS}
      value={view}
      onValueChange={setView}
      className="p-0.5 max-sm:pb-0 ninety-six:p-0"
    />
  );
}
