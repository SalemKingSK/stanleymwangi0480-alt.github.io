// src/components/LoshuNumberDetailPanel.tsx
"use client";

import React, { useState } from "react";
import { analyzeNumber } from "@/lib/loshu-analysis";
import {
  DROWNING_SECTION_INTRO,
  HARDWARE_SOFTWARE_INTRO,
  LOSHU_NUMBER_DEFINITIONS
} from "@/lib/loshu-definitions";
import { AccordionContentWithPlayer } from "./profile-generator/accordion-content-with-player";

const ELEMENT_COLORS: Record<string, string> = {
  Fire: "#e05c3a",
  Water: "#3a8ee0",
  Earth: "#b8972a",
  Wood: "#4caf7d",
  Metal: "#9b8ec4",
};

const INTENSITY_LABELS: Record<number, string> = {
  1: "Single",
  2: "Double",
  3: "Triple",
  4: "Quadruple",
};

function SectionDivider({ label }: { label: string }) {
  return (
    <div className="loshu-section-divider">
      <span className="loshu-section-label">{label}</span>
    </div>
  );
}

function InfoBadge({
  icon,
  label,
  value,
  accent,
}: {
  icon: string;
  label: string;
  value: string;
  accent?: string;
}) {
  return (
    <div className="loshu-badge" style={{ borderColor: accent ?? "#4a3f6b" }}>
      <span className="loshu-badge-icon">{icon}</span>
      <div>
        <div className="loshu-badge-label">{label}</div>
        <div className="loshu-badge-value" style={{ color: accent ?? "#c9b8ff" }}>
          {value}
        </div>
      </div>
    </div>
  );
}

function CountDots({ count, max = 4 }: { count: number; max?: number }) {
  return (
    <div className="loshu-count-dots">
      {Array.from({ length: max }).map((_, i) => (
        <div
          key={i}
          className={`loshu-dot ${i < count ? "active" : ""}`}
        />
      ))}
    </div>
  );
}

interface LoshuNumberDetailPanelProps {
  number: number;
  count: number;
  existingMeaning: string;
  birthDate: string;
}

