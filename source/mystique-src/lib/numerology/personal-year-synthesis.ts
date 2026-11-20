/**
 * MYSTIQUE COMPASS — Dual Essence Narrative Engine (Rebuilt)
 *
 * Purpose: intermarriage of Direct Essence (surface journey) and
 * Classic Essence (destiny blueprint), verified by real lives who
 * lived the same arithmetic.
 *
 * Design constraints from the brief:
 * - simpler than the essences themselves, not more complex
 * - quotes specific lines from the Chaldean dictionary and shows them becoming literal
 * - every synthesis reads as if a single consultant wrote it — no mechanical wiring
 * - historical examples are banked offline and only shown when >80% similar
 * - nothing is claimed because “numbers say so” — it is claimed because the event record shows it
 */

import type { ChaldeanPYNCompound } from '@/lib/numerology/chaldean-pyn-compounds';
import { ESSENCE_QUOTES } from '@/lib/numerology/essence-quote-bank';
import { findVerifiedCasesForPair, type VerifiedPairCase } from '@/lib/numerology/verified-dual-cases';
import { PERSONAL_YEAR_PRECEDENTS, type Precedent } from '@/lib/numerology/personal-year-precedents';
import { famousBirthdays } from '@/lib/famous-birthdays';

// ─── Public types (kept compatible with existing callers) ──────────────────

export interface PersonalYearDualEssenceSynthesis {
  title: string;
  subtitle: string;
  synthesisText: string;
  directEssenceRole: string;
  classicEssenceRole: string;
  ageModifier: string;
  masterNumberSignal: string | null;
  karmicDebtSignal: string | null;
  historicalCalibration: string;
  /** Both essences fused into one reading, grounded in dated real-life precedents. */
  wovenSynthesis: string;
  predictionFocusAreas: string[];
  protectiveActions: string[];
  domains: string[];
  polarity: 'predominantly constructive' | 'predominantly cautionary' | 'mixed ordeal-and-reward' | 'threshold / transition';
  intensityScore: number;
}

interface BuildArgs {
  birthDay: number;
  birthMonth: number;
  birthYear?: number;
  targetYear: number;
  directRaw: number;
  directYear: number;
  directCompound: ChaldeanPYNCompound | null;
  classicRaw: number;
  classicYear: number;
  classicCompound: ChaldeanPYNCompound | null;
  occupation?: string;
  wealthProfile?: 'low' | 'modest' | 'comfortable' | 'wealthy' | 'institutional';
  relationshipStatus?: 'single' | 'partnered' | 'married' | 'separated' | 'widowed' | 'divorced' | 'unknown';
  visibility?: 'private' | 'local' | 'public' | 'global';
}

// Legacy type kept so historical-bank imports don't break — the new engine
// does not rely on the forensic library's HistoricalCase shape.
export interface HistoricalCase {
  id: string;
  person: string;
  year: number;
  age: number;
  occupation: string;
  wealth: string;
  relationshipStatus: string;
  visibility: string;
  eventCategory: string;
  eventDate?: string;
  eventDetails?: string;
  sources?: string[];
  direct: number;
  classic: number;
  directReduced: number;
  classicReduced: number;
  domains: Record<string, number>;
  eventIntensity: number;
  outcome: string;
  narrative: string;
  falsePositives: string[];
  decisions: string[];
  personalityShift: string;
  protectiveLesson: string;
  surfaceEvidence?: string;
  blueprintEvidence?: string;
  evidenceQuality?: string;
  evidenceReviewedOn?: string;
  birthDateSource?: string;
}

// ─── helpers ──────────────────────────────────────────────────────────────────

function label(raw: number, reduced: number, compound: ChaldeanPYNCompound | null): string {
  return compound ? `${raw}/${reduced} — ${compound.name}` : `${raw}/${reduced}`;
}

function quoteFor(raw: number) {
  return ESSENCE_QUOTES[raw] ?? null;
}

