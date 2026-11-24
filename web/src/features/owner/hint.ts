/**
 * The owner hint: `gatehouse.owner` in localStorage, set when the footer's sign-in is pressed and dropped on a refusal,
 * a cancel, a 401 or a sign-out. The page calls the API only while it is set, so a visitor never wakes the API. Read only after
 * mount: the page's HTML was rendered without it.
 */
const KEY = "gatehouse.owner";

export function hasHint(): boolean {
  try {
    return localStorage.getItem(KEY) !== null;
  } catch {
    // Storage is blocked (a private window): no hint, so no call.
    return false;
  }
}

export function setHint(): void {
  try {
    localStorage.setItem(KEY, "1");
  } catch {
    // Storage is blocked: the sign-in still runs, but the page won't ask for the owner's cards when it comes back.
  }
}

export function dropHint(): void {
  try {
    localStorage.removeItem(KEY);
  } catch {
    // Storage is blocked: there is no hint to drop.
  }
}

/**
 * The code Ward's callback put in `?ward_error=` when a sign-in failed, or `null`. Reading it removes it from the
 * address bar (with `ward_return_to`, which the library may add beside it) and keeps the rest of the address, `?look=`
 * and `?mode=` included, so a reload doesn't show the message again.
 */
export function takeWardError(): string | null {
  const url = new URL(location.href);
  const code = url.searchParams.get("ward_error");
  if (code === null) return null;
  url.searchParams.delete("ward_error");
  url.searchParams.delete("ward_return_to");
  history.replaceState(history.state, "", url);
  return code;
}
