/**
 * Notify Conduit with the full booking lead payload.
 *
 * Flattens BookingLeadPayload into the shape that Conduit's
 * _normalize_booking_tool_payload() expects: a single `booking` object
 * with all fields (booking + tracking + server context) at the top level,
 * using the key names the backend already looks for.
 */

import { formatDurationMs, type BookingLeadPayload } from "@/lib/booking-lead";

const NOTIFICATION_TIMEOUT_MS = 10_000;

function flattenForConduit(payload: BookingLeadPayload): Record<string, unknown> {
  const { booking, tracking, serverContext } = payload;

  return {
    // Core booking fields (backend reads these directly)
    customerName: booking.customerName,
    phone: booking.phone,
    email: booking.email,
    serviceCategory: booking.serviceCategory,
    serviceDisplayLabel: booking.serviceDisplay,
    preferredDate: booking.preferredDate,
    preferredWindow: booking.preferredWindow,
    address: booking.address,
    street: booking.street,
    city: booking.city,
    state: booking.state,
    zip: booking.zip,
    gateCode: booking.gateCode,
    propertyType: booking.propertyType,
    ownershipStatus: booking.ownershipStatus,
    petsOnPremise: booking.petsOnPremise,
    contactPreference: booking.contactPreference,
    notes: booking.notes,
    bookingId: booking.bookingId,

    // Session/tracking keys (names match backend _SESSION_KEYS)
    status: payload.status,
    screensVisited: tracking.screensVisited.join(" → "),
    abandonmentScreen: tracking.abandonmentScreen,
    pagesVisited: tracking.pagesVisited.join(" → "),
    entryPage: tracking.entryPage,
    bookingEntryPage: tracking.bookingEntryPage,
    lastPageBeforeExit: tracking.lastPageBeforeExit,
    timeOnSite: formatDurationMs(tracking.timeOnSiteBeforeBookingMs),
    timeInBooking: formatDurationMs(tracking.timeInBookingMs),
    totalSession: formatDurationMs(tracking.totalSessionDurationMs),
    referrerSource: tracking.source,
    referrerUrl: tracking.firstReferrerUrl,
    utmSource: tracking.utmSource,
    utmMedium: tracking.utmMedium,
    utmCampaign: tracking.utmCampaign,
    utmTerm: tracking.utmTerm,
    device: tracking.deviceType,
    browser: tracking.browser,
    os: tracking.operatingSystem,
    visitorType: tracking.returningVisitor,
    bookingApiSubmitted: tracking.bookingApiSubmitted,

    // Server context (IP / geo)
    ipAddress: serverContext.ipAddress,
    ipCity: serverContext.city,
    ipState: serverContext.state,
    approximateZip: serverContext.approximateZip,
  };
}

export async function notifyConduitUpdate(
  payload: BookingLeadPayload,
): Promise<"sent" | "skipped"> {
  const webhookUrl = process.env.BOOKING_WEBHOOK_URL;
  if (!webhookUrl || webhookUrl.includes("example.com")) {
    return "skipped";
  }

  const flat = flattenForConduit(payload);
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), NOTIFICATION_TIMEOUT_MS);

  try {
    const response = await fetch(webhookUrl, {
      body: JSON.stringify({
        booking: flat,
        eventType: "booking_submitted",
        target: "conduit_inbox",
      }),
      headers: { "Content-Type": "application/json" },
      method: "POST",
      signal: controller.signal,
    });

    if (!response.ok) {
      console.error("[booking-conduit] webhook failed:", response.status);
      return "skipped";
    }

    return "sent";
  } catch (err) {
    console.error("[booking-conduit] webhook error:", err);
    return "skipped";
  } finally {
    clearTimeout(timeout);
  }
}
