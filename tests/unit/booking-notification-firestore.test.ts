import assert from "node:assert/strict";
import { test } from "node:test";
import { randomUUID } from "node:crypto";
import { Firestore } from "firebase-admin/firestore";
import { bookingMailId, queueBusinessNotification } from "../../lib/booking-email";
import { notificationFixture } from "./booking-notification-fixture";

// Never allow this proof to connect to a real project or mail trigger.
assert.match(process.env.FIRESTORE_EMULATOR_HOST || "", /^127\.0\.0\.1:\d+$/);
const db = new Firestore({ projectId: "demo-ironclad-booking-notifications" });

test("concurrent retries queue exactly one email per recipient and preserve mail delivery state", async () => {
  const payload = notificationFixture(`booking_${randomUUID()}`);
  const recipients = ["first@example.test", "SECOND@example.test", "second@example.test"];
  const outcomes = await Promise.all(Array.from({ length: 8 }, () => queueBusinessNotification(payload, db, recipients)));
  assert.equal(outcomes.filter((value) => !value.deduplicated).length, 1);
  const first = db.collection("mail").doc(bookingMailId(payload, recipients[0]));
  const second = db.collection("mail").doc(bookingMailId(payload, recipients[1]));
  assert.equal((await first.get()).data()?.to, "first@example.test");
  assert.equal((await second.get()).data()?.to, "second@example.test");
  await first.update({ delivery: { state: "SUCCESS" } });
  assert.equal((await queueBusinessNotification(payload, db, recipients)).deduplicated, true);
  assert.equal((await first.get()).data()?.delivery.state, "SUCCESS");
  assert.equal((await first.get()).data()?.bookingNotification.sessionId, payload.sessionId);
  const changedTiming = { ...payload, tracking: { ...payload.tracking, timeInBookingMs: 9000 } };
  assert.equal((await queueBusinessNotification(changedTiming, db, recipients)).deduplicated, true);
});

test("later status, separate attempt and new recipient each receive their own notification", async () => {
  const payload = notificationFixture(`booking_${randomUUID()}`);
  await queueBusinessNotification(payload, db, ["ops@example.test"]);
  const completed = { ...payload, status: "completed" as const };
  assert.equal((await queueBusinessNotification(completed, db, ["ops@example.test"])).deduplicated, false);
  const separate = notificationFixture(`booking_${randomUUID()}`);
  assert.equal((await queueBusinessNotification(separate, db, ["ops@example.test"])).deduplicated, false);
  assert.equal((await queueBusinessNotification(payload, db, ["ops@example.test", "backup@example.test"])).deduplicated, false);
  assert.equal((await queueBusinessNotification(payload, db, ["ops@example.test", "backup@example.test"])).deduplicated, true);
});

test("transaction fills an absent recipient without rewriting an existing mail", async () => {
  const payload = notificationFixture(`booking_${randomUUID()}`);
  const existing = db.collection("mail").doc(bookingMailId(payload, "ops@example.test"));
  await existing.create({ to: "ops@example.test", message: { text: "retained original" } });
  await queueBusinessNotification(payload, db, ["ops@example.test", "backup@example.test"]);
  assert.equal((await existing.get()).data()?.message.text, "retained original");
  assert.equal((await db.collection("mail").doc(bookingMailId(payload, "backup@example.test")).get()).exists, true);
});
