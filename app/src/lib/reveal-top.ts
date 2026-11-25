/**
 * "Show it from the top": whenever something opens — any collapsible,
 * accordion, compartment, layer or "more" toggle in any tab — the page
 * scrolls so the opened section starts at the top of the screen (just under
 * the sticky tab bar), so its text is read from the beginning instead of
 * landing mid-way or at the bottom of it.
 *
 * This is one app-wide behaviour rather than code in each component: a tap
 * on a control is followed, once the opening animation has settled, by a
 * check of which section around the control grew; that section is brought
 * to the top. Taps that don't open anything (tabs, links, form fields,
 * Listen) are left alone, as are taps followed by the user scrolling.
 */

/** Space kept above a section: the sticky tab bar (if any) plus a margin. */
export function topOffset(): number {
  const nav = typeof document !== "undefined" ? document.querySelector<HTMLElement>(".dash-nav") : null;
  const h = nav ? nav.getBoundingClientRect().height : 0;
  return Math.round(h + 10);
}

function reducedMotion(): boolean {
  return typeof window !== "undefined" && !!window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
}

/** The nearest ancestor that scrolls its own content (a dialog, a panel), or null for the page. */
function scrollBox(el: Element): HTMLElement | null {
  let p = el.parentElement;
  while (p && p !== document.body && p !== document.documentElement) {
    const s = getComputedStyle(p);
    if (/(auto|scroll)/.test(s.overflowY) && p.scrollHeight > p.clientHeight + 4) return p;
    p = p.parentElement;
  }
  return null;
}

let lastReveal = 0;

/** Scroll so `el` starts at the top of the screen (or of its scrolling panel). */
export function revealTop(el: Element | null | undefined, smooth = true) {
  if (!el || !el.isConnected) return;
  lastReveal = performance.now();
  const behavior: ScrollBehavior = smooth && !reducedMotion() ? "smooth" : "auto";
  const box = scrollBox(el);
  const rect = el.getBoundingClientRect();
  if (box) {
    const b = box.getBoundingClientRect();
    const delta = rect.top - b.top - 8;
    if (Math.abs(delta) > 4) box.scrollBy({ top: delta, behavior });
    return;
  }
  const delta = rect.top - topOffset();
  if (Math.abs(delta) > 4) window.scrollBy({ top: delta, behavior });
}

/** Controls a tap on which may open something. */
const CONTROL = 'button, [role="button"], summary, [aria-expanded], [data-state], [data-reveal]';
/** Controls that never should move the page: tabs, navigation, fields, Listen, the player. */
const SKIP =
  '[role="tab"], [role="tablist"], .dash-nav, [data-no-reveal], [data-tts-skip], input, select, textarea, label, a[href], [role="menuitem"], [role="option"]';
/** A section has opened when it grows by at least this much. */
const MIN_GROWTH = 48;

interface Watch {
  control: HTMLElement;
  chain: { el: HTMLElement; h: number }[];
  at: number;
}

function chainOf(control: HTMLElement): { el: HTMLElement; h: number }[] {
  const out: { el: HTMLElement; h: number }[] = [];
  let el: HTMLElement | null = control;
  for (let i = 0; el && i < 14 && el !== document.body; i++, el = el.parentElement) {
    out.push({ el, h: el.getBoundingClientRect().height });
    if (el.tagName === "MAIN") break;
  }
  return out;
}

/**
 * Which section opened, and where its top is: the nearest ancestor of the
 * tapped control that grew (an accordion item, a card) — or the control
 * itself when that section starts far above it (a long list).
 */
export function openedSection(w: Watch): HTMLElement | null {
  if (!w.control.isConnected) return null;
  const vh = window.innerHeight;
  for (const { el, h } of w.chain) {
    if (!el.isConnected) return null;
    const now = el.getBoundingClientRect();
    if (now.height - h >= MIN_GROWTH) {
      const c = w.control.getBoundingClientRect();
      return c.top - now.top <= vh * 0.6 ? el : w.control;
    }
  }
  return null;
}

/** Whether the opened section is already shown from its top and in full. */
function alreadyShown(section: HTMLElement): boolean {
  const r = section.getBoundingClientRect();
  return r.top >= topOffset() - 4 && r.bottom <= window.innerHeight - 90;
}

let installed = false;

/** Install the app-wide behaviour (idempotent). Returns a function that removes it. */
export function installRevealTop(): () => void {
  if (installed || typeof document === "undefined") return () => {};
  installed = true;
  let userScrolled = 0;
  const onUserScroll = () => (userScrolled = performance.now());

  const onClick = (ev: MouseEvent) => {
    const target = ev.target as Element | null;
    const control = target?.closest<HTMLElement>(CONTROL);
    if (!control || control.closest(SKIP)) return;
    if (!control.closest("main, [role='dialog']")) return;
    // Measure before the app reacts (this runs first, in the capture phase).
    const w: Watch = { control, chain: chainOf(control), at: performance.now() };
    settle(w);
  };

  /** Wait until the opening animation has finished (sizes steady), then act. */
  const settle = (w: Watch) => {
    let last = "";
    let steadySince = performance.now();
    const step = () => {
      const now = performance.now();
      if (userScrolled > w.at || lastReveal > w.at) return; // the user (or the app) moved the page
      const sig = w.chain.map(({ el }) => Math.round(el.getBoundingClientRect().height)).join(",");
      if (sig !== last) {
        last = sig;
        steadySince = now;
      }
      const steady = now - steadySince >= 140 && now - w.at >= 200;
      if (!steady && now - w.at < 1200) {
        requestAnimationFrame(step);
        return;
      }
      const section = openedSection(w);
      if (!section || alreadyShown(section)) return;
      revealTop(section);
    };
    requestAnimationFrame(step);
  };

  document.addEventListener("click", onClick, true);
  window.addEventListener("wheel", onUserScroll, { passive: true });
  window.addEventListener("touchmove", onUserScroll, { passive: true });
  window.addEventListener("keydown", onUserScroll);
  return () => {
    installed = false;
    document.removeEventListener("click", onClick, true);
    window.removeEventListener("wheel", onUserScroll);
    window.removeEventListener("touchmove", onUserScroll);
    window.removeEventListener("keydown", onUserScroll);
  };
}
