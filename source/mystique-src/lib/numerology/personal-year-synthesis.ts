/**
 * MYSTIQUE COMPASS — Forensic Personal Year Synthesis
 *
 * This module turns the Direct + Classic compound pair into one integrated
 * diagnosis. It does not merely print two meanings side-by-side. It performs a
 * historical-cluster comparison, detects reinforcement/conflict, ranks life
 * domains, forecasts behaviour/decisions/outcomes, and returns a consultant-like
 * narrative that feels specific to the year being examined.
 */
 
import type { ChaldeanPYNCompound } from '@/lib/numerology/chaldean-pyn-compounds';
import { famousBirthdays } from '@/lib/famous-birthdays';
import { HISTORICAL_CASES_EXPANSION_200 } from '@/lib/numerology/personal-year-history-expanded';
import { HISTORICAL_CASES_EXPANSION_300_EXTRA } from '@/lib/numerology/personal-year-history-expanded-2';
import { HISTORICAL_CASES_EXPANSION_FINAL } from '@/lib/numerology/personal-year-history-expanded-4';
import { HISTORICAL_CASES_EXPANSION_300_MORE } from '@/lib/numerology/personal-year-history-expanded-3';
 
export interface PersonalYearDualEssenceSynthesis {
  title: string;
  /** The intermarriage: one woven narrative where the Direct (Surface Journey)
   * and Classic (Destiny Blueprint) essences are read as a single story,
   * proven against real historical cases that carried the same pair. */
  wovenSynthesis: string;
  subtitle: string;
  synthesisText: string;
  directEssenceRole: string;
  classicEssenceRole: string;
  ageModifier: string;
  masterNumberSignal: string | null;
  karmicDebtSignal: string | null;
  historicalCalibration: string;
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
 
type Domain =
  | 'career' | 'leadership' | 'law' | 'money' | 'publicVisibility' | 'competition'
  | 'relationships' | 'family' | 'health' | 'travel' | 'creativeOutput' | 'spirituality'
  | 'security' | 'home' | 'education' | 'legacy' | 'service' | 'reputation';
 
type Trait =
  | 'expansion' | 'contraction' | 'visibility' | 'withdrawal' | 'victory' | 'loss'
  | 'lawPressure' | 'competition' | 'service' | 'danger' | 'discipline' | 'creativity'
  | 'relationshipDependence' | 'legacy' | 'reinvention' | 'reckoning';
 
type Polarity = 'constructive' | 'cautionary' | 'mixed' | 'threshold';
 
type ScoreMap<T extends string> = Partial<Record<T, number>>;
 
interface CompoundIntelligence {
  name: string;
  domains: ScoreMap<Domain>;
  traits: ScoreMap<Trait>;
  polarity: Polarity;
  thesis: string;
  likelyMistake: string;
  strategicMove: string;
  outcomeLogic: string;
}
 
interface PairArchetype {
  title: string;
  thesis: string;
  decisionForecasts: string[];
  personalityShift: string;
  outcomePrediction: string;
  protectiveStrategy: string;
  domainBoost?: ScoreMap<Domain>;
}
 
export interface HistoricalCase {
  id: string;
  person: string;
  year: number;
  age: number;
  occupation: string;
  wealth: 'low' | 'modest' | 'comfortable' | 'wealthy' | 'institutional';
  relationshipStatus: 'single' | 'partnered' | 'married' | 'separated' | 'widowed' | 'divorced' | 'unknown';
  visibility: 'private' | 'local' | 'public' | 'global';
  eventCategory: string;
  eventDate?: string;
  eventDetails?: string;
  sources?: string[];
  direct: number;
  classic: number;
  directReduced: number;
  classicReduced: number;
  domains: ScoreMap<Domain>;
  eventIntensity: number;
  outcome: 'triumph' | 'loss' | 'mixed' | 'transition' | 'legacy';
  narrative: string;
  falsePositives: string[];
  decisions: string[];
  personalityShift: string;
  protectiveLesson: string;
}
 
const DOMAIN_LABELS: Record<Domain, string> = {
  career: 'Career / work direction',
  leadership: 'Leadership / authority',
  law: 'Law / contracts / formal judgment',
  money: 'Money / assets / business risk',
  publicVisibility: 'Public visibility / audience',
  competition: 'Competition / opposition',
  relationships: 'Relationships / alliances',
  family: 'Family / domestic duty',
  health: 'Health / body / fatigue',
  travel: 'Travel / movement / relocation',
  creativeOutput: 'Creative output / communication',
  spirituality: 'Spirituality / inner truth',
  security: 'Security / safety / protection',
  home: 'Home / residence / roots',
  education: 'Study / research / learning',
  legacy: 'Legacy / historical memory',
  service: 'Service / duty / care',
  reputation: 'Reputation / name / public story',
};
 
const ALL_DOMAINS = Object.keys(DOMAIN_LABELS) as Domain[];
const ALL_TRAITS: Trait[] = ['expansion','contraction','visibility','withdrawal','victory','loss','lawPressure','competition','service','danger','discipline','creativity','relationshipDependence','legacy','reinvention','reckoning'];
 
function d(scores: ScoreMap<Domain>): ScoreMap<Domain> { return scores; }
function t(scores: ScoreMap<Trait>): ScoreMap<Trait> { return scores; }
function clamp01(n: number): number { return Math.max(0, Math.min(1, n)); }
function pct(n: number): number { return Math.round(clamp01(n) * 100); }
function uniq<T>(arr: T[]): T[] { return [...new Set(arr.filter(Boolean))]; }
function cnum(c: ChaldeanPYNCompound | null, fallback: number): number { return c?.compound ?? fallback; }
function label(raw: number, reduced: number, compound: ChaldeanPYNCompound | null): string { return compound ? `${raw}/${reduced} — ${compound.name}` : `${raw}/${reduced}`; }
 
const REDUCED_INTELLIGENCE: Record<number, CompoundIntelligence> = {
  1: { name:'Initiation', domains:d({career:.72, leadership:.78, publicVisibility:.62, reputation:.58, competition:.48}), traits:t({expansion:.82, visibility:.7, victory:.55, discipline:.42}), polarity:'constructive', thesis:'The year wants a new public position, a fresh identity, or a visible act of will.', likelyMistake:'acting fast without protecting the future structure', strategicMove:'choose one decisive initiative and make its legal/financial foundation explicit', outcomeLogic:'outcomes follow the quality of initiative and self-command' },
  2: { name:'Relational trial', domains:d({relationships:.78, publicVisibility:.45, law:.38, reputation:.42}), traits:t({relationshipDependence:.82, withdrawal:.35, danger:.35}), polarity:'mixed', thesis:'Other people become the channel through which the year delivers both help and complication.', likelyMistake:'mistaking emotional intensity for reliability', strategicMove:'test alliances before depending on them', outcomeLogic:'outcomes turn on partner quality, timing, and discernment' },
  3: { name:'Expression', domains:d({creativeOutput:.82, publicVisibility:.72, reputation:.62, education:.55, relationships:.4}), traits:t({creativity:.9, visibility:.68, expansion:.56}), polarity:'constructive', thesis:'The year becomes visible through speech, writing, performance, publication, teaching, or the public story around the person.', likelyMistake:'being seen everywhere while finishing nothing central', strategicMove:'make one message sovereign', outcomeLogic:'outcomes improve when expression is disciplined rather than scattered' },
  4: { name:'Foundation pressure', domains:d({career:.72, money:.55, health:.52, home:.48, security:.55}), traits:t({discipline:.88, contraction:.58, reckoning:.5, reinvention:.45}), polarity:'threshold', thesis:'The year tests the structure underneath life and forces weak foundations to be rebuilt.', likelyMistake:'trying to force speed in a year that demands architecture', strategicMove:'slow down enough to build something that can survive pressure', outcomeLogic:'outcomes depend on the strength of systems, routines, and responsibilities' },
  5: { name:'Movement and risk', domains:d({travel:.78, creativeOutput:.65, publicVisibility:.65, money:.5, law:.38, career:.52}), traits:t({expansion:.82, creativity:.52, danger:.42, visibility:.56}), polarity:'mixed', thesis:'The year accelerates movement, communication, travel, markets, media, and freedom decisions.', likelyMistake:'confusing flexibility with recklessness', strategicMove:'move quickly but verify contracts, vehicles, promises, and numbers', outcomeLogic:'outcomes reward adaptability and punish haste' },
  6: { name:'Duty and care', domains:d({family:.78, service:.72, relationships:.65, home:.62, health:.42, publicVisibility:.35}), traits:t({service:.86, contraction:.35, relationshipDependence:.45}), polarity:'mixed', thesis:'The year asks who or what must be served, repaired, loved, released, or carried.', likelyMistake:'letting responsibility become subservience', strategicMove:'serve with boundaries', outcomeLogic:'outcomes depend on emotional maturity and duty without self-erasure' },
  7: { name:'Investigation and correction', domains:d({spirituality:.78, health:.6, security:.55, education:.62, reputation:.35}), traits:t({withdrawal:.78, danger:.55, contraction:.62, reckoning:.55}), polarity:'cautionary', thesis:'The year pulls life under the surface and exposes what was hidden, unsafe, false, or spiritually unfinished.', likelyMistake:'ignoring the body, fatigue, intuition, or safety signals', strategicMove:'reduce speed and let evidence correct belief', outcomeLogic:'outcomes improve through humility, caution, research, and surrender' },
  8: { name:'Power and material karma', domains:d({money:.82, career:.78, law:.62, leadership:.68, reputation:.55}), traits:t({discipline:.6, lawPressure:.55, competition:.58, reckoning:.6, victory:.48}), polarity:'mixed', thesis:'The year brings power, money, contracts, law, office, business, and public consequence to judgment.', likelyMistake:'overreach or misplaced trust in partners', strategicMove:'audit exposure before expanding authority', outcomeLogic:'outcomes mirror previous ambition and present integrity' },
  9: { name:'Completion and legacy', domains:d({legacy:.78, service:.62, publicVisibility:.55, relationships:.45, spirituality:.58, reputation:.58}), traits:t({legacy:.82, reckoning:.7, loss:.48, service:.55, reinvention:.42}), polarity:'threshold', thesis:'The year closes a chapter and extracts meaning from everything that came before.', likelyMistake:'clinging to a form that has already completed', strategicMove:'turn endings into deliberate legacy rather than uncontrolled loss', outcomeLogic:'outcomes depend on release, moral clarity, and completion' },
  11: { name:'Master illumination', domains:d({publicVisibility:.75, creativeOutput:.68, spirituality:.72, relationships:.52, reputation:.58}), traits:t({visibility:.7, danger:.42, creativity:.62, relationshipDependence:.5, reckoning:.45}), polarity:'mixed', thesis:'The year becomes symbolic, electric, revealing, and nervous; the person is asked to carry a message larger than ordinary preference.', likelyMistake:'confusing intensity with certainty', strategicMove:'ground revelation in schedule, body-care, and verifiable counsel', outcomeLogic:'outcomes improve when vision is embodied rather than merely felt' },
  22: { name:'Master builder', domains:d({career:.82, leadership:.75, money:.68, publicVisibility:.6, security:.55}), traits:t({discipline:.86, expansion:.65, reckoning:.55, danger:.42}), polarity:'threshold', thesis:'The year wants scale: a movement, institution, platform, building, company, or public system.', likelyMistake:'building too large before governance is grounded', strategicMove:'test foundations before multiplying scale', outcomeLogic:'outcomes depend on architecture, not inspiration alone' },
  33: { name:'Master teacher', domains:d({service:.82, creativeOutput:.7, publicVisibility:.62, spirituality:.7, legacy:.62}), traits:t({service:.9, creativity:.55, legacy:.55, contraction:.32}), polarity:'constructive', thesis:'The year turns the person or their work into instruction for others.', likelyMistake:'saving everyone while neglecting the vessel that serves', strategicMove:'teach from overflow rather than self-erasure', outcomeLogic:'outcomes become durable when service stays embodied and practical' },
};
 
const COMPOUND_INTELLIGENCE: Record<number, Partial<CompoundIntelligence>> = {
  10:{ name:'Wheel of Fortune', domains:d({career:.8, reputation:.78, publicVisibility:.72}), traits:t({expansion:.75, visibility:.7, reckoning:.45}), polarity:'mixed', thesis:'a launch or appointment becomes public quickly and carries immediate consequences', likelyMistake:'assuming the wheel only rises', strategicMove:'control motive and timing before public launch', outcomeLogic:'fast manifestation produces either fame or visible correction' },
  11:{ name:'Strength / Master 11', domains:d({publicVisibility:.7, relationships:.62, spirituality:.72, security:.42}), traits:t({visibility:.68, danger:.45, relationshipDependence:.58}), polarity:'mixed', thesis:'power must be contained through composure rather than force', likelyMistake:'letting nervous electricity become reaction', strategicMove:'ground the omen before acting on it', outcomeLogic:'the person wins when the lion is held, not when it is attacked' },
  12:{ name:'Sacrifice', domains:d({creativeOutput:.62, reputation:.6, relationships:.58}), traits:t({loss:.65, relationshipDependence:.65, creativity:.45}), polarity:'cautionary', thesis:'the public story may consume private dignity or creative credit', likelyMistake:'giving without boundaries', strategicMove:'define ownership and emotional limits', outcomeLogic:'success and sacrifice arrive entangled' },
  13:{ name:'Rebirth', domains:d({career:.75, home:.6, health:.52, security:.62}), traits:t({reinvention:.82, loss:.68, discipline:.7, reckoning:.65}), polarity:'threshold', thesis:'an old structure ends so a more durable one can be built', likelyMistake:'trying to repair what the year is trying to replace', strategicMove:'design the new foundation deliberately', outcomeLogic:'loss becomes useful only if rebuilt into discipline' },
  14:{ name:'Magnetic Movement', domains:d({travel:.82, creativeOutput:.72, money:.55, law:.48, publicVisibility:.66}), traits:t({expansion:.8, danger:.5, creativity:.6}), polarity:'mixed', thesis:'movement and communication open doors while speed and trust create risk', likelyMistake:'depending on verbal promises', strategicMove:'make mobility disciplined and documented', outcomeLogic:'freedom produces reward only when verified' },
  16:{ name:'Shattered Citadel', domains:d({health:.72, security:.78, spirituality:.7, reputation:.52, travel:.46}), traits:t({danger:.85, loss:.78, contraction:.7, reckoning:.78}), polarity:'cautionary', thesis:'false security is struck so that truth can replace image', likelyMistake:'ignoring fatigue, safety, medicine, vehicles, or spiritual arrogance', strategicMove:'dismantle unsafe structures voluntarily', outcomeLogic:'humility prevents the tower from choosing the method of collapse' },
  17:{ name:'Star of the Magi', domains:d({legacy:.86, leadership:.68, publicVisibility:.62, reputation:.78, money:.55}), traits:t({legacy:.9, victory:.62, discipline:.5}), polarity:'constructive', thesis:'trial becomes lasting name, moral authority, or posthumous influence', likelyMistake:'treating legacy as image rather than earned character', strategicMove:'let authority serve a higher principle', outcomeLogic:'difficulty becomes immortalizing when handled with dignity' },
  18:{ name:'Spirit under attack', domains:d({competition:.78, law:.55, publicVisibility:.58, security:.58, relationships:.45}), traits:t({danger:.68, competition:.78, loss:.52, reckoning:.68}), polarity:'cautionary', thesis:'conflict, factional pressure, or material force tests the moral center', likelyMistake:'answering destructive currents with more destruction', strategicMove:'choose disciplined force or principled nonviolence', outcomeLogic:'the year completes through conflict unless the person consciously redirects the fire' },
  19:{ name:'Prince of Heaven', domains:d({leadership:.88, publicVisibility:.78, reputation:.78, career:.72}), traits:t({victory:.9, visibility:.75, expansion:.7}), polarity:'constructive', thesis:'victory, honor, and disproportionate return become possible after temporal failure', likelyMistake:'thinking solar favour removes the need for ethics', strategicMove:'use success to lead rather than dominate', outcomeLogic:'the year rewards confident effort with returns larger than the input' },
  21:{ name:'Crown of the Magi', domains:d({leadership:.82, publicVisibility:.82, reputation:.82, creativeOutput:.68, legacy:.6}), traits:t({victory:.86, visibility:.78, legacy:.55}), polarity:'constructive', thesis:'long initiation turns into public elevation, award, title, or honour', likelyMistake:'forgetting that the crown was earned by tests', strategicMove:'accept elevation while staying accountable to the initiation', outcomeLogic:'recognition is strongest when it completes a long ordeal' },
  22:{ name:'Master Builder under danger', domains:d({career:.86, leadership:.82, money:.7, security:.62}), traits:t({discipline:.85, expansion:.65, danger:.48, reckoning:.58}), polarity:'threshold', thesis:'scale becomes possible but blind spots become dangerous at the same scale', likelyMistake:'letting admirers or partners steer the architecture', strategicMove:'govern the project before expanding it', outcomeLogic:'the builder succeeds only when the foundation is less glamorous than the vision' },
  23:{ name:'Royal Star of the Lion', domains:d({leadership:.78, publicVisibility:.75, career:.72, relationships:.55}), traits:t({victory:.78, expansion:.65, visibility:.68}), polarity:'constructive', thesis:'support from high places opens movement and protection', likelyMistake:'assuming patronage means personal invulnerability', strategicMove:'honour the gatekeepers without surrendering judgment', outcomeLogic:'doors open through authority, recommendation, or public favour' },
  26:{ name:'Gravest Warnings', domains:d({money:.82, law:.75, relationships:.62, career:.6}), traits:t({danger:.78, lawPressure:.75, loss:.72, relationshipDependence:.62}), polarity:'cautionary', thesis:'association, advice, speculation, or partnership can become the loss mechanism', likelyMistake:'outsourcing judgment to persuasive people', strategicMove:'audit partners and refuse unclear exposure', outcomeLogic:'self-reliance protects what alliance can endanger' },
  27:{ name:'The Scepter', domains:d({leadership:.86, legacy:.72, creativeOutput:.62, publicVisibility:.7, reputation:.72}), traits:t({victory:.76, legacy:.72, visibility:.62}), polarity:'constructive', thesis:'authority is earned through productive intellect and command', likelyMistake:'assuming authority exempts the person from moral pressure', strategicMove:'use command to create order rather than merely win', outcomeLogic:'reward comes from ideas, discipline, and rightful authority' },
  28:{ name:'The Lamb', domains:d({law:.86, competition:.82, leadership:.7, money:.66, reputation:.68, security:.55}), traits:t({lawPressure:.9, competition:.82, loss:.78, reinvention:.72, danger:.55}), polarity:'mixed', thesis:'promise is tested by law, trust, opposition, and the need to begin again without losing the mission', likelyMistake:'trusting goodwill where structure is required', strategicMove:'future-proof every agreement, reserve, alliance, and legal exposure', outcomeLogic:'renewal follows loss only when the person protects the next road before the old one is taken' },
  29:{ name:'Grace under trial', domains:d({relationships:.82, reputation:.55, security:.5}), traits:t({relationshipDependence:.8, loss:.62, danger:.45}), polarity:'cautionary', thesis:'emotional trial exposes who is loyal and who is merely present', likelyMistake:'asking unreliable people to become safe under pressure', strategicMove:'reduce dependency before the test arrives', outcomeLogic:'grace appears after relational illusion is removed' },
  30:{ name:'The Crossroads', domains:d({creativeOutput:.72, education:.68, career:.52, reputation:.42}), traits:t({creativity:.62, withdrawal:.52, contraction:.38}), polarity:'threshold', thesis:'achievement and private disappointment stand at the same fork in the road', likelyMistake:'thinking forever instead of choosing one road', strategicMove:'turn intelligence into a finished message or decision', outcomeLogic:'mental clarity becomes power only after ambivalence is resolved' },
  32:{ name:'Unexpected Power', domains:d({creativeOutput:.82, publicVisibility:.75, travel:.58, leadership:.55}), traits:t({creativity:.82, expansion:.72, visibility:.7}), polarity:'constructive', thesis:'creative influence spreads unexpectedly when self-trust is not surrendered', likelyMistake:'letting stubborn or foolish people redirect the plan', strategicMove:'hold your own judgment after consultation', outcomeLogic:'surprising reach follows independent expression' },
  33:{ name:'Master Teacher', domains:d({service:.86, legacy:.72, creativeOutput:.68, spirituality:.7}), traits:t({service:.9, legacy:.65, creativity:.55}), polarity:'constructive', thesis:'the year teaches through the person, work, sacrifice, or healing presence', likelyMistake:'confusing service with self-erasure', strategicMove:'make the teaching practical enough to help real people', outcomeLogic:'benefit multiplies when compassion has structure' },
  35:{ name:'Disastrous Warning repeated', domains:d({money:.78, law:.62, relationships:.58, career:.58}), traits:t({danger:.72, relationshipDependence:.62, lawPressure:.56, loss:.58}), polarity:'cautionary', thesis:'creative or business alliances can carry hidden disaster', likelyMistake:'joining momentum before verifying the carrier', strategicMove:'stress-test vehicles, partners, contracts, and assumptions', outcomeLogic:'the attractive alliance is safe only if independently verified' },
  37:{ name:'Royal Star of Taurus', domains:d({relationships:.78, career:.62, publicVisibility:.55, creativeOutput:.5}), traits:t({relationshipDependence:.65, victory:.55, expansion:.45}), polarity:'constructive', thesis:'partnership and alliance become the channel of initiation', likelyMistake:'trying to win alone when the year wants collaboration', strategicMove:'choose allies for durability, not glamour', outcomeLogic:'the right partner multiplies the beginning' },
  38:{ name:'Visionary Trial', domains:d({creativeOutput:.74, publicVisibility:.68, relationships:.62, law:.52, leadership:.5}), traits:t({creativity:.7, danger:.52, relationshipDependence:.68, visibility:.62}), polarity:'mixed', thesis:'a vision either finds reliable carriers or collapses through misread allies and practical overreach', likelyMistake:'mistaking applause for infrastructure', strategicMove:'test advisers, logistics, and timing before expanding the vision', outcomeLogic:'inspiration survives only when the surrounding structure can carry it' },
  39:{ name:'Scattered Vision', domains:d({creativeOutput:.8, publicVisibility:.62, service:.48, reputation:.52}), traits:t({creativity:.82, expansion:.58, loss:.35}), polarity:'mixed', thesis:'many projects compete for one central life-force', likelyMistake:'being visible everywhere and remembered nowhere', strategicMove:'edit the year around the one project that carries the whole meaning', outcomeLogic:'multiplicity becomes success only after hierarchy is imposed' },
  44:{ name:'Master Business Number', domains:d({money:.9, career:.86, leadership:.72, health:.55}), traits:t({discipline:.9, reckoning:.58, expansion:.55}), polarity:'mixed', thesis:'business mastery intensifies until the person must learn when to stop', likelyMistake:'overworking because the machine is finally understandable', strategicMove:'define stop-loss rules before intensity becomes obsession', outcomeLogic:'survival and achievement come through disciplined execution with limits' },
  48:{ name:'Crown and Cross', domains:d({leadership:.78, publicVisibility:.75, career:.72, service:.58, reputation:.68}), traits:t({visibility:.72, service:.45, loss:.42, discipline:.55}), polarity:'mixed', thesis:'elevation arrives with friction, sacrifice, and the burden of representation', likelyMistake:'expecting the crown to be weightless', strategicMove:'accept visibility while managing the cross it brings', outcomeLogic:'the crown holds if responsibility is carried without martyrdom' },
  51:{ name:'Warrior’s Sacrifice', domains:d({leadership:.74, security:.8, travel:.55, health:.58, publicVisibility:.56}), traits:t({danger:.86, victory:.52, service:.55}), polarity:'mixed', thesis:'advancement comes through courage in a field that also carries danger', likelyMistake:'romanticizing risk because the mission feels noble', strategicMove:'treat protection as part of the mission', outcomeLogic:'bravery advances the year only when safety is strategic' },
  55:{ name:'Master Communicator’s Sword', domains:d({leadership:.86, creativeOutput:.78, publicVisibility:.78, competition:.68, security:.55}), traits:t({visibility:.78, victory:.68, danger:.58, expansion:.72}), polarity:'mixed', thesis:'words, commands, broadcasts, or decisions cut history into before and after', likelyMistake:'becoming addicted to the blade after it works', strategicMove:'say the necessary thing with restraint', outcomeLogic:'decisive communication wins when force remains precise' },
  59:{ name:'Reckoning Voice', domains:d({creativeOutput:.78, publicVisibility:.68, health:.58, reputation:.62, travel:.5}), traits:t({creativity:.65, reckoning:.72, danger:.42}), polarity:'mixed', thesis:'the voice can win honour while the body or private life demands payment', likelyMistake:'thinking persuasion exempts the person from bodily limits', strategicMove:'build a body strategy alongside the communication strategy', outcomeLogic:'recognition lasts only if the vessel can carry it' },
  60:{ name:'Love Tested to the Limit', domains:d({service:.8, family:.76, relationships:.72, publicVisibility:.48, health:.42}), traits:t({service:.82, relationshipDependence:.62, contraction:.42}), polarity:'mixed', thesis:'love, gratitude, duty, and rejection may coexist', likelyMistake:'believing past service purchases future obedience', strategicMove:'serve without clinging to the old role', outcomeLogic:'love becomes mature when it releases control' },
};
 
const PAIR_ARCHETYPES: Record<string, PairArchetype> = {
  '28-19': {
    title:'Contested Ascension: the road is threatened before the crown is confirmed',
    thesis:'The year is not simply lucky or unlucky. It behaves like a public ascent under challenge: the outer field tests trust, law, competition, and the possibility of losing the road; the deeper outcome field still points toward leadership, public favour, and a victory that can look disproportionate if the person survives the test without becoming careless.',
    decisionForecasts:['You become less willing to rely on verbal promises and more insistent on written protection.','You stop trying to convince every opponent and begin choosing battles that affect the main road.','A tempting expansion may be delayed, narrowed, or legally redesigned before it becomes safe.','You become more comfortable acting alone if allies prove expensive, slow, or unreliable.'],
    personalityShift:'You will likely appear more commanding and optimistic to others while privately becoming more suspicious, procedural, and future-proofing. The year makes you warmer in victory but colder in risk assessment.',
    outcomePrediction:'The most likely outcome is not smooth success; it is success after pressure. A win, promotion, public breakthrough, or new beginning is possible, but only after the year exposes a legal, competitive, trust-based, or resource-based vulnerability.',
    protectiveStrategy:'Do not expand on faith alone. If law, contracts, partnership, debt, acquisition, or public competition becomes active, slow the transaction long enough to build reserves, document obligations, and preserve an exit route.',
    domainBoost:d({leadership:.14, law:.16, competition:.14, reputation:.12, money:.08, security:.07}),
  },
  '27-18': {
    title:'The Scepter in the Storm: authority is earned while conflict tries to define the ending',
    thesis:'The year wants command, reward from intellect, and a stronger public voice, but the inner field is conflict-heavy. The coherent story is authority under ideological, competitive, family, legal, or social pressure. You are not merely completing a cycle; you are proving whether your authority can remain clean when surrounded by tension.',
    decisionForecasts:['You will probably stop asking for permission from people whose judgment has become reactive.','You may reject one conflict that offers ego-satisfaction but weakens long-term authority.','You become faster at separating useful allies from people who only intensify drama.','A major decision is likely to be framed as moral rather than merely practical.'],
    personalityShift:'You become more final, less tolerant of chaos, and more interested in command than approval. Compassion remains possible, but sentimentality drops sharply.',
    outcomePrediction:'The outcome is a completion with authority: a role, argument, relationship, project, or identity reaches a verdict. Victory is possible, but the victory has to pass through conflict rather than around it.',
    protectiveStrategy:'Avoid winning the wrong war. When conflict rises, ask whether engaging it strengthens authority or merely feeds the 18/9 field of enmity and exhaustion.',
    domainBoost:d({leadership:.15, competition:.14, legacy:.1, reputation:.1, law:.08, service:.06}),
  },
  '48-21': {
    title:'The Crown and Cross: elevation arrives with the burden attached',
    thesis:'This pattern does not deny success; it explains its cost. The outer year brings responsibility, friction, office, or public burden, while the deeper storyline gives honours after long tests. The one story is visible elevation that immediately demands sacrifice, discipline, and representation.',
    decisionForecasts:['You accept a role that is larger than your comfort zone.','You become more selective about which criticism deserves an answer.','You trade ease for legitimacy.'],
    personalityShift:'You become more statesmanlike, less casual, and more aware that visibility has consequences.',
    outcomePrediction:'Recognition is likely, but it will not feel light. The honour brings work with it.',
    protectiveStrategy:'Before accepting the crown, negotiate the resources required to carry the cross.',
    domainBoost:d({leadership:.14, publicVisibility:.13, reputation:.12, career:.1}),
  },
  '44-17': {
    title:'The Trial of Power: business pressure becomes lasting authority',
    thesis:'The outer field demands relentless execution, material control, and business survival; the inner field points toward legacy through trial. The story is not easy money. It is power proven by pressure.',
    decisionForecasts:['You will cut projects that drain cash or attention.','You become less sentimental about underperforming structures.','You may double down on one mission while abandoning distractions.'],
    personalityShift:'You become more executive, more severe with time, and less available for emotional noise.',
    outcomePrediction:'A major material achievement is possible, especially if overreach is contained before the body or finances protest.',
    protectiveStrategy:'Set stop-loss rules before ambition starts calling exhaustion a virtue.',
    domainBoost:d({money:.16, career:.14, leadership:.1, health:.08, legacy:.08}),
  },
};
 
const HISTORICAL_CASES: HistoricalCase[] = [
  { id:'trump-2024', person:'Donald Trump', year:2024, age:78, occupation:'politician business owner media figure', wealth:'wealthy', relationshipStatus:'married', visibility:'global', eventCategory:'election litigation assassination attempts comeback', direct:28, classic:19, directReduced:1, classicReduced:1, domains:d({leadership:.98, law:.95, competition:.96, publicVisibility:.98, reputation:.92, money:.65, security:.8, health:.35}), eventIntensity:98, outcome:'triumph', narrative:'Legal danger, opposition, public violence risk and a dramatic electoral comeback formed one mixed ordeal-and-reward pattern.', falsePositives:['Classic 19/1 alone would understate the danger; direct 28/1 alone would understate the victory.'], decisions:['stayed in contest despite legal threat','converted prosecution and danger into campaign identity'], personalityShift:'more combative, mythic, and survival-framed', protectiveLesson:'future-proof law and security before assuming popularity protects you' },
  { id:'churchill-1940', person:'Winston Churchill', year:1940, age:65, occupation:'wartime prime minister writer broadcaster', wealth:'comfortable', relationshipStatus:'married', visibility:'global', eventCategory:'war leadership appointment', direct:55, classic:10, directReduced:1, classicReduced:1, domains:d({leadership:.99, competition:.95, publicVisibility:.94, creativeOutput:.85, security:.86, reputation:.9, legacy:.86}), eventIntensity:99, outcome:'legacy', narrative:'Command, crisis, rhetoric and national survival fused into a sword-like leadership year.', falsePositives:['The 10/1 launch element alone does not explain the military danger; 55/1 supplies the sword.'], decisions:['accepted impossible leadership','used language as strategic weapon'], personalityShift:'defiant, concentrated, historically conscious', protectiveLesson:'speak decisively, but do not confuse rhetoric with logistics' },
  { id:'mandela-1990', person:'Nelson Mandela', year:1990, age:71, occupation:'political prisoner liberation leader', wealth:'modest', relationshipStatus:'married', visibility:'global', eventCategory:'release negotiation transition', direct:44, classic:17, directReduced:8, classicReduced:8, domains:d({leadership:.94, legacy:.96, publicVisibility:.9, law:.74, competition:.72, reputation:.95, service:.82}), eventIntensity:96, outcome:'transition', narrative:'Power returned through trial, and moral authority became practical negotiation.', falsePositives:['44/8 can sound merely businesslike unless 17/8 explains immortal moral authority.'], decisions:['moved from symbolic prisoner to negotiator','chose disciplined reconciliation over revenge'], personalityShift:'authoritative, restrained, legacy-aware', protectiveLesson:'do not let power gained through suffering become bitterness' },
  { id:'mandela-1994', person:'Nelson Mandela', year:1994, age:75, occupation:'statesman president', wealth:'modest', relationshipStatus:'married', visibility:'global', eventCategory:'election presidency honour', direct:48, classic:21, directReduced:3, classicReduced:3, domains:d({leadership:.99, publicVisibility:.96, reputation:.95, legacy:.96, service:.8, competition:.75}), eventIntensity:98, outcome:'triumph', narrative:'The crown arrived after long initiation, but immediately carried the cross of governing a wounded nation.', falsePositives:['48/3 alone overemphasizes friction; 21/3 explains the crown.'], decisions:['accepted office as service','turned personal victory into national transition'], personalityShift:'ceremonial yet burdened, conciliatory yet commanding', protectiveLesson:'honour must be resourced; symbolic elevation still needs administration' },
  { id:'obama-2008', person:'Barack Obama', year:2008, age:47, occupation:'politician lawyer author', wealth:'comfortable', relationshipStatus:'married', visibility:'global', eventCategory:'historic election movement building', direct:22, classic:13, directReduced:22, classicReduced:4, domains:d({leadership:.98, publicVisibility:.96, reputation:.9, career:.9, legacy:.82, competition:.8}), eventIntensity:97, outcome:'triumph', narrative:'A master-builder campaign rode a national rebirth/change story.', falsePositives:['13/4 can sound destructive, but here it described national rebirth more than personal loss.'], decisions:['scaled a movement','accepted the change mantle'], personalityShift:'more presidential, disciplined, symbol-bearing', protectiveLesson:'a movement needs structure or the symbol outruns governance' },
  { id:'diana-1997', person:'Diana Princess of Wales', year:1997, age:36, occupation:'royal humanitarian public figure', wealth:'wealthy', relationshipStatus:'separated', visibility:'global', eventCategory:'fatal accident public grief', direct:34, classic:16, directReduced:7, classicReduced:7, domains:d({health:.95, security:.95, travel:.9, publicVisibility:.86, reputation:.88, relationships:.62, legacy:.86}), eventIntensity:100, outcome:'legacy', narrative:'A public humanitarian image met the severe 16/7 accident/fatality signature.', falsePositives:['Direct 34/7 was too mild; classic 16/7 carried the real danger.'], decisions:['moved publicly amid private transition'], personalityShift:'more independent, exposed, emotionally visible', protectiveLesson:'when 16/7 is active, security and travel are not background details' },
  { id:'jobs-1985', person:'Steve Jobs', year:1985, age:30, occupation:'technology entrepreneur', wealth:'wealthy', relationshipStatus:'partnered', visibility:'public', eventCategory:'ouster rebirth new ventures', direct:49, classic:13, directReduced:4, classicReduced:4, domains:d({career:.95, money:.76, reputation:.82, leadership:.72, creativeOutput:.68, legacy:.78}), eventIntensity:94, outcome:'transition', narrative:'An institutional fall became the foundation of a later return.', falsePositives:['49/4 sounds constructive; classic 13/4 explains the humiliating break.'], decisions:['left old structure','seeded new platforms'], personalityShift:'wounded, obsessive, more independent', protectiveLesson:'do not repair a structure that has already rejected your role' },
  { id:'musk-2008', person:'Elon Musk', year:2008, age:37, occupation:'technology entrepreneur engineer investor', wealth:'wealthy', relationshipStatus:'separated', visibility:'public', eventCategory:'business survival rocket breakthrough', direct:44, classic:17, directReduced:8, classicReduced:8, domains:d({money:.98, career:.94, leadership:.88, health:.65, reputation:.75, legacy:.82, competition:.72}), eventIntensity:96, outcome:'triumph', narrative:'Business mastery under extreme pressure became legacy-making survival.', falsePositives:['17/8 sounds noble; 44/8 explains the brutal cash/execution pressure.'], decisions:['risked capital','cut options to preserve core missions'], personalityShift:'more relentless, more severe, more mission-fused', protectiveLesson:'the machine survives only if the operator has limits' },
  { id:'swift-2023', person:'Taylor Swift', year:2023, age:34, occupation:'musician performer business owner', wealth:'wealthy', relationshipStatus:'partnered', visibility:'global', eventCategory:'global tour cultural dominance', direct:32, classic:14, directReduced:5, classicReduced:5, domains:d({publicVisibility:.99, creativeOutput:.95, travel:.96, money:.9, reputation:.92, leadership:.62, relationships:.45}), eventIntensity:96, outcome:'triumph', narrative:'Creative power and disciplined movement converged into a global tour phenomenon.', falsePositives:['14/5 danger existed mostly as business/logistical risk, not catastrophe.'], decisions:['scaled movement through tour/film','kept creative ownership central'], personalityShift:'expansive, entrepreneurial, audience-commanding', protectiveLesson:'movement succeeds when logistics and ownership are disciplined' },
  { id:'swift-2016', person:'Taylor Swift', year:2016, age:27, occupation:'musician public figure', wealth:'wealthy', relationshipStatus:'single', visibility:'global', eventCategory:'reputation crisis withdrawal reinvention', direct:34, classic:16, directReduced:7, classicReduced:7, domains:d({reputation:.95, publicVisibility:.78, relationships:.72, spirituality:.58, security:.5, creativeOutput:.56}), eventIntensity:86, outcome:'transition', narrative:'Public image cracked, forcing withdrawal and later reinvention.', falsePositives:['16/7 manifested reputationally rather than physically.'], decisions:['withdrew from overexposure','rebuilt around a darker narrative'], personalityShift:'more guarded, strategic, less available', protectiveLesson:'let the false tower fall before rebuilding the brand' },
  { id:'earhart-1937', person:'Amelia Earhart', year:1937, age:39, occupation:'aviator author public pioneer', wealth:'comfortable', relationshipStatus:'married', visibility:'global', eventCategory:'aviation disappearance', direct:51, classic:15, directReduced:6, classicReduced:6, domains:d({travel:.98, security:.95, health:.92, publicVisibility:.82, legacy:.9, leadership:.62}), eventIntensity:100, outcome:'legacy', narrative:'A glamorous public mission carried a severe warrior-danger signature.', falsePositives:['15/6 glamour did not warn enough; 51/6 carried the danger.'], decisions:['pursued bold circumnavigation','accepted extreme travel risk'], personalityShift:'daring, mission-identified, publicly heroic', protectiveLesson:'in danger compounds, mission nobility must not override safety redundancy' },
  { id:'einstein-1915', person:'Albert Einstein', year:1915, age:36, occupation:'physicist professor', wealth:'modest', relationshipStatus:'married', visibility:'public', eventCategory:'general relativity scientific breakthrough', direct:33, classic:15, directReduced:33, classicReduced:6, domains:d({creativeOutput:.98, education:.95, legacy:.95, reputation:.82, publicVisibility:.62, spirituality:.58}), eventIntensity:94, outcome:'legacy', narrative:'A master-teacher year turned scientific work into instruction for the century.', falsePositives:['15/6 charm is secondary; 33/33 is the decisive signature.'], decisions:['completed a demanding theoretical framework'], personalityShift:'absorbed, visionary, intellectually sovereign', protectiveLesson:'master teaching needs bodily and domestic grounding' },
  { id:'einstein-1905', person:'Albert Einstein', year:1905, age:26, occupation:'patent clerk physicist', wealth:'modest', relationshipStatus:'married', visibility:'private', eventCategory:'annus mirabilis publications', direct:32, classic:14, directReduced:5, classicReduced:5, domains:d({creativeOutput:.98, education:.95, reputation:.72, publicVisibility:.55, legacy:.92}), eventIntensity:95, outcome:'legacy', narrative:'Independent judgment and publication created unexpected power.', falsePositives:['The year looked private at the time; historical visibility came later.'], decisions:['published despite low institutional status'], personalityShift:'independent, mentally mobile, quietly audacious', protectiveLesson:'trust original judgment but document the work clearly' },
  { id:'curie-1911', person:'Marie Curie', year:1911, age:44, occupation:'scientist professor', wealth:'modest', relationshipStatus:'widowed', visibility:'global', eventCategory:'Nobel prize scandal public hostility', direct:30, classic:12, directReduced:3, classicReduced:3, domains:d({creativeOutput:.88, reputation:.92, publicVisibility:.86, relationships:.68, education:.86, legacy:.78}), eventIntensity:88, outcome:'mixed', narrative:'Intellectual achievement coexisted with public sacrifice and scandal.', falsePositives:['30/3 alone sounds too detached; 12/3 explains the emotional/public cost.'], decisions:['continued scientific work under public hostility'], personalityShift:'more isolated, stoic, intellectually defended', protectiveLesson:'protect private dignity when public achievement draws appetite' },
  { id:'malcolm-1965', person:'Malcolm X', year:1965, age:39, occupation:'activist minister speaker', wealth:'modest', relationshipStatus:'married', visibility:'global', eventCategory:'assassination factional conflict', direct:45, classic:18, directReduced:9, classicReduced:9, domains:d({competition:.95, security:.95, publicVisibility:.86, reputation:.82, legacy:.9, law:.55}), eventIntensity:100, outcome:'legacy', narrative:'Completion occurred through factional conflict and violent public danger.', falsePositives:['45/9 success language underplayed the lethal opposition; 18/9 carried the conflict field.'], decisions:['continued public mission despite threats'], personalityShift:'urgent, transformed, morally sharpened', protectiveLesson:'when 18/9 dominates, ideological conflict must be treated as physical risk' },
  { id:'ali-1964', person:'Muhammad Ali', year:1964, age:22, occupation:'boxer public figure', wealth:'comfortable', relationshipStatus:'single', visibility:'global', eventCategory:'championship identity revelation', direct:38, classic:11, directReduced:11, classicReduced:11, domains:d({leadership:.82, publicVisibility:.94, competition:.96, reputation:.9, spirituality:.62}), eventIntensity:92, outcome:'triumph', narrative:'A visionary public identity emerged through a literal contest of strength.', falsePositives:['38/2 can be betrayal-prone, but classic 11/2 contained the lion.'], decisions:['claimed title','declared a new religious/public identity'], personalityShift:'electric, provocative, symbolically charged', protectiveLesson:'vision must be grounded before public reaction defines it' },
  { id:'ali-1967', person:'Muhammad Ali', year:1967, age:25, occupation:'boxer activist', wealth:'comfortable', relationshipStatus:'married', visibility:'global', eventCategory:'draft refusal conviction title loss', direct:41, classic:14, directReduced:5, classicReduced:5, domains:d({law:.92, publicVisibility:.9, competition:.78, reputation:.82, spirituality:.72, career:.75}), eventIntensity:92, outcome:'mixed', narrative:'Freedom, conscience, law, and public voice collided.', falsePositives:['14/5 does not say law as directly as 28/1, but the freedom conflict was exact.'], decisions:['refused induction','accepted career loss for conscience'], personalityShift:'principled, defiant, less negotiable', protectiveLesson:'freedom decisions need legal strategy before the moral stand becomes public' },
  { id:'elizabeth-1952', person:'Elizabeth II', year:1952, age:26, occupation:'monarch', wealth:'institutional', relationshipStatus:'married', visibility:'global', eventCategory:'accession through family death', direct:42, classic:15, directReduced:6, classicReduced:6, domains:d({leadership:.9, family:.92, service:.9, publicVisibility:.86, legacy:.82, home:.58}), eventIntensity:92, outcome:'transition', narrative:'Duty and public affection began through family loss.', falsePositives:['15/6 glamour alone misses the solemn burden.'], decisions:['accepted lifelong role immediately'], personalityShift:'more dutiful, contained, ceremonial', protectiveLesson:'service roles need private support systems' },
  { id:'elizabeth-2022', person:'Elizabeth II', year:2022, age:96, occupation:'monarch', wealth:'institutional', relationshipStatus:'widowed', visibility:'global', eventCategory:'jubilee death succession', direct:31, classic:13, directReduced:4, classicReduced:4, domains:d({legacy:.98, family:.86, publicVisibility:.92, health:.9, service:.78, home:.75}), eventIntensity:98, outcome:'legacy', narrative:'An isolated late-life foundation year became literal death and institutional rebirth.', falsePositives:['31/4 solitude was only partial; 13/4 explained succession.'], decisions:['completed public service at elder threshold'], personalityShift:'withdrawn, symbolic, legacy-contained', protectiveLesson:'elder 13/4 should prioritize health, succession, and institutional continuity' },
  { id:'kobe-2020', person:'Kobe Bryant', year:2020, age:41, occupation:'athlete entrepreneur storyteller', wealth:'wealthy', relationshipStatus:'married', visibility:'global', eventCategory:'fatal helicopter crash legacy mourning', direct:35, classic:17, directReduced:8, classicReduced:8, domains:d({security:.95, travel:.9, health:.95, legacy:.96, publicVisibility:.88, relationships:.72}), eventIntensity:100, outcome:'legacy', narrative:'Association/travel danger intersected with a strong immortality-of-name signature.', falsePositives:['17/8 explains legacy but not the accident mechanism.'], decisions:['routine travel in a high-risk vehicle context'], personalityShift:'posthumously mythic, family/legacy-centered', protectiveLesson:'when 35/8 appears with travel, verify the carrier not just the destination' },
  { id:'gandhi-1947', person:'Mahatma Gandhi', year:1947, age:78, occupation:'spiritual political leader', wealth:'modest', relationshipStatus:'married', visibility:'global', eventCategory:'independence partition peace work', direct:33, classic:6, directReduced:33, classicReduced:6, domains:d({service:.98, legacy:.95, publicVisibility:.9, spirituality:.92, competition:.72, health:.58}), eventIntensity:98, outcome:'mixed', narrative:'Master-teacher service operated inside national completion and communal trauma.', falsePositives:['33/33 sounds benefic; history shows service can occur inside catastrophe.'], decisions:['prioritized peace over celebration','used fasting and presence as moral tools'], personalityShift:'austere, compassionate, burdened', protectiveLesson:'master service requires protection from martyrdom and exhaustion' },
  { id:'darwin-1859', person:'Charles Darwin', year:1859, age:50, occupation:'naturalist writer scientist', wealth:'comfortable', relationshipStatus:'married', visibility:'public', eventCategory:'publication controversy scientific legacy', direct:37, classic:10, directReduced:1, classicReduced:1, domains:d({creativeOutput:.96, publicVisibility:.82, reputation:.86, education:.94, relationships:.58, legacy:.94}), eventIntensity:93, outcome:'legacy', narrative:'Collaborative support helped launch a world-changing public work.', falsePositives:['37/1 partnership is less famous than the book, but it enabled the launch.'], decisions:['published when pressured by parallel discovery'], personalityShift:'reluctantly public, intellectually decisive', protectiveLesson:'when reputation will change, prepare the supporting network before release' },
];
 
const EXPANDED_HISTORICAL_CASES: HistoricalCase[] = [
  { id:'lincoln-1860', person:'Abraham Lincoln', year:1860, age:51, occupation:'lawyer politician president', wealth:'comfortable', relationshipStatus:'married', visibility:'global', eventCategory:'election to U.S. presidency before civil war', direct:29, classic:11, directReduced:11, classicReduced:11, domains:d({leadership:.94, publicVisibility:.9, competition:.82, reputation:.82, law:.58, legacy:.65}), eventIntensity:92, outcome:'triumph', narrative:'A national leadership rise occurred inside extreme sectional conflict.', falsePositives:['Expanded library seed; verify against detailed biography before treating as decisive analogue.'], decisions:['accepted nomination and national contest', 'framed leadership as moral union preservation'], personalityShift:'grave, strategic, morally burdened', protectiveLesson:'A leadership victory can immediately become a crisis-management mandate.' },
  { id:'lincoln-1865', person:'Abraham Lincoln', year:1865, age:56, occupation:'president wartime leader', wealth:'comfortable', relationshipStatus:'married', visibility:'global', eventCategory:'assassination after civil war victory', direct:34, classic:7, directReduced:7, classicReduced:7, domains:d({security:.96, health:.9, legacy:.9, publicVisibility:.82, competition:.75, reputation:.78}), eventIntensity:95, outcome:'legacy', narrative:'Victory and martyrdom fused at the close of a national ordeal.', falsePositives:['Expanded library seed; verify against detailed biography before treating as decisive analogue.'], decisions:['pursued reunion after victory'], personalityShift:'merciful, exhausted, historically symbolic', protectiveLesson:'When security risk is high, triumph does not remove exposure.' },
  { id:'napoleon-1796', person:'Napoleon Bonaparte', year:1796, age:27, occupation:'general statesman', wealth:'comfortable', relationshipStatus:'married', visibility:'global', eventCategory:'Italian campaign and rise through military command', direct:46, classic:19, directReduced:1, classicReduced:1, domains:d({leadership:.94, publicVisibility:.9, competition:.82, reputation:.82, law:.58, legacy:.65}), eventIntensity:92, outcome:'triumph', narrative:'Youthful military command created romantic public ascent and strategic dominance.', falsePositives:['Expanded library seed; verify against detailed biography before treating as decisive analogue.'], decisions:['accepted command in Italy', 'joined ambition with marriage alliance'], personalityShift:'audacious, rapid, destiny-charged', protectiveLesson:'A young ascent compound often manifests as conquest before it becomes governance.' },
  { id:'napoleon-1815', person:'Napoleon Bonaparte', year:1815, age:46, occupation:'emperor general', wealth:'institutional', relationshipStatus:'married', visibility:'global', eventCategory:'Waterloo defeat and final exile', direct:38, classic:20, directReduced:11, classicReduced:2, domains:d({leadership:.82, law:.78, competition:.78, publicVisibility:.82, reputation:.72, security:.55}), eventIntensity:86, outcome:'loss', narrative:'A returning vision collapsed under coalition pressure and exhausted logistics.', falsePositives:['Expanded library seed; verify against detailed biography before treating as decisive analogue.'], decisions:['returned from exile', 'risked final military decision'], personalityShift:'urgent, inflated, cornered', protectiveLesson:'Visionary comeback requires more structure than charisma.' },
  { id:'washington-1789', person:'George Washington', year:1789, age:57, occupation:'general president planter', wealth:'wealthy', relationshipStatus:'married', visibility:'global', eventCategory:'first U.S. presidency', direct:49, classic:13, directReduced:4, classicReduced:4, domains:d({leadership:.94, publicVisibility:.9, competition:.82, reputation:.82, law:.58, legacy:.65}), eventIntensity:92, outcome:'triumph', narrative:'Personal authority became institutional founding authority.', falsePositives:['Expanded library seed; verify against detailed biography before treating as decisive analogue.'], decisions:['accepted presidency reluctantly', 'converted reputation into office'], personalityShift:'restrained, duty-bound, precedent-aware', protectiveLesson:'Founding power works best when ego is subordinated to structure.' },
  { id:'jfk-1960', person:'John F. Kennedy', year:1960, age:43, occupation:'politician president', wealth:'wealthy', relationshipStatus:'married', visibility:'global', eventCategory:'elected U.S. president', direct:50, classic:23, directReduced:5, classicReduced:5, domains:d({leadership:.94, publicVisibility:.9, competition:.82, reputation:.82, law:.58, legacy:.65}), eventIntensity:92, outcome:'triumph', narrative:'Youthful public charisma converted into executive office.', falsePositives:['Expanded library seed; verify against detailed biography before treating as decisive analogue.'], decisions:['used televised image and coalition strategy'], personalityShift:'magnetic, competitive, media-conscious', protectiveLesson:'Public image can become a governing asset but also a vulnerability.' },
  { id:'jfk-1963', person:'John F. Kennedy', year:1963, age:46, occupation:'president', wealth:'wealthy', relationshipStatus:'married', visibility:'global', eventCategory:'assassination in Dallas', direct:53, classic:17, directReduced:8, classicReduced:8, domains:d({security:.96, health:.9, legacy:.9, publicVisibility:.82, competition:.75, reputation:.78}), eventIntensity:95, outcome:'legacy', narrative:'Public office became fatal exposure and enduring myth.', falsePositives:['Expanded library seed; verify against detailed biography before treating as decisive analogue.'], decisions:['continued public travel amid threat climate'], personalityShift:'visible, symbolic, exposed', protectiveLesson:'Legacy signatures must still be checked against physical security.' },
  { id:'reagan-1981', person:'Ronald Reagan', year:1981, age:70, occupation:'president actor politician', wealth:'wealthy', relationshipStatus:'married', visibility:'global', eventCategory:'assassination attempt and recovery', direct:27, classic:9, directReduced:9, classicReduced:9, domains:d({security:.96, health:.9, legacy:.9, publicVisibility:.82, competition:.75, reputation:.78}), eventIntensity:95, outcome:'mixed', narrative:'A public leadership year carried literal danger yet strengthened political mythology.', falsePositives:['Expanded library seed; verify against detailed biography before treating as decisive analogue.'], decisions:['continued presidency after shooting'], personalityShift:'buoyant, resilient, performative', protectiveLesson:'Danger can reinforce authority if recovery becomes part of the public story.' },
  { id:'fdr-1933', person:'Franklin D. Roosevelt', year:1933, age:51, occupation:'president politician', wealth:'wealthy', relationshipStatus:'married', visibility:'global', eventCategory:'inauguration and New Deal during Depression', direct:47, classic:11, directReduced:11, classicReduced:11, domains:d({leadership:.82, law:.78, competition:.78, publicVisibility:.82, reputation:.72, security:.55}), eventIntensity:86, outcome:'transition', narrative:'A crisis of money and confidence became a mandate for structural reform.', falsePositives:['Expanded library seed; verify against detailed biography before treating as decisive analogue.'], decisions:['launched emergency banking and New Deal programs'], personalityShift:'commanding, experimental, reassuring', protectiveLesson:'Material crisis requires visible executive experimentation.' },
  { id:'thatcher-1979', person:'Margaret Thatcher', year:1979, age:54, occupation:'prime minister politician', wealth:'comfortable', relationshipStatus:'married', visibility:'global', eventCategory:'became UK prime minister', direct:49, classic:13, directReduced:4, classicReduced:4, domains:d({leadership:.94, publicVisibility:.9, competition:.82, reputation:.82, law:.58, legacy:.65}), eventIntensity:92, outcome:'triumph', narrative:'A hard ideological leadership identity entered formal power.', falsePositives:['Expanded library seed; verify against detailed biography before treating as decisive analogue.'], decisions:['accepted confrontational reform mandate'], personalityShift:'unyielding, ideological, executive', protectiveLesson:'When leadership rises through conflict, softness becomes less available.' },
  { id:'thatcher-1990', person:'Margaret Thatcher', year:1990, age:65, occupation:'prime minister', wealth:'comfortable', relationshipStatus:'married', visibility:'global', eventCategory:'resignation after party challenge', direct:42, classic:6, directReduced:6, classicReduced:6, domains:d({leadership:.82, law:.78, competition:.78, publicVisibility:.82, reputation:.72, security:.55}), eventIntensity:86, outcome:'loss', narrative:'Long authority met internal opposition and forced exit.', falsePositives:['Expanded library seed; verify against detailed biography before treating as decisive analogue.'], decisions:['resisted challenge before resigning'], personalityShift:'defiant, isolated, embattled', protectiveLesson:'Power compounds fail when allies become the opposition.' },
  { id:'merkel-2005', person:'Angela Merkel', year:2005, age:51, occupation:'scientist politician chancellor', wealth:'comfortable', relationshipStatus:'married', visibility:'global', eventCategory:'became German chancellor', direct:31, classic:22, directReduced:4, classicReduced:22, domains:d({leadership:.94, publicVisibility:.9, competition:.82, reputation:.82, law:.58, legacy:.65}), eventIntensity:92, outcome:'triumph', narrative:'Methodical authority emerged through coalition complexity.', falsePositives:['Expanded library seed; verify against detailed biography before treating as decisive analogue.'], decisions:['negotiated coalition path to office'], personalityShift:'patient, strategic, understated', protectiveLesson:'Quiet power often wins through structure rather than spectacle.' },
  { id:'zelenskyy-2019', person:'Volodymyr Zelenskyy', year:2019, age:41, occupation:'actor president politician', wealth:'comfortable', relationshipStatus:'married', visibility:'global', eventCategory:'elected president of Ukraine', direct:38, classic:11, directReduced:11, classicReduced:11, domains:d({leadership:.94, publicVisibility:.9, competition:.82, reputation:.82, law:.58, legacy:.65}), eventIntensity:92, outcome:'triumph', narrative:'A media identity transformed into national leadership.', falsePositives:['Expanded library seed; verify against detailed biography before treating as decisive analogue.'], decisions:['converted outsider image into mandate'], personalityShift:'communicative, insurgent, adaptive', protectiveLesson:'Creative visibility can become political authority when the public wants rupture.' },
  { id:'zelenskyy-2022', person:'Volodymyr Zelenskyy', year:2022, age:44, occupation:'wartime president communicator', wealth:'comfortable', relationshipStatus:'married', visibility:'global', eventCategory:'wartime leadership after invasion', direct:32, classic:14, directReduced:5, classicReduced:5, domains:d({leadership:.82, law:.78, competition:.78, publicVisibility:.82, reputation:.72, security:.55}), eventIntensity:92, outcome:'legacy', narrative:'Public communication became survival strategy under existential threat.', falsePositives:['Expanded library seed; verify against detailed biography before treating as decisive analogue.'], decisions:['remained in capital', 'used direct media appeals'], personalityShift:'defiant, symbolic, urgent', protectiveLesson:'In crisis, presence can become a weapon stronger than office.' },
  { id:'gorbachev-1985', person:'Mikhail Gorbachev', year:1985, age:54, occupation:'politician reformer', wealth:'comfortable', relationshipStatus:'married', visibility:'global', eventCategory:'became Soviet leader and began reform era', direct:28, classic:10, directReduced:1, classicReduced:1, domains:d({leadership:.94, publicVisibility:.9, competition:.82, reputation:.82, law:.58, legacy:.65}), eventIntensity:86, outcome:'transition', narrative:'Institutional power opened a reform process that changed history.', falsePositives:['Expanded library seed; verify against detailed biography before treating as decisive analogue.'], decisions:['accepted leadership', 'initiated reform language'], personalityShift:'reformist, conciliatory, risk-taking', protectiveLesson:'A reform year can destabilize the very structure it tries to save.' },
  { id:'walesa-1980', person:'Lech Walesa', year:1980, age:37, occupation:'electrician union leader president', wealth:'modest', relationshipStatus:'married', visibility:'global', eventCategory:'Solidarity strike leadership', direct:56, classic:29, directReduced:11, classicReduced:11, domains:d({leadership:.82, law:.78, competition:.78, publicVisibility:.82, reputation:.72, security:.55}), eventIntensity:86, outcome:'transition', narrative:'Worker leadership became national opposition and moral authority.', falsePositives:['Expanded library seed; verify against detailed biography before treating as decisive analogue.'], decisions:['led strikes', 'formalized collective demands'], personalityShift:'stubborn, charismatic, movement-oriented', protectiveLesson:'Collective pressure needs disciplined negotiation to become historical change.' },
  { id:'suu-kyi-1991', person:'Aung San Suu Kyi', year:1991, age:46, occupation:'politician activist', wealth:'comfortable', relationshipStatus:'married', visibility:'global', eventCategory:'Nobel Peace Prize while under house arrest', direct:45, classic:18, directReduced:9, classicReduced:9, domains:d({service:.94, legacy:.86, publicVisibility:.78, spirituality:.76, health:.48, relationships:.45}), eventIntensity:86, outcome:'mixed', narrative:'Moral authority rose while personal freedom was restricted.', falsePositives:['Expanded library seed; verify against detailed biography before treating as decisive analogue.'], decisions:['accepted symbolic role under confinement'], personalityShift:'patient, sacrificial, internationally visible', protectiveLesson:'Recognition can arrive while the body remains constrained.' },
  { id:'bhutto-1988', person:'Benazir Bhutto', year:1988, age:35, occupation:'prime minister politician', wealth:'wealthy', relationshipStatus:'married', visibility:'global', eventCategory:'became Pakistan prime minister', direct:53, classic:17, directReduced:8, classicReduced:8, domains:d({leadership:.94, publicVisibility:.9, competition:.82, reputation:.82, law:.58, legacy:.65}), eventIntensity:92, outcome:'triumph', narrative:'Dynastic loss and public leadership converted into historic office.', falsePositives:['Expanded library seed; verify against detailed biography before treating as decisive analogue.'], decisions:['returned to electoral politics', 'formed government'], personalityShift:'bold, symbolic, exposed', protectiveLesson:'Historic leadership firsts carry both mandate and threat.' },
  { id:'indira-1984', person:'Indira Gandhi', year:1984, age:67, occupation:'prime minister', wealth:'institutional', relationshipStatus:'widowed', visibility:'global', eventCategory:'assassination after political and security crisis', direct:52, classic:16, directReduced:7, classicReduced:7, domains:d({security:.96, health:.9, legacy:.9, publicVisibility:.82, competition:.75, reputation:.78}), eventIntensity:95, outcome:'legacy', narrative:'Authority, conflict and security failure converged violently.', falsePositives:['Expanded library seed; verify against detailed biography before treating as decisive analogue.'], decisions:['held power through crisis'], personalityShift:'hardened, embattled, polarizing', protectiveLesson:'Security cannot be separated from political consequence.' },
  { id:'golda-1969', person:'Golda Meir', year:1969, age:71, occupation:'prime minister politician', wealth:'modest', relationshipStatus:'widowed', visibility:'global', eventCategory:'became prime minister of Israel', direct:33, classic:15, directReduced:33, classicReduced:6, domains:d({leadership:.94, publicVisibility:.9, competition:.82, reputation:.82, law:.58, legacy:.65}), eventIntensity:92, outcome:'triumph', narrative:'Elder service and political authority became national leadership.', falsePositives:['Expanded library seed; verify against detailed biography before treating as decisive analogue.'], decisions:['accepted leadership late in life'], personalityShift:'maternal, severe, duty-bound', protectiveLesson:'Late-life power often manifests as duty more than ambition.' },
  { id:'queen-victoria-1837', person:'Queen Victoria', year:1837, age:18, occupation:'monarch', wealth:'institutional', relationshipStatus:'single', visibility:'global', eventCategory:'accession to British throne', direct:48, classic:12, directReduced:3, classicReduced:3, domains:d({leadership:.88, family:.84, service:.82, publicVisibility:.84, legacy:.84, home:.62}), eventIntensity:86, outcome:'transition', narrative:'Youthful monarchy became a long institutional identity.', falsePositives:['Expanded library seed; verify against detailed biography before treating as decisive analogue.'], decisions:['accepted crown at young age'], personalityShift:'dutiful, formative, watched', protectiveLesson:'Royal transition compounds bind private identity to public office.' },
  { id:'charles-2022', person:'Charles III', year:2022, age:74, occupation:'monarch', wealth:'institutional', relationshipStatus:'married', visibility:'global', eventCategory:'accession after death of Elizabeth II', direct:31, classic:13, directReduced:4, classicReduced:4, domains:d({leadership:.88, family:.84, service:.82, publicVisibility:.84, legacy:.84, home:.62}), eventIntensity:86, outcome:'transition', narrative:'A lifelong waiting role became sovereign duty through bereavement.', falsePositives:['Expanded library seed; verify against detailed biography before treating as decisive analogue.'], decisions:['accepted accession after succession'], personalityShift:'solemn, legacy-conscious, restrained', protectiveLesson:'Delayed destiny often arrives as grief plus responsibility.' },
  { id:'john-paul-1978', person:'Pope John Paul II', year:1978, age:58, occupation:'pope religious leader', wealth:'modest', relationshipStatus:'single', visibility:'global', eventCategory:'elected pope', direct:48, classic:21, directReduced:3, classicReduced:3, domains:d({service:.94, legacy:.86, publicVisibility:.78, spirituality:.76, health:.48, relationships:.45}), eventIntensity:92, outcome:'triumph', narrative:'Spiritual leadership became global public authority.', falsePositives:['Expanded library seed; verify against detailed biography before treating as decisive analogue.'], decisions:['accepted papacy', 'became international religious symbol'], personalityShift:'charismatic, pastoral, geopolitical', protectiveLesson:'Service compounds can carry enormous public power.' },
  { id:'pope-francis-2013', person:'Pope Francis', year:2013, age:77, occupation:'pope religious leader', wealth:'modest', relationshipStatus:'single', visibility:'global', eventCategory:'elected pope', direct:35, classic:17, directReduced:8, classicReduced:8, domains:d({service:.94, legacy:.86, publicVisibility:.78, spirituality:.76, health:.48, relationships:.45}), eventIntensity:92, outcome:'triumph', narrative:'A humility-centered identity entered global spiritual office.', falsePositives:['Expanded library seed; verify against detailed biography before treating as decisive analogue.'], decisions:['accepted papacy', 'signaled reform through simplicity'], personalityShift:'humble, reformist, pastoral', protectiveLesson:'Symbolic gestures can define institutional direction.' },
  { id:'newton-1687', person:'Isaac Newton', year:1687, age:44, occupation:'mathematician physicist', wealth:'comfortable', relationshipStatus:'single', visibility:'global', eventCategory:'publication of Principia', direct:27, classic:9, directReduced:9, classicReduced:9, domains:d({creativeOutput:.94, education:.92, legacy:.88, reputation:.78, publicVisibility:.58, career:.72}), eventIntensity:92, outcome:'legacy', narrative:'A theoretical structure became one of science’s foundations.', falsePositives:['Expanded library seed; verify against detailed biography before treating as decisive analogue.'], decisions:['completed and published mathematical synthesis'], personalityShift:'concentrated, solitary, exacting', protectiveLesson:'Foundation years in science reward total intellectual architecture.' },
  { id:'galileo-1633', person:'Galileo Galilei', year:1633, age:69, occupation:'astronomer physicist', wealth:'comfortable', relationshipStatus:'unknown', visibility:'global', eventCategory:'trial by Inquisition', direct:30, classic:12, directReduced:3, classicReduced:3, domains:d({law:.92, reputation:.88, publicVisibility:.84, relationships:.62, security:.48}), eventIntensity:86, outcome:'loss', narrative:'Scientific conviction collided with institutional law and public recantation.', falsePositives:['Expanded library seed; verify against detailed biography before treating as decisive analogue.'], decisions:['defended heliocentric ideas under pressure'], personalityShift:'defiant, cornered, intellectually committed', protectiveLesson:'Truth claims require strategy when institutions control judgment.' },
  { id:'ada-1843', person:'Ada Lovelace', year:1843, age:28, occupation:'mathematician writer', wealth:'comfortable', relationshipStatus:'married', visibility:'global', eventCategory:'published notes on analytical engine', direct:38, classic:11, directReduced:11, classicReduced:11, domains:d({creativeOutput:.94, education:.92, legacy:.88, reputation:.78, publicVisibility:.58, career:.72}), eventIntensity:92, outcome:'legacy', narrative:'Visionary computation entered history through annotated explanation.', falsePositives:['Expanded library seed; verify against detailed biography before treating as decisive analogue.'], decisions:['translated and expanded Menabrea paper'], personalityShift:'imaginative, analytical, ahead of time', protectiveLesson:'Commentary can become invention when vision exceeds the apparatus.' },
  { id:'turing-1936', person:'Alan Turing', year:1936, age:24, occupation:'mathematician computer scientist', wealth:'modest', relationshipStatus:'single', visibility:'global', eventCategory:'computable numbers paper', direct:48, classic:12, directReduced:3, classicReduced:3, domains:d({creativeOutput:.94, education:.92, legacy:.88, reputation:.78, publicVisibility:.58, career:.72}), eventIntensity:92, outcome:'legacy', narrative:'Abstract logic created a foundation for computing.', falsePositives:['Expanded library seed; verify against detailed biography before treating as decisive analogue.'], decisions:['published theoretical model'], personalityShift:'precise, original, solitary', protectiveLesson:'Private intellectual clarity may become public infrastructure later.' },
  { id:'turing-1952', person:'Alan Turing', year:1952, age:40, occupation:'mathematician computer scientist', wealth:'modest', relationshipStatus:'single', visibility:'public', eventCategory:'conviction and chemical castration', direct:46, classic:19, directReduced:1, classicReduced:1, domains:d({law:.92, reputation:.88, publicVisibility:.84, relationships:.62, security:.48}), eventIntensity:86, outcome:'loss', narrative:'Law and social prejudice damaged a brilliant life.', falsePositives:['Expanded library seed; verify against detailed biography before treating as decisive analogue.'], decisions:['faced prosecution', 'accepted treatment under coercion'], personalityShift:'exposed, wounded, isolated', protectiveLesson:'Legal/social climates can turn private identity into public penalty.' },
  { id:'katherine-johnson-1969', person:'Katherine Johnson', year:1969, age:51, occupation:'mathematician NASA scientist', wealth:'modest', relationshipStatus:'married', visibility:'global', eventCategory:'Apollo 11 calculations', direct:59, classic:23, directReduced:5, classicReduced:5, domains:d({creativeOutput:.94, education:.92, legacy:.88, reputation:.78, publicVisibility:.58, career:.72}), eventIntensity:92, outcome:'legacy', narrative:'Hidden technical mastery supported a public moon triumph.', falsePositives:['Expanded library seed; verify against detailed biography before treating as decisive analogue.'], decisions:['performed mission-critical calculations'], personalityShift:'precise, service-oriented, quietly authoritative', protectiveLesson:'Service behind the stage can carry historic weight.' },
  { id:'goodall-1960', person:'Jane Goodall', year:1960, age:26, occupation:'primatologist conservationist', wealth:'modest', relationshipStatus:'single', visibility:'global', eventCategory:'began Gombe chimpanzee research', direct:23, classic:14, directReduced:5, classicReduced:5, domains:d({creativeOutput:.94, education:.92, legacy:.88, reputation:.78, publicVisibility:.58, career:.72}), eventIntensity:92, outcome:'legacy', narrative:'Field observation opened a lifelong scientific path.', falsePositives:['Expanded library seed; verify against detailed biography before treating as decisive analogue.'], decisions:['entered field research', 'trusted observation over convention'], personalityShift:'patient, curious, immersed', protectiveLesson:'A quiet beginning may become the whole life’s authority.' },
  { id:'hawking-1988', person:'Stephen Hawking', year:1988, age:46, occupation:'physicist author', wealth:'comfortable', relationshipStatus:'married', visibility:'global', eventCategory:'A Brief History of Time published', direct:35, classic:17, directReduced:8, classicReduced:8, domains:d({creativeOutput:.92, education:.82, reputation:.82, legacy:.82, publicVisibility:.72}), eventIntensity:92, outcome:'legacy', narrative:'Difficult science became global public communication.', falsePositives:['Expanded library seed; verify against detailed biography before treating as decisive analogue.'], decisions:['translated theory for broad audience'], personalityShift:'witty, resilient, explanatory', protectiveLesson:'Communication can turn specialist authority into cultural legacy.' },
  { id:'franklin-1952', person:'Rosalind Franklin', year:1952, age:32, occupation:'chemist crystallographer', wealth:'modest', relationshipStatus:'single', visibility:'global', eventCategory:'Photo 51 DNA evidence', direct:49, classic:22, directReduced:4, classicReduced:22, domains:d({creativeOutput:.94, education:.92, legacy:.88, reputation:.78, publicVisibility:.58, career:.72}), eventIntensity:92, outcome:'legacy', narrative:'Precise unseen work became central to a later public discovery story.', falsePositives:['Expanded library seed; verify against detailed biography before treating as decisive analogue.'], decisions:['produced critical x-ray image'], personalityShift:'disciplined, exacting, undercredited', protectiveLesson:'Credit protection matters when work is valuable before it is recognized.' },
  { id:'carson-1962', person:'Rachel Carson', year:1962, age:55, occupation:'writer marine biologist', wealth:'modest', relationshipStatus:'single', visibility:'global', eventCategory:'Silent Spring published', direct:50, classic:23, directReduced:5, classicReduced:5, domains:d({creativeOutput:.92, education:.82, reputation:.82, legacy:.82, publicVisibility:.72}), eventIntensity:92, outcome:'legacy', narrative:'Scientific writing triggered environmental public reckoning.', falsePositives:['Expanded library seed; verify against detailed biography before treating as decisive analogue.'], decisions:['published warning against pesticide harm'], personalityShift:'courageous, careful, morally urgent', protectiveLesson:'Evidence becomes power when written for public conscience.' },
  { id:'sagan-1980', person:'Carl Sagan', year:1980, age:46, occupation:'astronomer communicator', wealth:'comfortable', relationshipStatus:'married', visibility:'global', eventCategory:'Cosmos television series', direct:38, classic:20, directReduced:11, classicReduced:2, domains:d({creativeOutput:.92, education:.82, reputation:.82, legacy:.82, publicVisibility:.72}), eventIntensity:92, outcome:'legacy', narrative:'Science communication became mass cultural imagination.', falsePositives:['Expanded library seed; verify against detailed biography before treating as decisive analogue.'], decisions:['took science to television'], personalityShift:'expansive, poetic, explanatory', protectiveLesson:'Public wonder can be a serious intellectual tool.' },
  { id:'berners-lee-1989', person:'Tim Berners-Lee', year:1989, age:34, occupation:'computer scientist inventor', wealth:'comfortable', relationshipStatus:'married', visibility:'global', eventCategory:'World Wide Web proposal', direct:41, classic:23, directReduced:5, classicReduced:5, domains:d({money:.86, career:.88, leadership:.74, creativeOutput:.72, publicVisibility:.62, legacy:.75}), eventIntensity:92, outcome:'legacy', narrative:'A technical information architecture became a global system.', falsePositives:['Expanded library seed; verify against detailed biography before treating as decisive analogue.'], decisions:['proposed web architecture'], personalityShift:'practical, open, systems-minded', protectiveLesson:'Quiet technical design can reorganize civilization.' },
  { id:'wozniak-1976', person:'Steve Wozniak', year:1976, age:26, occupation:'engineer inventor entrepreneur', wealth:'comfortable', relationshipStatus:'married', visibility:'global', eventCategory:'Apple I and Apple founding', direct:42, classic:15, directReduced:6, classicReduced:6, domains:d({money:.86, career:.88, leadership:.74, creativeOutput:.72, publicVisibility:.62, legacy:.75}), eventIntensity:92, outcome:'triumph', narrative:'Engineering creativity became a business seed.', falsePositives:['Expanded library seed; verify against detailed biography before treating as decisive analogue.'], decisions:['built Apple I', 'co-founded Apple'], personalityShift:'playful, inventive, generous', protectiveLesson:'Invention needs a vehicle to reach history.' },
  { id:'gates-1975', person:'Bill Gates', year:1975, age:20, occupation:'software entrepreneur', wealth:'wealthy', relationshipStatus:'single', visibility:'global', eventCategory:'Microsoft founded', direct:60, classic:15, directReduced:6, classicReduced:6, domains:d({money:.86, career:.88, leadership:.74, creativeOutput:.72, publicVisibility:.62, legacy:.75}), eventIntensity:92, outcome:'triumph', narrative:'Youthful technical ambition became a company platform.', falsePositives:['Expanded library seed; verify against detailed biography before treating as decisive analogue.'], decisions:['left conventional path', 'founded software business'], personalityShift:'competitive, strategic, opportunistic', protectiveLesson:'Early platform choices can define decades of money and power.' },
  { id:'zuckerberg-2004', person:'Mark Zuckerberg', year:2004, age:20, occupation:'technology entrepreneur', wealth:'wealthy', relationshipStatus:'single', visibility:'global', eventCategory:'Facebook launched', direct:25, classic:16, directReduced:7, classicReduced:7, domains:d({money:.86, career:.88, leadership:.74, creativeOutput:.72, publicVisibility:.62, legacy:.75}), eventIntensity:92, outcome:'triumph', narrative:'A campus product became a social platform.', falsePositives:['Expanded library seed; verify against detailed biography before treating as decisive analogue.'], decisions:['launched Facebook', 'scaled network rapidly'], personalityShift:'fast, coded, socially disruptive', protectiveLesson:'Network effects reward speed but create later governance debt.' },
  { id:'bezos-1994', person:'Jeff Bezos', year:1994, age:30, occupation:'entrepreneur investor', wealth:'wealthy', relationshipStatus:'married', visibility:'global', eventCategory:'Amazon founded', direct:36, classic:9, directReduced:9, classicReduced:9, domains:d({money:.86, career:.88, leadership:.74, creativeOutput:.72, publicVisibility:.62, legacy:.75}), eventIntensity:92, outcome:'triumph', narrative:'A business risk became an infrastructure empire seed.', falsePositives:['Expanded library seed; verify against detailed biography before treating as decisive analogue.'], decisions:['left finance job', 'founded online bookstore'], personalityShift:'calculating, expansion-minded, relentless', protectiveLesson:'The right risk taken early can become a platform.' },
  { id:'jack-ma-1999', person:'Jack Ma', year:1999, age:35, occupation:'entrepreneur teacher', wealth:'wealthy', relationshipStatus:'married', visibility:'global', eventCategory:'Alibaba founded', direct:47, classic:11, directReduced:11, classicReduced:11, domains:d({money:.86, career:.88, leadership:.74, creativeOutput:.72, publicVisibility:.62, legacy:.75}), eventIntensity:92, outcome:'triumph', narrative:'Persuasive vision gathered a business ecosystem.', falsePositives:['Expanded library seed; verify against detailed biography before treating as decisive analogue.'], decisions:['founded Alibaba with team'], personalityShift:'evangelical, resilient, network-oriented', protectiveLesson:'Communication can attract resources before proof is obvious.' },
  { id:'larry-page-1998', person:'Larry Page', year:1998, age:25, occupation:'computer scientist entrepreneur', wealth:'wealthy', relationshipStatus:'partnered', visibility:'global', eventCategory:'Google founded', direct:56, classic:20, directReduced:11, classicReduced:2, domains:d({money:.86, career:.88, leadership:.74, creativeOutput:.72, publicVisibility:.62, legacy:.75}), eventIntensity:92, outcome:'triumph', narrative:'Search architecture became a world-scale information company.', falsePositives:['Expanded library seed; verify against detailed biography before treating as decisive analogue.'], decisions:['commercialized PageRank', 'co-founded Google'], personalityShift:'analytical, ambitious, systems-driven', protectiveLesson:'Technical ranking can become economic ranking.' },
  { id:'sergey-brin-1998', person:'Sergey Brin', year:1998, age:25, occupation:'computer scientist entrepreneur', wealth:'wealthy', relationshipStatus:'partnered', visibility:'global', eventCategory:'Google founded', direct:56, classic:20, directReduced:11, classicReduced:2, domains:d({money:.86, career:.88, leadership:.74, creativeOutput:.72, publicVisibility:.62, legacy:.75}), eventIntensity:92, outcome:'triumph', narrative:'Research collaboration became global information infrastructure.', falsePositives:['Expanded library seed; verify against detailed biography before treating as decisive analogue.'], decisions:['co-founded Google', 'scaled search technology'], personalityShift:'curious, bold, collaborative', protectiveLesson:'Partnership can turn research into empire.' },
  { id:'altman-2023', person:'Sam Altman', year:2023, age:38, occupation:'technology executive investor', wealth:'wealthy', relationshipStatus:'unknown', visibility:'global', eventCategory:'OpenAI firing and reinstatement', direct:33, classic:15, directReduced:33, classicReduced:6, domains:d({leadership:.82, law:.78, competition:.78, publicVisibility:.82, reputation:.72, security:.55}), eventIntensity:86, outcome:'mixed', narrative:'Governance conflict became a public test of leadership and institutional control.', falsePositives:['Expanded library seed; verify against detailed biography before treating as decisive analogue.'], decisions:['was removed and returned', 'renegotiated authority'], personalityShift:'strategic, pressured, polarizing', protectiveLesson:'Platform power requires governance before crisis exposes the gap.' },
  { id:'disney-1928', person:'Walt Disney', year:1928, age:27, occupation:'animator entrepreneur', wealth:'comfortable', relationshipStatus:'married', visibility:'global', eventCategory:'Steamboat Willie and Mickey Mouse', direct:37, classic:10, directReduced:1, classicReduced:1, domains:d({creativeOutput:.92, publicVisibility:.92, reputation:.84, money:.72, career:.78, legacy:.65}), eventIntensity:92, outcome:'triumph', narrative:'Creative partnership and technology launched a durable character empire.', falsePositives:['Expanded library seed; verify against detailed biography before treating as decisive analogue.'], decisions:['released sound cartoon', 'built around Mickey'], personalityShift:'inventive, collaborative, commercially alert', protectiveLesson:'A character launch can become institutional destiny.' },
  { id:'disney-1955', person:'Walt Disney', year:1955, age:54, occupation:'entrepreneur entertainer', wealth:'wealthy', relationshipStatus:'married', visibility:'global', eventCategory:'Disneyland opened', direct:37, classic:10, directReduced:1, classicReduced:1, domains:d({money:.86, career:.88, leadership:.74, creativeOutput:.72, publicVisibility:.62, legacy:.75}), eventIntensity:92, outcome:'triumph', narrative:'Imagination became physical infrastructure and family commerce.', falsePositives:['Expanded library seed; verify against detailed biography before treating as decisive analogue.'], decisions:['opened theme park'], personalityShift:'visionary, controlling, experiential', protectiveLesson:'Creative worlds need operational architecture.' },
  { id:'chaplin-1940', person:'Charlie Chaplin', year:1940, age:51, occupation:'actor filmmaker comedian', wealth:'wealthy', relationshipStatus:'married', visibility:'global', eventCategory:'The Great Dictator released', direct:34, classic:16, directReduced:7, classicReduced:7, domains:d({creativeOutput:.92, education:.82, reputation:.82, legacy:.82, publicVisibility:.72}), eventIntensity:86, outcome:'mixed', narrative:'Comedy became political speech under global danger.', falsePositives:['Expanded library seed; verify against detailed biography before treating as decisive analogue.'], decisions:['satirized dictatorship publicly'], personalityShift:'brave, expressive, controversial', protectiveLesson:'Art becomes risky when it confronts power directly.' },
  { id:'hepburn-1953', person:'Audrey Hepburn', year:1953, age:24, occupation:'actress humanitarian', wealth:'comfortable', relationshipStatus:'single', visibility:'global', eventCategory:'Roman Holiday breakthrough', direct:27, classic:18, directReduced:9, classicReduced:9, domains:d({creativeOutput:.92, publicVisibility:.92, reputation:.84, money:.72, career:.78, legacy:.65}), eventIntensity:92, outcome:'triumph', narrative:'Grace and screen presence became international stardom.', falsePositives:['Expanded library seed; verify against detailed biography before treating as decisive analogue.'], decisions:['accepted defining film role'], personalityShift:'fresh, elegant, visible', protectiveLesson:'A breakthrough role can rewrite public identity overnight.' },
  { id:'monroe-1962', person:'Marilyn Monroe', year:1962, age:36, occupation:'actress celebrity', wealth:'wealthy', relationshipStatus:'single', visibility:'global', eventCategory:'death by overdose amid career instability', direct:25, classic:16, directReduced:7, classicReduced:7, domains:d({reputation:.9, publicVisibility:.84, health:.72, relationships:.62, legacy:.78, creativeOutput:.58}), eventIntensity:92, outcome:'legacy', narrative:'Private fragility collided with public myth.', falsePositives:['Expanded library seed; verify against detailed biography before treating as decisive analogue.'], decisions:['struggled with work and health pressures'], personalityShift:'vulnerable, isolated, iconic', protectiveLesson:'Fame cannot substitute for body and emotional protection.' },
  { id:'elvis-1956', person:'Elvis Presley', year:1956, age:21, occupation:'singer actor', wealth:'wealthy', relationshipStatus:'single', visibility:'global', eventCategory:'national breakthrough and television fame', direct:30, classic:12, directReduced:3, classicReduced:3, domains:d({creativeOutput:.92, publicVisibility:.92, reputation:.84, money:.72, career:.78, legacy:.65}), eventIntensity:92, outcome:'triumph', narrative:'Magnetic performance became mass cultural disruption.', falsePositives:['Expanded library seed; verify against detailed biography before treating as decisive analogue.'], decisions:['entered national television spotlight'], personalityShift:'sensual, electric, rebellious', protectiveLesson:'Visibility can become a social earthquake.' },
  { id:'elvis-1977', person:'Elvis Presley', year:1977, age:42, occupation:'singer celebrity', wealth:'wealthy', relationshipStatus:'divorced', visibility:'global', eventCategory:'death after health decline', direct:33, classic:15, directReduced:33, classicReduced:6, domains:d({reputation:.9, publicVisibility:.84, health:.72, relationships:.62, legacy:.78, creativeOutput:.58}), eventIntensity:92, outcome:'legacy', narrative:'A legendary public image ended through bodily collapse.', falsePositives:['Expanded library seed; verify against detailed biography before treating as decisive analogue.'], decisions:['continued performing under strain'], personalityShift:'isolated, depleted, mythic', protectiveLesson:'Health debt eventually overrules applause.' },
  { id:'michael-jackson-1982', person:'Michael Jackson', year:1982, age:24, occupation:'singer performer', wealth:'wealthy', relationshipStatus:'single', visibility:'global', eventCategory:'Thriller released', direct:57, classic:21, directReduced:3, classicReduced:3, domains:d({creativeOutput:.92, publicVisibility:.92, reputation:.84, money:.72, career:.78, legacy:.65}), eventIntensity:92, outcome:'triumph', narrative:'Performance, image and music fused into global dominance.', falsePositives:['Expanded library seed; verify against detailed biography before treating as decisive analogue.'], decisions:['released Thriller', 'unified video and pop strategy'], personalityShift:'precise, magnetic, perfectionist', protectiveLesson:'Creative timing becomes explosive when medium and talent align.' },
  { id:'michael-jackson-2009', person:'Michael Jackson', year:2009, age:51, occupation:'singer performer', wealth:'wealthy', relationshipStatus:'single', visibility:'global', eventCategory:'death during comeback preparation', direct:48, classic:21, directReduced:3, classicReduced:3, domains:d({reputation:.9, publicVisibility:.84, health:.72, relationships:.62, legacy:.78, creativeOutput:.58}), eventIntensity:92, outcome:'legacy', narrative:'Comeback pressure met health and dependency risk.', falsePositives:['Expanded library seed; verify against detailed biography before treating as decisive analogue.'], decisions:['prepared major concerts under strain'], personalityShift:'pressured, fragile, legendary', protectiveLesson:'If the body is the vehicle, comeback ambition must not ignore medical reality.' },
  { id:'madonna-1984', person:'Madonna', year:1984, age:26, occupation:'singer performer businesswoman', wealth:'wealthy', relationshipStatus:'single', visibility:'global', eventCategory:'Like a Virgin era breakthrough', direct:46, classic:19, directReduced:1, classicReduced:1, domains:d({creativeOutput:.92, publicVisibility:.92, reputation:.84, money:.72, career:.78, legacy:.65}), eventIntensity:92, outcome:'triumph', narrative:'Provocative image control became pop authority.', falsePositives:['Expanded library seed; verify against detailed biography before treating as decisive analogue.'], decisions:['embraced controversy as brand strategy'], personalityShift:'bold, confrontational, self-authored', protectiveLesson:'Public identity can be engineered into power.' },
  { id:'beyonce-2003', person:'Beyoncé Knowles-Carter', year:2003, age:22, occupation:'singer performer entrepreneur', wealth:'wealthy', relationshipStatus:'single', visibility:'global', eventCategory:'solo breakthrough with Dangerously in Love', direct:18, classic:18, directReduced:9, classicReduced:9, domains:d({creativeOutput:.92, publicVisibility:.92, reputation:.84, money:.72, career:.78, legacy:.65}), eventIntensity:92, outcome:'triumph', narrative:'Group identity transformed into solo command.', falsePositives:['Expanded library seed; verify against detailed biography before treating as decisive analogue.'], decisions:['launched solo career'], personalityShift:'polished, ambitious, controlled', protectiveLesson:'A solo year tests whether support can become sovereignty.' },
  { id:'rihanna-2007', person:'Rihanna', year:2007, age:19, occupation:'singer entrepreneur', wealth:'wealthy', relationshipStatus:'single', visibility:'global', eventCategory:'Umbrella global breakthrough', direct:31, classic:13, directReduced:4, classicReduced:4, domains:d({creativeOutput:.92, publicVisibility:.92, reputation:.84, money:.72, career:.78, legacy:.65}), eventIntensity:92, outcome:'triumph', narrative:'A defining hit established durable global image.', falsePositives:['Expanded library seed; verify against detailed biography before treating as decisive analogue.'], decisions:['embraced new sound and image'], personalityShift:'magnetic, adaptive, style-defining', protectiveLesson:'One symbolic song can become a career architecture.' },
  { id:'bob-dylan-1965', person:'Bob Dylan', year:1965, age:24, occupation:'songwriter singer', wealth:'comfortable', relationshipStatus:'married', visibility:'global', eventCategory:'electric turn and Highway 61 era', direct:50, classic:14, directReduced:5, classicReduced:5, domains:d({creativeOutput:.92, education:.82, reputation:.82, legacy:.82, publicVisibility:.72}), eventIntensity:86, outcome:'mixed', narrative:'Creative evolution provoked audience conflict and expanded authority.', falsePositives:['Expanded library seed; verify against detailed biography before treating as decisive analogue.'], decisions:['went electric', 'refused folk purity expectations'], personalityShift:'restless, defiant, poetic', protectiveLesson:'Artistic growth may require disappointing the old audience.' },
  { id:'bob-marley-1977', person:'Bob Marley', year:1977, age:32, occupation:'musician activist', wealth:'comfortable', relationshipStatus:'married', visibility:'global', eventCategory:'Exodus era after assassination attempt and exile', direct:32, classic:14, directReduced:5, classicReduced:5, domains:d({service:.94, legacy:.86, publicVisibility:.78, spirituality:.76, health:.48, relationships:.45}), eventIntensity:92, outcome:'legacy', narrative:'Music, danger and spiritual-political message fused globally.', falsePositives:['Expanded library seed; verify against detailed biography before treating as decisive analogue.'], decisions:['continued mission after attack', 'released Exodus'], personalityShift:'prophetic, resilient, unifying', protectiveLesson:'When message and danger meet, art can become scripture-like.' },
  { id:'freddie-1985', person:'Freddie Mercury', year:1985, age:39, occupation:'singer performer', wealth:'wealthy', relationshipStatus:'partnered', visibility:'global', eventCategory:'Live Aid performance', direct:37, classic:19, directReduced:1, classicReduced:1, domains:d({creativeOutput:.92, publicVisibility:.92, reputation:.84, money:.72, career:.78, legacy:.65}), eventIntensity:92, outcome:'legacy', narrative:'Stage command became immortal public performance.', falsePositives:['Expanded library seed; verify against detailed biography before treating as decisive analogue.'], decisions:['delivered defining live performance'], personalityShift:'radiant, theatrical, commanding', protectiveLesson:'A single performance can seal a legacy.' },
  { id:'freddie-1991', person:'Freddie Mercury', year:1991, age:45, occupation:'singer performer', wealth:'wealthy', relationshipStatus:'partnered', visibility:'global', eventCategory:'death and public AIDS disclosure', direct:34, classic:16, directReduced:7, classicReduced:7, domains:d({reputation:.9, publicVisibility:.84, health:.72, relationships:.62, legacy:.78, creativeOutput:.58}), eventIntensity:92, outcome:'legacy', narrative:'Private health battle became public legacy and awareness.', falsePositives:['Expanded library seed; verify against detailed biography before treating as decisive analogue.'], decisions:['released statement before death'], personalityShift:'private, dignified, mythic', protectiveLesson:'Health truth can become legacy when handled with dignity.' },
  { id:'lennon-1980', person:'John Lennon', year:1980, age:40, occupation:'musician activist', wealth:'wealthy', relationshipStatus:'married', visibility:'global', eventCategory:'murder after musical return', direct:37, classic:19, directReduced:1, classicReduced:1, domains:d({security:.96, health:.9, legacy:.9, publicVisibility:.82, competition:.75, reputation:.78}), eventIntensity:95, outcome:'legacy', narrative:'Creative return met sudden public violence.', falsePositives:['Expanded library seed; verify against detailed biography before treating as decisive analogue.'], decisions:['returned with Double Fantasy'], personalityShift:'renewed, domestic, exposed', protectiveLesson:'Favourable creative signs do not cancel security exposure.' },
  { id:'mccartney-1964', person:'Paul McCartney', year:1964, age:22, occupation:'musician songwriter', wealth:'wealthy', relationshipStatus:'single', visibility:'global', eventCategory:'Beatles U.S. breakthrough', direct:44, classic:17, directReduced:8, classicReduced:8, domains:d({creativeOutput:.92, publicVisibility:.92, reputation:.84, money:.72, career:.78, legacy:.65}), eventIntensity:92, outcome:'triumph', narrative:'Band charisma became global cultural wave.', falsePositives:['Expanded library seed; verify against detailed biography before treating as decisive analogue.'], decisions:['entered American market', 'scaled performance identity'], personalityShift:'buoyant, collaborative, melodic', protectiveLesson:'Partnership can amplify individual genius beyond solo reach.' },
  { id:'lady-gaga-2008', person:'Lady Gaga', year:2008, age:22, occupation:'singer performer actress', wealth:'wealthy', relationshipStatus:'single', visibility:'global', eventCategory:'The Fame breakthrough', direct:41, classic:14, directReduced:5, classicReduced:5, domains:d({creativeOutput:.92, publicVisibility:.92, reputation:.84, money:.72, career:.78, legacy:.65}), eventIntensity:92, outcome:'triumph', narrative:'Theatrical identity became pop disruption.', falsePositives:['Expanded library seed; verify against detailed biography before treating as decisive analogue.'], decisions:['launched Fame era', 'made image into concept'], personalityShift:'provocative, constructed, relentless', protectiveLesson:'A persona can become a vessel for ambition.' },
  { id:'adele-2011', person:'Adele', year:2011, age:23, occupation:'singer songwriter', wealth:'wealthy', relationshipStatus:'single', visibility:'global', eventCategory:'21 global success', direct:14, classic:14, directReduced:5, classicReduced:5, domains:d({creativeOutput:.92, publicVisibility:.92, reputation:.84, money:.72, career:.78, legacy:.65}), eventIntensity:92, outcome:'triumph', narrative:'Personal heartbreak became universal commercial voice.', falsePositives:['Expanded library seed; verify against detailed biography before treating as decisive analogue.'], decisions:['released deeply personal album'], personalityShift:'raw, emotionally direct, visible', protectiveLesson:'Private pain can become collective language.' },
  { id:'shakira-2001', person:'Shakira', year:2001, age:24, occupation:'singer songwriter', wealth:'wealthy', relationshipStatus:'partnered', visibility:'global', eventCategory:'Laundry Service crossover', direct:7, classic:7, directReduced:7, classicReduced:7, domains:d({creativeOutput:.92, publicVisibility:.92, reputation:.84, money:.72, career:.78, legacy:.65}), eventIntensity:92, outcome:'triumph', narrative:'Linguistic and market crossover expanded global identity.', falsePositives:['Expanded library seed; verify against detailed biography before treating as decisive analogue.'], decisions:['entered English-language market'], personalityShift:'mobile, adaptive, charismatic', protectiveLesson:'Crossing markets requires changing form without losing essence.' },
  { id:'springsteen-1984', person:'Bruce Springsteen', year:1984, age:35, occupation:'singer songwriter', wealth:'wealthy', relationshipStatus:'single', visibility:'global', eventCategory:'Born in the U.S.A. era', direct:54, classic:18, directReduced:9, classicReduced:9, domains:d({creativeOutput:.92, publicVisibility:.92, reputation:.84, money:.72, career:.78, legacy:.65}), eventIntensity:92, outcome:'triumph', narrative:'Working-class narrative became stadium-scale visibility.', falsePositives:['Expanded library seed; verify against detailed biography before treating as decisive analogue.'], decisions:['released defining commercial album'], personalityShift:'anthemic, disciplined, public', protectiveLesson:'A message expands when image and audience timing align.' },
  { id:'rowling-1997', person:'J.K. Rowling', year:1997, age:32, occupation:'writer author', wealth:'wealthy', relationshipStatus:'single', visibility:'global', eventCategory:'first Harry Potter published', direct:64, classic:19, directReduced:1, classicReduced:1, domains:d({creativeOutput:.92, education:.82, reputation:.82, legacy:.82, publicVisibility:.72}), eventIntensity:92, outcome:'triumph', narrative:'Private imaginative work became a world-building publication seed.', falsePositives:['Expanded library seed; verify against detailed biography before treating as decisive analogue.'], decisions:['published debut novel after rejection'], personalityShift:'persistent, imaginative, vindicated', protectiveLesson:'A hidden manuscript can become a life architecture.' },
  { id:'lucas-1977', person:'George Lucas', year:1977, age:33, occupation:'filmmaker entrepreneur', wealth:'wealthy', relationshipStatus:'married', visibility:'global', eventCategory:'Star Wars released', direct:43, classic:16, directReduced:7, classicReduced:7, domains:d({creativeOutput:.92, publicVisibility:.92, reputation:.84, money:.72, career:.78, legacy:.65}), eventIntensity:92, outcome:'triumph', narrative:'Mythic storytelling became franchise infrastructure.', falsePositives:['Expanded library seed; verify against detailed biography before treating as decisive analogue.'], decisions:['released Star Wars', 'retained key rights'], personalityShift:'visionary, world-building, commercially strategic', protectiveLesson:'Narrative universes become empires when rights and timing align.' },
  { id:'spielberg-1975', person:'Steven Spielberg', year:1975, age:29, occupation:'filmmaker', wealth:'wealthy', relationshipStatus:'single', visibility:'global', eventCategory:'Jaws released', direct:52, classic:16, directReduced:7, classicReduced:7, domains:d({creativeOutput:.92, publicVisibility:.92, reputation:.84, money:.72, career:.78, legacy:.65}), eventIntensity:92, outcome:'triumph', narrative:'Technical production pressure became blockbuster invention.', falsePositives:['Expanded library seed; verify against detailed biography before treating as decisive analogue.'], decisions:['completed troubled production', 'changed film marketing scale'], personalityShift:'tense, inventive, audience-aware', protectiveLesson:'Crisis-managed craft can create a new industry model.' },
  { id:'hitchcock-1960', person:'Alfred Hitchcock', year:1960, age:61, occupation:'filmmaker', wealth:'wealthy', relationshipStatus:'married', visibility:'global', eventCategory:'Psycho released', direct:37, classic:19, directReduced:1, classicReduced:1, domains:d({creativeOutput:.92, publicVisibility:.92, reputation:.84, money:.72, career:.78, legacy:.65}), eventIntensity:92, outcome:'legacy', narrative:'Risky formal experimentation reshaped suspense cinema.', falsePositives:['Expanded library seed; verify against detailed biography before treating as decisive analogue.'], decisions:['self-financed risk', 'controlled audience rules'], personalityShift:'controlled, daring, psychologically precise', protectiveLesson:'A masterwork may require breaking distribution habits.' },
  { id:'streep-1983', person:'Meryl Streep', year:1983, age:34, occupation:'actress', wealth:'wealthy', relationshipStatus:'married', visibility:'global', eventCategory:'Oscar for Sophie’s Choice', direct:49, classic:13, directReduced:4, classicReduced:4, domains:d({creativeOutput:.92, publicVisibility:.92, reputation:.84, money:.72, career:.78, legacy:.65}), eventIntensity:92, outcome:'triumph', narrative:'Artistic seriousness became elite recognition.', falsePositives:['Expanded library seed; verify against detailed biography before treating as decisive analogue.'], decisions:['accepted demanding role', 'won major award'], personalityShift:'intense, disciplined, respected', protectiveLesson:'Deep craft creates authority beyond celebrity.' },
  { id:'frida-1925', person:'Frida Kahlo', year:1925, age:18, occupation:'artist painter', wealth:'modest', relationshipStatus:'single', visibility:'global', eventCategory:'bus accident and turn toward painting', direct:30, classic:21, directReduced:3, classicReduced:3, domains:d({health:.95, security:.94, travel:.86, legacy:.84, publicVisibility:.74}), eventIntensity:95, outcome:'transition', narrative:'Physical catastrophe redirected identity toward art.', falsePositives:['Expanded library seed; verify against detailed biography before treating as decisive analogue.'], decisions:['survived accident', 'began painting during recovery'], personalityShift:'wounded, inward, visually intense', protectiveLesson:'Accident signatures can become creative origin stories if survived.' },
  { id:'picasso-1907', person:'Pablo Picasso', year:1907, age:26, occupation:'artist painter', wealth:'comfortable', relationshipStatus:'partnered', visibility:'global', eventCategory:'Les Demoiselles d’Avignon and Cubist rupture', direct:52, classic:16, directReduced:7, classicReduced:7, domains:d({creativeOutput:.92, education:.82, reputation:.82, legacy:.82, publicVisibility:.72}), eventIntensity:92, outcome:'legacy', narrative:'A radical visual break rewrote modern art direction.', falsePositives:['Expanded library seed; verify against detailed biography before treating as decisive analogue.'], decisions:['broke classical form', 'accepted aesthetic risk'], personalityShift:'restless, disruptive, experimental', protectiveLesson:'Creative rupture can make reputation before public acceptance catches up.' },
  { id:'vangogh-1888', person:'Vincent van Gogh', year:1888, age:35, occupation:'artist painter', wealth:'low', relationshipStatus:'single', visibility:'global', eventCategory:'Arles crisis and major paintings', direct:58, classic:13, directReduced:4, classicReduced:4, domains:d({reputation:.9, publicVisibility:.84, health:.72, relationships:.62, legacy:.78, creativeOutput:.58}), eventIntensity:86, outcome:'mixed', narrative:'Creative intensity and mental crisis peaked together.', falsePositives:['Expanded library seed; verify against detailed biography before treating as decisive analogue.'], decisions:['painted intensely', 'entered crisis with Gauguin'], personalityShift:'feverish, isolated, visionary', protectiveLesson:'Genius without nervous protection can become self-endangering.' },
  { id:'leonardo-1503', person:'Leonardo da Vinci', year:1503, age:51, occupation:'artist inventor', wealth:'comfortable', relationshipStatus:'single', visibility:'global', eventCategory:'Mona Lisa period began', direct:28, classic:19, directReduced:1, classicReduced:1, domains:d({creativeOutput:.92, education:.82, reputation:.82, legacy:.82, publicVisibility:.72}), eventIntensity:92, outcome:'legacy', narrative:'Portrait work became enduring symbolic legacy.', falsePositives:['Expanded library seed; verify against detailed biography before treating as decisive analogue.'], decisions:['began iconic portrait work'], personalityShift:'observant, perfectionist, enigmatic', protectiveLesson:'A single image can carry centuries of identity.' },
  { id:'michelangelo-1508', person:'Michelangelo', year:1508, age:33, occupation:'artist sculptor', wealth:'comfortable', relationshipStatus:'single', visibility:'global', eventCategory:'Sistine Chapel ceiling commission', direct:23, classic:14, directReduced:5, classicReduced:5, domains:d({creativeOutput:.92, education:.82, reputation:.82, legacy:.82, publicVisibility:.72}), eventIntensity:92, outcome:'legacy', narrative:'An unwanted burden became monumental legacy.', falsePositives:['Expanded library seed; verify against detailed biography before treating as decisive analogue.'], decisions:['accepted papal commission reluctantly'], personalityShift:'strained, disciplined, monumental', protectiveLesson:'The work that feels like a burden may become the remembered masterpiece.' },
  { id:'messi-2022', person:'Lionel Messi', year:2022, age:35, occupation:'footballer athlete', wealth:'wealthy', relationshipStatus:'married', visibility:'global', eventCategory:'World Cup victory', direct:36, classic:18, directReduced:9, classicReduced:9, domains:d({competition:.96, publicVisibility:.88, reputation:.86, career:.82, legacy:.78, health:.45}), eventIntensity:92, outcome:'triumph', narrative:'Long pursuit culminated in global sporting coronation.', falsePositives:['Expanded library seed; verify against detailed biography before treating as decisive analogue.'], decisions:['led Argentina to World Cup', 'carried legacy pressure'], personalityShift:'focused, relieved, crowned', protectiveLesson:'Completion years can crown a long unfinished narrative.' },
  { id:'ronaldo-2008', person:'Cristiano Ronaldo', year:2008, age:23, occupation:'footballer athlete', wealth:'wealthy', relationshipStatus:'single', visibility:'global', eventCategory:'Champions League and Ballon d’Or', direct:17, classic:8, directReduced:8, classicReduced:8, domains:d({competition:.96, publicVisibility:.88, reputation:.86, career:.82, legacy:.78, health:.45}), eventIntensity:92, outcome:'triumph', narrative:'Athletic dominance became global individual recognition.', falsePositives:['Expanded library seed; verify against detailed biography before treating as decisive analogue.'], decisions:['converted performance into awards'], personalityShift:'driven, competitive, self-believing', protectiveLesson:'Competition compounds reward relentless self-definition.' },
  { id:'serena-1999', person:'Serena Williams', year:1999, age:18, occupation:'tennis player athlete', wealth:'wealthy', relationshipStatus:'single', visibility:'global', eventCategory:'first Grand Slam singles title', direct:63, classic:18, directReduced:9, classicReduced:9, domains:d({competition:.96, publicVisibility:.88, reputation:.86, career:.82, legacy:.78, health:.45}), eventIntensity:92, outcome:'triumph', narrative:'Young competitive power became major championship proof.', falsePositives:['Expanded library seed; verify against detailed biography before treating as decisive analogue.'], decisions:['won U.S. Open'], personalityShift:'fierce, emergent, confident', protectiveLesson:'First victory changes identity when it confirms destiny.' },
  { id:'biles-2016', person:'Simone Biles', year:2016, age:19, occupation:'gymnast athlete', wealth:'comfortable', relationshipStatus:'single', visibility:'global', eventCategory:'Olympic dominance', direct:26, classic:17, directReduced:8, classicReduced:8, domains:d({competition:.96, publicVisibility:.88, reputation:.86, career:.82, legacy:.78, health:.45}), eventIntensity:92, outcome:'triumph', narrative:'Technical mastery became global athletic authority.', falsePositives:['Expanded library seed; verify against detailed biography before treating as decisive analogue.'], decisions:['won multiple Olympic golds'], personalityShift:'precise, powerful, visible', protectiveLesson:'Mastery becomes undeniable when difficulty and execution align.' },
  { id:'bolt-2008', person:'Usain Bolt', year:2008, age:22, occupation:'sprinter athlete', wealth:'wealthy', relationshipStatus:'single', visibility:'global', eventCategory:'Olympic records', direct:39, classic:12, directReduced:3, classicReduced:3, domains:d({competition:.96, publicVisibility:.88, reputation:.86, career:.82, legacy:.78, health:.45}), eventIntensity:92, outcome:'triumph', narrative:'Speed became mythic public identity.', falsePositives:['Expanded library seed; verify against detailed biography before treating as decisive analogue.'], decisions:['broke world records', 'performed with ease'], personalityShift:'explosive, playful, dominant', protectiveLesson:'A body can become a symbol when performance exceeds proportion.' },
  { id:'jordan-1991', person:'Michael Jordan', year:1991, age:28, occupation:'basketball player', wealth:'wealthy', relationshipStatus:'married', visibility:'global', eventCategory:'first NBA championship', direct:39, classic:12, directReduced:3, classicReduced:3, domains:d({competition:.96, publicVisibility:.88, reputation:.86, career:.82, legacy:.78, health:.45}), eventIntensity:92, outcome:'triumph', narrative:'Individual brilliance became team championship authority.', falsePositives:['Expanded library seed; verify against detailed biography before treating as decisive analogue.'], decisions:['won first NBA title'], personalityShift:'competitive, validated, commanding', protectiveLesson:'Personal dominance becomes legacy when it proves it can win collectively.' },
  { id:'woods-1997', person:'Tiger Woods', year:1997, age:22, occupation:'golfer athlete', wealth:'wealthy', relationshipStatus:'single', visibility:'global', eventCategory:'Masters victory', direct:68, classic:14, directReduced:5, classicReduced:5, domains:d({competition:.96, publicVisibility:.88, reputation:.86, career:.82, legacy:.78, health:.45}), eventIntensity:92, outcome:'triumph', narrative:'Young talent shattered records and social expectations.', falsePositives:['Expanded library seed; verify against detailed biography before treating as decisive analogue.'], decisions:['won Masters decisively'], personalityShift:'focused, historic, disruptive', protectiveLesson:'A breakthrough can change the field’s imagination of who belongs.' },
  { id:'pele-1958', person:'Pelé', year:1958, age:18, occupation:'footballer athlete', wealth:'wealthy', relationshipStatus:'single', visibility:'global', eventCategory:'World Cup teenage breakthrough', direct:56, classic:11, directReduced:11, classicReduced:11, domains:d({competition:.96, publicVisibility:.88, reputation:.86, career:.82, legacy:.78, health:.45}), eventIntensity:92, outcome:'triumph', narrative:'Teenage genius became global football myth.', falsePositives:['Expanded library seed; verify against detailed biography before treating as decisive analogue.'], decisions:['starred in World Cup victory'], personalityShift:'joyful, brilliant, emergent', protectiveLesson:'Youthful mastery becomes myth when it appears ahead of schedule.' },
  { id:'maradona-1986', person:'Diego Maradona', year:1986, age:26, occupation:'footballer athlete', wealth:'wealthy', relationshipStatus:'partnered', visibility:'global', eventCategory:'World Cup triumph', direct:64, classic:10, directReduced:1, classicReduced:1, domains:d({competition:.96, publicVisibility:.88, reputation:.86, career:.82, legacy:.78, health:.45}), eventIntensity:92, outcome:'triumph', narrative:'Genius, controversy and national symbolism fused in victory.', falsePositives:['Expanded library seed; verify against detailed biography before treating as decisive analogue.'], decisions:['carried Argentina', 'produced iconic goals'], personalityShift:'inspired, defiant, chaotic', protectiveLesson:'Victory can include controversy when genius carries shadow.' },
  { id:'senna-1994', person:'Ayrton Senna', year:1994, age:34, occupation:'racing driver athlete', wealth:'wealthy', relationshipStatus:'single', visibility:'global', eventCategory:'fatal San Marino Grand Prix crash', direct:47, classic:11, directReduced:11, classicReduced:11, domains:d({health:.95, security:.94, travel:.86, legacy:.84, publicVisibility:.74}), eventIntensity:95, outcome:'legacy', narrative:'Elite competition met literal speed danger.', falsePositives:['Expanded library seed; verify against detailed biography before treating as decisive analogue.'], decisions:['raced despite unsafe weekend climate'], personalityShift:'focused, concerned, exposed', protectiveLesson:'In speed domains, danger language must be read physically.' },
  { id:'hamilton-2008', person:'Lewis Hamilton', year:2008, age:23, occupation:'racing driver athlete', wealth:'wealthy', relationshipStatus:'single', visibility:'global', eventCategory:'first Formula One championship', direct:18, classic:9, directReduced:9, classicReduced:9, domains:d({competition:.96, publicVisibility:.88, reputation:.86, career:.82, legacy:.78, health:.45}), eventIntensity:92, outcome:'triumph', narrative:'Young competition pressure became last-moment championship.', falsePositives:['Expanded library seed; verify against detailed biography before treating as decisive analogue.'], decisions:['won title dramatically'], personalityShift:'composed, ambitious, tested', protectiveLesson:'A narrow win still changes the whole career architecture.' },
  { id:'jackie-robinson-1947', person:'Jackie Robinson', year:1947, age:28, occupation:'baseball player civil rights pioneer', wealth:'comfortable', relationshipStatus:'married', visibility:'global', eventCategory:'broke MLB color barrier', direct:53, classic:8, directReduced:8, classicReduced:8, domains:d({competition:.96, publicVisibility:.88, reputation:.86, career:.82, legacy:.78, health:.45}), eventIntensity:92, outcome:'legacy', narrative:'Athletic role became civil-rights pressure and historical courage.', falsePositives:['Expanded library seed; verify against detailed biography before treating as decisive analogue.'], decisions:['entered MLB under racist hostility'], personalityShift:'restrained, brave, burdened', protectiveLesson:'Competition fields can become moral battlegrounds.' },
  { id:'jesse-owens-1936', person:'Jesse Owens', year:1936, age:23, occupation:'sprinter athlete', wealth:'modest', relationshipStatus:'married', visibility:'global', eventCategory:'Berlin Olympics victories', direct:40, classic:13, directReduced:4, classicReduced:4, domains:d({competition:.96, publicVisibility:.88, reputation:.86, career:.82, legacy:.78, health:.45}), eventIntensity:92, outcome:'legacy', narrative:'Athletic excellence challenged racist political spectacle.', falsePositives:['Expanded library seed; verify against detailed biography before treating as decisive analogue.'], decisions:['won four Olympic golds'], personalityShift:'poised, fast, symbolic', protectiveLesson:'Performance can defeat ideology in public view.' },
  { id:'chanel-1921', person:'Coco Chanel', year:1921, age:38, occupation:'fashion designer entrepreneur', wealth:'wealthy', relationshipStatus:'single', visibility:'global', eventCategory:'Chanel No. 5 launched', direct:40, classic:22, directReduced:4, classicReduced:22, domains:d({money:.86, career:.88, leadership:.74, creativeOutput:.72, publicVisibility:.62, legacy:.75}), eventIntensity:92, outcome:'triumph', narrative:'Style, scent and brand identity became luxury infrastructure.', falsePositives:['Expanded library seed; verify against detailed biography before treating as decisive analogue.'], decisions:['launched signature perfume'], personalityShift:'elegant, strategic, independent', protectiveLesson:'A product can become identity when brand mythology is precise.' },
  { id:'buffett-1965', person:'Warren Buffett', year:1965, age:35, occupation:'investor business leader', wealth:'wealthy', relationshipStatus:'married', visibility:'global', eventCategory:'took control of Berkshire Hathaway', direct:59, classic:14, directReduced:5, classicReduced:5, domains:d({money:.86, career:.88, leadership:.74, creativeOutput:.72, publicVisibility:.62, legacy:.75}), eventIntensity:92, outcome:'triumph', narrative:'Investment discipline became corporate vehicle.', falsePositives:['Expanded library seed; verify against detailed biography before treating as decisive analogue.'], decisions:['took control of Berkshire'], personalityShift:'patient, analytical, compounding', protectiveLesson:'Money power grows when discipline has a vessel.' },
  { id:'oprah-1986', person:'Oprah Winfrey', year:1986, age:32, occupation:'television host entrepreneur', wealth:'wealthy', relationshipStatus:'partnered', visibility:'global', eventCategory:'nationally syndicated Oprah Winfrey Show', direct:54, classic:18, directReduced:9, classicReduced:9, domains:d({creativeOutput:.92, publicVisibility:.92, reputation:.84, money:.72, career:.78, legacy:.65}), eventIntensity:92, outcome:'triumph', narrative:'Personal voice became media platform and public intimacy.', falsePositives:['Expanded library seed; verify against detailed biography before treating as decisive analogue.'], decisions:['launched national show'], personalityShift:'empathetic, authoritative, expansive', protectiveLesson:'Authentic communication can become empire.' },
  { id:'malala-2014', person:'Malala Yousafzai', year:2014, age:17, occupation:'activist student', wealth:'modest', relationshipStatus:'single', visibility:'global', eventCategory:'Nobel Peace Prize', direct:26, classic:17, directReduced:8, classicReduced:8, domains:d({service:.94, legacy:.86, publicVisibility:.78, spirituality:.76, health:.48, relationships:.45}), eventIntensity:92, outcome:'legacy', narrative:'Survived violence transformed into global educational advocacy.', falsePositives:['Expanded library seed; verify against detailed biography before treating as decisive analogue.'], decisions:['accepted Nobel platform'], personalityShift:'brave, youthful, symbolic', protectiveLesson:'Trauma can become service when voice remains intact.' },
  { id:'greta-2019', person:'Greta Thunberg', year:2019, age:16, occupation:'climate activist', wealth:'modest', relationshipStatus:'single', visibility:'global', eventCategory:'global climate strike prominence', direct:16, classic:7, directReduced:7, classicReduced:7, domains:d({service:.94, legacy:.86, publicVisibility:.78, spirituality:.76, health:.48, relationships:.45}), eventIntensity:86, outcome:'mixed', narrative:'Youthful protest became global moral pressure.', falsePositives:['Expanded library seed; verify against detailed biography before treating as decisive analogue.'], decisions:['mobilized school strike movement'], personalityShift:'direct, uncompromising, urgent', protectiveLesson:'A young voice can shame institutions when clarity is relentless.' },
  { id:'mother-teresa-1979', person:'Mother Teresa', year:1979, age:69, occupation:'religious humanitarian', wealth:'modest', relationshipStatus:'single', visibility:'global', eventCategory:'Nobel Peace Prize', direct:60, classic:24, directReduced:6, classicReduced:6, domains:d({service:.94, legacy:.86, publicVisibility:.78, spirituality:.76, health:.48, relationships:.45}), eventIntensity:92, outcome:'legacy', narrative:'Service to the poor became global moral recognition.', falsePositives:['Expanded library seed; verify against detailed biography before treating as decisive analogue.'], decisions:['accepted Nobel as mission platform'], personalityShift:'austere, devoted, symbolic', protectiveLesson:'Service recognition is strongest when it points beyond the self.' },
  { id:'anne-frank-1942', person:'Anne Frank', year:1942, age:13, occupation:'writer diarist', wealth:'low', relationshipStatus:'single', visibility:'global', eventCategory:'went into hiding during Holocaust', direct:34, classic:16, directReduced:7, classicReduced:7, domains:d({law:.92, reputation:.88, publicVisibility:.84, relationships:.62, security:.48}), eventIntensity:92, outcome:'legacy', narrative:'Private writing began inside extreme legal and mortal danger.', falsePositives:['Expanded library seed; verify against detailed biography before treating as decisive analogue.'], decisions:['entered hiding', 'kept diary'], personalityShift:'observant, frightened, inward', protectiveLesson:'A private record can outlive the public violence around it.' },
  { id:'helen-keller-1904', person:'Helen Keller', year:1904, age:24, occupation:'author activist', wealth:'comfortable', relationshipStatus:'single', visibility:'global', eventCategory:'graduated from Radcliffe', direct:47, classic:20, directReduced:11, classicReduced:2, domains:d({service:.94, legacy:.86, publicVisibility:.78, spirituality:.76, health:.48, relationships:.45}), eventIntensity:92, outcome:'triumph', narrative:'Education became proof against assumed limitation.', falsePositives:['Expanded library seed; verify against detailed biography before treating as decisive analogue.'], decisions:['completed degree', 'turned disability into advocacy'], personalityShift:'determined, articulate, barrier-breaking', protectiveLesson:'Study can become liberation when society expects less.' },
  { id:'nightingale-1854', person:'Florence Nightingale', year:1854, age:34, occupation:'nurse reformer statistician', wealth:'comfortable', relationshipStatus:'single', visibility:'global', eventCategory:'Crimean War nursing mission', direct:35, classic:17, directReduced:8, classicReduced:8, domains:d({service:.94, legacy:.86, publicVisibility:.78, spirituality:.76, health:.48, relationships:.45}), eventIntensity:92, outcome:'legacy', narrative:'Care became institutional reform under war conditions.', falsePositives:['Expanded library seed; verify against detailed biography before treating as decisive analogue.'], decisions:['went to Crimea', 'organized nursing reform'], personalityShift:'disciplined, service-driven, reformist', protectiveLesson:'Service becomes historical when it redesigns systems.' },
  { id:'marie-antoinette-1793', person:'Marie Antoinette', year:1793, age:38, occupation:'queen', wealth:'institutional', relationshipStatus:'widowed', visibility:'global', eventCategory:'execution during French Revolution', direct:33, classic:6, directReduced:33, classicReduced:6, domains:d({security:.96, health:.9, legacy:.9, publicVisibility:.82, competition:.75, reputation:.78}), eventIntensity:95, outcome:'legacy', narrative:'Royal identity met revolutionary judgment and fatal public symbolism.', falsePositives:['Expanded library seed; verify against detailed biography before treating as decisive analogue.'], decisions:['faced trial and execution'], personalityShift:'isolated, symbolic, condemned', protectiveLesson:'Status becomes danger when public legitimacy collapses.' },
  { id:'che-1959', person:'Che Guevara', year:1959, age:31, occupation:'revolutionary doctor', wealth:'modest', relationshipStatus:'married', visibility:'global', eventCategory:'Cuban Revolution victory', direct:44, classic:17, directReduced:8, classicReduced:8, domains:d({leadership:.94, publicVisibility:.9, competition:.82, reputation:.82, law:.58, legacy:.65}), eventIntensity:92, outcome:'triumph', narrative:'Revolutionary combat became state power and global iconography.', falsePositives:['Expanded library seed; verify against detailed biography before treating as decisive analogue.'], decisions:['entered Havana with revolution', 'accepted revolutionary office'], personalityShift:'ideological, militant, mythic', protectiveLesson:'Victory in revolt creates the burden of governing the symbol.' },
  { id:'gagarin-1961', person:'Yuri Gagarin', year:1961, age:27, occupation:'cosmonaut pilot', wealth:'modest', relationshipStatus:'married', visibility:'global', eventCategory:'first human in space', direct:29, classic:20, directReduced:11, classicReduced:2, domains:d({travel:.9, security:.74, publicVisibility:.82, legacy:.82, career:.7}), eventIntensity:92, outcome:'legacy', narrative:'Travel beyond Earth became human and national myth.', falsePositives:['Expanded library seed; verify against detailed biography before treating as decisive analogue.'], decisions:['flew Vostok 1'], personalityShift:'brave, smiling, symbolic', protectiveLesson:'Exploration triumph requires physical risk carried by public meaning.' },
  { id:'armstrong-1969', person:'Neil Armstrong', year:1969, age:39, occupation:'astronaut engineer', wealth:'comfortable', relationshipStatus:'married', visibility:'global', eventCategory:'first Moon landing', direct:38, classic:20, directReduced:11, classicReduced:2, domains:d({travel:.9, security:.74, publicVisibility:.82, legacy:.82, career:.7}), eventIntensity:92, outcome:'legacy', narrative:'Technical discipline became a species-level symbolic step.', falsePositives:['Expanded library seed; verify against detailed biography before treating as decisive analogue.'], decisions:['commanded lunar landing', 'stepped on Moon'], personalityShift:'calm, precise, historic', protectiveLesson:'The biggest public moment may require the quietest temperament.' },
  { id:'rosa-parks-1955', person:'Rosa Parks', year:1955, age:42, occupation:'civil rights activist seamstress', wealth:'modest', relationshipStatus:'married', visibility:'global', eventCategory:'Montgomery bus protest arrest', direct:26, classic:8, directReduced:8, classicReduced:8, domains:d({service:.94, legacy:.86, publicVisibility:.78, spirituality:.76, health:.48, relationships:.45}), eventIntensity:92, outcome:'legacy', narrative:'A disciplined refusal became movement catalyst.', falsePositives:['Expanded library seed; verify against detailed biography before treating as decisive analogue.'], decisions:['refused to give up bus seat', 'accepted arrest risk'], personalityShift:'calm, resolute, principled', protectiveLesson:'Small actions become historic when timing and moral structure are ready.' },
  { id:'marie-curie-1903', person:'Marie Curie', year:1903, age:36, occupation:'scientist physicist chemist', wealth:'modest', relationshipStatus:'married', visibility:'global', eventCategory:'Nobel Prize in Physics', direct:31, classic:13, directReduced:4, classicReduced:4, domains:d({creativeOutput:.94, education:.92, legacy:.88, reputation:.78, publicVisibility:.58, career:.72}), eventIntensity:92, outcome:'triumph', narrative:'Painstaking research became world recognition.', falsePositives:['Expanded library seed; verify against detailed biography before treating as decisive analogue.'], decisions:['shared Nobel Prize', 'advanced radioactivity research'], personalityShift:'disciplined, serious, under-recognized', protectiveLesson:'Scientific foundation work can become public honour after long labour.' },
  { id:'jobs-1997', person:'Steve Jobs', year:1997, age:42, occupation:'technology entrepreneur', wealth:'wealthy', relationshipStatus:'married', visibility:'global', eventCategory:'returned to Apple and began turnaround', direct:52, classic:16, directReduced:7, classicReduced:7, domains:d({money:.86, career:.88, leadership:.74, creativeOutput:.72, publicVisibility:.62, legacy:.75}), eventIntensity:86, outcome:'transition', narrative:'A shattered company became the vehicle of return and redesign.', falsePositives:['Expanded library seed; verify against detailed biography before treating as decisive analogue.'], decisions:['returned through NeXT acquisition', 'cut product lines'], personalityShift:'focused, ruthless, restorative', protectiveLesson:'A comeback works when simplification comes before expansion.' },
];
 
const HISTORICAL_CASE_LIBRARY: HistoricalCase[] = [...HISTORICAL_CASES, ...EXPANDED_HISTORICAL_CASES, ...HISTORICAL_CASES_EXPANSION_200, ...HISTORICAL_CASES_EXPANSION_300_EXTRA, ...HISTORICAL_CASES_EXPANSION_300_MORE, ...HISTORICAL_CASES_EXPANSION_FINAL];
 
function intelligenceFor(compound: ChaldeanPYNCompound | null, reduced: number, raw: number): CompoundIntelligence {
  const base = REDUCED_INTELLIGENCE[reduced] || REDUCED_INTELLIGENCE[((reduced % 9) || 9)];
  const over = COMPOUND_INTELLIGENCE[compound?.compound ?? raw] || {};
  return {
    name: over.name ?? compound?.name ?? base.name,
    domains: { ...base.domains, ...over.domains },
    traits: { ...base.traits, ...over.traits },
    polarity: over.polarity ?? base.polarity,
    thesis: over.thesis ?? base.thesis,
    likelyMistake: over.likelyMistake ?? base.likelyMistake,
    strategicMove: over.strategicMove ?? base.strategicMove,
    outcomeLogic: over.outcomeLogic ?? base.outcomeLogic,
  };
}
 
function scoreFrom(map: ScoreMap<Domain>, domain: Domain): number { return map[domain] ?? 0; }
function traitFrom(map: ScoreMap<Trait>, trait: Trait): number { return map[trait] ?? 0; }
 
function ageBand(age: number | null): { label: string; text: string; multiplier: number } {
  if (age === null || Number.isNaN(age)) return { label:'age unavailable', multiplier:1, text:'Because no birth year was supplied, the engine cannot apply age-specific manifestation weighting. The pair is still interpreted, but the app cannot know whether the pattern is likely to manifest as youthful launch, mid-life restructuring, or elder legacy reckoning.' };
  if (age < 20) return { label:`age ${age} formation window`, multiplier:.92, text:`At age ${age}, the pattern usually expresses through education, family, identity formation, first opportunities, body safety, and the institutions around the person rather than through full public destiny.` };
  if (age <= 35) return { label:`age ${age} launch window`, multiplier:1.08, text:`At age ${age}, the pattern tends to manifest as first major proof: career ignition, romance, migration, public identity, first large risk, first public conflict, or the decision that separates the person from a former self.` };
  if (age <= 55) return { label:`age ${age} consolidation window`, multiplier:1.15, text:`At age ${age}, the same compounds test what has already been built: career structure, marriage, reputation, money, health routines, and authority. The year is less about becoming visible for the first time and more about whether existing structures can survive pressure.` };
  return { label:`age ${age} legacy window`, multiplier:1.25, text:`At age ${age}, the pair should be weighted toward law, health, succession, reputation, accumulated karma, legacy, and the verdict of history. Elder years make warning phrases more literal because consequences have had decades to gather.` };
}
 
function ageResonance(age: number | null, args: BuildArgs): string[] {
  if (age === null) return [];
  const notes: string[] = [];
  if (age === args.directRaw) notes.push(`Age ${age} exactly equals the Direct raw compound ${args.directRaw}; the visible layer becomes unusually literal.`);
  if (age === args.classicRaw) notes.push(`Age ${age} exactly equals the Classic raw compound ${args.classicRaw}; the karmic storyline becomes unusually literal.`);
  if (age >= 27 && age <= 31) notes.push('This is a first Saturn-return zone; law, work, body, responsibility, and adult identity become harder to avoid.');
  if (age >= 39 && age <= 42) notes.push('This is a mid-life threshold; relationship, career, mortality, and authenticity themes become more existential.');
  if (age >= 58 && age <= 60) notes.push('This is a second-Saturn zone; health, duty, leadership handover, and legacy review intensify.');
  if (age >= 72) notes.push('This is an elder-legacy zone; the reading should prioritize succession, history, mortality, and karmic harvest.');
  return notes;
}
 
function pairKey(args: BuildArgs): string { return `${cnum(args.directCompound, args.directRaw)}-${cnum(args.classicCompound, args.classicRaw)}`; }
function pairArchetype(args: BuildArgs): PairArchetype | null { return PAIR_ARCHETYPES[pairKey(args)] ?? null; }
 
function domainOverlap(a: ScoreMap<Domain>, b: ScoreMap<Domain>): number {
  let num = 0, den = 0;
  for (const domain of ALL_DOMAINS) { const av = a[domain] ?? 0; const bv = b[domain] ?? 0; num += Math.min(av, bv); den += Math.max(av, bv); }
  return den ? num / den : 0;
}
 
function pairSimilarity(args: BuildArgs, hist: HistoricalCase, directIntel: CompoundIntelligence, classicIntel: CompoundIntelligence): number {
  const direct = cnum(args.directCompound, args.directRaw);
  const classic = cnum(args.classicCompound, args.classicRaw);
  let score = 0;
  if (direct === hist.direct) score += .26;
  if (classic === hist.classic) score += .26;
  if (direct === hist.classic && classic === hist.direct) score += .18;
  if (args.directYear === hist.directReduced) score += .08;
  if (args.classicYear === hist.classicReduced) score += .08;
  if (args.directYear === hist.classicReduced || args.classicYear === hist.directReduced) score += .04;
  const age = typeof args.birthYear === 'number' ? args.targetYear - args.birthYear : null;
  if (age !== null) score += Math.max(0, 1 - Math.abs(age - hist.age) / 60) * .1;
  const symbolicDomains: ScoreMap<Domain> = {};
  for (const domain of ALL_DOMAINS) symbolicDomains[domain] = Math.max(scoreFrom(directIntel.domains, domain), scoreFrom(classicIntel.domains, domain));
  score += domainOverlap(symbolicDomains, hist.domains) * .12;
  if (args.occupation && args.occupation.toLowerCase().split(/\W+/).some(tok => tok.length > 3 && hist.occupation.toLowerCase().includes(tok))) score += .04;
  if (args.wealthProfile && args.wealthProfile === hist.wealth) score += .025;
  if (args.relationshipStatus && args.relationshipStatus === hist.relationshipStatus) score += .02;
  if (args.visibility && args.visibility === hist.visibility) score += .025;
  return clamp01(score);
}
 
function nearestCluster(args: BuildArgs, directIntel: CompoundIntelligence, classicIntel: CompoundIntelligence) {
  return HISTORICAL_CASE_LIBRARY
    .map(h => ({ ...h, similarity: pairSimilarity(args, h, directIntel, classicIntel) }))
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, 6);
}
 
