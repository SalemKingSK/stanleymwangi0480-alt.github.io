// Removes caches left behind by the hand-written service worker used up to v90
// (cache names started with "mystique-compass-"). Workbox manages its own caches.
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((names) =>
      Promise.all(
        names
          .filter((n) => n.startsWith('mystique-compass-'))
          .map((n) => caches.delete(n)),
      ),
    ),
  );
});
