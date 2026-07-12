# implementation-service-pages.md — Motion hooks for Service pages & Service Area pages

Companion to `motion-spec.md` (effect definitions) and `usage.md` (sitewide recipes).
This file is the **exact hook map** for the two page templates, matching the approved
reference implementations in the design workspace:

- Service pages (PPC template): `IP - Service Pages (PPC + Motion)` — live example export: `example-service-page.html`
- Service area pages: `IP - Service Area Pages (Motion)`

## Install (once, sitewide)
```html
<link rel="stylesheet" href="/css/ironclad-motion.css">
<script src="/js/ironclad-motion.js" defer></script>
```
All wiring is markup attributes/classes — no per-page JS. The stylesheet reads the page's
`--accent` variable. **v1.1, SPA note (our Next.js site):** after any client-side render that
replaces DOM (route change, variant hydration), the script's built-in MutationObserver rescans
automatically; you can also call `window.icMotionScan()` manually. Revealed state is stored in
a `data-icr` attribute (not just a class), so React re-renders can't un-reveal content.

## Design decision: NO underline draw on these templates
The `.ic-underline` effect (spec #5) was reviewed and **rejected** for service and service-area
heroes — the hero sub already carries a gradient-text pun. Do not add it. It remains in use on
the FAQ hub only.

---

## A. Service pages (PPC template, /plumbing/*)

Section order: promo bar → header → hero → guarantee strip → signs → services → reviews →
why/stats → process → service area → FAQ → final CTA → footer → sticky mobile bar.

| Section | Element | Hook |
|---|---|---|
| Promo bar | the `→` arrow span | `class="ic-nudge"` |
| Header | "Schedule Now \| 24/7" pill | prepend `<span class="ic-pulse-dot"></span>` |
| Hero | inner container (`.hero-inner`) | `data-entrance` (children cascade: badge → h1 → sub → trust row → CTAs) |
| Hero | primary CTA (green call button) | `class="ic-cta"` + `<span class="ic-sheen"></span>` as first child |
| Guarantee strip | `<h2>` Our Ironclad Guarantee | `data-reveal` |
| Guarantee strip | each of the 4 guarantee items | `data-reveal` (grid stagger is automatic) |
| Signs | section `<h2>` only | `data-reveal` — do **NOT** reveal the numbered rows (reading content) |
| Services | section `<h2>` | `data-reveal` |
| Services | each `.svc-card` | `data-reveal` |
| Reviews | header row (h2 + "Read all" link) | `data-reveal` |
| Reviews | each review card | `data-reveal` |
| Why Ironclad | each `.why-item` row (01–04) | `data-reveal` — NOT the sticky left column |
| Stat strip | each big number | wrap digits: `<span data-count="142">142</span>` — suffix stays **outside** the span (`<span data-count="19">19</span>+`); decimals inferred from the attribute (`data-count="4.9"`) |
| Process | header block (eyebrow + h2) | `data-reveal` |
| Process | each `.pstep` | `data-reveal` |
| Service area | radius map graphic container | `data-reveal` |
| Service area | each area chip | `data-reveal` |
| FAQ | section `<h2>` | `data-reveal` — accordions animate via the global `details` rule, nothing to add |
| Final CTA | inner container | `data-reveal` |
| Final CTA | primary button(s) (book / call-first) | `class="ic-cta"` + `<span class="ic-sheen"></span>` first child |
| Footer / sticky mobile bar | — | nothing. Chrome never animates. |

## B. Service area pages (/service-area/*)

Same chrome hooks (promo arrow, header pulse dot). Differences by section:

| Section | Element | Hook |
|---|---|---|
| Hero | `.hero-inner` | `data-entrance` |
| Hero badge | review count | `4.9/5 · <span data-count="142">142</span> reviews…` |
| Hero | primary CTA (green call) | `class="ic-cta"` + sheen span |
| Guarantee strip | h2 + each item | `data-reveal` |
| Local challenges | section `<h2>` only | `data-reveal` — NOT the numbered rows |
| Popular services | section `<h2>` + each `.svc-card` link card | `data-reveal` |
| Process | header block + each `.pstep` | `data-reveal` |
| Why Ironclad | each `.why-item` | `data-reveal` |
| Stat strip | 4.9 and 142 | `<span data-count="4.9">4.9</span>` / `<span data-count="142">142</span>`; **24/7 stays static** (not a number) |
| Reviews | header row + each card | `data-reveal` |
| Neighborhoods | keep the existing `pulse-ring` map animation as-is; each neighborhood chip | `data-reveal` |
| Nearby areas | section `<h2>` + each `.near-card` | `data-reveal` |
| FAQ | section `<h2>` | `data-reveal` |
| Final CTA | inner container + primary buttons | `data-reveal`; `ic-cta` + sheen |

## Budgets & rules (from motion-spec.md — enforced)
1. One `data-entrance` per page (hero only). Everything below the fold is `data-reveal`.
2. Never reveal body paragraphs, numbered reading rows, nav, footer, or the sticky mobile bar.
3. Ambient motion budget per page: 1 pulse dot (header), 1 arrow nudge (promo bar), sheen on
   primary CTAs only. Ambient motion must be invisible in a static screenshot.
4. No glass shimmer (`.ic-glass`) on these templates — no glass surfaces.
5. Keep real values in markup (`142`, `4.9`) so no-JS/SEO/reduced-motion users see final state.

## QA checklist (per template)
1. OS "Reduce Motion" on → zero animation, all content visible, numbers at final value.
2. JS disabled → nothing hidden (reveal styles gate on `body.anim`).
3. Fast-scroll to footer → nothing left un-revealed; scroll back up → nothing re-hidden.
4. Client-side navigation / re-render → sections still visible and newly added ones animate
   (MutationObserver rescan); verify `window.icMotionScan` exists.
5. No CLS (transforms + opacity only); Lighthouse unaffected.
6. Mobile: identical minus hover effects; sticky bar and header never animate.
