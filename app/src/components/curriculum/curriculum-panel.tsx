/**
 * 🎓 The Curriculum — a complete, practical course through every deposit of
 * knowledge in the app, taught on real birthdays.
 *
 * Views:
 *  - Study Path:    what to study next (reviews due, this reading, the next case study).
 *  - Syllabus:      every module → topic → field → unit, with its count and mastery tier.
 *  - Case Studies:  the birthdays (Family & Friends first) that together cover every unit.
 *  - This Reading:  every unit the open reading teaches, and how far each has been studied.
 *  - Progress:      streak, daily goal, tiers, recent studies, export / import / reset.
 *
 * A unit is studied by listening to its passage with read-aloud to the end;
 * each full listen adds one to its count (×1 Studied, ×2, ×3, ×5, ×7 Mastered, ×12 Sage).
 */
import * as React from "react";
import { FIELDS, FIELD_BY_ID, MODULES, PRACTICE, chartVariants, partsOf, type FieldDef, type ModuleDef } from "@/lib/curriculum/catalogue";
import { buildChart } from "@/lib/curriculum/chart";
import { primeVoice } from "@/components/curriculum/study-focus";
import { studyNav, sameBirth } from "@/lib/curriculum/navigation";
import {
  allUnits,
  caseInput,
  casesForUnit,
  fieldUniverse,
  loadPlan,
  unitsOfCase,
  type CurriculumPlan,
  type PlanCase,
  type SyllabusUnit,
} from "@/lib/curriculum/plan";
import { syllabus, useSyllabus, type SyllabusScheme } from "@/lib/curriculum/store";
import {
  TIERS,
  activity,
  isDue,
  nextTier,
  partCounts,
  reviewDue,
  tierOf,
  unitCount,
  unitKey,
  unitLast,
  unitWho,
} from "@/lib/curriculum/progress";
import { appNow } from "@/lib/time/focus";

type View = "path" | "syllabus" | "cases" | "reading" | "progress";

const VIEWS: { id: View; label: string; icon: string }[] = [
  { id: "path", label: "Study Path", icon: "🧭" },
  { id: "syllabus", label: "Syllabus Scheme", icon: "📜" },
  { id: "cases", label: "Case Studies", icon: "🎂" },
  { id: "reading", label: "This Reading", icon: "🔎" },
  { id: "progress", label: "Progress", icon: "📈" },
];

const KIND_NOTE: Record<FieldDef["kind"], string> = {
  chart: "Differs by birthday — studied on the case studies that show it.",
  library: "Reachable from any reading — every option can be opened on the chart you have open.",
  temporal: "Changes with the date — the case studies listed show it today.",
  practice: "Personal to every chart — mastered by studying it on many different people.",
};

interface UnitRow extends SyllabusUnit {
  key: string;
  n: number;
  last: number;
}

function useSubject() {
  return React.useSyncExternalStore(studyNav.subscribe, studyNav.getSubject, studyNav.getSubject);
}

function usePlan() {
  const [plan, setPlan] = React.useState<CurriculumPlan | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  React.useEffect(() => {
    let live = true;
    loadPlan().then(
      (p) => live && setPlan(p),
      () => live && setError("The case-study plan couldn't load. Check your connection and reopen the Curriculum."),
    );
    return () => {
      live = false;
    };
  }, []);
  return { plan, error };
}

