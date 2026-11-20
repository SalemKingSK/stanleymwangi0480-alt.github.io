/**
 * MYSTIQUE COMPASS — Temporal Prediction Display
 * Integrates the 14-Layer Temporal Prediction Engine v2
 * Placed under Cosmic Personal Synthesis — collapsible sections with listen buttons
 */

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  generateTemporalPrediction,
  generateMonthlyBreakdown,
  generateMultiYearForecast,
  type TemporalPredictionV2,
  type DailyForecast,
} from '@/lib/temporal-prediction-engine-v2';
import { AccordionContentWithPlayer } from './accordion-content-with-player';
import { ChevronDown, Clock } from 'lucide-react';

// ─── helpers ──────────────────────────────────────────────────────────────────
function PillBadge({ children, color }: { children: React.ReactNode; color: string }) {
  return (
    <span style={{
      display: 'inline-block',
      fontSize: '0.7rem',
      fontFamily: "'Cinzel',serif",
      letterSpacing: '0.1em',
      textTransform: 'uppercase' as const,
      padding: '2px 8px',
      borderRadius: 999,
      background: `${color}22`,
      color,
      border: `1px solid ${color}44`,
      marginRight: '0.3rem',
      marginBottom: '0.25rem',
    }}>
      {children}
    </span>
  );
}

function ScoreBar({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div style={{ marginBottom: '0.55rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
        <span style={{ fontSize: '0.7rem', color: 'rgba(210,195,250,0.65)', fontFamily: "'Cinzel',serif", letterSpacing: '0.08em', textTransform: 'uppercase' as const }}>{label}</span>
        <span style={{ fontSize: '0.7rem', color, fontWeight: 700, fontFamily: "'Cinzel',serif" }}>{value}</span>
      </div>
      <div style={{ height: 3, background: 'rgba(255,255,255,0.06)', borderRadius: 99, overflow: 'hidden' }}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 1.2, ease: [0.23, 1, 0.32, 1], delay: 0.1 }}
          style={{ height: '100%', background: `linear-gradient(90deg, ${color}88, ${color})`, borderRadius: 99 }}
        />
      </div>
    </div>
  );
}

