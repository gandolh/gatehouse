import { HourglassIcon } from "../../components/ui/icons";
import type { OwnerStatus } from "./owner";
import { words } from "./words";

/**
 * The note in the owner part's section while the owner route is slow: the API sleeps when idle and takes a few
 * seconds to wake. It stands where the owner's cards will arrive. Nothing moves: the words say it is waiting.
 */
export function OwnerNote({ status }: { status: OwnerStatus }) {
  if (status !== "waking") return null;
  return (
    <div className="mb-5 flex gap-3 rounded-card border border-dashed border-line-ui px-5 py-4 text-sub text-ink-muted terminal:border-line terminal:px-4 ninety-six:border-0 ninety-six:bg-surface ninety-six:p-3 ninety-six:text-ink ninety-six:shadow-panel">
      <HourglassIcon className="mt-0.5 flex-none" />
      <p>
        <span className="font-ui font-medium text-ink ninety-six:font-bold">{words.waking}</span> {words.wakingWhy}
      </p>
    </div>
  );
}