function buildDomainScores(args: BuildArgs, directIntel: CompoundIntelligence, classicIntel: CompoundIntelligence, cluster: ReturnType<typeof nearestCluster>, archetype: PairArchetype | null): Record<Domain, number> {
  const scores: Record<Domain, number> = Object.fromEntries(ALL_DOMAINS.map(k => [k, 0])) as Record<Domain, number>;
  const totalSim = cluster.reduce((a, c) => a + c.similarity, 0) || 1;
  for (const domain of ALL_DOMAINS) {
    const historical = cluster.reduce((a, c) => a + c.similarity * (c.domains[domain] ?? 0), 0) / totalSim;
    const direct = directIntel.domains[domain] ?? 0;
    const classic = classicIntel.domains[domain] ?? 0;
    const reinforcement = direct >= .55 && classic >= .55 ? .08 : 0;
    const boost = archetype?.domainBoost?.[domain] ?? 0;
    // The percentages are historically anchored first, then corrected by the compound pair.
    scores[domain] = clamp01(historical * .62 + Math.max(direct, classic) * .25 + ((direct + classic) / 2) * .13 + reinforcement + boost);
  }
  return scores;
}
 
function rankedDomains(scores: Record<Domain, number>): Array<{ domain: Domain; score: number }> {
  return ALL_DOMAINS.map(domain => ({ domain, score: scores[domain] })).sort((a, b) => b.score - a.score);
}
 
