# Screen: service-page — MOBILE (390)

Reference instance: **Drain Cleaning**. Template for every service (per-service slots identical to desktop — see §Template slots at the end of `spec-desktop.md`; the same `data-slot` values apply here).

- **Background (page):** `--color-bg-page` (#FFFFFF)
- **Page behavior:** single scroll column; each section centers its container with `28px` left/right gutters **except the hero**, which uses `20px` gutters at this width. Section background colors full-bleed. The **sticky call/book bar is VISIBLE** (fixed, bottom, z 60) — reserve ~68px bottom space so it doesn't cover the footer. Header (chrome) collapses to logo + phone button (nav hidden).
- **Reference PNG:** `reference-mobile.png` — 390 × 11741, DPR 1, fonts loaded, FAQ item 1 open, stats final, reveals resolved, sticky bar shown at page end.
- **Scope:** §0 chrome = existing site, **do not rebuild**. §1–§10 = build to spec. All values written in full (do not infer from the desktop file).

---

## Layout tree

```
#dc-root (block, 390 wide)
├─ .promo-bar           [CHROME] navy strip, centered
├─ header              [CHROME] sticky z40: logo(34) + blue phone btn  (nav + outline btn hidden)
├─ section#hero-section         full-bleed navy + photo + scrims
│  └─ .hero-inner (flex column, align-start, pad 52/20/60)
│     ├─ Google rating badge (glass pill)
│     ├─ h1 (37px)
│     ├─ p (subtitle, <br> suppressed)
│     ├─ trust row (wraps: 2 items)
│     └─ .hero-ctas (column, each button full-width)
├─ div#guarantees               full-bleed navy → grid 2-col
│  └─ container pad --space-section-y(=48)/28 → h2(center) + GuaranteeItem ×4 (2 col)
├─ section SIGNS (white)  container pad --space-section-y-lg(=52)/28
│  ├─ h2(32) + p intro(17.5)
│  ├─ SignRow ×4  (grid 56px 1fr, pad 22/2)
│  └─ .signs-callout (navy) : icon+text ; Call button FULL-WIDTH below
├─ section SERVICES (sand) container pad 52/28
│  ├─ h2(32) + p intro
│  ├─ .svc-grid 1-col → ServiceCard ×6
│  └─ Button/Ink
├─ section#reviews (white) pad --space-section-y(=48)/28
│  ├─ header (h2+meta ; InlineLink wraps below)
│  └─ .reviews-grid 1-col → ReviewCard ×3
├─ section WHY (ink) full-bleed
│  ├─ .why-split 1-col: Eyebrow+h2(40)+p , then WhyItem ×4
│  └─ .stat-strip 1-col (horizontal dividers) → StatCell ×3
├─ section PROCESS (navy) pad 56/28
│  ├─ Eyebrow + h2(40)
│  └─ .prow 1-col → ProcessStep ×4
├─ section#areas (white) pad 48/28
│  └─ .area-split 1-col: radar graphic ABOVE copy(h2+p+chips12+Button)
├─ section FAQ (sand) 840→full container pad 48/28 → h2(center) + FAQItem ×6
├─ section FINAL CTA (navy) pad 48/28 center → badge + h2(30) + p + buttons(wrap)
├─ footer              [CHROME] 1-col
└─ .sticky-cta         FIXED bottom, z60: Call(green) + Schedule(accent), 2× flex:1
```

---

## Element-by-element  (mobile values, in full)

### §0 CHROME — promo / header / footer  *(existing site; do not rebuild)*
Reference-only. Header at ≤640: `nav` `display:none`; outline "Schedule Now" `display:none`; logo `height:34px`; header container `padding:12px 16px; gap:14px`; blue phone pill `padding:10px 16px; font-size:14px`. Footer grid collapses to **1 column**, gap 34; legal row wraps. Promo bar unchanged (navy, centered, 13.5/600, pad 10/16).

### §Hero  (`#hero-section`)
- **Section:** full-bleed; `position:relative; overflow:hidden`; `background:--gradient-hero-base`.
- **Photo `data-slot="hero-image"`:** absolute inset:0; cover; `object-position:72% center`; asset `assets/ironclad-team-hero.png`.
- **Scrim 1:** `--gradient-hero-scrim`. **Scrim 2:** `radial-gradient(circle at 22% 36%, --color-accent-glow-18, transparent 55%)`.
- **`.hero-inner`:** `max-width:1240; margin:0 auto; padding:52px 20px 60px; display:flex; flex-direction:column; align-items:flex-start; pointer-events:none`.
- **Google rating badge:** `display:inline-flex; align-items:center; gap:11px; background:--color-glass-fill; border:1px solid --color-glass-border; backdrop-filter:blur(8px); border-radius:--radius-pill; padding:9px 16px 9px 14px; pointer-events:auto`. 22px Google G + `StarRating` (5×15 gold) + "4.9 out of 5 · 142 reviews" 14/600 `#fff` + 15px chevron `--color-hero-badge-chevron`. (Badge may extend toward the right edge; it does not wrap.)
- **h1:** "Fast, Expert Drain Cleaning in Austin"; **font-size 37px** (hard override), weight 800, lh 1.06, ls -0.025em, `#fff`; `margin:22px 0 0`; `max-width:600px`; `text-wrap:balance`; `text-shadow:--text-shadow-hero-title`. Wraps to ~4 lines.
- **p (subtitle):** same text as desktop; `--type-hero-sub-*` (18/1.55) `--color-text-hero-sub`; `margin:20px 0 0`; `max-width:500px`; **the `<br>` is suppressed (`display:none`)** so it wraps by width; `text-shadow:--text-shadow-hero-sub`.
- **Trust row:** `display:flex; gap:10px 22px; flex-wrap:wrap; margin:26px 0 0`; two items (17px icon `#fff` + 14/600 `#fff`): "Locally Owned & Operated", "Licensed & Insured". May wrap to 2 lines at 390.
- **`.hero-ctas`:** `display:flex; gap:14px; margin:32px 0 0; flex-wrap:wrap; pointer-events:auto; width:100%`. Each child `flex:1 1 100%; justify-content:center` → **full-width, stacked**: Button/Call-green ("(833) 597-1932", 19px icon, radius 24, pad 16/28) on top; Button/Outline ("Schedule Now", radius 24, pad 16/28) below.

### §1 Guarantee strip  (`#guarantees`)
- **Box:** full-bleed `--color-bg-navy`; inner container `margin:0 auto; padding:48px 28px` (`--space-section-y`=48 at 390).
- **h2:** "Our Ironclad Guarantee" `--type-title-md-size-mobile` (30) /700 `#fff` center `margin:0 0 28px` (`--space-heading-gap`=28) `text-wrap:balance`.
- **`.guarantee-grid`:** `display:grid; grid-template-columns:1fr 1fr; gap:24px 14px` (the ≤640 gap). **GuaranteeItem ×4** in 2×2. Labels allowed to wrap (`.g-label{white-space:normal}`); label 17/700 `#fff` lh1.3; proof 13.5 `--color-text-guarantee-proof` lh1.45. Same 4 label/proof pairs as desktop.

### §2 Signs
- **Section:** `#FFFFFF`; container `padding:52px 28px` (`--space-section-y-lg`=52).
- **h2 `signs-title`:** 32px (`--type-title-lg-size-mobile`) /700 `--color-text-heading` `margin:0` `text-wrap:balance`.
- **p `signs-intro`:** 17.5/1.65 `--color-text-body` `margin:18px 0 0; max-width:700px` (wraps full width here).
- **List:** `margin-top:34px` (`--space-block-gap`=34) `border-top:1px solid --color-border-sand`. **SignRow ×4:** grid `56px 1fr`, gap `12px 18px`, padding `22px 2px`, bottom hairline. Number `--type-sign-number-size-mobile` (34) accent tabular-nums; h3 20px (`--type-sign-title-size-mobile`) /600; p 16/1.6 `--color-text-body` (max-width 660 but effectively full column). Titles as desktop.
- **`.signs-callout`:** `margin-top:30px` (`--space-callout-gap`=30) `background:--color-bg-navy; border-radius:--radius-card; padding:22px; display:flex; align-items:center; justify-content:space-between; gap:20px; flex-wrap:wrap`. Left group wraps above; icon box 48×48 `--radius-icon-box` `--color-accent-tint-22` + 23px warning icon accent; title 17/700 `#fff`; sub 15 `--color-text-on-dark-body-2`. **Button/Call-green: `width:100%; justify-content:center`** (drops full-width below the text), "Call (833) 597-1932", 18px icon, radius 12, pad `14px 26px`, shadow `--shadow-call-md`.

### §3 Services
- **Section:** `--color-surface-sand-1`; container `padding:52px 28px`.
- **h2 `services-title`:** 32/700 `--color-text-heading` `text-wrap:balance`.
- **p `services-intro`:** 17.5/1.65 `--color-text-body` `margin:18px 0 0; max-width:700px`.
- **`.svc-grid`:** `display:grid; grid-template-columns:1fr; gap:22px; margin-top:34px`. **ServiceCard ×6** stacked (image 16/10 on top, text below, pad `22px 24px 26px`). Titles/bodies as desktop.
- **Button/Ink:** wrapper `margin-top:30px` (`--space-inkbtn-gap`=30); "Schedule drain cleaning" + accent arrow; radius 10, pad `16px 26px`.

### §4 Reviews  (`#reviews`)
- **Section:** container `padding:48px 28px` (white).
- **Header row:** `display:flex; align-items:flex-end; justify-content:space-between; gap:24px; flex-wrap:wrap`. At 390 the **InlineLink wraps below** the title block. h2 "Austin Homeowners Trust Ironclad" 30/700 `--color-text-heading` `margin:0 0 8px`; meta "4.9 / 5 · 142 Google reviews" 15.5/600 `--color-text-muted`; InlineLink "Read all reviews →".
- **`.reviews-grid`:** `display:grid; grid-template-columns:1fr; gap:22px; margin:42px 0 0`. **ReviewCard ×3** stacked (pad 28; quote flex:1; footer avatar 40 + name 14.5/700 + time 12.5 `--color-text-review-time`).

### §5 Why-Ironclad
- **Section:** full-bleed `--color-bg-ink`; radial glow `circle at 15% 0%, --color-accent-glow-20, transparent 48%`.
- **Inner container:** `padding:56px 28px 52px` (`--space-section-y-why-top`=56, bottom `--space-section-y-why-bot`=52).
- **`.why-split`:** `display:grid; grid-template-columns:1fr; gap:36px` (single column; **left column NOT sticky at this width**). 
  - **Left:** Eyebrow "The Ironclad Difference" (rule + 13/800 uppercase `--color-accent-eyebrow-on-black`); h2 "Why Austin Calls Ironclad" **40px** (`--type-display-why-size-mobile`) /700 lh1.0 ls-0.03 `#fff` `margin:0 0 22px` `text-wrap:balance`; p 17/1.6 `--color-text-on-dark-body` max 400.
  - **Right list:** `border-bottom:1px solid rgba(255,255,255,.10)` → **WhyItem ×4** (grid `auto 1fr`, gap 24, pad `28px 4px`, top hairline). Number 20/700 accent; h3 **21px** (`--type-why-title-size-mobile`) /700 `#fff`; p 15/1.55 `--color-text-on-dark-body` max 440. Titles as desktop.
- **`.stat-strip`:** `background:--color-accent-primary; display:grid; grid-template-columns:1fr` (**stacked**); dividers become **horizontal top-borders** `--color-divider-stat-mobile` between cells. **StatCell ×3**: number `--type-stat-number-size-mobile` (58) `#fff`; label 13.5/700 uppercase ls.14em `--color-stat-label-on-accent` margin-top 14. Cell pad `34px 24px` (`--space-stat-cell-y`=34). Values 142/Reviews, 4.9/Rating, 19+/Areas Served.

### §6 Process
- **Section:** full-bleed `--color-bg-navy-process`; radial glow `circle at 88% -10%, --color-accent-glow-16, transparent 55%`.
- **Inner:** `padding:56px 28px` (`--space-section-y-process`=56).
- **Header:** `margin-bottom:40px` (`--space-process-hd-gap`=40). Eyebrow "Our Process" (`--color-accent-eyebrow-on-navy`) + h2 "What to Expect" **40px** (`--type-display-process-size-mobile`) /700 `#fff` `text-wrap:balance`.
- **`.prow`:** `display:grid; grid-template-columns:1fr; gap:40px` (stacked). **ProcessStep ×4:** top rule 2px `rgba(255,255,255,.16)`, accent dot, number `--type-process-number-size-mobile` (54), h3 21/700 `#fff`, p 15/1.6 `--color-text-on-dark-body-2`. Titles as desktop.

### §7 Service-area  (`#areas`)
- **Section:** container `padding:48px 28px` (white).
- **`.area-split`:** `display:grid; grid-template-columns:1fr; gap:54px` — **radar graphic stacks ABOVE the copy**.
  - **Radar graphic:** `position:relative; aspect-ratio:1/1` (full column width, ~334px). Rings 88%/62% `1px solid --color-border-ring`; 36% dashed `--color-accent-ring-dashed`; `.pulse-ring` 36% `--color-accent-glow-18` (animated unless reduced-motion); 4 dots 9px `--color-text-map-dot`; center 54px accent circle (shadow `--shadow-accent-pin`) + 26px pin `#fff` + "Austin" 14/800 `--color-text-primary`.
  - **Copy:** h2 `areas-title` "Drain Cleaning in Austin and Nearby Areas" 30/700 `--color-text-heading` `margin:0 0 10px` `text-wrap:balance`; p "Same-day drain cleaning across Austin and the surrounding metro." 16 `--color-text-muted` `margin:0 0 26px` max 520; chips `display:flex; flex-wrap:wrap; gap:10px; margin-bottom:30px` → **AreaChip ×12** (same list); **Button/Schedule-accent** "Schedule Drain Cleaning Near You" radius 12 pad `14px 28px` shadow `--shadow-accent-btn-2` (wraps text if needed; not forced full-width).

### §8 FAQ
- **Section:** full-bleed `--color-surface-sand-2`; inner 840-max container `padding:48px 28px` (effectively full width at 390).
- **h2:** "Drain Cleaning FAQ" 30/700 center `--color-text-heading` `margin:0 0 28px`.
- **List:** `display:flex; flex-direction:column; gap:12px` → **FAQItem ×6** (item 1 `open`). Summary pad `20px 22px`, question 16.5/700 `--color-text-primary`, chevron 20px accent; answer pad `0 22px 22px`, 15/1.64 `--color-text-body-2`.

### §9 Final CTA
- **Section:** full-bleed `--color-bg-navy`; inner 760-max container `padding:48px 28px; text-align:center`.
- **Badge:** `display:inline-flex; align-items:center; gap:8px; background:--color-accent-glow-16; border:1px solid --color-accent-border-40; color:#fff; 13.5/700 ls.02em; padding:8px 16px; border-radius:--radius-pill`. "10% off your first service".
- **h2 `cta-title`:** "Ready to Clear Your Drain?" 30/700 `#fff` `margin:22px auto 0` max 560 `text-wrap:balance`.
- **p:** "Book online in 60 seconds or call for fast drain cleaning in Austin." 18 `--color-text-cta-sub` `margin:16px auto 30px` max 480.
- **Button row:** `display:flex; gap:14px; justify-content:center; flex-wrap:wrap` → **Button/Schedule-accent** ("Schedule Drain Cleaning", 17/700, radius 12, pad `16px 30px`, shadow `--shadow-accent-btn`) then **Button/White** ("Call (833) 597-1932", 18px icon, `--color-text-primary`, radius 12, pad `16px 30px`). At 390 they typically **stack** (wrap) centered.

### §10 Sticky call/book bar  (mobile only — VISIBLE here)
- `position:fixed; left:0; right:0; bottom:0; z-index:--z-sticky-cta (60); background:#fff; border-top:1px solid --color-border-sticky; box-shadow:--shadow-sticky-bar; padding:10px 14px; gap:10px; display:flex`.
- Two children, each `flex:1; min-width:0; white-space:nowrap; border-radius:--radius-btn (12); padding:14px 8px; justify-content:center`: **Call** (`--gradient-call`, "(833) 597-1932", 17px phone icon, `#fff`, 15.5/700) + **Schedule** (`--color-accent-primary`, "Schedule Online", `#fff`, 15.5/700).
- Persistent while scrolling. Add ~68px bottom padding to the page so the footer clears it.

---

## Template slots
Same per-service slots as desktop — see `spec-desktop.md` §Template slots. Accent color re-themeable; all accent-derived tokens follow.
