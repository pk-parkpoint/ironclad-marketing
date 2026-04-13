# Ironclad Deployment

## CRITICAL: Canonical Repo

**This repo (`pk-parkpoint/ironclad-marketing`) is the ONLY source for ironcladtexas.com deployments.**

Do NOT deploy from `conduit/websites/ironclad/`. That is a stale copy. It does not have the guide pages, updated footer, or current content. Deploying from it will break the live site.

## Where the Site Lives

- **Production URL:** https://ironcladtexas.com
- **GCP Project:** `conduit-external-dev`
- **Cloud Run Service:** `ironclad-marketing` (region: `us-central1`)
- **Static IP:** `34.49.24.117` (named `ironclad-ip`)
- **Load Balancer:** `ironclad-url-map` → `ironclad-backend` → `ironclad-neg` → Cloud Run
- **DNS:** GoDaddy, `ironcladtexas.com` → `34.49.24.117`

## How to Deploy

```bash
cd /path/to/ironclad-marketing
npm run deploy:prod
```

This wrapper does four things the raw `gcloud run deploy` path does not:

- refuses local deploys from the wrong repo
- refuses local deploys from dirty or stale `main`
- preserves the current Cloud Run env instead of clobbering missing keys
- repairs the HTTP proxy mapping and invalidates CDN cache after deploy

Use the dry-run guardrail check first if you want to inspect the env key set without deploying:

```bash
npm run deploy:prod:dry-run
```

Do not use raw `gcloud run deploy --set-env-vars=...` for production. That path can silently wipe existing env vars and break the site.

For CI / automated deploys, use Cloud Build from this repo root:

```bash
gcloud builds submit --config=cloudbuild.yaml --project=conduit-external-dev .
```

## Post-Deploy Verification

```bash
# Health check
curl -sI https://ironcladtexas.com/api/health

# Guides live
curl -sI https://ironcladtexas.com/guides

# Production smoke test
npm run launch:prod:audit

# Require analytics bootstrap once GTM/GA4 is actually configured
npm run launch:prod:audit:strict
```

CDN cache is 5 minutes. Invalidate after deploy or wait.

## Local Dev

```bash
npm install
npm run dev
# http://localhost:3000
```

## Local Validation (Pre-Deploy)

```bash
npm run lint
npm run build
npx tsc --noEmit
```

## Search / SEO Validation

```bash
npm run metadata:audit
npm run sitemap-robots:audit
npm run search-visibility:audit
npm run structured-data:audit
npm run ssr:audit
AUDIT_BASE_URL=https://ironcladtexas.com npm run phase0:live:audit
```

## API Keys & Environment Variables

**NEVER hardcode API keys in source code.** Keys are managed via:

1. **Cloud Run env vars** — set on the service, injected at runtime
2. **`.env.production`** — local file (git-ignored), uploaded to Cloud Build via `.gcloudignore`
3. **`.env.example`** — committed template with placeholder values

### Google Maps API Key (booking wizard address autocomplete)

- **Key name:** `Ironclad Maps Key (rotated YYYY-MM-DD)`
- **GCP Console:** APIs & Services > Credentials > `conduit-external-dev`
- **Env var:** `NEXT_PUBLIC_GOOGLE_MAPS_KEY`
- **Restrictions:** HTTP referrer (`ironcladtexas.com/*`), API (Maps JS, Places, Geocoding)
- **To rotate:** Create new key in console, update `.env.production` + Cloud Run env var, delete old key

### Firebase Keys

- **Env vars:** `NEXT_PUBLIC_FIREBASE_API_KEY`, `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`, `NEXT_PUBLIC_FIREBASE_PROJECT_ID`, `NEXT_PUBLIC_FIREBASE_APP_ID`
- **GCP Console:** Firebase Console > Project Settings > `conduit-external-dev`

### How keys flow at deploy time

`NEXT_PUBLIC_*` vars are inlined by Next.js at build time. The guarded deploy script merges the current live Cloud Run env with optional `.env.production` overrides, then deploys with `--env-vars-file` so existing production keys are preserved.
When `.env.production` is missing, the deploy wrapper generates a temporary one from the live service config so the build still sees the correct public vars.

Analytics is wired in code but not forced in the default production audit until live GTM / GA4 IDs are configured. Once those IDs exist, use `npm run launch:prod:audit:strict`.

## DNS and Secrets

GoDaddy credentials in Google Secret Manager (never committed):

- Project `conduit-external-dev`: `godaddy-api-key`, `godaddy-api-secret`
- Project `conduit-external-prod`: `godaddy-api-key`, `godaddy-api-secret`

## Notes

- `vercel.json` is for header compatibility only — site is NOT on Vercel
- `cloudbuild.yaml` now runs install, lint, build, analytics audit, guarded deploy, and post-deploy smoke validation
- `app/api/health` is the post-deploy smoke endpoint
