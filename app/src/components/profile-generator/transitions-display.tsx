import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, TrendingUp, TrendingDown, Minus,
         ChevronDown, ChevronRight, Zap, Shield, Clock, BookOpen, Sparkles } from 'lucide-react';
import { detectTransitions, type DetectedTransition, type MatrixState, type TransitionAdvisory } from '@/lib/transitions/engine';
import type { NumerologyData } from './types';
import { computePersonalYearNumber } from '@/lib/numerology/personal-year-full';

// ── helpers ──────────────────────────────────────────────────────────────────
function getPersonalYear(d: number, m: number): number {
  return computePersonalYearNumber(d, m, new Date().getFullYear());
}

const URGENCY_CONFIG = {
  critical: { label:'CRITICAL', color:'#ef4444', bg:'rgba(239,68,68,0.1)', border:'rgba(239,68,68,0.35)' },
  high:     { label:'HIGH',     color:'#f59e0b', bg:'rgba(245,158,11,0.1)', border:'rgba(245,158,11,0.3)' },
  moderate: { label:'ACTIVE',   color:'#a78bfa', bg:'rgba(167,139,250,0.1)', border:'rgba(167,139,250,0.28)' },
  latent:   { label:'LATENT',   color:'#60a5fa', bg:'rgba(96,165,250,0.08)', border:'rgba(96,165,250,0.2)' },
};

const DIRECTION_ICON = {
  ascent:  <TrendingUp  style={{ width:16, height:16, color:'#34d399' }} />,
  descent: <TrendingDown style={{ width:16, height:16, color:'#ef4444' }} />,
  dual:    <Minus       style={{ width:16, height:16, color:'#d4af37' }} />,
};

function NumberArrow({ from, to, direction }: { from: number; to: number; direction: string }) {
  const col = direction === 'ascent' ? '#34d399' : direction === 'descent' ? '#ef4444' : '#d4af37';
  return (
    <svg viewBox="0 0 120 40" style={{ width:120, height:40, flexShrink:0 }}>
      <defs>
        <marker id={`ta-arrow-${from}${to}`} markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
          <path d="M0,0 L6,3 L0,6 Z" fill={col}/>
        </marker>
      </defs>
      <circle cx="20" cy="20" r="16" fill={`${col}1a`} stroke={col} strokeWidth="1.5" />
      <text x="20" y="20" textAnchor="middle" dominantBaseline="middle" fontFamily="'Cinzel Decorative', serif" fontSize="13" fontWeight="700" fill={col}>{from}</text>
      <line x1="37" y1="20" x2="80" y2="20" stroke={col} strokeWidth="1.5" markerEnd={`url(#ta-arrow-${from}${to})`} strokeDasharray="4 3" />
      <circle cx="100" cy="20" r="16" fill={`${col}1a`} stroke={col} strokeWidth="1.5" />
      <text x="100" y="20" textAnchor="middle" dominantBaseline="middle" fontFamily="'Cinzel Decorative', serif" fontSize="13" fontWeight="700" fill={col}>{to}</text>
    </svg>
  );
}

function AdvisoryViewer({ advisory }: { advisory: TransitionAdvisory }) {
  const SECTION_TITLES: Array<{ key: keyof TransitionAdvisory; label: string; icon: React.ReactNode }> = [
    { key: 'anatomy',    label: 'Anatomy',      icon: <BookOpen className="w-3 h-3" /> },
    { key: 'mechanics',  label: 'Mechanics',    icon: <Zap className="w-3 h-3" /> },
    { key: 'sabotage',   label: 'Sabotage',     icon: <Shield className="w-3 h-3" /> },
    { key: 'synthesis',  label: 'Synthesis',    icon: <Sparkles className="w-3 h-3" /> },
  ];

  // Add synergy if present
  if (advisory.synergy) {
    SECTION_TITLES.push({ key: 'synergy', label: 'Synergy', icon: <Zap className="w-3 h-3 text-amber-500" /> });
  }

  const [active, setActive] = React.useState(0);
  const section = SECTION_TITLES[active];
  const text = advisory[section.key];

  return (
    <div className="mt-4 space-y-4">
      <div className="flex gap-1.5 flex-wrap">
        {SECTION_TITLES.map((s, i) => (
          <button key={s.key} onClick={() => setActive(i)}
            className={`px-3 py-1.5 rounded-lg text-[11px] uppercase font-bold border transition-all flex items-center gap-1.5 ${
              active === i ? 'bg-amber-500/20 text-amber-400 border-amber-500/40' : 'bg-white/5 text-stone-500 border-white/10'
            }`}>
            {s.icon} {i + 1}. {s.label}
          </button>
        ))}
      </div>
      <motion.div key={active} initial={{ opacity:0 }} animate={{ opacity:1 }} 
        className="p-4 rounded-xl bg-black/40 border border-white/5 text-[13px] leading-relaxed text-stone-300 shadow-inner">
        <h4 className="font-cinzel text-xs text-amber-500 mb-3 uppercase tracking-widest">{section.label} — Strategic Insight</h4>
        <div className="whitespace-pre-wrap">{text?.trim()}</div>
      </motion.div>
    </div>
  );
}

