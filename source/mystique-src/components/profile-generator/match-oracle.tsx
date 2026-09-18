import * as React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { AccordionContentWithPlayer } from "./accordion-content-with-player";
import {
  buildFixtureDossier,
  numberAlignment,
  oracleEntities,
  seasonNumbers,
  CALIBRATION,
  SEASON_CONSTANT_WARNING,
  ROYAL_STARS,
  KARMIC_DEBTS,
  lookupCompoundName,
  type FixtureDossier,
  type Relation,
} from "@/lib/match-engine";

/* ── small style helpers ───────────────────────────────────────────────────── */
const CARD: React.CSSProperties = {
  border: "1px solid rgba(212,175,55,0.18)",
  background: "linear-gradient(135deg, rgba(16,8,42,0.96), rgba(38,16,68,0.72))",
  borderRadius: "1rem",
  padding: "0.9rem",
  marginBottom: "0.85rem",
};
const LABEL: React.CSSProperties = {
  fontFamily: "'Cinzel', serif",
  fontSize: "0.58rem",
  letterSpacing: "0.16em",
  textTransform: "uppercase",
  color: "#d4af37",
  fontWeight: 800,
};
const MUTED: React.CSSProperties = { fontSize: "0.72rem", color: "rgba(200,180,240,0.6)", lineHeight: 1.6 };
const MONO: React.CSSProperties = { fontVariantNumeric: "tabular-nums" };

const REL_COLOR: Record<Relation, string> = {
  same: "#f1d98a",
  friend: "#86efac",
  neutral: "#94a3b8",
  enemy: "#fca5a5",
};

function Row({ k, v, tone }: { k: string; v: React.ReactNode; tone?: string }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", gap: "0.7rem", padding: "0.22rem 0", borderBottom: "1px dashed rgba(255,255,255,0.06)" }}>
      <span style={{ fontSize: "0.7rem", color: "rgba(200,180,240,0.62)" }}>{k}</span>
      <span style={{ fontSize: "0.72rem", color: tone || "rgba(240,234,255,0.92)", textAlign: "right", fontWeight: 600 }}>{v}</span>
    </div>
  );
}

/* ── team card ─────────────────────────────────────────────────────────────── */
function TeamCard({ side, d }: { side: "home" | "away"; d: FixtureDossier }) {
  const t = side === "home" ? d.home : d.away;
  const clash = side === "home" ? d.clash.homeDayVsFoundingDay : d.clash.awayDayVsFoundingDay;
  const crown = t.direct.isRoyal ? " ★ royal" : "";
  const karma = t.direct.isKarmic ? " ⚠ karmic" : "";
  return (
    <div style={{ ...CARD, flex: 1, minWidth: 240 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: "0.5rem" }}>
        <span style={LABEL}>{side === "home" ? "Home" : "Away"} · {t.kind}</span>
        <span style={{ fontSize: "0.6rem", color: "rgba(200,180,240,0.45)" }}>founded {t.foundedISO} · age {t.age}y</span>
      </div>
      <div style={{ fontFamily: "'Cinzel', serif", color: "#f1d98a", fontSize: "0.92rem", fontWeight: 800, margin: "0.25rem 0 0.5rem" }}>{t.team}</div>
      <Row k="Season number (direct)" v={t.direct.name + crown + karma} tone={t.direct.isRoyal ? "#f1d98a" : undefined} />
      <Row k="Season number (classic)" v={t.classic.name} />
      <Row k="Personal year" v={`${t.personalYear}`} />
      <Row k="Personal month" v={t.personalMonth} />
      <Row k="Personal day (the moving number)" v={<span style={{ ...MONO, color: "#fff7e0" }}>{t.personalDay}</span>} tone={REL_COLOR[clash]} />
      <Row k="Founding-day number" v={t.foundingDayNumber} />
      <Row k="Today's number vs founding day" v={clash} tone={REL_COLOR[clash]} />
    </div>
  );
}

