# Mystique Compass

Free numerology, psychomatrix and astrology profile generator (PWA).
Live: https://stanleymwangi0480-alt.github.io

## Develop
```bash
npm ci --legacy-peer-deps
npm run dev        # local dev server
npm test           # engine unit tests (Vitest)
npm run typecheck  # tsc --noEmit
npm run validate   # tests + predictive, compatibility and DOB/accuracy validators
npm run build      # production build + static SEO pages into dist/
```

## Deploy
The live app is **GitHub Pages** (https://stanleymwangi0480-alt.github.io), served from the repository root on `main`.
After `npm run build`, copy `app/dist/` over the repo root and commit it.
Keep older hashed files in `assets/` so open tabs and cached service workers don't break.

`.github/workflows/checks.yml` runs typecheck, `npm run validate` and the build on every pull request and push to `main`.
(The former Cloudflare Pages copy has been discontinued. The anonymous usage counter is still a separate
Cloudflare Worker, `services/analytics-worker`.)

## Updates and offline
The service worker uses prompt-on-update. A new version installs in the background and waits.
The app then shows an "Update available" toast, and Reload switches to it (`src/lib/sw-update.ts`).
Fonts (Cinzel, Inter) are self-hosted through `@fontsource`, so no request goes to Google.

## Privacy
`/privacy/` (`public/privacy/`) describes what is stored and sent, and has an opt-out for the anonymous usage counts.

## Rollback
Revert the commit on `main` (the root build is versioned in Git); GitHub Pages republishes it.

## Layout
- `src/lib/` deterministic engines and interpretation data
- `src/components/profile-generator/` UI; `results-display` and the engines are lazy-loaded
- `scripts/build-seo-pages.ts` static /life-path, /psychic-number, /chinese-zodiac pages + sitemap
- `src/components/personal-year/` Precedent Ledger
- `public/` static files (_headers, manifest, icons, /stats dashboard, /privacy page)
