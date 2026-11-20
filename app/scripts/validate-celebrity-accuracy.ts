/**
 * Celebrity-history accuracy harness.
 *
 *   cd app && npm run validate:accuracy          (or: TZ=UTC npx tsx scripts/validate-celebrity-accuracy.ts [--strict] [--json out.json] [--verbose])
 *
 * Every number the app shows comes from a birth date. This script checks each
 * field against an independent reference, using the ~1,300 real people in
 * famous-birthdays.ts and the 429 dated life events in the personal-year
 * history banks.
 *
 *  A. Birth-date accuracy: app data vs Wikidata P569 (snapshot in scripts/data/).
 *  B. Chinese zodiac animal + element: vs Lunar New Year dates from
 *     lunar-javascript (fixture), including a browser in New York (UTC−5).
 *  C. Sexagenary (stem-branch) year: vs the same Lunar New Year boundary.
 *  D. Kua number: vs the classical formula with the real Lichun date
 *     (astronomy-engine fixture).
 *  E. Western sun sign + decan sign: vs real solar ingress times (astronomy-engine).
 *     A sign on a cusp day is "ambiguous" when the Sun changed sign during that
 *     calendar day somewhere on Earth, so the birth time would be needed.
 *  F. Day of week: vs a Julian-Day-Number calculation (Julian calendar before
 *     1582-10-15, astronomical year numbering for BCE).
 *  G. Personal-year case banks: stored Direct/Classic numbers vs the birth date,
 *     and the engine's pair polarity vs the documented outcome, compared with a
 *     shuffled-outcome baseline.
 *
 * `--strict` exits non-zero if any deterministic field (B–F) disagrees with
 * the reference for a date that can be checked.
 */
import fs from 'node:fs';
import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { famousBirthdays } from '@/lib/famous-birthdays';
import { getChineseZodiacSign, getWesternZodiacSign } from '@/lib/astrology';
import { sunSignsOnDate } from '@/lib/astrology/sun-sign';
import { calculateKua, getKuaLookupKey } from '@/lib/numerology';
import { getSexagenaryAnalysis } from '@/lib/astrology/sexagenary';
import { getBirthDayOfWeek } from '@/lib/astrology/birth-day-of-week';
import { getDecan } from '@/lib/astrology/decans';
import { HISTORICAL_BIRTH_DATES, normaliseHistoricalPersonName } from '@/lib/numerology/personal-year-history-birthdates';
import { HISTORICAL_CASES_EXPANSION_200 } from '@/lib/numerology/personal-year-history-expanded';
import { HISTORICAL_CASES_EXPANSION_300_EXTRA } from '@/lib/numerology/personal-year-history-expanded-2';
import { HISTORICAL_CASES_EXPANSION_300_MORE } from '@/lib/numerology/personal-year-history-expanded-3';
import { HISTORICAL_CASES_EXPANSION_FINAL } from '@/lib/numerology/personal-year-history-expanded-4';
import { getPersonalYearAnalysis } from '@/lib/numerology/personal-year-full';

const args = process.argv.slice(2);
const STRICT = args.includes('--strict');
const VERBOSE = args.includes('--verbose');
const CHINESE_ONLY = args.includes('--chinese-only');
const jsonOut = args.includes('--json') ? args[args.indexOf('--json') + 1] : null;

const here = path.dirname(new URL(import.meta.url).pathname);
const REF = JSON.parse(fs.readFileSync(path.join(here, 'data/astro-reference-1800-2100.json'), 'utf8'));
const WD = JSON.parse(fs.readFileSync(path.join(here, 'data/wikidata-dob-snapshot.json'), 'utf8'));

const pad = (n: number) => String(n).padStart(2, '0');
const iso = (y: number, m: number, d: number) => `${y < 0 ? '-' : ''}${String(Math.abs(y)).padStart(4, '0')}-${pad(m)}-${pad(d)}`;
const normName = (n: string) => n.replace(/\s*†/g, '').replace(/\s*\([^)]*\)\s*$/, '').trim();
const ANIMALS = ['Rat', 'Ox', 'Tiger', 'Rabbit', 'Dragon', 'Snake', 'Horse', 'Goat', 'Monkey', 'Rooster', 'Dog', 'Pig'];
const ELEMENTS = ['Wood', 'Fire', 'Earth', 'Metal', 'Water'];
const mod = (a: number, n: number) => ((a % n) + n) % n;
const astroYear = (y: number) => (y < 0 ? y + 1 : y); // app stores BCE as historical years (-100 = 100 BC)

