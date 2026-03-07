# Ironclad Website (Eng 1 Foundation)

Next.js App Router project scaffold for Ironclad Plumbing marketing site.

## Folder Structure

- `app/` routes and API handlers
- `components/` reusable UI building blocks
- `content/` typed route/content seed data
- `lib/` shared helpers and metadata utilities

## Quick Start

```bash
cd websites/ironclad
npm install
npm run dev
```

Run CMS studio:

```bash
cd websites/ironclad
npm run sanity:dev
```

Generate CMS seed payload:

```bash
cd websites/ironclad
npm run cms:seed
```

## Foundation Coverage

- IC-001: Next.js App Router + TypeScript strict + Tailwind setup
- IC-002: Design tokens mapped to CSS variables and Tailwind theme tokens
- IC-003: Sanity CMS schema package (8 models) + CompanyInfo singleton structure
- IC-004: Generated CMS seed payload for services, locations, FAQs, and company content
- IC-005: Static + dynamic route scaffold with 404 handling and trailing slash policy
- IC-006: Environment and deployment scaffolding for Google Cloud-hosted preview/prod
- IC-007: DM Sans + Playfair Display font loading with `display: swap`
- IC-008: `next/image` optimization defaults (AVIF/WebP + responsive sizing)

## Build Validation

```bash
npm run lint
npm run build
```

## Analytics Validation

```bash
npm run analytics:audit
```

## Search Visibility Validation

```bash
npm run search-visibility:audit
```

## Production Launch Validation

```bash
npm run launch:prod:audit
```

Optional overrides:
- `PROD_SITE_URL` (defaults to `https://ironcladtexas.com`)
- `PROD_EXPECTED_BRAND` (defaults to `Ironclad Plumbing`)
- `PROD_EXPECTED_MARKET` (defaults to `Austin`)

## Cross-Browser / Device QA

IC-075 / IC-076 smoke harness (Playwright):

```bash
npm run qa:cross-browser
npm run qa:cross-device
```

Run all browser + device projects:

```bash
npm run qa:cross-all
```
