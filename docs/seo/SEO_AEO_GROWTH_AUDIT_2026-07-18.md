# Ironclad Plumbing SEO, AEO, Performance, and Brand Distribution Audit

Audit date: July 18, 2026

Canonical site: <https://ironcladtexas.com>

Canonical public phone: **(512) 506-2470**
Prepared from: a complete live sitemap crawl, production HTML inspection, DNS/redirect checks, structured-data and metadata audits, controlled Lighthouse tests, repository review, search-result sampling, and public-listing inspection.

## Executive conclusion

Ironclad does not have a content-volume problem. It has a trust-distribution and entity-consistency problem.

The site already has a technically strong base:

- 213 canonical sitemap URLs after this audit
- all 214 pre-audit sitemap page URLs returned HTTP 200
- server-rendered service and location content
- unique metadata checks, structured-data checks, internal-link checks, and production booking checks
- a broad service, city, neighborhood, FAQ, and guide footprint
- direct access for search and named AI crawlers
- strong lab SEO scores and healthy origin response time

The fastest growth will not come from publishing another 100 generic city pages. It will come from:

1. correcting the public entity record everywhere;
2. proving the review and license claims;
3. earning real local citations and links;
4. turning existing expert material into useful, source-backed video and local posts;
5. measuring indexed pages and queries in Search Console;
6. reducing media and third-party overhead without damaging lead tracking.

The most urgent external issue is the live Nextdoor profile. It still publishes the old **(833) 597-1932** phone number, the street address **6319 El Mirando Street**, and the superseded claim **“no service visit fees.”** Search engines are also retaining older Ironclad pages with prior phone numbers. Fixing these entity conflicts is more important than adding more directory listings.

## Scorecard

| Area | Current state | Assessment |
|---|---:|---|
| Crawlability and indexability | 213 canonical URLs, no sitemap-page 4xx/5xx | Strong |
| Metadata and canonicals | Automated audit passes; one redirect alias removed | Strong after patch |
| Internal linking | 247 route targets, no broken internal links | Strong, with six weakly connected utility pages |
| Server rendering | Home, service, and location content present in built HTML | Strong |
| Site speed | Good TTFB and lab scores; homepage carried a 1.42 MB eager video | Improved in patch |
| AEO readiness | Direct answers, Article/FAQ/Service/Breadcrumb schema, `llms.txt` | Good base; authorship and evidence need work |
| Structured-data policy | Self-controlled aggregate review markup was present | Corrected in patch |
| Local entity consistency | Old phones, policy copy, and address on third-party surfaces | Poor; highest priority |
| Review provenance | Site says 4.9/5 across 142 reviews; source reconciliation unavailable | Must verify |
| Content authority | Large useful library but little visible third-party authority | Needs distribution and citations |
| Backlink footprint | Only a few discoverable independent mentions in free search sampling | Weak/unknown |
| Measurement | GA/Ads wired; no usable Search Console or GBP API session in this environment | Incomplete |

## What was tested

### Live technical crawl

The pre-change sitemap index contained 214 page URLs across:

| Sitemap group | URLs |
|---|---:|
| Core | 23 |
| Guides and questions | 113 |
| Services | 39 |
| Service areas and neighborhoods | 36 |
| Articles | 3 |
| **Total page URLs** | **214** |

The sitemap index also references an image sitemap with eight entries.

Results:

- 214/214 page URLs returned HTTP 200.
- No broken sitemap destination was found.
- Average sampled completion time was about 435 ms and p95 about 572 ms.
- Sequential retests of concurrency outliers returned in roughly 0.24–0.45 seconds.
- HTTP redirects to HTTPS.
- `www` redirects to the apex domain.
- `robots.txt`, the sitemap index, `llms.txt`, and `llms-full.txt` return HTTP 200.
- Production booking API smoke testing returned HTTP 201.
- `robots.txt` explicitly allows major search and AI crawler tokens.

The crawl revealed:

- `/faq` was in the sitemap even though it permanently redirects to `/questions`.
- `/book` has no meaningful server-rendered main content or H1 because the wizard is client-rendered.
- Four guides exposed extra H1s from editorial boundary text.
- Two pairs of pages shared descriptions.
- Six utility pages had no discovered contextual inbound link in the sitemap crawl:
  - `/resources`
  - `/our-process`
  - `/why-choose-us`
  - `/warranties`
  - `/financing`
  - `/special-offers`