const people = famousBirthdays.filter(p => !p.tags.includes('Entity'));
const report: Record<string, unknown> = {};
let strictFailures = 0;
const section = (t: string) => console.log(`\n━━ ${t} ${'━'.repeat(Math.max(0, 70 - t.length))}`);
const show = (label: string, list: string[], max = VERBOSE ? 1e9 : 12) => {
  if (!list.length) return;
  console.log(`  ${label} (${list.length}):`);
  for (const l of list.slice(0, max)) console.log(`    · ${l}`);
  if (list.length > max) console.log(`    … ${list.length - max} more (use --verbose)`);
};

// ─── reference helpers ──────────────────────────────────────────────────────
function inRef(y: number) { return y >= REF.from && y <= REF.to; }
function lnyOf(y: number): [number, number] { const [m, d] = REF.lunarNewYear[y - REF.from].split('-').map(Number); return [m, d]; }
function lichunOf(y: number): [number, number] { const [m, d] = REF.lichun[y - REF.from].split('-').map(Number); return [m, d]; }
const before = (m: number, d: number, [bm, bd]: [number, number]) => m < bm || (m === bm && d < bd);
function refZodiacYear(d: number, m: number, y: number) { return before(m, d, lnyOf(y)) ? y - 1 : y; }
function refSolarYear(d: number, m: number, y: number) { return before(m, d, lichunOf(y)) ? y - 1 : y; }
const animalOf = (zy: number) => ANIMALS[mod(zy - 4, 12)];
const elementOf = (zy: number) => ELEMENTS[Math.floor(mod(zy - 4, 10) / 2)];

const ingress: Array<{ t: number; sign: string }> = [];
for (const [, row] of Object.entries(REF.ingressUtc as Record<string, string[]>)) {
  row.forEach((s, k) => ingress.push({ t: Date.parse(s + 'Z'), sign: REF.signOrder[k] }));
}
ingress.sort((a, b) => a.t - b.t);
function signAt(t: number) {
  let lo = 0, hi = ingress.length - 1;
  while (lo < hi) { const mid = (lo + hi + 1) >> 1; if (ingress[mid].t <= t) lo = mid; else hi = mid - 1; }
  return ingress[lo].sign;
}
function refSigns(d: number, m: number, y: number): string[] {
  const dt = new Date(0); dt.setUTCFullYear(y, m - 1, d); dt.setUTCHours(0, 0, 0, 0);
  const start = dt.getTime() - 14 * 3600e3;          // local midnight in UTC+14
  const end = dt.getTime() + (24 + 12) * 3600e3 - 1; // local 23:59 in UTC−12
  return [...new Set([signAt(start), signAt(end)])];
}

function jdn(y: number, m: number, d: number, julian: boolean) {
  const a = Math.floor((14 - m) / 12), Y = y + 4800 - a, M = m + 12 * a - 3;
  return julian
    ? d + Math.floor((153 * M + 2) / 5) + 365 * Y + Math.floor(Y / 4) - 32083
    : d + Math.floor((153 * M + 2) / 5) + 365 * Y + Math.floor(Y / 4) - Math.floor(Y / 100) + Math.floor(Y / 400) - 32045;
}
const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
function refWeekday(d: number, m: number, y: number) {
  const ay = astroYear(y);
  const julian = ay < 1582 || (ay === 1582 && (m < 10 || (m === 10 && d < 15)));
  return DAYS[mod(jdn(ay, m, d, julian) + 1, 7)];
}
function refKua(d: number, m: number, y: number, gender: string) {
  const sy = inRef(y) ? refSolarYear(d, m, y) : (before(m, d, [2, 4]) ? y - 1 : y);
  let root = String(Math.abs(sy)).split('').reduce((a, c) => a + +c, 0);
  while (root > 9) root = String(root).split('').reduce((a, c) => a + +c, 0);
  const male = gender.toLowerCase() === 'male';
  const raw = male ? mod(11 - root, 9) || 9 : mod(4 + root, 9) || 9;
  const kua = raw === 5 ? (male ? 2 : 8) : raw;
  return { raw, kua, lookup: raw === 5 ? (male ? '5_male' : '5_female') : String(kua) };
}

