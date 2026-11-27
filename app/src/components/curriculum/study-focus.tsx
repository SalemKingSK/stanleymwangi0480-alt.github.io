/**
 * The Curriculum's presence on the results screen:
 *  - useStudyFocus: takes "study this" requests — switches to the right tab (and
 *    Fate Map inner tab), opens the collapsibles leading to the passage, scrolls
 *    to it, highlights it and starts reading it aloud.
 *  - <StudyBanner>: names the lesson in hand, with "Find & listen", and — once it
 *    is studied — "Next lesson", which goes straight on to the next unstudied one.
 *  - <StudyToasts>: a short note every time read-aloud completes a passage.
 */
import * as React from "react";
import { FIELDS, FIELD_BY_ID, MODULES, PRACTICE, chartVariants, type FieldDef } from "@/lib/curriculum/catalogue";
import { buildChart } from "@/lib/curriculum/chart";
import { studyNav, type StudyTarget } from "@/lib/curriculum/navigation";
import { onStudied, startCurriculumTracker, type StudiedEvent } from "@/lib/curriculum/tracker";
import { syllabus, useSyllabus } from "@/lib/curriculum/store";
import { tierOf, unitCount, TIERS } from "@/lib/curriculum/progress";
import { revealTop } from "@/lib/reveal-top";
import { readAloud } from "@/lib/read-aloud/engine";
import { neuralVoice } from "@/lib/read-aloud/neural-voice";
import { appNow } from "@/lib/time/focus";

