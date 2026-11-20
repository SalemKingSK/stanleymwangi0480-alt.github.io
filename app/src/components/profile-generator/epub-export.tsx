import React, { useState } from "react";
import JSZip from "jszip";
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
interface EpubExportButtonProps {
  insight: AstroInsightOutput;
  numerology: NumerologyData;
}
// ─── Helpers ──────────────────────────────────────────────────────────────────
function esc(s: string | number | null | undefined): string {
  if (s == null) return "—";
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
function p(text: string | null | undefined): string {
  if (!text?.trim()) return "";
  return text
    .trim()
    .split(/\n{2,}/)
    .map((block) => `<p>${esc(block.trim())}</p>`)
    .join("\n");
}
function section(title: string, body: string, level = 2): string {
  if (!body.trim()) return "";
  return `<section class="section">
<h${level}>${esc(title)}</h${level}>
${body}
</section>`;
}
function kvTable(rows: [string, string | number | null | undefined][]): string {
  const trs = rows
    .filter(
      ([, v]) => v != null && String(v).trim() !== "" && String(v) !== "—",
    )
    .map(([k, v]) => `<tr><th>${esc(k)}</th><td>${esc(v)}</td></tr>`)
    .join("\n");
  if (!trs) return "";
  return `<table class="kv">\n${trs}\n</table>`;
}
// ─── CSS ──────────────────────────────────────────────────────────────────────
const CSS = `
@charset "UTF-8";
body {
font-family: Georgia, 'Times New Roman', serif;
font-size: 1em;
line-height: 1.7;
color: #1a1a1a;
margin: 0;
padding: 0;
}
h1 { font-size: 2em; margin-top: 2em; color: #2c1d00; border-bottom: 2px solid #c09040; padding-bottom: 0.3em; }
h2 { font-size: 1.5em; margin-top: 1.8em; color: #3d2800; border-bottom: 1px solid #d4af5788; padding-bottom: 0.2em; }
h3 { font-size: 1.2em; margin-top: 1.4em; color: #4a3310; }
h4 { font-size: 1em; margin-top: 1.2em; color: #5a4320; font-style: italic; }
p { margin: 0.5em 0 0.9em; }
section.section { margin-top: 2em; }
table { border-collapse: collapse; width: 100%; margin: 1em 0; }
table.kv th { text-align: left; width: 38%; font-size: 0.88em; color: #6b4c1a; padding: 5px 10px 5px 0; vertical-align: top; }
table.kv td { padding: 5px 0; vertical-align: top; }
table.grid { text-align: center; }
table.grid td { width: 33%; padding: 12px; border: 1px solid #c0a050; font-size: 1.1em; font-weight: bold; }
table.grid td.empty { color: #bbb; }
table.score th, table.score td { padding: 6px 10px; text-align: left; border: 1px solid #e0c070; }
table.score th { background: #fdf0c8; font-size: 0.85em; }
hr { border: none; border-top: 1px solid #d4af57aa; margin: 2em 0; }
.chip-row { display: table; width: 100%; border-collapse: separate; border-spacing: 6px; margin: 1em 0; }
.chip { display: table-cell; text-align: center; padding: 10px 4px; border: 1px solid #c09030; border-radius: 4px; }
.chip .num { font-size: 2em; font-weight: bold; color: #7c4000; display: block; }
.chip .lbl { font-size: 0.65em; color: #8c6a30; text-transform: uppercase; letter-spacing: 0.1em; }
.chip .note { font-size: 0.6em; color: #aaa; }
.alert { border-left: 4px solid #c09030; padding: 8px 12px; margin: 1em 0; background: #fffbf0; }
.alert.warning { border-color: #cc3300; background: #fff5f0; }
.alert.opportunity { border-color: #007755; background: #f0fff8; }
.label-pill { display: inline-block; font-size: 0.72em; padding: 2px 7px; border-radius: 3px; background: #f5e8c0; color: #6b4c1a; margin-bottom: 4px; }
.arrow-strength { border-left: 4px solid #007755; padding: 8px 12px; margin: 1em 0; background: #f0fff8; }
.arrow-weakness { border-left: 4px solid #cc3300; padding: 8px 12px; margin: 1em 0; background: #fff5f0; }
.cell-block { border: 1px solid #d4af57; border-radius: 4px; padding: 12px; margin: 1em 0; }
.cell-block h4 { margin-top: 0; }
.line-block { border-left: 3px solid #c09030; padding: 10px 14px; margin: 1em 0; }
.tension-block { border: 1px solid #e05050; border-radius: 4px; padding: 12px; margin: 1em 0; }
.tension-resolution { background: #f0fff8; border-left: 3px solid #007755; padding: 8px 12px; margin-top: 8px; }
.plane-bar-outer { background: #eee; border-radius: 3px; height: 8px; margin: 4px 0 10px; }
.plane-bar-inner { background: #c09030; height: 8px; border-radius: 3px; }
.rec-block { border: 1px solid #c0d8f0; border-radius: 4px; padding: 12px; margin: 1em 0; }
.rec-practice { background: #f8f4e0; border-left: 3px solid #c09030; padding: 8px 12px; margin-top: 8px; font-style: italic; font-size: 0.92em; }
.cover { text-align: center; padding: 3em 2em; }
.cover h1 { border: none; font-size: 2.4em; }
.cover .subtitle { font-size: 1.1em; color: #6b4c1a; margin-top: 0.5em; }
.cover .name { font-size: 1.8em; font-weight: bold; margin-top: 1.5em; }
.cover .bday { color: #888; font-size: 0.95em; }
.toc li { margin: 0.4em 0; }
`;
// ─── EPUB XML boilerplate ─────────────────────────────────────────────────────
function containerXml(): string {
  return `<?xml version="1.0" encoding="UTF-8"?>
<container version="1.0" xmlns="urn:oasis:names:tc:opendocument:xmlns:container">
<rootfiles>
<rootfile full-path="OEBPS/content.opf" media-type="application/oebps-package+xml"/>
</rootfiles>
</container>`;
}
function contentOpf(
  name: string,
  chapters: { id: string; title: string }[],
): string {
  const manifestItems = chapters
    .map(
      (c) =>
        `<item id="${c.id}" href="${c.id}.xhtml" media-type="application/xhtml+xml"/>`,
    )
    .join("\n ");
  const spineItems = chapters
    .map((c) => `<itemref idref="${c.id}"/>`)
    .join("\n ");
  return `<?xml version="1.0" encoding="UTF-8"?>
<package xmlns="http://www.idpf.org/2007/opf" version="3.0" unique-identifier="uid">
<metadata xmlns:dc="http://purl.org/dc/elements/1.1/">
<dc:identifier id="uid">mystique-${Date.now()}</dc:identifier>
<dc:title>Mystique Compass — ${esc(name)}</dc:title>
<dc:language>en</dc:language>
<dc:creator>Mystique Compass</dc:creator>
<meta property="dcterms:modified">${new Date().toISOString().slice(0, 19)}Z</meta>
</metadata>
<manifest>
<item id="nav" href="nav.xhtml" media-type="application/xhtml+xml" properties="nav"/>
<item id="css" href="style.css" media-type="text/css"/>
${manifestItems}
</manifest>
<spine>
${spineItems}
</spine>
</package>`;
}
function navXhtml(
  name: string,
  chapters: { id: string; title: string }[],
): string {
  const items = chapters
    .map((c) => `<li><a href="${c.id}.xhtml">${esc(c.title)}</a></li>`)
    .join("\n ");
  return xhtmlWrap(
    "Navigation",
    `<nav epub:type="toc" xmlns:epub="http://www.idpf.org/2007/ops">
<h1>Contents — ${esc(name)}</h1>
<ol>
${items}
</ol>
</nav>`,
    true,
  );
}
function xhtmlWrap(title: string, body: string, isNav = false): string {
  return `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml"${isNav ? ' xmlns:epub="http://www.idpf.org/2007/ops"' : ""}>
<head>
<meta charset="UTF-8"/>
<title>${esc(title)}</title>
<link rel="stylesheet" type="text/css" href="style.css"/>
</head>
<body>
${body}
</body>
</html>`;
}
// ─── Chapter builders ─────────────────────────────────────────────────────────
function buildCover(
  insight: AstroInsightOutput,
  numerology: NumerologyData,
  synthesis: ReturnType<typeof computeSynthesis>,
): string {
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
  const bday = `${numerology.birthDay} ${monthNames[numerology.birthMonth - 1]} ${numerology.birthYear}`;
  return xhtmlWrap(
    "Cover",
    `<div class="cover">
<h1>Mystique Compass</h1>
<div class="subtitle">Comprehensive Cosmic Profile Report</div>
<div class="name">${esc(insight.name)}</div>
<div class="bday">Born ${esc(bday)} · ${esc(insight.gender.charAt(0).toUpperCase() + insight.gender.slice(1))}</div>
<p style="margin-top:1.5em;color:#6b4c1a;">${esc(insight.western_sign)} · ${esc(insight.sign)} · ${esc(insight.new_astrology_sign)}</p>
<hr/>
<p style="color:#888;font-size:0.85em;">This report presents a complete synthesis of numerological, astrological, and psychomatrix analysis for the above named individual. Not a dot has been omitted.</p>
</div>
<nav class="toc">
<h2>Contents</h2>
<ol class="toc">
<li>Overview &amp; Core Numbers</li>
<li>Cosmic Map — Astrology</li>
<li>Numerology — Psychic, Destiny &amp; Personal Cycles</li>
<li>Chambers — Psychomatrix &amp; Lo Shu Grid</li>
<li>Synthesis — Deep Cross-System Integration</li>
</ol>
</nav>`,
  );
}
function buildChapter1(
  insight: AstroInsightOutput,
  numerology: NumerologyData,
  synthesis: ReturnType<typeof computeSynthesis>,
): string {
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
  // Core numbers chip table
  const chips = [
    {
      n: numerology.psycheNum,
      l: "Psychic Number",
      note: "Ruling self-expression",
    },
    { n: numerology.destinyNum, l: "Destiny Number", note: "Life purpose" },
    {
      n: synthesis.lifePath?.number ?? "—",
      l: "Life Path",
      note: synthesis.lifePath?.title ?? "",
    },
    {
      n: synthesis.maturityNumber?.number ?? "—",
      l: "Maturity Number",
      note: "Emerges mid-life",
    },
    {
      n: numerology.karmicFateNum ?? "—",
      l: "Karmic Fate",
      note: numerology.karmicFateNum
        ? "Karmic obligation present"
        : "No obligation",
    },
    {
      n: numerology.kuaNum,
      l: "Kua Number",
      note: `${numerology.kuaAttributes?.element ?? ""} group`,
    },
  ];
  const chipHtml = `<div class="chip-row">${chips.map((c) => `<div class="chip"><span class="num">${esc(c.n)}</span><span class="lbl">${esc(c.l)}</span><span class="note">${esc(c.note)}</span></div>`).join("")}</div>`;
  // Extended numbers
  const extTable = kvTable([
    ["Compound Number (unreduced)", numerology.compoundNum ?? "—"],
    ["Reduced Compound", numerology.reducedCompoundNum ?? "—"],
    ["Birth Day of Week", synthesis.birthDayOfWeek?.dayName ?? "—"],
    ["Universal Year", synthesis.universalYear?.yearNumber ?? "—"],
    [
      "Personal Year (current)",
      synthesis.personalYearAnalysis
        ? synthesis.personalYearAnalysis.rawYear ===
          synthesis.personalYearAnalysis.year
          ? synthesis.personalYearAnalysis.year
          : `${synthesis.personalYearAnalysis.rawYear}/${synthesis.personalYearAnalysis.year}`
        : "—",
    ],
    ["Personal Month (current)", synthesis.personalMonth?.personalMonth ?? "—"],
    ["Life Path", synthesis.lifePath?.number ?? "—"],
    ["Maturity Number", synthesis.maturityNumber?.number ?? "—"],
  ]);
  // Master Numbers
  let masterHtml = "";
  if (synthesis.masterNumbers?.length > 0) {
    masterHtml = synthesis.masterNumbers
      .map(
        (mn) =>
          `<h3>Master Number ${mn.number} — ${esc(mn.title)}</h3>${p(mn.interpretation)}`,
      )
      .join("");
  }
  // Lo Shu Grid (visual HTML table)
  let loShuHtml = "";
  if (numerology.loShuGrid) {
    const LOSHU_LABEL: Record<number, string> = {
      1: "SW",
      2: "S",
      3: "SE",
      4: "W",
      5: "C",
      6: "E",
      7: "NW",
      8: "N",
      9: "NE",
    };
    const grid = numerology.loShuGrid;
    loShuHtml = `<table class="grid">
<tr>${[0, 1, 2]
      .map((col) => {
        const v = grid[0]?.[col];
        return `<td class="${v ? "" : "empty"}">${esc(v || "·")}</td>`;
      })
      .join("")}</tr>
<tr>${[0, 1, 2]
      .map((col) => {
        const v = grid[1]?.[col];
        return `<td class="${v ? "" : "empty"}">${esc(v || "·")}</td>`;
      })
      .join("")}</tr>
<tr>${[0, 1, 2]
      .map((col) => {
        const v = grid[2]?.[col];
        return `<td class="${v ? "" : "empty"}">${esc(v || "·")}</td>`;
      })
      .join("")}</tr>
</table>`;
  }
  // Personal year alerts / key facts
  const alertsHtml = (() => {
    const py = synthesis.personalYearAnalysis?.year;
    const parts: string[] = [];
    if (py === 4)
      parts.push(
        `<div class="alert warning"><strong>Personal Year 4 — Foundation Cycle:</strong> Consolidation year. Demands patience, structural work, and foundation-laying. Avoid impulsive expansion.</div>`,
      );
    if (py === 7)
      parts.push(
        `<div class="alert warning"><strong>Personal Year 7 — Retreat &amp; Sacrifice:</strong> An inward spiritual year. Avoid major financial or relational decisions.</div>`,
      );
    if (py === 9)
      parts.push(
        `<div class="alert"><strong>Personal Year 9 — Great Completion:</strong> Endings, release, and culmination. Radical release clears the path.</div>`,
      );
    return parts.join("\n");
  })();
  const body = `<h1>Chapter 1 — Overview &amp; Core Numbers</h1>
${section("Core Numbers at a Glance", chipHtml)}
${section("Extended Numbers", extTable)}
${masterHtml ? section("Master Numbers", masterHtml) : ""}
${section("Lo Shu Grid", loShuHtml)}
${alertsHtml}`;
  return xhtmlWrap("Overview & Core Numbers", body);
}
function buildChapter2(
  insight: AstroInsightOutput,
  numerology: NumerologyData,
  synthesis: ReturnType<typeof computeSynthesis>,
): string {
  // Western sign
  const westSection = section(
    "Western Zodiac Sign",
    kvTable([
      ["Sign", insight.western_sign],
      ["Element", insight.element ?? "—"],
      ["New Astrology Sign", insight.new_astrology_sign],
    ]),
  );
  // Chinese zodiac
  const sd = insight.signData;
  const chineseBody = [
    kvTable([
      ["Chinese Zodiac", insight.sign],
      ["Element", insight.element ?? "—"],
    ]),
    sd?.description ? `<h3>Character Description</h3>${p(sd.description)}` : "",
    sd?.love ? `<h3>Love &amp; Relationships</h3>${p(sd.love)}` : "",
    sd?.profession ? `<h3>Career &amp; Profession</h3>${p(sd.profession)}` : "",
    sd?.homeAndFamily ? `<h3>Home &amp; Family</h3>${p(sd.homeAndFamily)}` : "",
    sd?.compatibilities
      ? `<h3>Compatibilities</h3>${p(sd.compatibilities)}`
      : "",
  ].join("");
  const chineseSection = section("Chinese Zodiac — Full Profile", chineseBody);
  // Decan
  const decanSection = synthesis.decan
    ? section(
        `Decan ${synthesis.decan.decanNumber} — ${synthesis.decan.title}`,
        [
          kvTable([
            ["Ruling Planet", synthesis.decan.rulingPlanet],
            ["Date Range", synthesis.decan.dateRange],
          ]),
          p(synthesis.decan.interpretation),
        ].join(""),
      )
    : "";
  // Birth day of week
  const bdowSection = synthesis.birthDayOfWeek
    ? section(
        `Born on ${synthesis.birthDayOfWeek.dayName}`,
        [
          kvTable([
            ["Planet", synthesis.birthDayOfWeek.planet],
            ["Theme", synthesis.birthDayOfWeek.title],
          ]),
          p(synthesis.birthDayOfWeek.interpretation),
        ].join(""),
      )
    : "";
  // Sexagenary
  const sexSection = synthesis.sexagenary
    ? section(
        `Sexagenary Cycle — ${synthesis.sexagenary.name}`,
        p(synthesis.sexagenary.interpretation),
      )
    : "";
  // Heavenly Stem
  const stemSection = synthesis.heavenlyStem
    ? section(
        `Heavenly Stem — ${synthesis.heavenlyStem.stem}`,
        [
          kvTable([
            ["Title", synthesis.heavenlyStem.title],
            ["Element", synthesis.heavenlyStem.element],
            ["Polarity", synthesis.heavenlyStem.polarity],
          ]),
          p(synthesis.heavenlyStem.interpretation),
        ].join(""),
      )
    : "";
  // Earthly Branch
  const branchSection = synthesis.earthlyBranch
    ? section(
        `Earthly Branch — ${synthesis.earthlyBranch.animal} (${synthesis.earthlyBranch.animalChinese})`,
        [
          kvTable([
            ["Element", synthesis.earthlyBranch.element],
            ["Direction", synthesis.earthlyBranch.direction],
            ["Season", synthesis.earthlyBranch.season],
          ]),
          p(synthesis.earthlyBranch.interpretation),
        ].join(""),
      )
    : "";
  // Double Animal
  const doubleSection =
    synthesis.doubleAnimal?.isDouble && synthesis.doubleAnimal.interpretation
      ? section(
          `Double ${synthesis.doubleAnimal.animal} Influence`,
          p(synthesis.doubleAnimal.interpretation),
        )
      : "";
  // Zodiac Relationships
  const zodRelSection = synthesis.zodiacRelationships
    ? section(
        `Zodiac Relationships — ${synthesis.zodiacRelationships.animal}`,
        [
          kvTable([
            ["Secret Friend", synthesis.zodiacRelationships.secretFriend],
            [
              "Astrological Enemy",
              synthesis.zodiacRelationships.astrologicalEnemy,
            ],
            ["Peach Blossom", synthesis.zodiacRelationships.peachBlossom],
          ]),
          p(synthesis.zodiacRelationships.interpretation),
        ].join(""),
      )
    : "";
  // Kua Number
  const kua = numerology.kuaAttributes;
  const kuaSection = kua
    ? section(
        `Kua Number ${numerology.kuaNum} — Feng Shui Blueprint`,
        [
          kvTable([
            ["Element", kua.element ?? "—"],
            ["Group", kua.group ?? "—"],
            ["Trigram", kua.trigram ?? "—"],
            ["Season", kua.season ?? "—"],
            [
              "Lucky Colours",
              Array.isArray(kua.lucky_colours)
                ? kua.lucky_colours.join(", ")
                : (kua.colors ?? "—"),
            ],
          ]),
          kua.directions && Object.keys(kua.directions).length > 0
            ? `<h3>Power Directions</h3><table class="score"><tr><th>Direction</th><th>Meaning</th></tr>${Object.entries(
                kua.directions,
              )
                .map(
                  ([d, m]) =>
                    `<tr><td><strong>${esc(d)}</strong></td><td>${esc(m)}</td></tr>`,
                )
                .join("")}</table>`
            : "",
        ].join(""),
      )
    : "";
  // Chinese futures
  const futures = insight.zodiacData?.futures;
  const futuresSection =
    futures && Object.keys(futures).length > 0
      ? section(
          "Elemental Year Fortunes",
          `<table class="score"><tr><th>Year</th><th>Element</th><th>Prediction</th></tr>${Object.entries(
            futures,
          )
            .map(
              ([yr, f]: [string, any]) =>
                `<tr><td>${esc(f.year || yr)}</td><td>${esc(f.element ?? "")}</td><td>${esc(f.prediction ?? "")}</td></tr>`,
            )
            .join("")}</table>`,
        )
      : "";
  // Chinese elements
  const elements = insight.zodiacData?.elements;
  const elemSection =
    elements && Object.keys(elements).length > 0
      ? section(
          "Chinese Element Profiles",
          Object.entries(elements)
            .map(([el, desc]) => `<h3>${esc(el)}</h3>${p(String(desc))}`)
            .join(""),
        )
      : "";
  // Compatibilities table
  const compat = insight.zodiacData?.compatibilities;
  const compatSection =
    compat && Object.keys(compat).length > 0
      ? section(
          "Chinese Zodiac Compatibilities",
          `<table class="score"><tr><th>Animal</th><th>Compatibility</th></tr>${Object.entries(
            compat,
          )
            .map(
              ([animal, desc]) =>
                `<tr><td><strong>${esc(animal)}</strong></td><td>${esc(desc)}</td></tr>`,
            )
            .join("")}</table>`,
        )
      : "";
  const body = `<h1>Chapter 2 — Cosmic Map: Astrology</h1>
${westSection}
${chineseSection}
${decanSection}
${bdowSection}
${sexSection}
${stemSection}
${branchSection}
${doubleSection}
${zodRelSection}
${kuaSection}
${futuresSection}
${elemSection}
${compatSection}`;
  return xhtmlWrap("Cosmic Map — Astrology", body);
}
function buildChapter3(
  insight: AstroInsightOutput,
  numerology: NumerologyData,
  synthesis: ReturnType<typeof computeSynthesis>,
): string {
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
  const cheiroData = cheiroPsychicNumbers[numerology.psycheNum];
  const monthlyData = resolveMonthData(
    numerology.birthMonth,
    numerology.psycheNum,
  );
  // Layer 1: Vedic / Psychic essence
  const layer1 = section(
    "Layer 1 — Psychic Essence (Vedic)",
    [
      numerology.psychicMeaning?.title
        ? `<h3>${esc(numerology.psychicMeaning.title)}</h3>`
        : "",
      p(numerology.psychicMeaning?.description),
    ].join(""),
  );
  // Layer 2: Chronicler's View
  const layer2 = cheiroData
    ? section(
        "Layer 2 — The Chronicler's View",
        [
          kvTable([
            ["Ruling Planet", cheiroData.planet],
            ["Birth Dates", cheiroData.birthDates.join(", ")],
            ["Lucky Colours", cheiroData.luckyColors],
            ["Lucky Jewels", cheiroData.luckyJewels],
            ["Compatible Numbers", cheiroData.compatibleNumbers.join(", ")],
          ]),
          `<h3>Strong Periods</h3><ul>${cheiroData.strongPeriods.map((sp) => `<li>${esc(sp)}</li>`).join("")}</ul>`,
          `<h3>Full Character Analysis</h3>${p(cheiroData.description)}`,
          `<h3>Lucky Days</h3>${p(cheiroData.luckyDays.fullDescription)}`,
        ].join(""),
      )
    : "";
  // Layer 3: Monthly Soul Chronicle
  const layer3 = monthlyData
    ? section(
        "Layer 3 — Monthly Soul Chronicle",
        [
          kvTable([["Birth Month", monthlyData.monthName]]),
          `<h3>General Influence</h3>${p(monthlyData.generalInfluence)}`,
          `<h3>Monthly Character</h3>${p(monthlyData.monthlyCharacter)}`,
          `<h3>Financial Outlook</h3>${p(monthlyData.financialOutlook)}`,
          `<h3>Health Cautions</h3>${p(monthlyData.healthCautions)}`,
        ].join(""),
      )
    : "";
  // Layer 4: Celestial Alignments
  const layer4 = monthlyData
    ? section(
        "Layer 4 — Celestial Alignments",
        [
          `<h3>Important Numbers &amp; Dates</h3>${p(monthlyData.luckyNumbers)}`,
          kvTable([
            ["Lucky Colours", monthlyData.colors],
            ["Lucky Jewels", monthlyData.jewels],
          ]),
          `<h3>Climacteric Years</h3>${p(monthlyData.climactericYears)}`,
          `<h3>Magnetic Attraction</h3>${p(monthlyData.magneticAttraction)}`,
        ].join(""),
      )
    : "";
  const psychicSection = `<h2>Psychic Number ${numerology.psycheNum}</h2>${layer1}${layer2}${layer3}${layer4}`;
  // Destiny
  const destinySection = section(
    `Destiny Number — ${numerology.destinyNum}`,
    [
      numerology.destinyMeaning?.title
        ? `<h3>${esc(numerology.destinyMeaning.title)}</h3>`
        : "",
      p(numerology.destinyMeaning?.description),
    ].join(""),
  );
  // Compound
  const compoundSection = [
    numerology.compoundNum
      ? section(
          `Compound Number — ${numerology.compoundNum} (unreduced)`,
          p(numerology.compoundMeaning ?? ""),
        )
      : "",
    numerology.reducedCompoundNum
      ? section(
          `Reduced Compound — ${numerology.reducedCompoundNum}`,
          p(numerology.reducedCompoundMeaning ?? ""),
        )
      : "",
  ].join("");
  // Karmic Fate
  const karmicSection = section(
    `Karmic Fate — ${numerology.karmicFateNum ?? "None"}`,
    numerology.karmicFateNum
      ? p(numerology.karmicFateMeaning ?? "")
      : p(
          synthesis.karmicFateNullMeaning ??
            "No karmic fate number present in this configuration.",
        ),
  );
  // Special Trait
  const specialSection = numerology.specialTraitMeaning
    ? section("Special Trait", p(numerology.specialTraitMeaning))
    : "";
  // Compound Personalized Insight
  const compoundInsight = synthesis.compoundPersonalizedInsight
    ? section(
        "Compound Personalized Insight",
        p(synthesis.compoundPersonalizedInsight),
      )
    : "";
  // Life Path
  const lifePathSection = synthesis.lifePath
    ? section(
        `Life Path ${synthesis.lifePath.number} — ${synthesis.lifePath.title}`,
        p(synthesis.lifePath.interpretation),
      )
    : "";
  // Life Path Periods
  const lifePathPeriodsSection =
    synthesis.lifePathPeriods?.periods?.length > 0
      ? section(
          "Life Path Periods",
          synthesis.lifePathPeriods.periods
            .map(
              (pp) =>
                `<h3>${esc(pp.period)} · Ages ${esc(pp.ages)} — Number ${esc(pp.number)} (${esc(pp.title)})</h3>${p(pp.interpretation)}`,
            )
            .join(""),
        )
      : "";
  // Today Forecast
  const todayExportForecast = generateDailyForecast(
    numerology.birthDay,
    numerology.birthMonth,
    numerology.birthYear,
  );
  const todayTimingGuidance = buildTodayTimingGuidance({
    day: numerology.birthDay,
    month: numerology.birthMonth,
    year: numerology.birthYear,
  });
  const todaySection = section(
    "Today Forecast",
    [
      kvTable([
        ["Date", todayExportForecast.date],
        ["Personal Day", todayExportForecast.personalDay],
        ["Universal Day", todayExportForecast.universalDay],
        ["Lucky Day", todayExportForecast.isLuckyDay ? "Yes" : "No"],
        ["Lucky Date", todayExportForecast.isLuckyDate ? "Yes" : "No"],
        ["Power Window", todayExportForecast.isPowerWindow ? "Yes" : "No"],
      ]),
      p(`${todayExportForecast.focus}
${todayExportForecast.shortNarrative}${
        todayExportForecast.notificationAlert
          ? `
Alert: ${todayExportForecast.notificationAlert}`
          : ""
      }`),
      `<h3>Cheiro & Johari Timing Keys</h3>`,
      p(`${todayTimingGuidance.summary}
Cheiro lucky weekdays: ${todayTimingGuidance.cheiroLuckyDays.join(", ") || "—"}
Cheiro own dates: ${todayTimingGuidance.cheiroOwnDates.join(", ")}
Cheiro compatible dates: ${todayTimingGuidance.cheiroCompatibleDates.join(", ")}
Cheiro strong periods: ${todayTimingGuidance.cheiroStrongPeriods.join("; ") || "—"}
Johari power weekdays: ${todayTimingGuidance.johariPowerWeekdays.join(", ") || "—"}
Johari friendly dates: ${todayTimingGuidance.johariFriendlyDates.join(", ") || "—"}
Johari growth-tension dates: ${todayTimingGuidance.johariGrowthDates.join(", ") || "—"}`),
    ].join(""),
  );
  // Personal Year Analysis (current)
  const pyaSection = synthesis.personalYearAnalysis
    ? section(
        `Current Personal Year ${synthesis.personalYearAnalysis.rawYear === synthesis.personalYearAnalysis.year ? synthesis.personalYearAnalysis.year : `${synthesis.personalYearAnalysis.rawYear}/${synthesis.personalYearAnalysis.year}`} — ${synthesis.personalYearAnalysis.title}`,
        [
          synthesis.personalYearAnalysis.dualEssenceSynthesis
            ? `<h3>Forensic Dual-Essence Synthesis</h3>${synthesis.personalYearAnalysis.predictionFocusAreas?.length ? `<p><strong>Probability ranking:</strong> ${esc(synthesis.personalYearAnalysis.predictionFocusAreas.join(" · "))}</p>` : ""}${p(synthesis.personalYearAnalysis.dualEssenceSynthesis)}`
            : "",
          p(synthesis.personalYearAnalysis.interpretation),
          synthesis.personalYearCustomized
            ? `<h3>Personalized Reading</h3>${p(synthesis.personalYearCustomized)}`
            : "",
          synthesis.compoundEnrichedPY
            ? `<h3>Compound-Enriched Year Reading</h3>${p(synthesis.compoundEnrichedPY)}`
            : "",
        ].join(""),
      )
    : "";
  // Universal Year
  const uySection = synthesis.universalYear
    ? section(
        `Universal Year ${synthesis.universalYear.yearNumber} — ${synthesis.universalYear.title}`,
        p(synthesis.universalYear.interpretation),
      )
    : "";
  // Personal Month
  const pmSection = synthesis.personalMonth
    ? section(
        `Personal Month ${synthesis.personalMonth.personalMonth}`,
        p(synthesis.personalMonth.interpretation),
      )
    : "";
  // Birth Month Analysis
  const bmaSection = synthesis.birthMonthAnalysis
    ? section(
        `Born in ${synthesis.birthMonthAnalysis.monthName} — ${synthesis.birthMonthAnalysis.title}`,
        p(synthesis.birthMonthAnalysis.interpretation),
      )
    : "";
  // Birth Day Analysis
  const bdaySection = synthesis.birthDayAnalysis
    ? section(
        `Birth Day ${synthesis.birthDayAnalysis.day} — ${synthesis.birthDayAnalysis.title}`,
        [
          kvTable([
            ["Ruling Number", synthesis.birthDayAnalysis.rulingNumber],
            ["Keywords", synthesis.birthDayAnalysis.keywords],
          ]),
          p(synthesis.birthDayAnalysis.interpretation),
        ].join(""),
      )
    : "";
  // Nine-Year Forecast
  const forecastSection =
    numerology.personalYears && numerology.personalYears.length > 0
      ? section(
          "Nine-Year Personal Year Forecast",
          `<table class="score">
<tr><th>Year</th><th>PY</th><th>Compound</th><th>Reading</th></tr>
${numerology.personalYears
  .map(
    (py) => `<tr>
<td><strong>${esc(py.year)}</strong></td>
<td>${esc(py.pyn)}</td>
<td>${py.compoundName ? `${esc(py.compound)} — ${esc(py.compoundName)}` : "—"}</td>
<td>${esc(py.meaning)}${py.compoundSymbolism ? ` ${esc(py.compoundSymbolism)}` : ""}${py.compoundEssence ? ` ${esc(py.compoundEssence)}` : ""}</td>
</tr>`,
  )
  .join("")}
</table>`,
        )
      : "";
  // Maturity Number
  const maturitySection = synthesis.maturityNumber
    ? section(
        `Maturity Number ${synthesis.maturityNumber.number}${synthesis.maturityNumber.isMaster ? " ★" : ""} — ${synthesis.maturityNumber.title}`,
        p(synthesis.maturityNumber.interpretation),
      )
    : "";
  // Master Numbers
  const masterSection =
    synthesis.masterNumbers?.length > 0
      ? section(
          "Master Numbers Detected",
          synthesis.masterNumbers
            .map(
              (mn) =>
                `<h3>Master Number ${mn.number} — ${esc(mn.title)}</h3>${p(mn.interpretation)}`,
            )
            .join(""),
        )
      : "";
  // Four Life Challenges
  const challengesSection =
    synthesis.challenges?.challenges?.length > 0
      ? section(
          "Four Life Challenges",
          synthesis.challenges.challenges
            .map(
              (c) =>
                `<h3>Challenge ${c.stage} — Number ${c.number}: ${esc(c.title)} (Ages ${esc(c.ages)})</h3>${p(c.interpretation)}`,
            )
            .join(""),
        )
      : "";
  // Karmic Debts
  const debtsSection =
    synthesis.karmicDebts?.length > 0
      ? section(
          "Karmic Debts",
          synthesis.karmicDebts
            .map(
              (kd) =>
                `<h3>Debt Number ${kd.number} — ${esc(kd.title)}</h3>${kvTable([["Found in", kd.sources?.join(", ") ?? kd.foundIn]])}${p(kd.interpretation)}`,
            )
            .join(""),
        )
      : "";
  // Karmic Lessons
  const karLessonsSection =
    synthesis.karmicLessons?.lessons?.length > 0
      ? section(
          "Karmic Lessons (Missing Numbers)",
          [
            synthesis.karmicLessons.summary
              ? `<h3>Summary</h3>${p(synthesis.karmicLessons.summary)}`
              : "",
            synthesis.karmicLessons.lessons
              .filter((l: any) => !l.present)
              .map(
                (l: any) =>
                  `<h3>Missing Number ${l.number} — ${esc(l.title)}</h3>${p(l.interpretation)}`,
              )
              .join(""),
            synthesis.karmicLessons.synthesis
              ? `<h3>Lessons Synthesis</h3>${p(synthesis.karmicLessons.synthesis)}`
              : "",
          ].join(""),
        )
      : "";
  // Combined Absences
  const absSection = synthesis.combinedAbsences?.interpretation
    ? section(
        "Combined Absence Analysis",
        p(synthesis.combinedAbsences.interpretation),
      )
    : "";
  const body = `<h1>Chapter 3 — Numerology</h1>
${psychicSection}
<hr/>
${destinySection}
${compoundSection}
${karmicSection}
${specialSection}
${compoundInsight}
<hr/>
${lifePathSection}
${lifePathPeriodsSection}
<hr/>
${todaySection}
${pyaSection}
${uySection}
${pmSection}
${bmaSection}
${bdaySection}
${forecastSection}
<hr/>
${maturitySection}
${masterSection}
<hr/>
${challengesSection}
${debtsSection}
${karLessonsSection}
${absSection}`;
  return xhtmlWrap("Numerology", body);
}
function buildChapter4(
  insight: AstroInsightOutput,
  numerology: NumerologyData,
  synthesis: ReturnType<typeof computeSynthesis>,
): string {
  const pmx = calculatePsychomatrix(
    numerology.birthDay,
    numerology.birthMonth,
    numerology.birthYear,
  );
  const dynamicResult = calculateDynamicPotentials(
    numerology.birthYear,
    pmx.counts,
  );
  // Lo Shu Grid visual
  let loShuHtml = "";
  if (numerology.loShuGrid) {
    const g = numerology.loShuGrid;
    loShuHtml = `<table class="grid">
<caption>Lo Shu Grid</caption>
<tr>${[0, 1, 2]
      .map((col) => {
        const v = g[0]?.[col];
        return `<td class="${v ? "" : "empty"}">${esc(v || "·")}</td>`;
      })
      .join("")}</tr>
<tr>${[0, 1, 2]
      .map((col) => {
        const v = g[1]?.[col];
        return `<td class="${v ? "" : "empty"}">${esc(v || "·")}</td>`;
      })
      .join("")}</tr>
<tr>${[0, 1, 2]
      .map((col) => {
        const v = g[2]?.[col];
        return `<td class="${v ? "" : "empty"}">${esc(v || "·")}</td>`;
      })
      .join("")}</tr>
</table>`;
  }
  // Repeated Number Meanings
  const repSection =
    numerology.repeatedNumberMeanings &&
    Object.keys(numerology.repeatedNumberMeanings).length > 0
      ? section(
          "Repeated Number Meanings",
          Object.entries(numerology.repeatedNumberMeanings)
            .map(
              ([num, meaning]) =>
                `<h3>Number ${esc(num)} (repeated)</h3>${p(String(meaning))}`,
            )
            .join(""),
        )
      : "";
  // Arrows
  const arrows = [
    ...(numerology.arrowsOfStrength || []).map((a: any) => ({
      ...a,
      type: "strength",
    })),
    ...(numerology.arrowsOfWeakness || []).map((a: any) => ({
      ...a,
      type: "weakness",
    })),
  ];
  const arrowsSection =
    arrows.length > 0
      ? section(
          "Arrows of Influence",
          arrows
            .map(
              (arrow: any) =>
                `<div class="arrow-${arrow.type}">
<strong>${arrow.type === "strength" ? "▲" : "▽"} ${esc(arrow.name)} [${arrow.numbers?.join("-") ?? ""}] — ${arrow.type === "strength" ? "Strength" : "Weakness"}</strong>
${p(arrow.description)}
</div>`,
            )
            .join(""),
        )
      : "";
  // Psychomatrix: Four Working Numbers
  const wnSection = section(
    "The Four Working Numbers",
    `<table class="score">
<tr><th>Number</th><th>Role</th><th>Value</th></tr>
<tr><td>I</td><td>Qualities to Develop</td><td><strong>${esc(pmx.first)}</strong></td></tr>
<tr><td>II</td><td>Leading Quality &amp; Purpose</td><td><strong>${esc(pmx.second)}</strong></td></tr>
<tr><td>III</td><td>Qualities from Birth (I)</td><td><strong>${esc(pmx.third)}</strong></td></tr>
<tr><td>IV</td><td>Qualities from Birth (II)</td><td><strong>${esc(pmx.fourth)}</strong></td></tr>
</table>`,
  );
  // Psychomatrix: All 9 Cells
  const cellsHtml = pmx.cellReadings
    .map((cell) => {
      const cellDef = PSYCHOMATRIX_CELL_MEANINGS[cell.digit];
      return `<div class="cell-block">
<h3>${cell.digit} — ${esc(cell.cellName)}</h3>
<span class="label-pill">${esc(cell.label)} · Count: ${cell.count}</span>
${cellDef?.generalMeaning ? `<h4>General Meaning</h4>${p(cellDef.generalMeaning)}` : ""}
<h4>Verbatim Interpretation (${esc(cell.label)})</h4>
${p(cell.verbatim)}
${cell.difficultyVerbatim ? `<h4>Difficulty in Interpretation</h4>${p(cell.difficultyVerbatim)}` : ""}
${cellDef?.meanings && cellDef.meanings.length > 1 ? `<h4>All Intensity Levels</h4><table class="score"><tr><th>Label</th><th>Interpretation</th></tr>${cellDef.meanings.map((m) => `<tr><td><strong>${esc(m.label)}</strong>${m.label === cell.label ? " ✓" : ""}</td><td>${esc(m.verbatim)}</td></tr>`).join("")}</table>` : ""}
</div>`;
    })
    .join("\n");
  // Zero Analysis
  const zeroSection =
    pmx.zeroAnalysis?.hasAnyZero && pmx.zeroAnalysis.interpretations?.length > 0
      ? section(
          "Analysis of the Great Void (Zero Cells)",
          pmx.zeroAnalysis.interpretations.map((txt) => p(txt)).join(""),
        )
      : "";
  // Active Lines
  const linesHtml = PSYCHOMATRIX_LINE_INTERPRETATIONS.map((line) => {
    const total = line.digits.reduce(
      (s: number, d: number) => s + (pmx.counts[d] || 0),
      0,
    );
    const level = getLineLevel(line.id, total);
    if (!level) return "";
    const typeLabel =
      line.type === "row"
        ? "Row"
        : line.type === "column"
          ? "Column"
          : "Diagonal";
    return `<div class="line-block">
<h3>${esc(line.name)} [${typeLabel}] — Total: ${total} (${esc(level.label)})</h3>
<h4>Introduction</h4>${p(line.introduction)}
<h4>Primary Interpretation</h4>${p(level.verbatim)}
${level.deepDive ? `<h4>Deep Dive</h4>${p(level.deepDive)}` : ""}
<h4>Inner Mechanics / Transmutation</h4>${p(line.transmutation)}
${line.newMechanics ? `<h4>New Mechanics</h4>${p(line.newMechanics)}` : ""}
${line.alexandrovNote ? `<h4>Interpreter's Note</h4>${p(line.alexandrovNote)}` : ""}
</div>`;
  })
    .filter(Boolean)
    .join("\n");
  const activeSection = section(
    "Active Lines — Rows, Columns &amp; Diagonals",
    linesHtml,
  );
  // Dynamic Potentials
  const dynSection = dynamicResult.hasDynamicNumbers
    ? section(
        "Dynamic Matrix Potentials (Millennium Activation)",
        p(dynamicResult.interpretation),
      )
    : "";
  // Cross-Digit Interactions
  const crossSection =
    pmx.complementaryInsights?.length > 0
      ? section(
          "Cross-Digit Interactions",
          pmx.complementaryInsights
            .map(
              (ci: any) =>
                `<h3>${esc(ci.type)} — ${esc(ci.title)}</h3>${p(ci.insight)}`,
            )
            .join(""),
        )
      : "";
  // Cell Pairs
  const cellPairsSection = synthesis.cellPairs?.interpretation
    ? section("Cell Pair Interactions", p(synthesis.cellPairs.interpretation))
    : "";
  // Line Intersections
  const lineIntSection = synthesis.lineIntersections?.interpretation
    ? section(
        "Line Intersection Analysis",
        p(synthesis.lineIntersections.interpretation),
      )
    : "";
  const body = `<h1>Chapter 4 — Chambers: Psychomatrix &amp; Lo Shu Grid</h1>
${section("Lo Shu Grid", loShuHtml)}
${repSection}
${arrowsSection}
<hr/>
<h2>Alexandrov's Psychomatrix (Pythagorean Square)</h2>
${wnSection}
${section("All 9 Cells — Complete Analysis", cellsHtml)}
${zeroSection}
${activeSection}
${dynSection}
${crossSection}
${cellPairsSection}
${lineIntSection}`;
  return xhtmlWrap("Chambers — Psychomatrix & Lo Shu", body);
}
function buildChapter5(
  insight: AstroInsightOutput,
  numerology: NumerologyData,
  synthesis: ReturnType<typeof computeSynthesis>,
): string {
  const pmx = calculatePsychomatrix(
    numerology.birthDay,
    numerology.birthMonth,
    numerology.birthYear,
  );
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
  // Four Planes
  const planes = synthesis.planeAnalysis;
  const planesSection = planes
    ? section(
        "Four Planes of Expression",
        [
          `<table class="score">
<tr><th>Plane</th><th>Score</th><th>Max</th><th>%</th><th>Level</th><th>Cells</th></tr>
${[planes.mental, planes.physical, planes.emotional, planes.intuitive]
  .map(
    (pl) =>
      `<tr><td><strong>${esc(pl.name)}</strong></td><td>${esc(pl.score)}</td><td>${esc(pl.maxScore)}</td><td>${esc(pl.percentage)}%</td><td>${esc(pl.level)}</td><td>${pl.cells.join(", ")}</td></tr>`,
  )
  .join("")}
</table>`,
          kvTable([
            ["Dominant Plane", planes.dominantPlane],
            ["Weakest Plane", planes.weakestPlane],
          ]),
          planes.synthesis
            ? `<h3>Synthesis Interpretation</h3>${p(planes.synthesis)}`
            : "",
          [planes.mental, planes.physical, planes.emotional, planes.intuitive]
            .map(
              (pl) =>
                `<h3>${esc(pl.name)} Plane — ${esc(pl.level)}</h3>${p(pl.interpretation)}`,
            )
            .join(""),
        ].join(""),
      )
    : "";
  // Architecture Ranking
  const rankSection = dominance
    ? section(
        "Psychic Architecture — Priority Ranking",
        [
          `<table class="score">
<tr><th>Rank</th><th>Force</th><th>Score</th><th>Description</th></tr>
${dominance.rankedElements
  .map(
    (entry: any, i: number) =>
      `<tr><td>${i + 1}</td><td><strong>${esc(entry.element)}</strong></td><td>${esc(entry.score)}</td><td>${esc(entry.description)}</td></tr>`,
  )
  .join("")}
</table>`,
          dominance.top3?.length > 0
            ? dominance.top3
                .map(
                  (entry: any) =>
                    `<h3>${esc(entry.element)}</h3>${p(entry.description)}`,
                )
                .join("")
            : "",
        ].join(""),
      )
    : "";
  // Life-Domain Grid Profile
  const domains = [
    "career",
    "money",
    "relationships",
    "health",
    "spirituality",
    "leadership",
    "stress",
  ];
  const domainRows = domains
    .map((domain) => {
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
      if (!narratives.length) return "";
      return `<h3>${domain.charAt(0).toUpperCase() + domain.slice(1)}</h3>${p(narratives.join("\n\n"))}`;
    })
    .filter(Boolean)
    .join("");
  const domainsSection = domainRows
    ? section("Life-Domain Grid Profile", domainRows)
    : "";
  // Creative Tensions (Contradictions)
  const tensionsSection =
    contradictions.length > 0
      ? section(
          `Creative Tensions (${contradictions.length})`,
          contradictions
            .map(
              (c, idx) =>
                `<div class="tension-block">
<h3>${idx + 1}. ${esc(c.name)}</h3>
<p><em>${esc(c.description)}</em></p>
<p><strong>Pattern:</strong> ${esc(c.pattern)}</p>
${p(c.deepReading)}
<div class="tension-resolution">
<strong>Resolution Path:</strong><br/>
${esc(c.resolution)}
</div>
</div>`,
            )
            .join("\n"),
        )
      : "";
  // Consultant Recommendations
  const recsSection =
    recommendations.length > 0
      ? section(
          `Consultant Recommendations (${recommendations.length})`,
          recommendations
            .map(
              (r, idx) =>
                `<div class="rec-block">
<h3>${idx + 1}. ${esc(r.title)}</h3>
<span class="label-pill">${esc(r.domain)}</span>
${p(r.text)}
<div class="rec-practice"><strong>30-Day Practice:</strong><br/>${esc(r.practice)}</div>
</div>`,
            )
            .join("\n"),
        )
      : "";
  // Cell Pair Patterns (table format)
  const cellPairPatterns = synthesis.cellPairs?.patterns || [];
  const cellPairSection =
    cellPairPatterns.length > 0
      ? section(
          "Cross-Cell Pattern Details",
          `<table class="score">
<tr><th>Pattern</th><th>Cells</th><th>Polarity</th><th>Interpretation</th></tr>
${cellPairPatterns.map((p: any) => `<tr><td><strong>${esc(p.name)}</strong></td><td>${p.involvedCells?.join(", ") ?? ""}</td><td>${esc(p.polarity)}</td><td>${esc(p.interpretation)}</td></tr>`).join("")}
</table>`,
        )
      : "";
  // Line Intersection Patterns (table)
  const lineIntPatterns = synthesis.lineIntersections?.patterns || [];
  const lineIntTableSection =
    lineIntPatterns.length > 0
      ? section(
          "Line Intersection Synthesis",
          `<table class="score">
<tr><th>Pattern</th><th>Condition</th><th>Interpretation</th></tr>
${lineIntPatterns.map((p: any) => `<tr><td><strong>${esc(p.name)}</strong></td><td>${esc(p.condition)}</td><td>${esc(p.interpretation)}</td></tr>`).join("")}
</table>`,
        )
      : "";
  // Maturity (deep synthesis repeat for completeness)
  const maturityDeepSection = synthesis.maturityNumber
    ? section(
        `Maturity Number ${synthesis.maturityNumber.number} — Deep Synthesis`,
        p(synthesis.maturityNumber.interpretation),
      )
    : "";
  // Compound Personalized
  const compDeepSection = synthesis.compoundPersonalizedInsight
    ? section(
        "Compound Personalized Insight",
        p(synthesis.compoundPersonalizedInsight),
      )
    : "";
  // Personal Year Customized (deep)
  const pyCustomDeepSection = synthesis.personalYearCustomized
    ? section(
        "Personal Year — Customized Reading",
        [
          p(synthesis.personalYearCustomized),
          synthesis.compoundEnrichedPY
            ? `<h3>Compound-Enriched Year</h3>${p(synthesis.compoundEnrichedPY)}`
            : "",
        ].join(""),
      )
    : "";
  const body = `<h1>Chapter 5 — Synthesis: Deep Cross-System Integration</h1>
${planesSection}
<hr/>
${rankSection}
${domainsSection}
<hr/>
${tensionsSection}
${recsSection}
<hr/>
${cellPairSection}
${lineIntTableSection}
<hr/>
${maturityDeepSection}
${compDeepSection}
${pyCustomDeepSection}`;
  return xhtmlWrap("Synthesis — Deep Integration", body);
}
// ─── EPUB assembly ────────────────────────────────────────────────────────────
export async function generateEpub(
  insight: AstroInsightOutput,
  numerology: NumerologyData,
) {
  const zip = new JSZip();
  const synthesis = computeSynthesis(numerology, insight);
  const chapters = [
    {
      id: "cover",
      title: "Cover & Contents",
      html: buildCover(insight, numerology, synthesis),
    },
    {
      id: "ch-01",
      title: "Overview & Core Numbers",
      html: buildChapter1(insight, numerology, synthesis),
    },
    {
      id: "ch-02",
      title: "Cosmic Map — Astrology",
      html: buildChapter2(insight, numerology, synthesis),
    },
    {
      id: "ch-03",
      title: "Numerology",
      html: buildChapter3(insight, numerology, synthesis),
    },
    {
      id: "ch-04",
      title: "Chambers — Psychomatrix & Lo Shu",
      html: buildChapter4(insight, numerology, synthesis),
    },
    {
      id: "ch-05",
      title: "Synthesis — Deep Integration",
      html: buildChapter5(insight, numerology, synthesis),
    },
  ];
  // EPUB spec: mimetype MUST be first file, STORED (no compression)
  zip.file("mimetype", "application/epub+zip", { compression: "STORE" });
  zip.file("META-INF/container.xml", containerXml());
  zip.file("OEBPS/content.opf", contentOpf(insight.name, chapters));
  zip.file("OEBPS/nav.xhtml", navXhtml(insight.name, chapters));
  zip.file("OEBPS/style.css", CSS);
  for (const ch of chapters) {
    zip.file(`OEBPS/${ch.id}.xhtml`, ch.html);
  }
  const blob = await zip.generateAsync({
    type: "blob",
    mimeType: "application/epub+zip",
  });
  const url = URL.createObjectURL(blob);
  const safeName = insight.name.replace(/[^a-z0-9]/gi, "_").toLowerCase();
  const a = document.createElement("a");
  a.href = url;
  a.download = `mystique-${safeName}-full-report.epub`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 5000);
}
// ─── Button ───────────────────────────────────────────────────────────────────
export function EpubExportButton({
  insight,
  numerology,
}: EpubExportButtonProps) {
  const [loading, setLoading] = useState(false);
  const handleExport = async () => {
    setLoading(true);
    try {
      await generateEpub(insight, numerology);
    } catch (err) {
      console.error("EPUB export failed", err);
    } finally {
      setLoading(false);
    }
  };
  return (
    <button
      onClick={handleExport}
      disabled={loading}
      title="Download Full Cosmic Profile as EPUB"
      aria-label="Save Full EPUB Report"
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: "40px",
        height: "40px",
        flexShrink: 0,
        background: loading
          ? "rgba(52,138,111,0.12)"
          : "linear-gradient(135deg, rgba(52,211,153,0.2), rgba(16,185,129,0.14))",
        border: "1px solid rgba(52,211,153,0.45)",
        borderRadius: "50%",
        padding: 0,
        color: loading ? "rgba(52,211,153,0.5)" : "#34d399",
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
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
        </svg>
      )}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </button>
  );
}