// ─── A. birth dates vs Wikidata ─────────────────────────────────────────────
section('A. Birth dates vs Wikidata P569');
if (!CHINESE_ONLY) {
  // Records where the app value is right (or a deliberate convention) and the
  // Wikidata value is a different person, a different calendar or disputed.
  const REVIEWED: Record<string, string> = {
    'Woody Allen': 'app correct (1 Dec 1935); Wikidata 30 Nov is a time-zone artefact',
    'A.R. Rahman': 'app matches Wikipedia (6 Jan 1967)',
    'Yasir Arafat': 'Wikipedia gives 24 Aug 1929; 4 Aug is the alternative claim',
    'Erik ten Hag': 'app matches Wikipedia (2 Feb 1970)',
    'Ajinkya Rahane': 'app matches Wikipedia (6 Jun 1988)',
    'Mohammed Shami': 'sources disagree (3 Sep vs 9 Mar 1990)',
    'Deepak Chahar': 'Wikidata matched a different person (born 1972)',
    'Venkatesh Iyer': 'Wikidata matched a different person',
    'Silas Malafaia': 'app matches Wikipedia (14 Sep 1958)',
    'Juan Carlos Ortiz': 'Wikidata matched a footballer of the same name',
    'Ricardo Salazar': 'Wikidata matched a different person',
    'Ebenezer Obadare': 'Wikidata matched the academic, not the evangelist',
    'Sônia Hernandes': 'sources disagree',
    'Joshua Tijani': 'sources disagree',
    'Matthew Renshaw': 'sources disagree (28 vs 12 Mar 1996)',
    'W.F. Kumuyi': 'app matches Wikipedia (6 Jun 1941)',
    'D.K. Olukoya': 'sources disagree',
    'Sheikh Ibrahim Niass': 'sources disagree',
    "Abu Bakar Ba'asyir": 'sources disagree (17 vs 12 Aug 1938)',
    'Bobbie Houston': 'sources disagree',
    'Mamady Doumbouya': 'Wikidata has two conflicting values',
    'Genghis Khan': 'birth date unknown; any value is traditional',
    'Jomo Kenyatta': 'birth year uncertain (c. 1897)',
    'Muhammad': 'traditional 570 CE; Wikidata uses 571',
    'Captain James Cook': 'app uses New Style (7 Nov 1728); Wikidata stores Old Style',
    'Augustine of Hippo': 'Julian date; Wikidata stores proleptic Gregorian',
    'Francia Márquez': 'app matches Wikipedia (1 Dec 1981)',
    'Plato': 'traditional 428/427 BC; Wikidata uses 429 BC',
    'Jesus Christ': 'traditional c. 4 BC; Wikidata uses c. 6 BC',
    'Ibrahim Ag Alhabib': 'year disputed (1958–1960)',
    'Shahbaz Ahmed': 'Wikidata matched the hockey player (born 1968)',
    'Atahualpa': 'birth year uncertain (c. 1500–1502)',
    'Tāwhiao': 'birth year uncertain (c. 1822–1825)',
    'Ezekiel Odero': 'birth year disputed',
  };
  const jd2g = (y: number, m: number, d: number) => {
    let j = jdn(y, m, d, true); const a = j + 32044, b = Math.floor((4 * a + 3) / 146097), c = a - Math.floor(146097 * b / 4);
    const dd = Math.floor((4 * c + 3) / 1461), e = c - Math.floor(1461 * dd / 4), mm = Math.floor((5 * e + 2) / 153);
    return iso(100 * b + dd - 4800 + Math.floor(mm / 10), mm + 3 - 12 * Math.floor(mm / 10), e - Math.floor((153 * mm + 2) / 5) + 1);
  };
  let match = 0, convention = 0, yearOnly = 0; const reviewed: string[] = [], mismatch: string[] = []; let unverifiable = 0;
  for (const p of people) {
    const k = normName(p.name); const w: string[] | undefined = WD.famousBirthdays[k];
    if (!w) { unverifiable++; continue; }
    const exp = iso(p.year, p.month, p.day);
    if (w.includes(exp)) { match++; continue; }
    if (p.year < 0 && w.some(x => x.startsWith(iso(astroYear(p.year), 1, 1).slice(0, 5)))) { convention++; continue; } // BCE numbering
    if (p.year < 1800 && w.includes(jd2g(p.year, p.month, p.day))) { convention++; continue; } // Julian vs Gregorian
    if (REVIEWED[k]) { reviewed.push(`${k}: ${REVIEWED[k]}`); continue; }
    if (w.every(x => /-01-01$|-0[01]$|-01-1$/.test(x))) { yearOnly++; if (!w.some(x => x.startsWith(exp.slice(0, 5)))) mismatch.push(`${p.name}: app ${exp} | Wikidata year ${w.join('|')}`); continue; }
    mismatch.push(`${p.name}: app ${exp} | Wikidata ${w.join('|')}`);
  }
  const ledger = Object.entries(HISTORICAL_BIRTH_DATES);
  const ledgerBad: string[] = [];
  const LEDGER_REVIEWED = new Set(['deepika padukone', 'sam bankman fried', 'yasser arafat']);
  let ledgerOk = 0;
  for (const [key, b] of ledger) {
    const w: string[] | undefined = WD.historyLedger[key];
    if (!w) continue;
    if (w.includes(iso(b.year, b.month, b.day))) ledgerOk++;
    else if (!LEDGER_REVIEWED.has(key)) ledgerBad.push(`${key}: ${iso(b.year, b.month, b.day)} | Wikidata ${w.join('|')}`);
  }
  console.log(`  famous-birthdays people: ${people.length}; checked against Wikidata: ${people.length - unverifiable}`);
  console.log(`  exact match ${match} · calendar/BCE-convention match ${convention} · year-only in Wikidata ${yearOnly} · reviewed exceptions ${reviewed.length} · unexplained ${mismatch.length}`);
  console.log(`  history ledger: ${ledgerOk}/${ledger.length} exact, ${ledgerBad.length} unexplained`);
  show('Unexplained birth-date differences', mismatch);
  show('Ledger differences', ledgerBad);
  if (VERBOSE) show('Reviewed exceptions', reviewed);
  report.birthDates = { people: people.length, checked: people.length - unverifiable, match, convention, yearOnly, reviewed: reviewed.length, unexplained: mismatch, ledgerOk, ledgerBad };
}

