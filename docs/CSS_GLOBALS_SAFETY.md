# globals.css Safety Guide

## Incident: CSS Truncation (2026-03-19)

Commit `8b5956d` ("feat(booking): 4-step booking wizard") accidentally truncated `app/globals.css` from 1233 lines to 289 lines, deleting 964 lines of CSS including all guide page styles, FAQ section styles, and footer wordmark styles. The site shipped broken for an unknown period before it was caught visually.

### Root cause

The engineer (or their tooling) replaced the entire file contents rather than inserting new CSS at the correct position. Everything after the `prefers-reduced-motion` media query was silently dropped.

### What was lost

| CSS class prefix | Purpose |
|---|---|
| `.guide-*` | Guide page layout, hero, article cards, TOC, sidebar, typography |
| `.faq-home*` / `.faq-item*` | FAQ section dark background, accordion styling |
| `.footer-wordmark-*` | Giant "Ironclad" text animation in footer |
| Responsive `@media` queries | Mobile/tablet breakpoints for all of the above |

### Fix applied

Started from the last known-good version (`1864b50`), then layered the three legitimate additions from subsequent commits on top — producing the correct union of old + new CSS.

---

## Rules to prevent this from happening again

### 1. Never replace globals.css wholesale

When adding new CSS, **insert at a specific location** — do not rewrite the entire file. If your editor or AI tool regenerates the full file, diff it against the original before committing.

### 2. Check line count before committing

```bash
wc -l app/globals.css
```

If the line count drops significantly from the previous commit, something was deleted. The file should be ~1260+ lines as of March 2026.

### 3. Review the full diff, not just additions

```bash
git diff app/globals.css | head -100
```

Look for unexpected red (deleted) lines, especially large blocks. A commit that "only adds CSS" should have zero deletions in globals.css.

### 4. Smoke-test critical visual elements after any CSS change

After touching `app/globals.css`, visually verify these on localhost:

- [ ] Homepage FAQ section (dark background, accordion items)
- [ ] Footer wordmark ("Ironclad" giant text)
- [ ] Any guide page (e.g., `/guides/plumbing-services`)
- [ ] Booking wizard modal (border glow, animations)

### 5. Use targeted insertions

When adding new CSS classes, find the right section in the file and insert there. The file is organized as:

1. **CSS variables & theme** (lines 1-52)
2. **Base resets & typography** (lines 53-189)
3. **Animations & promo bar** (lines 190-231)
4. **Booking wizard styles** (lines 232-300)
5. **Guide page styles** (lines 301-1100)
6. **FAQ styles** (lines 1101-1220)
7. **Footer wordmark styles** (lines 1221-1264)

Add new styles in the appropriate section or at the end of the file — never regenerate from scratch.