function ageBand(age: number | null): { label: string; note: string } {
  if (age === null || Number.isNaN(age)) return { label: 'age — not supplied', note: 'No birth year was given, so the reading stays with the compounds themselves. Age would tilt the emphasis between launch, consolidation, or legacy.' };
  if (age < 20) return { label: `age ${age} · formation`, note: `At ${age}, this pair tends to show up through school, family, first opportunities, and the institutions around you — not yet as fully public destiny.` };
  if (age <= 34) return { label: `age ${age} · first proof`, note: `At ${age}, the same compounds test first major proof: a career ignition, a move, a relationship turn, or the decision that separates you from a former self.` };
  if (age <= 54) return { label: `age ${age} · consolidation`, note: `At ${age}, the year tests what you've already built — work, money, home, reputation, and stamina. The compound's warning and promise both become more literal.` };
  return { label: `age ${age} · legacy & reckoning`, note: `At ${age}, law, health, succession, and the verdict of history weigh more. Warning lines should be read operationally, not fatalistically.` };
}

function polarityOf(dQ: ReturnType<typeof quoteFor>, cQ: ReturnType<typeof quoteFor>, dRaw: number, cRaw: number): PersonalYearDualEssenceSynthesis['polarity'] {
  const cautionSet = new Set([13,14,16,18,26,28,29,35,38,43,47,51]);
  const ctorSet = new Set([10,19,21,23,27,32,33,37]);
  const dCaution = cautionSet.has(dRaw);
  const cCaution = cautionSet.has(cRaw);
  const dCtor = ctorSet.has(dRaw);
  const cCtor = ctorSet.has(cRaw);
  if (dCaution && cCaution) return 'predominantly cautionary';
  if (dCtor && cCtor) return 'predominantly constructive';
  if ((dCaution && cCtor) || (dCtor && cCaution)) return 'mixed ordeal-and-reward';
  if ([13,16,20,30].includes(dRaw) || [13,16,20,30].includes(cRaw)) return 'threshold / transition';
  return 'mixed ordeal-and-reward';
}

/** Polarity the engine assigns to a Direct × Classic pair. Exported so the
 *  accuracy harness can score it against documented outcomes. */
export function pairPolarity(dRaw: number, cRaw: number): PersonalYearDualEssenceSynthesis['polarity'] {
  return polarityOf(quoteFor(dRaw), quoteFor(cRaw), dRaw, cRaw);
}

function intensityScoreSimple(dRaw: number, cRaw: number, pairIsExact: boolean, age: number | null): number {
  let base = 62;
  if (pairIsExact) base += 12;
  if ([28,55,16,18,38].includes(dRaw)) base += 10;
  if ([19,17,21,37].includes(cRaw)) base += 8;
  if (age !== null && age >= 55) base += 6;
  if (age !== null && age >= 72) base += 4;
  return Math.min(96, Math.max(48, base + (dRaw % 7) - (cRaw % 5)));
}

// ─── Pair narratives — human-written bridges for the most illustrative pairs ──

interface PairBridge {
  title: string;
  merge: (dLabel: string, cLabel: string, dQ: ReturnType<typeof quoteFor>, cQ: ReturnType<typeof quoteFor>, year: number) => string;
  protective: string[];
  focus: string[];
}