- Thirteen pages had fewer than 250 server-rendered words. Some are intentionally short legal or conversion pages, but the utility pages should be assessed for consolidation or enrichment.

### Performance

Live mobile Lighthouse baseline:

| Route | Performance | FCP | LCP | TBT | CLS | Transfer |
|---|---:|---:|---:|---:|---:|---:|
| Homepage | 96 | 1.30 s | 2.72 s | 56 ms | 0 | 2.46 MB |
| Toilet service page | 96 | 1.28 s | 2.63 s | 60 ms | 0 | 0.81 MB |

These are lab results, not Chrome UX Report field data. The PageSpeed API quota available to this environment returned HTTP 429, so field Core Web Vitals must be read from Search Console or PageSpeed Insights under an authenticated/quota-enabled account.

The dominant homepage request was `/media/hero-video.mp4` at about **1.42 MB**. It downloaded automatically on mobile before any user interaction.

A controlled local A/B test used the same production build environment and three mobile Lighthouse runs per version:

| Metric | Before | After | Change |
|---|---:|---:|---:|
| Median lab performance score | 89 | 89 | Stable |
| Median LCP | 3.77 s | 3.73 s | Essentially stable |
| Initial transfer weight | 2,223 KB | 804 KB | **-1,419 KB / -64%** |
| Eager MP4 requests | 1 | 0 | Removed |

The patch keeps the poster as the immediate visual and starts video only after an actual visitor interaction. It also respects reduced-motion and data-saver preferences.

Remaining performance work:

1. **Consolidate Google measurement.** Live traces showed both a GA/Google tag download and an Ads tag download, totaling roughly 300 KB of third-party script. Confirm that GTM owns all GA4 and Ads configuration, then load one container path. Do not remove conversion tags until phone, form, booking, and Ads attribution tests pass.
2. **Measure field data.** Record mobile LCP, INP, CLS, and conversion rate by template in Search Console/GA4 for 28 days.
3. **Reduce render-blocking CSS.** Lighthouse identified about 31 KB of render-blocking CSS with roughly 230–240 ms potential savings. Split booking/data-desk/page-template CSS away from routes that do not use it.
4. **Review below-fold image candidates.** The responsive setup is generally sound, but lab tests still found about 190 KB of theoretical image delivery savings on the homepage grid. Verify real device DPR behavior before changing `sizes`.
5. **Do not sacrifice lead measurement for a synthetic score.** The video was a clean removal from the critical path; tracking consolidation requires measurement QA.

## Technical SEO findings and actions

### Completed in this change

- Removed `/faq` from the canonical sitemap.
- Added a permanent redirect from `/service-area/austin` to `/service-area/austin-tx`.
- Changed the FAQ page’s internal “all questions” link to `/questions`.
- Fixed guide extraction so editorial boundaries such as `ARTICLE`, `PAGE`, `PART`, and `IMPLEMENTATION NOTES` cannot render inside an article.
- Removed the duplicated “before the plumber arrives” sentence from the “after the plumber leaves” guide.
- Added a guide-content regression audit for extra H1s, editorial leakage, and duplicate source-backed descriptions.
- Regenerated `llms.txt`, adding `/plumbing/toilet-replacement`.
- Replaced the redirecting `/faq` entry in `llms.txt` with canonical `/questions`.
- Updated the `llms` date to July 18, 2026.
- Removed self-controlled `Review`/`AggregateRating` markup from the Plumber entity.
- Added an IndexNow dry-run/execute CLI and submitted all 213 canonical URLs successfully.
- Updated active marketing runbooks from the stale 512-516 number to **512-506-2470**.

### Next technical priorities

#### P1 — Decide the indexing role of `/book`

`/book` is a client-side utility page with only about 12 server-rendered words.

Choose one:

- **Preferred:** add a real server-rendered booking introduction, H1, service-area statement, and no-JS contact fallback without duplicating the wizard’s runtime H1s.
- **Alternative:** mark the page `noindex,follow` and remove it from the sitemap while keeping all CTAs functional.

