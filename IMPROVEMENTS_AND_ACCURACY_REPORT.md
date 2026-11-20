# Mystique Compass: Improvements and Accuracy Report

*Branch `arena/ee1b3de7-…`, from `main` @ `e36728ae` · 20 Nov 2026*

This report covers two things:

- **Part A** looks at how the app's code is organised and suggests ways to make it more capable and useful.
- **Part B** checks each calculated field against real people (historical and living). It records what was wrong and what was fixed.

Everything in Part B can be reproduced with one command:

```bash
cd source
npm run validate          # predictive guard + compat guard + celebrity accuracy (strict)
# or individually
TZ=UTC node scripts/run-ts.mjs scripts/validate-celebrity-accuracy.ts --verbose --json out.json
```

---

## Part B: Accuracy against real lives

### B1. Results before and after

These results come from `scripts/validate-celebrity-accuracy.ts`. It was run against 1,320 real people from `famous-birthdays.ts` and 429 dated life events from the personal-year history banks. The reference values come from independent sources: Wikidata P569 for birth dates, published astronomical tables for 1800–2100, and the Julian/Gregorian calendar rules.

| Field | Before | After |
|---|---|---|
| **Birth dates** vs Wikidata (1,178 checkable) | 1,115 exact. 9 errors were unexplained, plus about 40 known errors. | 1,116 exact. 0 unexplained. 41 corrections applied. 34 reviewed exceptions are documented. |
| **Chinese zodiac**: Jan/Feb days 1800–2099 | **6,181 / 17,773 wrong (34.8%)**. 22 celebrities had the wrong animal. The browser timezone changed the result. | **0 wrong**. The result is the same in UTC, New York, Los Angeles and Tokyo. |
| **Sexagenary year** (stem + branch) | 162 / 1,265 celebrities wrong (12.8%). Only 12 of 60 cycle years had a card, and 6 of those were on the wrong year. | **0 wrong**. All 60 cycle years are titled correctly. |
| **Kua number** (2,614 checks) | 254 wrong Kua numbers. 284 people got the wrong Rule-of-5 card. | **0 / 0** |
| **Western sun sign** (47,847 days, 1900–2030) | 8 days certainly wrong. | **0**. 3,272 cusp days (6.8%) still need a birth time. |
| **Birth weekday** | 30 / 1,320 wrong (all before 1582, or BCE) | **0** |
| **History banks**: arithmetic | 10 cases had a stored Direct/Classic value that did not match the birth date. | **0** |
| **Personal Year view** | **Crashed** for every pair that matched 23 of the 24 verified cases. | Fixed |

Examples of real people the app got wrong before these fixes:

- **Charles Darwin and Abraham Lincoln** (12 Feb 1809): the app said Earth Snake. The correct sign is Earth Dragon, because Lunar New Year 1809 fell on 14 Feb.
- **J.R.R. Tolkien, Virginia Woolf, Langston Hughes, Zora Neale Hurston, Rosa Parks, FDR**: all had the wrong animal for the same reason.
- **Raila Odinga** (7 Jan 1945): the app said Wood Rooster. The correct sign is Wood Monkey, because the stem-branch year used the Gregorian year.
- **Einstein, Newton**: wrong Kua. The cause was a fixed 4 Feb cutoff and a 1900s-only formula applied to every century.
- **Shakespeare, Galileo, Julius Caesar**: wrong weekday. `new Date()` uses the Gregorian calendar even for dates before 1582, and it treats years 0–99 as 1900–1999.

### B2. What was wrong, and how it was fixed

**1. Chinese calendar.** New module: `lib/astrology/chinese-calendar-math.ts`.

- It contains compact tables of the Lunar New Year and Lichun dates for 1800–2100. Both tables were checked against the reference data in `scripts/data/astro-reference-1800-2100.json`.
- `chineseZodiacYear()` uses the Lunar New Year boundary. The zodiac card and the sexagenary cards use it.
- `solarTermYear()` uses the Lichun boundary (about 4 Feb). Ba-Zi and Kua use it.
- All of these compare plain numbers instead of `Date` objects. The old code parsed `"YYYY-MM-DD"` as UTC, which moved the boundary by one day for visitors west of Greenwich.
- Year-only shortcuts like `(y-1900)%12` were replaced in these places:
  - `astrology.ts`
  - `sexagenary.ts`
  - `ba-zi-double-animal.ts`
  - `synthesis/index.ts`
  - `zodiac-section.tsx`
  - `cosmic-fate-map.tsx`
  - `engagement-tools.tsx`
