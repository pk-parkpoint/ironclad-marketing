/** Idempotent business email queue; the existing mail worker owns delivery. */
import { createHash } from "node:crypto";
import { initializeApp, getApps, applicationDefault } from "firebase-admin/app";
import { getFirestore, type Firestore } from "firebase-admin/firestore";
import type { BookingLeadPayload } from "@/lib/booking-lead";
import { buildEmail } from "@/lib/booking-email-template";

function initAdmin() {
  if (!getApps().length) {
    initializeApp({
      credential: applicationDefault(),
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "conduit-external-dev",
    });
  }
  return getFirestore();
}

export function bookingMailId(payload: BookingLeadPayload, recipient: string): string {
  const key = JSON.stringify([payload.businessKey, payload.sessionId, payload.status, recipient.toLowerCase()]);
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
  const refs = uniqueRecipients.map((recipient) => db.collection("mail").doc(bookingMailId(payload, recipient)));
  const created = await db.runTransaction(async (transaction) => {
    const existing = await transaction.getAll(...refs);
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
        },
      });
      count++;
    });
    return count;
  });
  return { sent: true, deduplicated: created === 0 };
}
