# Ironclad Deployment Notes

This project is configured for Google Cloud-hosted preview and production deployments.

## Prerequisites

- Google Cloud project/deployment target connected to this repository
- `websites/ironclad` set as the project root
- Environment variables from `.env.example` configured in the deployment target for:
  - Preview
  - Production
- Sanity project created and dataset configured (`NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET`)

## Expected Pipeline

- Pull requests to `main`: preview deployment URL (if enabled in CI/CD).
- Merge to `main`: production deployment is triggered via Google Cloud-hosted pipeline.

## Local Validation

```bash
cd websites/ironclad
npm run lint
npm run build
```

## Production Smoke Validation (IC-081)

Run after DNS and production deployment changes:

```bash
cd websites/ironclad
npm run launch:prod:audit
```

Optional env overrides:
- `PROD_SITE_URL` (defaults to `https://ironcladtexas.com`)
- `PROD_EXPECTED_BRAND` (defaults to `Ironclad Plumbing`)
- `PROD_EXPECTED_MARKET` (defaults to `Austin`)

## Search Visibility Preflight (IC-080)

Run before Google Search Console / GBP submission:

```bash
cd websites/ironclad
npm run search-visibility:audit
```

## Deployment Execution

Use the team’s Google Cloud deployment pipeline/runbook for this site target.

## GoDaddy DNS Automation (Secret Names Only)

For automated DNS cutover of `ironcladtexas.com`, GoDaddy credentials are stored in Google Secret Manager (values are never committed):

- Project `conduit-external-dev`:
  - `godaddy-api-key`
  - `godaddy-api-secret`
- Project `conduit-external-prod`:
  - `godaddy-api-key`
  - `godaddy-api-secret`

Example retrieval pattern (operator runtime only):

```bash
gcloud secrets versions access latest --secret=godaddy-api-key --project=conduit-external-prod
gcloud secrets versions access latest --secret=godaddy-api-secret --project=conduit-external-prod
```

Do not print, commit, or share raw secret values in PRs/issues/docs.

## Notes

- Trailing slash behavior is locked in `next.config.ts` and host config (`vercel.json` retained for compatibility).
- `app/api/health` can be used as a post-deploy smoke check.
