# usage.md — applying the motion system across the site

## Install (once, sitewide)
```html
<link rel="stylesheet" href="/css/ironclad-motion.css">
<script src="/js/ironclad-motion.js" defer></script>
```
No per-page JS. All wiring is markup attributes/classes. The stylesheet reads the page's existing
`--accent` variable for the underline color.

## Sitewide chrome (every page)
- Promo bar arrow: `<span class="ic-nudge">→</span>`
- Header "Schedule Now | 24/7" pill: prepend `<span class="ic-pulse-dot"></span>`
- Primary CTA buttons (hero + CTA bands): add `.ic-cta` and `<span class="ic-sheen"></span>` as first child
- All `<details>` accordions: nothing to do — the global rule smooths them

## Per page type

### Homepage / main site
- Hero inner container: `data-entrance`
- Headline pun/key phrase: `<span class="ic-underline">…</span>` (e.g. the "hold water." pun)
- Optional rotating word in hero sub: `about <span class="ic-rot"><span data-rotate='["leaks","clogs","water heaters","weak pressure","high bills"]'>leaks</span></span>`
- Service card grid, review grid, guarantee items, CTA band inner: `data-reveal` per card/block
- Stats (rating, review count, years): `<span data-count="4.9">4.9</span>` etc.

### Service pages (/plumbing/*)
- Hero inner: `data-entrance`; key benefit phrase: `.ic-underline`
- Process steps, pricing cards, FAQ section header, related-services cards: `data-reveal`
- Trust stats: `data-count`

### Service area + neighborhood pages
- Hero inner: `data-entrance` (badge → h1 → intro → trust row → CTAs cascade)
- Review badge count "142": `data-count="142"`
- Guarantee items, numbered issue rows' section header, service cards, review cards, nearby cards, final CTA inner: `data-reveal`
- Keep the existing `pulse-ring` map graphic; do not add shimmer here (no glass surfaces)

### FAQ cluster (hub / topics / posts)
- Hub already carries the reference implementation (see the design file) — replicate exactly:
  entrance + underline + rotating word + count-up in hero; glass cards get `.ic-glass`;
  topic cards `data-reveal`.
- Topic pages: `data-entrance` on hero; jump-index block and CTA band `data-reveal`
  (NOT each of the 18 Q&A rows — too much motion on a reading page)
- Posts: `data-entrance` on hero; quick-answer bolt svg gets `.ic-pulse-icon`;
  steps/list blocks and related section `data-reveal`

### Blog posts
- Hero `data-entrance`; quick-answer bolt `.ic-pulse-icon`; carousel + CTA band `data-reveal`

## QA checklist
1. Toggle OS "Reduce Motion": page shows everything instantly, underline visible, numbers at final value, zero animation.
2. Disable JS: no hidden content anywhere (reveal styles require `body.anim`).
3. Scroll fast to the footer: nothing left un-revealed (threshold .15 + stagger caps at 180ms).
4. Lighthouse: no CLS from entrance/reveals (transforms + opacity only — never animate height/margin except accordions).
5. Ambient effects (sheen, dots, nudge) are invisible in a static screenshot.
6. Mobile: shimmer is hover-only (inert on touch); everything else identical.
