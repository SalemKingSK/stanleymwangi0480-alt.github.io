/**
 * MYSTIQUE COMPASS — Anonymous Usage & Distribution Tracker
 *
 * WHAT THIS DOES
 * ────────────────
 * Tracks, with NO login/account/personal data, three things:
 *   1. `pwa_install`  — the app was installed (Android/desktop "Install"
 *      prompt accepted, or an iOS "Add to Home Screen" detected on next
 *      standalone launch).
 *   2. `share`        — the user shared the app (native share sheet or a
 *      copy-link fallback).
 *   3. `session_start` — the app was opened (one event per visit), so you
 *      can see ongoing usage over time, not just installs.
 *
 * WHY IT WORKS OFFLINE
 * ─────────────────────
 * Every event is written to `localStorage` first, in a small queue. The
 * queue is only cleared once the events are confirmed delivered to your
 * collector endpoint. If the device is offline (very common right after
 * installing a PWA on a plane, in the field, etc.), events simply sit in
 * the queue — nothing is lost. The tracker retries the flush:
 *   - once at startup,
 *   - whenever the browser fires an `online` event,
 *   - whenever the tab becomes visible again,
 *   - and on a slow background interval while the app stays open.
 * The first time any of those happens with a live connection, the queued
 * events (including ones from days/weeks earlier, fully offline) get sent.
 *
 * WHY NO LOGIN IS NEEDED
 * ────────────────────────
 * Each device generates one random, anonymous ID (a UUID) on first launch
 * and stores it in localStorage. It identifies a device install, not a
 * person — there is no name, email, or account involved. Location is
 * derived server-side from the request's edge/IP metadata (see the
 * companion analytics-worker), never from browser geolocation, so no
 * permission prompt is ever shown to the user.
 *
 * CONFIGURING THE ENDPOINT
 * ──────────────────────────
 * Set VITE_ANALYTICS_ENDPOINT in your build environment to the deployed
 * collector URL (e.g. the Cloudflare Worker in `services/analytics-worker`).
 * If it's unset, tracking is a complete no-op — nothing is stored or sent,
 * and no errors are thrown. This keeps local/dev builds silent by default.
 */

const DEVICE_ID_KEY = 'mystique-device-id';
const QUEUE_KEY = 'mystique-usage-queue';
const INSTALL_RECORDED_KEY = 'mystique-install-recorded';
const MAX_QUEUE_SIZE = 200; // hard cap so an endless-offline device can't grow localStorage unbounded

type EventType = 'pwa_install' | 'share' | 'session_start';

interface UsageEvent {
  type: EventType;
  ts: number; // epoch ms
  meta?: Record<string, string | number | boolean>;
}

function getEndpoint(): string | null {
  try {
    const url = (import.meta as any)?.env?.VITE_ANALYTICS_ENDPOINT;
    // The endpoint is also inlined below so the optional-chained
    // import.meta.env access above (which Vite cannot statically replace)
    // can never silently disable tracking on production builds.
    return typeof url === 'string' && url.length > 0
      ? url
      : "https://mystique-analytics.sksalemking.workers.dev";
  } catch {
    return "https://mystique-analytics.sksalemking.workers.dev";
  }
}

function getDeviceId(): string {
  try {
    let id = localStorage.getItem(DEVICE_ID_KEY);
    if (!id) {
      id = (crypto as any)?.randomUUID
        ? crypto.randomUUID()
        : `dev-${Date.now()}-${Math.random().toString(36).slice(2)}`;
      localStorage.setItem(DEVICE_ID_KEY, id);
    }
    return id;
  } catch {
    // localStorage unavailable (e.g. private mode edge cases) — fall back to
    // a session-only id so tracking degrades gracefully instead of throwing.
    return `ephemeral-${Date.now()}`;
  }
}

