/** Idempotent business email queue; the existing mail worker owns delivery. */
import { createHash } from "node:crypto";
import { initializeApp, getApps, applicationDefault } from "firebase-admin/app";
import { getFirestore, type Firestore } from "firebase-admin/firestore";
import type { BookingLeadPayload } from "@/lib/booking-lead";
import { buildEmail } from "@/lib/booking-email-template";
import { bookingVisitorId } from "@/lib/booking-visitor";
import { bookingInformation, type BookingInformation } from "@/lib/booking-information";

function initAdmin() {
  if (!getApps().length) {
    initializeApp({
      credential: applicationDefault(),
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "conduit-external-dev",
    });
  }
  return getFirestore();
}

export function bookingMailId(payload: BookingLeadPayload, recipient: string, information = bookingInformation(payload)): string {
  const visitorId = payload.status === "abandoned" ? bookingVisitorId(payload) : null;
  const identity = visitorId || payload.sessionId;
  const key = JSON.stringify([payload.businessKey, identity, payload.status, recipient.toLowerCase(),
    ...(visitorId ? [Object.entries(information).sort(([a], [b]) => a.localeCompare(b))] : [])]);
  return `ironclad_booking_${createHash("sha256").update(key).digest("hex")}`;
}

export async function queueBusinessNotification(
  payload: BookingLeadPayload,
  db: Firestore = initAdmin(),
  recipients = (process.env.BOOKING_NOTIFY_EMAILS || "peter@ironcladtexas.com").split(","),
): Promise<{ sent: boolean; deduplicated: boolean }> {
  const uniqueRecipients = [...new Set(recipients.map((value) => value.trim().toLowerCase()).filter(Boolean))];
  if (!uniqueRecipients.length) throw new Error("No booking notification recipients configured");
  const message = buildEmail(payload);
  const visitorId = payload.status === "abandoned"
    ? bookingVisitorId(payload) || `attempt_${payload.sessionId}` : null;
  const visitorRef = visitorId
    ? db.collection("businesses").doc(payload.businessKey).collection("bookingVisitors").doc(visitorId)
    : null;
  const attemptRef = visitorRef?.collection("attempts").doc(payload.sessionId);
  const created = await db.runTransaction(async (transaction) => {
    const visitor = visitorRef ? await transaction.get(visitorRef) : null;
    const attempt = attemptRef ? await transaction.get(attemptRef) : null;
    const information: BookingInformation = attempt?.data()?.notificationInformation ||
      { ...(visitor?.data()?.information || {}), ...bookingInformation(payload) };
    const refs = uniqueRecipients.map((recipient) => db.collection("mail").doc(bookingMailId(payload, recipient, information)));
    const existing = await transaction.getAll(...refs);
    if (visitorRef && attemptRef && !attempt?.exists) {
      const now = new Date();
      transaction.create(attemptRef, { ...payload, receivedAt: now, notificationInformation: information });
      transaction.set(visitorRef, {
        businessKey: payload.businessKey,
        visitorId,
        attemptCount: (visitor?.data()?.attemptCount || 0) + 1,
        firstSeenAt: visitor?.data()?.firstSeenAt || now,
        lastSeenAt: now,
        latestAttemptId: payload.sessionId,
        information,
      }, { merge: true });
    }
    let count = 0;
    existing.forEach((snapshot, index) => {
      if (snapshot.exists) return;
      transaction.create(refs[index], {
        to: uniqueRecipients[index],
        from: '\"Ironclad Booking\" <noreply@mainconduit.com>',
        message,
        bookingNotification: {
          businessKey: payload.businessKey,
          sessionId: payload.sessionId,
          siteSessionId: payload.siteSessionId,
          status: payload.status,
          traffic: "live",
          ...(visitorId ? { visitorId } : {}),
        },
      });
      count++;
    });
    return count;
  });
  return { sent: true, deduplicated: created === 0 };
}
