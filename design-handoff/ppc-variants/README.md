# PPC Landing Pages — Content Handoff (20 keywords, desktop + mobile)

**What this is:** the per-keyword **content deltas** for Eng. The page **design and build already exist** as the base **Drain Cleaning** template (see `../screens/service-page/` — `tokens.css`, `spec-desktop.md`, `spec-mobile.md`, reference PNGs). To ship the other 19 keywords, Eng builds from that one template and swaps **only** the fields in each sheet below.

## Scope of change per keyword
Only three areas change per keyword (everything else is constant):
1. **Hero** — H1 (keyword), subhead (pun), support line
2. **Section 2 — Signs** — heading, intro, 4 rows
3. **Section 3 — Services** — heading, intro, 6 cards
Plus the **SEO** `<title>` + meta description.

**Constant across all pages:** promo bar, header/nav, footer, **hero photo**, Guarantee strip, Reviews, Why Ironclad, Stat strip, Process, Service-area, FAQ, Final CTA, sticky bar, phone, offer.

## Desktop + mobile
The **content is identical** for desktop (1440) and mobile (390) — only layout differs, and that layout is already defined in the base `spec-desktop.md` / `spec-mobile.md`. So each sheet applies to both formats. To see any keyword rendered at either width, open **`Service Pages - PPC Variants.dc.html`** and use the **PPC Variant** switcher (top-left); resize to check mobile.

## Content hooks (in the template)
The base markup exposes these `data-slot` attributes: `hero-title`, `hero-subtitle`, `signs-title`, `services-title` (+ the repeated Signs rows and Service cards). Wire each field from the sheets to those slots.

## Page sheets
| # | Keyword | Slug | Sheet |
|---|---|---|---|
| 01 | Drain cleaning | drain-cleaning | [pages/01-drain-cleaning.md](pages/01-drain-cleaning.md) |
| 02 | Clogged drain | clogged-drain | [pages/02-clogged-drain.md](pages/02-clogged-drain.md) |
| 03 | Toilet repair | toilet-repair | [pages/03-toilet-repair.md](pages/03-toilet-repair.md) |
| 04 | Emergency plumber | emergency-plumber | [pages/04-emergency-plumber.md](pages/04-emergency-plumber.md) |
| 05 | Burst pipe repair | burst-pipe-repair | [pages/05-burst-pipe-repair.md](pages/05-burst-pipe-repair.md) |
| 06 | Leak repair | leak-repair | [pages/06-leak-repair.md](pages/06-leak-repair.md) |
| 07 | Water heater repair | water-heater-repair | [pages/07-water-heater-repair.md](pages/07-water-heater-repair.md) |
| 08 | Garbage disposal repair | garbage-disposal-repair | [pages/08-garbage-disposal-repair.md](pages/08-garbage-disposal-repair.md) |
| 09 | Sump pump repair | sump-pump-repair | [pages/09-sump-pump-repair.md](pages/09-sump-pump-repair.md) |
| 10 | Faucet repair / install | faucet-repair | [pages/10-faucet-repair.md](pages/10-faucet-repair.md) |
| 11 | Water heater replacement / install | water-heater-installation | [pages/11-water-heater-installation.md](pages/11-water-heater-installation.md) |
| 12 | Tankless water heater install | tankless-installation | [pages/12-tankless-installation.md](pages/12-tankless-installation.md) |
| 13 | Repiping / whole-house repipe | repiping | [pages/13-repiping.md](pages/13-repiping.md) |
| 14 | Leak detection | leak-detection | [pages/14-leak-detection.md](pages/14-leak-detection.md) |
| 15 | Slab leak repair | slab-leak-repair | [pages/15-slab-leak-repair.md](pages/15-slab-leak-repair.md) |
| 16 | Sewer line repair / replacement | sewer-line-repair | [pages/16-sewer-line-repair.md](pages/16-sewer-line-repair.md) |
| 17 | Sewer / drain jetting (hydro jetting) | hydro-jetting | [pages/17-hydro-jetting.md](pages/17-hydro-jetting.md) |
| 18 | Gas line repair / install | gas-line-service | [pages/18-gas-line-service.md](pages/18-gas-line-service.md) |
| 19 | Bathroom remodel plumbing | bathroom-plumbing | [pages/19-bathroom-plumbing.md](pages/19-bathroom-plumbing.md) |
| 20 | Water softener / filtration install | water-treatment | [pages/20-water-treatment.md](pages/20-water-treatment.md) |

## Photos
Each page has **6 blank service-card photo slots** (Section 3). The hero photo is shared (existing team photo). See **[PHOTO-LIST.md](PHOTO-LIST.md)** (and **PHOTO-LIST.csv**) for the 6-pack to source per keyword, with a shot description under each. Total to source: **120 photos** (20 × 6).

## One open decision
In the base build, the **Service-area** button, **Final-CTA** button/heading, and the **FAQ** block still say "Drain Cleaning." Current scope changes only Hero + Section 2 + Section 3 per keyword, so those stay as-is. If you want them made per-service too (recommended for the FAQ especially), that's a quick follow-up — say the word.
