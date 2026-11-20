"use client";

import React, { forwardRef } from "react";
import { BookUser, Star, Sparkles, Lock } from "lucide-react";
import { AccordionContentWithPlayer } from "./accordion-content-with-player";
import PsychicNumberDetailPanel from "@/components/PsychicNumberDetailPanel";

interface CoreVibrationsProps {
  psycheNum: number;
  psychicMeaning: { title: string; description: string };
  destinyNum: number;
  destinyMeaning: { title: string; description: string };
  birthDay: number;
  birthMonth: number;
  specialTraitMeaning: string | null;
  activeLayer: string | null;
  onLayerChange: (layer: string | null) => void;
}

export const CoreVibrations = forwardRef<HTMLDivElement, CoreVibrationsProps>(({
  psycheNum,
  psychicMeaning,
  destinyNum,
  destinyMeaning,
  birthDay,
  birthMonth,
  specialTraitMeaning,
  activeLayer,
  onLayerChange
}, ref) => {
  
  const renderLayer = (
    id: string,
    layerNum: number,
    title: string,
    content: string | null,
    icon: React.ReactNode,
    badgeColor: string,
    isLocked: boolean = false
  ) => {
    const isOpen = activeLayer === id;

    return (
      <div className={`core-v-accordion ${isLocked ? 'core-v-locked' : ''}`} id={`layer-${id}`}>
        <button
          className="core-v-acc-header"
          onClick={() => !isLocked && onLayerChange(isOpen ? null : id)}
          aria-expanded={isOpen}
        >
          <div className="core-v-acc-left">
            <span 
              className="core-v-layer-badge" 
              style={{ background: `${badgeColor}22`, color: badgeColor, borderColor: `${badgeColor}55` }}
            >
              Chamber {layerNum}
            </span>
            <span className="core-v-acc-title">
              {title}
            </span>
          </div>
          {isLocked ? (
            <Lock className="h-4 w-4 opacity-40" />
          ) : (
            <span 
              className="core-v-acc-arrow" 
              style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0)" }}
            >
              ▾
            </span>
          )}
        </button>

        {isOpen && !isLocked && (
          <div className="core-v-acc-body">
             <div className="core-v-meaning-card" style={{ borderLeftColor: badgeColor }}>
                {id === 'psyche' ? (
                  <PsychicNumberDetailPanel 
                    number={psycheNum} 
                    johariMeaning={psychicMeaning.description} 
                    birthMonth={birthMonth}
                  />
                ) : (
                  <>
                    <div className="flex items-center gap-2 mb-3">
                        {icon}
                        <span className="text-[11px] font-bold uppercase tracking-widest" style={{ color: badgeColor }}>
                            {title} Activation
                        </span>
                    </div>
                    <AccordionContentWithPlayer text={content || ""} />
                  </>
                )}
             </div>
          </div>
        )}
        
        {isLocked && (
           <div className="core-v-locked-note">
              <p className="italic text-[12px] text-slate-500 py-2 font-body px-4">
                This chamber is locked because your birth day resulted in a single-digit pure vibration. Compound day analysis only applies to double-digit paths (days 10–31).
              </p>
           </div>
        )}
      </div>
    );
  };

  return (
    <div ref={ref} className="core-v-root glass-card p-4 mt-4">
      <div className="flex items-center gap-4 mb-4">
        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
        <h3 className="font-cinzel font-semibold text-[0.75rem] text-primary flex items-center gap-2 uppercase tracking-[0.3em]">
          <Sparkles className="h-4 w-4" /> The Triad of Core Vibrations
        </h3>
        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
      </div>

      {renderLayer("psyche", 1, `The Psychic Essence (${psycheNum})`, psychicMeaning?.description || null, <BookUser className="h-4 w-4" />, "#9b8ec4")}
      {renderLayer("day", 2, `The Day of Incarnation (${birthDay})`, specialTraitMeaning, <Star className="h-4 w-4" />, "#3a8ee0", !specialTraitMeaning)}
      {renderLayer("destiny", 3, `The Destiny Path (${destinyNum})`, destinyMeaning?.description || null, <Sparkles className="h-4 w-4" />, "#e0a83a")}

      <style>{`
        .core-v-root { display: flex; flex-direction: column; gap: 0; }
        .core-v-accordion { border-top: 1px solid #2a2340; }
        .core-v-accordion:first-of-type { border-top: none; }
        .core-v-locked { opacity: 0.6; }
        .core-v-acc-header {
          width: 100%;
          background: transparent;
          border: none;
          padding: 14px 0;
          display: flex;
          align-items: center;
          justify-content: space-between;
          cursor: pointer;
          gap: 10px;
        }
        .core-v-acc-left { display: flex; align-items: center; gap: 10px; }
        .core-v-acc-title { font-size: 13.5px; font-weight: 600; letter-spacing: 0.03em; color: #c4b8e8; text-align: left; font-family: 'Cinzel', serif; }
        .core-v-acc-arrow { font-size: 18px; color: #7a6fa0; transition: transform 0.2s ease; line-height: 1; }
        .core-v-acc-body { padding: 4px 0 18px; animation: coreFadeIn 0.2s ease; }
        @keyframes coreFadeIn { from { opacity: 0; transform: translateY(-5px); } to { opacity: 1; transform: translateY(0); } }
        .core-v-layer-badge { font-size: 10px; font-weight: 700; letter-spacing: 0.08em; padding: 2px 7px; border-radius: 20px; border: 1px solid; white-space: nowrap; font-family: 'Cinzel', serif; }
        .core-v-meaning-card { background: rgba(255,255,255,0.02); border-left: 3px solid; border-radius: 0 10px 10px 0; padding: 16px; }
        .core-v-locked-note { padding: 0 0 14px; }
      `}</style>
    </div>
  );
});

CoreVibrations.displayName = "CoreVibrations";
