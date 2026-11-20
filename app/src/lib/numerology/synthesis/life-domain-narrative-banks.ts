/**
 * @fileoverview LIFE-DOMAIN NARRATIVE BANKS
 *
 * Narrative phrase libraries keyed to specific psychomatrix configurations.
 * Used by the hyper-synthesis-generator to produce domain-specific paragraphs
 * that read like a human consultant with intimate knowledge of the grid.
 *
 * Structure per bank:
 * - keyed to line ID + strength category
 * - each entry is a 2-4 sentence paragraph fragment
 * - interpolation tokens: {lineName}, {totalDigits}, {strengthCategory}
 *   are resolved at call time by the generator
 *
 * Domains covered:
 * CAREER   - how the grid manifests in professional life
 * MONEY    - relationship to material resources and financial behaviour
 * RELATIONSHIPS - partnership, family, friendship patterns
 * PARENTING - how the grid shapes the parent role
 * LEADERSHIP - how the grid shapes authority and team relationships
 * HEALTH   - physical intelligence, body signals, energy patterns
 * SPIRITUALITY - meaning-making, transcendence, inner life
 * STRESS   - what specifically triggers the threat response and how it resolves
 */

// ─── TYPE ─────────────────────────────────────────────────────────────────────
export interface DomainNarrative {
  lineId: string;
  strengthCategory: 'absent' | 'weak' | 'balanced' | 'strong' | 'overload';
  domain: string;
  narrative: string;
}

// ─── CAREER NARRATIVES ────────────────────────────────────────────────────────
export const CAREER_NARRATIVES: DomainNarrative[] = [
  // Purpose / Will (row_1)
  {
    lineId: 'row_1', strengthCategory: 'strong', domain: 'career',
    narrative: "In career, the strong Purpose line is the motor that others call ambition and that this person experiences as necessity. They are not working toward a goal in the sense of a target chosen from a menu — they are executing a direction that arrived with the force of internal law. Professional contexts that do not align with this direction are not merely unpleasant; they are literally difficult to sustain because the motivational system that drives performance is direction-specific and cannot be redirected by compensation alone. The career strength of this configuration is the capacity to sustain performance through periods that defeat motivation-dependent workers; the career risk is the inflexibility of direction that makes lateral pivots or subordinate roles genuinely difficult even when circumstances recommend them.",
  },
  {
    lineId: 'row_1', strengthCategory: 'overload', domain: 'career',
    narrative: "At overload levels, the Purpose line has become the total organising principle of professional identity. The person is the mission — they do not merely pursue it. This produces extraordinary single-direction achievement and the specific brittle quality that comes from having placed the entire self inside a professional identity. When the career thrives, the person thrives; when the career faces reversal, it is experienced as personal annihilation rather than professional setback. The healthiest version of this configuration in career is leadership roles with genuine stakes — contexts where the intensity of the Purpose line is appropriate and necessary, and where others do not experience it as consuming the environment.",
  },
  {
    lineId: 'row_1', strengthCategory: 'weak', domain: 'career',
    narrative: "The weak Purpose line creates the professional experience of being between missions — perpetually capable, intermittently engaged, and privately uncertain what the work is actually for. Career in this configuration is often externally successful in terms of skill demonstration but internally experienced as a search rather than an arrival. The specific gift is adaptability: without a fixed directional stake, the person can bring genuine quality to many different contexts without the over-commitment that the strong Purpose line makes inevitable.",
  },
  {
    lineId: 'row_1', strengthCategory: 'absent', domain: 'career',
    narrative: "The absent Purpose line in career produces a professional life built from competence rather than calling. Skills are real, output is genuine, but the animating sense of why — the direction-specificity that would make certain work obviously right and other work obviously wrong — is not naturally available. The career invitation is to construct purpose deliberately rather than discover it: to identify what the work produces in others, what problem it solves in the world, and to build the sense of calling backward from observed impact rather than inward from personal revelation.",
  },
  // Work / Money (col_2)
  {
    lineId: 'col_2', strengthCategory: 'strong', domain: 'career',
    narrative: "The strong Work/Money line is the career's engine room — the specific faculty that converts whatever vision or talent is present into output that can be measured, recognised, and compensated. People with this configuration are often described as excellent executors, reliable deliverers, and the people who actually get things done when others are still planning. The risk is a form of professional invisibility that can arrive at midcareer: recognised for execution rather than strategy, compensated for reliability rather than leadership, and finding the ceiling of the execution-only track before the ceiling of actual capacity is reached.",
  },
  {
    lineId: 'col_2', strengthCategory: 'overload', domain: 'career',
    narrative: "Work/Money at overload has converted career from a professional role into an identity. The person does not have a career; they are their career. This produces extraordinary output volume and the specific diminishing-returns problem of overdone competence: at some point, more output does not produce more professional advancement, and the person who is constitutionally unable to produce less finds that they are maximally productive at a level below where their actual capacity would place them if it were more selectively deployed.",
  },
  {
    lineId: 'col_2', strengthCategory: 'weak', domain: 'career',
    narrative: "The weak Work/Money line means the execution layer of career requires conscious effort where it is automatic for others. Projects begin with genuine intention and stall at the transition from planning to doing; commitments are sincere at the moment of making and difficult to maintain through the unglamorous middle; professional systems — invoicing, follow-up, organisation, client management — resist becoming automatic. The career intervention is structural scaffolding rather than motivational amplification: external systems, automated processes, and accountability structures that do not require the Work/Money line to be active in order to function.",
  },
  // Talent / Gifts (col_3)
  {
    lineId: 'col_3', strengthCategory: 'strong', domain: 'career',
    narrative: "The strong Talent line in career creates a specific and sometimes frustrating position: the gifts are real and recognised, but the line between being recognised for gifts and being compensated for them is crossed primarily by an act of self-declaration that this configuration often delays. Others see the talent before the person fully claims it. The highest-leverage career move available to someone with a strong Talent line is not more skill development — it is visibility: putting the existing talent in front of the audiences that can respond to it and being willing to name the talent as belonging to the self.",
  },
  {
    lineId: 'col_3', strengthCategory: 'absent', domain: 'career',
    narrative: "The absent Talent line does not mean a career without strengths — it means strengths are developed through sustained effort rather than arrived with naturally. The career advantage this creates is underrated: competence built through deliberate practice has a durability and transferability that natural gifts often do not. The career challenge is finding the right field before the effort investment is made — the absent Talent line makes the choosing particularly important because the effort required to develop competence is real and not infinitely replicable across multiple domains.",
  },
];

