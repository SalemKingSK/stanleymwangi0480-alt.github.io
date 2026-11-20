
'use client';

import React, { useEffect, useRef, useState } from 'react';
import { PERSONAL_YEARS, CAT_META, RELATIONS, ANIMALS } from '@/lib/cosmic-fate/constants';

interface Props {
  day: number;
  month: number;
  year: number;
  birthSign: string;
}

export const PersonalYearWave: React.FC<Props> = ({ day, month, year, birthSign }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [tooltip, setTip] = useState<{show: boolean, x: number, y: number, text: string, col: string} | null>(null);
  
  const red = (n: number): number => {
    let s = n;
    while (s > 9) s = String(s).split('').reduce((a, b) => a + parseInt(b), 0);
    return s || 9;
  };

  const getPY = (y: number) => red(red(day) + red(month) + red(y));
  const getSign = (y: number) => ANIMALS[((y - 1900) % 12 + 12) % 12];
  const getRel = (ysName: string) => {
    const r = RELATIONS[birthSign];
    if (ysName === r.clash) return 'clash';
    if (ysName === r.harm) return 'harm';
    if (ysName === r.destroy) return 'destroy';
    if (ysName === r.self) return 'self';
    if (r.sanhe.includes(ysName)) return 'sanhe';
    if (ysName === r.liuhe) return 'liuhe';
    return 'neutral';
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const W = canvas.width = canvas.offsetWidth;
    const H = canvas.height = 250;
    const PAD = { t: 25, r: 20, b: 40, l: 40 };
    const gW = W - PAD.l - PAD.r;
    const gH = H - PAD.t - PAD.b;

    const curYear = new Date().getFullYear();
    const range = 20;
    const yrs: number[] = [];
    const pvs: number[] = [];
    const rts: string[] = [];

    for (let i = 0; i < range; i++) {
      const y = curYear + i;
      yrs.push(y);
      pvs.push(getPY(y));
      rts.push(getRel(getSign(y).n));
    }

    const xS = (i: number) => PAD.l + (i / (yrs.length - 1)) * gW;
    const yS = (v: number) => PAD.t + gH - ((v - 1) / 8) * gH;

    ctx.clearRect(0, 0, W, H);
    
    // Draw Trough Zones
    const sw2 = gW / yrs.length;
    yrs.forEach((_, i) => {
      if (pvs[i] === 4 || pvs[i] === 7) {
        ctx.fillStyle = 'rgba(224, 64, 251, 0.05)';
        ctx.fillRect(xS(i) - sw2 / 2, PAD.t, sw2, gH);
      }
    });

    // Draw Grid Lines
    ctx.setLineDash([3, 4]);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.beginPath();
    ctx.moveTo(xS(0), PAD.t); ctx.lineTo(xS(0), PAD.t + gH);
    ctx.stroke();
    ctx.setLineDash([]);

    for (let v = 1; v <= 9; v++) {
      const yy = yS(v);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
      ctx.beginPath(); ctx.moveTo(PAD.l, yy); ctx.lineTo(PAD.l + gW, yy); ctx.stroke();
      ctx.fillStyle = 'rgba(107, 114, 128, 0.6)';
      ctx.font = 'bold 10px sans-serif';
      ctx.textAlign = 'right';
      ctx.fillText(v.toString(), PAD.l - 8, yy + 3);
    }

    // Draw Curve
    const gr = ctx.createLinearGradient(0, PAD.t, 0, PAD.t + gH);
    gr.addColorStop(0, 'rgba(224, 64, 251, 0.2)');
    gr.addColorStop(1, 'rgba(224, 64, 251, 0)');
    ctx.beginPath();
    yrs.forEach((_, i) => {
      if (i === 0) ctx.moveTo(xS(i), yS(pvs[i]));
      else ctx.lineTo(xS(i), yS(pvs[i]));
    });
    ctx.lineTo(xS(yrs.length - 1), PAD.t + gH);
    ctx.lineTo(xS(0), PAD.t + gH);
    ctx.fillStyle = gr;
    ctx.fill();

    ctx.beginPath();
    ctx.strokeStyle = '#e040fb';
    ctx.lineWidth = 2;
    yrs.forEach((_, i) => {
      if (i === 0) ctx.moveTo(xS(i), yS(pvs[i]));
      else ctx.lineTo(xS(i), yS(pvs[i]));
    });
    ctx.stroke();

    // Draw Points
    const getDotCol = (rt: string) => {
      const meta = CAT_META[rt];
      return meta?.col || '#a064c8';
    };

    yrs.forEach((_, i) => {
      const x = xS(i), y = yS(pvs[i]);
      const isT = pvs[i] === 4 || pvs[i] === 7;
      ctx.beginPath();
      ctx.arc(x, y, isT ? 5 : 3.5, 0, Math.PI * 2);
      ctx.fillStyle = getDotCol(rts[i]);
      ctx.fill();
      ctx.strokeStyle = '#0c0c15';
      ctx.lineWidth = 1.5;
      ctx.stroke();
    });

    // Draw Years Axis
    ctx.fillStyle = 'rgba(107, 114, 128, 0.8)';
    ctx.textAlign = 'center';
    yrs.forEach((y, i) => {
      if (i % 3 === 0) ctx.fillText(y.toString(), xS(i), H - 10);
    });

  }, [day, month, year, birthSign]);

  return (
    <div className="gwrap bg-black/20 p-4 rounded-xl border border-white/5 overflow-hidden">
      <div className="flex justify-between items-end mb-4">
        <div>
          <h4 className="text-primary font-bold text-lg">Personal Year Wave</h4>
          <p className="text-xs text-white/40 italic">9-Year cycles combined with Celestial Bonds</p>
        </div>
      </div>
      <canvas ref={canvasRef} className="w-full h-[250px]" />
    </div>
  );
};
