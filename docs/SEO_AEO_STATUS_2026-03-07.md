# IroncladTexas.com — SEO / AEO / Indexing Status

**Snapshot date: March 7, 2026**
**DNS cutover to GCP Load Balancer completed this session.**
**Reference epic: `conduit/docs/10-reference/ironclad/2026-03-06/Ironclad_Senior_Audit_Backlog.md`**

---

## Current Infrastructure

| Item | Status | Detail |
|------|--------|--------|
| Domain | ironcladtexas.com | GoDaddy registrar |
| Hosting | Cloud Run → GCP Load Balancer | Project: conduit-external-dev |
| Static IP | 34.49.24.117 | Assigned to ironclad-lb |
| CDN | Enabled | Cache mode: USE_ORIGIN_HEADERS, 5-min HTML cache |
| SSL (apex) | ACTIVE | Cert CN: ironcladtexas.com, expires 2027-03-07 |
| SSL (www) | PROVISIONING | Google managed cert `ironclad-ssl` — will auto-resolve |
| DNS A @ | 34.49.24.117 | Updated this session (was 216.239.x.x x4) |
| DNS A www | 34.49.24.117 | Updated this session (was CNAME ghs.googlehosted.com) |
| HTTP->HTTPS | 302 redirect | Working via ironclad-http-redirect URL map |
| www->apex | Pending SSL | Will work once `ironclad-ssl` cert provisions for www |

---

## Google Search Console (GSC)

| Item | Status |
|------|--------|
| Property verified | YES — domain property `ironcladtexas.com` |
| Sitemap submitted | YES — `sitemap.xml` |
| Pages indexed | **5** |
| Pages not indexed | **3** |
| Total web search clicks | 6 (as of March 7, 2026) |
| Manual actions | None observed |
| Recommendation | 1 unused verification token to clean up |

### IDX-001 status: DONE (GSC is set up and verified)

### IDX-007 — Manual index requests: NEEDED

The following pages should be manually submitted via URL Inspection > Request Indexing.
These are the 8 sitemap URLs — 5 are indexed, 3 are not. Check GSC Pages report
to identify which 3 are not indexed, then request indexing on those.

**All sitemap URLs (8 total):**
1. `https://ironcladtexas.com` (homepage)
2. `https://ironcladtexas.com/plumbing`
3. `https://ironcladtexas.com/service-area`
4. `https://ironcladtexas.com/reviews`
5. `https://ironcladtexas.com/about`
6. `https://ironcladtexas.com/our-process`
7. `https://ironcladtexas.com/why-choose-us`
8. `https://ironcladtexas.com/warranties`

---

## Bing Webmaster Tools

| Item | Status |
|------|--------|
| IDX-002 | NOT DONE — Bing WMT not set up |

**Action:** Go to https://www.bing.com/webmasters, add site, verify via DNS CNAME or XML, submit sitemap.

---

## Google Business Profile (GBP)

| Item | Status |
|------|--------|
| IDX-009 | UNKNOWN — needs verification |

**Action:** Go to https://business.google.com, verify "Ironclad Plumbing" is claimed. Set primary category "Plumber", secondary "Plumbing Service". Ensure website URL is `https://ironcladtexas.com`. Match service areas to site city pages.

---

## robots.txt

| Item | Status |
|------|--------|
| IDX-003 | DONE |
| Location | `https://ironcladtexas.com/robots.txt` |
| Content | `User-Agent: *`, `Allow: /`, `Disallow: /api/`, `Host: ironcladtexas.com`, `Sitemap: https://ironcladtexas.com/sitemap.xml` |

---

## sitemap.xml

| Item | Status |
|------|--------|
| IDX-004 | DONE |
| Location | `https://ironcladtexas.com/sitemap.xml` |
| URLs | 8 (all current production pages) |
| Format | Standard urlset with loc, lastmod, changefreq, priority |
| lastmod | 2026-02-18T22:25:53.919Z (all pages same date — should auto-update on publish) |

---

## Per-Page SEO Audit (What EXISTS)

### Homepage (`/`)

| Element | Status | Value |
|---------|--------|-------|
| `<title>` | YES | "Ironclad Plumbing \| Austin's Modern Plumbing Company" |
| `<meta description>` | YES | "Licensed Austin plumber with on-time arrival windows, upfront pricing, and a written workmanship warranty." |
| `<meta robots>` | YES | "index, follow" |
| `<meta googlebot>` | YES | "index, follow, max-video-preview:-1, max-image-preview:large, max-snippet:-1" |
| `<meta keywords>` | YES | "Austin plumber,plumbing services Austin,emergency plumber Austin,..." |
| `<link canonical>` | YES | "https://ironcladtexas.com" |
| og:title | YES | Matches title |
| og:description | YES | Matches meta description |
| og:image | YES | `/og/ironclad-default.png` (1200x630) |
| og:type | YES | "website" |
| og:url | YES | "https://ironcladtexas.com" |
| twitter:card | YES | "summary_large_image" |
| twitter:title | YES | Matches |
| twitter:description | YES | Matches |
| twitter:image | YES | Matches og:image |
| JSON-LD LocalBusiness | YES | Name, URL, image, logo, telephone, address (Austin, TX), areaServed (19 cities) |
| JSON-LD FAQPage | YES | Multiple Q&A pairs |
| Favicon | YES | Present |
| Apple-touch-icon | YES | Present |

