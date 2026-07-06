# Screen: service-page — DESKTOP (1440)

Reference instance: **Drain Cleaning**. This page is the **template for every service** — content slots that change per service are tagged `data-slot="…"` in `source-desktop.html` and listed in §Template slots. Structure, chrome, and all styling are fixed across services.

- **Background (page):** `--color-bg-page` (#FFFFFF)
- **Page behavior:** no page-level max-width; each section centers its own container (widths below) with `28px` left/right gutters. Section background colors are full-bleed. Sticky: header (chrome) `top:0 z --z-header`; why-ironclad left column `position:sticky; top:40px`. The mobile sticky CTA bar is **hidden** on desktop.
- **Reference PNG:** `reference-desktop.png` — 1440 × 7181, DPR 1, fonts loaded, FAQ item 1 open, stats at final values, reveals resolved.
- **Scope:** §0 chrome (promo/header/footer) = existing site, **do not rebuild** (shown for context/parity). §1–§10 = build to spec.

---

## Layout tree

```
#dc-root  (block, width fills viewport, --accent:#2F8FE0)
├─ .promo-bar            [CHROME] navy strip, centered text
├─ header               [CHROME] sticky, z 40, white, bottom hairline
│  └─ 1280 container: logo · nav · (outline btn + blue phone btn)
├─ section#hero-section          full-bleed navy gradient + team photo + scrims
│  └─ .hero-inner  (1240, flex column, align-start, pad 96/28/100)
│     ├─ Google rating badge (glass pill)
│     ├─ h1   [--type-hero-title-* desktop]
│     ├─ p    [--type-hero-sub-*]
│     ├─ trust row (2 items: Locally Owned, Licensed & Insured)
│     └─ .hero-ctas (row: Button/Call-green + Button/Outline)
├─ div#guarantees                full-bleed navy (#16202B)
│  └─ 1240 container (pad --space-section-y / 28)
│     ├─ h2 "Our Ironclad Guarantee"  [--type-title-md-*, center]
│     └─ .guarantee-grid (4 col, gap 26)  → GuaranteeItem ×4
├─ section (white) SIGNS
│  └─ 1140 container (pad --space-section-y-lg / 28)
│     ├─ h2 "Signs You Need Drain Cleaning" [--type-title-lg-*]
│     ├─ p intro [--type-body-lg-*, max 700]
│     ├─ list (border-top hairline) → SignRow ×4
│     └─ .signs-callout (navy card) : icon + text + Button/Call-green
├─ section (sand #F6F1E9) SERVICES
│  └─ 1180 container (pad --space-section-y-lg / 28)
│     ├─ h2 "Our Drain Cleaning Services" [--type-title-lg-*]
│     ├─ p intro [--type-body-lg-*, max 700]
│     ├─ .svc-grid (3 col, gap 22) → ServiceCard ×6
│     └─ Button/Ink "Schedule drain cleaning"
├─ section#reviews (white)  1200 container (pad --space-section-y / 28)
│  ├─ header row: (h2 + meta) left · InlineLink right
│  └─ .reviews-grid (3 col, gap 22) → ReviewCard ×3
├─ section (ink #12181F) WHY  full-bleed, radial glow TL
│  ├─ 1240 container (pad top/bottom fluid) → .why-split (1fr 1.25fr, gap fluid)
│  │  ├─ left (sticky top:40): Eyebrow + h2 "Why Austin Calls Ironclad" + p
│  │  └─ right: WhyItem ×4 (top/bottom hairlines)
│  └─ .stat-strip (accent bg, 3 col) → StatCell ×3
├─ section (navy #1E2A38) PROCESS  full-bleed, radial glow TR
│  └─ 1240 container (pad --space-section-y-process / 28)
│     ├─ header: Eyebrow + h2 "What to Expect"
│     └─ .prow (4 col, gap 40) → ProcessStep ×4
├─ section#areas (white)  1160 container (pad --space-section-y / 28)
│  └─ .area-split (0.85fr 1.15fr, gap 54, align center)
│     ├─ radar graphic (aspect 1/1)
│     └─ copy: h2 + p + chips(12) + Button/Schedule-accent
├─ section (sand #F3EDE3) FAQ  840 container (pad --space-section-y / 28)
│  ├─ h2 "Drain Cleaning FAQ" [--type-title-md-*, center]
│  └─ column (gap 12) → FAQItem ×6  (item 1 open)
├─ section (navy #16202B) FINAL CTA  760 container (pad --space-section-y / 28, center)
│  ├─ badge pill "10% off your first service"
│  ├─ h2 "Ready to Clear Your Drain?"
│  ├─ p
│  └─ button row: Button/Schedule-accent + Button/White(call)
├─ footer               [CHROME] ink #0F1822, 4-col → legal row
└─ .sticky-cta          hidden on desktop (display:none >820)
```

---

## Element-by-element

Token refs only; one-off box dims/paddings not on the scale are raw px (allowed). Components are referenced by name (full definitions + states in `components.md`).

### §0 CHROME — promo / header / footer  *(existing site; do not rebuild)*
Shown in the reference for parity. If you must match: promo bar `background:#16202B; color:#fff; text-align:center; font 13.5px/600; padding:10px 16px`; arrow glyph `→` in `--color-accent-primary`. Header sticky `z 40`, white, `border-bottom:1px solid #EDF1F4`, 1280 container `padding:16px 32px`, `display:flex; justify-content:space-between; gap:32px`; logo img h44; nav links 16px/600 `#34414D` gap 34 with 13px chevrons `#9AA7B2`; outline "Schedule Now | 24/7" pill `border:1.5px solid #D7DEE5`, 15px/700, pad `11px 22px`; blue phone pill `linear-gradient(180deg,#3D9BE9,#2F7FD1)`, 15px/700, pad `11px 22px`, shadow `0 10px 22px -10px rgba(47,127,209,.8)`. Footer: see spec-mobile §0 note; identical grid but 4-col here.

### §Hero  (`#hero-section`)
- **Section box:** full-bleed; `position:relative; overflow:hidden`; background `--gradient-hero-base`. Padding: 0 (inner handles it).
- **Photo `<img data-slot="hero-image">`:** absolute `inset:0`; `width/height:100%`; `object-fit:cover`; `object-position:72% center`. Asset `assets/ironclad-team-hero.png` (1821×864). Alt = team description.
- **Scrim 1:** absolute inset:0; `--gradient-hero-scrim`; `pointer-events:none`.
- **Scrim 2 (accent glow):** absolute inset:0; `radial-gradient(circle at 22% 36%, --color-accent-glow-18, transparent 55%)`; `pointer-events:none`.
- **`.hero-inner`:** `position:relative; max-width:--maxw-hero (1240); margin:0 auto; padding:96px 28px 100px`; `display:flex; flex-direction:column; align-items:flex-start`; `pointer-events:none` (children that are interactive re-enable `pointer-events:auto`).
- **Google rating badge:** `display:inline-flex; align-items:center; gap:11px`; `background:--color-glass-fill; border:1px solid --color-glass-border; backdrop-filter:blur(8px); border-radius:--radius-pill; padding:9px 16px 9px 14px; pointer-events:auto`. Contents: 22px Google "G" (4-color), `StarRating` (5 × 15px gold), text "4.9 out of 5 · 142 reviews" `--type-hero-badge-*` (14/600) `#fff`, trailing 15px chevron `--color-hero-badge-chevron`.
- **h1:** text "Fast, Expert Drain Cleaning in Austin"; `--type-hero-title-size-desktop` (50px) / weight 800 / lh 1.06 / ls -0.025em; color `#fff`; `margin:22px 0 0`; `max-width:600px`; `text-wrap:balance`; `text-shadow:--text-shadow-hero-title`. Wraps to ~3 lines; no truncation.
- **p (subtitle):** "24/7 help from our licensed plumbers, with clear pricing `<br>`and an ironclad warranty"; `--type-hero-sub-*` (18/1.55); color `--color-text-hero-sub`; `margin:20px 0 0`; `max-width:500px`; `text-shadow:--text-shadow-hero-sub`. **Desktop keeps the `<br>`** (two balanced lines).
- **Trust row:** `display:flex; gap:10px 22px; flex-wrap:wrap; margin:26px 0 0`. Two items, each `display:flex; align-items:center; gap:8px`: 17px icon (house / shield-check, `stroke:#fff`) + label `--type-hero-trust-*` (14/600) `#fff`. Labels: "Locally Owned & Operated", "Licensed & Insured".
- **`.hero-ctas`:** `display:flex; align-items:center; gap:14px; margin:32px 0 0; flex-wrap:wrap; pointer-events:auto`. Children: **Button/Call-green** (label = `{{phone}}` "(833) 597-1932", 19px phone icon, radius 24, pad 16/28, shadow `--shadow-call-lg`) + **Button/Outline** ("Schedule Now", radius 24, pad 16/28).

### §1 Guarantee strip  (`#guarantees`)
- **Box:** full-bleed `background:--color-bg-navy`. Inner 1240 container `margin:0 auto; padding:--space-section-y 28px`.
- **h2:** "Our Ironclad Guarantee"; `--type-title-md-*` (40/700 desktop) `#fff`; `text-align:center`; `margin:0 0 --space-heading-gap`; `text-wrap:balance`.
- **`.guarantee-grid`:** `display:grid; grid-template-columns:repeat(4,1fr); gap:26px`. Children: **GuaranteeItem ×4** (shield icon 30px accent; label 17/700 white nowrap; proof 13.5 `--color-text-guarantee-proof`). Labels/proofs: (1) "Fixed Right the First Time" / "If it comes back, so do we." (2) "Upfront Pricing, No Surprises" / "You approve the price before we start." (3) "On Time or We Call Ahead" / "Late means a call, every time." (4) "Written Warranty on Every Job" / "In writing, not just a handshake."

### §2 Signs
- **Section:** `background:#FFFFFF`. Inner 1140 container `padding:--space-section-y-lg 28px`.
- **h2 `data-slot="signs-title"`:** "Signs You Need Drain Cleaning"; `--type-title-lg-*` (46/700) `--color-text-heading`; `margin:0`; `text-wrap:balance`.
- **p `data-slot="signs-intro"`:** `--type-body-lg-*` (17.5/1.65) `--color-text-body`; `margin:18px 0 0`; `max-width:700px`. Wraps freely, no truncation. (Full text in source.)
- **List wrapper:** `margin-top:--space-block-gap; border-top:1px solid --color-border-sand`. Children: **SignRow ×4** (grid `110px 1fr`, pad `28px 6px`, bottom hairline). Number `--type-sign-number-*` (46) accent tabular-nums; h3 `--type-sign-title-*` (24/600); p 16/1.6 `--color-text-body` max 660. Titles: "Water drains slowly", "The same clog keeps coming back", "Gurgling sounds or sewer smells", "More than one drain backs up at once".
- **`.signs-callout`:** `margin-top:--space-callout-gap; background:--color-bg-navy; border-radius:--radius-card; padding:26px 30px; display:flex; align-items:center; justify-content:space-between; gap:20px; flex-wrap:wrap`. Left group: 48×48 icon box `border-radius:--radius-icon-box; background:--color-accent-tint-22` + warning-triangle 23px accent; then title "Seeing these signs, or backing up right now?" `--type-callout-title-*` (17/700) `#fff` + sub "We answer 24/7 and offer same-day drain cleaning across Austin." `--type-callout-sub-*` (15) `--color-text-on-dark-body-2`. Right: **Button/Call-green** ("Call (833) 597-1932", 18px icon, radius 12, pad `14px 26px`, shadow `--shadow-call-md`, `flex:none`).

### §3 Services
- **Section:** `background:--color-surface-sand-1` (#F6F1E9). Inner 1180 container `padding:--space-section-y-lg 28px`.
- **h2 `data-slot="services-title"`:** "Our Drain Cleaning Services"; `--type-title-lg-*` (46) `--color-text-heading`; `text-wrap:balance`.
- **p `data-slot="services-intro"`:** `--type-body-lg-*` `--color-text-body`; `margin:18px 0 0; max-width:700px`.
- **`.svc-grid`:** `display:grid; grid-template-columns:repeat(3,1fr); gap:22px; margin-top:--space-block-gap`. **ServiceCard ×6** (see component). Titles: "Kitchen & bathroom sink drains", "Shower, tub & floor drains", "Toilet & fixture clogs", "Main line & sewer clogs", "Hydro jetting", "Sewer camera inspection". Each image = ImageSlot 16/10.
- **Button/Ink:** wrapper `margin-top:--space-inkbtn-gap`; label "Schedule drain cleaning" + trailing accent arrow; radius 10, pad `16px 26px`.

### §4 Reviews  (`#reviews`)
- **Section:** 1200 container `margin:0 auto; padding:--space-section-y 28px` (white page bg).
- **Header row:** `display:flex; align-items:flex-end; justify-content:space-between; gap:24px; flex-wrap:wrap`. Left: h2 "Austin Homeowners Trust Ironclad" `--type-title-md-*` (40) `--color-text-heading` `margin:0 0 8px` + meta "4.9 / 5 · 142 Google reviews" `--type-review-meta-*` (15.5/600) `--color-text-muted`. Right: **InlineLink** "Read all reviews →".
- **`.reviews-grid`:** `display:grid; grid-template-columns:repeat(3,1fr); gap:22px; margin:42px 0 0`. **ReviewCard ×3** (Mike R. / John D. / Sarah M.; see component for structure; quotes in source).

### §5 Why-Ironclad
- **Section:** full-bleed `background:--color-bg-ink` (#12181F); `position:relative; overflow:hidden`. Radial glow: absolute inset:0 `radial-gradient(circle at 15% 0%, --color-accent-glow-20, transparent 48%)`.
- **Inner 1240 container:** `padding: --space-section-y-why-top 28px --space-section-y-why-bot`.
- **`.why-split`:** `display:grid; grid-template-columns:1fr 1.25fr; gap:--space-why-col-gap; align-items:start`.
  - **Left (sticky top:40):** Eyebrow "The Ironclad Difference" (rule + 13/800 uppercase `--color-accent-eyebrow-on-black`); h2 "Why Austin Calls Ironclad" `--type-display-why-*` (68/700, lh1.0, ls-0.03) `#fff` `margin:0 0 22px` `text-wrap:balance`; p "Anyone can clear a clog. We're built so you never have to make this call twice." 17/1.6 `--color-text-on-dark-body` max 400.
  - **Right:** wrapper `border-bottom:1px solid rgba(255,255,255,.10)` → **WhyItem ×4** (grid `auto 1fr`, gap 24, pad `28px 4px`, top hairline). Number 20/700 accent; h3 `--type-why-title-*` (27) `#fff`; p 15/1.55 `--color-text-on-dark-body` max 440. Titles: "4.9 Stars on Google", "Licensed & Insured", "Locally Owned", "24/7 Emergency Service".
- **`.stat-strip`:** `position:relative; background:--color-accent-primary; display:grid; grid-template-columns:repeat(3,1fr)`; column dividers `--color-divider-stat-desktop`. **StatCell ×3**: number `--type-stat-number-*` (100.8) `#fff`; label `--type-stat-label-*` uppercase `--color-stat-label-on-accent`. Values 142 "Reviews", 4.9 "Rating", 19+ "Areas Served". Cell pad `--space-stat-cell-y 24px`. (Count-up on scroll — animations.md.)

### §6 Process
- **Section:** full-bleed `background:--color-bg-navy-process` (#1E2A38); `position:relative; overflow:hidden`. Radial glow: `radial-gradient(circle at 88% -10%, --color-accent-glow-16, transparent 55%)`.
- **Inner 1240:** `padding:--space-section-y-process 28px`.
- **Header:** `margin-bottom:--space-process-hd-gap`. Eyebrow "Our Process" (`--color-accent-eyebrow-on-navy`) + h2 "What to Expect" `--type-display-process-*` (64) `#fff` `text-wrap:balance`.
- **`.prow`:** `display:grid; grid-template-columns:repeat(4,1fr); gap:40px`. **ProcessStep ×4** (top rule 2px `rgba(255,255,255,.16)`, accent dot, number `--type-process-number-*` (66.24), h3 21/700, p 15/1.6 `--color-text-on-dark-body-2`). Titles: "Book in 60 seconds", "We diagnose on site", "We clear the blockage", "We test and tell you straight".

### §7 Service-area  (`#areas`)
- **Section:** 1160 container `margin:0 auto; padding:--space-section-y 28px` (white).
- **`.area-split`:** `display:grid; grid-template-columns:0.85fr 1.15fr; gap:54px; align-items:center`.
  - **Radar graphic (left):** `position:relative; aspect-ratio:1/1; display:flex; align-items:center; justify-content:center`. Rings: 88% & 62% circles `border:1px solid --color-border-ring`; 36% dashed `border:1px dashed --color-accent-ring-dashed`; `.pulse-ring` 36% `background:--color-accent-glow-18` (animated). 4 dots 9px `--color-text-map-dot` at TL/TR/BL/BR positions. Center: 54px accent circle (shadow `--shadow-accent-pin`) with 26px location-pin icon `#fff`, + label "Austin" 14/800 `--color-text-primary`.
  - **Copy (right):** h2 `data-slot="areas-title"` "Drain Cleaning in Austin and Nearby Areas" `--type-title-md-*` (40) `margin:0 0 10px` `text-wrap:balance`; p "Same-day drain cleaning across Austin and the surrounding metro." 16 `--color-text-muted` `margin:0 0 26px` max 520; chip wrap `display:flex; flex-wrap:wrap; gap:10px; margin-bottom:30px` → **AreaChip ×12** (Austin, Round Rock, Cedar Park, Pflugerville, Georgetown, Leander, Lakeway, Bee Cave, Buda, Kyle, Hutto, Dripping Springs); **Button/Schedule-accent** "Schedule Drain Cleaning Near You" (radius 12, pad `14px 28px`, shadow `--shadow-accent-btn-2`).

### §8 FAQ
- **Section:** full-bleed `background:--color-surface-sand-2` (#F3EDE3). Inner 840 container `padding:--space-section-y 28px`.
- **h2:** "Drain Cleaning FAQ" `--type-title-md-*` (40) center `--color-text-heading` `margin:0 0 --space-heading-gap`.
- **List:** `display:flex; flex-direction:column; gap:12px` → **FAQItem ×6** (item 1 `open`). Questions in source; answers 15/1.64 `--color-text-body-2`.

### §9 Final CTA
- **Section:** full-bleed `background:--color-bg-navy` (#16202B). Inner 760 container `padding:--space-section-y 28px; text-align:center`.
- **Badge:** `display:inline-flex; align-items:center; gap:8px; background:--color-accent-glow-16; border:1px solid --color-accent-border-40; color:#fff; --type-cta-badge-* (13.5/700, ls .02em); padding:8px 16px; border-radius:--radius-pill`. Text "10% off your first service".
- **h2 `data-slot="cta-title"`:** "Ready to Clear Your Drain?" `--type-title-md-*` (40) `#fff` `margin:22px auto 0` max 560 `text-wrap:balance`.
- **p:** "Book online in 60 seconds or call for fast drain cleaning in Austin." `--type-cta-body-*` (18) `--color-text-cta-sub` `margin:16px auto 30px` max 480.
- **Button row:** `display:flex; gap:14px; justify-content:center; flex-wrap:wrap`. **Button/Schedule-accent** ("Schedule Drain Cleaning", 17/700, radius 12, pad `16px 30px`, shadow `--shadow-accent-btn`) + **Button/White** ("Call (833) 597-1932", 18px phone icon, `--color-text-primary`, radius 12, pad `16px 30px`).

---

## Template slots (per-service variables)
Fixed across services (do not edit per service): the entire structure, guarantee strip, why-ironclad, process, stat strip, reviews, service-area graphic, chrome. Per-service content (`data-slot` in source):
- `hero-image` (team/service photo), `hero-title`, `hero-subtitle`
- `signs-title` + the 4 SignRow titles/bodies
- `services-title` + the 6 ServiceCard titles/bodies + 6 ImageSlot photos
- `areas-title`
- `cta-title`
- FAQ set (6 Q/A)
- `{{phone}}` and offer text are global (site-level), not per-service.
Accent color (`--color-accent-primary`) MAY be re-themed per service; all accent-derived tokens follow automatically.