- `new-astrology/chinese-calendar.ts` had 1924 and 1925 rows that overlapped by one day. They are fixed.

**2. Sexagenary cards.**

- The stem-branch year now changes at Lunar New Year, so January births get the right element and animal.
- The 12 hand-written cards sat on diagonal keys such as `'6_6'`. Some of those keys can never occur, and six were titled for the wrong year: for example, "Yang Fire Horse" was showing on Metal Horse years. All 12 are now on their real cycle years.

**3. Kua.** These functions are in `numerology.ts`: `calculateRawKua`, `calculateKua` and `getKuaLookupKey`.

- The year now changes at Lichun, not at 1 January or a fixed 4 Feb.
- One formula is used for every century:
  - Male: (11 − r) mod 9
  - Female: (4 + r) mod 9
  - Here r is the digital root of the solar year.
- The Rule of 5 now works: a male 5 becomes 2 and a female 5 becomes 8. A separate lookup key keeps the correct card.

**4. Weekday.** `historicalWeekday()` uses Julian Day arithmetic.

- Dates before 15 Oct 1582 use the Julian calendar.
- Years 0–99 and BCE years are handled correctly.

**5. Western sign.** New module: `lib/astrology/sun-sign.ts`.

- It computes the Sun's position with the low-precision Meeus formula, accurate to about 0.01°.
- When you pass `getWesternZodiacSign(day, month, year)`, the real Sun position overrides the fixed table only when the Sun stayed in one sign for the whole calendar day in every timezone. This fixed 21 Jun and 23 Oct in 1903–1915, which are really Gemini and Libra.
- On cusp days the app keeps the table answer. A new function, `getWesternCusp()`, returns the other possible sign.
- The solar model and the reference ingress table give different cusp results on 8 days, because those ingresses fall within minutes of a day boundary. The model never gives a wrong sign.

**6. Verified-case crash.** In `verified-dual-cases.ts`, 23 of the 24 hand-written cases were missing the `correlation` argument.

- Every field after it shifted one place. The outcome field held the list of URLs, and `sources` was `undefined`.
- When one of these cases matched a user's personal-year pair, `buildHistorySection` called `.join` on `undefined` and threw an error. That blanked the Personal Year view.
- `makeCase` now accepts both argument layouts, and the renderers guard against missing values.

**7. Woven synthesis.** This is the feature the v90 build claimed but the source did not contain. It is now implemented in `personal-year-synthesis.ts → buildWovenSynthesis`, and the regression guard passes again (it had 10 failures before).

- It gives a one-sentence thesis that combines the surface (Direct) and the depth (Classic) readings. When both numbers are the same, it explains that the same number appears at both levels.
- It shows up to three dated real-life precedents from a new 427-case index, `personal-year-precedents.ts`.
  - That index is generated by `scripts/build-precedent-index.ts`, which recalculates every number from the birth date.
  - It always tries to show **one triumph and one reversal**, and labels cases that match your exact pair.
- It lists famous people who have the identical pair every year. Organisations are excluded via `isEntity`.
- It combines both strategic moves into one "How to live it" instruction.
- It ends with an honesty clause (see B3).

The letter's wording was also toned down. "HISTORY PROVES IT" became "CLOSEST VERIFIED CASES", "Why this proves the lines" became "How the lines read against this event", and the claim "the same lines that made Trump 2024 literal" was removed.

### B3. Does the personal-year pair predict outcomes? (honest finding)

The app's own 427 dated celebrity events were scored against the polarity the engine assigns to each event's Direct × Classic pair.

| Test | Result |
|---|---|
| Engine polarity vs documented outcome | 66 / 427 = **15.5%**, vs 16.3% for a shuffled baseline · p = 0.76 |
| Positive share by Personal Year (χ², 12 groups) | χ² = 10.5, permutation **p = 0.23** |
| Same test, birthday-to-birthday Personal Year | χ² = 11.5, p = 0.18 |
| Leave-one-out "learn each year's majority outcome" | 68.6%, vs **68.6%** for always guessing the majority |

