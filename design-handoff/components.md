# Components — Ironclad Service Page Template

Elements that repeat across the template (this template is one page reused per service; repeated elements are treated as components). Specs reference these by name. Token names are from `tokens.css`.

> **States note.** The approved design is a static comp. Where it defines an interaction (ink button, service card, why item, FAQ chevron) the real values are given. Where a production web control *must* have a state the comp doesn't show (**focus-visible** on every interactive element; **hover** on filled buttons), the row is marked **PRESCRIBED** — implement it, it is required for web a11y/feel, and it is intentionally not visible in the reference PNGs. Flagged in the package AUDIT.

---

## Button

One component, five visual variants. Shared box model unless noted.

**Appears on:** hero, signs-callout, services, service-area, final-CTA, sticky bar (and header = chrome, not covered).

**Anatomy:** `<a>` → optional leading `<svg>` icon (16–19px) + label text (+ optional trailing arrow svg on Ink variant). `display:inline-flex; align-items:center; justify-content:center`.

**Variants**

| Variant | Used in | Background | Text | Radius | Padding | Icon | Shadow |
|---|---|---|---|---|---|---|---|
| **Call (green)** | hero, signs-callout | `--gradient-call` | `#FFFFFF` | hero `--radius-hero-btn` (24) · callout `--radius-btn` (12) | hero 16px 28px · callout 14px 26px | phone, 19px hero / 18px callout, `stroke:currentColor` | hero `--shadow-call-lg` · callout `--shadow-call-md` |
| **Schedule (accent)** | service-area, final-CTA | `--color-accent-primary` | `#FFFFFF` | `--radius-btn` (12) | area 14px 28px · CTA 16px 30px | none (area) | area `--shadow-accent-btn-2` · CTA `--shadow-accent-btn` |
| **Ink (dark)** | services | `--color-ink-900` | `#FFFFFF` | `--radius-btn-ink` (10) | 16px 26px | trailing arrow 17px, `stroke:--color-accent-primary`, gap 12px | none |
| **Outline (on photo)** | hero (secondary) | `transparent`, border `1.5px solid --color-outline-on-photo` | `#FFFFFF` | `--radius-hero-btn` (24) | 16px 28px | none | none |
| **White (on navy)** | final-CTA (call), sticky-call uses Green | `#FFFFFF` | `--color-text-primary` | `--radius-btn` (12) | 16px 30px | phone 18px `stroke:currentColor` | none |
| **Sticky** | mobile sticky bar | call = `--gradient-call` · schedule = `--color-accent-primary` | `#FFFFFF` | `--radius-btn` (12) | 14px 8px, `flex:1; min-width:0; white-space:nowrap` | call: phone 17px | none |

**Type:** Call `--type-btn-hero-*` (16/700) hero, `--type-btn-callout-*` (16/700) callout · Schedule-accent `--type-btn-area-*` (15.5/700) area, `--type-btn-cta-*` (17/700) CTA · Ink `--type-btn-ink-*` (15.5/600) · Outline 16/700 · White 17/700 · Sticky `--type-btn-sticky-*` (15.5/700).

**States (all variants unless noted)**

