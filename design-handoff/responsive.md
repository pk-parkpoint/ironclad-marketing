# Responsive — Ironclad Service Page Template

Two exact targets: **390px** (mobile) and **1440px** (desktop). Everything between and beyond is defined here. The design is a **single responsive document** (one DOM, CSS handles both) — `source-desktop.html` and `source-mobile.html` are identical.

> **Scope reminder:** promo bar, header/nav, footer = existing site chrome (engineering keeps them). Their reflow is summarized at the end for context only. Everything between the header and footer is the new template and is fully specced.

---

## 1. Breakpoints

The design uses **max-width** media queries (desktop-first cascade). Declared breakpoints and the base widths:

| Name | Query | Purpose |
|---|---|---|
| Base desktop | (no query) | 4/3-column layouts; the ≥1240 experience |
| `bp-1240` | `@media (max-width:1240px)` | guarantee grid 4→2 col |
| `bp-1080` | `@media (max-width:1080px)` | services 3→2, why-split 2→1, process 4→2 |
| `bp-820`  | `@media (max-width:820px)`  | the big "go mobile" step: most grids →1 col, sticky CTA appears |
| `bp-640`  | `@media (max-width:640px)`  | phone: header collapses, hero shrinks, CTAs full-width |
| Base mobile | effective at ≤640 | the 390px experience |

All four queries are max-width and **cascade** (at 390px, all four are active; at 1000px only 1240+1080 are active; at 1441px none are active). Reduced-motion query `@media (prefers-reduced-motion:no-preference)` gates the pulse animation only.

**Recommendation:** keep these exact four breakpoints. Do not add others — the layout is fully determined by them.

---

## 2. Global rules

