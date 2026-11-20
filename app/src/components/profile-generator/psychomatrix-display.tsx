'use client';

/**
 * @fileoverview ALEXANDROV'S PSYCHOMATRIX — Complete Verbatim Reference Data
 */

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Brain, Flame, Zap, Shield, Eye, Hammer, Star, Heart, Cpu,
  ChevronDown, Info, Sparkles, GitBranch,
  AlertTriangle, Atom, Wand2, Activity, Layers, Zap as PowerIcon,
  CircleDot, TrendingUp, TrendingDown, Minus, BookOpen, ChevronRight, Clock
} from 'lucide-react';
import {
  calculatePsychomatrix,
  PSYCHOMATRIX_CELL_MEANINGS,
  SCALE_COLORS,
  type PsychomatrixResult,
  type CellReading,
} from '@/lib/numerology/data/psychomatrixData';
import {
  PSYCHOMATRIX_LINE_INTERPRETATIONS,
  getLineLevel,
  type PsychomatrixLineInterpretation
} from '@/lib/numerology/data/psychomatrixLineInterpretations';
import { calculateDynamicPotentials } from '@/lib/numerology/dynamic-engine';
import { AccordionContentWithPlayer } from './accordion-content-with-player';
import { computePersonalYearNumber } from '@/lib/numerology/personal-year-full';
import { detectTransitions, type DetectedTransition, type MatrixState, type TransitionAdvisory } from '@/lib/transitions/engine';

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function SectionHeader({ icon, title }: { icon: React.ReactNode; title: string }) {
  return (
    <div className="flex items-center gap-3 mb-5">
      <div className="flex-1 h-px bg-gradient-to-r from-transparent via-amber-700/30 to-transparent" />
      <h3 className="font-cinzel font-semibold text-[0.7rem] text-amber-500/80 flex items-center gap-2 uppercase tracking-[0.3em]">
        {icon} {title}
      </h3>
      <div className="flex-1 h-px bg-gradient-to-r from-transparent via-amber-700/30 to-transparent" />
    </div>
  );
}

function Diamond({ className = '' }: { className?: string }) {
  return (
    <span
      className={`inline-block w-1.5 h-1.5 rotate-45 bg-amber-600/50 ${className}`}
      aria-hidden
    />
  );
}

function ScalePill({ scale }: { scale: string }) {
  const color = SCALE_COLORS[scale as keyof typeof SCALE_COLORS] || '#9ca3af';
  return (
    <span
      className="inline-flex items-center gap-1 text-[0.7rem] uppercase tracking-widest font-semibold px-2 py-0.5 rounded-sm border"
      style={{ color, borderColor: `${color}44`, background: `${color}22` }}
    >
      <span>{scale === 'absent' ? '◌' : '◉'}</span>
      {scale.replace('-', ' ')}
    </span>
  );
}

function getPersonalYear(d: number, m: number): number {
  return computePersonalYearNumber(d, m, new Date().getFullYear());
}

// ─────────────────────────────────────────────────────────────────────────────
// TRANSITION COMPONENTS
// ─────────────────────────────────────────────────────────────────────────────

const URGENCY_CONFIG = {
  critical: { label:'CRITICAL', color:'#ef4444', bg:'rgba(239,68,68,0.1)', border:'rgba(239,68,68,0.35)' },
  high:     { label:'HIGH',     color:'#f59e0b', bg:'rgba(245,158,11,0.1)', border:'rgba(245,158,11,0.3)' },
  moderate: { label:'ACTIVE',   color:'#a78bfa', bg:'rgba(167,139,250,0.1)', border:'rgba(167,139,250,0.28)' },
  latent:   { label:'LATENT',   color:'#60a5fa', bg:'rgba(96,165,250,0.08)', border:'rgba(96,165,250,0.2)' },
} as const;

