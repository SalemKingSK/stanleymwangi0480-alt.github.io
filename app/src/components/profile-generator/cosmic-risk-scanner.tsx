import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Zap, Loader2, ExternalLink, Telescope,
  Trash2, Globe, Database, RefreshCw, AlertTriangle,
  CloudLightning, CheckCircle2, XCircle, ChevronDown,
} from 'lucide-react';
import { Button }   from '@/components/ui/button';
import { Badge }    from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Card }     from '@/components/ui/card';
import { Input }    from '@/components/ui/input';
import { ANIMALS, RELATIONS } from '@/lib/cosmic-fate/constants';

// ─── Types ────────────────────────────────────────────────────────────────────
interface PersonRecord {
  wikidataId:  string;
  name:        string;
  birthDay:    number;
  birthMonth:  number;
  birthYear:   number;
  description: string;
  url:         string;
}
interface YearMeta {
  year:       number;
  status:     'pending' | 'ingesting' | 'partial' | 'complete';
  count:      number;
  cmcontinue: string | null;
  updatedAt:  number;
}
interface ScanResult extends PersonRecord {
  animal:       string;
  conflictType: string;
  config:       any;
  py:           number;
  pyPoints:     number;
  totalScore:   number;
  tier:         any;
}
type LogEntry    = { text: string; kind: 'info' | 'ok' | 'warn' | 'error' };
type ConflictTab = 'All' | 'Chong' | 'Xing' | 'Hai' | 'Po';

// ─── Helpers ──────────────────────────────────────────────────────────────────
function reduce(n: number) {
  let s = Math.abs(n);
  while (s > 9) s = String(s).split('').reduce((acc, d) => acc + +d, 0);
  return s || 9;
}
const DANGER_TIERS = [
  { min: 6, label: 'CRITICAL', color: '#ff2020', bg: 'rgba(255,32,32,0.16)',    border: 'rgba(255,32,32,0.55)'   },
  { min: 5, label: 'SEVERE',   color: '#e05020', bg: 'rgba(224,80,32,0.14)',    border: 'rgba(224,80,32,0.55)'   },
  { min: 4, label: 'HIGH',     color: '#e09428', bg: 'rgba(224,148,40,0.13)',   border: 'rgba(224,148,40,0.5)'   },
  { min: 3, label: 'ELEVATED', color: '#c8c020', bg: 'rgba(200,192,32,0.11)',   border: 'rgba(200,192,32,0.45)'  },
  { min: 2, label: 'NOTABLE',  color: '#9b8ec4', bg: 'rgba(155,142,196,0.11)', border: 'rgba(155,142,196,0.4)'  },
];
function getDangerTier(total: number) {
  return DANGER_TIERS.find(x => total >= x.min) || DANGER_TIERS[4];
}
const MONTHS_SHORT = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const PAGE_SIZE    = 50; // cards rendered per page — keeps DOM small

// ═══════════════════════════════════════════════════════════════════════════════
// INDEXEDDB — local storage, no cloud, no billing
// ═══════════════════════════════════════════════════════════════════════════════
const IDB_NAME     = 'mystique_vault_v1';
const IDB_VERSION  = 1;
const PEOPLE_STORE = 'people';
const META_STORE   = 'meta';

function openIDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(IDB_NAME, IDB_VERSION);
    req.onupgradeneeded = e => {
      const db = (e.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(PEOPLE_STORE))
        db.createObjectStore(PEOPLE_STORE, { keyPath: 'wikidataId' });
      if (!db.objectStoreNames.contains(META_STORE))
        db.createObjectStore(META_STORE, { keyPath: 'year' });
    };
    req.onsuccess = e => resolve((e.target as IDBOpenDBRequest).result);
    req.onerror   = e => reject((e.target as IDBOpenDBRequest).error);
  });
}
async function idbSavePeople(people: PersonRecord[]): Promise<string | null> {
  try {
    const db = await openIDB();
    await new Promise<void>((res, rej) => {
      const tx = db.transaction(PEOPLE_STORE, 'readwrite');
      const st = tx.objectStore(PEOPLE_STORE);
      people.forEach(p => st.put(p));
      tx.oncomplete = () => res();
      tx.onerror    = () => rej(tx.error);
    });
    return null;
  } catch (e) { return e instanceof Error ? e.message : String(e); }
}
async function idbGetAllPeople(): Promise<PersonRecord[]> {
  const db = await openIDB();
  return new Promise((res, rej) => {
    const tx  = db.transaction(PEOPLE_STORE, 'readonly');
    const req = tx.objectStore(PEOPLE_STORE).getAll();
    req.onsuccess = () => res(req.result as PersonRecord[]);
    req.onerror   = () => rej(req.error);
  });
}
async function idbSaveMeta(meta: YearMeta): Promise<void> {
  const db = await openIDB();
  return new Promise((res, rej) => {
    const tx = db.transaction(META_STORE, 'readwrite');
    tx.objectStore(META_STORE).put(meta);
    tx.oncomplete = () => res();
    tx.onerror    = () => rej(tx.error);
  });
}
async function idbGetAllMetas(): Promise<YearMeta[]> {
  const db = await openIDB();
  return new Promise((res, rej) => {
    const tx = db.transaction(META_STORE, 'readonly');
    const req = tx.objectStore(META_STORE).getAll();
    req.onsuccess = () => res(req.result as YearMeta[]);
    req.onerror   = () => rej(req.error);
  });
}
async function idbResetAll(years: number[]): Promise<void> {
  const db = await openIDB();
  await new Promise<void>((res, rej) => {
    const tx = db.transaction(META_STORE, 'readwrite');
    const st = tx.objectStore(META_STORE);
    years.forEach(y => st.put({ year: y, status: 'pending', count: 0, cmcontinue: null, updatedAt: Date.now() } as YearMeta));
    tx.oncomplete = () => res();
    tx.onerror    = () => rej(tx.error);
  });
  await new Promise<void>((res, rej) => {
    const tx = db.transaction(PEOPLE_STORE, 'readwrite');
    tx.objectStore(PEOPLE_STORE).clear();
    tx.oncomplete = () => res();
    tx.onerror    = () => rej(tx.error);
  });
}

