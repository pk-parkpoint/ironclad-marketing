import { NextResponse } from "next/server";
import { sendBusinessNotification } from "@/lib/booking-email";
import { notifyConduitUpdate } from "@/lib/booking-conduit";
import { type BookingLeadPayload } from "@/lib/booking-lead";
import { parseJsonRequest, withServerContext } from "@/lib/booking-server";

export async function POST(request: Request) {
  const body = await parseJsonRequest<BookingLeadPayload>(request);
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "invalid payload" }, { status: 400 });
  }
  if (body.status !== "abandoned") {
    return NextResponse.json({ error: "invalid status" }, { status: 400 });
  }

  const payload = withServerContext(body, request);
  const sent = await sendBusinessNotification(payload);
  const conduit = await notifyConduitUpdate(payload);
  console.info("[booking-abandon]", {
    sent,
    conduit,
    sessionId: payload.sessionId,
    status: payload.status,
  });

  if (!sent) {
    return NextResponse.json({ sent: false, conduit }, { status: 500 });
  }

  return NextResponse.json({ sent: true, conduit });
}
