import { NextResponse } from "next/server";
import { sendBusinessNotification } from "@/lib/booking-email";

const ABANDON_TIMEOUT_MS = 15 * 60 * 1000;

type PartialBooking = {
  sessionId: string;
  data: Record<string, unknown>;
  createdAt: number;
  timerRef: ReturnType<typeof setTimeout> | null;
  notified: boolean;
};

type PartialBookingState = {
  sessions: Map<string, PartialBooking>;
};

function getState(): PartialBookingState {
  const g = globalThis as typeof globalThis & { __ironcladPartialBookings?: PartialBookingState };
  if (!g.__ironcladPartialBookings) {
    g.__ironcladPartialBookings = { sessions: new Map() };
  }
  return g.__ironcladPartialBookings;
}

function scheduleAbandonCheck(session: PartialBooking) {
  if (session.timerRef) clearTimeout(session.timerRef);
  session.timerRef = setTimeout(async () => {
    const state = getState();
    const current = state.sessions.get(session.sessionId);
    if (!current || current.notified) return;
    current.notified = true;

    const d = current.data;
    await sendBusinessNotification(
      {
        customerName: [d.firstName, d.lastName].filter(Boolean).join(" ") || undefined,
        phone: (d.phone as string) || undefined,
        email: (d.email as string) || undefined,
        serviceCategory: (d.serviceDetail as string) || (d.serviceCategory as string) || undefined,
        preferredDate: (d.selectedDate as string) || undefined,
        preferredWindow: (d.timeOfDay as string) || undefined,
        address: (d.addressFormatted as string) || undefined,
        notes: (d.additionalNotes as string) || undefined,
        gateCode: (d.gateCode as string) || undefined,
        petsOnPremise: d.petsOnPremise === true ? true : undefined,
        contactPreference: Array.isArray(d.contactPreference) ? d.contactPreference.join(", ") : undefined,
        propertyType: (d.propertyType as string) || undefined,
        ownershipStatus: (d.ownershipStatus as string) || undefined,
      },
      "abandoned",
    ).catch(() => {});

    // Clean up after notification
    state.sessions.delete(session.sessionId);
  }, ABANDON_TIMEOUT_MS);
}

/**
 * POST /api/bookings/partial
 * Body: { sessionId: string, data: object, completed?: boolean }
 *
 * Called by the booking wizard to track partial progress.
 * If not completed within 15 minutes, sends an abandoned booking email.
 */
export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  if (!body || typeof body !== "object" || !body.sessionId) {
    return NextResponse.json({ error: "sessionId required" }, { status: 400 });
  }

  const state = getState();
  const { sessionId, data, completed } = body as {
    sessionId: string;
    data?: Record<string, unknown>;
    completed?: boolean;
  };

  // If booking was completed, cancel the abandon timer and clean up
  if (completed) {
    const existing = state.sessions.get(sessionId);
    if (existing?.timerRef) clearTimeout(existing.timerRef);
    state.sessions.delete(sessionId);
    return NextResponse.json({ status: "cleared" });
  }

  // Update or create the partial session
  const existing = state.sessions.get(sessionId);
  if (existing) {
    existing.data = { ...existing.data, ...data };
    scheduleAbandonCheck(existing);
  } else {
    const session: PartialBooking = {
      sessionId,
      data: data || {},
      createdAt: Date.now(),
      timerRef: null,
      notified: false,
    };
    state.sessions.set(sessionId, session);
    scheduleAbandonCheck(session);
  }

  return NextResponse.json({ status: "tracked" });
}