const PAIR_BRIDGES: Record<string, PairBridge> = {
  // The user's canonical example — written to match the brief's voice exactly.
  '28-19': {
    title: 'Contested Ascension — promise put on trial, then crowned disproportionately',
    merge: (dLabel, cLabel) => `If you only read ${dLabel}, 2024 looks like endurance. If you only read ${cLabel}, it looks like coronation. Together they are one story: promise that must survive its own testing before the crown can be trusted.

The year opens under 28/1's first sentence — “A person of great promise and possibilities who is likely to see all taken away unless they carefully provide for the future.” Nothing in that line is metaphor. “Loss and renewal that can exhaust even the most resilient spirit” becomes the semester-to-semester terrain; “opposition and competition in trade, danger of loss through law” becomes courtrooms, rival campaigns, and the need to start the road again after each blow. From January to July this is the weather: progress, then a challenge to the road itself.

Classic 19/1 does not deny that weather. Its symbol — “The Sun, radiant and triumphant — the Prince of Heaven victorious over all temporal failure” — describes the verdict, not the walk. Its promise — “effortless success — not that no effort is required, but that the effort invested yields returns disproportionate to the input” — is how the same pressures become the stage. After impeachment, prosecution, and defeat in 2020, no model would have priced a clean sweep of the swing states. On 5 November the count was 312 electoral votes and the popular vote as well: the precise shape of a return larger than the visible input. The year did not choose between danger and triumph. It made triumph pass through danger.`,
    protective: [
      'Future-proof every agreement on paper before you act on faith — reserves, contracts, and exit routes are not pessimism, they are the 28/1 provision.',
      'Let visibility serve the mission, not the ego — the 19/1 crown is kept by service, not by display.',
      'Keep a second road ready — when renewal is required, the person with a reserve road does not lose the mission while losing the first path.'
    ],
    focus: ['Law, contracts & formal judgment — the surface test', 'Leadership & public visibility — the blueprint verdict', 'Money, reserves & competitive position — what determines whether triumph survives']
  },
  '55-10': {
    title: 'The Sword and the Wheel — a speech becomes a strategy',
    merge: (dLabel, cLabel) => `Direct 55/1 is the Sword — “words, commands, broadcasts that sever the old timeline; protection and menace arrive together.” Classic 10/1 is the Wheel — “whatever will is directed toward materializes rapidly.” Together they say: history will turn on whether you can give the necessary order, speech, or cut with precision.

In practice this is crisis leadership, not quiet success. The year hands you a blade because circumstances require decision — an appointment, a wartime dispatch, a legal declaration, a decisive separation. Wield it cleanly and the Wheel gives “honors disproportionate to the visible resources.” Wield it from anger and the same Sword wounds allies and the peace that must follow.`,
    protective: [
      'Say the necessary thing once, clearly, and stop — precision preserves allies.',
      'Pair rhetoric with logistics the same day; speeches do not replace supply lines.',
      'Do not become addicted to the Sword after it works.'
    ],
    focus: ['Public visibility & creative communication — the Sword itself', 'Leadership & security — what the Sword must protect', 'Reputation — how the year will remember your command']
  },
  '46-19': {
    title: 'Structured Alliance Meets Solar Return',
    merge: () => `46/1 brings “clear agreements, defined responsibilities, and structured approaches to shared goals.” 19/1 brings “the Sun, radiant and triumphant” and disproportionate return. The synthesis is simple: a partnership built with structure becomes the vessel for a solar victory. Without the alliance, the Sun has no house; without the Sun, the alliance has no destiny.`,
    protective: ['Make collaboration contractual and caring — duration matters more than brilliance.', 'Use victory to lead rather than dominate.', 'Keep the central alliance insulated from peripheral noise.'],
    focus: ['Relationships & alliances — the mechanism', 'Reputation & leadership — the outcome', 'Career / work direction — where alliance becomes elevation']
  },
  '37-10': {
    title: 'Partnership Magic Turns the Wheel',
    merge: () => `37/1 is “partnership magic — the right person appears at precisely the moment.” 10/1 is the Wheel that makes will visible rapidly. When both are present, a collaboration is not background; it is the engine. The right co-worker, technology, or distributor arrives exactly when scale is required, and the Wheel makes that meeting historic within months.`,
    protective: ['Welcome the right partner quickly; vet them thoroughly.', 'Make timing explicit — gates close fast under 10/1.', 'Let motive be clean; the Wheel publishes character.'],
    focus: ['Relationships & alliances — the door', 'Creative output & communication — the vehicle', 'Public visibility — the Wheel’s stage']
  }
};

function genericMerge(dLabel: string, cLabel: string, dQ: ReturnType<typeof quoteFor>, cQ: ReturnType<typeof quoteFor>): string {
  const dPlain = dQ?.plainHint ?? 'what happens on the surface — the weather you walk through';
  const cPlain = cQ?.plainHint ?? 'what the year is designed to teach — the verdict beneath the weather';
  return `Your Direct Essence — ${dLabel} — describes ${dPlain}. Your Classic Essence — ${cLabel} — describes ${cPlain}. 

Read together they are not two forecasts to choose between. The Direct tells you where the year will try you; the Classic tells you how the year will judge what you did with the trial. When the surface feels like pressure, the blueprint is often asking for the quality — precision, humility, protection, or alliance — that turns the same pressure into a durable name. When the surface feels like ease, the blueprint is often asking whether you will use the opening to lead rather than merely win.`;
}

// ─── main ─────────────────────────────────────────────────────────────────────

