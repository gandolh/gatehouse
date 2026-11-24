import { useEffect, useRef } from "react";
import { KeyIcon } from "../../components/ui/icons";
import { button } from "../../components/ui/looks";
import { cn } from "../../lib/cn";
import type { OwnerPart } from "./owner";
import { ownerLine, words } from "./words";

/** The footer's buttons: the look's quiet button, kept at the start of the row. */
const quiet = cn(button("quiet"), "ms-0");

/**
 * The owner's way in, in the footer: Owner sign-in, or where the sign-in stands and Sign out. The line is a live
 * region, empty in the HTML, so each change is announced. The main button stays one element through every state, so
 * focus stays on it when Owner sign-in becomes Sign out and back. Back from Ward with an error, the line takes focus,
 * which brings it into view; a cancel's quiet line doesn't.
 */
export function OwnerEntry({ part, section }: { part: OwnerPart; section: string }) {
  const { status, notice, cards, returned } = part;
  const line = useRef<HTMLParagraphElement>(null);
  useEffect(() => {
    if (returned) line.current?.focus();
  }, [returned]);

  const busy = status === "starting" || status === "signing-out";
  // A message the person has to act on stands out; where the sign-in stands, and a cancel, stay muted.
  const message = (notice !== null && notice !== "cancelled") || status === "not-owner" || status === "failed";
  const signedIn = status === "owner" || status === "not-owner" || status === "failed" || status === "signing-out";
  const main = signedIn
    ? { label: status === "signing-out" ? words.signingOut : words.signOut, act: part.signOut }
    : { label: status === "starting" ? words.starting : words.signIn, act: part.signIn };

  return (
    <div className="flex flex-wrap items-center gap-y-2">
      <p
        ref={line}
        role="status"
        tabIndex={-1}
        className={cn(
          "max-w-prose not-empty:me-3",
          message ? "font-medium text-ink ninety-six:font-bold" : "text-ink-muted ninety-six:text-ink",
        )}
      >
        {ownerLine(status, notice, cards.length, section)}
      </p>
      <div className="flex flex-wrap gap-2">
        {status === "failed" && (
          <button key="retry" type="button" onClick={part.retry} className={quiet}>
            {words.retry}
          </button>
        )}
        <button
          key="main"
          type="button"
          hidden={status === "checking" || status === "waking"}
          aria-disabled={busy || undefined}
          onClick={busy ? undefined : main.act}
          className={cn(quiet, "aria-disabled:cursor-progress")}
        >
          {!signedIn && <KeyIcon />}
          {main.label}
        </button>
      </div>
    </div>
  );
}