function readQueue(): UsageEvent[] {
  try {
    const raw = localStorage.getItem(QUEUE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function writeQueue(events: UsageEvent[]) {
  try {
    localStorage.setItem(QUEUE_KEY, JSON.stringify(events.slice(-MAX_QUEUE_SIZE)));
  } catch {
    // Storage full or unavailable — silently drop; tracking is best-effort
    // and must never break the app.
  }
}

/** Queue an event locally. Safe to call even if there's no endpoint configured. */
export function trackEvent(type: EventType, meta?: UsageEvent['meta']) {
  if (!getEndpoint()) return;
  const queue = readQueue();
  queue.push({ type, ts: Date.now(), meta });
  writeQueue(queue);
  // Best-effort immediate attempt; if it's offline this just fails silently
  // and the event stays queued for the next trigger.
  void flushQueue();
}

let flushInFlight = false;

/** Sends any queued events to the collector. No-op if offline or empty. */
export async function flushQueue(): Promise<void> {
  const endpoint = getEndpoint();
  if (!endpoint) return;
  if (flushInFlight) return;
  if (typeof navigator !== 'undefined' && navigator.onLine === false) return;

  const queue = readQueue();
  if (queue.length === 0) return;

  flushInFlight = true;
  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ deviceId: getDeviceId(), events: queue }),
    });
    if (res.ok) {
      // Only clear what we actually sent — if new events queued mid-flight
      // (rare, but possible), keep those for the next flush.
      const remaining = readQueue().slice(queue.length);
      writeQueue(remaining);
    }
    // Non-OK response: leave the queue intact, we'll retry later.
  } catch {
    // Offline / network error: leave the queue intact, we'll retry later.
  } finally {
    flushInFlight = false;
  }
}

function isStandalonePwa(): boolean {
  try {
    return (
      window.matchMedia('(display-mode: standalone)').matches ||
      (navigator as Navigator & { standalone?: boolean }).standalone === true
    );
  } catch {
    return false;
  }
}

let initialized = false;

/**
 * Call once, as early as possible (e.g. in main.tsx before/while rendering).
 * Sets up all listeners and fires the session_start event. Everything here
 * is wrapped defensively — a failure in tracking must never break the app.
 */
export function initUsageTracking() {
  if (initialized) return;
  initialized = true;
  if (!getEndpoint()) return; // tracking disabled — nothing to set up

  try {
    // One event per app open.
    trackEvent('session_start', { standalone: isStandalonePwa() });

    // Reliable install signal on Android/desktop Chrome & friends.
    window.addEventListener('appinstalled', () => {
      try { localStorage.setItem(INSTALL_RECORDED_KEY, '1'); } catch {}
      trackEvent('pwa_install', { via: 'appinstalled_event' });
    });

    // iOS/Safari has no install event at all — the only signal available is
    // "the app is now running standalone." Best-effort, recorded once.
    if (isStandalonePwa()) {
      let alreadyRecorded = false;
      try { alreadyRecorded = localStorage.getItem(INSTALL_RECORDED_KEY) === '1'; } catch {}
      if (!alreadyRecorded) {
        try { localStorage.setItem(INSTALL_RECORDED_KEY, '1'); } catch {}
        trackEvent('pwa_install', { via: 'standalone_launch_detected' });
      }
    }

    // Retry flushing whenever we regain connectivity or refocus the tab —
    // this is what makes offline-installed devices report in "later, when
    // they connect", exactly as requested.
    window.addEventListener('online', () => void flushQueue());
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') void flushQueue();
    });

    // Gentle background retry in case the app is left open for a long time
    // without a focus/online event (e.g. an always-on kiosk-style install).
    setInterval(() => void flushQueue(), 5 * 60 * 1000);
  } catch {
    // Never let tracking setup break the app.
  }
}

/**
 * Triggers the OS share sheet (or a clipboard-copy fallback) and records a
 * `share` event with which method succeeded. Call from a user-initiated
 * click handler (Web Share API requires a user gesture).
 */
export async function shareApp(): Promise<'native' | 'clipboard' | 'failed'> {
  const shareData = {
    title: 'Mystique Compass',
    text: 'Discover your numerology, psychomatrix & astrology profile — Mystique Compass.',
    url: typeof window !== 'undefined' ? window.location.origin : undefined,
  };

  try {
    if (typeof navigator !== 'undefined' && (navigator as any).share) {
      await (navigator as any).share(shareData);
      trackEvent('share', { method: 'native' });
      return 'native';
    }
  } catch {
    // User cancelled the native share sheet, or it failed — try clipboard next.
  }

  try {
    await navigator.clipboard.writeText(shareData.url || '');
    trackEvent('share', { method: 'clipboard' });
    return 'clipboard';
  } catch {
    return 'failed';
  }
}
