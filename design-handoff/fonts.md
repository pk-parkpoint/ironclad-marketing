# Fonts — Ironclad Service Page Template

Two families are loaded by the page; **one is actually used**. Read the note on Hanken Grotesk.

---

## 1. Schibsted Grotesk  *(display / headings / numerals)*

- **`font-family` string:** `'Schibsted Grotesk'`
- **Full stack (as used):** `'Schibsted Grotesk', system-ui, sans-serif`
- **Weights used (numeric):** 600 (semibold — sign titles, service-card titles), 700 (bold — all section headings, numerals, stats, process/why titles)
- **Loaded weights:** 400, 500, 600, 700 (400/500 are loaded but unused — safe to trim to 600;700)
- **Italic:** none
- **Source (Google Fonts embed):**
  ```html
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Schibsted+Grotesk:wght@600;700&display=swap" rel="stylesheet">
  ```
- **Fallback stack:** `system-ui, sans-serif`
- **`font-display`:** `swap` (as loaded). Headings are large; a brief FOUT swap is acceptable. If layout-shift matters, preload the 700 woff2 and keep `swap`.
- **Applied to:** every `<h2>` section heading, `<h3>` sign/service/why/process titles, the big sign numbers (01–04), the stat numbers (142 / 4.9 / 19+), the why/process step numbers.
- **Feature settings:** none required. Where numerals must not jitter, the design sets `font-variant-numeric: tabular-nums` — this appears ONLY on the sign numbers (01–04). Apply `font-feature-settings: "tnum" 1;` (or `font-variant-numeric: tabular-nums;`) there. Stat numbers and process/why numbers use default (proportional) figures.

---

## 2. Body text — system UI stack  *(no web font)*

- **`font-family` string:** `-apple-system, 'SF Pro Display', 'SF Pro Text', BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif`
- **Weights used:** 400 (body copy), 600 (labels, trust items, chips, nav), 700 (button labels, guarantee/callout/FAQ titles, review names), 800 (hero H1, eyebrows)
- **Source:** none — resolves to the OS UI font (San Francisco on Apple, Segoe UI on Windows, Roboto/system-ui on Android/Linux).
- **Italic:** none
- **`font-display`:** n/a (system font, no load, no FOUT).
- **Applied to:** the hero H1 + subtitle, all paragraph/body copy, buttons, chips, trust badges, guarantee labels, review text, FAQ questions/answers, footer.
- **Note:** because this is a system stack, exact glyph shapes and metrics differ slightly per OS. That is intended and acceptable; the reference PNGs were rendered on macOS (San Francisco). Diffing on a different OS will show minor sub-pixel text differences in body copy — not a defect.

---

## 3. ⚠ Hanken Grotesk — loaded but UNUSED

The page's `<head>` currently loads **Hanken Grotesk** (`family=Hanken+Grotesk:wght@400;500;600;700`) alongside Schibsted Grotesk, but **no rule references it** — body text uses the system stack above and headings use Schibsted Grotesk.

**Recommendation:** drop Hanken Grotesk from the font load to save a request, OR, if the brand intends body copy to be Hanken Grotesk, set `--font-family-body` to `'Hanken Grotesk', <system fallback>` and confirm — this WOULD change body metrics and reflow. Do not silently keep loading it. Flagged in AUDIT RESULT.

**As-built (what the reference PNGs show):** body = system stack, headings = Schibsted Grotesk. Build to that unless the brand says otherwise.

---

## Combined embed (as-built, recommended)

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Schibsted+Grotesk:wght@600;700&display=swap" rel="stylesheet">
```
(Only Schibsted Grotesk; body needs no web font.)
