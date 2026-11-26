// src/components/profile-generator/zodiac-section.tsx
'use client';

import { K } from "@/lib/curriculum/catalogue";
import React, { useState, useMemo } from 'react';
import { ZOO } from '@/lib/cosmic-fate/zoo';
import { chineseSignFor } from '@/lib/astrology/chinese-calendar-math';
import { BOOK } from '@/lib/cosmic-fate/book';
import { ANIMALS } from '@/lib/cosmic-fate/constants';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AccordionContentWithPlayer } from './accordion-content-with-player';
import { computePersonalYearNumber } from '@/lib/numerology/personal-year-full';

/**
 * HELPER: Reduce number to single digit (Pythagorean)
 */
const reduce = (n: number): number => {
  let s = Math.abs(n);
  while (s > 9) { s = String(s).split('').reduce((a, c) => a + (+c), 0); }
  return s || 9;
};

/**
 * HELPER: Strip HTML tags for TTS
 */
const stripHtml = (html: string) => {
  return html.replace(/<[^>]*>?/gm, '').replace(/&nbsp;/g, ' ');
};

/**
 * HELPER: Get exact animal for a specific date using Chinese Calendar data
 */
const getAnimalForDate = (d: number, m: number, y: number) => chineseSignFor(d, m, y).sign;

/**
 * HELPER: Determine Tai Sui relationship category
 */
const getCategory = (birthSign: string, yearSign: string) => {
  if (birthSign === yearSign) return 'ben';
  
  // CLASH PAIRS
  const clashes = [
    ['Rat', 'Horse'], ['Ox', 'Goat'], ['Tiger', 'Monkey'],
    ['Rabbit', 'Rooster'], ['Dragon', 'Dog'], ['Snake', 'Pig']
  ];
  if (clashes.some(p => (p[0] === birthSign && p[1] === yearSign) || (p[1] === birthSign && p[0] === yearSign))) return 'clash';

  // HARM PAIRS
  const harms = [
    ['Rat', 'Goat'], ['Ox', 'Horse'], ['Tiger', 'Snake'],
    ['Rabbit', 'Dragon'], ['Monkey', 'Pig'], ['Rooster', 'Dog']
  ];
  if (harms.some(p => (p[0] === birthSign && p[1] === yearSign) || (p[1] === birthSign && p[0] === yearSign))) return 'harm';

  // DESTRUCTION PAIRS
  const destructions = [
    ['Rat', 'Rooster'], ['Ox', 'Dragon'], ['Tiger', 'Pig'],
    ['Rabbit', 'Horse'], ['Goat', 'Dog'], ['Monkey', 'Snake']
  ];
  if (destructions.some(p => (p[0] === birthSign && p[1] === yearSign) || (p[1] === birthSign && p[0] === yearSign))) return 'destruction';

  // SAN HE TRIANGLES
  const sanHe = [
    ['Tiger', 'Horse', 'Dog'], ['Monkey', 'Rat', 'Dragon'],
    ['Pig', 'Rabbit', 'Goat'], ['Snake', 'Rooster', 'Ox']
  ];
  if (sanHe.some(triad => triad.includes(birthSign) && triad.includes(yearSign))) return 'alliance';

  // LIU HE PAIRS
  const liuHe = [
    ['Rat', 'Ox'], ['Tiger', 'Pig'], ['Rabbit', 'Dog'],
    ['Dragon', 'Rooster'], ['Snake', 'Monkey'], ['Horse', 'Goat']
  ];
  if (liuHe.some(p => (p[0] === birthSign && p[1] === yearSign) || (p[1] === birthSign && p[0] === yearSign))) return 'alliance';

  return 'neutral';
};

const pyColors: Record<number, string> = {
  1: "#e8b830", 2: "#98b4de", 3: "#68c268", 4: "#c86040", 5: "#dca030", 6: "#de78a0", 7: "#8870c8", 8: "#a8b5cc", 9: "#c84848"
};

const getStatusLabelShort = (c: string) => ({ 
  'ben': 'BEN MING', 'clash': 'CLASH', 'harm': 'HARM', 
  'destruction': 'DESTRUCTION', 'alliance': 'ALLIANCE', 'neutral': 'NEUTRAL' 
}[c] || 'NEUTRAL');

const catLabel = (c: string) => ({ 
  'ben': 'BEN MING NIAN', 'clash': 'DIRECT CLASH', 'harm': 'HARM YEAR', 
  'destruction': 'DESTRUCTION YEAR', 'alliance': 'ALLIANCE YEAR', 'neutral': 'NEUTRAL YEAR' 
}[c] || 'NEUTRAL YEAR');

interface ZodiacSectionProps {
  birthDay: number;
  birthMonth: number;
  birthYear: number;
}

