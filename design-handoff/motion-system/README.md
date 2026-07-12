# Ironclad Motion System v1.0

Source package: `/Users/15237/Downloads/Drain cleaning page redesign (12).zip`

Source SHA-256: `d1650b47cda396ff68721216091279e65874d4dbd60abb0f6b5c5becd4f5dcd9`

Canonical reference: `IP - FAQ Hub (Canonical)` in the design workspace.

This directory records the reusable animation template supplied by design and the production adaptation proven first on the FAQ cluster. The implementation intentionally loads only on FAQ routes until the motion and performance checks are accepted for sitewide rollout.

## Production template

- Runtime: `components/motion/ironclad-motion.tsx`
- Tokens and effects: `components/motion/ironclad-motion.css`
- Initial consumers: `/questions` hub/topics/posts plus the legacy `/faq` routes

Wrap page content with `IroncladMotionRoot`, then use attribute/class hooks. The runtime is dependency-free and is code-split with the FAQ routes.

| Effect | Hook | Timing |
|---|---|---|
| Scroll reveal | `data-reveal` | 600ms, 14px rise, 90ms three-column stagger |
| Hero cascade | `data-entrance` | 650ms, 100ms child stagger |
| Count-up | `data-count="200"` | 1100ms cubic ease-out |
| Rotating word | `.ic-rot > [data-rotate]` | 350ms flip every 2600ms; wrapper width follows each word over 300ms |
| Underline draw | `.ic-underline` | 800ms after an 800ms delay |
| CTA sheen/press | `.ic-cta > .ic-sheen` | 6s ambient cycle; 150ms press |
| Accordion | native `details` | 350ms progressive enhancement |
| Icon pulse | `.ic-pulse-icon` | two 800ms beats after 1200ms |
| Live dot | `.ic-pulse-dot` | 2600ms ambient ring |
| Glass shimmer | `.ic-glass` | fine-pointer hover only |
| Arrow nudge | `.ic-nudge` | 4s ambient cycle |

Signature easing: `cubic-bezier(0.22, 0.61, 0.36, 1)`. Motion must not bounce or overshoot.

## Hard budgets

1. One hero entrance per page.
2. Reveal section headers, card grids, and CTA bands—not body paragraphs, every FAQ row, navigation, or footer.
3. At most one sheen, one live pulse dot, and one arrow nudge per page.
4. Use opacity and transforms. Accordion block-size is the sole progressive-enhancement exception.
5. Keep interaction feedback at or below 200ms. Ambient cycles may run for 4–6 seconds.
6. Do not add a general animation dependency; this runtime uses platform APIs and cleans up observers, timers, animation frames, and pointer listeners.

## Accessibility and resilience

- `prefers-reduced-motion: reduce` prevents the runtime class from being applied. Content, underline, and counts remain in their final state.
- Without JavaScript, content remains visible because hidden/reveal styles require `.ic-anim`.
- Without `IntersectionObserver`, reveal content is shown immediately and counts retain their server-rendered final value.
- A passive, animation-frame-throttled scroll check resolves any reveal targets passed by a fast scrollbar jump.
- Glass shimmer is not initialized for coarse/touch pointers.
- Real count values and the first rotating word are server rendered for SEO and no-JS behavior.
- The rotating-word wrapper animates to each word's rendered width, matching the canonical FAQ Hub behavior.

## FAQ rollout

- New hub (`/questions`): entrance, underline, rotating topic word, 200-answer count, glass treatment, topic-card reveals, one CTA sheen, header live dot, and promo-arrow nudge.
- New topic pages: entrance, jump-index reveal, and CTA-band reveal. Individual Q&A rows do not reveal; reading content remains calm.
- New posts: entrance, quick-answer icon pulse, steps/list reveals, related-question reveal, and CTA-band reveal.
- Legacy FAQ routes retain the same progressive runtime while the new cluster becomes the canonical rollout target.

## Verification gate before sitewide rollout

1. Lint and production build pass.
2. FAQ motion E2E passes with normal motion, reduced motion, and JavaScript disabled.
3. No FAQ runtime errors or horizontal overflow at desktop and mobile widths.
4. No layout shift attributable to entrance/reveal effects.
5. Recheck the reveal and ambient budgets for each new page type before adding hooks.