| State | What changes | Transition |
|---|---|---|
| default | as table above | — |
| **hover** | **Ink:** background → `--color-ink-hover` (#0F1822); trailing arrow `translateX(3px)`. **PRESCRIBED for all filled variants** (Call/Schedule/White): `filter: brightness(0.95)`. **Outline:** border-color → `#FFFFFF`, background → `rgba(255,255,255,.08)`. | Ink bg `--motion-ink-btn`; arrow `--motion-arrow`; others `--dur-base ease` |
| **focus-visible** | **PRESCRIBED:** `outline: 2px solid --color-accent-primary; outline-offset: 2px; border-radius` matches. On the accent/white-on-navy variants where accent-on-navy may be low-contrast, use `outline-color:#FFFFFF`. | none |
| **active** | **PRESCRIBED:** `transform: translateY(1px)` and drop any shadow to its `-md` equivalent. | `--dur-fast` |
| disabled | Not used on this template (all buttons are always actionable). Write `disabled: N/A`. | — |
| loading / selected / error / empty | N/A | — |

**Format differences:** Hero CTAs — desktop: inline row, auto width, `gap 14px`. Mobile (≤640): row becomes full-width; each button `flex:1 1 100%; justify-content:center` (stacks full-width). Signs-callout button — desktop: sits right of the callout text (`flex:none`); mobile (≤640): `width:100%; justify-content:center`. Final-CTA buttons — both formats: centered row, wrap. Sticky buttons — mobile only (parent hidden on desktop).

---

## StarRating

**Appears on:** hero (Google badge), reviews (each card).

**Anatomy:** `<div style="display:flex; gap:2px">` → five identical star `<svg>`.

**Layout:** flex row, `gap 2px`.

**Styling:** hero badge stars — 15px, `fill:--color-star-google` (#FBBC05). Review stars — 17px, `fill:--color-star-review` (#F5A623). Always 5 filled stars (no partial/empty state in this design).

**States:** static, non-interactive → hover/focus/active/disabled = **N/A**.

**Format differences:** identical in both formats.

---

## ServiceCard

**Appears on:** services (×6). It is the primary repeating template unit.

**Anatomy:** `<div.svc-card>` → image well `<div>` (contains `ImageSlot`) → text `<div>` ( `<h3.svc-title>` + `<p>` ).

**Layout:** `display:flex; flex-direction:column`. Image well: `width:100%; aspect-ratio:16/10`. Text block padding `22px 24px 26px`, `flex:1`. Grid gap between cards `--gap-services` (22px).

**Styling:** background `--color-bg-card`; border `1px solid --color-border-card-warm`; radius `--radius-card` (18); `overflow:hidden`; shadow `--shadow-card`.

**Content slots:** image = `ImageSlot` (user photo, `object-fit:cover`, ratio 16/10); title = `--type-card-title-*` color `--color-text-heading`, wraps freely (no clamp, no truncation — real longest title is "Kitchen & bathroom sink drains", 2 lines); body = `--type-body-sm-size` (15px) line-height **1.56**, color `--color-text-body`, wraps freely, no truncation.

**States**

| State | What changes | Transition |
|---|---|---|
| default | shadow `--shadow-card`; title color `--color-text-heading` | — |
| **hover** | `transform: translateY(-4px)`; shadow → `--shadow-card-hover`; `.svc-title` color → `--color-accent-primary` | `--motion-card` (transform+shadow .2s ease); title `--motion-svc-title` (.18s) |
| **focus-visible** | **PRESCRIBED** (card is not itself a link today; if made clickable, wrap in `<a>` and apply `outline:2px solid --color-accent-primary; outline-offset:2px`). If cards stay non-interactive, `focus-visible: N/A`. | none |
| active | PRESCRIBED (if clickable): `transform: translateY(-2px)` | `--dur-fast` |
| disabled / selected / loading / error | N/A | — |
| **empty** (no photo) | ImageSlot shows placeholder fill `--color-surface-slot` (see ImageSlot) | — |

**Format differences:** Identical card styling both formats. Grid: 3-col desktop → 2-col ≤1080 → 1-col ≤820. Card internals unchanged.

---

## ReviewCard

**Appears on:** reviews (×3).

**Anatomy:** `<div>` → `StarRating` → quote `<p>` → footer row ( avatar `<span>` + name/time `<div>` ).

**Layout:** `display:flex; flex-direction:column`; padding `28px`; quote `<p>` `flex:1` then footer pinned to bottom. Footer row: `display:flex; align-items:center; gap:11px; border-top:1px solid --color-border-divider-cool; padding-top:16px`.

**Styling:** background `--color-bg-card`; border `1px solid --color-border-card-cool`; radius `--radius-card` (18); shadow `--shadow-review`.

**Content slots:** stars (see StarRating, 17px amber); quote = 15px / line-height **1.62** / `--color-text-review`, wraps freely, no truncation (cards equalize height via `flex:1` on quote, NOT by clamping); avatar = 40×40 circle, `--color-bg-navy-process` (#1E2A38) bg, white 700 initial, centered; name = `--type-review-name-*` (14.5/700) `--color-text-primary`; time = `--type-review-time-*` (12.5/400) `--color-text-review-time`.

**States:** non-interactive → hover/focus/active/disabled = **N/A** (no hover in design). If cards become links, apply the PRESCRIBED focus-visible ring as in ServiceCard.

**Format differences:** identical styling; grid 3-col desktop → 1-col ≤820.

---

## GuaranteeItem

**Appears on:** guarantee strip (×4).

**Anatomy:** `<div>` → shield-check `<svg>` (30px) → `<div>` ( label + proof ).

**Layout:** `display:flex; flex-direction:column; align-items:center; text-align:center; gap:12px`.

**Styling:** no container background/border; on `--color-bg-navy`. Icon `stroke:--color-accent-primary`, `stroke-width:2`, 30×30.

**Content slots:** label = `--type-guarantee-label-*` (17/700) line-height 1.3, color `#FFFFFF`, `white-space:nowrap` on desktop (`.g-label`), wraps (`white-space:normal`) ≤820; proof = `--type-guarantee-proof-*` (13.5/400) line-height 1.45, color `--color-text-guarantee-proof`, margin-top 6px, wraps freely.

**States:** static → all interaction states **N/A**.

**Format differences:** Grid 4-col desktop → 2-col ≤1240 (gap `26px 34px`) → 2-col ≤820 (gap `26px 18px`, labels allowed to wrap) → 2-col ≤640 (gap `24px 14px`).

---

## SignRow

**Appears on:** signs (×4).

**Anatomy:** `<div.sign-row>` → big number `<span>` + `<div>` ( `<h3>` + `<p>` ).

**Layout:** `display:grid; grid-template-columns:110px 1fr; gap:16px 28px; align-items:start; padding:28px 6px`; `border-bottom:1px solid --color-border-sand` (list also has a `border-top` on the wrapper for the first rule).

**Styling:** number = `--type-sign-number-*`, `--color-accent-primary`, `font-variant-numeric:tabular-nums`; h3 = `--type-sign-title-*`, `--color-text-heading`, margin-bottom 8px; p = `--type-body-md-size` (16) line-height **1.6**, `--color-text-body`, `max-width:660px`, wraps freely.

**States:** static → interaction states **N/A**.

**Format differences:** Desktop columns `110px 1fr`, padding `28px 6px`. Mobile ≤820: columns `56px 1fr`, gap `12px 18px`, padding `22px 2px` (number column narrows, number scales down via clamp to 34px).

---

## WhyItem

**Appears on:** why-ironclad (×4).

**Anatomy:** `<div.why-item>` → number `<span>` + `<div>` ( `<h3>` + `<p>` ).

**Layout:** `display:grid; grid-template-columns:auto 1fr; gap:24px; padding:28px 4px; align-items:baseline; border-top:1px solid rgba(255,255,255,.10)` (list wrapper adds bottom rule).

**Styling:** number = `--type-why-number-*` (20/700) `--color-accent-primary`; h3 = `--type-why-title-*` `#FFFFFF` margin-bottom 8px; p = 15px / line-height **1.55** / `--color-text-on-dark-body` / `max-width:440px`.

**States**

| State | What changes | Transition |
|---|---|---|
| default | `padding-left:4px`; h3 `#FFFFFF` | — |
| **hover** | `padding-left:14px`; h3 color → `--color-accent-on-white-hover` | `--motion-why-item` (padding-left .2s) |
| focus-visible / active / disabled / selected | N/A (not a link) | — |

**Format differences:** identical; sits in the right column of the why-split (2-col desktop → 1-col ≤1080). Hover indent applies on desktop (pointer); harmless/no-op on touch.

---

## ProcessStep

**Appears on:** process "What to Expect" (×4).

**Anatomy:** `<div.pstep>` → dot `<span>` (absolute, top) + big number `<div>` + `<h3>` + `<p>`.

**Layout:** `position:relative; border-top:2px solid rgba(255,255,255,.16); padding-top:30px`. Dot: `position:absolute; top:-6px; left:0; 10×10; border-radius:50%; background:--color-accent-primary; box-shadow:0 0 0 5px --color-accent-tint-22`.

**Styling:** number = `--type-process-number-*` `--color-accent-primary` margin-bottom 18px; h3 = `--type-process-title-*` (21/700) `#FFFFFF` margin-bottom 10px; p = 15px / line-height **1.6** / `--color-text-on-dark-body-2`.

**States:** static → interaction states **N/A**.

**Format differences:** Grid 4-col desktop, gap 40px → 2-col ≤1080 (gap `44px 36px`) → 1-col ≤820 (gap 40px). Step internals unchanged.

---

## StatCell

**Appears on:** stat strip under why-ironclad (×3).

**Anatomy:** `<div>` → number `<div>` + label `<div>`.

**Layout:** `text-align:center; padding:--space-stat-cell-y 24px`. Divider between cells: `--color-divider-stat-desktop` left-border desktop; ≤820 becomes top-border `--color-divider-stat-mobile`.

**Styling:** strip background `--color-accent-primary`; number = `--type-stat-number-*` `#FFFFFF`; label = `--type-stat-label-*` (13.5/700) `text-transform:uppercase; letter-spacing:.14em`, color `--color-stat-label-on-accent`, margin-top 14px.

**Content note:** numbers count up on scroll in the live build (see animations.md `stat-count`). Reference PNG shows final values (142 / 4.9 / 19+).

**States:** static → interaction states **N/A**.

**Format differences:** 3-col desktop (vertical dividers) → 1-col ≤820 (horizontal dividers).

---

## AreaChip

**Appears on:** service-area (×12).

**Anatomy:** `<span>` text only.

**Layout:** `padding:9px 17px`; wrap container `display:flex; flex-wrap:wrap; gap:--gap-chips (10px)`.

**Styling:** background `#FFFFFF`; border `1px solid --color-border-chip`; radius `--radius-pill`; text `--type-chip-*` (14/600) `--color-text-chip`.

**States:** static text (not links in this design) → interaction states **N/A**. If made links, apply PRESCRIBED focus ring + hover `border-color:--color-accent-primary`.

**Format differences:** identical; wraps naturally in both formats.

---

## FAQItem

**Appears on:** FAQ (×6). Native `<details>`/`<summary>` accordion.

**Anatomy:** `<details.faq-item>` → `<summary>` ( question text + chevron `<svg.chev>` ) → answer `<div>`.

**Layout:** border `1px solid --color-border-faq`; radius `--radius-faq` (14); background `--color-bg-card`; `overflow:hidden`. Summary: `display:flex; align-items:center; justify-content:space-between; gap:16px; padding:20px 22px`. Answer: `padding:0 22px 22px`. Items stacked in a `flex column; gap:12px`.

**Styling:** question = `--type-faq-q-*` (16.5/700) `--color-text-primary`; chevron = 20px `stroke:--color-accent-primary`; answer = 15px / line-height **1.64** / `--color-text-body-2`.

**States**

| State | What changes | Transition |
|---|---|---|
| default (collapsed) | answer hidden; chevron points down | — |
| **open** | answer visible; chevron rotates 180° (`details[open] .chev{transform:rotate(180deg)}`) | chevron `--motion-chevron` (.25s) |
| **hover** (summary) | **PRESCRIBED:** `cursor:pointer` (already set); optional question color → `--color-accent-primary`. Marker is hidden (`list-style:none`, `::-webkit-details-marker{display:none}`). | `--dur-fast` |
| **focus-visible** (summary) | **PRESCRIBED:** `outline:2px solid --color-accent-primary; outline-offset:-2px` (inset, so it stays inside the rounded item) | none |
| active | PRESCRIBED: none beyond native toggle | — |
| disabled / error / empty | N/A | — |

**Behavior (JS):** one open at a time; first item open on load. On `toggle`, if an item opens, close the others. (Reference PNG shows item 1 open.) This is progressive-enhancement over native `<details>` — without JS, all items still open/close independently.

**Format differences:** identical both formats (container max-width 840, centered). Padding unchanged.

---

## ImageSlot

**Appears on:** services (×6). The USER's real photo goes here (drag-drop slot in the design tool; in production, a normal `<img>`/`<picture>`).

**Anatomy:** a positioned well `<div>` (`position:relative; width:100%; aspect-ratio:16/10; background:--color-surface-slot`) containing the image.

**Styling (filled):** image `object-fit:cover`; inherits the card's `overflow:hidden` + top corners of `--radius-card`.

**Content slots:** one image per card, ratio **16/10**, `object-fit:cover`, focal point center. Alt text = the service name.

**States**

| State | What changes |
|---|---|
| filled | `<img>` cover |
| **empty** | show fill `--color-surface-slot` (#EEE7D8) with a centered placeholder (icon + caption). *The placeholder styling in the reference source is REFERENCE-ONLY — production empty state is a business decision; do not ship the sand placeholder to users.* |
| hover/focus/active/disabled | N/A (unless wrapped in a link) |

**Format differences:** identical ratio/behavior both formats.

---

## Eyebrow

**Appears on:** why-ironclad, process.

**Anatomy:** `<div>` → 32×2px rule `<span>` + uppercase label text.

**Layout:** `display:flex; align-items:center; gap:12px`.

**Styling:** rule `background:--color-accent-primary`; text `--type-eyebrow-*` (13/800) `text-transform:uppercase; letter-spacing:.16em`. Color: why = `--color-accent-eyebrow-on-black`; process = `--color-accent-eyebrow-on-navy`.

**States:** static → **N/A**.

**Format differences:** identical.

---

## InlineLink

**Appears on:** reviews ("Read all reviews →"), service-area footer link "View all areas →" (footer = chrome).

**Anatomy:** `<a>` text (+ trailing arrow glyph in the label).

**Styling:** `--type-link-inline-*` (15/700), color `--color-accent-primary`, `text-decoration:none`.

**States**

| State | What changes | Transition |
|---|---|---|
| default | color `--color-accent-primary`, no underline | — |
| **hover** | **PRESCRIBED:** `text-decoration:underline` (or arrow `translateX(3px)`) | `--dur-fast` |
| **focus-visible** | **PRESCRIBED:** `outline:2px solid --color-accent-primary; outline-offset:2px` | none |
| active | PRESCRIBED: `opacity:.85` | `--dur-fast` |
| disabled | N/A | — |

**Global link defaults:** define `a{color:inherit}` reset (as in source) and set body link color/hover from the palette so authored links are never browser-default blue: `a{color:--color-accent-primary}`, `a:hover{color:color-mix(in srgb,--color-accent-primary 80%,#000)}` — except the many `<a>` that are styled buttons/nav (which set their own color).

**Format differences:** identical; on reviews the link drops below the heading block when the header row wraps ≤ ~560px.

---

# REVIEWS PAGE COMPONENTS  (/reviews)

Components unique to the reviews screen. Buttons (Call-green, Outline-photo, Ink, White, Schedule-accent, White-bordered), GoogleRatingBadge, and the promo/header/footer chrome are defined earlier in this file and reused as-is.

## RatingBar

**Appears on:** reviews-page (rating summary ×5)

**Anatomy:** row = star label + track (with fill) + pct label

**Layout:** `display:flex; align-items:center; gap:14px` (mobile 12). Label `width:44px` (mobile 42), left. Track `flex:1; height:10px; border-radius:999px; overflow:hidden`. Pct label `width:40px` (mobile 36), right.

**Styling:** track bg `--color-rating-track`; fill `height:100%; border-radius:999px; background:--color-star-review; width:{pct}`. Label `--type` 13.5/700 `--color-text-muted`; pct 13/600 `--color-rating-pct`.

**Content slots:** label text ("5 star"…"1 star"); fill width % (96/3/1/0/0); pct text.

**States:** default only. hover N/A · focus-visible N/A · active N/A · disabled N/A · loading N/A (static bar).

**Format differences:** desktop gap 14 / label 44 / pct 40; mobile gap 12 / label 42 / pct 36, whole group `max-width:340px; margin:0 auto` (centered).

## SliderCard

**Appears on:** reviews-page (review slider ×8)

**Anatomy:** container → [header row: (avatar + name/time) · Google "G"] → star row → quote `<p>`

**Layout:** `flex:0 0 380px` (mobile 300), `scroll-snap-align:start` (mobile center), flex column. Padding 30 (mobile 26). Header row `display:flex; align-items:center; justify-content:space-between; gap:12; margin-bottom:18` (mobile 16). Avatar+name group `display:flex; align-items:center; gap:12` (mobile 11). Star row `display:flex; gap:2; margin-bottom:14`.

**Styling:** bg `--color-bg-card`; border 1px `--color-border-card-cool`; radius `--radius-slider-card` (20); shadow `--shadow-slider-card`.

**Content slots:** avatar 46 circle (mobile 44), bg = per-review avatar color, initial 18/700 (mobile 17) `--color-text-on-dark`; name `--type-review-name` bumped to 15.5/700 desktop (15 mobile) `--color-text-heading`; time `--type-review-time` 12.5/400 (12 mobile) `--color-text-review-time`; Google "G" 22px (mobile 20); 5 stars 17px `--color-star-review` (mobile 16); quote 15/400/1.62 (mobile 14.5) `--color-text-review`, **no line clamp** (full quote shown, card grows).

**States**

| State | What changes | Transition |
|---|---|---|
| default | rest shadow `--shadow-slider-card` | — |
| **hover** | `transform:translateY(-4px)`, shadow → `0 30px 56px -34px rgba(30,42,56,.55)` | `--motion-rev-card` |
| focus-visible | N/A (card is not focusable; links inside follow their own) | — |
| active | N/A | — |
| disabled / loading / empty | N/A | — |

**Format differences:** as noted inline (basis 380→300, gap 24→16, snap start→center, pad 30→26, avatar 46→44, sizes step down).

## SliderArrow

**Appears on:** reviews-page (slider prev / next) — **desktop only**

**Anatomy:** round `<button>` + chevron `<svg>`

**Layout:** 52×52 circle, `position:absolute; top:50%; transform:translateY(-50%); z-index:5`; `.prev{left:-8px}` `.next{right:-8px}`. Flex-center, `padding:0`. Chevron 22px.

**Styling:** bg #FFFFFF; border 1.5px `--color-slider-arrow-border`; radius `--radius-circle`; shadow `--shadow-slider-arrow`; chevron stroke `--color-text-heading` 2.3.

**Behavior:** click → `track.scrollBy({left: ±(cardWidth+gap), behavior:'smooth'})` (one card).

**States**

| State | What changes | Transition |
|---|---|---|
| default | white fill, chevron `--color-text-heading` | — |
| **hover** | bg → `--color-bg-navy-process` (#1E2A38), border-color same, `transform:translateY(-50%) scale(1.06)`, chevron stroke → #FFFFFF | `--motion-slider-arrow` |
| **focus-visible** | **PRESCRIBED:** `outline:2px solid --color-accent-primary; outline-offset:2px` | none |
| active | PRESCRIBED: drop scale to 1.0 | `--dur-fast` |
| disabled | N/A (track loops via scroll; arrows never disabled in this design) | — |

**Format differences:** **hidden < 640** (`.rev-arrows{display:none}`); slider becomes swipe-only on mobile.

## WallCard

**Appears on:** reviews-page (review wall — 9 desktop / 5 mobile)

**Anatomy:** container → [header row: (avatar + name/time) · star row] → quote `<p>`

**Layout:** inside `columns:3` (desktop) → `break-inside:avoid; margin-bottom:24px`; mobile single flex column gap 16. Padding 26 (mobile 24). Header `display:flex; align-items:center; justify-content:space-between; gap:12; margin-bottom:14`. Avatar+name group `gap:11`. Star row `display:flex; gap:1.5`.

**Styling:** bg `--color-bg-card`; border 1px `--color-border-card-cool`; radius `--radius-card` (18); shadow `--shadow-wall-card`.

**Content slots:** avatar 42 circle, per-review color, initial 700 `--color-text-on-dark`; name 14.5/700 `--color-text-heading`; time 12/400 `--color-text-review-time`; 5 stars 14px `--color-star-review`; quote 14.5/400/1.62 `--color-text-review`, no clamp.

**States**

| State | What changes | Transition |
|---|---|---|
| default | rest shadow `--shadow-wall-card` | — |
| **hover** | `transform:translateY(-3px)`, shadow → `0 24px 48px -32px rgba(30,42,56,.5)` | `--motion-rev-card` |
| focus-visible / active / disabled / loading / empty | N/A | — |

**Format differences:** desktop `columns:3` masonry (column-first visual order); mobile single column, first 5 cards only (Brian H., Nicole F., Tom S., Carlos M., Frank O.).