// ─── B/C. Chinese zodiac + sexagenary ───────────────────────────────────────
section('B. Chinese zodiac (Lunar New Year boundary)');
{
  // Every day 1800-2100 plus every celebrity, in the browser time zone and in a
  // forced UTC−5 offset (simulates a visitor in New York).
  const realTZ = process.env.TZ;
  const run = (label: string) => {
    let checked = 0; const wrong: string[] = []; const wrongCeleb: string[] = [];
    for (let y = REF.from; y < REF.to; y++) {
      for (let m = 1; m <= 2; m++) for (let d = 1; d <= (m === 1 ? 31 : 29); d++) {
        if (m === 2 && d === 29 && !(y % 4 === 0 && (y % 100 !== 0 || y % 400 === 0))) continue;
        checked++;
        const zy = refZodiacYear(d, m, y);
        const got = getChineseZodiacSign(d, m, y);
        if (got.sign !== animalOf(zy) || got.element !== elementOf(zy)) wrong.push(`${iso(y, m, d)}: app ${got.element} ${got.sign}, ref ${elementOf(zy)} ${animalOf(zy)}`);
      }
    }
    for (const p of people) {
      if (!inRef(p.year)) continue;
      const zy = refZodiacYear(p.day, p.month, p.year);
      const got = getChineseZodiacSign(p.day, p.month, p.year);
      if (got.sign !== animalOf(zy) || got.element !== elementOf(zy)) wrongCeleb.push(`${p.name} ${iso(p.year, p.month, p.day)}: app ${got.element} ${got.sign}, ref ${elementOf(zy)} ${animalOf(zy)}`);
    }
    if (!CHINESE_ONLY) console.log(`  [${label}] Jan/Feb days 1800-2099 checked ${checked}: wrong ${wrong.length} (${(100 * wrong.length / checked).toFixed(2)}%) · celebrities wrong ${wrongCeleb.length}`);
    if (!CHINESE_ONLY) show(`[${label}] celebrities with the wrong animal/element`, wrongCeleb, VERBOSE ? 1e9 : 8);
    return { checked, wrong: wrong.length, wrongCeleb };
  };
  const local = run(`TZ=${realTZ ?? 'system'}`);
  // Date-only strings are parsed as UTC, so the result can depend on the
  // visitor's time zone. Re-run this section in a child process for New York.
  let ny = { checked: 0, wrong: 0, wrongCeleb: [] as string[] };
  if (CHINESE_ONLY) {
    console.log('@@' + JSON.stringify(local));
    process.exit(0);
  } else {
    const r = spawnSync(process.execPath, ['--import', 'tsx', path.join(here, 'validate-celebrity-accuracy.ts'), ...args, '--chinese-only'], { env: { ...process.env, TZ: 'America/New_York' }, encoding: 'utf8' });
    const line = (r.stdout || '').split('\n').find(l => l.startsWith('@@'));
    if (line) ny = JSON.parse(line.slice(2));
    console.log(`  [browser in America/New_York] Jan/Feb days wrong ${ny.wrong} (${(100 * ny.wrong / Math.max(1, ny.checked)).toFixed(2)}%) · celebrities wrong ${ny.wrongCeleb.length}`);
    show('[America/New_York] celebrities with the wrong animal/element', ny.wrongCeleb, VERBOSE ? 1e9 : 8);
  }
  const outside = people.filter(p => !inRef(p.year));
  const outsideJanFeb = outside.filter(p => p.month <= 2);
  console.log(`  celebrities outside 1800-2100 (cannot be checked; app approximates): ${outside.length}, born Jan/Feb: ${outsideJanFeb.length}`);
  report.chinese = { local, ny, outside: outside.length, outsideJanFeb: outsideJanFeb.length };
  if (local.wrong || local.wrongCeleb.length || ny.wrong) strictFailures++;
}

