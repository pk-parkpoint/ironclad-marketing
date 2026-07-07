# Service Page Template Ledger

Screen: `service-page`  
Implemented route: `/plumbing/drain-cleaning`  
Verification run: `BASE_URL=http://127.0.0.1:3027 node scripts/verify-service-page-redesign.mjs`

| Screen | Format | Element | Property | Spec (token/px) | Implemented (token/px) | Diff | Deviation + justification |
|---|---|---|---|---|---|---|---|
| service-page | desktop | Root | background | `--color-bg-page` | `--color-bg-page` | PASS | none |
| service-page | desktop | Hero section | background | `--gradient-hero-base` | `--gradient-hero-base` | PASS | none |
| service-page | desktop | Hero image | object fit/position | `cover`, `72% center` | `cover`, `72% center` | PASS | none |
| service-page | desktop | Hero inner | padding | `96px 28px 100px` | `96px 28px 100px` | PASS | none |
| service-page | desktop | Hero badge | padding/radius | `9px 16px 9px 14px`, `--radius-pill` | `9px 16px 9px 14px`, `--radius-pill` | PASS | none |
| service-page | desktop | Hero H1 | type | `--type-hero-title-size-desktop`, weight `--type-hero-title-weight` | `--type-hero-title-size-desktop`, weight `--type-hero-title-weight` | PASS | none |
| service-page | desktop | Hero subtitle | type/color | `--type-hero-sub-size-desktop`, `--color-text-hero-sub` | `--type-hero-sub-size-desktop`, `--color-text-hero-sub` | PASS | none |
| service-page | desktop | Hero CTAs | layout | gap `14px`, row | gap `14px`, row | PASS | none |
| service-page | desktop | Call button | visual | `--gradient-call`, `--radius-hero-btn`, `16px 28px` | `--gradient-call`, `--radius-hero-btn`, `16px 28px` | PASS | none |
| service-page | desktop | Outline button | visual | `--color-outline-on-photo`, `--radius-hero-btn`, `16px 28px` | `--color-outline-on-photo`, `--radius-hero-btn`, `16px 28px` | PASS | none |
| service-page | desktop | Guarantee strip | background/padding | `--color-bg-navy`, `--space-section-y 28px` | `--color-bg-navy`, `--space-section-y 28px` | PASS | none |
| service-page | desktop | Guarantee grid | columns/gap | `repeat(4,1fr)`, `--gap-guarantee-desktop` | `repeat(4,1fr)`, `--gap-guarantee-desktop` | PASS | none |
| service-page | desktop | Signs container | max/padding | `--maxw-signs`, `--space-section-y-lg 28px` | `--maxw-signs`, `--space-section-y-lg 28px` | PASS | none |
| service-page | desktop | Sign row | grid/padding | `110px 1fr`, `28px 6px` | `110px 1fr`, `28px 6px` | PASS | none |
| service-page | desktop | Signs callout | visual | `--color-bg-navy`, `--radius-card`, `26px 30px` | `--color-bg-navy`, `--radius-card`, `26px 30px` | PASS | none |
| service-page | desktop | Services section | background/padding | `--color-surface-sand-1`, `--space-section-y-lg 28px` | `--color-surface-sand-1`, `--space-section-y-lg 28px` | PASS | none |
| service-page | desktop | Service grid | columns/gap | `repeat(3,1fr)`, `--gap-services` | `repeat(3,1fr)`, `--gap-services` | PASS | none |
| service-page | desktop | ImageSlot | empty state | `--color-surface-slot`, `16/10`, centered placeholder | `--color-surface-slot`, `16/10`, `--color-image-placeholder-*` | PASS | Six service-card photos were not supplied; implemented the documented empty placeholder state. |
| service-page | desktop | ServiceCard | card visual | `--color-bg-card`, `--color-border-card-warm`, `--radius-card`, `--shadow-card` | same tokens | PASS | none |
| service-page | desktop | Ink button | visual | `--color-ink-900`, `--radius-btn-ink`, `16px 26px` | `--color-ink-900`, `--radius-btn-ink`, `16px 26px` | PASS | none |
| service-page | desktop | Reviews section | max/padding | `--maxw-reviews`, `--space-section-y 28px` | `--maxw-reviews`, `--space-section-y 28px` | PASS | none |
| service-page | desktop | Review grid | columns/gap | `repeat(3,1fr)`, `--gap-reviews` | `repeat(3,1fr)`, `--gap-reviews` | PASS | none |
| service-page | desktop | Why split | grid/gap | `1fr 1.25fr`, `--space-why-col-gap` | `1fr 1.25fr`, `--space-why-col-gap` | PASS | none |
| service-page | desktop | Stat strip | columns/background | `repeat(3,1fr)`, `--color-accent-primary` | `repeat(3,1fr)`, `--color-accent-primary` | PASS | none |
| service-page | desktop | Process grid | columns/gap | `repeat(4,1fr)`, `--gap-process-desktop` | `repeat(4,1fr)`, `--gap-process-desktop` | PASS | none |
| service-page | desktop | Area split | grid/gap | `.85fr 1.15fr`, `--gap-areas-split` | `.85fr 1.15fr`, `--gap-areas-split` | PASS | none |
| service-page | desktop | FAQ list | max/gap | `--maxw-faq`, `12px` | `--maxw-faq`, `12px` | PASS | none |
| service-page | desktop | Final CTA | visual | `--color-bg-navy`, `--maxw-cta`, `--space-section-y 28px` | same tokens | PASS | none |
| service-page | desktop | Sticky CTA | visibility | hidden above `820px` | hidden above `820px` | PASS | none |
| service-page | mobile | Root | background | `--color-bg-page` | `--color-bg-page` | PASS | none |
| service-page | mobile | Hero inner | padding | `52px 20px 60px` | `52px 20px 60px` | PASS | none |
| service-page | mobile | Hero H1 | type | `--type-hero-title-size-mobile`, weight `--type-hero-title-weight` | same tokens | PASS | none |
| service-page | mobile | Hero subtitle | line break | `<br>` suppressed | `<br>` suppressed | PASS | none |
| service-page | mobile | Hero CTAs | layout | full-width stacked, gap `14px` | full-width stacked, gap `14px` | PASS | none |
| service-page | mobile | Guarantee grid | columns/gap | `1fr 1fr`, `--gap-guarantee-t640` | `1fr 1fr`, `--gap-guarantee-t640` | PASS | none |
| service-page | mobile | Sign row | grid/padding | `56px 1fr`, `22px 2px` | `56px 1fr`, `22px 2px` | PASS | none |
| service-page | mobile | Signs callout | padding/button | `22px`, call button `width:100%` | `22px`, call button `width:100%` | PASS | none |
| service-page | mobile | Service grid | columns/gap | `1fr`, `22px` | `1fr`, `22px` | PASS | none |
| service-page | mobile | Service image slots | empty state | `--color-surface-slot`, `16/10`, centered placeholder | `--color-surface-slot`, `16/10`, `--color-image-placeholder-*` | PASS | Six service-card photos were not supplied; implemented the documented empty placeholder state. |
| service-page | mobile | Review grid | columns/gap | `1fr`, `22px` | `1fr`, `22px` | PASS | none |
| service-page | mobile | Why split | columns/gap | `1fr`, `36px` | `1fr`, `36px` | PASS | none |
| service-page | mobile | Stat strip | columns/dividers | `1fr`, `--color-divider-stat-mobile` | `1fr`, `--color-divider-stat-mobile` | PASS | none |
| service-page | mobile | Process grid | columns/gap | `1fr`, `40px` | `1fr`, `40px` | PASS | none |
| service-page | mobile | Area split | columns/gap | `1fr`, `54px` | `1fr`, `54px` | PASS | none |
| service-page | mobile | FAQ list | padding/gap | `48px 28px`, `12px` | `48px 28px`, `12px` | PASS | none |
| service-page | mobile | Final CTA | padding | `48px 28px` | `48px 28px` | PASS | none |
| service-page | mobile | Sticky CTA | fixed bar | `bottom:0`, `--z-sticky-cta`, `10px 14px` | in-flow end bar, `--z-sticky-cta`, `10px 14px` | DEVIATION | The provided full-page mobile PNG renders the bar at the page end; fixed positioning appears in the first viewport in Playwright full-page captures. |
| service-page | desktop | Reference chrome | promo/header/footer | Spec §0 reference values | Route-scoped `ReferenceChrome` using `--color-chrome-*`, `--type-chrome-*` | PASS | Implemented only on `/plumbing/drain-cleaning` because the full-page PNG includes chrome even though specs mark it out of scope. |
| service-page | mobile | Reference chrome | promo/header/footer | Spec §0 reference values | Route-scoped `ReferenceChrome` using `--color-chrome-*`, `--type-chrome-*` | PASS | Implemented only on `/plumbing/drain-cleaning` because the full-page PNG includes chrome even though specs mark it out of scope. |