const TRANSITION_SECTION_TITLES: Array<{ key: keyof TransitionAdvisory; label: string; icon: string }> = [
  { key: 'anatomy',    label: 'Anatomy',      icon: '✦' },
  { key: 'execution',  label: 'Execution',    icon: '⚙' },
  { key: 'resistance', label: 'Resistance',   icon: '⚔' },
  { key: 'synergy',    label: 'Synergy',      icon: '⚡' },
  { key: 'synthesis',  label: 'Synthesis',    icon: '◎' },
];

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
  const [active, setActive] = React.useState(0);
  
  const activeSections = React.useMemo(() => {
    return TRANSITION_SECTION_TITLES.filter(s => !!advisory[s.key as keyof TransitionAdvisory]);
  }, [advisory]);

  React.useEffect(() => {
    if (active >= activeSections.length) {
      setActive(0);
    }
  }, [activeSections, active]);

  const section = activeSections[active];
  if (!section) return null;
  
  const text = advisory[section.key as keyof TransitionAdvisory] || "";

  return (
    <div className="mt-4 space-y-4">
      <div className="flex gap-1.5 flex-wrap">
        {activeSections.map((s, i) => (
          <button key={s.key} onClick={() => setActive(i)}
            className={`px-3 py-1.5 rounded-lg text-[11px] uppercase font-bold border transition-all ${
              active === i ? 'bg-amber-500/20 text-amber-400 border-amber-500/40' : 'bg-white/5 text-muted-foreground border-white/10'
            }`}>
            {i + 1}. {s.label}
          </button>
        ))}
      </div>
      <motion.div key={active} initial={{ opacity:0 }} animate={{ opacity:1 }} className="p-4 rounded-xl bg-black/40 border border-white/5 text-[0.75rem] leading-relaxed text-stone-200 shadow-inner">
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-cinzel text-xs text-amber-500 uppercase tracking-widest">{section.label} — Deep Reading</h4>
          <AccordionContentWithPlayer text={text.trim()} />
        </div>
        <div className="whitespace-pre-wrap">{text.trim()}</div>
      </motion.div>
    </div>
  );
}