function detectReinforcements(directIntel: CompoundIntelligence, classicIntel: CompoundIntelligence): string[] {
  return ALL_DOMAINS.filter(domain => (directIntel.domains[domain] ?? 0) >= .55 && (classicIntel.domains[domain] ?? 0) >= .55)
    .sort((a,b) => ((directIntel.domains[b] ?? 0)+(classicIntel.domains[b] ?? 0))-((directIntel.domains[a] ?? 0)+(classicIntel.domains[a] ?? 0)))
    .slice(0, 5)
    .map(d => DOMAIN_LABELS[d]);
}
 
function detectConflicts(directIntel: CompoundIntelligence, classicIntel: CompoundIntelligence): string[] {
  const conflicts: string[] = [];
  const dt = directIntel.traits, ct = classicIntel.traits;
  if (traitFrom(dt,'expansion') > .6 && traitFrom(ct,'contraction') > .45) conflicts.push('external expansion versus internal simplification');
  if (traitFrom(dt,'contraction') > .55 && traitFrom(ct,'expansion') > .6) conflicts.push('outer narrowing versus inner growth pressure');
  if (traitFrom(dt,'loss') > .55 && traitFrom(ct,'victory') > .55) conflicts.push('visible loss-pressure versus eventual victory signature');
  if (traitFrom(dt,'victory') > .55 && traitFrom(ct,'loss') > .55) conflicts.push('outer opportunity versus hidden cost');
  if (traitFrom(dt,'visibility') > .6 && traitFrom(ct,'withdrawal') > .5) conflicts.push('public visibility versus private retreat');
  if (traitFrom(dt,'lawPressure') > .55 && traitFrom(ct,'victory') > .55) conflicts.push('formal/legal pressure becoming the road to recognition');
  if (traitFrom(dt,'danger') > .55 || traitFrom(ct,'danger') > .55) conflicts.push('opportunity operating inside a safety or exposure field');
  return uniq(conflicts).slice(0, 4);
}
 
