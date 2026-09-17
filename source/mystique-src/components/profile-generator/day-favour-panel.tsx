import * as React from "react";
import { dayFavour, type DayFavour, type Lean } from "@/lib/day-favour";
import { findEntity } from "@/lib/match-engine";

/**
 * DAY FAVOURABILITY — the three methods, side by side, with their measured record.
 *
 * The reading is what was asked for: whether the day of a game is favourable, decided by
 *  1. every relationship measure from the Soul Resonance section, used exactly as that section
 *     uses them (same functions, same layers, same weights);
 *  2. Cheiro's "lucky day" — the birth-number series (1st, 10th, 19th, 28th for a 1);
 *  3. Cheiro's compound-date rule — the compound reached from the founding number and the date,
 *     read from the same Cheiro table the app ships.
 *
 * Printed underneath, always: what those methods achieved on held-out fixtures. Hiding that would
 * turn a reading into a promise, and it is not one.
 */

interface SuitAudit { meta: { n: number; betterCalls: number; betterRate: number; homeRate: number; awayRate: number; z: number }; gapTable: { gap: number; n: number; homeRate: number }[] }

interface Audit {
  sample: number;
  combined: { calls: number; accuracy: number; nullAcc: number; z: number };
  methods: { name: string; calls: number; accuracy: number; nullAcc: number; z: number }[];
  homeWinRate: number;
  awayWinRate: number;
  verdictLine: string;
}

let suitCache: SuitAudit | null = null;
function useSuitability() {
  const [a, setA] = React.useState<SuitAudit | null>(suitCache);
  React.useEffect(() => {
    if (suitCache) return;
    fetch("/data/suitability-test.json").then((r) => (r.ok ? r.json() : null)).then((j) => { if (j) { suitCache = j; setA(j); } }).catch(() => {});
  }, []);
  return a;
}

let auditCache: Audit | null = null;
let auditPromise: Promise<Audit | null> | null = null;
function useAudit() {
  const [a, setA] = React.useState<Audit | null>(auditCache);
  React.useEffect(() => {
    if (auditCache) return;
    if (!auditPromise) auditPromise = fetch("/data/favour-audit.json").then((r) => (r.ok ? r.json() : null)).catch(() => null);
    let alive = true;
    auditPromise.then((j) => { if (alive && j) { auditCache = j; setA(j); } });
    return () => { alive = false; };
  }, []);
  return a;
}

const LEAN_COLOR: Record<Lean, string> = { favours: "#86efac", tests: "#fca5a5", neutral: "rgba(200,180,240,0.55)" };
const LEAN_WORD: Record<Lean, string> = { favours: "favours", tests: "tests", neutral: "neutral" };

