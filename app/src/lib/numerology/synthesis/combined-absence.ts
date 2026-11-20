// src/lib/numerology/synthesis/combined-absence.ts
// Combined Absence Analysis — Psychomatrix Missing Number Patterns
//
// Analyzes combinations of missing numbers (digits 1-9) from the psychomatrix.
// Each pattern represents a specific psychological/spiritual configuration
// where the simultaneous absence of certain numbers creates a distinct
// archetypal signature. All interpretations are verbatim (200-400 words each).
//
// The Alexandrov tradition recognizes that missing numbers are as significant
// as present ones — they define the energetic "negative space" the individual
// must consciously engage with throughout life.
export interface CombinedAbsencePattern {
  /** Unique pattern identifier */
  id: string;
  /** The archetypal name of this absence pattern */
  name: string;
  /** Which numbers are missing (or critically weak) to trigger this pattern */
  missingNumbers: number[];
  /** Full verbatim interpretation (200-400 words) */
  interpretation: string;
  /** Severity classification */
  severity: "critical" | "significant" | "moderate";
}
export interface CombinedAbsenceResult {
  /** All patterns that apply to this psychomatrix */
  patterns: CombinedAbsencePattern[];
  /** Summary string for UI display */
  summary: string;
  /** Optional exporter-friendly long text. Pattern interpretations remain canonical. */
  interpretation?: string;
  /** Total number of missing digits */
  totalMissing: number;
}
// ─────────────────────────────────────────────────────────────────────────────
// ABSENCE PATTERN DEFINITIONS
// ─────────────────────────────────────────────────────────────────────────────
interface PatternDef {
  id: string;
  name: string;
  matcher: (counts: Record<number, number>) => boolean;
  missingNumbers: number[];
  severity: "critical" | "significant" | "moderate";
  interpretation: string;
}
const ABSENCE_PATTERNS: PatternDef[] = [
  // ═══════════════════════════════════════════════════════════════════════════
  // PATTERN 1: Self-Forged (no 4, 6, or 7)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "self-forged",
    name: "The Self-Forged",
    matcher: (c) => !c[4] && !c[6] && !c[7],
    missingNumbers: [4, 6, 7],
    severity: "critical",
    interpretation: `THE SELF-FORGED — ABSENCE OF 4, 6, AND 7
This is one of the most demanding configurations in the entire psychomatrix — the simultaneous absence of Health (4), Labor (6), and Luck (7). You have entered this incarnation without the three most commonly relied-upon safety nets. There is no physical resilience buffer (4), no innate work stamina or instinct for grounded productivity (6), and no cosmic luck or divine intervention mechanism (7). This does not mean you cannot be healthy, cannot work, or are cosmically abandoned — it means that EVERY DROP of health, EVERY OUNCE of productive capacity, and EVERY FAVORABLE OUTCOME must be consciously generated through deliberate effort.
In the Alexandrov system, the absence of 4, 6, and 7 together creates what is called the "Self-Forged" archetype — the individual who cannot inherit anything of substance. Where others coast on good health they did not earn (strong 4), grind through difficulty on labor stamina they take for granted (strong 6), and benefit from lucky breaks they attribute to their own merit (strong 7), the Self-Forged person wakes up each morning with a blank ledger. Every achievement is authentic because nothing was gifted. Every success is earned because no shortcut existed. This is the universe's most demanding compliment: it has given you NO training wheels because it trusts you to build the bicycle yourself.
The light of this configuration is absolute authenticity and self-ownership. When you succeed — and the Self-Forged CAN succeed spectacularly — you know with certainty that it was you who created that success. No luck diluted your agency. No inherited health buoyed you through neglect. No labor instinct carried you when motivation failed. Your achievements are woven from pure intention, and the self-respect that comes from this is unshakeable. You become the architect of your own existence in a way that more "gifted" charts can never approximate — because gifts can be taken for granted, but what is forged in the fire of total absence is permanently yours.
The shadow is exhaustion, bitterness, and the temptation to collapse into victimhood. The absence of 7 means you will watch others receive opportunities, windfalls, and lucky breaks that never seem to come your way. The absence of 4 means your body will not forgive neglect the way others' bodies do. The absence of 6 means you will have to consciously, deliberately, and repeatedly choose to work — and work — and work — without the instinctive satisfaction in labor that others feel. This is not a punishment but a curriculum. You are here to learn that the universe, for you, operates on a different logic than for most people: the logic of conscious creation rather than passive reception. Your greatest risk is not failure but resignation — the belief that because the path is harder, it is impossible. It is not impossible. It is simply yours alone.`,
  },
  // ═══════════════════════════════════════════════════════════════════════════
  // PATTERN 2: The Unprotected (no 4 + no 7)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "unprotected",
    name: "The Unprotected",
    matcher: (c) => !c[4] && !c[7] && (c[6] || 0) > 0,
    missingNumbers: [4, 7],
    severity: "significant",
    interpretation: `THE UNPROTECTED — ABSENCE OF 4 AND 7
When the psychomatrix lacks both the number 4 (Health) and the number 7 (Luck/Cosmic Protection), the individual operates without either the physical resilience buffer or the karmic safety net that most people unconsciously depend upon. You have a capacity for work (6 present) — so you are not without productive energy — but the vessel that must contain and sustain that labor (the body governed by 4) is chronically under-resourced, and the cosmic mechanism that protects the fortunate from the worst consequences of their risks (the luck governed by 7) is absent. This creates a specific vulnerability pattern: you can DO (6) but you CANNOT ABSORB (no 4), and you can RISK but you CANNOT BE CAUGHT (no 7).
The psychological signature of The Unprotected is a kind of existential vigilance. You are the person who reads the fine print, who arrives early to scope the exits, who builds contingency plans for contingency plans — not because you are anxious by nature, but because your experience has taught you that when things go wrong for you, they go wrong all the way. Others may stumble and be caught by luck (7) or bounce back quickly on resilient health (4). When you stumble, you land on concrete, and the recovery is yours alone to engineer. This has, over time, made you extraordinarily resourceful and prepared — but at the cost of a baseline relaxation that more buffered individuals take entirely for granted.
The light of this configuration is the development of profound strategic intelligence and genuine self-reliance. You cannot afford to be careless, so you become careful. You cannot depend on luck, so you build systems. You cannot neglect your body, so you become — through necessity — more attentive to health than those born with robust 4s who can afford to ignore their physical limits. The Unprotected person often becomes a source of practical wisdom for others precisely because they have had to figure out, from scratch, what most people inherit as instinct or good fortune. Your advice is not theoretical — it is battle-tested.
The shadow is chronic low-grade anxiety, hypervigilance, and a relationship with risk that oscillates between excessive avoidance and reckless testing of fate. The absence of 7 creates a particular spiritual challenge: it is difficult to trust the universe when you have not felt it catch you. The prescription is not to become reckless but to learn that preparation and trust are not opposites — the most prepared person can still trust, and the most trusting person can still prepare. Your growth edge is the cultivation of faith — not blind faith, but the earned faith that comes from surviving every single thing that has ever happened to you.`,
  },
  // ═══════════════════════════════════════════════════════════════════════════
  // PATTERN 3: The Unmoored (no 4 + no 6)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "unmoored",
    name: "The Unmoored",
    matcher: (c) => !c[4] && !c[6] && (c[7] || 0) > 0,
    missingNumbers: [4, 6],
    severity: "significant",
    interpretation: `THE UNMOORED — ABSENCE OF 4 AND 6
When the psychomatrix lacks both the number 4 (Health) and the number 6 (Labor/Grounding), the individual is disconnected from the two primary anchors of embodied existence: the physical vessel itself and the instinct for productive work. You may have luck (7 present) — the cosmic wind that occasionally fills the sails — but you have no hull (4) and no oars (6). This creates the "Unmoored" pattern: a person who drifts, following the currents of fortune, but struggles to establish the structural foundations that convert opportunity into lasting achievement.
The experience of being Unmoored is one of chronic disconnection from the body's signals and the satisfaction of sustained labor. You may find yourself intellectually or intuitively brilliant — capable of insights that astonish others — but fundamentally unable to translate those insights into disciplined, daily action. Projects begin with inspiration and dissolve before completion. Health regimens are researched extensively and abandoned quickly. Your relationship with your own body is characterized by neglect punctuated by panicked overcorrection, because the body's quiet maintenance signals (the 4 energy) are not part of your native operating system. You do not notice you are tired until you collapse; you do not notice you are hungry until you are faint.
The light of this configuration is a freedom from the tyranny of the material that more grounded individuals cannot access. You are not defined by your work (no 6), not limited by your body's complaints (no 4), and therefore capable of flights of creativity, spiritual insight, and intuitive perception that the earthbound can only envy. Lucky breaks (7) that arrive find you available — unencumbered by the commitments, routines, and bodily limitations that would prevent more anchored people from seizing sudden opportunities. You can pivot instantly, which in a rapidly changing world is an evolutionary advantage.
The shadow is rootlessness, unreliability, and a life of beautiful intentions that never crystallize into completed form. The absence of 6 is particularly challenging because labor — the act of showing up and doing the thing, day after day, regardless of inspiration — is how most human achievement is actually realized. Without this instinct, your life can become a gallery of brilliant rough drafts. The absence of 4 means that when your body finally does demand attention, it does so through crisis rather than maintenance. The prescription: externalize what is missing internally. Use habits, accountability partners, schedules, and environmental design to provide the grounding (6) and health awareness (4) that your native wiring does not supply. The Unmoored person who builds an external skeleton — a discipline architecture — becomes a unique synthesis of grounded vision that neither the purely grounded nor the purely visionary can achieve.`,
  },
  // ═══════════════════════════════════════════════════════════════════════════
  // PATTERN 4: The Unsheltered (no 6 + no 7)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "unsheltered",
    name: "The Unsheltered",
    matcher: (c) => !c[6] && !c[7] && (c[4] || 0) > 0,
    missingNumbers: [6, 7],
    severity: "significant",
    interpretation: `THE UNSHELTERED — ABSENCE OF 6 AND 7
When the psychomatrix lacks both the number 6 (Labor/Grounding) and the number 7 (Luck), the individual faces a specific economic and existential challenge: difficulty converting effort into material reward, and difficulty receiving unearned blessings. You have health (4 present) — your body functions, you have physical resilience — but the bridge between health and prosperous work (6) is missing, and the cosmic supplement that sometimes fills that gap for others (7) is also absent. This creates the "Unsheltered" pattern: a person who IS capable but struggles to MONETIZE that capability, who WORKS but does so without the instinctual satisfaction in labor that sustains others through difficulty, and who cannot depend on windfalls or lucky breaks to compensate for structural shortfalls.
The core experience of The Unsheltered is a kind of economic friction — the sense that every dollar earned requires more effort than it seems to cost others, that every career advancement is harder-won, and that no one is going to "discover" you, fund you, or hand you an unearned opportunity. You may observe others who work less competently but advance more quickly, who seem to fall into lucrative situations through luck (7) or who genuinely enjoy the grind in a way you cannot access (6). This observation, if unexamined, breeds resentment — and resentment is the Unsheltered person's most dangerous trap.
The light of this configuration is the development of extraordinary competence that is not dependent on market conditions, lucky timing, or the enjoyment of work. You learn to produce value REGARDLESS — because you have no choice, and because your health (4) provides the physical container to keep showing up. This creates a professional who is immune to the fluctuations that devastate luck-dependent peers and who cannot be derailed by the motivational droughts that stop labor-enjoyment-dependent peers. When the Unsheltered person succeeds — and success is absolutely possible — the success is particularly stable because it was built on competence rather than fortune, and on discipline rather than passion.
The shadow is chronic financial anxiety, a scarcity mindset that persists even in conditions of abundance, and a relationship with work that is purely instrumental — devoid of joy, meaning, or the satisfaction of craftsmanship. The absence of 6 can manifest as a kind of quiet nihilism about labor: "I work to survive, not to live." The absence of 7 can manifest as a kind of cosmic grievance: "The universe has never done me any favors." Both of these shadows must be consciously addressed. The prescription: separate the material from the spiritual. Allow work to be work — a transaction that funds your life — while finding meaning, joy, and "luck" in the domains your chart does support. The Unsheltered person who makes peace with the nature of their labor can build a fortress of competence that no external circumstance can breach.`,
  },
  // ═══════════════════════════════════════════════════════════════════════════
  // PATTERN 5: The Isolate (no 2 + no 4)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "isolate",
    name: "The Isolate",
    matcher: (c) => !c[2] && !c[4],
    missingNumbers: [2, 4],
    severity: "critical",
    interpretation: `THE ISOLATE — ABSENCE OF 2 AND 4
When the psychomatrix lacks both the number 2 (Bioenergy/Life Force) and the number 4 (Health), the individual faces a constitutionally low energy baseline combined with a fragile physical container — creating one of the most physically challenging configurations in the system. The 2 governs the body's vital energy — the raw bioelectric current that animates every cell, the reservoir of vitality from which all activity draws. The 4 governs the body's structural integrity — the resilience of tissues, the robustness of organs, the capacity to absorb stress without damage. When both are absent, you are running a high-performance operating system on hardware with no battery reserve and no damage buffer.
The phenomenological experience of The Isolate is chronic fatigue that has no obvious medical explanation and does not respond to the interventions that work for others. You may sleep eight hours and wake exhausted. You may exercise and find yourself depleted rather than energized. You may find social interaction — which for most people is energizing — to be a net drain on your limited reserves. This is not a character flaw or a failure of will; it is a constitutional reality that must be accommodated before it can be transcended. The Isolate person who tries to match the energy output of those with strong 2s and 4s will collapse — not from weakness, but from operating beyond design parameters.
The light of this configuration is the development of profound energy wisdom. Because you cannot afford to waste vitality, you become exquisitely discriminating about where your energy goes. You learn to distinguish between activities that drain and activities that replenish at a level of granularity that more energetically abundant individuals never need to develop. You become the master of conservation — not from stinginess but from necessity — and this mastery, once developed, extends beyond physical energy into emotional, mental, and spiritual vitality. The Isolate person often becomes an extraordinary teacher of boundaries, self-care, and the sacred economy of personal energy.
The shadow is social withdrawal, depression misdiagnosed as fatigue, and a life narrowed by the constant need to protect limited resources. The danger is that energy conservation becomes energy hoarding — that you stop doing the things that would actually replenish you (connection, movement, expression) because the initial investment feels too costly. The Isolate person can become trapped in a feedback loop: isolation preserves energy, but prolonged isolation depletes the soul, which further reduces available energy. The prescription: learn to distinguish between the fatigue of depletion (which requires rest) and the fatigue of stagnation (which requires movement). The Isolate's most counterintuitive lesson is that sometimes the way to increase energy is to spend it — wisely, in small doses, on things that genuinely nourish — rather than to hoard it in isolation.`,
  },
  // ═══════════════════════════════════════════════════════════════════════════
  // PATTERN 6: The Unseen (no 1 + no 7)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "unseen",
    name: "The Unseen",
    matcher: (c) => !c[1] && !c[7],
    missingNumbers: [1, 7],
    severity: "significant",
    interpretation: `THE UNSEEN — ABSENCE OF 1 AND 7
When the psychomatrix lacks both the number 1 (Character/Ego/Will) and the number 7 (Luck/Divine Interference), the individual operates without the engine of self-assertion AND without the cosmic spotlight that draws attention and opportunity to others. This creates the "Unseen" pattern: a person who achieves quietly, contributes substantially, and receives disproportionately little recognition or reward for their efforts. You are the invisible achiever — the person whose work speaks but whose voice is not heard, whose competence is exploited but whose name is forgotten.
The 1 governs the capacity for self-assertion, the willingness to take up space, and the natural sense of being the protagonist of one's own story. Without it, the impulse to center yourself, to claim credit, to demand recognition, is weak or absent. You do not naturally feel like the main character of your life — you feel like a supporting character, and you behave accordingly. The 7 governs luck and cosmic visibility — the mysterious mechanism by which some people seem to be "discovered," promoted, or favored by circumstance without obvious merit. Without it, you do not benefit from this invisible hand of fortune. The combination means you will not promote yourself (no 1) and the universe will not promote you either (no 7) — creating a perfect storm of invisibility.
The light of this configuration is the development of a rare and valuable form of ego-transcendence. Because you do not need to be seen to feel valid, you can pursue excellence for its own sake rather than for applause. You can support others' success without feeling diminished by it. You can work behind the scenes on projects that matter without the psychic cost of obscurity that torments those who require visibility. In spiritual terms, The Unseen has a natural affinity for the path of selfless service — karma yoga — that more ego-driven individuals must spend lifetimes cultivating. Your soul chose an incarnation where the lesson is to create without needing to sign the creation.
The shadow is chronic under-recognition, career stagnation despite genuine competence, and a corrosive resentment that builds slowly over decades of watching less capable people advance ahead of you. The Unseen person who does not consciously address the visibility gap can end up bitter — the "unsung genius" whose genius curdles into grievance. The prescription: since neither internal impulse (1) nor external fortune (7) will bring you into the light, you must build systems for visibility. This is not "selling out" or betraying your humble nature — it is the practical accommodation of a constitutional reality. Schedule self-promotion the way you schedule meetings. Build relationships with people who naturally advocate for others. Document your contributions in ways that are visible to decision-makers. The Unseen who learns to engineer visibility without relying on ego or luck becomes an unstoppable force — because the competence is already there, waiting only for the illumination that will let the world finally see it.`,
  },
  // ═══════════════════════════════════════════════════════════════════════════
  // PATTERN 7: The Voiceless (no 3 + no 8)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "voiceless",
    name: "The Voiceless",
    matcher: (c) => !c[3] && !c[8],
    missingNumbers: [3, 8],
    severity: "significant",
    interpretation: `THE VOICELESS — ABSENCE OF 3 AND 8
When the psychomatrix lacks both the number 3 (Curiosity/Expression) and the number 8 (Duty/Responsibility), the individual carries a rich inner world that struggles to find external form. The 3 governs the impulse to explore, question, and communicate — it is the engine of intellectual curiosity and the bridge between internal experience and external expression. The 8 governs the sense of duty, obligation, and the structural frameworks within which expression becomes disciplined and socially legible. When both are absent, you are the person who FEELS deeply, KNOWS intuitively, and UNDERSTANDS complexly — but cannot seem to get any of it OUT in a way that others can receive.
The inner architecture of The Voiceless is not empty — it is often extraordinarily rich. You may have vivid dreams, profound intuitions, complex emotional landscapes, and insights that would be transformative if articulated. But the channel between the inner world and the outer expression (3) is missing, and the structural discipline that would compel you to build that channel anyway (8) is also absent. The result is a life lived largely internally — a cathedral of private meaning that few are ever invited to enter, because the doors (3) were never installed and there is no obligation (8) to build them.
The light of this configuration is the development of a contemplative depth that more expressive individuals rarely access. Because you do not immediately externalize every thought and feeling, your inner world has TIME to mature, to deepen, to develop nuance and complexity. You are the person who speaks rarely but says something worth remembering when you finally do. Your silence is not emptiness but pregnancy — a gestation of meaning that, when it finally births, carries weight that chatter cannot approach. In spiritual terms, The Voiceless has a natural affinity for the contemplative traditions — for the wordless knowing, the apophatic wisdom, the truth that cannot be spoken but only experienced.
The shadow is isolation, misunderstanding, and the tragedy of unrealized potential. How many insights died inside you because they could not find their way out? How many connections were never made because you could not initiate the conversation? How many opportunities were lost because your silence was interpreted as indifference, incompetence, or agreement? The Voiceless person's deepest wound is not that they have nothing to say — it is that they have so much to say and no bridge to carry it across. The prescription: develop ALTERNATIVE channels of expression. If speech is difficult, write. If writing is difficult, create through image, music, or movement. If all direct expression is difficult, become a curator — someone who gathers and presents the expressions of others in ways that reveal new meaning. The Voiceless who finds even one reliable channel of externalization is no longer voiceless — they are simply speaking a language the world has not yet learned to hear.`,
  },
  // ═══════════════════════════════════════════════════════════════════════════
  // PATTERN 8: The Rootless (no 5 + no 6)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "rootless",
    name: "The Rootless",
    matcher: (c) => !c[5] && !c[6],
    missingNumbers: [5, 6],
    severity: "significant",
    interpretation: `THE ROOTLESS — ABSENCE OF 5 AND 6
When the psychomatrix lacks both the number 5 (Logic/Intuition) and the number 6 (Labor/Grounding), the individual is constitutionally ungrounded in the two faculties that connect abstract thought to practical reality. The 5 governs the capacity for logical analysis, intuitive synthesis, and the construction of coherent mental frameworks that make sense of experience. The 6 governs the instinct for productive labor, the satisfaction of craftsmanship, and the gravitational pull toward practical engagement with the material world. When both are absent, you are a mind without a method and a body without an instinct for work — the "Rootless" intellectual, the unfocused dreamer, the person who understands everything in theory and struggles to execute anything in practice.
The psychological signature of The Rootless is a kind of floating intelligence. You can grasp complex ideas with remarkable speed, but you cannot explain HOW you arrived at your understanding — the logical scaffolding (5) that would make your insights reproducible and teachable is not present. You can envision ambitious projects with vivid clarity, but you cannot sustain the daily, unglamorous labor (6) that turns vision into reality. This creates a specific frustration: you KNOW things but cannot PROVE them, you DREAM things but cannot BUILD them, and the gap between your conceptual capacity and your practical output becomes a chronic source of self-doubt and external skepticism.
The light of this configuration is a profound openness to direct knowing — the kind of intelligence that bypasses logical deduction entirely and arrives at truth through intuition, inspiration, and what the esoteric traditions call "direct cognition." The Rootless person can be a natural channel for creative and spiritual insights that more logically disciplined minds filter out as impossible or illogical before they can even be considered. You are not burdened by the "that's not how things work" reflex that constrains more grounded thinkers. Your mind is a receiver with a remarkably wide band, capable of picking up frequencies that others' more structured antennas miss entirely.
The shadow is chronic underachievement, intellectual promiscuity without depth, and a life of unrealized potential that becomes increasingly painful as time passes. The Rootless person can become the eternal student, the perpetual beginner, the fascinating conversationalist who never wrote the book, built the business, or completed the project. The absence of 6 is particularly corrosive over time because it erodes self-trust: each unfinished project becomes evidence that you "can't follow through," and this evidence accumulates into a self-narrative of fundamental inadequacy. The prescription: borrow structure. The Rootless person cannot generate logical frameworks (5) or labor discipline (6) from within, so they must import them from without. Systems, partners, coaches, schedules, environments, and commitments that are externally enforced become the scaffolding that allows your native intelligence to finally manifest in the world.`,
  },
  // ═══════════════════════════════════════════════════════════════════════════
  // PATTERN 9: The Hollow King (no 1 + no 8)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "hollow-king",
    name: "The Hollow King",
    matcher: (c) => !c[1] && !c[8],
    missingNumbers: [1, 8],
    severity: "significant",
    interpretation: `THE HOLLOW KING — ABSENCE OF 1 AND 8
When the psychomatrix lacks both the number 1 (Character/Ego Center) and the number 8 (Duty/Responsibility), the individual occupies positions of influence or authority without the internal architecture to sustain them. The 1 is the vertical axis of the self — the backbone of identity, the "I am" that stands against the world and declares itself. The 8 is the horizontal axis of obligation — the "I must" that binds the self to others through promises, responsibilities, and the sacred weight of duty. When both are absent, the individual is a center without a core — a leader without a foundation, a figure of authority whose authority has no internal source.
The Hollow King is not necessarily a tyrant or a fraud. Often, this configuration produces individuals who are genuinely well-intentioned, charismatic, and eager to serve — but whose leadership is performative rather than substantive because it is not anchored in either a stable sense of self (1) or a genuine sense of obligation to those they lead (8). Without 1, the leader does not know who they are independent of the leadership role. Without 8, the leader does not feel the weight of responsibility that transforms charisma into stewardship. The result is a leadership style that is reactive, people-pleasing, and ultimately hollow — capable of inspiring in the short term but incapable of sustaining in the long term.
The light of this configuration is the capacity for selfless service of a particular kind — the kind where the ego (1) does not obstruct the work and duty (8) does not become rigid dogma. The Hollow King who consciously fills the void with genuine principles, external accountability structures, and a clear mission can lead with a flexibility and responsiveness that more ego-anchored leaders cannot access. They are not defending a fixed identity, so they can adapt. They are not bound by rigid duty structures, so they can respond to circumstances with nuance. When this works, it produces a servant-leader of remarkable fluidity and genuine humility.
The shadow is catastrophic when it manifests in actual leadership positions. The Hollow King, unchecked and unfilled, becomes the leader who disappoints everyone — who makes promises without the internal architecture to keep them, who inspires loyalty without the capacity to honor it, who occupies the throne without the spine to rule. In relationships, this can manifest as the partner who loves the idea of commitment but cannot embody it, the parent who wants to be present but cannot show up, the friend who means well but cannot be depended upon. The prescription: fill the void. Since you cannot generate core identity (1) or duty sense (8) from within, you must consciously construct them through external commitments, written principles, accountability relationships, and the deliberate cultivation of integrity as a practice rather than an instinct. The Hollow King who fills themselves with substance becomes genuinely royal — not because they were born to rule, but because they chose to become worthy of the crown.`,
  },
  // ═══════════════════════════════════════════════════════════════════════════
  // PATTERN 10: The Spiritual Void (no 5 + no 7 + no 9, or all ≤ 1)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "spiritual-void",
    name: "The Spiritual Void",
    matcher: (c) =>
      (!c[5] && !c[7] && !c[9]) ||
      ((c[5] || 0) <= 1 && (c[7] || 0) <= 1 && (c[9] || 0) <= 1),
    missingNumbers: [5, 7, 9],
    severity: "critical",
    interpretation: `THE SPIRITUAL VOID — ABSENCE OR WEAKNESS OF 5, 7, AND 9
When the psychomatrix lacks or critically weakens the numbers 5 (Logic/Intuition), 7 (Luck/Divine Guidance), and 9 (Memory/Clairvoyance), the individual is cut off from the three primary channels of higher knowing. The 5 provides the bridge between mundane perception and intuitive insight — the faculty that allows one to "put two and two together" in ways that transcend linear logic. The 7 provides cosmic guidance — the sense of being led, protected, or nudged by forces larger than the self. The 9 provides access to the information field — the clairvoyant memory that can retrieve knowledge not personally learned. When all three are absent or extremely weak, the individual is — in terms of the spiritual anatomy — operating without antennae.
The phenomenological experience of The Spiritual Void is not necessarily atheism or materialism — it is a more fundamental disconnection from the non-ordinary channels of knowing that most spiritual traditions take for granted. You may WANT to believe, to feel guided, to access intuition, but the doors are simply not open. Prayers feel like talking to the ceiling. Meditation produces silence but not insight. Intuitive hunches, when they come, are unreliable. This is not a moral failure or a lack of spiritual sincerity — it is, in the Alexandrov system, a constitutional configuration. The spiritual channels are not blocked; they are not yet built. This soul has incarnated without the native wiring for transcendent experience and must either construct it from scratch or find meaning entirely within the material plane.
The light of this configuration — and there is genuine light here, despite the grim language — is the opportunity for the most authentic spiritual development possible. The Spiritual Void person who DOES develop intuition (through practice), who DOES experience guidance (through earned attunement), who DOES access clairvoyant knowing (through disciplined cultivation) has something that the naturally gifted can never claim: PROOF. They know their spirituality is real because they started with nothing and built it themselves. They know their guidance is trustworthy because every failure of discernment was their own teacher. Their faith, if they find it, is unshakeable because it was forged rather than inherited. This is the alchemy of the Void: the emptiness that becomes the most fertile ground precisely because nothing grows there without conscious cultivation.
The shadow is spiritual nihilism, existential despair, and a life lived entirely within the flatland of material cause and effect. The Spiritual Void person who never awakens the dormant channels can become the bitter materialist — someone whose skepticism is not genuine inquiry but the rationalization of a capacity they do not possess. The prescription: begin with reason. Since intuition (5) is weak, use logic. Since guidance (7) is absent, use ethics. Since clairvoyance (9) is offline, use study. The path through the Spiritual Void is not to leap into faith but to walk, step by rational step, into domains that reason alone cannot fully map — arriving not through belief but through the exhaustion of disbelief, the patient accumulation of experiences that cannot be explained by the materialist paradigm. The Void is not the absence of spirit. It is the womb of spirit, waiting to be filled.`,
  },
  // ═══════════════════════════════════════════════════════════════════════════
  // PATTERN 11: The Unchanneled (no 3 + no 5)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "unchanneled",
    name: "The Unchanneled",
    matcher: (c) => !c[3] && !c[5],
    missingNumbers: [3, 5],
    severity: "moderate",
    interpretation: `THE UNCHANNELED — ABSENCE OF 3 AND 5
When the psychomatrix lacks both the number 3 (Curiosity/Inquiry) and the number 5 (Logic/Intuition), the individual's mind operates without the engine of questioning (3) AND without the framework for answering (5). This creates the "Unchanneled" pattern: an intelligence that is present but directionless, a knowing that is felt but not interrogated, a mind that receives impressions but does not process them into understanding. You may be perceptive in ways that surprise others — picking up on emotional states, reading rooms, sensing danger — but you cannot trace HOW you arrived at these perceptions, nor can you systematically apply them to new situations.
The psychological signature of The Unchanneled is a kind of passive intelligence. Knowledge arrives but is not sought. Understanding accumulates but is not organized. The mind is a catchment basin rather than an irrigation system — it receives the rainfall of experience but does not direct it toward productive growth. Unlike The Voiceless (no 3, no 8), who has something to say but cannot say it, The Unchanneled may not even know WHAT they know until circumstances force it to the surface. Their intelligence is latent, dormant, waiting for the right question to activate it — but the impulse to ask the question (3) is absent, and the framework for organizing the answer (5) is missing.
The light of this configuration is a profound receptivity that more analytically aggressive minds cannot access. Because you are not constantly asking (3) or analyzing (5), you are AVAILABLE to experience in a way that others are not. Your mind is quiet. This quiet creates space for insights that would be drowned out by the constant chatter of self-questioning and logical processing that occupies most people's mental bandwidth. In contemplative terms, The Unchanneled person has a natural gift for beginner's mind — the state of not-knowing that Zen traditions spend decades cultivating.
The shadow is intellectual passivity, gullibility, and a vulnerability to being led by others' thinking because you lack the tools to form your own. The Unchanneled person who does not develop compensatory strategies can become the follower of gurus, the subscriber to ideologies, the consumer of others' conclusions — because the machinery of independent inquiry and analysis is simply not online. The prescription: externalize the inquiry process. Since the internal impulse to question (3) and analyze (5) is absent, build it externally — through journaling prompts, study partners who ask you questions, reading disciplines that force engagement, and environments that reward curiosity. The Unchanneled mind, once channeled, produces insights of unusual purity precisely because they were not forced — they were allowed to form naturally in the quiet, and then gently drawn into the light.`,
  },
  // ═══════════════════════════════════════════════════════════════════════════
  // PATTERN 12: The Weightless (no 1 + no 2 + no 3) — all Column 1 missing
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "weightless",
    name: "The Weightless",
    matcher: (c) => !c[1] && !c[2] && !c[3],
    missingNumbers: [1, 2, 3],
    severity: "critical",
    interpretation: `THE WEIGHTLESS — ABSENCE OF 1, 2, AND 3 (ENTIRE COLUMN 1)
When the psychomatrix lacks all three digits of Column 1 — the Self-Esteem Column — the individual operates without the vertical axis of selfhood that grounds most people in their own identity. The 1 (Character/Ego) is the center, the 2 (Bioenergy) is the fuel that powers the center, and the 3 (Curiosity) is the outward-reaching impulse that extends the center into the world. When all three are absent, the self is present — you exist, you are conscious — but it is a self without density, without gravitational pull, without the natural centering that makes a person feel like a PERSON rather than a collection of responses to external stimuli.
The experience of The Weightless is not exactly depersonalization — though it can shade into that territory — but rather a kind of existential transparency. You feel that you are less solid, less defined, less "there" than other people. Your preferences are malleable. Your boundaries are porous. Your sense of who you are shifts dramatically depending on who you are with, because the internal gyroscope (Column 1) that maintains orientation independent of environment is not available. This can be terrifying or liberating, depending on how it is held — terrifying if you interpret it as a flaw, liberating if you recognize it as a form of freedom that more self-dense individuals cannot imagine.
The light of this configuration is an extraordinary capacity for shape-shifting, adaptation, and egoless presence. The Weightless person can be whoever the situation needs them to be — not from manipulation but from a genuine flexibility of identity that allows them to meet others exactly where they are. In spiritual terms, this is the state that many traditions call "no-self" (anatta) — the recognition that the solid, continuous self is an illusion. The Weightless person does not need to seek this realization; they are born into it. Their challenge is not to dissolve the ego but to build a FUNCTIONAL ego that allows them to navigate a world that assumes everyone has one.
The shadow is a profound vulnerability to external definition. The Weightless person who lacks conscious awareness of their configuration can become whatever others project onto them — a shape-shifter without sovereignty, a mirror without a face, a life lived entirely in response to others' needs and expectations. The absence of 2 (bioenergy) compounds this by making it difficult to even FEEL the depletion that comes from this self-abandonment — you may not notice you have been giving yourself away until there is nothing left. The prescription: construct an artificial self. Since the natural self-center is absent, you must consciously BUILD identity through choices, commitments, boundaries, and preferences that are articulated, written down, and defended. This is not inauthentic — it is the most authentic thing a Weightless person can do, because it transforms a congenital absence into a conscious creation.`,
  },
  // ═══════════════════════════════════════════════════════════════════════════
  // PATTERN 13: The Unbound (no 7 + no 8 + no 9) — all Column 3 missing
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "unbound",
    name: "The Unbound",
    matcher: (c) => !c[7] && !c[8] && !c[9],
    missingNumbers: [7, 8, 9],
    severity: "critical",
    interpretation: `THE UNBOUND — ABSENCE OF 7, 8, AND 9 (ENTIRE COLUMN 3)
When the psychomatrix lacks all three digits of Column 3 — the Talent/Destiny Column — the individual is radically unprogrammed in the domain of higher purpose. The 7 (Luck/Divine Guidance) provides cosmic direction, the 8 (Duty/Responsibility) provides structural obligation, and the 9 (Memory/Clairvoyance) provides access to the information field that contains the blueprint of one's destiny. When all three are absent, the individual is — in terms of the destiny architecture — a blank slate. There is no pre-written destiny, no innate sense of mission, no cosmic pull toward a particular life path. This is terrifying for some and exhilarating for others, because it means the question "what am I here to do?" has no pre-existing answer.
The phenomenological experience of The Unbound is a kind of existential freedom that borders on vertigo. You may look at others who seem to "know" their purpose — who feel called to medicine, to art, to teaching, to activism — with a mixture of envy and bewilderment, because that kind of knowing simply does not arise in you. You are not blocked from your purpose; you are unpurposed by design. The 7 does not guide you, the 8 does not obligate you, and the 9 does not remember for you what your soul intended before incarnation. This means your life direction must be CHOSEN rather than DISCOVERED — a distinction that is liberating once internalized but can be paralyzing before that point.
The light of this configuration is the most radical form of free will available in the psychomatrix system. The Unbound person is not carrying karmic obligations (no 8), not being shepherded by cosmic forces (no 7), and not retrieving a pre-incarnational blueprint from the information field (no 9). You are, in the most literal sense, making it up as you go along — and "making it up" is, in this context, not a criticism but a description of your highest potential. You are the artist of your own destiny in a way that more programmed individuals can never be, because their art is constrained by the canvas they were given.
The shadow is drift, aimlessness, and a life that never coheres into meaningful form. The Unbound person who does not consciously CHOOSE a purpose can spend decades waiting for one to arrive — trying on paths, abandoning them, trying again, abandoning again, mistaking the absence of a felt calling for evidence that the "right" path is still out there somewhere. It is not. For The Unbound, the right path is the one you commit to, period. The prescription: choose your destiny. Deliberately, consciously, with full awareness that you could choose differently tomorrow but won't. Write it down. Tell people. Build structures around it. The Unbound who makes a sovereign choice and honors it for a decade or more achieves something that the pre-programmed can never understand: a destiny that is not inherited but AUTHORED.`,
  },
  // ═══════════════════════════════════════════════════════════════════════════
  // PATTERN 14: The Exhausted (no 2 + no 6)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "exhausted",
    name: "The Exhausted",
    matcher: (c) => !c[2] && !c[6],
    missingNumbers: [2, 6],
    severity: "significant",
    interpretation: `THE EXHAUSTED — ABSENCE OF 2 AND 6
When the psychomatrix lacks both the number 2 (Bioenergy) and the number 6 (Labor/Grounding), the individual faces a dual depletion: the raw energy to fuel action (2) is missing, and the instinctual satisfaction in labor that makes work feel worthwhile (6) is also absent. This creates the "Exhausted" pattern: a person who must WORK to survive (as everyone must) but who lacks both the energy to do the work and the pleasure in doing it that would make the energy expenditure feel meaningful. You are not lazy — laziness implies a surplus of energy deliberately withheld. You are constitutionally under-supplied with the resource that productive action requires, and the action itself does not replenish you the way it replenishes others.
The psychological signature of The Exhausted is a relationship with productivity that is purely extractive. Work takes energy (2) and returns nothing emotionally or psychically (no 6 satisfaction). This means every productive act is a net loss, and the only way to maintain output is through increasingly draconian energy management — which, given the absence of 2, is like budgeting a currency you barely possess. The Exhausted person can develop an almost obsessive relationship with rest, recovery, and energy conservation — not from laziness but from the accurate perception that their reserves are dangerously low and their expenditures are never replenished.
The light of this configuration is the development of extraordinary efficiency. Because you cannot afford wasted motion, you learn to accomplish in one hour what takes others four. Because work does not feel good (no 6), you learn to complete it quickly and competently rather than lingering in the pleasure of process. Because energy is scarce (no 2), you learn to prioritize with a ruthlessness that more abundant individuals never need to develop. The Exhausted person who masters these adaptations becomes a productivity savant — someone whose output-to-input ratio is so optimized that it appears almost supernatural.
The shadow is burnout so deep it becomes identity — not the burnout of overwork but the burnout of living in an energy economy that is perpetually in deficit. The Exhausted person can lose the ability to distinguish between "I need rest" and "I need engagement" because both states feel equally draining, and the fear of further depletion overrides the intuition that some activities actually generate energy. The prescription: identify your replenishment sources with scientific precision. The Exhausted person must become a researcher of their own energy — tracking, measuring, and identifying the specific activities, relationships, and environments that provide net energy gain, however small. These sources are your lifelines, and protecting them is not selfishness but survival.`,
  },
  // ═══════════════════════════════════════════════════════════════════════════
  // PATTERN 15: The Unwitnessed (no 1 + no 3)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "unwitnessed",
    name: "The Unwitnessed",
    matcher: (c) => !c[1] && !c[3],
    missingNumbers: [1, 3],
    severity: "moderate",
    interpretation: `THE UNWITNESSED — ABSENCE OF 1 AND 3
When the psychomatrix lacks both the number 1 (Character/Ego) and the number 3 (Curiosity/Expression), the individual exists in a state of diminished self-narrative. The 1 provides the sense of being the protagonist, the 3 provides the impulse to tell the story. Without either, you experience your life not as a story you are telling but as a series of events you are undergoing — a passive, first-person film with no narrator and no sense that the camera has a director. You are not invisible to others so much as you are invisible to yourself; you do not witness your own life, and therefore cannot narrate it.
The phenomenological experience of The Unwitnessed is surprisingly peaceful in its lower registers and existentially disturbing in its higher ones. On a day-to-day level, the absence of an insistent ego-narrative (1) and the lack of constant intellectual commentary (3) can create a kind of spacious presence — you are simply HERE, experiencing, without the mental chatter that consumes most people's bandwidth. This can feel like a meditative state that others spend years trying to achieve. But over longer timescales, the absence of self-witnessing means your life lacks narrative coherence — you cannot explain to yourself who you are, how you got here, or where you are going, because the machinery of self-storytelling was never installed.
The light of this configuration is the capacity for pure presence. The Unwitnessed person can be fully, completely, unselfconsciously engaged in the present moment in a way that more narratively structured individuals can only access temporarily. You are not performing your life; you are living it, and this authenticity is palpable to others. In relationships, you offer the rare gift of attention without agenda — you listen not to respond but to receive, because the ego impulse to turn the conversation back toward yourself (1) is weak and the curiosity impulse to interrogate (3) is absent.
The shadow is a life unlived in the sense of a life unintegrated. Without the capacity to witness and narrate your own experience, you may reach the end of decades and realize you have no story of those decades — no coherent understanding of what happened, what it meant, or who you became through it. The Unwitnessed person's deepest risk is not a bad life but an unprocessed life — a life of rich experience that was never metabolized into wisdom, identity, or legacy. The prescription: externalize the witness. Journaling, therapy, trusted friends who reflect you back to yourself, creative practices that force you to make choices about what to include and exclude — these become the external narrative faculty that your internal wiring cannot supply.`,
  },
  // ═══════════════════════════════════════════════════════════════════════════
  // PATTERN 16: The Unstructured (no 5 + no 8)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "unstructured",
    name: "The Unstructured",
    matcher: (c) => !c[5] && !c[8],
    missingNumbers: [5, 8],
    severity: "moderate",
    interpretation: `THE UNSTRUCTURED — ABSENCE OF 5 AND 8
When the psychomatrix lacks both the number 5 (Logic/Intuition) and the number 8 (Duty/Responsibility), the individual operates without the two primary organizing principles that give life structure and coherence. The 5 provides the internal framework of logic and intuition that allows one to organize experience into meaningful patterns. The 8 provides the external framework of obligation and responsibility that anchors behavior in consistent, predictable forms. Without either, The Unstructured person lives in a state of perpetual improvisation — responding to life as it arrives, without a system for processing it (5) or a structure for containing it (8).
The experience of being Unstructured is a kind of existential improvisation that is simultaneously exhilarating and exhausting. You are remarkably free — free from the tyranny of logical consistency (5), free from the weight of duty and obligation (8), free to change your mind, your direction, your values, and your commitments without the internal resistance that constrains more structured individuals. But this freedom comes at the cost of coherence. Others may experience you as unreliable, unpredictable, or impossible to pin down — not because you are dishonest but because your internal weather changes without the stabilizing influence of logical consistency (5) or dutiful commitment (8).
The light of this configuration is adaptability and creative spontaneity of an almost miraculous quality. The Unstructured person can pivot in response to new information faster than anyone, because no logical framework (5) must be updated and no duty structure (8) must be honored. You are the ultimate improviser — the jazz musician of existence, capable of creating beauty in the moment without a score. In rapidly changing environments, this is a competitive advantage that more structured individuals cannot match.
The shadow is chaos, unreliability, and the tragic pattern of disappointing others not from malice but from a constitutional inability to hold form. The Unstructured person who does not consciously build external structures becomes the friend who cancels, the partner who cannot commit, the professional who starts brilliantly and disappears mysteriously. The prescription: build external scaffolding. Since the internal architecture of logic (5) and duty (8) is absent, you must construct it through calendars, contracts, accountability systems, and environments that provide the structure your native wiring cannot generate. The Unstructured person who builds a reliable exoskeleton becomes a unique combination of creative spontaneity and dependable execution.`,
  },
];
// ─────────────────────────────────────────────────────────────────────────────
// PUBLIC API
// ─────────────────────────────────────────────────────────────────────────────
/**
 * Analyzes combinations of missing numbers (digits 1-9) from the psychomatrix.
 * Returns all applicable absence patterns with full verbatim interpretations.
 *
 * Each pattern represents a specific psychological/spiritual configuration
 * where the simultaneous absence of certain numbers creates a distinct
 * archetypal signature. All interpretations are verbatim (200-400 words each).
 *
 * @param counts - Record mapping digit (1-9) to its count in the psychomatrix
 * @returns CombinedAbsenceResult with all applicable patterns
 */
