import type { Access } from "@gatehouse/shared";

/** The three filters: every card, the ones that open for anyone, the ones behind a sign-in. */
export type Filter = "all" | "open" | "sign-in";

/** The access labels each filter shows; All shows every label. */
const SHOWN: Record<Exclude<Filter, "all">, readonly Access[]> = {
  open: ["open", "docs", "repo"],
  "sign-in": ["sign-in", "owner"],
};

/** Whether a card with this access label shows under the filter. */
export function shows(filter: Filter, access: Access): boolean {
  return filter === "all" || SHOWN[filter].includes(access);
}
