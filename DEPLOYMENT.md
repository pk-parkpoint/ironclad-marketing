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
  --set-env-vars="NEXT_PUBLIC_SITE_URL=https://ironcladtexas.com,NEXT_PUBLIC_PHONE=(512) 555-0199,NEXT_PUBLIC_TEXT_NUMBER=(512) 555-0199,NEXT_PUBLIC_CONTACT_EMAIL=info@ironcladtexas.com"
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

## DNS and Secrets

GoDaddy credentials in Google Secret Manager (never committed):

- Project `conduit-external-dev`: `godaddy-api-key`, `godaddy-api-secret`
- Project `conduit-external-prod`: `godaddy-api-key`, `godaddy-api-secret`

## Notes

- `cloudbuild.yaml` defines the full deploy + CDN invalidation pipeline
- `app/api/health` is the post-deploy smoke endpoint