export function analyzeCombinedAbsence(
  counts: Record<number, number>,
  personalization?: {
    lifePath: number;
    psycheNum: number;
    destinyNum: number;
    strongestCell: string;
  },
): CombinedAbsenceResult {
  const applicablePatterns: CombinedAbsencePattern[] = [];
  for (const pattern of ABSENCE_PATTERNS) {
    if (pattern.matcher(counts)) {
      // Generate personalized prefix based on user's actual chart
      let personalizedPrefix = "";
      if (personalization) {
        const { lifePath, psycheNum, destinyNum, strongestCell } =
          personalization;
        const presentNums = [1, 2, 3, 4, 5, 6, 7, 8, 9].filter(
          (d) => !!counts[d],
        );
        const presentStr =
          presentNums.length > 0
            ? `Your chart contains: ${presentNums.join(", ")}`
            : "";
        personalizedPrefix = `\n\n── PERSONALIZED FOR YOUR CHART ──\nLife Path ${lifePath} | Psychic ${psycheNum} | Destiny ${destinyNum} | Strongest cell: ${strongestCell}\n${presentStr}\n`;
      }
      applicablePatterns.push({
        id: pattern.id,
        name: pattern.name,
        missingNumbers: pattern.missingNumbers,
        interpretation: personalizedPrefix + pattern.interpretation,
        severity: pattern.severity,
      });
    }
  }
  // Count total missing digits
  const totalMissing = [1, 2, 3, 4, 5, 6, 7, 8, 9].filter(
    (d) => !counts[d],
  ).length;
  // Generate summary
  let summary: string;
  if (applicablePatterns.length === 0) {
    summary =
      "No combined absence patterns detected. While individual numbers may be missing, no significant multi-digit absence configurations are present. This is a relatively balanced chart in terms of the absence architecture.";
  } else if (applicablePatterns.length === 1) {
    summary = `1 combined absence pattern detected: ${applicablePatterns[0].name}. Total missing digits across the psychomatrix: ${totalMissing}.`;
  } else {
    const names = applicablePatterns.map((p) => p.name).join(", ");
    summary = `${applicablePatterns.length} combined absence patterns detected: ${names}. Total missing digits across the psychomatrix: ${totalMissing}. This indicates a chart with significant absence architecture — the negative space of the psychomatrix carries as much meaning as its positive configurations.`;
  }
  // Sort by severity: critical first, then significant, then moderate
  const severityOrder: Record<string, number> = {
    critical: 0,
    significant: 1,
    moderate: 2,
  };
  applicablePatterns.sort(
    (a, b) => severityOrder[a.severity] - severityOrder[b.severity],
  );
  return {
    patterns: applicablePatterns,
    summary,
    totalMissing,
  };
}