const esc = (v: string) => (typeof CSS !== "undefined" && CSS.escape ? CSS.escape(v) : v.replace(/["\\]/g, "\\$&"));
const wait = (ms: number) => new Promise<void>((r) => window.setTimeout(r, ms));
const visible = (el: Element) => el.getClientRects().length > 0;

/** The passage on screen for a unit, if it is rendered (and visible). */
export function findPassage(field: string, variant?: string): HTMLElement | null {
  const sel = `[data-study-field="${esc(field)}"]${variant ? `[data-study-variant="${esc(variant)}"]` : ""}`;
  return Array.from(document.querySelectorAll<HTMLElement>(sel)).find(visible) ?? null;
}

function flash(el: HTMLElement) {
  el.classList.remove("study-flash");
  void el.offsetWidth;
  el.classList.add("study-flash");
  window.setTimeout(() => el.classList.remove("study-flash"), 2600);
}

// ── Opening the way to a passage ──────────────────────────────────────────

const NOT_TRIGGERS =
  '[role="tab"], [role="tablist"], .study-banner, .study-toasts, [data-no-study-open], input, select, textarea, a[href], [role="menuitem"], [role="option"]';
const PLAYER_LABEL = /^(listen|previous sentence|next sentence|pause|resume|stop reading)/i;
const STOP = new Set(["the", "and", "of", "a", "an", "in", "on", "year", "with", "your", "for", "to", "tap", "any", "all", "its", "practice", "reading"]);

const norm = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s/&'-]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
const hasWord = (text: string, w: string) => new RegExp(`(^|[^\\p{L}\\p{N}])${w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}([^\\p{L}\\p{N}]|$)`, "u").test(text);

function isOpen(el: HTMLElement) {
  return el.getAttribute("aria-expanded") === "true" || el.getAttribute("data-state") === "open";
}

/** How strongly a control looks like the way in to this unit's passage. */
function triggerScore(el: HTMLElement, field: FieldDef, variant: string | undefined): number {
  // Several hints are separated by ";" (variant names contain spaces).
  const hints = (el.dataset.studyOpen ?? "").split(";").map((h) => h.trim()).filter(Boolean);
  if (hints.length) {
    if (variant && hints.includes(`${field.id}|${variant}`)) return 1000;
    if (hints.includes(field.id)) return 600;
    // Hinted for this field but another variant (another year, another number…): not this one.
    if (hints.some((h) => h.startsWith(`${field.id}|`))) return -1;
    // A hint for another field nested in this field's section still counts as a way in (layers).
    if (hints.some((h) => FIELD_BY_ID.get(h.split("|")[0])?.anchor === field.anchor)) return 0;
  }
  const text = norm(el.textContent ?? "");
  if (!text) return 0;
  let score = 0;
  const label = norm(field.label);
  if (label && text.includes(label)) score += 40;
  for (const seg of field.where.split("›").slice(1).map(norm)) if (seg.length > 3 && text.includes(seg)) score += 20;
  if (variant && variant !== PRACTICE) {
    const v = norm(variant);
    if (v.length > 3 && text.includes(v)) score += 60;
    for (const w of v.split(/[\s·×/]+/)) {
      if (!w || STOP.has(w)) continue;
      if (/^\d+$/.test(w)) {
        if (hasWord(text, w)) score += 8;
      } else if (w.length > 2 && hasWord(text, w)) score += 15;
    }
  }
  // A whole card that happens to be a button: its text matches everything.
  if (text.length > 220) score *= 0.3;
  return score;
}

function bestTrigger(field: FieldDef, variant: string | undefined, tried: WeakSet<Element>): HTMLElement | null {
  const anchors = Array.from(document.querySelectorAll<HTMLElement>(`[data-study-anchor="${esc(field.anchor)}"]`)).filter(visible);
  const roots: ParentNode[] = anchors.length ? anchors : [document.querySelector("main") ?? document.body];
  let best: HTMLElement | null = null;
  let bestScore = 14;
  for (const root of roots) {
    root.querySelectorAll<HTMLElement>('button, [role="button"], summary, [aria-expanded], [data-study-open], .cursor-pointer, [style*="cursor: pointer"]').forEach((el) => {
      // Only the outermost clickable of a nested group (a card and the icon inside it).
      if (!el.matches("button, summary, [data-study-open], [aria-expanded]") && el.parentElement?.closest(".cursor-pointer, [style*='cursor: pointer']")) return;
      if (tried.has(el) || !visible(el) || isOpen(el) || el.closest(NOT_TRIGGERS)) return;
      if ((el as HTMLButtonElement).disabled || PLAYER_LABEL.test(el.getAttribute("aria-label") ?? "")) return;
      const s = triggerScore(el, field, variant);
      if (s > bestScore) {
        best = el;
        bestScore = s;
      }
    });
  }
  return best;
}

function press(el: HTMLElement) {
  // Our own clicks shouldn't make the page jump at every step.
  const had = el.hasAttribute("data-no-reveal");
  if (!had) el.setAttribute("data-no-reveal", "");
  if (typeof el.click === "function") el.click();
  else el.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true, view: window })); // SVG
  if (!had) window.setTimeout(() => el.removeAttribute("data-no-reveal"), 60);
}

/** Start reading a passage: its own Listen button when it has exactly one, else the whole passage. */
function listenTo(el: HTMLElement) {
  const own = Array.from(el.querySelectorAll<HTMLElement>('button[aria-label^="Listen"]')).filter(
    (b) => b.closest("[data-study-field]") === el && visible(b),
  );
  if (own.length === 1) own[0].click();
  else readAloud.start("curriculum", el);
}

let opening = 0;

/**
 * Open the collapsibles leading to a unit's passage, scroll to it, highlight it and
 * (optionally) start reading it. Falls back to the unit's section.
 */
