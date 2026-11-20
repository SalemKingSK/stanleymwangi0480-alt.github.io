"use client";

import React, { forwardRef } from "react";
import { Activity, Wand2, ShieldAlert, Lock } from "lucide-react";
import { AccordionContentWithPlayer } from "./accordion-content-with-player";

interface FateChambersProps {
  compoundNum: number | null;
  compoundMeaning: string | null;
  reducedCompoundNum: number | null;
  reducedCompoundMeaning: string | null;
  karmicFateNum: number | null;
  karmicFateMeaning: string | null;
  activeLayer: number | null;
  onLayerChange: (layer: number | null) => void;
  // Legacy/Alternate support
  psycheNum?: number;
  destinyNum?: number;
  birthDay?: number;
  birthMonth?: number;
  birthYear?: number;
  repeatedNumberMeanings?: Record<string, string>;
  onFateNavigation?: (n: number) => void;
  activeFateLayer?: number | null;
}

export const FateChambers = forwardRef<HTMLDivElement, FateChambersProps>(({
  compoundNum,
  compoundMeaning,
  reducedCompoundNum,
  reducedCompoundMeaning,
  karmicFateNum,
  karmicFateMeaning,
  activeLayer,
  onLayerChange
}, ref) => {

  const renderLayer = (
    layerNum: number,
    title: string,
    num: number | null,
    meaning: string | null,
    icon: React.ReactNode,
    badgeColor: string
  ) => {
    const isLocked = !meaning;
    const isOpen = activeLayer === layerNum;
    
    return (
      <div className={`fate-accordion ${isLocked ? 'fate-locked' : ''}`} id={`fate-layer-${layerNum}`}>
        <button
          className="fate-acc-header"
          onClick={() => !isLocked && onLayerChange(isOpen ? null : layerNum)}
          aria-expanded={isOpen}
          disabled={isLocked}
        >
          <div className="fate-acc-left">
            <span 
              className="fate-layer-badge" 
              style={{ background: `${badgeColor}22`, color: badgeColor, borderColor: `${badgeColor}55` }}
            >
              Layer {layerNum}
            </span>
            <span className="fate-acc-title">
              {title} {num ? `(${num})` : ''}
            </span>
          </div>
          {isLocked ? (
            <Lock className="h-4 w-4 opacity-40" />
          ) : (
            <span 
              className="fate-acc-arrow" 
              style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0)" }}
            >
              ▾
            </span>
          )}
        </button>

        {isOpen && !isLocked && (
          <div className="fate-acc-body">
             <div className="fate-meaning-card" style={{ borderLeftColor: badgeColor }}>
                <div className="flex items-center gap-2 mb-3">
                    {icon}
                    <span className="text-[11px] font-bold uppercase tracking-widest" style={{ color: badgeColor }}>
                        {title} Activation
                    </span>
                </div>
                <AccordionContentWithPlayer text={meaning!} />
             </div>
          </div>
        )}
        
        {isLocked && (
           <div className="fate-locked-note">
              <p className="italic text-[12px] text-slate-500 py-2 font-body px-4">
                This chamber is locked because your calculation resulted in a single-digit pure vibration. Compound evolutionary analysis only applies to double-digit paths.
              </p>
           </div>
        )}
      </div>
    );
  };

  return (
    <div ref={ref} className="fate-root glass-card p-4 mt-4">
      <div className="flex items-center gap-4 mb-4">
        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
        <h3 className="font-cinzel font-semibold text-[0.75rem] text-primary flex items-center gap-2 uppercase tracking-[0.3em]">
          <Wand2 className="h-4 w-4" /> The Chambers of Fate
        </h3>
        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
      </div>

      {renderLayer(1, "Compound Fate", compoundNum, compoundMeaning, <Wand2 className="h-4 w-4" />, "#9b8ec4")}
      {renderLayer(2, "Inherent Fate", reducedCompoundNum, reducedCompoundMeaning, <ShieldAlert className="h-4 w-4" />, "#3a8ee0")}
      {renderLayer(3, "Karmic Fate", karmicFateNum, karmicFateMeaning, <Activity className="h-4 w-4" />, "#e0a83a")}

      <style>{`
        .fate-root { display: flex; flex-direction: column; gap: 0; }
        .fate-accordion { border-top: 1px solid #2a2340; }
        .fate-accordion:first-of-type { border-top: none; }
        .fate-locked { opacity: 0.6; }
        .fate-acc-header {
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
        .fate-acc-header:disabled { cursor: default; }
        .fate-acc-left { display: flex; align-items: center; gap: 10px; }
        .fate-acc-title { font-size: 13.5px; font-weight: 600; letter-spacing: 0.03em; color: #c4b8e8; text-align: left; font-family: 'Cinzel', serif; }
        .fate-acc-arrow { font-size: 18px; color: #7a6fa0; transition: transform 0.2s ease; line-height: 1; }
        .fate-acc-body { padding: 4px 0 18px; animation: fateFadeIn 0.2s ease; }
        @keyframes fateFadeIn { from { opacity: 0; transform: translateY(-5px); } to { opacity: 1; transform: translateY(0); } }
        .fate-layer-badge { font-size: 10px; font-weight: 700; letter-spacing: 0.08em; padding: 2px 7px; border-radius: 20px; border: 1px solid; white-space: nowrap; font-family: 'Cinzel', serif; }
        .fate-meaning-card { background: rgba(255,255,255,0.02); border-left: 3px solid; border-radius: 0 10px 10px 0; padding: 16px; }
        .fate-locked-note { padding: 0 0 14px; }
      `}</style>
    </div>
  );
});

FateChambers.displayName = "FateChambers";
