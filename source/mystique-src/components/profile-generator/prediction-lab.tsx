import * as React from "react";
import { Button } from "@/components/ui/button";
import { CALIBRATION, buildFixtureDossier, type FixtureDossier } from "@/lib/match-engine";

/**
 * THE PREDICTION LAB — "failure as an outlier", implemented.
 *
 * It does three things and refuses to do a fourth:
 *   1. computes the numerology-only model's probability for the chosen fixture
 *      (weights and metrics shipped in /data/calibration.json from the club study);
 *   2. tests that probability against the gate — a threshold chosen on a validation
 *      era, plus the replication/protocol requirements;
 *   3. if the gate is shut, it says SILENT, in plain words, and explains why;
 *   4. it never invents a call, a stake, or a scoreline.
 */

const CARD: React.CSSProperties = {
  border: "1px solid rgba(212,175,55,0.18)",
  background: "linear-gradient(135deg, rgba(16,8,42,0.96), rgba(38,16,68,0.72))",
  borderRadius: "1rem",
  padding: "0.9rem",
  marginBottom: "0.85rem",
};
const LABEL: React.CSSProperties = {
  fontFamily: "'Cinzel', serif", fontSize: "0.58rem", letterSpacing: "0.16em",
  textTransform: "uppercase", color: "#d4af37", fontWeight: 800,
};
const MUTED: React.CSSProperties = { fontSize: "0.72rem", color: "rgba(200,180,240,0.6)", lineHeight: 1.62 };
const MONO: React.CSSProperties = { fontVariantNumeric: "tabular-nums" };

interface Calibration {
  built: string;
  dataset: { matches: number; clubs: number; leagues: string[]; span: string };
  splits: { train: number; validation: number; test: number; splitVal: number; splitTest: number };
  baseRates: { train: number; validation: number; test: number };
  model: {
    kind: string; features: string; weights: number[]; intercept: number;
    metrics: {
      validation: { accuracy: number; auc: number; brier: number };
      test: { accuracy: number; auc: number; brier: number };
      calibration: { bucket: number; predicted: number | null; actual: number | null; n: number }[];
    };
  };
  skillModel: { test: { accuracy: number; auc: number; brier: number } };
  alwaysHome: { validation: number; test: number };
  nulls: {
    permutationDates: { iterations: number; mean: number; p95: number; max: number };
    placeboFoundingDates: { iterations: number; mean: number; p95: number; max: number };
    observedBestTrain: { id: string; z: number; beyondNulls: boolean };
  };
  abstention: { threshold: number; valCoverage: number; valAccuracy: number; testCoverage: number; testAccuracy: number; testN: number }[];
  gate: { chosenThreshold: number | null; noHonestGate?: boolean; qualifiedThresholds?: number;
          valAccuracyAtGate: number; testAccuracyAtGate: number; testCoverageAtGate: number };
  failure: {
    spokenCalls: number;
    rolling100: { min: number; p05: number; median: number; max: number; windows: number };
    worstLosingStreak: number;
    flatStake: { start: number; end: number; low: number; odds: number };
  };
  decadeStability: { decade: number; n: number; homeWin: number; lift: number; z: number }[];
  sweep: { topTrain: { id: string; n: number; homeWin: number; lift: number; z: number; valZ: number; testZ: number }[]; signatures: number };
}

let cache: Calibration | null = null;
let inflight: Promise<Calibration | null> | null = null;
function useCalibration() {
  const [data, setData] = React.useState<Calibration | null>(cache);
  const [loading, setLoading] = React.useState(!cache);
  React.useEffect(() => {
    if (cache) { setData(cache); setLoading(false); return; }
    if (!inflight) inflight = fetch("/data/calibration.json").then((r) => (r.ok ? r.json() : null)).catch(() => null);
    let alive = true;
    inflight.then((j) => { if (alive) { cache = j; setData(j); setLoading(false); } });
    return () => { alive = false; };
  }, []);
  return { data, loading };
}

