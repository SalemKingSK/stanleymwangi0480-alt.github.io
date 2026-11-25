/**
 * What the app is loading right now that the user is waiting for (the
 * reading's code), so background work — the voice's first download above
 * all — never competes with it for a slow connection.
 */

let busy = 0;
const waiters = new Set<() => void>();

/** Run `load` as user-awaited loading; background downloads hold off meanwhile. */
export function whileLoading<T>(load: () => Promise<T>): Promise<T> {
  busy++;
  return load().finally(() => {
    busy--;
    if (!busy) waiters.forEach((fn) => fn());
  });
}

let readingCode = false;
/** The reading's code has arrived (the big download the user waits for). */
export function noteReadingCodeReady() {
  readingCode = true;
}
export function readingCodeReady(): boolean {
  return readingCode;
}

export function appBusy(): boolean {
  return busy > 0;
}

/** Called once nothing the user waits for is loading. */
export function onAppIdle(fn: () => void): () => void {
  waiters.add(fn);
  return () => waiters.delete(fn);
}

/** Tests. */
export function resetAppLoading() {
  busy = 0;
  readingCode = false;
  waiters.clear();
}
