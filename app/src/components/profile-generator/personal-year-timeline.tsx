
import React, { useMemo, useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AccordionContentWithPlayer } from './accordion-content-with-player';

// ── PY colour palette ──────────────────────────────────────────────────────────
// Matches the wave chart's golden theme. Peaks warm, troughs cool.
const PY_COLORS: Record<number, { ring: string; bg: string; text: string; label: string }> = {
  1: { ring: '#c8a84b', bg: 'rgba(200,168,75,0.15)',  text: '#fceabb', label: 'New Cycle'   },
  2: { ring: '#64748b', bg: 'rgba(100,116,139,0.15)', text: '#cbd5e1', label: 'Patience'    },
  3: { ring: '#4ade80', bg: 'rgba(74,222,128,0.12)',  text: '#bbf7d0', label: 'Expression'  },
  4: { ring: '#f97316', bg: 'rgba(249,115,22,0.12)',  text: '#fed7aa', label: 'Foundation'  },
  5: { ring: '#22d3ee', bg: 'rgba(34,211,238,0.12)',  text: '#a5f3fc', label: 'Change'      },
  6: { ring: '#d4af37', bg: 'rgba(212,175,55,0.15)',  text: '#fde68a', label: 'Heart'       },
  7: { ring: '#a855f7', bg: 'rgba(168,85,247,0.12)',  text: '#e9d5ff', label: 'Soul'        },
  8: { ring: '#f59e0b', bg: 'rgba(245,158,11,0.15)',  text: '#fef3c7', label: 'Power'       },
  9: { ring: '#e040fb', bg: 'rgba(224,64,251,0.15)',  text: '#f5d0fe', label: 'Completion'  },
};

// ── Full rich interpretations (from personal-year-full.ts) ─────────────────────
const PY_TITLES: Record<number, string> = {
  1: 'Personal Year 1 — The Year of Beginnings',
  2: 'Personal Year 2 — The Year of Patience',
  3: 'Personal Year 3 — The Year of Expression',
  4: 'Personal Year 4 — The Year of Foundation',
  5: 'Personal Year 5 — The Year of Change',
  6: 'Personal Year 6 — The Year of the Heart',
  7: 'Personal Year 7 — The Year of the Soul',
  8: 'Personal Year 8 — The Year of Power',
  9: 'Personal Year 9 — The Year of Completion',
};

