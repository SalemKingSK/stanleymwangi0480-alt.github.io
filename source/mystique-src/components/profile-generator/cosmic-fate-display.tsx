
/**
 * @fileOverview Overhauled Cosmic Fate Display mirroring the "Personal Year Oracle" structure.
 * Year selection is now UNLOCKED, allowing for any year to be searched.
 */

'use client';

import React, { useState, useMemo } from 'react';
import { AstroInsightOutput, NumerologyData } from './types';
import { ANIMALS, RELATIONS, CAT_META } from '@/lib/cosmic-fate/constants';
import { BOOK } from '@/lib/cosmic-fate/book';
import { YEAR_DESCRIPTIONS, yearDescription } from '@/lib/cosmic-fate/oracle-data';
import { PINNACLE_DESC, CHALLENGE_DESC } from '@/lib/cosmic-fate/pinnacles';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { 
  Star, CalendarDays, 
  BookOpen, Activity,
  Compass, Telescope,
  RotateCcw
} from 'lucide-react';
import { SpeechPlayer } from './speech-player';
import { ScrollableTextDisplay } from './scrollable-text-display';
import { CosmicRiskScanner } from './cosmic-risk-scanner';

// Helper to reduce numbers
const reduce = (n: number): number => {
  let s = n;
  while (s > 9) s = String(s).split('').reduce((a, b) => a + parseInt(b), 0);
  return s || 9;
};

const lpName = (n: number) => ['', 'The Initiator', 'The Cooperative', 'The Creative', 'The Builder', 'The Freedom Seeker', 'The Harmonizer', 'The Seeker', 'The Achiever', 'The Humanitarian'][n] || '';