export default function LoshuNumberDetailPanel({
  number,
  count,
  existingMeaning,
  birthDate,
}: LoshuNumberDetailPanelProps) {
  const [openLayer, setOpenLayer] = useState<2 | 3 | 4 | null>(null);

  const analysis = analyzeNumber(number, birthDate, count);
  const { definition, isDrowning, drownsNumbers, remedy, lifePathConflict, lifePath } =
    analysis;
  const elColor = ELEMENT_COLORS[definition.element] ?? "#9b8ec4";
  const cappedCount = Math.min(count, 4);
  const intensityLabel = INTENSITY_LABELS[cappedCount] ?? "Single";

  function toggleLayer(layer: 2 | 3 | 4) {
    setOpenLayer((prev) => (prev === layer ? null : layer));
  }

  return (
    <div className="loshu-detail-root">
      {/* LAYER 1: Existing Meaning */}
      <div className="loshu-layer-1">
        <AccordionContentWithPlayer text={existingMeaning} />
      </div>

      {/* LAYER 2: Numerical Saturation */}
      <div className="loshu-accordion">
        <button
          className="loshu-accordion-header"
          onClick={() => toggleLayer(2)}
        >
          <div className="loshu-accordion-left">
            <span className="loshu-layer-badge" style={{ background: elColor + "22", color: elColor, borderColor: elColor + "55" }}>
              Layer 2
            </span>
            <span className="loshu-accordion-title">Numerical Saturation</span>
          </div>
          <span className="loshu-accordion-arrow" style={{ transform: openLayer === 2 ? "rotate(180deg)" : "rotate(0deg)" }}>
            ▾
          </span>
        </button>

        {openLayer === 2 && (
          <div className="loshu-accordion-body">
            <div className="loshu-badges-row">
              <InfoBadge icon="☿" label="Ruler" value={definition.ruler} accent={elColor} />
              <InfoBadge icon="◈" label="Element" value={definition.element} accent={elColor} />
            </div>
            <div className="loshu-governs">
              <span className="loshu-governs-label">Governs</span>
              <span className="loshu-governs-value">{definition.governs}</span>
            </div>

            <SectionDivider label={`${intensityLabel} ${number} — Spectrum`} />

            <div className="loshu-intensity-row">
              <span className="loshu-intensity-label" style={{ color: elColor }}>
                {intensityLabel} · {cappedCount}×
              </span>
              <CountDots count={cappedCount} />
            </div>

            <div className="loshu-count-meaning-card" style={{ borderLeftColor: elColor }}>
              <p className="loshu-count-meaning-label" style={{ color: elColor }}>
                {definition.counts[cappedCount as 1 | 2 | 3 | 4]?.label}
              </p>
              <div className="loshu-count-meaning-text">
                <AccordionContentWithPlayer text={definition.counts[cappedCount as 1 | 2 | 3 | 4]?.meaning} />
              </div>
            </div>

            <details className="loshu-all-counts">
              <summary className="loshu-all-counts-summary">View all intensity levels →</summary>
              <div className="loshu-all-counts-body">
                {([1, 2, 3, 4] as const).map((lvl) => (
                  <div key={lvl} className={`loshu-count-row ${cappedCount === lvl ? "active" : ""}`}>
                    <span className="loshu-count-row-label" style={{ color: cappedCount === lvl ? elColor : undefined }}>
                      {definition.counts[lvl].label}
                    </span>
                    <div className="loshu-count-row-text">
                      <AccordionContentWithPlayer text={definition.counts[lvl].meaning} />
                    </div>
                  </div>
                ))}
              </div>
            </details>
          </div>
        )}
      </div>

      {/* LAYER 3: Drowning Effect */}
      <div className={`loshu-accordion ${!isDrowning ? "loshu-locked" : ""}`}>
        <button
          className="loshu-accordion-header"
          onClick={() => isDrowning && toggleLayer(3)}
          style={{ opacity: isDrowning ? 1 : 0.45, cursor: isDrowning ? "pointer" : "not-allowed" }}
        >
          <div className="loshu-accordion-left">
            <span className="loshu-layer-badge" style={{ background: isDrowning ? "#e05c3a22" : "#33303a", color: isDrowning ? "#e05c3a" : "#665f7a", borderColor: isDrowning ? "#e05c3a55" : "#44405a" }}>
              Layer 3
            </span>
            <span className="loshu-accordion-title">
              {isDrowning ? `The Drowning Effect — ${intensityLabel} ${number}` : `Drowning Effect · Unlocks at Triple`}
            </span>
          </div>
          {isDrowning ? <span className="loshu-accordion-arrow" style={{ transform: openLayer === 3 ? "rotate(180deg)" : "rotate(0deg)" }}>▾</span> : <span className="loshu-lock-icon">🔒</span>}
        </button>

        {openLayer === 3 && isDrowning && (
          <div className="loshu-accordion-body">
            <div className="loshu-drowning-intro">
              <AccordionContentWithPlayer text={DROWNING_SECTION_INTRO} />
            </div>
            <SectionDivider label="Energetic Interference" />
            <div className="loshu-drowning-card">
              <div className="loshu-drowning-flame">🔥</div>
              <p className="loshu-drowning-headline">{`${intensityLabel} ${number} — Saturation Active`}</p>
              <div className="loshu-drowning-body">
                <AccordionContentWithPlayer text={definition.counts[cappedCount as 3 | 4]?.meaning} />
              </div>
            </div>
            {drownsNumbers.length > 0 && (
              <>
                <SectionDivider label="Numbers Being Drowned" />
                <div className="loshu-drowned-row">
                  {drownsNumbers.map((n) => (
                    <div key={n} className="loshu-drowned-chip">
                      <span className="loshu-drowned-num">{n}</span>
                      <span className="loshu-drowned-name">{LOSHU_NUMBER_DEFINITIONS[n]?.governs?.split(",")[0] ?? ""}</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* LAYER 4: Hardware vs Software */}
      <div className="loshu-accordion">
        <button className="loshu-accordion-header" onClick={() => toggleLayer(4)}>
          <div className="loshu-accordion-left">
            <span className="loshu-layer-badge" style={{ background: "#3a8ee022", color: "#3a8ee0", borderColor: "#3a8ee055" }}>
              Layer 4
            </span>
            <span className="loshu-accordion-title">Hardware vs Software</span>
          </div>
          <span className="loshu-accordion-arrow" style={{ transform: openLayer === 4 ? "rotate(180deg)" : "rotate(0deg)" }}>▾</span>
        </button>

        {openLayer === 4 && (
          <div className="loshu-accordion-body">
            <div className="loshu-hw-intro">
              <AccordionContentWithPlayer text={HARDWARE_SOFTWARE_INTRO} />
            </div>
            <div className="loshu-hw-row">
              <div className="loshu-hw-box" style={{ borderColor: elColor }}>
                <span className="loshu-hw-title">Hardware</span>
                <span className="loshu-hw-subtitle">Birth Grid</span>
                <span className="loshu-hw-value" style={{ color: elColor }}>{intensityLabel} {number}</span>
              </div>
              <div className="loshu-hw-vs">⟷</div>
              <div className="loshu-hw-box" style={{ borderColor: "#3a8ee0" }}>
                <span className="loshu-hw-title">Software</span>
                <span className="loshu-hw-subtitle">Life Path</span>
                <span className="loshu-hw-value" style={{ color: "#3a8ee0" }}>{lifePath}</span>
              </div>
            </div>
            {lifePathConflict ? (
              <>
                <SectionDivider label="Active Conflict Detected" />
                <div className="loshu-conflict-card">
                  <p className="loshu-conflict-badge">⚠ Psychodynamic Conflict</p>
                  <p className="loshu-conflict-purpose"><strong>Core Purpose:</strong> {lifePathConflict.corePurpose}</p>
                  <p className="loshu-conflict-condition"><strong>Condition:</strong> {lifePathConflict.condition}</p>
                  <div className="loshu-conflict-result">
                    <AccordionContentWithPlayer text={lifePathConflict.psychodynamicResult} />
                  </div>
                </div>
              </>
            ) : (
              <div className="loshu-no-conflict">
                <AccordionContentWithPlayer text={`Your Life Path (${lifePath}) does not share a direct psychodynamic conflict with this grid number. The system is in relative balance.`} />
              </div>
            )}
            <SectionDivider label={`Remedies for Number ${number}`} />
            <div className="loshu-remedies">
              <div className="loshu-remedy-card loshu-remedy-missing">
                <span className="loshu-remedy-icon">✦</span>
                <div>
                  <p className="loshu-remedy-type">If Missing (Void)</p>
                  <div className="loshu-remedy-text">
                    <AccordionContentWithPlayer text={remedy.missing} />
                  </div>
                </div>
              </div>
              <div className="loshu-remedy-card loshu-remedy-overloaded" style={{ borderColor: elColor + "55" }}>
                <span className="loshu-remedy-icon" style={{ color: elColor }}>◉</span>
                <div>
                  <p className="loshu-remedy-type" style={{ color: elColor }}>If Overloaded (Drowning)</p>
                  <div className="loshu-remedy-text">
                    <AccordionContentWithPlayer text={remedy.overloaded} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        .loshu-detail-root { display: flex; flex-direction: column; gap: 0; }
        .loshu-layer-1 { padding: 0 0 16px; }
        .loshu-accordion { border-top: 1px solid #2a2340; margin-top: 2px; }
        .loshu-accordion-header { width: 100%; background: transparent; border: none; padding: 14px 0; display: flex; align-items: center; justify-content: space-between; cursor: pointer; gap: 10px; }
        .loshu-accordion-left { display: flex; align-items: center; gap: 10px; }
        .loshu-accordion-title { font-size: 13.5px; font-weight: 600; color: #c4b8e8; text-align: left; }
        .loshu-accordion-arrow { font-size: 18px; color: #7a6fa0; transition: transform 0.2s ease; line-height: 1; }
        .loshu-accordion-body { padding: 4px 0 18px; display: flex; flex-direction: column; gap: 12px; }
        .loshu-layer-badge { font-size: 10px; font-weight: 700; padding: 2px 7px; border-radius: 20px; border: 1px solid; }
        .loshu-section-divider { display: flex; align-items: center; gap: 8px; margin: 6px 0 2px; }
        .loshu-section-divider::before, .loshu-section-divider::after { content: ""; flex: 1; height: 1px; background: linear-gradient(to right, transparent, #3d3560, transparent); }
        .loshu-section-label { font-size: 10px; text-transform: uppercase; color: #7a6fa0; }
        .loshu-badges-row { display: flex; gap: 10px; }
        .loshu-badge { flex: 1; display: flex; align-items: flex-start; gap: 8px; background: rgba(255,255,255,0.03); border: 1px solid; border-radius: 10px; padding: 10px 12px; }
        .loshu-badge-label { font-size: 10px; text-transform: uppercase; color: #7a6fa0; }
        .loshu-badge-value { font-size: 13px; font-weight: 600; }
        .loshu-governs { background: rgba(255,255,255,0.02); border: 1px solid #2a2340; border-radius: 8px; padding: 9px 12px; display: flex; align-items: baseline; gap: 8px; }
        .loshu-governs-label { font-size: 10px; text-transform: uppercase; color: #7a6fa0; }
        .loshu-governs-value { font-size: 13px; color: #c4b8e8; }
        .loshu-intensity-row { display: flex; align-items: center; justify-content: space-between; }
        .loshu-count-dots { display: flex; gap: 5px; }
        .loshu-dot { width: 9px; height: 9px; border-radius: 50%; background: #2a2340; border: 1px solid #3d3560; }
        .loshu-dot.active { background: #9b8ec4; border-color: #c4b8e8; box-shadow: 0 0 5px rgba(155,142,196,0.5); }
        .loshu-count-meaning-card { background: rgba(255,255,255,0.03); border-left: 3px solid; border-radius: 0 10px 10px 0; padding: 12px 14px; }
        .loshu-count-meaning-label { font-size: 11px; font-weight: 700; text-transform: uppercase; margin: 0 0 6px; }
        .loshu-count-meaning-text { font-size: 14px; line-height: 1.65; color: #d8cff0; }
        .loshu-all-counts { border-top: 1px solid #2a2340; padding-top: 10px; }
        .loshu-all-counts-summary { font-size: 12px; color: #7a6fa0; cursor: pointer; }
        .loshu-count-row { padding: 8px 10px; border-radius: 8px; background: rgba(255,255,255,0.02); border: 1px solid #2a2340; margin-top: 8px; }
        .loshu-count-row.active { background: rgba(155,142,196,0.07); border-color: #4a3f6b; }
        .loshu-count-row-label { font-size: 11px; font-weight: 700; color: #9b8ec4; display: block; margin-bottom: 4px; }
        .loshu-count-row-text { font-size: 13px; line-height: 1.6; color: #b8acd4; }
        .loshu-drowning-card { background: rgba(224,92,58,0.06); border: 1px solid rgba(224,92,58,0.25); border-radius: 12px; padding: 16px; text-align: center; }
        .loshu-drowning-headline { font-size: 13px; font-weight: 700; color: #e05c3a; text-transform: uppercase; }
        .loshu-drowning-body { font-size: 14px; line-height: 1.65; color: #d8cff0; text-align: left; margin-top: 10px; }
        .loshu-drowned-row { display: flex; gap: 10px; flex-wrap: wrap; }
        .loshu-drowned-chip { display: flex; flex-direction: column; align-items: center; background: rgba(224,92,58,0.08); border: 1px solid rgba(224,92,58,0.3); border-radius: 10px; padding: 8px 14px; min-width: 60px; }
        .loshu-drowned-num { font-size: 20px; font-weight: 700; color: #e05c3a; }
        .loshu-drowned-name { font-size: 10px; color: #a89ec4; }
        .loshu-hw-row { display: flex; align-items: center; gap: 10px; }
        .loshu-hw-box { flex: 1; border: 1px solid; border-radius: 10px; padding: 12px; text-align: center; background: rgba(255,255,255,0.02); display: flex; flex-direction: column; }
        .loshu-hw-title { font-size: 10px; text-transform: uppercase; color: #7a6fa0; }
        .loshu-hw-value { font-size: 26px; font-weight: 700; margin-top: 4px; }
        .loshu-conflict-card { background: rgba(255, 180, 50, 0.05); border: 1px solid rgba(255, 180, 50, 0.25); border-radius: 10px; padding: 14px 16px; }
        .loshu-conflict-badge { font-size: 11px; font-weight: 700; color: #ffb432; margin: 0 0 8px; }
        .loshu-conflict-result { font-size: 14px; line-height: 1.6; color: #e8ddb5; font-style: italic; margin-top: 8px; }
        .loshu-remedies { display: flex; flex-direction: column; gap: 10px; }
        .loshu-remedy-card { display: flex; align-items: flex-start; gap: 12px; padding: 12px 14px; border-radius: 10px; border: 1px solid; }
        .loshu-remedy-missing { background: rgba(76,175,125,0.05); border-color: rgba(76,175,125,0.25); }
        .loshu-remedy-type { font-size: 11px; font-weight: 700; color: #4caf7d; text-transform: uppercase; margin-bottom: 4px; }
        .loshu-remedy-text { font-size: 13px; line-height: 1.6; color: #c4b8e8; }
      `}</style>
    </div>
  );
}