/** Units the open reading teaches (key set + list). */
function useReadingUnits(now: Date) {
  const subject = useSubject();
  const [state, setState] = React.useState<{ key: string; units: SyllabusUnit[] } | null>(null);
  const subjectKey = subject ? `${subject.name}|${subject.day}-${subject.month}-${subject.year}|${subject.gender}` : "";
  React.useEffect(() => {
    if (!subject) {
      setState(null);
      return;
    }
    let live = true;
    buildChart(subject)
      .then((chart) => {
        if (!live) return;
        const units: SyllabusUnit[] = [];
        for (const field of FIELDS) for (const variant of chartVariants(field, chart, now)) units.push({ field, variant });
        setState({ key: subjectKey, units });
      })
      .catch(() => live && setState({ key: subjectKey, units: [] }));
    return () => {
      live = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subjectKey]);
  const units = state && state.key === subjectKey ? state.units : null;
  const keys = React.useMemo(() => new Set((units ?? []).map((u) => unitKey(u.field.id, u.variant))), [units]);
  return { subject, units, keys };
}

const pct = (a: number, b: number) => (b ? Math.round((a / b) * 100) : 0);
const fmtDate = (t: number) => (t ? new Date(t).toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" }) : "—");
const caseLabel = (c: PlanCase) => `${c.n} · ${c.d}/${c.m}/${c.y}`;
const KIND_BADGE: Record<PlanCase["k"], { label: string; color: string }> = {
  family: { label: "Family & Friends", color: "#f472b6" },
  circle: { label: "Family & Friends", color: "#f472b6" },
  vault: { label: "Famous birthday", color: "#d4af37" },
  practice: { label: "Practice birthday", color: "#60a5fa" },
};

// ── Small pieces ───────────────────────────────────────────────────────────

function TierPill({ n }: { n: number }) {
  const t = tierOf(n);
  return (
    <span
      className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[0.62rem] font-cinzel uppercase tracking-wider whitespace-nowrap"
      style={{ color: t.color, border: `1px solid ${t.color}55`, background: `${t.color}14` }}
    >
      {n > 0 ? `×${n}` : "○"} {t.label}
    </span>
  );
}

function TierBar({ counts, total }: { counts: number[]; total: number }) {
  // counts[i] = units at TIERS[i]
  return (
    <div className="flex h-1.5 w-full overflow-hidden rounded-full bg-white/5" aria-hidden>
      {TIERS.map((t, i) =>
        i === 0 || !counts[i] ? null : <div key={t.id} style={{ width: `${(counts[i] / Math.max(total, 1)) * 100}%`, background: t.color }} />,
      )}
    </div>
  );
}

function tierCounts(rows: { n: number }[]): number[] {
  const out = TIERS.map(() => 0);
  for (const r of rows) out[TIERS.indexOf(tierOf(r.n))]++;
  return out;
}

function Ring({ value, total, size = 64, color = "#d4af37", label }: { value: number; total: number; size?: number; color?: string; label: string }) {
  const r = size / 2 - 5;
  const c = 2 * Math.PI * r;
  const p = Math.min(1, total ? value / total : 0);
  return (
    <div className="flex flex-col items-center gap-1">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="5" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth="5"
          strokeLinecap="round"
          strokeDasharray={`${c * p} ${c}`}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
        <text x="50%" y="52%" textAnchor="middle" dominantBaseline="middle" fill={color} fontSize={size / 4.6} fontFamily="'Cinzel',serif" fontWeight={700}>
          {pct(value, total)}%
        </text>
      </svg>
      <span className="text-[0.62rem] font-cinzel uppercase tracking-widest text-slate-400 text-center leading-tight whitespace-pre-line">{label}</span>
    </div>
  );
}

// ── Main panel ─────────────────────────────────────────────────────────────

export default function CurriculumPanel() {
  const { plan, error } = usePlan();
  const scheme = useSyllabus();
  const now = React.useMemo(() => appNow(), []);
  const reading = useReadingUnits(now);
  const [view, setView] = React.useState<View>("path");
  const [openUnit, setOpenUnit] = React.useState<SyllabusUnit | null>(null);

  const rows: UnitRow[] = React.useMemo(() => {
    if (!plan) return [];
    return allUnits(plan, now).map((u) => ({
      ...u,
      key: unitKey(u.field.id, u.variant),
      n: unitCount(scheme, u.field.id, u.variant),
      last: unitLast(scheme, u.field.id, u.variant),
    }));
  }, [plan, scheme, now]);

  const study = React.useCallback(
    (field: FieldDef, variant: string, caseIndex?: number) => {
      const v = variant === PRACTICE ? undefined : variant;
      primeVoice(); // inside the tap, so the voice may start once the passage is open
      if (caseIndex !== undefined && plan) {
        studyNav.request({ field: field.id, variant: v, subject: caseInput(plan.cases[caseIndex]) });
        return;
      }
      const onReading = reading.keys.has(unitKey(field.id, variant));
      if (field.kind === "library" || field.kind === "practice" || onReading || !plan) {
        studyNav.request({ field: field.id, variant: v });
        return;
      }
      const first = casesForUnit(plan, field, variant, now)[0];
      studyNav.request({ field: field.id, variant: v, ...(first !== undefined ? { subject: caseInput(plan.cases[first]) } : {}) });
    },
    [plan, reading.keys, now],
  );

  if (error) return <div className="glass-card p-6 text-center text-sm text-rose-300">{error}</div>;
  if (!plan) {
    return <div className="py-16 text-center text-xs uppercase tracking-[0.3em] text-primary/60 font-cinzel">Preparing the syllabus…</div>;
  }

  const studied = rows.filter((r) => r.n > 0).length;
  const mastered = rows.filter((r) => r.n >= 7).length;
  const act = activity(scheme, Date.now());
  const due = rows.filter((r) => isDue(r.n, r.last)).length;

  return (
    <div className="curriculum space-y-5" data-tts-skip>
      {/* Header */}
      <div className="glass-card p-5 space-y-4">
        <div className="text-center space-y-1">
          <div className="text-3xl">🎓</div>
          <h2 className="font-cinzel text-lg tracking-[0.25em] uppercase text-primary">The Curriculum</h2>
          <p className="text-[0.75rem] text-slate-400 max-w-xl mx-auto leading-relaxed">
            Every field of knowledge in Mystique Compass, taught on {plan.cases.length} real birthdays — {plan.stats.family} of them from Family &amp; Friends.
            Listen to a passage to the end with read-aloud and it is marked studied; every further full listen is counted towards mastery.
          </p>
        </div>
        <div className="flex flex-wrap items-start justify-center gap-5">
          <Ring value={studied} total={rows.length} label={`Studied\n${studied}/${rows.length}`} />
          <Ring value={mastered} total={rows.length} color="#f97316" label={`Mastered ×7\n${mastered}`} />
          <Ring value={Math.min(act.today, scheme.dailyGoal)} total={scheme.dailyGoal} color="#34d399" label={`Today ${act.today}/${scheme.dailyGoal}`} />
          <div className="flex flex-col items-center justify-center gap-1 pt-2">
            <span className="font-cinzel text-2xl text-amber-300">{act.streak}🔥</span>
            <span className="text-[0.62rem] font-cinzel uppercase tracking-widest text-slate-400">Day streak</span>
            {due > 0 && <span className="text-[0.62rem] text-sky-300">{due} review{due === 1 ? "" : "s"} due</span>}
          </div>
        </div>
        <div className="flex flex-wrap justify-center gap-1.5">
          {TIERS.slice(1).map((t) => (
            <span key={t.id} className="text-[0.6rem] font-cinzel uppercase tracking-wider px-2 py-0.5 rounded-full" style={{ color: t.color, border: `1px solid ${t.color}44` }}>
              {t.label} · {rows.filter((r) => tierOf(r.n).id === t.id).length}
            </span>
          ))}
        </div>
      </div>

      {/* View switcher */}
      <div className="grid grid-cols-5 gap-1" role="tablist">
        {VIEWS.map((v) => (
          <button
            key={v.id}
            role="tab"
            aria-selected={view === v.id}
            onClick={() => setView(v.id)}
            className={`rounded-lg px-1 py-2 text-[0.6rem] sm:text-[0.66rem] font-cinzel uppercase tracking-wider border transition-colors ${
              view === v.id ? "bg-primary/15 border-primary/40 text-primary" : "bg-white/[0.03] border-white/10 text-slate-400"
            }`}
          >
            <span className="block text-base leading-none mb-1">{v.icon}</span>
            {v.label}
          </button>
        ))}
      </div>

      {view === "path" && <StudyPath plan={plan} rows={rows} scheme={scheme} reading={reading} now={now} onStudy={study} onOpen={setOpenUnit} />}
      {view === "syllabus" && <Syllabus plan={plan} rows={rows} now={now} onOpen={setOpenUnit} />}
      {view === "cases" && <CaseStudies plan={plan} scheme={scheme} now={now} onStudy={study} onOpen={setOpenUnit} subject={reading.subject} />}
      {view === "reading" && <ThisReading rows={rows} reading={reading} onStudy={study} onOpen={setOpenUnit} />}
      {view === "progress" && <Progress plan={plan} rows={rows} scheme={scheme} />}

      <HowItWorks />

      {openUnit && (
        <UnitDetail
          plan={plan}
          unit={openUnit}
          scheme={scheme}
          now={now}
          onReading={reading.keys.has(unitKey(openUnit.field.id, openUnit.variant))}
          subjectName={reading.subject?.name}
          onStudy={(caseIndex) => {
            study(openUnit.field, openUnit.variant, caseIndex);
            setOpenUnit(null);
          }}
          onClose={() => setOpenUnit(null)}
        />
      )}
    </div>
  );
}

// ── Study Path ─────────────────────────────────────────────────────────────

function UnitLine({
  row,
  note,
  onStudy,
  onOpen,
}: {
  row: { field: FieldDef; variant: string; n: number };
  note?: string;
  onStudy: () => void;
  onOpen: () => void;
}) {
  const mod = MODULES.find((m) => m.id === row.field.module);
  return (
    <div className="flex items-center gap-2 rounded-xl border border-white/[0.06] bg-white/[0.02] px-3 py-2">
      <button className="flex-1 min-w-0 text-left" onClick={onOpen}>
        <div className="text-[0.62rem] uppercase tracking-widest text-slate-500 font-cinzel truncate">
          {mod?.icon} {mod?.label} · {row.field.topic}
        </div>
        <div className="text-[0.8rem] text-slate-200 truncate">
          {row.field.label}
          {row.variant !== PRACTICE ? <span className="text-primary/80"> · {row.variant}</span> : null}
        </div>
        {note && <div className="text-[0.66rem] text-slate-500 truncate">{note}</div>}
      </button>
      <TierPill n={row.n} />
      <button
        data-no-reveal
        onClick={onStudy}
        className="rounded-lg bg-primary/15 border border-primary/40 text-primary text-[0.62rem] font-cinzel uppercase tracking-wider px-2.5 py-1.5"
      >
        Study
      </button>
    </div>
  );
}

function StudyPath({
  plan,
  rows,
  scheme,
  reading,
  now,
  onStudy,
  onOpen,
}: {
  plan: CurriculumPlan;
  rows: UnitRow[];
  scheme: SyllabusScheme;
  reading: ReturnType<typeof useReadingUnits>;
  now: Date;
  onStudy: (f: FieldDef, v: string, caseIndex?: number) => void;
  onOpen: (u: SyllabusUnit) => void;
}) {
  const byKey = React.useMemo(() => new Map(rows.map((r) => [r.key, r])), [rows]);
  const dueRows = rows
    .filter((r) => isDue(r.n, r.last))
    .sort((a, b) => (reviewDue(a.n, a.last) ?? 0) - (reviewDue(b.n, b.last) ?? 0))
    .slice(0, 8);
  const readingNew = (reading.units ?? [])
    .map((u) => byKey.get(unitKey(u.field.id, u.variant)))
    .filter((r): r is UnitRow => !!r && r.n === 0)
    .slice(0, 8);
  // The next case study with something unstudied, in path order (Family & Friends first).
  let nextCase = -1;
  let nextUnits: UnitRow[] = [];
  for (let i = 0; i < plan.cases.length && nextCase < 0; i++) {
    const pending = unitsOfCase(plan, i, now)
      .map((u) => byKey.get(unitKey(u.field.id, u.variant)))
      .filter((r): r is UnitRow => !!r && r.n === 0);
    if (pending.length) {
      nextCase = i;
      nextUnits = pending;
    }
  }
  const anyChart = rows.filter((r) => (r.field.kind === "library" || r.field.kind === "practice") && r.n === 0).slice(0, 6);
  const towardsMastery = rows
    .filter((r) => r.n > 0 && r.n < 7 && !isDue(r.n, r.last))
    .sort((a, b) => b.n - a.n || a.last - b.last)
    .slice(0, 5);
  const c = nextCase >= 0 ? plan.cases[nextCase] : null;
  const onThisCase = c && reading.subject && sameBirth(caseInput(c), reading.subject);

  return (
    <div className="space-y-5">
      {dueRows.length > 0 && (
        <Section title="Due for review" subtitle="Spaced repetition: each listen pushes the next review further out (1, 3, 7, 14, 30 … days).">
          {dueRows.map((r) => (
            <UnitLine key={r.key} row={r} note={`Last studied ${fmtDate(r.last)}`} onStudy={() => onStudy(r.field, r.variant)} onOpen={() => onOpen(r)} />
          ))}
        </Section>
      )}

      {reading.subject && readingNew.length > 0 && (
        <Section title={`New on ${reading.subject.name}'s reading`} subtitle="Already open — no need to switch birthdays.">
          {readingNew.map((r) => (
            <UnitLine key={r.key} row={r} note={r.field.where} onStudy={() => onStudy(r.field, r.variant)} onOpen={() => onOpen(r)} />
          ))}
        </Section>
      )}

      {c && (
        <Section
          title={`Next case study: ${c.n}`}
          subtitle={`${KIND_BADGE[c.k].label} · born ${c.d}/${c.m}/${c.y} · ${nextUnits.length} unit${nextUnits.length === 1 ? "" : "s"} still to study on this chart`}
        >
          {!onThisCase && (
            <button
              data-no-reveal
              onClick={() => onStudy(nextUnits[0].field, nextUnits[0].variant, nextCase)}
              className="w-full rounded-xl border border-primary/40 bg-primary/10 py-2.5 text-[0.7rem] font-cinzel uppercase tracking-widest text-primary"
            >
              Open {c.n}'s reading &amp; begin
            </button>
          )}
          {nextUnits.slice(0, 6).map((r) => (
            <UnitLine key={r.key} row={r} note={r.field.where} onStudy={() => onStudy(r.field, r.variant, nextCase)} onOpen={() => onOpen(r)} />
          ))}
        </Section>
      )}

      {anyChart.length > 0 && (
        <Section title="Study on any chart" subtitle="Library fields open every option from whichever reading you have open.">
          {anyChart.map((r) => (
            <UnitLine key={r.key} row={r} note={r.field.where} onStudy={() => onStudy(r.field, r.variant)} onOpen={() => onOpen(r)} />
          ))}
        </Section>
      )}

      {towardsMastery.length > 0 && (
        <Section title="Closest to the next tier" subtitle="Listen again to move these up the mastery ladder.">
          {towardsMastery.map((r) => {
            const nt = nextTier(r.n);
            return (
              <UnitLine
                key={r.key}
                row={r}
                note={nt ? `${nt.min - r.n} more listen${nt.min - r.n === 1 ? "" : "s"} to ${nt.label}` : undefined}
                onStudy={() => onStudy(r.field, r.variant)}
                onOpen={() => onOpen(r)}
              />
            );
          })}
        </Section>
      )}

      {!dueRows.length && !readingNew.length && !c && !anyChart.length && (
        <div className="glass-card p-6 text-center text-sm text-amber-200">
          🏆 Every unit of the syllabus has been studied at least once. Keep listening to raise each to Mastered ×7.
        </div>
      )}
      {scheme.log.length === 0 && (
        <p className="text-center text-[0.7rem] text-slate-500 px-4">
          Tip: tap <b>Study</b>, open the highlighted section, and press its Listen button. When the voice reaches the end, the unit is marked studied.
        </p>
      )}
    </div>
  );
}

function Section({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <div className="px-1">
        <h3 className="font-cinzel text-[0.75rem] uppercase tracking-[0.2em] text-primary">{title}</h3>
        {subtitle && <p className="text-[0.68rem] text-slate-500 leading-snug">{subtitle}</p>}
      </div>
      <div className="space-y-1.5">{children}</div>
    </div>
  );
}

// ── Syllabus ───────────────────────────────────────────────────────────────

function Syllabus({ plan, rows, now, onOpen }: { plan: CurriculumPlan; rows: UnitRow[]; now: Date; onOpen: (u: SyllabusUnit) => void }) {
  const [query, setQuery] = React.useState("");
  const [filter, setFilter] = React.useState<"all" | "new" | "studied" | "mastered">("all");
  const [openModule, setOpenModule] = React.useState<string | null>(null);
  const [openField, setOpenField] = React.useState<string | null>(null);
  const q = query.trim().toLowerCase();
  const byField = React.useMemo(() => {
    const m = new Map<string, UnitRow[]>();
    for (const r of rows) {
      const list = m.get(r.field.id) ?? [];
      list.push(r);
      m.set(r.field.id, list);
    }
    return m;
  }, [rows]);
  const keep = (r: UnitRow) =>
    (filter === "all" || (filter === "new" ? r.n === 0 : filter === "studied" ? r.n > 0 : r.n >= 7)) &&
    (!q || `${r.field.label} ${r.field.topic} ${r.variant} ${r.field.where}`.toLowerCase().includes(q));

  return (
    <div className="space-y-3">
      <div className="flex flex-col sm:flex-row gap-2">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search the syllabus — e.g. Rat, Life Path 7, Arrow, Pinnacle…"
          className="flex-1 rounded-xl bg-black/40 border border-white/10 px-3 py-2 text-[0.8rem] text-slate-200 placeholder:text-slate-600"
        />
        <div className="flex gap-1">
          {(["all", "new", "studied", "mastered"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded-lg px-2.5 py-1.5 text-[0.6rem] font-cinzel uppercase tracking-wider border ${
                filter === f ? "border-primary/40 bg-primary/15 text-primary" : "border-white/10 text-slate-400"
              }`}
            >
              {f === "new" ? "Not yet" : f}
            </button>
          ))}
        </div>
      </div>

      {MODULES.map((mod) => {
        const fields = FIELDS.filter((f) => f.module === mod.id);
        const modRows = fields.flatMap((f) => byField.get(f.id) ?? []);
        const visible = fields.filter((f) => (byField.get(f.id) ?? []).some(keep));
        if (!visible.length) return null;
        const isOpen = openModule === mod.id || !!q || filter !== "all";
        return (
          <div key={mod.id} className="glass-card overflow-hidden">
            <button className="w-full px-4 py-3 text-left space-y-2" onClick={() => setOpenModule(isOpen && !q ? null : mod.id)} aria-expanded={isOpen}>
              <div className="flex items-center gap-3">
                <span className="text-xl">{mod.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="font-cinzel text-[0.8rem] uppercase tracking-[0.15em] text-primary">{mod.label}</div>
                  <div className="text-[0.66rem] text-slate-500 truncate">{mod.blurb}</div>
                </div>
                <div className="text-right">
                  <div className="font-cinzel text-[0.8rem] text-slate-200">{pct(modRows.filter((r) => r.n > 0).length, modRows.length)}%</div>
                  <div className="text-[0.58rem] text-slate-500">
                    {modRows.filter((r) => r.n > 0).length}/{modRows.length}
                  </div>
                </div>
              </div>
              <TierBar counts={tierCounts(modRows)} total={modRows.length} />
            </button>
            {isOpen && (
              <div className="px-3 pb-3 space-y-2">
                {groupBy(visible, (f) => f.topic).map(([topic, tf]) => (
                  <div key={topic} className="space-y-1.5">
                    <div className="px-1 pt-1 text-[0.6rem] font-cinzel uppercase tracking-[0.25em] text-slate-500">{topic}</div>
                    {tf.map((field) => (
                      <FieldRow
                        key={field.id}
                        field={field}
                        plan={plan}
                        now={now}
                        rows={(byField.get(field.id) ?? []).filter(keep)}
                        allRows={byField.get(field.id) ?? []}
                        open={openField === field.id}
                        onToggle={() => setOpenField(openField === field.id ? null : field.id)}
                        onOpen={onOpen}
                      />
                    ))}
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function groupBy<T>(xs: T[], key: (x: T) => string): [string, T[]][] {
  const m = new Map<string, T[]>();
  for (const x of xs) {
    const k = key(x);
    m.set(k, [...(m.get(k) ?? []), x]);
  }
  return [...m.entries()];
}

function FieldRow({
  field,
  rows,
  allRows,
  open,
  onToggle,
  onOpen,
}: {
  field: FieldDef;
  plan: CurriculumPlan;
  now: Date;
  rows: UnitRow[];
  allRows: UnitRow[];
  open: boolean;
  onToggle: () => void;
  onOpen: (u: SyllabusUnit) => void;
}) {
  const done = allRows.filter((r) => r.n > 0).length;
  const total = allRows.length;
  const complete = total > 0 && done === total;
  return (
    <div className="rounded-xl border border-white/[0.06] bg-white/[0.02]">
      <button className="w-full px-3 py-2 text-left space-y-1.5" onClick={onToggle} aria-expanded={open}>
        <div className="flex items-center gap-2">
          <span className="text-[0.8rem] text-slate-200 flex-1 min-w-0 truncate">
            {complete ? "✓ " : ""}
            {field.label}
          </span>
          <span className="text-[0.62rem] text-slate-500 whitespace-nowrap">
            {done}/{total} {field.kind === "practice" ? "" : total === 1 ? "unit" : "units"}
          </span>
          {field.kind === "practice" && <TierPill n={allRows[0]?.n ?? 0} />}
        </div>
        <TierBar counts={tierCounts(allRows)} total={total} />
      </button>
      {open && (
        <div className="px-3 pb-3 space-y-2">
          <p className="text-[0.66rem] text-slate-500 leading-snug">
            {field.blurb} <span className="text-slate-600">· {field.where}</span>
            <br />
            <span className="text-slate-600 italic">{KIND_NOTE[field.kind]}</span>
          </p>
          <div className="flex flex-wrap gap-1.5">
            {rows.map((r) => {
              const t = tierOf(r.n);
              return (
                <button
                  key={r.key}
                  onClick={() => onOpen(r)}
                  className="rounded-lg px-2 py-1 text-[0.66rem] border transition-colors"
                  style={{ color: r.n ? t.color : "rgba(203,213,225,0.75)", borderColor: r.n ? `${t.color}66` : "rgba(255,255,255,0.1)", background: r.n ? `${t.color}12` : "transparent" }}
                  title={`${t.label}${r.n ? ` · last ${fmtDate(r.last)}` : ""}`}
                >
                  {r.variant === PRACTICE ? "Practise on any chart" : r.variant}
                  {r.n > 0 && <b className="ml-1">×{r.n}</b>}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Case studies ───────────────────────────────────────────────────────────

function CaseStudies({
  plan,
  scheme,
  now,
  subject,
  onStudy,
  onOpen,
}: {
  plan: CurriculumPlan;
  scheme: SyllabusScheme;
  now: Date;
  subject: ReturnType<typeof useSubject>;
  onStudy: (f: FieldDef, v: string, caseIndex?: number) => void;
  onOpen: (u: SyllabusUnit) => void;
}) {
  const [kind, setKind] = React.useState<"all" | "family" | "vault" | "practice">("all");
  const [query, setQuery] = React.useState("");
  const [open, setOpen] = React.useState<number | null>(null);
  const caseUnits = React.useMemo(() => plan.cases.map((_, i) => unitsOfCase(plan, i, now)), [plan, now]);
  const q = query.trim().toLowerCase();
  const list = plan.cases
    .map((c, i) => ({ c, i }))
    .filter(({ c }) => kind === "all" || (kind === "family" ? c.k === "family" || c.k === "circle" : c.k === kind))
    .filter(({ c }) => !q || `${c.n} ${c.t}`.toLowerCase().includes(q));

  return (
    <div className="space-y-3">
      <p className="text-[0.7rem] text-slate-500 px-1 leading-relaxed">
        Together these {plan.cases.length} birthdays show every one of the {plan.stats.units.toLocaleString()} chart units in the app. Family &amp; Friends come first; famous
        birthdays were then chosen from the {plan.stats.vaultCharts.toLocaleString()} in the search bank to fill every remaining gap, and a few practice birthdays cover
        the rare combinations no one in the bank has.
      </p>
      <div className="flex flex-col sm:flex-row gap-2">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Find a case study…"
          className="flex-1 rounded-xl bg-black/40 border border-white/10 px-3 py-2 text-[0.8rem] text-slate-200 placeholder:text-slate-600"
        />
        <div className="flex gap-1">
          {(
            [
              ["all", "All"],
              ["family", "Family & Friends"],
              ["vault", "Famous"],
              ["practice", "Practice"],
            ] as const
          ).map(([k, label]) => (
            <button
              key={k}
              onClick={() => setKind(k)}
              className={`rounded-lg px-2.5 py-1.5 text-[0.6rem] font-cinzel uppercase tracking-wider border whitespace-nowrap ${
                kind === k ? "border-primary/40 bg-primary/15 text-primary" : "border-white/10 text-slate-400"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
      <div className="space-y-1.5">
        {list.map(({ c, i }) => {
          const units = caseUnits[i];
          const counts = units.map((u) => unitCount(scheme, u.field.id, u.variant));
          const done = counts.filter((n) => n > 0).length;
          const isOpen = open === i;
          const current = subject && sameBirth(caseInput(c), subject);
          const badge = KIND_BADGE[c.k];
          return (
            <div key={i} className={`rounded-xl border ${current ? "border-primary/40 bg-primary/[0.06]" : "border-white/[0.06] bg-white/[0.02]"}`}>
              <div className="flex items-center gap-2 px-3 py-2">
                <button className="flex-1 min-w-0 text-left" onClick={() => setOpen(isOpen ? null : i)} aria-expanded={isOpen}>
                  <div className="flex items-center gap-2">
                    <span className="text-[0.62rem] text-slate-600 font-cinzel w-7">#{i + 1}</span>
                    <span className="text-[0.82rem] text-slate-200 truncate">{c.n}</span>
                    {current && <span className="text-[0.55rem] font-cinzel uppercase text-primary">open</span>}
                  </div>
                  <div className="flex items-center gap-2 pl-9">
                    <span className="text-[0.6rem]" style={{ color: badge.color }}>
                      {badge.label}
                    </span>
                    <span className="text-[0.6rem] text-slate-500 truncate">
                      {c.d}/{c.m}/{c.y}
                      {c.k !== "practice" && c.t ? ` · ${c.t}` : ""}
                    </span>
                  </div>
                  <div className="pl-9 pt-1">
                    <TierBar counts={tierCounts(counts.map((n) => ({ n })))} total={units.length} />
                  </div>
                </button>
                <span className="text-[0.62rem] text-slate-400 whitespace-nowrap">
                  {done}/{units.length}
                </span>
                <button
                  data-no-reveal
                  onClick={() => {
                    const first = units.find((u, k) => counts[k] === 0) ?? units[0];
                    if (first) onStudy(first.field, first.variant, i);
                  }}
                  className="rounded-lg bg-primary/15 border border-primary/40 text-primary text-[0.6rem] font-cinzel uppercase tracking-wider px-2.5 py-1.5"
                >
                  {current ? "Study" : "Open"}
                </button>
              </div>
              {isOpen && (
                <div className="px-3 pb-3 space-y-1">
                  {groupBy(
                    units.map((u, k) => ({ ...u, n: counts[k] })),
                    (u) => MODULES.find((m) => m.id === u.field.module)?.label ?? "",
                  ).map(([modLabel, us]) => (
                    <div key={modLabel} className="space-y-1">
                      <div className="pt-1 text-[0.58rem] font-cinzel uppercase tracking-[0.25em] text-slate-500">
                        {modLabel} · {us.filter((u) => u.n > 0).length}/{us.length}
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {us.map((u) => {
                          const t = tierOf(u.n);
                          return (
                            <button
                              key={unitKey(u.field.id, u.variant)}
                              onClick={() => onOpen(u)}
                              className="rounded-md px-1.5 py-0.5 text-[0.6rem] border"
                              style={{ color: u.n ? t.color : "rgba(203,213,225,0.7)", borderColor: u.n ? `${t.color}55` : "rgba(255,255,255,0.08)" }}
                            >
                              {u.field.label}: {u.variant}
                              {u.n > 0 ? ` ×${u.n}` : ""}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── This reading ───────────────────────────────────────────────────────────

function ThisReading({
  rows,
  reading,
  onStudy,
  onOpen,
}: {
  rows: UnitRow[];
  reading: ReturnType<typeof useReadingUnits>;
  onStudy: (f: FieldDef, v: string) => void;
  onOpen: (u: SyllabusUnit) => void;
}) {
  const byKey = React.useMemo(() => new Map(rows.map((r) => [r.key, r])), [rows]);
  if (!reading.subject) return <div className="glass-card p-6 text-center text-sm text-slate-400">Open a reading to see what it teaches.</div>;
  if (!reading.units) return <div className="py-10 text-center text-xs uppercase tracking-[0.3em] text-primary/60 font-cinzel">Reading the chart…</div>;
  const list = reading.units
    .filter((u) => u.field.kind !== "library")
    .map((u) => byKey.get(unitKey(u.field.id, u.variant)) ?? { ...u, key: unitKey(u.field.id, u.variant), n: 0, last: 0 });
  const done = list.filter((r) => r.n > 0).length;
  return (
    <div className="space-y-3">
      <div className="glass-card p-4 space-y-2">
        <div className="flex items-center justify-between">
          <div>
            <div className="font-cinzel text-[0.8rem] text-primary uppercase tracking-widest">{reading.subject.name}</div>
            <div className="text-[0.66rem] text-slate-500">
              {reading.subject.day}/{reading.subject.month}/{reading.subject.year} · {list.length} personal units (plus every library field)
            </div>
          </div>
          <div className="font-cinzel text-lg text-slate-200">{pct(done, list.length)}%</div>
        </div>
        <TierBar counts={tierCounts(list)} total={list.length} />
      </div>
      {MODULES.map((mod) => {
        const us = list.filter((r) => r.field.module === mod.id);
        if (!us.length) return null;
        return (
          <Section key={mod.id} title={`${mod.icon} ${mod.label}`} subtitle={`${us.filter((r) => r.n > 0).length} of ${us.length} studied`}>
            {us.map((r) => (
              <UnitLine key={r.key} row={r} note={r.field.where} onStudy={() => onStudy(r.field, r.variant)} onOpen={() => onOpen(r)} />
            ))}
          </Section>
        );
      })}
    </div>
  );
}

// ── Progress ───────────────────────────────────────────────────────────────

function download(name: string, text: string, type = "application/json") {
  const url = URL.createObjectURL(new Blob([text], { type }));
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 2000);
}

function schemeReport(plan: CurriculumPlan, rows: UnitRow[]): string {
  const out: string[] = [];
  const studied = rows.filter((r) => r.n > 0).length;
  out.push("MYSTIQUE COMPASS — CURRICULUM SYLLABUS SCHEME", `Exported ${new Date().toLocaleString()}`, "");
  out.push(`Studied ${studied} of ${rows.length} units (${pct(studied, rows.length)}%) · Mastered ×7: ${rows.filter((r) => r.n >= 7).length}`, "");
  for (const mod of MODULES) {
    const fields = FIELDS.filter((f) => f.module === mod.id);
    out.push(`══ ${mod.label.toUpperCase()} ══`);
    for (const f of fields) {
      const fr = rows.filter((r) => r.field.id === f.id);
      out.push(`  ${f.label} — ${fr.filter((r) => r.n > 0).length}/${fr.length}  (${f.where})`);
      for (const r of fr) out.push(`     ${r.n > 0 ? "✓" : "○"} ${r.variant === PRACTICE ? "Practice" : r.variant}${r.n ? `  ×${r.n} ${tierOf(r.n).label} · last ${fmtDate(r.last)}` : ""}`);
    }
    out.push("");
  }
  out.push("CASE STUDIES", ...plan.cases.map((c, i) => `  ${i + 1}. ${caseLabel(c)} — ${KIND_BADGE[c.k].label}`));
  return out.join("\n");
}

function Progress({ plan, rows, scheme }: { plan: CurriculumPlan; rows: UnitRow[]; scheme: SyllabusScheme }) {
  const act = activity(scheme, Date.now());
  const fileRef = React.useRef<HTMLInputElement>(null);
  const [msg, setMsg] = React.useState<string | null>(null);
  const max = Math.max(1, ...act.last14.map((d) => d.n));
  const recent = [...scheme.log].reverse().slice(0, 25);
  return (
    <div className="space-y-4">
      <div className="glass-card p-4 space-y-3">
        <h3 className="font-cinzel text-[0.75rem] uppercase tracking-[0.2em] text-primary">Last 14 days</h3>
        <div className="flex items-end gap-1 h-24">
          {act.last14.map((d) => (
            <div key={d.day} className="flex-1 flex flex-col items-center gap-1" title={`${d.day}: ${d.n}`}>
              <div className="w-full rounded-t bg-emerald-400/70" style={{ height: `${(d.n / max) * 80}px`, minHeight: d.n ? 3 : 0 }} />
              <span className="text-[0.5rem] text-slate-600">{d.day.slice(8)}</span>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-3 gap-2 text-center">
          <Stat label="Total listens" value={act.totalListens} />
          <Stat label="Day streak" value={act.streak} />
          <Stat label="Since" value={fmtDate(scheme.started)} />
        </div>
        <label className="flex items-center justify-between gap-2 text-[0.72rem] text-slate-300">
          Daily goal (listens)
          <input
            type="number"
            min={1}
            max={200}
            value={scheme.dailyGoal}
            onChange={(e) => syllabus.setDailyGoal(Number(e.target.value) || 1)}
            className="w-20 rounded-lg bg-black/40 border border-white/10 px-2 py-1 text-right"
          />
        </label>
      </div>

      <div className="glass-card p-4 space-y-2">
        <h3 className="font-cinzel text-[0.75rem] uppercase tracking-[0.2em] text-primary">Mastery ladder</h3>
        {TIERS.map((t) => {
          const n = rows.filter((r) => tierOf(r.n).id === t.id).length;
          return (
            <div key={t.id} className="flex items-center gap-2 text-[0.72rem]">
              <span className="w-32 font-cinzel uppercase tracking-wider text-[0.6rem]" style={{ color: t.color }}>
                {t.label}
              </span>
              <div className="flex-1 h-2 rounded-full bg-white/5 overflow-hidden">
                <div style={{ width: `${pct(n, rows.length)}%`, background: t.color }} className="h-full" />
              </div>
              <span className="w-12 text-right text-slate-400">{n}</span>
            </div>
          );
        })}
      </div>

      <div className="glass-card p-4 space-y-2">
        <h3 className="font-cinzel text-[0.75rem] uppercase tracking-[0.2em] text-primary">Recently studied</h3>
        {recent.length === 0 && <p className="text-[0.72rem] text-slate-500">Nothing yet — your studies will be listed here.</p>}
        {recent.map((e, k) => {
          const f = FIELD_BY_ID.get(e.f);
          return (
            <div key={k} className="flex items-center gap-2 text-[0.7rem] border-b border-white/[0.04] pb-1">
              <span className="text-slate-600 w-20 shrink-0">{new Date(e.t).toLocaleDateString(undefined, { day: "numeric", month: "short" })}</span>
              <span className="flex-1 min-w-0 truncate text-slate-300">
                {f?.label ?? e.f}
                {e.v !== PRACTICE ? ` · ${e.v}` : ""}
                {e.who ? <span className="text-slate-600"> — {e.who}</span> : null}
              </span>
              <span className="text-slate-500">×{e.n}</span>
            </div>
          );
        })}
      </div>

      <div className="glass-card p-4 space-y-2">
        <h3 className="font-cinzel text-[0.75rem] uppercase tracking-[0.2em] text-primary">Keep your Syllabus Scheme</h3>
        <p className="text-[0.68rem] text-slate-500">Progress is saved on this device. Export it to back it up or move it to another phone.</p>
        <div className="flex flex-wrap gap-2">
          <Btn onClick={() => download(`curriculum-progress-${new Date().toISOString().slice(0, 10)}.json`, syllabus.export())}>Export progress</Btn>
          <Btn onClick={() => fileRef.current?.click()}>Import progress</Btn>
          <Btn onClick={() => download(`syllabus-scheme-${new Date().toISOString().slice(0, 10)}.txt`, schemeReport(plan, rows), "text/plain")}>Download report</Btn>
          <Btn
            danger
            onClick={() => {
              if (window.confirm("Clear all Curriculum progress on this device? Export first if you may want it back.")) syllabus.reset();
            }}
          >
            Reset
          </Btn>
        </div>
        <input
          ref={fileRef}
          type="file"
          accept="application/json,.json"
          className="hidden"
          onChange={async (e) => {
            const file = e.target.files?.[0];
            e.target.value = "";
            if (!file) return;
            try {
              const r = syllabus.import(await file.text(), "merge");
              setMsg(`Imported — merged ${r.units} studied units.`);
            } catch (err) {
              setMsg((err as Error).message || "Couldn't read that file.");
            }
          }}
        />
        {msg && <p className="text-[0.7rem] text-emerald-300">{msg}</p>}
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="rounded-lg bg-white/[0.03] border border-white/[0.06] py-2">
      <div className="font-cinzel text-[0.9rem] text-slate-200">{value}</div>
      <div className="text-[0.55rem] uppercase tracking-widest text-slate-500">{label}</div>
    </div>
  );
}

function Btn({ children, onClick, danger }: { children: React.ReactNode; onClick: () => void; danger?: boolean }) {
  return (
    <button
      data-no-reveal
      onClick={onClick}
      className={`rounded-lg border px-3 py-1.5 text-[0.62rem] font-cinzel uppercase tracking-wider ${
        danger ? "border-rose-500/40 text-rose-300 bg-rose-500/10" : "border-primary/30 text-primary bg-primary/10"
      }`}
    >
      {children}
    </button>
  );
}

// ── Unit detail ────────────────────────────────────────────────────────────

function UnitDetail({
  plan,
  unit,
  scheme,
  now,
  onReading,
  subjectName,
  onStudy,
  onClose,
}: {
  plan: CurriculumPlan;
  unit: SyllabusUnit;
  scheme: SyllabusScheme;
  now: Date;
  onReading: boolean;
  subjectName?: string;
  onStudy: (caseIndex?: number) => void;
  onClose: () => void;
}) {
  const { field, variant } = unit;
  const n = unitCount(scheme, field.id, variant);
  const last = unitLast(scheme, field.id, variant);
  const parts = partCounts(scheme, field, variant);
  const who = unitWho(scheme, field.id, variant);
  const cases = casesForUnit(plan, field, variant, now);
  const due = reviewDue(n, last);
  const nt = nextTier(n);
  const mod: ModuleDef | undefined = MODULES.find((m) => m.id === field.module);
  const anyChart = field.kind === "library" || field.kind === "practice";
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);
  return (
    <div className="fixed inset-0 z-[70] flex items-end sm:items-center justify-center bg-black/70 p-3" onClick={onClose} data-tts-skip>
      <div
        role="dialog"
        aria-label={field.label}
        className="w-full max-w-lg max-h-[85vh] overflow-y-auto rounded-2xl border border-primary/25 bg-slate-950 p-5 space-y-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start gap-3">
          <div className="flex-1">
            <div className="text-[0.6rem] font-cinzel uppercase tracking-[0.25em] text-slate-500">
              {mod?.icon} {mod?.label} · {field.topic}
            </div>
            <h3 className="font-cinzel text-[0.95rem] text-primary">{field.label}</h3>
            {variant !== PRACTICE && <div className="text-[0.85rem] text-slate-200">{variant}</div>}
          </div>
          <button onClick={onClose} aria-label="Close" className="text-slate-500 text-lg leading-none">
            ✕
          </button>
        </div>
        <p className="text-[0.72rem] text-slate-400 leading-relaxed">
          {field.blurb}
          <br />
          <span className="text-slate-500">Where: {field.where}</span>
          <br />
          <span className="text-slate-600 italic">{KIND_NOTE[field.kind]}</span>
        </p>

        <div className="flex flex-wrap items-center gap-2">
          <TierPill n={n} />
          {nt && <span className="text-[0.66rem] text-slate-500">{nt.min - n} more full listen{nt.min - n === 1 ? "" : "s"} to {nt.label}</span>}
        </div>

        {parts.length > 1 && (
          <div className="space-y-1">
            <div className="text-[0.6rem] font-cinzel uppercase tracking-[0.2em] text-slate-500">Passages</div>
            {parts.map((p) => (
              <div key={p.id} className="flex items-center justify-between text-[0.72rem] text-slate-300">
                <span>
                  {p.label}
                  {p.optional ? <span className="text-slate-600"> (when shown)</span> : null}
                </span>
                <span style={{ color: tierOf(p.n).color }}>{p.n ? `×${p.n}` : "○"}</span>
              </div>
            ))}
          </div>
        )}

        <div className="grid grid-cols-2 gap-2 text-[0.68rem]">
          <Stat label="Last studied" value={fmtDate(last)} />
          <Stat label="Next review" value={due ? (due <= Date.now() ? "Due now" : fmtDate(due)) : "—"} />
        </div>
        {who.length > 0 && <p className="text-[0.66rem] text-slate-500">Studied on: {who.join(", ")}</p>}

        <div className="space-y-2">
          {(anyChart || onReading) && (
            <button
              data-no-reveal
              onClick={() => onStudy()}
              className="w-full rounded-xl border border-primary/40 bg-primary/15 py-2.5 text-[0.7rem] font-cinzel uppercase tracking-widest text-primary"
            >
              Study it on {subjectName ? `${subjectName}'s` : "this"} reading
            </button>
          )}
          {cases.length > 0 && (
            <>
              <div className="text-[0.6rem] font-cinzel uppercase tracking-[0.2em] text-slate-500">
                {field.kind === "temporal" ? "Shown today on" : "Case studies that teach it"} ({cases.length})
              </div>
              <div className="flex flex-wrap gap-1.5">
                {cases.slice(0, 12).map((ci) => {
                  const c = plan.cases[ci];
                  return (
                    <button
                      key={ci}
                      data-no-reveal
                      onClick={() => onStudy(ci)}
                      className="rounded-lg border px-2 py-1 text-[0.66rem]"
                      style={{ borderColor: `${KIND_BADGE[c.k].color}55`, color: KIND_BADGE[c.k].color }}
                    >
                      {c.n}
                    </button>
                  );
                })}
                {cases.length > 12 && <span className="text-[0.62rem] text-slate-600 self-center">+{cases.length - 12} more</span>}
              </div>
            </>
          )}
          {!anyChart && !onReading && cases.length === 0 && (
            <p className="text-[0.7rem] text-slate-500">
              {fieldUniverse(field, plan, now).length ? "No case study shows this today — it comes round as the dates change." : "Not available."}
            </p>
          )}
        </div>
        <p className="text-[0.62rem] text-slate-600">
          How to study: tap a button above, open the highlighted section ({partsOf(field, variant).length > 1 ? "each of its passages" : "its passage"}) and press Listen. It
          counts when the voice reaches the end.
        </p>
      </div>
    </div>
  );
}

function HowItWorks() {
  const [open, setOpen] = React.useState(false);
  return (
    <div className="glass-card overflow-hidden">
      <button className="w-full px-4 py-3 text-left font-cinzel text-[0.7rem] uppercase tracking-[0.2em] text-slate-400" onClick={() => setOpen((v) => !v)} aria-expanded={open}>
        ❔ How the Curriculum works
      </button>
      {open && (
        <div className="px-4 pb-4 space-y-2 text-[0.72rem] text-slate-400 leading-relaxed">
          <p>
            <b className="text-slate-200">Units.</b> Every field of the app is broken into units — one for each thing it can say: each animal, each Life Path, each arrow, each
            line level, each Tai Sui year type… The Syllabus Scheme lists them all, grouped by tab and topic.
          </p>
          <p>
            <b className="text-slate-200">Studying.</b> Tap <i>Study</i>: the right birthday opens, the right tab is chosen and the section is highlighted. Open it and press
            Listen. When the voice reaches the end of the passage (skipping through doesn't count), the unit is marked studied. Fields with several passages (an arrow's five
            layers, a line's meanings…) count once every passage has been heard.
          </p>
          <p>
            <b className="text-slate-200">Mastery.</b> Each further full listen raises the count: ×1 Studied, ×2 Reviewed, ×3 Reinforced, ×5 Fluent, ×7 Mastered, ×12 Sage.
            Reviews are spaced out (1, 3, 7, 14, 30, 60, 120 days) and come back on the Study Path when due.
          </p>
          <p>
            <b className="text-slate-200">Kinds of field.</b> Chart fields differ by birthday, so the case studies were chosen to show every one. Library fields can be opened
            in full from any reading. Date fields (personal year, month, critical years) change with time. Practice fields are personal to every chart and are mastered by
            studying them on many people.
          </p>
          <p>
            <b className="text-slate-200">Your progress</b> stays on this device; export it from Progress to keep a copy. Opening a case study doesn't add it to your History.
          </p>
        </div>
      )}
    </div>
  );
}
