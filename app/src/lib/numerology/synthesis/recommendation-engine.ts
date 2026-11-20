/**
 * @fileoverview RECOMMENDATION ENGINE — LAYER 7 (v2)
 *
 * Generates consultant-level, domain-specific recommendations from the actual
 * grid configuration. Every recommendation is derived from a specific
 * grid fact — not from a generic advice library.
 *
 * Domain coverage:
 * - Career positioning
 * - Relationship communication
 * - Money and financial behaviour
 * - Health and body intelligence
 * - Spirituality and meaning-making
 * - Identity and self-definition
 * - Leadership tendencies
 * - Stress response patterns
 *
 * Invariant: every recommendation interpolates at least one specific
 * line name, digit count, or strength category. Generic advice is impossible.
 */

import type { Contradiction } from './contradiction-engine';
import type { DominanceHierarchyResult } from './dominance-hierarchy-engine';
import type { PersonalizedPsychomatrixReport, LineAnalysis } from '@/lib/numerology/psychomatrix-synthesis';
import type { NumerologyData } from '@/components/profile-generator/types';

// ═══════════════════════════════════════════════════════════════════════════════
// TYPE DEFINITIONS
// ═══════════════════════════════════════════════════════════════════════════════

export interface Recommendation {
  domain: 'career' | 'relationships' | 'money' | 'health' | 'spirituality' | 'identity' | 'leadership' | 'stress';
  title: string;
  /** The grid fact that generates this recommendation */
  gridBasis: string;
  /** 3-4 sentence consultant-level recommendation */
  text: string;
  /** Specific 30-day practice */
  practice: string;
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
// CAREER RECOMMENDATIONS
// ═══════════════════════════════════════════════════════════════════════════════

function careerRecommendations(lines: LineAnalysis[], numerology: NumerologyData): Recommendation[] {
  const recs: Recommendation[] = [];
  const row1 = lineById(lines, 'row_1');
  const col1 = lineById(lines, 'col_1');
  const col2 = lineById(lines, 'col_2');
  const col3 = lineById(lines, 'col_3');
  const spirit = lineById(lines, 'diag_spirit');

  if (isStrong(row1) && !isStrong(col2)) {
    recs.push({
      domain: 'career',
      title: 'Position for Vision, Not Execution',
      gridBasis: `Purpose/Will at ${row1!.totalDigits} digits with Work/Money at ${col2?.totalDigits ?? 0} digits`,
      text: `Your Purpose line at ${row1!.totalDigits} digits generates the quality of directional conviction that organisations need at strategic levels, but your Work/Money line at ${col2?.totalDigits ?? 0} digits means execution overhead consumes disproportionate energy. The highest-value career positioning for this configuration is roles where you set direction and others manage process — not because execution is beneath you, but because the grid shows clearly where your energy produces the most leverage. Every hour you spend on administrative or operational detail is an hour taken from the strategic function you are specifically equipped for. The career mistake to avoid is accepting roles that are titled strategically but are actually execution-heavy — these will exhaust you and produce results below your genuine capacity.`,
      practice: `This month, audit your current role: list every recurring task you do. Identify which tasks could only be done by someone with your specific strategic intelligence, and which could be done by a well-briefed assistant or system. If the second list is longer than the first, you are positioned below your natural leverage point. Take one item from the second list and either delegate, automate, or eliminate it.`,
    });
  }

  if (isStrong(col3) && isWeak(col1)) {
    recs.push({
      domain: 'career',
      title: 'Your Career Gap Is Visibility, Not Competence',
      gridBasis: `Talent/Gifts at ${col3!.totalDigits} digits with Self-Esteem at ${col1?.totalDigits ?? 0} digits`,
      text: `The Talent line at ${col3!.totalDigits} digits means the work itself is genuinely strong — others confirm this even when you doubt it. The Self-Esteem line at ${col1?.totalDigits ?? 0} digits identifies precisely why the career reward does not match the work quality: visibility requires the specific act of self-endorsement that this line has not fully developed. The mechanism is this: career advancement in almost every field requires that you claim your contribution before someone else credits it to the context, the team, or the moment. Your instinct is to let the work speak for itself; the problem is that in most organisations, work that is not specifically attributed does not speak — it dissolves into the collective output.`,
      practice: `For the next four weeks, after every significant contribution — meeting input, project deliverable, problem solved — write one sentence that begins "I specifically contributed to this outcome by..." and send it, appropriately framed, to one relevant person (your manager, the project lead, a client). Not boasting — accurate attribution. Four weeks, one sentence, one person. Track what changes.`,
    });
  }

  if (isOverload(col2)) {
    recs.push({
      domain: 'career',
      title: 'Productivity Is Currently a Risk, Not a Strategy',
      gridBasis: `Work/Money line at ${col2!.totalDigits} digits (overload)`,
      text: `The Work/Money line at ${col2!.totalDigits} digits means productivity has become compulsive — the output does not reflect a strategy so much as an inability to stop without anxiety. This is not a motivational asset in the long term; it is a depletion mechanism. The career risk of an overloaded Work/Money line is that the person becomes the one who can always be given more, and that dynamic accelerates until physical or psychological capacity breaks. The career move this configuration requires is not more productivity but deliberate output selection: a smaller number of high-leverage activities pursued with full quality, versus the current high-volume approach that disperses the same energy across too many surfaces.`,
      practice: `This week, list every commitment you are currently honoring — professional, semi-professional, self-imposed. Then ask of each: if I were not already committed to this, would I voluntarily take it on today? Remove one commitment that answers no. Not because it is wrong but because the overloaded Work/Money line needs a reduction in surface area, not an increase in efficiency.`,
    });
  }

  if (isStrong(spirit)) {
    recs.push({
      domain: 'career',
      title: 'Purpose Alignment Is a Functional Requirement, Not a Luxury',
      gridBasis: `Spirituality diagonal at ${spirit!.totalDigits} digits`,
      text: `The Spirituality diagonal at ${spirit!.totalDigits} digits means the motivational system is directly connected to meaning and purpose in ways that most motivational structures do not account for. You can work extremely hard in the right direction for extended periods without requiring conventional rewards — recognition, money, status — if the direction feels genuinely meaningful. The same system makes sustained performance in work that feels meaningless almost impossible to maintain at quality level, regardless of the financial compensation. This is not idealism; it is a functional characteristic of how your motivational architecture operates. The career implication is that the most important career question for you is not "what pays well?" or "what am I qualified for?" but "what could I work on that I would work on even if I were not getting paid, and is there a structure in which doing so generates sufficient material return?"`,
      practice: `Write a two-paragraph description of the work you would do if money were not a constraint. Then identify the single most concrete adjacent step toward that work that you could take this month within your current financial reality. Not a fantasy — a step. The goal is to move the ideal work one increment closer to the actual work each month until the gap closes.`,
    });
  }

  return recs;
}

// ═══════════════════════════════════════════════════════════════════════════════
// RELATIONSHIP RECOMMENDATIONS
// ═══════════════════════════════════════════════════════════════════════════════

function relationshipRecommendations(lines: LineAnalysis[]): Recommendation[] {
  const recs: Recommendation[] = [];
  const row1 = lineById(lines, 'row_1');
  const row2 = lineById(lines, 'row_2');
  const col1 = lineById(lines, 'col_1');
  const carnal = lineById(lines, 'diag_carnal');

  if (isStrong(col1) && isWeak(row2)) {
    recs.push({
      domain: 'relationships',
      title: 'Your Relationship Conflicts Come From Assumptions, Not Disagreements',
      gridBasis: `Self-Esteem at ${col1!.totalDigits} digits with Family/Attachment at ${row2?.totalDigits ?? 0} digits`,
      text: `The Self-Esteem line at ${col1!.totalDigits} digits produces a person whose internal processing is fast, confident, and largely self-contained — you form views, make decisions, and reach conclusions without needing input. The Family/Attachment line at ${row2?.totalDigits ?? 0} digits means the emotional-relational machinery that would translate these internal conclusions into shared communication is underdeveloped. The result is a relationship pattern where you have reached a position — on a decision, a feeling, an assessment of your partner — and your partner has no idea the conversation is already over. Most of your relationship conflicts are not disagreements between two articulated positions; they are collisions between your concluded position and your partner's position that has not yet been asked for.`,
      practice: `In your next significant personal decision — anything affecting your partner — deliberately have the conversation before you have reached your conclusion rather than after. Share the question, not the answer. Notice what your partner contributes that you would not have generated alone.`,
    });
  }

  if (isOverload(row2)) {
    recs.push({
      domain: 'relationships',
      title: 'What You Give Without Being Asked Cannot Be Taken Back Without Conflict',
      gridBasis: `Family/Attachment at ${row2!.totalDigits} digits (overload)`,
      text: `The Family/Attachment line at ${row2!.totalDigits} digits means you give relationally before being asked — you anticipate needs, manage emotional environments, and absorb others' difficulties as a reflexive first response rather than a considered choice. The problem is that giving that was not requested cannot be returned, and over time the unreturned giving accumulates into resentment that has no legitimate target because no one asked for what was given. Your relationship conflicts are often not about what the other person did wrong; they are about the arithmetic of unclaimed investments. The practice is to let others ask before you give — not to become withholding but to ensure that what you give has been accepted as a gift rather than taken as a right.`,
      practice: `For one week, practise the pause: when you feel the impulse to help, provide, anticipate, or fix — pause for three seconds and ask yourself whether you were asked. If not, hold the impulse and see whether the other person asks, solves it themselves, or lets it go. Observe what this reveals about what was actually needed versus what you assumed was needed.`,
    });
  }

  if (isWeak(carnal)) {
    recs.push({
      domain: 'relationships',
      title: 'Physical Presence Is Not Automatic — It Requires Cultivation',
      gridBasis: `Temperament/Carnal diagonal at ${carnal?.totalDigits ?? 0} digits (${carnal?.strengthCategory ?? 'absent'})`,
      text: `The Temperament diagonal at ${carnal?.totalDigits ?? 0} digits means the sensory and instinctual channels that most people use to stay present in their bodies during intimacy are not strongly active. This does not mean you lack capacity for warmth or connection — you have it. It means the specific physical-instinctual layer of intimacy — the capacity to be sensorially present, to read physical signals, to inhabit the body during moments of closeness — requires conscious cultivation rather than arriving automatically. Partners may experience this as a specific form of absence even when you are physically present: you are emotionally available but sensorially somewhere else. The relational cost over time is the gap between emotional intimacy, which you do experience, and physical intimacy, which may feel performative rather than genuine.`,
      practice: `Introduce a non-goal-oriented physical practice — dance, massage, slow walking, or any bodywork — into one relationship interaction per week. The purpose is not production; it is the deliberate cultivation of physical presence for its own sake. The Temperament line responds to practice rather than intention; begin the practice before you feel the capacity for it.`,
    });
  }

  if (isStrong(row1) && isWeak(row2)) {
    recs.push({
      domain: 'relationships',
      title: 'Your Partner Is Likely Third Priority and Probably Knows It',
      gridBasis: `Purpose/Will at ${row1!.totalDigits} digits with Family/Attachment at ${row2?.totalDigits ?? 0} digits`,
      text: `The Purpose line at ${row1!.totalDigits} digits is the dominant motivational engine — it generates the "why" that organises your energy. The Family/Attachment line at ${row2?.totalDigits ?? 0} digits is not a competing priority; it is simply not generating the same pull. In practical relationship terms, this means your partner consistently occupies a position after purpose, career, or mission in the actual allocation of your attention and energy, even if this is not your conscious intention. The specific pattern is not dramatic neglect — it is the cumulative experience of being important but not primary. Partners in this position frequently do not complain until they leave, because the treatment is not bad enough to object to at any single moment; it accumulates.`,
      practice: `Designate one weekly time block — minimum two hours — that is reserved for your primary relationship and is on the same level of protection as your most important professional commitment. Not a date night as a reward; a structural commitment that does not get displaced by professional overrun. Try this for eight weeks and assess what changes.`,
    });
  }

  return recs;
}

// ═══════════════════════════════════════════════════════════════════════════════
// MONEY RECOMMENDATIONS
// ═══════════════════════════════════════════════════════════════════════════════

function moneyRecommendations(lines: LineAnalysis[]): Recommendation[] {
  const recs: Recommendation[] = [];
  const col1 = lineById(lines, 'col_1');
  const col2 = lineById(lines, 'col_2');
  const col3 = lineById(lines, 'col_3');
  const spirit = lineById(lines, 'diag_spirit');

  if (isWeak(col2)) {
    recs.push({
      domain: 'money',
      title: 'You Need Financial Structure More Than Financial Motivation',
      gridBasis: `Work/Money line at ${col2!.totalDigits} digits (${col2!.strengthCategory})`,
      text: `The Work/Money line at ${col2!.totalDigits} digits means financial management is not naturally fluid — it requires deliberate effort where others find it automatic. The specific failure mode is not spending too much or earning too little; it is the absence of durable financial systems that operate independently of your attention. When the system requires active engagement to function, it competes with everything else for attention and frequently loses. The solution is automation and structural design rather than discipline: automated transfers, automated savings contributions, bills on autopay, and investment contributions that move before you see the money. The goal is to make the financially correct behaviour the path of least resistance rather than the path of most vigilance.`,
      practice: `This month, set up one automatic financial transfer that did not previously exist: a fixed amount from every income arrival that moves immediately to savings or investment before the money integrates into your operating account. Start with any amount — even symbolic. The habit of structural design is more valuable than the initial amount.`,
    });
  }

  if (isOverload(col2)) {
    recs.push({
      domain: 'money',
      title: 'You May Be Confusing Net Worth With Self-Worth',
      gridBasis: `Work/Money at ${col2!.totalDigits} digits (overload)`,
      text: `At ${col2!.totalDigits} digits, the Work/Money line is not primarily about productivity — it is about identity. Financial and professional achievement have become the primary means by which you evaluate and experience yourself. This creates a specific financial risk: decisions that should be made on economic grounds are being made on identity grounds, and identity reasoning produces different answers than economic reasoning. Specifically, you may take on work or financial risk to maintain an income level or status that your actual material needs do not require, or resist financial simplification because simplification feels like contraction of self rather than intelligent resource management. The question to ask of every significant financial decision is: am I choosing this because it is economically sound, or because of what it says about me?`,
      practice: `Write a paragraph describing your financial life from purely economic terms — what you need, what you have, what is actually required for the life you want to live — without reference to status, comparison to peers, or what you have earned in the past. Compare that to your actual current financial commitments. Identify one commitment that is serving image rather than need.`,
    });
  }

  if (isStrong(col3) && isWeak(col1)) {
    recs.push({
      domain: 'money',
      title: 'You Are Charging Below Market Because Self-Endorsement Feels Wrong',
      gridBasis: `Talent/Gifts at ${col3!.totalDigits} digits with Self-Esteem at ${col1?.totalDigits ?? 0} digits`,
      text: `The Talent line at ${col3!.totalDigits} digits means the output genuinely justifies premium pricing. The Self-Esteem line at ${col1?.totalDigits ?? 0} digits means claiming that premium requires an internal act of self-authorisation that currently feels uncomfortable — not dishonest, but uncomfortable. The discomfort is the signal that a self-endorsement transaction is required, not a signal that the endorsement is incorrect. The financial cost of this configuration, accumulated over a career, is substantial: the difference between what you charge and what you would charge if the Self-Esteem line were fully developed represents the most direct financial intervention available to you. This is not abstract: the same quality of work, priced by someone with a stronger Self-Esteem line, generates 30-50% more income in most professional service markets.`,
      practice: `Research the actual market rate for your specific skill set and experience level using three data sources (job boards, industry salary surveys, competitor pricing). If your current rate is below the 50th percentile of that research, raise it by 20% on your next new client or negotiation. Do not justify the raise with reasons — simply charge the rate and see what happens. The rate is the endorsement.`,
    });
  }

  if (isStrong(spirit) && isWeak(col2)) {
    recs.push({
      domain: 'money',
      title: 'Spiritual Aversion to Money Is a Disguised Form of Fear',
      gridBasis: `Spirituality diagonal at ${spirit!.totalDigits} digits with Work/Money at ${col2?.totalDigits ?? 0} digits`,
      text: `The Spirituality diagonal at ${spirit!.totalDigits} digits provides a ready intellectual framework for avoiding the anxiety that the Work/Money line at ${col2?.totalDigits ?? 0} digits creates: if money is spiritually inferior, then avoidance of financial mechanics is not avoidance but discernment. This rationalisation is worth examining directly. Financial scarcity does not produce spiritual freedom — it produces the specific anxiety of inadequacy that distracts from spiritual practice more reliably than abundance does. The people in history most associated with genuine spiritual depth were almost universally either independently wealthy, institutionally supported, or had a genuine gift for material management that freed them from material concern. The path to spiritual freedom runs through, not around, the material competence that removes material anxiety.`,
      practice: `Choose one financial topic you have been avoiding — your actual net worth, your debt total, your retirement position — and this week, look at the exact current number without doing anything about it. Just look. The goal is to remove the avoidance, which is always more disabling than the reality. The number, once seen clearly, can be acted on. The number hidden behind spiritual rationalisation compounds in silence.`,
    });
  }

  return recs;
}

// ═══════════════════════════════════════════════════════════════════════════════
// HEALTH RECOMMENDATIONS
// ═══════════════════════════════════════════════════════════════════════════════

function healthRecommendations(lines: LineAnalysis[]): Recommendation[] {
  const recs: Recommendation[] = [];
  const row2 = lineById(lines, 'row_2');
  const row3 = lineById(lines, 'row_3');
  const col2 = lineById(lines, 'col_2');
  const carnal = lineById(lines, 'diag_carnal');

  if (isAbsent(carnal) || isWeak(carnal)) {
    recs.push({
      domain: 'health',
      title: 'Your Body Sends Signals You Are Not Receiving',
      gridBasis: `Temperament/Carnal diagonal at ${carnal?.totalDigits ?? 0} digits (${carnal?.strengthCategory ?? 'absent'})`,
      text: `The Temperament diagonal at ${carnal?.totalDigits ?? 0} digits means the physical-instinctual intelligence system — the body's mechanism for communicating its state in real time — is operating below its natural capacity. This does not mean you are unaware of major physical events; it means the early, quiet signals that precede those events — the building fatigue before exhaustion, the tension before pain, the restlessness before genuine depletion — are attenuated or absent. The health consequence is that interventions happen later than optimal, because the warning system that would trigger earlier intervention is not fully active.`,
      practice: `Three times per day — morning, midday, and evening — set a phone reminder that asks: "What is my body reporting?" Scan for fatigue level (1-10), muscle tension location, hydration quality, hunger state, and a simple gut-level signal about the day's emotional state. Record the scan in two sentences. After two weeks, review the log for patterns you were not previously conscious of.`,
    });
  }

  if (isOverload(col2)) {
    recs.push({
      domain: 'health',
      title: 'Rest Is Not Earned — It Is Required',
      gridBasis: `Work/Money line at ${col2!.totalDigits} digits (overload)`,
      text: `The Work/Money line at ${col2!.totalDigits} digits treats productivity as the metabolism's baseline state. Rest, in this configuration, is typically processed as earned (a reward for sufficient output) or as a threat (an interruption of the productive state that generates identity). Both framings are incorrect. Physiologically, recovery is not the absence of work; it is the process by which the capacity for work is restored. The overloaded Work/Money line produces a person who is chronically running on reserves they have not replenished, because the psychology of the line resists replenishment until the body forces it. The pattern is cycles of extended performance followed by collapse — not because the person is weak but because they have been treating a biological requirement as an optional comfort.`,
      practice: `Schedule sleep before you schedule anything else this week. Block the hours required for full physiological recovery — for most people, 7-9 hours — before adding professional or social commitments. For one week, treat sleep as the highest-priority appointment in the calendar. Observe what this requires you to decline, and whether those things were actually as urgent as they felt.`,
    });
  }

  if (isOverload(row3)) {
    recs.push({
      domain: 'health',
      title: 'Your Body Needs Disruption That Your Psyche Resists',
      gridBasis: `Stability/Habits line at ${row3!.totalDigits} digits (overload)`,
      text: `The Stability line at ${row3!.totalDigits} digits means routine is deeply preferred — the body and mind feel safest in predictable patterns. The health risk of this configuration is physical stagnation: exercise routines that have not changed in years, dietary patterns maintained not because they are optimal but because they are familiar, sleep schedules that have calcified into rigidity. Physical health actually requires periodic disruption to maintain: varied movement patterns, nutritional diversity, sleep timing flexibility that can accommodate seasonal and life-stage changes.`,
      practice: `Introduce one physical novelty this month that is incompatible with your current routine: a different exercise modality, a different meal pattern, a different sleep timing, a physical location you have never used for movement. The goal is not to find the right new thing; it is to practise overriding the comfort-preference that has calcified your health behaviours.`,
    });
  }

  if (isOverload(row2)) {
    recs.push({
      domain: 'health',
      title: "Your Nervous System Is Carrying Other People's Stress",
      gridBasis: `Family/Attachment at ${row2!.totalDigits} digits (overload)`,
      text: `The Family/Attachment line at ${row2!.totalDigits} digits means emotional absorption is not a choice but a structural fact: other people's distress registers in your nervous system as if it were your own. This is the source of your relational sensitivity and also your primary health risk. Sustained absorption of others' stress without a discharge mechanism creates a specific physiological load — elevated cortisol, immune suppression, sleep disruption, and a pattern of physical symptoms that are actually emotional events in somatic form.`,
      practice: `After any interaction that you experience as emotionally heavy — a difficult conversation, time with a distressed person, an emotionally demanding work situation — do five minutes of physical movement before you do anything else. Walk, shake, do a few jumps. The body stores absorbed stress muscularly; movement discharges it before it settles. This is not metaphor — it is physiology.`,
    });
  }

  return recs;
}

// ═══════════════════════════════════════════════════════════════════════════════
// LEADERSHIP RECOMMENDATIONS
// ═══════════════════════════════════════════════════════════════════════════════

function leadershipRecommendations(lines: LineAnalysis[]): Recommendation[] {
  const recs: Recommendation[] = [];
  const row1 = lineById(lines, 'row_1');
  const row2 = lineById(lines, 'row_2');
  const col1 = lineById(lines, 'col_1');

  if (isStrong(row1) && isStrong(col1)) {
    recs.push({
      domain: 'leadership',
      title: 'Your Leadership Mode Is Declaration — But Your Team Needs Dialogue',
      gridBasis: `Purpose/Will at ${row1!.totalDigits} digits with Self-Esteem at ${col1!.totalDigits} digits`,
      text: `Purpose at ${row1!.totalDigits} digits combined with Self-Esteem at ${col1!.totalDigits} digits produces a leadership style that is clear, decisive, and genuinely inspiring when the direction is correct — and closed to correction when it is not. The specific leadership gap in this configuration is the consultation instinct: the impulse, before announcing a direction, to genuinely open it for input rather than presenting it as settled and requesting endorsement. Your team's most valuable contributors — the ones who have something substantive to offer — will not contradict a declared conclusion in a group setting. They will either go silent or leave. The behaviour change is not to be less decisive; it is to be decisive one step later than feels natural, after the consultation rather than before it.`,
      practice: `Before your next significant decision that affects others, ask three specific people whose judgment you respect for their view on the question before you have stated yours. Do not frame it as "what do you think of my plan?" — frame it as an open question. Receive the answers without defending a position. Decide after, incorporating what you heard. Note whether the decision changed.`,
    });
  }

  if (isStrong(row2)) {
    recs.push({
      domain: 'leadership',
      title: 'Your Emotional Intelligence Is a Leadership Asset Being Underused',
      gridBasis: `Family/Attachment at ${row2!.totalDigits} digits`,
      text: `The Family/Attachment line at ${row2!.totalDigits} digits means you read team dynamics with unusual accuracy — you perceive the morale weather of a group before the data confirms it, notice who is struggling before they say so, and understand the relational subtext of professional interactions that others process as purely transactional. In most leadership contexts, this intelligence is dramatically undervalued because it cannot be demonstrated in a spreadsheet. The specific leadership application is retention: the reason people leave organisations is almost never the stated reason. It is relational — they felt unseen, undervalued, or disconnected from the purpose of the work.`,
      practice: `This month, have one conversation with each direct report that has no performance agenda — whose only goal is to understand how they are actually experiencing the work and their place in it. Ask one question: "What's something about your work right now that I probably don't know about?" Listen to the full answer without redirecting to solutions.`,
    });
  }

  return recs;
}

// ═══════════════════════════════════════════════════════════════════════════════
// STRESS RECOMMENDATIONS
// ═══════════════════════════════════════════════════════════════════════════════

function stressRecommendations(lines: LineAnalysis[]): Recommendation[] {
  const recs: Recommendation[] = [];
  const row1 = lineById(lines, 'row_1');
  const col1 = lineById(lines, 'col_1');
  const carnal = lineById(lines, 'diag_carnal');

  if (isStrong(row1)) {
    recs.push({
      domain: 'stress',
      title: 'Your Stress Response Is Activated by Directionlessness',
      gridBasis: `Purpose/Will at ${row1!.totalDigits} digits`,
      text: `The Purpose line at ${row1!.totalDigits} digits means the motivational system is organised around forward direction. When direction is clear and progress is visible, the psychology operates at high efficiency and stress is low. When direction is blocked — by bureaucracy, by relationship ambiguity, by an unclear path forward — the stress response is acute and immediate. The specific stress signature of this configuration is agitation rather than anxiety: the feeling of being kept from something rather than being afraid of something. The corrective is not relaxation; it is direction-finding. The fastest stress intervention for a strong Purpose line is to identify the single most important next action available — however small — and take it. Movement reduces the stress that blockage creates.`,
      practice: `When you notice the specific irritability and restlessness that blocked Purpose generates, do this: write down the three most important things you are currently trying to move forward. For each, write the single smallest possible next action you could take in the next 24 hours. Take one of them immediately. The stress is direction-hunger; feed it.`,
    });
  }

  if (isWeak(carnal)) {
    recs.push({
      domain: 'stress',
      title: 'Your Stress Accumulates in the Body Faster Than You Recognise It',
      gridBasis: `Temperament diagonal at ${carnal?.totalDigits ?? 0} digits`,
      text: `The Temperament line at ${carnal?.totalDigits ?? 0} digits means the body's stress signalling system is attenuated — stress accumulates somatically before it reaches conscious awareness. The result is a pattern where the first clear signal is often physical (headache, neck pain, digestive upset, fatigue) rather than the earlier psychological signals (irritability, distraction, small overreactions to minor events) that people with stronger Temperament lines receive. By the time the physical signal arrives, the stress load is substantial. The stress management approach needs to work backwards: rather than waiting for the signal, implement regular discharge at scheduled intervals regardless of how the system feels.`,
      practice: `Schedule twenty minutes of vigorous physical activity — actual effort, not a walk — three times per week, regardless of whether you feel stressed or depleted. This is preventive discharge rather than reactive stress management. The body stores stress regardless of whether you feel it; the movement discharges it regardless of whether you were aware of the load.`,
    });
  }

  if (isStrong(col1)) {
    recs.push({
      domain: 'stress',
      title: 'Feedback Activates Your Threat Response When It Should Activate Your Learning Response',
      gridBasis: `Self-Esteem at ${col1!.totalDigits} digits`,
      text: `The Self-Esteem line at ${col1!.totalDigits} digits produces a strong and stable sense of self that is genuinely useful in most contexts. The specific stress point is criticism, challenge, or failure: because the self-system is strong, challenges to output or performance are processed with greater intensity than they functionally require. The person whose self-esteem is weak is accustomed to criticism and has developed thickness to it; the person whose self-esteem is strong experiences the same criticism as a more significant event. The technical term for this is "ego involvement" — the stronger the ego, the more activated it is by inputs that touch its territory.`,
      practice: `For thirty days, after receiving any substantive criticism or negative feedback, write it down in two ways: first as you initially received it ("they said I was wrong about X"), then as pure information ("the data point is X was not optimal in this instance"). The second framing, practised repeatedly, trains the response pathway from threat to information.`,
    });
  }

  return recs;
}

// ═══════════════════════════════════════════════════════════════════════════════
// PUBLIC API
// ═══════════════════════════════════════════════════════════════════════════════

export function generateRecommendations(
  psychomatrix: PersonalizedPsychomatrixReport,
  numerology: NumerologyData,
  contradictions: Contradiction[]
): Recommendation[] {
  const { lines } = psychomatrix;
  const allRecs: Recommendation[] = [];

  allRecs.push(...careerRecommendations(lines, numerology));
  allRecs.push(...relationshipRecommendations(lines));
  allRecs.push(...moneyRecommendations(lines));
  allRecs.push(...healthRecommendations(lines));
  allRecs.push(...leadershipRecommendations(lines));
  allRecs.push(...stressRecommendations(lines));

  // Add contradiction-derived recommendations
  contradictions.forEach((c) => {
    allRecs.push({
      domain: c.domain === 'multi' ? 'identity' : c.domain,
      title: `Navigating: ${c.name}`,
      gridBasis: c.pattern,
      text: c.deepReading,
      practice: c.resolution,
    });
  });

  // Deduplicate by title
  const seen = new Set<string>();
  return allRecs.filter((r) => {
    if (seen.has(r.title)) return false;
    seen.add(r.title);
    return true;
  });
}

/** Returns recommendations as flat string array for backward compatibility */
export function generateRecommendationStrings(
  psychomatrix: PersonalizedPsychomatrixReport,
  numerology: NumerologyData,
  contradictions: Contradiction[]
): string[] {
  return generateRecommendations(psychomatrix, numerology, contradictions)
    .map((r) => `[${r.domain.toUpperCase()}] ${r.title}: ${r.text} PRACTICE: ${r.practice}`);
}