export function buildPersonalYearDualEssenceSynthesis(args: BuildArgs): PersonalYearDualEssenceSynthesis {
  const dQ = quoteFor(args.directRaw);
  const cQ = quoteFor(args.classicRaw);
  const age = typeof args.birthYear === 'number' ? args.targetYear - args.birthYear : null;
  const ageInfo = ageBand(age);

  const directSym = dQ?.symbol ?? args.directCompound?.symbolism ?? '';
  const classicSym = cQ?.symbol ?? args.classicCompound?.symbolism ?? '';
  const directLines = dQ?.lines ?? [];
  const classicLines = cQ?.lines ?? [];

  // ── title / subtitle ──
  const pairKey = `${args.directRaw}-${args.classicRaw}`;
  const bridge = PAIR_BRIDGES[pairKey] ?? null;
  const title = bridge?.title ?? (
    args.directRaw === args.classicRaw
      ? `Reinforced ${args.directCompound?.name ?? args.directYear} — surface and depth point the same way`
      : `${label(args.directRaw, args.directYear, args.directCompound)} × ${label(args.classicRaw, args.classicYear, args.classicCompound)}`
  );
  const subtitle = `${label(args.directRaw, args.directYear, args.directCompound)} × ${label(args.classicRaw, args.classicYear, args.classicCompound)} · ${ageInfo.label} · ${polarityOf(dQ, cQ, args.directRaw, args.classicRaw)}`;

  // ── essence role paragraphs — plain, specific, with quotes surfaced ───────
  const directRole = [
    `DIRECT ESSENCE · YOUR SURFACE JOURNEY — ${label(args.directRaw, args.directYear, args.directCompound)}`,
    directSym ? `“${directSym}”` : '',
    directLines.length ? directLines.map(l => `“${l}”`).join('\n\n') : (args.directCompound?.vibrationalEssence?.slice(0, 280) ?? ''),
    dQ?.plainHint ? `In plain language: ${dQ.plainHint}` : '',
    `This is what is happening TO you this year — the literal events, visible pressures, and openings that will shape the calendar from January to December.`
  ].filter(Boolean).join('\n\n');

  const classicRole = [
    `CLASSIC ESSENCE · YOUR DESTINY BLUEPRINT — ${label(args.classicRaw, args.classicYear, args.classicCompound)}`,
    classicSym ? `“${classicSym}”` : '',
    classicLines.length ? classicLines.map(l => `“${l}”`).join('\n\n') : (args.classicCompound?.vibrationalEssence?.slice(0, 280) ?? ''),
    cQ?.plainHint ? `In plain language: ${cQ.plainHint}` : '',
    `This is what the year MEANS — the deeper outcome, the karmic lesson, and how the year will be judged when it is over.`
  ].filter(Boolean).join('\n\n');

  // ── merge ──
  const mergeText = bridge
    ? bridge.merge(label(args.directRaw, args.directYear, args.directCompound), label(args.classicRaw, args.classicYear, args.classicCompound), dQ, cQ, args.targetYear)
    : genericMerge(label(args.directRaw, args.directYear, args.directCompound), label(args.classicRaw, args.classicYear, args.classicCompound), dQ, cQ);

  // ── history (>80% similar only) ──
  const similar = findVerifiedCasesForPair(args.directRaw, args.classicRaw, args.directYear, args.classicYear, 4);
  const historicalCalibration = buildHistorySection(similar, args.targetYear, args.directRaw, args.classicRaw);

  // ── focus & protection — derived from bridge or from plain hints ───────────
  const focusAreas = (bridge?.focus ?? [
    dQ?.plainHint ? `${dQ.plainHint} — watch this surface arena` : `Direct ${args.directRaw} — visible terrain`,
    cQ?.plainHint ? `${cQ.plainHint} — this is the judging arena` : `Classic ${args.classicRaw} — deeper verdict`,
    ageInfo.note
  ]).slice(0, 4);

  const protection = bridge?.protective ?? buildGenericProtection(args.directRaw, args.classicRaw);

  // ── master / karmic signals — brief, operational ───────────────────────────
  const master = buildMasterSignal(args);
  const karmic = buildKarmicSignal(args.directRaw, args.classicRaw);

  // ── polarity / intensity ──
  const polarity = polarityOf(dQ, cQ, args.directRaw, args.classicRaw);
  const intensity = intensityScoreSimple(args.directRaw, args.classicRaw, !!bridge, age);

  // ── domains — human list for compatibility with older UI widgets ───────────
  const domains = focusAreas;

  const wovenSynthesis = buildWovenSynthesis({
    year: args.targetYear, birthDay: args.birthDay, birthMonth: args.birthMonth, birthYear: args.birthYear,
    directRaw: args.directRaw, classicRaw: args.classicRaw,
    directLabel: label(args.directRaw, args.directYear, args.directCompound),
    classicLabel: label(args.classicRaw, args.classicYear, args.classicCompound),
    dPlain: dQ?.plainHint ?? null, cPlain: cQ?.plainHint ?? null, protection,
  });

  // ── final synthesis text — flows like a consultant's letter, not a report ───
  const synthesisText = assembleLetter({
    wovenSynthesis,
    title, subtitle, year: args.targetYear,
    directLabel: label(args.directRaw, args.directYear, args.directCompound),
    classicLabel: label(args.classicRaw, args.classicYear, args.classicCompound),
    directSym, classicSym, directLines, classicLines,
    dPlain: dQ?.plainHint ?? null, cPlain: cQ?.plainHint ?? null,
    mergeText, similar, ageInfo, master, karmic, intensity, polarity, protection
  });

  return {
    title,
    subtitle,
    synthesisText,
    directEssenceRole: directRole,
    classicEssenceRole: classicRole,
    ageModifier: `${ageInfo.label}\n\n${ageInfo.note}`,
    masterNumberSignal: master,
    karmicDebtSignal: karmic,
    historicalCalibration,
    wovenSynthesis,
    predictionFocusAreas: focusAreas,
    protectiveActions: protection,
    domains,
    polarity,
    intensityScore: intensity,
  };
}