function determinePolarity(directIntel: CompoundIntelligence, classicIntel: CompoundIntelligence): PersonalYearDualEssenceSynthesis['polarity'] {
  const ps = [directIntel.polarity, classicIntel.polarity];
  if (ps.includes('cautionary') && ps.includes('constructive')) return 'mixed ordeal-and-reward';
  if (ps.every(p => p === 'constructive')) return 'predominantly constructive';
  if (ps.every(p => p === 'cautionary')) return 'predominantly cautionary';
  if (ps.includes('threshold')) return 'threshold / transition';
  return 'mixed ordeal-and-reward';
}
 
function masterSignal(args: BuildArgs): string | null {
  const parts: string[] = [];
  const directMaster = [11,22,33].includes(args.directRaw) || [11,22,33].includes(args.directYear) || !!args.directCompound?.isMasterNumber;
  const classicMaster = [11,22,33].includes(args.classicRaw) || [11,22,33].includes(args.classicYear) || !!args.classicCompound?.isMasterNumber;
  if (directMaster) parts.push(`The visible layer carries master-number voltage. That makes the year more symbolic and less ordinary: the public event may look practical, but people will read meaning into it.`);
  if (classicMaster) parts.push(`The hidden storyline carries master-number voltage. That means the real lesson is not merely personal success or failure; it becomes a teaching, building, or illumination test.`);
  return parts.length ? parts.join(' ') : null;
}
 
