/**
 * MYSTIQUE COMPASS — Alexandrov Psychomatrix Transition Engine
 * Pure deterministic logic. Zero AI calls. Zero fallbacks.
 *
 * Source: Александров А.Ф. «Нумерология. Полный курс», Chapter "Переходы цифр"
 * All four canonical transitions are fully modelled per the author's axioms (5.3, 5.4).
 */

export interface MatrixState {
  counts: Record<number, number>;
  personalYear: number;
  birthDay: number;
  birthMonth: number;
  birthYear: number;
  gender: 'male' | 'female';
}

export type TransitionDirection = 'ascent' | 'descent' | 'dual';
export type UrgencyLevel = 'critical' | 'high' | 'moderate' | 'latent';

export interface DetectedTransition {
  id: string;
  from: number;
  to: number;
  name: string;
  subtitle: string;
  direction: TransitionDirection;
  urgency: UrgencyLevel;
  energyCost: string;
  prerequisitesMet: string;
  coreConflict: string;
  warningActive: boolean;
  overloadedNumbers: number[];
  missingNumbers: number[];
  arrowsActive: string[];
  countFrom: number;
  countTo: number;
  advisory: TransitionAdvisory;
}

export interface TransitionAdvisory {
  anatomy: string;
  mechanics: string;
  execution?: string;
  resistance?: string;
  sabotage: string;
  synthesis: string;
  synergy?: string;
}

const ARROWS: Array<{ name: string; numbers: number[]; type: 'positive' | 'negative' }> = [
  { name: 'Arrow of Will (1-2-3)', numbers: [1, 2, 3], type: 'positive' },
  { name: 'Arrow of Family (4-5-6)', numbers: [4, 5, 6], type: 'positive' },
  { name: 'Arrow of Spirit (7-8-9)', numbers: [7, 8, 9], type: 'positive' },
  { name: 'Arrow of Pythagoras (1-4-7)', numbers: [1, 4, 7], type: 'positive' },
  { name: 'Arrow of Femininity (2-5-8)', numbers: [2, 5, 8], type: 'positive' },
  { name: 'Arrow of Talent (3-6-9)', numbers: [3, 6, 9], type: 'positive' },
  { name: 'Arrow of Intellect (1-5-9)', numbers: [1, 5, 9], type: 'positive' },
  { name: 'Arrow of Grounding (3-5-7)', numbers: [3, 5, 7], type: 'positive' },
  { name: 'Absence of Goal (no 1-2-3)', numbers: [1, 2, 3], type: 'negative' },
  { name: 'Absence of Will (no 4-5-6)', numbers: [4, 5, 6], type: 'negative' },
  { name: 'Absence of Spiritual (no 7-8-9)', numbers: [7, 8, 9], type: 'negative' },
];

function getActiveArrows(counts: Record<number, number>): string[] {
  return ARROWS
    .filter(a => {
      const allPresent = a.numbers.every(n => (counts[n] ?? 0) > 0);
      const allAbsent = a.numbers.every(n => (counts[n] ?? 0) === 0);
      return a.type === 'positive' ? allPresent : allAbsent;
    })
    .map(a => a.name);
}

function getOverloaded(counts: Record<number, number>): number[] {
  return Object.entries(counts).filter(([, v]) => v >= 4).map(([k]) => Number(k));
}

function getMissing(counts: Record<number, number>): number[] {
  return [1, 2, 3, 4, 5, 6, 7, 8, 9].filter(n => !counts[n] || counts[n] === 0);
}

function c(counts: Record<number, number>, n: number): number {
  return counts[n] ?? 0;
}

function repeat(n: number, count: number): string {
  return String(n).repeat(count);
}

// ─────────────────────────────────────────────────────────────────────────────
//  DEEP ADVISORY PAYLOADS (ALEXANDROV SYNTHESIS)
// ─────────────────────────────────────────────────────────────────────────────

function advisory_11_to_8(state: MatrixState): TransitionAdvisory {
  const c1 = state.counts[1] || 0;
  const energy = (state.counts[2] || 0) + (state.counts[4] || 0);

  return {
    anatomy: `The Transition of ASCENT. You are currently holding ${c1} '1s' (Willpower/Ego). This transition demands the willing sacrifice of your personal dominance and absolute authority to generate an '8' (Profound Duty and Tolerance). This is not merely "being nice"; it is the deliberate suppression of your ego to serve a higher obligation to your family, society, or spiritual calling.`,
    mechanics: `To execute this, you must spend biological energy (costing you a 4 or a 22). You must actively stop trying to win every argument, prove your superiority, or impose your will on others. Your current energy reserves (${energy} digits across 2s and 4s) dictate how exhausting this will be. You must consciously absorb the flaws of others without erupting, transmuting your dominant '${repeat(1, 2)}' into the quiet, unshakable foundation of the '8'.`,
    sabotage: `The moment you begin radiating the tolerance of the '8', parasitic individuals will mistake your kindness for weakness. Those who previously feared your '${repeat(1, 2)}' will test your new boundaries, attempting to extract your energy and resources. The sabotage here is the intense temptation to snap back into your tyrannical '${repeat(1, Math.max(c1, 2))}' to crush them.`,
    synthesis: `Upon successful transition, you achieve the "Golden Mean." You no longer need to force the world to bend to your will. By manifesting the '8', your authority becomes natural and quiet. People follow you out of profound respect for your tolerance and duty, rather than fear of your ego.`,
    synergy: state.counts[9] >= 2 ? `Your strong intellect (${state.counts[9]} '9s') must be used to rationalize this tolerance. Understand that forgiving others is an act of supreme intelligence, not weakness.` : undefined,
  };
}

