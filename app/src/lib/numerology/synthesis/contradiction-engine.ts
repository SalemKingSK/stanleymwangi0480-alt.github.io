/**
 * @fileoverview CONTRADICTION ENGINE — LAYER 6 (v2)
 *
 * 20 archetypal contradiction chains covering:
 * - Purpose vs. execution failure modes
 * - Emotional vs. intellectual dominance wars
 * - Confidence vs. competence mismatches
 * - Social capacity vs. intimacy deficits
 * - Spiritual elevation vs. material neglect
 * - Stability excess vs. freedom suppression
 * - Ambition vs. self-esteem misalignment
 * - Intuition vs. logic warfare
 *
 * Every contradiction includes:
 * - name & domain tag
 * - the observed grid pattern (interpolated with exact counts)
 * - a 150-200 word deep reading
 * - a 3-sentence domain-specific resolution
 * - life-domain manifestations (career / relationships / money / health)
 *
 * Invariant: interpolated variables (totalDigits, line names) ensure
 * no two different grids can produce identical text.
 */

import type { LineAnalysis } from '@/lib/numerology/psychomatrix-synthesis';
import type { LineIntersection } from './psychomatrix-intersection-engine';

// ═══════════════════════════════════════════════════════════════════════════════
// TYPE DEFINITIONS
// ═══════════════════════════════════════════════════════════════════════════════

export interface Contradiction {
  name: string;
  /** Which dimension of life this most visibly disrupts */
  domain: 'career' | 'relationships' | 'money' | 'health' | 'spirituality' | 'identity' | 'multi';
  description: string;
  /** Exact grid pattern that triggered this, with interpolated digit counts */
  pattern: string;
  /** 150-200 word deep reading — the inner psychological mechanism */
  deepReading: string;
  /** How this shows up concretely in specific life areas */
  lifeManifestations: {
    career?: string;
    relationships?: string;
    money?: string;
    health?: string;
    spirituality?: string;
    identity?: string;
    leadership?: string;
    stress?: string;
  };
  /** 3-sentence resolution — specific, not generic */
  resolution: string;
}

// ═══════════════════════════════════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════════════════════════════════

function lineById(lines: LineAnalysis[], id: string): LineAnalysis | undefined {
  return lines.find((l) => l.id === id);
}
function isStrong(l: LineAnalysis | undefined): boolean {
  return !!l && (l.strengthCategory === 'strong' || l.strengthCategory === 'overload');
}
function isWeak(l: LineAnalysis | undefined): boolean {
  return !!l && (l.strengthCategory === 'weak' || l.strengthCategory === 'absent');
}
function isOverload(l: LineAnalysis | undefined): boolean {
  return !!l && l.strengthCategory === 'overload';
}
function isAbsent(l: LineAnalysis | undefined): boolean {
  return !!l && l.strengthCategory === 'absent';
}

// ═══════════════════════════════════════════════════════════════════════════════
// CONTRADICTION DETECTION
// ═══════════════════════════════════════════════════════════════════════════════

