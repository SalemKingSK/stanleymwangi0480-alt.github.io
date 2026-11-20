# Mystique Compass

Free numerology, psychomatrix and astrology profile generator (PWA).
Live: https://mystique-compass.pages.dev

## Develop
```bash
npm install --legacy-peer-deps
npm run dev        # local dev server
npm test           # engine unit tests (Vitest)
npm run build      # production build + static SEO pages into dist/
```

## Deploy
Every push to `main` runs tests, builds, and deploys to Cloudflare Pages
(copy `ci/deploy.yml.example` to `.github/workflows/deploy.yml` at the repo root to enable). Add two repository secrets first:
`CLOUDFLARE_API_TOKEN` (Pages: Edit) and `CLOUDFLARE_ACCOUNT_ID`.

Manual deploy: `npx wrangler pages deploy dist --project-name=mystique-compass --branch=main`

## Rollback
Cloudflare Pages keeps every deployment: Dashboard → Pages → mystique-compass →
Deployments → pick the previous one → "Rollback to this deployment".

## Layout
- `src/lib/` deterministic engines and interpretation data
- `src/components/profile-generator/` UI; `results-display` and the engines are lazy-loaded
- `scripts/build-seo-pages.ts` static /life-path, /psychic-number, /chinese-zodiac pages + sitemap
- `public/` static files (_headers, manifest, icons, /stats dashboard)