section('C. Sexagenary stem-branch year');
{
  let wrong = 0, checked = 0; const ex: string[] = [];
  for (const p of people) {
    if (!inRef(p.year)) continue; checked++;
    const zy = refZodiacYear(p.day, p.month, p.year);
    const got = getSexagenaryAnalysis(p.year, p.month, p.day);
    const want = `${elementOf(zy)} ${animalOf(zy)}`;
    if (`${got.stem.element} ${got.branch.animal}` !== want) { wrong++; ex.push(`${p.name} ${iso(p.year, p.month, p.day)}: app ${got.stem.element} ${got.branch.animal}, ref ${want}`); }
  }
  // Every one of the 60 years: the card title must name the year's own element and animal.
  const badTitles: string[] = [];
  for (let y = 1984; y < 2044; y++) {
    const r = getSexagenaryAnalysis(y, 6, 1);
    if (!r.name.includes(r.stem.element) || !r.name.includes(r.branch.animal)) badTitles.push(`${y}: "${r.name}" on a ${r.stem.element} ${r.branch.animal} year`);
  }
  console.log(`  celebrities checked ${checked}: wrong ${wrong} (${(100 * wrong / checked).toFixed(1)}%) · card titles naming the wrong element/animal: ${badTitles.length}/60 cycle years`);
  show('Wrong stem-branch year', ex, VERBOSE ? 1e9 : 6);
  show('Mislabelled cycle years', badTitles);
  if (badTitles.length) strictFailures++;
  report.sexagenary = { checked, wrong };
  if (wrong) strictFailures++;
}

// ─── D. Kua ─────────────────────────────────────────────────────────────────
section('D. Kua number (Lichun boundary, Rule of 5)');
{
  let checked = 0, wrong = 0, lookupWrong = 0; const ex: string[] = [];
  for (const p of people) {
    if (p.year < 1) continue;
    for (const g of ['male', 'female']) {
      checked++;
      const r = refKua(p.day, p.month, p.year, g);
      const got = calculateKua(p.year, p.month, p.day, g);
      const key = getKuaLookupKey(p.year, p.month, p.day, g);
      if (got !== r.kua) { wrong++; if (ex.length < 400) ex.push(`${p.name} ${iso(p.year, p.month, p.day)} ${g}: app ${got}, ref ${r.kua}`); }
      else if (key !== r.lookup) lookupWrong++;
    }
  }
  console.log(`  checks ${checked} (each celebrity as male and female): wrong Kua ${wrong} · right Kua but wrong reading (Rule-of-5 card) ${lookupWrong}`);
  show('Wrong Kua', ex, VERBOSE ? 1e9 : 6);
  report.kua = { checked, wrong, lookupWrong };
  if (wrong || lookupWrong) strictFailures++;
}