// ═══════════════════════════════════════════════════════════════════════════════
// DATA FETCHING — unchanged from working version
// ═══════════════════════════════════════════════════════════════════════════════

async function fetchWikipediaPage(
  year: number,
  cmcontinue: string | null,
): Promise<{ titles: string[]; nextCursor: string | null; error: string | null; rateLimited: boolean }> {
  const params = new URLSearchParams({
    action: 'query', list: 'categorymembers',
    cmtitle: `Category:${year}_births`, cmtype: 'page', cmlimit: '500',
    format: 'json', origin: '*',
    ...(cmcontinue ? { cmcontinue } : {}),
  });
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const ctrl  = new AbortController();
      const timer = setTimeout(() => ctrl.abort(), 30_000);
      const r = await fetch(`https://en.wikipedia.org/w/api.php?${params}`, {
        signal: ctrl.signal, headers: { 'User-Agent': 'MystiqueCompass/1.0' },
      });
      clearTimeout(timer);
      if (r.status === 429) return { titles: [], nextCursor: null, error: 'Rate limited (429)', rateLimited: true };
      if (!r.ok)            return { titles: [], nextCursor: null, error: `Wikipedia HTTP ${r.status}`, rateLimited: false };
      const data = await r.json() as {
        query: { categorymembers: { title: string; ns: number }[] };
        continue: { cmcontinue?: string } | undefined;
      };
      const titles = (data?.query?.categorymembers ?? []).filter(m => m.ns === 0).map(m => m.title);
      return { titles, nextCursor: data?.continue?.cmcontinue ?? null, error: null, rateLimited: false };
    } catch (e: unknown) {
      const isAbort = e instanceof Error && e.name === 'AbortError';
      if (attempt === 2 || isAbort)
        return { titles: [], nextCursor: null, error: e instanceof Error ? e.message : String(e), rateLimited: false };
      await new Promise(res => setTimeout(res, 3_000 * (attempt + 1)));
    }
  }
  return { titles: [], nextCursor: null, error: 'Max retries exceeded', rateLimited: false };
}

async function fetchEntities(titles: string[]): Promise<Map<string, {
  wikidataId: string; day: number; month: number; year: number; description: string;
}>> {
  const result = new Map<string, { wikidataId: string; day: number; month: number; year: number; description: string }>();
  if (!titles.length) return result;
  const params = new URLSearchParams({
    action: 'wbgetentities', sites: 'enwiki', titles: titles.join('|'),
    props: 'claims|descriptions|sitelinks', languages: 'en', sitefilter: 'enwiki',
    format: 'json', origin: '*',
  });
  try {
    const ctrl  = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 30_000);
    const r = await fetch(`https://www.wikidata.org/w/api.php?${params}`, {
      signal: ctrl.signal, headers: { 'User-Agent': 'MystiqueCompass/1.0' },
    });
    clearTimeout(timer);
    if (!r.ok) return result;
    const data = await r.json() as {
      entities: Record<string, {
        id: string; missing?: string;
        descriptions: Record<string, { value: string }>;
        claims: Record<string, { mainsnak: { datavalue?: { value: { time?: string } } } }[]>;
        sitelinks: Record<string, { title: string }>;
      }>;
    };
    for (const entity of Object.values(data?.entities ?? {})) {
      if (entity.missing !== undefined) continue;
      const wikidataId = entity.id;
      const title      = entity.sitelinks?.enwiki?.title;
      if (!title || !wikidataId) continue;
      const dobClaims = entity.claims?.P569;
      if (!dobClaims?.length) continue;
      const timeStr = dobClaims[0]?.mainsnak?.datavalue?.value?.time ?? '';
      const m = timeStr.match(/^[+-]?(\d{1,4})-(\d{2})-(\d{2})/);
      if (!m) continue;
      const year = parseInt(m[1]); const month = parseInt(m[2]); const day = parseInt(m[3]);
      if (month < 1 || month > 12 || day < 1 || day > 31) continue;
      if (year < 1900 || year > 2010) continue;
      result.set(title, { wikidataId, day, month, year, description: entity.descriptions?.en?.value ?? '' });
    }
  } catch { /* silently skip */ }
  return result;
}

async function fetchYearPage(
  year: number, cmcontinue: string | null, onLog: (msg: string) => void,
): Promise<{ people: PersonRecord[]; nextCursor: string | null; error: string | null; rateLimited: boolean }> {
  onLog(`Wikipedia: fetching ${year} births page…`);
  const { titles, nextCursor, error: wikiErr, rateLimited } = await fetchWikipediaPage(year, cmcontinue);
  if (rateLimited) return { people: [], nextCursor: null, error: wikiErr, rateLimited: true };
  if (wikiErr)     return { people: [], nextCursor: null, error: wikiErr, rateLimited: false };
  if (!titles.length) return { people: [], nextCursor, error: null, rateLimited: false };
  onLog(`  Got ${titles.length} titles — resolving birth dates & descriptions…`);
  const BATCH = 40;
  const allEntities = new Map<string, { wikidataId: string; day: number; month: number; year: number; description: string }>();
  for (let i = 0; i < titles.length; i += BATCH) {
    const batch = await fetchEntities(titles.slice(i, i + BATCH));
    batch.forEach((v, k) => allEntities.set(k, v));
    if (i + BATCH < titles.length) await new Promise(res => setTimeout(res, 250));
  }
  const people: PersonRecord[] = [];
  for (const title of titles) {
    const e = allEntities.get(title);
    if (!e) continue;
    people.push({
      wikidataId: e.wikidataId, name: title,
      birthYear: e.year, birthMonth: e.month, birthDay: e.day,
      description: e.description,
      url: `https://en.wikipedia.org/wiki/${encodeURIComponent(title.replace(/ /g, '_'))}`,
    });
  }
  onLog(`  Resolved ${people.length} / ${titles.length} with birth dates`);
  return { people, nextCursor, error: null, rateLimited: false };
}