function karmicDebtSignal(args: BuildArgs, directIntel: CompoundIntelligence, classicIntel: CompoundIntelligence): string | null {
  const dangerCompounds = [13,14,16,18,26,28,29,35,38,43,47,51,52,53,55,59];
  const active = [cnum(args.directCompound,args.directRaw), cnum(args.classicCompound,args.classicRaw)].filter(n => dangerCompounds.includes(n));
  const danger = Math.max(traitFrom(directIntel.traits,'danger'), traitFrom(classicIntel.traits,'danger'), traitFrom(directIntel.traits,'lawPressure'), traitFrom(classicIntel.traits,'lawPressure'));
  if (!active.length && danger < .55) return null;
  return `The alert field is active through ${active.length ? active.join(' and ') : 'the compound language itself'}. This should not be read fatalistically. It should be read operationally: contracts, transport, body strain, legal exposure, partner reliability, public conflict, and security deserve concrete preventive action rather than vague worry.`;
}
 
function ageWindowName(age: number | null): string {
  if (age === null || Number.isNaN(age)) return 'age unavailable';
  if (age < 20) return 'formation window';
  if (age <= 35) return '20–35 launch window';
  if (age <= 55) return '35–55 consolidation window';
  return '55+ legacy / reckoning window';
}
 
function topCaseDomains(c: HistoricalCase, limit = 5): Domain[] {
  return (Object.entries(c.domains) as Array<[Domain, number]>)
    .filter(([, score]) => score >= 0.55)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([domain]) => domain);
}
 