/* ── trend tables (precomputed dataset) ────────────────────────────────────── */
interface TrendTable { n: number; w: number; d: number; l: number; gf: number; ga: number; pd: number[][]; pm: number[][]; ud: number[][]; dc: number[][]; rfd: number[][]; dec: number[][]; top: number[][]; since: number }
interface PendingFile { clubs: Record<string, { year: number; precision: string; source: string; csvName: string }> }

interface TrendFile { meta: { source?: string; sample?: number; teams?: number; since?: number; clubs?: number; matches?: number; aliases?: Record<string, string> }; teams: Record<string, TrendTable> }

type TrendAndPending = TrendFile & { pending?: PendingFile };
let trendCache: TrendFile | null = null;
let trendPromise: Promise<TrendFile | null> | null = null;
function useTrends(): { data: TrendFile | null; loading: boolean } {
  const [data, setData] = React.useState<TrendFile | null>(trendCache);
  const [loading, setLoading] = React.useState(!trendCache && !!trendPromise);
  React.useEffect(() => {
    if (trendCache) { setData(trendCache); return; }
    if (!trendPromise) {
      setLoading(true);
      trendPromise = Promise.all([
        fetch("/data/team-trends.json").then((r) => (r.ok ? r.json() : null)).catch(() => null),
        fetch("/data/club-trends.json").then((r) => (r.ok ? r.json() : null)).catch(() => null),
        fetch("/data/club-pending.json").then((r) => (r.ok ? r.json() : null)).catch(() => null),
      ]).then(([nations, clubs, pending]) => {
        const merged = {
          meta: {
            ...(nations?.meta || {}),
            ...(clubs?.meta || {}),
            // both alias maps must survive the merge — the club file is the only one with them
            aliases: { ...(nations?.meta?.aliases || {}), ...(clubs?.meta?.aliases || {}) },
            clubs: clubs?.meta?.clubs ?? 0,
            matches: clubs?.meta?.matches ?? 0,
            sample: nations?.meta?.sample,
            since: nations?.meta?.since,
          },
          teams: { ...(clubs?.teams || {}), ...(nations?.teams || {}) },
        };
        (merged as TrendFile & { pending?: PendingFile }).pending = pending as PendingFile;
        trendCache = merged as TrendFile;
        return trendCache;
      }).catch(() => null);
    }
    let alive = true;
    trendPromise.then((j) => { if (alive) { setData(j); setLoading(false); } });
    return () => { alive = false; };
  }, []);
  return { data, loading };
}

const pct = (x: number) => `${(x * 100).toFixed(1)}%`;
const zOf = (w: number, n: number, p: number) => (n ? (w - n * p) / Math.sqrt(Math.max(n * p * (1 - p), 1e-9)) : 0);