// ─── Collapsible Section with Listen Button ──────────────────────────────────
function TemporalSection({
  icon, title, subtitle, children, text, defaultOpen = false,
}: {
  icon: string;
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
  text?: string;          // when provided, AccordionContentWithPlayer is used (listen button)
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = React.useState(defaultOpen);

  return (
    <div style={{
      borderRadius: '0.75rem',
      overflow: 'hidden',
      border: '1px solid rgba(212,175,55,0.1)',
      background: 'rgba(255,255,255,0.02)',
      marginBottom: '0.6rem',
    }}>
      {/* clickable header */}
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0.75rem 1rem',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          gap: '0.5rem',
          textAlign: 'left' as const,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '1rem', flexShrink: 0 }}>{icon}</span>
          <div>
            <div style={{
              fontFamily: "'Cinzel',serif",
              fontSize: '0.7rem',
              fontWeight: 700,
              letterSpacing: '0.15em',
              textTransform: 'uppercase' as const,
              color: 'rgba(212,175,55,0.85)',
            }}>{title}</div>
            {subtitle && (
              <div style={{
                fontSize: '0.7rem',
                color: 'rgba(210,195,250,0.4)',
                fontFamily: "'Cormorant Garamond',serif",
                fontStyle: 'italic',
                marginTop: '0.1rem',
              }}>{subtitle}</div>
            )}
          </div>
        </div>
        <ChevronDown
          style={{
            color: 'rgba(212,175,55,0.4)',
            width: 14,
            height: 14,
            flexShrink: 0,
            transform: open ? 'rotate(180deg)' : 'none',
            transition: 'transform 0.3s',
          }}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.35, ease: [0.23, 1, 0.32, 1] }}
            style={{ padding: '0 1rem 1rem' }}
          >
            {/* If text is provided, wrap with listen button; otherwise render children */}
            {text ? <AccordionContentWithPlayer text={text} /> : children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Today Card ───────────────────────────────────────────────────────────────
function TodayCard({ today }: { today: DailyForecast }) {
  const bgColor = today.isPowerWindow
    ? 'rgba(52,211,153,0.08)'
    : today.avoidMajorDecisions
    ? 'rgba(239,68,68,0.07)'
    : 'rgba(167,139,250,0.06)';
  const borderColor = today.isPowerWindow
    ? 'rgba(52,211,153,0.22)'
    : today.avoidMajorDecisions
    ? 'rgba(239,68,68,0.2)'
    : 'rgba(167,139,250,0.15)';

  const todayText = [
    `Personal Day ${today.personalDay}. ${today.dayOfWeek}, ${today.date}.`,
    today.isPowerWindow ? 'Power Window active.' : '',
    today.isLuckyDay ? 'Lucky day.' : '',
    today.isLuckyDate ? 'Lucky date.' : '',
    today.avoidMajorDecisions ? 'Tread softly — avoid major decisions.' : '',
    today.shortNarrative,
    today.focus ? `Focus: ${today.focus}` : '',
  ].filter(Boolean).join(' ');

  return (
    <div style={{ padding: '0.75rem', borderRadius: '0.6rem', background: bgColor, border: `1px solid ${borderColor}`, marginBottom: '0.6rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
        <div>
          <p style={{ margin: 0, fontSize: '0.7rem', fontFamily: "'Cinzel',serif", letterSpacing: '0.15em', textTransform: 'uppercase' as const, color: 'rgba(212,175,55,0.7)' }}>
            Today · {today.dayOfWeek}
          </p>
          <p style={{ margin: 0, fontSize: '0.7rem', color: 'rgba(210,195,250,0.5)' }}>{today.date}</p>
        </div>
        <div style={{ textAlign: 'right' as const }}>
          <div style={{ fontSize: '1.4rem', fontFamily: "'Cinzel',serif", color: '#d4af37', fontWeight: 700, lineHeight: 1 }}>{today.personalDay}</div>
          <div style={{ fontSize: '0.62rem', color: 'rgba(212,175,55,0.5)', fontFamily: "'Cinzel',serif", letterSpacing: '0.1em', textTransform: 'uppercase' as const }}>Personal Day</div>
        </div>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: '0.25rem', marginBottom: '0.5rem' }}>
        {today.isPowerWindow && <PillBadge color="#34d399">⚡ Power Window</PillBadge>}
        {today.isLuckyDay && <PillBadge color="#a78bfa">✦ Lucky Day</PillBadge>}
        {today.isLuckyDate && <PillBadge color="#60a5fa">◈ Lucky Date</PillBadge>}
        {today.avoidMajorDecisions && <PillBadge color="#f87171">⚠ Tread Softly</PillBadge>}
      </div>
      <AccordionContentWithPlayer text={todayText} />
    </div>
  );
}

// ─── local PY lookup tables (mirrors engine data, kept here for display use) ──
const PY_TITLES_LOCAL: Record<number, string> = {
  1:'Year of Beginnings', 2:'Year of Patience', 3:'Year of Expression',
  4:'Year of Foundation', 5:'Year of Change', 6:'Year of the Heart',
  7:'Year of the Soul', 8:'Year of Power', 9:'Year of Completion',
};
const PY_ONE_LINERS_LOCAL: Record<number, string> = {
  1:'Launch, begin, and seize your independent initiative.',
  2:'Slow down, ally-build, and develop relational intelligence.',
  3:'Speak, create, and expand your social and creative reach.',
  4:'Systematize, build, and endure the productive grind.',
  5:'Embrace necessary change and resist premature anchoring.',
  6:'Heal relationships, invest in home and heart, and serve.',
  7:'Retreat, study deeply, and trust your inner guidance.',
  8:'Harvest what you have earned and claim rightful authority.',
  9:'Complete, release, forgive, and clear the decks.',
};
const PY_CAREER_LOCAL: Record<number, string> = {
  1:'The PY 1 field strongly favors new ventures, independent initiatives, and breaking from institutional dependency. Collaborations requiring you to subordinate your vision will stall — prefer the solo or founder role.',
  2:'Advancement comes from behind the scenes. The PY 2 rewards patience, alliance-building, and detail work. Do not force promotions or launches — use this year to position yourself for the PY 3 breakthrough.',
  3:'Visibility is your career asset this year. Speaking, writing, presenting, and creative output all attract disproportionate reward.',
  4:'The year of building systems and enduring the grind. No shortcuts will hold. Establish processes, document work, and accept that invisible daily effort is the currency of durable success.',
  5:'Multiple opportunities will arrive and depart with unusual speed. Change of role, sector, or location is highly favored.',
  6:'Career advances through service and relationship. Leadership by nurturing is the winning mode.',
  7:'Career progresses through deep specialization. Research, mastery, and the courage to go deep into a narrow field is the winning strategy. Avoid high-profile launches.',
  8:'The harvest year. Promotions, major contracts, and authority assignments cluster here for those who have built their foundation.',
  9:'Let what is finished be finished. End ventures that have no more yield. Legacy work — books, final projects, culminating achievements — flourishes in the Year 9.',
};

// ─── Three-Year Arc visual ────────────────────────────────────────────────────
function ThreeYearArcGrid({ arc }: { arc: TemporalPredictionV2['threeYearArc'] }) {
  const [selectedKey, setSelectedKey] = React.useState<'last'|'this'|'next'|'after'>('this');

  const lastPy = arc.thisYear.py - 1 < 1 ? 9 : arc.thisYear.py - 1;
  const years: Array<{
    key: 'last'|'this'|'next'|'after';
    label: string;
    data: { py: number; title: string; one_line: string };
    highlight?: boolean;
    dimmed?: boolean;
  }> = [
    { key: 'last',  label: 'Last Year',  data: { py: lastPy, title: PY_TITLES_LOCAL[lastPy] || '', one_line: PY_ONE_LINERS_LOCAL[lastPy] || '' }, dimmed: true },
    { key: 'this',  label: 'This Year',  data: arc.thisYear,  highlight: true },
    { key: 'next',  label: 'Next Year',  data: arc.nextYear },
    { key: 'after', label: 'Year After', data: arc.yearAfter, dimmed: true },
  ];

  const selected = years.find(y => y.key === selectedKey)!;
  const selectedText = [
    selected.data.title ? `PY ${selected.data.py} — ${selected.data.title}.` : `PY ${selected.data.py}.`,
    selected.data.one_line,
    selectedKey === 'this' ? arc.arcSummary : '',
    PY_CAREER_LOCAL[selected.data.py] || '',
  ].filter(Boolean).join(' ');

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.4rem', marginBottom: '0.75rem' }}>
        {years.map((y) => {
          const isSelected = y.key === selectedKey;
          return (
            <button
              key={y.key}
              onClick={() => setSelectedKey(y.key)}
              style={{
                textAlign: 'center' as const,
                padding: '0.55rem 0.3rem',
                borderRadius: '0.6rem',
                background: isSelected
                  ? y.highlight ? 'rgba(212,175,55,0.18)' : 'rgba(167,139,250,0.14)'
                  : y.highlight ? 'rgba(212,175,55,0.07)' : 'rgba(255,255,255,0.02)',
                border: isSelected
                  ? y.highlight ? '2px solid rgba(212,175,55,0.7)' : '2px solid rgba(167,139,250,0.55)'
                  : y.highlight ? '1px solid rgba(212,175,55,0.28)' : '1px solid rgba(255,255,255,0.05)',
                opacity: y.dimmed && !isSelected ? 0.45 : 1,
                cursor: 'pointer',
                transition: 'all 0.2s',
                boxShadow: isSelected ? (y.highlight ? '0 0 10px rgba(212,175,55,0.2)' : '0 0 10px rgba(167,139,250,0.15)') : 'none',
              }}
            >
              <div style={{ fontSize: '1.2rem', fontFamily: "'Cinzel',serif", color: isSelected ? (y.highlight ? '#d4af37' : '#a78bfa') : y.highlight ? '#d4af37' : 'rgba(210,195,250,0.7)', fontWeight: 700, lineHeight: 1 }}>{y.data.py}</div>
              <div style={{ fontSize: '0.62rem', color: isSelected ? (y.highlight ? '#d4af37' : '#a78bfa') : 'rgba(212,175,55,0.6)', fontFamily: "'Cinzel',serif", letterSpacing: '0.08em', textTransform: 'uppercase' as const, margin: '0.2rem 0' }}>{y.label}</div>
              {y.data.title && <div style={{ fontSize: '0.62rem', color: isSelected ? 'rgba(210,195,250,0.85)' : 'rgba(210,195,250,0.45)', lineHeight: 1.3 }}>{y.data.title}</div>}
            </button>
          );
        })}
      </div>

      {/* Selected year detail panel */}
      <AnimatePresence mode="wait">
        <motion.div
          key={selectedKey}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.25 }}
          style={{
            padding: '0.65rem 0.75rem',
            borderRadius: '0.6rem',
            background: selectedKey === 'this' ? 'rgba(212,175,55,0.06)' : 'rgba(167,139,250,0.06)',
            border: `1px solid ${selectedKey === 'this' ? 'rgba(212,175,55,0.18)' : 'rgba(167,139,250,0.18)'}`,
            marginBottom: '0.5rem',
          }}
        >
          <p style={{ margin: '0 0 0.3rem', fontSize: '0.7rem', fontFamily: "'Cinzel',serif", letterSpacing: '0.12em', textTransform: 'uppercase' as const, color: selectedKey === 'this' ? '#d4af37' : '#a78bfa' }}>
            PY {selected.data.py} — {selected.data.title || `Year ${selected.data.py}`}
          </p>
          <p style={{ margin: '0 0 0.5rem', fontSize: '0.72rem', color: 'rgba(210,195,250,0.75)', fontFamily: "'Cormorant Garamond',serif", fontStyle: 'italic', lineHeight: 1.5 }}>
            {selected.data.one_line}
          </p>
          <AccordionContentWithPlayer text={selectedText} />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

