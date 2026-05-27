# IroncladTexas.com — SEO / AEO / Indexing Status

## Current AEO / LLM Search Update - May 26, 2026

This update supersedes the March 7 snapshot where statuses conflict. The March section remains below as historical launch context.

### Executive Read

Ironclad is no longer missing the core AEO foundation from the first review. The live site now has `llms.txt`, AI-aware `robots.txt`, a sitemap index, service pages, city pages, FAQ pages, guide pages, Article/Service/FAQ/Breadcrumb/LocalBusiness schema, security headers, and 84 guide routes including 50 cost-guide routes.

The next ranking opportunity is authority and extraction quality, not basic indexing plumbing. The site should become the most cited Greater Austin plumbing source for price, permit, emergency, hard-water, slab-leak, sewer, water-heater, and plumber-vetting questions by publishing sourced answer blocks, expert-reviewed guides, first-hand field evidence, and clean machine-readable route inventories.

Do not create hundreds of near-duplicate pages for every phrasing variation. Google's current guidance warns against overproducing query-variant pages to manipulate AI responses. The better pattern is one strong canonical page per consumer intent, with natural variants handled as subquestions, tables, FAQ blocks, comparison sections, and internal links.

### Sources Checked

- Google generative AI search guidance: https://developers.google.com/search/docs/fundamentals/ai-optimization-guide
- Google helpful content guidance: https://developers.google.com/search/docs/fundamentals/creating-helpful-content
- Google crawler and Google-Extended docs: https://developers.google.com/crawling/docs/crawlers-fetchers/google-common-crawlers
- OpenAI crawler docs: https://developers.openai.com/api/docs/bots
- Anthropic crawler docs: https://support.claude.com/en/articles/8896518-does-anthropic-crawl-data-from-the-web-and-how-can-site-owners-block-the-crawler
- `llms.txt` proposal/spec: https://llmstxt.org/
- Google structured data intro: https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data
- Google LocalBusiness structured data: https://developers.google.com/search/docs/appearance/structured-data/local-business
- Google FAQ structured data status: https://developers.google.com/search/docs/appearance/structured-data/faqpage
- Texas State Board of Plumbing Examiners: https://tsbpe.texas.gov/
- Austin Water quality reports: https://www.austintexas.gov/water/water-quality-reports
- Austin Development Services permit guide: https://www.austintexas.gov/development-services/do-i-need-permit
- Austin Development Services emergency permits: https://www.austintexas.gov/development-services/emergency-permits
- EPA WaterSense leak guidance: https://www.epa.gov/watersense/our_water/fix_a_leak.html
- ENERGY STAR water heater guidance: https://www.energystar.gov/products/heat_pump_water_heaters
- Texas Gas Service emergency guidance: https://www.texasgasservice.com/es-us/report-emergency

### Current Implementation Audit

| Area | Current State | AEO Implication |
|---|---|---|
| `llms.txt` | Live at `/llms.txt`; repo file updated on May 26 to stricter Markdown link format and broader route coverage. | Good assistive index for LLMs and agents. Not a confirmed ranking signal, and Google explicitly says not to treat it as a generative search hack. |
| `robots.txt` | Explicitly allows Googlebot, Bingbot, OAI-SearchBot, PerplexityBot, Claude-SearchBot, GPTBot, ClaudeBot, CCBot, ChatGPT-User, Claude-User, and Google-Extended. | Strong for ChatGPT Search and Claude Search, with explicit governance for user-triggered AI fetchers and Gemini training/grounding controls. |
| Sitemap | Sitemap index is live and generated from route registries. Local audit expects all static pages, 19 service pages, 19 service-area pages, 84 guide routes, and blog posts. | Strong discovery baseline. Next improvement is updating `lastmod` from content metadata rather than a fixed March timestamp. |
| Core service coverage | 19 service pages exist, including slab leak repair, water heater repair/install, sewer camera, trenchless, toilet, faucet/sink, disposal, and hydro jetting. | Service-intent coverage is now good. Each page needs stronger direct answers, citations, job examples, and service-specific FAQs. |
| Guide coverage | 84 guide routes exist, including 50 cost guides. | Excellent raw coverage. Main gap is source authority and freshness, not volume. |
| FAQ coverage | `/faq/plumbing` exists with FAQ schema and broad categories. | Useful for extraction, but answers are short and mostly uncited. Google FAQ rich results are being deprecated and are limited to government/health contexts, so FAQ schema should be treated as machine clarity, not a rich-result lever. |
| Schema | LocalBusiness/Plumber, Organization, WebSite, BreadcrumbList, Service, FAQPage, Article, AggregateRating helper, and HowTo helper exist. | Strong base. Add source/citation fields, named reviewer/person schema, and real license/profile references. Avoid fake or placeholder credentials. |
| Authority | Site claims licensed/insured, but repo still has placeholders `M-XXXXX`, `TX #XXXXX`, and `TBD` hours. Blog reviewer is generic "Licensed Master Plumber." | This is the biggest trust gap. Replace placeholders with real RMP/license, hours, named reviewers, author pages, and verification links. |
| Analytics | AI referrer detection exists for ChatGPT, Gemini, Perplexity, Claude, and Copilot. | Good start. Add server-log crawler reporting and conversion attribution for AI referral sessions. |
| Security headers | Live headers include HSTS, `nosniff`, `DENY`, permissions policy, and referrer policy. | March security-header gap is largely closed. |

