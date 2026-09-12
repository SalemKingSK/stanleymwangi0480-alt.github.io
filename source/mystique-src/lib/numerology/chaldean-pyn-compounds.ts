/**
 * Chaldean Compound Number Dictionary — Complete (10–99)
 * Verbatim text from "Chaldean Personal Year Compound Numbers: The Complete Esoteric Dictionary"
 * Classical Chaldean system: 10–52 (direct meanings); 53–99 (extended/world numerology sources)
 */
import {
  computeRawPersonalYear,
  computeRawPersonalYearClassic,
} from "@/lib/numerology/personal-year-full";
export interface ChaldeanPYNCompound {
  compound: number;
  reduced: number;
  name: string;
  isKarmicDebt: boolean;
  isMasterNumber: boolean;
  isExtended?: boolean; // true for 53–99 (beyond classical 52-week boundary)
  symbolism: string;
  vibrationalEssence: string;
  karmicDynamics?: string;
  manifestationPatterns: string;
}
// ─── Utility ────────────────────────────────────────────────────────────────
function digitSum(n: number): number {
  return String(Math.abs(n))
    .split("")
    .reduce((a, d) => a + +d, 0);
}
/**
 * Lookup the compound entry for a raw (pre-reduction) sum.
 * • 10–99: check direct entry first (classical for 10–52, extended for 53–99)
 * • >99 : digit-sum reduce until ≤99, then apply above
 * • <10 : no compound (returns null)
 */