// ─── Monthly Grid (clickable) ─────────────────────────────────────────────────
const PM_FOCUS_LOCAL: Record<number, string> = {
  1:'Initiate, assert yourself, make independent decisions',
  2:'Cooperate, listen deeply, sign nothing without re-reading',
  3:'Communicate, create, and expand your social reach',
  4:'Systematize, execute methodically, handle practical matters',
  5:'Expect the unexpected; stay flexible and keep energy high',
  6:'Tend relationships, home, and responsibilities with care',
  7:'Reflect, study, trust intuition over surface information',
  8:'Handle financial decisions, claim authority, close deals',
  9:'Complete, forgive, release what has run its course',
};
const PM_SHORT_LOCAL: Record<number, string> = {
  1:'A month to lead and begin. Whatever you initiate now carries the full weight of the annual cycle behind it.',
  2:'A month of subtle progress. Alliances deepen; patience outperforms force.',
  3:'A month of visibility and expression. Share your ideas — they land with unusual resonance.',
  4:'A month of honest labor. The groundwork laid here holds for years.',
  5:'A month of surprises. Stay adaptable; the plan will shift, and that is the point.',
  6:'A month for the heart. Tend the people and spaces that matter to you.',
  7:'A month for depth. What insight is available only in the quiet?',
  8:'A month of consequence. Major financial and authority decisions carry lasting weight.',
  9:'A month for closure. Complete one thing before starting another.',
};

