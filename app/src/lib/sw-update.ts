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

  navigator.serviceWorker.addEventListener("controllerchange", () => {
    if (reloading) return;
    reloading = true;
    window.location.reload();
  });

  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/sw.js")
      .then((registration) => {
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