const PY_INTERPRETATIONS: Record<number, string> = {
  1: `PERSONAL YEAR 1 — The Year of Beginnings

A Personal Year 1 opens a brand new nine-year epic cycle in your life. This is not merely a good year for starting things — it is the year when the universe HANDS you a blank page and a pen and waits to see what you will write. Everything begun in a Year 1 has the potential to develop across the full nine-year arc that follows.

THE DOORWAY: A Year 1 often begins with a sense of doors closing on old cycles and new ones appearing — sometimes literally, in the form of relocations, career changes, or the end of old relationships. This is not random disruption but the necessary clearing of space for what is to come. The courage to walk through those doors — to say yes to the unfamiliar — is the primary curriculum.

CORE CURRICULUM: Independence, initiative, and the development of authentic selfhood. In a Year 1, you are learning to trust your own judgment, to act without external validation, and to lead your own life rather than being carried along by circumstances. This is the year to ask: "What do I actually want?" — not what others expect, not what is sensible, but what your soul is calling you toward.

THE PRACTICE: Identify ONE major initiative, project, or direction shift, and commit fully. The Year 1 energy rewards focus and punishes scattering. Begin something that will take years to complete. Plant seeds whose harvest you cannot yet imagine. Say yes to the thing that terrifies you — the Year 1 provides courage.

THE SHADOW: Impulsiveness, arrogance, and the temptation to burn bridges that still have value. Not everything old needs to be destroyed to make room for the new; some things need to be integrated. The Year 1 who operates without humility may find that the seeds they plant are not the ones they intended.`,

  2: `PERSONAL YEAR 2 — The Year of Patience

A Personal Year 2 follows the explosive initiations of the Year 1 with a necessary deceleration. Where the Year 1 was about ACTION, the Year 2 is about RECEPTION — allowing the seeds you planted to begin their underground germination, developing the relationships that will support your new direction, and learning that not all progress is visible.

THE SLOWING: Many people find the Year 2 frustrating, especially after the momentum of a Year 1. The universe seems to be saying: "Wait." Projects stall, plans require revision, and the pace of external progress slows to a crawl. This is not punishment but the necessary consolidation phase of any genuine growth — the foundation is being laid below ground where you cannot see it.

CORE CURRICULUM: Partnership, patience, and emotional intelligence. In a Year 2, you are learning to collaborate without losing yourself, to feel the emotional currents beneath the surface of events, and to trust that what is growing in the dark will eventually emerge into light. This is the year to develop your intuition — the Year 2 amplifies psychic sensitivity.

THE PRACTICE: Practice patience as a SPIRITUAL DISCIPLINE, not as passive waiting. When the urge to force outcomes arises, pause and breathe. Cultivate relationships — the Year 2 is ideal for deepening partnerships and resolving old conflicts. Keep a dream journal; your unconscious will be unusually active and communicative.

THE SHADOW: Passivity masquerading as patience, resentment toward the slow pace, and the temptation to abandon the Year 1's initiatives because the initial excitement has faded and the work is now quiet and unglamorous. The Year 2 who cannot tolerate slowness may abort projects that would have borne extraordinary fruit.`,

  3: `PERSONAL YEAR 3 — The Year of Expression

A Personal Year 3 is the most joyful year in the nine-year cycle — the year when the seeds planted in Year 1 and gestated in Year 2 finally break through the soil into visible growth. This is a year of creativity, communication, and social expansion. Life feels lighter; possibilities feel more accessible; self-expression flows naturally.

THE BLOOM: The Year 3 brings a palpable sense of energy returning after the Year 2's slowness. Social opportunities multiply, creative inspiration strikes frequently, and the general atmosphere is one of optimism and forward motion. This is the year to SHARE what you have been developing — to speak, write, create, perform, and connect.

CORE CURRICULUM: Authentic self-expression, creative discipline, and the balance between joy and depth. In a Year 3, you are learning to express yourself fully without performing for approval, to channel creative energy into sustained projects (not just inspired bursts), and to find the depth within joy rather than fleeing depth in favor of surface-level happiness.

THE PRACTICE: Dedicate time each week to creative expression — not for an audience but for the pure pleasure of creating. Say yes to social invitations but maintain a core practice that grounds you. Start a creative project that scares you slightly — the Year 3 provides the courage to share your voice.

THE SHADOW: Scattering creative energy across too many projects, superficiality disguised as sociability, and the temptation to use the Year 3's social energy to avoid the inner work that still needs doing. The Year 3 who never pauses to integrate will arrive at the Year 4 exhausted and directionless.`,

  4: `PERSONAL YEAR 4 — The Year of Foundation

A Personal Year 4 is the most demanding year in the nine-year cycle but also the most productive — IF you are willing to do the work. This is the year of discipline, structure, and the patient labor that transforms inspired ideas (Year 1), deepened relationships (Year 2), and creative expression (Year 3) into something durable and real.

THE LABOR: The Year 4 often arrives with a sobering shift in energy. The lightness of the Year 3 is replaced by a sense of responsibility and the demand for concrete action. Projects that were exciting in theory must now be executed in practice, and execution requires discipline, organization, and sustained effort. Many people resist the Year 4, finding it oppressive after the Year 3's freedom — but those who embrace it build foundations that support them for years.

CORE CURRICULUM: Discipline, structure, and the transformation of vision into form. In a Year 4, you are learning that inspiration without implementation is fantasy, that freedom requires limits, and that the patient accumulation of small, consistent efforts produces results that dramatic gestures cannot match. This is the year to build your systems — the habits, routines, and organizational structures that will carry your initiatives forward.

THE PRACTICE: Establish one new daily discipline and maintain it for the entire year. Organize one area of your life (finances, health, workspace, schedule) that has been chaotic. Set concrete, measurable goals with deadlines, and hold yourself accountable. The Year 4 rewards consistency and punishes shortcuts.

THE SHADOW: Workaholism, rigidity, and the temptation to sacrifice health and relationships to the demands of productivity. The Year 4 who works without rest will arrive at the Year 5 broken rather than strong. The discipline must serve the vision, not become an end in itself.`,

  5: `PERSONAL YEAR 5 — The Year of Change

A Personal Year 5 is the most unpredictable year in the nine-year cycle — the year when the structures built in Year 4 are tested by the winds of change, and the discipline developed in the previous years is challenged by the impulse toward freedom, adventure, and the radically new. This is the year of surprises, both exhilarating and destabilizing.

THE WINDS: The Year 5 often brings events that cannot be planned for — sudden opportunities, unexpected endings, chance encounters that alter the course of life. The universe seems to be saying: "You have built your foundation; now let me show you what freedom feels like." The Year 5 is not a rejection of the Year 4's discipline but its TEST — can you maintain your center while embracing change?

CORE CURRICULUM: Freedom, adaptability, and the wisdom to distinguish between liberation and escape. In a Year 5, you are learning to embrace change without being destabilized by it, to exercise freedom without abandoning responsibility, and to recognize that genuine freedom is internal — the capacity to remain centered regardless of external circumstances.

THE PRACTICE: Say yes to one significant change you have been avoiding. Travel if possible — the Year 5 amplifies the transformative potential of new environments. Practice daily centering (meditation, breathwork, exercise) to maintain groundedness amid flux. Allow plans to shift without abandoning your core commitments.

THE SHADOW: Chaos, recklessness, and the temptation to abandon everything that feels constraining — including commitments and relationships that still have value. The Year 5 who interprets every impulse toward freedom as a mandate to flee will arrive at the Year 6 isolated rather than liberated.`,

  6: `PERSONAL YEAR 6 — The Year of the Heart

A Personal Year 6 brings the focus home — literally and metaphorically. After the upheavals of the Year 5, the Year 6 turns attention toward relationships, family, domestic harmony, and the cultivation of love in all its forms. This is the year of the heart, when matters of connection, care, and responsibility take precedence over ambition and adventure.

THE HOMECOMING: The Year 6 often brings a desire to settle, to beautify, to create environments of genuine warmth and welcome. Relationships that survived the Year 5's turbulence deepen; those that did not reveal their fragility. This is the year to tend what you love — your home, your family (chosen or biological), your community, and yourself.

CORE CURRICULUM: Love, responsibility, and the balance between giving and receiving. In a Year 6, you are learning that genuine love is not sacrifice but service, that responsibility is not burden but privilege, and that the capacity to receive love is as important as the capacity to give it. This is the year to heal relationship wounds and to create beauty in your immediate environment.

THE PRACTICE: Perform one act of service daily for someone you love — without announcement, without expectation of return. Beautify your home. Mend one damaged relationship (or, if mending is impossible, complete it with grace). Learn to receive — accept help, compliments, and care without immediately deflecting or reciprocating.

THE SHADOW: Martyrdom, over-giving, and the temptation to sacrifice yourself entirely to the care of others. The Year 6 who gives without receiving will arrive at the Year 7 depleted rather than enriched. The heart that pours out endlessly without being refilled eventually runs dry.`,

  7: `PERSONAL YEAR 7 — The Year of the Soul

A Personal Year 7 is the most introspective year in the nine-year cycle — a year of withdrawal, reflection, and spiritual deepening. After the relational intensity of the Year 6, the Year 7 invites you inward, away from the demands of relationships and toward the demands of your own soul. This is the year to seek understanding, not achievement; to ask questions, not supply answers; to deepen, not to expand.

THE RETREAT: The Year 7 often brings a diminished appetite for social engagement and an increased hunger for solitude, study, and spiritual practice. Others may find you distant; you are simply elsewhere — attending to the inner dimension of your existence, which requires quiet and focus. This is not antisocial behavior but a sacred necessity, and those who love you should be given to understand this.

CORE CURRICULUM: Wisdom, spiritual depth, and the integration of life experience into understanding. In a Year 7, you are learning to trust your inner guidance over external authority, to develop a spiritual practice that sustains you, and to find the lessons embedded in the experiences of the previous six years. This is the year to study — not for credentials but for transformation.

THE PRACTICE: Establish or deepen a spiritual practice — meditation, contemplation, study of sacred texts, time in nature. Read challenging books. Keep a journal of insights and questions. Protect your solitude fiercely; the Year 7's gifts emerge in silence, not in conversation.

THE SHADOW: Isolation, intellectual arrogance, and the temptation to use spiritual seeking as an escape from practical responsibilities or relational commitments. The Year 7 who ascends to the mountaintop and never descends has missed the point — the wisdom gained in solitude must eventually be shared with others.`,

  8: `PERSONAL YEAR 8 — The Year of Power

A Personal Year 8 is the year of karmic return — the harvest, for good or ill, of the seeds planted across the previous seven years. This is the year of power, material manifestation, and the exercise of authority. Whatever you have genuinely earned — in career, finances, relationships, or wisdom — tends to arrive now.

THE HARVEST: The Year 8 often brings significant material developments — promotions, financial windfalls, business successes — but these are not random gifts. They are the natural fruition of the work done in Years 1 through 7 (or, in some cases, work done in previous cycles). The Year 8 reveals the karmic mathematics of your life: what you have truly earned will arrive; what you have not earned will not arrive, no matter how desperately you want it.

CORE CURRICULUM: Power, ethical authority, and the integration of material and spiritual values. In a Year 8, you are learning to wield power without being corrupted by it, to direct resources toward meaningful ends, and to recognize that the truest wealth is what you enable others to create. This is the year to take command of your material life — to organize finances, to step into leadership, to claim your authority.

THE PRACTICE: Review your relationship with money and power honestly. Where have you been avoiding financial responsibility? Make one significant financial decision that you have been postponing. Step into a leadership role that feels slightly beyond your current capacity — the Year 8 provides the authority.

THE SHADOW: Greed, domination, and the temptation to measure all value in material terms. The Year 8 who grasps too tightly will lose what they try to hold. Power is a test, not a reward.`,

  9: `PERSONAL YEAR 9 — The Year of Completion

A Personal Year 9 is the most emotionally complex year in the nine-year cycle — the year of endings, release, and the completion of a full epic cycle. What was begun in your last Year 1 is now completing; what has served its purpose must be released; what cannot survive must be allowed to die. This is not a year of tragedy but of PROFOUND NECESSITY — the clearing that makes space for the next cycle to begin.

THE RELEASE: The Year 9 often brings endings — relationships conclude, careers shift, identities dissolve. These endings are not punishments but completions; the universe is removing structures that have served their purpose so that new ones can emerge. The Year 9 who clings to what is ending will experience unnecessary suffering. The Year 9 who releases voluntarily will experience the completion as liberation.

CORE CURRICULUM: Completion, forgiveness, and the cultivation of universal compassion. In a Year 9, you are learning to let go gracefully — of attachments, identities, grudges, and possessions that have completed their cycle. You are learning to forgive — others, yourself, life itself for not meeting your expectations. And you are learning to love impersonally — to care about humanity in general, not just your immediate circle.

THE PRACTICE: Identify one thing — a belief, a grudge, a possession, a commitment — that has completed its cycle, and consciously release it. Practice forgiveness toward someone (including yourself). Cleanse your physical space — declutter, donate, release. Prepare for the renewal that the next Year 1 will bring.

THE SHADOW: Premature endings, avoidance of necessary grief, and the temptation to use "letting go" as an excuse to flee commitments that still have value. The Year 9 who releases everything will arrive at the next Year 1 with nothing to build upon. The art is to release what has genuinely completed while honoring what is still alive and growing.`,
};