function MonthlyGrid({ birthDay, birthMonth, birthYear }: { birthDay: number; birthMonth: number; birthYear: number }) {
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;
  const months = generateMonthlyBreakdown(birthDay, birthMonth, birthYear, currentYear);
  const monthNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const [selectedMonth, setSelectedMonth] = React.useState<number>(currentMonth);

  const sel = months.find(m => m.month === selectedMonth) || months[currentMonth - 1];

  const selectedText = [
    `${sel.monthName}: Personal Month ${sel.personalMonth}.`,
    PM_SHORT_LOCAL[sel.personalMonth] || '',
    `Focus: ${PM_FOCUS_LOCAL[sel.personalMonth] || sel.focus}.`,
    sel.isOpportunityWindow ? 'This is an Opportunity Window — the month\'s vibration aligns with your year\'s primary theme. Prioritise important initiations and decisions here.' : '',
    sel.luckyDatesThisMonth.length > 0 ? `Lucky dates this month: ${sel.luckyDatesThisMonth.join(', ')}.` : '',
  ].filter(Boolean).join(' ');

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.3rem', marginBottom: '0.6rem' }}>
        {months.map((m) => {
          const isCurrent = m.month === currentMonth;
          const isSelected = m.month === selectedMonth;
          const isPast = m.month < currentMonth;
          return (
            <button
              key={m.month}
              onClick={() => setSelectedMonth(m.month)}
              style={{
                padding: '0.4rem 0.3rem',
                borderRadius: '0.5rem',
                background: isSelected
                  ? isCurrent ? 'rgba(212,175,55,0.2)' : m.isOpportunityWindow ? 'rgba(52,211,153,0.16)' : 'rgba(167,139,250,0.14)'
                  : isCurrent ? 'rgba(212,175,55,0.12)' : m.isOpportunityWindow ? 'rgba(52,211,153,0.07)' : 'rgba(255,255,255,0.02)',
                border: isSelected
                  ? isCurrent ? '2px solid rgba(212,175,55,0.7)' : m.isOpportunityWindow ? '2px solid rgba(52,211,153,0.55)' : '2px solid rgba(167,139,250,0.5)'
                  : isCurrent ? '1px solid rgba(212,175,55,0.3)' : m.isOpportunityWindow ? '1px solid rgba(52,211,153,0.18)' : '1px solid rgba(255,255,255,0.05)',
                opacity: isPast && !isSelected ? 0.38 : 1,
                textAlign: 'center' as const,
                cursor: 'pointer',
                transition: 'all 0.18s',
                boxShadow: isSelected ? '0 0 8px rgba(167,139,250,0.12)' : 'none',
              }}
            >
              <div style={{ fontSize: '0.62rem', color: isSelected ? (isCurrent ? '#d4af37' : '#a78bfa') : isCurrent ? '#d4af37' : 'rgba(210,195,250,0.5)', fontFamily: "'Cinzel',serif", letterSpacing: '0.08em', textTransform: 'uppercase' as const, marginBottom: '0.15rem' }}>{monthNames[m.month - 1]}</div>
              <div style={{ fontSize: '1rem', fontWeight: 700, fontFamily: "'Cinzel',serif", color: isSelected ? (isCurrent ? '#d4af37' : m.isOpportunityWindow ? '#34d399' : '#a78bfa') : isCurrent ? '#d4af37' : m.isOpportunityWindow ? '#34d399' : 'rgba(210,195,250,0.7)', lineHeight: 1 }}>{m.personalMonth}</div>
              {m.isOpportunityWindow && <div style={{ fontSize: '0.62rem', color: '#34d399', marginTop: '0.1rem' }}>✦ window</div>}
            </button>
          );
        })}
      </div>

      {/* Selected month detail */}
      <AnimatePresence mode="wait">
        <motion.div
          key={selectedMonth}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.22 }}
          style={{
            padding: '0.65rem 0.75rem',
            borderRadius: '0.6rem',
            background: sel.month === currentMonth ? 'rgba(212,175,55,0.06)' : sel.isOpportunityWindow ? 'rgba(52,211,153,0.06)' : 'rgba(167,139,250,0.05)',
            border: `1px solid ${sel.month === currentMonth ? 'rgba(212,175,55,0.18)' : sel.isOpportunityWindow ? 'rgba(52,211,153,0.18)' : 'rgba(167,139,250,0.15)'}`,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.3rem' }}>
            <span style={{ fontSize: '0.7rem', fontFamily: "'Cinzel',serif", letterSpacing: '0.12em', textTransform: 'uppercase' as const, color: sel.month === currentMonth ? '#d4af37' : sel.isOpportunityWindow ? '#34d399' : '#a78bfa' }}>
              {sel.monthName}
            </span>
            <span style={{
              fontSize: '0.62rem', fontFamily: "'Cinzel',serif", padding: '1px 6px', borderRadius: 999,
              background: sel.month === currentMonth ? 'rgba(212,175,55,0.15)' : 'rgba(167,139,250,0.12)',
              color: sel.month === currentMonth ? '#d4af37' : '#a78bfa',
              border: `1px solid ${sel.month === currentMonth ? 'rgba(212,175,55,0.3)' : 'rgba(167,139,250,0.25)'}`,
            }}>
              PM {sel.personalMonth}
            </span>
            {sel.isOpportunityWindow && (
              <span style={{ fontSize: '0.62rem', color: '#34d399', fontFamily: "'Cinzel',serif" }}>✦ Opportunity Window</span>
            )}
          </div>
          <p style={{ margin: '0 0 0.45rem', fontSize: '0.7rem', color: 'rgba(210,195,250,0.72)', fontFamily: "'Cormorant Garamond',serif", fontStyle: 'italic', lineHeight: 1.5 }}>
            {PM_SHORT_LOCAL[sel.personalMonth]}
          </p>
          <AccordionContentWithPlayer text={selectedText} />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

// ─── Multi-Year Bar Chart (clickable) ────────────────────────────────────────
function MultiYearChart({ birthDay, birthMonth, birthYear }: { birthDay: number; birthMonth: number; birthYear: number }) {
  const currentYear = new Date().getFullYear();
  const data = generateMultiYearForecast(birthDay, birthMonth, birthYear, currentYear - 1, 7);
  const [selectedYear, setSelectedYear] = React.useState<number>(currentYear);

  const sel = data.find(d => d.year === selectedYear) || data.find(d => d.year === currentYear)!;

  const selText = sel
    ? [
        `${sel.year} — Personal Year ${sel.py} (${PY_TITLES_LOCAL[sel.py] || ''}).`,
        PY_ONE_LINERS_LOCAL[sel.py] || '',
        `Overall score: ${Math.round(sel.scores.overallYear)}%.`,
        `Career momentum ${sel.scores.careerMomentum}%, financial growth ${sel.scores.financialGrowth}%, relationship stability ${sel.scores.relationshipStability}%, health discipline ${sel.scores.healthDiscipline}%, spiritual growth ${sel.scores.spiritualGrowth}%.`,
        sel.year === currentYear ? 'This is your current year.' : sel.year < currentYear ? 'This year is in the past — a completed arc to reflect on.' : 'This is an upcoming year — begin preparing.',
      ].filter(Boolean).join(' ')
    : '';

  return (
    <div>
      {/* Bars */}
      <div style={{ display: 'flex', gap: '0.3rem', alignItems: 'flex-end', height: 60, marginBottom: '0.4rem' }}>
        {data.map((d) => {
          const height = Math.max(20, (d.scores.overallYear / 100) * 56);
          const isNow = d.year === currentYear;
          const isSelected = d.year === selectedYear;
          return (
            <button
              key={d.year}
              onClick={() => setSelectedYear(d.year)}
              style={{
                flex: 1, display: 'flex', flexDirection: 'column' as const, alignItems: 'center', gap: 4,
                background: 'none', border: 'none', cursor: 'pointer', padding: 0,
                outline: isSelected ? `2px solid ${isNow ? 'rgba(212,175,55,0.6)' : 'rgba(167,139,250,0.5)'}` : 'none',
                outlineOffset: 2, borderRadius: 4,
              }}
            >
              <motion.div
                initial={{ height: 0 }}
                animate={{ height }}
                transition={{ duration: 1, ease: [0.23, 1, 0.32, 1], delay: (d.year - currentYear + 1) * 0.07 }}
                style={{
                  width: '100%', borderRadius: '3px 3px 0 0',
                  background: isSelected
                    ? isNow ? 'linear-gradient(180deg, #f0c84a 0%, #d4af37 100%)' : 'rgba(167,139,250,0.65)'
                    : isNow
                    ? 'linear-gradient(180deg, #d4af37 0%, #a07820 100%)'
                    : d.year < currentYear ? 'rgba(255,255,255,0.08)' : 'rgba(167,139,250,0.3)',
                  border: isSelected ? `1px solid ${isNow ? 'rgba(212,175,55,0.8)' : 'rgba(167,139,250,0.7)'}` : isNow ? '1px solid rgba(212,175,55,0.5)' : 'none',
                  flexShrink: 0,
                  boxShadow: isSelected ? `0 0 8px ${isNow ? 'rgba(212,175,55,0.3)' : 'rgba(167,139,250,0.2)'}` : 'none',
                  transition: 'background 0.2s, box-shadow 0.2s',
                }}
              />
              <span style={{ fontSize: '0.62rem', fontFamily: "'Cinzel',serif", color: isSelected ? (isNow ? '#d4af37' : '#a78bfa') : isNow ? '#d4af37' : 'rgba(210,195,250,0.4)', textAlign: 'center' as const, lineHeight: 1 }}>
                PY{d.py}<br />{d.year}
              </span>
            </button>
          );
        })}
      </div>

      {/* Score row */}
      <div style={{ display: 'flex', gap: '0.3rem', marginTop: '0.1rem', marginBottom: '0.6rem' }}>
        {data.map((d) => (
          <div key={d.year} style={{ flex: 1, fontSize: '0.62rem', color: d.year === selectedYear ? (d.year === currentYear ? '#d4af37' : '#a78bfa') : d.year === currentYear ? 'rgba(212,175,55,0.55)' : 'rgba(210,195,250,0.3)', textAlign: 'center' as const, lineHeight: 1.3, fontWeight: d.year === selectedYear ? 700 : 400 }}>
            {Math.round(d.scores.overallYear)}
          </div>
        ))}
      </div>

      {/* Selected year detail */}
      {sel && (
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedYear}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.22 }}
            style={{
              padding: '0.65rem 0.75rem',
              borderRadius: '0.6rem',
              background: sel.year === currentYear ? 'rgba(212,175,55,0.06)' : 'rgba(167,139,250,0.05)',
              border: `1px solid ${sel.year === currentYear ? 'rgba(212,175,55,0.18)' : 'rgba(167,139,250,0.15)'}`,
            }}
          >
            <p style={{ margin: '0 0 0.3rem', fontSize: '0.7rem', fontFamily: "'Cinzel',serif", letterSpacing: '0.12em', textTransform: 'uppercase' as const, color: sel.year === currentYear ? '#d4af37' : '#a78bfa' }}>
              {sel.year} · PY {sel.py} · {PY_TITLES_LOCAL[sel.py] || ''}
            </p>
            <div style={{ display: 'flex', gap: '0.3rem', flexWrap: 'wrap' as const, marginBottom: '0.4rem' }}>
              {[
                { label: 'Career', value: sel.scores.careerMomentum, color: '#60a5fa' },
                { label: 'Finance', value: sel.scores.financialGrowth, color: '#34d399' },
                { label: 'Rel.', value: sel.scores.relationshipStability, color: '#f472b6' },
                { label: 'Health', value: sel.scores.healthDiscipline, color: '#4ade80' },
                { label: 'Spirit', value: sel.scores.spiritualGrowth, color: '#a78bfa' },
              ].map(s => (
                <div key={s.label} style={{ textAlign: 'center' as const, flex: '1 1 0' }}>
                  <div style={{ fontSize: '0.7rem', fontWeight: 700, fontFamily: "'Cinzel',serif", color: s.color, lineHeight: 1 }}>{s.value}</div>
                  <div style={{ fontSize: '0.62rem', color: 'rgba(210,195,250,0.4)', fontFamily: "'Cinzel',serif", letterSpacing: '0.06em', textTransform: 'uppercase' as const, marginTop: '0.1rem' }}>{s.label}</div>
                </div>
              ))}
            </div>
            <AccordionContentWithPlayer text={selText} />
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
}

// ─── Cheiro Day Intelligence (visual) ─────────────────────────────────────────
function CheiroDayVisual({ cheiro }: { cheiro: TemporalPredictionV2['cheiroDayIntelligence'] }) {
  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.6rem' }}>
        <div>
          <p style={{ margin: '0 0 0.3rem', fontSize: '0.7rem', fontFamily: "'Cinzel',serif", letterSpacing: '0.1em', textTransform: 'uppercase' as const, color: 'rgba(212,175,55,0.6)' }}>Lucky Days</p>
          <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: '0.2rem' }}>
            {cheiro.luckyDaysOfWeek.map(d => <PillBadge key={d} color="#a78bfa">{d}</PillBadge>)}
          </div>
        </div>
        <div>
          <p style={{ margin: '0 0 0.3rem', fontSize: '0.7rem', fontFamily: "'Cinzel',serif", letterSpacing: '0.1em', textTransform: 'uppercase' as const, color: 'rgba(212,175,55,0.6)' }}>Lucky Dates</p>
          <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: '0.2rem' }}>
            {cheiro.luckyDatesThisMonth.slice(0, 6).map(d => <PillBadge key={d} color="#60a5fa">{d}</PillBadge>)}
          </div>
        </div>
      </div>
      {cheiro.nextPowerWindow && (
        <div style={{ padding: '0.45rem 0.6rem', borderRadius: '0.5rem', background: 'rgba(52,211,153,0.07)', border: '1px solid rgba(52,211,153,0.18)', marginBottom: '0.45rem' }}>
          <p style={{ margin: 0, fontSize: '0.7rem', color: '#34d399', fontFamily: "'Cinzel',serif", letterSpacing: '0.05em' }}>⚡ Next Power Window: {cheiro.nextPowerWindow}</p>
        </div>
      )}
    </div>
  );
}

