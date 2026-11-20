import React, {
  useMemo,
  useState,
  useRef,
  useEffect,
  useCallback,
} from "react";
import {
  getCompoundForPYN,
  getClassicCompoundForPYN,
} from "../../lib/numerology/chaldean-pyn-compounds";
import {
  computeRawPersonalYear,
  computeRawPersonalYearClassic,
  reduceNum as reduceMasterSafe,
} from "../../lib/numerology/personal-year-full";
import { buildPersonalYearDualEssenceSynthesis } from "../../lib/numerology/personal-year-synthesis";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Filler,
  Title,
  type ChartData,
} from "chart.js";
import annotationPlugin from "chartjs-plugin-annotation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { PersonalYearData } from "./types";
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Filler,
  Title,
  annotationPlugin,
);
interface PersonalYearChartProps {
  birthDay: number;
  birthMonth: number;
  birthYear: number;
  onYearSelect: (data: PersonalYearData | null) => void;
}
const PERSONAL_YEAR_MEANINGS: { [key: number]: string } = {
  1: `PERSONAL YEAR 1 – AN ACTIVE YEAR OF ADJUSTMENT This is an extremely powerful doing year for personal growth and expression as we adjust to the changes wrought during the now-concluded PY9. The power of this year encourages us to dare to be different as we improve in self-confidence and extricate ourselves from the limitations religion-dominated society feels justified in inflicting upon its faithful. This is an excellent year for the breaking of old habits. Indeed, adaptation to a new lifestyle invariably demands such severance. It is especially powerful year for improving ourselves financially and for buying and selling on a wide scale, such as with real estate, business interests and investments. However, the most significant and permanent success will only be achieved when people's motives are genuinely for the common good, free of personal greed and recklessness. Ruling 1 people will find adaptation so effortless this year that they can be easily lulled into an attitude of frivolity. They must be careful to avoid recklessness, especially in financial matters, and take heed not to succumb to egocentricity. With appropriate self-discipline, they will find it a year of significant material growth and personal popularity.
ESOTERIC: THE BURDEN OF THE ARCHITECT. It's a year of radical isolation. You are the only one who can see the vision. It requires the "death" of your former identity to make room for the new seed.`,
  2: `PERSONAL YEAR 2 – A SPIRITUAL GROWTH YEAR OF SHARING Though not with the power of a peak number, this is a year in which its own powerful nature can be significant enough to cause many a turbulent personality to embrace calmness. Spiritual development is the primary feature of this year with an enhanced awareness of life's more subtle qualities. Rather than being a year of major change, it is one in which the development of emotional control, spiritual awareness and accentuated intuition can be expected. Central to the growth under this year's vibration is the need to actively develop the power of meditation. By this means, more than any other, the body's cellular alignment is restored to achieve the inner power we all want as our limitless energy reserve and our magnetic essence. By this means, we learn to be in command of our emotions, to act rather than react, to replace uncertainty and doubt with confidence and security, and to wisely discriminate between the more important and the less important aspects of our daily life. Following the two previous years of progress, some people develop a tendency to rest on their laurels or lapse into complacency. It is then that negativity takes the opportunity to develop those reactive emotions of fear, nervousness, argumentativeness and insecurity that can sometimes manifest in the most unexpected ways to make an otherwise likeable person seem quite obnoxious or unbearably power-crazed. Realise it as a year for cooperation, for working together in one or more partnerships (home, work, sports, and so on). To satisfactorily achieve this, we need to be more loving and more accepting – further growth aspects of this year. Ruling 2 and Ruling 11 people will be especially susceptible to the increased sensitivity accompanying this year's vibrations. It should not be surprising for them if their psychic awareness takes on a significantly elevated level of expression, almost projecting their consciousness into another dimension.
ESOTERIC: THE PSYCHIC SPONGE. This isn't just about "waiting"; it's about developing extreme receptivity. You are learning to be "second" so you can understand the nuances of energy and intuition.`,
  3: `PERSONAL YEAR 3 – A MIND-EXPANSIVE YEAR Between the peak PYNs and the trough of the PY4 comes this year of surprisingly intensified mental power that provides the appropriate rounded development for this portion of the Personal Year cycle. Under this vibration, our thinking and observing faculties are attuned to an acute peak of alertness. It is a year when the intellect thirsts for knowledge and expression. For some, it could involve study of an academic nature. Others might prefer to investigate life and its philosophies, while some might seek enlightenment through personal growth. The usual means of mental expansion this year are either through an educational course or extensive travel. Whatever the choice, it is important to realise that this year is one in which the further development of memory is vital, for the 3 vibration is the gateway to the mind through memory. We should always realise that memory is the foundation of self-esteem and self-confidence, as well as the bridge between our conscious and unconscious minds. The continual alertness and growing capacity of our memory is invariably distinguishable between the ageing and the ageless people. On the lighter side of the PY3, we should recognize the need for balance by ensuring that time is allowed in our lives for humour, happy occasions, bright company and the appreciation of a good joke. Ruling 3 people will be especially attuned to this year's vibrations, but they must learn to control their high level of rationality to ensure that it does not swamp their feelings. For them, the enhanced mental alertness they will experience this year needs to be channelled into avenues of constructive and expansive awareness for their personal satisfaction and for the peace of mind of those with whom they associate (who may otherwise grow tired of an overbalanced mentality and become the subject of frequent destructive criticism).
ESOTERIC: THE MASK AND THE MIRROR. It is the "adolescence" of the cycle. The challenge is moving beyond superficial charm to find authentic self-expression. It's about the vulnerability of being truly seen.`,
  4: `PERSONAL YEAR 4 — A YEAR OF CONSOLIDATION Physical and material factors dominate this trough year. Rest and stability are vital to regenerate and consolidate the previous five years' development. It is a year of squaring (as symbolised geometrically by the four-sided figure), when everything is brought to a reckoning and the unwanted aspects are eliminated, as a vine is pruned in winter to make way for the coming new growth the following spring. This is an ideal year for integrating Basic Self (body and emotions) Conscious Self (thoughts and ideas) with High Self (the eternal soul). Those who do not follow the need for time out to relax and adjust could find themselves in a state of disharmony, leading to frustration, confusion and fear. Any attempt at major changes in affairs or lifestyles during this year are rarely successful, leading instead to material loss in either finances, health or both. People who are usually regarded as being highly strung, whose nerves are ever tense and whose sensitivities are acute, should be especially careful to avoid any disharmony in their dealings with others this year. For them, a relaxed vacation will be most beneficial. Ruling 4 people cannot be blamed for feeling quite frustrated under this year's vibrations. Invariably, they will fail to recognise it as a year of consolidation, trying instead to maintain the impetus of the progress achieved during the previous four years. As a result, their nerves take a severe battering. For them, increased rest and reduced emotional disturbances (such as avoiding TV, movie "thrillers," and domestic or work arguments) will help reduce the toll on their health. The inclusion in their diet of adequate B-complex vitamins will be of enormous help in restoring nerve energy, as will appropriate homoeopathic nerve tonics; but addictive drugs should be avoided, for they only incite secondary problems. Ruling 22/4 people should accept the same advice, but with the additional suggestion that their tendency toward self-suppression be even more firmly resisted.
ESOTERIC: THE ANVIL. While most call this "hard work," it is actually about ancestral patterns. It is the year you confront the foundations laid by your parents and society. It feels restrictive because you are being compressed into a diamond. NOTE: This is an incubation period.`,
  5: `PERSONAL YEAR 5 – A YEAR OF FREEDOM Spiritual and emotional factors prevail this year. Its vibrations span the gap between last year's trough and next year's creative mini-peak, igniting the power of freedom, generated by heightened psychic awareness and personal expression. This leads to the development of our talents to find release from material and social confinement, replacing them with a new focus on artistic expression, whether for a hobby or professionally. Some have launched the basis for a new career under this vibration. Others have discovered their freedom in a change of home, moving to the country and away from city confinement. Ruling 5 people will find this a year in which their desires for freedom become almost obsessive. However, they must realize that it is not always physical freedom they need, though it is sometimes easier to believe so, thereby rationalising and masking an emptiness in personal understanding. Their primary need is for freedom of expression, a quality that is comparatively new to human life but, thankfully, becoming more and more universal. Music, painting, pottery or any similar form of artistic expression provide the vent for our sensitivity and much needed nourishment for the nerves, helping us to develop that all-important personal calmness.
ESOTERIC: THE CROSSROADS OF CHAOS. Beyond just "travel and change," this is a sensory recalibration. The universe throws a wrench in your Year 4 structures to see if you've become too rigid. It's a test of your ability to remain centered while the world spins.`,
  6: `PERSONAL YEAR 6 – A YEAR OF CREATIVITY This is the year of the mini-peak, its focus on accumulation of power that seeks vent through one's investment in creative time. New creative projects undertaken this year will have the most favourable aspects for success, especially if their underlying principle is directed toward the upliftment of humankind. It is a year in which the formation of any worthwhile business undertaking will considerably benefit. It is also a year of focus on the home and on personal relationships. Creative activities related to the home will receive a significant boost under this vibration. In the area of relationships, many are either secured or released as underlying integrity casts free any falseness or negativity. Persisting with such undesirable traits will ensure that this is a most difficult year, inciting intense anxiety, arguments and hatred. Clearly, the lesson of this year is to come to terms with facts as they are. It's also important to recognise what it is to have personal honesty and integrity, and a positive attitude. Then it will be a most rewarding year, crowned by happiness, creative achievement and sound financial success. Ruling 6 people are the most tested under this vibration, for the intensification of their creativity and personal integrity combine to make it a powerful, yet cleansing period. Those engaged in the positive aspects of the 6 will find their creativity boosted as they attain a new high in happiness. They would have it no other way. Though there are many Ruling 6s that have not yet seen the light, preferring to dwell in the mud-hole of negativity, adopting worry and anxiety as their trademarks. They are already sick and will only become sicker as their bodies become more enervated and their attitude to life leads to further loneliness. Adopting the positive, creative approach is their only answer.
ESOTERIC: THE GOLDEN HANDCUFFS. Usually labeled "responsibility/family," the deeper meaning is The Karmic Mirror. You attract exactly the level of harmony (or discord) that you hold within. It's a year of "Sacred Service" versus "Slavery".`,
  7: `PERSONAL YEAR 7 – A TROUGH YEAR OF FOCUS Similar to the PY4, this is a trough year of consolidation when no major change should be undertaken. However, it is a highly significant year in which we learn to intensely focus on previous years' growth with a view to better understand our life. As such, it is a vital year for learning through personal experience. For many, this implies sacrifice brought about by a failure to recognise and apply guidance from the higher powers and their own natural wisdom. When we live in thoughtless reaction, we expose ourselves to the need for firm corrective measures – prompt karma we might call it. Such sacrifices invariably result in the loss of money, health and or love. They always have a purpose, for they are designed to awaken and return us to the Path. It is wise to avoid any major changes in financial or domestic affairs during this year, for it is a period of stabilisation, as opposed to expansion, of pruning dead wood to make way for the new growth of the ensuring years. It is also a powerful teaching/sharing year in which frequent opportunities present themselves for guiding others toward our level of understanding. Ruling 7 people will often suffer seemingly severe hardships under this vibration but their experience will invariably appear far worse to the outsider. These people are not unfamiliar with sacrifice, for this is their established pattern of learning. And it will continue to be that way until they attain a sufficient degree of personal awareness and wisdom. Once this is achieved, they become excellent teachers, practical philosophers and helpers to humankind, thereby fulfilling the purpose intended by their Ruling Number.
ESOTERIC: THE HOLY GHOSTING. Commonly called "spiritual introspection," it often manifests as a Dark Night of the Ego. It is a "bridge" year between the physical and the metaphysical. NOTE: This is an incubation period.`,
  8: `PERSONAL YEAR 8 – A YEAR OF INDEPENDENCE AND WISDOM This is a year of rapid change as we emerge from a consolidating trough onto the steep rise toward our next peak and the start of a new cycle of growth and prosperity. Many new opportunities manifest under this vibration as we assert our independence with growing wisdom. For some, it will be in the form of a significant improvement in their financial affairs. For the majority, there will emerge a heightened spiritual independence in which they recognise how much emotional control and understanding they have achieved and how much more emphasis they now place on living (acting), rather than existing (reacting). Ruling 8 people have already acquired an appreciable measure of independence and wisdom to the extent that their living has been positive. Otherwise, they will have built around themselves an isolating wall, confusing aloofness with independence and experiencing difficulties in communicating with their close associates, whom they so often take for granted.
ESOTERIC: THE MIRROR OF MERIT. It's not just about "money and power." It is the Cosmic Harvest. In Year 8, the universe reflects your integrity back to you in material form. If you've worked with heart, it brings "expansion."`,
  9: `PERSONAL YEAR 9 — THE PEAK YEAR OF CHANGE We commence by analysing this year first, because it is both the end of the old cycle and the commencement of the new. At the forefront of the major peak in the nine-year Personal Year cycle, it is the year in which change is set into motion. However, many aspects of the changes will not always be realised until later in the year or during the following year. These changes will vary considerably over the lifetime of each person, becoming especially pronounced during the twenty-seven-year duration of developing maturity through the Pyramids. General aspects of the Personal Year (PY) 9 include travel, change of home and or job, and the making of new and exciting friendships, often accompanied by the termination of some older relationships we have since outgrown. It is also an excellent year for squaring old debts and extending the hand of peace to anyone with whom we might be at variance. A strong sense of humanitarian responsibility, tolerance and improved understanding will noticeably prevail during this year. Ruling 9 people will be in no doubt as to the importance of this year, for they will feel its vibrant power in every action. It should be their year of notable success. As the crest of their cycle, it brings them to an increased level of personal responsibility and idealism in whatever humanitarian field they express themselves. Should they be already overly ambitious, this year will strengthen their enthusiasm for egocentric success and could incite them to a degree of recklessness that might lead to extremely painful lessons. Fanaticism, superiority and excessive seriousness can detract the individual from enjoying the excitement of this dramatic year.
ESOTERIC: THE GREAT EMPTYING. Often feared as "endings," this is actually a Womb-like State. You are "burning the fields" so the soil can rest. The deeper work here is radical detachment.`,
};
const POWER_LEVELS: Record<number, number> = {
  1: 10,
  2: 6,
  3: 5,
  4: 2,
  5: 5,
  6: 8,
  7: 2,
  8: 7,
  9: 10,
};
// Always show exactly 14 years (same as original). Extended pool = 51 years.
const VISIBLE = 14;
const HALF_RANGE = 25; // pool goes -25 to +25 relative to current year
export const PersonalYearChart: React.FC<PersonalYearChartProps> = ({
  birthDay,
  birthMonth,
  birthYear,
  onYearSelect,
}) => {
  const chartRef = useRef<ChartJS<"line", number[], number>>(null);
  const [chartData, setChartData] = useState<ChartData<"line">>({
    datasets: [],
  });
  const [selectedYearData, setSelectedYearData] =
    useState<PersonalYearData | null>(null);
  // Initial window: current year at index 4 (same layout as original: 4 past + current + 9 future)
  const [windowStart, setWindowStart] = useState(HALF_RANGE - 4); // = 21
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);
  const touchStartTime = useRef(0);
  const isDragging = useRef(false);
  const mouseStartX = useRef(0);
  const dragDelta = useRef(0);
  // Build full 51-year dataset once per birth data change
  const { fullData, currentYearIdxInFull } = useMemo(() => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const fullData: PersonalYearData[] = [];
    for (let i = -HALF_RANGE; i <= HALF_RANGE; i++) {
      const displayYear = currentYear + i;
      // Each year's Personal Year is computed independently and directly —
      // NOT extrapolated by assuming a clean "+1 each year, wrap at 9" cycle
      // relative to today. That modular shortcut silently breaks whenever a
      // master number (11/22/33) should appear, since those years don't
      // follow the simple 1-9 wrap. Computing every year from the same raw
      // formula that feeds the compound lookup below also guarantees the
      // displayed Personal Year and its "raw/reduced" compound label can
      // never disagree with each other.
      const raw = computeRawPersonalYear(birthDay, birthMonth, displayYear);
      const pyn = reduceMasterSafe(raw);
      // POWER_LEVELS and PERSONAL_YEAR_MEANINGS are keyed 1-9 only; for a
      // master-number year, fall back to the power/meaning of the number it
      // reduces to (11->2, 22->4, 33->6) rather than looking up a key that
      // doesn't exist.
      const powerKey = (
        pyn === 11 ? 2 : pyn === 22 ? 4 : pyn === 33 ? 6 : pyn
      ) as keyof typeof POWER_LEVELS;
      const power = POWER_LEVELS[powerKey];
      const cpd = getCompoundForPYN(birthDay, birthMonth, displayYear);
      // ── Classic (pre-reduced-components) system, computed independently
      // alongside the direct one above — both are shown to the person ──
      const rawClassic = computeRawPersonalYearClassic(
        birthDay,
        birthMonth,
        displayYear,
      );
      const pynClassic = reduceMasterSafe(rawClassic);
      const cpdClassic = getClassicCompoundForPYN(
        birthDay,
        birthMonth,
        displayYear,
      );
      const dualEssence = buildPersonalYearDualEssenceSynthesis({
        birthDay,
        birthMonth,
        birthYear,
        targetYear: displayYear,
        directRaw: raw,
        directYear: pyn,
        directCompound: cpd,
        classicRaw: rawClassic,
        classicYear: pynClassic,
        classicCompound: cpdClassic,
      });
      fullData.push({
        year: displayYear,
        pyn,
        power,
        meaning:
          PERSONAL_YEAR_MEANINGS[
            powerKey as keyof typeof PERSONAL_YEAR_MEANINGS
          ] || "",
        ...(cpd
          ? {
              compound: cpd.compound,
              compoundName: cpd.name,
              compoundSymbolism: cpd.symbolism,
              compoundEssence: cpd.vibrationalEssence,
              compoundKarmic: cpd.karmicDynamics,
              compoundManifestation: cpd.manifestationPatterns,
              compoundIsKarmicDebt: cpd.isKarmicDebt,
              compoundIsMasterNumber: cpd.isMasterNumber,
            }
          : {}),
        pynClassic,
        ...(cpdClassic
          ? {
              compoundClassic: cpdClassic.compound,
              compoundClassicName: cpdClassic.name,
              compoundClassicSymbolism: cpdClassic.symbolism,
              compoundClassicEssence: cpdClassic.vibrationalEssence,
              compoundClassicKarmic: cpdClassic.karmicDynamics,
              compoundClassicManifestation: cpdClassic.manifestationPatterns,
              compoundClassicIsKarmicDebt: cpdClassic.isKarmicDebt,
              compoundClassicIsMasterNumber: cpdClassic.isMasterNumber,
            }
          : {}),
        dualEssenceTitle: dualEssence.title,
        dualEssenceSubtitle: dualEssence.subtitle,
        dualEssenceSynthesis: dualEssence.synthesisText,
        dualEssenceIntensity: dualEssence.intensityScore,
        dualEssencePolarity: dualEssence.polarity,
        predictionFocusAreas: dualEssence.predictionFocusAreas,
        protectiveActions: dualEssence.protectiveActions,
      });
    }
    // index of the current year in fullData
    const currentYearIdxInFull = HALF_RANGE; // always index 25
    return { fullData, currentYearIdxInFull };
  }, [birthDay, birthMonth, birthYear]);
  // Slice the visible window
  const windowedData = useMemo(
    () => fullData.slice(windowStart, windowStart + VISIBLE),
    [fullData, windowStart],
  );
  // Where is "current year" within the visible window? (-1 means off-screen)
  const currentIdxInWindow = currentYearIdxInFull - windowStart;
  const currentInView = currentIdxInWindow >= 0 && currentIdxInWindow < VISIBLE;
  const canScrollLeft = windowStart > 0;
  const canScrollRight = windowStart < fullData.length - VISIBLE;
  // Re-build gradient + chart data whenever the window slides
  useEffect(() => {
    const chart = chartRef.current;
    if (!chart) return;
    const ctx = chart.ctx;
    const gradient = ctx.createLinearGradient(0, 0, 0, chart.height);
    gradient.addColorStop(0, "rgba(255,0,255,0.55)");
    gradient.addColorStop(1, "rgba(255,0,255,0.05)");
    setChartData({
      labels: windowedData.map((d) => d.year.toString()),
      datasets: [
        {
          label: "Proportion of Power",
          data: windowedData.map((d) => d.power),
          borderColor: "#c8a84b",
          backgroundColor: gradient,
          fill: true,
          tension: 0.4,
          borderWidth: 5,
          pointRadius: windowedData.map((_, i) =>
            i === currentIdxInWindow ? 14 : 8,
          ),
          pointBackgroundColor: windowedData.map((_, i) =>
            i === currentIdxInWindow ? "#fceabb" : "#c8a84b",
          ),
          pointBorderColor: "#c8a84b",
          pointBorderWidth: 3,
          pointHitRadius: 30,
        },
      ],
    });
  }, [windowedData, currentIdxInWindow]);
  const options: any = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: "nearest", intersect: false },
    onClick: (_: any, elements: any[]) => {
      if (elements.length > 0) {
        const idx = elements[0].index;
        const selected = windowedData[idx];
        setSelectedYearData(selected);
        onYearSelect(selected);
      } else {
        setSelectedYearData(null);
        onYearSelect(null);
      }
    },
    scales: {
      y: { display: false, min: 0, max: 12 },
      x: {
        ticks: {
          color: "#7a6228",
          font: { size: 12, family: "Cinzel", weight: "bold" },
          maxRotation: 45,
          minRotation: 45,
        },
        grid: { color: "rgba(200,168,75,0.1)" },
      },
    },
    plugins: {
      legend: { display: false },
      title: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx: any) => {
            const d = windowedData[ctx.dataIndex];
            return `Year ${d.year} • PY ${d.pyn} • Power ${d.power}`;
          },
        },
      },
      annotation: {
        annotations: currentInView
          ? {
              current: {
                type: "line",
                xMin: currentIdxInWindow,
                xMax: currentIdxInWindow,
                borderColor: "rgba(200,168,75,0.55)",
                borderDash: [6, 4],
                borderWidth: 2,
              },
            }
          : {},
      },
    },
  };
  // ── Swipe / drag handlers ──────────────────────────────────────────────────
  const clampWindow = useCallback(
    (next: number) => {
      return Math.min(fullData.length - VISIBLE, Math.max(0, next));
    },
    [fullData.length],
  );
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
    touchStartTime.current = Date.now();
  }, []);
  const handleTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      const dx = touchStartX.current - e.changedTouches[0].clientX;
      const dy = touchStartY.current - e.changedTouches[0].clientY;
      const dt = Date.now() - touchStartTime.current;
      // Only horizontal swipes (dx dominates dy) within 500ms
      if (Math.abs(dx) > Math.abs(dy) * 1.5 && Math.abs(dx) > 30 && dt < 500) {
        const step = Math.max(1, Math.round(Math.abs(dx) / 40));
        setWindowStart((prev) => clampWindow(prev + (dx > 0 ? step : -step)));
      }
    },
    [clampWindow],
  );
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    isDragging.current = true;
    mouseStartX.current = e.clientX;
    dragDelta.current = 0;
  }, []);
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging.current) return;
    dragDelta.current = mouseStartX.current - e.clientX;
  }, []);
  const handleMouseUp = useCallback(
    (_e: React.MouseEvent) => {
      if (!isDragging.current) return;
      isDragging.current = false;
      const dx = dragDelta.current;
      if (Math.abs(dx) > 30) {
        const step = Math.max(1, Math.round(Math.abs(dx) / 40));
        setWindowStart((prev) => clampWindow(prev + (dx > 0 ? step : -step)));
      }
      dragDelta.current = 0;
    },
    [clampWindow],
  );
  const handleMouseLeave = useCallback(() => {
    if (isDragging.current) {
      isDragging.current = false;
      const dx = dragDelta.current;
      if (Math.abs(dx) > 30) {
        const step = Math.max(1, Math.round(Math.abs(dx) / 40));
        setWindowStart((prev) => clampWindow(prev + (dx > 0 ? step : -step)));
      }
      dragDelta.current = 0;
    }
  }, [clampWindow]);
  const navigateLeft = () => setWindowStart((prev) => clampWindow(prev - 1));
  const navigateRight = () => setWindowStart((prev) => clampWindow(prev + 1));
  // Years at edges of current window (for the peek label)
  const leftmostYear = windowedData[0]?.year;
  const rightmostYear = windowedData[windowedData.length - 1]?.year;
  return (
    <div className="glass-card p-6 rounded-2xl bg-[#09101e]/80">
      {/* Navigation header */}
      <div className="flex items-center justify-between mb-2">
        <button
          onClick={navigateLeft}
          disabled={!canScrollLeft}
          className="flex items-center gap-1 text-[0.7rem] font-cinzel uppercase tracking-widest text-amber-400/70 disabled:opacity-20 transition-opacity active:scale-95"
          aria-label="Earlier years"
        >
          <ChevronLeft className="w-4 h-4" />
          {canScrollLeft && leftmostYear !== undefined ? leftmostYear - 1 : ""}
        </button>
        <span className="text-[0.7rem] font-cinzel uppercase tracking-[0.2em] text-amber-400/40 select-none">
          {canScrollLeft || canScrollRight ? "← swipe to explore →" : ""}
        </span>
        <button
          onClick={navigateRight}
          disabled={!canScrollRight}
          className="flex items-center gap-1 text-[0.7rem] font-cinzel uppercase tracking-widest text-amber-400/70 disabled:opacity-20 transition-opacity active:scale-95"
          aria-label="Later years"
        >
          {canScrollRight && rightmostYear !== undefined
            ? rightmostYear + 1
            : ""}
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
      {/* Chart — identical size/styling to original */}
      <div
        style={{
          height: "400px",
          cursor: isDragging.current ? "grabbing" : "grab",
        }}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
      >
        <Line ref={chartRef} data={chartData} options={options} />
      </div>
      <p className="text-[0.7rem] font-cinzel text-purple-200/80 text-center mt-4 italic uppercase tracking-widest">
        Personal Years cycle 1–9 • Tap point for meaning • Swipe or drag to
        explore
      </p>
    </div>
  );
};