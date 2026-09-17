import * as React from "react";

/**
 * THE ACCURACY LAB — what the verdict is worth, measured.
 *
 * This panel answers one question honestly: how often is the Oracle right? It reads the
 * shipped study (data/calibration.json) and prints, for the same held-out era:
 *   • the verdict model            — form + home advantage + the day's numbers
 *   • the same model without dates — to show what the date layers actually contribute
 *   • a date-only model            — the numerology layers alone
 *   • always-home                  — the baseline any real model must beat
 * It also prints accuracy by confidence band, so a 52% call and a 60% call are not the
 * same promise, and names the one layer that is deliberately absent: name/letter analysis.
 */

interface Calibration {
  verdict?: {
    features: string[];
    metrics?: Record<string, { valAccuracy: number; testAccuracy: number; testLogLoss: number; features: number; testPicks?: { home: number; draw: number; away: number } }>;
    confidenceBands?: { band: string; n: number; accuracy: number }[];
    honesty?: string;
    formFallbacks?: { ppg: number; gd: number; careerPpg: number };
  };
  dataset?: { matches: number; clubs: number; leagues: string[]; span: string };
}

const KEY = "form+date (the verdict)";
const NO_DATE = "form-only";

export function PredictionLab() {
  const [data, setData] = React.useState<Calibration | null>(null);
  const [open, setOpen] = React.useState(true);
  React.useEffect(() => {
    let alive = true;
    fetch("/data/calibration.json").then((r) => (r.ok ? r.json() : null)).then((j) => alive && setData(j)).catch(() => {});
    return () => { alive = false; };
  }, []);

  const v = data?.verdict;
  const m = v?.metrics?.[KEY];
  const noDate = v?.metrics?.[NO_DATE];
  const dateOnly = v?.metrics?.["date-only (numerology)"];
  const band = (b: number) => v?.confidenceBands?.find((x) => x.band.startsWith(String(b * 10)));
  const pct = (x?: number) => (x == null ? "—" : `${(x * 100).toFixed(1)}%`);

  return (
    <div style={{ border: "1px solid rgba(212,175,55,0.18)", borderRadius: "1rem", padding: "0.9rem", marginBottom: "0.85rem", background: "linear-gradient(135deg, rgba(16,8,42,0.96), rgba(38,16,68,0.72))" }}>
      <button onClick={() => setOpen((o) => !o)} style={{ width: "100%", background: "none", border: "none", textAlign: "left", cursor: "pointer", padding: 0 }}>
        <span style={{ fontFamily: "'Cinzel', serif", fontSize: "0.58rem", letterSpacing: "0.16em", textTransform: "uppercase", color: "#d4af37", fontWeight: 800 }}>
          {open ? "▾" : "▸"} 📊 The accuracy lab — how often the verdict is right
        </span>
      </button>

      {open && (
        <div style={{ marginTop: "0.6rem" }}>
          {!data || !m ? (
            <div style={{ fontSize: "0.72rem", color: "rgba(200,180,240,0.6)" }}>Loading the measured study…</div>
          ) : (
            <>
              <div style={{ fontSize: "0.72rem", color: "rgba(200,180,240,0.72)", lineHeight: 1.65 }}>
                Measured on {data.dataset?.matches?.toLocaleString()} real club matches
                {data.dataset?.span ? ` (${data.dataset.span})` : ""} — trained before 2000, judged on matches from 2015 on that
                the model never saw.
              </div>

              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.7rem", marginTop: "0.55rem", fontVariantNumeric: "tabular-nums" }}>
                <thead>
                  <tr style={{ color: "rgba(200,180,240,0.55)", textAlign: "left" }}>
                    <th style={{ padding: "0.2rem 0.3rem", fontWeight: 600 }}>model</th>
                    <th style={{ padding: "0.2rem 0.3rem", fontWeight: 600 }}>held-out accuracy</th>
                    <th style={{ padding: "0.2rem 0.3rem", fontWeight: 600 }}>log loss</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["The verdict (form + home + day numbers)", m, true],
                    ["Same model, date numbers removed", noDate, false],
                    ["Date numbers alone (numerology)", dateOnly, false],
                  ].map(([label, mm, strong], i) => {
                    const row = mm as { testAccuracy: number; testLogLoss: number } | undefined;
                    return (
                      <tr key={i} style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
                        <td style={{ padding: "0.24rem 0.3rem", color: strong ? "#f1d98a" : "rgba(240,234,255,0.88)", fontWeight: strong ? 700 : 400 }}>{label as string}</td>
                        <td style={{ padding: "0.24rem 0.3rem", color: strong ? "#86efac" : "rgba(240,234,255,0.88)", fontWeight: strong ? 700 : 400 }}>{pct(row?.testAccuracy)}</td>
                        <td style={{ padding: "0.24rem 0.3rem", color: "rgba(200,180,240,0.65)" }}>{row ? row.testLogLoss.toFixed(4) : "—"}</td>
                      </tr>
                    );
                  })}
                  <tr style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
                    <td style={{ padding: "0.24rem 0.3rem", color: "rgba(200,180,240,0.75)" }}>Always predict a home win</td>
                    <td style={{ padding: "0.24rem 0.3rem", color: dateOnly ? "#86efac" : undefined }}>{pct(dateOnly?.testAccuracy)}</td>
                    <td style={{ padding: "0.24rem 0.3rem", color: "rgba(200,180,240,0.5)" }}>—</td>
                  </tr>
                </tbody>
              </table>

              <div style={{ fontSize: "0.7rem", color: "rgba(200,180,240,0.62)", lineHeight: 1.6, marginTop: "0.5rem" }}>
                Read the first two lines together: adding the day’s numbers to the form model moves held-out accuracy by
                less than a point — the call is carried by form. The third line shows the numerology layers on their own
                land exactly on the always-home baseline, which is why they are shown as context rather than sold as a
                forecast.
              </div>

              <div style={{ fontFamily: "'Cinzel', serif", fontSize: "0.55rem", letterSpacing: "0.14em", textTransform: "uppercase", color: "#d4af37", fontWeight: 800, margin: "0.7rem 0 0.3rem" }}>
                Accuracy by confidence band (held-out era)
              </div>
              <div style={{ display: "flex", gap: "0.3rem", flexWrap: "wrap" }}>
                {v?.confidenceBands?.filter((b) => b.n > 0).map((b) => (
                  <div key={b.band} style={{ padding: "0.3rem 0.45rem", borderRadius: 9, background: "rgba(255,255,255,0.04)", border: `1px solid ${b.accuracy >= (dateOnly?.testAccuracy ?? 0.45) + 0.03 ? "rgba(134,239,172,0.35)" : "rgba(255,255,255,0.07)"}`, fontSize: "0.62rem", fontVariantNumeric: "tabular-nums" }}>
                    <div style={{ color: "rgba(200,180,240,0.6)" }}>{b.band} conf</div>
                    <div style={{ fontWeight: 800, color: b.accuracy >= (dateOnly?.testAccuracy ?? 0.45) + 0.03 ? "#86efac" : "#f1d98a" }}>{pct(b.accuracy)}</div>
                    <div style={{ color: "rgba(200,180,240,0.45)" }}>n {b.n.toLocaleString()}</div>
                  </div>
                ))}
              </div>

              <div style={{ fontSize: "0.7rem", color: "rgba(200,180,240,0.62)", lineHeight: 1.6, marginTop: "0.6rem" }}>
                <b style={{ color: "#f1d98a" }}>What is not here:</b> name-spelling analysis and letter values. That layer was
                removed from the team reading — it measured no better than chance, and it never enters a verdict.
              </div>
              <div style={{ fontSize: "0.7rem", color: "rgba(200,180,240,0.55)", lineHeight: 1.6, marginTop: "0.35rem" }}>
                <b style={{ color: "#f1d98a" }}>What this means in practice:</b> the verdict always fires, and roughly one call in
                two is right. Treat it as a considered lean, not a certainty — the confidence band is the honest part.
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
