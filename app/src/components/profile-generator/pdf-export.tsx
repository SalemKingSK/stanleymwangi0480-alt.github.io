import React, { useState } from "react";
import { jsPDF } from "jspdf";
import type { AstroInsightOutput, NumerologyData } from "./types";
import {
  calculatePsychomatrix,
  PSYCHOMATRIX_CELL_MEANINGS,
  SCALE_COLORS,
} from "@/lib/numerology/data/psychomatrixData";
import {
  PSYCHOMATRIX_LINE_INTERPRETATIONS,
  getLineLevel,
} from "@/lib/numerology/data/psychomatrixLineInterpretations";
import { createPersonalizedPsychomatrixReport } from "@/lib/numerology/psychomatrix-synthesis";
import { detectContradictions } from "@/lib/numerology/synthesis/contradiction-engine";
import { generateRecommendations } from "@/lib/numerology/synthesis/recommendation-engine";
import { detectDominanceHierarchy } from "@/lib/numerology/synthesis/dominance-hierarchy-engine";
import {
  getDomainNarrative,
  ALL_DOMAIN_BANKS,
} from "@/lib/numerology/synthesis/life-domain-narrative-banks";
import { computeSynthesis } from "@/lib/numerology/synthesis";
import { cheiroPsychicNumbers } from "@/lib/numerology/cheiro-psychic-numbers";
import { resolveMonthData } from "@/lib/numerology/monthly-profiles";
import { calculateDynamicPotentials } from "@/lib/numerology/dynamic-engine";
import { generateDailyForecast } from "@/lib/temporal-prediction-engine-v2";
import { buildTodayTimingGuidance } from "./engagement-tools";
interface PdfExportButtonProps {
  insight: AstroInsightOutput;
  numerology: NumerologyData;
}
// ─── PDF generator ────────────────────────────────────────────────────────────
export async function generatePdf(
  insight: AstroInsightOutput,
  numerology: NumerologyData,
) {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const margin = 16;
  const contentW = pageW - margin * 2;
  let y = 0;
  // ── Palette ──────────────────────────────────────────────────────────────────
  const VOID = [5, 1, 14] as [number, number, number];
  const GOLD = [212, 175, 55] as [number, number, number];
  const GOLD_DIM = [138, 111, 24] as [number, number, number];
  const SILVER = [168, 184, 208] as [number, number, number];
  const SILVER_DIM = [86, 104, 126] as [number, number, number];
  const WHITE = [230, 220, 255] as [number, number, number];
  const GREEN = [77, 170, 120] as [number, number, number];
  const RED = [192, 90, 120] as [number, number, number];
  const EMERALD = [52, 211, 153] as [number, number, number];
  const TEAL = [45, 185, 185] as [number, number, number];
  const VIOLET = [167, 139, 250] as [number, number, number];
  const AMBER = [245, 158, 11] as [number, number, number];
  const ROSE = [240, 100, 130] as [number, number, number];
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const monthNamesShort = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  // ── Helpers ──────────────────────────────────────────────────────────────────
  function fillPage() {
    doc.setFillColor(VOID[0], VOID[1], VOID[2]);
    doc.rect(0, 0, pageW, pageH, "F");
  }
  function newPage() {
    doc.addPage();
    fillPage();
    y = 20;
  }
  function checkBreak(needed: number) {
    if (y + needed > pageH - 20) {
      newPage();
      return true;
    }
    return false;
  }
  function wrap(
    text: string,
    x: number,
    maxW: number,
    fs: number,
    color: number[],
    style = "normal",
    lineGap = 0,
  ): number {
    if (!text?.trim()) return y;
    doc.setFont("helvetica", style);
    doc.setFontSize(fs);
    doc.setTextColor(color[0], color[1], color[2]);
    const lh = fs * 0.45;
    const lines: string[] = doc.splitTextToSize(text.trim(), maxW);
    lines.forEach((line: string) => {
      checkBreak(lh + lineGap);
      doc.text(line, x, y);
      y += lh + lineGap;
    });
    return y;
  }
  function label(
    txt: string,
    x: number,
    fs: number,
    color: number[],
    style = "bold",
  ) {
    checkBreak(fs * 0.55);
    doc.setFont("helvetica", style);
    doc.setFontSize(fs);
    doc.setTextColor(color[0], color[1], color[2]);
    doc.text(txt, x, y);
    y += fs * 0.55;
  }
  function gap(mm = 4) {
    y += mm;
  }
  function hRule(color = GOLD_DIM) {
    checkBreak(6);
    doc.setDrawColor(color[0], color[1], color[2]);
    doc.setLineWidth(0.25);
    doc.line(margin, y, pageW - margin, y);
    gap(5);
  }
  function chapterPage(num: string, title: string, subtitle = "") {
    newPage();
    // chapter accent blob
    doc.setGState(doc.GState({ opacity: 0.06 }));
    doc.setFillColor(124, 58, 237);
    doc.ellipse(pageW / 2, pageH / 2, 80, 60, "F");
    doc.setGState(doc.GState({ opacity: 1 }));
    doc.setFont("helvetica", "bold");
    doc.setFontSize(7);
    doc.setTextColor(GOLD_DIM[0], GOLD_DIM[1], GOLD_DIM[2]);
    doc.text(`CHAPTER ${num}`, pageW / 2, 80, { align: "center" });
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.setTextColor(GOLD[0], GOLD[1], GOLD[2]);
    doc.text(title.toUpperCase(), pageW / 2, 95, { align: "center" });
    if (subtitle) {
      doc.setFont("helvetica", "italic");
      doc.setFontSize(9);
      doc.setTextColor(SILVER[0], SILVER[1], SILVER[2]);
      doc.text(subtitle, pageW / 2, 105, { align: "center" });
    }
    doc.setDrawColor(GOLD_DIM[0], GOLD_DIM[1], GOLD_DIM[2]);
    doc.setLineWidth(0.4);
    doc.line(margin + 20, 110, pageW - margin - 20, 110);
    y = pageH - 30;
  }
  function sectionHeader(txt: string, color = GOLD) {
    checkBreak(16);
    gap(3);
    doc.setFillColor(20, 8, 48);
    doc.roundedRect(margin, y - 5, contentW, 11, 2, 2, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(color[0], color[1], color[2]);
    doc.text(`✦ ${txt.toUpperCase()}`, margin + 5, y + 2.5);
    y += 12;
  }
  function subSection(txt: string, color = SILVER) {
    checkBreak(10);
    gap(2);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(7.5);
    doc.setTextColor(color[0], color[1], color[2]);
    doc.text(txt.toUpperCase(), margin + 2, y);
    y += 5;
  }
  function badge(
    txt: string,
    x: number,
    bw: number,
    fillRgb: number[],
    textRgb: number[],
  ) {
    doc.setFillColor(fillRgb[0], fillRgb[1], fillRgb[2]);
    doc.roundedRect(x, y - 4, bw, 7, 1.5, 1.5, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(6.5);
    doc.setTextColor(textRgb[0], textRgb[1], textRgb[2]);
    doc.text(txt, x + bw / 2, y + 0.5, { align: "center" });
    y += 9;
  }
  function kv(
    key: string,
    value: string,
    keyColor = SILVER_DIM,
    valColor = WHITE,
  ) {
    checkBreak(7);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(7);
    doc.setTextColor(keyColor[0], keyColor[1], keyColor[2]);
    doc.text(key.toUpperCase() + ":", margin + 2, y);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(valColor[0], valColor[1], valColor[2]);
    doc.text(String(value || "—"), margin + 52, y);
    y += 5.5;
  }
  function numberChip(
    val: string | number,
    lbl: string,
    x: number,
    w: number,
    color: number[],
  ) {
    doc.setFillColor(12, 5, 32);
    doc.roundedRect(x, y, w, 22, 2, 2, "F");
    doc.setDrawColor(color[0], color[1], color[2]);
    doc.setLineWidth(0.3);
    doc.roundedRect(x, y, w, 22, 2, 2, "S");
    doc.setFont("helvetica", "normal");
    doc.setFontSize(6);
    doc.setTextColor(SILVER_DIM[0], SILVER_DIM[1], SILVER_DIM[2]);
    doc.text(lbl.toUpperCase(), x + w / 2, y + 6, { align: "center" });
    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.setTextColor(color[0], color[1], color[2]);
    doc.text(String(val ?? "—"), x + w / 2, y + 16, { align: "center" });
  }
  // ── Pre-compute all data ──────────────────────────────────────────────────────
  const pmx = calculatePsychomatrix(
    numerology.birthDay,
    numerology.birthMonth,
    numerology.birthYear,
  );
  const synthesis = computeSynthesis(numerology, insight);
  const psychomatrixReport = createPersonalizedPsychomatrixReport(pmx);
  const contradictions = detectContradictions(
    psychomatrixReport.lines,
    psychomatrixReport.intersections,
  );
  const recommendations = generateRecommendations(
    psychomatrixReport,
    numerology,
    contradictions,
  );
  const dominance = detectDominanceHierarchy(psychomatrixReport.lines);
  const dynamicResult = calculateDynamicPotentials(
    numerology.birthYear,
    pmx.counts,
  );
  const cheiroData = cheiroPsychicNumbers[numerology.psycheNum];
  const monthlyData = resolveMonthData(
    numerology.birthMonth,
    numerology.psycheNum,
  );
  const bday = `${numerology.birthDay} ${monthNamesShort[numerology.birthMonth - 1]} ${numerology.birthYear}`;
  // ── TOC entries (chapter title, page estimate) ────────────────────────────────
  const tocEntries = [
    "I — Core Cosmic Numbers",
    "II — Psychic Number — Deep Analysis",
    "III — Destiny, Compound & Karmic Fate",
    "IV — Kua Number & Feng Shui",
    "V — Astrology — Western & Chinese",
    "VI — Lo Shu Grid & Arrows of Influence",
    "VII — Psychomatrix (Pythagorean Square)",
    "VIII — Four Planes of Expression",
    "IX — Temporal Predictions",
    "X — Karmic Architecture",
    "XI — Deep Synthesis",
  ];
  // ═══════════════════════════════════════════════════════════════════════════
  // COVER PAGE
  // ═══════════════════════════════════════════════════════════════════════════
  fillPage();
  // Decorative blobs
  doc.setGState(doc.GState({ opacity: 0.07 }));
  doc.setFillColor(124, 58, 237);
  doc.ellipse(40, 35, 70, 55, "F");
  doc.setFillColor(212, 175, 55);
  doc.ellipse(pageW - 30, pageH - 40, 60, 45, "F");
  doc.setFillColor(45, 185, 185);
  doc.ellipse(pageW - 20, 50, 40, 30, "F");
  doc.setGState(doc.GState({ opacity: 1 }));
  y = 28;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(26);
  doc.setTextColor(GOLD[0], GOLD[1], GOLD[2]);
  doc.text("MYSTIQUE COMPASS", pageW / 2, y, { align: "center" });
  y += 9;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(SILVER_DIM[0], SILVER_DIM[1], SILVER_DIM[2]);
  doc.text(
    "C O M P R E H E N S I V E C O S M I C P R O F I L E R E P O R T",
    pageW / 2,
    y,
    { align: "center" },
  );
  y += 7;
  hRule();
  y += 4;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.setTextColor(WHITE[0], WHITE[1], WHITE[2]);
  doc.text(insight.name, pageW / 2, y, { align: "center" });
  y += 8;
  doc.setFont("helvetica", "italic");
  doc.setFontSize(10);
  doc.setTextColor(SILVER[0], SILVER[1], SILVER[2]);
  doc.text(
    `Born ${bday} · ${insight.gender.charAt(0).toUpperCase() + insight.gender.slice(1)}`,
    pageW / 2,
    y,
    { align: "center" },
  );
  y += 6;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(GOLD_DIM[0], GOLD_DIM[1], GOLD_DIM[2]);
  doc.text(
    `${insight.western_sign} · ${insight.sign} · ${insight.new_astrology_sign}`,
    pageW / 2,
    y,
    { align: "center" },
  );
  y += 5;
  hRule();
  // Core number chips on cover
  const coverChips = [
    { v: numerology.psycheNum, l: "Psychic", c: VIOLET },
    { v: numerology.destinyNum, l: "Destiny", c: GOLD },
    { v: synthesis.lifePath.number, l: "Life Path", c: TEAL },
    { v: synthesis.maturityNumber.number, l: "Maturity", c: ROSE },
    { v: numerology.karmicFateNum ?? "—", l: "Karmic Fate", c: RED },
    { v: numerology.kuaNum, l: "Kua", c: EMERALD },
  ];
  const chipW = (contentW - 10) / 6;
  coverChips.forEach(({ v, l, c }, i) => {
    numberChip(String(v), l, margin + i * (chipW + 2), chipW, c);
  });
  y += 28;
  hRule();
  // Table of Contents
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);
  doc.setTextColor(GOLD[0], GOLD[1], GOLD[2]);
  doc.text("TABLE OF CONTENTS", pageW / 2, y, { align: "center" });
  y += 6;
  tocEntries.forEach((entry) => {
    checkBreak(5.5);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(SILVER[0], SILVER[1], SILVER[2]);
    doc.text(entry, pageW / 2, y, { align: "center" });
    y += 5.5;
  });
  y = pageH - 15;
  doc.setFont("helvetica", "italic");
  doc.setFontSize(6.5);
  doc.setTextColor(SILVER_DIM[0], SILVER_DIM[1], SILVER_DIM[2]);
  doc.text(
    "This report presents a complete synthesis of numerological, astrological, and psychomatrix analysis.",
    pageW / 2,
    y,
    { align: "center" },
  );
  // ═══════════════════════════════════════════════════════════════════════════
  // CHAPTER I — CORE COSMIC NUMBERS
  // ═══════════════════════════════════════════════════════════════════════════
  chapterPage(
    "I",
    "Core Cosmic Numbers",
    "Your complete numeric signature at a glance",
  );
  newPage();
  sectionHeader("Primary Numbers");
  const big6 = [
    {
      v: numerology.psycheNum,
      l: "Psychic Number",
      c: VIOLET,
      note: "Ruling self-expression",
    },
    {
      v: numerology.destinyNum,
      l: "Destiny Number",
      c: GOLD,
      note: "Life purpose",
    },
    {
      v: synthesis.lifePath.number,
      l: "Life Path",
      c: TEAL,
      note: synthesis.lifePath.title,
    },
    {
      v: synthesis.maturityNumber.number,
      l: "Maturity Number",
      c: ROSE,
      note: `Emerges mid-life (psychic + destiny = ${numerology.psycheNum}+${numerology.destinyNum})`,
    },
    {
      v: numerology.karmicFateNum ?? "—",
      l: "Karmic Fate",
      c: RED,
      note: numerology.karmicFateNum
        ? "Karmic obligation present"
        : "No karmic obligation",
    },
    {
      v: numerology.kuaNum,
      l: "Kua Number",
      c: EMERALD,
      note: `${numerology.kuaAttributes?.element || ""} group`,
    },
  ];
  const bw6 = (contentW - 10) / 3;
  big6.forEach(({ v, l, c, note }, i) => {
    const row = Math.floor(i / 3),
      col = i % 3;
    const bx = margin + col * (bw6 + 2);
    const by = y + row * 30;
    doc.setFillColor(12, 4, 34);
    doc.roundedRect(bx, by, bw6, 26, 2, 2, "F");
    doc.setDrawColor(c[0], c[1], c[2]);
    doc.setLineWidth(0.3);
    doc.roundedRect(bx, by, bw6, 26, 2, 2, "S");
    doc.setFont("helvetica", "normal");
    doc.setFontSize(6);
    doc.setTextColor(SILVER_DIM[0], SILVER_DIM[1], SILVER_DIM[2]);
    doc.text(l.toUpperCase(), bx + bw6 / 2, by + 6, { align: "center" });
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.setTextColor(c[0], c[1], c[2]);
    doc.text(String(v), bx + bw6 / 2, by + 17, { align: "center" });
    doc.setFont("helvetica", "italic");
    doc.setFontSize(5.5);
    doc.setTextColor(SILVER_DIM[0], SILVER_DIM[1], SILVER_DIM[2]);
    doc.text(note.substring(0, 34), bx + bw6 / 2, by + 23, { align: "center" });
  });
  y += 66;
  sectionHeader("Extended Numbers");
  const ext = [
    { k: "Compound Number (unreduced)", v: numerology.compoundNum ?? "—" },
    { k: "Reduced Compound", v: numerology.reducedCompoundNum ?? "—" },
    { k: "Birth Day of Week", v: synthesis.birthDayOfWeek?.dayName ?? "—" },
    { k: "Universal Year", v: synthesis.universalYear?.yearNumber ?? "—" },
    {
      k: "Personal Year (current)",
      v: synthesis.personalYearAnalysis
        ? synthesis.personalYearAnalysis.rawYear ===
          synthesis.personalYearAnalysis.year
          ? synthesis.personalYearAnalysis.year
          : `${synthesis.personalYearAnalysis.rawYear}/${synthesis.personalYearAnalysis.year}`
        : "—",
    },
    {
      k: "Personal Month (current)",
      v: synthesis.personalMonth?.personalMonth ?? "—",
    },
  ];
  ext.forEach(({ k, v }) => kv(k, String(v)));
  gap(4);
  if (synthesis.masterNumbers?.length > 0) {
    sectionHeader("Master Numbers Detected", VIOLET);
    synthesis.masterNumbers.forEach((mn) => {
      label(`${mn.number} — ${mn.title}`, margin + 2, 8.5, VIOLET);
      wrap(mn.interpretation, margin + 4, contentW - 8, 7.5, SILVER);
      gap(5);
    });
  }
  // ═══════════════════════════════════════════════════════════════════════════
  // CHAPTER II — PSYCHIC NUMBER DEEP ANALYSIS
  // ═══════════════════════════════════════════════════════════════════════════
  chapterPage(
    "II",
    "Psychic Number",
    `Number ${numerology.psycheNum} — The Ruling Self`,
  );
  newPage();
  sectionHeader("Layer 1 — The Psychic Essence (Vedic)");
  if (numerology.psychicMeaning?.title) {
    label(numerology.psychicMeaning.title, margin + 2, 9, GOLD);
    gap(2);
  }
  wrap(
    numerology.psychicMeaning?.description || "—",
    margin + 2,
    contentW - 4,
    8,
    SILVER,
  );
  gap(6);
  if (cheiroData) {
    sectionHeader("Layer 2 — The Chronicler's View");
    kv("Ruling Planet", cheiroData.planet);
    kv("Birth Dates", cheiroData.birthDates.join(", "));
    kv("Lucky Colors", cheiroData.luckyColors);
    kv("Lucky Jewels", cheiroData.luckyJewels);
    kv("Compatible Nos.", cheiroData.compatibleNumbers.join(", "));
    gap(3);
    subSection("Strong Periods", TEAL);
    cheiroData.strongPeriods.forEach((sp) => {
      wrap(`• ${sp}`, margin + 4, contentW - 8, 7.5, SILVER);
    });
    gap(3);
    subSection("Full Character Analysis", SILVER);
    wrap(cheiroData.description, margin + 2, contentW - 4, 7.8, SILVER);
    gap(4);
    subSection("Lucky Days", AMBER);
    wrap(
      cheiroData.luckyDays.fullDescription,
      margin + 2,
      contentW - 4,
      7.8,
      SILVER,
    );
    gap(6);
  }
  sectionHeader("Layer 3 — Monthly Soul Chronicle");
  kv("Month", monthlyData.monthName);
  gap(2);
  subSection("General Influence", TEAL);
  wrap(monthlyData.generalInfluence, margin + 2, contentW - 4, 7.8, SILVER);
  gap(3);
  subSection("Monthly Character", TEAL);
  wrap(monthlyData.monthlyCharacter, margin + 2, contentW - 4, 7.8, SILVER);
  gap(3);
  subSection("Financial Outlook", EMERALD);
  wrap(monthlyData.financialOutlook, margin + 2, contentW - 4, 7.8, SILVER);
  gap(3);
  subSection("Health Cautions", ROSE);
  wrap(monthlyData.healthCautions, margin + 2, contentW - 4, 7.8, SILVER);
  gap(6);
  sectionHeader("Layer 4 — Celestial Alignments");
  subSection("Important Numbers & Dates", VIOLET);
  wrap(monthlyData.luckyNumbers, margin + 2, contentW - 4, 7.8, SILVER);
  gap(3);
  kv("Colors", monthlyData.colors);
  kv("Jewels", monthlyData.jewels);
  gap(2);
  subSection("Climacteric Years", SILVER_DIM);
  wrap(monthlyData.climactericYears, margin + 2, contentW - 4, 7.8, SILVER);
  gap(3);
  subSection("Magnetic Attraction", ROSE);
  wrap(monthlyData.magneticAttraction, margin + 2, contentW - 4, 7.8, SILVER);
  // ═══════════════════════════════════════════════════════════════════════════
  // CHAPTER III — DESTINY, COMPOUND & KARMIC FATE
  // ═══════════════════════════════════════════════════════════════════════════
  chapterPage(
    "III",
    "Destiny, Compound & Karmic Fate",
    "Your life's purpose and obligatory curriculum",
  );
  newPage();
  sectionHeader(`Destiny Number — ${numerology.destinyNum}`);
  if (numerology.destinyMeaning?.title) {
    label(numerology.destinyMeaning.title, margin + 2, 9, GOLD);
    gap(2);
  }
  wrap(
    numerology.destinyMeaning?.description || "—",
    margin + 2,
    contentW - 4,
    8,
    SILVER,
  );
  gap(6);
  if (numerology.compoundNum) {
    sectionHeader(`Compound Number — ${numerology.compoundNum} (unreduced)`);
    wrap(
      numerology.compoundMeaning || "—",
      margin + 2,
      contentW - 4,
      8,
      SILVER,
    );
    gap(4);
  }
  if (numerology.reducedCompoundNum) {
    sectionHeader(`Reduced Compound — ${numerology.reducedCompoundNum}`);
    wrap(
      numerology.reducedCompoundMeaning || "—",
      margin + 2,
      contentW - 4,
      8,
      SILVER,
    );
    gap(6);
  }
  sectionHeader(`Karmic Fate — ${numerology.karmicFateNum ?? "None"}`);
  if (numerology.karmicFateNum) {
    wrap(
      numerology.karmicFateMeaning || "—",
      margin + 2,
      contentW - 4,
      8,
      SILVER,
    );
  } else {
    wrap(
      synthesis.karmicFateNullMeaning ||
        "No karmic fate number is present in this configuration.",
      margin + 2,
      contentW - 4,
      8,
      SILVER,
    );
  }
  gap(5);
  if (numerology.specialTraitMeaning) {
    sectionHeader("Special Trait");
    wrap(numerology.specialTraitMeaning, margin + 2, contentW - 4, 8, SILVER);
    gap(5);
  }
  if (synthesis.compoundPersonalizedInsight) {
    sectionHeader("Compound Personalized Insight");
    wrap(
      synthesis.compoundPersonalizedInsight,
      margin + 2,
      contentW - 4,
      8,
      SILVER,
    );
    gap(5);
  }
  // ═══════════════════════════════════════════════════════════════════════════
  // CHAPTER IV — KUA NUMBER
  // ═══════════════════════════════════════════════════════════════════════════
  chapterPage(
    "IV",
    "Kua Number & Feng Shui",
    `Kua ${numerology.kuaNum} — Your Energetic Blueprint`,
  );
  newPage();
  sectionHeader(`Kua Number ${numerology.kuaNum} — Attributes`);
  const kua = numerology.kuaAttributes;
  if (kua) {
    kv("Element", kua.element || "—");
    kv("Group", kua.group || "—");
    kv("Trigram", kua.trigram || "—");
    kv("Season", kua.season || "—");
    kv(
      "Colors",
      Array.isArray(kua.lucky_colours)
        ? kua.lucky_colours.join(", ")
        : kua.colors || "—",
    );
    gap(5);
    if (kua.directions && Object.keys(kua.directions).length > 0) {
      sectionHeader("Power Directions");
      Object.entries(kua.directions).forEach(([dir, meaning]) => {
        checkBreak(12);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(7.5);
        doc.setTextColor(GOLD[0], GOLD[1], GOLD[2]);
        doc.text(dir.toUpperCase(), margin + 2, y);
        y += 4;
        wrap(String(meaning), margin + 6, contentW - 10, 7.5, SILVER);
        gap(3);
      });
    }
  }
  // ═══════════════════════════════════════════════════════════════════════════
  // CHAPTER V — ASTROLOGY
  // ═══════════════════════════════════════════════════════════════════════════
  chapterPage("V", "Astrology", "Western · Chinese · New Astrology");
  newPage();
  sectionHeader("Overview");
  kv("Western Sign", insight.western_sign);
  kv("Chinese Zodiac", insight.sign);
  kv("Element", insight.element);
  kv("New Astrology Sign", insight.new_astrology_sign);
  gap(5);
  if (synthesis.decan?.interpretation) {
    sectionHeader("Decan Interpretation");
    wrap(synthesis.decan.interpretation, margin + 2, contentW - 4, 8, SILVER);
    gap(5);
  }
  if (synthesis.birthDayOfWeek?.interpretation) {
    sectionHeader(`Born on a ${synthesis.birthDayOfWeek.dayName}`);
    wrap(
      synthesis.birthDayOfWeek.interpretation,
      margin + 2,
      contentW - 4,
      8,
      SILVER,
    );
    gap(5);
  }
  if (insight.signData?.description) {
    sectionHeader(`${insight.sign} — Chinese Zodiac Profile`);
    wrap(insight.signData.description, margin + 2, contentW - 4, 8, SILVER);
    gap(4);
  }
  if (insight.signData?.love) {
    subSection("Love & Relationships", ROSE);
    wrap(insight.signData.love, margin + 2, contentW - 4, 7.8, SILVER);
    gap(4);
  }
  if (insight.signData?.profession) {
    subSection("Career & Profession", EMERALD);
    wrap(insight.signData.profession, margin + 2, contentW - 4, 7.8, SILVER);
    gap(4);
  }
  if (insight.signData?.homeAndFamily) {
    subSection("Home & Family", TEAL);
    wrap(insight.signData.homeAndFamily, margin + 2, contentW - 4, 7.8, SILVER);
    gap(4);
  }
  if (insight.signData?.compatibilities) {
    subSection("Compatibilities", VIOLET);
    wrap(
      insight.signData.compatibilities,
      margin + 2,
      contentW - 4,
      7.8,
      SILVER,
    );
    gap(5);
  }
  if (synthesis.sexagenary?.interpretation) {
    sectionHeader("Sexagenary Cycle Analysis");
    wrap(
      synthesis.sexagenary.interpretation,
      margin + 2,
      contentW - 4,
      8,
      SILVER,
    );
    gap(4);
  }
  if (synthesis.heavenlyStem?.interpretation) {
    sectionHeader("Heavenly Stem");
    wrap(
      synthesis.heavenlyStem.interpretation,
      margin + 2,
      contentW - 4,
      8,
      SILVER,
    );
    gap(4);
  }
  if (synthesis.earthlyBranch?.interpretation) {
    sectionHeader("Earthly Branch");
    wrap(
      synthesis.earthlyBranch.interpretation,
      margin + 2,
      contentW - 4,
      8,
      SILVER,
    );
    gap(4);
  }
  if (
    synthesis.doubleAnimal?.isDouble &&
    synthesis.doubleAnimal.interpretation
  ) {
    sectionHeader("Double Animal Influence");
    wrap(
      synthesis.doubleAnimal.interpretation,
      margin + 2,
      contentW - 4,
      8,
      SILVER,
    );
    gap(4);
  }
  if (synthesis.zodiacRelationships?.interpretation) {
    sectionHeader("Zodiac Relationships");
    wrap(
      synthesis.zodiacRelationships.interpretation,
      margin + 2,
      contentW - 4,
      8,
      SILVER,
    );
    gap(4);
  }
  // ═══════════════════════════════════════════════════════════════════════════
  // CHAPTER VI — LO SHU GRID
  // ═══════════════════════════════════════════════════════════════════════════
  chapterPage("VI", "Lo Shu Grid", "Arrows of Strength & Weakness");
  newPage();
  sectionHeader("Lo Shu Grid");
  checkBreak(60);
  const cellSz = 17;
  const gx = pageW / 2 - (cellSz * 3) / 2;
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 3; col++) {
      const cx = gx + col * cellSz,
        cy = y + row * cellSz;
      const val = numerology.loShuGrid?.[row]?.[col];
      const emp = !val;
      doc.setFillColor(emp ? 8 : 22, emp ? 4 : 10, emp ? 22 : 58);
      doc.roundedRect(cx, cy, cellSz - 1, cellSz - 1, 1.5, 1.5, "F");
      doc.setDrawColor(
        emp ? 30 : GOLD_DIM[0],
        emp ? 12 : GOLD_DIM[1],
        emp ? 60 : GOLD_DIM[2],
      );
      doc.setLineWidth(emp ? 0.2 : 0.35);
      doc.roundedRect(cx, cy, cellSz - 1, cellSz - 1, 1.5, 1.5, "S");
      doc.setFont("helvetica", "bold");
      doc.setFontSize(emp ? 8 : 12);
      doc.setTextColor(
        emp ? 40 : GOLD[0],
        emp ? 20 : GOLD[1],
        emp ? 80 : GOLD[2],
      );
      doc.text(val || "·", cx + (cellSz - 1) / 2, cy + (cellSz - 1) / 2 + 2, {
        align: "center",
      });
    }
  }
  y += cellSz * 3 + 10;
  // Repeated number meanings
  if (
    numerology.repeatedNumberMeanings &&
    Object.keys(numerology.repeatedNumberMeanings).length > 0
  ) {
    sectionHeader("Repeated Number Meanings");
    Object.entries(numerology.repeatedNumberMeanings).forEach(
      ([num, meaning]) => {
        label(`Number ${num} (repeated)`, margin + 2, 8.5, GOLD);
        wrap(String(meaning), margin + 4, contentW - 8, 7.8, SILVER);
        gap(4);
      },
    );
  }
  const arrows = [
    ...(numerology.arrowsOfStrength || []).map((a) => ({
      ...a,
      type: "strength" as const,
    })),
    ...(numerology.arrowsOfWeakness || []).map((a) => ({
      ...a,
      type: "weakness" as const,
    })),
  ];
  if (arrows.length > 0) {
    sectionHeader("Arrows of Influence");
    arrows.forEach((arrow) => {
      checkBreak(30);
      const isStr = arrow.type === "strength";
      doc.setFillColor(isStr ? 20 : 45, isStr ? 45 : 20, isStr ? 30 : 25);
      doc.roundedRect(margin, y, contentW, 8, 1.5, 1.5, "F");
      doc.setFont("helvetica", "bold");
      doc.setFontSize(8);
      doc.setTextColor(
        isStr ? GREEN[0] : RED[0],
        isStr ? GREEN[1] : RED[1],
        isStr ? GREEN[2] : RED[2],
      );
      doc.text(
        `${isStr ? "▲" : "▽"} ${arrow.name.toUpperCase()} [${arrow.numbers.join("-")}] ${isStr ? "STRENGTH" : "WEAKNESS"}`,
        margin + 4,
        y + 5.5,
      );
      y += 11;
      wrap(arrow.description, margin + 4, contentW - 8, 7.8, SILVER);
      gap(6);
    });
  }
  // ═══════════════════════════════════════════════════════════════════════════
  // CHAPTER VII — PSYCHOMATRIX
  // ═══════════════════════════════════════════════════════════════════════════
  chapterPage(
    "VII",
    "Psychomatrix",
    "Pythagorean Square — All 9 Cells & Lines",
  );
  newPage();
  sectionHeader("The Four Working Numbers");
  const wn = [
    { n: pmx.first, role: "I — Qualities to Develop" },
    { n: pmx.second, role: "II — Leading Quality & Purpose" },
    { n: pmx.third, role: "III — Qualities from Birth (I)" },
    { n: pmx.fourth, role: "IV — Qualities from Birth (II)" },
  ];
  const wnW = (contentW - 6) / 4;
  wn.forEach(({ n, role }, i) => {
    const wx = margin + i * (wnW + 2);
    doc.setFillColor(12, 4, 30);
    doc.roundedRect(wx, y, wnW, 22, 2, 2, "F");
    doc.setDrawColor(GOLD_DIM[0], GOLD_DIM[1], GOLD_DIM[2]);
    doc.setLineWidth(0.2);
    doc.roundedRect(wx, y, wnW, 22, 2, 2, "S");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.setTextColor(GOLD[0], GOLD[1], GOLD[2]);
    doc.text(String(n), wx + wnW / 2, y + 13, { align: "center" });
    doc.setFont("helvetica", "normal");
    doc.setFontSize(5.5);
    doc.setTextColor(SILVER_DIM[0], SILVER_DIM[1], SILVER_DIM[2]);
    const roleLines = doc.splitTextToSize(role, wnW - 2);
    roleLines.forEach((rl: string, ri: number) => {
      doc.text(rl, wx + wnW / 2, y + 17 + ri * 3.5, { align: "center" });
    });
  });
  y += 28;
  sectionHeader("Cell-by-Cell Analysis (All 9 Digits)");
  pmx.cellReadings.forEach((cell) => {
    checkBreak(35);
    const cellDef = PSYCHOMATRIX_CELL_MEANINGS[cell.digit];
    const col = (SCALE_COLORS[cell.scale] || "#888").replace("#", "");
    const r = parseInt(col.substring(0, 2), 16) || 100;
    const g = parseInt(col.substring(2, 4), 16) || 100;
    const b = parseInt(col.substring(4, 6), 16) || 100;
    doc.setFillColor(
      Math.floor(r * 0.12),
      Math.floor(g * 0.12),
      Math.floor(b * 0.12),
    );
    doc.roundedRect(margin, y, contentW, 7, 1.5, 1.5, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8.5);
    doc.setTextColor(r, g, b);
    doc.text(
      `${cell.digit} — ${cell.cellName} · ${cell.label.toUpperCase()} · Count: ${cell.count}`,
      margin + 4,
      y + 5,
    );
    y += 10;
    if (cellDef?.generalMeaning) {
      subSection("General Meaning", SILVER_DIM);
      wrap(cellDef.generalMeaning, margin + 4, contentW - 8, 7.5, SILVER);
      gap(2);
    }
    wrap(cell.verbatim, margin + 4, contentW - 8, 7.8, SILVER);
    gap(2);
    if (cell.difficultyVerbatim) {
      subSection("Difficulty in Interpretation", [140, 70, 90]);
      wrap(cell.difficultyVerbatim, margin + 4, contentW - 8, 7.5, SILVER_DIM);
      gap(2);
    }
    gap(4);
  });
  if (
    pmx.zeroAnalysis?.hasAnyZero &&
    pmx.zeroAnalysis.interpretations?.length > 0
  ) {
    sectionHeader("Analysis of the Great Void (Zero Cells)");
    pmx.zeroAnalysis.interpretations.forEach((txt) => {
      wrap(txt, margin + 2, contentW - 4, 7.8, SILVER);
      gap(4);
    });
  }
  sectionHeader("Active Lines — Rows, Columns & Diagonals");
  PSYCHOMATRIX_LINE_INTERPRETATIONS.forEach((line) => {
    const total = line.digits.reduce(
      (s: number, d: number) => s + (pmx.counts[d] || 0),
      0,
    );
    const level = getLineLevel(line.id, total);
    if (!level) return;
    checkBreak(30);
    const typeColor =
      line.type === "row" ? TEAL : line.type === "column" ? EMERALD : VIOLET;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8.5);
    doc.setTextColor(typeColor[0], typeColor[1], typeColor[2]);
    doc.text(
      `${line.name.toUpperCase()} [${line.type.toUpperCase()}] — Total ${total} (${level.label})`,
      margin + 2,
      y,
    );
    y += 5;
    wrap(line.introduction, margin + 4, contentW - 8, 7.5, SILVER);
    gap(2);
    wrap(level.verbatim, margin + 4, contentW - 8, 7.8, SILVER);
    gap(2);
    if (level.deepDive) {
      wrap(level.deepDive, margin + 4, contentW - 8, 7.5, SILVER_DIM);
      gap(2);
    }
    wrap(line.transmutation, margin + 4, contentW - 8, 7.5, SILVER_DIM);
    gap(5);
  });
  if (dynamicResult.hasDynamicNumbers) {
    sectionHeader("Dynamic Matrix Potentials (Millennium Activation)");
    wrap(dynamicResult.interpretation, margin + 2, contentW - 4, 8, SILVER);
    gap(5);
  }
  if (pmx.complementaryInsights?.length > 0) {
    sectionHeader("Cross-Digit Interactions");
    pmx.complementaryInsights.forEach((ci) => {
      checkBreak(20);
      label(`${ci.type} — ${ci.title}`, margin + 2, 8, TEAL);
      wrap(ci.insight, margin + 4, contentW - 8, 7.8, SILVER);
      gap(4);
    });
  }
  sectionHeader("Psychic Architecture Ranking");
  dominance.rankedElements.forEach((entry, i) => {
    checkBreak(20);
    const isTop = i < 3;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8.5);
    doc.setTextColor(
      isTop ? GOLD[0] : SILVER_DIM[0],
      isTop ? GOLD[1] : SILVER_DIM[1],
      isTop ? GOLD[2] : SILVER_DIM[2],
    );
    doc.text(`${i + 1}. ${entry.element.toUpperCase()}`, margin + 2, y);
    y += 4.5;
    wrap(entry.description, margin + 4, contentW - 8, 7.5, SILVER);
    gap(5);
  });
  sectionHeader("Life-Domain Grid Insights");
  const domains = [
    "career",
    "money",
    "relationships",
    "health",
    "spirituality",
    "leadership",
    "stress",
  ];
  domains.forEach((domain) => {
    const narratives: string[] = [];
    for (const line of psychomatrixReport.lines) {
      const n = getDomainNarrative(
        line.id,
        line.strengthCategory,
        domain,
        ALL_DOMAIN_BANKS,
      );
      if (n) narratives.push(n);
    }
    if (!narratives.length) return;
    label(domain.toUpperCase(), margin + 2, 8.5, GOLD);
    wrap(narratives.join(" "), margin + 4, contentW - 8, 7.8, SILVER);
    gap(6);
  });
  if (contradictions.length > 0) {
    sectionHeader("Creative Tensions");
    contradictions.forEach((c, idx) => {
      checkBreak(35);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9);
      doc.setTextColor(RED[0], RED[1], RED[2]);
      doc.text(`${idx + 1}. ${c.name}`, margin + 2, y);
      y += 5;
      wrap(c.description, margin + 4, contentW - 8, 7.5, SILVER_DIM, "italic");
      gap(2);
      wrap(`Pattern: ${c.pattern}`, margin + 4, contentW - 8, 7.5, SILVER);
      gap(1);
      wrap(`Reading: ${c.deepReading}`, margin + 4, contentW - 8, 7.8, SILVER);
      gap(2);
      checkBreak(10);
      doc.setFillColor(10, 28, 20);
      doc.roundedRect(margin, y, contentW, 6, 1, 1, "F");
      doc.setFont("helvetica", "bold");
      doc.setFontSize(7);
      doc.setTextColor(EMERALD[0], EMERALD[1], EMERALD[2]);
      doc.text("RESOLUTION:", margin + 3, y + 4.2);
      y += 9;
      wrap(c.resolution, margin + 4, contentW - 8, 7.5, [180, 240, 210]);
      gap(6);
    });
  }
  if (recommendations.length > 0) {
    sectionHeader("Consultant Recommendations");
    recommendations.forEach((r, idx) => {
      checkBreak(25);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9);
      doc.setTextColor(GOLD[0], GOLD[1], GOLD[2]);
      doc.text(`${idx + 1}. ${r.title}`, margin + 2, y);
      y += 5;
      wrap(r.text, margin + 4, contentW - 8, 8, SILVER);
      gap(3);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(7);
      doc.setTextColor(GOLD_DIM[0], GOLD_DIM[1], GOLD_DIM[2]);
      doc.text("PRACTICE:", margin + 2, y);
      y += 4;
      wrap(
        r.practice,
        margin + 4,
        contentW - 8,
        7.5,
        [210, 185, 100],
        "italic",
      );
      gap(6);
    });
  }
  // ═══════════════════════════════════════════════════════════════════════════
  // CHAPTER VIII — FOUR PLANES OF EXPRESSION
  // ═══════════════════════════════════════════════════════════════════════════
  chapterPage(
    "VIII",
    "Four Planes of Expression",
    "Mental · Physical · Emotional · Intuitive",
  );
  newPage();
  const planes = synthesis.planeAnalysis;
  if (planes) {
    const planeData = [
      {
        key: "mental",
        label: "Mental Plane",
        data: planes.mental,
        color: VIOLET,
      },
      {
        key: "physical",
        label: "Physical Plane",
        data: planes.physical,
        color: EMERALD,
      },
      {
        key: "emotional",
        label: "Emotional Plane",
        data: planes.emotional,
        color: ROSE,
      },
      {
        key: "intuitive",
        label: "Intuitive Plane",
        data: planes.intuitive,
        color: GOLD,
      },
    ];
    // Plane score bars
    sectionHeader("Comparative Plane Scores");
    planeData.forEach(({ label: pl, data: pd, color: pc }) => {
      checkBreak(12);
      const pct = Math.min(pd.percentage, 100);
      const barW = contentW - 60;
      doc.setFont("helvetica", "bold");
      doc.setFontSize(7.5);
      doc.setTextColor(pc[0], pc[1], pc[2]);
      doc.text(pl.toUpperCase(), margin + 2, y + 3);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(6.5);
      doc.setTextColor(SILVER_DIM[0], SILVER_DIM[1], SILVER_DIM[2]);
      doc.text(`${pd.score}/${pd.maxScore} · ${pd.level}`, margin + 50, y + 3);
      doc.setFillColor(20, 10, 40);
      doc.roundedRect(margin + 2, y + 5, barW, 3, 1, 1, "F");
      doc.setFillColor(pc[0], pc[1], pc[2]);
      doc.roundedRect(margin + 2, y + 5, (barW * pct) / 100, 3, 1, 1, "F");
      y += 11;
    });
    gap(4);
    kv("Dominant Plane", planes.dominantPlane);
    kv("Weakest Plane", planes.weakestPlane);
    gap(3);
    if (planes.synthesis) {
      sectionHeader("Synthesis Interpretation");
      wrap(planes.synthesis, margin + 2, contentW - 4, 8, SILVER);
      gap(5);
    }
    planeData.forEach(({ label: pl, data: pd, color: pc }) => {
      sectionHeader(pl, pc);
      kv("Level", pd.level);
      kv("Score", `${pd.score} / ${pd.maxScore}`);
      kv("Cells", pd.cells.join(", "));
      gap(2);
      wrap(pd.interpretation, margin + 2, contentW - 4, 8, SILVER);
      gap(6);
    });
  }
  // ═══════════════════════════════════════════════════════════════════════════
  // CHAPTER IX — TEMPORAL PREDICTIONS
  // ═══════════════════════════════════════════════════════════════════════════
  chapterPage(
    "IX",
    "Temporal Predictions",
    "Personal Years · Month · Life Path Periods",
  );
  newPage();
  // Today Forecast — same mechanical offline timing engine used by the home surface
  const todayExportForecast = generateDailyForecast(
    numerology.birthDay,
    numerology.birthMonth,
    numerology.birthYear,
  );
  sectionHeader("Today Forecast", VIOLET);
  kv("Date", todayExportForecast.date);
  kv("Personal Day", String(todayExportForecast.personalDay));
  kv("Universal Day", String(todayExportForecast.universalDay));
  kv("Lucky Day", todayExportForecast.isLuckyDay ? "Yes" : "No");
  kv("Lucky Date", todayExportForecast.isLuckyDate ? "Yes" : "No");
  kv("Power Window", todayExportForecast.isPowerWindow ? "Yes" : "No");
  wrap(
    `${todayExportForecast.focus}
${todayExportForecast.shortNarrative}${
      todayExportForecast.notificationAlert
        ? `
Alert: ${todayExportForecast.notificationAlert}`
        : ""
    }`,
    margin + 2,
    contentW - 4,
    8,
    SILVER,
  );
  gap(3);
  const timingGuidance = buildTodayTimingGuidance({
    day: numerology.birthDay,
    month: numerology.birthMonth,
    year: numerology.birthYear,
  });
  subSection("Cheiro & Johari Timing Keys", TEAL);
  wrap(
    `${timingGuidance.summary}
Cheiro lucky weekdays: ${timingGuidance.cheiroLuckyDays.join(", ") || "—"}
Cheiro own dates: ${timingGuidance.cheiroOwnDates.join(", ")}
Cheiro compatible dates: ${timingGuidance.cheiroCompatibleDates.join(", ")}
Cheiro strong periods: ${timingGuidance.cheiroStrongPeriods.join("; ") || "—"}
Johari power weekdays: ${timingGuidance.johariPowerWeekdays.join(", ") || "—"}
Johari friendly dates: ${timingGuidance.johariFriendlyDates.join(", ") || "—"}
Johari growth-tension dates: ${timingGuidance.johariGrowthDates.join(", ") || "—"}`,
    margin + 2,
    contentW - 4,
    8,
    SILVER,
  );
  gap(5);
  // Personal Year Analysis
  if (synthesis.personalYearAnalysis) {
    sectionHeader(
      `Current Personal Year ${synthesis.personalYearAnalysis.rawYear === synthesis.personalYearAnalysis.year ? synthesis.personalYearAnalysis.year : `${synthesis.personalYearAnalysis.rawYear}/${synthesis.personalYearAnalysis.year}`}`,
    );
    if (synthesis.personalYearAnalysis.dualEssenceSynthesis) {
      subSection("Forensic Dual-Essence Synthesis", AMBER);
      if (synthesis.personalYearAnalysis.predictionFocusAreas?.length) {
        wrap(
          `Probability ranking: ${synthesis.personalYearAnalysis.predictionFocusAreas.join(" · ")}`,
          margin + 2,
          contentW - 4,
          8,
          GOLD,
        );
        gap(2);
      }
      wrap(
        synthesis.personalYearAnalysis.dualEssenceSynthesis,
        margin + 2,
        contentW - 4,
        8,
        SILVER,
      );
      gap(4);
    }
    wrap(
      synthesis.personalYearAnalysis.interpretation,
      margin + 2,
      contentW - 4,
      8,
      SILVER,
    );
    gap(4);
  }
  if (synthesis.personalYearCustomized) {
    subSection("Personalized Personal Year Reading", AMBER);
    wrap(synthesis.personalYearCustomized, margin + 2, contentW - 4, 8, SILVER);
    gap(4);
  }
  if (synthesis.compoundEnrichedPY) {
    subSection("Compound-Enriched Year Reading", VIOLET);
    wrap(synthesis.compoundEnrichedPY, margin + 2, contentW - 4, 8, SILVER);
    gap(5);
  }
  // Universal Year
  if (synthesis.universalYear?.interpretation) {
    sectionHeader(`Universal Year ${synthesis.universalYear.yearNumber}`);
    wrap(
      synthesis.universalYear.interpretation,
      margin + 2,
      contentW - 4,
      8,
      SILVER,
    );
    gap(5);
  }
  // Personal Month
  if (synthesis.personalMonth?.interpretation) {
    sectionHeader(
      `Personal Month ${synthesis.personalMonth.personalMonth} — ${monthNames[numerology.birthMonth - 1]}`,
    );
    wrap(
      synthesis.personalMonth.interpretation,
      margin + 2,
      contentW - 4,
      8,
      SILVER,
    );
    gap(5);
  }
  if (synthesis.birthMonthAnalysis?.interpretation) {
    sectionHeader("Birth Month Analysis");
    wrap(
      synthesis.birthMonthAnalysis.interpretation,
      margin + 2,
      contentW - 4,
      8,
      SILVER,
    );
    gap(5);
  }
  // Full Personal Year Forecast
  const pyears = numerology.personalYears || [];
  if (pyears.length > 0) {
    sectionHeader("Nine-Year Personal Year Forecast (Full)");
    pyears.forEach((py) => {
      checkBreak(30);
      const isCurrent = new Date().getFullYear() === py.year;
      doc.setFillColor(
        isCurrent ? 30 : 12,
        isCurrent ? 14 : 5,
        isCurrent ? 70 : 32,
      );
      doc.roundedRect(margin, y, contentW, 8, 1.5, 1.5, "F");
      if (isCurrent) {
        doc.setDrawColor(GOLD[0], GOLD[1], GOLD[2]);
        doc.setLineWidth(0.4);
        doc.roundedRect(margin, y, contentW, 8, 1.5, 1.5, "S");
      }
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9);
      doc.setTextColor(
        isCurrent ? GOLD[0] : WHITE[0],
        isCurrent ? GOLD[1] : WHITE[1],
        isCurrent ? GOLD[2] : WHITE[2],
      );
      doc.text(
        `${py.year} — Personal Year ${py.pyn}${isCurrent ? " ★ CURRENT" : ""}`,
        margin + 4,
        y + 5.5,
      );
      y += 11;
      if (py.compoundName) {
        doc.setFont("helvetica", "italic");
        doc.setFontSize(7);
        doc.setTextColor(GOLD_DIM[0], GOLD_DIM[1], GOLD_DIM[2]);
        doc.text(`Compound ${py.compound}: ${py.compoundName}`, margin + 4, y);
        y += 4;
      }
      wrap(py.meaning, margin + 4, contentW - 8, 8, SILVER);
      gap(3);
      if (py.compoundSymbolism) {
        wrap(py.compoundSymbolism, margin + 4, contentW - 8, 7.5, SILVER_DIM);
        gap(2);
      }
      if (py.compoundEssence) {
        wrap(
          `Essence: ${py.compoundEssence}`,
          margin + 4,
          contentW - 8,
          7.5,
          SILVER_DIM,
        );
        gap(2);
      }
      gap(4);
    });
  }
  // Life Path
  if (synthesis.lifePath?.interpretation) {
    sectionHeader(
      `Life Path ${synthesis.lifePath.number} — ${synthesis.lifePath.title}`,
    );
    wrap(
      synthesis.lifePath.interpretation,
      margin + 2,
      contentW - 4,
      8,
      SILVER,
    );
    gap(5);
  }
  // Life Path Periods
  if (synthesis.lifePathPeriods?.periods?.length > 0) {
    sectionHeader("Life Path Periods");
    synthesis.lifePathPeriods.periods.forEach((p) => {
      checkBreak(30);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(8.5);
      doc.setTextColor(GOLD[0], GOLD[1], GOLD[2]);
      doc.text(
        `${p.period} · Ages ${p.ages} — Number ${p.number} (${p.title})`,
        margin + 2,
        y,
      );
      y += 5;
      wrap(p.interpretation, margin + 4, contentW - 8, 8, SILVER);
      gap(5);
    });
  }
  // Birth Day Analysis
  if (synthesis.birthDayAnalysis?.interpretation) {
    sectionHeader(`Birth Day ${numerology.birthDay} — Analysis`);
    wrap(
      synthesis.birthDayAnalysis.interpretation,
      margin + 2,
      contentW - 4,
      8,
      SILVER,
    );
    gap(5);
  }
  // ═══════════════════════════════════════════════════════════════════════════
  // CHAPTER X — KARMIC ARCHITECTURE
  // ═══════════════════════════════════════════════════════════════════════════
  chapterPage("X", "Karmic Architecture", "Challenges · Debts · Lessons");
  newPage();
  // Challenges
  if (synthesis.challenges?.challenges?.length > 0) {
    sectionHeader("Four Life Challenges");
    synthesis.challenges.challenges.forEach((c) => {
      checkBreak(30);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9);
      doc.setTextColor(AMBER[0], AMBER[1], AMBER[2]);
      doc.text(
        `Challenge ${c.stage} — Number ${c.number}: ${c.title} (${c.ages})`,
        margin + 2,
        y,
      );
      y += 5;
      wrap(c.interpretation, margin + 4, contentW - 8, 8, SILVER);
      gap(5);
    });
  }
  // Karmic Debts
  if (synthesis.karmicDebts?.length > 0) {
    sectionHeader("Karmic Debts");
    synthesis.karmicDebts.forEach((kd) => {
      checkBreak(25);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9);
      doc.setTextColor(RED[0], RED[1], RED[2]);
      doc.text(
        `Debt Number ${kd.number} — ${kd.title} [Found in: ${kd.sources.join(", ")}]`,
        margin + 2,
        y,
      );
      y += 5;
      wrap(kd.interpretation, margin + 4, contentW - 8, 8, SILVER);
      gap(5);
    });
  }
  // Karmic Lessons
  if (synthesis.karmicLessons?.lessons?.length > 0) {
    sectionHeader("Karmic Lessons (Missing Energies)");
    synthesis.karmicLessons.lessons.forEach((kl) => {
      checkBreak(25);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(8.5);
      doc.setTextColor(VIOLET[0], VIOLET[1], VIOLET[2]);
      doc.text(`Missing Number ${kl.number} — ${kl.title}`, margin + 2, y);
      y += 5;
      wrap(kl.interpretation, margin + 4, contentW - 8, 8, SILVER);
      gap(5);
    });
    if (synthesis.karmicLessons.synthesis) {
      subSection("Lessons Synthesis", SILVER_DIM);
      wrap(
        synthesis.karmicLessons.synthesis,
        margin + 2,
        contentW - 4,
        8,
        SILVER,
      );
      gap(5);
    }
  }
  // Combined Absences
  if (synthesis.combinedAbsences?.interpretation) {
    sectionHeader("Combined Absence Analysis");
    wrap(
      synthesis.combinedAbsences.interpretation,
      margin + 2,
      contentW - 4,
      8,
      SILVER,
    );
    gap(5);
  }
  // Cell Pairs
  if (synthesis.cellPairs?.interpretation) {
    sectionHeader("Cell Pair Interactions");
    wrap(
      synthesis.cellPairs.interpretation,
      margin + 2,
      contentW - 4,
      8,
      SILVER,
    );
    gap(5);
  }
  // Line Intersections
  if (synthesis.lineIntersections?.interpretation) {
    sectionHeader("Line Intersection Analysis");
    wrap(
      synthesis.lineIntersections.interpretation,
      margin + 2,
      contentW - 4,
      8,
      SILVER,
    );
    gap(5);
  }
  // ═══════════════════════════════════════════════════════════════════════════
  // CHAPTER XI — DEEP SYNTHESIS
  // ═══════════════════════════════════════════════════════════════════════════
  chapterPage(
    "XI",
    "Deep Synthesis",
    "All cross-system integrations and final readings",
  );
  newPage();
  const deepSections = [
    {
      t: "Maturity Number Analysis",
      d: synthesis.maturityNumber?.interpretation,
    },
    { t: "Birth Day of Week", d: synthesis.birthDayOfWeek?.interpretation },
    {
      t: "Compound Personalized Insight",
      d: synthesis.compoundPersonalizedInsight,
    },
    { t: "Personal Year Customized", d: synthesis.personalYearCustomized },
    { t: "Compound-Enriched Personal Year", d: synthesis.compoundEnrichedPY },
    { t: "Karmic Fate Null Meaning", d: synthesis.karmicFateNullMeaning },
  ];
  deepSections.forEach((s) => {
    if (!s.d) return;
    sectionHeader(s.t);
    wrap(s.d, margin + 2, contentW - 4, 8, SILVER);
    gap(5);
  });
  // Zodiac futures / elemental fortunes
  const futures = insight.zodiacData?.futures;
  if (futures && Object.keys(futures).length > 0) {
    sectionHeader("Elemental Year Fortunes (Chinese Astrology)");
    Object.entries(futures).forEach(([yr, f]) => {
      checkBreak(20);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(8.5);
      doc.setTextColor(GOLD[0], GOLD[1], GOLD[2]);
      doc.text(`${f.year || yr} — ${f.element || ""} Year`, margin + 2, y);
      y += 4.5;
      wrap(f.prediction || "", margin + 4, contentW - 8, 7.8, SILVER);
      gap(4);
    });
  }
  // Zodiac elements
  const elements = insight.zodiacData?.elements;
  if (elements && Object.keys(elements).length > 0) {
    sectionHeader("Chinese Element Profiles");
    Object.entries(elements).forEach(([elem, desc]) => {
      checkBreak(20);
      label(elem.toUpperCase(), margin + 2, 8.5, TEAL);
      wrap(String(desc), margin + 4, contentW - 8, 7.8, SILVER);
      gap(4);
    });
  }
  // Zodiac compatibilities
  const compat = insight.zodiacData?.compatibilities;
  if (compat && Object.keys(compat).length > 0) {
    sectionHeader("Chinese Zodiac Compatibilities");
    Object.entries(compat).forEach(([animal, desc]) => {
      checkBreak(15);
      label(`With ${animal}`, margin + 2, 8, VIOLET);
      wrap(String(desc), margin + 4, contentW - 8, 7.5, SILVER);
      gap(3);
    });
  }
  // ── Footer on every page ──────────────────────────────────────────────────
  const totalPages = (doc.internal as any).getNumberOfPages();
  for (let p = 1; p <= totalPages; p++) {
    doc.setPage(p);
    // Footer bar
    doc.setFillColor(8, 3, 22);
    doc.rect(0, pageH - 14, pageW, 14, "F");
    doc.setFont("helvetica", "normal");
    doc.setFontSize(6);
    doc.setTextColor(SILVER_DIM[0], SILVER_DIM[1], SILVER_DIM[2]);
    doc.text(
      `Mystique Compass · ${insight.name} · Born ${bday}`,
      margin,
      pageH - 7,
    );
    doc.text(`Page ${p} of ${totalPages}`, pageW - margin, pageH - 7, {
      align: "right",
    });
  }
  const safeName = insight.name.replace(/[^a-z0-9]/gi, "_").toLowerCase();
  doc.save(`mystique-${safeName}-full-report.pdf`);
}
// ─── Button ───────────────────────────────────────────────────────────────────
export function PdfExportButton({ insight, numerology }: PdfExportButtonProps) {
  const [loading, setLoading] = useState(false);
  const handleExport = async () => {
    setLoading(true);
    try {
      await generatePdf(insight, numerology);
    } catch (err) {
      console.error("PDF export failed", err);
    } finally {
      setLoading(false);
    }
  };
  return (
    <button
      onClick={handleExport}
      disabled={loading}
      title="Download Full Cosmic Profile PDF"
      aria-label="Save Full PDF Report"
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: "40px",
        height: "40px",
        flexShrink: 0,
        background: loading
          ? "rgba(138,111,24,0.15)"
          : "linear-gradient(135deg, rgba(212,175,55,0.22), rgba(138,92,246,0.16))",
        border: "1px solid rgba(212,175,55,0.4)",
        borderRadius: "50%",
        padding: 0,
        color: loading ? "rgba(212,175,55,0.5)" : "#d4af37",
        cursor: loading ? "wait" : "pointer",
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        boxShadow: loading ? "none" : "0 4px 14px rgba(0,0,0,0.35)",
      }}
    >
      {loading ? (
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          style={{ animation: "spin 1s linear infinite" }}
        >
          <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
        </svg>
      ) : (
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="12" y1="18" x2="12" y2="12" />
          <polyline points="9 15 12 18 15 15" />
        </svg>
      )}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </button>
  );
}