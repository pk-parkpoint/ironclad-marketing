# manifest.md — Ironclad Motion System Handoff v1.1
**Covers:** the sitewide motion/animation layer for ALL pages (homepage, service pages, service-area + neighborhood pages, FAQ cluster, blog). This is a system handoff, not a per-screen package: two drop-in files + spec + application guides + one live example page. Motion cannot be captured in reference PNGs; live references in the design workspace: `IP - Service Pages (PPC + Motion)` and `IP - Service Area Pages (Motion)` (the approved templates), plus `IP - FAQ Hub (Canonical)` (all 11 effects incl. underline/rotating word/glass).

| File | Purpose |
|---|---|
| manifest.md | this file |
| motion-spec.md | normative spec: all 11 effects, exact timings/easings/values, motion rules + budgets |
| ironclad-motion.css | production drop-in stylesheet (namespaced `ic-*`, reduced-motion + no-JS safe) |
| ironclad-motion.js | production drop-in script v1.1 (vanilla, defer, attribute-driven; SPA-safe: `window.icMotionScan()`, auto-rescan on DOM changes, `data-icr` reveal persistence) |
| usage.md | install + per-page-type markup recipes + QA checklist |
| implementation-service-pages.md | **exact hook map** for Service pages (PPC template) and Service Area pages — element-by-element |
| example-service-page.html | self-contained live export of the Service page reference (open in a browser; includes the variant-switcher preview control, which is not part of the production page) |

## Key guarantees
1. `prefers-reduced-motion: reduce` → zero motion, all content in final state (underline shown, counts at value).
2. No JS → no motion AND no hidden content (reveal styles gate on `body.anim`, added by JS).
3. Transforms/opacity only (no layout thrash, no CLS); accordions are the one height animation and are progressive enhancement.
4. Namespaced (`ic-*`, `data-reveal`, `data-entrance`, `data-count`, `data-rotate`) — safe to drop into the existing codebase.
5. v1.1: safe under client-side re-renders (React/Next) — revealed content can never fade back out or stay hidden after a re-render.

## Design decisions locked in review
- **No underline draw** (`.ic-underline`) on service / service-area heroes — FAQ hub only.
- No glass shimmer on service / service-area templates.

## AUDIT RESULT
(a) Integrity: all seven files present and self-contained; CSS/JS pair verified against the working service-page implementation (same timings, easings, behaviors).
(b) Not fully specifiable: none — every effect has exact CSS/JS in the drop-in files, and both templates have element-level hook maps.
(c) No gaps.
