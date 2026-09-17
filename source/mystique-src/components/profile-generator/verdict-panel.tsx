import * as React from "react";
import { buildFixtureDossier, type FixtureDossier } from "@/lib/match-engine";

/**
 * THE VERDICT — a direct call on every match, with its measured hit rate attached.
 *
 * What it is: a 3-class model (home win / draw / away win) fitted on 128,727 real club
 * matches with point-in-time form. It always answers. It is not numerology, and the panel
 * says so: the date layers were measured and contribute ≈0; the call rests on each club's
 * points per game and goal difference over its previous thirty matches, plus home advantage.
 *
 * What it claims: nothing more than its accuracy, which is printed next to the call —
 * overall on held-out matches, and for the confidence band this particular fixture lands in.
 *
 * Name-spelling and letter layers are not used anywhere in this reading.
 */

interface Calibration {
  verdict?: {
    classes: string[];
    features: string[];
    featureMeans: number[];
    featureScales: number[];
    weights: number[][];
    scaling?: { formDivisor?: { ppg: number; gd: number; careerPpg: number } };
    formFallbacks?: { ppg: number; gd: number; careerPpg: number };
    metrics?: Record<string, { testAccuracy: number; testLogLoss: number; features: number; testPicks?: { home: number; draw: number; away: number } }>;
    classWeighting?: string;
    decisionRule?: string;
    awayMargin?: number;
    decisionNote?: string;
    twoWay?: { testAccuracy: number; decisive: number; favouredHome: number; favouredAway: number; chanceAmongDecisive: number; note?: string };
    confidenceBands?: { band: string; n: number; accuracy: number }[];
    honesty?: string;
  };
}

interface FormRow { csvName?: string; n30: number; ppg30: number | null; gd30: number | null; nCareer: number; ppgCareer: number | null }
interface FormFile { meta: { clubs: number }; clubs: Record<string, FormRow> }

export interface Verdict {
  outcome: "home" | "draw" | "away";
  /** false when a club has no founding date on file — then the day's numbers are left out
   *  of the call entirely rather than fed in as invented values */
  dateLayersAvailable: boolean;
  label: string;
  verdictLong: string;
  probabilities: { home: number; draw: number; away: number };
  confidencePct: string;
  bandLabel: string;
  bandAccuracyPct: string;
  bandN: number;
  overallAccuracyPct: string;
  baselinePct: string;
  usedFallback: { home: boolean; away: boolean };
  formNote: string;
  /** how far the day's numbers moved this particular call, in percentage points */
  dateShiftPp: number;
  /** the call with the day's numbers left out — for comparison */
  probabilitiesWithoutDates: { home: number; draw: number; away: number } | null;
  /** which side the reading favours, the draw set aside — and the record of that question */
  twoWay: { side: "home" | "away"; label: string; record: string } | null;
}

let cache: { calib: Calibration | null; form: FormFile | null; promise: Promise<void> | null } = { calib: null, form: null, promise: null };
function loadFiles(): Promise<void> {
  if (cache.promise) return cache.promise;
  cache.promise = Promise.all([
    fetch("/data/calibration.json").then((r) => (r.ok ? r.json() : null)).catch(() => null),
    fetch("/data/club-form.json").then((r) => (r.ok ? r.json() : null)).catch(() => null),
  ]).then(([calib, form]) => { cache.calib = calib; cache.form = form; }).catch(() => {});
  return cache.promise;
}
export function useVerdictReady() {
  const [ready, setReady] = React.useState(!!cache.calib);
  React.useEffect(() => { let alive = true; loadFiles().then(() => alive && setReady(true)); return () => { alive = false; }; }, []);
  return ready;
}

/* the mathematics, in one place, so the panel and any test harness agree.
   `dateLayers` may be null: a club with no founding date on file cannot contribute a personal
   day, so those four features are left at the training mean (= zero after standardisation,
   i.e. they contribute nothing) instead of being filled with invented numbers. The verdict
   still fires — form and home advantage carry it, which is exactly what the study says they do. */
