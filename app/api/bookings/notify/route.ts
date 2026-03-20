import { NextResponse } from "next/server";
import { sendBusinessNotification } from "@/lib/booking-email";

/**
 * POST /api/bookings/notify
 * Sends the business notification email with all booking details.
 * Called when the user clicks Done on the Confirm Details page.
 */
export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "invalid payload" }, { status: 400 });
  }

  const sent = await sendBusinessNotification(body, "completed");

  return NextResponse.json({ sent });
}
