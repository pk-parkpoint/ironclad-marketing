# Animations & Interactions — Ironclad Service Page Template

Every transition, hover, scroll effect, and micro-interaction. Token names from `tokens.css`.

**Legend:** rows marked **[as-designed]** exist in the approved comp. Rows marked **[PRESCRIBED]** are required for a production web build (focus-visible, filled-button hover, and the two scroll effects the static reference resolves to their end-state). Reference PNGs are captured in the **resting/resolved** state (service card not hovered, FAQ item 1 open, stats at final values, reveals shown).

| ID | Section / Component | Trigger | Property | From → To | Duration / Easing (token) | Exact CSS |
|---|---|---|---|---|---|---|
| card-lift | ServiceCard | hover | transform, box-shadow | `translateY(0)`, `--shadow-card` → `translateY(-4px)`, `--shadow-card-hover` | `--motion-card` (.2s ease ×2) | `.svc-card{transition:transform .2s ease,box-shadow .2s ease} .svc-card:hover{transform:translateY(-4px);box-shadow:0 28px 52px -30px rgba(30,42,56,.55)}` **[as-designed]** |
| card-title | ServiceCard title | hover (on card) | color | `--color-text-heading` → `--color-accent-primary` | `--motion-svc-title` (.18s ease) | `.svc-title{transition:color .18s ease} .svc-card:hover .svc-title{color:var(--color-accent-primary)}` **[as-designed]** |
| ink-btn | Button (Ink) | hover | background-color | `--color-ink-900` → `--color-ink-hover` | `--motion-ink-btn` (.2s ease) | `.ink-btn{transition:background .2s ease} .ink-btn:hover{background:#0F1822}` **[as-designed]** |
| ink-arrow | Button (Ink) trailing arrow | hover (on button) | transform | `translateX(0)` → `translateX(3px)` | `--motion-arrow` (.2s ease) | `.btn-arrow{transition:transform .2s ease} .ink-btn:hover .btn-arrow{transform:translateX(3px)}` **[as-designed]** |
| why-indent | WhyItem | hover | padding-left | `4px` → `14px` | `--motion-why-item` (.2s ease) | `.why-item{transition:padding-left .2s ease} .why-item:hover{padding-left:14px}` **[as-designed]** |
| why-title | WhyItem heading | hover (on item) | color | `#FFFFFF` → `--color-accent-on-white-hover` | instant (no transition in comp) | `.why-item:hover h3{color:color-mix(in srgb,var(--color-accent-primary) 55%,#fff)}` **[as-designed]** |
| faq-chevron | FAQItem chevron | open/close | transform (rotate) | `rotate(0)` → `rotate(180deg)` | `--motion-chevron` (.25s ease) | `svg.chev{transition:transform .25s ease} details[open] summary svg.chev{transform:rotate(180deg)}` **[as-designed]** |
| faq-toggle | FAQItem body | open/close | display (native) | hidden ↔ shown | instant (no height animation) | native `<details>`; JS closes siblings — see below **[as-designed]** |
| area-pulse | Service-area radar | always (loop) | transform (scale), opacity | `scale(.55)`, `opacity .65` → `scale(1.7)`, `opacity 0` | `--motion-pulse` (3s ease-out infinite) | keyframes below; gated by `prefers-reduced-motion` **[as-designed]** |
| stat-count | StatCell numbers | scroll into view | textContent (number) | `0` → target (142 · 4.9 · 19+) | ~1200ms ease-out (prescribe) | JS count-up — see timing table **[PRESCRIBED]** |
| reveal | guarantee items, review cards, area chips, area graphic | scroll into view | opacity, transform | `0`, `translateY(12px)` → `1`, `translateY(0)` | ~450ms ease-out, stagger ~70ms | JS/IntersectionObserver — see below **[PRESCRIBED]** |
| btn-hover-filled | Button (Call / Schedule / White) | hover | filter | `brightness(1)` → `brightness(.95)` | `--dur-base` ease | `transition:filter .2s ease; :hover{filter:brightness(.95)}` **[PRESCRIBED]** |
| btn-hover-outline | Button (Outline, hero) | hover | border-color, background | `rgba(255,255,255,.55)`, transparent → `#FFFFFF`, `rgba(255,255,255,.08)` | `--dur-base` ease | **[PRESCRIBED]** |
| btn-active | Button (all) | active/press | transform | `translateY(0)` → `translateY(1px)` | `--dur-fast` ease | **[PRESCRIBED]** |
| focus-ring | every interactive `<a>`/`<summary>` | focus-visible | outline | none → `2px solid --color-accent-primary`, offset 2px (FAQ: inset -2px; on-navy: white) | none | `:focus-visible{outline:2px solid var(--color-accent-primary);outline-offset:2px}` **[PRESCRIBED]** |
| link-hover | InlineLink ("Read all reviews →", etc.) | hover | text-decoration | none → underline | `--dur-fast` | `a.inline:hover{text-decoration:underline}` **[PRESCRIBED]** |

---

## Keyframes (written out)

```css
/* area-pulse — expanding ring behind the "Austin" map pin */
@keyframes pulsering {
  0%   { transform: scale(.55); opacity: .65; }
  100% { transform: scale(1.7);  opacity: 0;   }
}
@media (prefers-reduced-motion: no-preference) {
  .pulse-ring { animation: pulsering 3s ease-out infinite; }
}
/* When reduced motion is preferred, the ring simply does not animate (static). */
```

No other `@keyframes` exist. Card/button/FAQ/why effects are all CSS `transition`s (above).

---

## JS-driven motion

### stat-count  [PRESCRIBED]
When the stat strip enters the viewport (IntersectionObserver, threshold ~0.4), animate each number from 0 to its target, once.

| Stat | Start | End | Decimals | Suffix | Duration | Easing |
|---|---|---|---|---|---|---|
| Reviews | 0 | 142 | 0 | — | 1200ms | ease-out (e.g. `easeOutCubic`) |
| Rating | 0 | 4.9 | 1 | — | 1200ms | ease-out |
| Areas Served | 0 | 19 | 0 | `+` | 1200ms | ease-out |

Respect `prefers-reduced-motion: reduce` → render final values immediately (no tween). Reference PNG shows final values.

### reveal  [PRESCRIBED]
Elements carrying `data-reveal` inside a `data-reveal-group` fade/slide in when the group scrolls into view, staggered by DOM order.

- Per element: `opacity 0 → 1`, `transform: translateY(12px) → translateY(0)`.
- Duration ~450ms, easing ease-out.
- Stagger ~70ms between siblings in the same group.
- Fire once (do not reverse on scroll out).
- Groups: guarantee items (4), review cards (3), service-area chips (12), service-area radar graphic (1).
- Respect `prefers-reduced-motion: reduce` → show final state immediately (this is exactly what the reference PNGs show).

### faq-toggle behavior (accordion)  [as-designed]
```js
const items = [...document.querySelectorAll('details.faq-item')];
items[0].open = true;                        // first open on load
items.forEach(d => d.addEventListener('toggle', () => {
  if (d.open) items.forEach(o => { if (o !== d) o.open = false; });  // one at a time
}));
```
Progressive enhancement: without JS the native `<details>` still work (independently). The chevron rotation is pure CSS (`faq-chevron`).

---

## Screens with no motion
Signs list, process steps, footer, promo bar/header are **static** apart from the shared button/link hover+focus states above. No section is fully bare of the global focus-ring requirement.