export async function openStudy(fieldId: string, variant?: string, opts: { play?: boolean } = {}): Promise<boolean> {
  const field = FIELD_BY_ID.get(fieldId);
  if (!field) return false;
  const run = ++opening;
  const tried = new WeakSet<Element>();
  const v = variant && variant !== PRACTICE ? variant : undefined;
  const deadline = Date.now() + 10_000;
  let idle = 0;
  let presses = 0;
  await wait(380); // the tab or reading renders
  while (run === opening && Date.now() < deadline) {
    const el = findPassage(fieldId, v);
    if (el) {
      revealTop(el);
      flash(el);
      if (opts.play) {
        await wait(320);
        if (run === opening) listenTo(el);
      }
      return true;
    }
    const trigger = presses < 10 ? bestTrigger(field, v, tried) : null;
    if (!trigger) {
      if (++idle > 4) break; // content may still be loading; give it a moment
      await wait(300);
      continue;
    }
    idle = 0;
    tried.add(trigger);
    presses++;
    trigger.scrollIntoView?.({ block: "nearest" });
    press(trigger);
    await wait(360);
  }
  if (run !== opening) return false;
  const anchor = Array.from(document.querySelectorAll<HTMLElement>(`[data-study-anchor="${esc(field.anchor)}"]`)).find(visible);
  if (anchor) {
    revealTop(anchor);
    flash(anchor);
  }
  return false;
}

/** Kept for callers that only scroll. */
export function scrollToStudy(fieldId: string, variant?: string) {
  void openStudy(fieldId, variant);
}

/** Inside a tap: let audio start later even on iOS. */
export function primeVoice() {
  try {
    neuralVoice.unlock();
  } catch {
    /* ignore */
  }
}

/** The next unstudied lesson on the open reading, after the current one (catalogue order). */
export async function nextLesson(after?: { field: string; variant?: string }): Promise<{ field: string; variant?: string } | null> {
  const subject = studyNav.getSubject();
  if (!subject) return null;
  const chart = await buildChart(subject);
  const scheme = syllabus.get();
  const now = appNow();
  const units: { field: FieldDef; variant: string }[] = [];
  for (const f of FIELDS) {
    if (f.kind === "library") continue; // hundreds of entries each — studied from the Syllabus
    for (const variant of chartVariants(f, chart, now)) units.push({ field: f, variant });
  }
  const start = after ? units.findIndex((u) => u.field.id === after.field && (u.variant === (after.variant ?? PRACTICE))) : -1;
  const curModule = after ? FIELD_BY_ID.get(after.field)?.module : undefined;
  const order = [...units.slice(start + 1), ...units.slice(0, Math.max(start, 0))];
  const pending = order.filter((u) => unitCount(scheme, u.field.id, u.variant) === 0);
  const pick = pending.find((u) => u.field.module === curModule) ?? pending[0];
  return pick ? { field: pick.field.id, variant: pick.variant === PRACTICE ? undefined : pick.variant } : null;
}

export interface FateFocus {
  tab: string;
  key: number;
}

/** Results screen: follow Curriculum requests (and start the study tracker). */
export function useStudyFocus(setActiveTab: (tab: string) => void, setFateFocus: (f: FateFocus) => void) {
  React.useEffect(() => {
    startCurriculumTracker();
    const apply = () => {
      const t = studyNav.take();
      if (!t) return;
      const field = FIELD_BY_ID.get(t.field);
      if (!field) return;
      const tab = MODULES.find((m) => m.id === field.module)?.tab;
      if (field.fateTab) {
        setActiveTab("cosmic-fate");
        setFateFocus({ tab: field.fateTab, key: Date.now() });
      } else if (tab) {
        setActiveTab(tab);
      }
      void openStudy(t.field, t.variant, { play: t.play !== false });
    };
    apply();
    return studyNav.subscribe(apply);
  }, [setActiveTab, setFateFocus]);
}