// ─── Lo Shu Activation (visual) ───────────────────────────────────────────────
function LoShuVisual({ lsa }: { lsa: TemporalPredictionV2['loShuActivation'] }) {
  return (
    <div>
      <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: '0.3rem', marginBottom: '0.6rem' }}>
        {lsa.activatedNumbers.map(n => (
          <span key={n} style={{
            width: 28, height: 28, borderRadius: '50%',
            background: 'rgba(167,139,250,0.15)', border: '1px solid rgba(167,139,250,0.35)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '0.7rem', fontWeight: 700, fontFamily: "'Cinzel',serif", color: '#a78bfa',
          }}>{n}</span>
        ))}
      </div>
      {lsa.strengthenedArrows.length > 0 && (
        <div style={{ marginBottom: '0.4rem' }}>
          <p style={{ margin: '0 0 0.25rem', fontSize: '0.7rem', fontFamily: "'Cinzel',serif", letterSpacing: '0.1em', textTransform: 'uppercase' as const, color: '#34d399' }}>Strengthened</p>
          <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: '0.25rem' }}>{lsa.strengthenedArrows.map(a => <PillBadge key={a} color="#34d399">{a}</PillBadge>)}</div>
        </div>
      )}
      {lsa.weakenedArrows.length > 0 && (
        <div>
          <p style={{ margin: '0 0 0.25rem', fontSize: '0.7rem', fontFamily: "'Cinzel',serif", letterSpacing: '0.1em', textTransform: 'uppercase' as const, color: '#f87171' }}>Under Pressure</p>
          <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: '0.25rem' }}>{lsa.weakenedArrows.map(a => <PillBadge key={a} color="#f87171">{a}</PillBadge>)}</div>
        </div>
      )}
      <AccordionContentWithPlayer text={lsa.gridNarrative} />
    </div>
  );
}