// ─── woven synthesis — the intermarriage, grounded in dated real lives ──────

const reduceKeep = (n: number): number => {
  let v = Math.abs(n);
  while (v > 9 && v !== 11 && v !== 22 && v !== 33) v = String(v).split('').reduce((a, c) => a + +c, 0);
  return v;
};
const dso = (n: number) => String(n).split('').reduce((a, c) => a + +c, 0);
const POSITIVE = new Set(['triumph', 'legacy']);
const OUTCOME_WORD: Record<string, string> = {
  triumph: 'a triumph', legacy: 'a legacy that outlasted the year', mixed: 'a mixed verdict — gain and cost together',
  transition: 'a change of station', loss: 'a reversal',
};
// Organisations, bands and teams can't live a personal year — mirrors are people only.
const isEntity = (p: { tags: string[] }) => p.tags.includes('Entity');
const BASE_POSITIVE_RATE = PERSONAL_YEAR_PRECEDENTS.filter(p => POSITIVE.has(p.outcome)).length / Math.max(1, PERSONAL_YEAR_PRECEDENTS.length);

function firstClause(s: string | null): string | null {
  if (!s) return null;
  const t = s.split(/\s+[—–-]\s+|;\s+/)[0].replace(/[.!]+$/, '').trim();
  return t ? t[0].toLowerCase() + t.slice(1) : null;
}

/** Banked precedents for a pair: exact compound pair first, then the same reduced pair. */
export function findPrecedents(directRaw: number, classicRaw: number) {
  const exact = PERSONAL_YEAR_PRECEDENTS.filter(p => p.directRaw === directRaw && p.classicRaw === classicRaw);
  const rd = reduceKeep(directRaw), rc = reduceKeep(classicRaw);
  const reduced = PERSONAL_YEAR_PRECEDENTS.filter(p => !(p.directRaw === directRaw && p.classicRaw === classicRaw)
    && reduceKeep(p.directRaw) === rd && reduceKeep(p.classicRaw) === rc);
  return { exact, reduced };
}