export function ZodiacSection({ birthDay, birthMonth, birthYear }: ZodiacSectionProps) {
  const [readYear] = useState(new Date().getFullYear());
  const [selectedYear, setSelectedYear] = useState<any>(null);

  const birthSign = useMemo(() => getAnimalForDate(birthDay, birthMonth, birthYear), [birthDay, birthMonth, birthYear]);
  const bz = ZOO[birthSign];
  const az = ANIMALS.find(a => a.n === birthSign);

  const yearsData = useMemo(() => {
    const data = [];
    for (let y = readYear; y <= readYear + 11; y++) {
      const yearAni = getAnimalForDate(15, 6, y);
      const category = getCategory(birthSign, yearAni);
      const pyn = computePersonalYearNumber(birthDay, birthMonth, y);
      
      const isCritical = pyn === 4 || pyn === 7;
      const isEnemy = category === 'clash' || category === 'harm' || category === 'destruction';
      const isBen = category === 'ben';
      const isAlliance = category === 'alliance';

      let state = 5;
      if (isEnemy && isCritical) state = 1;
      else if (isBen && isCritical) state = 2;
      else if (isCritical) state = 3;
      else if (isAlliance) state = 4;

      data.push({ year: y, yearAni, category, pyn, state, age: y - birthYear });
    }
    return data;
  }, [birthSign, readYear, birthDay, birthMonth, birthYear]);

  const renderCard = (item: any) => {
    const { year, yearAni, category, pyn, state, age } = item;
    const ya = ZOO[yearAni];
    const pyColor = pyColors[pyn] || "#ffffff";
    const statusTag = getStatusLabelShort(category);

    let cardStyles: React.CSSProperties = {};
    let badge = "";
    let statusColor = "rgba(120, 136, 160, 0.6)";

    if (state === 1) {
      cardStyles = {
        background: "linear-gradient(140deg, rgba(180,20,40,.35), rgba(7,13,28,.98))",
        border: "2px solid rgba(200,30,50,.7)",
        boxShadow: "0 0 24px rgba(200,30,50,.4)"
      };
      badge = `⚠ PY${pyn} + ${statusTag}`;
      statusColor = "#ef4444";
    } else if (state === 2) {
      cardStyles = {
        background: "linear-gradient(140deg, rgba(220,140,0,.2), rgba(7,13,28,.98))",
        border: "2px solid rgba(220,140,0,.6)"
      };
      badge = "⭐ BEN MING + PY4/7";
      statusColor = "#f59e0b";
    } else if (state === 3) {
      cardStyles = {
        background: "linear-gradient(140deg, rgba(100,70,180,.18), rgba(7,13,28,.98))",
        border: "1px solid rgba(136,112,200,.45)"
      };
      badge = `PY${pyn} CRITICAL`;
      statusColor = "#a78bfa";
    } else if (state === 4) {
      cardStyles = {
        background: "linear-gradient(140deg, rgba(50,160,90,.1), rgba(7,13,28,.95))",
        border: "1px solid rgba(50,160,90,.45)"
      };
      statusColor = "#4daa78";
    } else {
      cardStyles = {
        background: "linear-gradient(140deg, rgba(14,24,46,.9), rgba(8,14,28,.95))",
        border: "1px solid rgba(200,168,75,.13)"
      };
    }

    return (
      <div 
        key={year} 
        style={cardStyles}
        className="flex flex-col items-center justify-center p-6 rounded-2xl text-center transition-all hover:scale-[1.02] cursor-pointer"
        onClick={() => setSelectedYear(item)}
      >
        <div className="text-4xl mb-3">{ya.e}</div>
        <div className="text-[13px] font-bold text-white mb-1 font-cinzel">{year}</div>
        <div className="text-[18px] font-black font-decorative" style={{ color: pyColor }}>PY {pyn}</div>
        <div className="text-[11px] font-black uppercase tracking-tighter font-cinzel" style={{ color: statusColor }}>{statusTag} YEAR</div>
        <div className="text-[11px] text-muted-foreground mt-1 font-cinzel">Age {age}</div>
        {badge && (
          <div 
            className={`mt-3 px-3 py-1 rounded-full text-[11px] font-black uppercase border ${
              state === 1 ? 'bg-rose-500/20 text-rose-500 border-rose-500/30' :
              state === 2 ? 'bg-amber-500/20 text-amber-500 border-amber-500/30' :
              'bg-purple-500/20 text-purple-400 border-purple-500/30'
            }`}
          >
            {badge}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-8 py-4">
      <div className="text-center px-4">
        <div className="flex items-center justify-center gap-4 mb-6">
          <span className="text-2xl">{bz.e}</span>
          <h2 className="text-xl font-bold tracking-[0.3em] uppercase text-primary font-cinzel">Your Chinese Zodiac — {birthSign}</h2>
          <span className="text-2xl">{bz.e}</span>
        </div>
        
        <div className="cp text-lg leading-relaxed text-slate-300 max-w-2xl mx-auto mb-8 font-body text-center">
          <AccordionContentWithPlayer text={`Born in a ${birthSign} year — ${bz.el} element, ${bz.pol} polarity, Branch ${az?.br || bz.br}. Your characteristic nature: ${bz.trait}. Your health domains: ${bz.organ}. Your cardinal direction: ${bz.dir}. Below are your next 12 years mapped through Tai Sui astrology — click any year for detailed analysis.`} study={{ field: "fate.taisui-intro", variant: K.sign(birthSign) }} />
        </div>

        <div className="flex flex-col items-center gap-3 mb-6">
          <div className="flex flex-wrap justify-center gap-3">
            <div className="px-3 py-1.5 rounded-lg border border-rose-500/50 bg-rose-500/10 text-[11px] font-black uppercase text-rose-400 font-cinzel">
              ⚠️ ENEMY × PY 4 OR 7
            </div>
            <div className="px-3 py-1.5 rounded-lg border border-yellow-500/50 bg-yellow-500/10 text-[11px] font-black uppercase text-yellow-400 font-cinzel">
              ⭐ BEN MING + PY 4/7
            </div>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            <div className="px-3 py-1.5 rounded-lg border border-indigo-500/50 bg-indigo-500/10 text-[11px] font-black uppercase text-indigo-400 font-cinzel">
              ◈ CRITICAL PY ONLY
            </div>
            <div className="px-3 py-1.5 rounded-lg border border-primary/30 bg-primary/5 text-[11px] font-black uppercase text-primary/70 font-cinzel">
              PY # Legend
            </div>
          </div>
        </div>
      </div>

      <div className="zodiac-grid grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 px-2">
        {yearsData.map(renderCard)}
      </div>

      <Dialog open={!!selectedYear} onOpenChange={() => setSelectedYear(null)}>
        {selectedYear && (
          <DialogContent className="max-w-2xl bg-slate-900 border-primary/20">
            <DialogHeader>
              <div className="text-6xl mb-4 block text-center">{ZOO[selectedYear.yearAni].e}</div>
              <DialogTitle className="text-3xl font-bold text-primary text-center mb-2 font-cinzel">
                {selectedYear.year}: {selectedYear.yearAni} Year
              </DialogTitle>
              <div className="text-xs uppercase tracking-[0.3em] text-center opacity-60 mb-8 font-cinzel">
                {birthSign} × {selectedYear.yearAni} — {catLabel(selectedYear.category)}
              </div>
            </DialogHeader>
            <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-4 scrollbar-thin">
              <div className="p-4 bg-primary/5 border-l-[3px] border-primary rounded-r-lg font-body italic text-sm text-slate-300">
                <AccordionContentWithPlayer text={`${selectedYear.year} (${selectedYear.yearAni} Year, Age ${selectedYear.age}) — Tai Sui: ${catLabel(selectedYear.category)}`} study={false} />
              </div>

              {(BOOK.categories as Record<string, string>)[selectedYear.category === 'destruction' ? 'destruction' : selectedYear.category] && (
                <div className="p-4 bg-white/5 border-l-[3px] border-primary/40 rounded-r-lg font-body text-sm leading-relaxed text-slate-300">
                  <AccordionContentWithPlayer text={stripHtml((BOOK.categories as Record<string, string>)[selectedYear.category === 'destruction' ? 'destruction' : selectedYear.category])} study={{ field: "fate.taisui-category", variant: K.category(selectedYear.category) }} />
                </div>
              )}

              <div className="space-y-4">
                <h4 className="font-cinzel text-xs uppercase tracking-widest opacity-60">
                  Your {birthSign.toUpperCase()} in {selectedYear.yearAni.toUpperCase()} Year
                </h4>
                <div className="font-body text-base leading-relaxed text-slate-200">
                  <AccordionContentWithPlayer text={ZOO[birthSign][`${selectedYear.category}Desc`] || ZOO[birthSign][`${selectedYear.category === 'destruction' ? 'destruction' : selectedYear.category}Desc`] || `This ${selectedYear.year} ${selectedYear.yearAni} year is a Neutral period for ${birthSign}. No special Tai Sui relationship creates extraordinary support or challenge.`} study={{ field: "fate.taisui-relation", variant: K.taiSui(birthSign, selectedYear.category) }} />
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-cinzel text-xs uppercase tracking-widest opacity-60">
                  {selectedYear.yearAni.toUpperCase()} Year Qualities
                </h4>
                <div className="font-body text-sm text-slate-400">
                  <AccordionContentWithPlayer text={`${ZOO[selectedYear.yearAni].trait}. Health focus: ${ZOO[selectedYear.yearAni].organ}. Direction: ${ZOO[selectedYear.yearAni].dir}.`} study={{ field: "fate.year-animal", variant: K.yearAnimal(selectedYear.yearAni) }} />
                </div>
              </div>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
}