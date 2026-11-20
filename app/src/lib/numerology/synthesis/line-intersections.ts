// src/lib/numerology/synthesis/line-intersections.ts
// Line Intersection Analysis — Psychomatrix Line Interactions
//
// Analyzes when multiple psychomatrix lines are simultaneously active
// (strong or overloaded), creating emergent patterns that transcend
// individual line meanings. When two or more lines reach threshold
// levels simultaneously, their combined influence produces a unique
// psychological/spiritual configuration. All interpretations are
// verbatim (200-400 words).
//
// The psychomatrix contains 8 lines:
// - Row 1 (Purpose/Will): [1, 4, 7]
// - Row 2 (Family/Bioenergy): [2, 5, 8]
// - Row 3 (Habits/Stability): [3, 6, 9]
// - Col 1 (Self-Esteem): [1, 2, 3]
// - Col 2 (Making a Living): [4, 5, 6]
// - Col 3 (Talent/Destiny): [7, 8, 9]
// - Diag Spirit (Spirituality): [1, 5, 9]
// - Diag Carnal (Temperament): [3, 5, 7]
export interface LineTotals {
  row_1: number;
  row_2: number;
  row_3: number;
  col_1: number;
  col_2: number;
  col_3: number;
  diag_spirit: number;
  diag_carnal: number;
}
export interface LineIntersectionPattern {
  /** Unique pattern identifier */
  id: string;
  /** The archetypal name of this line intersection pattern */
  name: string;
  /** Description of the condition that triggers this pattern */
  condition: string;
  /** Which lines are involved */
  involvedLines: string[];
  /** Full verbatim interpretation (200-400 words) */
  interpretation: string;
}
export interface LineIntersectionResult {
  /** All line intersection patterns that apply */
  patterns: LineIntersectionPattern[];
  /** Summary string for UI display */
  summary: string;
  /** Optional exporter-friendly long text. Pattern interpretations remain canonical. */
  interpretation?: string;
  /** The computed line totals for reference */
  lineTotals: LineTotals;
}
// ─────────────────────────────────────────────────────────────────────────────
// LINE THRESHOLD HELPERS
// ─────────────────────────────────────────────────────────────────────────────
function weak(t: number): boolean {
  return t <= 1;
}
function strong(t: number): boolean {
  return t >= 4;
}
function overloaded(t: number): boolean {
  return t >= 6;
}
function normal(t: number): boolean {
  return t >= 2 && t <= 3;
}
// ─────────────────────────────────────────────────────────────────────────────
// LINE INTERSECTION PATTERN DEFINITIONS
// ─────────────────────────────────────────────────────────────────────────────
interface PatternDef {
  id: string;
  name: string;
  condition: string;
  matcher: (lt: LineTotals) => boolean;
  involvedLines: string[];
  interpretation: string;
}
const LINE_INTERSECTION_PATTERNS: PatternDef[] = [
  // ═══════════════════════════════════════════════════════════════════════════
  // PATTERN 1: Spiritual Materialist (Spirituality Diag overload AND Row 3 overload)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "spiritual-materialist",
    name: "The Spiritual Materialist",
    condition:
      "Spirituality Diagonal overloaded (6+) AND Row 3 (Stability) overloaded (6+)",
    matcher: (lt) => overloaded(lt.diag_spirit) && overloaded(lt.row_3),
    involvedLines: ["Spirituality Diagonal", "Row 3 (Stability)"],
    interpretation: `THE SPIRITUAL MATERIALIST — SPIRITUALITY DIAGONAL OVERLOAD × STABILITY ROW OVERLOAD
When both the Spirituality Diagonal (1-5-9) and the Stability Row (3-6-9) are overloaded simultaneously, the individual lives in a state of perpetual oscillation between transcendence and accumulation — swinging between the impulse to release all attachments and the impulse to gather, hoard, and secure. This is one of the most internally contradictory configurations in the psychomatrix system, and it produces a person whose relationship with the material world is a constant, exhausting negotiation between two equally powerful and opposite forces.
The Spirituality Diagonal, when overloaded with 6 or more digits, creates an almost gravitational pull toward the transcendent. This is not a mild interest in meditation or philosophy; it is a constitutional orientation toward the non-material that makes ordinary life feel, at a deep level, unsatisfying. The overloaded spiritual diagonal says: "None of this matters. The material world is illusion. True fulfillment is elsewhere." But the Stability Row, also overloaded with 6 or more digits, says the exact opposite with equal force: "Security matters. Resources matter. Comfort matters. Build the fortress, stock the stores, insulate yourself against the chaos of existence." These two voices do not take turns — they speak simultaneously, creating an internal cacophony that the Spiritual Materialist must somehow orchestrate into a livable harmony.
The phenomenological experience of this configuration is a life characterized by dramatic swings in lifestyle, priorities, and identity. The Spiritual Materialist may go through phases of radical minimalism and spiritual devotion, only to pendulum-swing into phases of intense career focus and material accumulation — each phase feeling, while it lasts, like the "real" self, and each phase leaving shame and confusion in its wake when the pendulum swings back. Neither pole is inauthentic; BOTH are real expressions of the overloaded lines that constitute this chart. The suffering comes from the belief that one must be chosen over the other, that the spiritual and the material are enemies rather than dance partners.
The light of this configuration is the potential for a genuinely integrated relationship with both spirit and matter. The Spiritual Materialist who stops trying to choose between the two poles and instead learns to hold them in creative tension becomes someone who can navigate both worlds fluently — who understands that spiritual development requires material stability and that material success without spiritual depth is empty. This is the archetype of the conscious entrepreneur, the mindful capitalist, the person who builds wealth as a spiritual practice and practices spirituality with grounded practicality.
The shadow is chronic restlessness, identity fragmentation, and the inability to feel at home anywhere. The Spiritual Materialist who never integrates the two poles may spend a lifetime feeling that they are betraying one half of themselves with every choice they make — too materialistic for the spiritual crowd, too "woo-woo" for the materialists, belonging fully to neither tribe and therefore perpetually lonely. The prescription: recognize that the conflict is the curriculum. You are not here to choose between spirit and matter; you are here to demonstrate that they are not separate. The fortress can be a temple. The temple can be well-funded. The oscillation is not a flaw to be eliminated but a rhythm to be mastered.`,
  },
  // ═══════════════════════════════════════════════════════════════════════════
  // PATTERN 2: Burnt Offering (Row 1 overload AND Row 3 overload)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "burnt-offering",
    name: "The Burnt Offering",
    condition:
      "Row 1 (Purpose/Will) overloaded (6+) AND Row 3 (Stability) overloaded (6+)",
    matcher: (lt) => overloaded(lt.row_1) && overloaded(lt.row_3),
    involvedLines: ["Row 1 (Purpose/Will)", "Row 3 (Stability)"],
    interpretation: `THE BURNT OFFERING — PURPOSE ROW OVERLOAD × STABILITY ROW OVERLOAD
When both Row 1 (Purpose/Will) and Row 3 (Habits/Stability) are overloaded simultaneously, the individual possesses an extraordinary quantity of both directed will (Row 1) and structural persistence (Row 3) — creating a burnout machine of immense power. Row 1, composed of the digits 1 (Character), 4 (Health), and 7 (Luck), governs the capacity to set direction, assert purpose, and maintain the forward thrust of life. When overloaded, this row produces a person who is perpetually DRIVEN — not in the healthy sense of having goals but in the pathological sense of being unable to stop, relax, or simply be. Row 3, composed of 3 (Curiosity), 6 (Labor), and 9 (Memory), governs the capacity to sustain effort, maintain habits, and persist through difficulty. When overloaded, this row produces a person who is perpetually DOING — not in the healthy sense of being productive but in the pathological sense of being unable to rest, to receive, or to allow incompletion.
Together, these overloaded rows create a person who is simultaneously always-driving (Row 1) and always-doing (Row 3) — a perpetual motion machine whose output can be genuinely superhuman but whose cost is equally superhuman. The Burnt Offering is the person who builds the company while raising the family while pursuing the degree while maintaining the fitness regimen — not because they have extraordinary time management skills but because their internal wiring does not include an off switch. They are not balanced; they are overclocked, and the performance is spectacular until the processor melts.
The phenomenological experience of the Burnt Offering is a life lived at a pace that others find incomprehensible and frightening. You accomplish more before breakfast than most people accomplish in a week, not because you are better than them but because you are constitutionally incapable of NOT accomplishing things. Rest feels like failure. Stillness feels like death. The voice of the overloaded Row 1 says "You must," and the voice of the overloaded Row 3 says "Keep going," and between these two voices, the quieter voice of the body, the heart, and the soul is simply drowned out until it screams through crisis.
The light of this configuration is that genuine greatness IS achievable. The Burnt Offering person has the raw horsepower to accomplish things that others can only dream of. The question is not one of capacity but of sustainability. The Burnt Offering who learns to modulate their output — to rest BEFORE exhaustion, to pause BEFORE completion, to value being as much as doing — becomes a high-output individual who can sustain that output for a lifetime rather than burning brightly and briefly like a shooting star.
The shadow is the crash that comes when the body, the relationships, or the psyche finally refuse to continue at the unsustainable pace. The Burnt Offering who never learns moderation will eventually be stopped involuntarily — by illness, by divorce, by breakdown — and the stopping will feel like death because they have never developed the capacity to exist outside of productive motion. The prescription: schedule rest with the same ferocity you schedule work. Treat stillness as a discipline rather than an indulgence. And most importantly, examine WHY you cannot stop — because the overloaded rows are compensating for something, and until that something is faced, the compulsion to burn will continue.`,
  },
  // ═══════════════════════════════════════════════════════════════════════════
  // PATTERN 3: The Hidden Oracle (Col 3 strong AND Col 1 overloaded)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "hidden-oracle",
    name: "The Hidden Oracle",
    condition:
      "Column 3 (Talent/Destiny) strong (4+) AND Column 1 (Self-Esteem) overloaded (6+)",
    matcher: (lt) => strong(lt.col_3) && overloaded(lt.col_1),
    involvedLines: ["Column 3 (Talent/Destiny)", "Column 1 (Self-Esteem)"],
    interpretation: `THE HIDDEN ORACLE — TALENT STRONG × SELF-ESTEEM OVERLOAD
When Column 3 (Talent/Destiny) is strong and Column 1 (Self-Esteem) is overloaded simultaneously, the individual possesses significant gifts (the 7-8-9 of Column 3) that are largely hidden behind an overdeveloped and demanding self-image (the 1-2-3 of Column 1). This is the "Hidden Oracle": the person whose genuine talents and higher guidance are obscured not by lack of ability but by an ego structure so loud, so insistent, and so preoccupied with its own performance that the quieter voice of destiny cannot be heard.
Column 3 is the destiny column — it contains the luck that guides (7), the duty that structures (8), and the clairvoyance that remembers (9). When this column is strong, the individual HAS access to higher guidance, HAS a sense of mission, HAS the blueprint of their soul's intention for this incarnation. The problem is not access; the problem is interference. Column 1 is the self-esteem column — it contains the character/ego (1), the bioenergy (2), and the curiosity (3). When this column is overloaded, the self is too loud, too present, too demanding of attention. The ego (1) insists on being the author of every success. The energy (2) demands immediate expression. The curiosity (3) constantly generates new questions that distract from the quiet answer that is already available. The result is a person who HAS a compass but cannot hear its quiet voice over the noise of their own ego.
The phenomenological experience of the Hidden Oracle is a frustrating sense of waiting to be "discovered" — by others or by oneself. You sense, beneath the noise of your daily ego operations, that there is something REAL you are supposed to be doing, a purpose that is yours alone, a contribution that only you can make. But every time you try to access that purpose, the ego machinery of Column 1 hijacks the process: "What will people think?" (ego/1), "Do I have the energy for this?" (bioenergy/2), "What if there's something better?" (curiosity/3). The oracle speaks; the ego drowns it out.
The light of this configuration is that the oracle IS there and the talent IS real. The Hidden Oracle who learns to quiet the ego — through meditation, through therapy, through the deliberate cultivation of humility — discovers that their destiny column has been transmitting clearly all along; they simply had the volume on the ego channel turned up too high to hear it. When the ego is quieted, the Hidden Oracle becomes simply the Oracle — someone whose talents were never absent, only obscured.
The shadow is a lifetime of chasing ego gratification while the soul's true purpose goes unexpressed. The Hidden Oracle who never quiets the Column 1 noise may achieve significant external success — the overloaded self-esteem column is perfectly capable of driving achievement — but will feel, beneath the success, a hollow ache that no amount of recognition can fill. The prescription: develop practices that temporarily disable the ego machinery. Service to others is particularly effective — when you are focused on someone else's needs, your own ego's demands temporarily recede, and in that space, the oracle can be heard.`,
  },
  // ═══════════════════════════════════════════════════════════════════════════
  // PATTERN 4: Family Crucible (Row 2 strong AND Spirituality Diag overloaded)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "family-crucible",
    name: "The Family Crucible",
    condition:
      "Row 2 (Family/Bioenergy) strong (4+) AND Spirituality Diagonal overloaded (6+)",
    matcher: (lt) => strong(lt.row_2) && overloaded(lt.diag_spirit),
    involvedLines: ["Row 2 (Family/Bioenergy)", "Spirituality Diagonal"],
    interpretation: `THE FAMILY CRUCIBLE — FAMILY ROW STRONG × SPIRITUALITY DIAGONAL OVERLOAD
When Row 2 (Family/Bioenergy) is strong and the Spirituality Diagonal is overloaded simultaneously, the individual lives at the intersection of two powerful and often conflicting callings: the calling to family, relationship, and grounded emotional life (Row 2) and the calling to transcendence, spiritual development, and the solitary pursuit of truth (Spirituality Diagonal). This is the "Family Crucible" configuration — the person whose soul chose an incarnation where spiritual growth would happen THROUGH family, not in retreat from it, but whose spiritual drive is so powerful that the gravitational pull toward retreat is constant and intense.
Row 2, composed of 2 (Bioenergy), 5 (Logic/Intuition), and 8 (Duty), governs the capacity for relationship, emotional attunement, and the sacred obligations of family life. When strong, this row produces a person who is genuinely invested in others — who feels the weight of relational responsibility, who derives meaning from caregiving, who would feel existentially unmoored without the anchor of intimate bonds. This is not a person who CAN retreat to a mountaintop and meditate for a decade; they are wired for connection, and isolation would wound them deeply. But the overloaded Spirituality Diagonal (1-5-9) pulls them relentlessly in the opposite direction — toward solitude, toward contemplation, toward the kind of spiritual depth that is difficult to cultivate in the noise and demands of family life.
The phenomenological experience of the Family Crucible is a chronic, low-grade guilt that attaches to both poles of the conflict. When you are present with family, the spiritual diagonal whispers that you are neglecting your soul's true work. When you retreat for spiritual practice, Row 2 whispers that you are abandoning your responsibilities. The result is a person who feels that they are failing at BOTH callings — never spiritual enough for the spiritual imperative, never present enough for the family imperative, always falling short of both standards simultaneously.
The light of this configuration is the potential for a genuinely embodied spirituality — a path where enlightenment is not achieved in retreat from relationship but IN and THROUGH relationship, where the difficult partner, the demanding child, and the aging parent are not obstacles to spiritual development but its primary curriculum. This is the path of the householder yogi, the bodhisattva who chooses to remain in the world for the sake of others, the mystic whose mysticism is expressed through love rather than isolation. The Family Crucible who embraces this path discovers that the friction between the two callings IS the practice — that every moment of choosing presence over retreat, patience over irritation, service over solitude, is a spiritual victory more meaningful than any mountaintop epiphany.
The shadow is chronic resentment — toward family for "holding back" spiritual growth, toward spiritual practice for "stealing" time from loved ones. The Family Crucible who does not integrate the two poles becomes bitter in both directions, blaming the family for the unrealized spiritual life and blaming the spiritual impulse for the imperfect family life. The prescription: make family the practice. The dishes, the bedtime routines, the difficult conversations — these are not interruptions of your spiritual work. They ARE your spiritual work, chosen by a soul wise enough to know that love is the most demanding spiritual path there is.`,
  },
  // ═══════════════════════════════════════════════════════════════════════════
  // PATTERN 5: The Isolated Genius (Col 3 strong AND Row 1 weak)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "isolated-genius",
    name: "The Isolated Genius",
    condition:
      "Column 3 (Talent/Destiny) strong (4+) AND Row 1 (Purpose/Will) weak (0-1)",
    matcher: (lt) => strong(lt.col_3) && weak(lt.row_1),
    involvedLines: ["Column 3 (Talent/Destiny)", "Row 1 (Purpose/Will)"],
    interpretation: `THE ISOLATED GENIUS — TALENT STRONG × PURPOSE WEAK
When Column 3 (Talent/Destiny) is strong but Row 1 (Purpose/Will) is weak, the individual possesses significant gifts and higher guidance (Column 3) but lacks the engine of will and self-direction (Row 1) to deploy those gifts in the world. This is the "Isolated Genius": the person who HAS the talent, HAS the vision, HAS the insight — but cannot seem to GET IT OUT, cannot sustain the forward motion required to translate potential into accomplishment, cannot become the protagonist of their own story because the protagonist engine (Row 1's 1-4-7) is simply not powerful enough to carry the weight of their gifts.
Column 3 is strong — the luck (7), duty (8), and clairvoyance (9) are well-developed. This person has guidance, has a sense of obligation to something larger than themselves, has access to the information field. They KNOW things. They SEE things. They have a destiny. But Row 1 — the row that should provide the will (1), the health (4), and the luck (7) to ACT on that destiny — is weak. The result is a person who is like a powerful engine mounted on a bicycle frame: the power is there, but the delivery system cannot handle it, and the result is not forward motion but violent shaking.
The phenomenological experience of the Isolated Genius is the particular agony of blocked potential. You KNOW you are capable. You have had glimpses of what you could do, could be, could contribute. But the bridge between knowing and doing is fragile, and you spend much of your life on the knowing side of that bridge, watching from a distance as others — often less gifted, less insightful — actually DO the things you can only envision. This breeds a specific kind of despair that is more painful than the despair of the genuinely untalented, because it is laced with evidence of what is being wasted.
The light of this configuration is that the gifts ARE real, and the weak Row 1 CAN be supplemented. The Isolated Genius who builds external will structures — accountability systems, collaborators who provide the forward momentum they lack internally, environments that demand rather than suggest action — can access the deployment that their native wiring cannot provide. This is not "fixing" the weak Row 1; it is compensating for it honestly and strategically. The Isolated Genius who finds the right container — the right partner, the right organization, the right project with external deadlines and consequences — can produce work of genuine significance.
The shadow is a life of quiet desperation — the genius who died with their music still inside them, in the famous phrase. The Isolated Genius who never builds the external will structures may reach the end of life with a haunting sense of having been a spectator to their own existence, having watched their own potential from a distance without ever inhabiting it. The prescription: stop waiting for motivation. The weak Row 1 means that the internal impulse to act will never feel sufficient. Act anyway. Build external compulsion. Make commitments that you cannot easily break. The Isolated Genius's greatest act of will is not the work itself but the decision to create the conditions that make the work inevitable.`,
  },
  // ═══════════════════════════════════════════════════════════════════════════
  // PATTERN 6: Charismatic Cage (Temperament Diag strong AND Col 1 overloaded)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "charismatic-cage",
    name: "The Charismatic Cage",
    condition:
      "Carnal/Temperament Diagonal strong (4+) AND Column 1 (Self-Esteem) overloaded (6+)",
    matcher: (lt) => strong(lt.diag_carnal) && overloaded(lt.col_1),
    involvedLines: ["Carnal/Temperament Diagonal", "Column 1 (Self-Esteem)"],
    interpretation: `THE CHARISMATIC CAGE — TEMPERAMENT STRONG × SELF-ESTEEM OVERLOAD
When the Carnal/Temperament Diagonal (3-5-7) is strong and Column 1 (Self-Esteem / 1-2-3) is overloaded simultaneously, the individual possesses a powerful, magnetic presence that draws people toward them — but is simultaneously trapped by the very image that attracts. This is the "Charismatic Cage": the person whose charm, energy, and presence open every door, but who cannot escape the persona that opened those doors, who is known and admired for a version of themselves that increasingly feels like a mask, who is loved by many and truly known by almost no one.
The Temperament Diagonal, composed of 3 (Curiosity), 5 (Intuition), and 7 (Luck), governs the quality of one's energetic presence — the "vibe," the magnetism, the intangible quality that makes some people compelling and others forgettable. When strong, this diagonal produces a person who is naturally charismatic, whose presence is felt before they enter a room, and whose energy is genuinely nourishing to others. People feel BETTER around you. They are drawn to your warmth, your confidence, your apparent ease with life. This is a genuine gift. But Column 1, composed of 1 (Ego), 2 (Bioenergy), and 3 (Curiosity), governs self-esteem — the relationship between the self and its own image. When overloaded, this column produces a person who is HYPER-AWARE of how they are perceived, who constructs and maintains an image with obsessive care, and who cannot relax into authentic being because the performance of self has become indistinguishable from the self being performed.
The combination is potent and potentially imprisoning. The Temperament Diagonal draws people in; the overloaded Column 1 then requires that you MAINTAIN the image that drew them. You become the curator of your own charisma, the PR agent for your own brand, the performer who cannot leave the stage because the audience expects an encore. And the tragedy is that the real self — the self behind the charisma, the self that is tired, uncertain, flawed, and human — becomes increasingly invisible, even to you. You are loved for a persona you have come to resent, but you cannot abandon the persona without losing the love, and you are no longer certain whether the love would survive the revelation of what lies beneath the performance.
The light of this configuration is the potential for a charisma that is INTEGRATED — a presence that is powerful AND authentic, magnetic AND transparent, attractive AND honest. The Charismatic Cage whose bars are dissolved by the conscious choice to be seen in full — including the parts that are not charismatic, not impressive, not easy to love — discovers that the authentic self is actually MORE magnetic than the constructed persona, because authenticity is the rarest and most compelling quality a human can possess.
The shadow is a life of profound loneliness disguised by social success. The Charismatic Cage can be surrounded by admirers and feel completely alone, because the admirers admire a construction, not a person. The prescription: practice strategic vulnerability. Choose safe people — and there must be at least one — with whom you drop the performance entirely. Show them the fear, the uncertainty, the ordinariness, the mess. Let them love the real you or let them leave. The Charismatic Cage who risks being unimpressive in front of someone who matters discovers that freedom is on the other side of that risk.`,
  },
  // ═══════════════════════════════════════════════════════════════════════════
  // PATTERN 7: The Unstable Prophet (Spirituality Diag overload AND Col 1 overload AND Row 3 overload)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "unstable-prophet",
    name: "The Unstable Prophet",
    condition:
      "Spirituality Diagonal overloaded (6+) AND Column 1 overloaded (6+) AND Row 3 overloaded (6+)",
    matcher: (lt) =>
      overloaded(lt.diag_spirit) &&
      overloaded(lt.col_1) &&
      overloaded(lt.row_3),
    involvedLines: [
      "Spirituality Diagonal",
      "Column 1 (Self-Esteem)",
      "Row 3 (Stability)",
    ],
    interpretation: `THE UNSTABLE PROPHET — TRIPLE OVERLOAD: SPIRITUALITY × SELF-ESTEEM × STABILITY
When three of the psychomatrix's most powerful lines are simultaneously overloaded — the Spirituality Diagonal, Column 1 (Self-Esteem), and Row 3 (Stability) — the individual operates at a level of psychic intensity that is genuinely difficult to sustain without extraordinary self-awareness. This is the "Unstable Prophet" configuration: a person whose spiritual fire (Spirituality Diagonal) burns so bright, whose ego structure (Column 1) is so rigid, and whose drive for stability (Row 3) is so compulsive that the three forces are in constant, exhausting conflict. The prophet receives visions; the ego demands control over how those visions are expressed and received; the stability drive demands that everything be secure, predictable, and orderly. These three demands cannot be simultaneously met.
The Spirituality Diagonal (1-5-9) overloaded at 6+ digits creates a person for whom the transcendent is not an interest but a constitutional reality. Visions, insights, spiritual experiences, and a sense of direct connection to the divine are not occasional events but the baseline of consciousness. This person is a RECEIVER, constantly tuned to frequencies that others cannot perceive. But Column 1 (1-2-3), also overloaded, is not content to simply receive — it must INTERPRET, CONTROL, and PRESENT the received material in ways that enhance and protect the self-image. The ego does not trust pure transmission; it edits, curates, and sometimes distorts the signal to maintain its own story. And Row 3 (3-6-9), also overloaded, demands that all of this — the visions, the ego-management, the transmission — be embedded in a STABLE, SECURE, PREDICTABLE life structure. The prophet is being asked to be a wild mystic, a controlled brand manager, and a reliable suburban householder all at once — and the tension is explosive.
The phenomenological experience of the Unstable Prophet is a life of dramatic peaks and valleys, of public inspiration and private chaos, of moments of genuine spiritual transmission followed by periods of instability that can look, from the outside, like mental illness. The Unstable Prophet may be dismissed as crazy, may dismiss themselves as crazy, or may develop a following that mistakes their instability for authenticity. None of these outcomes is ideal, and all are expressions of the same underlying pattern: too much power flowing through too many channels with no voltage regulator.
The light of this configuration is that the transmission IS real. The Unstable Prophet genuinely has access to spiritual insight of unusual depth and clarity. The challenge is not the quality of the signal but the stability of the receiver. When the Unstable Prophet does the work of ego-regulation (therapy, humility practices, honest feedback from trusted others) and stability-modulation (learning to allow some chaos without being consumed by it), the triple overload becomes a triple GIFT — the spiritual fire provides the vision, the ego channel provides the clarity of expression, and the stability drive provides the groundedness that makes the transmission sustainable.
The shadow is the classic prophet's trajectory: rise, inspire, destabilize, crash. The Unstable Prophet who does not regulate the triple overload will burn through followers, relationships, and their own nervous system with equal ferocity. The prescription: reduce the voltage. Not by suppressing the spiritual fire (impossible and undesirable) but by deliberately weakening the OTHER two overloads — softening the ego's need for control, relaxing the stability drive's terror of chaos. The Unstable Prophet's growth edge is not MORE intensity — it is the courage to be LESS, to step down from the pedestal, to allow the transmission to be imperfect, the image to be flawed, and the life to be genuinely, beautifully, and acceptably unstable.`,
  },
  // ═══════════════════════════════════════════════════════════════════════════
  // PATTERN 8: The Walled Garden (Row 2 strong AND Col 1 overloaded)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "walled-garden",
    name: "The Walled Garden",
    condition:
      "Row 2 (Family/Bioenergy) strong (4+) AND Column 1 (Self-Esteem) overloaded (6+)",
    matcher: (lt) => strong(lt.row_2) && overloaded(lt.col_1),
    involvedLines: ["Row 2 (Family/Bioenergy)", "Column 1 (Self-Esteem)"],
    interpretation: `THE WALLED GARDEN — FAMILY STRONG × SELF-ESTEEM OVERLOAD
When Row 2 (Family/Bioenergy) is strong and Column 1 (Self-Esteem) is overloaded simultaneously, the individual creates an intensely curated relational world — a "Walled Garden" of chosen intimates that is beautiful, nourishing, and carefully defended against anyone who does not meet exacting standards for entry. This configuration combines genuine relational capacity (the strong Row 2's warmth, attunement, and commitment) with an ego structure that is so invested in its own image (the overloaded Column 1) that it cannot tolerate the messiness, unpredictability, and potential for judgment that comes with genuinely open relationships.
Row 2, composed of 2 (Bioenergy), 5 (Intuition), and 8 (Duty), when strong, produces a person who is genuinely gifted at relationship — who can feel others' emotions (2), understand them intuitively (5), and commit to them with unwavering loyalty (8). This is not performative care; it is the real thing. The Walled Garden person genuinely LOVES the people in their inner circle, and that love is deep, consistent, and life-giving. But Column 1, composed of 1 (Ego), 2 (Bioenergy), and 3 (Curiosity), when overloaded, creates a self-image that is both highly developed and highly defended. The person with overloaded self-esteem HAS a strong sense of self but is also VULNERABLE to threats against that self — criticism, rejection, or simply the ordinary friction of relationships with people who see you differently than you see yourself.
The combination creates a specific relational pattern: deep, intense, beautiful relationships with a small number of carefully chosen people (the garden), combined with a notable absence of the broader, more casual, more diverse relational network that characterizes most people's social lives (the wall). The Walled Garden person does not have acquaintances; they have intimates or strangers. They do not do "surface" relationships; every relationship that clears the wall must justify its existence through depth, intensity, and mutual devotion. This is beautiful in its intensity and potentially suffocating in its exclusivity.
The light of this configuration is the capacity for relationships of extraordinary quality. The Walled Garden person's intimates are genuinely blessed — they receive a quality of attention, care, and commitment that is rare and precious. The garden IS beautiful. The question is whether the wall that protects it also imprisons it.
The shadow is relational insulation that becomes relational isolation. The Walled Garden person who never lets anyone imperfect into the garden gradually shrinks their world to a handful of people — and when those people inevitably disappoint, leave, or die, there is no broader community to fall back on. The prescription: deliberately cultivate the capacity for "good enough" relationships. Not every connection needs to be deep. Not every person needs to be an intimate. The person you see once a month for coffee, the colleague you respect but don't love, the neighbor you wave to — these "surface" relationships are not a waste of time. They are the ecosystem that keeps the garden alive when individual plants fail. The Walled Garden that opens a gate becomes not less beautiful but more resilient.`,
  },
  // ═══════════════════════════════════════════════════════════════════════════
  // PATTERN 9: The Hollow Achiever (Row 1 strong AND Col 3 weak)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "hollow-achiever",
    name: "The Hollow Achiever",
    condition:
      "Row 1 (Purpose/Will) strong (4+) AND Column 3 (Talent/Destiny) weak (0-1)",
    matcher: (lt) => strong(lt.row_1) && weak(lt.col_3),
    involvedLines: ["Row 1 (Purpose/Will)", "Column 3 (Talent/Destiny)"],
    interpretation: `THE HOLLOW ACHIEVER — WILL STRONG × DESTINY WEAK
When Row 1 (Purpose/Will) is strong but Column 3 (Talent/Destiny) is weak, the individual possesses a powerful engine of will, self-direction, and drive — but lacks the higher guidance, sense of duty, and clairvoyant memory that would tell that will WHERE to go and WHY. This is the "Hollow Achiever": the person who CAN achieve almost anything they set their mind to, but who struggles to know what is worth achieving, who masters every game they enter only to discover that the game was not worth playing, who climbs the ladder of success only to find it was leaning against the wrong wall.
Row 1, composed of 1 (Character), 4 (Health), and 7 (Luck), when strong, produces a person of formidable willpower and self-direction. This is the "I can do anything" person — and they are not wrong. The will (1) is strong enough to set a course and hold it. The health (4) is robust enough to sustain effort over time. The luck (7) means that fortune often favors their endeavors. This is the raw material of worldly success, and the Hollow Achiever often achieves significant external success — promotions, credentials, financial security, the visible markers of a life well-lived. But Column 3, composed of 7 (Luck), 8 (Duty), and 9 (Clairvoyance), when weak, means that the INNER compass — the sense of what one is HERE to do, the obligation to something larger than the self, the clairvoyant access to the soul's blueprint — is quiet or silent. The will goes; but where? The engine runs; but toward what destination?
The phenomenological experience of the Hollow Achiever is a life of impressive accomplishments that feel, to the accomplisher, oddly meaningless. You may have the resume, the home, the relationships, the status — all the things that are supposed to make a person happy — and yet feel a persistent sense of "is this it?" The will that drove you to achieve these things is still running (strong Row 1), but it has run out of things it genuinely cares about achieving (weak Column 3). You are a powerful vehicle with an empty back seat: all horsepower, no payload.
The light of this configuration is that the will IS strong enough to pursue meaning once meaning is identified. The Hollow Achiever is not incapable of purpose — they are merely unpurposed, and the powerful Row 1 can be redirected toward genuine fulfillment once the Column 3 gap is addressed. The task is not to suppress the will (impossible and undesirable) but to give it a destination worth the journey.
The shadow is a midlife crisis that is not a crisis of capacity but a crisis of meaning — the terrifying realization that you CAN do anything but cannot think of anything worth doing. The Hollow Achiever who never addresses the Column 3 gap may spend the second half of life desperately trying new pursuits, new relationships, new locations — hoping that the next achievement will be the one that finally fills the hollow. It won't be. The prescription: stop achieving long enough to LISTEN. The weak Column 3 has a voice; it is simply quiet, and the loud engine of Row 1 has been drowning it out for decades. Meditation, retreat, therapy, journaling — anything that quiets the will long enough to hear the whisper of purpose. The Hollow Achiever's greatest achievement will not be another external success but the internal discovery of what all that magnificent horsepower was actually meant to carry.`,
  },
  // ═══════════════════════════════════════════════════════════════════════════
  // PATTERN 10: The Exhausted Warrior (Row 1 strong AND Row 2 weak)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "exhausted-warrior",
    name: "The Exhausted Warrior",
    condition:
      "Row 1 (Purpose/Will) strong (4+) AND Row 2 (Family/Bioenergy) weak (0-1)",
    matcher: (lt) => strong(lt.row_1) && weak(lt.row_2),
    involvedLines: ["Row 1 (Purpose/Will)", "Row 2 (Family/Bioenergy)"],
    interpretation: `THE EXHAUSTED WARRIOR — WILL STRONG × FAMILY/ENERGY WEAK
When Row 1 (Purpose/Will) is strong but Row 2 (Family/Bioenergy) is weak, the individual possesses a powerful engine of self-direction and purpose that is perpetually under-fueled by the relational and energetic resources that sustain most people through extended campaigns. This is the "Exhausted Warrior": the person who fights, achieves, and pushes forward — but does so alone, depleted, and without the emotional nourishment that makes sustained effort feel worthwhile rather than merely compulsory.
Row 1 (1-4-7), when strong, produces a person of formidable will (1), health (4), and luck (7). This is a warrior's row — the capacity to set a direction, maintain the physical vessel, and benefit from cosmic tailwinds. The Exhausted Warrior IS capable of achievement, and often achieves significantly. But Row 2 (2-5-8), when weak, means that the bioenergy (2) that should fuel the warrior's campaign is insufficient, the intuition (5) that should guide tactical decisions is unreliable, and the sense of duty (8) that should connect the warrior's efforts to a larger web of obligation and meaning is underdeveloped. The result is a person who fights — bravely, persistently, even heroically — but who fights alone, tired, and unsure whether the battle is worth winning.
The phenomenological experience of the Exhausted Warrior is a life of achievement that feels less like triumph and more like survival. You do what needs to be done — you always have — but the doing costs more than it seems to cost others, and the recovery from doing takes longer, and the satisfaction that is supposed to follow accomplishment is muted or absent. You are not lazy or incompetent; you are running a marathon on a sprinter's energy supply, and the fact that you finish at all is a testament to your will (Row 1), not your energy reserves (Row 2).
The light of this configuration is that the will IS strong enough to build the support structures that the weak Row 2 cannot supply. The Exhausted Warrior who recognizes the energy deficit can deliberately cultivate sources of replenishment — relationships that give more than they take, practices that restore rather than deplete, environments that support rather than drain. The weak Row 2 is not a permanent sentence to exhaustion; it is a signal that energy must be MANAGED consciously rather than spent casually.
The shadow is the classic burnout of the solitary achiever: the person who pushed through every obstacle, achieved every goal, and collapsed at the finish line with no one to celebrate with and no energy to enjoy the victory. The Exhausted Warrior who never addresses the Row 2 deficit may achieve everything they set out to achieve and discover, at the end, that achievement without connection, without emotional richness, without the warmth of shared experience, is a hollow prize. The prescription: invest as strategically in relationships and energy management as you invest in achievement. The warrior who learns to fight alongside others, and to rest as skillfully as they attack, becomes not less effective but infinitely more sustainable.`,
  },
  // ═══════════════════════════════════════════════════════════════════════════
  // PATTERN 11: The Fragile Bridge (Spirituality Diag strong AND Col 2 weak)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "fragile-bridge",
    name: "The Fragile Bridge",
    condition:
      "Spirituality Diagonal strong (4+) AND Column 2 (Making a Living) weak (0-1)",
    matcher: (lt) => strong(lt.diag_spirit) && weak(lt.col_2),
    involvedLines: ["Spirituality Diagonal", "Column 2 (Making a Living)"],
    interpretation: `THE FRAGILE BRIDGE — SPIRITUALITY STRONG × LIVELIHOOD WEAK
When the Spirituality Diagonal (1-5-9) is strong but Column 2 (Making a Living / 4-5-6) is weak, the individual has a vibrant inner spiritual life and a powerful sense of higher purpose — but struggles to translate that purpose into material provision, to bridge the gap between spiritual calling and practical livelihood. This is the "Fragile Bridge": the person who knows they are here for a reason but cannot figure out how to make that reason pay the rent, who feels called to meaningful work but cannot find the door between meaning and money, who has spiritual wealth in abundance and material stability in deficit.
The Spirituality Diagonal, when strong, creates a person whose inner life is rich, who feels connected to something larger than themselves, and who experiences their existence as having genuine purpose. This is not a vague "spiritual but not religious" sentiment; it is a constitutional orientation toward meaning that makes purely material pursuits feel fundamentally unsatisfying. The Fragile Bridge person CANNOT just get a job for the money and be satisfied — they need their work to MEAN something, and the meaning requirement is not a preference but a psychic necessity. But Column 2, composed of 4 (Health), 5 (Intuition/Logic), and 6 (Labor), when weak, means that the bridge between inner purpose and outer provision is fragile. The health (4) may not support the demands of meaningful work. The logic/intuition (5) may not identify viable paths to monetization. The labor instinct (6) may not sustain the grind of converting vision into income.
The phenomenological experience of the Fragile Bridge is the "starving artist" archetype — though not necessarily in an artistic context. You have a genuine calling, a real contribution to make, a purpose that is not imagined but authentic. But the path from calling to career is obstructed, and you may spend years — or decades — in survival jobs that pay the bills but starve the soul, unable to find the bridge between what you are here to do and what the market will pay you to do. This creates a specific form of suffering: the suffering of the person who knows exactly what they should be doing but cannot figure out how to support themselves while doing it.
The light of this configuration is the authenticity of the calling. The Fragile Bridge person's sense of purpose is not a fantasy; it is a genuine transmission from the strong Spirituality Diagonal, and it is worth honoring even when the path to monetization is unclear. The weakness of Column 2 is not a sign that the calling is invalid; it is a sign that the practical implementation requires more conscious construction than it would for someone with a naturally strong livelihood column.
The shadow is a life of financial precarity justified as spiritual purity. The Fragile Bridge person can fall into the trap of believing that money is unspiritual, that struggling financially is a sign of spiritual authenticity, that "selling out" is the only alternative to poverty. This is not spirituality; it is the rationalization of a weak Column 2. The prescription: separate the calling from the monetization. Your purpose is valid regardless of whether it generates income. Your need for income is valid regardless of your purpose. These are two separate problems that require two separate solutions. The Fragile Bridge who builds a PRACTICAL bridge — who finds a way to fund their life that does not depend on their calling, or who finds a way to monetize their calling that does not compromise its integrity — achieves something that more practically gifted individuals never need to attempt: the conscious, deliberate construction of a life that honors both spirit and matter.`,
  },
  // ═══════════════════════════════════════════════════════════════════════════
  // PATTERN 12: The Titan (Row 1 strong AND Row 3 strong AND Col 1 strong)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "titan",
    name: "The Titan",
    condition:
      "Row 1 strong (4+) AND Row 3 strong (4+) AND Column 1 strong (4+)",
    matcher: (lt) => strong(lt.row_1) && strong(lt.row_3) && strong(lt.col_1),
    involvedLines: [
      "Row 1 (Purpose/Will)",
      "Row 3 (Stability)",
      "Column 1 (Self-Esteem)",
    ],
    interpretation: `THE TITAN — TRIPLE STRONG: PURPOSE × STABILITY × SELF-ESTEEM
When three of the psychomatrix's foundational lines — Row 1 (Purpose/Will), Row 3 (Stability), and Column 1 (Self-Esteem) — are simultaneously strong, the individual possesses a combination of willpower, persistence, and self-certainty that is genuinely titanic. This is the "Titan" configuration: a person of such formidable psychological architecture that their presence alone changes the dynamics of any room they enter, any organization they join, or any field they pursue. Titans do not merely succeed; they redefine the terms of success. They do not merely lead; they establish the paradigms within which leadership itself is understood.
Row 1 (1-4-7) strong means the will is powerful and health is robust and luck is active — the forward thrust of life is well-resourced and difficult to stop. Row 3 (3-6-9) strong means the capacity for sustained effort (6), the hunger for knowledge (3), and the clairvoyant access to the information field (9) are all well-developed — the engine of persistence and insight runs hot and clean. Column 1 (1-2-3) strong means the self-image is stable and the ego is centered and the curiosity is engaged — the self-esteem architecture is solid enough to withstand the pressures that crack less robust psyches. Together, these three lines create a person who is simultaneously DIRECTIONAL (knows where they are going), PERSISTENT (keeps going through obstacles), and CENTERED (maintains psychological stability through the journey). This is the raw architecture of greatness.
The phenomenological experience of the Titan is a life characterized by a certain EASE of achievement that others find mystifying and occasionally irritating. Things that are difficult for others — sustained effort, clear decision-making, resilience under pressure — are, for the Titan, baseline functioning. You do not understand why others struggle with follow-through (your Row 3 makes sustained effort feel natural). You do not understand why others are so easily discouraged (your Column 1 makes their ego fragility invisible to you). You do not understand why others cannot "just do it" (your Row 1 makes willpower feel like a renewable resource). This can create a kind of isolation — the loneliness of the person whose normal is others' extraordinary.
The light of this configuration is the capacity for genuinely transformational leadership. The Titan who wields their gifts in service of something larger than personal ambition becomes a figure of historical significance — not necessarily famous, but impactful in ways that ripple outward through generations. The combination of direction (Row 1), persistence (Row 3), and presence (Column 1) creates a leader who inspires not through charisma but through demonstration, not through words but through the undeniable evidence of a life lived at full power.
The shadow is the danger of becoming a tyrant — benevolent or otherwise. The Titan who lacks sufficient humility, who believes their ease of achievement reflects moral superiority rather than constitutional luck, who uses their powerful architecture to dominate rather than elevate, becomes a destructive force. The Titan's gifts are tools; whether they build or destroy depends on the values that guide their deployment. The prescription: cultivate genuine humility. Not performative self-deprecation but the deep recognition that your gifts are inherited, not earned — that you did nothing to deserve your powerful Row 1, your persistent Row 3, your stable Column 1. You were born with a loaded deck. The question is not whether you will win the game; the question is what kind of game you will choose to play, and whether your winning will lift others or leave them behind.`,
  },
  // ═══════════════════════════════════════════════════════════════════════════
  // PATTERN 13: The Untethered Visionary (Spirituality Diag strong AND Row 3 weak)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "untethered-visionary",
    name: "The Untethered Visionary",
    condition:
      "Spirituality Diagonal strong (4+) AND Row 3 (Stability) weak (0-1)",
    matcher: (lt) => strong(lt.diag_spirit) && weak(lt.row_3),
    involvedLines: ["Spirituality Diagonal", "Row 3 (Stability)"],
    interpretation: `THE UNTETHERED VISIONARY — SPIRITUALITY STRONG × STABILITY WEAK
When the Spirituality Diagonal (1-5-9) is strong but Row 3 (Stability / 3-6-9) is weak, the individual has a powerful spiritual compass and visionary capacity but lacks the grounding, persistence, and material stability to anchor those visions in sustainable reality. This is the "Untethered Visionary": the person whose head is in the stars and whose feet are barely touching the ground — who receives genuine spiritual downloads but cannot build the container to hold them, whose insights could change the world if only the world could find them, whose life is a series of brilliant revelations that dissolve before they can be implemented.
The Spirituality Diagonal, when strong, creates a person who is constitutionally oriented toward the transcendent. Visions, insights, and a sense of direct connection to higher guidance are not occasional experiences but the baseline of consciousness. The Untethered Visionary SEES things — sees the truth of situations, sees the potential in people, sees the patterns that others miss. Their vision is genuine and potentially transformative. But Row 3, composed of 3 (Curiosity), 6 (Labor), and 9 (Memory), when weak, means that the capacity to GROUND vision in sustained, practical effort is underdeveloped. The curiosity (3) may not persist long enough to work through the details. The labor instinct (6) may not sustain the grind of implementation. The memory (9) may not retain the vision long enough to see it through to completion. The result is a person who is perpetually starting — new projects, new relationships, new spiritual paths — and rarely completing.
The phenomenological experience of the Untethered Visionary is a life of extraordinary beginnings and almost no completions. You have more ideas before breakfast than most people have in a year, and each idea arrives with the full force of revelation — THIS is the thing, THIS is the calling, THIS is what everything has been leading toward. And then, days or weeks or months later, the revelation fades, the energy dissipates, and another revelation takes its place. The pattern repeats, and your life becomes a graveyard of abandoned visions, each one genuinely brilliant, each one genuinely started, each one abandoned not for lack of value but for lack of the grounded persistence that would have carried it to completion.
The light of this configuration is that the visions ARE genuine. The Untethered Visionary is not a dilettante or a fantasist; they are a genuine channel whose channel is not properly grounded. The spiritual information they receive is real, valuable, and potentially world-changing. The task is not to stop receiving but to build the infrastructure that allows the transmission to be received, processed, and manifested.
The shadow is a life of brilliant unrealized potential — the visionary who dies with all their visions still inside them, who was always about to change the world, whose epitaph reads "she had so much potential." The prescription: tether yourself. Deliberately, strategically, and repeatedly. Find a partner who is strong in Row 3 and weak in Spirituality — you will provide the vision, they will provide the implementation. Build external accountability structures that compensate for the weak persistence. Choose ONE vision and commit to it for a defined period regardless of whether other visions arrive. The Untethered Visionary who learns to tether does not lose their visionary capacity; they gain the ability to actually manifest what they see.`,
  },
  // ═══════════════════════════════════════════════════════════════════════════
  // PATTERN 14: The Torn Soul (Both Diagonals overloaded)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "torn-soul",
    name: "The Torn Soul",
    condition: "BOTH diagonals overloaded (6+ each)",
    matcher: (lt) => overloaded(lt.diag_spirit) && overloaded(lt.diag_carnal),
    involvedLines: ["Spirituality Diagonal", "Carnal/Temperament Diagonal"],
    interpretation: `THE TORN SOUL — BOTH DIAGONALS OVERLOADED
When both the Spirituality Diagonal (1-5-9) and the Carnal/Temperament Diagonal (3-5-7) are overloaded simultaneously, the individual is caught in a permanent tug-of-war between the transcendent and the embodied, between the call to rise above earthly concerns and the equally powerful call to dive fully into the pleasures, passions, and intensities of material existence. This is the "Torn Soul": the person whose spiritual fire and carnal fire burn with equal intensity, who can neither renounce the world nor fully embrace it without guilt, who lives at the intersection of monk and hedonist and belongs fully to neither.
The Spirituality Diagonal, overloaded at 6+ digits, creates a gravitational pull toward the transcendent that is not a preference but a constitutional reality. Prayer, meditation, contemplation — these are not practices you do; they are states you naturally inhabit, and the material world can feel, at a deep level, like a distraction from your true home. But the Carnal/Temperament Diagonal, also overloaded at 6+ digits, creates an equally powerful pull toward embodied experience — toward sensuality, passion, intensity, and the full-blooded engagement with life that the ascetic traditions renounce. This diagonal says: "The body is not an obstacle to enlightenment; the body IS the temple, and the pleasures of the senses are a form of worship." Both diagonals are telling the truth. Neither is willing to yield to the other.
The phenomenological experience of the Torn Soul is a life characterized by dramatic swings between asceticism and indulgence, between spiritual retreat and sensual abandon, between the monastery and the bacchanal. Neither pole feels fully authentic, and neither pole feels fully false. In the spiritual phase, the carnal diagonal whispers that you are denying life. In the carnal phase, the spiritual diagonal whispers that you are betraying your higher calling. The result is a person who belongs nowhere fully — too spiritual for the sensualists, too sensual for the spiritualists, perpetually torn between two modes of being that both feel like home and both feel like exile.
The light of this configuration is the potential for a genuinely integrated spirituality — a Tantric path, in the broadest sense, where the transcendent is accessed THROUGH the immanent, where the body's pleasures become portals rather than obstacles, where the spiritual and the sensual are recognized not as enemies but as expressions of the same underlying reality viewed from different angles. The Torn Soul who achieves this integration becomes a bridge between worlds that most people experience as separate — demonstrating that one can be both deeply spiritual and fully alive, both transcendent and embodied, both ascended and grounded.
The shadow is a life of exhausting oscillation, guilt, and the inability to commit fully to any path. The Torn Soul who never integrates the two diagonals may spend a lifetime starting spiritual disciplines and abandoning them for sensual pursuits, starting relationships and abandoning them for solitude, never able to choose one mode of being because both feel essential and both feel incomplete. The prescription: stop choosing. Stop trying to decide whether you are a spiritual being or a carnal being. You are both — not as a compromise but as a synthesis. The challenge is not to suppress one diagonal in favor of the other but to find the practices, the relationships, and the life structure that honor both simultaneously. Sacred sexuality. Embodied meditation. Passionate service. The Torn Soul's integration is not a reduction of intensity but a channeling of it into a life that is simultaneously holy and fully human.`,
  },
  // ═══════════════════════════════════════════════════════════════════════════
  // PATTERN 15: The Fortress of Solitude (Col 2 strong AND Row 2 weak)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "fortress-solitude",
    name: "The Fortress of Solitude",
    condition:
      "Column 2 (Making a Living) strong (4+) AND Row 2 (Family/Bioenergy) weak (0-1)",
    matcher: (lt) => strong(lt.col_2) && weak(lt.row_2),
    involvedLines: ["Column 2 (Making a Living)", "Row 2 (Family/Bioenergy)"],
    interpretation: `THE FORTRESS OF SOLITUDE — LIVELIHOOD STRONG × FAMILY/ENERGY WEAK
When Column 2 (Making a Living / 4-5-6) is strong but Row 2 (Family/Bioenergy / 2-5-8) is weak, the individual is exceptionally capable of providing for themselves materially but lacks the relational energy and emotional attunement that make material provision feel meaningful rather than merely functional. This is the "Fortress of Solitude": the person who builds a secure, comfortable, well-appointed life — and then lives in it alone, wondering why the security feels like a prison and the comfort feels like insulation rather than warmth.
Column 2, composed of 4 (Health), 5 (Logic/Intuition), and 6 (Labor), when strong, produces a person who is grounded, practical, and capable of sustained productive effort. This is the provider, the builder, the person who can take care of themselves and others materially. Strong health (4) means the body supports sustained work. Strong logic (5) means practical problems are solved efficiently. Strong labor (6) means work is not just performed but genuinely satisfying. The Fortress of Solitude person CAN take care of business — and does. But Row 2, composed of 2 (Bioenergy), 5 (Intuition), and 8 (Duty), when weak, means that the relational capacities — the warmth (2), the emotional intuition (5), and the sense of obligation to others (8) — are underdeveloped. The fortress is well-built and well-stocked and there is no one to share it with, because the relational wiring that would connect the builder to a community never fully activated.
The phenomenological experience of the Fortress of Solitude is a life of quiet competence and quiet loneliness. You have your act together. The bills are paid. The career is on track. The home is in order. From the outside, you appear to be thriving. But the inside of the fortress is empty, and the very competence that built the walls makes it difficult to admit that you would tear them down if you knew how. You may have colleagues, clients, and contacts — but not intimates. Your relationships tend to be functional rather than nourishing, transactional rather than transformative.
The light of this configuration is that the material foundation IS solid, and the relational capacity CAN be developed. The Fortress of Solitude is not a permanent sentence to isolation; it is a starting point with a strong foundation (Column 2) and a growth edge (Row 2). The weak Row 2 means that relationship does not come naturally — but "not naturally" does not mean "not at all." The Fortress of Solitude person can learn relational skills the way they learned professional skills: deliberately, methodically, with practice and feedback and the willingness to be a beginner.
The shadow is a life of material abundance and emotional poverty — the successful professional who dies alone, the well-appointed home that was never a home because a home requires people. The Fortress of Solitude who never addresses the Row 2 deficit may accumulate wealth, status, and comfort while the hunger for connection — unacknowledged, unexpressed, unmet — grows beneath the surface until it manifests as depression, addiction, or the kind of midlife crisis that is really a crisis of disconnection. The prescription: invest in relationship with the same strategic intentionality you invest in career. Take courses. Do therapy. Practice vulnerability. Join communities. The fortress is strong enough to survive a few open doors.`,
  },
];
// ─────────────────────────────────────────────────────────────────────────────
// PUBLIC API
// ─────────────────────────────────────────────────────────────────────────────
/**
 * Analyzes when multiple psychomatrix lines are simultaneously active
 * (strong 4+ or overloaded 6+), creating emergent patterns that transcend
 * individual line meanings. Returns all applicable line intersection patterns
 * with full verbatim interpretations (200-400 words each).
 *
 * Line definitions:
 * Row 1 (Purpose/Will): digits 1, 4, 7
 * Row 2 (Family/Energy): digits 2, 5, 8
 * Row 3 (Stability): digits 3, 6, 9
 * Col 1 (Self-Esteem): digits 1, 2, 3
 * Col 2 (Making a Living): digits 4, 5, 6
 * Col 3 (Talent/Destiny): digits 7, 8, 9
 * Spirit Diagonal: digits 1, 5, 9
 * Carnal/Temperament Diag: digits 3, 5, 7
 *
 * @param lineTotals - Computed totals for each line (sum of constituent digit counts)
 * @returns LineIntersectionResult with all applicable patterns and summary
 */
