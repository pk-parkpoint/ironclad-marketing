# Booking notification traffic and idempotency contract

Scope: Ironclad business booking notifications; no booking-step or scheduling changes.

- Development/test runtimes, explicit `BOOKING_NOTIFICATION_TRAFFIC=test`, local
  browser origins, and requests marked `X-Ironclad-Test-Traffic: 1` are test traffic.
  Test notification requests return a labeled acknowledgement and queue neither
  business email nor Conduit intake. Test logging contains no contact details.
- A loopback forwarded IP alone is not sufficient to classify a production
  request as test traffic: reverse proxies may supply it. Short duration, missing
  contact details, and repeated IPs do not suppress genuine visitor alerts.
- Live mail documents use deterministic IDs scoped to business, booking attempt,
  notification status, and recipient. A Firestore transaction creates only absent
  mail rows. Replays and concurrent requests cannot create another email for the
  same attempt/status/recipient; completed and abandoned remain distinct events.
- Existing mail documents are never updated, replayed, or deleted. No historical
  record is destructively reclassified. The existing Firestore mail sender remains
  unchanged. Deterministic mail retention is the deduplication retention period.
- Notification payloads require bounded attempt/session IDs, the fixed Ironclad
  business identity, and the complete expected field shape before processing.
- Conduit forwarding remains the existing best-effort path for live traffic.
- Booking links that navigate to `/book` must not first mount an intermediate
  wizard on the source page. One user opening produces one active wizard.

Operational testing: always send `X-Ironclad-Test-Traffic: 1` on live synthetic
notification requests. For a local production build or preview server, explicitly
set `BOOKING_NOTIFICATION_TRAFFIC=test`; this also protects direct API tests
that have no browser Origin. This switch does not sandbox scheduling API calls.

Rollback: restore the preceding site revision. Retain queued mail and delivery
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
