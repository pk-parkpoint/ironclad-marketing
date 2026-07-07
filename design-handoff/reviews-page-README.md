# Ironclad — /reviews page · Engineering Handoff (self-contained)

This package is **complete and offline** — every referenced doc, spec, source, reference image, and asset is inside this folder. Nothing points outside it.

```
reviews-page-handoff/
├─ README.md              ← you are here
├─ tokens.css            ← design tokens (single source of truth) incl. REVIEWS PAGE ADDITIONS block
├─ fonts.md              ← Schibsted Grotesk (headings/numerals) + system stack (body)
├─ components.md         ← chrome/buttons + REVIEWS PAGE COMPONENTS (RatingBar, SliderCard, SliderArrow, WallCard)
├─ animations.md         ← global states + REVIEWS PAGE MOTION table
├─ responsive.md         ← §5 Reviews page reflow (390 · 640 · 820 · 960 · 1440)
├─ assets/
│  ├─ ironclad-team-hero.png    (1821×864) hero photo
│  ├─ ironclad-logo-dark.png    header lockup, navy wordmark (light backgrounds)
│  ├─ ironclad-logo-light.png   footer lockup, white wordmark (dark backgrounds)
│  └─ ironclad-mark.png         circular wave mark only
└─ screens/reviews-page/
   ├─ spec-desktop.md   redline @1440
   ├─ spec-mobile.md    redline @390
   ├─ source-desktop.html   REFERENCE ONLY — desktop-locked, local asset paths
   ├─ source-mobile.html    REFERENCE ONLY — mobile-locked, local asset paths
   ├─ reference-desktop.png 1440 × 3806, fonts loaded, logos render
   └─ reference-mobile.png  390 × 4660, fonts loaded, logos render
```

## Resolved review feedback

Every item flagged in the prior review is addressed here:

1. **Root handoff files (tokens.css, fonts.md, components.md, responsive.md, animations.md)** — now bundled at package root. These already existed in the repo at `handoff/`; the earlier download was scoped to the screen subfolder only, so they weren't included. Fixed.
2. **`assets/` directory** — bundled at package root with the hero, both logo lockups, and the mark.
3. **Referenced hero asset `ironclad-team-hero.png`** — included.
4. **Broken logo images in reference PNGs** — the source files previously pointed at remote production SVGs (`ironcladtexas.com/media/logo/…`) that don't load offline. The bundled source files now reference **local** logo lockups (`assets/ironclad-logo-dark.png` for the white-bg header, `ironclad-logo-light.png` for the dark footer), and both reference PNGs were re-rendered with them loading correctly. These local lockups are stand-ins built from the brand mark for a self-contained preview — **production should keep using the real vector logos**; do not ship these PNGs to prod.
5. **Repo handoff docs were booking-wizard, not reviews-page** — this package is reviews-page-specific and standalone; ignore the booking-wizard folder for this screen.
6. **Mobile sticky-CTA vs. full-page screenshot conflict** — clarified. The sticky bar is `position:fixed; bottom:0` in the running page; in the full-page `reference-mobile.png` it is captured **once at the very bottom** of the scroll (it does not repeat per viewport). The `review-wall` section carries ~68px extra bottom padding so live content is never hidden behind it. Spec: `spec-mobile.md` §Sticky CTA + `responsive.md` §5.
7. **Raster-soft / upscaled references** — the PNGs here are re-rendered cleaner. They remain layout/color ground-truth. For **byte-exact CI diffing**, re-render the format-locked sources at true device sizes:
   ```
   # desktop
   playwright screenshot --viewport-size=1440,3806 --full-page \
     screens/reviews-page/source-desktop.html reference-desktop.png
   # mobile
   playwright screenshot --viewport-size=390,4660 --full-page \
     screens/reviews-page/source-mobile.html reference-mobile.png
   ```
   The sources are media-query-free (format-locked) precisely so each renders its target format at any viewport.

## Theming
One knob: `--color-accent-primary` (#2F8FE0) recolors the hero accent line, eyebrow, slider/CTA arrows, and Schedule/accent buttons. Call buttons stay green.

## Chrome
Promo bar, header, footer = existing site components, shown for parity. **Build hero → final CTA + the mobile sticky bar; do not rebuild chrome.**
