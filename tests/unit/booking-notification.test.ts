import assert from "node:assert/strict";
import { test } from "node:test";
import { readFileSync } from "node:fs";
import { bookingNotificationTraffic } from "../../lib/booking-notification-traffic";
import { isBookingNotificationPayload } from "../../lib/booking-notification-payload";
import { handleBookingNotification } from "../../lib/booking-notification-handler";
import { bookingMailId } from "../../lib/booking-email";
import { buildEmail } from "../../lib/booking-email-template";
import { notificationFixture } from "./booking-notification-fixture";

const production = { NODE_ENV: "production" } as NodeJS.ProcessEnv;
const request = (headers: Record<string, string> = {}, body: unknown = notificationFixture()) =>
  new Request("https://ironcladtexas.com/api/bookings/abandon", { method: "POST", headers, body: JSON.stringify(body) });

for (const [label, headers, env, expected] of [
  ["production", {}, production, "live"],
  ["production proxy loopback", { "x-forwarded-for": "127.0.0.1", origin: "https://ironcladtexas.com" }, production, "live"],
  ["production missing origin", { "x-forwarded-for": "::1" }, production, "live"],
  ["local browser", { origin: "http://localhost:4010" }, production, "test"],
  ["local browser IPv6", { origin: "http://[::1]:4010" }, production, "test"],
  ["local referer", { referer: "http://127.0.0.1:4010/book" }, production, "test"],
  ["explicit live test", { "x-ironclad-test-traffic": "1" }, production, "test"],
  ["preview config", {}, { ...production, BOOKING_NOTIFICATION_TRAFFIC: "test" }, "test"],
  ["development", {}, { NODE_ENV: "development" }, "test"],
  ["opaque origin", { origin: "null" }, production, "live"],
  ["hostname substring", { origin: "https://localhost.example.com" }, production, "live"],
] as const) {
  test(`traffic: ${label}`, () => {
    assert.equal(bookingNotificationTraffic(request(headers), env as NodeJS.ProcessEnv).traffic, expected);
  });
}

test("payload validation rejects malformed arrays, mismatched status/business, and unsafe identifiers", () => {
  const valid = notificationFixture();
  assert.equal(isBookingNotificationPayload(valid, "abandoned"), true);
  for (const bad of [null, [], {}, { ...valid, sessionId: "../other" }, { ...valid, sessionId: "" },
    { ...valid, businessKey: "other-business" }, { ...valid, booking: {} },
    { ...valid, tracking: { ...valid.tracking, screensVisited: "contact_info" } },
    { ...valid, tracking: { ...valid.tracking, timeInBookingMs: -1 } },
    { ...valid, tracking: { ...valid.tracking, completionStatus: "completed" } }]) {
    assert.equal(isBookingNotificationPayload(bad, "abandoned"), false);
  }
});

test("mail identity is stable across mutable timing/IP fields and separate per attempt/status/recipient", () => {
  const payload = notificationFixture();
  const key = bookingMailId(payload, "OPS@example.test");
  assert.equal(key, bookingMailId({ ...payload, tracking: { ...payload.tracking, timeInBookingMs: 8000 } }, "ops@example.test"));
  assert.notEqual(key, bookingMailId(notificationFixture("booking_another"), "ops@example.test"));
  assert.notEqual(key, bookingMailId({ ...payload, status: "completed" }, "ops@example.test"));
  assert.notEqual(key, bookingMailId(payload, "other@example.test"));
});

test("renderer preserves pre-change email HTML, text and subject", () => {
  const expected = JSON.parse(readFileSync(new URL("./booking-email-baseline.json", import.meta.url), "utf8"));
  const payload = notificationFixture();
  assert.deepEqual(buildEmail(payload), expected.abandoned);
  assert.deepEqual(buildEmail({ ...payload, status: "completed" }), expected.completed);
});

test("test traffic and invalid requests never call either downstream writer", async () => {
  let writes = 0;
  const dependencies = {
    queueBusinessNotification: async () => { writes++; return { sent: true, deduplicated: false }; },
    notifyConduitUpdate: async () => { writes++; return "sent" as const; },
  };
  const response = await handleBookingNotification(request({ "x-ironclad-test-traffic": "1" }), "abandoned", dependencies);
  assert.equal(response.status, 200);
  assert.equal((await response.json()).suppressed, true);
  const invalid = await handleBookingNotification(request({}, {}), "abandoned", dependencies);
  assert.equal(invalid.status, 400);
  const tooLarge = await handleBookingNotification(request({}, "x".repeat(300_000)), "abandoned", dependencies);
  assert.equal(tooLarge.status, 413);
  assert.equal(writes, 0);
});

test("live request forwards server context and reports retryable queue failures", async () => {
  assert.equal(process.env.NODE_ENV, "production", "run this suite with NODE_ENV=production");
  let forwards = 0;
  const dependencies = {
    queueBusinessNotification: async (value: ReturnType<typeof notificationFixture>) => {
      assert.equal(value.serverContext.ipAddress, "192.0.2.42");
      return { sent: true, deduplicated: true };
    },
    notifyConduitUpdate: async () => { forwards++; return "sent" as const; },
  };
  const response = await handleBookingNotification(request({ "x-forwarded-for": "192.0.2.42" }), "abandoned", dependencies);
  assert.deepEqual(await response.json(), { sent: true, deduplicated: true, conduit: "sent", traffic: "live" });
  assert.equal(forwards, 1);
  const failed = await handleBookingNotification(request(), "abandoned", {
    ...dependencies, queueBusinessNotification: async () => { throw new Error("database unavailable"); },
  });
  assert.equal(failed.status, 500);
  assert.equal(forwards, 1);
});
