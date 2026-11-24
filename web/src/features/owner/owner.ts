import type { OwnerCard } from "@gatehouse/shared";
import { useEffect, useState, useSyncExternalStore } from "react";
import { dropHint, hasHint, setHint, takeWardError } from "./hint";

/**
 * Where the owner part stands:
 * - `visitor`: no hint; the footer offers the sign-in.
 * - `starting`: the sign-in was pressed and the start is on its way; the browser then leaves for Ward.
 * - `checking`: the hint is set and the owner route was called.
 * - `waking`: the owner route is slow (the API sleeps when idle); Behind the scenes says the cards are on their way.
 * - `owner`: the owner's cards are on the page.
 * - `not-owner`: signed in, but the owner route answered 403.
 * - `failed`: the owner route didn't answer in time, or answered something else, or refused the session because Ward
 *   couldn't vouch for it (the footer then says Ward can't be reached).
 * - `signing-out`: the sign-out is on its way.
 */
export type OwnerStatus =
  "visitor" | "starting" | "checking" | "waking" | "owner" | "not-owner" | "failed" | "signing-out";

/**
 * A message beside the footer's entry: a refusal on the way back from Ward, Ward unreachable, a sign-out done or
 * failed.
 */
export type OwnerNotice = "refused" | "unreachable" | "signed-out" | "sign-out-failed";

interface OwnerState {
  status: OwnerStatus;
  notice: OwnerNotice | null;
  cards: readonly OwnerCard[];
  /** The page came back from Ward with an error, so the footer brings its notice into view. */
  returned: boolean;
}

export interface OwnerPart extends OwnerState {
  signIn: () => void;
  signOut: () => void;
  retry: () => void;
}

/** What the HTML was rendered with, and a visitor's page keeps. */
const VISITOR: OwnerState = { status: "visitor", notice: null, cards: [], returned: false };

/** How long the owner route may take before the page says the cards are on their way. */
const WAKING_AFTER_MS = 1000;
/** How long the page waits for the owner route before it gives up (a waking API answers in seconds). */
const GIVE_UP_AFTER_MS = 30_000;

/**
 * Ward's codes for "Ward can't be reached", in `?ward_error=` and in a 401's `reason`: the page says to try later. Any
 * other `ward_error` is a refusal, and any other 401 a quiet sign-out.
 */
const UNREACHABLE = new Set(["ward_unavailable", "ward_misconfigured"]);

/** The calls, loaded on demand: a visitor never downloads them. */
const loadApi = () => import("./api");

/**
 * The owner part's state for one page, outside React like the look and the mode, so it changes from the calls'
 * answers rather than from an effect. `resume` runs once after mount; the page's StrictMode runs effects twice, so it
 * does its work only the first time.
 */
function createOwnerStore() {
  let state = VISITOR;
  let resumed = false;
  const listeners = new Set<() => void>();

  const set = (next: Partial<OwnerState>) => {
    state = { ...state, ...next };
    for (const listener of listeners) listener();
  };

  const load = async () => {
    set({ status: "checking", notice: null });
    const waking = setTimeout(() => {
      if (state.status === "checking") set({ status: "waking" });
    }, WAKING_AFTER_MS);
    const result = await loadApi()
      .then((api) => api.fetchOwnerCards(GIVE_UP_AFTER_MS))
      .catch(() => ({ kind: "failed" }) as const);
    clearTimeout(waking);
    if (result.kind === "cards") set({ status: "owner", cards: result.cards });
    else if (result.kind === "not-owner") set({ status: "not-owner" });
    else if (result.kind === "failed") set({ status: "failed" });
    else if (result.reason !== undefined && UNREACHABLE.has(result.reason)) {
      // The API kept the session for when Ward is back, so the hint stays: Try again asks once more, and Sign out
      // still ends the session (the sign-out runs no Ward check).
      set({ status: "failed", notice: "unreachable" });
    } else {
      dropHint();
      set({ status: "visitor" });
    }
  };

  return {
    subscribe(listener: () => void) {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
    get: () => state,

    /** After mount: a refusal on the way back from Ward drops the hint; else, with the hint set, ask for the cards. */
    resume() {
      if (resumed) return;
      resumed = true;
      // Back from Ward through the browser's back-forward cache: the page is as it was left, mid-sign-in.
      addEventListener("pageshow", (event) => {
        if (!event.persisted || state.status !== "starting") return;
        dropHint();
        set({ status: "visitor" });
      });
      const code = takeWardError();
      if (code !== null) {
        dropHint();
        set({ notice: UNREACHABLE.has(code) ? "unreachable" : "refused", returned: true });
      } else if (hasHint()) {
        void load();
      }
    },

    /** The footer's sign-in: set the hint, ask the API for Ward's address, and go there. */
    signIn() {
      if (state.status !== "visitor") return;
      set({ status: "starting", notice: null });
      setHint();
      void loadApi()
        .then((api) => api.startSignIn())
        .catch(() => null)
        .then((url) => {
          if (url === null) {
            dropHint();
            set({ status: "visitor", notice: "unreachable" });
          } else {
            location.assign(url);
          }
        });
    },

    /** Ends Gatehouse's session; the owner cards leave the page only once the API has answered. */
    signOut() {
      const before = state.status;
      if (before !== "owner" && before !== "not-owner" && before !== "failed") return;
      set({ status: "signing-out", notice: null });
      void loadApi()
        .then((api) => api.signOut())
        .catch(() => false)
        .then((done) => {
          if (!done) {
            set({ status: before, notice: "sign-out-failed" });
            return;
          }
          dropHint();
          set({ status: "visitor", notice: "signed-out", cards: [] });
        });
    },

    /** After a failed load: ask again. */
    retry() {
      if (state.status === "failed") void load();
    },
  };
}

const visitor = () => VISITOR;

/**
 * The owner part, for the page: its state, and the footer's actions. The HTML and the first client render show the
 * visitor's page; the hint and `?ward_error=` are read after mount.
 */
export function useOwnerPart(): OwnerPart {
  const [store] = useState(createOwnerStore);
  const state = useSyncExternalStore(store.subscribe, store.get, visitor);
  useEffect(() => {
    store.resume();
  }, [store]);
  return { ...state, signIn: store.signIn, signOut: store.signOut, retry: store.retry };
}
