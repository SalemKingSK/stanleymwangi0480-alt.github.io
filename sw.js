// Bumped again for the Google Preferred Sources integration. This version
// keeps the same-origin impostor-page guard and ensures every device receives
// the latest app shell and CSP policy.
const CACHE_NAME = "mystique-compass-v76";
const RUNTIME_CACHE = `${CACHE_NAME}-runtime`;

// Every file the manifest/index.html actually reference, so the offline
// shell and install icons are guaranteed available from the very first
// visit — not just lazily runtime-cached the first time something happens
// to request them.
const PRECACHE_URLS = [
  "/",
  "/manifest.json",
  "/icon-192.svg",
  "/icon-512.svg",
  "/icon-192.png",
  "/icon-512.png",
  "/favicon.svg",
];

const ASSET_RE =
  /\/(assets\/|icon-|favicon|manifest\.json|robots\.txt|opengraph\.jpg|background-results\.jpg)/;

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) =>
        // IMPORTANT: cache.addAll() is atomic -- if ANY single URL in the list
        // fails (404, transient network hiccup during install, etc.), the
        // ENTIRE call rejects and NOTHING gets stored, not even the URLs that
        // succeeded. A previous version of this file swallowed that rejection
        // silently (`.catch(() => {})` right after addAll), which meant the
        // whole offline shell could end up completely uncached with zero
        // visible error -- exactly the "used to work offline, now doesn't"
        // failure mode. Caching each URL independently means one bad/slow
        // entry can never take down the rest, and failures are at least
        // logged so they're debuggable next time.
        Promise.all(
          PRECACHE_URLS.map((url) =>
            cache.add(url).catch((err) => {
              console.warn("[sw] precache failed for", url, err);
            }),
          ),
        ),
      )
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((names) =>
        Promise.all(
          names
            .filter((name) => ![CACHE_NAME, RUNTIME_CACHE].includes(name))
            .map((name) => caches.delete(name)),
        ),
      )
      .then(() => self.clients.claim()),
  );
});

async function cacheFirst(request) {
  const cached = await caches.match(request);
  if (cached) return cached;
  const response = await fetch(request);
  if (response.ok) {
    const cache = await caches.open(RUNTIME_CACHE);
    cache.put(request, response.clone()).catch(() => {});
  }
  return response;
}

// Replit (and similar dev-preview hosts) can serve their own "workspace is
// asleep" placeholder page from the exact same origin as the app, with a
// normal 200 status — there's no network error for fetch() to catch, so a
// plain networkFirst would happily accept and display that placeholder
// instead of the real app. This checks the response body for a marker that
// only the real index.html contains (see the <meta name="mystique-app-shell">
// tag) before trusting a navigation response as genuine.
async function isRealAppShell(response) {
  try {
    const text = await response.clone().text();
    return text.includes('name="mystique-app-shell"');
  } catch {
    return false;
  }
}

async function networkFirst(request) {
  const isNavigation = request.mode === "navigate";
  try {
    const response = await fetch(request);
    if (isNavigation && response.ok && !(await isRealAppShell(response))) {
      // Got a "successful" response that isn't actually our app (e.g. a
      // cold-workspace placeholder) — prefer the real cached shell instead,
      // if one exists from a previous successful visit.
      const shell = await caches.match("/");
      if (shell) return shell;
      // No cached shell yet (very first-ever visit during a cold period) —
      // nothing better to show than what the network gave us.
      return response;
    }
    if (response.ok) {
      const cache = await caches.open(RUNTIME_CACHE);
      cache.put(request, response.clone()).catch(() => {});
    }
    return response;
  } catch {
    const cached = await caches.match(request);
    if (cached) return cached;
    if (isNavigation) {
      const shell = await caches.match("/");
      if (shell) return shell;
    }
    return new Response(JSON.stringify({ error: "offline" }), {
      status: 503,
      headers: { "Content-Type": "application/json" },
    });
  }
}

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;
  if (url.pathname.startsWith("/api/")) {
    event.respondWith(
      fetch(request).catch(
        () =>
          new Response(JSON.stringify({ error: "offline" }), {
            status: 503,
            headers: { "Content-Type": "application/json" },
          }),
      ),
    );
    return;
  }
  if (request.mode === "navigate") {
    event.respondWith(networkFirst(request));
    return;
  }
  if (ASSET_RE.test(url.pathname)) {
    event.respondWith(cacheFirst(request));
    return;
  }
  event.respondWith(networkFirst(request));
});