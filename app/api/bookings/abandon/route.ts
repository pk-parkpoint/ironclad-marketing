import { NextResponse } from "next/server";
import { sendBusinessNotification } from "@/lib/booking-email";
import { type BookingLeadPayload } from "@/lib/booking-lead";
import { parseJsonRequest, withServerContext } from "@/lib/booking-server";

export async function POST(request: Request) {
  const body = await parseJsonRequest<BookingLeadPayload>(request);
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "invalid payload" }, { status: 400 });
  }

  const sent = await sendBusinessNotification(withServerContext(body, request));
  return NextResponse.json({ sent });
}
