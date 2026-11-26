// @vitest-environment happy-dom
import { describe, it, expect, beforeEach } from "vitest";
import { syllabus } from "@/lib/curriculum/store";
import { TIERS, activity, isDue, nextTier, partCounts, reviewDue, tierOf, unitCount } from "@/lib/curriculum/progress";
import { FIELDS, FIELD_BY_ID, K, MODULES, partsOf, timingFieldForTitle } from "@/lib/curriculum/catalogue";
import { noteSpoken, resetTrackerProgress, onStudied } from "@/lib/curriculum/tracker";
import type { TtsSentence } from "@/lib/read-aloud/engine";

const DAY = 86_400_000;

beforeEach(() => {
  localStorage.clear();
  syllabus._reload();
  resetTrackerProgress();
});

describe("Syllabus Scheme store", () => {
  it("counts every full listen and remembers who it was studied on", () => {
    expect(syllabus.credit("astro.totem", "Rat", "main", "Stanley")).toBe(1);
    expect(syllabus.credit("astro.totem", "Rat", "main", "Joyce")).toBe(2);
    expect(syllabus.credit("astro.totem", "Rat", "main", "Stanley")).toBe(3);
    const rec = syllabus.get().units["astro.totem"].Rat.main;
    expect(rec.n).toBe(3);
    expect(rec.who).toEqual(["Joyce", "Stanley"]);
    expect(syllabus.get().log).toHaveLength(3);
  });

  it("persists to the device and survives a reload", () => {
    syllabus.credit("astro.totem", "Ox", "main");
    syllabus._reload();
    expect(unitCount(syllabus.get(), "astro.totem", "Ox")).toBe(1);
  });

  it("exports, and merges an import by keeping the higher count", () => {
    syllabus.credit("astro.totem", "Tiger", "main");
    syllabus.credit("astro.totem", "Tiger", "main");
    const backup = syllabus.export();
    syllabus.reset();
    expect(unitCount(syllabus.get(), "astro.totem", "Tiger")).toBe(0);
    syllabus.credit("astro.totem", "Tiger", "main");
    syllabus.credit("astro.totem", "Rabbit", "main");
    syllabus.import(backup, "merge");
    expect(unitCount(syllabus.get(), "astro.totem", "Tiger")).toBe(2);
    expect(unitCount(syllabus.get(), "astro.totem", "Rabbit")).toBe(1);
    expect(() => syllabus.import('{"nope":1}')).toThrow();
  });

  it("notifies subscribers", () => {
    let calls = 0;
    const off = syllabus.subscribe(() => calls++);
    syllabus.credit("astro.totem", "Dragon", "main");
    off();
    syllabus.credit("astro.totem", "Dragon", "main");
    expect(calls).toBe(1);
  });
});

describe("Mastery tiers and progress", () => {
  it("climbs the ladder at 1, 2, 3, 5, 7 and 12 listens", () => {
    expect(tierOf(0).id).toBe(TIERS[0].id);
    expect([1, 2, 3, 5, 7, 12].map((n) => tierOf(n).min)).toEqual([1, 2, 3, 5, 7, 12]);
    expect(tierOf(6).min).toBe(5);
    expect(tierOf(40).min).toBe(12);
    expect(nextTier(5)?.min).toBe(7);
    expect(nextTier(12)).toBeNull();
  });

  it("needs every required part, and ignores optional ones", () => {
    const arrow = FIELD_BY_ID.get("num.arrow")!;
    const variant = "Arrow of Determination";
    const parts = partsOf(arrow, variant).filter((p) => !p.optional);
    expect(parts.length).toBeGreaterThan(1);
    syllabus.credit(arrow.id, variant, parts[0].id);
    expect(unitCount(syllabus.get(), arrow.id, variant)).toBe(0);
    for (const p of parts) syllabus.credit(arrow.id, variant, p.id);
    expect(unitCount(syllabus.get(), arrow.id, variant)).toBe(1);
    expect(partCounts(syllabus.get(), arrow, variant)[0].n).toBe(2);

    const dive = FIELD_BY_ID.get("fate.dive")!;
    const v = K.personalYear(5);
    for (const p of partsOf(dive, v).filter((x) => !x.optional)) syllabus.credit(dive.id, v, p.id);
    expect(unitCount(syllabus.get(), dive.id, v)).toBe(1);
  });

  it("Lo Shu overloads add an optional overload passage", () => {
    const f = FIELD_BY_ID.get("num.loshu")!;
    expect(partsOf(f, K.loshu(5, 0)).map((p) => p.id)).toEqual(["meaning"]);
    expect(partsOf(f, K.loshu(5, 2)).map((p) => p.id)).toEqual(["meaning", "intensity"]);
    expect(partsOf(f, K.loshu(5, 3)).find((p) => p.id === "drowning")?.optional).toBe(true);
  });

  it("spaces reviews further apart as the count grows", () => {
    const now = Date.now();
    expect(reviewDue(0, 0)).toBeNull();
    expect(reviewDue(1, now)! - now).toBe(DAY);
    expect(reviewDue(3, now)! - now).toBe(7 * DAY);
    expect(isDue(1, now - 2 * DAY, now)).toBe(true);
    expect(isDue(3, now - 2 * DAY, now)).toBe(false);
  });

  it("tracks today's listens and the day streak", () => {
    const now = Date.now();
    syllabus.credit("astro.totem", "Rat", "main", undefined, now - 2 * DAY);
    syllabus.credit("astro.totem", "Rat", "main", undefined, now - DAY);
    syllabus.credit("astro.totem", "Ox", "main", undefined, now);
    const a = activity(syllabus.get(), now);
    expect(a.today).toBe(1);
    expect(a.streak).toBe(3);
    expect(a.totalListens).toBe(3);
  });
});

