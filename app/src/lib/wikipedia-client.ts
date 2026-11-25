/**
 * MYSTIQUE COMPASS — Resilient Wikipedia Biography Fetcher (client-side)
 *
 * WHY THIS EXISTS
 * ────────────────
 * The original flow only called our own `/api/biography` route. That route is
 * served by our api-server. The moment Mystique Compass is installed as a PWA
 * and used standalone — or whenever our hosting (Replit / a static host with
 * no backend / a sleeping free-tier server) is down, redeployed, or simply
 * unreachable — that same-origin call fails and the Wikipedia lookup breaks
 * entirely, even though the user's device has a perfectly good internet
 * connection and Wikipedia itself is reachable.
 *
 * Wikipedia's `action=query` API supports CORS directly (`origin=*`), so we
 * don't need a backend proxy at all — we can call it straight from the
 * browser. This module ports the exact same parsing logic used by
 * `artifacts/api-server/src/routes/biography.ts` so behaviour stays
 * identical, but it never depends on our own hosting being alive.
 *
 * See `handleWikiSearch()` in `profile-form.tsx` for the calling strategy:
 *   1) try our own `/api/biography` (fast path when the backend is up)
 *   2) on any failure/timeout/non-OK response, fall back to this module,
 *      which talks to Wikipedia directly from the client.
 */

export interface BiographyResult {
  found: boolean;
  title?: string;
  description?: string;
  birthYear?: number;
  /** null when Wikipedia gives only the year. Never defaulted to January. */
  birthMonth?: number | null;
  /** null when Wikipedia gives only the year or month. Never defaulted to the 1st. */
  birthDay?: number | null;
  gender?: 'male' | 'female';
  wikipediaUrl?: string;
  error?: string;
}

/** Days in a Gregorian month (month 1–12). */
function daysInMonth(year: number, month: number): number {
  return new Date(Date.UTC(year, month, 0)).getUTCDate();
}

/**
 * Keeps only plausible values: year 1..current year, month 1..12, day within
 * that month. Anything out of range becomes null rather than being guessed.
 */
export function sanitizeBirthDate(
  year: number | null | undefined,
  month: number | null | undefined,
  day: number | null | undefined,
): { year: number | null; month: number | null; day: number | null } {
  const thisYear = new Date().getUTCFullYear();
  const y = Number.isInteger(year) && (year as number) >= 1 && (year as number) <= thisYear ? (year as number) : null;
  const m = y !== null && Number.isInteger(month) && (month as number) >= 1 && (month as number) <= 12 ? (month as number) : null;
  const d =
    y !== null && m !== null && Number.isInteger(day) && (day as number) >= 1 && (day as number) <= daysInMonth(y, m)
      ? (day as number)
      : null;
  return { year: y, month: m, day: d };
}

/** True only when the result has a real, in-range year, month AND day. */
export function hasCompleteBirthDate(
  r: BiographyResult,
): r is BiographyResult & { found: true; birthYear: number; birthMonth: number; birthDay: number } {
  if (!r.found) return false;
  const { year, month, day } = sanitizeBirthDate(r.birthYear, r.birthMonth, r.birthDay);
  return year !== null && month !== null && day !== null;
}

const WIKI_API = 'https://en.wikipedia.org/w/api.php';
const USER_AGENT_HEADERS = {
  'Api-User-Agent': 'MystiqueCompass/1.0 (client-direct; https://github.com/mystique-compass)',
};

/** Fetch with a hard timeout so a stalled request never hangs the UI. */
async function fetchWithTimeout(url: string, timeoutMs: number): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    // Note: we intentionally do NOT send a custom `User-Agent` header — browsers
    // block that header on outgoing fetches. `origin=*` is what grants CORS.
    return await fetch(url, { signal: controller.signal, headers: USER_AGENT_HEADERS });
  } finally {
    clearTimeout(timer);
  }
}

const MONTHS = [
  'january', 'february', 'march', 'april', 'may', 'june',
  'july', 'august', 'september', 'october', 'november', 'december',
];

