import { useSyncExternalStore } from "react";
import { readAloud, type ReaderState } from "@/lib/read-aloud/engine";

const subscribe = (fn: () => void) => readAloud.subscribe(fn);
const snapshot = (): ReaderState => readAloud.getState();

/** Live state of the app-wide reader. */
export function useReadAloudState(): ReaderState {
  return useSyncExternalStore(subscribe, snapshot, snapshot);
}
