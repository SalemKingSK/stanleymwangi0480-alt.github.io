// src/lib/numerology/synthesis/cell-pair-interactions.ts
// Cell Pair Interaction Analysis — Psychomatrix Cell Synergies
//
// Analyzes key interactions between specific psychomatrix cell pairs.
// When certain digits reach specific thresholds simultaneously, their
// combined influence creates emergent properties that neither digit
// produces in isolation. All interpretations are verbatim (200-400 words).
//
// This analysis reveals the "hidden architecture" of the psychomatrix —
// configurations where two or more cell strengths interact to produce
// a distinct psychological/spiritual pattern.
export interface CellPairPattern {
  /** Unique pattern identifier */
  id: string;
  /** The archetypal name of this cell-pair pattern */
  name: string;
  /** Description of the condition that triggers this pattern */
  condition: string;
  /** Full verbatim interpretation (200-400 words) */
  interpretation: string;
  /** The cell numbers involved in this pattern */
  involvedCells: number[];
  /** Classification: gift, challenge, or neutral */
  polarity: "gift" | "challenge" | "neutral" | "mixed";
}
export interface CellPairResult {
  /** All cell-pair patterns that apply to this psychomatrix */
  patterns: CellPairPattern[];
  /** Summary string for UI display */
  summary: string;
  /** Optional exporter-friendly long text. Pattern interpretations remain canonical. */
  interpretation?: string;
}
// ─────────────────────────────────────────────────────────────────────────────
// CELL PAIR PATTERN DEFINITIONS
// ─────────────────────────────────────────────────────────────────────────────
interface PatternDef {
  id: string;
  name: string;
  condition: string;
  matcher: (counts: Record<number, number>) => boolean;
  involvedCells: number[];
  polarity: "gift" | "challenge" | "neutral" | "mixed";
  interpretation: string;
}
const CELL_PAIR_PATTERNS: PatternDef[] = [
  // ═══════════════════════════════════════════════════════════════════════════
  // PATTERN 1: Pattern Engine (3≥3 AND 9≥3)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "pattern-engine",
    name: "The Pattern Engine",
    condition: "3 appears 3+ times AND 9 appears 3+ times",
    matcher: (c) => (c[3] || 0) >= 3 && (c[9] || 0) >= 3,
    involvedCells: [3, 9],
    polarity: "gift",
    interpretation: `PATTERN ENGINE — HIGH CURIOSITY (3≥3) + CLAIRVOYANT MEMORY (9≥3)
When the psychomatrix contains both elevated curiosity (three or more 3s) and clairvoyant-level memory (three or more 9s), the mind becomes a cross-domain pattern recognition engine of extraordinary power. The 3 governs the impulse to inquire, explore, and connect disparate dots; it is the centrifugal force of the intellect, constantly reaching outward to gather new data. The 9 governs the capacity to store, retrieve, and synthesize that data; it is the centripetal force of the intellect, pulling information inward and organizing it into coherent structures. When both forces are simultaneously strong, the mind achieves a state of intellectual resonance where every new piece of information is automatically cross-referenced against the entire accumulated database of experience, producing insights that seem to arrive from nowhere but are actually the output of a massively parallel processing system operating below conscious awareness.
The phenomenological experience of the Pattern Engine is that the world appears coherent in ways that others cannot perceive. You notice connections between apparently unrelated fields — a principle from music that illuminates a problem in mathematics, a pattern from history that predicts a trend in technology, a metaphor from nature that solves a challenge in relationships. This is not syncretism or forced analogy; it is the genuine perception of the deep structural similarities that underlie superficially different domains. You are the person in the meeting who says "this is exactly like..." and then draws a connection so startling and yet so obvious that everyone in the room wonders why they didn't see it themselves. They didn't see it because they don't have the Pattern Engine. Their 3s are asking different questions and their 9s are storing in different categories. Your mind, by contrast, is organized as a single integrated network rather than a collection of separate filing cabinets.
The light of this configuration is extraordinary intellectual power. The Pattern Engine person can be the innovator who synthesizes fields, the teacher who makes complex subjects accessible through illuminating analogies, the strategist who sees the entire chessboard while others are still examining individual pieces. Your mind is not merely analytical or merely intuitive — it is SYNTEGRATIVE, capable of processing both the trees AND the forest simultaneously, of holding paradox without collapsing into either/or thinking, of generating solutions that are elegant because they address the deep structure of a problem rather than its surface symptoms.
The shadow of the Pattern Engine is the danger of drowning in connections. When every piece of data connects to every other piece, the mind can become a labyrinth from which there is no exit — a state of perpetual analysis where conclusions are endlessly deferred because new connections keep appearing. The Pattern Engine person can also develop a kind of intellectual arrogance: the belief that because you CAN see connections everywhere, all your connections are valid. They are not. Some connections are genuine insights; others are apophenia — the perception of patterns in noise. The discipline required is DISCERNMENT: the willingness to test connections rather than merely celebrate them, to distinguish between a genuine synthesis and a clever analogy, and to recognize that the most elegant pattern is worthless if it does not correspond to reality.`,
  },
  // ═══════════════════════════════════════════════════════════════════════════
  // PATTERN 2: Character-Duty Bridge (1=2 AND 8=1)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "character-duty-bridge",
    name: "The Character-Duty Bridge",
    condition: "1 appears exactly 2 times AND 8 appears exactly 1 time",
    matcher: (c) => (c[1] || 0) === 2 && (c[8] || 0) === 1,
    involvedCells: [1, 8],
    polarity: "gift",
    interpretation: `CHARACTER-DUTY BRIDGE — THE "11" PERSONALITY (1=2) + AWAKENING DUTY (8=1)
When the psychomatrix contains exactly two 1s (the "11" character type — gentle, diplomatic, softly centered) and exactly one 8 (the awakening duty — a nascent sense of obligation that is present but not yet fully developed), a bi-directional refinement channel opens between the self-center and the duty center. This is the "Character-Duty Bridge": the gentle ego of the "11" personality softens the potential harshness of duty, while the awakening sense of obligation gives structure and backbone to a character type that can otherwise be too accommodating, too malleable, too willing to dissolve itself into others' expectations.
The "11" personality is one of the most diplomatique configurations in the system. With two 1s, the individual has a stable but not aggressive sense of self — enough ego strength to maintain identity boundaries but not so much that the ego dominates interactions. These are the natural peacemakers, the mediators, the people who can hold space for conflict without being consumed by it. However, the "11" type has a shadow: the gentleness can become passivity, the diplomacy can become people-pleasing, and the soft center can feel, to the individual themselves, like a lack of substance. This is where the single 8 becomes transformative.
A single 8 is not the overwhelming duty of the triple-8 workaholic nor the absent duty of the no-8 free spirit. It is the AWAKENING of duty — the first stirring of a recognition that life is not just about personal comfort but about contribution, not just about being agreeable but about being accountable. The single 8 is like a sapling: it can be bent, shaped, and directed before it hardens into a fixed form. When paired with the "11" character, this awakening duty is guided by the 11's natural diplomacy and softness, producing a sense of obligation that is not harsh or rigid but fluid, relational, and beautifully calibrated to the needs of the situation.
The light of the Character-Duty Bridge is the capacity for leadership that inspires rather than commands. The "11" personality brings people together; the single 8 gives those people a reason to stay together (shared purpose, mutual obligation). The result is a leader who feels more like a facilitator, an authority whose authority derives from service rather than dominance. In relationships, this configuration creates a partner who is both devoted (the 8's sense of duty to the relationship) and sensitive (the 11's attunement to the partner's needs). It is a genuinely beautiful combination when consciously cultivated.
The shadow is the danger of the bridge operating in reverse: the 8's nascent duty being overwhelmed by the 11's desire to please, producing a person who feels obligated to everyone and therefore truly committed to no one. The awakening duty must be protected, consciously developed, and given clear objects of commitment — otherwise it dissipates into a general sense of "I should be doing more" without the focused energy to actually do it.`,
  },
  // ═══════════════════════════════════════════════════════════════════════════
  // PATTERN 3: Oracle Battery (2≥2 AND 9≥3)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "oracle-battery",
    name: "The Oracle Battery",
    condition: "2 appears 2+ times AND 9 appears 3+ times",
    matcher: (c) => (c[2] || 0) >= 2 && (c[9] || 0) >= 3,
    involvedCells: [2, 9],
    polarity: "gift",
    interpretation: `ORACLE BATTERY — SUFFICIENT ENERGY (2≥2) + CLAIRVOYANT MEMORY (9≥3)
When the psychomatrix combines sufficient bioenergy (two or more 2s) with clairvoyant-level memory (three or more 9s), the individual possesses powered access to the information field — a configuration that the Alexandrov tradition treats with particular reverence. The 2 provides the raw bioelectric current that fuels all psychic and intuitive functions; it is the battery that powers the antenna. The 9 provides the antenna itself — the capacity to retrieve information not personally learned, to access the collective memory, to "remember" things that were never experienced in this lifetime. When the battery is charged (2≥2) AND the antenna is amplified (9≥3), the result is a human receiver capable of picking up signals that are simply not available to less powerfully configured psyches.
The phenomenological experience of the Oracle Battery is a kind of KNOWING that arrives fully formed, without logical derivation, often accompanied by a physical sensation of certainty that is indistinguishable from sensory perception. You may "just know" things about people you have just met, about situations you have not researched, about futures that have not yet unfolded. This is not inference, not educated guessing, not cold reading — it is the direct retrieval of information from a field that quantum physics is only beginning to describe and that esoteric traditions have mapped for millennia. The energy from the 2s is what makes this retrieval SUSTAINABLE — unlike those with clairvoyant 9s but weak 2s, whose intuitive flashes are followed by depletion, the Oracle Battery can access the field repeatedly without crashing.
The light of this configuration is genuine intuitive guidance that can be relied upon for practical decision-making. The Oracle Battery person is not a vague "intuitive" who gets feelings they cannot trust; they get actionable information with a high signal-to-noise ratio. In professional contexts, this manifests as the capacity to make correct decisions with incomplete data — the executive who "has a feeling" about a market move, the doctor whose diagnostic hunch proves correct against the odds, the investor who senses the inflection point before the charts confirm it. In personal contexts, it manifests as deep empathy that is genuinely perceptive — the friend who knows something is wrong before you say a word, the partner who understands your needs before you articulate them.
The shadow of the Oracle Battery is the danger of becoming a passive receiver rather than an active participant in life. When you can access information directly from the field, the temptation is to stop engaging with the ordinary channels of learning — to stop reading, questioning, and struggling with uncertainty. But the field's information, while often accurate, is not always complete, and the Oracle Battery person who abdicates their rational faculties in favor of pure intuition becomes a channel rather than a person — a medium who receives but does not create, who knows but does not understand. The prescription: treat the Oracle Battery as ONE input among many. Verify intuitive hits against rational analysis. Use the gift without being used by it.`,
  },
  // ═══════════════════════════════════════════════════════════════════════════
  // PATTERN 4: Reluctant Leader (1≥2 AND 7=0)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "reluctant-leader",
    name: "The Reluctant Leader",
    condition: "1 appears 2+ times AND 7 is absent",
    matcher: (c) => (c[1] || 0) >= 2 && !c[7],
    involvedCells: [1, 7],
    polarity: "mixed",
    interpretation: `RELUCTANT LEADER — STRONG CHARACTER (1≥2) + NO LUCK (7 ABSENT)
When the psychomatrix contains a stable or strong character center (two or more 1s) but no luck at all (7 absent), the individual possesses the internal architecture of leadership without the cosmic wind at their back that propels other leaders into visibility and opportunity. This is the "Reluctant Leader" configuration — someone who HAS the substance of leadership (the centered ego, the capacity for decision, the gravitational presence that others naturally organize around) but who must EARN every leadership opportunity through demonstrated competence, because luck will never open doors that effort has not already unlocked.
The 1 governs the vertical axis of the self — the spine, the center, the "I am" that stands against the world and declares itself. With two or more 1s, this center is stable and strong. You are not easily swayed by others' opinions, not desperate for external validation, not uncertain about who you are or what you stand for. You have natural authority — not the authority of position or title, but the authority of presence, the kind that makes a room go quiet not from fear but from the instinctive recognition that someone worth listening to is about to speak. This is the raw material of leadership, and you have it.
But leadership in the world is not just about having the substance — it is also about being SEEN having the substance, about being placed in situations where leadership can be exercised, about being "discovered" by those who can open doors to larger stages. This is the role of the 7 — luck, cosmic visibility, the mysterious mechanism by which some capable people are lifted into prominence while equally capable others remain obscure. Without a 7, you will not be discovered. You will not be lucky. You will not benefit from the invisible hand of fortune that places certain people in the right place at the right time. Every leadership role you occupy will be one you fought for, built, or demonstrated your way into — never one that was handed to you.
The light of the Reluctant Leader is the development of earned authority. Leaders who rise through luck (strong 7) often carry an unconscious insecurity — a suspicion that they are where they are through fortune rather than merit, a fear that the luck might run out. The Reluctant Leader has no such insecurity. You KNOW you earned your position because nothing was ever given. Your authority is unshakeable because it was built on demonstrated competence rather than cosmic favor. When the Reluctant Leader speaks, there is weight behind the words — the weight of having proven, over and over, that you belong in the room.
The shadow is frustration, resentment, and the temptation to give up before the door finally opens. Watching less capable but luckier (7-heavy) people advance past you is genuinely painful, and the Reluctant Leader who succumbs to bitterness becomes the embittered subordinate — the person whose genuine leadership gifts curdle into cynical commentary from the sidelines. The prescription: make peace with the long game. The Reluctant Leader's trajectory is slower but more stable. The doors that open through competence stay open. The authority that is earned cannot be taken away. Your path is not the path of the shooting star (bright, brief, lucky) — it is the path of the mountain (slow to rise, impossible to ignore).`,
  },
  // ═══════════════════════════════════════════════════════════════════════════
  // PATTERN 5: Magnetic Intellect (9≥3 AND 3≥2 AND 2≥2)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "magnetic-intellect",
    name: "The Magnetic Intellect",
    condition:
      "9 appears 3+ times AND 3 appears 2+ times AND 2 appears 2+ times",
    matcher: (c) => (c[9] || 0) >= 3 && (c[3] || 0) >= 2 && (c[2] || 0) >= 2,
    involvedCells: [2, 3, 9],
    polarity: "gift",
    interpretation: `MAGNETIC INTELLECT — CLAIRVOYANT MEMORY (9≥3) + CURIOSITY (3≥2) + BIOENERGY (2≥2)
When the psychomatrix simultaneously features clairvoyant memory (three or more 9s), strong curiosity (two or more 3s), and sufficient bioenergy (two or more 2s), the individual becomes a compelling intellectual presence — the "Magnetic Intellect" whose ideas attract attention, whose teaching transforms understanding, and whose communication carries an almost hypnotic power. This is not mere intelligence; it is the combination of DEEP KNOWLEDGE (9s), BROAD CURIOSITY (3s), and the ENERGY TO TRANSMIT (2s) that creates a teacher, speaker, or communicator of unusual impact.
The 9s provide the substance — the vast reservoir of accumulated knowledge, the clairvoyant access to information not personally learned, the capacity to retrieve exactly the right fact, quote, or example at exactly the right moment. The 3s provide the engagement — the genuine interest in others' questions, the curiosity that makes learning interactive rather than performative, the openness to being challenged that distinguishes the true teacher from the dogmatist. The 2s provide the fuel — the bioelectrical energy that gives the voice its resonance, the presence its weight, the communication its power to reach across the space between speaker and listener and actually LAND in the listener's understanding. Together, these three create a communicator who is simultaneously authoritative and approachable, deep and accessible, powerful and warm.
The phenomenological experience of the Magnetic Intellect, from the inside, is that teaching and communicating feel less like work and more like channeling. Ideas flow through you rather than from you. The right words arrive at the right time. Examples surface from memory without conscious search. The energy of the room (perceived through your 2s) tells you when to accelerate, when to pause, when to circle back, and when to push deeper. From the outside, observers experience a kind of intellectual seduction — not manipulation but genuine inspiration, the feeling of being in the presence of someone whose understanding is so clear and whose transmission is so powerful that your own understanding expands simply through proximity.
The light of this configuration is the capacity to be a genuinely transformative teacher, writer, speaker, or mentor. The Magnetic Intellect does not merely inform — they TRANSFORM. Students leave their presence not just knowing more but THINKING differently, PERCEIVING differently, BEING differently. This is the highest calling of the intellect: not the accumulation of knowledge for its own sake but the transmission of understanding that changes lives.
The shadow is the danger of intellectual seduction without intellectual responsibility. The Magnetic Intellect's power to influence is so strong that it can be used carelessly — to promote ideas that are compelling but wrong, to build followings that are devoted but uncritical, to become a guru rather than a guide. The responsibility that comes with this configuration is immense: you must be more careful than others about what you say and how you say it, because your words carry weight that you may not fully appreciate. The prescription: cultivate genuine humility, seek out critics who will challenge you honestly, and never forget that the most important thing a teacher can do is teach students to outgrow their teacher.`,
  },
  // ═══════════════════════════════════════════════════════════════════════════
  // PATTERN 6: The Analyst's Trap (5=1 AND 9≥3)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "analysts-trap",
    name: "The Analyst's Trap",
    condition: "5 appears exactly 1 time AND 9 appears 3+ times",
    matcher: (c) => (c[5] || 0) === 1 && (c[9] || 0) >= 3,
    involvedCells: [5, 9],
    polarity: "mixed",
    interpretation: `THE ANALYST'S TRAP — WEAK LOGIC (5=1) + CLAIRVOYANT MEMORY (9≥3)
When the psychomatrix contains only a single 5 (weak logic/intuition framework) but three or more 9s (clairvoyant-level memory), the individual has developed a compensatory strategy that is brilliantly effective in the short term and potentially crippling in the long term. With insufficient native logic capacity (5=1), the mind cannot easily derive principles from data, cannot intuitively sense the underlying structure of a problem, and cannot generate the "aha" of genuine understanding that comes when a logical framework snaps into place. But with massive memory capacity (9≥3), the mind CAN store enormous quantities of information and retrieve it with near-perfect fidelity. The result is a mind that learns PATTERNS rather than PRINCIPLES — that knows what happened in every previous similar situation but cannot explain WHY it happened, that can recite the formula but cannot derive it, that succeeds brilliantly on familiar problems and fails catastrophically on novel ones.
The psychological signature of The Analyst's Trap is a mind that feels simultaneously brilliant and insecure. On familiar terrain, your performance is extraordinary — your massive memory (9s) allows you to recognize a situation as an instance of a previously encountered pattern, retrieve the solution that worked last time, and apply it with confidence. You appear to be a genius. But beneath this performance is a quiet panic: you know that your success depends on having seen this EXACT thing before. When the genuinely novel arrives — the problem that does not match any stored pattern, the question that cannot be answered by retrieval — you are lost, and the lostness is terrifying because you have built an identity on "being smart."
The light of this configuration is that pattern recognition through massive memory IS a genuine form of intelligence, and in many professional contexts it is sufficient for extraordinary success. The Analyst's Trap person can be an exceptional diagnostician in fields where the range of possible presentations is finite (medicine, law, engineering), an invaluable institutional memory in organizations, and a formidable competitor in any domain where experience trumps insight. You are not a fraud — you genuinely know things that others do not know.
The shadow is the ceiling that this configuration imposes on growth. The person with weak logic (5=1) who compensates with memory (9≥3) will eventually encounter problems that cannot be solved by pattern matching — problems that require genuine, first-principles reasoning of the kind that strong 5s provide. At that ceiling, the Analyst's Trap person faces a choice: either develop the logical faculty (which IS possible, through deliberate practice, even with a single 5) or remain forever limited to the territory they have already mapped. The prescription: supplement memory with method. Deliberately study logic, critical thinking, and first-principles reasoning — not as academic exercises but as survival skills. Learn to derive, not just recall. The 9s will always be your superpower; the question is whether you deploy them as a crutch or as a complement to a faculty you consciously cultivate.`,
  },
  // ═══════════════════════════════════════════════════════════════════════════
  // PATTERN 7: The Armored Heart (2≥2 AND 8≤1)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "armored-heart",
    name: "The Armored Heart",
    condition: "2 appears 2+ times AND 8 appears 0-1 times",
    matcher: (c) => (c[2] || 0) >= 2 && (c[8] || 0) <= 1,
    involvedCells: [2, 8],
    polarity: "mixed",
    interpretation: `THE ARMORED HEART — SUFFICIENT ENERGY (2≥2) + WEAK DUTY/TOLERANCE (8≤1)
When the psychomatrix combines sufficient bioenergy (two or more 2s) with weak or absent duty sense (zero or one 8), the individual has the capacity to GIVE — energy, attention, care, presence — but lacks the internal structure of obligation that would make that giving sustainable, reciprocal, and wisely directed. This is the "Armored Heart": a person whose heart is genuinely open (the 2s provide the warmth, the empathy, the capacity to connect) but whose giving is unregulated by duty (the 8, when strong, functions as a gatekeeper — it says "this is my responsibility" and "this is not my responsibility" with equal clarity). Without that gatekeeper, the Armored Heart gives indiscriminately, exhausts itself, and then — having been burned — withdraws behind armor that protects but also isolates.
The phenomenological experience of the Armored Heart oscillates between two poles: overflowing generosity and bitter withdrawal. In the generous phase, your 2s are fully online — you feel others' needs viscerally, you respond with genuine care, you give your energy freely and receive the deep satisfaction that comes from genuine connection. But because there is no 8 to say "enough," no duty structure to distinguish between "I want to help" and "I MUST help," the giving continues past the point of sustainability. The 2s' energy, though sufficient for normal functioning, is not infinite — and the Armored Heart who gives without limit eventually hits empty.
When the tank is empty, the armor goes up. The once-open heart becomes guarded, suspicious, convinced that others are takers who exploited generosity. This is the shadow of the configuration: the oscillation between over-giving and over-protecting, between merging and walling off, between "I would do anything for you" and "I don't owe you anything." Neither pole is authentic — both are reactions to the absence of the 8's regulating function, which would allow the 2s' genuine warmth to be expressed within healthy, sustainable boundaries.
The light of this configuration is a capacity for genuine, heartfelt connection that more duty-bound individuals (strong 8s) can only envy. When the Armored Heart learns to regulate its own giving — to say no without guilt, to give without self-abandonment, to love without losing itself — it achieves a balance that is both warm and wise. The 2s provide the love; the consciously cultivated boundaries (imported to compensate for the absent 8) provide the wisdom. The result is a heart that is open but not defenseless, generous but not exploited, warm but not burned out.
The prescription: develop explicit giving protocols. Since your internal duty sensor (8) cannot tell you when you have given enough, you must create external rules: "I will help with X but not Y," "I will give Z hours per week to others and no more," "I will check my energy level before saying yes." These rules will feel unnatural and even cold — the 2s will protest that genuine love doesn't keep score. But the Armored Heart who DOESN'T keep score eventually stops playing the game entirely, and that is a greater loss than the loss of spontaneity.`,
  },
  // ═══════════════════════════════════════════════════════════════════════════
  // PATTERN 8: The Overthinker (3≥3 AND 5≤1)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "overthinker",
    name: "The Overthinker",
    condition: "3 appears 3+ times AND 5 appears 0-1 times",
    matcher: (c) => (c[3] || 0) >= 3 && (c[5] || 0) <= 1,
    involvedCells: [3, 5],
    polarity: "challenge",
    interpretation: `THE OVERTHINKER — HIGH CURIOSITY (3≥3) + WEAK LOGIC FILTER (5≤1)
When the psychomatrix contains elevated curiosity (three or more 3s) but a weak or absent logic/intuition center (zero or one 5), the mind becomes an inquiry engine with no off switch and no quality filter. The 3s generate questions endlessly — they are the centrifugal force of the intellect, constantly reaching outward, constantly encountering new data that demands examination, constantly spawning new lines of inquiry from every answer received. The 5 is supposed to be the filter — the faculty that evaluates incoming data, discards the irrelevant, synthesizes the significant, and produces the "that makes sense" resolution that allows the questioning process to conclude. Without that filter, the 3s continue to generate questions about questions, meta-questions about the questioning process, questions about whether the right questions are being asked — a recursive loop that produces analysis paralysis.
The phenomenological experience of The Overthinker is a mind that cannot land. Every decision, no matter how trivial, becomes a research project. Every possibility spawns sub-possibilities that spawn sub-sub-possibilities. The Overthinker is the person who spends three hours researching which restaurant to visit for dinner, reads every review, compares menu items, considers parking situations, and then — exhausted — orders delivery from the place they always order from. The tragedy of this configuration is not that the thinking is low quality (the 3s ensure that the questions are genuinely interesting and the exploration is genuinely thorough); the tragedy is that the thinking never RESOLVES into decision, action, or peace.
The light of this configuration is intellectual thoroughness that borders on the compulsive but can, when properly channeled, produce genuinely valuable synthesis. The Overthinker is the person who will find the edge case everyone else missed, the hidden assumption that invalidates the elegant theory, the long-term consequence that the short-term thinkers discounted. In professional contexts where thoroughness is valued over speed — academic research, legal analysis, risk assessment — The Overthinker's tendency toward exhaustive examination is not a bug but a feature.
The shadow is decision paralysis, chronic anxiety, and the suffering of a mind that cannot rest. The Overthinker's internal experience is exhausting — a constant hum of inquiry that never resolves into silence, a perpetual state of "but what about..." that prevents the satisfaction of conclusion. Relationships suffer because decisions that affect others (where to live, whether to commit, how to handle a conflict) are subjected to the same endless analysis, leaving partners feeling unconsidered rather than deeply considered. The prescription: impose artificial deadlines. Since your internal 5 cannot provide the "that's enough" signal, you must create external stopping rules: "I will research this for 30 minutes and then decide," "I will consider three options and no more," "I will make this decision by Friday even if I am not 100% certain." The Overthinker who learns to think ENOUGH rather than thinking EXHAUSTIVELY discovers that most decisions, even imperfect ones, are better than no decision at all.`,
  },
  // ═══════════════════════════════════════════════════════════════════════════
  // PATTERN 9: The Reluctant Mystic (9≥3 AND 5=1)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "reluctant-mystic",
    name: "The Reluctant Mystic",
    condition: "9 appears 3+ times AND 5 appears exactly 1 time",
    matcher: (c) => (c[9] || 0) >= 3 && (c[5] || 0) === 1,
    involvedCells: [5, 9],
    polarity: "mixed",
    interpretation: `THE RELUCTANT MYSTIC — CLAIRVOYANT MEMORY (9≥3) + SINGLE LOGIC (5=1)
When the psychomatrix contains clairvoyant-level memory (three or more 9s) combined with only a single 5 (awakening but weak logic/intuition), the individual has profound access to the information field but lacks the mental framework to interpret, organize, or explain what they retrieve. This is the "Reluctant Mystic": someone who KNOWS things — deeply, accurately, and often — but cannot tell you HOW they know, cannot derive the principles behind their insights, and cannot teach others to replicate their results. Their knowing arrives as certainty without explanation, as vision without vocabulary, as direct experience of truth that resists translation into the language of reason.
The 9s provide the access. With three or more 9s, the individual is connected to what the Alexandrov tradition calls the "information field" — a non-local reservoir of knowledge that transcends personal experience. They receive downloads: complete, formed insights that arrive as gestalts rather than sequential reasoning. They "remember" things they never learned. They perceive the truth of a situation with a clarity that feels like sight. But the single 5 — the logic center — is only beginning its development. It is like a radio with an extraordinary antenna (9s) connected to a receiver with only one transistor (5). The signal is coming through, loud and clear, but the receiver cannot process it into a format that others can understand, that the self can examine critically, or that can be integrated into a coherent world model.
The light of this configuration is that the insights ARE genuine. The Reluctant Mystic is not delusional, not projecting, not making things up. Their hit rate, over time, is high enough to command respect — and the people who know them well learn to trust their instincts even when (especially when) they cannot be explained. In practical terms, the Reluctant Mystic is the person you want in the room when the data runs out and a decision must still be made. Their call, unaccompanied by reasoning, proves right more often than probability would predict.
The shadow is the frustrating gap between knowing and communicating. The Reluctant Mystic lives in a chronic state of being misunderstood — of having something important to convey and lacking the vocabulary to convey it, of watching others make mistakes that they could have prevented if only their warning had been comprehensible. This breeds a particular kind of loneliness: the loneliness of the Cassandra figure, doomed to speak truth that no one can understand. Over time, some Reluctant Mystics stop trying to explain and simply act on their insights without consultation — which, while effective, creates interpersonal friction and can shade into a kind of spiritual arrogance.
The prescription: develop alternative communication modalities. If you cannot explain in words, explain through images, through stories, through metaphors, through demonstrations. Work with partners who trust your intuition and can act as translators — people who say "I don't know how she knows, but she's usually right, so let's do what she suggests." And most importantly, do not abandon your insights just because you cannot justify them. The justification may come later, or it may never come. The Reluctant Mystic's task is not to become a logician but to become a trustworthy steward of knowledge that arrives through channels reason cannot map.`,
  },
  // ═══════════════════════════════════════════════════════════════════════════
  // PATTERN 10: The Fragile Powerhouse (1≥2 AND 4=0)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "fragile-powerhouse",
    name: "The Fragile Powerhouse",
    condition: "1 appears 2+ times AND 4 is absent",
    matcher: (c) => (c[1] || 0) >= 2 && !c[4],
    involvedCells: [1, 4],
    polarity: "mixed",
    interpretation: `THE FRAGILE POWERHOUSE — STRONG CHARACTER (1≥2) + NO HEALTH (4 ABSENT)
When the psychomatrix contains a stable or strong character center (two or more 1s) but no health digit at all (4 absent), the individual possesses a powerful sense of self — a strong ego, clear boundaries, the capacity for willful action — housed in a physical vessel that offers no resilience buffer. This is the "Fragile Powerhouse": a person whose internal engine is a V12 but whose chassis is made of balsa wood, capable of extraordinary output in bursts but vulnerable to catastrophic failure if pushed beyond invisible limits that other people's bodies would have signaled long before the breaking point.
The 1s provide the will, the drive, the sense of purpose. With two or more, you are not someone who wavers or defers or waits for permission. You know what you want, you pursue it, and your sense of self is robust enough to withstand the rejections and setbacks that crush more fragile egos. This is the raw material of achievement — the psychological horsepower that separates those who DO from those who merely dream. But the 4 provides the physical container that makes sustained achievement possible. It is the body's resilience, the immune system's vigilance, the capacity to absorb stress without damage, to push hard and recover quickly, to burn the candle at both ends without the flame going out entirely.
Without the 4, your powerful will (1s) is driving a body that cannot absorb the impact of that drive. You may not notice this until the body fails — because the 1s' psychological energy is so strong that it overrides the body's warning signals (which, without the 4, are weak to begin with). The Fragile Powerhouse person CAN push through fatigue, CAN ignore pain, CAN override the need for rest in ways that astonish others — and this capacity, which feels like a superpower, is actually the most dangerous thing about the configuration. It allows you to exceed your limits without knowing where those limits are, until the body enforces them through crisis rather than maintenance.
The light of this configuration is that the will (1s) IS strong enough to build the health infrastructure that was not inherited. The Fragile Powerhouse who becomes conscious of their configuration can use their formidable willpower to create health disciplines — exercise, nutrition, sleep hygiene, stress management — that provide externally what the 4 would have provided internally. This is not "fixing" the chart; it is working WITH it, using the gift (strong will) to compensate for the gap (no health buffer). The Fragile Powerhouse who masters this becomes nearly unstoppable — because they have the drive to achieve AND the wisdom to sustain.
The shadow is the classic burnout trajectory: achieve, achieve, achieve, collapse. The Fragile Powerhouse who never learns to respect their physical limits will crash — not from weakness but from the accumulated wear of operating at peak output without the regenerative capacity that the 4 provides. The crash, when it comes, is devastating not just physically but psychologically, because it contradicts the self-image of power and capability that the 1s have constructed. The prescription: schedule maintenance BEFORE it is needed. Rest when you feel strong, not when you feel weak. Treat health as a practice, not a resource to be consumed.`,
  },
  // ═══════════════════════════════════════════════════════════════════════════
  // PATTERN 11: The Unmanifested Genius (3≥2 AND 9≥3 AND 6=0)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "unmanifested-genius",
    name: "The Unmanifested Genius",
    condition: "3 appears 2+ times AND 9 appears 3+ times AND 6 is absent",
    matcher: (c) => (c[3] || 0) >= 2 && (c[9] || 0) >= 3 && !c[6],
    involvedCells: [3, 6, 9],
    polarity: "challenge",
    interpretation: `THE UNMANIFESTED GENIUS — CURIOSITY (3≥2) + CLAIRVOYANT MEMORY (9≥3) + NO LABOR (6 ABSENT)
When the psychomatrix combines strong curiosity (two or more 3s) with clairvoyant memory (three or more 9s) but no labor digit at all (6 absent), the individual possesses extraordinary intellectual resources with no instinct for the disciplined work that converts intellectual resources into tangible output. This is the "Unmanifested Genius": a person whose mind is a treasure vault of insights, connections, and knowledge — and whose life shows surprisingly little evidence of that treasure, because the bridge between knowing and doing (the 6's labor instinct) was never built.
The 3s and 9s together form the complete intellectual apparatus — the reaching outward (3) and the storing inward (9), the endless generation of questions and the vast archive of answers. This is the mind of the natural scholar, the born researcher, the person whose intellectual appetite is bottomless and whose retention is photographic. You CAN understand complex things. You CAN make creative connections. You CAN generate valuable ideas. Your mind is not the problem — it is genuinely gifted. The problem is what happens AFTER the idea arrives. The 6 is the faculty that says: "This is interesting. Now make it real. Now put in the hours. Now do the unglamorous work of transforming insight into output, vision into product, potential into accomplishment." Without the 6, the idea arrives, is admired, is discussed brilliantly over coffee, and then — nothing. It joins the graveyard of unrealized potential that is the Unmanifested Genius's most painful internal landscape.
The psychological experience of this configuration is a particular kind of self-loathing. You KNOW you are capable. You have had glimpses of what you could produce — the paper you outlined but never wrote, the business you conceptualized but never launched, the artistic vision you described so vividly that people assumed you were already working on it. But the follow-through doesn't happen, and the gap between your mental output and your tangible output becomes a source of shame that you defend against with explanations ("I work better under pressure," "I'm still researching," "The timing isn't right") that you increasingly do not believe yourself.
The light of this configuration is that the intellectual resources ARE real, and if the 6's absence can be compensated for, the output can be extraordinary. The Unmanifested Genius who builds external labor structures — accountability partnerships, deadlines with consequences, environments that minimize distraction, collaborations with people who have strong 6s — can access the productivity that their native wiring cannot generate. This is not "fixing" the absence of 6; it is acknowledging it honestly and building around it. The prescription: stop waiting for motivation. The 6 provides the intrinsic satisfaction in labor that makes work feel worthwhile; without it, you will never FEEL like doing the work. Do it anyway. Schedule it. Externalize it. Make it non-optional. The Unmanifested Genius who learns to work without wanting to work becomes something rare: a mind of extraordinary capacity that also DELIVERS.`,
  },
  // ═══════════════════════════════════════════════════════════════════════════
  // PATTERN 12: The Quiet Oracle (9≥4 AND 1≤1)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "quiet-oracle",
    name: "The Quiet Oracle",
    condition: "9 appears 4+ times AND 1 appears 0-1 times",
    matcher: (c) => (c[9] || 0) >= 4 && (c[1] || 0) <= 1,
    involvedCells: [1, 9],
    polarity: "mixed",
    interpretation: `THE QUIET ORACLE — EXTREME CLAIRVOYANCE (9≥4) + WEAK EGO (1≤1)
When the psychomatrix contains four or more 9s — the threshold at which clairvoyance becomes not just a capacity but a defining feature of the psyche — combined with a weak or absent character center (zero or one 1), the individual becomes a pure receiver with almost no transmission apparatus. This is the "Quiet Oracle": a person whose access to the information field is so wide-open that they essentially live with one foot in non-ordinary reality, but whose ego structure is too fragile to mediate, interpret, or communicate the extraordinary data they receive. They know everything and can say almost nothing.
The 9s at this level (4+) represent what the Alexandrov tradition calls "pathological clairvoyance" — not pathological in the sense of illness, but in the sense of being beyond normal parameters, a condition that defines rather than merely influences the psyche. With 9999+, the boundary between personal memory and collective memory becomes porous. You experience others' memories as your own. You perceive future probabilities as present realities. You receive information from sources that cannot be traced to any personal learning experience. This is not imagination or fantasy — it is genuine access to a field of information that exists beyond the individual mind. But the 1, which should provide the stable center from which this information is received, interpreted, and transmitted, is weak or absent. The receiver is powerful; the receiver's operator is not.
The phenomenological experience of the Quiet Oracle is a kind of permanent cognitive overwhelm. Information flows in constantly — about people, about situations, about past and future — but without the ego structure (1) to organize this information into a coherent narrative, it arrives as a flood rather than a stream. The Quiet Oracle may experience this as anxiety, as intuition that cannot be explained, as a "knowing" that isolates them from others who do not share their perceptions. They may be dismissed as "overly sensitive" or "imaginative" — and the tragedy is that their perceptions ARE accurate, but they lack the ego strength to assert their accuracy against a world that denies their reality.
The light of this configuration is the potential for genuine oracular function IF the ego is consciously strengthened. The Quiet Oracle who does the work of building a stable self — through therapy, through grounding practices, through relationships that validate their perceptions — can become a channel of extraordinary clarity. Their 9s give them access to information that is genuinely valuable; their consciously cultivated 1 gives them the stability to deliver that information without being destabilized by it. This is the archetype of the seer, the medium, the intuitive consultant — someone whose gift is real and whose self is strong enough to hold it.
The shadow is chronic psychological destabilization. The Quiet Oracle without ego development can be misdiagnosed as mentally ill, can retreat into isolation to manage the overwhelm, and can lose the capacity to distinguish between psychic perception and psychological projection — between genuine information from the field and the field of their own unprocessed material. The prescription: ground, ground, ground. Physical practices, ordinary routines, relationships with practical people, anything that anchors you in the material world. The 9s will always pull you into the non-ordinary; the consciously cultivated 1 must pull you back. The Quiet Oracle who masters this oscillation becomes a bridge between worlds. The one who does not becomes lost in the crossing.`,
  },
  // ═══════════════════════════════════════════════════════════════════════════
  // PATTERN 13: The Unstoppable Momentum (1≥3 AND 2≥2 AND 3≥3)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "unstoppable-momentum",
    name: "The Unstoppable Momentum",
    condition:
      "1 appears 3+ times AND 2 appears 2+ times AND 3 appears 3+ times",
    matcher: (c) => (c[1] || 0) >= 3 && (c[2] || 0) >= 2 && (c[3] || 0) >= 3,
    involvedCells: [1, 2, 3],
    polarity: "gift",
    interpretation: `THE UNSTOPPABLE MOMENTUM — OVERLOADED CHARACTER (1≥3) + SUFFICIENT ENERGY (2≥2) + HIGH CURIOSITY (3≥3)
When the psychomatrix simultaneously features an overloaded character center (three or more 1s), sufficient bioenergy (two or more 2s), and elevated curiosity (three or more 3s), the first column of the matrix is essentially on fire — and that fire, properly channeled, creates a momentum that is genuinely difficult for external circumstances to stop. This is the "Unstoppable Momentum" configuration: a person whose sense of self is so strong (1s), whose energy is so sufficient (2s), and whose intellectual engagement with the world is so relentless (3s) that obstacles are simply overrun rather than negotiated.
The overloaded 1s (3+) create a character center that is, in Alexandrov terms, despotic — in the positive sense of being capable of absolute command over the self, and in the shadow sense of potentially being rigid, domineering, and unwilling to accommodate others' perspectives. This is not gentle leadership (the "11" type) or balanced selfhood (the "111" type); this is overwhelming self-certainty, the kind of ego that does not ask "am I right?" but declares "I am right" and then proceeds to make it so through sheer force of will. The 2s provide the fuel: sufficient bioenergy means the will does not run out of power halfway through the campaign. The 3s provide the engagement: high curiosity means the mind is constantly scanning for new information, new opportunities, new angles of attack. Together, these three create a psychological engine that simply does not stall.
The light of this configuration is the capacity for sustained, high-output achievement across multiple domains. The Unstoppable Momentum person does not succeed in one area while neglecting others — the energy (2s) and curiosity (3s) are too abundant to be contained in a single channel. They lead organizations, raise families, pursue intellectual interests, maintain physical disciplines — not by sacrificing balance but by having the internal resources to do all of it simultaneously. This is the person others describe as "a force of nature," and the description is accurate: their internal weather system generates its own energy and is not dependent on external conditions.
The shadow is the danger of becoming a steamroller rather than a leader. The overloaded 1s, unchecked by sufficient 8s (which this configuration does not guarantee), can produce a personality that simply overrides others rather than leading them. The Unstoppable Momentum person can leave a trail of exhausted, resentful, and alienated people in their wake — not from malice but from the simple physics of being a force that does not naturally notice when it is crushing things. The prescription: develop the capacity to STOP. Not pause, not slow down — STOP. The Unstoppable Momentum person who cannot stop voluntarily will eventually be stopped involuntarily (by burnout, by rebellion, by external crisis). The discipline of deliberate stillness — of creating spaces in which nothing is being pursued, achieved, or overcome — is not just a wellness practice for this configuration. It is a survival skill.`,
  },
  // ═══════════════════════════════════════════════════════════════════════════
  // PATTERN 14: The Grounded Visionary (9≥3 AND 6≥3)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "grounded-visionary",
    name: "The Grounded Visionary",
    condition: "9 appears 3+ times AND 6 appears 3+ times",
    matcher: (c) => (c[9] || 0) >= 3 && (c[6] || 0) >= 3,
    involvedCells: [6, 9],
    polarity: "gift",
    interpretation: `THE GROUNDED VISIONARY — CLAIRVOYANT MEMORY (9≥3) + STRONG LABOR (6≥3)
When the psychomatrix combines clairvoyant memory (three or more 9s) with exceptional labor capacity (three or more 6s), the individual possesses the rare combination of VISION and EXECUTION that transforms ideas into reality at scale. The 9s provide access to the information field — the capacity to perceive patterns, retrieve knowledge, and receive insights that transcend personal experience. The 6s provide the grounded, disciplined labor instinct that converts those insights into tangible output. One without the other is either a dreamer who never builds (9s without 6s) or a builder without a blueprint (6s without 9s). Together, they create the "Grounded Visionary": someone who can SEE what needs to be built AND has the work capacity to actually build it.
The 6 at the level of three or more is not merely a capacity for work; it is a LOVE of work, an instinctual satisfaction in labor that makes the 6-heavy person intrinsically motivated to produce. The 6s at this level represent what the Alexandrov tradition calls the "golden hands" — the capacity to work with materials, to build, to craft, to transform physical reality through sustained effort. Combined with the 9s' access to the information field, this creates a person whose visions are not abstract — they are practical, buildable, grounded in the real constraints and possibilities of the material world. The Grounded Visionary does not design utopias that exist only on paper; they design systems, products, and structures that actually work.
The light of this configuration is the capacity to be a genuine innovator — not the kind who generates ideas (many people do that) but the kind who SHIPS ideas (few people do that). The Grounded Visionary is the founder who codes the prototype, the architect who swings the hammer, the artist who masters the technique before breaking the rules. Their work is characterized by a rare combination of conceptual depth and practical excellence — it is both brilliant AND well-made, inspired AND reliable.
The shadow is the danger of becoming so absorbed in the work that the vision is lost. The 6s at 3+ can create a kind of workaholic tunnel vision — the satisfaction of labor is so genuine, so intrinsically rewarding, that the Grounded Visionary can spend years building with perfect craftsmanship in the wrong direction. The 9s' vision must be periodically consulted to ensure the labor is serving the larger purpose, not replacing it. The prescription: schedule regular "vision days" — extended periods of non-doing in which the 6s are deliberately set aside and the 9s are given space to transmit. The Grounded Visionary who masters this rhythm — vision, build, vision, build — achieves a productivity that is not merely high-volume but high-direction, moving with both power AND precision toward outcomes that genuinely matter.`,
  },
  // ═══════════════════════════════════════════════════════════════════════════
  // PATTERN 15: The Fragile Channel (9≥3 AND 2=0)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "fragile-channel",
    name: "The Fragile Channel",
    condition: "9 appears 3+ times AND 2 is absent",
    matcher: (c) => (c[9] || 0) >= 3 && !c[2],
    involvedCells: [2, 9],
    polarity: "challenge",
    interpretation: `THE FRAGILE CHANNEL — CLAIRVOYANT MEMORY (9≥3) + NO BIOENERGY (2 ABSENT)
When the psychomatrix contains clairvoyant-level memory (three or more 9s) but no bioenergy at all (2 absent), the individual possesses a powerful antenna connected to a battery that is perpetually at zero. This is the "Fragile Channel": someone whose access to the information field is genuine and strong, but whose capacity to SUSTAIN that access, to power its function, and to recover from its energetic demands is dangerously limited. Each intuitive download costs energy that the system cannot spare, and the resulting pattern is a cycle of profound insight followed by profound depletion.
The 9s provide the connection to the information field — the capacity to retrieve knowledge, perceive patterns, and receive intuitive guidance that transcends ordinary cognition. This capacity IS genuine. The Fragile Channel IS receiving real information. The problem is not the quality of the signal; the problem is the cost of receiving it. In the Alexandrov system, the 2 is the bioenergy that powers all psychic and intuitive functions. Without it, intuitive reception is like running a high-wattage transmitter on a battery designed for a wristwatch. It works — briefly, spectacularly — and then the system crashes, requiring extended recovery before the next transmission can be received.
The phenomenological experience of the Fragile Channel is a life punctuated by moments of extraordinary clarity separated by long periods of fog. You may have days — or hours — when the connection is wide open, when insights flow effortlessly, when you KNOW things with a certainty that astonishes others. These are the moments that convince you (and those around you) that you have a genuine gift. But the aftermath is punishing: fatigue that is not merely physical but existential, a drained quality that sleep does not address, a sense of being hollowed out that can last for days or weeks after a major intuitive download. The gift, experienced this way, becomes something to fear — because the cost of using it is so high.
The light of this configuration is that the information IS accurate and IS valuable. The Fragile Channel is not broken; they are underpowered. The prescription is not to shut down the reception but to manage the energy economy with extreme precision. Every intuitive download must be budgeted. The Fragile Channel must become an expert in their own energy — learning which conditions support reception (certain times of day, certain environments, certain states of being) and which conditions drain it beyond recovery. They must protect themselves from energy vampires — people, situations, and environments that draw on the already-depleted 2 reserves. And they must learn to say "not now" to the information field — to close the connection deliberately rather than being passively open to every transmission. The Fragile Channel who masters energy management becomes a sustainable oracle. The one who does not becomes a burned-out receiver, permanently too depleted to access the gift they once had.`,
  },
];
// ─────────────────────────────────────────────────────────────────────────────
// PUBLIC API
// ─────────────────────────────────────────────────────────────────────────────
/**
 * Analyzes key interactions between specific psychomatrix cell pairs.
 * When certain digits reach specific thresholds simultaneously, their
 * combined influence creates emergent properties that neither digit
 * produces in isolation. Returns all applicable cell-pair patterns.
 *
 * @param counts - Record mapping digit (1-9) to its count in the psychomatrix
 * @returns CellPairResult with all applicable patterns and summary
 */