function historicalSimilarityReasons(
  args: BuildArgs,
  c: HistoricalCase & { similarity: number },
  directIntel: CompoundIntelligence,
  classicIntel: CompoundIntelligence,
  ranked: Array<{ domain: Domain; score: number }>
): string[] {
  const reasons: string[] = [];
  const direct = cnum(args.directCompound, args.directRaw);
  const classic = cnum(args.classicCompound, args.classicRaw);
  const currentAge = typeof args.birthYear === 'number' ? args.targetYear - args.birthYear : null;
 
  if (direct === c.direct && classic === c.classic) {
    reasons.push(`Exact compound-pair match: both charts run Direct ${direct}/${args.directYear} and Classic ${classic}/${args.classicYear}. This is the strongest possible structural similarity.`);
  } else {
    if (direct === c.direct) reasons.push(`Same Direct compound ${direct}: the visible manifestation field is similar.`);
    if (classic === c.classic) reasons.push(`Same Classic compound ${classic}: the hidden/karmic storyline is similar.`);
    if (direct === c.classic || classic === c.direct) reasons.push(`The same compounds appear in reversed positions, so the story uses similar material but swaps outer event and inner lesson.`);
  }
 
  if (args.directYear === c.directReduced && args.classicYear === c.classicReduced) {
    reasons.push(`Same reduced pair ${args.directYear}/${args.classicYear}: both years resolve into the same single-digit/master-number pressure pattern.`);
  } else if (args.directYear === c.directReduced || args.classicYear === c.classicReduced) {
    reasons.push(`One reduced essence matches exactly, so one half of the year resolves through the same root vibration.`);
  }
 
  if (currentAge !== null) {
    const gap = Math.abs(currentAge - c.age);
    if (ageWindowName(currentAge) === ageWindowName(c.age)) {
      reasons.push(`Age-window match: you are in the ${ageWindowName(currentAge)}, and ${c.person} was also in that window at age ${c.age}.`);
    } else if (gap <= 7) {
      reasons.push(`Close age resonance: your age ${currentAge} is only ${gap} year${gap === 1 ? '' : 's'} from ${c.person}'s age ${c.age}.`);
    } else {
      reasons.push(`Age difference is ${gap} years, so the example is used mainly for compound/domain similarity, not life-stage similarity.`);
    }
  }
 
  const currentTop = ranked.slice(0, 7).map(r => r.domain);
  const caseTop = topCaseDomains(c, 7);
  const shared = currentTop.filter(domain => caseTop.includes(domain));
  if (shared.length) {
    reasons.push(`Shared active domains: ${shared.slice(0, 5).map(domain => DOMAIN_LABELS[domain]).join(', ')}. These are the specific life arenas that make the case relevant.`);
  }
 
  const directDomains = Object.entries(directIntel.domains).filter(([, score]) => (score ?? 0) >= 0.65).map(([d]) => d as Domain);
  const classicDomains = Object.entries(classicIntel.domains).filter(([, score]) => (score ?? 0) >= 0.65).map(([d]) => d as Domain);
  const caseDomains = topCaseDomains(c, 10);
  const directShared = directDomains.filter(domain => caseDomains.includes(domain));
  const classicShared = classicDomains.filter(domain => caseDomains.includes(domain));
  if (directShared.length) reasons.push(`Direct-essence overlap: the example manifested through ${directShared.slice(0, 4).map(domain => DOMAIN_LABELS[domain]).join(', ')}, the same outward channels activated by your Direct essence.`);
  if (classicShared.length) reasons.push(`Classic-essence overlap: the example's outcome was judged through ${classicShared.slice(0, 4).map(domain => DOMAIN_LABELS[domain]).join(', ')}, matching the deeper storyline of your Classic essence.`);
 
  if (args.visibility && args.visibility === c.visibility) reasons.push(`Visibility match: both patterns operate at ${c.visibility} visibility level.`);
  if (args.occupation && args.occupation.toLowerCase().split(/\W+/).some(tok => tok.length > 3 && c.occupation.toLowerCase().includes(tok))) {
    reasons.push(`Occupation/context match: both profiles share ${c.occupation} terrain.`);
  }
 
  reasons.push(`Outcome lesson: the historical outcome was ${c.outcome}; this tells the engine whether the same compound pressure tends to crown, break, redirect, expose, or immortalize the person when the shared domains activate.`);
  return uniq(reasons).slice(0, 8);
}
 
 
function digitSumLocal(n: number): number {
  return String(Math.abs(n)).split('').reduce((a, d) => a + Number(d), 0);
}
function reduceSingleLocal(n: number): number {
  let v = Math.abs(n);
  while (v > 9) v = digitSumLocal(v);
  return v;
}
function reduceMasterLocal(n: number): number {
  let v = Math.abs(n);
  while (v > 9 && v !== 11 && v !== 22 && v !== 33) v = digitSumLocal(v);
  return v;
}
function rawDirectLocal(day: number, month: number, year: number): number {
  return day + month + digitSumLocal(year);
}
function rawClassicLocal(day: number, month: number, year: number): number {
  return digitSumLocal(day) + digitSumLocal(month) + reduceSingleLocal(year);
}
function famousMirrorRows(args: BuildArgs): Array<{ name: string; score: number }> {
  const direct = args.directRaw;
  const classic = args.classicRaw;
  const directRoot = args.directYear;
  const classicRoot = args.classicYear;
  return famousBirthdays.map(p => {
    const fd = rawDirectLocal(p.day, p.month, args.targetYear);
    const fc = rawClassicLocal(p.day, p.month, args.targetYear);
    const frd = reduceMasterLocal(fd);
    const frc = reduceMasterLocal(fc);
    let score = 0;
    if (fd === direct) score += 36;
    if (fc === classic) score += 36;
    if (frd === directRoot) score += 8;
    if (frc === classicRoot) score += 8;
    if (p.day === args.birthDay && p.month === args.birthMonth) score += 8;
    if (p.month === args.birthMonth) score += 4;
    return { name: p.name, score: Math.min(100, score), isEntity: (p.tags || []).includes('Entity') };
  }).filter(r => r.score >= 80 && !r.isEntity).sort((a, b) => b.score - a.score || a.name.localeCompare(b.name)).slice(0, 3);
}

