"use client";

import React, { useState } from "react";
import { getArrowStatus } from "@/lib/arrow-analysis";
import {
  ALL_ARROW_DEFINITIONS,
  SHADOW_PRESENCE_INTRO,
  SHADOW_ABSENCE_INTRO,
} from "@/lib/arrow-definitions";
import { REMEDIES } from "@/lib/loshu-definitions";
import { AccordionContentWithPlayer } from "./profile-generator/accordion-content-with-player";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const TYPE_META: Record<string, { icon: string; label: string; color: string }> = {
  horizontal: { icon: "↔", label: "Horizontal Plane",  color: "#3a8ee0" },
  vertical:   { icon: "↕", label: "Vertical Column",   color: "#4caf7d" },
  diagonal:   { icon: "⤢", label: "Diagonal Axis",     color: "#e0a83a" },
  bridge:     { icon: "🌉", label: "Power Bridge",      color: "#9b8ec4" },
};

const STATE_META: Record<string, { icon: string; label: string; color: string; bg: string }> = {
  full:  { icon: "◉", label: "Arrow of Presence", color: "#9b8ec4", bg: "rgba(155,142,196,0.08)" },
  empty: { icon: "○", label: "Arrow of Absence",  color: "#e05c3a", bg: "rgba(224,92,58,0.08)"  },
};