// ─── MONEY NARRATIVES ─────────────────────────────────────────────────────────
export const MONEY_NARRATIVES: DomainNarrative[] = [
  {
    lineId: 'col_2', strengthCategory: 'strong', domain: 'money',
    narrative: "The strong Work/Money line produces a relationship to financial resources that is functional and productive: money is a score, and the score reflects effort and competence, and both effort and competence are available in quantity. The financial risk of this configuration is not scarcity of income but insufficiency of intentional financial management — money arrives reliably enough that the system that manages it can be informal, and the informal system typically leaks. Strength in production does not automatically produce strength in stewardship; the specific financial intervention is the deliberate construction of a stewardship system that does not require active attention to function.",
  },
  {
    lineId: 'col_2', strengthCategory: 'overload', domain: 'money',
    narrative: "At overload, the Work/Money line has made financial achievement a primary identity vehicle. This creates a particular financial psychology: enough is never enough because the function of money is not security or freedom but self-definition, and the self has no ceiling. The financial planning challenge in this configuration is not 'how much do I need?' — that question cannot be stably answered when the function of money is identity rather than resource — but 'what would I want money to make possible?' Moving from money-as-score to money-as-tool requires identifying specific non-financial life goals that money is meant to serve, which introduces an external reference point that the overload configuration otherwise lacks.",
  },
  {
    lineId: 'col_2', strengthCategory: 'weak', domain: 'money',
    narrative: "The weak Work/Money line's financial signature is not consistent poverty but consistent disorder — income that does not reliably produce savings, financial decisions that are made in the moment rather than from a plan, and a general relationship to money that is more reactive than strategic. The corrective is automation and structural design: the Work/Money line that is weak does not become strong through effort, but its practical consequences can be managed by systems that operate automatically, without requiring the active engagement that this configuration finds difficult to sustain.",
  },
  {
    lineId: 'diag_spirit', strengthCategory: 'strong', domain: 'money',
    narrative: "The strong Spirituality diagonal frequently creates a complex relationship to money that has an intellectual component ('money is spiritually inferior') but a practical root (money management requires the kind of sustained, detailed, unglamorous attention that this line finds difficult to sustain). The financial intelligence available here is not the kind that produces careful stewardship — it is the kind that produces good timing and sound judgment about macro-level decisions. The practice is to use the genuine intuitive intelligence for big financial decisions (when to invest, what to invest in, when to take risk) while delegating or automating the detailed management that this configuration resists.",
  },
  {
    lineId: 'row_1', strengthCategory: 'strong', domain: 'money',
    narrative: "Strong Purpose in relationship to money creates a specific financial pattern: money that serves the purpose is easily motivated; money-making that is disconnected from purpose is psychologically difficult to sustain. This can produce income streams that are purpose-aligned but modestly compensated, alongside a consistent underinvestment in the financial infrastructure that would allow the purpose to operate at larger scale. The financial insight this configuration needs is that resources are not the antithesis of mission — they are the amplifier. A purpose that generates insufficient resources eventually compromises the mission it was meant to serve.",
  },
];

