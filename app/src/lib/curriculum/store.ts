/**
 * The Syllabus Scheme: what has been studied, how many times, when and on
 * whose chart. Kept on the device (localStorage), shared live between tabs,
 * exportable and importable as JSON.
 */

import { useSyncExternalStore } from "react";
import { yearAnimal } from "@/lib/zodiac/futures";

export interface PartRecord {
  /** Full listens. */
  n: number;
  first: number;
  last: number;
  /** Charts it was studied on (most recent last, a few kept). */
  who?: string[];
}

export interface StudyEvent {
  t: number;
  f: string;
  v: string;
  p: string;
  who?: string;
  /** The unit's part count after this listen. */
  n: number;
}

export interface SyllabusScheme {
  v: 1;
  started: number;
  /** field → variant → part → record */
  units: Record<string, Record<string, Record<string, PartRecord>>>;
  log: StudyEvent[];
  /** Units starred for later ("field|variant"). */
  starred: string[];
  /** Listens a day the learner aims for. */
  dailyGoal: number;
}

export const STORAGE_KEY = "mc.curriculum.v1";
const LOG_CAP = 600;
const WHO_CAP = 6;

function empty(): SyllabusScheme {
  return { v: 1, started: Date.now(), units: {}, log: [], starred: [], dailyGoal: 10 };
}

function valid(x: unknown): x is SyllabusScheme {
  const s = x as SyllabusScheme;
  return !!s && s.v === 1 && typeof s.units === "object" && Array.isArray(s.log);
}

/**
 * Temporal Trajectory units used to be named by calendar year ("Rooster · 2026");
 * they are now named by the year's animal ("Rooster · Horse Year"), because the
 * forecast repeats every twelve years. Carry old progress across.
 */
function migrate(s: SyllabusScheme): SyllabusScheme {
  const fut = s.units["astro.future"];
  if (!fut || !Object.keys(fut).some((v) => / · \d{4}$/.test(v))) return s;
  const next: SyllabusScheme["units"][string] = {};
  const rename = (v: string) => {
    const m = /^(.*) · (\d{4})$/.exec(v);
    return m ? `${m[1]} · ${yearAnimal(Number(m[2]))} Year` : v;
  };
  for (const [v, parts] of Object.entries(fut)) {
    const nv = rename(v);
    const into = (next[nv] = next[nv] ?? {});
    for (const [p, r] of Object.entries(parts)) {
      const mine = into[p];
      into[p] = !mine
        ? r
        : { n: mine.n + r.n, first: Math.min(mine.first, r.first), last: Math.max(mine.last, r.last), ...(mine.who || r.who ? { who: [...new Set([...(mine.who ?? []), ...(r.who ?? [])])] } : {}) };
    }
  }
  return {
    ...s,
    units: { ...s.units, "astro.future": next },
    log: s.log.map((e) => (e.f === "astro.future" ? { ...e, v: rename(e.v) } : e)),
  };
}

function load(): SyllabusScheme {
  try {
    const raw = typeof localStorage !== "undefined" ? localStorage.getItem(STORAGE_KEY) : null;
    if (raw) {
      const parsed = JSON.parse(raw);
      if (valid(parsed)) return migrate({ ...empty(), ...parsed, starred: parsed.starred ?? [] });
    }
  } catch {
    /* fall through to a fresh scheme */
  }
  return empty();
}

let scheme: SyllabusScheme | null = null;
const listeners = new Set<(s: SyllabusScheme) => void>();

function current(): SyllabusScheme {
  if (!scheme) scheme = load();
  return scheme;
}

function commit(next: SyllabusScheme) {
  scheme = next;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    /* storage full or blocked: keep it in memory for this visit */
  }
  listeners.forEach((fn) => fn(next));
}

if (typeof window !== "undefined") {
  window.addEventListener("storage", (e) => {
    if (e.key !== STORAGE_KEY) return;
    scheme = load();
    listeners.forEach((fn) => fn(scheme!));
  });
}

