import assert from "node:assert/strict";
import { test } from "node:test";
import { firstOfferableDateId, ironcladTodayDateId } from "../../lib/booking-date-policy";

test("calendar day is Austin's day across midnight and the same-day cutoff", () => {
  assert.equal(ironcladTodayDateId(new Date("2026-10-24T04:59:59Z")), "2026-10-23");
  assert.equal(ironcladTodayDateId(new Date("2026-10-24T05:00:00Z")), "2026-10-24");
  assert.equal(firstOfferableDateId(new Date("2026-10-23T20:00:00Z")), "2026-10-23");
  assert.equal(firstOfferableDateId(new Date("2026-10-23T20:00:01Z")), "2026-10-24");
});