// ─── RELATIONSHIP NARRATIVES ──────────────────────────────────────────────────
export const RELATIONSHIP_NARRATIVES: DomainNarrative[] = [
  {
    lineId: 'row_2', strengthCategory: 'strong', domain: 'relationships',
    narrative: "Strong Family/Attachment creates a relational life that is rich, central, and genuinely nourishing — for the people inside it. The person's capacity for emotional attunement, loyalty, and sustained care produces relationships of real depth and the specific quality of being known rather than merely seen. The shadow is the degree to which the relational orientation can consume all available psychological bandwidth, leaving insufficient space for the parts of the self that exist outside of relationship: the individual goals, the private interests, the interiority that requires solitude to develop.",
  },
  {
    lineId: 'row_2', strengthCategory: 'overload', domain: 'relationships',
    narrative: "Family/Attachment at overload has made relationships the primary organising principle of the self. The person exists primarily as a relational entity — partner, parent, caregiver, friend — and the non-relational self is chronically secondary or absent. This produces extraordinarily devoted relationships that nonetheless carry a hidden instability: when the relationships change (when children grow up, when a partnership ends, when a parent dies) the person may discover that the self that remained when the relational roles were removed is less developed than they had assumed. The relational work here is to invest in the individual self with the same energy currently applied to others.",
  },
  {
    lineId: 'row_2', strengthCategory: 'weak', domain: 'relationships',
    narrative: "The weak Family/Attachment line does not produce a person who is incapable of relationship — it produces a person for whom the emotional-relational layer of experience requires more deliberate effort than for those with stronger lines. Relationships are valued intellectually and may be genuinely desired, but the automatic responsiveness, the instinctive accommodation, and the reflexive prioritisation of others' needs that characterise a strong Attachment line must here be consciously chosen rather than naturally produced. This is not a disability; it is a different relational style whose honesty — relationships entered deliberately rather than reflexively — can be its own form of depth.",
  },
  {
    lineId: 'col_1', strengthCategory: 'strong', domain: 'relationships',
    narrative: "Strong Self-Esteem in relationship produces a partner who is self-directed, clear about their own views, and unlikely to lose themselves inside a relationship — qualities that are genuinely attractive. The relational risk is the same quality in its less welcome form: the self-directed clarity that is attractive at the beginning of a relationship can manifest as an unwillingness to be changed by intimacy, a resistance to the mutual shaping that relationships require, and a response to a partner's deeper needs that feels like a dismissal of the partner's reality rather than the confidence the person intends. The practice is to allow the relationship to leave a mark — to let the partner's perspective actually change yours, not just be received and processed back to the pre-existing conclusion.",
  },
  {
    lineId: 'diag_carnal', strengthCategory: 'strong', domain: 'relationships',
    narrative: "Strong Temperament in relationship means physical and sensory presence is alive and vivid — the person is genuinely present in their body during intimacy, responsive to physical signals, and capable of the kind of unreserved physical engagement that creates the specific quality of being fully met by another. The relational risk is the intensity of this energy: when physical chemistry is present, it can be mistaken for compatibility; when it fades, the relationship may feel over rather than entering its deeper register. The practice is to develop emotional and intellectual relational capacity with the same aliveness that the Temperament line brings to physical presence.",
  },
  {
    lineId: 'diag_carnal', strengthCategory: 'absent', domain: 'relationships',
    narrative: "The absent Temperament line in relationship creates a specific form of disconnection that is difficult to name from inside the experience: a sense of being present in a relationship at the levels of emotion, thought, and commitment, but somehow absent at the physical-instinctual level that a partner may need for full relational satisfaction. Partners may describe this as difficulty being 'felt,' or note that physical affection feels effortful or performed rather than spontaneous. This is not absence of care; it is absence of the specific physical-instinctual register through which care would normally be transmitted and received. Deliberate cultivation of physical presence — not as performance but as sensory attention — is the specific practice this configuration requires.",
  },
];