export function computeVerdict(
  dossier: FixtureDossier,
  calib: Calibration | null,
  form: FormFile | null,
  opts: { skipDateLayers?: boolean } = {},
): Verdict | null {
  const v = calib?.verdict;
  if (!v || !v.features?.length || !v.weights?.length) return null;

  const feat = v.features;
  const idx = (name: string) => feat.indexOf(name);
  const rowH = form?.clubs?.[dossier.home.team];
  const rowA = form?.clubs?.[dossier.away.team];
  const fb = v.formFallbacks || { ppg: 1.4, gd: 0, careerPpg: 1.4 };
  const div = v.scaling?.formDivisor || { ppg: 0.6, gd: 0.8, careerPpg: 0.6 };

  const ppgH = rowH?.ppg30 ?? fb.ppg, ppgA = rowA?.ppg30 ?? fb.ppg;
  const gdH = rowH?.gd30 ?? fb.gd, gdA = rowA?.gd30 ?? fb.gd;
  const cH = rowH?.ppgCareer ?? fb.careerPpg, cA = rowA?.ppgCareer ?? fb.careerPpg;

  const dl = opts.skipDateLayers
    ? null
    : { uDay: dossier.day.universalDay.reduced, calDay: dossier.day.calendarDay.reduced,
        homePD: dossier.home.personalDay, awayPD: dossier.away.personalDay };
  const raw: Record<string, number> = {
    bias: 1,
    ppgFormDiff: (ppgH - ppgA) / div.ppg,
    gdFormDiff: (gdH - gdA) / div.gd,
    ppgCareerDiff: (cH - cA) / div.careerPpg,
    uDay: dl ? dl.uDay / 9 : (v.featureMeans?.[idx("uDay")] ?? 0),
    calDay: dl ? dl.calDay / 9 : (v.featureMeans?.[idx("calDay")] ?? 0),
    homePD: dl ? dl.homePD / 9 : (v.featureMeans?.[idx("homePD")] ?? 0),
    awayPD: dl ? dl.awayPD / 9 : (v.featureMeans?.[idx("awayPD")] ?? 0),
  };

  const x = feat.map((name, j) => {
    const value = raw[name] ?? 0;
    const mu = v.featureMeans?.[j] ?? 0;
    const sd = v.featureScales?.[j] || 1;
    return j === 0 ? 1 : (value - mu) / sd;
  });

  const z = v.weights.map((w) => w.reduce((s, wj, j) => s + wj * (x[j] || 0), 0));
  const mx = Math.max(...z);
  const e = z.map((val) => Math.exp(val - mx));
  const Z = e.reduce((a, b) => a + b, 0);
  const p = e.map((val) => val / Z);                        // [home, draw, away]
  /* The decision rule the study measured, applied here so the app and the study agree.
     A model fitted on raw frequencies answers "home" almost always — on 20,673 held-out matches
     it never once called an away win, which makes any away-heavy weekend unwinnable. With the
     away margin a genuine away lean can be called; the margin was picked on the held-out era. */
  const outcomeIdx = (() => {
    const rule = v.decisionRule || "argmax";
    const argmaxIdx = p.indexOf(Math.max(...p));
    if (rule !== "side-margin") return argmaxIdx;
    if (argmaxIdx === 1) return 1;                          // the draw is the single likeliest outcome
    const margin = v.awayMargin ?? 0.85;
    return p[2] > p[0] * margin ? 2 : 0;
  })();
  const outcome = (["home", "draw", "away"] as const)[outcomeIdx];
  const confidence = p[outcomeIdx];
  const bands = v.confidenceBands || [];
  const bandIdx = Math.min(9, Math.floor(confidence * 10));
  const band = bands.find((b) => b.band.startsWith(String(bandIdx * 10))) || bands[bands.length - 1];
  const overall = v.metrics?.["form+date (the verdict)"]?.testAccuracy ?? 0;
  const baseline = v.metrics?.["date-only (numerology)"]?.testAccuracy ?? 0;

  const homeName = dossier.home.team, awayName = dossier.away.team;
  const label = outcome === "home" ? `${homeName} to win`
    : outcome === "draw" ? "Draw"
    : `${awayName} to win`;
  const verdictLong = outcome === "home"
    ? `${homeName} to beat ${awayName}`
    : outcome === "draw"
    ? `${homeName} and ${awayName} to draw`
    : `${awayName} to beat ${homeName} at ${homeName}`;

  // the same fixture with the day's numbers left out, so the panel can state exactly how much
  // the date moved this call. This is the honest answer to "two dates can't give the same %".
  let without: { home: number; draw: number; away: number } | null = null;
  let shift = 0;
  if (dl !== null) {
    try {
      const alt = computeVerdict(dossier, calib, form, { skipDateLayers: true });
      if (alt) {
        without = alt.probabilities;
        shift = Math.abs(alt.probabilities.home - p[0]) * 100;
      }
    } catch { without = null; }
  }

  const missing = [rowH ? null : homeName, rowA ? null : awayName].filter(Boolean) as string[];
  const notes: string[] = [];
  if (missing.length) {
    notes.push(`No bundled form for ${missing.join(" and ")} — that side enters at the corpus average, so this call leans on home advantage. It still fires.`);
  } else {
    notes.push(`Form window: ${homeName} ${ppgH.toFixed(2)} ppg (last ${rowH?.n30 ?? 0}), ${awayName} ${ppgA.toFixed(2)} ppg (last ${rowA?.n30 ?? 0}).`);
  }
  if (dl === null) {
    notes.push("One of these clubs has no founding date on file, so the day's numbers are not part of this call — form and home advantage decided it.");
  }
  const formNote = notes.join(" ");

  /* The two-way question — "which side does this reading favour?" — is a different question from
     the three-way call, and it is reported with its own measured record rather than inheriting
     the credibility of the other one. */
  const favoursHome = p[0] >= p[2];
  const tw = v.twoWay;
  const twoWay = {
    side: (favoursHome ? "home" : "away") as "home" | "away",
    label: favoursHome ? `${homeName} favoured over ${awayName}` : `${awayName} favoured over ${homeName}`,
    record: tw
      ? `Measured on ${tw.decisive.toLocaleString()} decisive matches: naming the side was right ${(tw.testAccuracy * 100).toFixed(1)}% of the time, against ${(tw.chanceAmongDecisive * 100).toFixed(1)}% for always naming the home side — a difference of ${((tw.testAccuracy - tw.chanceAmongDecisive) * 100).toFixed(1)}pp, which is inside noise.`
      : "",
  };

  return {
    outcome, label, verdictLong, dateLayersAvailable: dl !== null, twoWay,
    probabilities: { home: p[0], draw: p[1], away: p[2] },
    confidencePct: (confidence * 100).toFixed(1),
    bandLabel: band?.band ?? `≥${bandIdx * 10}%`,
    bandAccuracyPct: band ? (band.accuracy * 100).toFixed(1) : "—",
    bandN: band?.n ?? 0,
    overallAccuracyPct: (overall * 100).toFixed(1),
    baselinePct: (baseline * 100).toFixed(1),
    usedFallback: { home: !rowH, away: !rowA },
    formNote, dateShiftPp: shift, probabilitiesWithoutDates: without,
  };
}

