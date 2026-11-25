import { createRoot } from "react-dom/client";
import App from "./App";
// Self-hosted fonts (no request to Google Fonts; works offline once cached).
import "@fontsource/cinzel/400.css";
import "@fontsource/cinzel/600.css";
import "@fontsource/cinzel/700.css";
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "@fontsource/inter/700.css";
import "./index.css";
import { initUsageTracking } from "./lib/usage-tracker";
import { registerServiceWorker } from "./lib/sw-update";
import { installRevealTop } from "./lib/reveal-top";

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

// Anything opened (collapsibles, compartments, layers) is shown from its top.
installRevealTop();

createRoot(document.getElementById("root")!).render(<App />);

// Prompt-on-update registration: see src/lib/sw-update.ts.
registerServiceWorker();