function TrendTableBlock({
  title, rows, baseline, labelFn, note,
}: { title: string; rows: number[][]; baseline: number; labelFn: (k: number) => string; note?: string }) {
  if (!rows?.length) return null;
  const sorted = [...rows].sort((a, b) => ((b[2] * 3 + b[3]) / b[1]) - ((a[2] * 3 + a[3]) / a[1]));
  return (
    <div style={{ marginBottom: "0.9rem" }}>
      <div style={{ ...LABEL, marginBottom: "0.35rem" }}>{title}</div>
      {note && <div style={{ ...MUTED, marginBottom: "0.3rem" }}>{note}</div>}
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.68rem", ...MONO }}>
          <thead>
            <tr style={{ color: "rgba(200,180,240,0.55)", textAlign: "left" }}>
              <th style={{ padding: "0.2rem 0.3rem", fontWeight: 600 }}>letter</th>
              <th style={{ padding: "0.2rem 0.3rem", fontWeight: 600 }}>n</th>
              <th style={{ padding: "0.2rem 0.3rem", fontWeight: 600 }}>W-D-L</th>
              <th style={{ padding: "0.2rem 0.3rem", fontWeight: 600 }}>win</th>
              <th style={{ padding: "0.2rem 0.3rem", fontWeight: 600 }}>ppg</th>
              <th style={{ padding: "0.2rem 0.3rem", fontWeight: 600 }}>lift</th>
              <th style={{ padding: "0.2rem 0.3rem", fontWeight: 600 }}>z</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((r) => {
              const [k, n, w, d, l] = r;
              const win = w / n, ppg = (w * 3 + d) / n, lift = win - baseline, z = zOf(w, n, baseline);
              const strong = Math.abs(z) >= 2 && n >= 15;
              return (
                <tr key={k} style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
                  <td style={{ padding: "0.22rem 0.3rem", color: strong ? "#f1d98a" : "rgba(240,234,255,0.88)" }}>{labelFn(k)}</td>
                  <td style={{ padding: "0.22rem 0.3rem", color: n < 12 ? "#fca5a5" : undefined }}>{n}</td>
                  <td style={{ padding: "0.22rem 0.3rem" }}>{w}-{d}-{l}</td>
                  <td style={{ padding: "0.22rem 0.3rem" }}>{pct(win)}</td>
                  <td style={{ padding: "0.22rem 0.3rem" }}>{ppg.toFixed(2)}</td>
                  <td style={{ padding: "0.22rem 0.3rem", color: lift >= 0 ? "#86efac" : "#fca5a5" }}>{lift >= 0 ? "+" : ""}{(lift * 100).toFixed(1)}pp</td>
                  <td style={{ padding: "0.22rem 0.3rem", color: strong ? "#f1d98a" : "rgba(200,180,240,0.6)" }}>{z.toFixed(2)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const REL_NAMES = ["same", "friend", "neutral", "enemy"];

function TeamTrend({ name }: { name: string }) {
  const { data, loading } = useTrends();
  // the ledger row name is the canonical key; the CSV spelling and other aliases resolve too
  const key = data?.teams?.[name] ? name : data?.meta?.aliases?.[name];
  const t = key ? data?.teams?.[key] : undefined;
  if (loading && !data) return <div style={{ ...MUTED }}>Loading the decade ledger…</div>;
  if (!t) {
    const clubs = data?.meta?.clubs ?? 0;
    return (
      <div style={{ ...MUTED }}>
        No bundled match history for <b style={{ color: "#f1d98a" }}>{name}</b> — its founding date is settled in the
        ledger, but its league results are not in the shipped corpus. The deep ledger currently covers{" "}
        <b style={{ color: "#f1d98a" }}>{clubs}</b> clubs
        {data?.meta?.matches ? ` across ${data.meta.matches.toLocaleString()} graded match-rows` : ""},
        plus {Object.keys(data?.teams ?? {}).length - clubs + clubs > 0 ? "the national teams" : ""}. Clubs outside the
        corpus still get the full deterministic reading above — only the decade tables need the results file.
      </div>
    );
  }
  const baseline = t.w / t.n;
  const gd = (t.gf - t.ga) / t.n;
  return (
    <div style={{ ...CARD }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", flexWrap: "wrap", gap: "0.4rem" }}>
        <span style={LABEL}>{name} — deep ledger, {t.since}→today</span>
        <span style={{ fontSize: "0.66rem", color: "rgba(200,180,240,0.6)" }}>
          {t.n} matches · W{t.w} D{t.d} L{t.l} · win {pct(baseline)} · ppg {((t.w * 3 + t.d) / t.n).toFixed(2)} · gd {gd >= 0 ? "+" : ""}{gd.toFixed(2)}
        </span>
      </div>
      <div style={{ ...MUTED, marginTop: "0.35rem" }}>
        Every match this team has played is graded, and every letter is measured against the team's <b>own</b> baseline
        ({pct(baseline)} wins) — never against a global average. “z” is the standard score of the win count: |z| ≥ 2 with n ≥ 15
        is where a letter starts to look like a real pattern; n &lt; 12 rows are shown in red as noise.
      </div>
      <div style={{ marginTop: "0.8rem" }}>
        <TrendTableBlock
          title="By personal day (the finest moving layer)"
          rows={t.pd}
          baseline={baseline}
          labelFn={(k) => `personal day ${k}`}
          note="The layer that actually changes between fixtures. Read any strong row as a hypothesis to test further, never as a call."
        />
        <TrendTableBlock title="By personal month" rows={t.pm} baseline={baseline} labelFn={(k) => `personal month ${k}`} />
        <TrendTableBlock title="By universal day (the field, same for both sides)" rows={t.ud} baseline={baseline} labelFn={(k) => `universal day ${k}`} />
        <TrendTableBlock
          title="By calendar-day compound (the day’s own letter)"
          rows={t.dc}
          baseline={baseline}
          labelFn={(k) => `${k}${lookupCompoundName(k) ? ` — ${lookupCompoundName(k)}` : ""}`}
        />
        <TrendTableBlock title="Today's letter vs the founding day" rows={t.rfd} baseline={baseline} labelFn={(k) => REL_NAMES[k] ?? String(k)} />
        <TrendTableBlock
          title="Strongest compounds on record (n ≥ 8)"
          rows={t.top}
          baseline={baseline}
          labelFn={(k) => `${k}${lookupCompoundName(k) ? ` — ${lookupCompoundName(k)}` : ""}`}
        />
      </div>
      <div style={{ marginTop: "0.6rem" }}>
        <div style={{ ...LABEL, marginBottom: "0.3rem" }}>Decade stability</div>
        <div style={{ display: "flex", gap: "0.35rem", flexWrap: "wrap" }}>
          {t.dec.map(([dec, n, w]) => (
            <div key={dec} style={{ padding: "0.3rem 0.45rem", borderRadius: 10, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", fontSize: "0.64rem", ...MONO }}>
              <span style={{ color: "rgba(200,180,240,0.6)" }}>{dec}s </span>
              <span style={{ color: "#f1d98a" }}>{pct(w / n)}</span>
              <span style={{ color: "rgba(200,180,240,0.45)" }}> (n={n})</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── main panel ────────────────────────────────────────────────────────────── */
export function MatchOraclePanel({ onClose }: { onClose?: () => void }) {
  const entities = React.useMemo(() => oracleEntities(), []);
  const names = React.useMemo(() => entities.map((e) => e.name), [entities]);
  const today = new Date().toISOString().slice(0, 10);
  const [date, setDate] = React.useState(today);
  const [home, setHome] = React.useState("Manchester United");
  const [away, setAway] = React.useState("Manchester City");
  const [showCalibration, setShowCalibration] = React.useState(false);
  /* Drafts vs committed. A date typed on a phone keyboard does not reliably fire onChange, and
     there was no way to be sure a value had been taken. Every field now has an explicit commit
     (the Apply button, or Enter/Go in the field), and the panel says when a draft is pending. */
  const [dDate, setDDate] = React.useState(date);
  const [dHome, setDHome] = React.useState(home);
  const [dAway, setDAway] = React.useState(away);
  const dirty = dDate !== date || dHome !== home || dAway !== away;
  const commit = React.useCallback((dd = dDate, dh = dHome, da = dAway) => {
    setDate(dd); setHome(dh); setAway(da);
    try { window.dispatchEvent(new CustomEvent("mystique-oracle-commit", { detail: { date: dd, home: dh, away: da } })); } catch { /* no window (tests) */ }
  }, [dDate, dHome, dAway]);


  const dossier = React.useMemo(() => {
    try {
      if (!date || !home || !away || home === away) return null;
      return buildFixtureDossier(date, home, away);
    } catch {
      return null;
    }
  }, [date, home, away]);

  const summaryText = React.useMemo(() => {
    if (!dossier) return "";
    const lines = numberAlignment(dossier);
    const s = seasonNumbers(dossier);
    return [
      `${dossier.home.team} against ${dossier.away.team}, ${dossier.date}. This is a reading of the day\u2019s numbers, not a prediction of the result.`,
      `The day is a universal day ${dossier.day.universalDay.raw}${dossier.day.universalDay.name ? `, ${dossier.day.universalDay.name}` : ""}, its calendar-day number ${dossier.day.calendarDay.raw}${dossier.day.calendarDay.name ? `, ${dossier.day.calendarDay.name}` : ""}, falling on a ${dossier.day.weekday}.`,
      `${dossier.home.team} carries the season number ${s.home.direct.name} with classic reading ${s.home.classic.name}, and stands today on personal day ${dossier.home.personalDay} against its founding day ${dossier.home.foundingDayNumber}.`,
      `${dossier.away.team} carries the season number ${s.away.direct.name} with classic reading ${s.away.classic.name}, and stands today on personal day ${dossier.away.personalDay} against its founding day ${dossier.away.foundingDayNumber}.`,
      lines.map((l) => l.detail).join(" "),
      "Measured on 128,727 matches, none of these layers separates winners. The app states that plainly rather than dressing the reading up as a forecast.",
    ].filter(Boolean).join("\n\n");
  }, [dossier]);

  return (
    <div>
      <div style={{ ...CARD, background: "linear-gradient(135deg, rgba(24,10,56,0.98), rgba(52,20,88,0.72))" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "0.6rem", flexWrap: "wrap" }}>
          <div>
            <div style={{ ...LABEL, fontSize: "0.66rem" }}>⚽ Match Oracle</div>
            <div style={{ ...MUTED, marginTop: 2 }}>
              A fixture dossier for any two ledger entities — deterministic, offline, and honest about what it can know.
              {" "}Ledger: <b style={{ color: "#f1d98a" }}>{entities.length}</b> entities
              {" "}({entities.filter((e) => e.kind === "Football Club").length} clubs,{" "}
              {entities.filter((e) => e.kind === "Country").length} nations).
            </div>
          </div>
          {onClose && (
            <Button variant="ghost" size="sm" onClick={onClose} style={{ color: "#d4af37" }}>
              Close
            </Button>
          )}
        </div>

        <form
          onSubmit={(e) => { e.preventDefault(); commit(); }}
          style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "0.5rem", marginTop: "0.8rem", alignItems: "end" }}
        >
          <label style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <span style={{ fontSize: "0.6rem", color: "rgba(200,180,240,0.6)", letterSpacing: "0.08em", textTransform: "uppercase" }}>Date</span>
            <input
              type="date"
              value={dDate}
              onChange={(e) => setDDate(e.target.value)}
              onBlur={(e) => setDDate(e.target.value)}
              style={{ background: "rgba(10,4,28,0.9)", border: `1px solid ${dDate !== date ? "rgba(241,217,138,0.6)" : "rgba(212,175,55,0.25)"}`, borderRadius: 10, padding: "0.45rem 0.55rem", color: "#f4ecff", fontSize: "0.8rem" }}
            />
          </label>
          {[["Home", dHome, setDHome, home] as const, ["Away", dAway, setDAway, away] as const].map(([label, value, set, committed]) => (
            <label key={label} style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <span style={{ fontSize: "0.6rem", color: "rgba(200,180,240,0.6)", letterSpacing: "0.08em", textTransform: "uppercase" }}>{label}</span>
              <input
                list="oracle-entities"
                value={value}
                onChange={(e) => set(e.target.value)}
                placeholder="country or club"
                enterKeyHint="go"
                style={{ background: "rgba(10,4,28,0.9)", border: `1px solid ${value !== committed ? "rgba(241,217,138,0.6)" : "rgba(212,175,55,0.25)"}`, borderRadius: 10, padding: "0.45rem 0.55rem", color: "#f4ecff", fontSize: "0.8rem" }}
              />
            </label>
          ))}
          <button
            type="submit"
            style={{
              padding: "0.5rem 0.7rem", borderRadius: 10, fontWeight: 800, fontSize: "0.72rem",
              letterSpacing: "0.1em", textTransform: "uppercase", cursor: "pointer",
              border: `1px solid ${dirty ? "rgba(241,217,138,0.85)" : "rgba(212,175,55,0.35)"}`,
              background: dirty ? "linear-gradient(135deg, rgba(212,175,55,0.35), rgba(241,217,138,0.18))" : "rgba(212,175,55,0.08)",
              color: dirty ? "#fff7e0" : "#f1d98a",
            }}
          >
            {dirty ? "↵ Apply" : "✓ Applied"}
          </button>
        </form>
        {dirty && (
          <div style={{ fontSize: "0.62rem", color: "#f1d98a", marginTop: "0.35rem" }}>
            Pending — press Apply (or Enter) to read this fixture. The panels below still show the previous entry.
          </div>
        )}
        <datalist id="oracle-entities">
          {names.map((n) => <option key={n} value={n} />)}
        </datalist>

        <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap", marginTop: "0.55rem" }}>
          {[
            ["Gor Mahia", "Al Ahly"],
            ["Kenya", "Brazil"],
            ["Brazil", "Germany"],
            ["Argentina", "France"],
            ["Manchester United", "Liverpool"],
          ].map(([h, a]) => (
            <button
              key={`${h}-${a}`}
              onClick={() => { setDHome(h); setDAway(a); commit(dDate, h, a); }}
              style={{ fontSize: "0.62rem", padding: "0.25rem 0.5rem", borderRadius: 999, border: "1px solid rgba(212,175,55,0.25)", background: "rgba(212,175,55,0.08)", color: "#f1d98a", cursor: "pointer" }}
            >
              {h} v {a}
            </button>
          ))}
        </div>
      </div>

      {home && away && home !== away && (
        <NoPredictionsCard />
      )}

      {!dossier && <WhyNoDossier home={home} away={away} />}

      {dossier && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
          <div style={{ display: "flex", gap: "0.7rem", flexWrap: "wrap" }}>
            <TeamCard side="home" d={dossier} />
            <TeamCard side="away" d={dossier} />
          </div>

          <div style={CARD}>
            <div style={{ ...LABEL, marginBottom: "0.4rem" }}>The day both play on</div>
            <Row k="Date" v={`${dossier.date} · ${dossier.day.weekday}`} />
            <Row k="Universal day" v={`${dossier.day.universalDay.raw}${dossier.day.universalDay.name ? ` — ${dossier.day.universalDay.name}` : ""} → ${dossier.day.universalDay.reduced}`} />
            <Row k="Calendar-day letter" v={`${dossier.day.calendarDay.raw}${dossier.day.calendarDay.name ? ` — ${dossier.day.calendarDay.name}` : ""}`} />
            <Row k="Universal month / year" v={`${dossier.day.universalMonth} / ${dossier.day.universalYear.raw}${dossier.day.universalYear.name ? ` (${dossier.day.universalYear.name})` : ""}`} />
            {dossier.era && (
              <Row k={`${dossier.home.team} era (pinnacle ${dossier.era.pinnacleNumber}, stage ${dossier.era.pinnacleStage})`} v={`challenge ${dossier.era.challengeNumber}`} />
            )}
          </div>

          <div style={CARD}>
            <div style={{ ...LABEL, marginBottom: "0.4rem" }}>Date numbers — context only, measured to add nothing</div>
            {numberAlignment(dossier).map((l, i) => (
              <div key={i} style={{ padding: "0.4rem 0", borderBottom: "1px dashed rgba(255,255,255,0.06)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: "0.6rem" }}>
                  <span style={{ fontSize: "0.7rem", color: "rgba(200,180,240,0.7)" }}>{l.label}</span>
                  <span style={{ fontSize: "0.62rem", textTransform: "uppercase", letterSpacing: "0.08em", color: l.verdict === "in harmony" ? "#86efac" : l.verdict === "opposing" ? "#fca5a5" : "#94a3b8", fontWeight: 700 }}>
                    {l.verdict}
                  </span>
                </div>
                <div style={{ ...MUTED, marginTop: 2 }}>{l.detail}</div>
              </div>
            ))}
            <div style={{ ...MUTED, marginTop: "0.55rem", color: "rgba(241,217,138,0.75)" }}>
              These words describe how the day's numbers stand to one another. They carry no probability
              and never decide a match — measured on 128,727 matches, none of these layers separated winners.
            </div>
          </div>

          <div style={CARD}>
            <div style={{ ...LABEL, marginBottom: "0.4rem" }}>Narrative dossier (plays with the sentence-following reader)</div>
            <AccordionContentWithPlayer text={summaryText} />
          </div>

          <div style={{ ...CARD, borderColor: "rgba(252,165,165,0.35)", background: "linear-gradient(135deg, rgba(40,12,24,0.96), rgba(60,18,38,0.7))" }}>
            <div style={{ ...LABEL, color: "#fca5a5" }}>⚠ The one rule this engine enforces on itself</div>
            <div style={{ ...MUTED, color: "rgba(255,220,220,0.85)", marginTop: "0.3rem" }}>{SEASON_CONSTANT_WARNING}</div>
          </div>

          <div style={CARD}>
            <button
              onClick={() => setShowCalibration((s) => !s)}
              style={{ width: "100%", background: "none", border: "none", textAlign: "left", cursor: "pointer", padding: 0 }}
            >
              <div style={{ ...LABEL }}>{showCalibration ? "▾" : "▸"} What the data says (calibration)</div>
            </button>
            {showCalibration && (
              <div style={{ marginTop: "0.5rem" }}>
                {CALIBRATION.studies.map((s) => (
                  <div key={s.name} style={{ marginBottom: "0.7rem" }}>
                    <div style={{ ...MUTED, color: "#f1d98a", fontWeight: 700 }}>{s.name}</div>
                    <div style={{ ...MUTED, marginTop: "0.25rem" }}>
                      {s.matches.toLocaleString()} matches ({s.span}) · train {s.trainN.toLocaleString()} · test {s.testN.toLocaleString()}.
                      Base rates — train: home {s.baseRates.train.home}%{s.baseRates.train.draw ? ` / draw ${s.baseRates.train.draw}% / away ${s.baseRates.train.away}%` : ""};
                      test: home {s.baseRates.test.home}%{s.baseRates.test.draw ? ` / draw ${s.baseRates.test.draw}% / away ${s.baseRates.test.away}%` : ""}.
                      Signatures swept: {s.signaturesTested.toLocaleString()} · survivors replicating out of sample: {s.survivors}.
                    </div>
                    <div style={{ ...MUTED, marginTop: "0.3rem", color: "#f1d98a" }}>{s.headline}</div>
                    <ul style={{ margin: "0.35rem 0 0 1rem", padding: 0 }}>
                      {s.detail.map((d, i) => (
                        <li key={i} style={{ ...MUTED, marginBottom: "0.32rem" }}>{d}</li>
                      ))}
                    </ul>
                  </div>
                ))}
                <div style={{ ...MUTED, marginTop: "0.45rem", color: "rgba(241,217,138,0.85)" }}>{CALIBRATION.conclusion}</div>
              </div>
            )}
          </div>


          <TeamTrend name={dossier.home.team} />
          <TeamTrend name={dossier.away.team} />

          <div style={{ ...MUTED, marginTop: "0.4rem" }}>
            Ledger entities available: {entities.length} (countries and clubs). Royal stars {[...ROYAL_STARS].join(", ")}; karmic debts {[...KARMIC_DEBTS].join(", ")}.
          </div>
        </motion.div>
      )}
    </div>
  );
}


/* ── why a fixture could not be read ─────────────────────────────────────────
   "Not in the ledger" and "we know the club but its founding date is only attested
   to the year" are different answers, and the second one is worth saying out loud:
   the letters need a day and a month, and inventing them would be worse than a blank.
   ──────────────────────────────────────────────────────────────────────────── */
function WhyNoDossier({ home, away }: { home: string; away: string }) {
  const { data } = useTrends();
  const pending = (data as TrendAndPending | null)?.pending;
  const lookup = (name: string) => {
    for (const [key, v] of Object.entries(pending?.clubs || {})) {
      if (key.toLowerCase() === name.trim().toLowerCase()) return { name: key, ...v };
      if (v.csvName?.toLowerCase() === name.trim().toLowerCase()) return { name: key, ...v };
    }
    return null;
  };
  const problem = (name: string) => {
    if (!name.trim()) return null;
    const p = lookup(name);
    if (p) {
      return {
        head: `${p.name} — date not settled to day precision`,
        body: `Our sources attest its founding only to the ${p.precision} (${p.year}, ${p.source}). The reading needs a day and a month, and neither source gives one, so the club is held back rather than guessed at.`,
      };
    }
    return {
      head: `${name} — not in the ledger`,
      body: "It carries no founding date in the shipped ledger. Clubs enter the ledger once their founding date is sourced to the day; the list keeps growing.",
    };
  };
  const a = problem(home), b = problem(away);
  if (home === away && home) {
    return <div style={{ ...CARD, color: "#fca5a5" }}>A club cannot play itself — pick two different entities.</div>;
  }
  return (
    <div style={{ ...CARD, color: "#fca5a5" }}>
      {[a, b].filter(Boolean).map((p, i) => (
        <div key={i} style={{ marginBottom: i === 0 ? "0.5rem" : 0 }}>
          <div style={{ fontWeight: 800, fontSize: "0.78rem" }}>{p!.head}</div>
          <div style={{ ...MUTED, color: "rgba(255,220,220,0.8)", marginTop: 2 }}>{p!.body}</div>
        </div>
      ))}
      {!a && !b && <div>Choose two different entities that both carry a founding date in the ledger.</div>}
    </div>
  );
}


/* ── Why this app no longer predicts match results ────────────────────────────
   The rule it was held to: reach 80% accuracy on match outcomes, or come out of the app.
   It could not, and neither can anything else — the measurements below are from this app's own
   study and from published benchmarks of the field. The engine is removed rather than left in
   place making calls it cannot stand behind. What remains is description: the day's numbers,
   each club's own record, and no pick.
   ──────────────────────────────────────────────────────────────────────────── */
function NoPredictionsCard() {
  const [open, setOpen] = React.useState(false);
  return (
    <div style={{ ...CARD, borderColor: "rgba(252,165,165,0.35)", background: "linear-gradient(135deg, rgba(40,12,24,0.96), rgba(60,18,38,0.7))" }}>
      <div style={{ ...LABEL, color: "#fca5a5" }}>No match predictions — the engine was removed</div>
      <div style={{ ...MUTED, color: "rgba(255,220,220,0.85)", marginTop: "0.3rem" }}>
        The prediction engine was held to a rule: score <b>80% or better</b> on match outcomes, or be
        scrapped. It could not — and neither can any model in the field.
      </div>
      <button onClick={() => setOpen((o) => !o)} style={{ marginTop: "0.55rem", background: "none", border: "none", padding: 0, cursor: "pointer", textAlign: "left", ...LABEL }}>
        {open ? "▾" : "▸"} The measurements behind that decision
      </button>
      {open && (
        <div style={{ ...MUTED, color: "rgba(255,220,220,0.82)", marginTop: "0.45rem", lineHeight: 1.65 }}>
          <div style={{ marginBottom: "0.35rem" }}>
            <b style={{ color: "#f1d98a" }}>This app's own model:</b> 51.4% on 20,673 held-out club
            matches (2015 onward) — better than the 44.4% from always naming the home side, and well
            short of 80%.
          </div>
          <div style={{ marginBottom: "0.35rem" }}>
            <b style={{ color: "#f1d98a" }}>What 80% would require:</b> the single most likely outcome of
            a football match is never 80% probable. Measured on this corpus, the most likely outcome is
            home at 44.4%; the best model reaches 51.4%. An 80% three-way accuracy implies fixtures whose
            result is a foregone conclusion, and football does not produce them.
          </div>
          <div style={{ marginBottom: "0.35rem" }}>
            <b style={{ color: "#f1d98a" }}>Where that sits in the field:</b> published benchmarks put the
            best history-only models at 53.6% and bookmaker closing odds at 55.1% on 1,520 held-out
            Premier League matches. Nothing on record reaches 80% on three-way outcomes.
          </div>
          <div style={{ marginBottom: "0.35rem" }}>
            <b style={{ color: "#f1d98a" }}>Could it be right more often by speaking less?</b> Yes, and the
            app measured it: 86.2% correct when it spoke on only the most confident 2% of fixtures, 82.1%
            on 5%. That is a trick of coverage, not a better forecast — it stays silent on 95 of every 100
            matches. Reporting that as "86% accuracy" would be misleading, so it is not reported as an
            accuracy claim.
          </div>
          <div>
            <b style={{ color: "#f1d98a" }}>What replaced it:</b> the day's numbers read as a description,
            the three Soul Resonance / Cheiro day methods shown with the record of what they achieved
            (no edge), and each club's own decade ledger. The app describes; it no longer calls results.
          </div>
        </div>
      )}
    </div>
  );
}
