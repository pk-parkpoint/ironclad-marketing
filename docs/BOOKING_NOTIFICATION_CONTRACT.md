# Booking notification traffic and idempotency contract

Scope: Ironclad business booking notifications and address completeness.

- Development/test runtimes, explicit `BOOKING_NOTIFICATION_TRAFFIC=test`, local
  browser origins, and requests marked `X-Ironclad-Test-Traffic: 1` are test traffic.
  Test notification requests return a labeled acknowledgement and queue neither
  business email nor Conduit intake. Test logging contains no contact details.
- A loopback forwarded IP alone is not sufficient to classify a production
  request as test traffic: reverse proxies may supply it. Short duration, missing
  contact details, and crawler user agents do not suppress the first visitor alert.
- Abandoned visits are grouped by a normalized server-observed IP hashed with the
  business key. The first visit sends an email. Repeat attempts without new input
  are logged without another email; newly entered contact, time, issue, or detail
  information sends an incremental alert. Page/service prefill and the default
  calendar date do not count as entered information. Unknown IPs remain separate
  attempts rather than collapsing all unknown visitors together.
- `businesses/{business}/bookingVisitors/{visitorId}` records the count, first/last
  visit, and accumulated information. Its `attempts/{sessionId}` children retain
  each complete visit payload for later agent queries. Transactional mail creation
  and per-attempt records handle concurrent visits and retries without duplicate
  alerts or counts. Completed bookings retain attempt/status/recipient identity.
  Each attempt retains its original notification information so an old retry
  cannot send a new alert after later visits have supplied more details.
- Existing mail documents are never updated, replayed, or deleted. No historical
  record is destructively reclassified. The existing Firestore mail sender remains
  unchanged. Deterministic mail retention is the deduplication retention period.
- Notification payloads require bounded attempt/session IDs, the fixed Ironclad
  business identity, and the complete expected field shape before processing.
- Conduit forwarding remains the existing authenticated, best-effort path for
  every live visit, including unchanged repeats. The backend accepts authenticated
  anonymous visitor/session keys so phone-less abandoned visits share one inbox
  conversation with durable per-attempt detail. Unknown IPs use separate session
  destinations. Existing known-phone contacts use
  canonical phone matching; an IP is a visitor grouping, never proof of identity.
- Booking links that navigate to `/book` must not first mount an intermediate
  wizard on the source page. One user opening produces one active wizard.

Operational testing: always send `X-Ironclad-Test-Traffic: 1` on live synthetic
notification requests. For a local production build or preview server, explicitly
set `BOOKING_NOTIFICATION_TRAFFIC=test`; this also protects direct API tests
that have no browser Origin. This switch does not sandbox scheduling API calls.

Rollback: restore the preceding site and paired backend revisions. Retain queued mail and delivery
receipts. No credential or existing service environment value needs changing.

Development effect replay must not count as leaving the wizard. Cleanup captures
its own attempt and defers sending by one microtask; immediate effect re-setup
cancels that cleanup. Real dismissal, page exit, and navigation retain notification
behavior. A retiring wizard must never clear a newer wizard's active attempt.

Verification uses the Firestore emulator with a `demo-` project and no email
worker, plus intercepted browser notification routes. All repository Playwright
requests carry the test header, and their web server explicitly disables live
booking notifications. This protects synthetic traffic even when local default
cloud credentials are available.

Time selection (IRONCLAD-BOOKING-1022): the wizard order is Schedule Time,
Contact Info, Select Issue, Confirm Details. The calendar may show the first
offerable day, but no time is selected/reserved until the customer clicks it.
Continue requires a selected time and a live hold; pending or expired holds do
not advance. Initial time preference is empty. Abandoning on the time screen is
still recorded, and service links can supply page context before any issue choice.

Address completeness (USER-BOOKING-ADDRESS-0928): Google Places fills the visible
street, city, state, and ZIP fields. Continuing requires each field; manual entry
remains available if Google cannot load. Address edits invalidate prior coordinates.
The wizard composes the same country-free full address for confirmation, scheduling,
and completed/abandoned leads. Email and Conduit forwarding also reconstruct a
street-only display from complete structured locality on older payloads. Partial
abandoned leads remain partial; no city or ZIP is inferred from IP geolocation.
Google component reference: https://developers.google.com/maps/documentation/javascript/examples/places-autocomplete-addressform

Date rollover (IRONCLAD-DATE-1023): a visible wizard rechecks the Austin business
date on focus, page restoration, visibility changes and once per minute. When
its selected day is past, it returns to Schedule Time, clears the old time/hold,
and shows the first offerable day with no time selected. Contact and issue input
remain available. Calendar month/year follow the refreshed day. A confirmed
booking is never reset by this behavior.

An abandoned notification with a date before Austin's current day labels it
Previous Preferred Date and explains the historical date. It states that no
appointment was submitted only when the payload reports Booking API Submitted
No and has no booking identifier. Completed notifications retain their existing
rendering. Stored payloads and delivered mail remain unchanged; no historical
notification is replayed. This also covers old browser versions still open at
release time. The recorded client visit duration is diagnostic evidence, not a
server-verified visit-start timestamp.
