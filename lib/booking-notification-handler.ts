import { NextResponse } from "next/server";
import { queueBusinessNotification } from "@/lib/booking-email";
import { notifyConduitUpdate } from "@/lib/booking-conduit";
import type { BookingLeadStatus } from "@/lib/booking-lead";
import { withServerContext } from "@/lib/booking-server";
import { isBookingNotificationPayload } from "@/lib/booking-notification-payload";
import { bookingNotificationTraffic } from "@/lib/booking-notification-traffic";

const MAX_BODY_BYTES = 256 * 1024;
const defaultDependencies = { queueBusinessNotification, notifyConduitUpdate };

export async function handleBookingNotification(
  request: Request,
  status: BookingLeadStatus,
  dependencies = defaultDependencies,
): Promise<Response> {
  const text = await request.text().catch(() => "");
  if (Buffer.byteLength(text) > MAX_BODY_BYTES) {
    return NextResponse.json({ error: "payload too large" }, { status: 413 });
  }
  let body: unknown;
  try {
    body = JSON.parse(text);
  } catch {
    return NextResponse.json({ error: "invalid payload" }, { status: 400 });
  }
  if (!isBookingNotificationPayload(body, status)) {
    return NextResponse.json({ error: "invalid booking notification" }, { status: 400 });
  }
  const classification = bookingNotificationTraffic(request);
  if (classification.traffic === "test") {
    console.info("[booking-notification]", { status, ...classification, outcome: "suppressed" });
    return NextResponse.json({ sent: false, conduit: "skipped", suppressed: true, ...classification });
  }
  const payload = withServerContext(body, request);
  try {
    const receipt = await dependencies.queueBusinessNotification(payload);
    const conduit = await dependencies.notifyConduitUpdate(payload);
    console.info("[booking-notification]", { status, traffic: "live", outcome: receipt.deduplicated ? "duplicate" : "queued" });
    return NextResponse.json({ ...receipt, conduit, traffic: "live" });
  } catch {
    // No raw payload, addresses, provider errors, or customer identifiers in logs.
    console.error("[booking-notification]", { status, traffic: "live", outcome: "queue_failed" });
    return NextResponse.json({ sent: false, error: "notification unavailable" }, { status: 500 });
  }
}