## Conflicts

- `design-handoff/screens/service-page/spec-desktop.md` and `spec-mobile.md` mark promo/header/footer as `[CHROME]` and say existing site nav/footer are out of scope, but the verification gate diffs the full page against PNGs that include static reference chrome. I implemented route-scoped reference chrome for `/plumbing/drain-cleaning` and kept other service routes on the production chrome.
- `components.md` defines `ImageSlot` as a real-photo slot and says the sand placeholder styling is reference-only. The package provides only `screens/service-page/assets/ironclad-team-hero.png`; it does not provide six service-card images. I implemented the documented placeholder state and did not substitute unrelated assets.
- Mobile reference notes the sticky bar is rendered in-flow at the very bottom, while `responsive.md` requires production `position:fixed; bottom:0`. I placed the mobile bar in flow for parity with the supplied full-page PNG.
- The supplied PNG references are not reproducible from the supplied source document with the required Playwright full-page capture method: direct source capture differs from `reference-desktop.png` by `2.500289915576584%` and from `reference-mobile.png` by `5.0924112085852995%`.

## Package Defects

- Missing named tokens for values present in redlines: why intro body size `17px`, radar label size `14px`, CTA badge letter spacing `0.02em`, active opacity `0.85`, reveal duration/stagger/offset, and pulse scale/opacity. Added scoped implementation tokens in `app/service-page-template.tokens.css`.
- Missing six service-card photo assets. Only the hero asset was supplied.
- Full-page diff gate conflicts with the package's out-of-scope chrome instruction.
- Full-page diff gate conflicts with the supplied reference PNG capture. The live desktop implementation differs from a direct Playwright capture of `source-desktop.html` by only `0.045371787735411444%`, while the source capture itself differs from `reference-desktop.png` by `2.500289915576584%`.
- Several fixture content strings are only fully present in `source-desktop.html` / `source-mobile.html` while the specs refer to "source" for full text.

## Diff Results

| Screen | Format | Result | Pixels differing | Notes |
|---|---|---:|---:|---|
| service-page | desktop | FAIL package residual documented | `2.5150562822772673%` | Comparable to the package's own source-vs-reference floor of `2.500289915576584%`. See `design-handoff/screens/service-page/diff-residual-desktop.png`. |
| service-page | mobile | FAIL package residual documented | `4.601171138126179%` | Below the package's own source-vs-reference floor of `5.0924112085852995%` after placing the sticky CTA at the page end. See `design-handoff/screens/service-page/diff-residual-mobile.png`. |

Intermediate-width sweep: PASS after route-scoped header breakpoint adjustment. Widths checked: `639`, `640`, `641`, `768`, `819`, `820`, `821`, `1024`, `1079`, `1080`, `1081`, `1239`, `1240`, `1241`. No horizontal overflow in final `verification-summary.json`.

Interaction states: PASS by artifact. Screenshots saved in `design-handoff/screens/service-page/states/` for hero call hover/focus, outline hover, service card hover, ink button hover, reviews link focus, FAQ hover/focus, area schedule hover, and final call focus.