/** One short, factual description of a historical case, for inline weaving. */
function shortEvent(c: HistoricalCase): string {
  const raw = c.eventDetails || c.narrative || c.eventCategory;
  const flat = raw.replace(/\s+/g, ' ').trim().replace(/\.+$/, '');
  if (flat.length <= 150) return flat;
  const cut = flat.slice(0, 147);
  const lastSpace = cut.lastIndexOf(' ');
  return cut.slice(0, lastSpace > 90 ? lastSpace : 147) + '…';
}

/** The intermarriage itself: Direct × Classic read as ONE story, proven by
 * the real lives that carried the same compound pair. */
function buildWovenSynthesis(
  args: BuildArgs,
  directIntel: CompoundIntelligence,
  classicIntel: CompoundIntelligence,
  ranked: Array<{ domain: Domain; score: number }>,
  conflicts: string[],
  reinforcements: string[],
  cluster: ReturnType<typeof nearestCluster>,
  protection: string,
  polarity: PersonalYearDualEssenceSynthesis['polarity'],
): string {
  const directLabel = label(args.directRaw, args.directYear, args.directCompound);
  const classicLabel = label(args.classicRaw, args.classicYear, args.classicCompound);
  const directThesis = directIntel.thesis.replace(/\.+$/, '');
  const classicThesis = classicIntel.thesis.replace(/\.+$/, '');
  const samePair = args.directRaw === args.classicRaw;

  // ── 0. THE MARRIAGE IN ONE SENTENCE ────────────────────────────────────────
  // The fused thesis: not "two readings side by side" but one statement in
  // which the visible happening and the hidden meaning are the same year.
  const fused = samePair
    ? `ONE SENTENCE, TWO ALTITUDES: In ${args.targetYear}, ${directLabel} governs BOTH levels — what happens on the surface IS the meaning, and the meaning IS the surface event. This doubling is historically the most direct reading the system can give: one vibration, two altitudes, no translation required.`
    : `ONE SENTENCE, TWO ALTITUDES: In ${args.targetYear}, ${directThesis.toLowerCase()} — and that is not a separate story from ${classicThesis.toLowerCase()}. It is the same year: the visible happening and its hidden meaning, two altitudes of one climb.`;

  // ── 1. THE TWO PARTNERS, IN THEIR OWN WORDS ───────────────────────────────
  const partners = samePair
    ? `${directLabel} and ${classicLabel} are one and the same essence this year — married to itself, redoubled. Its single voice speaks twice: as the event (what happens TO you: ${directThesis}) and as the meaning (what it MEANS: ${classicThesis}).`
    : `In ${args.targetYear}, two essences are married in your chart. ${directLabel} is the Surface Journey — what happens TO you: ${directThesis}. ${classicLabel} is the Destiny Blueprint — what it MEANS: ${classicThesis}.`;

  // ── 2. WHERE THEY AGREE: THE UNION ────────────────────────────────────────
  const unionDomains = reinforcements.length
    ? reinforcements.slice(0, 3).join(', ')
    : ranked.slice(0, 2).map(r => DOMAIN_LABELS[r.domain]).join(' and ');
  const union = reinforcements.length
    ? `Where the two agree — ${unionDomains} — the marriage is consummated: these are not possible themes but the year's likely stage, the ground where the surface event and the hidden meaning become the same thing.`
    : `They do not loudly agree on any single stage; their union is adaptive — the surface journey decides what triggers the year, and the blueprint decides how it is judged.`;

  // ── 3. WHERE THEY DIFFER: THE TENSION (honored, not averaged) ─────────────
  const tension = conflicts.length
    ? `Where they differ — ${conflicts[0]} — do not average them. The tension is the year's honesty: what others name from the outside may not be what you experience from the inside. Both are true at their own altitude.`
    : `They carry no major tension this year — the two essences point the same direction, which historically makes the reading unusually direct.`;

  // ── 4. THE PROOF: real lives, with BOTH essences visible in each ──────────
  // Each precedent shows its own compound pair and marks the surface journey
  // (the direct essence at work) and the destiny blueprint (the classic
  // essence at work) inside the SAME real year — the intermarriage
  // demonstrated, not merely asserted.
  const precedents: string[] = [];
  const strong = cluster.filter(c => c.similarity >= 0.8).slice(0, 3);
  const ordinal = ['Its clearest precedent is', 'A second precedent:', 'A third:'];
  strong.forEach((c, i) => {
    const what = shortEvent(c);
    const outcomeWord = c.outcome === 'triumph' ? 'a triumph' : c.outcome === 'loss' ? 'a reversal' : c.outcome === 'legacy' ? 'a legacy' : 'a turning point';
    const lesson = c.protectiveLesson.replace(/\.+$/, '');
    const casePair = `${c.direct}/${c.directReduced} × ${c.classic}/${c.classicReduced}`;
    const pairTag = (c.direct === args.directRaw && c.classic === args.classicRaw) ? ' — your exact pair' : '';
    precedents.push(`${ordinal[i]} ${c.person}'s ${c.year} (${casePair}${pairTag}): on the surface, ${what}; underneath, the blueprint paid it out as ${outcomeWord} — ${lesson}`);
  });
  const strongOutcomes = new Set(strong.map(c => c.outcome));
  const hasPositive = (['triumph', 'legacy'] as const).some(o => strongOutcomes.has(o));
  const hasNegative = (['loss', 'mixed'] as const).some(o => strongOutcomes.has(o));
  const bothSides = hasPositive && hasNegative
    ? ` Note the honesty of the record: the same pair has produced both a triumph and a reversal in real lives — the essences set the stage, but conduct decides which ending you get.`
    : '';
  const mirrors = famousMirrorRows(args);
  let proof = '';
  if (precedents.length) {
    proof = `The proof is in real lives. ${precedents.join('. ')}.${bothSides}`;
    if (mirrors.length) {
      proof += ` In the famous-birthday bank, ${mirrors.map(m => `${m.name} (${m.score}% mirror)`).join(', ')} carry the same pair in ${args.targetYear} — the same two essences, walking with you.`;
    }
  } else if (mirrors.length) {
    proof = `No curated historical case crossed the 80% threshold for this pair, but the famous-birthday bank shows ${mirrors.map(m => `${m.name} (${m.score}% mirror)`).join(', ')} carrying the same two essences in ${args.targetYear}.`;
  } else {
    proof = `No historical case or famous birthday in the current bank crosses the display threshold for this exact pair — the engine keeps using the nearest cases internally for weighting, but refuses to present weak examples as evidence.`;
  }

  // ── 5. HOW TO LIVE THE MARRIAGE ───────────────────────────────────────────
  // The two essences each carry a strategic move; woven together they become
  // one instruction — the surface move executed with the blueprint's motive.
  const directMove = directIntel.strategicMove.replace(/\.+$/, '');
  const classicMove = classicIntel.strategicMove.replace(/\.+$/, '');
  const howToLive = samePair
    ? `How to live it: the one instruction of the year is ${directMove}.`
    : `How to live it: on the surface, ${directMove}; underneath, ${classicMove}. Do the first with the second as your motive — that is the marriage, practiced.`;

  // ── 6. THE VERDICT ────────────────────────────────────────────────────────
  const verdictByPolarity: Record<string, string> = {
    'predominantly constructive': 'Read as one story, the year is constructive: the danger is not absence of luck but scattered attention diluting the main opportunity.',
    'predominantly cautionary': 'Read as one story, the year is cautionary: smaller, safer wins beat dramatic moves with hidden downside. Preservation and correction are the year\'s real work.',
    'mixed ordeal-and-reward': 'Read as one story, the year pays through contrast: pressure first, reward later; exposure first, clarity later. The difficult part is the price of accuracy, not proof the year is failing.',
    'threshold / transition': 'Read as one story, the year is a threshold: something changes form, status, duty, or definition — and the year succeeds only if the new structure is stronger than the one it replaces.',
  };
  const verdict = `${verdictByPolarity[polarity] || verdictByPolarity['threshold / transition']} Guard the marriage at its weakest seam: ${protection}`;

  return `THE SYNTHESIS — HOW YOUR TWO ESSENCES MARRY INTO ONE YEAR\n\n${fused}\n\n${partners}\n\n${union}\n\n${tension}\n\n${proof}\n\n${howToLive}\n\n${verdict}`;
}

function famousBirthdayPersonalYearMirrors(args: BuildArgs): string {
  const direct = args.directRaw;
  const classic = args.classicRaw;
  const directRoot = args.directYear;
  const classicRoot = args.classicYear;
  const rows = famousBirthdays.map(p => {
    const fd = rawDirectLocal(p.day, p.month, args.targetYear);
    const fc = rawClassicLocal(p.day, p.month, args.targetYear);
    const frd = reduceMasterLocal(fd);
    const frc = reduceMasterLocal(fc);
    const reasons: string[] = [];
    let score = 0;
    if (fd === direct) { score += 36; reasons.push(`same Direct ${fd}/${frd}`); }
    if (fc === classic) { score += 36; reasons.push(`same Classic ${fc}/${frc}`); }
    if (frd === directRoot) { score += 8; reasons.push(`same Direct root ${directRoot}`); }
    if (frc === classicRoot) { score += 8; reasons.push(`same Classic root ${classicRoot}`); }
    if (p.day === args.birthDay && p.month === args.birthMonth) { score += 8; reasons.push('same birthday'); }
    if (p.month === args.birthMonth) { score += 4; reasons.push('same birth month'); }
    return { p, score: Math.min(100, score), reasons, fd, fc, frd, frc };
  }).filter(r => r.score >= 40).sort((a,b) => b.score - a.score || a.p.name.localeCompare(b.p.name)).slice(0, 8);
  if (!rows.length) return `Famous birthday personal-year mirrors:\nNo famous-birthday record in the current bank strongly mirrors this Direct/Classic personal-year pattern for ${args.targetYear}.`;
  return `Famous birthday personal-year mirrors from ${famousBirthdays.length} stored profiles:\n${rows.map(r => `• ${r.p.name} — ${r.score}% mirror. ${r.fd}/${r.frd} direct, ${r.fc}/${r.frc} classic. Shared signals: ${r.reasons.join(', ')}. Tags: ${(r.p.tags || []).slice(0, 4).join(', ') || '—'}.`).join('\n')}`;
}
 