**Conclusion:** across these real lives, neither the personal-year number nor the engine's polarity label predicts triumph versus reversal better than chance.

That is why the woven synthesis presents precedents as *precedent, not probability*. It shows the library's own record for the pair, and warns when the sample is small. The share of positive outcomes by Personal Year is reported in every run (for example, PY7 80%, PY11 81%, PY22 88% with n=8). None of these differences is statistically significant. Treat them as descriptive only.

> Note: the documented outcomes are mostly triumphs and legacies (69%), because famous people are remembered for their wins. A fairer test would need random samples of non-famous people's years, which this data cannot provide.

### B4. Birth-date corrections (Wikidata P569)

All 41 corrections are listed in `scripts/data/dob-corrections.json`. The script `scripts/apply-dob-corrections.mjs` applies them and can be run safely more than once. Examples:

- Michael Jackson → 29 Aug
- Obasanjo → 5 Mar
- Langston Hughes → 1901
- Rosalía → 1992
- Alexandrov → 13 Apr 1883 (converted from the Old Style date)

The history ledger also had errors: Caitlin Clark, Sundar Pichai, and Ryan Murphy (whose date is now 9 Nov 1965).

**Applied despite low confidence (disclosed):**

- Beethoven: the baptism date is known; the birth date is not certain.
- Ferenc Puskás, Alberto Fujimori, Ben Saunders, Matthew Ashimolowo: sources disagree.

**Left as they are:** Woody Allen and Mohammed Shami (the app is right and Wikidata is wrong), Deepika, SBF and Arafat.

**Reviewed exceptions, documented in the harness:**

- Traditional dates: Shakespeare, Joan of Arc, Harriet Tubman, Adam Smith, Plato, Jesus.
- Uncertain years: Atahualpa, Tāwhiao, Ibrahim Ag Alhabib, Ezekiel Odero.
- Not in Wikidata: Kumuyi, Olukoya. Assimi Goïta is also not in the JSON (sources suggest 9 Nov).

**Still open in the data:**

- The calendar policy is inconsistent. Galileo, Leonardo and Elizabeth I are stored with Julian dates, while Cook uses a Gregorian date.
- Azali, Ouattara, King Salman and Ghazouani have 1 Jan or 31 Dec placeholder dates.
- 55 people are outside 1800–2100, so the app can only approximate their Chinese sign. 23 of them were born in Jan/Feb.

---

## Part A: Improvements to function flow and use cases

### A1. Fix first (low effort, high impact)

1. **Remove committed generated files.** About 34.5k files are committed under `source/node_modules`, plus `.wrangler/cache`. Run `git rm -r --cached source/node_modules .wrangler` and add both to `.gitignore`.
2. **Make type-checking real.** `tsconfig.json` points at `src/`, so `npm run typecheck` checks nothing. Point it at `mystique-src`. A scoped check of the files changed in this branch passes. The whole project still has two existing errors, in `compatibility-engine.ts` L878–879.
3. **Wire the validators into CI.** `npm run validate` runs all three guards. Add a GitHub Action that runs it, plus `vite build`, on every PR. With this in place, the gap between the v90 claim and the source would have been caught automatically.
4. **Remove build friction.** `vite.config.ts` throws an error without `PORT` and `BASE_PATH`. Give them defaults, and replace the pnpm `catalog:` references so `npm i && npm run build` works.
5. **Code-split the 5.7 MB main chunk** (1.8 MB gzipped).
   - Lazy-load each results tab with `React.lazy`, plus the text banks (`famous-birthdays`, compound dictionaries, Cosmic Fate book).
   - First paint on mobile data in Kenya would likely improve several times over.
6. **Remove dead code and duplicates:**
   - `mystique-package.json`
   - advisory-service vs usage-tracker
   - two PWA-install hooks
   - stub files: `profile-generator`, `firebase`, `FirebaseErrorListener`, `psychomatrix-intersection-engine`, `ai-service`
7. **Rewrite the README** so it describes the app, how to build it and how to validate it.

### A2. Function flow (making the engine compose instead of sprawl)