const BIRTH_DATE_TEMPLATES: RegExp[] = [
  /\{\{birth date(?: and age)?\s*\|(?:df=[^|]*\|)?(\d{4})\|(\d{1,2})\|(\d{1,2})/i,
  /\{\{birth date\s*\|(?:df=[^|]*\|)?(\d{4})\|(\d{1,2})\|(\d{1,2})/i,
  /\|\s*birth_date\s*=\s*\{\{birth date(?: and age)?\s*\|(?:df=[^|]*\|)?(\d{4})\|(\d{1,2})\|(\d{1,2})/i,
  /\|\s*birth_date\s*=\s*(\d{1,2})\s+(January|February|March|April|May|June|July|August|September|October|November|December)\s+(\d{4})/i,
  /\|\s*birth_date\s*=\s*(January|February|March|April|May|June|July|August|September|October|November|December)\s+(\d{1,2}),\s+(\d{4})/i,
  /birth_date\s*=.*?(\d{4})-(\d{1,2})-(\d{1,2})/,
  // Removed: a bare d|d|yyyy pattern can't tell day from month and produced wrong birthdays.
];

function parseBirthDate(content: string): { year: number | null; month: number | null; day: number | null } {
  let birthYear: number | null = null;
  let birthMonth: number | null = null;
  let birthDay: number | null = null;

  for (const regex of BIRTH_DATE_TEMPLATES) {
    const match = content.match(regex);
    if (match) {
      if (regex.source.includes('(January|')) {
        if (isNaN(parseInt(match[1], 10))) {
          birthMonth = MONTHS.indexOf(match[1].toLowerCase()) + 1;
          birthDay = parseInt(match[2], 10);
          birthYear = parseInt(match[3], 10);
        } else {
          birthDay = parseInt(match[1], 10);
          birthMonth = MONTHS.indexOf(match[2].toLowerCase()) + 1;
          birthYear = parseInt(match[3], 10);
        }
      } else if (match[1].length === 4) {
        birthYear = parseInt(match[1], 10);
        birthMonth = parseInt(match[2], 10);
        birthDay = parseInt(match[3], 10);
      } else {
        birthDay = parseInt(match[1], 10);
        birthMonth = parseInt(match[2], 10);
        birthYear = parseInt(match[3], 10);
      }
      break;
    }
  }

  if (!birthYear) {
    const yearMatch = content.match(/born.*?(\d{4})/i);
    if (yearMatch) {
      // Year only: don't invent 1 January as a birthday; leave day/month empty
      // so the form asks the user instead of generating a wrong chart.
      birthYear = parseInt(yearMatch[1], 10);
      birthMonth = null;
      birthDay = null;
    }
  }

  return { year: birthYear, month: birthMonth, day: birthDay };
}

/**
 * Fetches a person's birth data directly from Wikipedia's public API.
 * No dependency on our own backend/hosting — only needs the device to have
 * internet access and Wikipedia to be reachable.
 */
export async function fetchWikipediaBiographyDirect(
  name: string,
  timeoutMs = 8000,
): Promise<BiographyResult> {
  try {
    const searchUrl = `${WIKI_API}?action=query&list=search&srsearch=${encodeURIComponent(name)}&format=json&origin=*`;
    const searchResp = await fetchWithTimeout(searchUrl, timeoutMs);
    if (!searchResp.ok) {
      return { found: false, error: `Wikipedia search failed: ${searchResp.status}` };
    }
    const searchData = await searchResp.json();
    const results = searchData?.query?.search ?? [];
    if (!results.length) return { found: false };

    const pageId = results[0].pageid;
    const extractUrl = `${WIKI_API}?action=query&pageids=${pageId}&prop=revisions|categories&rvprop=content&rvslots=main&format=json&origin=*`;
    const extractResp = await fetchWithTimeout(extractUrl, timeoutMs);
    if (!extractResp.ok) {
      return { found: false, error: `Wikipedia extract failed: ${extractResp.status}` };
    }
    const extractData = await extractResp.json();
    const page = extractData?.query?.pages?.[pageId];
    if (!page) return { found: false };

    const title = page.title as string;
    const content = (page?.revisions?.[0]?.slots?.main?.['*'] as string) ?? '';

    const parsed = parseBirthDate(content);
    const { year: birthYear, month: birthMonth, day: birthDay } = sanitizeBirthDate(parsed.year, parsed.month, parsed.day);

    const genderFemale = /\b(she|her|hers|actress|queen|empress|princess|duchess|lady|mrs\.)\b/i.test(content);
    const gender: 'male' | 'female' = genderFemale ? 'female' : 'male';

    const descriptionMatch = content.match(/'''[^']+'''\s*\(([^)]{5,80})\)/);
    const description = descriptionMatch ? descriptionMatch[1] : '';

    if (!birthYear) {
      return { found: false, title };
    }

    return {
      found: true,
      title,
      description,
      birthYear,
      // Year-only pages return null month/day; the form asks the user to
      // fill them in instead of silently using 1 January.
      birthMonth,
      birthDay,
      gender,
      wikipediaUrl: `https://en.wikipedia.org/wiki/${encodeURIComponent(title.replace(/ /g, '_'))}`,
    };
  } catch (err) {
    const isAbort = err instanceof DOMException && err.name === 'AbortError';
    return {
      found: false,
      error: isAbort ? 'Wikipedia request timed out' : 'Could not reach Wikipedia',
    };
  }
}

/**
 * Tries our own `/api/biography` backend first (short timeout), then falls
 * back to a direct client-side Wikipedia call if that fails for ANY reason —
 * hosting down, backend asleep, offline-service-worker 503, network error,
 * timeout, or a non-OK HTTP response. Skips the backend attempt entirely if
 * the browser reports it has no connection at all, since that call would be
 * doomed anyway.
 */
export async function fetchBiographyResilient(name: string): Promise<BiographyResult> {
  const isOffline = typeof navigator !== 'undefined' && navigator.onLine === false;

  if (!isOffline) {
    try {
      const ownApiUrl = `/api/biography?name=${encodeURIComponent(name)}`;
      const res = await fetchWithTimeout(ownApiUrl, 4000);
      if (res.ok) {
        const data = await res.json();
        // Our backend explicitly reports offline/unreachable — fall through.
        if (!data?.error) return data as BiographyResult;
      }
    } catch {
      // Own hosting is unreachable — fall through to the direct client call.
    }
  }

  if (isOffline) {
    return { found: false, error: 'You appear to be offline. Reconnect and try again.' };
  }

  // Fallback: bypass our hosting entirely and talk to Wikipedia directly.
  return fetchWikipediaBiographyDirect(name);
}
