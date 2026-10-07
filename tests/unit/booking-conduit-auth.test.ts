import assert from "node:assert/strict";
import { test } from "node:test";
import { notifyConduitUpdate } from "../../lib/booking-conduit";
import { notificationFixture } from "./booking-notification-fixture";

test("booking notification authenticates its name-bearing handoff", async () => {
  const previousFetch = globalThis.fetch;
  const previousUrl = process.env.BOOKING_WEBHOOK_URL;
  const previousSecret = process.env.CONDUIT_FORM_SECRET;
  process.env.BOOKING_WEBHOOK_URL = "https://conduit.example.test/web-form/submit";
  process.env.CONDUIT_FORM_SECRET = "test-only-form-secret";
  let request: RequestInit | undefined;
  globalThis.fetch = async (_url, init) => {
    request = init;
    return new Response("{}", { status: 200 });
  };
  try {
    assert.equal(await notifyConduitUpdate(notificationFixture("auth-proof")), "sent");
    assert.equal(new Headers(request?.headers).get("X-Form-Secret"), "test-only-form-secret");
    assert.equal(JSON.parse(String(request?.body)).eventType, "booking_submitted");
    assert.ok(JSON.parse(String(request?.body)).booking.customerName);
  } finally {
    globalThis.fetch = previousFetch;
    if (previousUrl === undefined) delete process.env.BOOKING_WEBHOOK_URL;
    else process.env.BOOKING_WEBHOOK_URL = previousUrl;
    if (previousSecret === undefined) delete process.env.CONDUIT_FORM_SECRET;
    else process.env.CONDUIT_FORM_SECRET = previousSecret;
  }
});