### All Inner Pages (plumbing, service-area, reviews, about, our-process, why-choose-us, warranties)

| Element | Status |
|---------|--------|
| Unique `<title>` per page | YES — all 7 have distinct titles |
| Unique `<meta description>` per page | YES — all 7 have distinct descriptions |
| `<link canonical>` per page | YES — self-referencing on each |
| JSON-LD per page | YES — all have at least one schema |
| BreadcrumbList | YES — on inner pages |
| FAQPage schema | YES — on pages with FAQ content |

---

## What's MISSING — Prioritized

### P0: Immediate (blocks full indexing and ranking)

| ID | Item | Status | Action |
|----|------|--------|--------|
| IDX-007 | Manual index requests for 3 unindexed pages | NOT DONE | URL Inspection in GSC for each |
| IDX-002 | Bing Webmaster Tools | NOT DONE | Set up, verify, submit sitemap |
| IDX-008 | GA4 / GTM analytics | NOT DONE | No analytics tracking observed on site |
| IDX-009 | Google Business Profile | UNVERIFIED | Confirm claimed and optimized |

### P1: Structured Data Enrichment (AEO-critical)

| Item | Current | Needed |
|------|---------|--------|
| LocalBusiness `geo` | MISSING | Add `GeoCoordinates` (lat/lng for Austin) |
| LocalBusiness `openingHours` | MISSING | Add business hours |
| LocalBusiness `priceRange` | MISSING | Add price range indicator |
| LocalBusiness `aggregateRating` | MISSING | Add if real review data available |
| LocalBusiness `sameAs` | MISSING | Add GBP URL, social profile URLs |
| `Organization` schema | MISSING | Add to homepage |
| `WebSite` schema + `SearchAction` | MISSING | Enables sitelinks search box in Google |
| `Service` schema | MISSING | Add to `/plumbing` and each service subpage |
| `HowTo` schema | MISSING | Add to `/our-process` |
| `Speakable` schema | MISSING | Mark FAQ answers + quick-answer sections |

### P2: Meta/Head Gaps

| Item | Status | Fix |
|------|--------|-----|
| `og:locale` | MISSING | Add `en_US` |
| `og:site_name` | MISSING | Add `Ironclad Plumbing` |
| `<meta theme-color>` | MISSING | Add brand color |
| `manifest.json` | MISSING | Add web app manifest |

### P3: HTTP Headers / Security

| Header | Status | Needed |
|--------|--------|--------|
| `Strict-Transport-Security` | MISSING | Add HSTS |
| `X-Frame-Options` | MISSING | Add DENY or SAMEORIGIN |
| `X-Content-Type-Options` | MISSING | Add nosniff |
| `Referrer-Policy` | MISSING | Add strict-origin-when-cross-origin |
| `Permissions-Policy` | MISSING | Add restrictive policy |
| `X-Powered-By: Next.js` | LEAKING | Remove in next.config.ts |
| `Content-Security-Policy` | MISSING | Add CSP |

### P4: Content / Pages Not Yet Built

Per the Senior Audit Backlog epic, these pages are planned but do not exist yet:

- 10 new service subpages (slab-leak-repair, water-heater-repair, etc.)
- `/pricing`, `/financing`, `/offers`
- 4 Austin neighborhood pages (south/north/east/west)
- `/guides` resource hub
- 5+ articles (hard water, emergency guide, slab leak guide, etc.)
- 5 cost guide articles
- 14 remaining city pages (beyond initial 5)

---

## Validation Scripts Available

The repo includes validation scripts in `/scripts/`:

| Script | Purpose |
|--------|---------|
| `validate-metadata.ts` | Check meta tags across pages |
| `validate-sitemap-robots.ts` | Verify sitemap and robots.txt |
| `validate-structured-data.ts` | Validate JSON-LD schema |
| `validate-search-visibility.ts` | Search visibility preflight (IC-080) |
| `validate-production-launch.ts` | Production smoke test |
| `validate-phase0-live.ts` | Phase 0 live validation |
| `validate-ssr-rendering.ts` | SSR verification |
| `validate-internal-links.ts` | Internal link audit |
| `validate-analytics.ts` | Analytics validation |

---

## Next Steps (in order)

1. **GSC**: Go to Pages > Not Indexed report, identify the 3 pages, request indexing on each
2. **Bing WMT**: Set up property, verify, submit sitemap
3. **GBP**: Verify claimed and optimized with correct website URL
4. **GA4/GTM**: Set up analytics tracking (IDX-008)
5. **Schema enrichment**: Implement P1 structured data items in codebase
6. **Security headers**: Add via middleware.ts or next.config.ts
7. **Content buildout**: Begin Phase 2/3 from Senior Audit Backlog epic
