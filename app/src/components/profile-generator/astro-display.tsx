
import * as React from 'react';
import { BookOpen, Leaf, Users, Forward, Baby, Clock, Moon, Sun, Star, Heart, Orbit } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import type { AstroInsightOutput } from './types';
import { AccordionContentWithPlayer } from './accordion-content-with-player';
import { ZOO } from '@/lib/cosmic-fate/zoo';
import { K } from '@/lib/curriculum/catalogue';
import { futureWindow } from '@/lib/zodiac/futures';
import { useHandbook } from '@/lib/handbook/store';
import type { HbAnimal } from '@/lib/handbook/types';
import { HandbookLoader, HbFive, HbPartner, HbCompatIntro, HbCharacter, HbAscendants, HbMoon, HbSeasons, HbFamous } from '@/components/handbook/handbook-oracle';
import { ZgFoundations, ZgCharacter, ZgLoveCareer, ZgFive, ZgYear, ZgFortune } from '@/components/handbook/zodiacs-oracle';

interface DiagnosticLayerProps {
  id: string;
  layerNum: number;
  title: string;
  icon: React.ReactNode;
  content: React.ReactNode;
  badgeColor: string;
  isOpen: boolean;
  onToggle: () => void;
  /** Curriculum fields studied inside this layer. */
  studyOpen?: string;
}

function DiagnosticLayer({ layerNum, title, icon, content, badgeColor, isOpen, onToggle, studyOpen }: DiagnosticLayerProps) {
  return (
    <div className="astro-accordion">
      <button
        className="astro-acc-header"
        onClick={onToggle}
        aria-expanded={isOpen}
        data-study-open={studyOpen}
      >
        <div className="astro-acc-left">
          <span 
            className="astro-layer-badge" 
            style={{ background: `${badgeColor}22`, color: badgeColor, borderColor: `${badgeColor}55` }}
          >
            Layer {layerNum}
          </span>
          <span className="astro-acc-title">{title}</span>
        </div>
        <span className="astro-acc-arrow" style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0)" }}>▾</span>
      </button>

      {isOpen && (
        <div className="astro-acc-body">
          <div className="astro-meaning-card" style={{ borderLeftColor: badgeColor }}>
            <div className="flex items-center gap-2 mb-3">
              {icon}
              <span className="text-[11px] font-bold uppercase tracking-widest" style={{ color: badgeColor }}>
                {title} Activation
              </span>
            </div>
            {content}
          </div>
        </div>
      )}
      {/* Styles are defined globally in index.css under .astro-* */}
    </div>
  );
}

