import { NextResponse } from "next/server";
import { sendBusinessNotification } from "@/lib/booking-email";
import { type BookingLeadPayload } from "@/lib/booking-lead";
import { parseJsonRequest, withServerContext } from "@/lib/booking-server";

/**
 * POST /api/bookings/notify
 * Sends the business notification email with all booking details.
 * Called when the user clicks Done on the Confirm Details page.
 */
export async function POST(request: Request) {
  const body = await parseJsonRequest<BookingLeadPayload>(request);
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "invalid payload" }, { status: 400 });
  }
  if (body.status !== "completed") {
    return NextResponse.json({ error: "invalid status" }, { status: 400 });
  }

  const payload = withServerContext(body, request);
  const sent = await sendBusinessNotification(payload);
  console.info("[booking-notify]", {
    sent,
    sessionId: payload.sessionId,
    status: payload.status,
  });

  if (!sent) {
    return NextResponse.json({ sent: false }, { status: 500 });
  }

  return NextResponse.json({ sent: true });
}
