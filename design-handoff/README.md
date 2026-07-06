# Ironclad — Service Page Template · Web Engineering Handoff

**Date:** 2026-07-06 · **Reference instance:** Drain Cleaning · **Formats:** desktop web (1440) + mobile web (390)

This page is the **template for every service**. Build it once; per-service content is swapped via the `data-slot="…"` hooks (see any spec's *Template slots*). The brand **accent** (`--color-accent-primary`, Drain Cleaning = `#2F8FE0`) is the single re-theming knob.

> **Scope:** Engineering **keeps the existing site nav bar and footer**. The **promo bar, header/nav, and footer are OUT OF SCOPE** — they appear in the reference PNGs for parity only and are marked `[CHROME]` in the specs. **Everything between the header and footer is new** and is fully specced to rebuild.

---

## Package contents

```
tokens.css        — single source of truth (colors, gradients, type, spacing, radius, shadow, z, motion)
fonts.md          — families, weights, sources, fallbacks (⚠ Hanken Grotesk is loaded-but-unused)
components.md     — shared components + ALL states (hover/focus-visible/active/disabled/N-A)
responsive.md     — breakpoints (640/820/1080/1240) + reflow for every width 390→beyond 1440
animations.md     — every transition/interaction + keyframes + JS timing tables
screens/service-page/
  spec-desktop.md       — element-by-element redline @1440
  spec-mobile.md        — element-by-element redline @390
  reference-desktop.png — 1440 × 7181, DPR 1, full page (ground truth)
  reference-mobile.png  — 390 × 11741, DPR 1, full page (ground truth)
  source-desktop.html   — REFERENCE ONLY responsive build (holes filled, loops expanded)
  source-mobile.html    — REFERENCE ONLY (identical responsive document)
  assets/ironclad-team-hero.png — hero photo (1821×864)
```

**How to use:** implement from `tokens.css` + the two `spec-*.md`; treat the `reference-*.png` as the diff target; consult `source-*.html` only to disambiguate DOM order/structure (do **not** copy its markup — it's a flat static render of a component system).

**Note on the source HTML:** it is a **single responsive document** (one DOM serves both widths). `source-desktop.html` and `source-mobile.html` are intentionally identical; the layout switches at the breakpoints in `responsive.md`.

---

## SELF-AUDIT

1. **Every artboard element appears in both spec files with complete measurements.** ✓ Hero, Guarantee, Signs, Services, Reviews, Why-Ironclad, Stat strip, Process, Service-area, FAQ, Final CTA, Sticky bar — all present in `spec-desktop.md` and `spec-mobile.md` with box/padding/type/token values written out in full in each (no "same as desktop").
2. **Every visual value exists in `tokens.css` and is referenced by name in the specs.** ✓ Colors, gradients, all ~30 type styles (with -desktop/-mobile variants and clamp endpoints), spacing/rhythm clamps, radii, shadows, z-index, motion. One-off box paddings appear as raw px per the handoff's allowed exception.
3. **Every interactive element has hover / focus-visible / active / disabled (or explicit N/A).** ✓ In `components.md`: Button (5 variants), ServiceCard, WhyItem, FAQItem, InlineLink carry full state rows; StarRating / GuaranteeItem / SignRow / ProcessStep / StatCell / AreaChip / Eyebrow / ImageSlot marked static → N/A.
4. **Every motion effect has a row in `animations.md`; every width 390→beyond 1440 has defined behavior in `responsive.md`.** ✓ 18 interaction rows + keyframes + JS timing tables; breakpoints 640/820/1080/1240 with per-section column counts and the beyond-1440 centering/full-bleed rule.
5. **Rebuild-with-zero-guesses bar.** Met for layout, color, type, spacing, and reflow. The four items below required a documented decision rather than a silent guess; each is called out inline in the files and summarized next.

---

## AUDIT RESULT

**Items that could not be extracted verbatim from the static comp (and how they were resolved):**

1. **Focus-visible + filled-button hover states.** The approved comp is static and defines hover only for the Ink button (+ its arrow), the service card, the why-item, and the FAQ chevron. Production web requires a visible focus ring on every interactive control and hover feedback on filled buttons. These are specced as **[PRESCRIBED]** in `components.md`/`animations.md` (accent 2px focus ring; `brightness(.95)` on filled hover; `translateY(1px)` active; underline on inline-link hover). Confirm these match brand preference — they are the one place the build will differ from the static reference PNGs (by design; the PNGs show resting states).

2. **Scroll-in reveal + stat count-up.** The design system marks guarantee items, review cards, area chips, the radar graphic (`data-reveal`) and the stat numbers (`data-count-to`) for on-scroll animation, but the exact durations/stagger were runtime-driven and not fixed in the comp. Specced as **[PRESCRIBED]** timing (reveal ~450ms/70ms stagger; count-up ~1200ms ease-out) with `prefers-reduced-motion` fallbacks. Reference PNGs show the resolved end-state. Adjust timings to taste — they don't affect layout.

3. **Hanken Grotesk is loaded but unused.** The page requests Hanken Grotesk yet nothing references it; body copy uses the OS system stack, headings use Schibsted Grotesk. Built/documented **as-is** (system body). Decision needed: drop the Hanken load, or intentionally move body copy to Hanken (would reflow). See `fonts.md`.

4. **System-font body → cross-OS text variance.** Body text renders in San Francisco (macOS, as captured), Segoe UI (Windows), etc. Automated screenshot diffing on a non-macOS runner will show minor sub-pixel differences in body copy — expected, not a defect. Headings (Schibsted Grotesk, web font) are stable across OS.

5. **Reference-PNG capture method (transparency note).** The tooling preview is a 924×540 viewport, so the full-page 1440/390 references were produced by rendering a fixed-width build with `clamp()` resolved to px at each target width and stitching viewport tiles. They are true 1440×7181 and 390×11741 at DPR 1 and match the specs. The `clamp()` **tokens remain fluid in production** — the resolved px in `tokens.css` comments are the values at exactly 390 and 1440 (i.e., the diff targets).

Aside from the five documented decisions above — each surfaced inline and requiring only brand confirmation, not reverse-engineering — **no gaps**: an engineer with only this package can rebuild both formats.