// ═══════════════════════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════
export function CosmicRiskScanner({ targetYear }: { targetYear: number }) {
  const [tab, setTab]                 = useState<'vault' | 'scanner'>('vault');
  const [yearMetas, setYearMetas]     = useState<Record<number, YearMeta>>({});
  const [ingesting, setIngesting]     = useState(false);
  const [ingestLog, setIngestLog]     = useState<LogEntry[]>([]);
  const [ingestDone, setIngestDone]   = useState(0);
  const [ingestTotal, setIngestTotal] = useState(0);
  const [ingestPhase, setIngestPhase] = useState('');
  const [countdown, setCountdown]     = useState(0);
  const [scanning, setScanning]       = useState(false);
  const [scanResults, setScanResults] = useState<ScanResult[]>([]);
  const [scanStats, setScanStats]     = useState({ checked: 0, flagged: 0, critical: 0 });
  const [expandedId, setExpandedId]   = useState<string | null>(null);
  const [dialog, setDialog]           = useState<{ message: string; onConfirm: () => void } | null>(null);

  // ── NEW: conflict tab + search debounce + pagination ──────────────────────
  const [conflictTab, setConflictTab] = useState<ConflictTab>('All');
  const [filterRaw, setFilterRaw]     = useState('');
  const [filterQuery, setFilterQuery] = useState('');   // debounced value
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const abortRef     = useRef(false);
  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const filterTimer  = useRef<ReturnType<typeof setTimeout> | null>(null);

  const addLog = useCallback((text: string, kind: LogEntry['kind'] = 'info') => {
    setIngestLog(l => [{ text, kind }, ...l.slice(0, 99)]);
  }, []);

  // Debounce filter — 350 ms after last keystroke
  const handleFilterChange = useCallback((val: string) => {
    setFilterRaw(val);
    if (filterTimer.current) clearTimeout(filterTimer.current);
    filterTimer.current = setTimeout(() => {
      setFilterQuery(val);
      setVisibleCount(PAGE_SIZE);
      setExpandedId(null);
    }, 350);
  }, []);

  // Reset pagination when tab or filter changes
  useEffect(() => { setVisibleCount(PAGE_SIZE); setExpandedId(null); }, [conflictTab, filterQuery]);

  // ── Zodiac config ──────────────────────────────────────────────────────────
  const targetSign = useMemo(() => {
    const idx = ((targetYear - 1900) % 12 + 12) % 12;
    return ANIMALS[idx] || ANIMALS[0];
  }, [targetYear]);

  const targetUY = useMemo(() => reduce(targetYear), [targetYear]);

  const CF_CONFIG = useMemo(() => {
    const rels = RELATIONS[targetSign.n] || RELATIONS.Rat;
    return {
      Chong: { label: 'Direct Clash',    score: 4, color: '#ff4444', bg: 'rgba(255,68,68,0.13)',    border: 'rgba(255,68,68,0.5)',    glyph: '☠', animal: rels.clash   },
      Xing:  { label: 'Self-Punishment', score: 3, color: '#e07828', bg: 'rgba(224,120,40,0.12)',   border: 'rgba(224,120,40,0.5)',   glyph: '⚔', animal: ['Horse','Dragon','Rooster','Pig'].includes(targetSign.n) ? targetSign.n : null },
      Hai:   { label: 'Harm',            score: 2, color: '#d4aa20', bg: 'rgba(212,170,32,0.11)',   border: 'rgba(212,170,32,0.45)',  glyph: '⚠', animal: rels.harm    },
      Po:    { label: 'Breaking',        score: 1, color: '#9b8ec4', bg: 'rgba(155,142,196,0.11)', border: 'rgba(155,142,196,0.4)',  glyph: '◎', animal: rels.destroy },
    };
  }, [targetSign]);

  const CONFLICT_YEARS = useMemo(() => {
    const list: { year: number; type: string; config: any }[] = [];
    Object.entries(CF_CONFIG).forEach(([type, config]) => {
      if (!config.animal) return;
      const idx = ANIMALS.findIndex((a: any) => a.n === config.animal);
      if (idx < 0) return;
      let y = 1900 + idx;
      while (y < 1930) y += 12;
      while (y <= 2010) {
        if (y < targetYear) list.push({ year: y, type, config });
        y += 12;
      }
    });
    return list.sort((a, b) => b.year - a.year);
  }, [targetYear, CF_CONFIG]);

  const uniqueYears = useMemo(() =>
    [...new Set(CONFLICT_YEARS.map(c => c.year))].sort((a, b) => b - a),
    [CONFLICT_YEARS],
  );

  const yearConflictMap = useMemo(() => {
    const m: Record<number, { type: string; config: any }> = {};
    CONFLICT_YEARS.forEach(c => { if (!m[c.year]) m[c.year] = c; });
    return m;
  }, [CONFLICT_YEARS]);

  const refreshMetas = useCallback(async () => {
    try {
      const all   = await idbGetAllMetas();
      const metas: Record<number, YearMeta> = {};
      all.forEach(m => { metas[m.year] = m; });
      setYearMetas(metas);
    } catch (e) { console.error('refreshMetas:', e); }
  }, []);

  useEffect(() => { void refreshMetas(); }, [targetYear, refreshMetas]);

  const vaultSummary = useMemo(() => {
    const complete    = uniqueYears.filter(y => yearMetas[y]?.status === 'complete').length;
    const partial     = uniqueYears.filter(y => yearMetas[y]?.status === 'partial').length;
    const pending     = uniqueYears.filter(y => !yearMetas[y] || yearMetas[y].status === 'pending').length;
    const totalPeople = Object.values(yearMetas).reduce((s, m) => s + (m.count || 0), 0);
    return { complete, partial, pending, totalPeople };
  }, [yearMetas, uniqueYears]);

  const ingestPct = ingestTotal > 0 ? Math.round((ingestDone / ingestTotal) * 100) : 0;

  // ── Countdown helper ───────────────────────────────────────────────────────
  function startCountdown(seconds: number): Promise<void> {
    return new Promise(resolve => {
      setCountdown(seconds);
      let remaining = seconds;
      countdownRef.current = setInterval(() => {
        remaining -= 1;
        setCountdown(remaining);
        if (remaining <= 0) {
          clearInterval(countdownRef.current!);
          setCountdown(0);
          resolve();
        }
      }, 1_000);
    });
  }

  // ── Ingest one year ────────────────────────────────────────────────────────
  async function ingestOneYear(year: number): Promise<'complete' | 'aborted'> {
    const existing = yearMetas[year];
    if (existing?.status === 'complete') { addLog(`${year}: complete — skipping`, 'ok'); return 'complete'; }
    let cursor     = existing?.cmcontinue ?? null;
    let localCount = existing?.count ?? 0;
    let page       = 1;
    addLog(`→ ${year} (${yearConflictMap[year]?.type ?? ''}) — ${cursor ? 'resuming' : 'starting'}`, 'info');

    while (true) {
      if (abortRef.current) return 'aborted';
      setIngestPhase(`${year} — page ${page}…`);

      const { people, nextCursor, error, rateLimited } = await fetchYearPage(
        year, cursor, msg => addLog(msg, 'info'),
      );

      if (rateLimited) {
        addLog(`⚠ Wikipedia rate limited — waiting 75 seconds then retrying…`, 'warn');
        setIngestPhase('Rate limited — resuming in 75 s…');
        await startCountdown(75);
        if (abortRef.current) return 'aborted';
        addLog(`↺ Retrying ${year} page ${page}…`, 'info');
        continue;
      }

      if (error) {
        addLog(`⚠ ${year} p${page}: ${error} — progress saved, moving on`, 'warn');
        await idbSaveMeta({ year, status: 'partial', count: localCount, cmcontinue: cursor, updatedAt: Date.now() });
        setYearMetas(p => ({ ...p, [year]: { year, status: 'partial', count: localCount, cmcontinue: cursor, updatedAt: Date.now() } }));
        break;
      }

      if (people.length > 0) {
        const err = await idbSavePeople(people);
        if (err) {
          addLog(`❌ IndexedDB write failed: ${err}`, 'error');
          setIngestPhase('IndexedDB write failed');
          setIngesting(false);
          await refreshMetas();
          return 'aborted';
        }
        localCount += people.length;
      }

      setIngestDone(d => d + 1);
      const isComplete = nextCursor === null;
      const meta: YearMeta = { year, status: isComplete ? 'complete' : 'partial', count: localCount, cmcontinue: nextCursor, updatedAt: Date.now() };
      await idbSaveMeta(meta);
      setYearMetas(p => ({ ...p, [year]: meta }));
      addLog(`✓ ${year} p${page}: ${people.length} saved (total ${localCount})`, people.length > 0 ? 'ok' : 'info');

      if (isComplete) { addLog(`✓ ${year} COMPLETE — ${localCount} people`, 'ok'); break; }
      cursor = nextCursor;
      page  += 1;
      if (!abortRef.current) await new Promise(res => setTimeout(res, 600));
    }
    return abortRef.current ? 'aborted' : 'complete';
  }

  // ── Start ingestion ────────────────────────────────────────────────────────
  async function startIngestion(years: number[]) {
    abortRef.current = false;
    setIngesting(true);
    setIngestLog([]);
    setScanResults([]);
    setIngestTotal(years.length * 25);
    setIngestDone(0);
    addLog(`Starting — ${years.length} year(s) — IndexedDB local storage`, 'info');

    addLog('Checking Wikipedia…', 'info');
    try {
      const r = await fetch('https://en.wikipedia.org/w/api.php?action=query&meta=siteinfo&format=json&origin=*', { headers: { 'User-Agent': 'MystiqueCompass/1.0' } });
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      addLog('✓ Wikipedia reachable', 'ok');
    } catch (e: unknown) {
      addLog(`❌ Wikipedia blocked: ${e instanceof Error ? e.message : String(e)}`, 'error');
      addLog('Open the live published URL — not the Studio preview pane.', 'warn');
      setIngestPhase('Wikipedia blocked — use the live published URL');
      setIngesting(false);
      return;
    }

    try { await openIDB(); addLog('✓ IndexedDB ready', 'ok'); }
    catch (e: unknown) {
      addLog(`❌ IndexedDB unavailable: ${e instanceof Error ? e.message : String(e)}`, 'error');
      setIngesting(false); return;
    }

    addLog('Running until vault complete — press Stop to pause anytime.', 'info');

    for (const year of years) {
      if (abortRef.current) break;
      await ingestOneYear(year);
      if (!abortRef.current) await new Promise(res => setTimeout(res, 1_000));
    }

    const freshMetas = await idbGetAllMetas();
    const allComplete = years.every(y => freshMetas.find(m => m.year === y)?.status === 'complete');
    const stopped = abortRef.current;
    setIngestPhase(stopped ? 'Stopped — press again to resume.' : allComplete ? '✓ Vault complete!' : 'Session ended — press again to continue.');
    addLog(stopped ? '⏹ Stopped' : allComplete ? '✓ All years complete!' : 'Session ended.', stopped ? 'warn' : allComplete ? 'ok' : 'warn');
    setIngesting(false);
    await refreshMetas();
  }

  function handleIngestAll() {
    const pending = uniqueYears.filter(y => { const s = yearMetas[y]?.status; return !s || s === 'pending' || s === 'partial'; });
    if (!pending.length) return;
    void startIngestion(pending);
  }

  // ── Clear vault ────────────────────────────────────────────────────────────
  function clearVault() {
    setDialog({
      message: `Reset all ${uniqueYears.length} conflict years and clear all locally stored people? This cannot be undone.`,
      onConfirm: async () => {
        setDialog(null);
        if (countdownRef.current) clearInterval(countdownRef.current);
        await idbResetAll(uniqueYears);
        await refreshMetas();
        setScanResults([]);
        setScanStats({ checked: 0, flagged: 0, critical: 0 });
        setIngestLog([]);
        setIngestPhase('');
        setCountdown(0);
        setFilterRaw('');
        setFilterQuery('');
        setConflictTab('All');
      },
    });
  }

  // ── Scanner ────────────────────────────────────────────────────────────────
  // ⚠ PY 7 now gets 2 pts (higher priority), PY 4 gets 1 pt
  async function runScan() {
    setScanning(true);
    setScanResults([]);
    setScanStats({ checked: 0, flagged: 0, critical: 0 });
    setVisibleCount(PAGE_SIZE);
    setFilterRaw('');
    setFilterQuery('');
    setConflictTab('All');
    setExpandedId(null);

    try {
      const people  = await idbGetAllPeople();
      const results: ScanResult[] = [];
      for (const p of people) {
        const conflict = yearConflictMap[p.birthYear];
        if (!conflict) continue;
        const py = reduce(p.birthDay + p.birthMonth + targetUY);
        if (py !== 4 && py !== 7) continue;

        const pyPoints   = py === 7 ? 2 : 1;
        const totalScore = conflict.config.score + pyPoints;

        results.push({
          ...p, animal: conflict.config.animal,
          conflictType: conflict.type, config: conflict.config,
          py, pyPoints, totalScore, tier: getDangerTier(totalScore),
        });
      }

      results.sort((a, b) => {
        if (b.totalScore !== a.totalScore)       return b.totalScore   - a.totalScore;
        if (b.config.score !== a.config.score)   return b.config.score - a.config.score;
        return b.birthYear - a.birthYear;
      });

      const critical = results.filter(r => r.totalScore >= 5).length;
      setScanResults(results);
      setScanStats({ checked: people.length, flagged: results.length, critical });
    } catch (e) { console.error('Scan error:', e); }
    setScanning(false);
  }

  const CONFLICT_TABS: { id: ConflictTab; glyph: string; label: string; sublabel: string; color: string }[] = [
    { id: 'All',  glyph: '✦', label: 'All',     sublabel: 'All types',        color: '#9b8ec4' },
    { id: 'Chong',glyph: '☠', label: 'Chong',   sublabel: 'Direct Clash',     color: '#ff4444' },
    { id: 'Xing', glyph: '⚔', label: 'Xing',    sublabel: 'Self-Punishment',  color: '#e07828' },
    { id: 'Hai',  glyph: '⚠', label: 'Hai',     sublabel: 'Harm',             color: '#d4aa20' },
    { id: 'Po',   glyph: '◎', label: 'Po',       sublabel: 'Breaking',         color: '#9b8ec4' },
  ];

  const filteredAll = useMemo(() => {
    let list = scanResults;
    if (conflictTab !== 'All') {
      list = list.filter(r => r.conflictType === conflictTab);
    }
    if (filterQuery.trim()) {
      const q = filterQuery.toLowerCase();
      list = list.filter(r =>
        r.name.toLowerCase().includes(q) || r.description.toLowerCase().includes(q),
      );
    }
    return list;
  }, [scanResults, conflictTab, filterQuery]);

  const tabCounts = useMemo(() => {
    const counts: Record<ConflictTab, number> = { All: scanResults.length, Chong: 0, Xing: 0, Hai: 0, Po: 0 };
    for (const r of scanResults) {
      const k = r.conflictType as ConflictTab;
      if (k in counts) counts[k]++;
    }
    return counts;
  }, [scanResults]);

  const visibleResults = useMemo(() => filteredAll.slice(0, visibleCount), [filteredAll, visibleCount]);
  const byTier = useMemo(() =>
    DANGER_TIERS.map(tier => ({ tier, items: visibleResults.filter(f => f.tier.label === tier.label) }))
      .filter(g => g.items.length > 0),
    [visibleResults],
  );
  const hasMore = visibleCount < filteredAll.length;

  function logIcon(kind: LogEntry['kind']) {
    if (kind === 'ok')    return <CheckCircle2 className="h-2.5 w-2.5 text-emerald-400 shrink-0 mt-0.5" />;
    if (kind === 'error') return <XCircle      className="h-2.5 w-2.5 text-rose-400    shrink-0 mt-0.5" />;
    if (kind === 'warn')  return <AlertTriangle className="h-2.5 w-2.5 text-amber-400  shrink-0 mt-0.5" />;
    return <span className="w-2.5 shrink-0" />;
  }
  function logColor(kind: LogEntry['kind']) {
    if (kind === 'ok')    return 'text-emerald-400';
    if (kind === 'error') return 'text-rose-400';
    if (kind === 'warn')  return 'text-amber-400';
    return 'text-slate-400';
  }

  return (
    <>
      {dialog && (
        <ConfirmDialog message={dialog.message} onConfirm={dialog.onConfirm} onCancel={() => setDialog(null)} />
      )}
      <div className="space-y-4">

        <Card className="glass-card p-6 border-primary/20 relative overflow-hidden">
          <div className="flex items-start justify-between gap-4 mb-5">
            <div>
              <h2 className="text-xl font-decorative text-primary flex items-center gap-3">
                <Telescope className="h-6 w-6" /> Cosmic Risk Scanner
              </h2>
              <p className="text-xs font-cinzel text-muted-foreground uppercase tracking-widest mt-1">
                {targetYear} · {targetSign.n} Year · {uniqueYears.length} conflict years · 1930–2010
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={clearVault} title="Clear vault"
                className="text-rose-400 hover:text-rose-300 p-1.5 rounded-lg hover:bg-rose-500/10 transition-colors">
                <Trash2 className="h-4 w-4" />
              </button>
              <Badge variant="outline" className="bg-primary/5 text-primary border-primary/30 font-cinzel text-[11px]">
                LOCAL VAULT
              </Badge>
            </div>
          </div>
          <div className="flex gap-1 bg-black/20 p-1 rounded-xl border border-white/10">
            {[{ id: 'vault', label: '🗄 Data Vault' }, { id: 'scanner', label: '🔭 Scanner' }].map(t => (
              <button key={t.id} onClick={() => setTab(t.id as 'vault' | 'scanner')}
                className={`flex-1 py-2.5 rounded-lg text-[11px] font-black uppercase tracking-widest font-cinzel transition-all ${
                  tab === t.id ? 'bg-primary text-primary-foreground' : 'text-slate-500 hover:text-slate-300'
                }`}>
                {t.label}
              </button>
            ))}
          </div>
        </Card>

        {tab === 'vault' && (
          <Card className="glass-card p-6 border-primary/20 space-y-6">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {([
                [vaultSummary.totalPeople.toLocaleString(), 'People Stored',  'text-primary'    ],
                [uniqueYears.length,                        'Conflict Years', 'text-orange-400' ],
                [vaultSummary.complete,                     'Complete',       'text-emerald-400'],
                [vaultSummary.pending + vaultSummary.partial, 'Remaining',   'text-slate-400'  ],
              ] as [string | number, string, string][]).map(([v, l, c]) => (
                <div key={l} className="text-center p-3 bg-white/5 rounded-xl border border-white/10">
                  <div className={`text-xl font-black font-decorative tabular-nums ${c}`}>{v}</div>
                  <div className="text-[11px] uppercase tracking-widest text-muted-foreground font-cinzel mt-0.5">{l}</div>
                </div>
              ))}
            </div>

            {ingesting && (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-primary/80 font-cinzel">
                  <span className="flex items-center gap-2">
                    <Loader2 className="h-3 w-3 animate-spin" />
                    {countdown > 0 ? `Rate limited — retrying in ${countdown}s…` : ingestPhase}
                  </span>
                  <button onClick={() => {
                    abortRef.current = true;
                    if (countdownRef.current) clearInterval(countdownRef.current);
                    setCountdown(0);
                  }} className="text-rose-400 text-[11px] uppercase font-cinzel hover:text-rose-300">Stop</button>
                </div>
                <Progress value={ingestPct} className="h-2 bg-white/5" />
                {countdown > 0 && (
                  <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-400/60 transition-all duration-1000"
                      style={{ width: `${(1 - countdown / 75) * 100}%` }} />
                  </div>
                )}
              </div>
            )}

            {!ingesting && ingestPhase && (
              <p className={`text-[11px] font-cinzel text-center ${
                ingestPhase.startsWith('✓') ? 'text-emerald-400' :
                ingestPhase.includes('blocked') || ingestPhase.includes('error') ? 'text-rose-400' :
                'text-primary/70'
              }`}>{ingestPhase}</p>
            )}

            {ingestLog.length > 0 && (
              <div className="bg-black/40 rounded-xl border border-white/5 p-3 max-h-52 overflow-y-auto space-y-1">
                <p className="text-[11px] font-cinzel text-slate-600 uppercase tracking-widest mb-2">Live Diagnostics</p>
                {ingestLog.map((entry, i) => (
                  <div key={i} className="flex items-start gap-1.5">
                    {logIcon(entry.kind)}
                    <p className={`text-[11px] font-cinzel leading-relaxed ${logColor(entry.kind)}`}>{entry.text}</p>
                  </div>
                ))}
              </div>
            )}

            <div className="flex gap-2">
              <Button
                onClick={ingesting ? () => {
                  abortRef.current = true;
                  if (countdownRef.current) clearInterval(countdownRef.current);
                  setCountdown(0);
                } : handleIngestAll}
                disabled={!ingesting && vaultSummary.pending === 0 && vaultSummary.partial === 0}
                className={`flex-1 font-black uppercase tracking-widest font-cinzel text-[11px] py-3 h-auto ${
                  ingesting ? 'bg-rose-500 hover:bg-rose-600 text-white' : 'bg-gradient-to-r from-primary/80 to-primary text-primary-foreground'
                }`}>
                <Database className="mr-2 h-4 w-4" />
                {ingesting ? 'Stop Ingest' :
                 vaultSummary.pending === 0 && vaultSummary.partial === 0 ? 'Vault Complete ✓' :
                 `Local Ingest (${vaultSummary.pending + vaultSummary.partial} left)`}
              </Button>
              <Button variant="outline" size="icon" onClick={() => void refreshMetas()}
                className="border-white/10 text-slate-400 h-auto px-3">
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>

            <div className="p-4 bg-primary/5 border border-primary/20 rounded-xl space-y-2">
              <p className="text-[11px] font-black uppercase tracking-wider font-cinzel text-primary/80 flex items-center gap-2">
                <CloudLightning className="h-3 w-3" /> How Ingestion Works
              </p>
              <p className="text-[11px] text-slate-400 font-body leading-relaxed">
                Reads <strong className="text-slate-200">Wikipedia Category API</strong> (500 names/page) then
                resolves birth dates and professions via <strong className="text-slate-200">Wikidata entity lookup</strong>. Stored in <strong className="text-slate-200">IndexedDB</strong>.
              </p>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
              {uniqueYears.map(year => {
                const meta   = yearMetas[year];
                const status = meta?.status || 'pending';
                const info   = yearConflictMap[year];
                const c      = info?.config;
                const style  = ({
                  complete:  { b: 'rgba(76,175,125,0.5)',   bg: 'rgba(76,175,125,0.08)',   dot: '#4caf7d' },
                  partial:   { b: 'rgba(224,148,40,0.5)',   bg: 'rgba(224,148,40,0.08)',   dot: '#e09428' },
                  ingesting: { b: 'rgba(155,142,196,0.5)',  bg: 'rgba(155,142,196,0.08)',  dot: '#9b8ec4' },
                  pending:   { b: 'rgba(255,255,255,0.07)', bg: 'rgba(255,255,255,0.01)',  dot: '#2a2a3a' },
                } as Record<string, { b: string; bg: string; dot: string }>)[status] ?? { b: 'rgba(255,255,255,0.07)', bg: 'rgba(255,255,255,0.01)', dot: '#2a2a3a' };
                return (
                  <div key={year} style={{ border: `1px solid ${style.b}`, background: style.bg }}
                    className="rounded-xl p-2.5 text-center relative overflow-hidden">
                    <div className="text-[12px] font-black text-slate-100 font-decorative">{year}</div>
                    {c && <div className="text-[10px] uppercase tracking-wide font-cinzel mt-0.5" style={{ color: c.color }}>{c.glyph} {info.type}</div>}
                    <div className="flex items-center justify-center gap-1 mt-1">
                      <div className="w-1.5 h-1.5 rounded-full" style={{ background: style.dot }} />
                      <span className="text-[10px] text-slate-500 font-cinzel uppercase">{status}</span>
                    </div>
                    {(meta?.count ?? 0) > 0 && (
                      <div className="text-[10px] text-slate-600 font-cinzel mt-0.5">{meta!.count.toLocaleString()}</div>
                    )}
                  </div>
                );
              })}
            </div>
          </Card>
        )}

        {tab === 'scanner' && (
          <>
            <Card className="glass-card p-6 border-primary/20">
              <div className="grid grid-cols-2 gap-3 mb-5">
                {([
                  [scanStats.checked.toLocaleString(), 'Total Checked', 'text-primary'   ],
                  [scanStats.flagged.toLocaleString(), 'Flagged Risks',  'text-orange-400'],
                ] as [string, string, string][]).map(([v, l, c]) => (
                  <div key={l} className="text-center p-3 bg-white/5 rounded-xl border border-white/10">
                    <div className={`text-2xl font-black font-decorative tabular-nums ${c}`}>{v}</div>
                    <div className="text-[11px] uppercase tracking-widest text-muted-foreground font-cinzel">{l}</div>
                  </div>
                ))}
              </div>

              {scanning ? (
                <div className="flex items-center gap-3 text-xs text-primary/80 font-cinzel py-2">
                  <Loader2 className="h-4 w-4 animate-spin" /> Reading from local vault…
                </div>
              ) : vaultSummary.totalPeople === 0 ? (
                <div className="text-center py-6 space-y-2">
                  <Database className="h-10 w-10 mx-auto opacity-20" />
                  <p className="text-[11px] text-slate-500 font-cinzel">
                    Vault is empty — go to 🗄 Data Vault and run Local Ingest first.
                  </p>
                </div>
              ) : (
                <button onClick={() => void runScan()}
                  className="w-full min-w-0 flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-rose-500 text-white font-black uppercase tracking-wider font-cinzel text-[11px] py-3 rounded-xl overflow-hidden">
                  <Zap className="h-4 w-4 shrink-0" />
                  <span className="truncate">Scan {vaultSummary.totalPeople.toLocaleString()} People</span>
                </button>
              )}
            </Card>

            {scanResults.length > 0 && (
              <div className="space-y-4">
                <div className="grid grid-cols-5 gap-1.5">
                  {CONFLICT_TABS.map(ct => {
                    const isActive = conflictTab === ct.id;
                    const count    = tabCounts[ct.id] ?? 0;
                    return (
                      <button
                        key={ct.id}
                        onClick={() => setConflictTab(ct.id)}
                        className="flex flex-col items-center gap-0.5 py-2.5 px-1 rounded-xl border transition-all"
                        style={{
                          background:   isActive ? `${ct.color}22` : 'rgba(255,255,255,0.03)',
                          borderColor:  isActive ? ct.color         : 'rgba(255,255,255,0.08)',
                          opacity:      count === 0 && ct.id !== 'All' ? 0.4 : 1,
                        }}
                      >
                        <span className="text-base leading-none">{ct.glyph}</span>
                        <span className="text-[11px] font-black font-cinzel uppercase leading-none"
                          style={{ color: isActive ? ct.color : '#6b7280' }}>
                          {ct.label}
                        </span>
                        <span className="text-[11px] font-cinzel leading-none"
                          style={{ color: isActive ? ct.color : '#4b5563' }}>
                          {count.toLocaleString()}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {conflictTab !== 'All' && (
                  <div className="px-1">
                    {(() => {
                      const ct = CONFLICT_TABS.find(t => t.id === conflictTab)!;
                      const cfg = CF_CONFIG[conflictTab as keyof typeof CF_CONFIG];
                      return (
                        <p className="text-[11px] font-cinzel leading-relaxed"
                          style={{ color: ct.color }}>
                          {ct.glyph} <strong>{ct.label}</strong> — {cfg?.label}
                          {': '}
                          {conflictTab === 'Chong' && 'Maximum opposition — the zodiac energies collide head-on, producing maximum turbulence in every domain.'}
                          {conflictTab === 'Xing'  && 'Self-Punishment — internal friction and identity challenges; the person works against themselves.'}
                          {conflictTab === 'Hai'   && 'Harm — subtle erosion; plans quietly unravel, relationships become quietly toxic.'}
                          {conflictTab === 'Po'    && 'Breaking — structures and foundations crack; what was built faces sudden disruption.'}
                        </p>
                      );
                    })()}
                  </div>
                )}

                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary/50" />
                  <Input
                    placeholder="Filter by name or profession…"
                    value={filterRaw}
                    onChange={e => handleFilterChange(e.target.value)}
                    className="pl-10 bg-black/40 border-primary/20 font-body placeholder:text-muted-foreground/50 h-12"
                  />
                </div>

                <div className="flex items-center justify-between px-1">
                  <p className="text-[11px] font-cinzel text-slate-500 uppercase tracking-widest">
                    Showing {Math.min(visibleCount, filteredAll.length).toLocaleString()} of {filteredAll.length.toLocaleString()}
                    {conflictTab !== 'All' ? ` ${conflictTab} results` : ' results'}
                  </p>
                  {filterQuery && (
                    <button onClick={() => handleFilterChange('')}
                      className="text-[11px] font-cinzel text-primary/60 uppercase hover:text-primary">
                      Clear filter
                    </button>
                  )}
                </div>

                {byTier.map(({ tier, items }) => (
                  <div key={tier.label} className="space-y-3">
                    <div className="flex items-center gap-3 px-1">
                      <span className="text-[11px] font-black uppercase tracking-[0.2em] font-cinzel" style={{ color: tier.color }}>
                        {tier.label}
                      </span>
                      <span className="text-[11px] text-slate-500 font-cinzel">· {items.length} shown</span>
                    </div>
                    <div className="space-y-2">
                      {items.map(person => (
                        <Card key={person.wikidataId}
                          className="glass-card p-0 border-transparent overflow-hidden"
                          style={{ borderLeft: `3px solid ${person.tier.color}` }}>
                          <button
                            className="w-full p-4 flex items-start justify-between text-left gap-3"
                            onClick={() => setExpandedId(expandedId === person.wikidataId ? null : person.wikidataId)}>
                            <div className="flex-1 min-w-0">
                              <h4 className="text-sm font-bold text-slate-100 font-body leading-snug truncate">
                                {person.name}
                              </h4>
                              {person.description && (
                                <p className="text-[11px] text-primary/70 font-cinzel uppercase leading-relaxed mt-0.5 truncate">
                                  {person.description}
                                </p>
                              )}
                              <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-500 font-cinzel flex-wrap">
                                <span>Born {person.birthYear}</span>
                                <span>·</span>
                                <span className={`font-bold ${person.py === 7 ? 'text-amber-400' : 'text-primary'}`}>
                                  PY {person.py}{person.py === 7 ? ' ★' : ''}
                                </span>
                                <span>·</span>
                                <span style={{ color: person.config.color }}>{person.conflictType}</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                              <Badge variant="outline"
                                className="h-6 text-[11px] uppercase border-white/10 font-cinzel"
                                style={{ color: person.config.color, backgroundColor: person.config.bg }}>
                                {person.config.label}
                              </Badge>
                              <div className="w-8 h-8 rounded bg-black/40 flex flex-col items-center justify-center border"
                                style={{ borderColor: person.tier.border }}>
                                <span className="text-xs font-black font-decorative" style={{ color: person.tier.color }}>
                                  {person.totalScore}
                                </span>
                              </div>
                            </div>
                          </button>

                          <AnimatePresence>
                            {expandedId === person.wikidataId && (
                              <motion.div
                                initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }}
                                className="overflow-hidden bg-black/20 border-t border-white/5">
                                <div className="p-4 space-y-3">
                                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-cinzel font-bold uppercase"
                                    style={{ background: person.config.bg, color: person.config.color, border: `1px solid ${person.config.border}` }}>
                                    {person.config.glyph} {person.config.label} · Score {person.totalScore}/6
                                  </div>
                                  <p className="text-[11px] text-slate-300 leading-relaxed font-body italic">
                                    <span className="text-primary font-bold not-italic mr-1 uppercase font-cinzel">
                                      Astrological Headwind:
                                    </span>
                                    {person.name}{person.description ? ` (${person.description})` : ''}, born{' '}
                                    {person.birthDay} {MONTHS_SHORT[person.birthMonth - 1]} {person.birthYear},
                                    faces a{' '}
                                    <span style={{ color: person.config.color }}>{person.config.label}</span>{' '}
                                    with the {targetYear} {targetSign.n} cycle. Combined with Personal Year{' '}
                                    {person.py} ({person.py === 7 ? 'Reflection / Inner Trials / Endings' : 'Structure / Restriction / Hard Labour'}),
                                    this produces a composite danger score of{' '}
                                    <span style={{ color: person.tier.color }}>{person.totalScore}/6 — {person.tier.label}</span>.
                                    {person.py === 7 && (
                                      <span className="text-amber-400/80"> PY 7 carries deeper inner dissolution — ranked above PY 4.</span>
                                    )}
                                  </p>
                                  <a href={person.url} target="_blank" rel="noopener noreferrer"
                                    className="flex items-center gap-2 text-[11px] text-primary/70 hover:text-primary transition-colors uppercase font-bold font-cinzel">
                                    <ExternalLink className="h-3 w-3" /> Read on Wikipedia
                                  </a>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </Card>
                      ))}
                    </div>
                  </div>
                ))}

                {hasMore && (
                  <button
                    onClick={() => setVisibleCount(v => v + PAGE_SIZE)}
                    className="w-full py-3 rounded-xl border border-primary/20 text-primary/70 font-cinzel text-[11px] uppercase tracking-widest hover:bg-primary/5 transition-colors flex items-center justify-center gap-2">
                    <ChevronDown className="h-4 w-4" />
                    Load {Math.min(PAGE_SIZE, filteredAll.length - visibleCount).toLocaleString()} more
                    <span className="text-slate-600">({(filteredAll.length - visibleCount).toLocaleString()} remaining)</span>
                  </button>
                )}

                {filteredAll.length === 0 && (
                  <div className="py-10 text-center space-y-2 opacity-50">
                    <Globe className="h-10 w-10 mx-auto stroke-[1]" />
                    <p className="font-cinzel text-xs uppercase tracking-widest text-slate-500">
                      {conflictTab !== 'All'
                        ? `No ${conflictTab} results${filterQuery ? ' matching that filter' : ''}`
                        : 'No results match that filter'}
                    </p>
                  </div>
                )}
              </div>
            )}

            {!scanning && scanResults.length === 0 && vaultSummary.totalPeople > 0 && (
              <div className="py-16 text-center opacity-30 space-y-3">
                <Globe className="h-14 w-14 mx-auto stroke-[1]" />
                <p className="font-cinzel text-xs uppercase tracking-[0.2em]">
                  Tap scan to analyse {vaultSummary.totalPeople.toLocaleString()} stored records
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}

// ─── Confirm Dialog ───────────────────────────────────────────────────────────
function ConfirmDialog({ message, onConfirm, onCancel }: {
  message: string; onConfirm: () => void; onCancel: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="mx-4 max-w-sm w-full bg-[#0d0a1a] border border-primary/30 rounded-2xl p-6 space-y-5 shadow-2xl">
        <div className="flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
          <p className="text-sm text-slate-200 font-body leading-relaxed">{message}</p>
        </div>
        <div className="flex gap-3 justify-end">
          <Button variant="ghost" size="sm" onClick={onCancel}
            className="text-slate-400 font-cinzel text-[11px] uppercase">Cancel</Button>
          <Button size="sm" onClick={onConfirm}
            className="bg-rose-500 hover:bg-rose-600 text-white font-cinzel text-[11px] uppercase">Confirm</Button>
        </div>
      </div>
    </div>
  );
}
