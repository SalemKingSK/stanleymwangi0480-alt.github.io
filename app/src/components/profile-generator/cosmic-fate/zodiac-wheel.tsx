
'use client';

import React from 'react';
import { ANIMALS, RELATIONS } from '@/lib/cosmic-fate/constants';

interface Props {
  birthSign: string;
}

export const ZodiacWheel: React.FC<Props> = ({ birthSign }) => {
  const cx = 190;
  const cy = 190;
  const RO = 175;
  const RI = 80;
  const off = -Math.PI / 2;
  const rel = RELATIONS[birthSign];

  const getFillColor = (animalName: string) => {
    if (animalName === birthSign) return 'rgba(251,191,36,.28)';
    if (animalName === rel.clash) return 'rgba(248,113,113,.22)';
    if (animalName === rel.harm) return 'rgba(251,191,36,.16)';
    if (animalName === rel.destroy) return 'rgba(167,139,250,.2)';
    if (rel.sanhe.includes(animalName)) return 'rgba(52,211,153,.2)';
    if (animalName === rel.liuhe) return 'rgba(224,64,251,.22)';
    return 'rgba(24,22,34,.8)';
  };

  const getStrokeColor = (animalName: string) => {
    if (animalName === birthSign) return '#fbbf24';
    if (animalName === rel.clash) return '#f87171';
    if (animalName === rel.harm) return 'rgba(251,191,36,.65)';
    if (animalName === rel.destroy) return 'rgba(167,139,250,.65)';
    if (rel.sanhe.includes(animalName)) return 'rgba(52,211,153,.65)';
    if (animalName === rel.liuhe) return 'rgba(224,64,251,.75)';
    return 'rgba(255,255,255,.04)';
  };

  const currentAnimal = ANIMALS.find(a => a.n === birthSign);

  return (
    <div className="card p-4 relative bg-black/40 rounded-2xl border border-white/10">
      <svg viewBox="0 0 380 380" className="w-full max-w-[380px] mx-auto block">
        <circle cx={cx} cy={cy} r={RO + 8} fill="none" stroke="rgba(255,255,255,.02)" strokeWidth="1" />
        {ANIMALS.map((a, i) => {
          const a1 = off + (i / 12) * 2 * Math.PI;
          const a2 = off + ((i + 1) / 12) * 2 * Math.PI;
          const am = (a1 + a2) / 2;
          const mr = (RO + RI) / 2;
          const tx = cx + mr * Math.cos(am);
          const ty = cy + mr * Math.sin(am);

          const pth = `M${cx + RI * Math.cos(a1)},${cy + RI * Math.sin(a1)} L${cx + RO * Math.cos(a1)},${cy + RO * Math.sin(a1)} A${RO},${RO} 0 0,1 ${cx + RO * Math.cos(a2)},${cy + RO * Math.sin(a2)} L${cx + RI * Math.cos(a2)},${cy + RI * Math.sin(a2)} A${RI},${RI} 0 0,0 ${cx + RI * Math.cos(a1)},${cy + RI * Math.sin(a1)}Z`;

          return (
            <React.Fragment key={a.n}>
              <path d={pth} fill={getFillColor(a.n)} stroke={getStrokeColor(a.n)} strokeWidth={a.n === birthSign ? 2 : 0.6} />
              <text x={tx} y={ty} textAnchor="middle" dominantBaseline="middle" fontSize={a.n === birthSign ? 19 : 14} fill={a.n === birthSign ? '#fbbf24' : 'rgba(255,255,255,.5)'}>
                {a.e}
              </text>
            </React.Fragment>
          );
        })}
        <circle cx={cx} cy={cy} r={RI - 2} fill="#0c0c15" stroke="rgba(251,191,36,0.38)" strokeWidth="1.5" />
        <text x={cx} y={cy - 14} textAnchor="middle" fontSize="24" fill="#fbbf24">{currentAnimal?.e}</text>
        <text x={cx} y={cy + 8} textAnchor="middle" className="font-bold uppercase tracking-wider" fontSize="10" fill="#fbbf24">{birthSign}</text>
        <text x={cx} y={cy + 23} textAnchor="middle" fontSize="9" fill="rgba(107,114,128,1)">{currentAnimal?.el} · {currentAnimal?.pl}</text>
      </svg>
      <p className="text-center text-[11px] text-muted-foreground mt-4 space-x-2">
        <span>Your sign · <span style={{color: '#fbbf24'}}>Gold</span></span>
        <span>Clash · <span style={{color: '#f87171'}}>Red</span></span>
        <span>Harm · <span style={{color: '#fbbf24'}}>Amber</span></span>
        <span>Destroy · <span style={{color: '#a78bfa'}}>Violet</span></span>
        <span>San He · <span style={{color: '#34d399'}}>Green</span></span>
        <span>Liu He · <span style={{color: '#e040fb'}}>Magenta</span></span>
      </p>
    </div>
  );
};