export function analyzeLineIntersections(
  lineTotals: LineTotals,
): LineIntersectionResult {
  const applicablePatterns: LineIntersectionPattern[] = [];
  for (const pattern of LINE_INTERSECTION_PATTERNS) {
    if (pattern.matcher(lineTotals)) {
      applicablePatterns.push({
        id: pattern.id,
        name: pattern.name,
        condition: pattern.condition,
        involvedLines: pattern.involvedLines,
        interpretation: pattern.interpretation,
      });
    }
  }
  // Generate summary
  let summary: string;
  if (applicablePatterns.length === 0) {
    summary =
      "No significant line intersection patterns detected. The psychomatrix lines operate in a relatively balanced configuration without forming the emergent intersection patterns this analysis screens for.";
  } else if (applicablePatterns.length === 1) {
    const p = applicablePatterns[0];
    summary = `1 line intersection pattern detected: ${p.name}. This configuration emerges from the simultaneous state of the following lines: ${p.involvedLines.join(", ")}.`;
  } else {
    const names = applicablePatterns.map((p) => p.name).join(", ");
    summary = `${applicablePatterns.length} line intersection patterns detected: ${names}. These configurations reveal how the simultaneous activation of multiple psychomatrix lines creates emergent dynamics that transcend individual line meanings.`;
  }
  return {
    patterns: applicablePatterns,
    summary,
    lineTotals,
  };
}