import { ownerCardsSchema, wardStartSchema, type OwnerCard } from "@gatehouse/shared";
import { ApiError, apiJson, apiNoContent } from "../../lib/api";

/**
 * The owner part's three calls. The page loads this module only once the browser holds the owner hint or the sign-in
 * is pressed, so a visitor downloads neither it nor the schemas. Each call answers what the page does next rather
 * than throwing.
 */

/** The API's address on the page's own origin: Caddy strips the prefix in production, the dev proxy forwards it. */
const API = "/gatehouse-api";

/** The owner route's answer, as the page acts on it. */
export type CardsResult =
  | { kind: "cards"; cards: OwnerCard[] }
  /**
   * 401: no session, or one a check refused. `reason` says why it was refused (`ward_unavailable` keeps the session
   * for when Ward is back; `ward_session_ended` ended it), and is undefined when there was no session.
   */
  | { kind: "signed-out"; reason: string | undefined }
  /** 403: a session, but not the owner's. */
  | { kind: "not-owner" }
  /** No answer in time, a 5xx, or an answer the schema refuses. */
  | { kind: "failed" };

/** Asks the API to start a sign-in with Ward: the address to send the browser to, or `null` when it can't start. */
export async function startSignIn(): Promise<string | null> {
  try {
    const { url } = await apiJson(`${API}/auth/ward/start`, wardStartSchema, { method: "POST" });
    return url;
  } catch {
    return null;
  }
}

/** The owner part's cards, giving up after `timeout` ms (the API may be waking). */
export async function fetchOwnerCards(timeout: number): Promise<CardsResult> {
  try {
    const { cards } = await apiJson(`${API}/v1/owner/cards`, ownerCardsSchema, {
      signal: AbortSignal.timeout(timeout),
    });
    return { kind: "cards", cards };
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) return { kind: "signed-out", reason: error.reason };
    if (error instanceof ApiError && error.status === 403) return { kind: "not-owner" };
    return { kind: "failed" };
  }
}

/** Ends Gatehouse's session, never Ward's: `true` once the API answered. */
export async function signOut(): Promise<boolean> {
  try {
    await apiNoContent(`${API}/auth/logout`, { method: "POST" });
    return true;
  } catch {
    return false;
  }
}
