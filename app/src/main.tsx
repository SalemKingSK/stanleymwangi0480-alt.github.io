import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { initUsageTracking } from "./lib/usage-tracker";

// ─── Anonymous install/usage tracking (no login) ─────────────────────────────
// Queues events locally and syncs when a connection is available — including
// devices that install and use the app fully offline, then connect later.
// See src/lib/usage-tracker.ts for details. Set VITE_ANALYTICS_ENDPOINT to
// enable; it's a silent no-op otherwise.
initUsageTracking();
// ────────────────────────────────────────────────────────────────────────────

// ─── Capture beforeinstallprompt BEFORE React mounts ────────────────────────
// Chrome fires this event very early — often before any useEffect can attach a
// listener. We stash it on window so the usePwaInstall hook can pick it up
// regardless of when it first runs.
declare global {
  interface Window {
    __pwaInstallEvent: Event | null;
  }
}
window.__pwaInstallEvent = null;
window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault();
  window.__pwaInstallEvent = e;
  // Re-dispatch a custom event so already-mounted hooks can react immediately
  window.dispatchEvent(new CustomEvent("pwa-prompt-ready"));
});
// ────────────────────────────────────────────────────────────────────────────

createRoot(document.getElementById("root")!).render(<App />);

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js").catch((err) => {
      // Previously fully silent -- a registration failure (bad scope, MIME
      // type issue, network hiccup) left zero trace anywhere, making a
      // "why doesn't offline work" report impossible to diagnose. Logging
      // it costs nothing and is the only way to ever notice next time.
      console.error("[sw] registration failed:", err);
    });
  });
}