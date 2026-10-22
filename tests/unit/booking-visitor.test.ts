import assert from "node:assert/strict";
import { test } from "node:test";
import { bookingVisitorId } from "../../lib/booking-visitor";
import { bookingMailId } from "../../lib/booking-email";
import { notificationFixture } from "./booking-notification-fixture";

test("visitor groups normalize IPv6 and remain separate across IPs and businesses", () => {
  const payload = notificationFixture();
  const withIp = (ipAddress: string) => ({ ...payload, serverContext: { ...payload.serverContext, ipAddress } });
  const first = withIp("2001:db8::1");
  assert.equal(bookingVisitorId(first), bookingVisitorId(withIp("2001:0db8:0:0:0:0:0:1")));
  assert.notEqual(bookingVisitorId(first), bookingVisitorId(withIp("2001:db8::2")));
  assert.notEqual(bookingVisitorId(first), bookingVisitorId({ ...first, businessKey: "other" }));
  assert.equal(bookingVisitorId(withIp("NA")), null);
  assert.equal(bookingVisitorId(withIp("")), null);
  assert.equal(bookingVisitorId(withIp("not-an-ip")), null);
  assert.ok(bookingVisitorId(withIp("fe80::1%en0")));
  assert.notEqual(bookingMailId(first, "ops@example.test"), bookingMailId({ ...first, status: "completed" }, "ops@example.test"));
});