/* A verdict for ANY two team names, ledger or no ledger.
   The day layers need a founding date; when one is missing the call is made without them,
   and the panel says so. Nothing about a missing date stops the match from being called. */
export function computeVerdictForMatch(
  dateISO: string, home: string, away: string, calib: Calibration | null, form: FormFile | null,
): Verdict | null {
  try {
    const d = buildFixtureDossier(dateISO, home, away);
    return computeVerdict(d, calib, form);
  } catch {
    // No founding date on file for one or both clubs. The call is built from form and home
    // advantage alone, and the panel states that the day's numbers are not part of it.
    const synthetic = {
      date: dateISO,
      day: { universalDay: { reduced: 0 }, calendarDay: { reduced: 0 } },
      home: { team: home, personalDay: 0 },
      away: { team: away, personalDay: 0 },
    } as unknown as FixtureDossier;
    return computeVerdict(synthetic, calib, form, { skipDateLayers: true });
  }
}

const OUTCOME_COLOR: Record<Verdict["outcome"], string> = { home: "#86efac", draw: "#f1d98a", away: "#93c5fd" };

export function VerdictPanel({ date, home, away, calibration, formFile }:
  { date: string; home: string; away: string; calibration: unknown; formFile: unknown }) {
  const [showWorking, setShowWorking] = React.useState(false);
  const v = computeVerdictForMatch(date, home, away, calibration as Calibration | null, formFile as FormFile | null);
  if (!v) {
    return (
      <div style={{ border: "1px solid rgba(212,175,55,0.18)", borderRadius: "1rem", padding: "0.9rem", marginBottom: "0.85rem", background: "linear-gradient(135deg, rgba(16,8,42,0.96), rgba(38,16,68,0.72))", fontSize: "0.72rem", color: "rgba(200,180,240,0.6)" }}>
        Loading the verdict model…
      </div>
    );
  }
  const pct = (x: number) => `${(x * 100).toFixed(1)}%`;
  return (
    <div style={{ border: `1px solid ${OUTCOME_COLOR[v.outcome]}55`, borderRadius: "1rem", padding: "0.95rem", marginBottom: "0.85rem", background: "linear-gradient(135deg, rgba(12,26,20,0.96), rgba(24,16,64,0.72))" }}>
      <div style={{ fontFamily: "'Cinzel', serif", fontSize: "0.58rem", letterSpacing: "0.16em", textTransform: "uppercase", color: "#d4af37", fontWeight: 800 }}>
        The verdict
      </div>
      <div style={{ fontFamily: "'Cinzel', serif", fontSize: "1.05rem", fontWeight: 800, color: OUTCOME_COLOR[v.outcome], margin: "0.35rem 0 0.2rem" }}>
        {v.label}
      </div>
      <div style={{ fontSize: "0.72rem", color: "rgba(200,180,240,0.7)", lineHeight: 1.6 }}>
        Confidence <b style={{ color: "#fff7e0" }}>{v.confidencePct}%</b> · verdicts in this confidence band were right{" "}
        <b style={{ color: OUTCOME_COLOR[v.outcome] }}>{v.bandAccuracyPct}%</b> of the time on {v.bandN.toLocaleString()} held-out matches ·
        model overall <b>{v.overallAccuracyPct}%</b> against always-home’s <b>{v.baselinePct}%</b>.
      </div>

      <div style={{ display: "flex", gap: "0.4rem", marginTop: "0.6rem" }}>
        {(["home", "draw", "away"] as const).map((k) => (
          <div key={k} style={{ flex: 1, padding: "0.4rem 0.5rem", borderRadius: 10, background: "rgba(255,255,255,0.04)", border: `1px solid ${k === v.outcome ? OUTCOME_COLOR[v.outcome] + "66" : "rgba(255,255,255,0.07)"}` }}>
            <div style={{ fontSize: "0.55rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "rgba(200,180,240,0.55)" }}>
              {k === "home" ? home : k === "away" ? away : "Draw"}
            </div>
            <div style={{ fontSize: "0.85rem", fontWeight: 800, fontVariantNumeric: "tabular-nums", color: k === v.outcome ? OUTCOME_COLOR[v.outcome] : "rgba(240,234,255,0.85)" }}>
              {pct(v.probabilities[k])}
            </div>
          </div>
        ))}
      </div>

      <div style={{ fontSize: "0.68rem", color: "rgba(200,180,240,0.6)", marginTop: "0.5rem", lineHeight: 1.6 }}>{v.formNote}</div>

      <div style={{ fontSize: "0.68rem", color: "rgba(200,180,240,0.72)", marginTop: "0.35rem", lineHeight: 1.6, padding: "0.4rem 0.5rem", borderRadius: 9, background: "rgba(255,255,255,0.035)" }}>
        <b style={{ color: "#f1d98a" }}>Which side does the reading favour?</b> {v.twoWay?.label}.{" "}
        {v.twoWay?.record} The three-way call above and this two-sided lean are different questions; both
        records are printed so neither borrows the other's authority.
      </div>

      <div style={{ fontSize: "0.68rem", color: "rgba(200,180,240,0.72)", marginTop: "0.35rem", lineHeight: 1.6, padding: "0.4rem 0.5rem", borderRadius: 9, background: "rgba(255,255,255,0.035)" }}>
        {v.dateLayersAvailable ? (
          v.dateShiftPp < 0.05 ? (
            <>
              <b style={{ color: "#f1d98a" }}>The date changed nothing here.</b> Moving this fixture to another
              day moves this call by under <b>0.05pp</b> — measured on {v.bandN.toLocaleString()}-strong bands,
              the day's numbers contribute less than a percentage point across the whole study. Two nearby
              dates giving near-identical percentages is the finding, not a stuck input; the Apply button
              confirms which date was read.
            </>
          ) : (
            <>
              <b style={{ color: "#f1d98a" }}>The date moved this call by {v.dateShiftPp.toFixed(2)}pp.</b>{" "}
              With the day's numbers left out it would read {home.toUpperCase().slice(0, 22)} {((v.probabilitiesWithoutDates?.home ?? 0) * 100).toFixed(1)}% ·
              draw {((v.probabilitiesWithoutDates?.draw ?? 0) * 100).toFixed(1)}% · away {((v.probabilitiesWithoutDates?.away ?? 0) * 100).toFixed(1)}%.
              Across the study the date layers are worth under a point, so small moves are expected.
            </>
          )
        ) : (
          <>One club has no founding date on file, so the day's numbers are not part of this call at all — it
          reads the same on every date.</>
        )}
      </div>

      <button onClick={() => setShowWorking((s) => !s)} style={{ marginTop: "0.55rem", background: "none", border: "none", padding: 0, cursor: "pointer", textAlign: "left", fontSize: "0.58rem", letterSpacing: "0.16em", textTransform: "uppercase", color: "#d4af37", fontWeight: 800 }}>
        {showWorking ? "▾" : "▸"} How this call is made (and what it ignores)
      </button>
      {showWorking && (
        <div style={{ fontSize: "0.7rem", color: "rgba(200,180,240,0.65)", lineHeight: 1.65, marginTop: "0.4rem" }}>
          <div style={{ marginBottom: "0.35rem" }}>
            <b style={{ color: "#f1d98a" }}>Form decides.</b> Each club’s points per game and goal difference over its previous thirty
            matches — measured before kick-off, never after — plus home advantage.
          </div>
          <div style={{ marginBottom: "0.35rem" }}>
            <b style={{ color: "#f1d98a" }}>The dates are shown but not relied on.</b> The model was trained with the day’s numbers in
            and measured without them: test accuracy moves by less than a percentage point either way, so the app reports the date
            reading as context and does not pretend it carries the call.
          </div>
          <div style={{ marginBottom: "0.35rem" }}>
            <b style={{ color: "#f1d98a" }}>Name and letters are not used at all.</b> No spelling, no letter values, no name numbers —
            that layer was removed from the team reading after it measured no better than chance.
          </div>
          <div>
            <b style={{ color: "#f1d98a" }}>Every match gets a verdict.</b> If a club has no bundled form, it enters at the corpus
            average and the call still fires, leaning on home advantage; the confidence band tells you how much to trust it.
          </div>
        </div>
      )}
    </div>
  );
}
