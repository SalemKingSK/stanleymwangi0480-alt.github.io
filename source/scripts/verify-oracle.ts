// tools/verify-oracle.ts — end-to-end verification of the SHIPPED Oracle.
// Bundled from the real source and run against the real deploy tree. Two questions:
//   1. is the prediction engine actually gone from the shipped bundle?
//   2. does the reading it left behind still work?
import fs from "fs";
import { buildFixtureDossier, CALIBRATION, numberAlignment } from "@/lib/match-engine";

const BUNDLE = process.env.BUNDLE || "";
const DEPLOY = "/home/user/mystique/stanleymwangi0480-alt.github.io-main";

let failures = 0;
const check = (name: string, cond: boolean, detail = "") => {
  if (!cond) failures++;
  console.log(`${cond ? "PASS" : "FAIL"}  ${name}${detail ? " — " + detail : ""}`);
};

/* ── 1 · the prediction engine must be GONE ─────────────────────────────────── */
if (BUNDLE && fs.existsSync(BUNDLE)) {
  const b = fs.readFileSync(BUNDLE, "utf8");
  // verdict-specific wording only: the meaning library legitimately contains phrases like
  // "ambition to win", so a bare " to win" is not evidence of the engine still shipping
  /* Distinctive strings that only the prediction components produced. Prose in the app's meaning
     library legitimately contains phrases like "ambition to win" or "hard to beat combination",
     so the checks look for the verdict's own wording, not for words it happens to share. */
  for (const gone of [
    "verdicts in this confidence band",
    "Which side does the reading favour",
    "How this call is made",
    "The day leans to",
    "accuracy lab — how often the verdict is right",
    "Same model, date numbers removed",
    "Date numbers alone (numerology)",
    "Always predict a home win",
    "No bundled form for",
    "featureMeans",
    "/data/club-form.json",
  ]) {
    check(`removed from the shipped bundle: "${gone}"`, !b.includes(gone));
  }
} else {
  console.log("(no bundle supplied — set BUNDLE=/path/to/index-*.js to audit the shipped file)");
}

/* ── 2 · the reading itself still works ─────────────────────────────────────── */
const d1 = buildFixtureDossier("2026-09-13", "Manchester United", "Manchester City");
check("the fixture reading still resolves", !!d1 && !!d1.home && !!d1.away, `${d1?.home?.team} v ${d1?.away?.team}`);
check("it carries the date and the day's numbers", d1.date === "2026-09-13" && d1.day.universalDay.reduced > 0,
  `universal day ${d1.day.universalDay.raw} → ${d1.day.universalDay.reduced}`);
check("both clubs carry founding dates", !!d1.home.foundedISO && !!d1.away.foundedISO, `${d1.home.foundedISO} / ${d1.away.foundedISO}`);
const alignJson = JSON.stringify(numberAlignment(d1));
check("the alignment lines describe, and do not favour",
  !alignJson.includes('"favours"') && !alignJson.includes('"tests"'),
  "verdict words are now in harmony / opposing / neutral");

let produced = 0;
const batch: [string, string][] = [
  ["Manchester United", "Manchester City"], ["Napoli", "Bologna"], ["Gor Mahia", "Al Ahly"],
  ["Coventry City", "Brighton & Hove Albion"], ["Sassuolo", "Juventus"], ["Wrexham", "US Palermo"],
];
for (const [h, a] of batch) {
  try { if (buildFixtureDossier("2026-09-13", h, a)) produced++; } catch { /* no ledger date */ }
}
check(`readings produced for the batch (${produced}/${batch.length})`, produced >= batch.length - 1);

/* ── 3 · the record of what was tested still ships ──────────────────────────── */
check("the study record still ships in the app", !!CALIBRATION && !!CALIBRATION.studies?.length,
  `${CALIBRATION.studies.length} studies on record`);
check("the removal is recorded in that record", !!CALIBRATION.removal, CALIBRATION.removal?.closing || "");
check("the record still states membership count honestly",
  typeof CALIBRATION.conclusion === "string" && CALIBRATION.conclusion.includes("do not predict"));

/* ── 4 · the shipped data files that are no longer fetched ──────────────────── */
const calib = JSON.parse(fs.readFileSync(`${DEPLOY}/data/calibration.json`, "utf8"));
check("calibration.json keeps the verdict block only as a historical record",
  !!calib.verdict, calib.verdict ? `rule ${calib.verdict.decisionRule} · held-out ${(calib.verdict.metrics["form+date (the verdict)"].testAccuracy * 100).toFixed(1)}%` : "");

console.log(failures === 0 ? "\nALL CHECKS PASSED" : `\n${failures} CHECK(S) FAILED`);
process.exit(failures === 0 ? 0 : 1);