function SectionDivider({ label }: { label: string }) {
  return (
    <div className="arr-divider">
      <span className="arr-divider-label">{label}</span>
    </div>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

interface LoshuArrowDetailPanelProps {
  arrowId: string;
  existingMeaning: string;
  birthDate: string;
  externalCounts?: Record<number, number>;
}

export default function LoshuArrowDetailPanel({
  arrowId,
  existingMeaning,
  birthDate,
  externalCounts
}: LoshuArrowDetailPanelProps) {
  const [openLayer, setOpenLayer] = useState<2 | 3 | 4 | null>(null);

  const definition = ALL_ARROW_DEFINITIONS.find((a) => a.id === arrowId);
  if (!definition) return null;

  const status   = getArrowStatus(definition, birthDate, externalCounts);
  const typeMeta = TYPE_META[definition.type];
  const stateMeta = STATE_META[definition.state];
  const isPresence = definition.state === "full";
  const shadowIntro = isPresence ? SHADOW_PRESENCE_INTRO : SHADOW_ABSENCE_INTRO;

  function toggle(layer: 2 | 3 | 4) {
    setOpenLayer((p) => (p === layer ? null : layer));
  }

  // Logic for optimization tips (Layer 2)
  const isPrimary = definition.isPrimary;
  const missingPrimaryNumbers = isPrimary && !status.isActive ? status.missingNumbers : [];

  return (
    <div className="arr-root">

      {/* ── LAYER 1: existing meaning ── */}
      <div className="arr-layer1">
        <AccordionContentWithPlayer text={existingMeaning} />
      </div>

      {/* ── LAYER 2: Arrow Metadata + Core Trait ── */}
      <div className="arr-accordion">
        <button
          className="arr-acc-header"
          onClick={() => toggle(2)}
          aria-expanded={openLayer === 2}
        >
          <div className="arr-acc-left">
            <span className="arr-layer-badge" style={{ background: "#3a8ee022", color: "#3a8ee0", borderColor: "#3a8ee055" }}>
              Layer 2
            </span>
            <span className="arr-acc-title">Arrow Anatomy</span>
          </div>
          <span className="arr-acc-arrow" style={{ transform: openLayer === 2 ? "rotate(180deg)" : "rotate(0)" }}>▾</span>
        </button>

        {openLayer === 2 && (
          <div className="arr-acc-body">

            {/* State badge */}
            <div
              className="arr-state-pill"
              style={{ background: stateMeta.bg, borderColor: stateMeta.color + "44", color: stateMeta.color }}
            >
              <span>{stateMeta.icon}</span>
              <span>{stateMeta.label}</span>
            </div>

            {/* Type + Numbers row */}
            <div className="arr-meta-row">
              <div className="arr-meta-box" style={{ borderColor: typeMeta.color + "44" }}>
                <span className="arr-meta-label">Type</span>
                <span className="arr-meta-icon" style={{ color: typeMeta.color }}>{typeMeta.icon}</span>
                <span className="arr-meta-value" style={{ color: typeMeta.color }}>{typeMeta.label}</span>
              </div>
              <div className="arr-meta-box" style={{ borderColor: "#4a3f6b" }}>
                <span className="arr-meta-label">Numbers</span>
                <div className="arr-number-pips">
                  {definition.numbers.map((n) => {
                    const present = status.presentNumbers.includes(n);
                    return (
                      <span
                        key={n}
                        className="arr-pip"
                        style={{
                          background: present ? "#9b8ec422" : "transparent",
                          borderColor: present ? "#9b8ec4" : "#3d3560",
                          color: present ? "#c4b8e8" : "#4a3f6b",
                        }}
                      >
                        {n}
                      </span>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Core trait */}
            <SectionDivider label="Core Characteristics" />
            <div className="arr-core-card">
              <div className="arr-core-text">
                <AccordionContentWithPlayer text={definition.coreTrait} />
              </div>
            </div>

            {/* Active status */}
            <div
              className="arr-status-row"
              style={{
                background: status.isActive ? stateMeta.bg : "rgba(255,255,255,0.02)",
                borderColor: status.isActive ? stateMeta.color + "44" : "#2a2340",
              }}
            >
              <span style={{ color: status.isActive ? stateMeta.color : "#665f7a" }}>
                {status.isActive ? "● Active in your chart" : "◌ Not active in your chart"}
              </span>
              {!status.isActive && definition.state === "full" && (
                <span className="arr-partial-note">
                  {status.presentNumbers.length}/{definition.numbers.length} numbers present
                </span>
              )}
            </div>

            {/* Optimization Tip for Primary Planes */}
            {missingPrimaryNumbers.length > 0 && (
              <div className="mt-4 p-4 rounded-lg bg-primary/5 border border-primary/20">
                <p className="text-[11px] font-bold uppercase tracking-widest text-primary mb-2">⚡ Optimization Guidance</p>
                <div className="text-sm italic text-slate-300">
                  <AccordionContentWithPlayer text={`To activate this primary plane, focus on the elemental remedies for your missing number(s): ${missingPrimaryNumbers.map(n => `\n\nNumber ${n}: ${REMEDIES[n]?.missing || 'General grounding'}`).join('')}`} />
                </div>
              </div>
            )}

          </div>
        )}
      </div>

      {/* ── LAYER 3: Positive Potential ── */}
      {definition.potentialBody && (
        <div className="arr-accordion">
          <button
            className="arr-acc-header"
            onClick={() => toggle(3)}
            aria-expanded={openLayer === 3}
          >
            <div className="arr-acc-left">
              <span className="arr-layer-badge" style={{ background: "#4caf7d22", color: "#4caf7d", borderColor: "#4caf7d55" }}>
                Layer 3
              </span>
              <span className="arr-acc-title">{isPrimary ? "Primary Power Plane" : "Constructive Potential"} · {definition.potentialTitle}</span>
            </div>
            <span className="arr-acc-arrow" style={{ transform: openLayer === 3 ? "rotate(180deg)" : "rotate(0)" }}>▾</span>
          </button>

          {openLayer === 3 && (
            <div className="arr-acc-body">
              <div className="arr-potential-card">
                <p className="arr-potential-headline" style={{ color: "#4caf7d" }}>{isPrimary ? "Core Strength" : definition.potentialTitle}</p>
                <div className="arr-potential-text">
                  <AccordionContentWithPlayer text={definition.potentialBody} />
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── LAYER 4: Shadow ── */}
      {definition.shadowBody && (
        <div className="arr-accordion">
          <button
            className="arr-acc-header"
            onClick={() => toggle(4)}
            aria-expanded={openLayer === 4}
          >
            <div className="arr-acc-left">
              <span
                className="arr-layer-badge"
                style={{
                  background: isPresence ? "rgba(224,92,58,0.12)" : "rgba(224,92,58,0.08)",
                  color: "#e05c3a",
                  borderColor: "rgba(224,92,58,0.35)",
                }}
              >
                {definition.potentialBody ? 'Layer 4' : 'Layer 3'}
              </span>
              <span className="arr-acc-title">
                Shadow · {definition.shadowTitle}
              </span>
            </div>
            <span className="arr-acc-arrow" style={{ transform: openLayer === 4 ? "rotate(180deg)" : "rotate(0)" }}>▾</span>
          </button>

          {openLayer === 4 && (
            <div className="arr-acc-body">

              {/* Intro quote */}
              <div className="arr-shadow-intro-card">
                <span className="arr-shadow-intro-icon">{isPresence ? "🔥" : "🕳"}</span>
                <p className="arr-shadow-intro-text">{shadowIntro}</p>
              </div>

              <SectionDivider label={isPresence ? "Shadow of Presence" : "Shadow of Absence"} />

              {/* Shadow headline */}
              <div
                className="arr-shadow-main"
                style={{ borderLeftColor: "#e05c3a" }}
              >
                <p className="arr-shadow-headline" style={{ color: "#e05c3a" }}>
                  {definition.name} — {definition.shadowTitle}
                </p>
                <div className="arr-shadow-body">
                  <AccordionContentWithPlayer text={definition.shadowBody} />
                </div>
              </div>

              {/* Number chips */}
              <SectionDivider label="Numbers Involved" />
              <div className="arr-drowned-row">
                {definition.numbers.map((n) => {
                  const present = status.presentNumbers.includes(n);
                  return (
                    <div
                      key={n}
                      className="arr-drowned-chip"
                      style={{
                        background: present ? "rgba(155,142,196,0.08)" : "rgba(224,92,58,0.06)",
                        borderColor: present ? "#4a3f6b" : "rgba(224,92,58,0.3)",
                      }}
                    >
                      <span
                        className="arr-drowned-num"
                        style={{ color: present ? "#c4b8e8" : "#e05c3a" }}
                      >
                        {n}
                      </span>
                      <span className="arr-rowned-state">
                        {present ? "present" : "absent"}
                      </span>
                    </div>
                  );
                })}
              </div>

            </div>
          )}
        </div>
      )}

      {/* Scoped styles */}
      <style>{`
        .arr-root {
          display: flex;
          flex-direction: column;
          gap: 0;
          font-family: inherit;
        }

        /* Layer 1 */
        .arr-layer1 { padding: 0 0 16px; }

        /* Accordion */
        .arr-accordion { border-top: 1px solid #2a2340; }
        .arr-acc-header {
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
        .arr-acc-left { display: flex; align-items: center; gap: 10px; }
        .arr-acc-title {
          font-size: 13.5px;
          font-weight: 600;
          letter-spacing: 0.03em;
          color: #c4b8e8;
          text-align: left;
        }
        .arr-acc-arrow {
          font-size: 18px;
          color: #7a6fa0;
          transition: transform 0.2s ease;
          line-height: 1;
        }
        .arr-acc-body {
          padding: 4px 0 18px;
          display: flex;
          flex-direction: column;
          gap: 12px;
          animation: arrFadeIn 0.2s ease;
        }
        @keyframes arrFadeIn {
          from { opacity: 0; transform: translateY(-5px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        /* Layer badge */
        .arr-layer-badge {
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.08em;
          padding: 2px 7px;
          border-radius: 20px;
          border: 1px solid;
          white-space: nowrap;
        }

        /* Divider */
        .arr-divider {
          display: flex;
          align-items: center;
          gap: 8px;
          margin: 4px 0 2px;
        }
        .arr-divider::before,
        .arr-divider::after {
          content: "";
          flex: 1;
          height: 1px;
          background: linear-gradient(to right, transparent, #3d3560, transparent);
        }
        .arr-divider-label {
          font-size: 10px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #7a6fa0;
          white-space: nowrap;
        }

        /* State pill */
        .arr-state-pill {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          padding: 6px 14px;
          border-radius: 20px;
          border: 1px solid;
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 0.05em;
          align-self: flex-start;
        }

        /* Meta row */
        .arr-meta-row {
          display: flex;
          gap: 10px;
        }
        .arr-meta-box {
          flex: 1;
          background: rgba(255,255,255,0.02);
          border: 1px solid;
          border-radius: 10px;
          padding: 10px 12px;
          display: flex;
          flex-direction: column;
          gap: 4px;
          align-items: center;
          text-align: center;
        }
        .arr-meta-label {
          font-size: 10px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #7a6fa0;
        }
        .arr-meta-icon { font-size: 18px; }
        .arr-meta-value {
          font-size: 12px;
          font-weight: 600;
        }

        /* Number pips */
        .arr-number-pips {
          display: flex;
          gap: 6px;
          margin-top: 2px;
        }
        .arr-pip {
          width: 28px;
          height: 28px;
          border-radius: 8px;
          border: 1px solid;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
          font-weight: 700;
        }

        /* Core card */
        .arr-core-card {
          background: rgba(255,255,255,0.02);
          border: 1px solid #2a2340;
          border-radius: 10px;
          padding: 12px 14px;
        }
        .arr-core-text {
          font-size: 14px;
          line-height: 1.65;
          color: #d8cff0;
          margin: 0;
          font-style: italic;
        }

        /* Status row */
        .arr-status-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 9px 12px;
          border-radius: 8px;
          border: 1px solid;
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 0.04em;
        }
        .arr-partial-note {
          font-size: 11px;
          color: #7a6fa0;
        }

        /* Potential card */
        .arr-potential-card {
          background: rgba(76,175,125,0.05);
          border: 1px solid rgba(76,175,125,0.15);
          border-radius: 10px;
          padding: 14px 16px;
        }
        .arr-potential-headline {
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.07em;
          text-transform: uppercase;
          margin: 0 0 8px;
        }
        .arr-potential-text {
          font-size: 14px;
          line-height: 1.65;
          color: #d8cff0;
        }

        /* Shadow layer */
        .arr-shadow-intro-card {
          display: flex;
          gap: 12px;
          align-items: flex-start;
          background: rgba(224,92,58,0.04);
          border: 1px solid rgba(224,92,58,0.15);
          border-radius: 10px;
          padding: 12px 14px;
        }
        .arr-shadow-intro-icon { font-size: 20px; flex-shrink: 0; }
        .arr-shadow-intro-text {
          font-size: 13px;
          line-height: 1.65;
          color: #a89ec4;
          margin: 0;
          font-style: italic;
        }
        .arr-shadow-main {
          border-left: 3px solid;
          border-radius: 0 10px 10px 0;
          padding: 12px 14px;
          background: rgba(224,92,58,0.04);
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .arr-shadow-headline {
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.07em;
          text-transform: uppercase;
          margin: 0;
        }
        .arr-shadow-body {
          font-size: 14px;
          line-height: 1.7;
          color: #d8cff0;
          margin: 0;
        }

        /* Drowned chips */
        .arr-drowned-row {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
        }
        .arr-drowned-chip {
          display: flex;
          flex-direction: column;
          align-items: center;
          border: 1px solid;
          border-radius: 10px;
          padding: 8px 16px;
          min-width: 60px;
        }
        .arr-drowned-num {
          font-size: 22px;
          font-weight: 700;
        }
        .arr-rowned-state {
          font-size: 10px;
          letter-spacing: 0.05em;
          color: #7a6fa0;
          margin-top: 2px;
        }
      `}</style>
    </div>
  );
}
