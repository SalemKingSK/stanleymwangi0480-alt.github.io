
import * as React from 'react';
import { BookOpen, Leaf, Users, Forward } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import type { AstroInsightOutput } from './types';
import { AccordionContentWithPlayer } from './accordion-content-with-player';
import { ZOO } from '@/lib/cosmic-fate/zoo';

interface DiagnosticLayerProps {
  id: string;
  layerNum: number;
  title: string;
  icon: React.ReactNode;
  content: React.ReactNode;
  badgeColor: string;
  isOpen: boolean;
  onToggle: () => void;
}

function DiagnosticLayer({ layerNum, title, icon, content, badgeColor, isOpen, onToggle }: DiagnosticLayerProps) {
  return (
    <div className="astro-accordion">
      <button
        className="astro-acc-header"
        onClick={onToggle}
        aria-expanded={isOpen}
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
  const [openLayer, setOpenLayer] = React.useState<number | null>(1);

  const { zodiacData, sign, element } = insight;
  const { introduction, elements, compatibilities, futures } = zodiacData;

  const signElementData = elements?.[element as keyof typeof elements];
  const animalEmoji = ZOO[sign]?.e || '';

  const toggle = (num: number) => setOpenLayer(openLayer === num ? null : num);

  return (
    <div className="w-full glass-card p-4 space-y-4">
      <div className="flex items-center gap-4 mb-2">
        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
        <h3 className="font-cinzel font-semibold text-[0.75rem] text-primary flex items-center gap-2 uppercase tracking-[0.3em] text-center">
          {animalEmoji} The {sign} Oracle {animalEmoji}
        </h3>
        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
      </div>

      <div className="flex flex-col">
        <DiagnosticLayer
          id="intro"
          layerNum={1}
          title="Animal Sign Totem"
          badgeColor="#9b8ec4"
          icon={<BookOpen className="h-4 w-4" />}
          isOpen={openLayer === 1}
          onToggle={() => toggle(1)}
          content={<AccordionContentWithPlayer text={introduction || "No introduction available."} />}
        />

        <DiagnosticLayer
          id="element"
          layerNum={2}
          title={`The ${element} Influence`}
          badgeColor="#3a8ee0"
          icon={<Leaf className="h-4 w-4" />}
          isOpen={openLayer === 2}
          onToggle={() => toggle(2)}
          content={<AccordionContentWithPlayer text={signElementData || `No specific data for the ${element} element.`} />}
        />

        <DiagnosticLayer
          id="compatibility"
          layerNum={3}
          title="Compatibility Bonds"
          badgeColor="#4caf7d"
          icon={<Users className="h-4 w-4" />}
          isOpen={openLayer === 3}
          onToggle={() => toggle(3)}
          content={
            <div className="space-y-4">
              <p className="text-[13px] italic text-slate-400 mb-4 px-2">Analysis of spiritual and social resonance with the 12 signs of the Zodiac.</p>
              <Accordion type="single" collapsible className="w-full space-y-2">
                {Object.entries(compatibilities || {}).map(([s, text]) => (
                  <AccordionItem key={s} value={s} className="border-none bg-white/5 rounded-lg overflow-hidden px-3">
                    <AccordionTrigger className="hover:no-underline py-3">
                      <span className="font-cinzel text-[0.7rem] uppercase tracking-widest text-primary flex items-center gap-2">
                        {ZOO[s]?.e || '🐾'} With the {s}
                      </span>
                    </AccordionTrigger>
                    <AccordionContent>
                      <AccordionContentWithPlayer text={String(text)} />
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          }
        />

        <DiagnosticLayer
          id="future"
          layerNum={4}
          title="Temporal Trajectory"
          badgeColor="#e0a83a"
          icon={<Forward className="h-4 w-4" />}
          isOpen={openLayer === 4}
          onToggle={() => toggle(4)}
          content={
            <div className="space-y-4">
              <p className="text-[13px] italic text-slate-400 mb-4 px-2">A 12-year window into the upcoming cosmic frequencies and life patterns.</p>
              <Accordion type="single" collapsible className="w-full space-y-2">
                {Object.entries(futures || {})
                  .filter(([year]) => parseInt(year) >= new Date().getFullYear())
                  .sort(([a], [b]) => parseInt(a) - parseInt(b))
                  .map(([year, data]: any) => (
                    <AccordionItem key={year} value={year} className="border-none bg-white/5 rounded-lg overflow-hidden px-3">
                      <AccordionTrigger className="hover:no-underline py-3">
                        <span className="font-cinzel text-[0.7rem] uppercase tracking-widest text-primary flex items-center gap-2">
                          📅 {year} - Year of the {data.year} {ZOO[data.year]?.e || ''}
                        </span>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="p-2 mb-2 bg-primary/10 rounded-md inline-block">
                          <span className="text-[11px] font-bold uppercase tracking-tighter text-primary">
                            Element: {data.element}
                          </span>
                        </div>
                        <AccordionContentWithPlayer text={data.prediction} />
                      </AccordionContent>
                    </AccordionItem>
                  ))}
              </Accordion>
            </div>
          }
        />
      </div>
    </div>
  );
}
