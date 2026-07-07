# Screen: reviews-page — MOBILE (390)

Route: **/reviews**. Same sections as desktop, single-column stack, plus a fixed bottom sticky call/book bar. Chrome shares the service-page mobile chrome.

- **Background (page):** `--color-bg-page` (#FFFFFF)
- **Page behavior:** body 390 wide; every section is full-width with `20px` left/right gutters. Sticky: header (chrome) `top:0`; `.sticky-cta` **fixed bottom** `z --z-sticky-cta` (60). No horizontal scroll except the review slider (intentional swipe).
- **Reference PNG:** `reference-mobile.png` — 390 × 4663, DPR 1, fonts loaded, slider at scroll 0 (card 1 + peek of 2).
- **Scope:** promo/header/footer = existing site chrome, **do not rebuild**. Hero → Final CTA = build to spec.
- **Source:** `source-mobile.html` (REFERENCE ONLY, mobile-locked, no media queries).

---

## Layout tree

```
body  (block, width 390, bg #FFFFFF)
├─ .promo-bar          [CHROME] navy, centered 13/700, pad 10/16
├─ header              [CHROME] white, pad 12/16: logo(h34) · blue phone pill (nav + outline hidden)
├─ section.hero        full-bleed #16202B + team photo (object-position 72% center) + vertical scrim
│  └─ pad 56/20/60, flex column align-start
│     ├─ GoogleRatingBadge (compact: "4.9 · 142 reviews")
│     ├─ h1 "Water You Waiting For?" <br> accent "Leak No Further." [44]
│     ├─ p subtitle
│     └─ CTA col (full-width, gap 12): Button/Call-green + Button/Outline-photo
├─ section.rating-summary  sand #F6F1E9, pad 48/20, center
│  ├─ score row (center): "4.9" (80) + [5 stars + "Based on 142 Google, Nextdoor and Yelp reviews"]
│  ├─ p (max 340, center)
│  └─ RatingBar ×5 (max 340, centered)
├─ section#reviews      white, pad 56/20
│  ├─ centered head: Eyebrow + h2 "What Our Customers Are Saying" [34]
│  ├─ .rev-track (flex, gap 16, overflow-x auto, snap x) → SliderCard ×8 (flex 0 0 300, snap center) — NO arrows
│  └─ footer col (center, gap 18): Button/Ink + GoogleAllLink (wraps)
├─ section.booking-band  #16202B, pad 44/20
│  ├─ h2 "Ready to join them?" [28]
│  ├─ p
│  └─ CTA col (gap 12): Button/Call-green + Button/White
├─ section.review-wall   white, pad 56/20/88
│  ├─ centered head: h2 "More Reviews From Around Austin" [30] + p
│  └─ flex column, gap 16 → WallCard ×5 (single column; slice of the 9)
├─ section.final-cta     sand #F6F1E9, pad 52/20, center
│  ├─ badge pill
│  ├─ h2 "Water You Waiting For?" [36]
│  ├─ p
│  └─ CTA col (gap 12): Button/Schedule-accent + Button/White-bordered(call)
├─ footer               [CHROME] ink, single-column stack (logo/blurb/phone → 3 link groups) → legal stack
└─ .sticky-cta          FIXED bottom, 2 buttons (Call-green + Schedule-accent), pad 10/14, gap 10
```

---

## Element-by-element

### §0 Chrome (promo / header / footer) — DO NOT REBUILD
Promo identical to desktop but text 13px. Header: white, pad `12px 16px`, space-between: logo h34 + blue phone pill (14/700, pad 10/16, radius 999) — nav + outline "Schedule Now" are `display:none` < 640. Footer: single-column (see §Footer).

### §1 Hero  (`section.hero`)
- **Section:** full-bleed, `position:relative; overflow:hidden`, bg #16202B.
- **Photo:** same asset, `object-fit:cover; object-position:72% center` (tighter crop keeps faces in frame at portrait ratio).
- **Scrim:** single vertical `linear-gradient(180deg, rgba(15,23,29,.7) 0%, rgba(17,25,31,.82) 55%, rgba(17,25,31,.95) 100%)` — darker at the bottom where copy sits (mobile stacks text over the lower photo).
- **Container:** pad `56px 20px 60px`, flex column align-start.
- **GoogleRatingBadge (compact):** inline-flex gap 9, glass bg/border, radius 999, pad `8px 14px 8px 12px`: 18px Google "G" + "4.9 · 142 reviews" 12.5/600 #FFF. (Star row omitted at this width.)
- **h1:** display family, `--type-hero-title-reviews-size-mobile` (44)/800/lh 1.02/ls -.03em, #FFF, margin `20px 0 0`. Accent span "Leak No Further." color #8CC1EE. `<br>` forced break retained.
- **p:** 16.5/400/1.55 `--color-text-hero-sub`, margin `18px 0 0`. Full width.
- **CTA col:** flex column, gap 12, width 100%, margin `26px 0 0`. Both buttons full-width (`justify-content:center`), pad `15px 24px`, radius 24. Call-green (gradient + 18px icon + "(833) 597-1932") then Outline-photo ("Schedule Now").

### §2 Rating summary  (`section.rating-summary`)
- **Section:** sand #F6F1E9, pad `48px 20px`, text-align center.
- **Score row:** flex `justify-content:center; align-items:baseline; gap:12`: "4.9" display 80/800/lh .9/ls -.04em `--color-text-heading` + left-aligned stack (gap 6): 5×20px `--color-star-review` stars + meta (15px Google "G" + "Based on 142 Google, Nextdoor and Yelp reviews" 13/600 `--color-text-muted`).
- **p:** 15.5/400/1.6 `--color-text-body`, margin `20px auto 0`, max 340.
- **RatingBar ×5:** flex column gap 11, max 340, margin `26px auto 0`. Same structure as desktop; label width 42, pct width 36.

### §3 Review slider  (`section#reviews`)
- **Section:** white, pad `56px 20px`.
- **Head:** centered, mb 32. Eyebrow "142 VERIFIED REVIEWS" 12.5/800/ls .16em uppercase accent, mb 12. h2 display `--type-title-reviews-size-mobile` (34)/800/lh 1.04/ls -.028em `--color-text-heading`.
- **.rev-track:** flex, gap 16, `overflow-x:auto; scroll-snap-type:x mandatory; -webkit-overflow-scrolling:touch`, pad `6px 0 18px`, scrollbar hidden. **SliderCard ×8** `flex:0 0 300px; scroll-snap-align:center`. Card pad 26; avatar 44; name 15/700; time 12; stars 5×16px; quote 14.5/400/1.62. **No arrow buttons** (swipe only).
- **Footer col:** center, gap 18. Button/Ink "Book your service" (16/600, pad 16/28, radius 12). GoogleAllLink (13.5/600 `--color-text-muted`, 16px "G", text-align center, may wrap to 2 lines).

### §4 Booking band  (`section.booking-band`)
- **Section:** #16202B, pad `44px 20px` (glow omitted at mobile).
- **h2:** display `--type-title-band-size-mobile` (28)/700/lh 1.08/ls -.022em #FFF.
- **p:** 16/400 `--color-text-band-body`, mt 12.
- **CTA col:** flex column gap 12, mt 24. Call-green (full-width, radius 12) + White (full-width, radius 12).

### §5 Review wall  (`section.review-wall`)
- **Section:** white, pad `56px 20px 88px` (extra bottom clears the fixed sticky bar).
- **Head:** centered, mb 32. h2 display `--type-title-wall-size-mobile` (30)/800/lh 1.06/ls -.026em. p 15.5/400/1.6.
- **List:** flex column, gap 16 → **WallCard ×5** (single column; first 5 of the 9-card set: Brian H., Nicole F., Tom S., Carlos M., Frank O.). Card pad 24, radius 18, avatar 42, name 14.5/700, quote 14.5/400/1.62.

### §6 Final CTA  (`section.final-cta`)
- **Section:** sand #F6F1E9, pad `52px 20px`, center.
- **Badge pill:** as desktop, 13/700.
- **h2:** display `--type-display-cta-size-mobile` (36)/800/lh 1.02/ls -.03em `--color-text-heading`, margin `20px auto 0`.
- **p:** 16.5/400 `--color-text-body`, margin `14px auto 28px`.
- **CTA col:** flex column gap 12. Schedule-accent (full-width, 16.5/700, radius 12) + White-bordered call (full-width, border 1.5px #DCD3C3, 16.5/700, 17px icon).

### §Footer (chrome — do not rebuild)
Ink #0F1822, pad `48px 20px 28px`, flex column gap 34: logo block (h38 logo + blurb + phone 18/700 + 24/7 note), then the three link groups stacked (each: uppercase 13/700 heading + link column gap 11, 14.5). Legal: top hairline, pad 20, flex column gap 8, 12.5 #6E7C88 (copyright then license).

### §Sticky CTA  (`.sticky-cta`) — BUILD
Fixed bottom, full-width, z 60, bg #FFF, top border 1px `--color-border-sticky` (#E6EBF0), shadow `--shadow-sticky-bar`, pad `10px 14px`, flex gap 10. Two equal buttons (`flex:1`): Call-green (gradient, 15.5/700, radius 12, 16px icon, "(833) 597-1932") + Schedule-accent (bg accent, 15.5/700, radius 12, "Schedule Now").

---

## Reflow from desktop (see responsive.md §reviews-page)
- Hero photo crop 78%→72% object-position; scrim swaps left→right for top→bottom.
- Rating summary: 2-col grid → centered single column (bars centered, max 340).
- Slider: card 380→300, gap 24→16, snap start→center, **arrows hidden**.
- Booking band + all CTA rows: horizontal → vertical stack, buttons full-width.
- Wall: `columns:3` → single flex column, **9 cards → 5** shown.
- Sticky CTA appears (fixed bottom); footer 4-col → single column.
