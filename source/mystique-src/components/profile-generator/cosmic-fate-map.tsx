import React, { useState, useMemo } from 'react';
import { ZOO } from '@/lib/cosmic-fate/zoo';
import { YD, yearDiveOracle } from '@/lib/cosmic-fate/oracle';
import { CONVERGENCE_CARDS } from '@/lib/cosmic-fate/convergence';
import { PINNACLE_DESC, CHALLENGE_DESC } from '@/lib/cosmic-fate/pinnacles';
import { INTERSECTION_SYNTHESIS } from '@/lib/cosmic-fate/intersections';
import { CHINESE_CALENDAR } from '@/lib/new-astrology/chinese-calendar';
import { BOOK } from '@/lib/cosmic-fate/book';
import { ANIMALS, RELATIONS } from '@/lib/cosmic-fate/constants';
import { CosmicRiskScanner } from './cosmic-risk-scanner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Badge }    from '@/components/ui/badge';
import { Card }     from '@/components/ui/card';
import { Input }    from '@/components/ui/input';
import { Button }   from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { CalendarDays, Star, Compass, Activity, ShieldAlert, Telescope, BookOpen, Zap, RotateCcw } from 'lucide-react';
import { AccordionContentWithPlayer } from './accordion-content-with-player';

interface Props {
birthDay: number;
birthMonth: number;
birthYear: number;
}

const reduce = (n: number): number => {
let s = Math.abs(n);
while (s > 9) { s = String(s).split('').reduce((a, c) => a + (+c), 0); }
return s;
};

// Pinnacle-only reducer — preserves Master Numbers 11, 22, 33
const reduceMN = (n: number): number => {
let s = Math.abs(n);
while (s > 9 && s !== 11 && s !== 22 && s !== 33) {
s = String(s).split('').reduce((a, c) => a + (+c), 0);
}
return s;
};

const lpName = (n: number) => ['', 'The Initiator', 'The Cooperative', 'The Creative', 'The Builder', 'The Freedom Seeker', 'The Harmonizer', 'The Seeker', 'The Achiever', 'The Humanitarian'][n] || '';

// Challenge-specific name — index 0 = "No Challenge" (valid output when both components are equal)
const challengeName = (n: number) => ['No Challenge', 'The Initiator', 'The Cooperative', 'The Creative', 'The Builder', 'The Freedom Seeker', 'The Harmonizer', 'The Seeker', 'The Achiever', 'The Humanitarian'][n] ?? '';

const getAnimalForDate = (d: number, m: number, y: number) => {
const date = new Date(y, m - 1, d);
date.setHours(0, 0, 0, 0);

const entry = CHINESE_CALENDAR.find(e => {
const s = new Date(e.start);
const end = new Date(e.end);
s.setHours(0, 0, 0, 0);
end.setHours(0, 0, 0, 0);
return date >= s && date <= end;
});

if (entry) {
const parts = entry.title.split(' ');
return parts[parts.length - 1]; 
}

const signs = ["Rat", "Ox", "Tiger", "Rabbit", "Dragon", "Snake", "Horse", "Goat", "Monkey", "Rooster", "Dog", "Pig"];
return signs[((y - 1900) % 12 + 12) % 12];
};

