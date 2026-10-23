# Booking entry-point review — 2026-10-23

Scope: every public HTML route in the production build, explicit redirects, and
one missing URL to exercise the 404 page. The 259-route catalog includes pages
absent from the sitemap, such as Data Desk, paid landing pages, and the booking
preview. Phone calls and general contact forms are separate flows.

The opt-in browser suite inventories each rendered booking link on every page.
It also opens the mobile menu, follows the Data Desk keyboard link, and exercises
the preview's embedded button. Each reachable control goes through time choice,
contact information, editable issue selection, review, and simulated confirmation.
Checks cover destination and query preservation, selected service, a single
wizard, no premature abandonment, runtime errors, and the booking request body.
The two profiles are desktop Chrome (1440px) and iPhone Safari (390px).

All scheduling and notification writes are intercepted before navigation. Unknown
writes fail closed; service workers are blocked. A local sentinel verifies that a
POST cannot reach a server. The test header is an additional precaution. This
review does not create appointments, send alerts, or verify live dispatch.

## Fixes

- Data Desk hid its primary booking button at widths of 1080px and below. Its
  remaining booking link was clipped until keyboard focus, and its pages do not
  use the main site's mobile booking bar. The primary button now stays visible
  on all 26 Data Desk pages. Phone access remains visible.
- Data Desk's tablet dropdown extended past the screen edge. Aligning it to the
  navigation item's right edge removes the horizontal overflow. Responsive
  checks cover 320, 390, 640, 768, 1080, and 1280px in both engines.
- Reviews and local-area pages rendered their own fixed booking bars beneath
  the global mobile bar. The higher global bar intercepted taps and discarded
  the local bar's location query. The global bar now yields when a page has its
  own fixed actions. Other pages, including unknown local URLs, retain it.
- The public preview's embedded-wizard launch button also sat beneath the
  global mobile bar. Its mobile position now clears that bar.
- The water-softener repair page's header link inherited `water-softener-repair`,
  which selected Other Issue, while the page's own link used `water-treatment`
  and selected Other Installation. Both now select the water-treatment choice.

## Deployed behavior

The public website served the older booking wizard during this review. Opening
it automatically selected a time and issued a hold request before a customer
clicked a window.
The explicit-time-choice source fix was already merged in PR #97. The deployed
Data Desk button, overlapping mobile bars, and water-softener header behavior
also retain the problems above. Merging this review does not deploy the website.

## Reproduce

Install dependencies with `npm ci`, then build with isolated test endpoints:

```sh
BOOKING_NOTIFICATION_TRAFFIC=test \
BOOKING_WEBHOOK_URL=http://127.0.0.1:4021/webhooks/bookings \
IRONCLAD_CONDUIT_API_BASE_URL=http://127.0.0.1:4021 \
IRONCLAD_PUBLIC_BOOKING_TOKEN=entry-review-fixture npm run build
npx playwright test --config playwright.entry-review.config.ts
```

The separate test directory keeps the exhaustive, production-build-dependent
crawl outside the ordinary development-server suite. To narrow a diagnosis,
set `BOOKING_REVIEW_PAGES=/data,/plumbing/water-softener-repair`. For a safe live
review, set `BOOKING_REVIEW_ORIGIN=https://ironcladtexas.com`; all writes remain
mocked, and deployed defects should make the checks fail. A live review can
use `BOOKING_REVIEW_CATALOG=/absolute/path/routes.json` with a frozen JSON array
of reviewed routes, so rebuilding locally cannot interrupt worker collection.

`BOOKING_REVIEW_OUTPUT` chooses the evidence directory and
`BOOKING_REVIEW_REPORT` chooses the JSON runner report. Each page/profile emits
`entry-coverage.json`, including the full control inventory, attempted entries,
selected issue, findings, errors, and simulated booking count. Reconcile both
profiles: every inventoried control must be activated in at least one profile.
