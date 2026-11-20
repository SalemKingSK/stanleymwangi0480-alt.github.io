
/**
 * MYSTIQUE COMPASS — Four Planes Chart
 *
 * A lightweight, dependency-free SVG bar chart visualizing the Four Planes
 * of Expression (Mental / Physical / Emotional / Intuitive) percentages
 * alongside the existing text breakdown. Built with plain SVG + Framer
 * Motion (both already used throughout the app) rather than pulling in
 * recharts/chart.js, in keeping with the project's zero-cost, no-added-
 * dependency architecture.
 */

import * as React from 'react';
import { motion } from 'framer-motion';
import type { PlaneAnalysis } from '@/lib/numerology/synthesis/plane-analysis';

interface PlaneChartDatum {
  key: string;
  label: string;
  plane: PlaneAnalysis;
  color: string;
}

const LEVEL_ORDER: PlaneAnalysis['level'][] = ['Deficient', 'Developing', 'Balanced', 'Dominant', 'Overwhelming'];

export function FourPlanesChart({ planes }: { planes: PlaneChartDatum[] }) {
  const chartHeight = 168;
  const barWidth = 40;
  const gap = 26;
  const width = planes.length * barWidth + (planes.length - 1) * gap + 16;
  const baselineY = chartHeight - 22;
  const maxBarHeight = baselineY - 14;

  return (
    <div
      className="rounded-xl p-4 mb-3"
      style={{ background: 'rgba(255,255,255,0.015)', border: '1px solid rgba(139,92,246,0.15)' }}
    >
      <p className="text-[0.7rem] text-slate-500 font-cinzel uppercase tracking-wider mb-3 text-center">
        Plane Distribution
      </p>
      <div className="w-full flex justify-center overflow-x-auto">
        <svg
          viewBox={`0 0 ${width} ${chartHeight}`}
          width="100%"
          style={{ maxWidth: 340 }}
          role="img"
          aria-label="Four Planes of Expression percentage chart"
        >
          {/* Reference gridlines at 25/50/75% */}
          {[0.25, 0.5, 0.75].map((f) => (
            <line
              key={f}
              x1={8}
              x2={width - 8}
              y1={baselineY - maxBarHeight * f}
              y2={baselineY - maxBarHeight * f}
              stroke="rgba(255,255,255,0.06)"
              strokeDasharray="2,3"
            />
          ))}
          <line x1={8} x2={width - 8} y1={baselineY} y2={baselineY} stroke="rgba(255,255,255,0.15)" />

          {planes.map((d, i) => {
            const x = 8 + i * (barWidth + gap);
            const pct = Math.max(0, Math.min(100, d.plane.percentage));
            const barHeight = (pct / 100) * maxBarHeight;
            const y = baselineY - barHeight;
            return (
              <g key={d.key}>
                <rect x={x} y={baselineY - maxBarHeight} width={barWidth} height={maxBarHeight} rx={6} fill="rgba(255,255,255,0.02)" />
                <motion.rect
                  x={x}
                  width={barWidth}
                  rx={6}
                  fill={d.color}
                  fillOpacity={0.85}
                  initial={{ height: 0, y: baselineY }}
                  animate={{ height: barHeight, y }}
                  transition={{ duration: 0.7, delay: i * 0.08, ease: [0.23, 1, 0.32, 1] }}
                />
                <text x={x + barWidth / 2} y={y - 6} textAnchor="middle" fontSize="9" fontWeight={700} fill={d.color} className="font-cinzel">
                  {pct}%
                </text>
                <text x={x + barWidth / 2} y={baselineY + 13} textAnchor="middle" fontSize="8" letterSpacing="0.05em" fill="rgba(203,213,225,0.65)" className="font-cinzel uppercase">
                  {d.label}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Level scale legend — shows where each plane's percentage sits along Deficient→Overwhelming */}
      <div className="mt-3 space-y-1.5">
        {planes.map((d) => {
          const levelIndex = LEVEL_ORDER.indexOf(d.plane.level);
          return (
            <div key={`${d.key}-scale`} className="flex items-center gap-2">
              <span className="w-12 shrink-0 text-[0.7rem] font-cinzel uppercase tracking-wide" style={{ color: d.color }}>{d.label}</span>
              <div className="relative flex-1 h-1.5 rounded-full overflow-hidden bg-white/5">
                <motion.div
                  className="absolute inset-y-0 left-0 rounded-full"
                  style={{ background: d.color }}
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.max(0, Math.min(100, d.plane.percentage))}%` }}
                  transition={{ duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
                />
                {/* Tick marks separating the five qualitative levels */}
                {[10, 30, 60, 80].map((t) => (
                  <div key={t} className="absolute inset-y-0" style={{ left: `${t}%`, width: 1, background: 'rgba(4,0,26,0.5)' }} />
                ))}
              </div>
              <span className="w-16 shrink-0 text-[0.7rem] text-slate-500 text-right">{LEVEL_ORDER[levelIndex]}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