const getCategory = (birthSign: string, yearSign: string) => {
if (birthSign === yearSign) return 'ben';

const clashes = [
['Rat', 'Horse'], ['Ox', 'Goat'], ['Tiger', 'Monkey'],
['Rabbit', 'Rooster'], ['Dragon', 'Dog'], ['Snake', 'Pig']
];
if (clashes.some(p => (p[0] === birthSign && p[1] === yearSign) || (p[1] === birthSign && p[0] === yearSign))) return 'clash';

const harms = [
['Rat', 'Goat'], ['Ox', 'Horse'], ['Tiger', 'Snake'],
['Rabbit', 'Dragon'], ['Monkey', 'Pig'], ['Rooster', 'Dog']
];
if (harms.some(p => (p[0] === birthSign && p[1] === yearSign) || (p[1] === birthSign && p[0] === yearSign))) return 'harm';

const destructions = [
['Rat', 'Rooster'], ['Ox', 'Dragon'], ['Tiger', 'Pig'],
['Rabbit', 'Horse'], ['Goat', 'Dog'], ['Monkey', 'Snake']
];
if (destructions.some(p => (p[0] === birthSign && p[1] === yearSign) || (p[1] === birthSign && p[0] === yearSign))) return 'destruction';

const sanHe = [
['Tiger', 'Horse', 'Dog'], ['Monkey', 'Rat', 'Dragon'],
['Pig', 'Rabbit', 'Goat'], ['Snake', 'Rooster', 'Ox']
];
if (sanHe.some(triad => triad.includes(birthSign) && triad.includes(yearSign))) return 'alliance';

const liuHe = [
['Rat', 'Ox'], ['Tiger', 'Pig'], ['Rabbit', 'Dog'],
['Dragon', 'Rooster'], ['Snake', 'Monkey'], ['Horse', 'Goat']
];
if (liuHe.some(p => (p[0] === birthSign && p[1] === yearSign) || (p[1] === birthSign && p[0] === yearSign))) return 'alliance';

return 'neutral';
};

const catLabel = (c: string) => ({ 
'ben': 'BEN MING NIAN', 'clash': 'DIRECT CLASH', 'harm': 'HARM YEAR', 
'destruction': 'DESTRUCTION YEAR', 'alliance': 'ALLIANCE YEAR', 'neutral': 'NEUTRAL YEAR' 
}[c] || 'NEUTRAL YEAR');

const getStatusLabelShort = (c: string) => ({ 
'ben': 'BEN MING', 'clash': 'CLASH', 'harm': 'HARM', 
'destruction': 'DESTRUCTION', 'alliance': 'ALLIANCE', 'neutral': 'NEUTRAL' 
}[c] || 'NEUTRAL');

const pyColors: Record<number, string> = {
1: "#e8b830", 2: "#98b4de", 3: "#68c268", 4: "#c86040", 5: "#dca030", 6: "#de78a0", 7: "#8870c8", 8: "#a8b5cc", 9: "#c84848"
};

const stripHtml = (html: string) => {
return html.replace(/<[^>]*>?/gm, '').replace(/&nbsp;/g, ' ');
};