describe("Catalogue", () => {
  it("has unique field ids, valid modules and an anchor for every field", () => {
    const ids = FIELDS.map((f) => f.id);
    expect(new Set(ids).size).toBe(ids.length);
    const mods = new Set(MODULES.map((m) => m.id));
    for (const f of FIELDS) {
      expect(mods.has(f.module), f.id).toBe(true);
      expect(f.anchor, f.id).toBeTruthy();
      expect(f.where, f.id).toBeTruthy();
    }
  });

  it("maps every Timing Engine section title to a field", () => {
    const titles = ["Climacteric Year", "Temporal Headline", "Today's Intelligence", "3-Year Arc", "Probability Scores", "Life Domain Forecasts",
      "Monthly Rhythm · 2026", "Window of Opportunity", "Caution Flag", "Tension Signature", "Day Intelligence", "Lo Shu Grid Activation",
      "Missing Numbers Forecast", "Repeated Number Amplifier", "Karmic Debt Trigger", "Pinnacle Transition Radar", "Contradiction Engine",
      "Pinnacle & Challenge", "7-Year Overview"];
    const ids = titles.map(timingFieldForTitle);
    expect(ids.every((id) => id && FIELD_BY_ID.has(id))).toBe(true);
    expect(new Set(ids).size).toBe(titles.length);
  });
});

// ── Tracker ───────────────────────────────────────────────────────────────

/** Spoken-sentence events for every sentence in a tagged passage's text nodes. */
function sentencesOf(el: HTMLElement): TtsSentence[] {
  return Array.from(el.querySelectorAll("p")).map((p) => {
    const r = document.createRange();
    r.selectNodeContents(p.firstChild!);
    return { ranges: [r], blocks: [p], text: p.textContent!.trim(), speech: p.textContent!.trim() };
  });
}

function passage(attrs: Record<string, string>, lines: string[]) {
  const div = document.createElement("div");
  for (const [k, v] of Object.entries(attrs)) div.setAttribute(k, v);
  div.innerHTML = lines.map((l) => `<p>${l}</p>`).join("");
  document.body.appendChild(div);
  return div;
}

describe("Read-aloud tracker", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
  });
  const lines = Array.from({ length: 10 }, (_, i) => `Sentence number ${i + 1} of the passage.`);

  it("credits a passage only once it is heard to the end", () => {
    const el = passage({ "data-study-field": "astro.totem", "data-study-variant": "Rat" }, lines);
    const ss = sentencesOf(el);
    const events: unknown[] = [];
    const off = onStudied((e) => events.push(e));
    ss.slice(0, 9).forEach(noteSpoken);
    expect(unitCount(syllabus.get(), "astro.totem", "Rat")).toBe(0);
    noteSpoken(ss[9]);
    expect(unitCount(syllabus.get(), "astro.totem", "Rat")).toBe(1);
    expect(events).toHaveLength(1);
    // A second full listen counts again.
    ss.forEach(noteSpoken);
    expect(unitCount(syllabus.get(), "astro.totem", "Rat")).toBe(2);
    off();
  });

  it("doesn't count skipping straight to the end", () => {
    const el = passage({ "data-study-field": "astro.totem", "data-study-variant": "Ox" }, lines);
    const ss = sentencesOf(el);
    [ss[0], ss[8], ss[9]].forEach(noteSpoken);
    expect(unitCount(syllabus.get(), "astro.totem", "Ox")).toBe(0);
  });

  it("adds up separate listens inside one study block, even after it re-renders", () => {
    const attrs = { "data-study-field": "time.headline" };
    let el = passage(attrs, lines);
    sentencesOf(el).slice(0, 5).forEach(noteSpoken);
    el.remove();
    el = passage(attrs, lines); // the section closed and opened again
    sentencesOf(el).slice(5).forEach(noteSpoken);
    expect(unitCount(syllabus.get(), "time.headline", "Practice")).toBe(1);
  });

  it("credits nested passages to themselves, not to their container", () => {
    const outer = passage({ "data-study-field": "fate.oracle", "data-study-variant": "Practice" }, ["Outer one.", "Outer two."]);
    const inner = document.createElement("div");
    inner.setAttribute("data-study-field", "astro.totem");
    inner.setAttribute("data-study-variant", "Snake");
    inner.innerHTML = "<p>Inner only sentence.</p>";
    outer.appendChild(inner);
    sentencesOf(inner).forEach(noteSpoken);
    expect(unitCount(syllabus.get(), "astro.totem", "Snake")).toBe(1);
    expect(unitCount(syllabus.get(), "fate.oracle", "Practice")).toBe(0);
    Array.from(outer.querySelectorAll(":scope > p")).forEach((p) => {
      const r = document.createRange();
      r.selectNodeContents(p.firstChild!);
      noteSpoken({ ranges: [r], blocks: [p], text: p.textContent!, speech: p.textContent! });
    });
    expect(unitCount(syllabus.get(), "fate.oracle", "Practice")).toBe(1);
  });
});