- **One calculation core.** Several features recalculate the same values in their own way. The zodiac animal alone was calculated five different ways before this branch. Create one pure `computeProfile(day, month, year, gender, time?)` that returns every number and sign once, with provenance. Every card, PDF, EPUB and comparison tool then reads from that object. This makes accuracy fixes automatic everywhere.
- **Optional birth time and place.** 6.8% of births fall on a Western cusp day, and Ba-Zi month and hour pillars need a time. Add an optional time field. Use `sunSignsOnDate()` and `getWesternCusp()` to show "Gemini/Cancer cusp — add birth time to resolve" instead of guessing.
- **A data layer separate from interpretation.** Celebrity data, history cases and text banks are hard-coded TypeScript, about 0.8 MB, and are bundled whether used or not. Move them to versioned JSON loaded on demand, with a schema, a source URL per record and a `reviewedOn` date. The precedent index in this branch shows the pattern: one generated, validated, compact file.
- **Name settings explicitly.** Several readings depend on a school or convention: Chaldean or Pythagorean, LNY or Lichun year, karmic debt from the raw sum or the reduced sum, whether Lo Shu includes compound digits, whether destiny keeps 11/22/33. Expose these as named settings with defaults, so readers who follow a particular author get matching numbers.
- **Event-sourced history.** Store each user's saved profiles and readings as events. Then "your year so far" and "what changed since last month" become easy to compute.

### A3. Use cases (from a one-off reading to repeated use)

| Use case | What it would take |
|---|---|
| **Personal journal / calibration** | Let users record what actually happened each month. Over time the app can show *their own* hit rate, which is more honest and more engaging than generic claims (see B3). |
| **Couples / teams / families** | `compatibility-engine` already scores pairs. Extend it to groups (1–N) with a team grid, for HR, wedding planners and family reunions. |
| **Date picker ("best day for…")** | Reverse the Personal Day and Personal Month calculations to rank upcoming dates for a launch, wedding or travel. Mark them clearly as traditional guidance. |
| **Shareable cards** | One-tap PNG or OG images of the woven thesis plus famous mirrors. This is free distribution. |
| **Creator / consultant mode** | White-label PDFs, client lists and session notes for paid numerologists. This is a natural paid tier. |
| **Localisation** | Swahili first, given the Kenyan audience, then French and Portuguese for the African heads-of-state content already in the database. |
| **Education** | A "show your working" toggle on every number. The harness already computes the steps, which builds trust and teaches the system. |

### A4. Data quality work still open

- All 684 Entity records are tagged `male`. Bands are stored as people.
- Duplicate records: Jomo Kenyatta, Oburu Odinga, Mojtaba Khamenei.
- Roles that are out of date as of Nov 2026: Gachagua → Kindiki (Kenya DP), Akufo-Addo → Mahama, Masisi → Boko, Mbumba → Nandi-Ndaitwah, Nyusi → Chapo, Chakwera → Mutharika. Add an `asOf` date per role.
- History cases: `eventCategory` is cut off at about 120 characters, `falsePositives` is the same boilerplate on every case, and BTS and Blackpink have no birth date because they are groups.
- Decans still use the fixed day/month table. On the 8 corrected days the decan card would name the old sign's decan.

---

## Files added or changed in this branch

**New:**

- `lib/astrology/chinese-calendar-math.ts`
- `lib/astrology/sun-sign.ts`
- `lib/numerology/personal-year-precedents.ts` (generated)
- `scripts/validate-celebrity-accuracy.ts`
- `scripts/run-ts.mjs`
- `scripts/build-precedent-index.ts`
- `scripts/apply-dob-corrections.mjs`
- `scripts/data/*.json`
- this report

**Changed engines:**

- `astrology.ts`
- `sexagenary.ts`
- `ba-zi-double-animal.ts`
- `birth-day-of-week.ts`
- `numerology.ts` (Kua)
- `personal-year-synthesis.ts`
- `verified-dual-cases.ts`
- `synthesis/index.ts`
- `compatibility-engine.ts`
- `new-astrology/chinese-calendar.ts`

**Changed UI:**

- `zodiac-section.tsx`
- `cosmic-fate-map.tsx`
- `engagement-tools.tsx`

**Data:**

- `famous-birthdays.ts`
- `personal-year-history-birthdates.ts`
- `personal-year-history-expanded-4.ts`

**Deploy:** the bundle was rebuilt to `assets/index-RPxeQZMu.js`, `index.html` was updated, the `sw.js` cache was bumped to `v91-accuracy`, and `.build-version` was updated.