### Best-Practice Positioning For ChatGPT, Claude, And Gemini

1. Build the site as if AI systems are doing retrieval over normal indexed HTML. Google says generative AI features are rooted in core Search systems, and that foundational SEO, crawlability, unique value, and helpful content remain the main levers.
2. Use `llms.txt` as a curated route guide, not as a magic ranking file. It should identify the best pages if an agent has limited crawl budget, but it does not replace HTML content, sitemap, schema, internal links, or third-party reputation.
3. Keep AI crawler access intentional. For ChatGPT Search, `OAI-SearchBot` matters more than `GPTBot`. For Claude Search, `Claude-SearchBot` matters more than `ClaudeBot`. For Gemini, keep Googlebot indexability strong and decide explicitly whether `Google-Extended` should be allowed for Gemini training and grounding use cases.
4. Make content easy to quote accurately. Put a 40-75 word direct answer near the top of each guide/service page, then follow with details, tables, local caveats, sources, and "when to call a licensed plumber" thresholds.
5. Show expertise with named accountability. Plumbing is local, licensed, and safety-sensitive. Pages should show who wrote/reviewed them, what license or role qualifies that person, when the page was last reviewed, and which official sources back factual claims.
6. Do not rely on FAQ rich results. FAQ markup can still help parsers understand the page, but Google has deprecated FAQ rich results from normal commercial sites. Use FAQ sections because they are useful, not because they create a search appearance.

## Recommended AEO Backlog

### P0 - Authority And Trust Fixes

| ID | Change | Detail |
|---|---|---|
| AEO-001 | Replace license placeholders | Replace `M-XXXXX`, `TX #XXXXX`, and generic license copy with the real Responsible Master Plumber name, license number, TSBPE lookup instructions, insurance statement, and business hours. Do not publish placeholders on trust or FAQ pages. |
| AEO-002 | Add named author/reviewer model | Create reusable author/reviewer data for guides and blogs. Show "Written by", "Reviewed by", credentials, profile link, date published, and date last reviewed. Add `Person` schema and Article `reviewedBy` where appropriate. |
| AEO-003 | Add source blocks to guide pages | Every safety, code, water-quality, energy, insurance, and licensing guide should end with "Sources and official references" linking to TSBPE, Austin Water, Austin Development Services, EPA WaterSense, ENERGY STAR/DOE, utility emergency pages, and relevant city portals. |
| AEO-004 | Add proof-of-work evidence | Add anonymized job examples, photos, inspection notes, camera screenshots, invoice/estimate examples, and "what we found in Austin homes" snippets. AI systems and humans both need first-hand evidence that cannot be generated generically. |
| AEO-005 | Strengthen `/licenses` | Make `/licenses` a canonical trust page with license lookup steps, insurance coverage summary, permit policy, technician credential standards, and links from every guide and service page footer. |

### P0 - Content Structure Fixes