// ─── Pinnacle & Challenge (visual) ────────────────────────────────────────────
function PinnacleCard({ meta }: { meta: TemporalPredictionV2['meta'] }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
      <div style={{ textAlign: 'center' as const, padding: '0.75rem', borderRadius: '0.6rem', background: 'rgba(212,175,55,0.07)', border: '1px solid rgba(212,175,55,0.15)' }}>
        <div style={{ fontSize: '1.8rem', fontWeight: 700, fontFamily: "'Cinzel',serif", color: '#d4af37', lineHeight: 1 }}>{meta.activePinnacleNumber}</div>
        <div style={{ fontSize: '0.62rem', color: 'rgba(212,175,55,0.55)', fontFamily: "'Cinzel',serif", letterSpacing: '0.1em', textTransform: 'uppercase' as const, marginTop: '0.3rem' }}>Active Pinnacle</div>
        <div style={{ fontSize: '0.62rem', color: 'rgba(210,195,250,0.4)', marginTop: '0.15rem' }}>Stage {meta.activePinnacleStage} · {meta.activePinnacleAgeRange}</div>
      </div>
      <div style={{ textAlign: 'center' as const, padding: '0.75rem', borderRadius: '0.6rem', background: 'rgba(248,113,113,0.06)', border: '1px solid rgba(248,113,113,0.15)' }}>
        <div style={{ fontSize: '1.8rem', fontWeight: 700, fontFamily: "'Cinzel',serif", color: '#f87171', lineHeight: 1 }}>{meta.activeChallenge}</div>
        <div style={{ fontSize: '0.62rem', color: 'rgba(248,113,113,0.55)', fontFamily: "'Cinzel',serif", letterSpacing: '0.1em', textTransform: 'uppercase' as const, marginTop: '0.3rem' }}>Active Challenge</div>
      </div>
    </div>
  );
}

// ─── Contradiction List ────────────────────────────────────────────────────────
function ContradictionList({ contradictions }: { contradictions: TemporalPredictionV2['contradictions'] }) {
  if (!contradictions.length) return null;
  return (
    <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '0.5rem' }}>
      {contradictions.map((c, i) => {
        const text = `${c.signal1} and ${c.signal2}: ${c.tension} Resolution: ${c.resolution}`;
        return (
          <div key={i} style={{ padding: '0.65rem 0.75rem', borderRadius: '0.6rem', background: 'rgba(251,146,60,0.05)', border: '1px solid rgba(251,146,60,0.14)' }}>
            <p style={{ margin: '0 0 0.3rem', fontSize: '0.7rem', fontFamily: "'Cinzel',serif", letterSpacing: '0.1em', textTransform: 'uppercase' as const, color: '#fb923c' }}>
              {c.signal1} · {c.signal2}
            </p>
            <AccordionContentWithPlayer text={text} />
          </div>
        );
      })}
    </div>
  );
}

// ─── Domain Cards ─────────────────────────────────────────────────────────────
function DomainSection({ domains }: { domains: TemporalPredictionV2['domains'] }) {
  const entries = [
    { icon: '💼', label: 'Career', text: domains.career },
    { icon: '💑', label: 'Relationships', text: domains.relationships },
    { icon: '💰', label: 'Finances', text: domains.finances },
    { icon: '🌿', label: 'Health', text: domains.health },
    { icon: '🔮', label: 'Spirituality', text: domains.spirituality },
  ];
  return (
    <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '0.5rem' }}>
      {entries.map(e => (
        <div key={e.label} style={{
          padding: '0.65rem 0.75rem', borderRadius: '0.6rem',
          background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.06)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.4rem' }}>
            <span style={{ fontSize: '0.9rem' }}>{e.icon}</span>
            <p style={{ margin: 0, fontSize: '0.7rem', fontFamily: "'Cinzel',serif", letterSpacing: '0.12em', textTransform: 'uppercase' as const, color: 'rgba(212,175,55,0.65)', fontWeight: 700 }}>{e.label}</p>
          </div>
          <AccordionContentWithPlayer text={e.text} />
        </div>
      ))}
    </div>
  );
}

// ─── Main Export: TemporalPredictionDisplay (used when tab was active) ────────
export function TemporalPredictionDisplay({ birthDay, birthMonth, birthYear }: {
  birthDay: number; birthMonth: number; birthYear: number;
}) {
  const prediction = React.useMemo(
    () => generateTemporalPrediction(birthDay, birthMonth, birthYear),
    [birthDay, birthMonth, birthYear]
  );
  return <TemporalPredictionInner prediction={prediction} birthDay={birthDay} birthMonth={birthMonth} birthYear={birthYear} />;
}

