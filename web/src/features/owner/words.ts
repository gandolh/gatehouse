import type { OwnerNotice, OwnerStatus } from "./owner";

/**
 * The owner part's words. Plain, and never a code from Ward or the API: a refusal reads the same whatever Ward said,
 * and an expired round trip reads as a refusal too. A cancel at Ward is not a refusal: it gets a quiet line.
 */
export const words = {
  signIn: "Owner sign-in",
  starting: "Opening Ward…",
  signOut: "Sign out",
  signingOut: "Signing out…",
  retry: "Try again",
  waking: "The owner's cards are on their way.",
  wakingWhy: "Their server sleeps when nobody uses it, and takes a few seconds to wake.",
} as const;

const NOTICES: Record<OwnerNotice, string> = {
  refused: "Ward didn't sign you in. This sign-in is only for the owner of this site.",
  cancelled: "Sign-in cancelled.",
  unreachable: "Ward can't be reached right now. Try again later.",
  "signed-out": "Signed out. The owner's cards are off the page.",
  "sign-out-failed": "The sign-out didn't reach the server. Try again.",
};

/**
 * The footer's line for the owner part: a notice when there is one, else where the sign-in stands. `section` is the
 * title of the section the owner's cards join.
 */
export function ownerLine(status: OwnerStatus, notice: OwnerNotice | null, count: number, section: string): string {
  if (notice !== null) return NOTICES[notice];
  switch (status) {
    case "checking":
    case "waking":
      return "Checking the owner sign-in…";
    case "owner":
      return `Signed in as the owner: ${count} ${count === 1 ? "card" : "cards"} added to ${section}.`;
    case "not-owner":
      return "You're signed in, but not as the owner: the cards behind this sign-in are only for the owner.";
    case "failed":
      return "The owner's cards didn't load.";
    default:
      return "";
  }
}
