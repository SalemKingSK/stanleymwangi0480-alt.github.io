/**
 * Generates static, crawlable pages after `vite build`:
 *   /life-path/1..9/   /psychic-number/1..9/   /chinese-zodiac/<animal>/
 * plus a hub page for each and a fresh sitemap.xml. Each page links into the
 * app, so search traffic lands on real content and converts to readings.
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { DESTINY_NUMBER_MEANINGS } from '../src/lib/numerology/data/destinyNumberMeanings';
import { PSYCHIC_NUMBER_MEANINGS } from '../src/lib/numerology/data/psychicNumberMeanings';
import { zodiacData } from '../src/lib/zodiac';
import { CHINESE_CALENDAR } from '../src/lib/new-astrology/chinese-calendar';

const SITE = 'https://mystique-compass.pages.dev';
const OUT = path.resolve(import.meta.dirname, '..', 'dist');
const today = new Date().toISOString().slice(0, 10);
const urls: string[] = [`${SITE}/`];

const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const paragraphs = (text: string, max: number) =>
  String(text || '')
    .split(/\n+/)
    .map((p) => p.trim())
    .filter(Boolean)
    .slice(0, max)
    .map((p) => `<p>${esc(p)}</p>`)
    .join('\n');

const firstSentence = (text: string) => {
  const t = String(text || '').replace(/\s+/g, ' ').trim();
  const m = t.match(/^(.{40,200}?[.!?])\s/);
  return (m ? m[1] : t.slice(0, 155)).trim();
};

function page(opts: { urlPath: string; title: string; description: string; h1: string; body: string; breadcrumb: Array<[string, string]> }) {
  const url = `${SITE}${opts.urlPath}`;
  urls.push(url);
  const crumbs = opts.breadcrumb.map(([href, label]) => `<a href="${href}">${esc(label)}</a>`).join(' › ');
  const ld = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: opts.title,
    description: opts.description,
    url,
    author: { '@type': 'Person', name: 'Stanley Mwangi' },
    publisher: { '@type': 'Organization', name: 'Mystique Compass' },
  };
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>${esc(opts.title)}</title>
<meta name="description" content="${esc(opts.description)}" />
<link rel="canonical" href="${url}" />
<meta property="og:title" content="${esc(opts.title)}" />
<meta property="og:description" content="${esc(opts.description)}" />
<meta property="og:image" content="${SITE}/opengraph.jpg" />
<meta property="og:url" content="${url}" />
<meta name="twitter:card" content="summary_large_image" />
<meta name="theme-color" content="#04001a" />
<link rel="icon" type="image/svg+xml" href="/favicon.svg" />
<link rel="manifest" href="/manifest.json" />
<script type="application/ld+json">${JSON.stringify(ld)}</script>
<style>
  :root { color-scheme: dark; }
  * { box-sizing: border-box; }
  body { margin: 0; font-family: Inter, -apple-system, "Segoe UI", Roboto, sans-serif; background: radial-gradient(ellipse at top, #1e1638 0%, #04001a 60%); color: rgba(231,221,255,0.92); line-height: 1.65; font-size: 1.05rem; }
  main { max-width: 720px; margin: 0 auto; padding: 1.5rem 1.1rem 3rem; }
  nav.crumbs { font-size: 0.9rem; color: rgba(210,195,250,0.7); margin-bottom: 1rem; }
  a { color: #f1d98a; }
  h1 { font-family: Cinzel, Georgia, serif; color: #f1d98a; font-size: 1.9rem; line-height: 1.25; margin: 0.25rem 0 0.75rem; }
  h2 { font-family: Cinzel, Georgia, serif; color: #c4b5fd; font-size: 1.2rem; margin-top: 2rem; }
  .cta { display: block; text-align: center; margin: 2rem 0; padding: 0.95rem 1rem; border-radius: 14px; background: linear-gradient(135deg, #d4af37 0%, #a07820 100%); color: #04001a; font-weight: 700; text-decoration: none; font-family: Cinzel, Georgia, serif; letter-spacing: 0.04em; }
  ul.links { list-style: none; padding: 0; display: flex; flex-wrap: wrap; gap: 0.5rem; }
  ul.links a { display: inline-block; padding: 0.4rem 0.8rem; border: 1px solid rgba(212,175,55,0.4); border-radius: 999px; text-decoration: none; }
  footer { font-size: 0.85rem; color: rgba(210,195,250,0.6); margin-top: 2.5rem; }
</style>
</head>
<body>
<main>
<nav class="crumbs">${crumbs}</nav>
<h1>${esc(opts.h1)}</h1>
${opts.body}
<a class="cta" href="/">Get your free full reading</a>
<footer>Mystique Compass is a free numerology, psychomatrix and astrology profile generator. Readings are for entertainment and self-reflection.</footer>
</main>
</body>
</html>`;
  const dir = path.join(OUT, opts.urlPath);
  mkdirSync(dir, { recursive: true });
  writeFileSync(path.join(dir, 'index.html'), html);
}

const numberLinks = (base: string, current?: number) =>
  `<ul class="links">${[1, 2, 3, 4, 5, 6, 7, 8, 9]
    .map((n) => (n === current ? '' : `<li><a href="/${base}/${n}/">${n}</a></li>`))
    .join('')}</ul>`;

// Life path (destiny) numbers
for (let n = 1; n <= 9; n++) {
  const m = DESTINY_NUMBER_MEANINGS[n];
  page({
    urlPath: `/life-path/${n}/`,
    title: `Life Path Number ${n} Meaning: ${m.title} | Mystique Compass`,
    description: firstSentence(m.description),
    h1: `Life Path (Destiny) Number ${n}: ${m.title}`,
    breadcrumb: [['/', 'Mystique Compass'], ['/life-path/', 'Life Path Numbers']],
    body: `<p><strong>How it's calculated:</strong> add every digit of your full birth date and reduce to one digit. Born 8 September 1993? 8+9+1+9+9+3 = 39 → 3+9 = 12 → 1+2 = 3.</p>
${paragraphs(m.description, 4)}
<h2>Other life path numbers</h2>${numberLinks('life-path', n)}`,
  });
}
page({
  urlPath: '/life-path/',
  title: 'Life Path Numbers 1–9: Meanings and Calculator | Mystique Compass',
  description: 'What each life path (destiny) number from 1 to 9 means, how to calculate yours from your birth date, and a free full numerology reading.',
  h1: 'Life Path Numbers 1–9',
  breadcrumb: [['/', 'Mystique Compass']],
  body: `<p>Your life path, also called the destiny number, comes from the sum of every digit in your birth date. Pick a number to read its meaning.</p>
<ul class="links">${[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => `<li><a href="/life-path/${n}/">${n} · ${esc(DESTINY_NUMBER_MEANINGS[n].title)}</a></li>`).join('')}</ul>`,
});

// Psychic numbers
const psychicDays: Record<number, string> = { 1: '1, 10, 19, 28', 2: '2, 11, 20, 29', 3: '3, 12, 21, 30', 4: '4, 13, 22, 31', 5: '5, 14, 23', 6: '6, 15, 24', 7: '7, 16, 25', 8: '8, 17, 26', 9: '9, 18, 27' };
for (let n = 1; n <= 9; n++) {
  const m = PSYCHIC_NUMBER_MEANINGS[n];
  page({
    urlPath: `/psychic-number/${n}/`,
    title: `Psychic Number ${n} Meaning: ${m.title} | Mystique Compass`,
    description: `Born on the ${psychicDays[n]} of any month? ${firstSentence(m.description)}`.slice(0, 300),
    h1: `Psychic Number ${n}: ${m.title}`,
    breadcrumb: [['/', 'Mystique Compass'], ['/psychic-number/', 'Psychic Numbers']],
    body: `<p><strong>Your psychic number is ${n}</strong> if you were born on day ${psychicDays[n]} of any month.</p>
${paragraphs(m.description, 4)}
<h2>Other psychic numbers</h2>${numberLinks('psychic-number', n)}`,
  });
}
page({
  urlPath: '/psychic-number/',
  title: 'Psychic Numbers 1–9: Meanings by Birth Day | Mystique Compass',
  description: 'Your psychic number comes from the day of the month you were born. Read the meaning of psychic numbers 1 to 9.',
  h1: 'Psychic Numbers 1–9',
  breadcrumb: [['/', 'Mystique Compass']],
  body: `<p>Your psychic number is your birth day reduced to one digit. It describes how you see yourself.</p>
<ul class="links">${[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => `<li><a href="/psychic-number/${n}/">${n} · ${esc(PSYCHIC_NUMBER_MEANINGS[n].title)}</a></li>`).join('')}</ul>`,
});

// Chinese zodiac animals
const animals = Object.keys(zodiacData) as Array<keyof typeof zodiacData>;
for (const animal of animals) {
  const d: any = zodiacData[animal];
  const years = CHINESE_CALENDAR.filter((y) => y.title.endsWith(` ${animal}`) && y.year >= 1924 && y.year <= 2032);
  const yearRows = years
    .map((y) => `<li>${y.year}: ${esc(y.title)} (${y.start} to ${y.end})</li>`)
    .join('');
  const slug = String(animal).toLowerCase();
  page({
    urlPath: `/chinese-zodiac/${slug}/`,
    title: `Year of the ${animal}: Chinese Zodiac Personality & Years | Mystique Compass`,
    description: `${animal} years with exact Lunar New Year dates, plus the ${animal} personality. ${firstSentence(d.introduction)}`.slice(0, 300),
    h1: `Chinese Zodiac: The ${animal}`,
    breadcrumb: [['/', 'Mystique Compass'], ['/chinese-zodiac/', 'Chinese Zodiac']],
    body: `${paragraphs(d.introduction, 3)}
<h2>${animal} years</h2>
<p>The Chinese year starts at Lunar New Year, so January and February birthdays may belong to the previous animal.</p>
<ul>${yearRows}</ul>
<h2>Other animals</h2>
<ul class="links">${animals.filter((a) => a !== animal).map((a) => `<li><a href="/chinese-zodiac/${String(a).toLowerCase()}/">${a}</a></li>`).join('')}</ul>`,
  });
}
page({
  urlPath: '/chinese-zodiac/',
  title: 'Chinese Zodiac Animals and Years | Mystique Compass',
  description: 'All 12 Chinese zodiac animals with their exact years and Lunar New Year dates, and what each animal says about personality.',
  h1: 'The 12 Chinese Zodiac Animals',
  breadcrumb: [['/', 'Mystique Compass']],
  body: `<p>Find your animal by your birth date. The year changes at Lunar New Year, not 1 January.</p>
<ul class="links">${animals.map((a) => `<li><a href="/chinese-zodiac/${String(a).toLowerCase()}/">${a}</a></li>`).join('')}</ul>`,
});

writeFileSync(
  path.join(OUT, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url><loc>${u}</loc><lastmod>${today}</lastmod><priority>${u === `${SITE}/` ? '1.0' : '0.7'}</priority></url>`).join('\n')}
</urlset>
`,
);
console.log(`SEO pages: ${urls.length - 1} pages + sitemap.xml`);