function pickPrecedents(exact: Precedent[], reduced: Precedent[], max = 3): Array<Precedent & { exactPair: boolean }> {
  const pool = [...exact.map(p => ({ ...p, exactPair: true })), ...reduced.map(p => ({ ...p, exactPair: false }))]
    .sort((a, b) => Number(b.exactPair) - Number(a.exactPair) || b.year - a.year);
  const out: Array<Precedent & { exactPair: boolean }> = [];
  const seen = new Set<string>();
  const take = (pred: (p: Precedent) => boolean) => {
    const hit = pool.find(p => !seen.has(p.person) && pred(p));
    if (hit && out.length < max) { out.push(hit); seen.add(hit.person); }
  };
  // Honesty: show a triumph AND a reversal whenever the library has both.
  take(p => POSITIVE.has(p.outcome));
  take(p => !POSITIVE.has(p.outcome));
  while (out.length < max) { const before = out.length; take(() => true); if (out.length === before) break; }
  return out;
}

function buildWovenSynthesis(o: {
  year: number; birthDay: number; birthMonth: number; birthYear?: number;
  directRaw: number; classicRaw: number; directLabel: string; classicLabel: string;
  dPlain: string | null; cPlain: string | null; protection: string[];
}): string {
  const samePair = o.directRaw === o.classicRaw;
  const surface = firstClause(o.dPlain) ?? `the ${o.directLabel} vibration sets the visible weather`;
  const depth = firstClause(o.cPlain) ?? `the ${o.classicLabel} vibration decides what the year leaves behind`;

  // ONE SENTENCE, TWO ALTITUDES
  const thesis = samePair
    ? `ONE SENTENCE, TWO ALTITUDES: in ${o.year} your surface and your blueprint are the same number, ${o.directLabel} — a vibration married to itself, redoubled: ${surface}, and nothing underneath softens or redirects it.`
    : `ONE SENTENCE, TWO ALTITUDES: in ${o.year} ${surface} — and underneath, ${depth}.`;

  const { exact, reduced } = findPrecedents(o.directRaw, o.classicRaw);
  const picks = pickPrecedents(exact, reduced);
  const lines: string[] = [thesis, ''];

  if (picks.length) {
    picks.forEach((p, i) => {
      const what = p.what;
      const tag = p.exactPair ? ` — your exact pair, ${p.directRaw}/${p.classicRaw}` : ` — the same reduced pair (${p.directRaw}/${p.classicRaw})`;
      const lead = i === 0 ? 'Its clearest precedent is' : i === 1 && POSITIVE.has(picks[0].outcome) !== POSITIVE.has(p.outcome) ? 'The other side of the same pair:' : 'Also on this pair:';
      lines.push(`${lead} ${p.person} in ${p.year}${tag}: on the surface, ${what}; underneath, the blueprint paid it out as ${OUTCOME_WORD[p.outcome] ?? p.outcome}.`);
    });
  } else {
    lines.push(`No life in the banked library has lived this exact pair yet, so this reading stands on the essence texts alone.`);
  }

  // Famous mirrors: people whose birth day + month give the identical pair in EVERY year.
  const mirrors = famousBirthdays
    .filter(p => !isEntity(p) && !(p.day === o.birthDay && p.month === o.birthMonth && p.year === o.birthYear))
    .filter(p => p.day + p.month === o.birthDay + o.birthMonth && dso(p.day) + dso(p.month) === dso(o.birthDay) + dso(o.birthMonth))
    .sort((a, b) => Number(b.day === o.birthDay && b.month === o.birthMonth) - Number(a.day === o.birthDay && a.month === o.birthMonth))
    .slice(0, 3);
  if (mirrors.length) {
    lines.push('', `Famous mirrors living the same ${o.directRaw}/${o.classicRaw} year in ${o.year}: ${mirrors.map(m => m.name).join(', ')}.`);
  }

  // How to live it — the two strategic moves fused into one instruction.
  const move = (o.protection[0] ?? 'Make one concrete control visible.').replace(/\.$/, '');
  lines.push('', `How to live it: meet the surface (${surface}) with the blueprint's demand in mind — ${move[0].toLowerCase()}${move.slice(1)}. Let the outer event serve the inner verdict, not the other way round.`);

  // Honesty clause — the library's own record for this pair. Tested on all
  // banked years (scripts/validate-celebrity-accuracy.ts §G), the pair does not
  // predict triumph vs reversal better than chance, so it is never sold as odds.
  const pool = exact.length >= 3 ? exact : [...exact, ...reduced];
  const total = PERSONAL_YEAR_PRECEDENTS.length;
  if (pool.length) {
    const pos = pool.filter(p => POSITIVE.has(p.outcome)).length;
    const share = Math.round((100 * pos) / pool.length);
    const both = pos > 0 && pos < pool.length;
    lines.push('', `Honest record: ${pos} of ${pool.length} banked ${pool === exact ? 'exact-pair' : 'same-pair'} years ended in triumph or legacy (${share}%; ${Math.round(100 * BASE_POSITIVE_RATE)}% across all ${total}). ${pool.length < 8 ? 'That is too few lives to call a pattern. ' : ''}Across the whole library no Personal Year pair has predicted triumph versus reversal better than chance, so read these lives as precedent, not probability. ${both ? 'This pair has carried both crowns and reversals: the' : 'The'} essences set the stage, but conduct decides the verdict.`);
  } else {
    lines.push('', `Honest note: the essences set the stage, but conduct decides the verdict — across ${total} banked lives no Personal Year pair has predicted triumph or reversal better than chance.`);
  }
  return lines.join('\n');
}

