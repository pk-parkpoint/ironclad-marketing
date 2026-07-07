# Screen: reviews-page — DESKTOP (1440)

Route: **/reviews**. A single-purpose social-proof page: hero → rating summary → review slider → booking band → review wall → final CTA. Shares all chrome (promo/header/footer) and the accent-theming knob with the service-page template.

- **Background (page):** `--color-bg-page` (#FFFFFF)
- **Page behavior:** no page-level max-width; every section centers its own container (widths below) with `28px` left/right gutters, section background colors full-bleed. Sticky: header (chrome) `top:0 z --z-header`. The mobile sticky CTA bar is **hidden** on desktop (`display:none`).
- **Reference PNG:** `reference-desktop.png` — 1440 × 3802, DPR 1, fonts loaded, slider at scroll-left 0 (cards 1–3 + peek of 4), wall masonry filled.
- **Theming:** accent = `--color-accent-primary` (#2F8FE0). The hero accent line + eyebrow + arrow glyphs + schedule buttons track it.
- **Scope:** promo/header/footer = existing site chrome, **do not rebuild** (shown for parity). Hero → Final CTA = build to spec.
- **Source:** `source-desktop.html` (REFERENCE ONLY, desktop-locked, no media queries).

---

## Layout tree

```
body  (block, width fills viewport, bg #FFFFFF)
├─ .promo-bar          [CHROME] navy #16202B strip, centered 13.5/700 text, pad 10/16
├─ header              [CHROME] white, bottom hairline #EDF1F4
│  └─ 1280 container (pad 16/32): logo(h44) · nav(4) · [outline "Schedule Now|24/7" + blue phone btn]
├─ section.hero        full-bleed #16202B + team photo (object-position 78% center) + 2 scrims
│  └─ 1240 container (flex column, align-start, pad 104/28/108)
│     ├─ GoogleRatingBadge (glass pill)
│     ├─ h1  "Water You Waiting For?" + <br> accent span "Leak No Further."  [--type-hero-title-reviews-*]
│     ├─ p   subtitle [--type-hero-sub-*, max 520]
│     └─ row(gap 14): Button/Call-green + Button/Outline-photo
├─ section.rating-summary   full-bleed sand #F6F1E9
│  └─ 1080 container (pad 72/28) → grid 2col (0.85fr 1.15fr), gap 80, align center
│     ├─ left: [big "4.9" + 5 stars + "Based on 142 Google, Nextdoor and Yelp reviews"] + p
│     └─ right: RatingBar ×5  (5★96% · 4★3% · 3★1% · 2★0% · 1★0%)
├─ section#reviews      white
│  └─ 1280 container (pad 88/28)
│     ├─ centered head (max 640): Eyebrow "142 VERIFIED REVIEWS" + h2 "What Our Customers Are Saying" [--type-title-reviews-*]
│     ├─ .slider-wrap (position relative)
│     │  ├─ SliderArrow.prev (abs left -8, vcenter)
│     │  ├─ SliderArrow.next (abs right -8, vcenter)
│     │  └─ .rev-track (flex, gap 24, overflow-x auto, scroll-snap x mandatory, pad 8/4/20) → SliderCard ×8 (flex 0 0 380)
│     └─ footer col (center, gap 20, mt 40): Button/Ink "Book your service" + GoogleAllLink
├─ section.booking-band  full-bleed #16202B, radial glow TR
│  └─ 1080 container (pad 64/28) → flex row space-between, gap 32
│     ├─ left: h2 "Ready to join them?" [--type-title-band-*] + p (max 440)
│     └─ right: row(gap 14): Button/Call-green + Button/White
├─ section.review-wall   white
│  └─ 1200 container (pad 88/28)
│     ├─ centered head (max 620): h2 "More Reviews From Around Austin" [--type-title-wall-*] + p
│     └─ CSS columns:3, column-gap 24 → WallCard ×9 (break-inside avoid, mb 24)
├─ section.final-cta     full-bleed sand #F6F1E9
│  └─ 760 container (pad 80/28, center)
│     ├─ badge pill "10% off your first service"
│     ├─ h2 "Water You Waiting For?" [--type-display-cta-*, max 560]
│     ├─ p (max 460)
│     └─ row(gap 14, center): Button/Schedule-accent + Button/White-bordered(call)
├─ footer               [CHROME] ink #0F1822, 4-col grid (1.4fr 1fr 1fr 1fr) → legal row
└─ .sticky-cta          hidden on desktop (display:none)
```

---

## Element-by-element

### §0 Chrome (promo / header / footer) — DO NOT REBUILD
Identical to service-page `spec-desktop.md` §0. Promo: navy #16202B, text 13.5/700 #FFFFFF, accent "→". Header: white, 1280 container pad 16/32, logo h44, nav links 16/600 #34414D with 13px chevron #9AA7B2, outline pill "Schedule Now | 24/7" (1.5px #D7DEE5, 15/700, pad 11/22, radius 999), blue phone pill (gradient #3D9BE9→#2F7FD1, 15/700 #FFF, pad 11/22, radius 999, shadow 0 10 22 -10 rgba(47,127,209,.8)). Footer: see §Footer below (this page ships the full 4-column footer).

### §1 Hero  (`section.hero`)
- **Section box:** full-bleed; `position:relative; overflow:hidden`; base bg `#16202B`. Min height = content. Padding: 0 (container owns it).
- **Photo:** `<img>` `assets/ironclad-team-hero.png`, `position:absolute; inset:0; width/height:100%; object-fit:cover; object-position:78% center`. Alt "The Ironclad Plumbing team beside their service truck in Austin".
- **Scrim 1 (legibility):** abs inset 0, `linear-gradient(100deg, rgba(15,23,29,.96) 0%, rgba(17,25,31,.9) 32%, rgba(17,25,31,.58) 60%, rgba(17,25,31,.18) 82%, rgba(17,25,31,.02) 100%)`.
- **Scrim 2 (accent glow):** abs inset 0, `radial-gradient(circle at 20% 40%, --color-accent-glow-20, transparent 55%)`.
- **Container:** max-width 1240, margin auto, `position:relative`, flex column, `align-items:flex-start`, padding `104px 28px 108px`.
- **GoogleRatingBadge:** glass pill — see components.md. Inline-flex, gap 11, bg `--color-glass-fill`, border 1px `--color-glass-border`, radius 999, pad `9px 17px 9px 14px`. Content: 20px Google "G" + 5×15px `--color-star-google` stars (gap 2) + text "4.9 out of 5 · 142 Google reviews" 14/600 #FFF.
- **h1:** text "Water You Waiting For?" then `<br>` then span "Leak No Further." — display family, `--type-hero-title-reviews-size-desktop` (64) / weight 800 / lh 1.02 / ls -.03em, color #FFF, `text-shadow --text-shadow-hero-title`, margin `24px 0 0`, max-width 720. Accent span color `--color-hero-accent-span` (#8CC1EE = accent 70% + white). Wrapping: balanced, breaks after "For?" via `<br>`; never truncates.
- **p subtitle:** "We're locally owned and operated. Read what hundreds of Austin homeowners say about the Ironclad team." — `--type-hero-sub-*` (19/400/1.55), color `--color-text-hero-sub` (#D2DCE5), `text-shadow --text-shadow-hero-sub`, margin `22px 0 0`, max-width 520. Wraps freely, no truncation.
- **CTA row:** flex, gap 14, margin `34px 0 0`.
  - **Button/Call-green:** href `tel:+18335971932`; `--gradient-call`, #FFF, 16/700, pad `16px 28px`, radius `--radius-hero-btn` (24), shadow `--shadow-call-lg`, 19px phone icon. Label "(833) 597-1932".
  - **Button/Outline-photo:** href `/book`; transparent, border 1.5px `--color-outline-on-photo`, #FFF, 16/700, pad `16px 28px`, radius 24. Label "Schedule Now".
- **States:** buttons — see components.md (hover/focus/active mandatory).

### §2 Rating summary  (`section.rating-summary`)
- **Section:** full-bleed `--color-surface-sand-1` (#F6F1E9). Container 1080, margin auto, pad `72px 28px`, `display:grid; grid-template-columns:0.85fr 1.15fr; gap:80px; align-items:center`.
- **Left col:**
  - Row (flex, `align-items:baseline`, gap 14): big number "4.9" — display family, `--type-summary-score-size-desktop` (108) / 800 / lh .9 / ls -.04em, color `--color-text-heading`; and a stacked block (flex column, gap 6, `padding-bottom:8`): 5×22px `--color-star-review` stars (gap 3) + meta row (inline-flex, gap 7, 14.5/600 `--color-text-muted`): 17px Google "G" + "Based on 142 Google, Nextdoor and Yelp reviews".
  - p: "Fast response, fair prices, and work done right the first time, that's what Austin keeps rating us for." — 16.5/400/1.6 `--color-text-body`, margin `22px 0 0`, max-width 400.
- **Right col:** flex column, gap 12 → **RatingBar ×5** (see components.md). Each: label (13.5/700 `--color-text-muted`, width 44) + track (flex:1, h10, radius 999, bg `--color-rating-track` #E6DECF) with fill (h100%, radius 999, bg `--color-star-review`, width = pct) + pct label (13/600 `--color-rating-pct` #94A0AB, width 40, right). Values top→bottom: 96% / 3% / 1% / 0% / 0%.

### §3 Review slider  (`section#reviews`)
- **Section:** white. Container 1280, margin auto, pad `88px 28px`.
- **Head block:** centered, max 640, margin `0 auto 52px`. Eyebrow "142 VERIFIED REVIEWS" — `--type-eyebrow-*` (13/800/ls .16em, uppercase), color `--color-accent-primary`, mb 14. h2 "What Our Customers Are Saying" — display family, `--type-title-reviews-size-desktop` (50)/800/lh 1.04/ls -.028em, `--color-text-heading`, margin 0.
- **.slider-wrap:** `position:relative`.
  - **SliderArrow.prev / .next:** 52×52 circle, bg #FFF, border 1.5px `--color-slider-arrow-border` (#E1E7EC), shadow `--shadow-slider-arrow` (0 14 30 -14 rgba(30,42,56,.4)), 22px chevron `--color-text-heading`. `.prev` abs left -8 top 50% translateY(-50%); `.next` abs right -8 same; z 5. States → components.md (hover fills navy, arrow turns white). Hidden < 640 (`.rev-arrows{display:none}`).
  - **.rev-track:** `display:flex; gap:24px; overflow-x:auto; scroll-snap-type:x mandatory; scroll-behavior:smooth; padding:8px 4px 20px`. Scrollbar hidden (`scrollbar-width:none; ::-webkit-scrollbar{display:none}`).
  - **SliderCard ×8** (see components.md), each `flex:0 0 380px; scroll-snap-align:start`. At 1280 container (1224 inner) ≈ 3 cards + gap peek of the 4th. Card: bg #FFF, border 1px `--color-border-card-cool`, radius `--radius-slider-card` (20), pad 30, shadow `--shadow-slider-card` (0 20 44 -30 rgba(30,42,56,.4)). Header row (space-between): avatar 46 circle (per-review color, initial 18/700 #FFF) + name/time stack (15.5/700 `--color-text-heading` · 12.5/400 `--color-text-review-time`) · 22px Google "G". Stars: 5×17px `--color-star-review`, gap 2, mb 14. Quote: 15/400/1.62 `--color-text-review`, no clamp (full text shown).
- **Footer block:** flex column, `align-items:center`, gap 20, margin-top 40.
  - **Button/Ink "Book your service":** bg `--color-ink-900`, #FFF, 16/600, pad `17px 30px`, radius `--radius-btn` (12), 17px accent arrow. Hover → `--color-ink-hover`, arrow translateX 3.
  - **GoogleAllLink:** href google search; inline-flex, gap 9, 14.5/600 `--color-text-muted`; 18px Google "G" + "Based on 142 Google, Nextdoor and Yelp reviews →".

### §4 Booking band  (`section.booking-band`)
- **Section:** full-bleed `--color-bg-navy` (#16202B), `position:relative; overflow:hidden`; radial glow abs `radial-gradient(circle at 85% 20%, --color-accent-glow-18, transparent 55%)`. Container 1080, margin auto, pad `64px 28px`, flex row `justify-content:space-between; align-items:center; gap:32`.
- **Left:** h2 "Ready to join them?" — display family, `--type-title-band-size-desktop` (38)/700/lh 1.08/ls -.022em, #FFF, margin 0. p "Book online in 60 seconds or call now, we answer 24/7 across Austin." — 17/400 `--color-text-band-body` (#B7C4CF), mt 12, max 440.
- **Right:** row gap 14 — Button/Call-green (radius 12 here, not 24) + Button/White (bg #FFF, `--color-text-primary`, 16/700, pad 16/28, radius 12, "Schedule Now").

### §5 Review wall  (`section.review-wall`)
- **Section:** white. Container 1200, margin auto, pad `88px 28px`.
- **Head:** centered max 620, margin `0 auto 52px`. h2 "More Reviews From Around Austin" — display family, `--type-title-wall-size-desktop` (42)/800/lh 1.06/ls -.026em, `--color-text-heading`. p "Real jobs, real neighbors, real results." — 16.5/400/1.6 `--color-text-body`, mt 16.
- **Grid:** CSS multi-column — `columns:3; column-gap:24px`. **WallCard ×9** — `break-inside:avoid; margin-bottom:24px`; bg #FFF, border 1px `--color-border-card-cool`, radius `--radius-card` (18), pad 26, shadow `--shadow-wall-card` (0 16 38 -30 rgba(30,42,56,.4)). Header (space-between): avatar 42 (color+initial 700 #FFF) + name/time (14.5/700 · 12/400) · 5×14px stars gap 1.5. Quote 14.5/400/1.62 `--color-text-review`. Masonry fills column-first (visual order differs from DOM — acceptable). No truncation.

### §6 Final CTA  (`section.final-cta`)
- **Section:** full-bleed `--color-surface-sand-1` (#F6F1E9). Container 760, margin auto, pad `80px 28px`, text-align center.
- **Badge pill:** inline-flex gap 8, bg `--color-accent-tint-14` (accent 14% / transparent), border 1px `--color-accent-border-34`, color `--color-accent-text-on-sand` (#2472B8), 13.5/700, pad `8px 16px`, radius 999. "10% off your first service".
- **h2:** "Water You Waiting For?" — display family, `--type-display-cta-size-desktop` (52)/800/lh 1.02/ls -.03em, `--color-text-heading`, margin `22px auto 0`, max 560.
- **p:** "Join hundreds of Austin homeowners who trust Ironclad. Book today." — 18/400 `--color-text-body`, margin `16px auto 32px`, max 460.
- **Button row:** flex gap 14 center — Button/Schedule-accent (bg accent, #FFF, 17/700, pad 16/30, radius 12, shadow `--shadow-accent-btn`) + Button/White-bordered (bg #FFF, border 1.5px `--color-border-cta-warm` #DCD3C3, `--color-text-primary`, 17/700, pad 16/30, radius 12, 18px phone icon, "Call (833) 597-1932").

### §Footer (chrome — do not rebuild; shown for parity)
Ink #0F1822. 1240 container pad `60px 28px 32px`, grid 4col `1.4fr 1fr 1fr 1fr` gap 40. Col1: light logo h40 + blurb 14.5/1.6 (max 280) + phone link (#FFF 18/700, accent icon) + "Available 24/7 · call or text" 13 #6E7C88. Cols 2–4: uppercase 13/700 headings ("Quick Links" / "Services" / "Service Areas") + link lists 14.5 #9DAAB6 (gap 11); last Service-Areas item "View all areas →" accent 700. Legal row: top hairline rgba(255,255,255,.08), 1240 container pad 20/28, space-between, 13 #6E7C88: "© 2026 Ironclad Plumbing. All rights reserved." · "TX Master Plumber License #M-12345".

---

## Template / content slots
Per-instance content lives in the DC arrays (`reviews` ×8, `wall` ×9, `breakdown` ×5) and the three props `accent`, `phone`, `offerText`. Copy strings quoted above are the shipped defaults. Avatar colors cycle: #1E9E5A · #2F7FD1 · #E4572E · #E0A419 · #7A4FD1.
