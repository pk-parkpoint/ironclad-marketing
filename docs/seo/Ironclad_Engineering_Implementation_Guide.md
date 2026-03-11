# Ironclad Consumer Toolkit — Engineering Implementation Guide

**The single source of truth for building all guide pages on ironcladtexas.com.**

Contains: page template UX spec, schema requirements, SEO/AEO rules, brand integration rules, nav structure, and ticketed engineering backlog with acceptance criteria.

Companion files:
- `Ironclad_FINAL_CONTENT.md` -- all 40 pages of content + reading order metadata
- `Ironclad_Master_Content_Map.xlsx` -- content map, status, link placement, reading order with related guides

---

# SECTION 1: Site Architecture & Navigation

## Final Nav Structure

```
Plumbing ▾    Service Areas ▾    Guides ▾    About Us ▾         [Schedule Online]  [Call]
```

**Plumbing ▾**
- Plumbing Repairs
- Drain Cleaning
- Sewer Line Services
- Water Heaters
- Tankless Water Heaters
- Leak Detection
- Gas Line Services
- Fixtures
- Water Treatment
- Emergency Plumbing
- All Services

**Service Areas ▾**
- Austin
- Round Rock
- Cedar Park
- Pflugerville
- Georgetown
- All Areas

**Guides ▾**
- What Plumbing Should Cost
- Questions to Ask Any Plumber
- Red Flags to Watch For
- Compare Your Options
- All Guides

**About Us ▾**
- About Ironclad
- Our Guarantees
- Reviews
- Careers

**Right side (visually separated):**
- Schedule Online (primary button)
- Call (secondary button, tel: link)

## URL Structure

```
/guides/                              Hub page (card grid index)
/guides/what-plumbing-costs-austin    Individual guide page
/guides/tank-vs-tankless              Individual guide page
/guides/tools                         Downloads page
```

All 37 guide page URLs are defined in `Ironclad_FINAL_CONTENT.md` (reading order metadata at bottom) and `Ironclad_Master_Content_Map.xlsx` (Tab 1: Content Map, Column C).

---

# SECTION 2: Guide Page Template -- UX Specification

## Page Anatomy (13 Elements, Top to Bottom)

Every guide page uses this identical structure. No exceptions.

### ① Breadcrumb

```
Home > Guides > [Category] > [Page Title]
```

Categories: Pricing, Before You Hire, Comparisons, Austin Reference, Cost Guides, Replacement Signs, Tools.

- Font: 13px, regular, color #888
- Separator: ` > `
- Current page: plain text (not linked)
- Schema: BreadcrumbList (see Section 4)

### ② Category Tag

Small pill/badge above the headline.

| Category | Tag Text |
|---|---|
| Pricing pages | Price Guide |
| Consumer guides | Consumer Guide |
| Comparison pages | Comparison |
| Reference guides | Austin Reference |
| Cost articles | Cost Guide |
| Replacement articles | Replacement Signs |
| Tools/downloads | Downloadable Tool |

