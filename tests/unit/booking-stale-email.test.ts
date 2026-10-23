import assert from "node:assert/strict";
import { test } from "node:test";
import { buildEmail } from "../../lib/booking-email-template";
import { notificationFixture } from "./booking-notification-fixture";

test("old incomplete dates stay accurate and are clearly labeled as historical", () => {
  const payload = notificationFixture();
  payload.booking.preferredDate = "2026-10-20";
  payload.booking.preferredWindow = "9:00 AM - 12:00 PM";
  const rendered = buildEmail(payload, new Date("2026-10-23T22:54:03Z"));
  assert.match(rendered.text, /Previous Preferred Date: 20-Oct-2026/);
  assert.match(rendered.text, /This date has passed. No appointment was submitted for this incomplete attempt\./);
  assert.match(rendered.html, /Previous Preferred Date/);
  assert.match(rendered.html, /No appointment was submitted/);
  assert.equal(payload.booking.preferredDate, "2026-10-20");
});

test("a past completed booking or a submitted booking is never described as unbooked", () => {
  const payload = notificationFixture();
  payload.booking.preferredDate = "2026-10-20";
  const now = new Date("2026-10-23T22:54:03Z");
  assert.doesNotMatch(buildEmail({ ...payload, status: "completed" }, now).text, /Previous Preferred Date|No appointment was submitted/);
  payload.tracking.bookingApiSubmitted = "Yes";
  assert.doesNotMatch(buildEmail(payload, now).text, /No appointment was submitted/);
});

test("notification staleness uses Austin midnight rather than UTC midnight", () => {
  const payload = notificationFixture();
  payload.booking.preferredDate = "2026-10-23";
  assert.doesNotMatch(buildEmail(payload, new Date("2026-10-24T04:59:59Z")).text, /Previous Preferred Date/);
  assert.match(buildEmail(payload, new Date("2026-10-24T05:00:00Z")).text, /Previous Preferred Date/);
});
