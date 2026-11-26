/**
 * The Curriculum's presence on the results screen:
 *  - useStudyFocus: takes "study this" requests — switches to the right tab
 *    (and Fate Map inner tab) and scrolls to the passage, or its section.
 *  - <StudyBanner>: a slim bar naming the unit being studied, its location and
 *    whether it has been heard yet, with "find it" and "back to Curriculum".
 *  - <StudyToasts>: a short note every time read-aloud completes a passage,
 *    with its new count and mastery tier.
 */
import * as React from "react";
import { FIELD_BY_ID, MODULES } from "@/lib/curriculum/catalogue";
import { studyNav } from "@/lib/curriculum/navigation";
import { onStudied, startCurriculumTracker, type StudiedEvent } from "@/lib/curriculum/tracker";
import { useSyllabus } from "@/lib/curriculum/store";
import { tierOf, unitCount, TIERS } from "@/lib/curriculum/progress";
import { revealTop } from "@/lib/reveal-top";

const esc = (v: string) => (typeof CSS !== "undefined" && CSS.escape ? CSS.escape(v) : v.replace(/["\\]/g, "\\$&"));

/** The passage on screen for a unit, if it is rendered (and visible). */
export function findPassage(field: string, variant?: string): HTMLElement | null {
  const sel = `[data-study-field="${esc(field)}"]${variant ? `[data-study-variant="${esc(variant)}"]` : ""}`;
  const all = Array.from(document.querySelectorAll<HTMLElement>(sel));
  return all.find((el) => el.getClientRects().length > 0) ?? null;
}

function flash(el: HTMLElement) {
  el.classList.remove("study-flash");
  void el.offsetWidth;
  el.classList.add("study-flash");
  window.setTimeout(() => el.classList.remove("study-flash"), 2600);
}

/** Scroll to the unit's passage, or to its section when the passage is still closed. */
export function scrollToStudy(fieldId: string, variant?: string) {
  const field = FIELD_BY_ID.get(fieldId);
  if (!field) return;
  let tries = 0;
  const attempt = () => {
    tries++;
    const exact = findPassage(fieldId, variant);
    if (exact) {
      revealTop(exact);
      flash(exact);
      return;
    }
    if (tries < 5) {
      window.setTimeout(attempt, tries < 3 ? 350 : 700);
      return;
    }
    const anchor = Array.from(document.querySelectorAll<HTMLElement>(`[data-study-anchor="${esc(field.anchor)}"]`)).find(
      (el) => el.getClientRects().length > 0,
    );
    if (anchor) {
      revealTop(anchor);
      flash(anchor);
    }
  };
  window.setTimeout(attempt, 420);
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
      scrollToStudy(t.field, t.variant);
    };
    apply();
    return studyNav.subscribe(apply);
  }, [setActiveTab, setFateFocus]);
}

export function StudyBanner({ onBack }: { onBack: () => void }) {
  const [target, setTarget] = React.useState(() => studyNav.getBanner());
  const [small, setSmall] = React.useState(false);
  const scheme = useSyllabus();
  React.useEffect(() => studyNav.subscribe(() => setTarget(studyNav.getBanner())), []);
  if (!target) return null;
  const field = FIELD_BY_ID.get(target.field);
  if (!field) return null;
  const variant = target.variant ?? "Practice";
  const n = unitCount(scheme, field.id, variant);
  const tier = tierOf(n);
  const done = n > 0;
  return (
    <div className="study-banner" data-no-reveal data-tts-skip role="status">
      <button className="study-banner-main" onClick={() => setSmall((v) => !v)} aria-expanded={!small} title={small ? "Show details" : "Hide details"}>
        <span className="study-banner-icon">{done ? "✓" : "🎓"}</span>
        <span className="study-banner-text">
          <b>{field.label}</b>
          {target.variant && target.variant !== "Practice" ? <> · {target.variant}</> : null}
          {!small && (
            <span className="study-banner-where">
              {field.where}
              {target.subject ? ` — on ${target.subject.name}'s chart` : ""}
            </span>
          )}
        </span>
        <span className="study-banner-state" style={{ color: tier.color }}>
          {done ? `×${n} · ${tier.label}` : "Open it & press Listen"}
        </span>
      </button>
      {!small && (
        <div className="study-banner-actions">
          <button onClick={() => scrollToStudy(field.id, target.variant)}>Find it</button>
          <button onClick={onBack}>Curriculum</button>
          <button aria-label="Close" onClick={() => studyNav.clearBanner()}>
            ✕
          </button>
        </div>
      )}
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
          field && typeof field.parts !== "function" && field.parts && n === 0
            ? field.parts.find((p) => p.id === t.part)?.label
            : null;
        return (
          <div key={t.id} className="study-toast" style={{ borderColor: `${tier.color}66` }}>
            <span className="study-toast-icon">{milestone ? "🏆" : "✓"}</span>
            <span>
              <b>{field?.label ?? t.field}</b>
              {t.variant !== "Practice" ? ` · ${t.variant}` : ""}
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