export function CosmicFateDisplay({ insight, numerology }: { insight: AstroInsightOutput, numerology: NumerologyData }) {
  const [activeTab, setActiveTab] = useState('oracle');
  const [diveSubTab, setDiveSubTab] = useState('ov');
  const [codexSign, setCodexSign] = useState('Rat');
  
  // Year Selector State - UNLOCKED
  const [readYear, setReadYear] = useState(new Date().getFullYear());
  const today = new Date();

  const { birthDay: d, birthMonth: m, birthYear: by } = numerology;
  const birthSign = insight.sign;

  // --- CORE LOGIC ---
  const getPY = (day: number, mon: number, year: number) => reduce(reduce(day) + reduce(mon) + reduce(year));
  const getSign = (y: number) => ANIMALS[((y - 1900) % 12 + 12) % 12];
  const getRel = (bsName: string, ysName: string) => {
    const r = RELATIONS[bsName];
    if (!r) return 'neutral';
    if (ysName === r.clash) return 'clash';
    if (ysName === r.harm) return 'harm';
    if (ysName === r.destroy) return 'destroy';
    if (ysName === r.self) return 'self';
    if (r.sanhe.includes(ysName)) return 'sanhe';
    if (ysName === r.liuhe) return 'liuhe';
    return 'neutral';
  };

  // --- DERIVED CALCULATIONS ---
  const LP = useMemo(() => reduce(reduce(m) + reduce(d) + reduce(by)), [d, m, by]);
  const currentPY = useMemo(() => getPY(d, m, readYear), [d, m, readYear]);
  const currentUY = useMemo(() => reduce(readYear), [readYear]);
  const currentBV = useMemo(() => reduce(d), [d]);
  const currentPM = useMemo(() => reduce(currentPY + (today.getMonth() + 1)), [currentPY]);
  const pmNames = ['', 'New Beginnings', 'Cooperation', 'Creativity', 'Foundation', 'Freedom', 'Harmony', 'Reflection', 'Power', 'Completion'];

  // Pinnacles Logic
  const p1 = reduce(reduce(m) + reduce(d));
  const p2 = reduce(reduce(d) + reduce(by));
  const p3 = reduce(p1 + p2);
  const p4 = reduce(reduce(m) + reduce(by));
  const p1end = 36 - LP;
  const p2end = p1end + 9;
  const p3end = p2end + 9;
  const currentAgeInReadYear = readYear - by;

  let activePinnacle = 1, activePinnacleNum = p1;
  if (currentAgeInReadYear <= p1end) { activePinnacle = 1; activePinnacleNum = p1; }
  else if (currentAgeInReadYear <= p2end) { activePinnacle = 2; activePinnacleNum = p2; }
  else if (currentAgeInReadYear <= p3end) { activePinnacle = 3; activePinnacleNum = p3; }
  else { activePinnacle = 4; activePinnacleNum = p4; }

  const c1 = Math.abs(reduce(m) - reduce(d));
  const c2 = Math.abs(reduce(d) - reduce(by));
  const c3 = Math.abs(c1 - c2);
  const c4 = Math.abs(reduce(m) - reduce(by));
  let activeChallenge = c1;
  if (currentAgeInReadYear <= p1end) activeChallenge = c1;
  else if (currentAgeInReadYear <= p2end) activeChallenge = c2;
  else if (currentAgeInReadYear <= p3end) activeChallenge = c3;
  else activeChallenge = c4;

  // --- RENDER HELPERS ---
  const renderReadAloud = (text: string) => {
    const sentences = text.match(/[^.!?\n]+[.!?\n]+/g) || [text];
    const [activeSentenceIndex, setActiveSentenceIndex] = useState(-1);
    return (
      <div className="flex flex-col space-y-4">
        <div className="flex justify-start">
          <SpeechPlayer
            text={text}
            sentences={sentences}
            onBoundary={setActiveSentenceIndex}
            onEnd={() => setActiveSentenceIndex(-1)}
          />
        </div>
        <ScrollableTextDisplay
          text={text}
          sentences={sentences}
          activeSentenceIndex={activeSentenceIndex}
        />
      </div>
    );
  };

  const renderOracle = () => {
    const yr = yearDescription(currentPY);
    const yearAnimal = getSign(readYear);
    const cat = getRel(birthSign, yearAnimal.n);
    const cm = CAT_META[cat];
    
    const tension = (currentPY === 4 && (LP === 5 || LP === 3)) || (currentPY === 7 && (LP === 1 || LP === 6));
    const harmony = (currentPY === LP) || (currentPY === currentUY) || (currentPY === currentBV);

    const animalLine = `Your ${birthSign} nature meets a ${yearAnimal.n} year (${cm.label}) — ${ 
      cat === 'clash' ? 'an environment of maximum elemental friction calling for proactive adaptation rather than resistance' : 
      cat === 'harm' ? 'a year of concealed pressures requiring extra vigilance in trust and documentation' : 
      cat === 'destroy' ? 'a year when outdated structures may fracture, clearing ground for what genuinely serves you' : 
      cat === 'self' ? 'your identity year, when all your characteristic patterns amplify to their fullest expression' : 
      ['sanhe', 'liuhe'].includes(cat) ? 'an environmentally supported year where the collective field actively favours your initiatives' : 
      'a neutral year where outcomes reflect pure personal effort rather than exceptional external forces'
    }.`;

    const convergeLine = tension
      ? `Your Life Path ${LP} (${lpName(LP)}) creates notable friction with Personal Year ${currentPY}'s demands — a soul-level tension with specific lessons.`
      : harmony
      ? `A significant harmonic: your Personal Year ${currentPY} resonates with another core number in your chart — an amplification point for ${yr?.title.toLowerCase()} themes.`
      : `Your Life Path ${LP} (${lpName(LP)}) and Personal Year ${currentPY} (${yr?.title}) are in productive dialogue, allowing this year's work to proceed through genuine effort.`;

    const synthText = `In ${readYear}, you are in a Personal Year ${currentPY} — ${yr?.title}, riding the ${yr?.phase.toLowerCase()} phase of your nine-year cycle. The Universal Year ${currentUY} (${yearDescription(currentUY)?.title}) sets the collective backdrop. Your current Personal Month is ${currentPM} (${pmNames[currentPM]}). ${animalLine} ${convergeLine} Your active Pinnacle is ${activePinnacleNum} — the long-arc life theme operating beneath every annual cycle — while your active Challenge number ${activeChallenge} names the specific resistance pattern this chapter asks you to develop through.`;

    return (
      <div className="space-y-6 fu">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="core-chip hl-py">
            <div className="core-chip-label">Personal Year {readYear}</div>
            <div className="core-chip-num">{currentPY}</div>
            <div className="core-chip-name">{yr?.title}</div>
          </div>
          <div className="core-chip">
            <div className="core-chip-label">Life Path</div>
            <div className="core-chip-num" style={{ color: 'var(--jade-bright)' }}>{LP}</div>
            <div className="core-chip-name">{lpName(LP)}</div>
          </div>
          <div className="core-chip">
            <div className="core-chip-label">Universal Year</div>
            <div className="core-chip-num" style={{ color: 'var(--amethyst)' }}>{currentUY}</div>
            <div className="core-chip-name">{yearDescription(currentUY)?.title}</div>
          </div>
          <div className="core-chip">
            <div className="core-chip-label">Pinnacle (Active)</div>
            <div className="core-chip-num" style={{ color: '#68c268' }}>{activePinnacleNum}</div>
            <div className="core-chip-name">{lpName(activePinnacleNum)}</div>
          </div>
        </div>

        <Card className="p-6 bg-slate-900/60 border-primary/20">
          <div className="section-header">✦ &nbsp; Oracle Synthesis &nbsp; ✦</div>
          {renderReadAloud(synthText)}
        </Card>
      </div>
    );
  };

  const renderDive = () => {
    const yr = yearDescription(currentPY);
    if (!yr) return null;

    const panels: Record<string, string> = {
      ov: yr.overview,
      py: yr.pyth,
      ve: yr.vedic,
      ch: yr.chinese,
      ca: yr.chald,
    };

    return (
      <div className="year-deep-dive rounded-2xl border border-primary/20 overflow-hidden bg-slate-900/40 fu">
        <div className="p-6 border-b border-white/10 bg-slate-900/60">
          <div className="flex justify-between items-start">
            <div>
              <div className="year-num-big" style={{ color: 'var(--yc)' }}>{currentPY}</div>
              <div className="text-2xl font-bold text-white">{yr.title}</div>
              <div className="text-sm italic text-muted-foreground mb-4">{yr.phase}</div>
            </div>
            <div className="flex flex-col gap-2 items-end">
              <Badge variant="outline" className="border-primary/40 text-primary">{yr.planet}</Badge>
              <Badge variant="outline" className="border-emerald-500/40 text-emerald-400">{yr.chakra}</Badge>
            </div>
          </div>
        </div>
        
        <div className="tab-nav">
          {['ov', 'py', 've', 'ch', 'ca', 'pr'].map(id => (
            <button
              key={id}
              onClick={() => setDiveSubTab(id)}
              className={`tab-btn ${diveSubTab === id ? 'active' : ''}`}
            >
              {id === 'ov' ? 'Overview' : id === 'py' ? 'Pythagorean' : id === 've' ? 'Vedic' : id === 'ch' ? 'Chinese' : id === 'ca' ? 'Chaldean' : 'Practices'}
            </button>
          ))}
        </div>

        <div className="p-6 min-h-[400px]">
          {diveSubTab === 'pr' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {yr.pr.map((p: any, idx: number) => (
                <div key={idx} className="pi">
                  <div className="pi-icon">{p.i}</div>
                  <div className="pi-name">{p.n}</div>
                  <div className="pi-desc">{p.d}</div>
                </div>
              ))}
            </div>
          ) : (
            renderReadAloud(panels[diveSubTab])
          )}
        </div>
      </div>
    );
  };

  const renderMap = () => {
    const years = [];
    for (let i = 0; i < 12; i++) {
      const y = readYear + i;
      const ya = getSign(y);
      const cat = getRel(birthSign, ya.n);
      const pyn = getPY(d, m, y);
      const isTrough = pyn === 4 || pyn === 7;
      const isPeak = pyn === 1 || pyn === 9;
      const isClash = cat === 'clash';
      const isAlliance = ['sanhe', 'liuhe'].includes(cat);

      let friendliness = 'bg-slate-900/40 border-white/10 opacity-80';
      let status = 'Neutral';
      let color = 'var(--text-dim)';

      if (isClash && isTrough) {
        friendliness = 'bg-rose-950/40 border-rose-500 ring-1 ring-rose-500/20';
        status = '⚡ Danger';
        color = '#f87171';
      } else if (isAlliance && isPeak) {
        friendliness = 'bg-emerald-950/40 border-emerald-500 ring-1 ring-emerald-500/20';
        status = '✦ Fortunate';
        color = '#34d399';
      } else if (isTrough) {
        friendliness = 'bg-amber-950/20 border-amber-500/40';
        status = '◎ Trough';
        color = '#fbbf24';
      } else if (isAlliance) {
        friendliness = 'bg-indigo-950/20 border-indigo-500/40';
        status = '✓ Supported';
        color = '#818cf8';
      }

      years.push({ year: y, animal: ya, cat, pyn, friendliness, status, color });
    }

    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 fu">
        {years.map((y, i) => (
          <div 
            key={i}
            className={`p-4 rounded-xl border transition-all hover:scale-[1.03] hover:shadow-xl cursor-pointer ${y.friendliness} flex flex-col items-center text-center`}
          >
            <div className="text-3xl mb-1">{y.animal.e}</div>
            <div className="font-bold text-lg text-white mb-1">{y.year}</div>
            <div className="text-[10px] uppercase font-black tracking-tighter mb-2" style={{ color: y.color }}>
              PY {y.pyn} · {y.status}
            </div>
            <Badge variant="outline" className="text-[8px] py-0 px-2 border-white/10">
              {y.animal.n} Year
            </Badge>
          </div>
        ))}
      </div>
    );
  };

  const renderLibrary = () => {
    return (
      <div className="space-y-8 fu">
        <div>
          <div className="section-header">🔮 &nbsp; Sign Codex &nbsp; 🔮</div>
          <div className="codex-grid mb-6">
            {ANIMALS.map(a => (
              <div 
                key={a.n}
                onClick={() => setCodexSign(a.n)}
                className={`zc ${codexSign === a.n ? 'ben-ming' : ''}`}
              >
                <div className="zc-ani">{a.e}</div>
                <div className="zc-yr text-[10px]">{a.n}</div>
              </div>
            ))}
          </div>
          {(BOOK as any).animals[codexSign] && (
            <Accordion type="single" collapsible className="space-y-2">
              <AccordionItem value="ben" className="acc">
                <AccordionTrigger className="ach">Ben Ming Nian</AccordionTrigger>
                <AccordionContent className="acb">
                  {renderReadAloud((BOOK as any).animals[codexSign].self)}
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="clash" className="acc">
                <AccordionTrigger className="ach">Direct Clash</AccordionTrigger>
                <AccordionContent className="acb">
                  {renderReadAloud((BOOK as any).animals[codexSign].clash)}
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="harm" className="acc">
                <AccordionTrigger className="ach">Harm Bond</AccordionTrigger>
                <AccordionContent className="acb">
                  {renderReadAloud((BOOK as any).animals[codexSign].harm)}
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="dest" className="acc">
                <AccordionTrigger className="ach">Destruction Bond</AccordionTrigger>
                <AccordionContent className="acb">
                  {renderReadAloud((BOOK as any).animals[codexSign].destroy)}
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          )}
        </div>

        <div>
          <div className="section-header">📜 &nbsp; Foundational Principles &nbsp; 📜</div>
          <Accordion type="single" collapsible className="space-y-2">
            {Object.entries(BOOK.foundation).map(([key, text]) => (
              <AccordionItem key={key} value={key} className="acc">
                <AccordionTrigger className="ach uppercase text-[10px] tracking-widest">
                  {key.replace('_', ' ')}
                </AccordionTrigger>
                <AccordionContent className="acb">
                  {renderReadAloud(String(text))}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-700 max-w-full overflow-x-hidden pb-20">
      {/* Year Selector - UNLOCKED DISPLAY */}
      <Card className="p-4 bg-slate-900/60 border-primary/20">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <CalendarDays className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-primary/80">Temporal Focus</h4>
              <p className="text-[10px] text-muted-foreground italic">Casting Fate Map for year {readYear}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Input 
              type="number"
              value={readYear}
              onChange={(e) => setReadYear(parseInt(e.target.value) || new Date().getFullYear())}
              className="w-24 h-9 bg-black/40 border-white/10 text-white font-bold"
            />
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setReadYear(new Date().getFullYear())}
              className="h-9 border-white/10 text-[10px] uppercase font-bold text-white/70 hover:bg-white/5"
            >
              <RotateCcw className="h-3 w-3 mr-2" /> Today
            </Button>
          </div>
        </div>
      </Card>

      {/* Main Tabs */}
      <div className="dash-nav overflow-x-auto scrollbar-hide flex flex-nowrap md:grid md:grid-cols-6 gap-1">
        {[
          { id: 'oracle', name: '✦ Oracle', icon: <Star className="h-3 w-3" /> },
          { id: 'dive', name: '☽ Dive', icon: <Compass className="h-3 w-3" /> },
          { id: 'map', name: '📅 Map', icon: <CalendarDays className="h-3 w-3" /> },
          { id: 'pinnacles', name: '◈ Pinnacle', icon: <Activity className="h-3 w-3" /> },
          { id: 'library', name: '📜 Codex', icon: <BookOpen className="h-3 w-3" /> },
          { id: 'scanner', name: '🔭 Scan', icon: <Telescope className="h-3 w-3" /> },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`dash-tab flex items-center justify-center gap-2 min-w-[100px] md:min-w-0 ${activeTab === tab.id ? 'active' : ''}`}
          >
            {tab.icon} {tab.name}
          </button>
        ))}
      </div>

      <div className="min-h-[600px] dash-body p-6">
        {activeTab === 'oracle' && renderOracle()}
        {activeTab === 'dive' && renderDive()}
        {activeTab === 'map' && renderMap()}
        {activeTab === 'library' && renderLibrary()}
        {activeTab === 'scanner' && <CosmicRiskScanner targetYear={readYear} />}
        {activeTab === 'pinnacles' && (
          <div className="space-y-6 fu">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { n: 1, p: p1, c: c1, label: `Birth - Age ${p1end}`, active: activePinnacle === 1 },
                { n: 2, p: p2, c: c2, label: `Age ${p1end+1} - ${p2end}`, active: activePinnacle === 2 },
                { n: 3, p: p3, c: c3, label: `Age ${p2end+1} - ${p3end}`, active: activePinnacle === 3 },
                { n: 4, p: p4, c: c4, label: `Age ${p3end+1}+`, active: activePinnacle === 4 },
              ].map(stage => (
                <Card key={stage.n} className={`p-5 relative overflow-hidden ${stage.active ? 'border-primary bg-primary/5 ring-1 ring-primary/20' : 'bg-slate-900/40 border-white/5'}`}>
                  <div className="flex justify-between items-start mb-4">
                    <div className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">{stage.label}</div>
                    {stage.active && <Badge className="bg-primary text-[8px] px-2 py-0">Active Stage</Badge>}
                  </div>
                  <div className="flex gap-6 mb-4">
                    <div className="text-center">
                      <div className="text-3xl font-serif font-bold text-emerald-400">{stage.p}</div>
                      <div className="text-[8px] uppercase tracking-widest text-muted-foreground">Pinnacle</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-serif font-bold text-rose-400">{stage.c}</div>
                      <div className="text-[8px] uppercase tracking-widest text-muted-foreground">Challenge</div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <p className="text-xs leading-relaxed text-slate-300">{PINNACLE_DESC[stage.p]}</p>
                    <p className="text-[11px] leading-relaxed text-rose-300/80 italic">Challenge: {CHALLENGE_DESC[stage.c]}</p>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
