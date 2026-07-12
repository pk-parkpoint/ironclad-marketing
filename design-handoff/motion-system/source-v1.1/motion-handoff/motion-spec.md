# motion-spec.md — Ironclad Motion System v1.0

The site's motion language in one table. Everything is implemented in the two drop-in files
(`ironclad-motion.css` + `ironclad-motion.js`); this table is the normative spec. Live demo of
all effects: the FAQ Hub design (`IP - FAQ Hub (Canonical)` in the design workspace); the bolt
pulse is on the Running Toilet post; smooth accordions on the local pages.

**Signature easing:** `cubic-bezier(.22,.61,.36,1)` (--ic-ease) — a confident ease-out. Never bounce, never overshoot.

| # | Effect | Trigger | Property | From → To | Duration / Delay / Easing | Markup hook |
|---|---|---|---|---|---|---|
| 1 | Scroll reveal | enters viewport (15% threshold) | opacity, translateY | 0, 14px → 1, 0 | .6s / stagger (col-index % 3) × 90ms / --ic-ease | `data-reveal` |
| 2 | Hero entrance cascade | page load | opacity, translateY | 0, 16px → 1, 0 | .65s / children 0/.1/.2/.3/.4s / --ic-ease | `data-entrance` on hero inner |
| 3 | Count-up | enters viewport (40%) | textContent | 0 → value | 1.1s / cubic ease-out (1−(1−k)³) | `data-count="200"` |
| 4 | Rotating word | interval | translateY, opacity, wrapper width | out ↑115% / in from ↓115% | .35s flip / 2.6s cycle / --ic-ease; width .3s ease | `.ic-rot > [data-rotate='[...]']` |
| 5 | Underline draw (pun) | load (after hero settles) | scaleX | 0 → 1, origin left | .8s / .8s delay / --ic-ease; bar 5px, radius 3px, accent color | `.ic-underline` around the phrase |
| 6a | CTA sheen | ambient loop | translateX (skewed light band) | −140% → 340% | sweep in last ~18% of a 6s cycle / 3s initial delay | `.ic-cta > .ic-sheen` |
| 6b | CTA press | :active | scale | 1 → .98 | .15s ease | `.ic-cta` |
| 7 | Accordion open/close | details toggle | block-size, content-visibility | 0 ↔ auto | .35s ease (Chromium 131+; others snap) | global `details` rule |
| 8 | Icon pulse | load | scale | 1 → 1.4 → 1 | .8s × 2 beats / 1.2s delay | `.ic-pulse-icon` on svg |
| 9 | Live pulse dot | ambient loop | ring scale, opacity | .7/.65 → 2.6/0 | 2.6s ease-out infinite; dot #34A853 7px | `.ic-pulse-dot` |
| 10 | Glass shimmer | hover + mousemove | radial highlight position, opacity | follows cursor; 0 → 1 | opacity .25s ease; 220px radius, white 16% | `.ic-glass` (shine auto-injected) |
| 11 | Promo arrow nudge | ambient loop | translateX | 0 → 4px → 1px → 0 | nudge inside a 4s cycle / 2s initial delay | `.ic-nudge` on the arrow span |

## Rules
1. **Reduced motion:** every effect is inside `@media (prefers-reduced-motion: no-preference)` and/or gated by the JS bail-out. Opted-out users see final states instantly (underline shown, numbers at value, content visible).
2. **No-JS:** content is never hidden without JS — reveal/entrance styles only apply under `body.anim`, which JS adds.
3. **One entrance per page:** `data-entrance` on the hero only. Everything below the fold uses `data-reveal`.
4. **Reveal budget:** section headers, card grids, CTA bands. Do NOT reveal body paragraphs, footers, or nav — chrome never animates in.
5. **Ambient budget:** at most one sheen (primary CTA), one pulse dot (header), one arrow nudge (promo bar) per page. Ambient motion must be invisible on a screenshot.
6. **Durations:** nothing over 0.8s except the 6s ambient cycles; interaction feedback ≤ 200ms.