Do not leave a thin, indexable utility URL in an ambiguous state.

#### P1 — Give utility pages contextual internal links

Link the six weakly connected pages from relevant high-traffic contexts:

- financing from water-heater, sewer, repipe, and booking pages;
- warranties and guarantees from service detail pages;
- process from homepage and service hubs;
- resources from guides and questions;
- special offers only where an offer is current and terms are visible.

Footer-only links are weak substitutes for contextual links.

#### P1 — Keep sitemap `lastmod` truthful

Google ignores `priority` and `changefreq`, but may use `lastmod` when it is consistently accurate. Generate route-level `lastmod` from meaningful content changes, not a blanket release date.

#### P2 — Add a deployed security contact

`/.well-known/security.txt` returned 404. This is not an SEO ranking issue, but it is a low-cost trust and incident-response improvement.

#### P2 — Dependency remediation

`npm audit --omit=dev` reported 45 production-tree advisories: 2 low, 22 moderate, 19 high, and 2 critical. Several are transitive through Sanity tooling, while direct Next.js 15.5.10 has a non-major fix available at 15.5.20. Handle this as a separate tested dependency PR; do not run a blind force-upgrade.

## AEO and AI search review

### What is already good

- Important facts and answers are visible in HTML.
- Pages use descriptive headings and concise answer blocks.
- Service, Article, Breadcrumb, Organization, WebSite, FAQPage, HowTo, ImageObject, and Plumber data are present where relevant.
- The crawl found:
  - 94 FAQPage payloads
  - 40 HowTo payloads
  - 103 Article payloads
  - 181 BreadcrumbList payloads
  - 77 Service payloads
  - 80 Plumber payloads
- `robots.txt` permits major search and AI crawler tokens.
- `llms.txt` and `llms-full.txt` provide an optional machine-readable guide.
- The question and guide libraries target conversational, decision-stage queries.

### What to change

#### Establish real expert authorship

Question pages currently show **“By Auggie A.”** That does not demonstrate plumbing expertise.

Use:

- a real full author name and role;
- a real reviewer name;
- “Reviewed by [name], Responsible Master Plumber, RMP #39871” only after that person has actually reviewed the page;
- a reviewer profile page showing credentials, service experience, and editorial responsibility;
- `datePublished` and `dateModified` that reflect real review dates.

Do not invent a plumber name, biography, credential, or review event.

#### Add source citations where facts can change

The best AEO pages should cite:

- Austin Water for water hardness and restrictions;
- City of Austin permit/code sources;
- Texas licensing records;
- manufacturer manuals for maintenance intervals;
- insurance or emergency agencies for safety guidance.

Put the citation close to the claim and include a short “Sources and last verified” block.

#### Treat `llms.txt` as optional

It is useful for some agents and is now kept current, but it is not a Google ranking factor. Google says AI features use the same crawl/index/quality foundations as ordinary Search and require no special AI schema or AI text file.

#### Do not over-invest in FAQ/HowTo rich results

The content can still help users and answer engines, but Google limits FAQ rich results mainly to authoritative government and health sites and has deprecated HowTo rich results. Keep the markup accurate; do not use schema count as the AEO KPI.

#### Build an entity graph, not just schema volume

The Ironclad Plumbing name is shared by unrelated companies in Virginia, Georgia, Alabama, and Florida. Disambiguate the Austin entity through:

- consistent legal/business name;
- Austin/Greater Austin area;
- canonical phone and domain;
- verified license identifiers;
- real social/profile URLs in `sameAs`;
- a claimed Google Business Profile;
- a corrected Nextdoor page;
- Apple, Bing, Yelp, BBB, and official-license records that agree.

Production Organization schema currently has no resolved `sameAs` URLs. Configure those environment values only after each linked profile is corrected.

## Review and trust claims

The site visibly claims **4.9/5 and 142 reviews across Google, Yelp, and Nextdoor**. The repository contains 12 selected review records. The public Nextdoor page currently exposes five faves/reviews. This audit could not access a verified Google/Yelp source export or an authenticated Business Profile.

Required evidence work:

1. Export or record the source URL, reviewer, date, rating, and platform for every review included in the 142 total.
2. Recompute the aggregate from source data.
3. Ensure displayed excerpts are exact, permissioned, and linked to the platform where practical.
4. Remove neighborhood-specific wording unless the review itself or job record supports that location.
5. Update the number automatically from a reviewed source process, or publish a dated “as of” count.
6. Keep first-party review markup removed. Google says a business’s self-controlled LocalBusiness/Organization reviews are ineligible for the star review feature and says not to aggregate ratings from other sites.

This is not a finding that the reviews are false. It is a finding that the published aggregate could not be independently reconciled in this environment.

## Local SEO and entity consistency

### P0 — Claim and correct Nextdoor

Current public record:

- Name: Ironclad Plumbing
- Phone: **(833) 597-1932**
- Address: **6319 El Mirando Street, Austin, TX 78741**
- Copy: includes **“no service visit fees”**
- Address visibility: public

Target record:

- Name: Ironclad Plumbing
- Phone: **(512) 506-2470**
- Website: <https://ironcladtexas.com/>
- Booking URL: <https://ironcladtexas.com/book>
- Email: `info@ironcladtexas.com`
- Current service description and fee policy
- Hide the address if customers are not served at a staffed, signed storefront

Google explicitly uses plumbers as its example of a service-area business and says to remove the address when customers are not served there. Apply the same truthfulness principle to every directory.

### P0 — Purge stale phone numbers

Search results sampled during the audit retained:

- 833-597-1932
- 512-516-2470
- the current 512-506-2470

The live controlled pages use 512-506-2470, but old search snippets and public listings remain.

Process:

1. correct the source listing/page;
2. request recrawl in Search Console;
3. submit changed canonical URLs through IndexNow;
4. verify Google/Bing snippets after recrawl;
5. maintain a citation ledger with URL, login owner, last checked, and NAP status.

### P1 — Remove dangerous CMS seed placeholders

The non-live Sanity seed still contains:

- `hello@ironcladplumbing.com`
- `1234 Congress Ave, Austin, TX 78701`
- placeholder team names and license numbers

The generator source still contains the placeholder address. Do not import or regenerate this seed into a live dataset until the owner supplies verified business and team facts. Add a seed validation gate in a dedicated CMS cleanup ticket.

## Free submission and citation plan

The goal is consistency and trust, not raw directory count.