// ─── PARENTING NARRATIVES ─────────────────────────────────────────────────────
export const PARENTING_NARRATIVES: DomainNarrative[] = [
  {
    lineId: 'row_1', strengthCategory: 'strong', domain: 'parenting',
    narrative: "In parenting, the strong Purpose line produces a parent with clear values, strong direction, and the capacity to hold a developmental vision for their child across time. The risk is the transmission of that vision in ways that feel like a mandate rather than an invitation: the child who is parented by a strong Purpose line may experience parental love as conditional on alignment with the parent's directional values. The practice for this configuration is to remain genuinely curious about who the child is rather than who the child is becoming in the context of the parent's vision.",
  },
  {
    lineId: 'row_2', strengthCategory: 'strong', domain: 'parenting',
    narrative: "The strong Attachment parent is the parent children bring their problems to — the one they trust with difficulty, the one who notices when something is wrong before it is said, and the one whose relational reliability creates a secure base from which children explore. The shadow of this configuration in parenting is the difficulty allowing children to experience failure, conflict, and difficulty without the parent intervening to smooth it: the same attunement that creates the secure base can, when overextended, prevent the child from developing the tolerance for difficulty that their own adult life will require.",
  },
  {
    lineId: 'row_2', strengthCategory: 'overload', domain: 'parenting',
    narrative: "Parenting with an overloaded Attachment line can produce a style that is intensely nurturing and subtly consuming: the parent's need to be needed, to be central to the child's emotional world, and to remain the primary attachment figure can outlast the developmental stage at which this is appropriate. Children who experience this configuration often describe parents who were genuinely loving and also genuinely difficult to leave — where 'leaving' means the ordinary developmental separation, not geographic distance. The practice is to take genuine pleasure in the child's independence, to identify moments when the child resolves something without the parent's help and to respond to those moments with pride rather than irrelevance.",
  },
  {
    lineId: 'col_1', strengthCategory: 'strong', domain: 'parenting',
    narrative: "The strong Self-Esteem parent is clear in their values, confident in their approach, and unlikely to be destabilised by the ordinary parental uncertainties that consume less grounded parents. The risk in parenting specifically is the translation of this confidence into an expectation that the child share the parent's self-certainty — an expectation that can feel like dismissal of the child's very different and normal self-questioning. The most valuable gift this configuration can offer its children is the modelling of confident self-direction, paired with the explicit permission to find a different direction.",
  },
  {
    lineId: 'diag_spirit', strengthCategory: 'strong', domain: 'parenting',
    narrative: "Parenting with a strong Spirituality diagonal produces a parent who is naturally inclined to address the child's meaning-making, inner life, and larger purpose — dimensions of development that more practically oriented parenting misses. The risk is a spiritual language and framework that the child has not chosen and may need to exit in order to find their own. The practice is to transmit the spiritual orientation as one possible framework rather than the only accurate description of reality, and to support the child's spiritual exploration even when it diverges from the parent's specific tradition or framework.",
  },
  {
    lineId: 'col_2', strengthCategory: 'overload', domain: 'parenting',
    narrative: "The overloaded Work/Money parent is physically present inconsistently and psychologically present even less — the high-output professional mode that defines this configuration does not have an 'off' setting, and parenting tends to receive the attention that remains after the work system's needs are met, which is typically less than the parent intends and less than the child requires. The specific harm is not dramatic neglect; it is the cumulative experience of a parent who is perpetually almost available — engaged when present but not quite present even when engaged. The corrective requires structural protection of parenting time with the same intensity that professional time is protected.",
  },
];

