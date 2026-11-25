/**
 * Service worker registration with "prompt on update".
 *
 * The worker is built with `skipWaiting: false`, so a new version installs in
 * the background and then WAITS instead of taking over mid-session (which
 * could swap lazy-loaded chunks out from under an open reading). When a
 * waiting worker is found we tell the UI; the UI shows a "new version" toast
 * and calls `applyUpdate()` when the user agrees.
 *
 * Workbox's generated worker listens for `{ type: "SKIP_WAITING" }` messages,
 * so applying the update is a postMessage plus one reload once the new
 * worker has taken control.
 */

type Listener = (apply: () => void) => void;

let waitingWorker: ServiceWorker | null = null;
const listeners = new Set<Listener>();
let reloading = false;

export function applyUpdate(): void {
  if (!waitingWorker) {
    window.location.reload();
    return;
  }
  waitingWorker.postMessage({ type: "SKIP_WAITING" });
}

let registered: ServiceWorkerRegistration | null = null;
const RECOVER_KEY = "mc-recovered-at";

/**
 * Part of the app's code couldn't be loaded — almost always because this
 * page is an older version whose files have since been replaced. Switch to
 * the newest version (activating the waiting worker, or fetching it first)
 * and reload; at most once a minute, so a real outage can't loop.
 */
export async function recoverFromMissingCode(): Promise<boolean> {
  // Offline, nothing is "missing" — reloading would only lose the user's place.
  if (typeof navigator !== "undefined" && navigator.onLine === false) return false;
  try {
    const last = Number(sessionStorage.getItem(RECOVER_KEY) || 0);
    if (Date.now() - last < 60_000) return false;
    sessionStorage.setItem(RECOVER_KEY, String(Date.now()));
  } catch {
    /* private mode: still try once */
  }
  try {
    if (!waitingWorker && registered) {
      await registered.update().catch(() => {});
      await new Promise((r) => setTimeout(r, 1500)); // let a new version install
      if (registered.waiting) waitingWorker = registered.waiting;
    }
  } catch {
    /* fall through to a plain reload */
  }
  if (waitingWorker) {
    waitingWorker.postMessage({ type: "SKIP_WAITING" }); // controllerchange reloads
    setTimeout(() => window.location.reload(), 3000); // in case it doesn't
  } else {
    window.location.reload();
  }
  return true;
}

function announce(worker: ServiceWorker) {
  waitingWorker = worker;
  listeners.forEach((fn) => fn(applyUpdate));
}

/** Subscribe to "an update is ready". Fires at once if one is already waiting. */
export function onUpdateReady(fn: Listener): () => void {
  listeners.add(fn);
  if (waitingWorker) fn(applyUpdate);
  return () => listeners.delete(fn);
}

function watch(registration: ServiceWorkerRegistration) {
  // Only treat it as an *update* when a page is already controlled; the very
  // first install should activate silently.
  if (registration.waiting && navigator.serviceWorker.controller) {
    announce(registration.waiting);
  }
  registration.addEventListener("updatefound", () => {
    const incoming = registration.installing;
    if (!incoming) return;
    incoming.addEventListener("statechange", () => {
      if (incoming.state === "installed" && navigator.serviceWorker.controller) {
        announce(incoming);
      }
    });
  });
}

export function registerServiceWorker(): void {
  if (!("serviceWorker" in navigator)) return;

  // The very first install taking control isn't a version change — the page
  // already is that version — so don't reload (it would wipe what's typed).
  let hadController = !!navigator.serviceWorker.controller;
  navigator.serviceWorker.addEventListener("controllerchange", () => {
    if (!hadController) {
      hadController = true;
      return;
    }
    if (reloading) return;
    reloading = true;
    window.location.reload();
  });

  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/sw.js")
      .then((registration) => {
        registered = registration;
        watch(registration);
        // Check for a new version when the user comes back to the app.
        document.addEventListener("visibilitychange", () => {
          if (document.visibilityState === "visible") void registration.update().catch(() => {});
        });
      })
      .catch((err) => {
        console.error("[sw] registration failed:", err);
      });
  });
}