function TransitionCard({ t, matrixState }: { t: DetectedTransition; matrixState: MatrixState }) {
  const [open, setOpen] = React.useState(false);
  const urg = URGENCY_CONFIG[t.urgency];

  return (
    <div className="border border-stone-700/40 rounded-sm bg-black/40 backdrop-blur-md overflow-hidden" style={{ borderLeft: `4px solid ${urg.color}` }}>
      <div className="p-5 space-y-4">
        <div className="flex items-start justify-between gap-4">
          <NumberArrow from={t.from} to={t.to} direction={t.direction} />
          <div className="flex-1 text-right">
            <span className="text-[11px] font-black tracking-widest px-2 py-0.5 rounded-full" style={{ background: urg.bg, color: urg.color, border: `1px solid ${urg.border}` }}>
              {urg.label}
            </span>
            <h3 className="font-cinzel text-sm text-stone-100 mt-2">{t.name}</h3>
            <p className="text-[11px] text-stone-500 uppercase italic">{t.subtitle}</p>
          </div>
        </div>
        <p className="text-[13px] text-stone-400 italic px-2 border-l border-white/10">{t.coreConflict}</p>
        
        <div className="flex gap-2 flex-wrap">
          <span className="flex items-center gap-1.5 px-2 py-1 rounded bg-white/5 border border-white/10 text-[11px] uppercase font-bold text-stone-400">
            <Zap className="w-3 h-3" /> Cost: {t.energyCost}
          </span>
          {t.warningActive && (
            <span className="flex items-center gap-1.5 px-2 py-1 rounded bg-rose-500/10 border border-rose-500/30 text-[11px] uppercase font-bold text-rose-400">
              <Clock className="w-3 h-3" /> Year {matrixState.personalYear} Active
            </span>
          )}
        </div>

        <button onClick={() => setOpen(!open)} className="w-full py-2.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-500 text-[11px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 shadow-lg">
          <BookOpen className="h-3 w-3" />
          {open ? 'Hide Advisory' : 'Read Deep Advisory'}
          {open ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
        </button>
      </div>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="border-t border-stone-800/60 bg-black/20 p-5">
            <AdvisoryViewer advisory={t.advisory} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function TransitionsDisplay({ numerology }: { numerology: NumerologyData }) {
  const matrixState: MatrixState = React.useMemo(() => ({
    counts: Object.fromEntries(Object.entries(numerology.numberCounts || {}).map(([k, v]) => [Number(k), v])),
    personalYear: getPersonalYear(numerology.birthDay, numerology.birthMonth),
    birthDay: numerology.birthDay, birthMonth: numerology.birthMonth, birthYear: numerology.birthYear,
    gender: (numerology as any).gender || 'male',
  }), [numerology]);

  const transitions = React.useMemo(() => detectTransitions(matrixState), [matrixState]);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="font-decorative text-2xl text-primary">Karmic Transitions</h2>
        <p className="text-[11px] font-cinzel uppercase tracking-[0.3em] text-slate-500">Mathematical Soul Resonances</p>
      </div>
      <div className="space-y-4">
        {transitions.length > 0 ? transitions.map(t => <TransitionCard key={t.id} t={t} matrixState={matrixState} />) : <p className="text-center py-10 text-muted-foreground text-xs font-cinzel uppercase">No Transitions Detected</p>}
      </div>
    </div>
  );
}