/* ── the model, evaluated in the app with the shipped weights ─────────────── */
function featureVector(d: FixtureDossier, relIdx: (rel: "same" | "friend" | "neutral" | "enemy") => number) {
  const f = new Float64Array(56);
  const h = d.home, a = d.away;
  f[h.personalDay] = 1;
  f[9 + a.personalDay] = 1;
  f[18 + d.day.universalDay.reduced] = 1;
  f[27 + d.day.calendarDay.reduced] = 1;
  f[36 + relIdx(d.clash.homeDayVsFoundingDay)] = 1;
  f[40 + relIdx(d.clash.awayDayVsFoundingDay)] = 1;
  f[44 + relIdx(d.clash.homeDayVsName)] = 1;
  f[48 + relIdx(d.clash.awayDayVsName)] = 1;
  f[52] = ((h.age % 10) / 9);
  f[53] = ((a.age % 10) / 9);
  f[54] = h.personalYear / 9;
  f[55] = a.personalYear / 9;
  return f;
}
const REL_ORDER: Record<string, number> = { same: 0, friend: 1, neutral: 2, enemy: 3 };

export function PredictionLab({ dossier }: { dossier: FixtureDossier | null }) {
  const { data, loading } = useCalibration();
  const [open, setOpen] = React.useState(false);

  const probability = React.useMemo(() => {
    if (!dossier || !data?.model?.weights?.length) return null;
    const x = featureVector(dossier, (rel) => REL_ORDER[rel] ?? 2);
    let z = data.model.intercept;
    for (let j = 0; j < Math.min(56, data.model.weights.length); j++) z += data.model.weights[j] * x[j];
    return { p: 1 / (1 + Math.exp(-z)), x };
  }, [dossier, data]);

  const verdict = React.useMemo(() => {
    if (!probability || !data) return null;
    const confidence = Math.abs(probability.p - 0.5);
    // a null threshold means no validation-era threshold ever beat always-home while filtering:
    // the gate has no licence to speak, so nothing can open it
    const gateThreshold = data.gate?.chosenThreshold ?? Infinity;
    const passesProtocol = data.nulls?.observedBestTrain?.beyondNulls === true;
    const speaks = passesProtocol && confidence > gateThreshold;
    return { confidence, gateThreshold, passesProtocol, speaks, side: probability.p >= 0.5 ? "home" : "away" };
  }, [probability, data]);

  const pct = (x: number | null | undefined, d = 1) => (x == null ? "—" : `${(x * 100).toFixed(d)}%`);

  return (
    <div style={{ ...CARD, borderColor: verdict?.speaks ? "rgba(134,239,172,0.4)" : "rgba(252,165,165,0.35)" }}>
      <button onClick={() => setOpen((o) => !o)} style={{ width: "100%", background: "none", border: "none", textAlign: "left", cursor: "pointer", padding: 0 }}>
        <div style={{ ...LABEL }}>{open ? "▾" : "▸"} 🧪 Prediction Lab — the gate, and the evidence behind it</div>
      </button>

      {/* the decision, always visible */}
      <div style={{ marginTop: "0.6rem", padding: "0.6rem 0.7rem", borderRadius: 12, background: verdict?.speaks ? "rgba(134,239,172,0.08)" : "rgba(252,165,165,0.08)", border: `1px solid ${verdict?.speaks ? "rgba(134,239,172,0.3)" : "rgba(252,165,165,0.3)"}` }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: "0.6rem", flexWrap: "wrap" }}>
          <span style={{ fontFamily: "'Cinzel', serif", fontSize: "0.72rem", fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase", color: verdict?.speaks ? "#86efac" : "#fca5a5" }}>
            {loading ? "Reading the evidence…" : verdict?.speaks ? `Call: ${verdict.side === "home" ? "home lean" : "away lean"}` : "Gate closed — SILENT"}
          </span>
          {probability && <span style={{ ...MUTE_TEXT, ...MONO, color: "rgba(240,234,255,0.85)" }}>model p(home) = {(probability.p * 100).toFixed(1)}%</span>}
        </div>
        <div style={{ ...MUTED, marginTop: "0.3rem", color: "rgba(255,220,220,0.8)" }}>
          {verdict?.speaks
            ? "A validated signal is present for this fixture."
            : "The app has measured a numerology-only edge of zero on 74,200 matches, so it will not call this fixture. What follows is exactly why — the whole working, not a summary."}
        </div>
        {probability && verdict && !verdict.speaks && (
          <div style={{ ...MUTED, marginTop: "0.25rem" }}>
            this fixture's confidence {pct(verdict.confidence)} vs the gate's validated threshold {pct(verdict.gateThreshold)} · null test {verdict.passesProtocol ? "passed" : "failed (observed best z sits inside the null range)"}.
          </div>
        )}
      </div>

      {open && (
        <div style={{ marginTop: "0.7rem" }}>
          {!data && !loading && (
            <div style={{ ...MUTED }}>No calibration file is bundled with this build — the gate therefore stays closed by default.</div>
          )}

          {data && (
            <>
              <div style={{ ...LABEL, marginBottom: "0.3rem" }}>The evidence base</div>
              <div style={{ ...MUTED, marginBottom: "0.6rem" }}>
                {data.dataset.matches.toLocaleString()} real club matches · {data.dataset.clubs} clubs · {data.dataset.leagues.length} countries · {data.dataset.span}.
                Splits: train {data.splits.train.toLocaleString()} (before {data.splits.splitVal}) · validation {data.splits.validation.toLocaleString()} · test {data.splits.test.toLocaleString()} (from {data.splits.splitTest}).
                Base home-win rate: train {pct(data.baseRates.train)} · validation {pct(data.baseRates.validation)} · test {pct(data.baseRates.test)}.
              </div>

              <div style={{ ...LABEL, marginBottom: "0.3rem" }}>Are the real findings beyond chance?</div>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.68rem", ...MONO, marginBottom: "0.6rem" }}>
                <tbody>
                  <tr><td style={CELL_L}>observed best signature on train ({data.nulls.observedBestTrain.id})</td><td style={{ ...CELL_R, color: "#f1d98a" }}>z {data.nulls.observedBestTrain.z}</td></tr>
                  <tr><td style={CELL_L}>best z from shuffling match dates ({data.nulls.permutationDates.iterations} shuffles)</td><td style={CELL_R}>mean {data.nulls.permutationDates.mean} · 95th {data.nulls.permutationDates.p95} · max {data.nulls.permutationDates.max}</td></tr>
                  <tr><td style={CELL_L}>best z from random founding dates ({data.nulls.placeboFoundingDates.iterations} placebos)</td><td style={CELL_R}>mean {data.nulls.placeboFoundingDates.mean} · 95th {data.nulls.placeboFoundingDates.p95} · max {data.nulls.placeboFoundingDates.max}</td></tr>
                  <tr><td style={CELL_L}>verdict</td><td style={{ ...CELL_R, color: data.nulls.observedBestTrain.beyondNulls ? "#86efac" : "#fca5a5" }}>{data.nulls.observedBestTrain.beyondNulls ? "beyond both nulls" : "inside the null range — indistinguishable from chance"}</td></tr>
                </tbody>
              </table>

              <div style={{ ...LABEL, marginBottom: "0.3rem" }}>Model comparison (test era)</div>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.68rem", ...MONO, marginBottom: "0.6rem" }}>
                <thead><tr style={{ color: "rgba(200,180,240,0.55)", textAlign: "left" }}><th style={CELL_L}>model</th><th style={CELL_R}>accuracy</th><th style={CELL_R}>AUC</th><th style={CELL_R}>Brier</th></tr></thead>
                <tbody>
                  <tr><td style={CELL_L}>numerology only ({data.model.kind})</td><td style={CELL_R}>{pct(data.model.metrics.test.accuracy)}</td><td style={CELL_R}>{data.model.metrics.test.auc.toFixed(3)}</td><td style={CELL_R}>{data.model.metrics.test.brier.toFixed(4)}</td></tr>
                  <tr><td style={CELL_L}>numerology + prior form (control)</td><td style={CELL_R}>{pct(data.skillModel.test.accuracy)}</td><td style={CELL_R}>{data.skillModel.test.auc.toFixed(3)}</td><td style={CELL_R}>{data.skillModel.test.brier.toFixed(4)}</td></tr>
                  <tr><td style={CELL_L}>always predict a home win</td><td style={{ ...CELL_R, color: "#f1d98a" }}>{pct(data.alwaysHome.test)}</td><td style={CELL_R}>—</td><td style={CELL_R}>—</td></tr>
                </tbody>
              </table>

              <div style={{ ...LABEL, marginBottom: "0.3rem" }}>Calibration (does the model's confidence mean anything?)</div>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.68rem", ...MONO, marginBottom: "0.6rem" }}>
                <thead><tr style={{ color: "rgba(200,180,240,0.55)", textAlign: "left" }}><th style={CELL_L}>confidence bucket</th><th style={CELL_R}>predicted</th><th style={CELL_R}>actual</th><th style={CELL_R}>n</th></tr></thead>
                <tbody>
                  {data.model.metrics.calibration.filter((c) => c.n > 50).map((c) => (
                    <tr key={c.bucket}>
                      <td style={CELL_L}>{c.bucket}%+</td>
                      <td style={CELL_R}>{pct(c.predicted)}</td>
                      <td style={CELL_R}>{pct(c.actual)}</td>
                      <td style={CELL_R}>{c.n.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div style={{ ...LABEL, marginBottom: "0.3rem" }}>Abstention curve (thresholds chosen on validation, measured on test)</div>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.68rem", ...MONO, marginBottom: "0.6rem" }}>
                <thead><tr style={{ color: "rgba(200,180,240,0.55)", textAlign: "left" }}><th style={CELL_L}>speak when |p−0.5| &gt;</th><th style={CELL_R}>coverage</th><th style={CELL_R}>test accuracy</th><th style={CELL_R}>n</th></tr></thead>
                <tbody>
                  {data.abstention.map((a) => (
                    <tr key={a.threshold}>
                      <td style={CELL_L}>{a.threshold.toFixed(2)}</td>
                      <td style={CELL_R}>{pct(a.testCoverage)}</td>
                      <td style={{ ...CELL_R, color: a.testAccuracy > data.alwaysHome.test ? "#86efac" : "#fca5a5" }}>{pct(a.testAccuracy)}</td>
                      <td style={CELL_R}>{a.testN}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div style={{ ...MUTED, marginBottom: "0.6rem" }}>
                Speaking more confidently never beats simply predicting a home win — accuracy falls as confidence rises. That is why the gate is shut rather than tuned.
              </div>

              <div style={{ ...LABEL, marginBottom: "0.3rem" }}>Failure as an outlier — the measured answer</div>
              {data.gate?.chosenThreshold == null && (
                <div style={{ ...MUTED, marginBottom: "0.4rem", color: "#fca5a5" }}>
                  Gate threshold: <b>none qualified</b> — {data.gate?.qualifiedThresholds ?? 0} of the tested thresholds
                  beat always-home on the validation era while still filtering, so the honest threshold is “never speak”.
                </div>
              )}
              <div style={{ ...MUTED, marginBottom: "0.6rem" }}>
                Spoken calls at the gate's own threshold on the test era: <b style={{ color: "#fca5a5" }}>{data.failure.spokenCalls}</b>.
                With no validated edge there is no honest way to manufacture a call, so no failure rate, streak or drawdown can be reported — and inventing one would be the exact dishonesty this lab exists to prevent.
                The rolling-window, streak and flat-stake machinery is built and runs on any future dataset the moment a signature passes.
              </div>

              <div style={{ ...LABEL, marginBottom: "0.3rem" }}>Stability of the strongest signature across decades</div>
              <div style={{ display: "flex", gap: "0.3rem", flexWrap: "wrap", marginBottom: "0.6rem" }}>
                {data.decadeStability.map((d) => (
                  <div key={d.decade} style={{ padding: "0.28rem 0.42rem", borderRadius: 9, background: "rgba(255,255,255,0.04)", border: `1px solid ${Math.abs(d.z) >= 2 ? "rgba(212,175,55,0.4)" : "rgba(255,255,255,0.07)"}`, fontSize: "0.62rem", ...MONO }}>
                    <span style={{ color: "rgba(200,180,240,0.6)" }}>{d.decade}s </span>
                    <span style={{ color: d.lift >= 0 ? "#86efac" : "#fca5a5" }}>{d.lift >= 0 ? "+" : ""}{(d.lift * 100).toFixed(1)}pp</span>
                    <span style={{ color: "rgba(200,180,240,0.45)" }}> z{d.z.toFixed(1)} n{d.n}</span>
                  </div>
                ))}
              </div>
              <div style={{ ...MUTED, marginBottom: "0.6rem" }}>
                A real law would hold its sign decade after decade. This one flips (+2.6 in the 1920s, −0.9 in the 1940s, +3.3 in the 1990s, −0.4 in the 2000s), which is what noise looks like when it is allowed to be honest.
              </div>
            </>
          )}

          <div style={{ ...LABEL, marginBottom: "0.3rem" }}>The two studies, in the app's own words</div>
          {CALIBRATION.studies.map((s) => (
            <div key={s.name} style={{ marginBottom: "0.6rem" }}>
              <div style={{ fontSize: "0.72rem", color: "#f1d98a", fontWeight: 700 }}>{s.name} — {s.matches.toLocaleString()} matches</div>
              <div style={{ ...MUTED }}>{s.span}. {s.headline}</div>
              <ul style={{ margin: "0.3rem 0 0 1rem", padding: 0 }}>
                {s.detail.map((d, i) => <li key={i} style={{ ...MUTED, marginBottom: "0.22rem" }}>{d}</li>)}
              </ul>
            </div>
          ))}

          <div style={{ ...LABEL, marginBottom: "0.3rem" }}>The gate's rule</div>
          <div style={{ ...MUTED, marginBottom: "0.3rem" }}>{CALIBRATION.gate.rule}</div>
          <div style={{ ...MUTED, marginBottom: "0.3rem" }}><b style={{ color: "#fca5a5" }}>Status: {CALIBRATION.gate.status}.</b> {CALIBRATION.gate.reason}</div>
          <div style={{ ...MUTED, marginBottom: "0.6rem" }}>Power rule: {CALIBRATION.gate.powerRule}</div>

          <div style={{ ...CARD, borderColor: "rgba(147,197,253,0.3)", background: "linear-gradient(135deg, rgba(12,20,44,0.96), rgba(22,32,64,0.7))", marginBottom: 0 }}>
            <div style={{ ...LABEL, color: "#93c5fd" }}>ℹ Correction published with this build</div>
            <div style={{ ...MUTED, marginTop: "0.3rem", color: "rgba(220,235,255,0.85)" }}>{CALIBRATION.correction.note}</div>
          </div>
        </div>
      )}
    </div>
  );
}

const CELL_L: React.CSSProperties = { padding: "0.22rem 0.3rem", color: "rgba(200,180,240,0.7)" };
const CELL_R: React.CSSProperties = { padding: "0.22rem 0.3rem", textAlign: "right" };
const MUTE_TEXT: React.CSSProperties = { fontSize: "0.68rem" };