function TransitionCard({ t, matrixState, isOpen, onToggle }: { t: DetectedTransition; matrixState: MatrixState; isOpen: boolean; onToggle: () => void }) {
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
            <PowerIcon className="w-3 h-3" /> Cost: {t.energyCost}
          </span>
          {t.warningActive && (
            <span className="flex items-center gap-1.5 px-2 py-1 rounded bg-rose-500/10 border border-rose-500/30 text-[11px] uppercase font-bold text-rose-400">
              <Clock className="w-3 h-3" /> Year {matrixState.personalYear} Active
            </span>
          )}
        </div>

        <button onClick={onToggle} className="w-full py-2.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-500 text-[11px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2">
          <BookOpen className="h-3 w-3" />
          {isOpen ? 'Hide Advisory' : 'Read Deep Advisory'}
          {isOpen ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
        </button>
      </div>
      <AnimatePresence>
        {isOpen && (
          <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="border-t border-stone-800/60 bg-black/20 p-5">
            <AdvisoryViewer advisory={t.advisory} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// LINE ITEM COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

function LineAnalysisCard({ line, result, isOpen, onToggle }: { line: PsychomatrixLineInterpretation; result: PsychomatrixResult; isOpen: boolean; onToggle: () => void }) {
  const total = line.digits.reduce((s, d) => s + (result.counts[d] || 0), 0);
  const level = getLineLevel(line.id, total);
  if (!level) return null;

  const isActive = total >= 3;
  const color = SCALE_COLORS[level.scale];

  return (
    <div 
      className={`border rounded-sm overflow-hidden transition-all duration-200 backdrop-blur-md ${
        isActive
          ? 'border-amber-600/50 bg-amber-900/20'
          : 'border-stone-700/30 bg-black/40'
      }`}
    >
      <button 
        onClick={onToggle}
        className="w-full text-left p-4 space-y-4 hover:bg-white/5 transition-colors"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className={`text-[0.7rem] uppercase tracking-widest px-1.5 py-0.5 rounded-sm font-bold ${
              line.type === 'row' ? 'bg-blue-900/40 text-blue-300' :
              line.type === 'column' ? 'bg-emerald-900/40 text-emerald-300' :
              'bg-violet-900/40 text-violet-300'
            }`}>
              {line.type}
            </span>
            <span className="font-cinzel text-[0.75rem] text-stone-200 tracking-wider font-bold">
              {line.name}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex gap-0.5">
              {Array.from({ length: 9 }).map((_, i) => (
                <span key={i}
                  className={`w-1.5 h-1.5 rounded-full transition-all ${
                    i < total
                      ? isActive ? 'bg-amber-400' : 'bg-amber-700/60'
                      : 'bg-stone-700/40'
                  }`}
                />
              ))}
            </div>
            <ChevronDown 
              className={`h-4 w-4 text-stone-500 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} 
            />
          </div>
        </div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 space-y-8">
              {/* MEANINGS BLOCK (Grouped Old/New Intro + Old/New Level) */}
              <div className="space-y-4">
                <SectionHeader icon={<Layers className="w-4 h-4" />} title="Meanings" />
                <div className="text-[0.75rem] text-stone-200 leading-relaxed space-y-6">
                  {/* Part 1: Old Introduction */}
                  <div className="opacity-90 italic border-b border-white/5 pb-2">
                    <AccordionContentWithPlayer text={line.introduction} />
                  </div>

                  {/* Part 2: Old Level Meaning (Verbatim) */}
                  <div className="p-4 rounded-sm border border-amber-600/30 bg-amber-900/10">
                    <p className="text-[0.7rem] font-black text-amber-500 uppercase tracking-widest mb-3">Primary Interpretation ({total} Digits)</p>
                    <AccordionContentWithPlayer text={level.verbatim} />
                  </div>

                  {/* Part 3: New Introduction */}
                  <div className="pt-2">
                    <AccordionContentWithPlayer text={line.newIntroduction} />
                  </div>

                  {/* Part 4: New Level Meaning (Deep Dive) */}
                  <div className="p-4 rounded-sm border border-stone-700/40 bg-black/40 shadow-inner">
                    <AccordionContentWithPlayer text={level.deepDive} />
                  </div>
                </div>
              </div>

              {/* INNER MECHANICS */}
              <div className="space-y-4">
                <SectionHeader icon={<Wand2 className="w-4 h-4" />} title="Inner Mechanics" />
                <div className="p-4 rounded-sm border border-amber-500/30 bg-amber-900/10 text-[0.72rem] text-amber-100 leading-relaxed space-y-6">
                  <AccordionContentWithPlayer text={line.transmutation} />
                  <div className="border-t border-amber-500/20 pt-4">
                    <AccordionContentWithPlayer text={line.newMechanics} />
                  </div>
                </div>
              </div>

              {/* ALEXANDROV'S NOTE (Static) */}
              <div className="space-y-4">
                <SectionHeader icon={<BookOpen className="w-4 h-4" />} title="Interpreter's Note" />
                <div className="p-4 rounded-sm border border-stone-700/30 bg-black/40 backdrop-blur-md text-[0.75rem] text-stone-200 leading-relaxed">
                  <AccordionContentWithPlayer text={line.alexandrovNote} />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// GRID CELL
// ─────────────────────────────────────────────────────────────────────────────

interface GridCellProps {
  digit: number;
  reading: CellReading;
  isSelected: boolean;
  onSelect: (digit: number) => void;
}

function GridCell({ digit, reading, isSelected, onSelect }: GridCellProps) {
  const scaleColor = SCALE_COLORS[reading.scale];
  const isEmpty = reading.count === 0;

  return (
    <motion.button
      onClick={() => onSelect(digit)}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      className={`
        relative aspect-square flex flex-col items-center justify-between p-2
        rounded-sm border transition-all duration-300 text-left w-full
        backdrop-blur-md
        ${isSelected
          ? 'border-amber-500/60 bg-amber-900/40 shadow-[0_0_18px_rgba(196,154,40,0.25)]'
          : isEmpty
            ? 'border-stone-700/30 bg-black/40 hover:border-stone-600/40'
            : 'border-stone-600/40 bg-black/40 hover:border-amber-700/40'
        }
      `}
      style={isSelected ? { boxShadow: `0 0 16px ${scaleColor}33` } : {}}
    >
      <span className="absolute top-1 left-1 w-1 h-1 rotate-45 opacity-30"
        style={{ background: scaleColor }} />
      <span className="absolute bottom-1 right-1 w-1 h-1 rotate-45 opacity-30"
        style={{ background: scaleColor }} />

      <div className="flex items-center gap-1 self-start">
        <span className="text-[0.7rem] opacity-60" style={{ color: scaleColor }}>
          {DIGIT_ICONS[digit]}
        </span>
        <span className="font-cinzel text-[0.7rem] opacity-70 tracking-widest"
          style={{ color: scaleColor }}>
          {digit}
        </span>
      </div>

      <div className="flex-1 flex items-center justify-center">
        {isEmpty ? (
          <span className="font-cinzel text-[1.4rem] text-stone-700/60">—</span>
        ) : (
          <div className="flex flex-wrap justify-center gap-px max-w-[48px]">
            {Array.from({ length: Math.min(reading.count, 6) }).map((_, i) => (
              <motion.span
                key={i}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: i * 0.04 }}
                className="font-cinzel font-bold text-[1rem] leading-none"
                style={{ color: scaleColor }}
              >
                {digit}
              </motion.span>
            ))}
          </div>
        )}
      </div>

      <div className="self-end text-right w-full">
        <p className="font-cinzel text-[0.62rem] uppercase tracking-wider opacity-60 leading-tight">
          {reading.cellName.split('/')[0].trim()}
        </p>
      </div>

      {isSelected && (
        <motion.span
          layoutId="cell-selector"
          className="absolute inset-0 rounded-sm pointer-events-none"
          style={{ border: `1px solid ${scaleColor}`, opacity: 0.6 }}
        />
      )}
    </motion.button>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

const TABS = ['Matrix', 'Detail', 'Lines', 'Synthesis', 'Origins'] as const;
type Tab = typeof TABS[number];

interface PsychomatrixDisplayProps {
  day: number;
  month: number;
  year: number;
  gender?: string;
  name?: string;
}

export function PsychomatrixDisplay({ day, month, year, gender = 'male', name }: PsychomatrixDisplayProps) {
  const result = React.useMemo(() =>
    calculatePsychomatrix(day, month, year),
    [day, month, year]
  );

  const dynamicResult = React.useMemo(() => 
    calculateDynamicPotentials(year, result.counts),
    [year, result.counts]
  );

  const personalYear = React.useMemo(() => getPersonalYear(day, month), [day, month]);

  const matrixState: MatrixState = React.useMemo(() => ({
    counts: result.counts,
    personalYear,
    birthDay: day,
    birthMonth: month,
    birthYear: year,
    gender: (gender as 'male' | 'female') || 'male',
  }), [result.counts, personalYear, day, month, year, gender]);

  const transitions = React.useMemo(() => detectTransitions(matrixState), [matrixState]);

  const [selectedDigit, setSelectedDigit] = React.useState<number>(1);
  const [activeTab, setActiveTab] = React.useState<Tab>('Matrix');
  const [openLineId, setOpenLineId] = React.useState<string | null>(null);
  const [openTransitionId, setOpenTransitionId] = React.useState<string | null>(null);

  const selectedReading = result.cellReadings.find(r => r.digit === selectedDigit)!;
  const selectedCellDef = PSYCHOMATRIX_CELL_MEANINGS[selectedDigit];

  const gridRows = [
    [1, 4, 7],
    [2, 5, 8],
    [3, 6, 9],
  ];

  return (
    <div className="space-y-6">
      {/* ── CONSTANT GRID HEADER ── */}
      <div className="space-y-4">
        <div className="text-center space-y-1">
          <div className="flex items-center justify-center gap-3">
            <Diamond />
            <h2 className="font-cinzel text-[0.75rem] uppercase tracking-[0.35em] text-amber-500 font-bold">
              Alexandrov&apos;s Psychomatrix
            </h2>
            <Diamond />
          </div>
          <p className="font-cinzel text-[0.7rem] uppercase tracking-[0.25em] text-stone-500 font-medium">
            Pythagorean Square · Digital Analysis
          </p>
          {name && <p className="text-stone-400 text-[0.75rem] italic font-body">for {name}</p>}
        </div>

        <div
          id="psychomatrix-grid"
          className="relative border border-stone-700/40 rounded-sm p-2 backdrop-blur-xl"
          style={{ background: 'linear-gradient(135deg, rgba(0,0,0,0.6) 0%, rgba(20,15,8,0.7) 100%)' }}
        >
          <div className="border border-stone-700/20 rounded-sm p-2 bg-black/20">
            <div className="grid grid-cols-3 gap-2">
              {gridRows.map((row) =>
                row.map(digit => (
                  <GridCell
                    key={digit}
                    digit={digit}
                    reading={result.cellReadings.find(r => r.digit === digit)!}
                    isSelected={selectedDigit === digit}
                    onSelect={d => { setSelectedDigit(d); setActiveTab('Detail'); }}
                  />
                ))
              )}
            </div>
          </div>
          <div className="mt-3 flex items-center justify-between px-2 overflow-hidden">
            <div className="flex gap-3 flex-wrap whitespace-nowrap">
              {result.activeLines.map(lineId => {
                const line = PSYCHOMATRIX_LINE_INTERPRETATIONS.find(l => l.id === lineId);
                if (!line) return null;
                const typeColor = line.type === 'row' ? '#60a5fa' : line.type === 'column' ? '#34d399' : '#a78bfa';
                return (
                  <span key={lineId}
                    className="text-[0.7rem] uppercase tracking-widest font-black"
                    style={{ color: typeColor }}
                  >
                    ✦ {line.name}
                  </span>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="flex border-b border-stone-700/30 overflow-x-auto scrollbar-hide bg-black/20 rounded-t-lg gap-2 px-1">
        {TABS.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`
              flex-1 min-w-0 px-1 py-3 font-cinzel text-[0.7rem] uppercase tracking-wider
              border-b-2 transition-all duration-300 whitespace-nowrap font-bold
              ${activeTab === tab
                ? 'border-amber-500 text-amber-400 bg-amber-500/10'
                : 'border-transparent text-stone-500 hover:text-stone-300 hover:bg-white/5'
              }
            `}
          >
            {tab}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.2 }}
          className="min-h-[300px]"
        >
          {activeTab === 'Matrix' && (
            <div className="space-y-6">
              <p className="text-center text-[0.7rem] text-stone-500 uppercase tracking-[0.2em] font-bold">
                ↑ Tap a cell to reveal its full interpretation
              </p>
              
              <div className="grid grid-cols-4 gap-2">
                {[
                  { label: 'I', val: result.first,  sub: 'Develop' },
                  { label: 'II', val: result.second, sub: 'Purpose' },
                  { label: 'III', val: result.third,  sub: 'Origin I' },
                  { label: 'IV', val: result.fourth, sub: 'Origin II' },
                ].map(({ label, val, sub }) => (
                  <div key={label}
                    className="border border-stone-700/40 rounded-sm bg-black/40 backdrop-blur-md py-3 text-center space-y-1"
                  >
                    <p className="font-cinzel text-[0.7rem] uppercase tracking-widest text-stone-500 font-bold">{label}</p>
                    <p className="font-cinzel text-xl font-black text-amber-400 leading-none">{val}</p>
                    <p className="font-cinzel text-[0.7rem] uppercase tracking-wide text-stone-600 font-bold">{sub}</p>
                  </div>
                ))}
              </div>

              {/* Zero Analysis Section */}
              {result.zeroAnalysis.hasAnyZero && (
                <div className="space-y-4 pt-4 border-t border-stone-800/40">
                  <SectionHeader icon={<CircleDot className="w-4 h-4" />} title="Analysis of the Great Void (0)" />
                  <div className="space-y-4">
                    {result.zeroAnalysis.interpretations.map((text, idx) => (
                      <div key={idx} className="p-4 rounded-sm border border-stone-700/30 bg-black/40 backdrop-blur-md">
                        <div className="text-[0.72rem] text-stone-300 leading-relaxed italic">
                          <AccordionContentWithPlayer text={text} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'Detail' && (
            <div className="space-y-5">
              <div className="flex gap-2 flex-wrap justify-center bg-black/20 p-2 rounded-sm border border-white/5">
                {Array.from({ length: 9 }, (_, i) => i + 1).map(d => {
                  const r = result.cellReadings.find(cr => cr.digit === d)!;
                  const color = SCALE_COLORS[r.scale];
                  return (
                    <button
                      key={d}
                      onClick={() => setSelectedDigit(d)}
                      className="flex flex-col items-center gap-1 px-2.5 py-2 border rounded-sm transition-all duration-300 min-w-[42px] backdrop-blur-sm"
                      style={selectedDigit === d
                        ? { borderColor: `${color}`, background: `${color}33`, color }
                        : { borderColor: 'rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.2)', color: '#777' }
                      }
                    >
                      <span className="font-cinzel text-sm font-black">{d}</span>
                      <span className="text-[0.7rem] font-bold">{r.scale === 'absent' ? '◌' : '◉'}</span>
                    </button>
                  );
                })}
              </div>
              <AnimatePresence mode="wait">
                {selectedReading && (
                  <motion.div
                    key={selectedDigit}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.25 }}
                    className="space-y-6"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span style={{ color: SCALE_COLORS[selectedReading.scale] }}>{DIGIT_ICONS[selectedReading.digit]}</span>
                          <h4 className="font-cinzel text-sm font-bold tracking-wider text-stone-200">
                            Number {selectedReading.digit} — {selectedReading.cellName}
                          </h4>
                        </div>
                        <div className="flex items-center gap-2">
                          <ScalePill scale={selectedReading.scale} />
                          <span className="text-[0.7rem] text-stone-400 uppercase tracking-widest">
                            {selectedReading.count === 0 ? 'Absent' : `${selectedReading.count} ${selectedReading.count === 1 ? 'instance' : 'instances'}`}
                          </span>
                        </div>
                      </div>
                      <div
                        className="font-cinzel text-3xl font-bold opacity-20 shrink-0"
                        style={{ color: SCALE_COLORS[selectedReading.scale] }}
                      >
                        {selectedReading.digit}
                      </div>
                    </div>

                    {/* Alexandrov's General Meaning Segment */}
                    {selectedCellDef.generalMeaning && (
                      <div className="space-y-4">
                        <SectionHeader icon={<BookOpen className="w-4 h-4" />} title={`General Meaning of Number ${selectedDigit}`} />
                        <div className="p-4 rounded-sm border border-stone-700/30 bg-black/40 backdrop-blur-md">
                          <div className="text-[0.75rem] text-stone-200 leading-relaxed">
                            <AccordionContentWithPlayer text={selectedCellDef.generalMeaning} />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Repetition-Specific Meaning Segment */}
                    <div className="space-y-4">
                      <SectionHeader icon={<Layers className="w-4 h-4" />} title={`${selectedReading.label} Analysis`} />
                      <div
                        className="border rounded-sm p-4 space-y-3 backdrop-blur-md"
                        style={{ borderColor: `${SCALE_COLORS[selectedReading.scale]}44`, background: `${SCALE_COLORS[selectedReading.scale]}11` }}
                      >
                        <div className="text-[0.75rem] text-stone-200 leading-relaxed">
                          <AccordionContentWithPlayer text={selectedReading.verbatim} />
                        </div>
                      </div>

                      {/* View all intensity levels */}
                      {selectedCellDef?.meanings && selectedCellDef.meanings.length > 1 && (
                        <details className="group">
                          <summary className="cursor-pointer list-none flex items-center gap-2 py-1.5 text-[0.7rem] uppercase tracking-widest font-cinzel font-semibold text-amber-500/55 hover:text-amber-400 transition-colors select-none">
                            <span className="group-open:rotate-90 transition-transform duration-200 inline-block">›</span>
                            View all intensity levels
                          </summary>
                          <div className="mt-3 space-y-3">
                            {selectedCellDef.meanings.map((m) => {
                              const isActive = m.label === selectedReading.label;
                              return (
                                <div
                                  key={m.count}
                                  className="border rounded-sm p-3 backdrop-blur-md"
                                  style={isActive
                                    ? { borderColor: `${SCALE_COLORS[selectedReading.scale]}55`, background: `${SCALE_COLORS[selectedReading.scale]}15` }
                                    : { borderColor: 'rgba(255,255,255,0.06)', background: 'rgba(0,0,0,0.25)' }
                                  }
                                >
                                  <div className="flex items-center gap-2 mb-2">
                                    <span
                                      className="font-cinzel text-[0.7rem] uppercase tracking-widest font-semibold"
                                      style={{ color: isActive ? SCALE_COLORS[m.scale] : '#6b7280' }}
                                    >
                                      {m.label}
                                    </span>
                                    {isActive && (
                                      <span className="text-[0.7rem] uppercase tracking-widest font-cinzel px-1.5 py-0.5 rounded-sm"
                                        style={{ background: `${SCALE_COLORS[m.scale]}22`, color: SCALE_COLORS[m.scale], border: `1px solid ${SCALE_COLORS[m.scale]}44` }}>
                                        current
                                      </span>
                                    )}
                                  </div>
                                  <div className="text-[0.72rem] leading-relaxed" style={{ color: isActive ? '#d6d3d1' : '#78716c' }}>
                                    <AccordionContentWithPlayer text={m.verbatim} />
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </details>
                      )}
                    </div>

                    <div className="space-y-4">
                      <SectionHeader icon={<AlertTriangle className="w-4 h-4" />} title={`Difficulty in interpreting number ${selectedDigit}`} />
                      <div className="p-4 rounded-sm border border-stone-700/30 bg-black/40 backdrop-blur-md text-[0.75rem] text-stone-200 leading-relaxed">
                        <AccordionContentWithPlayer text={selectedReading.difficultyVerbatim || "Analysis pending."} />
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {activeTab === 'Lines' && (
            <div className="space-y-5">
              <SectionHeader icon={<GitBranch className="w-4 h-4" />} title="Rows · Columns · Diagonals" />
              <p className="text-center text-[0.7rem] text-stone-500 uppercase tracking-[0.2em] font-bold mb-4">
                ↑ Tap a line to reveal its full interpretation
              </p>
              <div className="space-y-2">
                {PSYCHOMATRIX_LINE_INTERPRETATIONS.map(line => (
                  <LineAnalysisCard
                    key={line.id}
                    line={line}
                    result={result}
                    isOpen={openLineId === line.id}
                    onToggle={() => setOpenLineId(prev => prev === line.id ? null : line.id)}
                  />
                ))}
              </div>

              {/* Dynamic Matrix Potentials Section */}
              {dynamicResult.hasDynamicNumbers && (
                <div className="pt-6 border-t border-stone-800/50">
                  <SectionHeader icon={<PowerIcon className="w-4 h-4" />} title="Dynamic Matrix Potentials" />
                  <div className="p-5 rounded-sm border border-primary/30 bg-primary/5 space-y-4">
                    <div className="flex items-center gap-2 mb-2">
                      <PowerIcon className="w-4 h-4 text-primary animate-pulse" />
                      <h4 className="font-cinzel text-xs font-bold uppercase tracking-widest text-primary">Millennium Activation Enabled</h4>
                    </div>
                    <div className="text-[0.75rem] text-stone-200 leading-relaxed space-y-4">
                      <AccordionContentWithPlayer text={dynamicResult.interpretation} />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'Synthesis' && (
            <div className="space-y-6">
              {/* Transitions Section (Deterministic) */}
              <div className="space-y-5">
                <SectionHeader icon={<Activity className="w-4 h-4" />} title="Karmic Life Transitions" />
                {transitions.length === 0 ? (
                  <p className="text-center py-6 text-stone-500 text-[0.72rem] uppercase tracking-widest">No major transitions detected in this configuration.</p>
                ) : (
                  <div className="space-y-4">
                    {transitions.map(t => (
                      <TransitionCard
                        key={t.id}
                        t={t}
                        matrixState={matrixState}
                        isOpen={openTransitionId === t.id}
                        onToggle={() => setOpenTransitionId(prev => prev === t.id ? null : t.id)}
                      />
                    ))}
                  </div>
                )}
              </div>

              <SectionHeader icon={<Sparkles className="w-3 h-3" />} title="Cross-Digit Interactions" />
              <div className="space-y-3">
                {result.complementaryInsights.map((insight, i) => {
                  const color = '#60a5fa'; // Default synergy color
                  return (
                    <div key={i}
                      className="border rounded-sm overflow-hidden backdrop-blur-md p-4"
                      style={{ borderColor: `${color}44`, background: `${color}11` }}
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <span className="text-[0.7rem] uppercase tracking-widest px-1.5 py-0.5 rounded-sm font-bold"
                          style={{ color, background: `${color}22` }}>
                          {insight.type}
                        </span>
                        <span className="font-cinzel text-[0.7rem] text-stone-100 font-bold tracking-wide">
                          {insight.title}
                        </span>
                      </div>
                      <div className="text-[0.72rem] text-stone-200 leading-relaxed">
                        <AccordionContentWithPlayer text={insight.insight} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === 'Origins' && (
            <div className="space-y-6">
              <SectionHeader icon={<Info className="w-4 h-4" />} title="The Four Working Numbers" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { n: result.first, title: 'First Working Number', role: 'Qualities to Develop' },
                  { n: result.second, title: 'Second Working Number', role: 'Leading Quality & Purpose' },
                  { n: result.third, title: 'Third Working Number', role: 'Qualities from Birth (I)' },
                  { n: result.fourth, title: 'Fourth Working Number', role: 'Qualities from Birth (II)' },
                ].map(({ n, title, role }) => (
                  <div key={title} className="border border-stone-700/30 bg-black/40 backdrop-blur-md rounded-sm p-4 space-y-2">
                    <div className="flex items-end gap-3">
                      <span className="font-cinzel text-3xl font-black text-amber-400 leading-none">{n}</span>
                      <span className="text-[0.7rem] uppercase tracking-widest text-amber-600/70 pb-1 font-bold">{title}</span>
                    </div>
                    <p className="font-cinzel text-[0.7rem] text-amber-500 font-bold uppercase tracking-widest">{role}</p>
                  </div>
                ))}
              </div>
              
              <div className="border border-stone-700/40 rounded-sm p-4 bg-black/40 backdrop-blur-md space-y-3">
                <p className="font-cinzel text-[0.7rem] uppercase tracking-widest text-stone-400 font-bold">◈ Calculation Log</p>
                <div className="space-y-2 font-mono text-[0.72rem] text-stone-200">
                  <p className="flex justify-between border-b border-white/5 pb-1"><span className="text-stone-500">Birth date digits: </span><span>{`${day}`.split('').join('+')}+{`${month}`.split('').join('+')}+{`${year}`.split('').join('+')} = <span className="text-amber-400 font-bold">{result.first}</span> <span className="text-stone-600 ml-2">(I)</span></span></p>
                  <p className="flex justify-between border-b border-white/5 pb-1"><span className="text-stone-500">Sum of (I): </span><span>{String(result.first).split('').join('+')} = <span className="text-amber-400 font-bold">{result.second}</span> <span className="text-stone-600 ml-2">(II)</span></span></p>
                  <p className="flex justify-between border-b border-white/5 pb-1"><span className="text-stone-500">(I) − 2×{String(day)[0]}: </span><span>{result.first} − {2 * Number(String(day)[0])} = <span className="text-amber-400 font-bold">{result.third}</span> <span className="text-stone-600 ml-2">(III)</span></span></p>
                  <p className="flex justify-between pb-1"><span className="text-stone-600">Sum of (III): </span><span>{String(result.third).split('').join('+')} = <span className="text-amber-400 font-bold">{result.fourth}</span> <span className="text-stone-600 ml-2">(IV)</span></span></p>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      <div className="text-center pt-4 border-t border-stone-800/50">
        <p className="text-[0.7rem] uppercase tracking-[0.4em] text-stone-600 font-bold">
          Pythagorean Square · Digital Analysis
        </p>
      </div>
    </div>
  );
}

const DIGIT_ICONS: Record<number, React.ReactNode> = {
  1: <Flame  className="w-3 h-3" />,
  2: <Zap    className="w-3 h-3" />,
  3: <Brain  className="w-3 h-3" />,
  4: <Shield className="w-3 h-3" />,
  5: <Cpu    className="w-3 h-3" />,
  6: <Hammer className="w-3 h-3" />,
  7: <Star   className="w-3 h-3" />,
  8: <Heart  className="w-3 h-3" />,
  9: <Eye    className="w-3 h-3" />,
};

export default PsychomatrixDisplay;