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
gcloud run deploy ironclad-marketing \
  --source=. \
  --project=conduit-external-dev \
  --region=us-central1 \
  --port=3000 \
  --allow-unauthenticated \
  --set-env-vars="NEXT_PUBLIC_SITE_URL=https://ironcladtexas.com,NEXT_PUBLIC_PHONE=(833) 597-1932,NEXT_PUBLIC_TEXT_NUMBER=(833) 597-1932,NEXT_PUBLIC_CONTACT_EMAIL=info@ironcladtexas.com"
```

After deploy, invalidate CDN cache:

```bash
gcloud compute url-maps invalidate-cdn-cache ironclad-url-map \
  --path="/*" --global --quiet --project=conduit-external-dev
```

Or use Cloud Build (once permissions are fixed):

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

`NEXT_PUBLIC_*` vars are inlined by Next.js at **build time**, not runtime. The `.env.production` file is uploaded to Cloud Build (allowed by `.gcloudignore`) so the build has access. Cloud Run env vars serve as runtime backup.

## DNS and Secrets

GoDaddy credentials in Google Secret Manager (never committed):

- Project `conduit-external-dev`: `godaddy-api-key`, `godaddy-api-secret`
- Project `conduit-external-prod`: `godaddy-api-key`, `godaddy-api-secret`

## Notes

- `vercel.json` is for header compatibility only — site is NOT on Vercel
- `cloudbuild.yaml` defines the full deploy + CDN invalidation pipeline
- `app/api/health` is the post-deploy smoke endpoint
