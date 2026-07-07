# 14. Leak detection — content update sheet

**Base template:** Drain Cleaning (see `handoff/screens/service-page/`). Build this page from the base template and change **only** the fields below. Everything else — layout, styling, and all other sections — is identical to the base.

**Applies to BOTH formats:** desktop 1440 (`spec-desktop.md`) and mobile 390 (`spec-mobile.md`). The text content is the same in both; only the layout differs, and that is already defined in the base specs. Preview any keyword at either width in `Service Pages - PPC Variants.dc.html` (PPC Variant switcher).

**Suggested page slug:** `/plumbing/leak-detection`

---

## SEO (`<head>`)
- **Title tag:** Leak Detection in Austin, TX | Ironclad Plumbing
- **Meta description:** Hidden leak in Austin? Ironclad pinpoints it without tearing up your home, then gives a clear fix and price. 5-star service. Call now.

## Hero  `data-slot="hero-title" / "hero-subtitle"`
- **H1 (keyword):** Precise, Expert Leak Detection
- **Subhead (pun):** Leak no further.
- **Support line:** We pinpoint hidden leaks without tearing up your home, then give a clear fix and price.
- **Hero image:** unchanged — reuse the base team photo (no new photo).

## Section 2 — Signs  `data-slot="signs-title"`
- **Heading:** Signs of a Hidden Leak
- **Intro:** You can't fix what you can't find. These say it's time to look closer.
- **Rows 01–04:**
  1. **An unexplained high water bill** — A bill that climbs with no change in use is the top hidden-leak clue.
  2. **The meter runs with water off** — A moving meter when everything is off proves water is escaping.
  3. **Damp, warm, or moldy spots** — Moisture, warm floors, or a musty smell point to a leak nearby.
  4. **Sounds of running water** — Hearing water with all fixtures off means it is flowing somewhere hidden.

## Section 3 — Services  `data-slot="services-title"`
- **Heading:** Our Leak Detection Services
- **Intro:** Non-invasive tools find the leak precisely, so the repair is small and targeted.
- **Cards 1–6** (photos: see `PHOTO-LIST.md` → 14. Leak detection):
  1. **Acoustic leak location** — Sensitive listening gear pinpoints leaks inside walls and slabs.
  2. **Slab leak detection** — We locate leaks under the foundation before opening anything.
  3. **Under-slab & in-wall** — Hidden lines traced without unnecessary demolition.
  4. **Camera line inspection** — We send a camera to see the pipe from the inside.
  5. **Pressure testing** — Isolating and testing lines confirms exactly where water is lost.
  6. **Clear diagnosis & quote** — You get the location, the cause, and an upfront price.

## Do NOT change (constant across every service)
Promo bar · header/nav · footer · **hero photo** · Guarantee strip · Reviews · Why Ironclad · Stat strip · Process ("What to Expect") · Service-area · FAQ · Final CTA · mobile sticky bar · phone number · offer.

> Note: in the base build the **Service-area** button, **Final-CTA** button/heading, and the **FAQ** still say "Drain Cleaning." Per the current scope only Hero + Section 2 + Section 3 change per keyword. If you want those made per-service too, that's a follow-up.