function advisory_8_to_11(state: MatrixState): TransitionAdvisory {
  const c8 = state.counts[8] || 0;

  return {
    anatomy: `The Transition of DESCENT (Reclamation). You are currently carrying the burden of ${c8} '8s' (Duty/Tolerance). You are collapsing this sense of universal obligation to reclaim raw, uncompromising personal power (11). This happens when the weight of carrying others becomes biologically unsustainable, and you must sacrifice your "kindness" to rebuild your destroyed boundaries.`,
    mechanics: `This transition requires a ruthless psychological severing. You must actively stop taking responsibility for the failures, emotions, and survival of those around you. It costs immense health and bioenergy (−4 or −22) to endure the guilt of saying "No." You must redirect all your energy inward, hardening your empathy into absolute, unbreakable willpower.`,
    sabotage: `Expect violent emotional resistance from dependents. The people who have relied on your '8' (your endless tolerance and financial/emotional support) will use severe guilt-tripping, manipulation, and accusations of selfishness to force you to keep carrying them. They will actively try to prevent you from reclaiming your '11'.`,
    synthesis: `Once complete, you will possess a terrifyingly clear sense of self. You will no longer be paralyzed by duty or obligation. You will operate with the pure, unclouded authority of the '11', protecting your core energy and executing your personal goals without the anchor of parasitic relationships.`,
    synergy: state.counts[3] >= 2 ? `Your strong habits (${state.counts[3]} '3s') must be broken. Your routine of constantly saving others is an addiction; you must systematically dismantle these caretaking rituals.` : undefined,
  };
}

function advisory_6_to_7(state: MatrixState): TransitionAdvisory {
  const c6 = state.counts[6] || 0;
  const c9 = state.counts[9] || 0;
  const c5 = state.counts[5] || 0;

  return {
    anatomy: `The Transition of DIVINE ELEVATION. You are actively attempting to transmute the heavy, mundane, and often destructive physical labor of the '6' into the divine protection, luck, and true artistic/scientific talent of the '7'. This is the most difficult transition in the Psychomatrix. It requires elevating a grounded, survival-based existence into a higher spiritual and creative plane.`,
    mechanics: `To trigger this, you cannot simply abandon the '6'; you must master it and then outgrow it. You must dedicate yourself to a craft, a science, or a system until your physical execution becomes flawless. Then, you must inject higher purpose into it. This requires the expenditure of massive health/energy (+4 or +22). You must refuse to operate purely for material gain, shifting your focus entirely toward mastering the universe's higher laws.`,
    sabotage: `Alexandrov's strict warning applies here: You will face active, engineered sabotage. Individuals in your environment with high concentrations of '6s' (ruthlessly materialistic or mundane people) will deliberately create obstacles, grievances, and suffering in your life. They do this subconsciously to prevent you from escaping their ranks. You must ignore their manufactured drama.`,
    synthesis: `Upon breakthrough, you acquire the '7'. You step under the protection of Nature (God). You will experience a sudden, inexplicable alignment of luck, where obstacles vanish and true talent flows effortlessly. The grinding labor of the '6' is replaced by the divine intuition and ease of the '7'.`,
    synergy: (c5 >= 2 && c9 >= 2) ? `CRITICAL SYNERGY: You possess the powerful 55/99 axis. Use your massive logic (${c5} '5s') to generate the missing memory/insight, or your heavy intellect (${c9} '9s') to generate missing logic. This cognitive engine is your ultimate weapon against the sabotage of the 6s.` : undefined,
  };
}