export function StudyBanner({ onBack }: { onBack: () => void }) {
  const [target, setTarget] = React.useState(() => studyNav.getBanner());
  const [small, setSmall] = React.useState(false);
  const [busy, setBusy] = React.useState(false);
  const [note, setNote] = React.useState<string | null>(null);
  const scheme = useSyllabus();
  React.useEffect(() => studyNav.subscribe(() => setTarget(studyNav.getBanner())), []);
  React.useEffect(() => setNote(null), [target]);
  if (!target) return null;
  const field = FIELD_BY_ID.get(target.field);
  if (!field) return null;
  const variant = target.variant ?? PRACTICE;
  const n = unitCount(scheme, field.id, variant);
  const tier = tierOf(n);
  const done = n > 0;

  const go = (t: Pick<StudyTarget, "field" | "variant" | "subject">) => {
    primeVoice();
    studyNav.request({ field: t.field, variant: t.variant, ...(t.subject ? { subject: t.subject } : {}) });
  };
  const next = async () => {
    primeVoice();
    setBusy(true);
    try {
      const nx = await nextLesson({ field: target.field, variant: target.variant });
      if (nx) studyNav.request(nx);
      else setNote("Everything on this reading is studied — pick a new case study in the Curriculum.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="study-banner" data-no-reveal data-tts-skip role="status">
      <button className="study-banner-main" onClick={() => setSmall((v) => !v)} aria-expanded={!small} title={small ? "Show details" : "Hide details"}>
        <span className="study-banner-icon">{done ? "✓" : "🎓"}</span>
        <span className="study-banner-text">
          <b>{field.label}</b>
          {target.variant && target.variant !== PRACTICE ? <> · {target.variant}</> : null}
          {!small && (
            <span className="study-banner-where">
              {field.where}
              {target.subject ? ` — on ${target.subject.name}'s chart` : ""}
            </span>
          )}
        </span>
        <span className="study-banner-state" style={{ color: tier.color }}>
          {done ? `×${n} · ${tier.label}` : "Not yet studied"}
        </span>
      </button>
      {!small && (
        <div className="study-banner-actions">
          {done ? (
            <>
              <button className="study-banner-primary" disabled={busy} onClick={next}>
                {busy ? "Finding…" : "Next lesson ›"}
              </button>
              <button onClick={() => go(target)}>Listen again</button>
            </>
          ) : (
            <button className="study-banner-primary" onClick={() => go(target)}>
              ▶ Find &amp; listen
            </button>
          )}
          <button onClick={onBack}>Curriculum</button>
          <button aria-label="Close" onClick={() => studyNav.clearBanner()}>
            ✕
          </button>
        </div>
      )}
      {note && <div className="study-banner-note">{note}</div>}
    </div>
  );
}

interface Toast extends StudiedEvent {
  id: number;
}

export function StudyToasts() {
  const [toasts, setToasts] = React.useState<Toast[]>([]);
  const scheme = useSyllabus();
  React.useEffect(
    () =>
      onStudied((e) => {
        const id = Date.now() + Math.random();
        setToasts((t) => [...t.slice(-2), { ...e, id }]);
        window.setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 4200);
      }),
    [],
  );
  if (!toasts.length) return null;
  return (
    <div className="study-toasts" aria-live="polite" data-tts-skip>
      {toasts.map((t) => {
        const field = FIELD_BY_ID.get(t.field);
        const n = unitCount(scheme, t.field, t.variant);
        const tier = tierOf(n);
        const milestone = n > 1 && TIERS.some((x) => x.min === n);
        const partLabel =
          field && typeof field.parts !== "function" && field.parts && n === 0 ? field.parts.find((p) => p.id === t.part)?.label : null;
        return (
          <div key={t.id} className="study-toast" style={{ borderColor: `${tier.color}66` }}>
            <span className="study-toast-icon">{milestone ? "🏆" : "✓"}</span>
            <span>
              <b>{field?.label ?? t.field}</b>
              {t.variant !== PRACTICE ? ` · ${t.variant}` : ""}
              <br />
              <small style={{ color: tier.color }}>
                {n > 0 ? `${milestone ? "Milestone — " : ""}${tier.label} (×${n})` : `${partLabel ?? "Passage"} heard — finish the other parts to count it`}
              </small>
            </span>
          </div>
        );
      })}
    </div>
  );
}