| Priority | Property | Cost | Action | Link |
|---|---|---:|---|---|
| 0 | Google Search Console | Free | Verify domain; submit `https://ironcladtexas.com/sitemap.xml`; inspect key URLs; monitor indexing/CWV | [Search Console](https://search.google.com/search-console/) |
| 0 | Google Business Profile | Free | Claim/verify; correct phone, service areas, hours, services, booking URL, photos, review replies; hide address if not a storefront | [Google Business Profile](https://business.google.com/us/business-profile/) |
| 0 | Nextdoor | Free profile/claim | Claim the existing Austin page; fix phone, address visibility, fee copy, URL, hours, and service areas | [Existing Ironclad page](https://nextdoor.com/pages/ironclad-plumbing/) |
| 0 | Bing Webmaster Tools | Free | Verify/import from GSC; submit sitemap; monitor crawl and keywords | [Bing Webmaster Tools](https://www.bing.com/webmasters/) |
| 0 | IndexNow | Free | Completed: 213 canonical URLs accepted with HTTP 200; keep the CLI for meaningful changes | [IndexNow](https://www.bing.com/indexnow/getstarted) |
| 1 | Bing Places | Free | Claim/import profile; match canonical NAP and service area | [Bing for Business](https://www.bing.com/forbusiness/) |
| 1 | Apple Business Connect | Free | Claim the place/service business; add logo, hours, phone, website, and service coverage | [Apple Business Connect](https://businessconnect.apple.com/) |
| 1 | Yelp | Free basic page | Claim; correct NAP; add services/photos; respond to real reviews; decline paid upsells unless measured | [Yelp for Business](https://business.yelp.com/) |
| 1 | BBB | Free listing request | Submit/claim the business record; accreditation is separate and paid | [BBB Get Listed](https://www.bbb.org/get-listed) |
| 1 | Facebook | Free | Create/claim the business page; canonical NAP, booking URL, Messenger expectations, and weekly proof posts | [Meta business pages](https://www.facebook.com/business/pages/manage) |
| 1 | YouTube | Free | Create a branded Austin channel; publish expert videos with transcripts and exact related-page links | [YouTube](https://www.youtube.com/) |
| 1 | Texas/Austin license records | Free official record | Verify business/license name, status, phone/website if supported; link the official lookup from the licenses page | Official issuing authority |
| 2 | Bidroom | Free claim advertised | Review and claim only if the displayed license record is truly Ironclad’s; correct any mismatch | [Current unclaimed page](https://bidroom.io/c/tx/austin/plumber/ironclad-plumbing--01965447) |

Do not bulk-submit to hundreds of low-quality directories. Avoid services that create duplicate profiles, sell the phone number as a lead, hide contact data behind their own funnel, or demand reciprocal links.

## Content seeding plan

### Core principle

Create one useful, evidence-backed asset and adapt it to each channel. Do not paste the same keyword paragraph everywhere.

### Weekly content engine

| Source asset | Site | Google Business Profile | Nextdoor | YouTube | Facebook/Instagram | Outreach |
|---|---|---|---|---|---|---|
| Real completed job | 500–900 word case study with photos, diagnosis, options, result | Before/after update | Neighborhood-safe lesson, no private address | 2–5 minute walkthrough + Short | Carousel/reel | Send to relevant realtor/property manager |
| Austin price explanation | Update price guide with date and assumptions | One price fact + link | “What changes this price?” post | 60–90 second explainer | Graphic/reel | Pitch as homeowner resource |
| Emergency answer | FAQ/guide with direct first steps | Seasonal reminder | Freeze/storm safety post | Short with transcript | Saveable checklist | HOA/neighborhood newsletter |
| Austin data finding | Data Desk methodology + downloadable chart | One local statistic | Local impact explanation | Data walkthrough | Chart carousel | Local reporter, insurer, inspector, researcher |
| Customer review | Source-linked review page, with consent | Reply and highlight through platform tools | Native review/recommendation | Optional testimonial with written consent | Quote graphic | None |

### First 12 topics

1. What an Austin plumbing diagnostic fee covers.
2. Water heater repair versus replacement using age plus evidence.
3. A real drain-clearing job: cable, camera, or hydro jet?
4. Five photos every homeowner should take before water mitigation begins.
5. How to verify a Texas plumber license.
6. Austin hard-water scale: what treatment can and cannot do.
7. Sewer camera footage: what proves replacement is necessary.
8. The first ten minutes after a burst pipe.
9. A transparent slab-leak option comparison.
10. The difference between an arrival window and an exact appointment.
11. How Ironclad writes a scope and warranty.
12. A monthly Austin plumbing cost-index update with methodology.

### Best link-earning targets

Offer genuinely useful resources to:

- local real-estate brokerages and individual agents;
- property managers and apartment/HOA managers;
- home inspectors;
- water-mitigation/restoration firms;
- insurance agents;
- Austin neighborhood associations;
- local homeowner newsletters and podcasts;
- builders/remodelers;
- water-quality professionals;
- local reporters covering housing, freezes, water use, or consumer costs.

Ask for the resource to be cited because it helps their audience. Do not buy followed links, exchange large-scale reciprocal links, or syndicate spun guest posts.

### Data Desk opportunity

The site has 25 Data Desk concepts, but planned/noindex previews are not authority assets yet. Publish fewer, stronger products:

1. state the data source and license;
2. publish methodology and update cadence;
3. provide downloadable CSV/chart assets;
4. name the analyst/reviewer;
5. show limitations;
6. give journalists an embeddable chart and canonical citation.

An original, maintained Austin plumbing cost or freeze-risk dataset has far more authority potential than another generic service-area paragraph.

## 30/60/90-day execution plan

### Days 0–7

- Deploy this technical patch.
- Claim and correct Nextdoor.
- Confirm the canonical phone, fee policy, address visibility, hours, and service areas with the owner.
- Verify/claim Google Business Profile.
- Verify GSC and submit the sitemap.
- Verify Bing Webmaster Tools and Bing Places.
- Reconcile the 142-review claim.
- Confirm the real responsible master plumber and content reviewer.
- Validate all conversion actions after the speed/measurement deployment.

### Days 8–30

- Claim Apple, Yelp, BBB, Facebook, and relevant official-license profiles.
- Configure verified social/profile URLs as Organization `sameAs`.
- Publish four real job case studies.
- Publish eight short expert videos with transcripts.
- Add contextual links to financing, process, warranties, resources, and offers.
- Resolve `/book` indexing.
- Start a citation ledger and monthly NAP check.
- Record GSC baseline: indexed pages, non-brand clicks, top queries, average positions, CWV.

### Days 31–60

- Launch one source-backed, downloadable Austin data asset.
- Conduct 30 personalized local outreach contacts.
- Add real expert-review blocks to the top 25 question/guide pages.
- Consolidate Google tags after conversion QA.
- Split unused CSS by route.
- Refresh the top ten commercial pages from GSC query data.

### Days 61–90

- Publish a second data asset or quarterly price-index update.
- Expand only the service/query combinations that show impressions or real demand.
- Audit citations and duplicate listings.
- Compare GBP calls, bookings, organic leads, branded queries, non-brand clicks, referring domains, and conversion rate against baseline.
- Delete or consolidate low-value pages that receive no impressions, links, engagement, or conversions after a reasonable test period.

## KPIs

Track outcomes, not schema count:

- valid indexed canonical URLs;
- non-brand organic clicks and qualified calls;
- impressions/clicks for service + Austin queries;
- Google Business Profile calls, website clicks, messages, and bookings;
- review count and response rate by verified source;
- NAP accuracy across the citation ledger;
- referring domains from real local/industry sites;
- video watch time and assisted site visits;
- mobile field LCP, INP, and CLS;
- booking/form/call conversion rate;
- percentage of top pages with named expert review and current sources.

## CLI work delivered

Available commands:

```bash
npm run metadata:audit
npm run structured-data:audit
npm run guide-content:audit
npm run sitemap-robots:audit
npm run search-visibility:audit
npm run internal-links:audit
npm run llms:generate
npm run llms:audit
npm run indexnow:plan
npm run indexnow:submit
npm run ssr:audit
npm run launch:prod:audit
```

Completed externally:

- `npm run indexnow:submit`
- result: **213 canonical URLs accepted, HTTP 200**

Not completed from CLI:

- Google Search Console account inspection/submission
- Google Business Profile inspection/editing
- authenticated PageSpeed field-data pull
- Yelp/Apple/BBB/Nextdoor claiming or profile edits

The machine has a named Google account, but `gcloud auth print-access-token` could not produce a usable token. Those account-level actions require a refreshed authenticated session and the correct property permissions. No credentials should be placed in the repository.

## Proof commands run

- production build: passed, 266 static pages generated;
- metadata audit: passed, 84 entries;
- structured-data audit: passed, 84 routes and 25 services;
- guide-content audit: passed, 34 source-backed guides;
- sitemap/robots audit: passed, 213 canonical URLs;
- search-visibility audit: passed;
- internal-link audit: passed, 247 pages and no broken targets;
- SSR audit: passed;
- `llms` audit: passed, 85 required routes;
- Data Desk audit: passed, 25 experiences;
- analytics audit: passed;
- Google Ads manifest validation: passed;
- live phase-zero audit: passed;
- live production launch audit: passed, including booking HTTP 201;
- IndexNow: accepted 213 URLs with HTTP 200.

## Primary references

- [Google: build and submit a sitemap](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap)
- [Google: AI features and your website](https://developers.google.com/search/docs/appearance/ai-features)
- [Google: structured-data policies](https://developers.google.com/search/docs/appearance/structured-data/sd-policies)
- [Google: review snippet guidelines](https://developers.google.com/search/docs/appearance/structured-data/review-snippet)
- [Google: FAQ and HowTo rich-result changes](https://developers.google.com/search/blog/2023/08/howto-faq-changes)
- [Google: service-area business guidance](https://support.google.com/business/answer/9157481)
- [IndexNow getting started](https://www.bing.com/indexnow/getstarted)
- [Apple Business Connect](https://businessconnect.apple.com/)
- [BBB Get Listed](https://www.bbb.org/get-listed)