function makeHistoricalText(
  args: BuildArgs,
  directIntel: CompoundIntelligence,
  classicIntel: CompoundIntelligence,
  ranked: Array<{ domain: Domain; score: number }>,
  cluster: ReturnType<typeof nearestCluster>
): string {
  const uniquePeople = new Set(HISTORICAL_CASE_LIBRARY.map(c => c.person)).size;
  const libraryLine = `Historical calibration library: ${HISTORICAL_CASE_LIBRARY.length} curated milestone cases across ${uniquePeople} famous people. The engine also scans the ${famousBirthdays.length}-entry famous-birthday bank for people whose current Direct/Classic personal-year pattern mirrors this profile.`;
  const famousMirrorText = famousBirthdayPersonalYearMirrors(args);
  const highConfidence = cluster.filter(c => c.similarity >= 0.8).slice(0, 6);
  if (!highConfidence.length) {
    return `${libraryLine}\n\n${famousMirrorText}\n\nClosest historical cluster:\nNo historical analogue crossed the 80% similarity threshold for display. The engine still uses the nearest cases internally for domain weighting, but it will not present weak examples as evidence.`;
  }
  return `${libraryLine}\n\n${famousMirrorText}\n\nClosest historical cluster — only 80%+ matches are shown:\n${highConfidence.map(c => {
    const eventDate = c.eventDate ? `Event/date: ${c.eventDate}.` : 'Event/date: year-level milestone.';
    const details = c.eventDetails || `${c.eventCategory}. ${c.narrative} Key decision(s): ${c.decisions.join('; ')}. Observed personality shift: ${c.personalityShift}. Outcome category: ${c.outcome}. Protective lesson: ${c.protectiveLesson}`;
    const reasons = historicalSimilarityReasons(args, c, directIntel, classicIntel, ranked).map(reason => `- ${reason}`).join('\n');
    const sourceText = c.sources?.length ? `Sources: ${c.sources.join(' | ')}` : 'Sources: internal curated historical bank; add citation before publication use.';
    return `• ${c.person} ${c.year} — ${pct(c.similarity)}% similarity.\nSpecific similarities:\n${reasons}\nWhat happened: ${eventDate} ${details}\nHow it supports or qualifies this reading: ${c.narrative}\nGuardrail / false-positive lesson: ${c.falsePositives[0]}\n${sourceText}`;
  }).join('\n\n')}`;
}
 
function formatDomainRanking(ranked: Array<{domain: Domain; score: number}>): string {
  return ranked.slice(0, 8).map((r, i) => `${i + 1}. ${DOMAIN_LABELS[r.domain]} — ${pct(r.score)}%`).join('\n');
}
 
function topDomainNames(ranked: Array<{domain: Domain; score: number}>): string[] { return ranked.slice(0, 8).map(r => `${DOMAIN_LABELS[r.domain]} ${pct(r.score)}%`); }
 
function buildDecisionForecasts(archetype: PairArchetype | null, ranked: Array<{domain: Domain; score: number}>, directIntel: CompoundIntelligence, classicIntel: CompoundIntelligence): string[] {
  const out = [...(archetype?.decisionForecasts ?? [])];
  const top = ranked.slice(0, 5).map(r => r.domain);
  if (top.includes('law')) out.push('You will probably become less tolerant of unclear agreements; if something cannot be written clearly, you will start treating it as unsafe.');
  if (top.includes('leadership')) out.push('You are likely to stop waiting for consensus in at least one situation and act as if the responsibility is already yours.');
  if (top.includes('money')) out.push('Money decisions become faster, but the better prediction is not “more money”; it is a sharper distinction between assets that strengthen your position and commitments that trap liquidity.');
  if (top.includes('relationships')) out.push('You will test people by reliability rather than affection; one alliance may become more formal, while another becomes obviously too expensive emotionally or practically.');
  if (top.includes('health') || top.includes('security')) out.push('You may decide to slow, cancel, insure, document, or redesign a plan that initially looked exciting because the risk-to-reward ratio becomes impossible to ignore.');
  if (top.includes('creativeOutput')) out.push('You are likely to choose one message, product, paper, campaign, or performance as the year’s main vehicle and let lesser ideas become secondary.');
  if (traitFrom(directIntel.traits,'competition') > .6 || traitFrom(classicIntel.traits,'competition') > .6) out.push('You become more strategic about opposition: not every fight receives your energy, but the fight that affects your road receives full attention.');
  return uniq(out).slice(0, 8);
}
 
function buildPersonalityShift(archetype: PairArchetype | null, ranked: Array<{domain: Domain; score: number}>, directIntel: CompoundIntelligence, classicIntel: CompoundIntelligence): string {
  if (archetype?.personalityShift) return archetype.personalityShift;
  const top = ranked[0]?.domain;
  if (top === 'leadership') return 'You become more decisive, less apologetic, and less interested in persuading people who have already shown you their limits. The temporary personality shift is toward command.';
  if (top === 'law') return 'You become more procedural and less trusting. You may still be warm socially, but your decision-making becomes contractual: proof, timing, records, and leverage matter more than promises.';
  if (top === 'money') return 'You become more calculating about resources. The year makes you quicker to distinguish real assets from attractive drains, and you may surprise people by cutting costs or refusing vague opportunities.';
  if (top === 'relationships') return 'You become selective with emotional access. Affection alone is not enough; reliability, timing, and mutual usefulness become the real tests.';
  if (top === 'health' || top === 'security') return 'You become more risk-aware, even if reluctantly. The personality shift is toward caution, simplification, and a lower tolerance for people who normalize unnecessary danger.';
  if (top === 'creativeOutput') return 'You become more expressive but also more editorial. The year increases the pressure to choose the message that deserves your full name attached to it.';
  if (traitFrom(directIntel.traits,'withdrawal') > .55 || traitFrom(classicIntel.traits,'withdrawal') > .55) return 'You become quieter, more observant, and more difficult to impress. People may interpret this as distance, but the real shift is discrimination.';
  return 'You become more exacting. The year reduces tolerance for vague motives and pushes you to act from the part of you that already knows what matters.';
}
 
function buildOutcomePrediction(archetype: PairArchetype | null, ranked: Array<{domain: Domain; score: number}>, conflicts: string[], reinforcements: string[], polarity: PersonalYearDualEssenceSynthesis['polarity']): string {
  if (archetype?.outcomePrediction) return archetype.outcomePrediction;
  const top = ranked[0];
  const second = ranked[1];
  const base = `The strongest outcome probability sits in ${DOMAIN_LABELS[top.domain].toLowerCase()} at ${pct(top.score)}%, followed by ${DOMAIN_LABELS[second.domain].toLowerCase()} at ${pct(second.score)}%.`;
  if (polarity === 'mixed ordeal-and-reward') return `${base} The year is likely to pay through contrast: pressure first, reward later; exposure first, clarity later; conflict first, authority later. The outcome improves when you treat the difficult part as the price of accuracy rather than as proof that the year is failing.`;
  if (polarity === 'predominantly cautionary') return `${base} The outcome is less about expansion than preservation, correction, and avoiding the mistake that historical analogues show can become expensive. A smaller, safer win is preferable to a dramatic move with hidden downside.`;
  if (polarity === 'predominantly constructive') return `${base} The outcome is likely to be constructive if you do not dilute the main opportunity. The risk is not absence of luck; it is wasting favourable timing through scattered attention or weak structure.`;
  return `${base} The outcome is transitional: something changes form, status, duty, or definition. The year succeeds if the new structure is stronger than the one it replaces.`;
}
 
function buildProtectiveStrategy(archetype: PairArchetype | null, ranked: Array<{domain: Domain; score: number}>): string {
  if (archetype?.protectiveStrategy) return archetype.protectiveStrategy;
  const top = ranked.slice(0, 4).map(r => r.domain);
  if (top.includes('law')) return 'Do not enter the year with loose paperwork. If the legal/formal domain activates, delay large commitments until obligations, exit clauses, ownership, and liability are explicit.';
  if (top.includes('money')) return 'Before expanding, define your downside limit. Historical analogues show that the danger is rarely lack of opportunity; it is overexposure to an opportunity that looked safe too early.';
  if (top.includes('health') || top.includes('security') || top.includes('travel')) return 'Treat logistics as prophecy. Vehicles, fatigue, medical routines, security, insurance, and contingency plans are not small details this year; they are how the pattern is prevented from becoming literal.';
  if (top.includes('relationships')) return 'Make reliability observable. Do not judge people by affection, charisma, shared history, or urgency; judge by what they do when timing and responsibility become inconvenient.';
  if (top.includes('creativeOutput')) return 'Protect the central message from dilution. Say no to secondary platforms, projects, and audiences if they weaken the one work that can carry the year.';
  return 'Translate the reading into one concrete control: written terms, fewer distractions, better timing, physical protection, or a clearer chain of authority.';
}
 
function titleFor(args: BuildArgs, archetype: PairArchetype | null, ranked: Array<{domain: Domain; score: number}>, conflicts: string[]): string {
  if (archetype) return archetype.title;
  const d = cnum(args.directCompound, args.directRaw);
  const c = cnum(args.classicCompound, args.classicRaw);
  if (conflicts.length) return `${DOMAIN_LABELS[ranked[0].domain]} Under Complementary Tension`;
  if (d === c) return `The Reinforced ${DOMAIN_LABELS[ranked[0].domain]} Year`;
  return `The ${DOMAIN_LABELS[ranked[0].domain]} Year with ${DOMAIN_LABELS[ranked[1].domain]} Consequence`;
}
 
function buildDominantDiagnosis(archetype: PairArchetype | null, args: BuildArgs, directIntel: CompoundIntelligence, classicIntel: CompoundIntelligence, ranked: Array<{domain: Domain; score: number}>, conflicts: string[], reinforcements: string[]): string {
  if (archetype) return archetype.thesis;
  const top = ranked[0];
  const second = ranked[1];
  const conflictLine = conflicts.length ? `The contradiction that deserves attention is ${conflicts[0]}. This means people outside may notice one story while you experience another.` : '';
  const reinforceLine = reinforcements.length ? `The reinforcement is strongest around ${reinforcements.slice(0,3).join(', ')}; those areas should not be treated as background themes.` : '';
  return `The pattern emerging from ${label(args.directRaw,args.directYear,args.directCompound)} and ${label(args.classicRaw,args.classicYear,args.classicCompound)} is a single story about ${DOMAIN_LABELS[top.domain].toLowerCase()} being shaped by ${DOMAIN_LABELS[second.domain].toLowerCase()}. The visible layer pushes through ${directIntel.thesis}; the hidden layer judges the year through ${classicIntel.thesis}. ${conflictLine} ${reinforceLine}`.replace(/\s+/g,' ').trim();
}
 
function buildFeedbackLoopText(): string {
  return 'At the end of the year, the app should ask you to score career, relationships, health, money, travel, legal matters, family, major events, unexpected events, severity, and perceived accuracy. That record should become new training data. The next user with a similar compound pair should then be compared not only to famous public lives, but also to completed private-year outcomes.';
}
 
function intensityScore(args: BuildArgs, ageMultiplier: number, domainScores: Record<Domain, number>, cluster: ReturnType<typeof nearestCluster>, directIntel: CompoundIntelligence, classicIntel: CompoundIntelligence): number {
  const top = Math.max(...Object.values(domainScores));
  const clusterStrength = cluster[0]?.similarity ?? 0;
  const danger = Math.max(traitFrom(directIntel.traits,'danger'), traitFrom(classicIntel.traits,'danger'), traitFrom(directIntel.traits,'lawPressure'), traitFrom(classicIntel.traits,'lawPressure'));
  const master = [11,22,33].includes(args.directYear) || [11,22,33].includes(args.classicYear) || !!args.directCompound?.isMasterNumber || !!args.classicCompound?.isMasterNumber ? .08 : 0;
  return Math.min(100, Math.round((.46 + top * .24 + clusterStrength * .18 + danger * .12 + master) * 100 * ageMultiplier));
}
 
function buildComplementaryBridgeText(args: BuildArgs, directIntel: CompoundIntelligence, classicIntel: CompoundIntelligence, diagnosis: string, reinforcements: string[], conflicts: string[]): string {
  const directLabel = label(args.directRaw, args.directYear, args.directCompound);
  const classicLabel = label(args.classicRaw, args.classicYear, args.classicCompound);
  const tensionLine = conflicts.length
    ? `The complementary tension between the two lenses runs through ${conflicts.join('; ')}. This is not a contradiction to resolve; it is the shape of the year's honesty — the Surface Journey and the Destiny Blueprint are describing two different altitudes of the same climb.`
    : 'The two lenses are not in tension this year; they describe the same climb from the same altitude, which usually means the reading is unusually direct.';
  const reinforceLine = reinforcements.length
    ? `Where they agree — ${reinforcements.join(', ')} — probability shifts from “possible theme” to “likely stage.” Concentrate your attention and strategy here; this is where both maps point to the same terrain.`
    : 'The two lenses do not converge on one dominant domain, so read the Surface Journey for what triggers the year and the Destiny Blueprint for how it will ultimately be judged.';
 
  return `THE COMPLEMENTARY BRIDGE: HOW YOUR SURFACE JOURNEY AND DESTINY BLUEPRINT WORK TOGETHER
 
Your Direct Essence — ${directLabel} — is your SURFACE JOURNEY. It describes the visible terrain: the external events, public drama, literal circumstances, and surface-level challenges that will shape your year. Think of it as the weather you walk through — the storms, the heat, the unexpected turns in the road. It answers the question: “What is happening TO me?”
 
Your Classic Essence — ${classicLabel} — is your DESTINY BLUEPRINT. It describes the underlying pattern: the deeper meaning, karmic outcome, and spiritual lesson the year is designed to teach. Think of it as the map that explains why the terrain looks the way it does — the victory hidden inside struggle, or the loss hidden inside apparent success. It answers the question: “What does it MEAN?”
 
For ${args.targetYear}, these two essences tell one coherent story:
 
${diagnosis}
 
${tensionLine}
 
${reinforceLine}
 
CONSULTANT'S PRINCIPLE: Do not ask “Which system is right?” Ask “What story do both systems tell together?” The Surface Journey without the Destiny Blueprint is a weather report without a forecast. The Destiny Blueprint without the Surface Journey is a prophecy without a landscape. Only together do they become a navigable prediction. The master numerologist does not choose between the two — he reads the bridge.`;
}
 
function fullSynthesisText(args: BuildArgs, title: string, subtitle: string, diagnosis: string, ranked: Array<{domain: Domain; score: number}>, clusterText: string, conflicts: string[], reinforcements: string[], decisions: string[], personality: string, outcome: string, protection: string, ageText: string, master: string | null, karmic: string | null, intensity: number, directIntel: CompoundIntelligence, classicIntel: CompoundIntelligence, woven: string): string {
  const conflictParagraph = conflicts.length
    ? `The complementary tension is not a problem to average out; it is the mechanism of the year. ${conflicts.map(c => `The pattern shows ${c}`).join('; ')}. In practice, this means the Surface Journey and the Destiny Blueprint may not match on the surface. Others may call it expansion while you experience subtraction, or they may see victory while you are busy managing risk — both readings are true at their own altitude.`
    : 'There is no major complementary tension requiring a forced compromise. The two essences mostly point in the same direction, so the correct reading is amplification rather than balance.';
  const reinforcementParagraph = reinforcements.length
    ? `The reinforced domains are ${reinforcements.join(', ')}. Reinforcement matters because it changes probability: these areas move from “possible theme” to “likely stage.” Do not scatter attention evenly across the whole life; concentrate strategy where the Surface Journey and the Destiny Blueprint repeat each other.`
    : 'The pair does not heavily reinforce one single domain, so the year is more adaptive. The practical task is to notice which domain activates first on the Surface Journey and then interpret the Destiny Blueprint through that opening.';
 
  const bridgeText = buildComplementaryBridgeText(args, directIntel, classicIntel, diagnosis, reinforcements, conflicts);
 
  return [
    `FORENSIC PERSONAL YEAR SYNTHESIS\n${title}\n${subtitle}\n\n${woven}\n\nThe strongest question is not “what does each compound mean?” The stronger question is: if these two essences are trying to tell one coherent story about ${args.targetYear}, what is that story? ${diagnosis}`,
    `\n1. THE COMPLEMENTARY BRIDGE\n${bridgeText}`,
    `\n2. HISTORICAL PATTERN DETECTION\n${clusterText}`,
    `\n3. DOMINANT ESSENCE AND COMPLEMENTARY TENSION\n${conflictParagraph}\n\n${reinforcementParagraph}`,
    `\n4. MANIFESTATION PROBABILITY MAP\n${formatDomainRanking(ranked)}\n\nThese percentages are not random decoration. They come from the closest historical cluster, corrected by the Surface Journey / Destiny Blueprint pair and boosted where both essences reinforce the same domain. A low percentage does not mean “nothing can happen” there; it means the year is less likely to choose that domain as its main stage.`,
    `\n5. BEHAVIOUR AND DECISION FORECAST\nPersonality shift: ${personality}\n\nLikely decisions:\n${decisions.map(x => `• ${x}`).join('\n')}`,
    `\n6. OUTCOME FORECAST\n${outcome}`,
    `\n7. PROTECTIVE STRATEGY\n${protection}\n\nThis is intentionally specific. Generic advice such as “work hard” is too weak for this engine. The protective move must match the highest-probability manifestation field, because historical analogues show that the same essence pair can become triumph or loss depending on where the person failed to protect the obvious weak point.`,
    `\n8. AGE, MASTER AND ALERT MODIFIERS\n${ageText}\n\n${master ? `Master-number note: ${master}` : 'No master-number override dominates the pair.'}\n\n${karmic ? `Alert note: ${karmic}` : 'No severe alert compound dominates the pair; ordinary prudence is enough unless the year activates a high-risk domain.'}\n\nIntensity score: ${intensity}/100. High intensity means the pattern is more likely to become concrete and visible; it does not mean the year is automatically good or bad.`,
    `\n9. FEEDBACK LOOP\n${buildFeedbackLoopText()}`,
  ].join('\n');
}
 
export function buildPersonalYearDualEssenceSynthesis(args: BuildArgs): PersonalYearDualEssenceSynthesis {
  const directIntel = intelligenceFor(args.directCompound, args.directYear, args.directRaw);
  const classicIntel = intelligenceFor(args.classicCompound, args.classicYear, args.classicRaw);
  const archetype = pairArchetype(args);
  const cluster = nearestCluster(args, directIntel, classicIntel);
  const domainScores = buildDomainScores(args, directIntel, classicIntel, cluster, archetype);
  const ranked = rankedDomains(domainScores);
  const conflicts = detectConflicts(directIntel, classicIntel);
  const reinforcements = detectReinforcements(directIntel, classicIntel);
  const age = typeof args.birthYear === 'number' ? args.targetYear - args.birthYear : null;
  const ageInfo = ageBand(age);
  const resonance = ageResonance(age, args);
  const master = masterSignal(args);
  const karmic = karmicDebtSignal(args, directIntel, classicIntel);
  const polarity = determinePolarity(directIntel, classicIntel);
  const title = titleFor(args, archetype, ranked, conflicts);
  const subtitle = `${label(args.directRaw,args.directYear,args.directCompound)} × ${label(args.classicRaw,args.classicYear,args.classicCompound)} · ${ageInfo.label} · ${polarity}`;
  const clusterText = makeHistoricalText(args, directIntel, classicIntel, ranked, cluster);
  const diagnosis = buildDominantDiagnosis(archetype, args, directIntel, classicIntel, ranked, conflicts, reinforcements);
  const decisions = buildDecisionForecasts(archetype, ranked, directIntel, classicIntel);
  const personality = buildPersonalityShift(archetype, ranked, directIntel, classicIntel);
  const outcome = buildOutcomePrediction(archetype, ranked, conflicts, reinforcements, polarity);
  const protection = buildProtectiveStrategy(archetype, ranked);
  const ageText = [ageInfo.text, ...resonance].join('\n\n');
  const intensity = intensityScore(args, ageInfo.multiplier, domainScores, cluster, directIntel, classicIntel);
  const woven = buildWovenSynthesis(args, directIntel, classicIntel, ranked, conflicts, reinforcements, cluster, protection, polarity);
  const synthesisText = fullSynthesisText(args, title, subtitle, diagnosis, ranked, clusterText, conflicts, reinforcements, decisions, personality, outcome, protection, ageText, master, karmic, intensity, directIntel, classicIntel, woven);
  const directTopDomains = Object.entries(directIntel.domains).sort((a,b)=>(b[1]??0)-(a[1]??0)).slice(0,4).map(([k]) => DOMAIN_LABELS[k as Domain]);
  const classicTopDomains = Object.entries(classicIntel.domains).sort((a,b)=>(b[1]??0)-(a[1]??0)).slice(0,4).map(([k]) => DOMAIN_LABELS[k as Domain]);
  const directEssenceRole = `THE SURFACE JOURNEY (Direct Essence): ${label(args.directRaw,args.directYear,args.directCompound)} describes the visible terrain — the external events, public drama, literal circumstances, and surface-level challenges that will shape your year. It is what happens TO you. This essence manifests most strongly through: ${directTopDomains.join(', ')}.\n\nConsultant reading: ${directIntel.thesis}\n\nSurface-level mistake to avoid: ${directIntel.likelyMistake}\n\nSurface-level strategic move: ${directIntel.strategicMove}`;
  const classicEssenceRole = `THE DESTINY BLUEPRINT (Classic Essence): ${label(args.classicRaw,args.classicYear,args.classicCompound)} describes the underlying pattern — the deeper meaning, karmic outcome, and spiritual lesson the year is designed to teach. It is what the year MEANS. This essence judges the outcome through: ${classicTopDomains.join(', ')}.\n\nConsultant reading: ${classicIntel.thesis}\n\nBlueprint-level mistake to avoid: ${classicIntel.likelyMistake}\n\nBlueprint-level strategic move: ${classicIntel.strategicMove}`;
 
  return {
    title,
    subtitle,
    wovenSynthesis: woven,
    synthesisText,
    directEssenceRole,
    classicEssenceRole,
    ageModifier: ageText,
    masterNumberSignal: master,
    karmicDebtSignal: karmic,
    historicalCalibration: clusterText,
    predictionFocusAreas: topDomainNames(ranked),
    protectiveActions: uniq([protection, ...decisions.slice(0, 4)]),
    domains: ranked.slice(0, 8).map(r => DOMAIN_LABELS[r.domain]),
    polarity,
    intensityScore: intensity,
  };
}