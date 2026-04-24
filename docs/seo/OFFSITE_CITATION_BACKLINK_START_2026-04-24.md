# Ironclad Off-Site SEO Start

Date: 2026-04-24
Domain: https://ironcladtexas.com

## Current Status

- Production `/book` and `/careers` are indexable after deploy `ironclad-marketing-00060-5j2`.
- `npm run phase0:live:audit` passes against `https://ironcladtexas.com`.
- `npm run launch:prod:audit` passes against production.
- GBP APIs are enabled in `conduit-external-dev`, but the current CLI token lacks the `business.manage` OAuth scope, so listing-level GBP audit/edit work is blocked until the profile owner grants manager access or re-auths with the right scope.

## Canonical NAP Packet

Use exactly this data when creating or correcting citations.

| Field | Canonical Value |
| --- | --- |
| Business name | Ironclad Plumbing |
| Website | https://ironcladtexas.com |
| Booking URL | https://ironcladtexas.com/book |
| Phone | (833) 597-1932 |
| Email | info@ironcladtexas.com |
| Primary market | Austin, TX |
| Service area | Greater Austin, including Travis, Williamson, Hays, and nearby Hill Country communities |
| Primary category | Plumber |
| Secondary categories | Drain cleaning service, water heater service, sewer service, emergency plumber, leak detection service |

## Public Citation Snapshot

| Surface | Status | Next Action |
| --- | --- | --- |
| Google Business Profile | Access blocked from CLI by OAuth scope | Add a profile manager or re-auth with `business.manage`; then audit category, services, service areas, photos, Q&A, reviews, and links. |
| Yelp | A public search mirror shows `www.yelp.com/biz/ironclad-plumbing-austin` with Austin copy | Verify directly in browser, claim if needed, confirm phone/site/booking URL, add service categories and photos. |
| BBB | Search results mainly show unrelated Florida Ironclad Plumbing | Create or claim Central Texas BBB profile if eligible; avoid confusing it with Florida listing. |
| Nextdoor | Search results show unrelated Florida/Ohio Ironclad listings | Create/claim the Austin service-area business page; do not reuse unrelated same-name pages. |
| Angi | Search results mainly show unrelated Florida Ironclad listing | Create/claim Austin listing with canonical NAP and service coverage. |
| Apple Maps | Not verified in this pass | Check Apple Business Connect and create/claim profile. |
| Bing Places | Not verified in this pass | Create/import from GBP after GBP is clean. |
| Chamber / local associations | Not started | Target Austin Chamber, local contractor associations, neighborhood groups, and supplier partner pages. |

## Backlink Targets

Prioritize links that would make sense even if Google ignored ranking signals.

| Priority | Target Type | Ask | Landing Page |
| --- | --- | --- | --- |
| P0 | Claimed local profiles | Claim/complete profile and add website link | `/` |
| P0 | GBP website and appointment links | Website = homepage, appointment/booking = `/book` | `/book` |
| P1 | Supplier/manufacturer dealer pages | Add Ironclad as Austin service or installation partner | relevant `/plumbing/...` page |
| P1 | Austin homeowner resources | Add Ironclad pricing guides as a homeowner reference | `/guides` or specific guide |
| P1 | Neighborhood/community sponsorships | Sponsor page with business name, phone, and website | `/service-area/[city]` |
| P2 | Local PR / trade publications | Pitch written guarantees and published Austin plumbing price guide | `/guarantees` or `/guides/what-plumbing-costs-austin` |
| P2 | Real estate / property manager vendors | Preferred vendor profile or maintenance resource link | `/plumbing` |

## Outreach Templates

### Citation Claim

Subject: Ironclad Plumbing profile update

Hi,

I’m updating Ironclad Plumbing’s Austin-area business profile so customers have the correct contact information.

Canonical details:
- Website: https://ironcladtexas.com
- Booking: https://ironcladtexas.com/book
- Phone: (833) 597-1932
- Email: info@ironcladtexas.com
- Category: Plumber
- Service area: Greater Austin, TX

Please confirm the profile is claimed or let me know the verification step you need.

### Partner Link

Subject: Austin plumbing resource for your customers

Hi,

Ironclad Plumbing published an Austin homeowner resource that may be useful for customers comparing plumbing work before they hire:

https://ironcladtexas.com/guides/what-plumbing-costs-austin

If you maintain a homeowner resources or trusted vendors page, this would be a practical reference for Austin plumbing pricing, red flags, and questions to ask before booking.

Thanks.

## Execution Rules

- Do not buy bulk links, rented sidebar links, PBN links, or exact-match anchor packages.
- Paid sponsorships are fine only when they are real local sponsorships and any paid placement is marked appropriately by the publisher.
- Use branded or natural anchors: `Ironclad Plumbing`, `Ironclad Plumbing in Austin`, `Austin plumbing cost guide`, or the naked URL.
- Never point all backlinks to the homepage. Use service, guide, guarantee, and city pages where relevant.
- Keep NAP identical across citations. If a platform requires an address for a service-area business, verify GBP/address policy first.