| ID | Change | Detail |
|---|---|---|
| AEO-010 | Build a canonical top-questions hub | Add `/guides/top-plumbing-questions-austin-texas` or `/guides/top-plumbing-questions-austin`. Use one canonical hub for the top consumer questions, with subquestions and variants inside the page. Do not generate dozens of thin variant URLs. |
| AEO-011 | Add answer block standard | For every service and guide page: add a direct answer under the H1, an "At a glance" table, "When to call a plumber", "What it costs", "What can go wrong", "Sources", and related service/guide links. |
| AEO-012 | Expand `/faq/plumbing` answers | Convert short FAQ answers into 80-160 word sourced answers with local caveats, safety thresholds, and links to deeper guides. Keep concise visible summaries, but provide enough crawlable detail to be cited accurately. |
| AEO-013 | Add "Texas vs Austin" caveats | When a guide targets "Texas" terms, clarify that licensing is statewide, permits are local, and Ironclad serves Greater Austin. This prevents statewide service overclaiming while still answering Texas legal/licensing questions. |
| AEO-014 | Build comparison tables | Use side-by-side tables for repair vs replace, snake vs hydro jetting, tank vs tankless, spot repair vs reroute, camera inspection vs guesswork, licensed vs unlicensed, and permit vs no permit. |

### P0 - Technical And Infra

| ID | Change | Detail |
|---|---|---|
| AEO-020 | Generate `llms.txt` | Generate `public/llms.txt` from `SERVICES`, `GUIDE_ENTRIES`, `LOCATIONS`, and key static pages. Keep curated priority groups, but prevent drift as routes change. |
| AEO-021 | Add `llms-full.txt` | Add a generated `/llms-full.txt` with concise Markdown summaries of the top guides, FAQ answers, business trust facts, and source URLs. Keep it compact enough for agent context windows. |
| AEO-022 | Add `llms.txt` validator | Validate H1, blockquote, H2 sections, Markdown links, no broken URLs, canonical host, and route coverage for P0 pages. Run it in the production launch audit. |
| AEO-023 | Explicit AI crawler governance | Done in repo on May 26 for `ChatGPT-User`, `Claude-User`, and `Google-Extended`. Decide separately whether training bots (`GPTBot`, `ClaudeBot`, `CCBot`, `Google-Extended`) remain allowed as a business policy. |
| AEO-024 | Use real content `lastmod` | Replace fixed sitemap `CONTENT_LAST_MODIFIED` with route-level modified dates from guide, blog, service, and static-page content. This helps crawlers understand real updates. |
| AEO-025 | Add citation schema fields | For Article schema, add `citation`, `about`, `mentions`, and `reviewedBy` when data exists. Keep all schema claims visible on the page. |

### P1 - Measurement

| ID | Change | Detail |
|---|---|---|
| AEO-030 | AI crawler log report | Track hits from `OAI-SearchBot`, `GPTBot`, `ChatGPT-User`, `ClaudeBot`, `Claude-SearchBot`, `Claude-User`, `Googlebot`, `Google-Extended`, `PerplexityBot`, and `Bingbot`. Report page, status, bytes, cache status, and edge blocks. |
| AEO-031 | AI referral dashboard | Extend current AI referrer detection into GA4/GTM or server-side analytics. Segment conversions from ChatGPT, Claude, Gemini, Perplexity, and Copilot. |
| AEO-032 | Query prompt tracking | Maintain a monthly prompt set: "best plumber in Austin", "how much does drain cleaning cost in Austin", "do I need a permit for water heater replacement in Texas", etc. Record whether Ironclad is mentioned, cited, or absent. |
| AEO-033 | GSC/Bing refresh | Re-check GSC indexed URL count, submit the current sitemap index, set up/verify Bing Webmaster Tools if still missing, and inspect key guide URLs. |

## Top Consumer Plumbing Question Strategy

The user's "Top 10 Consumer Plumbing Questions" idea is directionally right. The implementation should be one high-authority hub plus deeper canonical guide pages, not a huge set of repetitive pages. The hub should answer each question directly, include common wording variants, cite official sources where applicable, and link to the deeper page for the full answer.

Recommended hub:

`/guides/top-plumbing-questions-austin-texas`

Recommended framing:

- Title: "Top Plumbing Questions Austin and Texas Homeowners Ask Before Hiring a Plumber"
- Scope note: "Licensing is Texas-wide; permits and service availability are local. Ironclad serves Greater Austin."
- Format for each question: direct answer, Austin/Texas caveat, what to do next, when it is urgent, cost range if relevant, source links, related Ironclad service, related guide.
- Variants should live as H3 questions under each canonical H2, not as separate pages unless the variant has enough unique intent to deserve its own guide.

### Top 10 Question Matrix