// ── helpers ───────────────────────────────────────────────────────────────────
function reduceNum(n: number): number {
  let v = Math.abs(n);
  while (v > 9) v = String(v).split('').reduce((a, d) => a + +d, 0);
  return v || 9;
}

interface TimelineEntry {
  year: number;
  pyn: number;
  isCurrent: boolean;
  isPast: boolean;
}

interface PersonalYearTimelineProps {
  birthDay: number;
  birthMonth: number;
  birthYear: number;
}

const TOTAL_YEARS = 36; // 3 full 9-year cycles visible in the strip
const PAST_YEARS  = 9;  // show 9 past years initially centered

export function PersonalYearTimeline({ birthDay, birthMonth, birthYear }: PersonalYearTimelineProps) {
  const [selectedPyn, setSelectedPyn] = useState<number | null>(null);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);

  const stripRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);
  const isDragging = useRef(false);
  const mouseStartX = useRef(0);
  const scrollStartLeft = useRef(0);

  const entries: TimelineEntry[] = useMemo(() => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const worldYear = String(currentYear).split('').reduce((a, c) => a + +c, 0);
    const birthSum = reduceNum(birthDay) + reduceNum(birthMonth);
    let currentPYN = reduceNum(worldYear + birthSum);
    if (currentPYN === 0) currentPYN = 9;

    const result: TimelineEntry[] = [];
    for (let i = -PAST_YEARS; i < (TOTAL_YEARS - PAST_YEARS); i++) {
      const year = currentYear + i;
      let pyn = ((currentPYN + i - 1) % 9) + 1;
      if (pyn <= 0) pyn += 9;
      result.push({ year, pyn, isCurrent: i === 0, isPast: i < 0 });
    }
    return result;
  }, [birthDay, birthMonth, birthYear]);

  // Scroll to current year on mount
  const currentRef = useRef<HTMLButtonElement>(null);
  const didScrollRef = useRef(false);
  const stripCallbackRef = useCallback((node: HTMLDivElement | null) => {
    (stripRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
    if (node && !didScrollRef.current) {
      didScrollRef.current = true;
      setTimeout(() => {
        const btn = currentRef.current;
        if (btn && node) {
          const btnLeft = btn.offsetLeft;
          const btnWidth = btn.offsetWidth;
          const containerWidth = node.clientWidth;
          node.scrollLeft = btnLeft - containerWidth / 2 + btnWidth / 2;
        }
      }, 80);
    }
  }, []);

  // Touch drag for the strip
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
    scrollStartLeft.current = stripRef.current?.scrollLeft ?? 0;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    const dx = touchStartX.current - e.touches[0].clientX;
    const dy = touchStartY.current - e.touches[0].clientY;
    if (Math.abs(dx) > Math.abs(dy) && stripRef.current) {
      e.preventDefault();
      stripRef.current.scrollLeft = scrollStartLeft.current + dx;
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true;
    mouseStartX.current = e.clientX;
    scrollStartLeft.current = stripRef.current?.scrollLeft ?? 0;
    e.preventDefault();
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current || !stripRef.current) return;
    stripRef.current.scrollLeft = scrollStartLeft.current + (mouseStartX.current - e.clientX);
  };

  const handleMouseUp = () => { isDragging.current = false; };

  const handleSelect = (entry: TimelineEntry) => {
    if (selectedYear === entry.year) {
      setSelectedPyn(null);
      setSelectedYear(null);
    } else {
      setSelectedPyn(entry.pyn);
      setSelectedYear(entry.year);
    }
  };

  const col = selectedPyn ? PY_COLORS[selectedPyn] : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="rounded-2xl bg-[#09101e]/80 border border-white/5 overflow-hidden"
    >
      {/* Header */}
      <div className="px-5 pt-5 pb-3 flex items-center justify-between">
        <div>
          <h4 className="font-cinzel font-bold text-[0.8rem] text-amber-300 tracking-wider uppercase">Personal Year Timeline</h4>
          <p className="text-[0.7rem] font-cinzel text-white/30 uppercase tracking-widest mt-0.5">Tap any year · Swipe to explore past & future cycles</p>
        </div>
        <div className="flex gap-1.5">
          {[1,2,3].map(i => (
            <span key={i} className="w-1.5 h-1.5 rounded-full bg-amber-400/20" />
          ))}
        </div>
      </div>

      {/* Scrollable year strip */}
      <div
        ref={stripCallbackRef}
        className="flex gap-2 px-4 pb-3 overflow-x-auto scrollbar-none select-none"
        style={{ scrollBehavior: 'smooth', WebkitOverflowScrolling: 'touch', cursor: isDragging.current ? 'grabbing' : 'grab' }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {entries.map((entry) => {
          const c = PY_COLORS[entry.pyn];
          const isSelected = selectedYear === entry.year;
          return (
            <button
              key={entry.year}
              ref={entry.isCurrent ? currentRef : undefined}
              onClick={() => handleSelect(entry)}
              className="flex-none flex flex-col items-center gap-1 rounded-xl px-3 py-2.5 transition-all duration-200 active:scale-95"
              style={{
                background: isSelected ? c.bg : entry.isCurrent ? 'rgba(200,168,75,0.08)' : 'rgba(255,255,255,0.03)',
                border: `1.5px solid ${isSelected ? c.ring : entry.isCurrent ? 'rgba(200,168,75,0.4)' : 'rgba(255,255,255,0.06)'}`,
                opacity: entry.isPast && !entry.isCurrent ? 0.65 : 1,
                boxShadow: entry.isCurrent ? `0 0 12px rgba(200,168,75,0.2)` : 'none',
                minWidth: '52px',
              }}
            >
              {/* Year label */}
              <span
                className="font-cinzel font-bold text-[0.7rem] uppercase tracking-wider"
                style={{ color: entry.isCurrent ? '#fceabb' : 'rgba(255,255,255,0.35)' }}
              >
                {entry.year}
              </span>
              {/* PY number badge */}
              <span
                className="font-cinzel font-black text-xl leading-none"
                style={{ color: isSelected ? c.text : c.ring }}
              >
                {entry.pyn}
              </span>
              {/* Phase label */}
              <span
                className="font-cinzel uppercase tracking-widest text-center leading-tight"
                style={{ fontSize: '0.62rem', color: isSelected ? c.text : 'rgba(255,255,255,0.3)', maxWidth: '48px' }}
              >
                {c.label}
              </span>
              {/* "NOW" dot */}
              {entry.isCurrent && (
                <span
                  className="w-1.5 h-1.5 rounded-full mt-0.5"
                  style={{ background: '#c8a84b', boxShadow: '0 0 6px rgba(200,168,75,0.8)' }}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Meaning panel */}
      <AnimatePresence mode="wait">
        {selectedPyn !== null && col !== null && selectedYear !== null && (
          <motion.div
            key={selectedYear}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div
              className="mx-4 mb-4 rounded-xl p-4"
              style={{ background: col.bg, border: `1px solid ${col.ring}33` }}
            >
              {/* Title row */}
              <div className="flex items-start justify-between gap-3 mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className="font-cinzel font-black text-2xl leading-none"
                      style={{ color: col.ring }}
                    >
                      {selectedPyn}
                    </span>
                    <div>
                      <p className="font-cinzel font-bold text-[0.7rem] uppercase tracking-wider" style={{ color: col.text }}>
                        {PY_TITLES[selectedPyn]}
                      </p>
                      <p className="font-cinzel text-[0.7rem] uppercase tracking-widest" style={{ color: col.ring, opacity: 0.7 }}>
                        {selectedYear} · {col.label}
                      </p>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => { setSelectedPyn(null); setSelectedYear(null); }}
                  className="text-[0.7rem] font-cinzel uppercase tracking-widest opacity-40 hover:opacity-70 transition-opacity mt-1 flex-none"
                  style={{ color: col.text }}
                >
                  ✕
                </button>
              </div>
              {/* Full interpretation */}
              <AccordionContentWithPlayer text={PY_INTERPRETATIONS[selectedPyn]} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