export function AstroDisplay({ insight }: { insight: AstroInsightOutput }) {
  const [openLayer, setOpenLayer] = React.useState<string | null>("intro");

  const { zodiacData, sign, element } = insight;
  const { introduction, elements, compatibilities, futures } = zodiacData;

  const signElementData = elements?.[element as keyof typeof elements];
  const animalEmoji = ZOO[sign]?.e || '';

  const toggle = (id: string) => setOpenLayer(openLayer === id ? null : id);
  const books = useHandbook();
  const book = books.book;
  const ch = book?.chapters[sign as HbAnimal];
  const zg = books.zodiacs;
  const zc = zg?.chapters[sign as HbAnimal];
  const hints = (...h: (string | false | undefined)[]) => h.filter(Boolean).join(";");

  interface Layer { id: string; title: string; color: string; icon: React.ReactNode; studyOpen: string; content: React.ReactNode }
  const layers: Layer[] = [
    {
      id: "intro", title: "Animal Sign Totem", color: "#9b8ec4", icon: <BookOpen className="h-4 w-4" />, studyOpen: "astro.totem",
      content: <AccordionContentWithPlayer text={introduction || "No introduction available."} study={{ field: "astro.totem", variant: K.sign(sign) }} />,
    },
    {
      id: "element", title: `The ${element} Influence`, color: "#3a8ee0", icon: <Leaf className="h-4 w-4" />,
      studyOpen: hints("astro.element", ch && "astro.hb.five", zc && "astro.zg.five"),
      content: (
        <div className="space-y-4">
          <AccordionContentWithPlayer text={signElementData || `No specific data for the ${element} element.`} study={signElementData ? { field: "astro.element", variant: K.element(element, sign) } : false} />
          {ch && <HbFive ch={ch} sign={sign} element={element} />}
          {zc && <ZgFive ch={zc} sign={sign} element={element} />}
        </div>
      ),
    },
    {
      id: "compatibility", title: "Compatibility Bonds", color: "#4caf7d", icon: <Users className="h-4 w-4" />,
      studyOpen: hints("astro.compat", ch && "astro.hb.compat", ch && "astro.hb.intro"),
      content: (
        <div className="space-y-4">
          <p className="text-[13px] italic text-slate-400 mb-4 px-2">Analysis of spiritual and social resonance with the 12 signs of the Zodiac.</p>
          {ch && <HbCompatIntro ch={ch} sign={sign} />}
          <Accordion type="single" collapsible className="w-full space-y-2">
            {Object.entries(compatibilities || {}).map(([s, text]) => (
              <AccordionItem key={s} value={s} className="border-none bg-white/5 rounded-lg overflow-hidden px-3">
                <AccordionTrigger className="hover:no-underline py-3" data-study-open={hints(`astro.compat|${K.compat(sign, s)}`, ch && `astro.hb.compat|${K.compat(sign, s)}`)}>
                  <span className="font-cinzel text-[0.7rem] uppercase tracking-widest text-primary flex items-center gap-2">
                    {ZOO[s]?.e || '🐾'} With the {s}
                  </span>
                </AccordionTrigger>
                <AccordionContent>
                  <AccordionContentWithPlayer text={String(text)} study={{ field: "astro.compat", variant: K.compat(sign, s) }} />
                  {book && <HbPartner book={book} sign={sign} partner={s} />}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      ),
    },
    {
      id: "future", title: "Temporal Trajectory", color: "#e0a83a", icon: <Forward className="h-4 w-4" />,
      studyOpen: hints("astro.future", zc && "astro.zg.year", zc && "astro.zg.fortune"),
      content: (
        <div className="space-y-4">
          <p className="text-[13px] italic text-slate-400 mb-4 px-2">A 12-year window into the upcoming cosmic frequencies and life patterns.</p>
          {zc && <ZgYear ch={zc} sign={sign} />}
          <Accordion type="single" collapsible className="w-full space-y-2">
            {futureWindow(futures).map((data) => (
              <AccordionItem key={data.year} value={String(data.year)} className="border-none bg-white/5 rounded-lg overflow-hidden px-3">
                <AccordionTrigger className="hover:no-underline py-3" data-study-open={hints(`astro.future|${K.future(sign, data.animal)}`, zc && `astro.zg.fortune|${K.future(sign, data.animal)}`)}>
                  <span className="font-cinzel text-[0.7rem] uppercase tracking-widest text-primary flex items-center gap-2">
                    📅 {data.year} - Year of the {data.animal} {ZOO[data.animal]?.e || ''}
                  </span>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="p-2 mb-2 bg-primary/10 rounded-md inline-block">
                    <span className="text-[11px] font-bold uppercase tracking-tighter text-primary">
                      Element: {data.element}
                    </span>
                  </div>
                  <AccordionContentWithPlayer text={data.prediction} study={{ field: "astro.future", variant: K.future(sign, data.animal) }} />
                  {zc && <ZgFortune ch={zc} sign={sign} animal={data.animal} />}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      ),
    },
  ];
  if (ch || zc) {
    layers.push({
      id: "hb-character", title: ch && zc ? "Personality, Virtues & Child" : ch ? "Personality & Child" : "Virtues, Vices & Personality",
      color: "#d9779b", icon: <Baby className="h-4 w-4" />, studyOpen: hints(ch && "astro.hb.character", zc && "astro.zg.character"),
      content: (
        <div className="space-y-4">
          {zc && <ZgCharacter ch={zc} sign={sign} />}
          {ch && <HbCharacter ch={ch} sign={sign} />}
        </div>
      ),
    });
  }
  if (zc) {
    layers.push({ id: "zg-love", title: "Love & Career", color: "#e06a8c", icon: <Heart className="h-4 w-4" />, studyOpen: "astro.zg.love", content: <ZgLoveCareer ch={zc} sign={sign} /> });
  }
  if (ch) {
    layers.push(
      { id: "hb-ascendant", title: "Ascendants", color: "#7b8ce0", icon: <Clock className="h-4 w-4" />, studyOpen: "astro.hb.ascendant;astro.hb.intro", content: <HbAscendants ch={ch} sign={sign} /> },
      { id: "hb-moon", title: "Moon Signs Meet Sun Signs", color: "#b28ee0", icon: <Moon className="h-4 w-4" />, studyOpen: "astro.hb.moon;astro.hb.intro", content: <HbMoon ch={ch} sign={sign} western={insight.western_sign} /> },
      { id: "hb-seasons", title: "The Four Seasons", color: "#5fbf9a", icon: <Sun className="h-4 w-4" />, studyOpen: "astro.hb.season", content: <HbSeasons ch={ch} sign={sign} day={insight.day} month={insight.month} /> },
      { id: "hb-famous", title: "Famous People", color: "#e0c25a", icon: <Star className="h-4 w-4" />, studyOpen: "astro.hb.famous", content: <HbFamous ch={ch} sign={sign} element={element} /> },
    );
  }
  if (zg) {
    layers.push({
      id: "zg-found", title: "Foundations: Yang, Yin & the Elements", color: "#56b8c9", icon: <Orbit className="h-4 w-4" />, studyOpen: "astro.zg.found",
      content: <ZgFoundations z={zg} sign={sign} element={element} western={insight.western_sign} />,
    });
  }

  return (
    <div className="w-full glass-card p-4 space-y-4" data-study-anchor="astro.oracle">
      <div className="flex items-center gap-4 mb-2">
        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
        <h3 className="font-cinzel font-semibold text-[0.75rem] text-primary flex items-center gap-2 uppercase tracking-[0.3em] text-center">
          {animalEmoji} The {sign} Oracle {animalEmoji}
        </h3>
        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
      </div>

      <div className="flex flex-col">
        {layers.map((l, i) => (
          <DiagnosticLayer
            key={l.id}
            id={l.id}
            layerNum={i + 1}
            title={l.title}
            badgeColor={l.color}
            icon={l.icon}
            isOpen={openLayer === l.id}
            onToggle={() => toggle(l.id)}
            studyOpen={l.studyOpen}
            content={l.content}
          />
        ))}
      </div>
      <HandbookLoader compact={!!(book || zg)} />
    </div>
  );
}