export function DayFavourPanel({ date, home, away }: { date: string; home: string; away: string }) {
  const [open, setOpen] = React.useState(false);
  const audit = useAudit();
  const suit = useSuitability();

  const reading: DayFavour | null = React.useMemo(() => {
    const h = findEntity(home), a = findEntity(away);
    if (!h || !a || home === away || !date) return null;
    try {
      return dayFavour(date,
        { name: h.name, day: h.day, month: h.month, year: h.year },
        { name: a.name, day: a.day, month: a.month, year: a.year },
        null, null);
    } catch { return null; }
  }, [date, home, away]);

  if (!reading) return null;
  const m = audit?.combined;

  return (
    <div style={{ border: "1px solid rgba(212,175,55,0.18)", borderRadius: "1rem", padding: "0.9rem", marginBottom: "0.85rem", background: "linear-gradient(135deg, rgba(16,8,42,0.96), rgba(38,16,68,0.72))" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: "0.5rem", flexWrap: "wrap" }}>
        <span style={{ fontFamily: "'Cinzel', serif", fontSize: "0.58rem", letterSpacing: "0.16em", textTransform: "uppercase", color: "#d4af37", fontWeight: 800 }}>
          Day favourability — the three methods
        </span>
        <span style={{ fontSize: "0.72rem", fontWeight: 800, color: reading.combined >= 12 ? "#86efac" : reading.combined <= -12 ? "#93c5fd" : "rgba(200,180,240,0.7)" }}>
          {reading.verdict}
        </span>
      </div>

      {/* the comparison itself: which side the day suits, and by how much */}
      <div style={{ marginTop: "0.55rem", padding: "0.5rem 0.6rem", borderRadius: 10, background: "rgba(255,255,255,0.035)", border: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ fontSize: "0.7rem", color: "#f1d98a", fontWeight: 800 }}>
          The comparison: {reading.suitability.suited === "neither"
            ? "the day suits neither side more than the other"
            : `the day suits ${reading.suitability.suited === "home" ? home : away} more`}
          {" "}(gap {reading.suitability.gap > 0 ? "+" : ""}{reading.suitability.gap})
        </div>
        <div style={{ fontSize: "0.66rem", color: "rgba(200,180,240,0.62)", lineHeight: 1.55, marginTop: 3 }}>
          {home}: {reading.suitability.home} favourable signal{Math.abs(reading.suitability.home) === 1 ? "" : "s"} — {reading.suitability.homeWhy.join("; ")}.
          <br />
          {away}: {reading.suitability.away} — {reading.suitability.awayWhy.join("; ")}.
        </div>
        {suit && (
          <div style={{ fontSize: "0.66rem", color: "rgba(200,180,240,0.72)", lineHeight: 1.55, marginTop: 4 }}>
            Measured: across {suit.meta.n.toLocaleString()} matches, the home-win rate barely moves with this gap —{" "}
            {suit.gapTable.filter((g) => g.gap >= 2).reduce((a, g) => a + g.homeRate * g.n, 0) /
              Math.max(suit.gapTable.filter((g) => g.gap >= 2).reduce((a, g) => a + g.n, 0), 1) * 100 > 0
              ? `${((suit.gapTable.filter((g) => g.gap >= 2).reduce((a, g) => a + g.homeRate * g.n, 0) / Math.max(suit.gapTable.filter((g) => g.gap >= 2).reduce((a, g) => a + g.n, 0), 1)) * 100).toFixed(1)}% when it favours the home side`
              : "no measurable difference"}
            {" "}versus {suit.gapTable.filter((g) => g.gap <= -2).length
              ? `${((suit.gapTable.filter((g) => g.gap <= -2).reduce((a, g) => a + g.homeRate * g.n, 0) / Math.max(suit.gapTable.filter((g) => g.gap <= -2).reduce((a, g) => a + g.n, 0), 1)) * 100).toFixed(1)}% when it favours the away side`
              : "the other way"}. Reading the gap as a pick is worth{" "}
            <b style={{ color: "#fca5a5" }}>{((suit.meta.betterRate - suit.meta.homeRate / (suit.meta.homeRate + suit.meta.awayRate)) * 100).toFixed(1)}pp</b>{" "}
            against simply backing the home side (z {suit.meta.z}).
          </div>
        )}
      </div>

      {reading.methods.map((meth, i) => (
        <div key={i} style={{ marginTop: "0.55rem", paddingTop: "0.5rem", borderTop: i ? "1px dashed rgba(255,255,255,0.06)" : "none" }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: "0.5rem", flexWrap: "wrap" }}>
            <span style={{ fontSize: "0.68rem", color: "#f1d98a", fontWeight: 700 }}>{meth.method}</span>
            <span style={{ fontSize: "0.62rem", letterSpacing: "0.08em", textTransform: "uppercase", fontWeight: 800 }}>
              <span style={{ color: LEAN_COLOR[meth.home] }}>{home}: {LEAN_WORD[meth.home]}</span>
              <span style={{ color: "rgba(200,180,240,0.4)" }}> · </span>
              <span style={{ color: LEAN_COLOR[meth.away] }}>{away}: {LEAN_WORD[meth.away]}</span>
            </span>
          </div>
          <div style={{ fontSize: "0.68rem", color: "rgba(200,180,240,0.6)", lineHeight: 1.6, marginTop: 2 }}>
            {meth.homeDetail}
          </div>
        </div>
      ))}

      <button onClick={() => setOpen((o) => !o)} style={{ marginTop: "0.6rem", background: "none", border: "none", padding: 0, cursor: "pointer", textAlign: "left", fontSize: "0.55rem", letterSpacing: "0.14em", textTransform: "uppercase", color: "#d4af37", fontWeight: 800 }}>
        {open ? "▾" : "▸"} What these three methods actually achieve (measured)
      </button>
      {open && (
        <div style={{ marginTop: "0.45rem", fontSize: "0.7rem", color: "rgba(200,180,240,0.68)", lineHeight: 1.65 }}>
          {m ? (
            <>
              <div style={{ marginBottom: "0.35rem" }}>
                On <b>{audit!.sample.toLocaleString()}</b> held-out fixtures, the combined reading called <b>{m.calls.toLocaleString()}</b>{" "}
                of them and was right <b>{m.accuracy.toFixed(1)}%</b> of the time. Placing the same mix of calls at random
                scores <b>{m.nullAcc.toFixed(1)}%</b> → <b>z {m.z.toFixed(2)}</b>.
              </div>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.68rem", fontVariantNumeric: "tabular-nums" }}>
                <thead>
                  <tr style={{ color: "rgba(200,180,240,0.55)", textAlign: "left" }}>
                    <th style={{ padding: "0.2rem 0.3rem", fontWeight: 600 }}>method</th>
                    <th style={{ padding: "0.2rem 0.3rem", fontWeight: 600 }}>calls</th>
                    <th style={{ padding: "0.2rem 0.3rem", fontWeight: 600 }}>right</th>
                    <th style={{ padding: "0.2rem 0.3rem", fontWeight: 600 }}>null</th>
                    <th style={{ padding: "0.2rem 0.3rem", fontWeight: 600 }}>z</th>
                  </tr>
                </thead>
                <tbody>
                  {audit!.methods.map((x, i) => (
                    <tr key={i} style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
                      <td style={{ padding: "0.22rem 0.3rem" }}>{x.name}</td>
                      <td style={{ padding: "0.22rem 0.3rem" }}>{x.calls}</td>
                      <td style={{ padding: "0.22rem 0.3rem", color: x.accuracy > x.nullAcc ? "#86efac" : "#fca5a5" }}>{x.accuracy.toFixed(1)}%</td>
                      <td style={{ padding: "0.22rem 0.3rem", color: "rgba(200,180,240,0.6)" }}>{x.nullAcc.toFixed(1)}%</td>
                      <td style={{ padding: "0.22rem 0.3rem", color: Math.abs(x.z) >= 2 ? "#f1d98a" : "rgba(200,180,240,0.6)" }}>{x.z.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div style={{ marginTop: "0.4rem" }}>
                {audit!.verdictLine} The methods are here because they were asked for; their record is printed
                so a reading is never mistaken for an edge.
              </div>
              <div style={{ marginTop: "0.3rem" }}>
                Method 3 runs on the founding number and the date. Cheiro's worked example also adds the
                number of the name — the name layer was withdrawn from this reading, so it is left out here
                and the difference is visible in the numbers above rather than assumed.
              </div>
            </>
          ) : (
            <div>The measured record for these methods is loading…</div>
          )}
        </div>
      )}
    </div>
  );
}