// ─── SPIRITUALITY NARRATIVES ──────────────────────────────────────────────────
export const SPIRITUALITY_NARRATIVES: DomainNarrative[] = [
  {
    lineId: 'diag_spirit', strengthCategory: 'strong', domain: 'spirituality',
    narrative: "The Spirituality diagonal at this level produces a person for whom the question of meaning is not philosophical but practical — a constant background processing of experience against a larger framework of significance. The spiritual gift is genuine access to expanded perception: the capacity to read situations at a level of abstraction that others cannot access without training that this person never required. The spiritual risk is the use of this access to bypass the very human experiences — failure, confusion, dependency, ordinariness — that the tradition being accessed consistently names as the actual location of transformation.",
  },
  {
    lineId: 'diag_spirit', strengthCategory: 'overload', domain: 'spirituality',
    narrative: "Spirituality at overload levels has organised the entire personality around the transcendent at the expense of the immanent. The person lives primarily in the symbolic, the meaningful, the significant — and struggles with the unsymbolic requirements of daily existence: bills, maintenance, conflict resolution, the purely administrative dimensions of human life. The spiritual maturity this configuration requires is not more transcendence but more willingness to find the sacred in the mundane — the discipline of regarding the ordinary as worthy of the full intelligence that is currently deployed almost exclusively in the exceptional.",
  },
  {
    lineId: 'diag_spirit', strengthCategory: 'weak', domain: 'spirituality',
    narrative: "The weak Spirituality diagonal produces a person whose primary intelligence is practical, relational, or analytical rather than transcendent — someone who builds, manages, connects, and achieves with genuine effectiveness, and for whom the question of meaning arrives late and somewhat unexpectedly, usually in a life-stage transition that the practical orientation has not been equipped to navigate. The spiritual invitation for this configuration is not conversion to a tradition but the development of a personal framework for making sense of the experiences that competence and achievement do not resolve: loss, mortality, purpose, and the question of what the accumulated output of a productive life actually means.",
  },
  {
    lineId: 'row_1', strengthCategory: 'strong', domain: 'spirituality',
    narrative: "For the strong Purpose line, spirituality and mission often cannot be cleanly separated — the calling is itself the spiritual practice. The risk is a spirituality that is entirely directional: meaningful when the mission is advancing, hollow when it is blocked or when the mission itself comes into question. The spiritual depth this configuration is capable of — and often reaches only in midlife or through significant reversal — is the discovery that the self that held the purpose is not identical with the purpose, and that this self has value and reality independent of what it is achieving.",
  },
  {
    lineId: 'col_3', strengthCategory: 'strong', domain: 'spirituality',
    narrative: "The strong Talent line, in its spiritual dimension, produces the experience of gift as calling — the perception that the specific capacity one was born with is not accidental but intentional, and that the proper use of it has a dimension beyond personal success. This is a genuinely spiritual perception, and it comes with a genuinely spiritual obligation: the sense that the gift is not fully one's own and carries with it a responsibility of expression that transcends personal benefit. When the Talent line produces this orientation, the work itself becomes the spiritual practice and its proper deployment becomes the primary spiritual commitment.",
  },
];

// ─── STRESS NARRATIVES ────────────────────────────────────────────────────────
export const STRESS_NARRATIVES: DomainNarrative[] = [
  {
    lineId: 'row_1', strengthCategory: 'strong', domain: 'stress',
    narrative: "The strong Purpose line activates its stress response through obstruction. The psychological signature of this configuration under pressure is not anxiety (which is future-oriented and threat-based) but agitation (which is present-oriented and direction-based): the acute discomfort of being kept from something rather than being afraid of something. This is useful information because the antidote is different: anxiety requires reassurance; agitation requires movement. The fastest stress intervention for this configuration is the identification and execution of any available forward action, however small.",
  },
  {
    lineId: 'row_2', strengthCategory: 'strong', domain: 'stress',
    narrative: "Strong Attachment produces relational stress as the primary stress experience: the most intense distress arises from conflict, disconnection, or threat within significant relationships, regardless of any professional or material security present. The counterintuitive aspect of this configuration is that the relational threat that triggers the stress response is often more internally generated than externally real — the hypervigilance to relational signals that the strong Attachment line produces can amplify ambiguous signals into perceived threats. The stress practice is relational reality-testing: before assuming the relationship is at risk, check the actual evidence.",
  },
  {
    lineId: 'col_2', strengthCategory: 'overload', domain: 'stress',
    narrative: "Overloaded Work/Money produces stress through inactivity as much as through overwork. The motivational system that runs this configuration experiences the cessation of productive output as a threat signal — rest is not neutral; it is subtly alarming. This means the person is never fully recovered, because the recovery state itself generates low-level stress that the work temporarily resolves. The corrective is to distinguish between genuine rest (which restores capacity) and avoidance of the distress that stopping creates. The capacity to actually stop, and to tolerate the discomfort of stopping, is a learnable skill that this configuration specifically needs to develop.",
  },
  {
    lineId: 'diag_carnal', strengthCategory: 'absent', domain: 'stress',
    narrative: "Absent Temperament produces stress that accumulates physically before it registers psychologically. The person is often the last to know they are stressed because the early somatic signals — tension, fatigue, disrupted appetite, restlessness — do not reliably reach conscious awareness until they become severe. The pattern is punctuated by physical breakdowns that arrive without warning rather than preceded by the gradual escalation of symptoms that allow more sensorially attuned people to intervene before the threshold. The preventive practice is scheduled physical self-assessment rather than reactive attention.",
  },
];