// ─── E. Western sign + decans ───────────────────────────────────────────────
section('E. Western sun sign (real ingress times)');
{
  let checked = 0, certainWrong = 0, cusp = 0, decanDisagree = 0, sunModelDiff = 0; const ex: string[] = [];
  for (let y = 1900; y <= 2030; y++) {
    for (let m = 1; m <= 12; m++) {
      const dim = new Date(Date.UTC(2001, m, 0)).getUTCDate() + (m === 2 && y % 4 === 0 && (y % 100 !== 0 || y % 400 === 0) ? 1 : 0);
      for (let d = 1; d <= dim; d++) {
        checked++;
        const refs = refSigns(d, m, y);
        const app = getWesternZodiacSign(d, m, y);
        if (refs.length > 1) cusp++;
        if (!refs.includes(app)) { certainWrong++; if (ex.length < 400) ex.push(`${iso(y, m, d)}: app ${app}, sun was in ${refs.join('/')} all day`); }
        if (y === 2000 && getDecan(d, m).sign !== getWesternZodiacSign(d, m)) decanDisagree++;
        if (sunSignsOnDate(d, m, y).join() !== refs.join()) sunModelDiff++;
      }
    }
  }
  const celebWrong = people.filter(p => p.year > REF.from && p.year < REF.to && !refSigns(p.day, p.month, p.year).includes(getWesternZodiacSign(p.day, p.month, p.year)))
    .map(p => `${p.name} ${iso(p.year, p.month, p.day)}: app ${getWesternZodiacSign(p.day, p.month, p.year)}, ref ${refSigns(p.day, p.month, p.year).join('/')}`);
  console.log(`  days 1900-2030 checked ${checked}: sign certainly wrong ${certainWrong} (${(100 * certainWrong / checked).toFixed(2)}%) · cusp days needing a birth time ${cusp} (${(100 * cusp / checked).toFixed(1)}%)`);
  console.log(`  solar-longitude model vs reference ingress table: differs on ${sunModelDiff} days`);
  console.log(`  decan card disagrees with sign card on ${decanDisagree} calendar days · celebrities with a certainly-wrong sign: ${celebWrong.length}`);
  show('Certainly-wrong sign days', ex, VERBOSE ? 1e9 : 6);
  show('Celebrities', celebWrong, VERBOSE ? 1e9 : 8);
  report.western = { checked, certainWrong, cusp, decanDisagree, celebWrong };
  if (certainWrong || celebWrong.length || decanDisagree) strictFailures++;
}

// ─── F. Day of week ─────────────────────────────────────────────────────────
section('F. Birth day of week');
{
  let checked = 0; const wrong: string[] = [];
  for (const p of people) {
    checked++;
    const want = refWeekday(p.day, p.month, p.year);
    const got = getBirthDayOfWeek(p.day, p.month, p.year).dayName;
    if (got !== want) wrong.push(`${p.name} ${iso(p.year, p.month, p.day)}: app ${got}, ref ${want}`);
  }
  console.log(`  celebrities checked ${checked}: wrong ${wrong.length}`);
  show('Wrong weekday', wrong);
  report.weekday = { checked, wrong };
  if (wrong.length) strictFailures++;
}