export function CosmicFateMap({ birthDay, birthMonth, birthYear }: Props) {
const [activeTab, setActiveTab] = useState('synthesis');
const [readYear, setReadYear] = useState(new Date().getFullYear());
const [inputYear, setInputYear] = useState(new Date().getFullYear().toString());
const [selectedZodiacYear, setSelectedZodiacYear] = useState<any>(null);
const [diveSubTab, setDiveSubTab] = useState('ov');

const pmNames = ['', 'Initiation', 'Partnership', 'Creativity', 'Foundation', 'Freedom', 'Harmony', 'Retreat', 'Power', 'Completion'];

// Calculate all core stats based on readYear and birth data
const stats = useMemo(() => {
const py = reduceMN(birthMonth + birthDay + String(readYear).split('').reduce((a,c)=>a+ +c,0));
const uy = reduce(readYear);
const lp = reduce(reduce(birthMonth) + reduce(birthDay) + reduce(birthYear));
const bv = reduce(birthDay);
const today = new Date();
const currentMonthIndex = today.getMonth() + 1;
const pm = reduce(py + currentMonthIndex);

const yTotalForPinnacles = String(birthYear).split('').reduce((a,c)=>a+ +c,0);
const p1 = reduceMN(birthMonth + birthDay);
const p2 = reduceMN(birthDay + yTotalForPinnacles);
const p3 = reduceMN(p1 + p2);
const p4 = reduceMN(birthMonth + yTotalForPinnacles);
const p1end = 36 - lp;
const p2end = p1end + 9;
const p3end = p2end + 9;
const age = readYear - birthYear;

let pNum, pStage;
if (age <= p1end) { pStage = 1; pNum = p1; }
else if (age <= p2end) { pStage = 2; pNum = p2; }
else if (age <= p3end) { pStage = 3; pNum = p3; }
else { pStage = 4; pNum = p4; }

// Challenge reducer: no || 9 fallback — 0 is a valid challenge (equal components)
// Also handles differences > 9 that arise when year is a master number (e.g. 22)
const reduceAbs = (n: number): number => {
let s = Math.abs(n);
while (s > 9) { s = String(s).split('').reduce((a, c) => a + (+c), 0); }
return s;
};
const cMonth = reduce(birthMonth);
const cDay   = reduce(birthDay);
const cYear  = reduceMN(birthYear); // preserve master-number years (e.g. 1993 → 22)
const c1 = reduceAbs(cMonth - cDay);
const c2 = reduceAbs(cDay   - cYear);
const c3 = reduceAbs(c1     - c2);   // valid result is 0 when c1 === c2
const c4 = reduceAbs(cMonth - cYear);
let cNum;
if (age <= p1end) cNum = c1;
else if (age <= p2end) cNum = c2;
else if (age <= p3end) cNum = c3;
else cNum = c4;

const birthSign = getAnimalForDate(birthDay, birthMonth, birthYear);
const yearAnimalName = getAnimalForDate(15, 6, readYear); 
const cat = getCategory(birthSign, yearAnimalName);

return { py, uy, lp, bv, pm, pNum, pStage, cNum, age, birthSign, yearAnimalName, cat, p1end, p2end, p3end, p1, p2, p3, p4, c1, c2, c3, c4 };
}, [birthDay, birthMonth, birthYear, readYear]);

// Derived lists moved to top level to follow Rules of Hooks
const intersectionsList = useMemo(() => {
const list = [];
for (let y = readYear; y <= readYear + 30; y++) {
const pyn = reduceMN(birthMonth + birthDay + String(y).split('').reduce((a,c)=>a+ +c,0));
if (pyn === 4 || pyn === 7) {
const yearAni = getAnimalForDate(15, 6, y);
const iCat = getCategory(stats.birthSign, yearAni);
const isNegative = iCat === 'clash' || iCat === 'harm' || iCat === 'destruction' || iCat === 'ben';
const synKey = `${pyn}_${iCat}`;
const synth = INTERSECTION_SYNTHESIS[synKey] || INTERSECTION_SYNTHESIS[`${pyn}_neutral`].replace('Neutral', yearAni + ' Neutral');
const dyn = ZOO[stats.birthSign][`${iCat}Desc`] || ZOO[stats.birthSign][`${iCat === 'destruction' ? 'destruction' : iCat}Desc`] || `Personal Year ${pyn}'s discipline proceeds in a ${yearAni} Neutral year — neither amplified by alliance support nor undermined by conflict energy.`;
list.push({ y, pyn, yearAni, iCat, isNegative, synth, dyn });
}
}
return list;
}, [stats.birthSign, birthDay, birthMonth, readYear]);

const zodiacList = useMemo(() => {
const list = [];
for (let y = readYear; y <= readYear + 11; y++) {
const yearAni = getAnimalForDate(15, 6, y);
const category = getCategory(stats.birthSign, yearAni);
const pyn = reduceMN(birthMonth + birthDay + String(y).split('').reduce((a,c)=>a+ +c,0));
const age = y - birthYear;

const isCritical = pyn === 4 || pyn === 7;
const isEnemy = category === 'clash' || category === 'harm' || category === 'destruction';
const isBen = category === 'ben';
const isAlliance = category === 'alliance';

let state = 5;
if (isEnemy && isCritical) state = 1;
else if (isBen && isCritical) state = 2;
else if (isCritical) state = 3;
else if (isAlliance) state = 4;

list.push({ y, yearAni, category, pyn, state, age });
}
return list;
}, [stats.birthSign, birthDay, birthMonth, birthYear, readYear]);

const oracleText = useMemo(() => {
const yr = yearDiveOracle(stats.py);
const lpRelationText = (stats.py === stats.lp) ? "exceptional harmony" : (Math.abs(stats.py - stats.lp) === 4 || Math.abs(stats.py - stats.lp) === 5) ? "notable friction" : "productive dialogue — neither in obvious tension nor exceptional harmony";
const lpInteractionText = (stats.py === stats.lp) ? "match" : (Math.abs(stats.py - stats.lp) === 4 || Math.abs(stats.py - stats.lp) === 5) ? "creates notable friction with" : "and";

return `In ${readYear}, you are in a Personal Year ${stats.py} — ${yr?.title}, riding the ${yr?.phase.toLowerCase()} phase of your nine-year cycle. The Universal Year ${stats.uy} (${yearDiveOracle(stats.uy)?.title}) sets the collective backdrop — the shared frequency every person on earth is navigating alongside their personal arc. Your current Personal Month is ${stats.pm} (${pmNames[stats.pm]}), offering a finer-grained window into this season's immediate texture. Your ${stats.birthSign} nature meets a ${stats.yearAnimalName} year (${catLabel(stats.cat)}) — a ${stats.cat === 'neutral' ? 'neutral year where outcomes reflect pure personal effort rather than exceptional external forces' : catLabel(stats.cat).toLowerCase() + ' where trajectories are specifically influenced by Tai Sui energy'}. Your Life Path ${stats.lp} (${lpName(stats.lp)}) ${lpInteractionText} Personal Year ${stats.py} (${yr?.title}) are in ${lpRelationText} — allowing this year's work to proceed through genuine effort. Your active Pinnacle is ${stats.pNum} — the long-arc life theme operating beneath every annual cycle — while your active Challenge number ${stats.cNum} (${challengeName(stats.cNum)}) names the specific resistance pattern this life chapter asks you to develop through. Taken together, these layers describe not one story but several simultaneous ones: the year's momentum, the month's focus, the decade's theme, and the lifetime's direction — all converging in ${readYear}.`;
}, [stats, readYear]);

const handleCastMap = () => {
const y = parseInt(inputYear);
if (!isNaN(y)) setReadYear(y);
};

const handleKeyDown = (e: React.KeyboardEvent) => {
if (e.key === 'Enter') handleCastMap();
};

const renderSynthesis = () => {
const yr = yearDiveOracle(stats.py);
return (
<div key={readYear} className="space-y-6 relative z-10 animate-in fade-in duration-500 dash-panel active">
<div className="core-strip">
<div className="core-chip hl-py">
<div className="core-chip-label">Personal Year {readYear}</div>
<div className="core-chip-num">{stats.py}</div>
<div className="core-chip-name">{yr?.title}</div>
</div>
<div className="core-chip">
<div className="core-chip-label">Life Path</div>
<div className="core-chip-num" style={{ color: 'var(--cf-jade-bright)' }}>{stats.lp}</div>
<div className="core-chip-name">{lpName(stats.lp)}</div>
</div>
<div className="core-chip">
<div className="core-chip-label">Universal Year</div>
<div className="core-chip-num" style={{ color: 'var(--cf-amethyst)' }}>{stats.uy}</div>
<div className="core-chip-name">{yearDiveOracle(stats.uy)?.title}</div>
</div>
<div className="core-chip">
<div className="core-chip-label">Birth Vibration</div>
<div className="core-chip-num" style={{ color: '#de78a0' }}>{stats.bv}</div>
<div className="core-chip-name">{lpName(stats.bv)}</div>
</div>
</div>

<Card className="p-6 bg-slate-900/60 border-primary/20">
<div className="section-header">✦ &nbsp; Your {readYear} Reading &nbsp; ✦</div>
<AccordionContentWithPlayer text={oracleText} />
</Card>
</div>
);
};

const renderDive = () => {
const yr = yearDiveOracle(stats.py);
return (
<div key={readYear} className="year-deep-dive animate-in fade-in duration-500 relative z-10 dash-panel active">
<div className="year-dive-header">
<div className="year-num-big" style={{ color: 'var(--cf-gold)' }}>{stats.py}</div>
<div className="year-dive-title">{yr?.title}</div>
<div className="year-dive-sub">{yr?.phase}</div>
</div>
<div className="tab-nav">
{['ov', 'es', 'py', 've', 'ch', 'ca', 'pr'].map(id => (
<button key={id} onClick={() => setDiveSubTab(id)} className={`tab-btn ${diveSubTab === id ? 'active' : ''}`}>
{id === 'ov' ? 'Overview' : id === 'es' ? 'Esoteric' : id === 'py' ? 'Pythagorean' : id === 've' ? 'Vedic' : id === 'ch' ? 'Chinese' : id === 'ca' ? 'Chaldean' : 'Practices'}
</button>
))}
</div>
<div className="p-4 min-h-[300px]">
{diveSubTab === 'pr' ? (
<div className="practice-grid grid grid-cols-1 sm:grid-cols-2 gap-4">
{yr?.pr?.map((p: any, idx: number) => (
<div key={idx} className="pi p-4 rounded-xl bg-black/40 border border-white/5">
<div className="pi-icon text-xl mb-2">{p.i}</div>
<div className="pi-name font-cinzel text-[10px] font-black uppercase text-primary/80 mb-1">{p.n}</div>
<div className="pi-desc text-xs text-slate-400">{p.d}</div>
</div>
))}
</div>
) : (
<AccordionContentWithPlayer text={
diveSubTab === 'ov' ? yr?.overview :
diveSubTab === 'es' ? yr?.esoteric :
diveSubTab === 'py' ? yr?.pyth :
diveSubTab === 've' ? yr?.vedic :
diveSubTab === 'ch' ? yr?.chinese :
yr?.chald
} />
)}
</div>
</div>
);
};

const renderIntersections = () => (
<div key={readYear} className="space-y-6 animate-in fade-in duration-500 relative z-10 dash-panel active">
<div className="section-header">🔥 &nbsp; Critical Year Intersections &nbsp; 🔥</div>
<div className="space-y-4 px-2">
{intersectionsList.map(i => (
<Card key={i.y} className="intersection-card p-5 border-rose-500/20 bg-rose-950/5">
<div className="flex justify-between items-start border-b border-rose-500/10 pb-3 mb-4">
<div>
<div className="text-2xl font-serif font-bold text-rose-400">{i.y}</div>
<div className="text-xs font-bold text-white">PY {i.pyn} · {i.yearAni} Year {ZOO[i.yearAni].e}</div>
</div>
{i.isNegative && <Badge className="bg-rose-500 text-[8px] px-2 py-0">HIGH TENSION</Badge>}
</div>
<div className="space-y-4">
<AccordionContentWithPlayer text={`${i.synth}\n\nSpecific dynamics: ${i.dyn}`} />
</div>
</Card>
))}
</div>
</div>
);

const renderZodiacCard = (item: any) => {
const { y, yearAni, category, pyn, state, age } = item;
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
badge = `⚠️ PY${pyn} + ${statusTag}`;
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
key={y} 
style={cardStyles}
className="flex flex-col items-center justify-center p-6 rounded-2xl text-center transition-all hover:scale-[1.02] cursor-pointer"
onClick={() => setSelectedZodiacYear(item)}
>
<div className="text-4xl mb-3">{ya.e}</div>
<div className="text-[13px] font-bold text-white mb-1 font-cinzel">{y}</div>
<div className="text-[18px] font-black font-decorative" style={{ color: pyColor }}>PY {pyn}</div>
<div className="text-[10px] font-black uppercase tracking-tighter font-cinzel" style={{ color: statusColor }}>{statusTag} YEAR</div>
<div className="text-[10px] text-muted-foreground mt-1 font-cinzel">Age {age}</div>
{badge && (
<div 
className={`mt-3 px-3 py-1 rounded-full text-[9px] font-black uppercase border ${
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

const renderZodiac = () => {
const bz = ZOO[stats.birthSign];
const az = ANIMALS.find(a => a.n === stats.birthSign);

return (
<div key={readYear} className="space-y-8 py-4 animate-in fade-in duration-500 relative z-10 dash-panel active">
<div className="text-center px-4">
<div className="flex items-center justify-center gap-4 mb-6">
<span className="text-2xl">{bz.e}</span>
<h2 className="text-xl font-bold tracking-[0.3em] uppercase text-primary font-cinzel">Your Chinese Zodiac — {stats.birthSign}</h2>
<span className="text-2xl">{bz.e}</span>
</div>

<div className="cp text-lg leading-relaxed text-slate-300 max-w-2xl mx-auto mb-8 font-body text-center">
<AccordionContentWithPlayer text={`Born in a ${stats.birthSign} year — ${bz.el} element, ${bz.pol} polarity, Branch ${az?.br || bz.br}. Your characteristic nature: ${bz.trait}. Your health domains: ${bz.organ}. Your cardinal direction: ${bz.dir}. Below are your next 12 years mapped through Tai Sui astrology — click any year for detailed analysis.`} />
</div>

<div className="flex flex-col items-center gap-3 mb-6">
<div className="flex flex-wrap justify-center gap-3">
<div className="px-3 py-1.5 rounded-lg border border-rose-500/50 bg-rose-500/10 text-[10px] font-black uppercase text-rose-400 font-cinzel">
⚠️ ENEMY × PY 4 OR 7
</div>
<div className="px-3 py-1.5 rounded-lg border border-yellow-500/50 bg-yellow-500/10 text-[10px] font-black uppercase text-yellow-400 font-cinzel">
⭐ BEN MING + PY 4/7
</div>
</div>
<div className="flex flex-wrap justify-center gap-3">
<div className="px-3 py-1.5 rounded-lg border border-indigo-500/50 bg-indigo-500/10 text-[10px] font-black uppercase text-indigo-400 font-cinzel">
◈ CRITICAL PY ONLY
</div>
<div className="px-3 py-1.5 rounded-lg border border-primary/30 bg-primary/5 text-[10px] font-black uppercase text-primary/70 font-cinzel">
PY # Legend
</div>
</div>
</div>
</div>

<div className="zodiac-grid grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 px-2">
{zodiacList.map(renderZodiacCard)}
</div>
</div>
);
};

const renderPinnacles = () => {
const pStages = [
{ n: 1, p: stats.p1, c: stats.c1, label: `Birth - Age ${stats.p1end}`, active: stats.age <= stats.p1end },
{ n: 2, p: stats.p2, c: stats.c2, label: `Age ${stats.p1end+1} - ${stats.p2end}`, active: stats.age > stats.p1end && stats.age <= stats.p2end },
{ n: 3, p: stats.p3, c: stats.c3, label: `Age ${stats.p2end+1} - ${stats.p3end}`, active: stats.age > stats.p2end && stats.age <= stats.p3end },
{ n: 4, p: stats.p4, c: stats.c4, label: `Age ${stats.p3end+1}+`, active: stats.age > stats.p3end }
];

return (
<div key={readYear} className="space-y-6 animate-in fade-in duration-500 relative z-10 dash-panel active">
<div className="section-header">◈ &nbsp; Pinnacles & Challenges &nbsp; ◈</div>
<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
{pStages.map(s => (
<Card key={s.n} className={`p-5 border rounded-2xl ${s.active ? 'border-primary bg-primary/5 ring-1 ring-primary/20' : 'bg-slate-900/40 border-white/5'}`}>
<div className="flex justify-between items-center mb-4">
<div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{s.label}</div>
{s.active && <Badge className="bg-primary text-[8px] py-0 px-2">ACTIVE</Badge>}
</div>
<div className="flex gap-8 mb-4 justify-center">
<div className="text-center">
<div className="text-4xl font-serif font-bold text-emerald-400">{s.p}</div>
<div className="text-[8px] uppercase tracking-widest text-muted-foreground">Pinnacle</div>
</div>
<div className="text-center">
<div className="text-4xl font-serif font-bold text-rose-400">{s.c}</div>
<div className="text-[8px] uppercase tracking-widest text-muted-foreground">Challenge</div>
</div>
</div>
<div className="space-y-3">
<AccordionContentWithPlayer text={`${PINNACLE_DESC[Number(s.p)]}\n\nChallenge: ${CHALLENGE_DESC[Number(s.c)]}`} />
</div>
</Card>
))}
</div>
</div>
);
};

const renderEnemy = () => (
<div key={readYear} className="space-y-6 relative z-10 animate-in fade-in duration-500 dash-panel active">
<div className="section-header">⚠️ &nbsp; Enemy Year Dynamics &nbsp; ⚠️</div>
<div className="space-y-6">
{CONVERGENCE_CARDS.map(card => (
<Card key={card.year} className="p-6 bg-slate-950/60 border-primary/20">
<h3 className="text-xl font-cinzel text-primary mb-2">{card.title}</h3>
<p className="text-sm italic text-muted-foreground mb-4">{card.sub}</p>
<AccordionContentWithPlayer text={card.intro} />
<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
{card.chips.map((chip, idx) => (
<div key={idx} className="p-4 rounded-xl bg-black/40 border border-white/5">
<div className="text-[10px] font-black uppercase text-primary mb-2">{chip.t}</div>
<p className="text-xs text-slate-400 leading-relaxed">{chip.p}</p>
</div>
))}
</div>
<div className="mt-6 p-4 bg-rose-950/20 border border-rose-500/30 rounded-xl text-xs text-rose-300 italic">
<div dangerouslySetInnerHTML={{ __html: card.warning }} />
</div>
</Card>
))}
</div>
</div>
);

return (
<div className="cosmic-fate-root relative min-h-screen rounded-3xl overflow-hidden">
<div id="stars-cf"></div>
<div className="cf-page p-4">
<div className="cf-hero">
<span className="hero-glyph">🌌</span>
<h1>Cosmic Fate Map</h1>
<p className="hero-sub">Destiny Synthesis & Critical Year Oracle</p>
</div>

<Card className="calc-card p-6 bg-slate-950/80 mb-8 border-primary/30 shadow-2xl relative z-10">
<div className="flex flex-col sm:flex-row items-center justify-between gap-6">
<div className="flex items-center gap-4">
<div className="p-3 bg-primary/10 rounded-full border border-primary/20">
<CalendarDays className="h-6 w-6 text-primary" />
</div>
<div className="flex flex-col gap-1">
<label className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/60">Temporal Focus</label>
<div className="flex items-center gap-2">
<Input 
type="number"
value={inputYear}
onChange={(e) => setInputYear(e.target.value)}
onKeyDown={handleKeyDown}
className="w-24 h-9 bg-black/40 border-primary/20 text-white font-bold"
/>
<Button 
variant="outline" 
size="sm"
onClick={handleCastMap}
className="h-9 border-primary/20 text-[10px] uppercase font-bold text-primary/80 hover:bg-primary/10"
>
<Zap className="h-3 w-3 mr-2" /> Cast Map
</Button>
<Button 
variant="ghost" 
size="sm"
onClick={() => {
const now = new Date().getFullYear();
setReadYear(now);
setInputYear(now.toString());
}}
className="h-9 text-[10px] uppercase font-bold text-white/40 hover:bg-white/5"
>
Today
</Button>
</div>
</div>
</div>
</div>
</Card>

<nav className="dash-nav grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-1 mb-6 relative z-20">
{[
{ id: 'synthesis', label: '✦ Oracle', icon: <Star className="h-3 w-3" /> },
{ id: 'yeardive', label: '☽ Dive', icon: <Compass className="h-3 w-3" /> },
{ id: 'intersections', label: '🔥 Critical', icon: <Zap className="h-3 w-3" /> },
{ id: 'zodiac', label: '☯ Zodiac', icon: <BookOpen className="h-3 w-3" /> },
{ id: 'pinnacles', label: '◈ Pinnacle', icon: <Activity className="h-3 w-3" /> },
{ id: 'enemy', label: '⚠️ Enemy', icon: <ShieldAlert className="h-3 w-3" /> },
{ id: 'scanner', label: '🔭 Scan', icon: <Telescope className="h-3 w-3" /> },
].map(tab => (
<button 
key={tab.id}
onClick={() => setActiveTab(tab.id)}
className={`dash-tab flex items-center justify-center gap-2 ${activeTab === tab.id ? 'active' : ''}`}
>
{tab.icon} {tab.label}
</button>
))}
</nav>

<div className="dash-body p-6 min-h-[600px] relative z-10">
{activeTab === 'synthesis' && renderSynthesis()}
{activeTab === 'yeardive' && renderDive()}
{activeTab === 'intersections' && renderIntersections()}
{activeTab === 'zodiac' && renderZodiac()}
{activeTab === 'pinnacles' && renderPinnacles()}
{activeTab === 'enemy' && renderEnemy()}
{activeTab === 'scanner' && <CosmicRiskScanner targetYear={readYear} />}
</div>
</div>

<Dialog open={!!selectedZodiacYear} onOpenChange={() => setSelectedZodiacYear(null)}>
{selectedZodiacYear && (
<DialogContent className="max-w-2xl bg-slate-950 border-primary/20 text-white">
<DialogHeader>
<div className="text-6xl mb-4 block text-center">{ZOO[selectedZodiacYear.yearAni].e}</div>
<DialogTitle className="text-3xl font-bold text-primary text-center mb-2 font-cinzel">
{selectedZodiacYear.y}: {selectedZodiacYear.yearAni} Year
</DialogTitle>
<DialogDescription className="text-xs uppercase tracking-[0.3em] text-center opacity-60 mb-8 font-cinzel text-slate-400">
{stats.birthSign} × {selectedZodiacYear.yearAni} — {catLabel(selectedZodiacYear.category)}
</DialogDescription>
</DialogHeader>
<div className="space-y-6 max-h-[60vh] overflow-y-auto pr-4 scrollbar-thin">
<div className="p-4 bg-primary/5 border-l-[3px] border-primary rounded-r-lg font-body italic text-sm text-slate-300">
<AccordionContentWithPlayer text={`${selectedZodiacYear.y} (${selectedZodiacYear.yearAni} Year, Age ${selectedZodiacYear.age}) — Tai Sui: ${catLabel(selectedZodiacYear.category)}`} />
</div>

{(BOOK.categories as Record<string, string>)[selectedZodiacYear.category === 'destruction' ? 'destruction' : selectedZodiacYear.category] && (
<div className="p-4 bg-white/5 border-l-[3px] border-primary/40 rounded-r-lg font-body text-sm leading-relaxed text-slate-300">
<AccordionContentWithPlayer text={stripHtml((BOOK.categories as Record<string, string>)[selectedZodiacYear.category === 'destruction' ? 'destruction' : selectedZodiacYear.category])} />
</div>
)}

<div className="space-y-4">
<h4 className="font-cinzel text-xs uppercase tracking-widest opacity-60">Your {stats.birthSign.toUpperCase()} in {selectedZodiacYear.yearAni.toUpperCase()} Year</h4>
<div className="font-body text-base leading-relaxed text-slate-200">
<AccordionContentWithPlayer text={ZOO[stats.birthSign][`${selectedZodiacYear.category}Desc`] || ZOO[stats.birthSign][`${selectedZodiacYear.category === 'destruction' ? 'destruction' : selectedZodiacYear.category}Desc`] || `This ${selectedZodiacYear.y} ${selectedZodiacYear.yearAni} year is a Neutral period for ${stats.birthSign}.`} />
</div>
</div>
<div className="space-y-2">
<h4 className="font-cinzel text-xs uppercase tracking-widest opacity-60">{selectedZodiacYear.yearAni.toUpperCase()} Year Qualities</h4>
<div className="font-body text-sm text-slate-400">
<AccordionContentWithPlayer text={`${ZOO[selectedZodiacYear.yearAni].trait}. Health focus: ${ZOO[selectedZodiacYear.yearAni].organ}. Direction: ${ZOO[selectedZodiacYear.yearAni].dir}.`} />
</div>
</div>
</div>
</DialogContent>
)}
</Dialog>
</div>
);
}