export function lookupCompound(rawSum: number): ChaldeanPYNCompound | null {
  if (rawSum < 10) return null;
  // Normalise values >99 by digit-sum reduction
  let n = rawSum;
  while (n > 99) n = digitSum(n);
  // Direct entry
  if (COMPOUNDS[n]) return COMPOUNDS[n];
  // For 53–99 not in our map, fall back to digit-sum reduction to 10–52
  if (n > 52) {
    const ds = digitSum(n);
    if (ds >= 10 && COMPOUNDS[ds]) return COMPOUNDS[ds];
    return null; // single digit result — no compound meaning
  }
  return null;
}
// ─── Compound List ───────────────────────────────────────────────────────────
const COMPOUND_LIST: ChaldeanPYNCompound[] = [
  // ── PERSONAL YEAR 1: INITIATION ──────────────────────────────────────────
  {
    compound: 10,
    reduced: 1,
    name: "The Wheel of Fortune",
    isKarmicDebt: false,
    isMasterNumber: false,
    symbolism:
      "The Wheel of Fortune, turning endlessly — Isis and Osiris governing rise and fall according to the wheel's rotation.",
    vibrationalEssence:
      "The 10/1 Personal Year operates as a karmic engine of instant manifestation. Whatever the individual directs their will toward during this period has an unusual capacity to materialize rapidly. The 1's initiating energy combines with the 0's mystical amplification, creating a portal where thought and reality converge with minimal friction.\n\nThe Wheel of Fortune symbolism carries a precise meaning: the period's circumstances turn according to the individual's desires, but they turn with the wheel's full momentum — what goes up comes down, what falls may rise again. The name one builds during this time, the reputation one establishes, the projects one launches — all will become known, but whether they become known for good or for evil depends entirely on the quality of the desire behind them. The wheel does not discriminate; it simply turns.",
    karmicDynamics:
      "The 10/1 period brings past actions into present manifestation with unusual speed. Positive karma from previous cycles — whether from earlier years in the current life or from past incarnations — produces visible opportunities that seem to arrive without effort. Negative karma surfaces just as rapidly, bringing obstacles that force confrontation with previously avoided responsibilities. The wheel's rotation is inexorable; resistance only increases the centrifugal force.",
    manifestationPatterns:
      "Individuals experiencing 10/1 often report synchronicities that feel almost theatrical in their precision — meeting exactly the right person at exactly the right moment, discovering precisely the needed resource just as a project requires it, encountering opportunities that seem tailor-made for their emerging direction. There is rarely mediocrity with 10/1: the period's outcomes tend toward extremes — great success or significant failure, rapid advancement or sudden reversal. The compound number's warning is clear: with great power comes great responsibility.",
  },
  {
    compound: 19,
    reduced: 1,
    name: "The Prince of Heaven",
    isKarmicDebt: false,
    isMasterNumber: false,
    symbolism:
      "The Sun, radiant and triumphant — the Prince of Heaven victorious over all temporal failure.",
    vibrationalEssence:
      "The 19/1 carries what Cheiro described as 'all the power of the compound number 10, without the inherent dangers of 10's abuse.' Where 10/1 offers karmic momentum that can be directed toward either constructive or destructive ends, 19/1 channels the 1's initiating force through the Sun's radiant beneficence, producing a period where success, happiness, esteem, and honor flow with unusual consistency.\n\nThe 19 is the highest compound number in the 1-series, and it carries the full maturity of the initiating energy. The 1's self-assertion has been refined through the 9's completion; the ego that drives the 1 period has been tempered by the compassion and wisdom of the full cycle. This produces a quality of leadership that inspires rather than dominates, initiative that serves broader purposes than mere self-advancement.",
    karmicDynamics:
      "The 19/1 often represents the resolution of karmic debts related to past-life abuse of power — domination, selfishness, refusal of responsibility. The 'Prince of Heaven' symbolism suggests that the individual has, in previous cycles, learned the lessons of authority and now receives the crown not as a privilege but as a responsibility. The period's opportunities come with embedded tests of integrity; success requires combining radiant confidence with genuine consideration for others' welfare.",
    manifestationPatterns:
      "This compound produces what practitioners have called 'effortless success' — not that no effort is required, but that the effort invested yields returns disproportionate to the input. Projects launched during 19/1 tend to gain momentum through what appears to be favorable coincidence. The individual's plans encounter support from unexpected quarters, obstacles dissolve before they become serious impediments, and the period's initiatives create foundations that continue yielding benefits long after this cycle concludes.\n\nThe 19/1 blessing extends to personal life as well as professional endeavors. Happiness and fulfillment characterize this cycle; the individual experiences a sense of being aligned with their purpose, of moving in harmony with the deeper currents of their destiny.",
  },
  {
    compound: 28,
    reduced: 1,
    name: "The Lamb",
    isKarmicDebt: false,
    isMasterNumber: false,
    symbolism:
      "A person of great promise and possibilities who is likely to see all taken away unless they carefully provide for the future.",
    vibrationalEssence:
      "The 28/1 is one of the most contradictory compound numbers in the Chaldean system. The 2's receptive, cooperative energy combines with the 8's material power, producing an individual who attracts significant opportunities and demonstrates genuine capability, yet who faces repeated cycles of loss and renewal that can exhaust even the most resilient spirit.\n\nThe 28's classical description warns explicitly of 'loss through trust in others, opposition and competition in trade, danger of loss through law, and the likelihood of having to begin life's road over and over again.' Within this period, initiatives that appear solid and promising may collapse due to factors beyond the individual's direct control — partners who prove unreliable, agreements that become contested, circumstances that shift unexpectedly and overturn carefully laid plans.",
    karmicDynamics:
      "The 28/1 often brings karmic lessons around trust and discernment. Past-life patterns of placing faith in unworthy allies, of assuming that others share one's integrity, of failing to protect one's interests through proper legal and structural safeguards — all of these create the energetic template for the period's experiences. The repetition of loss and renewal is not random punishment but structured education: each cycle of building and losing builds the discernment that will eventually prevent unnecessary losses.",
    manifestationPatterns:
      "Individuals in 28/1 frequently experience what feels like 'two steps forward, one step back' progress, except that the steps back sometimes erase all the forward gains. Money lent rarely returns; promises made are frequently broken; trust placed is often betrayed. The period's professional initiatives may succeed initially only to encounter opposition or legal challenge that forces restart.\n\nYet the 28/1 is not without its gifts. The repeated necessity of beginning again builds resilience, adaptability, and an unusual capacity for regeneration. The key to navigating this compound number lies in meticulous caution — verifying every agreement in writing, diversifying investments and commitments, maintaining reserves that can sustain through periods of loss.",
  },
  {
    compound: 37,
    reduced: 1,
    name: "The Royal Star of Taurus",
    isKarmicDebt: false,
    isMasterNumber: false,
    symbolism:
      "The 8-pointed Star of Venus; a symbol of peace, love, and fortunate partnerships.",
    vibrationalEssence:
      "The 37/1 carries a distinctly social and relational quality that differentiates it sharply from other 1-series compounds. Where 10/1 manifests through karmic momentum and 19/1 through radiant individual achievement, 37/1 operates through alliances, friendships, and partnerships that advance the individual's position. The 3's creative expression combines with the 7's spiritual depth, producing an energy that attracts genuinely supportive connections.\n\nCheiro described 37 as 'a number of good and fortunate friendships in love, and in combinations connected with the opposite sex. It is also good for partnerships of all kinds.' This means that the period's initiatives succeed most readily when pursued through collaborative rather than purely individual effort.",
    karmicDynamics:
      "The 37/1 often resolves karmic patterns around isolation and self-sufficiency taken to excess. Past lives where the individual refused help, rejected partnership, or insisted on solitary paths created imbalances that this period's energy corrects through the magnetic attraction of beneficial alliances. The Royal Star of Taurus symbolism suggests that the period's partnerships carry a quality of divine blessing — connections that feel fated, encounters that transform the trajectory of the individual's life.",
    manifestationPatterns:
      "This compound produces what practitioners have called 'partnership magic' — the phenomenon where the right person appears at precisely the moment their contribution becomes essential. Business partnerships formed during 37/1 tend to be mutually beneficial and enduring. Romantic connections initiated during this cycle carry unusual depth and transformative potential.\n\nThe period's creative and professional endeavors gain power through collaboration. The individual's ideas find receptive audiences; their initiatives attract capable co-creators; their ventures benefit from the resources and networks that partners provide. The 37/1 success formula is straightforward: seek alliance, welcome collaboration, and recognize that the period's initiating energy achieves its fullest expression through connection rather than isolation.",
  },
  {
    compound: 46,
    reduced: 1,
    name: "The Magnetic Partnership",
    isKarmicDebt: false,
    isMasterNumber: false,
    symbolism:
      "Same essence as 37/1 — the Royal Star of Taurus operating through a higher octave of partnership energy.",
    vibrationalEssence:
      "The 46/1 carries the same fundamental vibration as 37/1. However, the 46 compound introduces the 4's structural discipline and the 6's nurturing responsibility into the 1's initiating energy, producing a partnership-oriented period with distinctly practical and domestic dimensions.\n\nThe 4's influence adds methodical planning and systematic effort to the period's alliance-building activities. Partnerships formed during 46/1 tend to be characterized by clear agreements, defined responsibilities, and structured approaches to shared goals. The 6's influence introduces care, service, and relational commitment — partnerships that are not merely advantageous but genuinely nurturing.",
    manifestationPatterns:
      "The 46/1 produces partnerships that are both fortunate and durable. The individual attracts allies who bring not only opportunity but stability — people who commit, who follow through, who invest in the long-term success of shared endeavors. Professional collaborations benefit from clear structure and mutual accountability. Personal relationships develop through demonstrable care and practical support.\n\nThe period's initiatives succeed when built on solid foundations. The 4's structural energy demands that plans be thoroughly researched, resources carefully allocated, and timelines realistically established. The 6's nurturing energy requires that all collaborations include attention to the human element — relationships maintained, feelings considered.",
  },
  {
    compound: 55,
    reduced: 1,
    name: "The Master Communicator's Sword",
    isKarmicDebt: false,
    isMasterNumber: false,
    isExtended: true,
    symbolism:
      "The Sword beyond the 52-week gate — words, commands, broadcasts, declarations and decisive movements that cut history into before and after; protection and menace in the same blade.",
    vibrationalEssence:
      "The 55/1 is not merely an extended version of 10/1. It is a double-5 power number, and historical validation shows that it often manifests through communication under crisis. The old symbol of the Sword is correct, but the sword is not always metal. It may be a speech, broadcast, manifesto, order, campaign slogan, wartime message, legal declaration, technological release, strategic command, or public sentence that severs the old timeline.\n\nBecause 5 is movement, media, persuasion, risk and freedom, doubled 5 creates a storm of motion. Because 55 reduces to 10 and then to 1, that storm is forced into a decisive act of leadership. The person must cut through fear, confusion, delay or enemy pressure. If they wield the sword consciously, the year gives triumph over difficulties and honors disproportionate to the visible resources available. If they wield it recklessly, the same sword wounds alliances, health, reputation or the long-term peace that must follow the victory.\n\nThis number is especially strong for wartime leaders, political campaigners, broadcasters, writers, military commanders, negotiators, inventors and anyone whose words move crowds under pressure.",
    karmicDynamics:
      "The karmic lesson of 55/1 is command of force. The person is given a blade because circumstances require decision, but the soul is judged by precision. Cutting away what is dead brings liberation; cutting from anger creates future enemies. The year asks whether courage can remain disciplined when history demands speed.",
    manifestationPatterns:
      "In a personal year, 55/1 may produce sudden appointment, wartime command, public leadership, emergency communication, aggressive litigation, decisive separation, military or political confrontation, sweeping business pivot, or a message that becomes historically remembered. Churchill 1940 is the model calibration: the sword was rhetorical as much as military, transforming national fear into defiance.\n\nPredictively, do not read 55/1 as quiet success. Read it as crisis leadership. The person must speak, decide, cut, mobilize, defend, and accept that protection and menace arrive together. The safest path is courageous clarity with restraint: say the necessary thing, cut the necessary cord, but do not become addicted to the blade.",
  },
  {
    compound: 64,
    reduced: 1,
    name: "The Creative Innovator",
    isKarmicDebt: false,
    isMasterNumber: false,
    isExtended: true,
    symbolism:
      "Same essence as 46/1, with the 6's nurture and 4's structure expressed through a higher octave of creative innovation.",
    vibrationalEssence:
      "The 64/1 reduces to 10 (6+4=10), then to 1, carrying the partnership and structural energies of 46/1 in a higher octave. The 6's nurturing, responsible energy combines with the 4's methodical, disciplined approach, producing a period where initiatives succeed through systematic care and structured support of collaborative endeavors.",
    manifestationPatterns:
      "The 64/1 produces success in fields requiring both creativity and organization. The individual's initiating energy finds effective expression through projects that combine artistic vision with practical implementation. Partnerships thrive when they include clear division of creative and administrative responsibilities. The period's initiatives benefit from attention to both the functional and the aesthetic dimensions of every endeavor.",
  },
  {
    compound: 73,
    reduced: 1,
    name: "The Scepter of Initiation",
    isKarmicDebt: false,
    isMasterNumber: false,
    isExtended: true,
    symbolism:
      "The Scepter — a promise of authority, power, and command; reward from the productive intellect.",
    vibrationalEssence:
      "The 73/1 reduces to 10 (7+3=10), then to 1, carrying the authoritative command energy of the 27/9 Scepter through the 1's initiating framework. The 7's intellectual depth combines with the 3's creative expression, producing a period where leadership emerges through the power of ideas, where authority is established through demonstrated competence rather than asserted dominance.",
    manifestationPatterns:
      "The 73/1 produces recognition for intellectual and creative achievement. The individual's ideas gain traction; their proposals attract support; their leadership is sought after in projects requiring both vision and analytical precision. Professional advancement comes through demonstrated expertise rather than political maneuvering.",
  },
  {
    compound: 82,
    reduced: 1,
    name: "The Survivor's Renewal",
    isKarmicDebt: false,
    isMasterNumber: false,
    isExtended: true,
    symbolism:
      "Same essence as 28/1 — the cycle of promise, loss, and renewal operating through a higher octave.",
    vibrationalEssence:
      "The 82/1 reduces to 10 (8+2=10), then to 1, carrying the contradictory energies of 28/1 in intensified form. The 8's material power combines with the 2's receptive sensitivity, producing a period of significant promise that must be carefully protected against the trust-related losses that characterize this compound pattern.",
    manifestationPatterns:
      "The 82/1 produces strong leadership and courageous action, but with repeated warnings about the stability of partnerships and alliances. The individual achieves significant progress through their own efforts only to face setbacks caused by others' unreliability. The period's key lesson is discernment in trust — learning to distinguish genuine allies from those who praise today and curse tomorrow.",
  },
  {
    compound: 91,
    reduced: 1,
    name: "The Eccentric Genius",
    isKarmicDebt: false,
    isMasterNumber: false,
    isExtended: true,
    symbolism:
      "Strong determination and profitable journeys; success through creative vigor and concentrated effort.",
    vibrationalEssence:
      "The 91/1 reduces to 10 (9+1=10), then to 1, carrying the completion-and-initiation energy of the full cycle. The 9's humanitarian, transcendent quality combines with the 1's pioneering force, producing a period where creative and professional success emerges through unusual, eccentric, or innovative approaches.",
    manifestationPatterns:
      "The 91/1 produces creative success through unconventional methods. The individual's willingness to chart an independent course, combined with the 9's broad perspective, creates a period of pioneering achievement that may not follow established paths but that produces results of genuine originality and lasting value.",
  },
  // ── PERSONAL YEAR 2: PARTNERSHIP ──────────────────────────────────────────
  {
    compound: 11,
    reduced: 2,
    name: "Strength",
    isKarmicDebt: false,
    isMasterNumber: true,
    symbolism:
      "A woman holding open the jaw of a lion; a clenched hand; a lion muzzled. Master Number of spiritual illumination.",
    vibrationalEssence:
      "The 11/2 is one of the most spiritually significant compound numbers in the entire Chaldean system. The 11 is a Master Number representing the higher octave of 2's receptive energy — the Illumination number, the Intuition number, the channel through which spiritual vision penetrates ordinary consciousness.\n\nCheiro described 11 as 'an ominous number to occultists. It gives warning of hidden dangers, trial, and treachery from others.' The image of the woman holding open the lion's jaw captures the period's essential dynamic: tremendous power (the lion) that must be controlled through gentleness (the woman's hand) rather than force. The 11/2 period's strength is not the strength of domination but the strength of containment — the capacity to hold powerful energies without being consumed by them.",
    karmicDynamics:
      "The 11/2 brings karmic tests around the integration of spiritual vision with practical relationship. Past-life patterns of misusing psychic or intuitive abilities, of allowing spiritual insight to create separation from ordinary human connection, of failing to ground transcendent awareness in embodied relationship — all of these create the period's curriculum. The hidden dangers often manifest as tests of integrity: situations where the individual must choose between using their intuitive power for personal advantage and using it in service of the greater good.",
    manifestationPatterns:
      "Individuals in 11/2 frequently report intensified intuitive experiences — dreams that carry precognitive information, synchronicities that feel guided by unseen intelligence, moments of spontaneous insight that reveal hidden dimensions of situations. The nervous system becomes more sensitive, sometimes producing anxiety or overwhelm if grounding practices are lacking.\n\nThe period's partnerships carry unusual significance. Connections formed during 11/2 often have karmic or fated qualities — meetings that feel prearranged, relationships that transform the individual's understanding of love and connection. The 11/2 spiritual lesson centers on integration: bringing the heights of visionary experience into the depths of embodied relationship.",
  },
  {
    compound: 20,
    reduced: 2,
    name: "The Awakening",
    isKarmicDebt: false,
    isMasterNumber: false,
    symbolism:
      "A winged angel sounding a trumpet, while from below a man, a woman, and a child are seen rising from a tomb with their hands clasped in prayer.",
    vibrationalEssence:
      "The 20/2 carries one of the most profound spiritual symbols in the Chaldean system. Called both 'The Awakening' and 'The Judgement,' this compound number introduces a quality of spiritual calling into the 2's partnership cycle. The 2's receptive energy, rather than simply attracting relationships and opportunities, becomes a channel for higher purpose — a call to action 'for some great purpose, cause or duty.'\n\nCheiro emphasized that 20 'is not a material number and consequently is a doubtful one as far as worldly success is concerned.' This means the period's outward events may not produce conventional achievement or material gain. The 20/2 rewards are measured in spiritual currency: clarity of purpose, alignment with calling, the profound satisfaction of serving something larger than personal ambition.",
    karmicDynamics:
      "The 20/2 often represents a karmic turning point — the moment when the soul's deeper purpose becomes undeniable, when the individual can no longer ignore the call to serve their destined role. Past-life patterns of spiritual avoidance, of choosing comfort over calling, of failing to answer the summons to higher service — all of these create the pressure that builds during this cycle.",
    manifestationPatterns:
      "The 20/2 frequently produces experiences that feel like 'wake-up calls' — events that disrupt comfortable routines, encounters that challenge established priorities, inner promptings that refuse to be silenced. The angel's trumpet is not a gentle suggestion; it is a summons that demands response. The individual may feel drawn to causes, movements, or purposes that have no connection to their previous plans.\n\nThe period's partnerships carry the quality of spiritual fellowship — connections formed around shared purpose, relationships that support mutual growth in service of larger goals. Delays and obstacles that arise are best understood as necessary preparation.",
  },
  {
    compound: 29,
    reduced: 2,
    name: "Grace Under Trial",
    isKarmicDebt: false,
    isMasterNumber: false,
    symbolism:
      "Uncertainties, treachery, and deception of others; trials, tribulation, and unexpected dangers; unreliable friends; grief and deception caused by members of the opposite sex.",
    vibrationalEssence:
      "The 29/2 carries one of the most challenging compound vibrations in the Chaldean system. The 2's receptive, partnership-oriented energy combines with the 9's completion and transcendence, producing a period where relationships and collaborations become the primary arena for karmic testing. Cheiro's description is explicit and severe: this number 'gives grave warning if it comes out in anything concerning future events.'\n\nThe 29 reduces to 11 (2+9=11), creating a hidden Master Number beneath the 2's outward receptivity. This means that the period's trials carry spiritual significance beyond their surface difficulty; the betrayals, deceptions, and disappointments that characterize 29/2 are not random misfortunes but structured tests designed to develop the individual's spiritual strength and discernment.",
    karmicDynamics:
      "The 29/2 brings karmic debts related to relationship patterns from past lives — misuse of trust, betrayal of confidences, abandonment of those who depended on the individual, or excessive gullibility that allowed others to be victimized. The period's experiences mirror these past actions, creating situations where the individual must navigate the same dynamics from a transformed perspective.",
    manifestationPatterns:
      "Individuals in 29/2 frequently encounter situations that test their capacity to trust wisely. People who present themselves as friends prove unreliable; partnerships that seem promising dissolve through deception; members of the opposite sex may bring particular disappointment or grief.\n\nYet the 29/2 also carries the potential for profound spiritual growth. The hidden 11 Master Number means that the period's trials, properly met, develop intuitive wisdom and spiritual resilience. The individual who maintains integrity through betrayal, who continues to trust despite deception, who responds to disappointment with compassion rather than cynicism, emerges from this cycle with strengthened character and deepened capacity for genuine relationship.",
  },
  {
    compound: 38,
    reduced: 2,
    name: "The Vision Under Judgment",
    isKarmicDebt: false,
    isMasterNumber: false,
    symbolism:
      "The 3 of expression joined to the 8 of power, secretly reducing through 11 — creative authority under trial, where a vision may become revelation or collapse through betrayal, overreach, or misread allies.",
    vibrationalEssence:
      "Cheiro's canon assigns 38 the same meaning as 29: 'uncertainties, treachery, and deception of others; trials, tribulation, and unexpected dangers, unreliable friends, and grief and deception caused by members of the opposite sex.' That warning remains the 38's karmic core. The 38/2 must be read more sharply than a simple partnership number. Its visible digits are 3 and 8: expression, message, art, performance, argument, or public narrative joined to material power, office, money, command, law, and consequence. But 3 + 8 = 11, so beneath the 2 lies a Master-11 field. This makes 38/2 a year of visionary relationship: the person is not merely dealing with partners; they are dealing with people, institutions, crowds, courts, armies, audiences, or collaborators who decide whether the vision is carried into the world or shattered.\n\nHistorically, this number performs best when read as professional and visionary trial. If the person’s vision is disciplined, 38/2 can produce magnetic public communication and surprising influence. If the vision has outrun logistics, loyalty, health, military reality, legal reality, or organizational structure, the same number can produce a Waterloo-type collapse: not a random defeat, but the fall of a vision that could no longer command the field around it.\n\nThe hidden 11 also gives omen-like intensity. Events feel symbolic. The person may sense destiny, but destiny is not the same as invulnerability. The year asks whether inspiration can survive practical contact with allies, enemies, contracts, judges, voters, patrons, rivals, and the stubbornness of the material world.",
    karmicDynamics:
      "The karmic lesson of 38/2 is discernment in the use of influence. The person may have the voice, charisma, strategy, or imagination to move others, but must learn that every powerful vision requires trustworthy carriers. Past patterns of trusting applause, assuming loyalty, or confusing intensity with truth return as tests. The soul must distinguish genuine co-workers from fascinated spectators, flatterers, opportunists, and frightened followers.",
    manifestationPatterns:
      "In a personal year, 38/2 often manifests through creative or professional partnerships, public campaigns, courtship with powerful institutions, business alliances, competitive arenas, media narratives, or political/military coalitions. The person’s ideas attract attention, but attention is not the same as protection. Agreements require precision. Roles require clarity. Promises must be tested.\n\nThe constructive form is visionary collaboration: a message finds the right vessel and reaches an audience larger than expected. The destructive form is visionary collapse: the person discovers too late that the surrounding structure could not support the dream. In prediction, 38/2 should always trigger questions about advisers, partners, timing, logistics, and whether the vision has become too inflated to obey facts.",
  },
  {
    compound: 47,
    reduced: 2,
    name: "The Veiled Trial",
    isKarmicDebt: false,
    isMasterNumber: false,
    symbolism:
      "Same essence as 29/2, with the 4's structured analysis and 7's spiritual depth modifying the trial pattern.",
    vibrationalEssence:
      "Cheiro's canon assigns 47 the same meaning as 29: 'uncertainties, treachery, and deception of others... unreliable friends... grave warning if it comes out in anything concerning future events.' The veil over others' intentions is the 47's defining test. The 47/2 reduces to 11 (4+7=11), carrying the Master Number foundation with the 4's methodical discipline and the 7's analytical introspection. This compound produces a period where the 2's relationship challenges are met through intellectual rigor and spiritual investigation. The period's trials become puzzles to be solved, mysteries to be unraveled, opportunities for deepening understanding rather than merely enduring suffering.",
    manifestationPatterns:
      "The 47/2 produces relationship challenges that yield to analytical investigation. The individual who applies careful attention to partnership dynamics, who studies the patterns in their relational experiences, who uses the period's difficulties as material for self-knowledge, emerges with significantly developed capacity for wise relationship. The period's trials become the raw material for expertise in human dynamics.",
  },
  {
    compound: 56,
    reduced: 2,
    name: "The Clenched Hand",
    isKarmicDebt: false,
    isMasterNumber: false,
    isExtended: true,
    symbolism:
      "Same essence as 11/2 — hidden dangers, trial, and treachery from others; a clenched hand; a lion muzzled.",
    vibrationalEssence:
      "The 56/2 reduces to 11 (5+6=11), carrying the Master Number with the 5's dynamic change and the 6's nurturing responsibility. This compound produces a period of significant transition in relationships, where the hidden trials of the 11 manifest through domestic and family-related challenges.",
    manifestationPatterns:
      "The 56/2 produces changes in domestic partnerships and family relationships. The individual may face decisions about relocation that affect partnerships, or may experience tests in relationships with family members who require care or support. The period's hidden dangers often manifest through the individual's own tendency to sacrifice too much for others — the 6's nurturing energy, taken to excess, can create unhealthy dependency patterns that the 11's trials force into awareness.",
  },
  {
    compound: 65,
    reduced: 2,
    name: "The Master Number Tension",
    isKarmicDebt: false,
    isMasterNumber: false,
    isExtended: true,
    symbolism:
      "Same essence as 56/2 and 11/2, with intensified Master Number energy balancing freedom and domestic commitment.",
    vibrationalEssence:
      "The 65/2 reduces to 11 (6+5=11), carrying the same Master Number foundation as 56/2 with the digits reversed. World numerology sources note that 65 is 'the same as 11' but with an important addition: 'The need to balance freedom and domestic affairs (commitment) is even more important here.'",
    manifestationPatterns:
      "The 65/2 produces tension between commitment and freedom in relationships. The individual may feel drawn to partnership while simultaneously experiencing restlessness and desire for independence. Partners may mirror this conflict, demanding commitment while acting unpredictably. The period's lesson is integration — finding ways to honor both the need for connection and the need for autonomy within the same relationship structures.",
  },
  {
    compound: 74,
    reduced: 2,
    name: "The Master Force with Premonitions",
    isKarmicDebt: false,
    isMasterNumber: false,
    isExtended: true,
    symbolism:
      "Same essence as 47/2 and 11/2, bringing premonitions and intense dreams.",
    vibrationalEssence:
      "The 74/2 reduces to 11 (7+4=11), carrying the Master Number with the 7's spiritual depth and the 4's structural discipline. World numerology sources specifically note that 74 'is the same as 11' with the addition that 'It brings premonitions and intense dreams.'",
    manifestationPatterns:
      "The 74/2 produces vivid dreams, strong hunches, and uncanny synchronicities that provide guidance about relationship decisions. The individual may find themselves knowing things about partners or situations without being able to explain how they know. The challenge lies in distinguishing genuine intuition from anxiety-driven projection, and in grounding intense psychic experiences in practical self-care routines.",
  },
  {
    compound: 83,
    reduced: 2,
    name: "The Business-Oriented Pragmatist",
    isKarmicDebt: false,
    isMasterNumber: false,
    isExtended: true,
    symbolism:
      "Same essence as 38/2 and 29/2, more business-oriented and less sensitive.",
    vibrationalEssence:
      "The 83/2 reduces to 11 (8+3=11), carrying the Master Number with the 8's material power and the 3's creative expression. World numerology sources note that 83 'is the same as 38 and 11' but 'is more business-oriented and less sensitive and vulnerable.'",
    manifestationPatterns:
      "The 83/2 produces challenges in business partnerships and professional collaborations. The individual's creative contributions may be undervalued or exploited by associates who focus on financial outcomes rather than artistic quality. The period's lesson is learning to protect creative interests through proper business arrangements while maintaining the capacity for genuine professional connection.",
  },
  {
    compound: 92,
    reduced: 2,
    name: "The Humanitarian Master",
    isKarmicDebt: false,
    isMasterNumber: false,
    isExtended: true,
    symbolism: "Same essence as 29/2 and 11/2, with great concern for mankind.",
    vibrationalEssence:
      "The 92/2 reduces to 11 (9+2=11), carrying the Master Number with the 9's humanitarian compassion and the 2's receptive sensitivity. World numerology sources note that 92 'is the same as 29 and 11' with the addition that 'This number brings great concern for mankind.'",
    manifestationPatterns:
      "The 92/2 produces relationship experiences that expand the individual's compassion and concern for collective well-being. Personal betrayals and disappointments are processed through a lens of universal human experience; the individual emerges from the period with both deepened relationship discernment and strengthened commitment to serving human welfare.",
  },
  // ── PERSONAL YEAR 3: EXPRESSION ──────────────────────────────────────────
  {
    compound: 12,
    reduced: 3,
    name: "The Sacrifice",
    isKarmicDebt: false,
    isMasterNumber: false,
    symbolism:
      "The Sacrifice — or the Victim; one sacrificed for the plans or intrigues of others.",
    vibrationalEssence:
      "The 12/3 introduces a quality of suffering and anxiety into the 3's normally joyful expressive cycle. The 1's initiating energy combines with the 2's receptivity, producing a period where the individual's creative and communicative efforts are frequently diverted, exploited, or undermined by others. The period's outward theme remains expression and expansion, but the hidden current involves sacrifice — giving more than one receives, contributing without adequate recognition, finding one's plans absorbed into others' agendas.\n\nCheiro described 12 as carrying 'suffering and anxiety of mind,' indicating that the sacrifice is not merely external but psychological. The individual experiences genuine distress about being used, worry about whether their contributions are valued, mental turbulence about the discrepancy between their giving and what returns to them.",
    karmicDynamics:
      "The 12/3 brings karmic lessons around the relationship between giving and receiving. Past-life patterns of martyrdom, of allowing oneself to be exploited, of failing to establish healthy boundaries around one's creative contributions — all of these create the energetic template for the period's experiences. The sacrifice is not random victimhood but structured education in the art of balanced exchange.",
    manifestationPatterns:
      "Individuals in 12/3 frequently find their creative work appropriated by others, their ideas adopted without credit, their communicative efforts channeled into projects that benefit people who fail to acknowledge their contribution. Social connections may include people who are charming and appreciative when receiving help but distant or critical when asked to reciprocate.\n\nThe period's essential teaching is discernment in giving. The individual must learn to distinguish between genuine collaboration and exploitative arrangements. The 12/3 does not require the individual to stop giving; it requires them to give with awareness, establishing boundaries that protect their creative energy from depletion.",
  },
  {
    compound: 21,
    reduced: 3,
    name: "The Crown of the Magi",
    isKarmicDebt: false,
    isMasterNumber: false,
    symbolism:
      "The Universe; the Crown of the Magi — advancement, honors, elevation in life.",
    vibrationalEssence:
      "The 21/3 carries one of the most auspicious compound vibrations in the entire Chaldean system. Where 12/3 brings sacrifice and anxiety, 21/3 brings 'advancement, honors, elevation in life and general success.' The reversal of digits — from 12 to 21 — produces a complete inversion of meaning, illustrating the Chaldean principle that digit order carries independent significance.\n\nThe 2's receptivity combines with the 1's initiative, but in the 21 configuration, the 2's cooperative energy opens doors that the 1's pioneering force then walks through. Cheiro emphasized that this number 'means victory after long initiation and tests of determination' — the 3's expressive energy achieves its fullest manifestation after the individual has demonstrated sustained commitment to their craft or calling.",
    karmicDynamics:
      "The 21/3 often represents the flowering of karma cultivated through previous cycles of disciplined effort. The 'long initiation' Cheiro referenced suggests that the period's honors are not arbitrary gifts but earned rewards for sustained creative work. Past-life patterns of dedicated practice, of honing skills through repeated effort, of maintaining creative commitment despite obstacles — all of these create the foundation for the period's success.",
    manifestationPatterns:
      "The 21/3 produces visible advancement in creative and professional domains. The individual's work gains public recognition; their communication skills open doors to new opportunities; their social presence attracts influential connections. Honors, awards, promotions, and public acknowledgment characterize this cycle. The period's creative output tends to be not merely prolific but also distinguished — work that rises above the ordinary and commands respect.\n\nThe Crown of the Magi symbolism carries a specific spiritual dimension. The 'Magi' were initiated priests, guardians of esoteric knowledge. The 21/3 success is not merely material or social but carries a quality of spiritual legitimacy.",
  },
  {
    compound: 30,
    reduced: 3,
    name: "The Crossroads",
    isKarmicDebt: false,
    isMasterNumber: false,
    symbolism:
      "The Crossroads of the Mind — achievement and disappointment standing together; a person may possess success, knowledge, or recognition while still feeling that an essential emotional road has not been taken.",
    vibrationalEssence:
      "The 30/3 is not merely a harmless intellectual number. Historical testing shows that it behaves as a crossroads vibration: the mind is active, subtle, deductive, and often superior to its surroundings, yet the emotional life may remain suspended between roads. The 3 wants expression, social expansion, applause, publication and movement; the 0 opens a void around those desires, forcing the person to ask whether the achievement actually satisfies the soul.\n\nCheiro’s older statement that 30 is “neither fortunate nor unfortunate” is accurate only if it is read deeply. It means the number does not decide the outcome by itself; the mental attitude, the chosen road, and the willingness to give one’s intelligence a concrete direction decide everything. In famous-person histories, 30/3 often appears when real accomplishment coexists with private ambiguity: scientific or artistic work may advance, reputation may grow, a public narrative may form, yet the person may still feel unseen, displaced, emotionally unfulfilled, or forced to choose between two lives.\n\nTherefore 30/3 should be read as a year of mental harvest and existential decision. It can produce writing, research, interviews, teaching, invention, strategy, and theoretical breakthroughs, but it can also produce the strange sadness of having a result without a home for that result in the heart. It asks: will the person scatter thought into cleverness, or will they concentrate thought into a message that history can keep?",
    karmicDynamics:
      "The karmic lesson of 30/3 is the responsibility of intelligence. The person is not punished by lack of talent; they are tested by the temptation to remain detached, undecided, or above ordinary emotional commitments. Past patterns of using intellect as escape now return as situations where thought alone cannot resolve the whole matter. The person must choose a road, speak plainly, and allow the mind to serve meaning rather than pride or avoidance.",
    manifestationPatterns:
      "In a personal year, 30/3 may manifest as a book, paper, interview, performance, public explanation, examination, research discovery, teaching opportunity, creative plan, or strategic decision point. It may also bring a public success that does not feel emotionally complete, a choice between privacy and visibility, or a situation where the person’s words become more important than their actions.\n\nPredictively, watch for ambivalence around achievement: the person may receive proof that they can do something, but must still decide whether it is the thing they are meant to do. The strongest use of 30/3 is disciplined expression: finish the article, state the thesis, define the message, and do not let brilliance dissolve into endless contemplation. The weakest use is ironic detachment — seeing all roads so clearly that one refuses to walk any of them.",
  },
  {
    compound: 39,
    reduced: 3,
    name: "The Scattered Vision",
    isKarmicDebt: false,
    isMasterNumber: false,
    symbolism:
      "Creative energy dispersed across many projects; a lantern with many flames but no single hearth unless disciplined focus is chosen.",
    vibrationalEssence:
      "The 39/3 is a high-output creative compound, but historical calibration shows that its danger is dispersion. The 3 wants to speak, perform, publish, teach, socialize and multiply. The 9 adds breadth, humanitarian meaning, memory, completion and the desire to touch many lives. Together they create a year in which the person can be everywhere at once — in many conversations, projects, causes, journeys, audiences, negotiations, writings or performances — but may struggle to make one thread sovereign.\n\nBecause 3 + 9 = 12 before reducing to 3, the Sacrifice vibration is hidden inside the number. This means the scattered activity may not be free. The person may be pulled in many directions by obligation, public expectation, old promises, unfinished work, audiences, family, politics, illness, or the emotional debt of previous choices. The appearance is abundance; the inner experience can be fragmentation.\n\nThe accurate prediction for 39/3 is not simply “creativity.” It is creative multiplicity under pressure of completion. Some projects must be finished, some must be abandoned, and one central vision must be protected from being consumed by lesser fires.",
    karmicDynamics:
      "The karmic lesson of 39/3 is concentration. The person may have used talent broadly in the past, pleasing many people without asking which contribution actually mattered. The year returns this pattern by making every opportunity look meaningful. The soul must learn that not every invitation is destiny and not every audience deserves the same portion of life-force.",
    manifestationPatterns:
      "In a personal year, 39/3 may show as simultaneous writing, touring, teaching, campaigning, filming, litigating, negotiating, releasing, organizing, caregiving or public explaining. It can bring real visibility and a sense that life is working because many doors are open. But the predictive warning is that open doors can become leaks.\n\nThe highest use of 39/3 is editorial: choose the work that carries the whole meaning of the year and let secondary projects serve it. The lowest use is frantic visibility — being seen everywhere while history remembers nothing clearly. If paired with a strong classic essence such as 21/3 or 19/1, the scattered vision can be crowned. If paired with a warning essence such as 12/3, 16/7, 26/8 or 28/1, the scattering may become the mechanism of loss.",
  },
  {
    compound: 48,
    reduced: 3,
    name: "The Crown and Cross",
    isKarmicDebt: false,
    isMasterNumber: false,
    symbolism:
      "Elevation to a visible height accompanied by friction, sacrifice, opposition, and the cross of responsibility; the crown is real, but it is not weightless.",
    vibrationalEssence:
      "The 48/3 is one of the most important refinements to the 30–39 family because it proves that a difficult compound can coexist with public elevation. The old wording — visionary but brought down by friction — is only half the truth. Historical comparison shows that 48/3 often creates a Crown-and-Cross pattern: the person reaches a high creative, political, institutional, intellectual or public position, yet that elevation immediately exposes them to resistance from every side.\n\nThe 4 supplies structure, office, duty, institution and the weight of practical reality. The 8 supplies power, law, money, command, public consequence and the karmic harvest of ambition. Together they reduce through 12, the Sacrifice, before arriving at 3, the public narrative. Therefore the person may indeed be crowned, elected, promoted, awarded, recognized or placed at the center of a story, but the same event carries the cross: criticism, bureaucracy, danger, compromise, exhaustion, inherited problems, public misunderstanding or the burden of representing more than oneself.\n\nThis number should therefore be read with nuance. It is not a denial of success. It is success under pressure. It is the speech made from the mountaintop while stones are still being thrown from below. It is the office gained after struggle and immediately filled with unfinished historical debts.",
    karmicDynamics:
      "The karmic lesson of 48/3 is responsible visibility. The person has earned or attracted a platform, but the platform is inseparable from service and sacrifice. Past ambition now meets the cost of command. Past creative vision now meets the institution that must carry it. Past promises now become public obligations.",
    manifestationPatterns:
      "In a personal year, 48/3 can manifest as election to high office, promotion into a difficult role, public recognition that brings scrutiny, publication that provokes opposition, artistic success with private cost, or a visionary project slowed by law, money, bureaucracy or entrenched interests.\n\nThe positive manifestation is historic elevation: the person becomes visible enough for the world to hear the message. The negative manifestation is friction from all sides: opponents, allies, institutions, family, health, finance or inherited conflicts all demand payment at once. If a benefic classic essence such as 21/3, 19/1, 23/5 or 17/8 accompanies it, the crown is likely to outshine the cross. If the companion essence is 16/7, 26/8, 28/1 or 35/8, the cross must be treated as a serious warning rather than background difficulty.",
  },
  {
    compound: 57,
    reduced: 3,
    name: "The Intelligent Inventor",
    isKarmicDebt: false,
    isMasterNumber: false,
    isExtended: true,
    symbolism:
      "Same essence as 30/3, with the 5's dynamic intelligence and 7's spiritual invention.",
    vibrationalEssence:
      "The 57/3 reduces to 12 (5+7=12), then to 3, carrying the 30/3 mental energy with the 5's versatile intelligence and the 7's spiritual depth. This compound produces a period of inventive creativity, where the individual's expression takes unusual, innovative, and sometimes unprecedented forms.",
    manifestationPatterns:
      "The 57/3 produces creative work that breaks established patterns and introduces new approaches. The individual's expression may surprise even themselves, as the 7's spiritual channel opens access to ideas and perspectives that lie beyond conventional thinking. The period's creative output tends to be ahead of its time.",
  },
  {
    compound: 66,
    reduced: 3,
    name: "The Generous Creator",
    isKarmicDebt: false,
    isMasterNumber: false,
    isExtended: true,
    symbolism:
      "Generous to a fault, with financial ups and downs; extremely creative, loyal, and loving.",
    vibrationalEssence:
      "The 66/3 introduces a Power Number into the 3's creative cycle. The double 6 intensifies the nurturing, artistic, and responsible qualities of the 6, producing a period of extraordinary creative generosity and expressive abundance. World numerology sources describe 66 as 'generous to a fault, this number brings financial ups and downs. It is extremely creative, loyal and loving. It is considered a Power number.'",
    manifestationPatterns:
      "The 66/3 produces abundant creative output that is enthusiastically received. The individual's generosity of spirit attracts loyal audiences and appreciative communities. However, the 'financial ups and downs' warning is significant: the period's creative success may not translate directly into monetary stability, as the individual's generous nature may lead them to undercharge for their work or to give away more than is sustainable.",
  },
  {
    compound: 75,
    reduced: 3,
    name: "The Analytical Inventor",
    isKarmicDebt: false,
    isMasterNumber: false,
    isExtended: true,
    symbolism: "Same essence as 57/3, more analytical and less creative.",
    vibrationalEssence:
      "The 75/3 reduces to 12 (7+5=12), then to 3. World numerology sources note that 75 'is more analytical and less creative' than 57. The period's expression tends toward systematic analysis, structured argument, and methodical presentation.",
    manifestationPatterns:
      "The 75/3 produces creative work that is intellectually demanding and analytically rigorous. The individual's expression may take the form of scholarly writing, technical communication, or systematic artistic approaches that prioritize structure over spontaneity.",
  },
  {
    compound: 84,
    reduced: 3,
    name: "The Visionary Idealist",
    isKarmicDebt: false,
    isMasterNumber: false,
    isExtended: true,
    symbolism: "Same essence as 48/3, more visionary and less organized.",
    vibrationalEssence:
      "The 84/3 reduces to 12 (8+4=12), then to 3. World numerology sources note that 84 'is more the visionary and less the organizer.' The period's creative expression is characterized by bold, expansive vision that may exceed the individual's practical capacity for execution.",
    manifestationPatterns:
      "The 84/3 produces grand creative visions and ambitious expressive projects. The individual sees possibilities on a large scale and communicates their vision with compelling enthusiasm. The challenge lies in grounding the vision in practical reality; the period's creative successes come when the individual partners with others who can provide the organizational skills that complement their visionary capacity.",
  },
  {
    compound: 93,
    reduced: 3,
    name: "The Marvelous Capabilities",
    isKarmicDebt: false,
    isMasterNumber: false,
    isExtended: true,
    symbolism:
      "Capable of doing marvelous things; worldly knowledge; excellence in histrionics.",
    vibrationalEssence:
      "The 93/3 reduces to 12 (9+3=12), then to 3. The Chaldean source describes those under 93 as 'capable of doing marvelous things. They improve their worldly knowledge and are lucky to have their desires fulfilled. They excel in the field of histrionics through which they attain more fame.'",
    manifestationPatterns:
      "The 93/3 produces creative accomplishments that attract public recognition and admiration. The individual's expressive abilities seem to operate at peak capacity, producing work that is both technically accomplished and emotionally resonant. The period's creative endeavors tend to fulfill the individual's desires while also serving audiences who find value and inspiration in their output.",
  },
  // ── PERSONAL YEAR 4: FOUNDATION ──────────────────────────────────────────
  {
    compound: 13,
    reduced: 4,
    name: "Rebirth",
    isKarmicDebt: true,
    isMasterNumber: false,
    symbolism:
      "Rebirth — change of plans, change of place, upheaval and destruction; death as symbolic ending and new beginning.",
    vibrationalEssence:
      "The 13/4 carries one of the four Karmic Debt numbers in the Chaldean system, introducing the most dramatic transformative energy into the 4's normally stable foundation-building cycle. The 1's initiative combines with the 3's creative expression, producing a period where the individual's efforts to establish structure and security are continually disrupted by forces of change that operate beyond their control.\n\nCheiro's description emphasizes that 13 'is not a necessarily easy life path. It is filled with many lessons.' The number is 'associated with rebirth and breaking through the threshold. Death is symbolic as an ending of one situation and a re-birth into the next.'",
    karmicDynamics:
      "The 13/4 brings the karmic debt of laziness and irresponsibility from past lives. The individual who misused their talents, avoided their duties, or took destructive shortcuts in previous cycles now encounters circumstances that force disciplined effort and responsible action. The upheaval is not punishment but education: each disruption creates the necessity for the very discipline and order that the individual's karma requires them to develop.",
    manifestationPatterns:
      "The 13/4 produces sudden and unexpected changes in the areas where the individual seeks to establish security. Career plans may be overturned by industry disruptions; financial structures may be shaken by unexpected expenses or losses; living situations may change through relocation or property issues.\n\nThe period's essential teaching is that true foundation cannot be built on rigid attachment to existing structures. The 13/4 upheaval forces the individual to develop foundations that are resilient rather than merely solid — systems that can absorb shock, structures that can bend without breaking. The individual who embraces the period's transformative energy rather than fighting it discovers that the rebirth produces stronger, more flexible foundations than the ones that were destroyed.",
  },
  {
    compound: 22,
    reduced: 4,
    name: "The Fool",
    isKarmicDebt: false,
    isMasterNumber: true,
    symbolism:
      "A good man blinded by the folly of others, with a knapsack on his back full of arrows; a dreamer who awakens only when surrounded by danger. Master Number of the Master Builder.",
    vibrationalEssence:
      "The 22/4 is a Master Number, representing the higher octave of 4's structural energy. Where the ordinary 4 builds through methodical discipline, the 22/4 builds on a scale that transforms not only the individual's life but also the lives of those around them. The 22 is the Master Builder number — a period where the individual's foundation-building efforts have the potential to create lasting structures of significant scale.\n\nCheiro's symbolism emphasizes the dangers that accompany this elevated capacity: the 22's dreamer, blinded by others' folly, carrying resources (the arrows) that could provide defense but failing to use them until danger is imminent.",
    karmicDynamics:
      "The 22/4 brings karmic tests around the responsible use of building power. Past-life patterns of allowing others to direct one's constructive efforts, of building structures that served others' agendas rather than genuine collective need, of possessing great capacity but failing to apply it with independent judgment — all of these create the period's curriculum. The individual must learn to be the Master Builder rather than the master builder's tool.",
    manifestationPatterns:
      "The 22/4 produces opportunities for significant construction — building businesses, organizations, systems, or structures that serve large numbers of people. The individual's practical capacity is amplified, allowing them to undertake projects of scope that would be overwhelming in other cycles. The warning is equally important: others may seek to attach themselves to the individual's building efforts, claiming partnership while contributing little, or steering the project toward ends that serve their interests rather than the collective good.",
  },
  {
    compound: 31,
    reduced: 4,
    name: "The Recluse",
    isKarmicDebt: false,
    isMasterNumber: false,
    symbolism:
      "Even more self-contained, lonely, and isolated from his fellows; not a fortunate number from a worldly or material standpoint.",
    vibrationalEssence:
      "The 31/4 reduces to 4 (3+1=4), carrying the 30/3's thoughtful, mental energy through the 4's structural filter. Where 30/3 produced mental superiority and contemplative creativity, 31/4 produces isolation, individuality, and self-reliance taken to the point of separation from collective support.\n\nCheiro described 31 as 'very similar to the preceding one [30], except that the person it represents is even more self-contained, lonely, and isolated from his fellows.' This means a period where foundation-building becomes a solitary endeavor — the individual achieves through their own effort but tends to work alone.",
    manifestationPatterns:
      "The 31/4 produces methodical, systematic progress that is achieved individually rather than collectively. The individual builds solid foundations through their own disciplined effort, developing skills, establishing routines, and creating structures that are genuinely durable. However, the period's isolation means that progress is slower than it might be with collaborative support.\n\nThe period's lesson is not that isolation is bad but that it has costs. The individual who recognizes their tendency toward self-containment can deliberately seek collaborative connections without abandoning their capacity for independent work.",
  },
  {
    compound: 40,
    reduced: 4,
    name: "The Higher Recluse",
    isKarmicDebt: false,
    isMasterNumber: false,
    symbolism:
      "Same essence as 31/4, charming their way into prominent positions and flexing rules.",
    vibrationalEssence:
      "The 40/4 reduces to 4 (4+0=4), carrying the 40's energy through the structural 4. This compound produces a period of methodical foundation-building with the 4's discipline amplified by the 0's mystical potential. The 40 compound introduces additional dimensions beyond the 31 pattern. Where 31 produced isolation through self-containment, 40 produces prominence through disciplined charm.",
    manifestationPatterns:
      "The 40/4 produces solid professional advancement through demonstrated competence. The individual's systematic approach to foundation-building attracts the attention of those who value reliability and thoroughness. Promotions, expanded responsibilities, and positions of trust characterize this cycle. The period's structures tend to be not only solid but also visible — achievements that gain recognition because they are built with the thoroughness that produces lasting results.",
  },
  {
    compound: 49,
    reduced: 4,
    name: "The Solitary Builder",
    isKarmicDebt: false,
    isMasterNumber: false,
    symbolism:
      "Same essence as 31/4, the practical humanitarian who is uncomfortable with travel and dislikes changes.",
    vibrationalEssence:
      "Cheiro's canon assigns 49 the same meaning as 31: 'self-contained, lonely, and isolated from his fellows... not a fortunate number from a worldly or material standpoint.' The 49 builds, but often alone, and rarely for applause. The 49/4 reduces to 13 (4+9=13), then to 4, carrying the karmic rebirth energy of 13/4 through a higher octave. The 4's structural discipline combines with the 9's completion and humanitarian breadth, producing a period where foundation-building serves collective welfare rather than merely individual security.",
    manifestationPatterns:
      "The 49/4 produces practical achievements with humanitarian impact. The individual's systematic efforts create structures that serve collective needs — community organizations, educational programs, social services, or infrastructure that benefits broad populations. The period's foundation-building carries a quality of legacy, creating systems that continue serving their purpose long after the individual's direct involvement ends.",
  },
  {
    compound: 58,
    reduced: 4,
    name: "The Destined Success",
    isKarmicDebt: false,
    isMasterNumber: false,
    isExtended: true,
    symbolism:
      "Same essence as 31/4, hardworking and destined for success, more masculine.",
    vibrationalEssence:
      "The 58/4 reduces to 13 (5+8=13), then to 4, carrying the karmic rebirth energy with the 5's dynamic change and the 8's material power. The Chaldean source describes 58 as 'hardworking and destined for success, more masculine.' The period's foundation-building is characterized by persistence, endurance, and willingness to do whatever is necessary to establish security.",
    manifestationPatterns:
      "The 58/4 produces solid material progress through determined effort. The individual's systematic approach is amplified by the 8's executive capacity and the 5's adaptability, producing foundations that are not only structurally sound but also financially substantial.",
  },
  {
    compound: 67,
    reduced: 4,
    name: "The Inventive Analyst",
    isKarmicDebt: false,
    isMasterNumber: false,
    isExtended: true,
    symbolism:
      "Same essence as 31/4, merging analytical intelligence and creativity; inventors and mathematicians.",
    vibrationalEssence:
      "The 67/4 reduces to 13 (6+7=13), then to 4. World numerology sources describe 67 as a number that 'merges analytical intelligence and creativity. Inventors and mathematicians often have this number prominent in their chart.'",
    manifestationPatterns:
      "The 67/4 produces creative solutions to structural challenges. The individual's foundation-building efforts involve invention and innovation — new approaches to old problems, original methods for establishing security, creative structures that serve their purposes more effectively than conventional alternatives.",
  },
  {
    compound: 76,
    reduced: 4,
    name: "The Organizational Excellence",
    isKarmicDebt: false,
    isMasterNumber: false,
    isExtended: true,
    symbolism:
      "Same essence as 67/4, excellent for management and organization; can turn ideas into reality.",
    vibrationalEssence:
      "The 76/4 reduces to 13 (7+6=13), then to 4. World numerology sources describe 76 as 'an excellent number for anyone involved in management or organization. It can turn ideas into reality.'",
    manifestationPatterns:
      "The 76/4 produces well-organized structures and efficiently managed systems. The individual's foundation-building efforts are characterized by careful planning, systematic implementation, and thorough follow-through. Ideas that have remained abstract in previous cycles become concrete realities during this period.",
  },
  {
    compound: 85,
    reduced: 4,
    name: "The Masculine Determination",
    isKarmicDebt: false,
    isMasterNumber: false,
    isExtended: true,
    symbolism: "Same essence as 58/4, more masculine and bullish.",
    vibrationalEssence:
      "The 85/4 reduces to 13 (8+5=13), then to 4. World numerology sources note that 85 'is more masculine, and it can be bullish.' The period's foundation-building is characterized by determined, forceful effort that may border on aggression.",
    manifestationPatterns:
      "The 85/4 produces solid material foundations through determined effort. The individual's systematic approach is amplified by the 8's executive capacity, producing significant structural achievements. However, the 'bullish' quality may create friction in collaborative relationships.",
  },
  {
    compound: 94,
    reduced: 4,
    name: "The Practical Humanitarian",
    isKarmicDebt: false,
    isMasterNumber: false,
    isExtended: true,
    symbolism:
      "Same essence as 49/4, the practical humanitarian who dislikes travel and changes.",
    vibrationalEssence:
      "The 94/4 reduces to 13 (9+4=13), then to 4. World numerology sources describe 94 as 'the practical humanitarian. It is not comfortable with travel, and dislikes changes.'",
    manifestationPatterns:
      "The 94/4 produces practical structures that serve humanitarian purposes. The individual's systematic approach to foundation-building creates systems, organizations, or infrastructure that benefits communities and populations. The period's work tends to be locally focused and practically oriented.",
  },
  // ── PERSONAL YEAR 5: CHANGE ──────────────────────────────────────────────
  {
    compound: 14,
    reduced: 5,
    name: "Magnetic Movement",
    isKarmicDebt: true,
    isMasterNumber: false,
    symbolism:
      "Movement, combination of people and things; danger from natural elements; fortunate dealings with money but with risk and danger because of others' actions.",
    vibrationalEssence:
      "The 14/5 carries the second of the four Karmic Debt numbers, introducing the lesson of balanced freedom into the 5's normally expansive change cycle. The 1's initiative combines with the 4's structure, producing a period where the individual's desire for movement, variety, and new experience encounters the karmic necessity of disciplined responsibility.\n\nThe 14/5 period's energy is magnetic — it draws people, opportunities, and circumstances toward the individual with unusual force. This magnetism operates through communication: the individual's words, writings, and media presence attract attention and open doors. The 14 compound has a special association with 'magnetic communication with the public through writing, publishing and all media related matters.'",
    karmicDynamics:
      "The 14/5 brings the karmic debt of misused freedom and irresponsible behavior from past lives. The individual who abused liberty, who failed to commit, who used their adaptability to avoid responsibility — now encounters circumstances that demand self-discipline and balanced choice. The period's dynamic energy is not restricted but channeled; freedom is not denied but must be exercised with awareness of consequences.",
    manifestationPatterns:
      "The 14/5 produces abundant opportunities for travel, communication, and financial gain through speculative ventures. The individual's natural adaptability is amplified by the 1's initiative, creating a period of movement and change that feels exciting and productive. However, the karmic debt introduces a critical warning: the period's gains are temporary and fluctuating, subject to 'strong currents of change' that can reverse fortune as rapidly as they create it.\n\nThe compound number's specific caution concerns reliance on others. The individual who depends on partners' representations, who trusts verbal agreements without written confirmation, who allows others to manage their financial affairs, encounters the 14/5's characteristic deception.",
  },
  {
    compound: 23,
    reduced: 5,
    name: "The Royal Star of the Lion",
    isKarmicDebt: false,
    isMasterNumber: false,
    symbolism:
      "The Royal Star of the Lion — a promise of success, help from superiors, and protection from those in high places.",
    vibrationalEssence:
      "The 23/5 carries what Cheiro described as 'a most fortunate number and a promise of success of one's plans.' The 2's receptive energy combines with the 3's creative expression, producing a period where the 5's dynamic change operates through channels of patronage, mentorship, and support from established authority.\n\nThe Royal Star of the Lion symbolism carries specific astrological resonance. In the Chaldean-Tarot correspondence system, this number connects to the fixed star Regulus, the royal star in the constellation Leo that ancient astrologers associated with kingship, military command, and supreme authority.",
    karmicDynamics:
      "The 23/5 often represents the flowering of positive karma related to past-life service to authority or leadership. The individual who loyally supported just rulers, who provided creative counsel to wise leaders, who used their communicative gifts in service of legitimate authority — now receives the return on that karmic investment through the period's patronage and protection.",
    manifestationPatterns:
      "The 23/5 produces encounters with influential people who provide unexpected support. The individual may receive mentorship from established figures in their field, may be recommended for positions by powerful advocates, or may find that their initiatives gain approval and resources from those in positions to grant them.\n\nThe 23/5 period's success has a quality of inevitability about it. Obstacles that would block progress in other cycles dissolve when confronted with the Royal Star's influence. The individual experiences what feels like cosmic support — a sense that their endeavors are aligned with larger forces that ensure their success.",
  },
  {
    compound: 32,
    reduced: 5,
    name: "The Unexpected Power",
    isKarmicDebt: false,
    isMasterNumber: false,
    symbolism:
      "Magical power like the single 5; associated with combinations of people or nations; fortunate if the person holds to their own judgment.",
    vibrationalEssence:
      "The 32/5 carries the same fortunate vibration as 23/5 but with the digits reversed, producing a distinctly different expression. Where 23/5 operated through support from superiors, 32/5 operates through 'unexpected power' — success and influence that arrive through surprising channels, often from the individual's own creative efforts rather than from external patronage.\n\nCheiro described 32 as having 'a magical power like the single 5, or the command numbers 14 and 23.' The period's changes and movements carry a quality of creative magic — the individual's ideas and expressions have unusual power to influence circumstances.",
    manifestationPatterns:
      "The 32/5 produces sudden successes that seem to emerge from nowhere. The individual's creative efforts gain traction through unexpected channels; their communication reaches audiences they did not know existed; their initiatives attract support from surprising sources.\n\nThe compound number's warning is specific: the period's success depends on the individual maintaining independent judgment. 'If the person it represents holds to his own judgment and opinions; if not, his plans are likely to become wrecked by the stubbornness and stupidity of others.' The 32/5 magic works for those who trust their own creative vision.",
  },
  {
    compound: 41,
    reduced: 5,
    name: "The Verbal Leader",
    isKarmicDebt: false,
    isMasterNumber: false,
    symbolism:
      "Same essence as 32/5, leadership that comes easily; at home in verbal debate; drawn to technical disciplines.",
    vibrationalEssence:
      "The 41/5 reduces to 5 (4+1=5), carrying the 32/5's unexpected power energy with the 4's structural discipline and the 1's initiating force. This compound produces a period where dynamic change operates through leadership, technical expertise, and verbal mastery.",
    manifestationPatterns:
      "The 41/5 produces advancement through technical skill and verbal facility. The individual's capacity for clear communication, structured argument, and methodical presentation opens doors to new opportunities. Leadership positions emerge through demonstrated expertise; the period's changes bring the individual into roles where their systematic approach to dynamic challenges is precisely what is needed.",
  },
  {
    compound: 50,
    reduced: 5,
    name: "The Independent Force",
    isKarmicDebt: false,
    isMasterNumber: false,
    symbolism:
      "Same essence as 32/5, at home in verbal debate; drawn to technical disciplines.",
    vibrationalEssence:
      "Cheiro's canon assigns 50 the same meaning as 32: 'magical power... fortunate if the person it represents holds to his own judgment and opinions; if not, his plans are likely to become wrecked by the stubbornness and stupidity of others.' The 50/5 reduces to 5 (5+0=5), carrying the 5's dynamic energy amplified by the 0's mystical potential. This compound produces a period of intensified change and movement, where the individual's adaptability operates at peak capacity.",
    manifestationPatterns:
      "The 50/5 produces abundant opportunities for movement, travel, and new experience. The individual's adaptability is the period's greatest asset; they can enter unfamiliar situations and rapidly orient themselves, finding advantage where others see only confusion. Rigidity or resistance to change produces the period's only significant difficulties.",
  },
  {
    compound: 59,
    reduced: 5,
    name: "The Reckoning Voice",
    isKarmicDebt: false,
    isMasterNumber: false,
    isExtended: true,
    symbolism:
      "Persuasion and conviction joined to reckoning; the voice may win honor while the body, reputation, or private life demands payment for years of motion.",
    vibrationalEssence:
      "The 59/5 extends the 32/5 and 14/5 family but must be read with a stronger reckoning layer. The 5 gives speech, movement, campaigning, travel, adaptability, rhetoric and public persuasion. The 9 adds completion, historical judgment, humanitarian breadth and the closing of an era. Together they reduce through 14, so the karmic debt of disciplined freedom remains active.\n\nHistorical testing suggests that 59/5 often appears when the person’s words, writings, arguments or public persona receive recognition, but the cost of a life lived in motion becomes visible. The person may be honored, quoted, awarded, knighted, elected, published or vindicated, yet the body may show exhaustion, the private world may reveal strain, or the public may ask whether the old method can continue.\n\nThis is why “persuasive and convincing” is too small. 59/5 is persuasion under audit. The question is not only whether the person can convince others; it is whether the life behind the convincing voice can survive the speed, pressure and unfinished debts that the voice has accumulated.",
    karmicDynamics:
      "The karmic lesson of 59/5 is truthful movement. If the person has used words to carry a nation, company, family, audience or cause, the year asks what those words have cost. Freedom must become disciplined. Travel must become purposeful. Persuasion must become honest enough to include the body, the private truth and the approaching completion of a chapter.",
    manifestationPatterns:
      "In a personal year, 59/5 may manifest as award, public recognition, publication, major speech, successful persuasion, legal or political argument, diplomatic movement, travel, or a public comeback. At the same time it can bring stroke-like warnings, health exhaustion, scandal audits, family strain, backlash, or a realization that the old tempo cannot continue. Churchill 1953-style calibration is useful: public honor and literary recognition can coexist with serious hidden health reckoning.\n\nPredictively, 59/5 should trigger both communication strategy and body strategy. The voice can win the room, but the body and truth decide whether the victory can be carried forward.",
  },
  {
    compound: 68,
    reduced: 5,
    name: "The Business Loyalist",
    isKarmicDebt: false,
    isMasterNumber: false,
    isExtended: true,
    symbolism:
      "Same essence as 14/5, good for business; loyal with a great sense of humor; tendency to be insensitive.",
    vibrationalEssence:
      "The 68/5 reduces to 14 (6+8=14), then to 5. World numerology sources describe 68 as 'good for business. It has a tendency to be insensitive, but it is also very loyal. It has a great sense of humor.'",
    manifestationPatterns:
      "The 68/5 produces business opportunities and professional advancement through loyal partnership. The individual's capacity for change and adaptation serves their business interests, allowing them to navigate shifting conditions and evolving professional landscapes.",
  },
  {
    compound: 77,
    reduced: 5,
    name: "The Intelligent Inventor (Power Number)",
    isKarmicDebt: false,
    isMasterNumber: false,
    isExtended: true,
    symbolism:
      "Perhaps the most intelligent and inventive of all numbers; spiritual wisdom; power number.",
    vibrationalEssence:
      "The 77/5 introduces a Power Number into the 5's dynamic cycle. The double 7 intensifies the analytical, spiritual, and inventive qualities of the 7. World numerology sources describe 77 as 'perhaps the most intelligent and inventive of all numbers. It also represents spiritual wisdom.' The 77 reduces to 14 (7+7=14), then to 5, carrying the karmic debt energy of 14/5 beneath the Power Number's intensified force.",
    manifestationPatterns:
      "The 77/5 produces insights and innovations that transcend conventional understanding. The individual's thinking operates at levels of complexity and creativity that produce genuinely original contributions. The period's dynamic energy channels through intellectual and spiritual exploration, producing changes in understanding that transform the individual's perspective.",
  },
  {
    compound: 86,
    reduced: 5,
    name: "The Self-Oriented Indulgence",
    isKarmicDebt: false,
    isMasterNumber: false,
    isExtended: true,
    symbolism:
      "Same essence as 68/5, more self-oriented; somewhat irresponsible and self-indulgent.",
    vibrationalEssence:
      "The 86/5 reduces to 14 (8+6=14), then to 5. World numerology sources note that 86 'is more self-oriented. It is also somewhat irresponsible and self-indulgent.'",
    manifestationPatterns:
      "The 86/5 produces material gains and professional advancement through dynamic effort. The individual's capacity for change and adaptation serves their personal ambitions effectively. However, the self-indulgent tendency may lead to overextension or neglect of relationships and responsibilities.",
  },
  {
    compound: 95,
    reduced: 5,
    name: "The Humanitarian Dreamer",
    isKarmicDebt: false,
    isMasterNumber: false,
    isExtended: true,
    symbolism:
      "Same essence as 59/5, the humanitarian who is impractical, a dreamer; loves travel and change.",
    vibrationalEssence:
      "The 95/5 reduces to 14 (9+5=14), then to 5. World numerology sources describe 95 as 'the humanitarian, but is impractical, a dreamer. It loves travel and change.'",
    manifestationPatterns:
      "The 95/5 produces travel, movement, and new experiences that expand the individual's humanitarian understanding. The period's changes bring encounters with diverse people and cultures, broadening perspective and deepening commitment to collective welfare. The value lies in the expansion of consciousness rather than in material accomplishment.",
  },
  // ── PERSONAL YEAR 6: RESPONSIBILITY ──────────────────────────────────────
  {
    compound: 15,
    reduced: 6,
    name: "The Enchantment",
    isKarmicDebt: true,
    isMasterNumber: false,
    symbolism:
      "Revolution, upheaval, strife, failure, and prevention when associated with 4 or 8; enchantment, eloquence, and magnetic charisma otherwise.",
    vibrationalEssence:
      "The 15/6 carries the third of the four Karmic Debt numbers, introducing the most complex and potentially dangerous energy into the 6's normally harmonious service cycle. The 1's initiative combines with the 5's dynamic change, producing a period where the individual's nurturing, responsible energy is channeled through forces of transformation that can operate constructively or destructively.\n\nCheiro described 15 as 'a number of deep esoteric significance, the alchemy vibration through which all magic is manifested.' The period's energy carries what practitioners have called 'the essence of enchantment' — a magnetic quality that draws people, opportunities, and resources toward the individual with almost supernatural force.",
    karmicDynamics:
      "The 15/6 karmic debt operates through the relationship between personal power and responsibility. Past-life patterns of using magnetic influence for selfish purposes, of enchanting others to serve personal agendas, of practicing manipulation under the guise of care and service — all of these create the period's critical test. The 15 compound's association with 'the lower levels of occultism when it is associated with the single numbers 4 and 8' indicates that the period's energy can be directed toward manipulation and exploitation when the individual's intentions are not aligned with the highest good.",
    manifestationPatterns:
      "When operating constructively, the 15/6 produces extraordinary capacity for obtaining 'money, gifts and favors from others, due to its powerful appeal to the altruistic nature of people.' The individual's communication becomes genuinely enchanting — eloquent, persuasive, and magnetic.\n\nWhen operating destructively, the 15/6 produces manipulation, exploitation, and the use of magnetic power for selfish ends. The period's central challenge is maintaining ethical integrity while wielding the 15's considerable power. The individual who uses their enchanting energy for genuine service discovers the period's extraordinary gifts.",
  },
  {
    compound: 24,
    reduced: 6,
    name: "Magnetic Attraction",
    isKarmicDebt: false,
    isMasterNumber: false,
    symbolism:
      "Assistance and association of those of rank and position; gain through love and the opposite sex; favorable in relation to future events.",
    vibrationalEssence:
      "The 24/6 carries one of the most consistently favorable compound vibrations in the Chaldean system. The 2's receptivity combines with the 4's structural discipline, producing a period where the 6's nurturing, service-oriented energy attracts beneficial connections through a quality of magnetic charm.\n\nCheiro described 24 as promising 'the assistance and association of those of rank and position with one's plans; it also denotes gain through love and the opposite sex.' The period's energy operates through attraction rather than pursuit — the individual's presence, their way of being in relationship, their capacity for care and service, draws supportive people and favorable circumstances toward them.",
    karmicDynamics:
      "The 24/6 often represents the flowering of positive karma related to past-life service and loving care. The individual who generously nurtured others, who provided care without expectation of return, who used their relational gifts to build community — now receives the return on that karmic investment through the period's magnetic attraction of beneficial alliances.",
    manifestationPatterns:
      "The 24/6 produces connections with people of position and influence who provide tangible support for the individual's endeavors. These connections often develop through natural affinity rather than calculated networking; the individual meets the right people through circumstances that feel serendipitous. The period's romantic and relational experiences carry unusual depth and mutual benefit; partnerships formed during this cycle tend to be characterized by genuine affection, practical support, and shared growth.",
  },
  {
    compound: 33,
    reduced: 6,
    name: "The Master Teacher",
    isKarmicDebt: false,
    isMasterNumber: true,
    symbolism:
      "Same essence as 24/6, with the Master Number's intensified spiritual power.",
    vibrationalEssence:
      "The 33/6 is a Master Number, representing the highest octave of 6's nurturing energy. Where the ordinary 6 cares for family and community, the 33/6 serves humanity with the dedicated commitment of the spiritual master. Cheiro treated 33 as having 'the same essential quality as 24' but in a higher octave that brings 'even stronger magnetism' and deeper spiritual significance.\n\nThe 33 is the Master Teacher number, and in this context it produces a period where the individual's nurturing, service-oriented energy achieves its most elevated expression.",
    manifestationPatterns:
      "The 33/6 produces opportunities for significant service and teaching. The individual's capacity for care and nurture finds expression through roles that guide, heal, or educate others. Their presence becomes a source of inspiration and transformation for those who encounter them. The period's partnerships and relationships carry qualities of spiritual fellowship — connections that support mutual growth in service of higher purposes.",
  },
  {
    compound: 42,
    reduced: 6,
    name: "The Magnetism of Duty",
    isKarmicDebt: false,
    isMasterNumber: false,
    symbolism: "Same essence as 24/6, steady and assured; slow and steady.",
    vibrationalEssence:
      "Cheiro's canon assigns 42 the same meaning as 24: 'gain through love and the opposite sex, and the assistance and association of those of rank and position with one's plans.' The 42/6 reduces to 6 (4+2=6), carrying the 24/6's magnetic attraction energy with the 4's structural discipline emphasized. This compound produces a period where nurturing and service are expressed through methodical, systematic effort rather than spontaneous charm.",
    manifestationPatterns:
      "The 42/6 produces solid, enduring relationships built through patient effort. The individual's care for others is demonstrated through daily actions rather than occasional grand displays. Partnerships formed during this period tend to be characterized by mutual reliability and shared commitment to practical responsibilities. The period's service-oriented efforts yield results that accumulate slowly but prove durable over time.",
  },
  {
    compound: 51,
    reduced: 6,
    name: "The Warrior's Advance",
    isKarmicDebt: false,
    isMasterNumber: false,
    symbolism:
      "The nature of the warrior; sudden advancement; favorable for military or naval life and leaders; threatens enemies, danger, and the likelihood of assassination.",
    vibrationalEssence:
      "The 51/6 carries one of the most powerful and paradoxical compound vibrations in the Chaldean system. The 5's dynamic change combines with the 1's initiating force, producing a period where the 6's normally nurturing, harmonious energy is channeled through the fierce, protective, and combative quality of the warrior.\n\nCheiro described 51 as representing 'the nature of the warrior; it promises sudden advancement in whatever one undertakes.' The period's service takes the form of protection, defense, and leadership in challenging circumstances.",
    karmicDynamics:
      "The 51/6 often brings karmic patterns related to past-life military or protective service. The individual who defended their community, who led others through danger, who sacrificed personal safety for collective welfare — now encounters circumstances that activate these established patterns. The period's warrior energy is not aggressive but protective; the individual fights not for conquest but for the preservation of what they value.",
    manifestationPatterns:
      "The 51/6 produces situations that require courage, decisiveness, and protective leadership. The individual may find themselves in positions where others depend on their strength and judgment; they may encounter circumstances that demand confrontation with opposition or danger. The period's advancement comes through demonstrated bravery and effective leadership in challenging conditions.\n\nThe compound number's warning is explicit: 'it threatens enemies, danger, and the likelihood of assassination.' The warrior's path attracts those who oppose what the individual defends. Self-care and strategic awareness are essential.",
  },
  {
    compound: 60,
    reduced: 6,
    name: "Love Tested to the Limit",
    isKarmicDebt: false,
    isMasterNumber: false,
    isExtended: true,
    symbolism:
      "Love, care, duty and responsibility tested by boundaries; a person may be loved deeply and still released, rejected, retired or asked to serve differently.",
    vibrationalEssence:
      "The 60/6 should not be reduced to “loving, caring and responsible.” That is true, but incomplete. The 6 is affection, duty, home, nation, family, service, beauty and moral responsibility. The 0 magnifies the field and opens a void around it: what does love mean when it is no longer enough to keep the old arrangement alive?\n\nHistorical calibration shows that 60/6 can produce the paradox of being loved but not retained, needed but not obeyed, honored but retired, thanked but replaced. It is the year when gratitude is separated from obligation. A family may love a person and still set a boundary. A nation may adore a leader and still choose another future. A partner may care and still leave. A public may celebrate the service and still refuse to continue the contract.\n\nTherefore 60/6 is love tested to the limit. It asks whether service has become subservience, whether responsibility has become entitlement, and whether care can evolve into a new form after the old role ends.",
    karmicDynamics:
      "The karmic lesson of 60/6 is non-possessive service. The person must learn that genuine love does not always grant control. If they have served well, the service remains meaningful even if the position changes. If they have confused being needed with being irreplaceable, the year humbles that assumption.",
    manifestationPatterns:
      "In a personal year, 60/6 may manifest as family duty, caretaking, marriage decisions, national or institutional service, public gratitude, retirement, electoral judgment, health-related dependency, home responsibility, or a role change inside a community that still loves the person. Churchill 1945 is the model: love and gratitude for wartime service were real, yet voters rejected him for the next chapter.\n\nPredictively, 60/6 asks the person to serve with boundaries and accept that affection is not the same as permanence. The highest form is graceful transition into a wiser mode of care. The lowest form is clinging to a role because one believes past service should purchase future obedience.",
  },
  {
    compound: 69,
    reduced: 6,
    name: "Mars Crowned",
    isKarmicDebt: false,
    isMasterNumber: false,
    isExtended: true,
    symbolism:
      "Mars crowned — great fortune, reputation, honors by merit; slow but steady development.",
    vibrationalEssence:
      "The 69/6 carries the extraordinary Sepharial description of 'Mars crowned' — a combination of Venus (6) and Mars (9) that produces a period of steady, persistent development building toward significant achievement. The 69 compound has been described as 'slow but very steady development… not dissimilar to a large rocket taking off!'",
    manifestationPatterns:
      "The 69/6 produces gradual but reliable progress toward long-term objectives. The individual's service and care create networks of loyalty and appreciation that support sustained advancement. The period's entrepreneurial energy operates through patient cultivation rather than rapid expansion.",
  },
  {
    compound: 78,
    reduced: 6,
    name: "The Struggle Between Spirit and Matter",
    isKarmicDebt: false,
    isMasterNumber: false,
    isExtended: true,
    symbolism:
      "Struggle between the spiritual and the material; making and losing fortunes.",
    vibrationalEssence:
      "The 78/6 reduces to 15 (7+8=15), then to 6. World numerology sources describe 78 as bringing 'struggle between the spiritual and the material. People with this number prominent in their chart make and lose fortunes.'",
    manifestationPatterns:
      "The 78/6 produces fluctuating material circumstances that test the individual's commitment to service. Periods of financial abundance may be followed by periods of constraint. The period's lesson is finding ways to serve spiritual purposes while maintaining practical stability.",
  },
  {
    compound: 87,
    reduced: 6,
    name: "The Generous Compassion",
    isKarmicDebt: false,
    isMasterNumber: false,
    isExtended: true,
    symbolism:
      "Same essence as 78/6, more practical and better with money, but the struggle remains.",
    vibrationalEssence:
      "The 87/6 reduces to 15 (8+7=15), then to 6. World numerology sources note that 87 'is somewhat more practical and handles money better, but the struggle between the spiritual and the material is just as intense.'",
    manifestationPatterns:
      "The 87/6 produces improved material circumstances through practical effort, but with continued awareness of the gap between financial success and spiritual fulfillment. The period's lesson is learning that material and spiritual service are not opposed but can complement each other when approached with wisdom.",
  },
  {
    compound: 96,
    reduced: 6,
    name: "The Self-Sacrificing Community Builder",
    isKarmicDebt: false,
    isMasterNumber: false,
    isExtended: true,
    symbolism:
      "Same essence as 69/6, with self-sacrificing nature focused on family, friends, and community.",
    vibrationalEssence:
      "The 96/6 reduces to 15 (9+6=15), then to 6. World numerology sources describe 96 as having 'self-sacrificing and loving nature… more focused on family, friends, and the community.'",
    manifestationPatterns:
      "The 96/6 produces extensive contribution to family, friends, and community. The individual's nurturing energy extends widely, creating networks of care and support that benefit many people. The period's self-sacrificing quality requires attention to balance.",
  },
  // ── PERSONAL YEAR 7: INTROSPECTION ──────────────────────────────────────
  {
    compound: 16,
    reduced: 7,
    name: "The Shattered Citadel",
    isKarmicDebt: true,
    isMasterNumber: false,
    symbolism:
      "A tower struck by lightning, from which a man with a crown on his head is falling — the Shattered Citadel.",
    vibrationalEssence:
      "The 16/7 carries the fourth and most intense of the Karmic Debt numbers, introducing the most dramatic transformative force into the 7's normally contemplative introspection cycle. The 1's initiative combines with the 6's nurturing responsibility, producing a period where the individual's analytical, spiritual energy encounters upheaval that destroys established structures of understanding and forces complete rebuilding from the foundations.\n\nCheiro described 16 as giving 'warning of some strange fatality awaiting one, also danger of accidents and defeat of one's plans.' The Tower card symbolism captures the period's essential dynamic: lightning from heaven strikes the citadel that the individual has built, destroying what was constructed on false foundations.",
    karmicDynamics:
      "The 16/7 brings the karmic debt of ego and arrogance from past lives. The individual who misused spiritual power, who claimed divine authority for personal aggrandizement, who built structures of understanding that served their pride rather than genuine wisdom — now encounters the lightning that destroys false towers. The period's catastrophes are not random misfortunes but precise corrections: each destruction removes something that was built on ego, each fall humbles something that had become prideful.",
    manifestationPatterns:
      "The 16/7 produces sudden and unexpected disruptions in the areas where the individual has built their sense of security and understanding. Belief systems may collapse in the face of new evidence; spiritual practices may prove ineffective or even harmful; intellectual frameworks that seemed solid may reveal fundamental flaws. Accidents, losses, and defeats of plans characterize this cycle — not as punishments but as necessary demolitions of structures that were preventing genuine growth.\n\nThe period's essential teaching is that true spiritual understanding cannot be built on ego. The individual who responds to the period's upheavals with surrender rather than resistance, who allows false structures to collapse rather than attempting to rebuild them, discovers that the destruction creates space for genuine spiritual growth.",
  },
  {
    compound: 25,
    reduced: 7,
    name: "Strength Through Experience",
    isKarmicDebt: false,
    isMasterNumber: false,
    symbolism:
      "Strength gained through experience; benefits obtained through observation of people and things; not deemed exactly 'lucky' as its success is given through strife and trials in an earlier life.",
    vibrationalEssence:
      "The 25/7 carries a compound vibration that transforms the 7's introspective energy through the lens of hard-won wisdom. The 2's receptivity combines with the 5's dynamic change, producing a period where the individual's analytical and spiritual development proceeds through direct experience rather than abstract study.\n\nCheiro described 25 as denoting 'strength gained through experience, and benefits obtained through observation of people and things.' The key phrase is 'in an earlier life' — the period's wisdom comes not from current experiences alone but from the activation of knowledge accumulated through past-life trials.",
    manifestationPatterns:
      "The 25/7 produces situations that test and confirm the individual's hard-won wisdom. Challenges arise that require the application of understanding gained through past difficulties; observations of people and circumstances yield insights that prove practically valuable.\n\nThe compound number's assessment as 'not deemed exactly lucky' is important. The 25/7 does not produce easy success or effortless achievement. Its benefits come through effort, through the active application of experiential wisdom. The period's rewards are substantial but earned.",
  },
  {
    compound: 34,
    reduced: 7,
    name: "The Striver's Balance",
    isKarmicDebt: false,
    isMasterNumber: false,
    symbolism:
      "Same essence as 25/7, well-regarded and generous with a good work-life balance.",
    vibrationalEssence:
      "Cheiro's canon assigns 34 the same meaning as 25: 'strength gained through experience, and benefits obtained through observation of people and things... success is given through strife and trials in the earlier life.' The 34 carries that earned strength on a higher octave. The 34/7 reduces to 7 (3+4=7), carrying the Wheel of Fortune's karmic momentum with the 3's creative expression and the 4's structural discipline. This compound produces a period where introspective development is balanced with creative productivity and systematic effort.\n\nThe Chaldean source describes 34 as 'well-regarded and generous, with a good work-life balance.'",
    manifestationPatterns:
      "The 34/7 produces harmonious integration of inner and outer life. The individual's analytical and spiritual pursuits proceed alongside creative and professional endeavors, with each dimension supporting the others. The period's introspection yields insights that enhance practical performance; the period's practical achievements create resources that support spiritual exploration.",
  },
  {
    compound: 43,
    reduced: 7,
    name: "The Point of Reaper",
    isKarmicDebt: false,
    isMasterNumber: false,
    symbolism:
      "Revolution, upheaval, strife, failure, and prevention; the Point of Reaper — destruction and annihilation.",
    vibrationalEssence:
      "The 43/7 carries one of the most severe compound vibrations in the Chaldean system. Sepharial described 43 as 'the Point of Reaper' — 'Destruction; abortive enterprises; things brought to nothing; annihilation.' The 4's structure combines with the 3's creativity, producing a period where analytical and spiritual efforts encounter forces of dissolution that overturn established patterns.\n\nCheiro's original description emphasized 'revolution, upheaval, strife, failure, and prevention.' Within this period, introspective investigation reveals the fundamental instability of structures that appeared solid, where spiritual inquiry uncovers the emptiness of practices that seemed meaningful.",
    manifestationPatterns:
      "The 43/7 produces experiences of fundamental disruption. The individual's plans and projects may fail completely; their spiritual practices may prove ineffective; their analytical frameworks may reveal fatal inconsistencies. The period's destructiveness is comprehensive, affecting multiple dimensions of life simultaneously.\n\nYet the Point of Reaper is not merely destructive; it is also cleansing. The 43/7 removes what is false, hollow, or unsustainable, creating the emptiness from which genuine understanding can emerge. The individual who surrenders to the period's dissolution rather than fighting it discovers that the destruction was necessary preparation for authentic reconstruction.",
  },
  {
    compound: 52,
    reduced: 7,
    name: "The Same Revolutionary Force",
    isKarmicDebt: false,
    isMasterNumber: false,
    symbolism:
      "Same essence as 43/7, caring and charitable people who want to bring emotional peace to others.",
    vibrationalEssence:
      "The 52/7 reduces to 7 (5+2=7), carrying the same fundamental energy as 43/7 but with the digits reversed. The 5's dynamic change combines with the 2's receptive sensitivity, producing a period where the 43/7's revolutionary force operates through emotional and relational channels.\n\nThe Chaldean source describes 52 as having the same meaning as 43, but with the additional quality that those under its influence are 'caring and charitable people who want to bring emotional peace to others.'",
    manifestationPatterns:
      "The 52/7 produces deep emotional insights that can be applied to healing others. The individual's own experiences of upheaval and transformation become the foundation for compassionate understanding of others' struggles. The period's destructiveness, properly processed, becomes the basis for wisdom that serves collective emotional healing.",
  },
  {
    compound: 61,
    reduced: 7,
    name: "Difficulties in Love",
    isKarmicDebt: false,
    isMasterNumber: false,
    isExtended: true,
    symbolism:
      "Difficulties in love relationships; demanding and secretive; excellent for researchers.",
    vibrationalEssence:
      "The 61/7 reduces to 7 (6+1=7), carrying the 6's nurturing energy and the 1's initiating force through the 7's introspective filter. World numerology sources describe 61 as 'a number that represents difficulties in love relationships. However, the need for family and friends is strong. It is demanding and secretive; an excellent number for researchers, law officers, and people in the Secret Service.'",
    manifestationPatterns:
      "The 61/7 produces relationship challenges that yield to analytical investigation. The individual's introspective energy is directed toward understanding the dynamics of intimate connection — the patterns that create attraction and repulsion, the wounds that generate conflict, the needs that drive behavior. The period's difficulties become the raw material for expertise in human relationship.",
  },
  {
    compound: 70,
    reduced: 7,
    name: "The Hermit",
    isKarmicDebt: false,
    isMasterNumber: false,
    isExtended: true,
    symbolism:
      "The hermit's number; a loner and seeker of truth; high intelligence and originality; always eccentric.",
    vibrationalEssence:
      "The 70/7 reduces to 7 (7+0=7), carrying the 7's analytical and spiritual energy amplified by the 0's mystical potential. World numerology sources describe 70 as 'the hermit's number. It is a loner and a seeker of truth who can get caught up in the act of seeking knowledge to such an extent that it loses touch with the material world.'",
    manifestationPatterns:
      "The 70/7 produces powerful experiences of solitary study and spiritual practice. The individual's analytical capacities operate at peak efficiency when directed toward self-directed inquiry; their spiritual sensitivity is heightened by the period's withdrawal from external distraction. However, the warning about losing 'touch with the material world' is significant; the period's challenge is maintaining sufficient practical engagement while pursuing transcendent understanding.",
  },
  {
    compound: 79,
    reduced: 7,
    name: "The Political and Spiritual Leader",
    isKarmicDebt: false,
    isMasterNumber: false,
    isExtended: true,
    symbolism:
      "Political and spiritual leaders; concern for mankind; can be ruthless and self-righteous.",
    vibrationalEssence:
      "The 79/7 reduces to 16 (7+9=16), then to 7, carrying the karmic debt energy of 16/7 with the 7's spiritual depth and the 9's humanitarian breadth. World numerology sources describe 79 as a number where 'political and spiritual leaders often have this number. It brings concern for mankind, but it can also be ruthless and self-righteous.'",
    manifestationPatterns:
      "The 79/7 produces opportunities for leadership based on spiritual insight and analytical wisdom. The individual's introspective work yields understanding that others recognize as valuable, drawing them into positions where they can guide collective action. The period's danger lies in the ego's appropriation of spiritual authority; the individual must maintain humility and genuine concern for others' welfare.",
  },
  {
    compound: 88,
    reduced: 7,
    name: "The Contradictory Business Mind",
    isKarmicDebt: false,
    isMasterNumber: false,
    isExtended: true,
    symbolism:
      "Full of contradictions; excellent for business but not for relationships; insensitive.",
    vibrationalEssence:
      "The 88/7 introduces a Power Number into the 7's introspective cycle. World numerology sources describe 88 as 'full of contradictions. It is excellent for business, but it is not good for relationships. It is insensitive.'",
    manifestationPatterns:
      "The 88/7 produces significant business and professional achievement through analytical insight. The individual's capacity for investigation, research, and strategic thinking yields material results that exceed expectations. However, the period's focus on business success may create distance in personal relationships.",
  },
  {
    compound: 97,
    reduced: 7,
    name: "The Active Thinker",
    isKarmicDebt: false,
    isMasterNumber: false,
    isExtended: true,
    symbolism:
      "Proficiency in scriptures and fine arts; eminence in spiritual career; success and prosperity.",
    vibrationalEssence:
      "The 97/7 reduces to 16 (9+7=16), then to 7, carrying the karmic debt energy of 16/7 with the 9's humanitarian breadth and the 7's spiritual depth. The Chaldean source describes 97 as giving 'proficiency in the scriptures and fine arts. It also gives eminence in spiritual career. They will be successful in all their efforts and will be prosperous due to their astounding achievements in chosen fields.'",
    manifestationPatterns:
      "The 97/7 produces mastery in artistic, scholarly, or spiritual disciplines. The individual's analytical and introspective efforts yield work of exceptional depth and quality, gaining recognition from those who appreciate genuine excellence. The period's achievements tend to endure, creating foundations for lasting reputation and continued contribution.",
  },
  // ── PERSONAL YEAR 8: POWER ───────────────────────────────────────────────
  {
    compound: 17,
    reduced: 8,
    name: "The Star of the Magi",
    isKarmicDebt: false,
    isMasterNumber: false,
    symbolism:
      "The 8-pointed Star of Venus; the Star of the Magi; peace, love, immortality; a number of immortality indicating that the person's name lives after them.",
    vibrationalEssence:
      "The 17/8 carries the most spiritually elevated compound vibration in the entire 8-series. Where other 8 compounds emphasize material power, executive capacity, and financial achievement, 17/8 introduces the dimension of spiritual transcendence — a period where the 8's material authority becomes the vehicle for expressing higher love, deeper peace, and lasting significance.\n\nCheiro described 17 as 'a highly spiritual number' expressed in symbolism by the ancient Chaldeans as the 8-pointed Star of Venus. The 'Number of immortality' designation indicates that the period's accomplishments have lasting significance — they contribute to the individual's legacy in ways that transcend their mortal lifespan.",
    karmicDynamics:
      "The 17/8 often represents the flowering of exceptionally positive karma related to past-life spiritual achievement. The individual who dedicated previous incarnations to service, who used their power wisely and compassionately, who rose 'superior in spirit to the trials and difficulties' of human existence — now receives the culmination of that karmic development through a period where material success and spiritual fulfillment converge.",
    manifestationPatterns:
      "The 17/8 produces material achievement that carries spiritual significance. The individual's professional success, financial gains, and positions of authority are not merely secular accomplishments but expressions of higher purpose. Their leadership inspires others; their business practices embody ethical principles; their material wealth becomes a resource for serving collective welfare.\n\nThe compound number's single warning is important: 17 reduces to 8, and the 8's association with 4 creates potential vulnerability when the number is 'associated with the single number of fours and eights.' The period's spiritual power must be grounded in practical wisdom.",
  },
  {
    compound: 26,
    reduced: 8,
    name: "The Gravest Warnings",
    isKarmicDebt: false,
    isMasterNumber: false,
    symbolism:
      "Full of the gravest warnings for the future; disasters brought about by association with others; ruin by bad speculations, partnerships, unions, and bad advice.",
    vibrationalEssence:
      "The 26/8 carries one of the most severely cautionary compound vibrations in the entire Chaldean system. The 2's receptivity combines with the 6's nurturing responsibility, producing a period where the 8's material power and executive capacity are undermined by the individual's vulnerability to others' influence.\n\nCheiro's description is explicit and severe: 'This number is full of the gravest warnings for the future. It foreshadows disasters brought about by association with others; ruin by bad speculations, by partnerships, unions and bad advice.'",
    karmicDynamics:
      "The 26/8 brings karmic lessons around discernment in partnership. Past-life patterns of forming alliances with untrustworthy partners, of allowing others' agendas to override one's own judgment, of seeking material advancement through collaborative ventures that were poorly conceived or dishonestly presented — all of these create the energetic template for the period's experiences.",
    manifestationPatterns:
      "The 26/8 produces material opportunities that appear promising but prove dangerous. Business partnerships that seem advantageous dissolve into conflict; financial speculations that appear sound result in losses; unions and collaborations that promise mutual benefit become sources of ruin.\n\nThe key to navigating the 26/8 lies in extreme caution about partnerships. Every collaborative proposal requires thorough investigation; every potential partner's background demands careful verification; every piece of advice must be evaluated against independent judgment. The period's successes come through self-reliance; its disasters come through misplaced trust.",
  },
  {
    compound: 35,
    reduced: 8,
    name: "The Warning of Dangerous Alliances",
    isKarmicDebt: false,
    isMasterNumber: false,
    symbolism:
      "Same essence as 26/8; strong inner needs to fill and will move mountains to do it.",
    vibrationalEssence:
      "The 35/8 reduces to 8 (3+5=8), carrying the same fundamental warning as 26/8 but with the 3's creative expression and the 5's dynamic change modifying the pattern. The Chaldean source explicitly states that 35 'has the same meaning as the number 26' — the dangerous alliance warning applies with equal force.",
    manifestationPatterns:
      "The 35/8 produces the same partnership dangers as 26/8, but with additional emphasis on creative and professional alliances. The individual's drive for material success may lead them to accept partnerships in creative ventures or dynamic business opportunities that appear promising but prove problematic. The period's lesson is identical: extreme caution in partnership, thorough verification of potential collaborators, and willingness to pursue material goals independently when trustworthy allies are not available.",
  },
  {
    compound: 44,
    reduced: 8,
    name: "The Master Builder's Trial",
    isKarmicDebt: false,
    isMasterNumber: false,
    symbolism:
      "Same essence as 26/8; master number that knows the ins and outs of business but does not know when to stop.",
    vibrationalEssence:
      "The 44/8 introduces a Power Number into the 8's material cycle. The double 4 intensifies the structural discipline, methodical effort, and systematic organization of the 4. World numerology sources describe 44 as a 'master number, knows the ins and outs of business but does not know when to stop.' The 26/8's dangerous alliance warning remains operative beneath the Power Number's intensified force.",
    manifestationPatterns:
      "The 44/8 produces deep understanding of business dynamics and exceptional capacity for material achievement. The individual's systematic approach to executive challenges yields insights and strategies that elude less disciplined competitors. However, the warning about not knowing 'when to stop' is significant; the period's intensity of focus may lead to overwork, obsessive pursuit of material goals, or neglect of relationships and health in service of professional ambition.",
  },
  {
    compound: 53,
    reduced: 8,
    name: "The Verbal Business Creativity",
    isKarmicDebt: false,
    isMasterNumber: false,
    isExtended: true,
    symbolism:
      "Same essence as 35/8 and 26/8, more verbal, creative, and business-oriented.",
    vibrationalEssence:
      "The 53/8 reduces to 8 (5+3=8), carrying the same fundamental warning as 26/8 and 35/8 but with the 5's dynamic communication and the 3's creative expression modifying the pattern. The Chaldean source describes 53 as 'similar to 35, but more verbal, creative, and business-oriented.'",
    manifestationPatterns:
      "The 53/8 produces partnership dangers in business and creative ventures that involve communication, media, and verbal exchange. The individual's material ambitions may lead them to form alliances in publishing, broadcasting, marketing, or other communication-related fields. The period's lesson remains consistent with the 26/8 warning: extreme caution in partnership and willingness to pursue goals independently.",
  },
  {
    compound: 62,
    reduced: 8,
    name: "The Excellent Caretaker",
    isKarmicDebt: false,
    isMasterNumber: false,
    isExtended: true,
    symbolism:
      "Same essence as 26/8, less sensitive; excellent caretaker; good for medical careers.",
    vibrationalEssence:
      "The 62/8 reduces to 8 (6+2=8), carrying the same fundamental warning as 26/8 but with the 6's nurturing care and the 2's receptive sensitivity. World numerology sources describe 62 as 'see 26. This number is less sensitive. It is an excellent caretaker. A good number for people with careers in the medical field.'",
    manifestationPatterns:
      "The 62/8 produces material achievement through caring service. The individual's executive capacity finds expression in healthcare, social services, or other fields where material management serves nurturing purposes. The 26/8's partnership warning remains operative; the individual must exercise caution about alliances even in service-oriented fields.",
  },
  {
    compound: 71,
    reduced: 8,
    name: "The Reaper",
    isKarmicDebt: false,
    isMasterNumber: false,
    isExtended: true,
    symbolism:
      "The Reaper — dangers to the body and the interests; executive powers.",
    vibrationalEssence:
      "The 71/8 carries Sepharial's dramatic description of 'The Reaper' — 'Dangers to the body and the interests; executive powers.' The 7's spiritual depth combines with the 1's initiating force, producing a period where the 8's material power is accompanied by significant risks to physical well-being and material security.",
    manifestationPatterns:
      "The 71/8 produces material achievement through powerful executive action, but with accompanying risks to health and physical well-being. The individual's drive for success may lead them to overwork, to neglect self-care, or to pursue material goals with an intensity that damages their body. The period's lesson is learning to wield executive power sustainably.",
  },
  {
    compound: 80,
    reduced: 8,
    name: "The Business Sense Without Independence",
    isKarmicDebt: false,
    isMasterNumber: false,
    isExtended: true,
    symbolism:
      "Good for business; found among top management and military; lacks independence.",
    vibrationalEssence:
      "The 80/8 reduces to 8 (8+0=8), carrying the 8's material power amplified by the 0's mystical potential. World numerology sources describe 80 as 'a good number for business. However, it is found more often among people in top management and the military, than among entrepreneurs, due to a lack of independence.'",
    manifestationPatterns:
      "The 80/8 produces advancement within established organizations. The individual's executive capacity is recognized and rewarded by existing power structures; they rise to positions of authority within corporations, institutions, or military hierarchies. The period's material success is substantial but operates within frameworks that others have created.",
  },
  {
    compound: 89,
    reduced: 8,
    name: "The Aristocratic Traveler",
    isKarmicDebt: false,
    isMasterNumber: false,
    isExtended: true,
    symbolism: "The aristocrat; much travel; difficulty being alone.",
    vibrationalEssence:
      "The 89/8 reduces to 17 (8+9=17), then to 8, carrying the spiritual power of 17/8 with the 8's material authority and the 9's humanitarian breadth. World numerology sources describe 89 as 'the aristocrat and the man or the woman of the world. It brings much travel. This number can make it difficult for a person to be alone, even for a short period of time.'",
    manifestationPatterns:
      "The 89/8 produces professional success that involves international travel, cross-cultural engagement, and connection with diverse populations. The individual's executive capacity finds expression in global contexts; their material achievements have international dimensions. The period's challenge is finding solitude and inner reflection amid constant movement and social engagement.",
  },
  {
    compound: 98,
    reduced: 8,
    name: "The Indifferent Idealist",
    isKarmicDebt: false,
    isMasterNumber: false,
    isExtended: true,
    symbolism:
      "Same essence as 89/8; idealist who comes across as indifferent; hard time showing emotions.",
    vibrationalEssence:
      "The 98/8 reduces to 17 (9+8=17), then to 8, carrying the same fundamental energy as 89/8 but with the digits reversed. The 9's humanitarian idealism takes precedence over the 8's material authority. World numerology sources describe 98 as 'see 89. It is an idealist, but comes across as indifferent. It has a hard time showing emotions.'",
    manifestationPatterns:
      "The 98/8 produces material success that serves humanitarian purposes. The individual's executive capacity is directed toward social reform, collective welfare, or broad human advancement. However, the idealistic focus may create emotional distance in personal relationships; the period's challenge is maintaining human connection while pursuing large-scale material goals.",
  },
  // ── PERSONAL YEAR 9: COMPLETION ──────────────────────────────────────────
  {
    compound: 18,
    reduced: 9,
    name: "Materialism Striving to Destroy Spirit",
    isKarmicDebt: true,
    isMasterNumber: false,
    symbolism:
      "A rayed moon from which drops of blood are falling; a wolf and a hungry dog catching the drops; a crab hastening to join them; materialism striving to destroy the spiritual side of the nature.",
    vibrationalEssence:
      "The 18/9 carries the most disturbing and difficult symbolism of all Chaldean compound numbers. The 1's initiative combines with the 8's material power, producing a period where the 9's normally transcendent, compassionate completion energy is threatened by forces of materialism that seek to destroy spiritual understanding.\n\nCheiro described 18 as having 'the most difficult symbolism to translate.' The image of the bleeding moon, the predatory animals, and the scavenging crab paints a picture of spiritual vitality under attack by materialistic forces. The individual's capacity for release, compassion, and transcendence is tested by circumstances that demand material focus, by people who exploit their generosity.",
    karmicDynamics:
      "The 18/9 brings the karmic debt of misused power and material exploitation from past lives. The individual who used their authority to oppress others, who pursued wealth without regard for spiritual consequences, who allowed material ambition to destroy their capacity for compassion — now encounters circumstances that force confrontation with the consequences of spiritual neglect.",
    manifestationPatterns:
      "The 18/9 produces situations where material and spiritual values come into sharp conflict. The individual may face decisions that appear to require choosing between financial survival and ethical integrity; they may encounter people who use their compassion against them; they may find that their generosity is exploited by those who have no genuine need.\n\nThe compound number's specific warnings are significant: 'bitter quarrels, even family ones, also with war, social upheavals, revolutions; and in some cases it indicates making money or achieving position through wars or by wars.' 'Treachery, deception by others, also danger from the elements such as storms, danger from water, fires and explosions' adds the dimension of physical danger.",
  },
  {
    compound: 27,
    reduced: 9,
    name: "The Scepter",
    isKarmicDebt: false,
    isMasterNumber: false,
    symbolism:
      "The Scepter — a promise of authority, power, and command; reward from the productive intellect.",
    vibrationalEssence:
      "The 27/9 carries the most favorable compound vibration in the entire 9-series. Where 18/9 brings materialistic attack on spiritual values, 27/9 brings the authoritative command of productive wisdom — the scepter that represents legitimate power exercised through creative intelligence.\n\nCheiro described 27 as 'a good number and is symbolized as the Sceptre. It is a promise of authority, power and command. It indicates that reward will come from the productive intellect; that the creative faculties have sown good seeds that will reap a harvest.' The Scepter symbolism connects this compound number to the divine right of kings — the authority that comes not from force or inheritance but from demonstrated wisdom.",
    karmicDynamics:
      "The 27/9 often represents the culmination of positive karma accumulated through cycles of creative service. The individual who used their intellectual and creative gifts productively, who sowed seeds of wisdom and compassion, who built structures that served collective welfare — now reaps the harvest of that karmic cultivation through positions of influence and authority.",
    manifestationPatterns:
      "The 27/9 produces recognition and reward for intellectual and creative achievement. The individual's ideas gain authority; their creative work commands respect; their leadership is sought after in projects requiring both vision and practical competence.\n\nThe command that 27/9 promises is not domination but constructive authority. The individual exercises power for the benefit of those they lead; their authority serves the collective good rather than personal aggrandizement. The period's completion is not merely an ending but a culmination — a rising to positions where the individual's wisdom and creativity can have their fullest beneficial impact.",
  },
  {
    compound: 36,
    reduced: 9,
    name: "The Creatively Influential",
    isKarmicDebt: false,
    isMasterNumber: false,
    symbolism:
      "Same essence as 27/9, creatively influential; puts effort into success; finds the easy way to rise.",
    vibrationalEssence:
      "The 36/9 reduces to 9 (3+6=9), carrying the 27/9's scepter energy with the 3's creative expression and the 6's nurturing responsibility. The Chaldean source describes 36 as 'creatively influential, puts a lot of effort into being a success, niche is finding the easy way to rise to the top.'",
    manifestationPatterns:
      "The 36/9 produces creative achievement that gains authoritative recognition. The individual's artistic, communicative, or expressive efforts are acknowledged by those in positions to grant influence and opportunity. The period's completion theme operates through the fruition of creative projects that have been developing through previous cycles.",
  },
  {
    compound: 45,
    reduced: 9,
    name: "The Scepter's Harvest",
    isKarmicDebt: false,
    isMasterNumber: false,
    symbolism: "Same essence as 27/9, ambition and success in business.",
    vibrationalEssence:
      "Cheiro's canon assigns 45 the same meaning as 27 (the Sceptre): 'a promise of authority, power, and command... reward will come from the productive intellect.' Authority here is earned through craft, not claimed by ambition alone. The 45/9 reduces to 9 (4+5=9), carrying the 27/9's scepter energy with the 4's structural discipline and the 5's dynamic change. This compound produces a period where completion and authority are achieved through systematic business achievement and adaptive professional development.",
    manifestationPatterns:
      "The 45/9 produces business and professional success that culminates in positions of authority. The individual's methodical approach to career development, combined with their adaptability to changing conditions, yields advancement to leadership roles. The period's completion theme operates through the achievement of professional goals that have been pursued through disciplined effort.",
  },
  {
    compound: 54,
    reduced: 9,
    name: "The Less Organized Ambition",
    isKarmicDebt: false,
    isMasterNumber: false,
    isExtended: true,
    symbolism:
      "Same essence as 45/9, less organized and disciplined; wants others disadvantaged.",
    vibrationalEssence:
      "The 54/9 reduces to 9 (5+4=9), carrying the same fundamental energy as 45/9 but with the digits reversed. The Chaldean source describes 54 as 'like 45, but less organized and disciplined, wants others to be disadvantaged so they can cling onto their position.'",
    manifestationPatterns:
      "The 54/9 produces professional advancement through dynamic effort, but with potential costs to relationships and ethical standing. The individual's ambition may lead them to prioritize personal success over collective welfare. The period's lesson is learning that true authority serves all rather than elevating some at others' expense.",
  },
  {
    compound: 63,
    reduced: 9,
    name: "The Less Outgoing Creativity",
    isKarmicDebt: false,
    isMasterNumber: false,
    isExtended: true,
    symbolism:
      "Same essence as 36/9, less outgoing but still creatively influential.",
    vibrationalEssence:
      "The 63/9 reduces to 9 (6+3=9). World numerology sources describe 63 as 'see 36. It is less outgoing.' The individual's creative contributions are expressed through private, behind-the-scenes efforts that gain recognition through their results rather than their visibility.",
    manifestationPatterns:
      "The 63/9 produces creative achievement through supportive, nurturing work. The individual's contributions may not be publicly visible, but they are essential to the success of collective endeavors. The period's completion theme operates through the quiet fulfillment of responsibilities that have been sustained through patient effort.",
  },
  {
    compound: 72,
    reduced: 9,
    name: "The Excellent Conversationalist",
    isKarmicDebt: false,
    isMasterNumber: false,
    isExtended: true,
    symbolism:
      "Same essence as 27/9, excellent conversationalist and voracious reader.",
    vibrationalEssence:
      "The 72/9 reduces to 9 (7+2=9). World numerology sources describe 72 as tending 'to be an excellent conversationalist and it is usually a voracious reader.'",
    manifestationPatterns:
      "The 72/9 produces authority through intellectual engagement. The individual's reading, study, and analysis yield understanding that they share through conversation, teaching, or writing. The period's completion theme operates through the synthesis of accumulated knowledge into wisdom that can be communicated to others.",
  },
  {
    compound: 81,
    reduced: 9,
    name: "The Money-Oriented Materialism",
    isKarmicDebt: false,
    isMasterNumber: false,
    isExtended: true,
    symbolism: "Same essence as 18/9, more money-oriented, sometimes violent.",
    vibrationalEssence:
      "The 81/9 reduces to 9 (8+1=9). World numerology sources describe 81 as 'see 18. It is more money-oriented. It often lacks spiritual understanding. Sometimes, this number brings violence.'",
    manifestationPatterns:
      "The 81/9 produces strong material drives that conflict with the 9's transcendent purpose. The individual may pursue financial goals with an intensity that neglects spiritual development, compassionate service, or relational connection. The violence warning suggests that the period's material ambition may manifest aggressively, creating conflict with others who stand in the way of the individual's financial objectives.",
  },
  {
    compound: 90,
    reduced: 9,
    name: "The Self-Sacrificing Humility",
    isKarmicDebt: false,
    isMasterNumber: false,
    isExtended: true,
    symbolism:
      "Self-sacrificing and humble; often brings religious fervor of a positive nature.",
    vibrationalEssence:
      "The 90/9 reduces to 9 (9+0=9), carrying the 9's transcendent completion energy amplified by the 0's mystical potential. World numerology sources describe 90 as 'self-sacrificing and humble. This number often brings religious fervor, but almost always of a positive and inspiring nature.'",
    manifestationPatterns:
      "The 90/9 produces experiences of deep spiritual connection and selfless service. The individual's completion of the cycle takes the form of religious or spiritual dedication, humble contribution to collective welfare, and willing sacrifice of personal ambition for higher purposes. The period's religious fervor is constructive rather than fanatical, inspiring rather than coercive.",
  },
  {
    compound: 99,
    reduced: 9,
    name: "The Artistic Genius",
    isKarmicDebt: false,
    isMasterNumber: false,
    isExtended: true,
    symbolism:
      "Artistic genius; often misunderstood; victim of gossip; jealousy and possessiveness in relationships.",
    vibrationalEssence:
      "The 99/9 introduces the final Power Number into the completion cycle. The double 9 intensifies the transcendence, compassion, and humanitarian breadth of the 9 to its maximum expression. World numerology sources describe 99 as representing 'artistic genius. A person with this number is often misunderstood, and is frequently the victim of gossip. It can bring jealousy and possessiveness to relationships.'",
    manifestationPatterns:
      "The 99/9 produces creative and spiritual work of exceptional depth and originality. The individual's completion of the cycle yields contributions that are genuinely visionary — work that transcends conventional understanding and opens new possibilities for human expression. However, the genius may be misunderstood; the individual's contributions may not receive the recognition they deserve during their lifetime.",
  },
];
// ─── Lookup Maps ────────────────────────────────────────────────────────────
export const COMPOUNDS: Record<number, ChaldeanPYNCompound> =
  Object.fromEntries(COMPOUND_LIST.map((c) => [c.compound, c]));
