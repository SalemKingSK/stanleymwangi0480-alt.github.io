# Mystique Compass

Free numerology, psychomatrix and astrology profile generator (PWA).
Live: https://mystique-compass.pages.dev

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
Two live copies:

- **Cloudflare Pages** (https://mystique-compass.pages.dev):
  `.github/workflows/deploy-cloudflare.yml` runs typecheck, `npm run validate` and the build on every pull request.
  On every push to `main` it also deploys `dist/`.
  The deploy step needs two repository secrets: `CLOUDFLARE_API_TOKEN` (Pages: Edit) and `CLOUDFLARE_ACCOUNT_ID`.
  Without them the checks still run and the deploy is skipped.
- **GitHub Pages** (https://stanleymwangi0480-alt.github.io): served from the repository root on `main`.
  After `npm run build`, copy `app/dist/` over the repo root and commit it.
  Keep older hashed files in `assets/` so open tabs and cached service workers don't break.

Manual Cloudflare deploy: `npx wrangler pages deploy dist --project-name=mystique-compass --branch=main`

## Updates and offline
The service worker uses prompt-on-update. A new version installs in the background and waits.
The app then shows an "Update available" toast, and Reload switches to it (`src/lib/sw-update.ts`).
Fonts (Cinzel, Inter) are self-hosted through `@fontsource`, so no request goes to Google.

## Privacy
`/privacy/` (`public/privacy/`) describes what is stored and sent, and has an opt-out for the anonymous usage counts.

## Rollback
Cloudflare Pages keeps every deployment: Dashboard → Pages → mystique-compass →
Deployments → pick the previous one → "Rollback to this deployment".

## Layout
- `src/lib/` deterministic engines and interpretation data
- `src/components/profile-generator/` UI; `results-display` and the engines are lazy-loaded
- `scripts/build-seo-pages.ts` static /life-path, /psychic-number, /chinese-zodiac pages + sitemap
- `src/components/personal-year/` Precedent Ledger
- `public/` static files (_headers, manifest, icons, /stats dashboard, /privacy page)