// ─── section builders ───────────────────────────────────────────────────────

function buildHistorySection(similar: Array<VerifiedPairCase & { similarity: number }>, year: number, dRaw: number, cRaw: number): string {
  if (!similar.length) {
    return [
      `No banked case exceeds 80% similarity to ${dRaw}/${cRaw} for ${year} in the current offline library.`,
      `That is intentional: the app will not stretch a weak analogue to look like proof.`,
      `Your prediction still rests on the quoted lines of the two essences themselves — the lines that, for people who have lived this exact pair, became literal.`,
      `When a future verified year completes 80%+ similarity to this pair, it will appear here automatically.`
    ].join(' ');
  }
  const header = `${similar.length} verified ${similar.length === 1 ? 'life' : 'lives'} who lived the same ${dRaw} × ${cRaw} pattern at 80%+ similarity. Each is banked offline with birth date, event date, and source — not an AI guess.`;
  const cards = similar.map(c => {
    const pct = Math.round(c.similarity * 100);
    return [
      `${c.person} — ${c.title} (${c.eventDate}) — ${pct}% similar`,
      c.narrative,
      `How the lines read against this event: Direct — “${c.quotedDirectLine}” · Classic — “${c.quotedClassicLine}”`,
      c.correlation,
      `Sources: ${(c.sources ?? []).join(' · ')}`
    ].filter(Boolean).join('\n');
  }).join('\n\n— — —\n\n');
  return `${header}\n\n${cards}`;
}

function buildGenericProtection(dRaw: number, cRaw: number): string[] {
  const out: string[] = [];
  if ([28,82].includes(dRaw)) out.push('Write everything down — reserves, contracts, and a second road. Trust without structure is the loss channel.');
  if ([18,38,47].includes(dRaw)) out.push('Test allies before depending on them; reliability matters more than charm this year.');
  if ([16,51,35].includes(dRaw) || [16,51,35].includes(cRaw)) out.push('Treat logistics as prophecy — vehicles, health routines, fatigue, and insurance are the protective moves.');
  if ([19,37,46,10,21].includes(cRaw)) out.push('When the Sun is high, keep the purpose larger than the self — service protects the crown.');
  if ([55,22].includes(dRaw)) out.push('Be decisive and restrained — say the necessary thing once and pair words with logistics the same day.');
  if (!out.length) out.push('Make one concrete control visible: a written term, a budget limit, a recovery day, or a clearer chain of authority.');
  return out.slice(0, 3);
}

function buildMasterSignal(args: BuildArgs): string | null {
  const parts: string[] = [];
  const dMaster = [11,22,33].includes(args.directRaw) || [11,22,33].includes(args.directYear) || !!args.directCompound?.isMasterNumber;
  const cMaster = [11,22,33].includes(args.classicRaw) || [11,22,33].includes(args.classicYear) || !!args.classicCompound?.isMasterNumber;
  if (dMaster) parts.push('The surface carries master-number voltage — people will read meaning into the event, not just facts.');
  if (cMaster) parts.push('The blueprint carries master-number voltage — the real test is teaching, building, or illumination, not just personal outcome.');
  return parts.length ? parts.join(' ') : null;
}