// ─── Personal Year Single-Digit Meanings ────────────────────────────────────
export const PERSONAL_YEAR_MEANINGS: Record<number, string> = {
  1: `PERSONAL YEAR 1 — AN ACTIVE YEAR OF ADJUSTMENT
This is an extremely powerful doing year for personal growth and expression as we adjust to the changes wrought during the now-concluded PY9. The power of this year encourages us to dare to be different as we improve in self-confidence. This is an excellent year for breaking old habits, improving finances, and buying and selling on a wide scale.
ESOTERIC MEANING: THE BURDEN OF THE ARCHITECT. It's a year of radical isolation. You are the only one who can see the vision. It requires the "death" of your former identity to make room for the new seed. The focus is the emergence of the Self from the void.`,
  2: `PERSONAL YEAR 2 — A SPIRITUAL GROWTH YEAR OF SHARING
Though not with the power of a peak number, this is a year in which its own powerful nature can cause many a turbulent personality to embrace calmness. Spiritual development is the primary feature of this year with an enhanced awareness of life's more subtle qualities. Central to the growth is the need to actively develop the power of meditation.
ESOTERIC MEANING: THE PSYCHIC SPONGE. This isn't just about "waiting"; it's about developing extreme receptivity. You are learning to be "second" so you can understand the nuances of energy and intuition.`,
  3: `PERSONAL YEAR 3 — A MIND-EXPANSIVE YEAR
Between the peak PYNs and the trough of PY4 comes this year of surprisingly intensified mental power. Under this vibration, our thinking and observing faculties are attuned to an acute peak of alertness. It is a year when the intellect thirsts for knowledge and expression, through academic study, philosophy, or extensive travel.
ESOTERIC MEANING: THE MASK AND THE MIRROR. It is the "adolescence" of the cycle. The challenge is moving beyond superficial charm to find authentic self-expression. It's about the vulnerability of being truly seen.`,
  4: `PERSONAL YEAR 4 — A YEAR OF CONSOLIDATION
Physical and material factors dominate this trough year. Rest and stability are vital to regenerate and consolidate the previous five years' development. It is a year of squaring, when everything is brought to a reckoning and the unwanted aspects are eliminated, like a vine pruned in winter.
ESOTERIC MEANING: THE ANVIL. While most call this "hard work," it is actually about ancestral patterns. You are being compressed into a diamond. The lack of external movement is a sign of internal intensity — an incubation period as the roots grow deep.`,
  5: `PERSONAL YEAR 5 — A YEAR OF FREEDOM
Spiritual and emotional factors prevail this year, igniting the power of freedom through heightened psychic awareness and personal expression. This leads to the development of our talents and release from material and social confinement, replacing them with a focus on artistic expression and creative exploration.
ESOTERIC MEANING: THE CROSSROADS OF CHAOS. Beyond just "travel and change," this is a sensory recalibration. The universe tests your ability to remain centered while the world spins.`,
  6: `PERSONAL YEAR 6 — A YEAR OF CREATIVITY
This is the year of the mini-peak, its focus on accumulation of power through creative investment. New creative projects undertaken this year will have the most favourable aspects for success, especially when directed toward the upliftment of humankind. It is also a year of focus on the home and personal relationships.
ESOTERIC MEANING: THE GOLDEN HANDCUFFS. The deeper meaning is The Karmic Mirror — you attract exactly the level of harmony (or discord) that you hold within. It's a year of "Sacred Service" versus "Slavery" — learning the difference between helping others and losing yourself.`,
  7: `PERSONAL YEAR 7 — A TROUGH YEAR OF FOCUS
Similar to PY4, this is a trough year of consolidation when no major change should be undertaken. It is a highly significant year in which we learn to intensely focus on previous years' growth. For many, this implies sacrifice brought about by a failure to recognise and apply guidance from the higher powers.
ESOTERIC MEANING: THE HOLY GHOSTING. Often called "spiritual introspection," it manifests as a Dark Night of the Ego. The world may withdraw its support so you are forced to find connection to the Divine without external validation. A "bridge" year between the physical and the metaphysical.`,
  8: `PERSONAL YEAR 8 — A YEAR OF INDEPENDENCE AND WISDOM
This is a year of rapid change as we emerge from a trough onto the steep rise toward our next peak. Many new opportunities manifest as we assert our independence with growing wisdom — whether in a significant improvement in financial affairs or a heightened spiritual independence.
ESOTERIC MEANING: THE MIRROR OF MERIT. It is the Cosmic Harvest. The universe reflects your integrity back to you in material form. If you've worked with heart in years 1–7, Year 8 brings expansion. It is the mastery of the flow between "as above, so below."`,
  9: `PERSONAL YEAR 9 — THE PEAK YEAR OF COMPLETION
This is the second most powerful year and the year of completion of the 9-year cycle. It is a year of heightened feelings in which the individual is confronted with the necessity to complete, to review the 9-year cycle, to discard the unwanted, and to prepare for the new 9-year cycle, which begins with PY1.
ESOTERIC MEANING: THE SACRED BONFIRE. Forgiveness isn't the lesson here — dissolution is. You are being asked to become a living transmutation device, turning the lead of past pain into the gold of collective wisdom. A shaman's year, not a therapist's.`,
  11: `PERSONAL YEAR 11 — THE MASTER ILLUMINATION YEAR
The Master Number 11 personal year is a rare and intensely spiritual cycle, vibrating at a frequency of illumination, revelation, and awakening. It doesn't operate on the practical plane of the 2; instead, it demands engagement with the invisible, the intuitive, and the transcendent. You are living on a razor's edge between the mundane and the cosmic.
ESOTERIC MEANING: THE LIGHTNING BOLT FROM HEAVEN. This is not a year to build; it is a year to receive downloads from a higher plane. The 11 is the number of the messenger, the prophet, the visionary.`,
  22: `PERSONAL YEAR 22 — THE MASTER BUILDER YEAR
The Master Number 22 personal year is one of the rarest and most powerful cycles in all of numerology. It is a year of large-scale construction and potential that transcends the personal and operates at the level of the collective. If you are in a 22 personal year, you are not just building a life — you are potentially building a legacy.
ESOTERIC MEANING: THE ARCHITECT OF CIVILIZATION. The 22 is the bridge between the vision of the 11 and the physical reality of the 4. You are the living conduit between the world of pure potential and the world of concrete form.`,
  33: `PERSONAL YEAR 33 — THE MASTER TEACHER YEAR
The 33 personal year is the rarest and most spiritually demanding of the three Master Number cycles. It is not about personal achievement or even large-scale building; it is about selfless, compassionate service at the level of a spiritual teacher or healer. This is a year where you are being called to embody wisdom and love as a living example for others.`,
};
// ─── Personal Year Compound Lookup (compat helper) ───────────────────────────
/**
 * Calculate the raw PYN compound sum for a given birth date + display year,
 * and return the matching compound entry (or null if none applies).
 * Used by PersonalYearChart and other callers.
 */
export function getCompoundForPYN(
  birthDay: number,
  birthMonth: number,
  displayYear: number,
): ChaldeanPYNCompound | null {
  // Uses the SAME unreduced compound total as every other Personal-Year
  // feature in the app (birth day and month go in as-is, not pre-reduced) —
  // see computeRawPersonalYear in personal-year-full.ts for the reasoning.
  const raw = computeRawPersonalYear(birthDay, birthMonth, displayYear);
  return raw >= 10 ? lookupCompound(raw) : null;
}
/** The CLASSIC compound lookup — birth day and month reduced to a single
 * digit FIRST, then summed with the year's digit sum. See
 * computeRawPersonalYearClassic in personal-year-full.ts. Shown alongside
 * getCompoundForPYN above, not as a replacement for it. */
export function getClassicCompoundForPYN(
  birthDay: number,
  birthMonth: number,
  displayYear: number,
): ChaldeanPYNCompound | null {
  const raw = computeRawPersonalYearClassic(birthDay, birthMonth, displayYear);
  return raw >= 10 ? lookupCompound(raw) : null;
}