// ─── G. Personal-year case banks ────────────────────────────────────────────
section('G. Personal-year history banks');
{
  const digitSum = (n: number) => String(Math.abs(n)).split('').reduce((a, c) => a + +c, 0);
  const single = (n: number) => { let v = Math.abs(n); while (v > 9) v = digitSum(v); return v; };
  const master = (n: number) => { let v = Math.abs(n); while (v > 9 && v !== 11 && v !== 22 && v !== 33) v = digitSum(v); return v; };
  const byName = new Map<string, { day: number; month: number; year: number }>();
  for (const p of people) byName.set(normaliseHistoricalPersonName(normName(p.name)), p);
  for (const [k, b] of Object.entries(HISTORICAL_BIRTH_DATES)) byName.set(k, b);
  const cases = [...HISTORICAL_CASES_EXPANSION_200, ...HISTORICAL_CASES_EXPANSION_300_EXTRA, ...HISTORICAL_CASES_EXPANSION_300_MORE, ...HISTORICAL_CASES_EXPANSION_FINAL];
  const arith: string[] = [], ageBad: string[] = [], noDob: string[] = [];
  let ageYearConvention = 0;
  const scored: Array<{ dRaw: number; cRaw: number; outcome: string; pyR: number; pyBday: number; pol: string }> = [];
  for (const c of cases) {
    const b = byName.get(normaliseHistoricalPersonName(c.person));
    if (!b) { noDob.push(c.person); continue; }
    const dRaw = b.day + b.month + digitSum(c.year);
    const cRaw = digitSum(b.day) + digitSum(b.month) + single(c.year);
    if (dRaw !== c.direct || cRaw !== c.classic || master(dRaw) !== c.directReduced || master(cRaw) !== c.classicReduced)
      arith.push(`${c.id}: stored ${c.direct}/${c.classic}, birth date gives ${dRaw}/${cRaw}`);
    if (c.eventDate && /^\d{4}-\d{2}-\d{2}/.test(c.eventDate)) {
      const [ey, em, ed] = c.eventDate.slice(0, 10).split('-').map(Number);
      const age = ey - b.year - (em < b.month || (em === b.month && ed < b.day) ? 1 : 0);
      // Many cases store "age reached that calendar year" (event year − birth year); accept both.
      if (age !== c.age && c.age !== ey - b.year) ageBad.push(`${c.id}: stored age ${c.age}, actual ${age}`);
      else if (age !== c.age) ageYearConvention++;
    }
    // Alternative convention: the personal year runs birthday to birthday.
    let pyYear = c.year;
    if (c.eventDate && /^\d{4}-\d{2}-\d{2}/.test(c.eventDate)) { const [, em, ed] = c.eventDate.slice(0, 10).split('-').map(Number); if (em < b.month || (em === b.month && ed < b.day)) pyYear--; }
    scored.push({ dRaw, cRaw, outcome: c.outcome, pyR: master(dRaw), pyBday: single(b.day + b.month + digitSum(pyYear)), pol: getPersonalYearAnalysis(b.day, b.month, b.year, c.year).polarity });
  }
  const dualBad: string[] = [];
  console.log(`  history cases ${cases.length}: birth date found ${scored.length} · stored arithmetic wrong ${arith.length} · stored age wrong ${ageBad.length} (another ${ageYearConvention} use the 'age reached that year' convention)`);
  show('Stored Direct/Classic numbers that do not match the birth date', arith);
  show('Ages', ageBad, 6);
  show('Cases whose person has no birth date in either bank', [...new Set(noDob)]);

  // Polarity skill: engine polarity vs documented outcome.
  const expect = (o: string) => (o === 'triumph' || o === 'legacy') ? 'predominantly constructive' : o === 'loss' ? 'predominantly cautionary' : o === 'transition' ? 'threshold / transition' : 'mixed ordeal-and-reward';
  const hit = (rows: typeof scored, outs: string[]) => rows.reduce((a, r, i) => a + (r.pol === expect(outs[i]) ? 1 : 0), 0);
  const outs = scored.map(s => s.outcome);
  const observed = hit(scored, outs);
  let seed = 42; const rnd = () => ((seed = (seed * 1103515245 + 12345) & 0x7fffffff) / 0x7fffffff);
  const N = 2000; let geq = 0, sum = 0;
  for (let i = 0; i < N; i++) {
    const sh = [...outs]; for (let j = sh.length - 1; j > 0; j--) { const k = Math.floor(rnd() * (j + 1)); [sh[j], sh[k]] = [sh[k], sh[j]]; }
    const h = hit(scored, sh); sum += h; if (h >= observed) geq++;
  }
  const polCounts: Record<string, number> = {};
  for (const s of scored) { const p = s.pol; polCounts[p] = (polCounts[p] ?? 0) + 1; }
  const outCounts: Record<string, number> = {};
  for (const s of scored) outCounts[s.outcome] = (outCounts[s.outcome] ?? 0) + 1;
  console.log(`  pair-polarity hit rate: ${observed}/${scored.length} = ${(100 * observed / scored.length).toFixed(1)}% · shuffled-outcome baseline ${(100 * sum / N / scored.length).toFixed(1)}% · p = ${(geq / N).toFixed(3)}`);
  console.log(`  engine polarity mix: ${JSON.stringify(polCounts)}`);
  console.log(`  documented outcome mix: ${JSON.stringify(outCounts)}`);
  // Personal Year (reduced Direct) vs share of positive outcomes
  const byPY: Record<number, { n: number; pos: number }> = {};
  for (const s of scored) { const e = (byPY[s.pyR] ??= { n: 0, pos: 0 }); e.n++; if (s.outcome === 'triumph' || s.outcome === 'legacy') e.pos++; }
  console.log('  share of triumph/legacy outcomes by Personal Year: ' + Object.entries(byPY).sort((a, b) => +a[0] - +b[0]).map(([k, v]) => `${k}:${Math.round(100 * v.pos / v.n)}% (n=${v.n})`).join(' '));
  // Is there ANY signal? Positive (triumph/legacy) share by Personal Year vs a
  // shuffled baseline (chi-square statistic, permutation p-value), and a
  // leave-one-out "learn the majority outcome per Personal Year" model vs
  // always predicting the overall majority.
  const pos = scored.map(s => s.outcome === 'triumph' || s.outcome === 'legacy');
  const keys = scored.map(s => (s.pyR > 9 ? single(s.pyR) : s.pyR));
  const chi = (labels: boolean[]) => {
    const tot = labels.filter(Boolean).length / labels.length; const g: Record<number, [number, number]> = {};
    keys.forEach((k, i) => { const e = (g[k] ??= [0, 0]); e[0]++; if (labels[i]) e[1]++; });
    return Object.values(g).reduce((a, [n, p]) => a + ((p - n * tot) ** 2) / (n * tot) + (((n - p) - n * (1 - tot)) ** 2) / (n * (1 - tot)), 0);
  };
  const chiObs = chi(pos); let chiGeq = 0;
  const keysCal = [...keys]; keys.splice(0, keys.length, ...scored.map(s => s.pyBday));
  const chiB = chi(pos); let chiBGeq = 0;
  for (let i = 0; i < N; i++) { const sh = [...pos]; for (let j = sh.length - 1; j > 0; j--) { const k = Math.floor(rnd() * (j + 1)); [sh[j], sh[k]] = [sh[k], sh[j]]; } if (chi(sh) >= chiB) chiBGeq++; }
  keys.splice(0, keys.length, ...keysCal);
  for (let i = 0; i < N; i++) { const sh = [...pos]; for (let j = sh.length - 1; j > 0; j--) { const k = Math.floor(rnd() * (j + 1)); [sh[j], sh[k]] = [sh[k], sh[j]]; } if (chi(sh) >= chiObs) chiGeq++; }
  let looHit = 0; const majority = pos.filter(Boolean).length * 2 >= pos.length;
  keys.forEach((k, i) => { let n = 0, p = 0; keys.forEach((k2, j) => { if (j !== i && k2 === k) { n++; if (pos[j]) p++; } }); const pred = n ? p * 2 >= n : majority; if (pred === pos[i]) looHit++; });
  const majHit = pos.filter(x => x === majority).length;
  console.log(`  birthday-to-birthday Personal Year instead: chi² ${chiB.toFixed(1)}, permutation p = ${(chiBGeq / N).toFixed(3)}`);
  console.log(`  Personal Year vs positive outcome: chi² ${chiObs.toFixed(1)}, permutation p = ${(chiGeq / N).toFixed(3)} · leave-one-out per-year model ${(100 * looHit / pos.length).toFixed(1)}% vs always-majority ${(100 * majHit / pos.length).toFixed(1)}%`);
  report.history = { cases: cases.length, scored: scored.length, arith, ageBad, dualBad, noDob: [...new Set(noDob)], polarityHit: observed, baseline: sum / N, p: geq / N, chi: chiObs, chiP: chiGeq / N, chiBirthday: chiB, chiBirthdayP: chiBGeq / N, looHit, majHit, polCounts, outCounts, byPY };
}

console.log(`\n${strictFailures ? `✗ ${strictFailures} deterministic field group(s) disagree with the reference` : '✓ all deterministic fields agree with the reference'}`);
if (jsonOut) fs.writeFileSync(jsonOut, JSON.stringify(report, null, 1));
if (STRICT && strictFailures) process.exitCode = 1;