// ─── Inner layout shared by both exports ─────────────────────────────────────
function TemporalPredictionInner({
  prediction, birthDay, birthMonth, birthYear,
}: {
  prediction: TemporalPredictionV2;
  birthDay: number; birthMonth: number; birthYear: number;
}) {
  const {
    meta, headline, domains, probabilityScores, cheiroDayIntelligence, loShuActivation,
    missingNumberForecast, repeatedNumberAmplifier, karmicTrigger, pinnacleTransitionRadar,
    contradictions, tensionSignature, windowOfOpportunity, cautionFlag, threeYearArc,
    isClimatericYear, climatericNote, todayForecast,
  } = prediction;

  const metaText = `Life Path ${meta.lifePath}. Psychic number ${meta.psychicNumber}. Personal Year ${meta.personalYear}. Personal Month ${meta.personalMonth}. Active Pinnacle ${meta.activePinnacleNumber}, Stage ${meta.activePinnacleStage}, Ages ${meta.activePinnacleAgeRange}. Active Challenge ${meta.activeChallenge}.`;

  const arcText = [
    threeYearArc.arcSummary,
    threeYearArc.thisYear.one_line,
    threeYearArc.nextYear.one_line,
    threeYearArc.yearAfter.one_line,
  ].filter(Boolean).join(' ');

  const scoresText = `Career Momentum ${probabilityScores.careerMomentum}%. Financial Growth ${probabilityScores.financialGrowth}%. Relationship Stability ${probabilityScores.relationshipStability}%. Health Discipline ${probabilityScores.healthDiscipline}%. Spiritual Growth ${probabilityScores.spiritualGrowth}%. Overall Year score ${probabilityScores.overallYear}%.`;

  const opportunityText = `Window of Opportunity: ${windowOfOpportunity.monthRange}. ${windowOfOpportunity.reason}`;
  const cautionText = `Caution: ${cautionFlag.risk} Mitigation: ${cautionFlag.mitigation}`;
  const tensionText = `${tensionSignature.forceA} and ${tensionSignature.forceB} — ${tensionSignature.nature}. ${tensionSignature.interpretation}`;

  const cheiroText = [
    `Lucky days of the week: ${cheiroDayIntelligence.luckyDaysOfWeek.join(', ')}.`,
    `Lucky dates this month: ${cheiroDayIntelligence.luckyDatesThisMonth.join(', ')}.`,
    cheiroDayIntelligence.nextPowerWindow ? `Next power window: ${cheiroDayIntelligence.nextPowerWindow}.` : '',
    cheiroDayIntelligence.strongPeriod || '',
  ].filter(Boolean).join(' ');

  const missingText = missingNumberForecast.missingNumbers.length > 0
    ? `Missing numbers: ${missingNumberForecast.missingNumbers.join(', ')}. ${missingNumberForecast.narrative}`
    : '';

  const repeatedText = repeatedNumberAmplifier.dominantNumber !== null
    ? `Dominant number ${repeatedNumberAmplifier.dominantNumber} appears ${repeatedNumberAmplifier.dominantCount} times. ${repeatedNumberAmplifier.amplificationNote}`
    : '';

  const karmicText = karmicTrigger.debtNumber
    ? `Karmic Debt ${karmicTrigger.debtNumber}${karmicTrigger.isTriggered ? ' — Active.' : '.'} ${karmicTrigger.triggerExplanation}`
    : '';

  const pinnacleTransText = pinnacleTransitionRadar.isInTransitionWindow
    ? pinnacleTransitionRadar.transitionNarrative
    : '';

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} style={{ paddingBottom: '0.5rem' }}>

      {/* ── Meta Row ────────────────────────────────────────── */}
      <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' as const, marginBottom: '0.9rem' }}>
        {[
          { label: 'Life Path', value: meta.lifePath },
          { label: 'Psychic', value: meta.psychicNumber },
          { label: 'Personal Year', value: meta.personalYear },
          { label: 'Personal Month', value: meta.personalMonth },
        ].map(m => (
          <div key={m.label} style={{
            flex: '1 1 calc(25% - 0.4rem)', minWidth: 60,
            textAlign: 'center' as const, padding: '0.5rem 0.3rem', borderRadius: '0.6rem',
            background: 'rgba(212,175,55,0.07)', border: '1px solid rgba(212,175,55,0.15)',
          }}>
            <div style={{ fontSize: '1.3rem', fontWeight: 700, fontFamily: "'Cinzel',serif", color: '#d4af37', lineHeight: 1 }}>{m.value}</div>
            <div style={{ fontSize: '0.62rem', color: 'rgba(212,175,55,0.55)', fontFamily: "'Cinzel',serif", letterSpacing: '0.08em', textTransform: 'uppercase' as const, marginTop: '0.2rem' }}>{m.label}</div>
          </div>
        ))}
      </div>

      {/* ── Climacteric Alert ─────────────────────────────── */}
      {isClimatericYear && climatericNote && (
        <TemporalSection icon="⭐" title="Climacteric Year" defaultOpen text={climatericNote} />
      )}

      {/* ── Headline ──────────────────────────────────────── */}
      <TemporalSection icon="🔮" title="Temporal Headline" defaultOpen text={headline} />

      {/* ── Today ─────────────────────────────────────────── */}
      <TemporalSection
        icon="☀️"
        title="Today's Intelligence"
        subtitle={`Personal Day ${todayForecast.personalDay} · Universal Day ${todayForecast.universalDay}`}
        defaultOpen
      >
        <TodayCard today={todayForecast} />
      </TemporalSection>

      {/* ── Three-Year Arc ────────────────────────────────── */}
      <TemporalSection icon="🔭" title="3-Year Arc" subtitle={threeYearArc.arcSummary}>
        <ThreeYearArcGrid arc={threeYearArc} />
        <AccordionContentWithPlayer text={arcText} />
      </TemporalSection>

      {/* ── Probability Scores ─────────────────────────────── */}
      <TemporalSection icon="📊" title="Probability Scores" subtitle="5-domain confidence index for this year">
        <div style={{ marginBottom: '0.5rem' }}>
          <ScoreBar label="Career Momentum"        value={probabilityScores.careerMomentum}        color="#60a5fa" />
          <ScoreBar label="Financial Growth"        value={probabilityScores.financialGrowth}        color="#34d399" />
          <ScoreBar label="Relationship Stability"  value={probabilityScores.relationshipStability}  color="#f472b6" />
          <ScoreBar label="Health Discipline"       value={probabilityScores.healthDiscipline}       color="#4ade80" />
          <ScoreBar label="Spiritual Growth"        value={probabilityScores.spiritualGrowth}        color="#a78bfa" />
          <div style={{ marginTop: '0.5rem', paddingTop: '0.5rem', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
            <ScoreBar label="Overall Year"          value={probabilityScores.overallYear}            color="#d4af37" />
          </div>
        </div>
        <AccordionContentWithPlayer text={scoresText} />
      </TemporalSection>

      {/* ── Domain Forecasts ─────────────────────────────── */}
      <TemporalSection icon="🌐" title="Life Domain Forecasts" subtitle={`Personal Year ${meta.personalYear} · ${new Date().getFullYear()}`}>
        <DomainSection domains={domains} />
      </TemporalSection>

      {/* ── Monthly Breakdown ─────────────────────────────── */}
      <TemporalSection icon="📅" title={`Monthly Rhythm · ${new Date().getFullYear()}`} subtitle="Personal Month by month with opportunity windows">
        <MonthlyGrid birthDay={birthDay} birthMonth={birthMonth} birthYear={birthYear} />
      </TemporalSection>

      {/* ── Window of Opportunity ─────────────────────────── */}
      <TemporalSection icon="✦" title="Window of Opportunity" subtitle={windowOfOpportunity.monthRange} text={opportunityText} />

      {/* ── Caution Flag ─────────────────────────────────── */}
      <TemporalSection icon="⚠️" title="Caution Flag" text={cautionText} />

      {/* ── Tension Signature ────────────────────────────── */}
      <TemporalSection icon="⚡" title="Tension Signature" subtitle={`${tensionSignature.forceA} ⟷ ${tensionSignature.forceB} — ${tensionSignature.nature}`} text={tensionText} />

      {/* ── Cheiro Day Intelligence ──────────────────────── */}
      <TemporalSection icon="🔯" title="Day Intelligence" subtitle="Lucky days, dates & power windows">
        <CheiroDayVisual cheiro={cheiroDayIntelligence} />
        <AccordionContentWithPlayer text={cheiroText} />
      </TemporalSection>

      {/* ── Lo Shu Grid Activation ──────────────────────── */}
      <TemporalSection icon="☯️" title="Lo Shu Grid Activation" subtitle="Grid resonance for this personal year">
        <LoShuVisual lsa={loShuActivation} />
      </TemporalSection>

      {/* ── Missing Numbers ──────────────────────────────── */}
      {missingNumberForecast.missingNumbers.length > 0 && (
        <TemporalSection icon="🕳" title="Missing Numbers Forecast">
          <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: '0.3rem', marginBottom: '0.5rem' }}>
            {missingNumberForecast.missingNumbers.map(n => (
              <span key={n} style={{
                width: 26, height: 26, borderRadius: '50%',
                background: missingNumberForecast.activatedMissing.includes(n) ? 'rgba(52,211,153,0.15)' : 'rgba(239,68,68,0.1)',
                border: `1px solid ${missingNumberForecast.activatedMissing.includes(n) ? 'rgba(52,211,153,0.4)' : 'rgba(239,68,68,0.3)'}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '0.7rem', fontWeight: 700, fontFamily: "'Cinzel',serif",
                color: missingNumberForecast.activatedMissing.includes(n) ? '#34d399' : '#f87171',
              }}>{n}</span>
            ))}
          </div>
          <AccordionContentWithPlayer text={missingText} />
        </TemporalSection>
      )}

      {/* ── Repeated Numbers ─────────────────────────────── */}
      {repeatedNumberAmplifier.dominantNumber !== null && (
        <TemporalSection icon="🔁" title="Repeated Number Amplifier">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
            <span style={{
              width: 36, height: 36, borderRadius: '50%',
              background: 'rgba(167,139,250,0.15)', border: '2px solid rgba(167,139,250,0.4)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '1rem', fontWeight: 700, fontFamily: "'Cinzel',serif", color: '#a78bfa',
            }}>{repeatedNumberAmplifier.dominantNumber}</span>
            <span style={{ fontSize: '0.7rem', color: 'rgba(167,139,250,0.75)', fontFamily: "'Cinzel',serif" }}>
              Appears {repeatedNumberAmplifier.dominantCount}×
            </span>
          </div>
          <AccordionContentWithPlayer text={repeatedText} />
        </TemporalSection>
      )}

      {/* ── Karmic Debt ──────────────────────────────────── */}
      {karmicTrigger.debtNumber && (
        <TemporalSection icon="♾️" title="Karmic Debt Trigger">
          <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: '0.3rem', marginBottom: '0.4rem' }}>
            <PillBadge color={karmicTrigger.isTriggered ? '#f87171' : '#a78bfa'}>Karmic Debt {karmicTrigger.debtNumber}</PillBadge>
            {karmicTrigger.isTriggered && <PillBadge color="#f87171">Active</PillBadge>}
          </div>
          <AccordionContentWithPlayer text={karmicText} />
        </TemporalSection>
      )}

      {/* ── Pinnacle Transition Radar ────────────────────── */}
      {pinnacleTransitionRadar.isInTransitionWindow && pinnacleTransText && (
        <TemporalSection icon="🗼" title="Pinnacle Transition Radar"
          subtitle={pinnacleTransitionRadar.monthsUntilTransition !== null
            ? `${pinnacleTransitionRadar.monthsUntilTransition} months to transition`
            : 'Transition window active'}
          text={pinnacleTransText}
        />
      )}

      {/* ── Contradiction Engine ─────────────────────────── */}
      {contradictions.length > 0 && (
        <TemporalSection icon="⚖️" title="Contradiction Engine" subtitle="Conflicting signals & resolution paths">
          <ContradictionList contradictions={contradictions} />
        </TemporalSection>
      )}

      {/* ── Active Pinnacle & Challenge ──────────────────── */}
      <TemporalSection icon="🏔" title="Pinnacle & Challenge" subtitle={`Stage ${meta.activePinnacleStage} · Ages ${meta.activePinnacleAgeRange}`}>
        <PinnacleCard meta={meta} />
        <div style={{ marginTop: '0.5rem' }}>
          <AccordionContentWithPlayer text={metaText} />
        </div>
      </TemporalSection>

      {/* ── Multi-Year Score Chart ────────────────────────── */}
      <TemporalSection icon="📈" title="7-Year Overview" subtitle="Overall year score across your near horizon">
        <MultiYearChart birthDay={birthDay} birthMonth={birthMonth} birthYear={birthYear} />
      </TemporalSection>

    </motion.div>
  );
}

// ─── TemporalPredictionPanel: collapsible outer wrapper under Cosmic Synthesis ─
export function TemporalPredictionPanel({ birthDay, birthMonth, birthYear }: {
  birthDay: number; birthMonth: number; birthYear: number;
}) {
  const [open, setOpen] = React.useState(false);

  const prediction = React.useMemo(
    () => generateTemporalPrediction(birthDay, birthMonth, birthYear),
    [birthDay, birthMonth, birthYear]
  );

  return (
    <div style={{
      borderRadius: '1.1rem',
      overflow: 'hidden',
      border: '1px solid rgba(212,175,55,0.22)',
      background: 'rgba(15,5,40,0.95)',
      marginBottom: '1.25rem',
    }}>
      <div style={{ height: 1, background: 'linear-gradient(90deg, transparent, rgba(167,139,250,0.35), transparent)', marginBottom: '0.25rem' }} />

      {/* Header — always clickable */}
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '1rem 1.25rem',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          gap: '0.75rem',
          textAlign: 'left' as const,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <Clock style={{ color: '#a78bfa', width: 20, height: 20 }} />
          <div>
            <div style={{ fontFamily: "'Cinzel',serif", fontSize: '0.72rem', fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase' as const, color: 'rgba(167,139,250,0.9)' }}>
              Temporal Prediction Engine
            </div>
            <div style={{ fontSize: '0.7rem', color: 'rgba(200,180,240,0.4)', fontStyle: 'italic' }}>
              14-layer algorithmic forecast — cycles, windows & domains
            </div>
          </div>
        </div>
        <ChevronDown
          style={{
            color: 'rgba(167,139,250,0.45)',
            width: 16,
            height: 16,
            transform: open ? 'rotate(180deg)' : 'none',
            transition: 'transform 0.3s',
            flexShrink: 0,
          }}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
            style={{ padding: '0 1.25rem 1.25rem' }}
          >
            <TemporalPredictionInner
              prediction={prediction}
              birthDay={birthDay}
              birthMonth={birthMonth}
              birthYear={birthYear}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