// ─── LEADERSHIP NARRATIVES ────────────────────────────────────────────────────
export const LEADERSHIP_NARRATIVES: DomainNarrative[] = [
  {
    lineId: 'row_1', strengthCategory: 'strong', domain: 'leadership',
    narrative: "Strong Purpose produces a leadership style characterised by unusual directional clarity and the specific authority that comes from a person who is genuinely oriented toward something beyond their own status. Teams led by this configuration often describe the experience of being pulled toward something important — the leader's direction is felt as a current rather than an instruction. The leadership shadow is the specificity of the direction: the Purpose line's clarity can translate into inflexibility about how the direction is pursued, which can alienate contributors who have different but equally valid routes to the shared goal.",
  },
  {
    lineId: 'row_2', strengthCategory: 'strong', domain: 'leadership',
    narrative: "Strong Attachment produces a leadership style that prioritises the relational health of the team over the efficiency of individual performance systems — and consistently produces better retention and team cohesion as a result. This leader notices when someone is off before the person knows they are off; they create the conditions in which performance problems surface early enough to be resolved rather than late enough to require removal. The leadership limitation is the discomfort with the necessary decisions that require prioritising the organisation over the individual — terminations, restructures, and the choice to hold a standard that a beloved team member cannot meet.",
  },
  {
    lineId: 'col_1', strengthCategory: 'strong', domain: 'leadership',
    narrative: "Self-Esteem at leadership scale produces a leader who is psychologically stable under pressure — who does not catastrophise setbacks, does not require constant external validation to maintain direction, and can hold a position under criticism with genuine (not performed) equanimity. The leadership limitation is the same quality in its less welcome form: the self-stability that allows the leader to maintain direction under criticism can prevent the leader from genuinely updating when the criticism is correct. The distinction between maintaining direction under illegitimate pressure and refusing to update under legitimate pressure is the key leadership learning for this configuration.",
  },
  {
    lineId: 'col_2', strengthCategory: 'strong', domain: 'leadership',
    narrative: "Strong Work/Money at leadership level produces an execution-oriented leader — someone who creates momentum, delivers on commitments, and holds teams accountable to performance standards with the specific authority of someone who personally demonstrates what they require. The leadership growth edge for this configuration is strategy: the capacity to say 'we are not doing this' with the same force and clarity that the high-execution orientation uses to say 'we are doing this better.' The highest-leverage leadership move for this configuration is developing the capacity to deliberately not-do, to prune the organisational portfolio with the same energy currently applied to growing it.",
  },
];

// ─── CONSOLIDATION UTILITY ────────────────────────────────────────────────────
export function getDomainNarrative(
  lineId: string,
  strengthCategory: string,
  domain: string,
  allBanks: DomainNarrative[][]
): string | null {
  for (const bank of allBanks) {
    const match = bank.find(
      (n) => n.lineId === lineId && n.strengthCategory === strengthCategory && n.domain === domain
    );
    if (match) return match.narrative;
  }
  return null;
}

export const ALL_DOMAIN_BANKS = [
  CAREER_NARRATIVES,
  MONEY_NARRATIVES,
  RELATIONSHIP_NARRATIVES,
  PARENTING_NARRATIVES,
  SPIRITUALITY_NARRATIVES,
  STRESS_NARRATIVES,
  LEADERSHIP_NARRATIVES,
];