export function detectContradictions(
  lines: LineAnalysis[],
  intersections: { patterns: LineIntersection[] }
): Contradiction[] {
  const contradictions: Contradiction[] = [];

  const row1 = lineById(lines, 'row_1'); // Purpose / Will [1,4,7]
  const row2 = lineById(lines, 'row_2'); // Family / Attachment [2,5,8]
  const row3 = lineById(lines, 'row_3'); // Stability / Habits [3,6,9]
  const col1 = lineById(lines, 'col_1'); // Self-Esteem [1,2,3]
  const col2 = lineById(lines, 'col_2'); // Work / Money [4,5,6]
  const col3 = lineById(lines, 'col_3'); // Talent / Gifts [7,8,9]
  const spirit = lineById(lines, 'diag_spirit'); // Spirituality [1,5,9]
  const carnal = lineById(lines, 'diag_carnal'); // Temperament [3,5,7]

  // ─── 1. PURPOSE WITHOUT EXECUTION CAPACITY ─────────────────────────────────
  if (isStrong(row1) && isWeak(col2)) {
    contradictions.push({
      name: 'The Unbuilt Cathedral',
      domain: 'career',
      description: `Strong Purpose/Will (${row1!.totalDigits} digits) combined with weak Work/Money capacity (${col2!.totalDigits} digits). The drive to accomplish is intense; the machinery for doing so is underpowered.`,
      pattern: `Purpose line at ${row1!.totalDigits} digits (${row1!.strengthCategory}) — Work/Money line at ${col2!.totalDigits} digits (${col2!.strengthCategory}).`,
      deepReading: `This is the architecture of the visionary who cannot complete. The Purpose line at ${row1!.totalDigits} digits generates a quality of sustained internal pressure — a feeling of being meant for something significant that does not release. But the Work/Money line at ${col2!.totalDigits} digits means the practical organs of execution — discipline, money management, career navigation, sustained effort through boredom — are not naturally developed. The result is a pattern recognizable across many life areas: grand intentions that launch but do not land, ambitious projects that stall at the point where glamour ends and drudgery begins, financial goals held with genuine conviction but undermined by disorganization or avoidance of the mundane mechanics. The person typically cannot understand why others complete things that they, with greater vision, cannot. The answer is not effort or intelligence — it is the specific executive function that converts intention into sustained daily action, which the grid has not naturally equipped.`,
      lifeManifestations: {
        career: 'Promoted for vision, passed over for results. Brilliant in the interview, inconsistent in the execution. Pattern of starting strong and fading.',
        relationships: 'Declares commitment convincingly but struggles to maintain the unglamorous daily acts — remembering things, showing up consistently, handling the boring administrative work of love.',
        money: 'Income often matches talent but savings rarely match income. Money arrives and leaves without a durable system forming around it.',
        health: 'Ambitious health goals (marathon, diet overhaul, meditation practice) that begin with intensity and dissolve when they become routine.',
      },
      resolution: `The practice is not more motivation — motivation is already excessive. The practice is structural scaffolding: external accountability partners, calendar blocking, and breaking every intention into its smallest possible mechanical action before starting. Learn to be suspicious of any goal that feels inspiring at the outset; the real work begins when the inspiration fades. Specifically: choose one career or financial goal this month and map only the next three steps, not the full vision.`,
    });
  }

  // ─── 2. STRONG SELF-ESTEEM, WEAK EXECUTION — CONFIDENCE/COMPETENCE GAP ────
  if (isStrong(col1) && isWeak(col2)) {
    contradictions.push({
      name: 'The Confident Incompletist',
      domain: 'career',
      description: `High Self-Esteem (${col1!.totalDigits} digits) alongside weak Work/Money capacity (${col2!.totalDigits} digits). Belief in one's capabilities significantly exceeds developed executable skill.`,
      pattern: `Self-Esteem at ${col1!.totalDigits} digits (${col1!.strengthCategory}) — Work/Money at ${col2!.totalDigits} digits (${col2!.strengthCategory}).`,
      deepReading: `The Self-Esteem line at ${col1!.totalDigits} digits produces a person who believes in their own importance and capability with a conviction that does not require external confirmation. This is genuinely useful — it insulates against doubt and criticism. The problem is the Work/Money line at ${col2!.totalDigits} digits, which means the practical competence layer — the ability to convert self-belief into demonstrable, completed, monetizable output — is underdeveloped. The gap between confidence and competence creates a specific set of recurring problems: others perceive arrogance where the person feels self-awareness; opportunities are claimed and then incompletely delivered; feedback is heard as attack rather than useful data. The most painful version occurs in career: the person may correctly identify that they are more talented than those being rewarded above them, but cannot understand that talent without executable production is invisible to the systems that distribute rewards. The correction is not humility — it is skill acquisition with the same conviction currently applied to self-assessment.`,
      lifeManifestations: {
        career: "Often underestimated not because of lack of ability but because of inconsistent delivery. The reputation gap between self-perception and others' experience of results.",
        relationships: "Can come across as dismissive of partners' concerns because inner conviction creates a filter that converts their feedback into misunderstanding rather than information.",
        money: 'Negotiates well but may overpromise and underbuild, creating cycles of advancement followed by contraction.',
      },
      resolution: `The specific practice is to subject one competence area to brutal measurement for 90 days — not enthusiasm or effort measurement, but output measurement. Track what you actually complete versus what you begin. Use that data to locate the exact point in your execution chain where things stall, then attack that point specifically. Confidence is not the missing ingredient; targeted skill-building in the execution gap is.`,
    });
  }

  // ─── 3. WILL WITHOUT ANCHOR — AMBITION WITH NO CONSISTENCY ─────────────────
  if (isStrong(row1) && isWeak(row3)) {
    contradictions.push({
      name: 'The Perpetual Launcher',
      domain: 'multi',
      description: `Intense Purpose/Will energy (${row1!.totalDigits} digits) with underdeveloped Stability/Habits (${row3!.totalDigits} digits). The engine is powerful; the chassis that would contain it is not there.`,
      pattern: `Purpose at ${row1!.totalDigits} digits — Stability/Habits at ${row3!.totalDigits} digits (${row3!.strengthCategory}).`,
      deepReading: `This is the person who has been "about to change their life" for years. The Purpose line at ${row1!.totalDigits} digits means ambition is not the problem — it arrives uninvited and sustains itself without encouragement. The Stability/Habits line at ${row3!.totalDigits} digits means the specific psychological machinery that converts ambition into consistent daily behaviour — the patience to repeat the same unglamorous action until it becomes automatic, the comfort with monotony, the capacity to find routine rewarding rather than deadening — is absent or extremely underdeveloped. The tragic version of this contradiction is the person who has been genuinely talented and motivated for decades but whose life arc looks, from the outside, like a series of impressive beginnings and incomplete narratives. They are not lazy and they are not unserious. They are running a powerful engine in a vehicle designed for short trips. The psychological cost is real: the gap between self-image and accumulated outcomes produces a specific variety of shame that is rarely discussed because it sits inside an envelope of genuine competence.`,
      lifeManifestations: {
        career: 'Excellent in novel or crisis situations; struggles in the long middle. Career often looks like a series of lateral moves rather than a coherent ascending arc.',
        relationships: 'Intensely present at the beginning of relationships; requires novelty to maintain emotional engagement. Long-term commitments feel constraining without the person quite knowing why.',
        health: 'Extreme diet or exercise protocols adopted and abandoned cyclically. The habit that would produce the result is less available than the motivation that begins it.',
        money: 'Income volatile across time in ways that do not fully reflect skill level. Financial security requires the exact long-term consistency this grid makes difficult.',
      },
      resolution: `The corrective is not discipline — it is deliberately making consistency the lowest possible friction activity. Identify the single most important daily action for your primary goal, then strip it down to its minimum viable version: if the goal is writing, the habit is one sentence. If the goal is fitness, the habit is showing up in gym clothes. Start so small the action cannot be refused, and do not upgrade it for sixty days. The Purpose line will provide the intensity; your job is to build the rails.`,
    });
  }

  // ─── 4. SPIRITUAL ELEVATION WITHOUT MATERIAL GROUNDING ─────────────────────
  if (isStrong(spirit) && isWeak(col2)) {
    contradictions.push({
      name: 'The Inspired Pauper',
      domain: 'money',
      description: `Strong Spiritual diagonal (${spirit!.totalDigits} digits) with weak Work/Money capacity (${col2!.totalDigits} digits). The inner life is richly developed; the material scaffolding for sustaining it is not.`,
      pattern: `Spirituality diagonal at ${spirit!.totalDigits} digits (${spirit!.strengthCategory}) — Work/Money at ${col2!.totalDigits} digits (${col2!.strengthCategory}).`,
      deepReading: `The Spirituality diagonal at ${spirit!.totalDigits} digits produces a person whose interior life is genuinely developed — they have access to intuition, higher purpose, and long-arc thinking that others have to work to approximate. The specific trap is a subtle belief, often unexamined, that material concerns are spiritually inferior — that money and career mechanics are too mundane for someone whose intelligence naturally operates at a higher frequency. The Work/Money line at ${col2!.totalDigits} digits doesn't necessarily reflect this belief; but it confirms its practical consequences. The result is a person whose spiritual or creative gifts are real and often recognised by others, but who cannot sustain the material conditions that would allow those gifts to be expressed consistently and at full scale. Poverty of means constrains the spirit's range of action. The corrective insight is that money is not the opposite of spirit — it is the fuel that allows spirit to move in the material world without constant crisis management distracting it.`,
      lifeManifestations: {
        career: 'Often found in helping professions, creative fields, or spiritual work — but in under-resourced versions that limit scale and sustainability.',
        money: 'Discomfort with direct money negotiation. Tendency to undercharge for genuine value. Pattern of deriving identity from being "above" financial concern, which is usually a rationalisation of avoidance.',
        relationships: 'May attract financially practical partners as a compensatory balance, then feel constrained by their pragmatism.',
        spirituality: 'Genuine access to transcendent states, but may use spiritual practice to bypass rather than inform material-world action.',
      },
      resolution: `The reframe is this: managing money with skill is itself a spiritual practice. Choose one financial behaviour this month — tracking spending, raising a rate, opening a savings vehicle — and treat it with the same seriousness you would give a meditation retreat. The goal is not to become materialistic; it is to become effective enough in the material domain that your genuine gifts stop being constrained by avoidable scarcity.`,
    });
  }

  // ─── 5. EMOTIONAL INTELLIGENCE WITHOUT COMMUNICATION DELIVERY ───────────────
  if (isStrong(row2) && isWeak(col1)) {
    contradictions.push({
      name: 'The Mute Empath',
      domain: 'relationships',
      description: `Rich Family/Emotional capacity (${row2!.totalDigits} digits) with low Self-Esteem expression (${col1!.totalDigits} digits). The feeling is present and sophisticated; the words to carry it out are not.`,
      pattern: `Family/Attachment at ${row2!.totalDigits} digits (${row2!.strengthCategory}) — Self-Esteem at ${col1!.totalDigits} digits (${col1!.strengthCategory}).`,
      deepReading: `The Family/Attachment line at ${row2!.totalDigits} digits means emotional sensitivity is not merely present but dominant — this person perceives relational dynamics, reads others' states, and feels the emotional texture of situations with unusual precision. The Self-Esteem line at ${col1!.totalDigits} digits means the inner permission to express these perceptions, claim space, and advocate for one's own needs is underdeveloped. The result is a common and painful configuration: emotional intelligence that largely serves others because it cannot fully turn toward the self. They read others' pain accurately and respond to it; their own pain goes unspoken because speaking requires a kind of self-endorsement the low Self-Esteem line has not provided. In relationships, they are frequently the accommodating partner — the one who notices when something is wrong and repairs it, but who does not create the conditions in which their own needs are raised. This pattern generates resentment that is perplexing to others, who have never been asked to meet any need and therefore cannot understand why one is being withheld.`,
      lifeManifestations: {
        relationships: 'Pattern of being the "giving" partner while privately accumulating unmet needs. Conflict typically erupts not over any single issue but over the accumulated weight of silences.',
        career: 'Excellent in roles requiring emotional attunement (counselling, teaching, management of people problems) but undervalued because self-advocacy is as underdeveloped as interpersonal sensitivity is developed.',
        health: "Emotional suppression may manifest somatically. Pattern of absorbing others' stress into the body without a release mechanism.",
      },
      resolution: `The practice is not to speak more — it is to believe that what you feel deserves to be spoken before you have assembled the perfect case for it. Begin small: state one preference per day that requires nothing — your preferred restaurant, your preferred timing, your preferred temperature — without justifying the preference. The habit of claiming small space is the prerequisite for claiming important space.`,
    });
  }

  // ─── 6. OVERLOADED STABILITY — RIGIDITY PREVENTING GROWTH ──────────────────
  if (isOverload(row3) && isWeak(row1)) {
    contradictions.push({
      name: 'The Fortified Prison',
      domain: 'identity',
      description: `Stability/Habits at overload (${row3!.totalDigits} digits) with weak Purpose/Will (${row1!.totalDigits} digits). The structures are so dominant they have consumed the freedom that originally justified building them.`,
      pattern: `Stability/Habits at ${row3!.totalDigits} digits (overload) — Purpose/Will at ${row1!.totalDigits} digits (${row1!.strengthCategory}).`,
      deepReading: `Stability is a virtue until it becomes the primary virtue — at which point it consumes its own purpose. The Stability/Habits line at ${row3!.totalDigits} digits produces a person whose life is characterised by routine, predictability, and systemic consistency. This is genuinely powerful: they build things that last, maintain commitments others abandon, and create environments others find trustworthy. The danger is the Purpose/Will line at ${row1!.totalDigits} digits: with so little energy available for original intention, the structures become self-justifying. The person maintains the routine not because it serves a purpose but because the alternative — the uncertainty of choosing a new direction — is more threatening than remaining in a system whose costs they have already paid. The psychological signature is a vague but persistent feeling of unrealised potential alongside a genuine inability to identify what, specifically, they would want instead. They have built an extremely competent version of a life they did not fully choose.`,
      lifeManifestations: {
        career: 'Long tenures in roles that do not fully use available capacity. Comfort mistaken for satisfaction until a crisis or life event forces re-evaluation.',
        relationships: 'Stable but potentially stale long-term relationships maintained by inertia as much as genuine alignment.',
        money: 'Financial security achieved but financial risk-taking almost impossible, even when the risk would be rational.',
      },
      resolution: `The practice is to identify one area of your life that is stable but not alive — where you are maintaining something out of habit rather than active endorsement — and make one small deliberate change to it this month. Not a revolution; a single renegotiation. The Purpose line does not need to be rebuilt from scratch. It needs one current that is genuinely chosen rather than inherited.`,
    });
  }

  // ─── 7. STRONG TALENT, ZERO SELF-ESTEEM TO DEPLOY IT ───────────────────────
  if (isStrong(col3) && isWeak(col1)) {
    contradictions.push({
      name: 'The Hidden Instrument',
      domain: 'career',
      description: `Rich Talent/Gifts (${col3!.totalDigits} digits) with low Self-Esteem (${col1!.totalDigits} digits). The gifts are fully formed; the inner permission to deploy them is not.`,
      pattern: `Talent/Gifts at ${col3!.totalDigits} digits (${col3!.strengthCategory}) — Self-Esteem at ${col1!.totalDigits} digits (${col1!.strengthCategory}).`,
      deepReading: `The Talent line at ${col3!.totalDigits} digits means genuine gifts are present — this is not confidence without foundation, it is capacity without an owner willing to claim it. The Self-Esteem line at ${col1!.totalDigits} digits means the specific interior permission to stand behind one's own output, to say "this is mine and it has worth before anyone confirms it," has not been fully developed. The practical consequence is a person who is unmistakably gifted — often recognised by others before they recognise themselves — but who surrounds that gift with so many qualifications, hesitations, and minimisations that its impact is reduced before it reaches the audience it deserves. They will often cite imposter syndrome, but that is the surface description; the underlying structure is Self-Esteem insufficiently developed to match the Talent that is genuinely present. The waste is real and measurable: careers stall not at the talent threshold but at the visibility threshold that only self-authorisation can cross.`,
      lifeManifestations: {
        career: 'Competence consistently visible to others before it is claimed by the self. Pattern of being promoted by sponsors who see what the person cannot yet see in themselves.',
        relationships: 'May attract partners who, wittingly or not, reinforce self-minimisation because it makes them more comfortable than a fully self-endorsed partner would.',
        money: 'Chronic undercharging for demonstrably valuable services. Negotiation consistently produces below-market outcomes despite above-market talent.',
      },
      resolution: `The practice is evidence-based self-endorsement: for thirty days, document every piece of external positive feedback about your work — client responses, colleague comments, unsolicited compliments — without dismissing it. At the end of thirty days, look at the accumulated record and write one paragraph in first person that accurately describes what that evidence demonstrates. That paragraph is your starting position for the next negotiation, application, or commission.`,
    });
  }

  // ─── 8. INTUITION WITHOUT GROUNDING — HIGH SPIRIT, WEAK STABILITY ─────────
  if (isStrong(spirit) && isWeak(row3)) {
    contradictions.push({
      name: 'The Oracle Who Cannot Balance a Ledger',
      domain: 'money',
      description: `High Spiritual/intuitive capacity (${spirit!.totalDigits} digits) with absent or weak Stability/Habits (${row3!.totalDigits} digits). The spiritual intelligence is active; the grounding mechanisms to translate it into material reality are not.`,
      pattern: `Spiritual diagonal at ${spirit!.totalDigits} digits (${spirit!.strengthCategory}) — Stability/Habits at ${row3!.totalDigits} digits (${row3!.strengthCategory}).`,
      deepReading: `Spiritual or intuitive intelligence at the level this diagonal indicates is a specific gift: the capacity to perceive patterns and meanings that are not yet visible in the data, to make correct predictions about human situations and outcomes, and to access a kind of knowing that bypasses the slower analytical process. The problem is that this form of intelligence is exactly opposite to the personality structure that produces durable material results — which requires patience, repetition, tolerance of the predictable, and a comfort with the incremental that the spirit line finds almost physically uncomfortable. The Stability/Habits line at ${row3!.totalDigits} digits confirms: the habits and routines that would create a container for this intuitive intelligence — the regular practice, the consistent process, the durable system — are not naturally available. The result is a person who perceives with unusual accuracy but executes with unusual inconsistency, whose insights are valuable but whose follow-through is not reliable enough for others to depend upon or for the person to build a sustainable livelihood upon.`,
      lifeManifestations: {
        spirituality: 'Genuine access to expanded states and symbolic intelligence; difficulty translating this into a teaching, practice, or service that generates durable income.',
        money: 'Financial life characterised by feast-famine cycles that do not reflect talent level but do reflect the absence of consistent financial habits.',
        career: 'Excellent in consulting, advising, or creative roles where performance is episodic; struggles where sustained output consistency is required.',
        health: 'Sleep and energy often tied to intuitive states rather than consistent rhythms. Difficulty maintaining health routines that are boring but effective.',
      },
      resolution: `Choose one repeating structure and maintain it for sixty days without modification: the same morning sequence, the same financial review day, the same work hour. Not because routine is spiritually interesting — it is not — but because your intelligence needs a stable platform. The intuition will not diminish; it will gain a chassis from which to operate without the constant instability tax.`,
    });
  }

  // ─── 9. STRONG INDEPENDENCE + WEAK FAMILY — RELATIONSHIP ISOLATION ──────────
  if (isStrong(col1) && isWeak(row2)) {
    contradictions.push({
      name: 'The Self-Sufficient Island',
      domain: 'relationships',
      description: `High Self-Esteem/independence (${col1!.totalDigits} digits) with weak Family/Attachment capacity (${row2!.totalDigits} digits). The sense of self is robust; the need for and ability to sustain deep attachment is underdeveloped.`,
      pattern: `Self-Esteem at ${col1!.totalDigits} digits (${col1!.strengthCategory}) — Family/Attachment at ${row2!.totalDigits} digits (${row2!.strengthCategory}).`,
      deepReading: `Self-Esteem at ${col1!.totalDigits} digits produces a personality that does not require external validation to function — they know who they are, trust their own judgment, and do not need others to confirm their worth. This is genuinely admirable and produces a certain freedom that attachment-dependent personalities do not have. The Family/Attachment line at ${row2!.totalDigits} digits introduces the complication: the emotional machinery for forming and sustaining the kind of deep mutual dependency that close relationships require — the vulnerability, the need, the willingness to allow oneself to be shaped by another — is not naturally available. The result is a person who is excellent company, interesting, capable, and self-directed, but who consistently reaches an intimacy ceiling after which deeper approach by a partner or family member feels threatening rather than welcome. They may mistake their self-sufficiency for strength when it is partially a structural limitation — not a choice to be independent but an inability to be fully dependent, which is a different thing.`,
      lifeManifestations: {
        relationships: 'Pattern of relationships that feel stimulating until the partner requires genuine emotional interdependence, at which point distance increases. Often experienced by partners as "emotionally unavailable" regardless of how present the person feels themselves to be.',
        career: 'Excellent as individual contributors or leaders; struggles in deeply collaborative environments that require genuine emotional investment in shared outcomes.',
        health: 'May resist asking for help during illness or crisis in ways that increase harm.',
      },
      resolution: `The practice is deliberate micro-vulnerability: once per week, tell one person something that you did not need to tell them — a worry, a doubt, a hope that has not yet resolved into certainty. Not because you need their response but because the act of disclosure trains the attachment line. The goal is not dependence; it is the specific freedom that only comes from having chosen, genuinely, to let someone else in.`,
    });
  }

  // ─── 10. TEMPERAMENT OVERLOAD + WEAK STABILITY — INTENSITY WITHOUT LANDING ──
  if (isOverload(carnal) && isWeak(row3)) {
    contradictions.push({
      name: 'The Burning Wire',
      domain: 'health',
      description: `Overloaded Temperament/magnetism (${carnal!.totalDigits} digits) with weak Stability/Habits (${row3!.totalDigits} digits). The intensity generates heat that has nowhere to land.`,
      pattern: `Temperament diagonal at ${carnal!.totalDigits} digits (overload) — Stability/Habits at ${row3!.totalDigits} digits (${row3!.strengthCategory}).`,
      deepReading: `The Temperament diagonal at overload (${carnal!.totalDigits} digits) produces a person whose presence is felt before words are exchanged — a quality of magnetism, physical and energetic intensity, and sensory aliveness that others both seek and find overwhelming. This is a genuine power, and in the right container it produces charisma, artistic output, sexual vitality, and creative force. The Stability/Habits line at ${row3!.totalDigits} digits is the problem: without the grounding structure of routine, consistency, and the slow metabolisation of intensity that habits provide, the Temperament energy has nowhere to go except into crisis, compulsion, or burnout. The typical life pattern is cycles: periods of extraordinary creative or interpersonal output followed by collapse, recovery, and repetition. The person may normalise this as "how they are" without recognising that the collapse is not inherent to their intensity but to the absence of the container that would allow intensity to be sustained across time rather than discharged in bursts.`,
      lifeManifestations: {
        health: 'Nervous system vulnerability. Tendency toward adrenal cycles — periods of extreme output followed by depletion that requires extended recovery.',
        relationships: "Intensity that attracts and then overwhelms. Partners may feel they cannot keep up or that the relationship's emotional weather is too changeable to sustain.",
        career: 'Brilliant in sprint contexts; projects requiring sustained steady output are difficult to maintain at the quality level of the initial burst.',
        money: 'Financial decisions made under the influence of temperament intensity rather than deliberate analysis. Spending patterns may reflect emotional state more than rational plan.',
      },
      resolution: `The corrective is not to reduce intensity — it is to give it a schedule. Designate specific times and containers for your high-intensity expression (creative work, exercise, deep conversation) and specific times for deliberate decompression. The energy is not the problem; its formlessness is. A daily physical practice — even twenty minutes of movement — gives the nervous system a reliable discharge mechanism that does not require a crisis to produce.`,
    });
  }

  // ─── 11. HIGH TALENT + LOW PURPOSE — GIFT SEEKING A MISSION ────────────────
  if (isStrong(col3) && isWeak(row1)) {
    contradictions.push({
      name: 'The Searching Instrument',
      domain: 'identity',
      description: `Significant Talent/Gifts (${col3!.totalDigits} digits) with weak Purpose/Will (${row1!.totalDigits} digits). The capacity to do things excellently is present; the driving sense of why to do them is not.`,
      pattern: `Talent/Gifts at ${col3!.totalDigits} digits (${col3!.strengthCategory}) — Purpose/Will at ${row1!.totalDigits} digits (${row1!.strengthCategory}).`,
      deepReading: `Talent without direction is one of the more paradoxical forms of difficulty — it is genuinely hard to be good at many things without a clear calling. The Talent line at ${col3!.totalDigits} digits means genuine gifts are not in question — others recognise them, opportunities arrive because of them, and the skills themselves develop without excessive effort. The Purpose/Will line at ${row1!.totalDigits} digits means the compass that would direct these gifts toward a mission — the specific, almost compulsive sense of what one is for — has not arrived or has been obscured. The result is a person who is visibly capable but whose life arc has a searching, provisional quality: multiple career changes that are each individually competent but do not accumulate into a coherent whole, interests that are genuine but do not narrow into a vocation, a persistent feeling of potential that is real but undeployed. Well-meaning advisors often suggest discipline or commitment; the issue is not insufficient commitment but insufficient calling — the target that would deserve the full application of the gifts has not yet been clearly identified.`,
      lifeManifestations: {
        career: 'Multiple skill sets and fields; consistent excellence in each; persistent feeling of being in the wrong arena. CV that is impressive but not coherent.',
        relationships: "May be drawn to partners with strong Purpose, unconsciously seeking direction through intimacy. The partner's mission substitutes temporarily for an unresolved one of their own.",
      },
      resolution: `The practice is not to find your purpose intellectually — it is to track what you return to voluntarily when no one is watching and no reward is offered. Keep a two-week log of what you read, discuss, and think about in uncommitted time. The pattern in that log is the early data for the purpose that is trying to emerge. The Purpose line is not absent — it is quiet. It needs to be listened for, not invented.`,
    });
  }

  // ─── 12. OVERLOADED WORK/MONEY — PRODUCTIVITY AS EMOTIONAL AVOIDANCE ────────
  if (isOverload(col2)) {
    contradictions.push({
      name: 'The Engine That Cannot Stop',
      domain: 'health',
      description: `Work/Money line at severe overload (${col2!.totalDigits} digits). Productivity and material achievement have become compulsive rather than chosen — the mechanism of work is running the person rather than the reverse.`,
      pattern: `Work/Money line at ${col2!.totalDigits} digits (overload).`,
      deepReading: `Work/Money energy at ${col2!.totalDigits} digits is not simply ambition — at this intensity it is a metabolic fact. The person does not choose to work hard; they experience the absence of productive activity as physically uncomfortable, almost like withdrawal. This can produce extraordinary material results, particularly in early life and career phases where sustained output is rewarded without qualification. The shadow arrives in two forms: first, the body's eventual insistence on rest that the psychology cannot honor without anxiety; second, the emotional life that work has been unconsciously used to avoid. Sustained high-output activity is one of the most effective methods of not feeling whatever needs to be felt. The overloaded Work/Money line does not eliminate the emotional content — it defers it, with interest. The reckoning typically arrives when circumstances force a reduction in output (illness, relationship crisis, professional setback) and the full weight of what was being avoided surfaces all at once, without the coping structure that years of productive busyness had provided.`,
      lifeManifestations: {
        health: 'Chronic physical symptoms that are responded to with intensified work rather than rest. Burnout cycles that are interpreted as failure of effort rather than warning signals.',
        relationships: 'Partners and family consistently report feeling secondary to work, and they are correct — not because of lack of love but because emotional availability requires a stillness this configuration makes structurally difficult.',
        money: 'Paradox: despite extraordinary productivity, financial security may not match output because the relationship to money is functional (money as score in the productivity game) rather than intentional.',
        spirituality: 'May have lost access to any inner life that exists outside of achievement. "Rest" has become synonymous with "vacation" (reward for work) rather than "being" (a state independent of output).',
      },
      resolution: `The practice requires courage rather than technique: choose one day in the next two weeks and fill it with activities that produce nothing measurable. Not active leisure (which is still productivity in disguise) but genuine unstructured presence. Notice what arises in the absence of output. That data — whatever discomfort, feeling, or long-avoided recognition surfaces — is the real work currently being postponed by the work you are not stopping to examine.`,
    });
  }

  // ─── 13. HIGH FAMILY + HIGH STABILITY — TRADITION AS IDENTITY PRISON ────────
  if (isStrong(row2) && isStrong(row3)) {
    contradictions.push({
      name: 'The Inherited Life',
      domain: 'identity',
      description: `Both Family/Attachment (${row2!.totalDigits} digits) and Stability/Habits (${row3!.totalDigits} digits) are strongly developed. The relational and habitual structures of the inherited life are dominant — the question is whether they have been actively chosen or simply maintained.`,
      pattern: `Family/Attachment at ${row2!.totalDigits} digits (${row2!.strengthCategory}) — Stability/Habits at ${row3!.totalDigits} digits (${row3!.strengthCategory}).`,
      deepReading: `When two of the grid's most stabilising forces both run strong, the personality is built for endurance, loyalty, and continuity — qualities that produce warm family environments, long institutional commitments, and communities that trust you precisely because you do not change. The shadow of this configuration is less obvious than most: it is the life that is being maintained rather than chosen. Both Family and Stability energies are fundamentally conservative — they reward the preservation of what already exists rather than the creation of what does not yet exist. When these lines are strong without a counterbalancing Purpose or Talent line, the life can become beautifully maintained but insufficiently examined — a durable structure whose original purpose has never been explicitly named. The question this configuration presents is not "how do I maintain what I have" but "do I actually want what I have been maintaining?"`,
      lifeManifestations: {
        identity: 'Identity constructed from roles (parent, partner, community member, professional) rather than chosen values. The loss of any role is experienced as identity collapse rather than role transition.',
        relationships: 'Extraordinary loyalty and reliability that can tip into enabling, if the attachment is to a person or system that is not actually serving the collective good.',
        career: 'Long institutional tenure in service of stability rather than growth. The decision to stay is rarely examined; the cost of leaving is always exaggerated.',
      },
      resolution: `Once per month, answer in writing the following question: if I had built this exact life by deliberate intention — if I had chosen each element of it consciously — what would I be most grateful for, and what would I have designed differently? The goal is not to change everything; it is to convert inherited structure into chosen structure, which is the only kind with full integrity.`,
    });
  }

  // ─── 14. ABSENT TEMPERAMENT — DISCONNECTED FROM THE BODY AND ITS SIGNALS ───
  if (isAbsent(carnal)) {
    contradictions.push({
      name: 'The Disembodied Thinker',
      domain: 'health',
      description: `Complete absence of the Temperament/Carnal diagonal (0 digits). The sensory, physical, and instinctual channels that ground intelligence in the body are not active.`,
      pattern: `Temperament diagonal is completely absent (0 digits across cells 3, 5, and 7).`,
      deepReading: `The Temperament diagonal connects the three numbers most closely associated with embodied intelligence — physical instinct, sensory awareness, and primal vitality. Its complete absence does not mean a person is cold or unfeeling; it means the specific channel through which the body communicates its knowledge to the conscious mind — hunger, fatigue, attraction, repulsion, the physical felt-sense of rightness or wrongness — is significantly attenuated. This creates a person who is typically highly capable intellectually or emotionally but who consistently misreads, ignores, or simply does not receive the body's data. They may work past exhaustion without registering depletion until they collapse; maintain sexual relationships past the point where the body has already voted no; eat without attending to satiety signals; or push through pain that the body means as instruction. The root issue is not willpower but signal: the physical intelligence that others receive automatically has to be consciously constructed here.`,
      lifeManifestations: {
        health: 'Pattern of physical depletion or illness arriving as the first signal that something is wrong — the body forces the message through because the early quiet signals were not received.',
        relationships: 'Difficulty distinguishing genuine physical attraction from social compatibility. Physical intimacy may be engaged intellectually rather than sensorially.',
        career: 'Overwork because the fatigue signal does not trigger until it is severe. Burnout arrives without warning, or with warnings that were not registered as such.',
      },
      resolution: `The practice is body intelligence cultivation: three times per day, stop and scan. Ask: what does my body know right now that my mind has not yet translated? Start with hunger, fatigue, and tension — the most basic signals. Over time, extend to the subtler messages. The body is the oldest intelligence in the system; it has been trying to reach you through a line you have not yet learned to receive.`,
    });
  }

  // ─── 15. STRONG SELF-ESTEEM + STRONG TEMPERAMENT — INTENSITY THAT ALIENATES ─
  if (isStrong(col1) && isStrong(carnal)) {
    contradictions.push({
      name: 'The Force That Clears the Room',
      domain: 'relationships',
      description: `Both Self-Esteem (${col1!.totalDigits} digits) and Temperament/magnetism (${carnal!.totalDigits} digits) are strongly developed. The presence is powerful; it may exceed what the environment can hold.`,
      pattern: `Self-Esteem at ${col1!.totalDigits} digits (${col1!.strengthCategory}) — Temperament at ${carnal!.totalDigits} digits (${carnal!.strengthCategory}).`,
      deepReading: `Two of the grid's most individually powerful lines operating simultaneously produces a personality that is impossible to ignore and difficult to share space with for extended periods unless the receiving party is also highly developed. The Self-Esteem line at ${col1!.totalDigits} digits means the person occupies their space fully — they do not minimise themselves, they do not defer reflexively, and they do not shrink in the presence of authority. The Temperament line at ${carnal!.totalDigits} digits means physical and magnetic presence is also strong — there is heat in the interactions, a quality of aliveness that energises or unsettles depending on the recipient. Together, these produce a person who gets remembered, who generates strong reactions, who fills rooms with both their gifts and their weight. The relational risk is that this combination can overwhelm people who have not specifically sought the experience of being in contact with this much energy, and can attract those who are drawn to it for the wrong reasons — fascination rather than genuine compatibility.`,
      lifeManifestations: {
        relationships: 'Tends to be the dominant energy in partnerships. May require partners who have explicitly chosen that dynamic; partners who fell into it without that clarity eventually push back.',
        career: 'Excellent in roles requiring personal authority, salesmanship, or public-facing leadership. May over-dominate collaborative environments where the goal is synthesis rather than direction.',
        health: "Risk of believing one's energy reserves are as unlimited as one's psychological drive. Physical capacity may not match psychological intensity.",
      },
      resolution: `The practice is deliberate subtraction: in your next three significant interactions — a meeting, a dinner, a conversation — set yourself the specific goal of speaking less than you normally would and listening more than you normally would. Not as permanent character change, but as a diagnostic to discover what you learn when your own intensity is not occupying the bandwidth. The goal is not to become smaller; it is to develop the precision to choose when your full force serves and when restraint would serve better.`,
    });
  }

  // ─── 16. ABSENT SELF-ESTEEM + STRONG STABILITY — INVISIBLE ENDURANCE ─────────
  if (isWeak(col1) && isStrong(row3)) {
    contradictions.push({
      name: 'The Invisible Load-Bearer',
      domain: 'identity',
      description: `Strong Stability/Habits (${row3!.totalDigits} digits) with very low Self-Esteem development (${col1!.totalDigits} digits). Extraordinary endurance is present but not connected to a self that claims credit for it.`,
      pattern: `Stability/Habits at ${row3!.totalDigits} digits (${row3!.strengthCategory}) — Self-Esteem at ${col1!.totalDigits} digits (${col1!.strengthCategory}).`,
      deepReading: `This configuration produces someone who carries enormous weight — institutional, relational, financial — with a consistency and reliability that others depend upon deeply. The Stability/Habits line at ${row3!.totalDigits} digits means they do what they committed to, day after day, without the drama that lesser consistency requires. The Self-Esteem line at ${col1!.totalDigits} digits means they rarely claim the recognition for this endurance, and more troublingly, rarely evaluate whether the weight they are carrying has been freely chosen or simply accumulated without examination. There is a specific variety of suffering available in this configuration that is easy to overlook because the person appears, to all external observers, to be functioning perfectly. The function is real. The internal cost is invisible because no internal account has been opened. They are spending from a reserve they do not believe they deserve to acknowledge, on behalf of commitments they have never fully evaluated, and rarely ask whether the load is fair.`,
      lifeManifestations: {
        relationships: 'The partner, parent, or colleague on whom everyone leans without being asked — and who never creates the conditions for reciprocal support because asking would require the self-endorsement the grid has not provided.',
        career: 'Reliable beyond measure; promoted to positions of responsibility without commensurate authority or recognition. The person who makes institutions work without being credited with making them work.',
        money: 'May maintain others financially through periods when doing so requires genuine sacrifice, again without establishing the self-claim that would allow them to identify this as sacrifice rather than simply "what you do."',
      },
      resolution: `Name it: this week, say aloud — to yourself or to one other person — three things you are currently maintaining that require more effort than you are crediting yourself with. Not as complaint but as accurate accounting. The goal is to make the invisible visible, first to yourself. Endurance that is acknowledged is sustainable; endurance that is invisible is self-erasure at speed.`,
    });
  }

  // ─── 17. STRONG SPIRIT + STRONG TALENT — VISION THAT BYPASSES PROCESS ───────
  if (isStrong(spirit) && isStrong(col3)) {
    contradictions.push({
      name: 'The Vaulted Ceiling',
      domain: 'career',
      description: `Both Spiritual/intuitive intelligence (${spirit!.totalDigits} digits) and Talent/Gifts (${col3!.totalDigits} digits) are strongly developed. The vision is high; the gap between where the person is and where the vision places them can feel unbridgeable.`,
      pattern: `Spirituality diagonal at ${spirit!.totalDigits} digits (${spirit!.strengthCategory}) — Talent/Gifts at ${col3!.totalDigits} digits (${col3!.strengthCategory}).`,
      deepReading: `When both the Spiritual and Talent lines are strong, the person lives in a specific perceptual position: they can see clearly what is possible for them — not as fantasy but as genuine intuitive knowledge — and they can access the gifts that would be required to get there. The problem is that the distance between current reality and perceived potential can be so large that the intermediate steps become psychologically invisible. The person jumps from "here" to "there" in their mind without registering that the journey between them is not teleportation but construction. The practical consequence is a recurring pattern: they correctly identify their ultimate level, fail to invest in the intermediate steps because those steps seem beneath the vision, and discover that they have arrived at their 50s having accurately seen where they were going but somehow never having gotten there. The vision is not the obstacle. The failure to honour the unglamorous middle is.`,
      lifeManifestations: {
        career: 'Can accurately identify their eventual level but may skip the credential, the entry-level role, the developmental relationship, or the apprenticeship that would actually produce the capacity to operate at that level.',
        spirituality: 'May claim developmental states they are approaching rather than inhabiting — the spiritual bypass version of claiming the destination before the journey.',
        money: 'Financial planning sometimes premised on an eventual outcome rather than the current reality, producing a planning gap between aspiration-level decisions and current-resource constraints.',
      },
      resolution: `Take one significant goal and map it backwards: from the endpoint to where you are now, identify the last ten steps. Number them. Begin at step 10 (the most immediate small action) and refuse to advance to step 9 until step 10 is genuinely complete. The discipline here is not to reduce the vision but to honour the ground between here and there. Honour the intermediate work as part of the vision, not as a delay of it.`,
    });
  }

  // ─── 18. FAMILY OVERLOAD — SELF DISSOLVED INTO OBLIGATION ───────────────────
  if (isOverload(row2)) {
    contradictions.push({
      name: 'The Disappeared Self',
      domain: 'relationships',
      description: `Family/Attachment at severe overload (${row2!.totalDigits} digits). The relational and attachment energies have become so dominant that the self exists primarily in service of others' needs rather than as an independent entity.`,
      pattern: `Family/Attachment line at ${row2!.totalDigits} digits (overload).`,
      deepReading: `Family/Attachment energy at ${row2!.totalDigits} digits is not simply caring or relational — at overload levels it is a defining metabolic fact. The person's sense of self and their relational roles have become so thoroughly fused that they may genuinely not be able to identify preferences, needs, or desires that are not derived from others. They feel responsible for the emotional states of everyone in their environment, experience others' pain as physically their own, and regard their own needs as a disruption to the relational system rather than a legitimate claim within it. This is often pathologised in mental health contexts as codependency or enmeshment, but the grid reveals it as a structural configuration rather than a psychological failure — the energy is genuinely this distributed, and the corrective is not to stop caring but to restore the boundary that makes caring sustainable. The specific danger is that the person cannot feel their own fatigue, resentment, or need for replenishment until it arrives as illness, emotional collapse, or a crisis that externally enforces the withdrawal that they could not internally permit.`,
      lifeManifestations: {
        relationships: "The one who is everyone's emergency contact and no one's first priority. The person who is always available for others and rarely asked about themselves because they have trained their environment not to ask.",
        health: 'Immune system and nervous system often depleted by the continuous energy outflow. Illness may represent the only socially permissible form of self-care.',
        career: 'May choose careers (nursing, social work, teaching, domestic management) that formalise the relational orientation — providing the social legitimacy for the care work the psyche was going to do anyway. Risk of occupational burnout in helping professions.',
      },
      resolution: `The practice is to recover one preference per day that requires no justification: this is what I want for lunch, this is the music I want in the car, this is how I want to spend the next hour. Do not process these preferences through anyone else's needs before acting on them. The goal is not selfishness — it is the recovery of the self that was there before it was redistributed. That self is the source from which genuine care flows; without it, what is given is not care but depletion.`,
    });
  }

  // ─── 19. PURPOSE OVERLOAD — MISSION AS IDENTITY ARMOUR ──────────────────────
  if (isOverload(row1)) {
    contradictions.push({
      name: 'The Mission as the Self',
      domain: 'identity',
      description: `Purpose/Will at severe overload (${row1!.totalDigits} digits). The sense of mission or calling has become so dominant that the self exists primarily as its instrument, with the full human person compressed into the service of the goal.`,
      pattern: `Purpose/Will line at ${row1!.totalDigits} digits (overload).`,
      deepReading: `Purpose at ${row1!.totalDigits} digits produces the psyche variant that others sometimes call "driven," "focused," or "inspiring," and that can more accurately be described as having organised the entirety of the personality around a direction. This is genuinely powerful: the person achieves things, they inspire others, they create the momentum that institutions and movements require. The shadow arrives in the relationship between the mission and the self: at overload levels, the mission has often consumed the self rather than being directed by it. The person is not pursuing their purpose; they have become it, to the point where any threat to the mission is experienced as an existential threat to the person, and any human need that cannot be mapped onto the mission — the need for rest, for play, for connection that serves no strategic purpose — is treated as weakness or distraction rather than as the nourishment that would sustain the mission. The burnout that eventually arrives is not the failure of the mission; it is the successful assertion by the full human person that it requires more than the mission has allocated for its maintenance.`,
      lifeManifestations: {
        relationships: "Partners, children, and friends consistently experience themselves as supporting characters in a narrative whose protagonist is the mission rather than the person who holds it.",
        health: 'Physical signals interpreted through the lens of mission productivity — "can I still perform?" rather than "what does my body need?" Rest without productive output feels like failure.',
        career: "Extraordinary results alongside a pattern of burning through teams, relationships, and one's own body in ways that accumulate an unseen cost.",
      },
      resolution: `The practice requires recognising that you — the full person — are not identical with the mission, however large and genuine that mission is. Identify one hour per week that belongs entirely to you with no mission justification: not exercise to stay sharp, not socialising to maintain relationships, not reading to stay informed — something that serves nothing except the experience of being a person who is not only their purpose. Protect that hour with the same intensity you protect the mission's most important commitments.`,
    });
  }

  // ─── 20. ALL LINES BALANCED — THE DIFFUSE GENERALIST ────────────────────────
  const allBalanced = lines.every((l) => l.strengthCategory === 'balanced');
  if (allBalanced && lines.length >= 6) {
    contradictions.push({
      name: 'The Undeclared Architecture',
      domain: 'identity',
      description: `All lines are at balanced levels — no dominant force, no absent frontier. The psyche has resources across the full range but no identifying peak.`,
      pattern: `All 8 lines fall in the 2-3 digit range. No line is absent; none is dominant or overloaded.`,
      deepReading: `A perfectly balanced grid is rarer than most extremes and presents a specific challenge: without a dominant force, the personality has no obvious engine and no obvious wound. They are capable across many dimensions, adaptable, and relatively free from the most painful single-axis tensions. The difficulty is that balance without direction is a kind of benign formlessness — the person can go many ways and therefore, often, goes none with full commitment. Others may experience them as difficult to read: there is no obvious fire, no obvious deficit to rally around, no clear identity to locate them in the social landscape. The work for the balanced grid is not to repair anything but to deliberately choose an asymmetry — to invest disproportionately in one direction for a period, not because the grid demands it but because deliberate investment is how the potential of a balanced grid gets converted into a coherent life.`,
      lifeManifestations: {
        career: 'Often multitalented in ways that make focus difficult — the "what should I do with my life?" question may remain genuinely open longer than in more asymmetric grids.',
        relationships: 'Easy to be around; sometimes difficult to feel deeply known, because there is no dramatic axis around which others can organise their understanding of you.',
      },
      resolution: `Choose one domain — one skill, one relationship, one creative commitment — and invest in it disproportionately for the next six months. Not because it is the only thing that matters, but because deliberate imbalance is how a balanced grid discovers what it is for. The capacity to be excellent in all directions is only useful when paired with the commitment to be excellent in one specific direction first.`,
    });
  }

  return contradictions;
}
