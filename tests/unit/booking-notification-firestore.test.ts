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

test("first anonymous visit alerts; repeats log quietly; newly entered information alerts once", async () => {
  const fixture = notificationFixture();
  const visitor = { ...fixture, sessionId: `booking_${randomUUID()}`,
    booking: Object.fromEntries(Object.keys(fixture.booking).map((key) => [key, "Not Presented"])) as typeof fixture.booking,
    tracking: { ...fixture.tracking, screensVisited: ["schedule_time"] },
    serverContext: { ...fixture.serverContext, ipAddress: `2001:db8:${randomUUID().slice(0, 4)}::12` },
  };
  const recipients = ["incremental@example.test"];
  assert.equal((await queueBusinessNotification(visitor, db, recipients)).deduplicated, false);
  const repeat = { ...visitor, sessionId: `booking_${randomUUID()}`, booking: {
    ...visitor.booking, serviceCategory: "Emergency", serviceDisplay: "Emergency", preferredDate: "2026-10-24" } };
  assert.equal((await queueBusinessNotification(repeat, db, recipients)).deduplicated, true);
  const named = { ...visitor, sessionId: `booking_${randomUUID()}`, booking: { ...visitor.booking, customerName: "New Visitor" } };
  assert.equal((await queueBusinessNotification(named, db, recipients)).deduplicated, false);
  assert.equal((await queueBusinessNotification({ ...named, sessionId: `booking_${randomUUID()}` }, db, recipients)).deduplicated, true);
  const phone = { ...visitor, sessionId: `booking_${randomUUID()}`, booking: { ...visitor.booking, phone: "(512) 555-0199" } };
  assert.equal((await queueBusinessNotification(phone, db, recipients)).deduplicated, false);
  assert.equal((await queueBusinessNotification({ ...visitor, sessionId: `booking_${randomUUID()}` }, db, recipients)).deduplicated, true);
  const firstMail = await db.collection("mail").doc(bookingMailId(visitor, recipients[0])).get();
  const visitorId = firstMail.data()?.bookingNotification.visitorId;
  const ref = db.collection("businesses").doc(visitor.businessKey).collection("bookingVisitors").doc(visitorId);
  assert.equal((await ref.get()).data()?.attemptCount, 6);
  assert.equal((await ref.get()).data()?.information.customerName, "new visitor");
  assert.equal((await ref.get()).data()?.information.phone, "5125550199");
  assert.equal((await ref.collection("attempts").get()).size, 6);
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

test("an older attempt replay neither re-alerts nor overwrites later visitor information", async () => {
  const base = notificationFixture(`booking_${randomUUID()}`);
  const first = { ...base, booking: { ...base.booking, customerName: "First Name", phone: "NA" },
    serverContext: { ...base.serverContext, ipAddress: `2001:db8:${randomUUID().slice(0, 4)}::99` } };
  const latest = { ...first, sessionId: `booking_${randomUUID()}`,
    booking: { ...first.booking, customerName: "Later Name", phone: "5125550199" } };
  const recipients = ["replay@example.test"];
  await queueBusinessNotification(first, db, recipients);
  await queueBusinessNotification(latest, db, recipients);
  assert.equal((await queueBusinessNotification(first, db, recipients)).deduplicated, true);
  const visitorId = (await db.collection("mail").doc(bookingMailId(first, recipients[0])).get()).data()?.bookingNotification.visitorId;
  const visitor = await db.collection("businesses").doc(first.businessKey).collection("bookingVisitors").doc(visitorId).get();
  assert.equal(visitor.data()?.information.customerName, "later name");
  assert.equal(visitor.data()?.attemptCount, 2);
});

test("transaction fills an absent recipient without rewriting an existing mail", async () => {
  const payload = notificationFixture(`booking_${randomUUID()}`);
  const existing = db.collection("mail").doc(bookingMailId(payload, "ops@example.test"));
  await existing.create({ to: "ops@example.test", message: { text: "retained original" } });
  await queueBusinessNotification(payload, db, ["ops@example.test", "backup@example.test"]);
  assert.equal((await existing.get()).data()?.message.text, "retained original");
  assert.equal((await db.collection("mail").doc(bookingMailId(payload, "backup@example.test")).get()).exists, true);
});

test("different attempts from one IP share one alert while retaining every attempt", async () => {
  const ip = `2001:db8:${randomUUID().slice(0, 4)}::42`;
  const payloads = Array.from({ length: 6 }, () => ({
    ...notificationFixture(`booking_${randomUUID()}`),
    serverContext: { ...notificationFixture().serverContext, ipAddress: ip },
  }));
  const outcomes = await Promise.all(payloads.map((payload) => queueBusinessNotification(payload, db, ["repeat@example.test"])));
  assert.equal(outcomes.filter((receipt) => !receipt.deduplicated).length, 1);
  const mailIds = new Set(payloads.map((payload) => bookingMailId(payload, "repeat@example.test")));
  assert.equal(mailIds.size, 1);
  const visitorId = (await db.collection("mail").doc([...mailIds][0]).get()).data()?.bookingNotification.visitorId;
  assert.ok(visitorId);
  const visitor = db.collection("businesses").doc("ironclad-plumbing").collection("bookingVisitors").doc(visitorId);
  assert.equal((await visitor.get()).data()?.attemptCount, 6);
  assert.equal((await visitor.collection("attempts").get()).size, 6);
  await Promise.all(payloads.map((payload) => queueBusinessNotification(payload, db, ["repeat@example.test"])));
  assert.equal((await visitor.get()).data()?.attemptCount, 6);
  assert.equal((await visitor.collection("attempts").get()).size, 6);
});