export function analyzeCellPairs(
  counts: Record<number, number>,
  personalization?: { lifePath: number; psycheNum: number },
): CellPairResult {
  const applicablePatterns: CellPairPattern[] = [];
  for (const pattern of CELL_PAIR_PATTERNS) {
    if (pattern.matcher(counts)) {
      let personalizedPrefix = "";
      if (personalization) {
        personalizedPrefix = `\n\n── TAILORED TO YOUR CHART (Life Path ${personalization.lifePath} | Psychic ${personalization.psycheNum}) ──\n`;
      }
      applicablePatterns.push({
        id: pattern.id,
        name: pattern.name,
        condition: pattern.condition,
        interpretation: personalizedPrefix + pattern.interpretation,
        involvedCells: pattern.involvedCells,
        polarity: pattern.polarity,
      });
    }
  }
  // Generate summary
  let summary: string;
  if (applicablePatterns.length === 0) {
    summary =
      "No significant cell-pair interaction patterns detected. The psychomatrix cells operate independently without forming the emergent configurations this analysis screens for.";
  } else if (applicablePatterns.length === 1) {
    const p = applicablePatterns[0];
    summary = `1 cell-pair interaction detected: ${p.name} (${p.polarity}). This configuration emerges from the interaction of cells ${p.involvedCells.join(", ")}. ${p.condition}.`;
  } else {
    const gifts = applicablePatterns.filter(
      (p) => p.polarity === "gift",
    ).length;
    const challenges = applicablePatterns.filter(
      (p) => p.polarity === "challenge",
    ).length;
    const mixed = applicablePatterns.filter(
      (p) => p.polarity === "mixed",
    ).length;
    const names = applicablePatterns.map((p) => p.name).join(", ");
    summary = `${applicablePatterns.length} cell-pair interactions detected: ${names}. `;
    if (gifts > 0) summary += `${gifts} gift configuration(s). `;
    if (challenges > 0) summary += `${challenges} challenge configuration(s). `;
    if (mixed > 0)
      summary += `${mixed} mixed (gift+challenge) configuration(s). `;
    summary +=
      "These emergent patterns reveal the hidden architecture of the psychomatrix — how cell interactions produce traits that neither cell creates in isolation.";
  }
  // Sort: gifts first, then mixed, then challenges
  const polarityOrder: Record<string, number> = {
    gift: 0,
    neutral: 1,
    mixed: 2,
    challenge: 3,
  };
  applicablePatterns.sort(
    (a, b) => polarityOrder[a.polarity] - polarityOrder[b.polarity],
  );
  return {
    patterns: applicablePatterns,
    summary,
  };
}