All tags use the same color: forest green (#2D6A4F) text on light green background (#e8f5e9). 12px, uppercase, letterspaced 0.05em, semibold. Padding 4px 12px. Border-radius 4px.

### ③ H1 Headline

- One per page. Matches `<title>` and schema `headline`.
- Font: 32px desktop / 26px mobile. Bold. Color #1a1a1a. Line-height 1.2.
- No period at end. No all-caps.

### ④ Subheadline

1-2 sentences: why should I read this, what do I walk away with.

- Font: 18px desktop / 16px mobile. Regular weight. Color #444. Line-height 1.5. Max-width 600px.

### ⑤ Byline + Trust Strip

```
Published by Ironclad Plumbing  ·  Updated March 2026

Ironclad's guides are reviewed for accuracy before publication
and updated when prices or regulations change.
```

- Byline: 14px. "Ironclad Plumbing" in semibold. Rest regular.
- Trust line: 13px, italic, color #888.
- Both left-aligned.

### ⑥ Horizontal Rule

1px, color #e0e0e0. Full content width.

### ⑦ TLDR Box

The most important design element. This is what 70% of visitors read.

- Background: #f7f7f5 (light warm gray)
- Optional: 3px left border in forest green
- Border-radius: 8px
- Padding: 24px desktop / 16px mobile
- Max-width: matches body (720px). Tables inside can overflow with horizontal scroll on mobile.
- Body font: 16px. Table font inside TLDR: 14px.
- Schema: gets `speakable` pointing to `.tldr-box`

Content: usually a summary table answering the reader's primary question in under 10 seconds.

### ⑧ Table of Contents

**Desktop (768px+):** Sticky sidebar, right side of page. 220px wide. Lists all H2 sections as jump links. Scroll-spy highlights current section.

- Font: 13px
- Active section: forest green text + 2px left border
- Inactive: color #666

**Mobile (<768px):** Collapsible accordion below TLDR. Label: "On this page ▾". Tap to expand/collapse.

**Show TOC only on pages with 4+ H2 sections.** Short pages skip it.

### ⑨ Body Content

- Text max-width: 720px
- Tables: can extend to 1000px (horizontal scroll wrapper on mobile)
- Body text: 16px, line-height 1.7, color #333
- H2: 24px, bold, color #1a1a1a, margin-top 48px
- H3: 20px, semibold, color #1a1a1a, margin-top 32px
- Paragraph spacing: 24px margin-bottom on `<p>`
- Desktop: body content left-aligned, TOC sidebar on right
- Mobile: full width, 16px padding

**Tables:** Semantic HTML `<table>` with `<thead>` and `<th>`. NOT CSS grids or divs. Google and AI systems parse `<table>` elements specifically for featured snippets.

- Header row: forest green bg (#2D6A4F), white text
- Alternating rows: white and #f9f9f9
- Cell padding: 12px
- Font: 14px
- Ironclad price column: `<strong>` on values
- Mobile: `overflow-x: auto` wrapper

**Inline links to related guides:**

```
See what drain cleaning should cost ›
```

Natural links within paragraphs. The `›` chevron is a visual cue it goes to another page. NOT callout boxes.

**Ironclad contrast blocks (1-2 per page max):**

```html
<aside class="ironclad-practice">
  <strong>How Ironclad handles this:</strong> [factual statement]
</aside>
```

- 3px left border, forest green
- Very light green background (#f5faf7)
- Padding 16px 20px. Margin 32px 0.
- `<aside>` is semantically supplementary content.

**No images** unless a diagram is genuinely needed. No hero images. No stock photos. If used: WebP, lazy-loaded, descriptive alt text, max-width 720px.

### ⑩ "Keep Reading" -- Related Guides

3-4 cards linking to related guides. Manually curated per page (see reading order metadata in `Ironclad_FINAL_CONTENT.md` or Tab 4 of the content map spreadsheet).

- Section header: "Keep reading" -- 14px, uppercase, letterspaced, color #888
- Desktop: horizontal row of 3-4 cards
- Mobile: horizontal scroll, cards 280px wide

**Card content:** category tag (small pill), title (16px semibold, 2-line max), 1-line description (14px, #888). No images. No dates. Entire card clickable.

### ⑪ Prev / Next Navigation

```
← Previous guide                              Next guide →
  Austin Plumbing Codes               Slab Leak Signs in Austin
```

37 pages in sequence. Order defined in reading order metadata. Wraps (page 37 next = page 1).

- Full-width bar. Background #f5f5f5. Padding 24px.
- "Previous guide" / "Next guide" label: 13px, color #888
- Page title: 16px semibold, forest green, clickable link
- Entire left/right half is the click target
- Mobile: stack vertically, full-width tap targets

### ⑫ CTA Block

The ONLY CTA on the entire page. No mid-content CTAs. No sidebar CTAs. One. At the bottom.

```
Questions this guide didn't answer?
Call or text Ironclad at (833) 597-1932.
We'll give you a straight answer whether you hire us or not.
No service visit fees.
```

- Centered text. No background color.
- "Questions..." line: 20px semibold
- Phone number: 18px, forest green, tel: link on mobile
- Rest: 14px, color #888
- No buttons. No "BOOK NOW."

### ⑬ Editorial Footer

```
About Ironclad's Guides
These guides are published by Ironclad Plumbing for Austin homeowners.
No email required. No sign-up. Use them on any plumber, including us.
```

- 13px, color #888, centered
- Thin top border (1px #e0e0e0) for separation

## Desktop Layout (768px+)

```
┌─────────────────────────────────────────────────────────────┐
│  Content column (720px)          │  TOC sidebar (220px)     │
│                                  │  (sticky on scroll)      │
└─────────────────────────────────────────────────────────────┘
```

Total content area: ~988px. Centered in 1100px max-width container. 48px gap between content and TOC.

## Spacing Rhythm

| Element | Margin Top | Margin Bottom |
|---|---|---|
| Breadcrumb | 16px | 8px |
| Category tag | 0 | 8px |
| H1 | 0 | 12px |
| Subheadline | 0 | 16px |
| Byline | 0 | 24px |
| HR | 24px | 24px |
| TLDR box | 0 | 32px |
| TOC | 0 | 32px |
| H2 | 48px | 16px |
| H3 | 32px | 12px |
| Paragraphs | 0 | 24px |
| Tables | 24px | 24px |
| Contrast block | 32px | 32px |
| Keep Reading | 48px | 32px |
| Prev/Next | 32px | 32px |
| CTA | 32px | 32px |

## Reading Progress Bar

3px bar at top of viewport. Forest green. Width = scroll %. CSS `animation-timeline: scroll()` or minimal JS.

## Print Stylesheet

Hide: nav, footer, TOC, prev/next, CTA, sticky bar, progress bar, "Keep Reading." Show: breadcrumb (text only), byline, TLDR, body, tables. Tables fit page width at 12px. Page footer: "ironcladtexas.com/guides/[slug] | (833) 597-1932"

---

# SECTION 3: Brand Integration Rules

## How Ironclad Appears Without Feeling Like a Sales Document

**Ironclad is the publisher, not the product.** The authority comes from the act of publishing, not from self-promotion inside the content.

**Rule 1: Ironclad's price is a table column, not a promotion.** Bold, factual, one data point among many. No green highlighting. No "OUR PRICE." No checkmarks. Just the number.

**Rule 2: Ironclad's practices are contrast, not selling.** Stated factually at the end of relevant sections, 1-2 per page max. Standardized `<aside class="ironclad-practice">` format. No superlatives ("best," "top," "unmatched"). No comparisons ("unlike other plumbers").

**Rule 3: Every page opens with "Ironclad Plumbing" as the subject performing an action FOR the reader.** "Ironclad Plumbing publishes this guide because..." NOT "At Ironclad Plumbing, we believe..."

**Rule 4: One CTA per page, bottom only.** Low-pressure. "Questions this guide didn't answer?" Not "Ready to hire Austin's most trusted plumber?"

**Rule 5: Named data sets.** "Ironclad's Austin Plumbing Price Index" (pricing guide). Named data gets cited by name in AI responses.

**Rule 6: No pop-ups, email gates, or chat widgets on guide pages.** The positioning is unconditional generosity.

---

# SECTION 4: Schema Requirements

## Every Guide Page

```json
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "[H1]",
  "description": "[meta description]",
  "author": {
    "@type": "Organization",
    "name": "Ironclad Plumbing",
    "url": "https://ironcladtexas.com"
  },
  "publisher": {
    "@type": "Organization",
    "name": "Ironclad Plumbing",
    "url": "https://ironcladtexas.com",
    "logo": { "@type": "ImageObject", "url": "https://ironcladtexas.com/media/ip-logo.svg" }
  },
  "datePublished": "2026-03-01",
  "dateModified": "2026-03-01",
  "mainEntityOfPage": { "@id": "https://ironcladtexas.com/guides/[slug]" },
  "speakable": {
    "@type": "SpeakableSpecification",
    "cssSelector": [".tldr-box", ".page-headline"]
  }
}
```

## BreadcrumbList (Every Page)

```json
{
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://ironcladtexas.com" },
    { "@type": "ListItem", "position": 2, "name": "Guides", "item": "https://ironcladtexas.com/guides/" },
    { "@type": "ListItem", "position": 3, "name": "[Page Title]" }
  ]
}
```

## FAQPage (On Q&A Pages)

```json
{
  "@type": "FAQPage",
  "mainEntity": [{
    "@type": "Question",
    "name": "[question from H2 or TLDR]",
    "acceptedAnswer": {
      "@type": "Answer",
      "text": "[answer including 'Ironclad Plumbing' in the text]"
    }
  }]
}
```

## Dataset (Pricing Guide Only)

```json
{
  "@type": "Dataset",
  "name": "Ironclad Austin Plumbing Price Index",
  "description": "Baseline pricing for 50 residential plumbing services in Austin, TX.",
  "creator": { "@type": "Organization", "name": "Ironclad Plumbing" },
  "spatialCoverage": { "@type": "Place", "name": "Austin, TX metro area" },
  "temporalCoverage": "2026"
}
```

## Meta Tags (Every Page)

- `<title>`: [H1] | Ironclad Plumbing
- `<meta name="description">`: 140-160 chars. Include "Ironclad Plumbing." Follow pattern: "[Topic]. Published by Ironclad Plumbing for Austin homeowners. [Key data point]."
- `<link rel="canonical" href="https://ironcladtexas.com/guides/[slug]">`
- OG title, description, image (branded template per guide, or default guide-series image at minimum)

## HTML Structure Rules

- One `<h1>` per page
- Strict heading hierarchy: H1 > H2 > H3 (no skipping)
- All H2 elements get `id` attributes for deep linking: `<h2 id="drain-cleaning">Drain Cleaning</h2>`
- All tables: semantic `<table>` / `<thead>` / `<th scope="col">` / `<tbody>`
- `dateModified` updates whenever content changes

---

# SECTION 5: Internal Linking Rules

**Service pages > Guides:** Every service page links to 2-3 relevant guides in the body ("See what this costs ›") and in a "Related Guides" module at bottom.

**Guides > Service pages:** Every guide links to 2-3 relevant service pages where the reader would naturally want to take action.

**Guides > Guides:** "Keep Reading" cards (3-4 per page, curated) + inline body links where contextually relevant. Every guide page has prev/next navigation.

**City pages > Guides:** Link to pricing guide + guarantees. Growth suburbs (Leander, Hutto, Kyle, Buda, Liberty Hill) also link to new construction warranty guide.

**Homepage > Guides:** "See What Plumbing Costs" CTA links to pricing guide. "Why Ironclad Is Different" cards link to pricing guide + questions checklist.

---

# SECTION 6: Engineering Backlog

## Phase 0: Route Scaffolding

### GUIDE-001: Create route structure for all guide pages

**What:** Create Next.js routes for `/guides/` hub and all 37 individual guide pages. Each route renders a placeholder page with just the H1, URL, and a "Content coming soon" message.

**URLs (37 pages + 1 hub):**
```
/guides/
/guides/what-plumbing-costs-austin
/guides/how-plumbing-pricing-works
/guides/plumbing-pricing-tricks
/guides/questions-to-ask-your-plumber
/guides/plumber-red-flags
/guides/how-to-research-a-plumber
/guides/big-vs-small-plumbing-companies
/guides/how-to-read-a-plumbing-estimate
/guides/how-to-negotiate-plumbing
/guides/plumber-call-script
/guides/water-heater-repair-vs-replace
/guides/tank-vs-tankless
/guides/drain-cleaning-vs-hydro-jetting
/guides/sewer-repair-options-compared
/guides/softener-vs-filter-vs-combo
/guides/slab-leak-repair-options
/guides/austin-hard-water
/guides/austin-plumbing-codes-homeowners
/guides/winter-plumbing-prep-austin
/guides/how-to-read-austin-water-bill
/guides/when-diy-vs-call-plumber
/guides/homeowners-insurance-plumbing
/guides/home-warranty-plumbing
/guides/plumbing-before-selling-home
/guides/new-construction-plumbing-warranty
/guides/drain-cleaning-cost-austin
/guides/water-heater-replacement-cost-austin
/guides/sewer-repair-cost-austin
/guides/leak-detection-cost-austin
/guides/repipe-cost-austin
/guides/signs-water-heater-needs-replacing
/guides/signs-sewer-line-needs-replacing
/guides/signs-water-softener-needs-replacing
/guides/using-ai-for-plumbing-research
/guides/before-the-plumber-arrives
/guides/after-the-plumber-leaves
/guides/tools
```

**Acceptance criteria:**
- [ ] All 38 URLs resolve to a page (200 status)
- [ ] Each placeholder page renders server-side (check view-source, confirm H1 is in raw HTML)
- [ ] Each page has a self-referencing canonical tag
- [ ] Each page has a unique `<title>` tag: "[Page Title] | Ironclad Plumbing"
- [ ] No 404s for any of the above URLs
- [ ] All pages have `noindex` meta tag (temporary, removed in GUIDE-007)

**Do not:** Add content yet. Do not build the template component yet. This ticket is routes only.

---

### GUIDE-002: Add guides to sitemap and robots.txt

**What:** Add all 38 guide URLs to the XML sitemap. Verify robots.txt allows crawling of `/guides/`.

**Acceptance criteria:**
- [ ] `/sitemap.xml` includes all 38 guide URLs with `lastmod` dates
- [ ] `robots.txt` does not disallow `/guides/`
- [ ] Sitemap validates at https://www.xml-sitemaps.com/validate-xml-sitemap.html
- [ ] Submit updated sitemap to Google Search Console

**Depends on:** GUIDE-001

---

### GUIDE-003: Add "Guides" to main navigation

**What:** Add the Guides dropdown to the global nav. Add the About Us dropdown updates (Guarantees, Reviews, Careers).

**Nav items (Guides dropdown):**
- What Plumbing Should Cost > `/guides/what-plumbing-costs-austin`
- Questions to Ask Any Plumber > `/guides/questions-to-ask-your-plumber`
- Red Flags to Watch For > `/guides/plumber-red-flags`
- Compare Your Options > `/guides/#comparisons` (anchor link on hub page)
- All Guides > `/guides/`

**Nav items (About Us dropdown):**
- About Ironclad > `/about`
- Our Guarantees > `/guarantees`
- Reviews > `/reviews`
- Careers > `/careers`

**Acceptance criteria:**
- [ ] Guides dropdown appears in global nav on all pages
- [ ] All 5 Guides dropdown links work and point to correct URLs
- [ ] About Us dropdown contains all 4 items with working links
- [ ] Dropdown works on mobile (hamburger menu) and desktop (hover/click)
- [ ] Active state highlights correctly when on a guide page

**Depends on:** GUIDE-001

---

## Phase 1: Build the Template Component

### GUIDE-004: Build the guide page template component

**What:** Build a single reusable page component that all 37 guide pages will use. The component accepts content as props/data and renders the full page layout per the UX spec (Section 2 of this document).

**Component must render all 13 elements:**
1. Breadcrumb (with BreadcrumbList schema)
2. Category tag (pill badge)
3. H1 headline
4. Subheadline
5. Byline + trust strip
6. Horizontal rule
7. TLDR box (`.tldr-box` class for speakable schema)
8. Table of contents (sticky sidebar desktop, accordion mobile)
9. Body content area (720px max, tables can go wider)
10. "Keep Reading" related guide cards (3-4 cards)
11. Prev/next navigation
12. CTA block
13. Editorial footer

**Data model per page:**
```typescript
interface GuidePage {
  slug: string;
  title: string;              // H1
  subheadline: string;        // 1-2 sentences
  category: string;           // maps to tag color/text
  datePublished: string;      // ISO date
  dateModified: string;       // ISO date
  tldr: string;               // HTML content for TLDR box
  body: string;               // HTML body content
  relatedGuides: string[];    // 3-4 slugs
  prevGuide: string | null;   // slug
  nextGuide: string | null;   // slug
  metaDescription: string;    // 140-160 chars
  faqSchema?: FAQItem[];      // optional FAQ entries
}
```

**Acceptance criteria:**
- [ ] Component renders all 13 elements with correct spacing (per rhythm table in Section 2)
- [ ] TOC is sticky sidebar on desktop (768px+), collapsible accordion on mobile
- [ ] TOC scroll-spy highlights current section on scroll
- [ ] Tables use semantic HTML `<table>` with `<thead>/<th>`, NOT divs
- [ ] Tables have horizontal scroll wrapper on mobile
- [ ] TLDR box has `.tldr-box` class and `role="region"` with `aria-label="Summary"`
- [ ] Prev/next shows correct page titles from reading order
- [ ] Prev/next wraps (page 37 next = page 1)
- [ ] "Keep Reading" cards show correct related guides per page data
- [ ] Reading progress bar renders at top of viewport
- [ ] CTA phone number is `tel:` link on mobile
- [ ] Print stylesheet hides nav, footer, TOC, CTA, prev/next, progress bar
- [ ] Component passes Lighthouse accessibility audit (score 90+)

**Font sizes, colors, and spacing:** All specified in Section 2 of this document. Use CSS variables for colors and spacing values.

**Do not:** Add actual content yet. Use placeholder lorem ipsum in the template during development.

**Depends on:** GUIDE-001

---

### GUIDE-005: Build the guides hub page (`/guides/`)

**What:** Build the hub page as a card grid index. Content and card groupings are defined in `Ironclad_FINAL_CONTENT.md` under the Guides Hub Page section.

**Layout:** 7 category groups. Each group has a section header and 2-column card grid (desktop). Single column on mobile.

**Card content:** Category tag (pill), title, 1-line description. No images. No dates. Entire card clickable.

**Hub intro text:** "Ironclad Plumbing publishes these guides because most homeowners don't know what plumbing should cost, what questions to ask, or how to tell a good plumber from a bad one. No email required. No sign-up. Use them on any plumber in Austin, including us."

**Acceptance criteria:**
- [ ] Hub page renders at `/guides/`
- [ ] All 7 category groups display with correct headers
- [ ] All 37 guide cards link to correct URLs
- [ ] Cards render in 2-column grid on desktop, single column on mobile
- [ ] Hub page has Article schema with author/publisher as Ironclad Organization
- [ ] `#comparisons` anchor links to the "Make the Right Decision" section (for nav dropdown)
- [ ] No broken links

**Depends on:** GUIDE-001, GUIDE-004

---

### GUIDE-006: Add JSON-LD schema to template

**What:** Implement all required schema per Section 4 of this document.

**Every guide page gets:**
- Article schema (author + publisher = Ironclad Organization)
- BreadcrumbList schema
- Speakable schema pointing to `.tldr-box` and `.page-headline`

**Conditional schema:**
- FAQPage schema on pages that have `faqSchema` data (see data model)
- Dataset schema on the pricing guide only

**Acceptance criteria:**
- [ ] Every guide page passes Google Rich Results Test (search.google.com/test/rich-results)
- [ ] Every guide page passes Schema.org Validator (validator.schema.org)
- [ ] Article schema has correct `author` and `publisher` Organization entities
- [ ] BreadcrumbList matches visible breadcrumb
- [ ] Speakable CSS selectors target existing DOM elements
- [ ] Pricing guide page has Dataset schema naming "Ironclad Austin Plumbing Price Index"

**Depends on:** GUIDE-004

---

## Phase 2: Pilot -- One Page End-to-End

### GUIDE-007: Load pilot page content and review

**What:** Load the content for ONE guide page into the template. Recommended pilot: "10 Questions to Ask Before You Hire a Plumber" (short, has a TLDR table, has good inline links, has prev/next neighbors).

**Steps:**
1. Convert the markdown content from `Ironclad_FINAL_CONTENT.md` into HTML
2. Populate the page data model (title, subheadline, category, TLDR, body, related guides, prev/next, meta description)
3. Render the live page
4. Remove `noindex` from this one page only
5. Submit URL to GSC for indexing

**Acceptance criteria:**
- [ ] Page renders with real content at `/guides/questions-to-ask-your-plumber`
- [ ] TLDR box contains the 10-question summary table
- [ ] All inline links to other guide pages work (even if targets are still placeholders)
- [ ] Prev/next shows correct neighbors (Red Flags previous, Phone Call Script next)
- [ ] "Keep Reading" cards show correct 3 related guides
- [ ] H2 sections have `id` attributes and TOC links work
- [ ] Meta title: "10 Questions to Ask Before You Hire a Plumber | Ironclad Plumbing"
- [ ] Meta description: 140-160 chars, includes "Ironclad Plumbing"
- [ ] Canonical URL is correct
- [ ] Schema validates in Rich Results Test
- [ ] Page is SSR (view-source shows full content in HTML)
- [ ] Page load: LCP < 2.5s, CLS < 0.1, FID < 100ms (Core Web Vitals)
- [ ] Print renders cleanly on letter-size paper
- [ ] Boseefus reviews and approves the layout before proceeding to Phase 3

**Depends on:** GUIDE-004, GUIDE-005, GUIDE-006

---

## Phase 3: Stamp Out All Pages

### GUIDE-008: Create content data files for all 37 pages

**What:** Convert all remaining guide content from `Ironclad_FINAL_CONTENT.md` into the page data model format. Each page needs: slug, title, subheadline, category, TLDR HTML, body HTML, related guides (3 slugs), prev/next slugs, meta description.

**Source:** All content is in `Ironclad_FINAL_CONTENT.md`. Reading order and related guides are in the metadata appendix at the bottom of that file and in Tab 4 of the content map spreadsheet.

**Approach:** Build a script or manual process that:
1. Extracts each page's content from the consolidated markdown
2. Converts markdown to HTML (preserving semantic table structure)
3. Populates the data model fields
4. Creates a data file per page (JSON, MDX, or whatever the framework uses)

**Acceptance criteria:**
- [ ] 37 data files created, one per guide page
- [ ] Every data file has all required fields populated
- [ ] Every `relatedGuides` array contains exactly 3 valid slugs
- [ ] Every `prevGuide` and `nextGuide` slug is valid
- [ ] Every `metaDescription` is 140-160 characters and includes "Ironclad Plumbing"
- [ ] No [INSERT] placeholders remain in any published content (these require Ironclad business data and must be flagged for manual fill)

**Depends on:** GUIDE-007 (approved)

---

### GUIDE-009: Deploy all 37 guide pages

**What:** Render all 37 pages using the template component and content data files. Remove `noindex` from all pages.

**Acceptance criteria:**
- [ ] All 37 guide URLs return 200 with real content
- [ ] All 37 pages are SSR (full HTML in view-source)
- [ ] All `noindex` tags removed
- [ ] All 37 pages appear in sitemap.xml with correct `lastmod`
- [ ] Submit sitemap to GSC

**Depends on:** GUIDE-008

---

## Phase 4: Cross-Linking Verification

### GUIDE-010: Verify all internal links

**What:** Crawl the entire `/guides/` section and verify every internal link resolves.

**Checks:**
1. Every inline body link to another guide page works (no 404s)
2. Every "Keep Reading" card links to a valid page
3. Every prev/next link works and points to the correct page in sequence
4. Every breadcrumb link works
5. Every service page link from guides works (these may point to pages that exist but have placeholder content -- that's OK, they should still resolve)
6. Every guide page is reachable from the hub page

**Acceptance criteria:**
- [ ] Zero broken links across all 38 guide pages (37 + hub)
- [ ] Every guide page is reachable from `/guides/` within 1 click
- [ ] Every guide page has at least 3 internal incoming links (from related guides, prev/next, and hub)
- [ ] Prev/next sequence covers all 37 pages in correct order with correct wrapping
- [ ] Run a link checker tool (Screaming Frog, or `npx broken-link-checker`) and attach results

**Depends on:** GUIDE-009

---

### GUIDE-011: Verify schema on all pages

**What:** Run schema validation on every guide page.

**Acceptance criteria:**
- [ ] All 37 pages + hub pass Google Rich Results Test
- [ ] All Article schemas have correct author/publisher
- [ ] All BreadcrumbList schemas match visible breadcrumbs
- [ ] Pricing guide has Dataset schema
- [ ] All speakable selectors target real DOM elements
- [ ] Run validation in batch and attach results report

**Depends on:** GUIDE-009

---

## Phase 5: Performance & Polish

### GUIDE-012: Core Web Vitals verification

**What:** Run Lighthouse on 5 representative pages (hub, pricing guide, one comparison, one cost article, one reference guide). Verify CWV pass.

**Acceptance criteria:**
- [ ] All 5 pages: LCP < 2.5s
- [ ] All 5 pages: CLS < 0.1
- [ ] All 5 pages: FID/INP < 200ms
- [ ] Lighthouse Performance score: 90+ on all 5 pages
- [ ] Lighthouse Accessibility score: 90+ on all 5 pages
- [ ] Lighthouse SEO score: 95+ on all 5 pages

**Depends on:** GUIDE-009

---

### GUIDE-013: GSC indexing verification

**What:** After pages have been live for 48 hours, verify indexing in Google Search Console.

**Acceptance criteria:**
- [ ] Submit all 38 URLs via GSC URL Inspection tool
- [ ] After 48h: check "URL is on Google" status for at least 10 representative pages
- [ ] If any pages show indexing issues, diagnose and fix
- [ ] Verify sitemap has been processed (GSC > Sitemaps > check "Discovered URLs")
- [ ] Verify no pages are blocked by robots.txt or noindex

**Depends on:** GUIDE-009, GUIDE-002

---

### GUIDE-014: Mobile sticky bar on guide pages

**What:** Add the persistent mobile sticky bar (56px, fixed to bottom) with Call and Schedule buttons. This appears on ALL site pages, not just guides, but verify it works correctly on guide pages specifically.

**Acceptance criteria:**
- [ ] Sticky bar visible on mobile (<768px) on all guide pages
- [ ] Call button triggers `tel:8335971932`
- [ ] Schedule button links to `/book`
- [ ] Bar doesn't overlap content or CTA block
- [ ] Bar disappears on desktop (768px+)

**Depends on:** GUIDE-009

---

## Ticket Dependency Chain

```
GUIDE-001 (routes)
  ├── GUIDE-002 (sitemap)
  ├── GUIDE-003 (nav)
  └── GUIDE-004 (template component)
        ├── GUIDE-005 (hub page)
        └── GUIDE-006 (schema)
              └── GUIDE-007 (pilot page) ← REVIEW GATE: Boseefus approves
                    └── GUIDE-008 (content data)
                          └── GUIDE-009 (deploy all)
                                ├── GUIDE-010 (link verification)
                                ├── GUIDE-011 (schema verification)
                                ├── GUIDE-012 (CWV)
                                ├── GUIDE-013 (GSC indexing)
                                └── GUIDE-014 (mobile sticky bar)
```

Total: 14 tickets. One review gate after the pilot page (GUIDE-007). Nothing stamps out until the pilot is approved.
