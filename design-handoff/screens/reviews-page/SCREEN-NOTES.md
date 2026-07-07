# reviews-page — engineering handoff

Route: **/reviews** — Ironclad's social-proof page (hero → rating summary → review slider → booking band → review wall → final CTA).

## Files
```
spec-desktop.md        redline, 1440
spec-mobile.md         redline, 390
source-desktop.html    REFERENCE ONLY — desktop-locked (no media queries), renders the 1440 format
source-mobile.html     REFERENCE ONLY — mobile-locked (no media queries), renders the 390 format
reference-desktop.png  1440 × 3802, DPR 1, fonts loaded (ground truth)
reference-mobile.png   390 × 4663, DPR 1, fonts loaded (ground truth)
```

## Shared package (at `handoff/` root — this screen extends, does not fork it)
- `tokens.css` — single source of truth. Reviews-only values live in the **"REVIEWS PAGE ADDITIONS"** block at the end (hero headline sizes, rating-summary, slider, wall, slider-arrow, accent-on-sand tints).
- `components.md` — reused chrome/buttons/GoogleRatingBadge/InlineLink, plus the **"REVIEWS PAGE COMPONENTS"** section (RatingBar, SliderCard, SliderArrow, WallCard).
- `animations.md` — global button/link states + **"REVIEWS PAGE MOTION"** table (card hover, arrow hover/focus, scroll-snap slider).
- `responsive.md` — **§5 Reviews page** reflow table (390 · 640 · 820 · 960 · 1440 + beyond).
- `fonts.md` — unchanged. This screen uses **Schibsted Grotesk** (400–800, Google Fonts) for all headings/numerals and the **OS system stack** for body. Hanken Grotesk is NOT used here (drop its load on this route).

## Theming
One knob: `--color-accent-primary` (#2F8FE0). It recolors the hero accent line (`--color-hero-accent-span`), eyebrow, slider/CTA arrows, and all Schedule/accent buttons. Call button stays green (`--gradient-call`).

## Chrome
Promo bar, header, and footer are existing site components — shown in the source/PNGs for parity only. **Do not rebuild.** Build hero → final CTA + the mobile sticky bar.

## Production notes
- Reviews content is data-driven: `reviews` ×8 (slider), `wall` ×9 (wall, mobile shows 5), `breakdown` ×5 (bars). Avatar colors cycle green/blue/red/amber/purple.
- The slider is a native `scroll-snap` carousel; arrows call `scrollBy` (one card) and are progressive enhancement (swipe works with JS off). No autoplay.
- The live/production artifact is a single responsive file (`Reviews Page.dc.html` in project root); the two source-*.html here are format-locked extractions for deterministic diffing.

---

## AUDIT RESULT

- **Both artboards present:** 1440 (`reference-desktop.png`, 3802 tall) and 390 (`reference-mobile.png`, 4663 tall), generated from the format-locked source files with fonts loaded. ✔
- **Fonts:** all real/loadable — Schibsted Grotesk (Google Fonts, 400/500/600/700/800) + system stack. No web-unsafe font used. ✔
- **Every value tokenized:** all new colors/type/radii/shadows/motion added to `tokens.css` (REVIEWS PAGE ADDITIONS) and referenced by name in the specs. ✔
- **All interactive elements have hover + focus-visible (+ active) rows or explicit N/A:** SliderCard, SliderArrow, WallCard, and reused buttons/links in `components.md`. ✔
- **Every motion effect has a row** in animations.md; **every width 390→beyond-1440** has defined behavior in responsive.md §5. ✔

**Known deviations / notes (not gaps):**
1. **Wall masonry order** — `columns:3` lays cards out column-first, so on desktop the visual top-to-bottom order differs from DOM order. Intentional; DOM order is the mobile order (first 5 shown). If strict visual order matters, switch to a JS masonry or CSS grid `grid-auto-flow:dense` — flagged for the engineer's choice.
2. **Reference PNGs** were rendered in this environment via full-node capture (desktop up-scaled from a zoom-to-fit stitch); they are pixel-faithful to layout/color but the desktop PNG is very slightly soft. For byte-exact diffing, re-render `source-desktop.html` at a true 1440 viewport and `source-mobile.html` at 390, DPR 1 — the source files are format-locked precisely so this reproduces the specs.
3. **Hero `<br>`** forces the "Water You Waiting For?" / "Leak No Further." split at all widths; the headline never relies on natural wrapping.

No other gaps.