function buildKarmicSignal(dRaw: number, cRaw: number): string | null {
  const watch = new Set([13,14,16,18,26,28,29,35,38,43,47,51]);
  const hits = [dRaw, cRaw].filter(n => watch.has(n));
  if (!hits.length) return null;
  return `Alert compounds active: ${hits.join(' and ')}. Read this operationally — contracts, transport, body strain, legal exposure, partner reliability, and public conflict deserve concrete prevention rather than worry.`;
}

function assembleLetter(opts: {
  wovenSynthesis: string;
  title: string; subtitle: string; year: number;
  directLabel: string; classicLabel: string;
  directSym: string; classicSym: string;
  directLines: string[]; classicLines: string[];
  dPlain: string | null; cPlain: string | null;
  mergeText: string;
  similar: Array<VerifiedPairCase & { similarity: number }>;
  ageInfo: { label: string; note: string };
  master: string | null; karmic: string | null;
  intensity: number; polarity: string;
  protection: string[];
}): string {
  const directQuoteBlock = [
    opts.directSym ? `“${opts.directSym}”` : '',
    ...opts.directLines.map(l => `“${l}”`)
  ].filter(Boolean).join('\n');
  const classicQuoteBlock = [
    opts.classicSym ? `“${opts.classicSym}”` : '',
    ...opts.classicLines.map(l => `“${l}”`)
  ].filter(Boolean).join('\n');

  const historyBlock = opts.similar.length
    ? opts.similar.map(c => {
        const pct = Math.round(c.similarity * 100);
        return [
          `${c.person} — ${c.title}`,
          `Event: ${c.eventDate} · ${c.narrative}`,
          `Direct line it echoes: “${c.quotedDirectLine}”`,
          `Classic line it echoes: “${c.quotedClassicLine}”`,
          c.correlation,
          `Sources: ${(c.sources ?? []).join(' · ')}  ·  ${pct}% similar to your ${opts.directLabel} × ${opts.classicLabel}`
        ].filter(Boolean).join('\n');
      }).join('\n\n')
    : `No banked case at 80%+ similarity exists yet for this exact pair. The quoted lines above still describe the pair; the next verified life at this pair will appear here automatically.`;

  return [
    `${opts.title}`,
    `${opts.subtitle}`,
    ``,
    `One year holds two truths at once. This synthesis does not choose between your two essences — it reads them as a single story, verified where possible by the people who have already lived it.`,
    ``,
    `— THE SURFACE JOURNEY — WHAT YOU WILL WALK THROUGH`,
    `${opts.directLabel}`,
    ``,
    directQuoteBlock,
    ``,
    opts.dPlain ? `In plain words: ${opts.dPlain}` : '',
    ``,
    `This is the weather — the literal circumstances that will try you. It answers “What is happening to me?”`,
    ``,
    `— THE DESTINY BLUEPRINT — WHAT IT WILL BE JUDGED TO MEAN`,
    `${opts.classicLabel}`,
    ``,
    classicQuoteBlock,
    ``,
    opts.cPlain ? `In plain words: ${opts.cPlain}` : '',
    ``,
    `This is the map — the deeper outcome and lesson the year is designed to leave behind. It answers “What does it mean?”`,
    ``,
    `— HOW THEY MERGE — THE BRIDGE`,
    opts.mergeText,
    ``,
    `— WOVEN TOGETHER — WHAT REAL LIVES DID WITH THIS PAIR`,
    opts.wovenSynthesis,
    ``,
    `— CLOSEST VERIFIED CASES — LIVES AT 80%+ SIMILARITY`,
    historyBlock,
    ``,
    `— WHAT TO WATCH, WHAT TO DO —`,
    opts.protection.map((p, i) => `${i + 1}. ${p}`).join('\n'),
    ``,
    `Age note: ${opts.ageInfo.label} — ${opts.ageInfo.note}`,
    ``,
    opts.master ? `Master number: ${opts.master}` : '',
    opts.karmic ? `Alert: ${opts.karmic}` : '',
    ``,
    `Intensity ${opts.intensity}/100 · ${opts.polarity} — high intensity does not mean good or bad; it means the pattern is more likely to become concrete and visible.`,
    ``,
    `A consultant's principle: do not ask “Which essence is right?” Ask “What story do both tell together?” The surface without the blueprint is a weather report without a forecast. The blueprint without the surface is a prophecy without a landscape. Together they become a road you can actually walk.`
  ].filter(Boolean).join('\n');
}