| # | Canonical Question | Variants To Cover On Page | Existing/Target Page | Source Candidates |
|---|---|---|---|---|
| 1 | What should I do first in a plumbing emergency? | burst pipe first step, sewer backup first step, water heater leaking, gas smell, no water | Existing `/guides/plumbing-emergency-first-10-minutes`; add more official-source citations | Austin DSD emergency permits, Austin Water emergency contact, Texas Gas Service, EPA WaterSense |
| 2 | How much should a plumber cost in Austin? | plumber cost Texas, drain cleaning cost, emergency plumber cost, water heater replacement cost | Existing `/guides/what-plumbing-costs-austin` plus 50 cost pages | Ironclad price index methodology, invoices, market quote samples |
| 3 | How do I verify a plumber's license in Texas? | TSBPE license lookup, responsible master plumber, unlicensed plumber risk | New `/guides/how-to-verify-plumber-license-texas` or expand `/licenses` | TSBPE |
| 4 | Do I need a permit for plumbing work in Austin or Texas? | water heater permit, gas line permit, sewer permit, homeowner permit, who pulls permit | Existing `/guides/austin-plumbing-codes-homeowners`; add source blocks | Austin DSD permit pages, city permit portals |
| 5 | How do I know if I have a slab leak? | warm floor, high water bill, foundation cracks, leak under slab, insurance | Existing `/guides/slab-leak-signs-austin` and `/guides/slab-leak-repair-options` | Austin Water bill guidance, insurance documentation disclaimers, field photos |
| 6 | Should I repair or replace my water heater? | no hot water, leaking water heater, 10-year-old heater, tank vs tankless | Existing `/guides/water-heater-repair-vs-replace` and `/guides/tank-vs-tankless` | ENERGY STAR, DOE, Austin permit docs, manufacturer warranty docs |
| 7 | Why does my drain keep clogging? | recurring clog, roots, grease, old pipe, sewer smell, snake did not work | Expand service and guide content | Sewer camera evidence, local root/soil examples, service page FAQs |
| 8 | Is hydro jetting worth it or safe? | hydro jetting vs snake, old pipe risk, cost, roots, grease | Existing `/guides/drain-cleaning-vs-hydro-jetting` and `/guides/hydro-jetting-cost-austin` | Field camera before/after evidence, service methodology |
| 9 | Does homeowners insurance cover plumbing leaks? | slab leak insurance, water damage, pipe repair, sudden vs gradual | Existing `/guides/homeowners-insurance-plumbing`; add careful disclaimers | Policy examples, insurer/public adjuster disclaimers, documentation checklist |
| 10 | How hard is Austin water and do I need a softener? | Austin water hardness, water spots, water heater sediment, filter vs softener | Existing `/guides/austin-hard-water` and water-treatment service page | Austin Water quality reports, EPA/WaterSense, equipment documentation |

### Content Rules For The Top 10 Hub

1. Each top-level answer should be self-contained in 120-250 words.
2. Each answer should include one concise "If this is happening now, do this first" line where safety or urgency matters.
3. Each answer should link to exactly one service page and one deeper guide where possible.
4. Use "Texas" only for statewide licensing and legal context. Use "Austin" or "Greater Austin" for service, pricing, permit process, water quality, and dispatch context.
5. Cite official sources directly under the answer, not only in a footnote at the bottom.
6. Include variants naturally: "People also ask this as..." or H3 subquestions.
7. Refresh the hub quarterly with new first-party data: common jobs, price shifts, weather events, water-quality updates, and common estimate red flags.

## Content Upgrades By Cluster

### Pricing And Estimates

Current state: excellent route coverage, with 50 cost-guide routes and a master price guide.

Changes:

- Add methodology: what data feeds the published Ironclad price, what is market estimate vs fixed price, when numbers were last reviewed, and what is excluded.
- Add "why a quote is higher" examples with photos or job context.
- Add downloadable/printable estimate checklist.
- Add "compare this quote" prompts for ChatGPT/Claude, tied to `/guides/using-ai-for-plumbing-research`.
- Add `Dataset` or `ItemList` schema only if the pricing table becomes stable enough to maintain; otherwise keep Article schema with visible tables.

### Licensing, Permits, And Code

Current state: guide content exists, but authority can be stronger.

Changes:

- Add TSBPE license lookup steps with screenshots or a short checklist.
- Add named RMP/license data on `/licenses`, schema, footer, FAQ, and estimate guide.
- Add Austin permit page citations for standalone permits, emergency permits, and "Do I Need A Permit".
- Add city-specific permit links for Round Rock, Cedar Park, Georgetown, Pflugerville, Leander, Buda, and Kyle where service pages mention permit process.

### Emergency And Safety

Current state: strong emergency guide exists.

Changes:

- Add source links for Austin Water emergency shutoff guidance, Texas Gas Service gas-smell instructions, and Austin DSD emergency repair permit guidance.
- Add printable shutoff checklist and "where to find your shutoffs" images.
- Add service-page answer blocks for burst pipe, sewer backup, gas smell, no hot water, water heater leak, and overflowing toilet.
- Add local after-hours expectations: what Ironclad handles, what 911/gas utility handles first, and when water mitigation is the next call.

### Water Quality And Hard Water

Current state: Austin hard-water content exists, but it currently conflicts with Austin Water's 2025 report if it claims 15-25 GPG as municipal average. The official Austin Water report cited average total hardness around 93 ppm / 5.4 gpg in the 2025 report, with low/high 70-126 ppm / 4.1-7.4 gpg.

Changes:

- Reconcile the hard-water guide with official Austin Water numbers and clearly distinguish municipal averages from home-specific test-strip results, private wells, or neighboring utility systems.
- Add a "test your water before buying equipment" section with Austin Water report link and a simple conversion table.
- Replace broad "very hard" claims unless supported by source and utility area.
- Add water-treatment comparison table: softener vs carbon filter vs RO vs combo system.

### Slab Leaks And Insurance

Current state: dedicated slab leak and insurance pages exist.

Changes:

- Add source-backed "signs" section and make clear that symptoms indicate possible leaks, not proof.
- Add "documents to collect" checklist: water bill, meter reading, photos, plumber invoice, leak detection report, repair scope, mitigation invoice.
- Add examples of repair options with when spot repair, reroute, or line replacement makes sense.
- Keep insurance guidance general and avoid implying coverage certainty.

## Schema Recommendations

Keep:

- `Plumber` / LocalBusiness on local service and city pages.
- `Service` on service pages and location service pages.
- `Article` on guides and blogs.
- `BreadcrumbList` everywhere.
- `FAQPage` where Q&A is visible on page, while recognizing commercial FAQ rich results are no longer a reliable Google feature.

Add or improve:

- `Person` for real authors and reviewers.
- Article `reviewedBy`, `citation`, `about`, and `mentions`.
- `sameAs` with Google Business Profile and real social URLs.
- `hasCredential` or `additionalProperty` for real license number where visible.
- `ItemList` for "Top 10 questions" and comparison lists.
- `VideoObject` if short diagnostic videos are added.

Avoid:

- Fake aggregate ratings or review markup not backed by visible reviews.
- Schema claims not visible on the page.
- Over-investing in `Speakable`; it can remain, but it is not a primary current visibility lever.
- HowTo schema as the main play for "fix it" content if the safer answer is "call a licensed plumber."

## `llms.txt` Recommendation

Status: live and updated in repo on May 26.

Role:

- Acts as a curated machine-readable map for agents and LLM toolchains.
- Helps identify canonical pages and priority content if a tool fetches only a small number of URLs.
- Should be generated from content registries to prevent drift.

Limits:

- It is not an official W3C/IETF standard.
- OpenAI, Anthropic, Google, and Perplexity do not publicly guarantee ranking boosts from it.
- Google specifically says site owners can ignore unnecessary AI text files such as `llms.txt` for Google generative search optimization.

Next:

- Add `/llms-full.txt` containing concise Markdown excerpts of the top guide answers, business facts, source URLs, and contact details.
- Add a CI script to validate `/llms.txt` links and required sections.
- Link to `/llms.txt` from docs or internal tooling, but do not surface it as a consumer-facing promise.

## Updated Priority Order

1. Replace license/hour placeholders and add real named reviewer data.
2. Add source blocks and citations to the top 20 guides and `/faq/plumbing`.
3. Build the top-questions hub as one canonical page with variants inside it.
4. Generate and validate `llms.txt`; add `llms-full.txt`.
5. Deploy and verify the explicit AI crawler governance entries.
6. Move sitemap `lastmod` to route-level content dates.
7. Add AI crawler/referral reporting.
8. Refresh GSC, Bing WMT, and GBP status with current data.

---

## Historical March 7 Snapshot

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
