// Imported by the Workbox service worker (vite.config.ts → importScripts).
//
// 1. Migration off the old auto-updating builds.
//    Builds up to Nov 2026 activated new versions straight away (skipWaiting)
//    and their page code never sends the "apply update" message. New builds
//    wait for the user to accept the "Update available" toast, which those
//    old pages can't show, so anyone with an old version open would be stuck
//    on it. Old builds always left one of these caches behind:
//      - "mc-fonts"            Google Fonts runtime cache (pre self-hosting)
//      - "mystique-compass-*"  the hand-written worker used up to v90
//    If one exists, this worker is replacing an old build, so it takes over
//    immediately, once. Later updates keep the prompt.
const LEGACY_CACHE = (name) => name === 'mc-fonts' || name.startsWith('mystique-compass-');

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.keys().then((names) => {
      if (names.some(LEGACY_CACHE)) return self.skipWaiting();
    }),
  );
});

// 2. Remove those legacy caches once this worker is active.
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((names) => Promise.all(names.filter(LEGACY_CACHE).map((n) => caches.delete(n)))),
  );
});