export const syllabus = {
  get(): SyllabusScheme {
    return current();
  },

  subscribe(fn: (s: SyllabusScheme) => void): () => void {
    listeners.add(fn);
    return () => {
      listeners.delete(fn);
    };
  },

  /** Record one full listen of a passage. Returns the part's new count. */
  credit(field: string, variant: string, part: string, who?: string, at = Date.now()): number {
    const s = current();
    const byVariant = s.units[field] ?? {};
    const byPart = byVariant[variant] ?? {};
    const prev = byPart[part];
    const whoList = who ? [...(prev?.who ?? []).filter((w) => w !== who), who].slice(-WHO_CAP) : prev?.who;
    const rec: PartRecord = { n: (prev?.n ?? 0) + 1, first: prev?.first ?? at, last: at, ...(whoList ? { who: whoList } : {}) };
    const log = [...s.log, { t: at, f: field, v: variant, p: part, n: rec.n, ...(who ? { who } : {}) }].slice(-LOG_CAP);
    commit({
      ...s,
      units: { ...s.units, [field]: { ...byVariant, [variant]: { ...byPart, [part]: rec } } },
      log,
    });
    return rec.n;
  },

  toggleStar(key: string) {
    const s = current();
    const starred = s.starred.includes(key) ? s.starred.filter((k) => k !== key) : [...s.starred, key];
    commit({ ...s, starred });
  },

  setDailyGoal(n: number) {
    commit({ ...current(), dailyGoal: Math.max(1, Math.min(200, Math.round(n))) });
  },

  /** Clear everything, or only the given fields. */
  reset(fields?: string[]) {
    if (!fields) {
      commit(empty());
      return;
    }
    const s = current();
    const units = { ...s.units };
    const drop = new Set(fields);
    for (const f of fields) delete units[f];
    commit({ ...s, units, log: s.log.filter((e) => !drop.has(e.f)) });
  },

  export(): string {
    return JSON.stringify({ app: "Mystique Compass", kind: "syllabus-scheme", exported: new Date().toISOString(), scheme: current() }, null, 1);
  },

  /**
   * Load an exported scheme. "merge" keeps the higher count of each part and
   * joins the logs; "replace" swaps the whole scheme.
   */
  import(text: string, mode: "merge" | "replace" = "merge"): { units: number } {
    const parsed = JSON.parse(text);
    const incoming = valid(parsed?.scheme) ? parsed.scheme : parsed;
    if (!valid(incoming)) throw new Error("That file isn't a Curriculum Syllabus Scheme.");
    const migrated = migrate(incoming as SyllabusScheme);
    incoming.units = migrated.units;
    incoming.log = migrated.log;
    if (mode === "replace") {
      commit({ ...empty(), ...incoming });
      return { units: countUnits(incoming) };
    }
    const s = current();
    const units: SyllabusScheme["units"] = JSON.parse(JSON.stringify(s.units));
    for (const [f, vs] of Object.entries(incoming.units)) {
      for (const [v, ps] of Object.entries(vs)) {
        for (const [p, r] of Object.entries(ps)) {
          const mine = units[f]?.[v]?.[p];
          if (!mine || r.n > mine.n) {
            units[f] = units[f] ?? {};
            units[f][v] = units[f][v] ?? {};
            units[f][v][p] = { ...r, first: Math.min(r.first, mine?.first ?? r.first), last: Math.max(r.last, mine?.last ?? 0) };
          }
        }
      }
    }
    const seen = new Set(s.log.map((e) => `${e.t}|${e.f}|${e.v}|${e.p}`));
    const log = [...s.log, ...incoming.log.filter((e) => !seen.has(`${e.t}|${e.f}|${e.v}|${e.p}`))]
      .sort((a, b) => a.t - b.t)
      .slice(-LOG_CAP);
    commit({
      ...s,
      units,
      log,
      started: Math.min(s.started, incoming.started ?? s.started),
      starred: [...new Set([...s.starred, ...(incoming.starred ?? [])])],
    });
    return { units: countUnits(incoming) };
  },

  /** Tests only. */
  _reload() {
    scheme = null;
  },
};

function countUnits(s: SyllabusScheme): number {
  return Object.values(s.units).reduce((a, vs) => a + Object.keys(vs).length, 0);
}

/** React: the live Syllabus Scheme (re-renders on every study, in every tab). */
export function useSyllabus(): SyllabusScheme {
  return useSyncExternalStore(syllabus.subscribe, syllabus.get, syllabus.get);
}