- **Content max-width:** each section centers its own inner container with `margin:0 auto` at its own max-width (hero/guarantee/why/process 1240 · reviews 1200 · services 1180 · areas 1160 · signs 1140 · faq 840 · cta 760). The widest is **1240px**.
- **Above 1440 (and above each container's max):** inner content **stops growing and stays centered**; the extra viewport becomes side margin. **Section background colors are full-bleed** (navy `#16202B`, process `#1E2A38`, ink `#12181F`, accent stat strip, sand `#F6F1E9`/`#F3EDE3`, white) — they extend edge to edge at any width; only the inner container is capped. There is no max on the page itself.
- **Side gutters (inside containers):** `28px` left/right at all widths for every section **except** the hero, which drops to `20px` at ≤640 (`--page-gutter-mobile`). All other sections keep `28px` gutters even on mobile. (Header, when kept as-is, uses 32px → 16px at ≤640; footer 28px.)
- **Type scaling:** **fluid** via `clamp()` (the design demands it — headings and section rhythm ease continuously between mobile and desktop). Do **not** convert to discrete per-breakpoint sizes; use the `clamp()` tokens verbatim. Endpoints at 390 and 1440 are documented in `tokens.css` for diffing. The single exception is the **hero H1**, which is a hard step (`50px`, then `37px` via the ≤640 override) — not fluid.
- **Fixed vs fluid gutters:** gutters are fixed px (not fluid). Section vertical padding IS fluid (clamp tokens).
- **Images:** hero photo is `object-fit:cover; object-position:72% center` at all widths (keeps the technician in frame as it narrows). Service-card photos are `aspect-ratio:16/10; object-fit:cover` at all widths. No art-directed crop swaps.
- **Sticky/fixed:** header is `position:sticky; top:0` (chrome). The mobile **sticky call/book bar** is `position:fixed; bottom:0` and is shown only at **≤820px** (`display:none` above). Nothing else is sticky except the why-ironclad left column (`position:sticky; top:40px`) on desktop, which returns to normal flow once the why-split collapses to 1 column at ≤1080.

---

## 3. Per-section reflow (desktop → mobile)

Column counts are listed as: **base(≥1241) → ≤1240 → ≤1080 → ≤820 → ≤640**.

### Hero
- Layout unchanged structurally at all widths: left-aligned stack (badge, H1, subtitle, trust row, CTA row) over the photo; container 1240 centered, gutter 28px.
- **≤640:** gutter → 20px; vertical padding `96/100px` → `52px top / 60px bottom`; **H1 50px → 37px**; the `<br>` in the subtitle is removed (`display:none`) so the subtitle wraps naturally; CTA row becomes full-width with each button `flex:1 1 100%` (call on top, schedule below, both full-width, centered).
- Photo scrim + accent glow unchanged; text remains legible because the scrim is left-weighted.

### Guarantee strip
- Grid: **4 → 2 → 2 → 2 → 2**. Gaps: base `26px` → ≤1240 `26px 34px` → ≤820 `26px 18px` (labels may wrap: `.g-label{white-space:normal}`) → ≤640 `24px 14px`.
- Heading centered at all widths.

### Signs
- Single column of 4 `SignRow`s at all widths (it's a list, never multi-column).
- Row grid: base `110px 1fr`, padding `28px 6px` → **≤820:** `56px 1fr`, gap `12px 18px`, padding `22px 2px` (number column narrows; number font clamps down to 34px).
- Signs callout: base = horizontal (icon+text left, green Call button right, `flex:none`). **≤820:** padding tightens to `22px`. **≤640:** the Call button goes `width:100%; justify-content:center` (drops below the text, full-width).

### Services
- Grid: **3 → 3 → 2 → 1 → 1** (3-col holds until ≤1080). Gap `22px` throughout. Cards unchanged internally. Ink "Schedule drain cleaning" button below grid, left-aligned, all widths.

### Reviews
- Header row (title/subtitle left, "Read all reviews →" right) wraps when narrow (`flex-wrap:wrap`); the link drops beneath the title around ≤560px.
- Grid: **3 → 3 → 3 → 1 → 1** (3-col holds until ≤820, then straight to 1). Gap `22px`.

### Why-Ironclad
- Split grid `1fr 1.25fr` (left sticky title, right 01–04 list): **2-col → 2-col → 1-col(≤1080) → 1 → 1**. Column gap fluid `--space-why-col-gap` (40→86.4); at ≤1080 forced to `36px` and single column (title stacks above the list; left column stops being sticky).
- Section vertical padding fluid (top 56→86.4, bottom 52→72). Radial accent glow top-left, full-bleed.

### Stat strip (attached under why)
- Grid: **3 → 3 → 3 → 1(≤820) → 1**. Dividers: vertical `rgba(255,255,255,.16)` between columns (desktop) → at ≤820 become horizontal top-borders `rgba(255,255,255,.20)`. Cell padding fluid `--space-stat-cell-y` (34→51.84). Background `--color-accent-primary`, full-bleed.

### Process ("What to Expect")
- Grid: **4 → 4 → 2(≤1080) → 1(≤820) → 1**. Gaps: base `40px` → ≤1080 `44px 36px` → ≤820 `40px`. Each step keeps its top rule + accent dot + big number. Eyebrow + H2 header block above, margin-bottom fluid (40→68). Radial glow top-right, full-bleed.

### Service-area
- Split grid `0.85fr 1.15fr` (radar graphic left, copy right), gap 54px: **2-col → 2-col → 2-col → 1-col(≤820) → 1**. At ≤820 the radar graphic stacks above the copy. Chips wrap (`flex-wrap`) at all widths. Schedule (accent) button below chips.
- The radar graphic is an `aspect-ratio:1/1` decorative composition (concentric rings + dots + center pin + pulsing ring); it scales fluidly with its column.

### FAQ
- Single column of 6 `FAQItem`s at all widths, container 840 centered. No column change. Padding unchanged.

### Final CTA
- Centered stack (badge, H2, body, button row), container 760 centered, all widths. Button row `justify-content:center; flex-wrap:wrap` — the two buttons sit side by side on desktop and wrap to stacked on narrow mobile.

### Sticky call/book bar (mobile only)
- `display:none` above 820px. **≤820:** `display:flex`, `position:fixed; left:0; right:0; bottom:0; z-index:60`, two equal buttons (`flex:1`) — green Call + accent Schedule, `white-space:nowrap`, `padding:14px 8px`. Always visible while scrolling (persistent). Bar bg white, top border `--color-border-sticky`, shadow `--shadow-sticky-bar`.
- **Reserve bottom space:** because it's fixed, add `padding-bottom` equal to the bar height (~68px) to the page/last section on ≤820 so the footer/CTA isn't covered. (The reference PNG renders it in-flow at the very bottom; in production it floats — account for overlap.)

---

## 4. Chrome reflow (context only — do not rebuild)

- **Promo bar:** full-width navy strip, centered text, all widths.
- **Header:** logo + horizontal nav + (outline "Schedule Now | 24/7") + (blue phone button). **≤640:** `nav` hidden, outline "Schedule Now" hidden, logo 44→34px, header padding `16px 32px`→`12px 16px`, phone button padding/size reduced. (Production likely swaps in a hamburger — that is the existing site's responsibility.)
- **Footer:** 4-column grid `1.4fr 1fr 1fr 1fr` → **2-col ≤820** (gap 36) → **1-col ≤640** (gap 34). Bottom legal row wraps.

Nothing is left "adjust as needed" — every width from 390 to beyond 1440 resolves to one of the states above.

---

## 5. Reviews page (`/reviews`) — per-screen reflow

**Breakpoints:** 390 base · 640 · 820 · 960 · 1440. Beyond 1440 every section stays centered at its own max-width (hero/band 1080–1240, slider 1280, wall 1200, CTA 760); section background colors remain full-bleed. Side gutters 28px desktop / 20px mobile. Type uses discrete per-breakpoint sizes (no fluid clamp on this screen).

**Section max-widths (centered):** hero 1240 · rating-summary 1080 · slider 1280 · booking-band 1080 · wall 1200 · final-cta 760.

| Range | Hero | Rating summary | Slider | Booking band | Wall | CTA rows |
|---|---|---|---|---|---|---|
| **≥1440** | h1 64; CTA row inline | 2-col `0.85fr 1.15fr`, gap 80 | cards 380, ~3 visible + peek; arrows shown | row space-between | `columns:3` | inline |
| **960–1439** | same (h1 64) | 2-col (gap shrinks fluidly with container) | cards 380, ~2–3 visible; arrows shown | row | `columns:3` (narrower) | inline |
| **820–959** | same | **1-col centered**, bars `max-width:440` centered | cards 380, ~2 visible; arrows shown | row (may wrap) | **`columns:2`** | inline |
| **640–819** | same | 1-col centered | cards 380; arrows shown | wraps to stack | `columns:2` | stacks begin |
| **≤639 (→390)** | h1 44; photo obj-pos 72%; vertical scrim; CTA col full-width | 1-col centered, bars `max-width:340` | **card 300, gap 16, snap center, arrows HIDDEN** | **col stack**, buttons full-width | **1 column, 9→5 cards** | **col stack**, full-width |

**Element-level reflow**
- **Hero:** `object-position` 78%→72% at ≤640; scrim swaps from left→right horizontal gradient to top→bottom vertical (darker bottom). h1 64→44; subtitle 19→16.5; CTA row → full-width column.
- **Rating summary:** grid collapses to one centered column at ≤960 (`.summary-split{grid-template-columns:1fr; text-align:center}`); score 108→80; bar group centers (`max-width` 440 ≤960, 340 ≤640).
- **Slider:** `.rev-arrows{display:none}` ≤640; card basis 380→300; gap 24→16; `scroll-snap-align` start→center so the active card centers with peeks both sides. GoogleAllLink may wrap to 2 lines.
- **Booking band:** flex row → column ≤640; radial glow dropped at mobile; buttons full-width.
- **Wall:** `columns:3` → `columns:2` ≤960 → single flex column ≤640; **mobile shows 5 of 9 cards** (first five in DOM order).
- **Final CTA:** button row → column; h2 52→36.
- **Sticky CTA:** hidden > 820; `display:flex` fixed-bottom ≤820 (green Call + accent Schedule, `flex:1` each). Add ~68px bottom padding to the last section on ≤820 so it isn't covered.
- **Chrome:** header nav + outline hidden ≤640 (logo 44→34); footer 4-col → 2-col ≤820 → 1-col ≤640 (as §4 above).

Nothing on this screen is left "adjust as needed"; every width 390→beyond-1440 maps to a row above.