function advisory_7_to_6(state: MatrixState): TransitionAdvisory {
  const c7 = state.counts[7] || 0;
  const has4 = (state.counts[4] || 0) > 0;

  return {
    anatomy: `The Transition of DEGRADATION. You possess the divine protection and talent of the '7' (${c7} count), but you are currently in a state of freefall. You are losing your connection to higher luck and talent, degrading back into the heavy, mundane, and destructive routines of the '6'. This is a critical spiritual emergency.`,
    mechanics: `This collapse is almost always triggered by a specific action: using your talents or position to deliberately harm another person for personal, material gain. When you act out of pure malice, arrogance, or greed, Nature revokes the '7'. The descent costs you a 4 or a 22. If you lack a strong '4' (Health), this transition will manifest as severe physical illness or complete biological exhaustion.`,
    sabotage: `The sabotage here comes from within and from the temptations of the material world. You will be offered shortcuts, bribes, or easy victories that require you to compromise your morals or step on others. The environment will reward your cruelty in the short term, blinding you to the permanent loss of your divine luck.`,
    synthesis: `If you do not arrest this descent, you will be stripped of your '7'. Your life will lose its ease and serendipity. Every victory will require bone-crushing physical labor (6), and you will become trapped in a cycle of mundane survival and bitterness. You must immediately cease any actions causing harm to others to stop the hemorrhage.`,
    synergy: !has4 ? `WARNING: You have NO '4' in your matrix. The cost of this degradation will bypass your health reserves and directly attack your core vitality. Arrest this descent immediately, or physical breakdown is imminent.` : undefined,
  };
}

export function detectTransitions(state: MatrixState): DetectedTransition[] {
  const { counts, personalYear } = state;
  const results: DetectedTransition[] = [];
  const overloaded = getOverloaded(counts);
  const missing = getMissing(counts);
  const arrows = getActiveArrows(counts);

  const cf = (n: number) => c(counts, n);
  const row3Strength = cf(3) + cf(6) + cf(9);

  if (cf(1) >= 2) {
    results.push({
      id: '11_TO_8', from: 1, to: 8,
      name: 'Will into Duty', subtitle: 'Voluntary Sacrifice of the Ego',
      direction: 'ascent', urgency: cf(1) >= 4 ? 'critical' : cf(8) === 0 ? 'high' : 'moderate',
      energyCost: '+4 or +22', prerequisitesMet: `${cf(1)} Ones present.`,
      coreConflict: 'Choosing tolerance and kindness over assertion in each conflict situation.',
      warningActive: [1, 10, 19, 8, 17, 26].includes(personalYear),
      overloadedNumbers: overloaded, missingNumbers: missing, arrowsActive: arrows,
      countFrom: cf(1), countTo: cf(8), advisory: advisory_11_to_8(state),
    });
  }

  if (cf(8) >= 1) {
    results.push({
      id: '8_TO_11', from: 8, to: 1,
      name: 'Duty into Will', subtitle: 'The Collapse of Tolerance',
      direction: 'descent', urgency: overloaded.includes(8) ? 'critical' : cf(1) >= 3 ? 'high' : 'moderate',
      energyCost: '−4 or −22', prerequisitesMet: `${cf(8)} Eight(s) present.`,
      coreConflict: 'Acts of harm for personal gain trigger this collapse.',
      warningActive: [8, 17, 26, 1, 10, 19].includes(personalYear),
      overloadedNumbers: overloaded, missingNumbers: missing, arrowsActive: arrows,
      countFrom: cf(8), countTo: cf(1), advisory: advisory_8_to_11(state),
    });
  }

  if (cf(6) >= 1 || row3Strength >= 5) {
    results.push({
      id: '6_TO_7', from: 6, to: 7,
      name: 'Routine into Talent', subtitle: 'Liberation from the Earthly',
      direction: 'ascent', urgency: cf(6) >= 3 ? 'critical' : cf(7) === 0 ? 'high' : 'moderate',
      energyCost: '+4 or +22', prerequisitesMet: cf(6) >= 1 ? `${cf(6)} Six(es) present.` : `Row strength is ${row3Strength}.`,
      coreConflict: 'Releasing earthly anchoring through art, books, and knowledge.',
      warningActive: [6, 15, 24, 7, 16, 25].includes(personalYear),
      overloadedNumbers: overloaded, missingNumbers: missing, arrowsActive: arrows,
      countFrom: cf(6), countTo: cf(7), advisory: advisory_6_to_7(state),
    });
  }

  if (cf(7) >= 1) {
    results.push({
      id: '7_TO_6', from: 7, to: 6,
      name: 'Talent into Degradation', subtitle: 'Fall from Protection',
      direction: 'descent', urgency: overloaded.includes(7) ? 'critical' : [7, 16, 25].includes(personalYear) ? 'high' : 'moderate',
      energyCost: '−4 or −22', prerequisitesMet: `${cf(7)} Seven(s) present.`,
      coreConflict: 'Deliberate harm against others for gain triggers this collapse.',
      warningActive: [7, 16, 25, 6, 15, 24].includes(personalYear),
      overloadedNumbers: overloaded, missingNumbers: missing, arrowsActive: arrows,
      countFrom: cf(7), countTo: cf(6), advisory: advisory_7_to_6(state),
    });
  }

  const urgencyOrder: Record<UrgencyLevel, number> = { critical: 0, high: 1, moderate: 2, latent: 3 };
  return results.sort((a, b) => urgencyOrder[a.urgency] - urgencyOrder[b.urgency]);
}
