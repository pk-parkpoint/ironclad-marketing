import { BOOKING_NA, BOOKING_NOT_PRESENTED, formatDurationMs, type BookingLeadPayload, type BookingScreenId } from "@/lib/booking-lead";
import { formatDate, formatValue, row, textRow } from "@/lib/booking-email-cells";

const SCREEN_LABELS: Record<BookingScreenId | "NA", string> = {
  select_issue: "Select Service",
  schedule_time: "Schedule Time",
  contact_info: "Contact Info",
  confirm_details: "Confirm Details",
  NA: "the booking modal",
};

type BookingDetails = {
  booking: BookingLeadPayload["booking"];
  serverContext: BookingLeadPayload["serverContext"];
  status: BookingLeadPayload["status"];
  tracking: BookingLeadPayload["tracking"];
};

export function buildEmail(details: BookingDetails) {
  const heading = details.status === "completed" ? "New Booking Submission" : "Abandoned Booking (incomplete)";
  const color = details.status === "completed" ? "#059669" : "#d97706";
  const dateDisplay = details.booking.preferredDate && /^\d{4}-\d{2}-\d{2}$/.test(details.booking.preferredDate)
    ? formatDate(details.booking.preferredDate)
    : details.booking.preferredDate;

  const htmlRows = [
    row("Customer", details.booking.customerName),
    row("Phone", details.booking.phone),
    row("Email", details.booking.email),
    row("Service", details.booking.serviceDisplay),
    row("Preferred Date", dateDisplay),
    row("Time Window", details.booking.preferredWindow),
    row("Address", details.booking.address),
    row("Gate Code", details.booking.gateCode),
    row("Property Type", details.booking.propertyType),
    row("Ownership", details.booking.ownershipStatus),
    row("Pets on Premise", details.booking.petsOnPremise),
    row("Contact Preference", details.booking.contactPreference),
    row("Notes", details.booking.notes),
  ].filter(Boolean).join("");

  const metadataHtmlRows = [
    row("Status", details.status),
    row("Booking ID", details.booking.bookingId),
    row("Screens Visited", details.tracking.screensVisited.join(" → ")),
    row("Abandonment Screen", details.tracking.abandonmentScreen),
    row("Pages Visited", details.tracking.pagesVisited.join(" → ")),
    row("Entry Page", details.tracking.entryPage),
    row("Booking Entry Page", details.tracking.bookingEntryPage),
    row("Last Page Before Exit", details.tracking.lastPageBeforeExit),
    row("Time on Site Before Booking", formatDurationMs(details.tracking.timeOnSiteBeforeBookingMs)),
    row("Time in Booking", formatDurationMs(details.tracking.timeInBookingMs)),
    row("Total Session Duration", formatDurationMs(details.tracking.totalSessionDurationMs)),
    row("Source", details.tracking.source),
    row("Referrer URL", details.tracking.firstReferrerUrl),
    row("UTM Source", details.tracking.utmSource),
    row("UTM Medium", details.tracking.utmMedium),
    row("UTM Campaign", details.tracking.utmCampaign),
    row("UTM Term", details.tracking.utmTerm),
    row("Device Type", details.tracking.deviceType),
    row("Browser", details.tracking.browser),
    row("Operating System", details.tracking.operatingSystem),
    row("Visitor Type", details.tracking.returningVisitor),
    row("Booking API Submitted", details.tracking.bookingApiSubmitted),
    row("IP Address", details.serverContext.ipAddress),
    row("IP City", details.serverContext.city),
    row("IP State", details.serverContext.state),
    row("Approximate ZIP", details.serverContext.approximateZip),
  ].join("");

  const textLines = [
    heading,
    "---",
    textRow("Customer", details.booking.customerName),
    textRow("Phone", details.booking.phone),
    textRow("Email", details.booking.email),
    textRow("Service", details.booking.serviceDisplay),
    textRow("Preferred Date", dateDisplay),
    textRow("Time Window", details.booking.preferredWindow),
    textRow("Address", details.booking.address),
    textRow("Gate Code", details.booking.gateCode),
    textRow("Property Type", details.booking.propertyType),
    textRow("Ownership", details.booking.ownershipStatus),
    textRow("Pets on Premise", details.booking.petsOnPremise),
    textRow("Contact Preference", details.booking.contactPreference),
    textRow("Notes", details.booking.notes),
    "",
    "Behavioral Metadata",
    "---",
    textRow("Status", details.status),
    textRow("Booking ID", details.booking.bookingId),
    textRow("Screens Visited", details.tracking.screensVisited.join(" -> ")),
    textRow("Abandonment Screen", details.tracking.abandonmentScreen),
    textRow("Pages Visited", details.tracking.pagesVisited.join(" -> ")),
    textRow("Entry Page", details.tracking.entryPage),
    textRow("Booking Entry Page", details.tracking.bookingEntryPage),
    textRow("Last Page Before Exit", details.tracking.lastPageBeforeExit),
    textRow("Time on Site Before Booking", formatDurationMs(details.tracking.timeOnSiteBeforeBookingMs)),
    textRow("Time in Booking", formatDurationMs(details.tracking.timeInBookingMs)),
    textRow("Total Session Duration", formatDurationMs(details.tracking.totalSessionDurationMs)),
    textRow("Source", details.tracking.source),
    textRow("Referrer URL", details.tracking.firstReferrerUrl),
    textRow("UTM Source", details.tracking.utmSource),
    textRow("UTM Medium", details.tracking.utmMedium),
    textRow("UTM Campaign", details.tracking.utmCampaign),
    textRow("UTM Term", details.tracking.utmTerm),
    textRow("Device Type", details.tracking.deviceType),
    textRow("Browser", details.tracking.browser),
    textRow("Operating System", details.tracking.operatingSystem),
    textRow("Visitor Type", details.tracking.returningVisitor),
    textRow("Booking API Submitted", details.tracking.bookingApiSubmitted),
    textRow("IP Address", details.serverContext.ipAddress),
    textRow("IP City", details.serverContext.city),
    textRow("IP State", details.serverContext.state),
    textRow("Approximate ZIP", details.serverContext.approximateZip),
    "",
    "Sent from Ironclad Booking Widget",
  ].filter(Boolean).join("\n");

  const html = `
    <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;max-width:600px;margin:0 auto">
      <div style="background:${color};color:#fff;padding:16px 20px;border-radius:8px 8px 0 0">
        <h2 style="margin:0;font-size:18px">${heading}</h2>
      </div>
      <div style="border:1px solid #e5e7eb;border-top:none;border-radius:0 0 8px 8px;padding:4px 0">
        <table style="width:100%;border-collapse:collapse;font-size:14px">${htmlRows}</table>
      </div>
      <div style="margin-top:16px;border:1px solid #e5e7eb;border-radius:8px;padding:4px 0">
        <div style="padding:12px 12px 4px;font-size:12px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:#6b7280">
          Behavioral Metadata
        </div>
        <table style="width:100%;border-collapse:collapse;font-size:14px">${metadataHtmlRows}</table>
      </div>
      <p style="font-size:12px;color:#9ca3af;margin-top:12px">Sent from Ironclad Booking Widget</p>
    </div>
  `;

  const subject =
    details.status === "completed"
      ? `New Booking: ${formatValue(details.booking.customerName)} - ${formatValue(details.booking.serviceDisplay)}`
      : `Abandoned Booking: ${abandonedSubjectLabel(details)}`;

  return { subject, html, text: textLines };
}

// Pick the most useful identifier for an abandoned-booking subject line:
// customer name -> phone -> service category -> "bounced at <screen>". Avoids
// the unhelpful "Abandoned Booking: NA" header on empty-modal bounces.
function abandonedSubjectLabel(details: BookingDetails): string {
  const { booking, tracking } = details;
  const isReal = (value: string | undefined | null): value is string =>
    !!value && value !== BOOKING_NA && value !== BOOKING_NOT_PRESENTED;
  if (isReal(booking.customerName)) return booking.customerName;
  if (isReal(booking.phone)) return booking.phone;
  if (isReal(booking.serviceDisplay)) return `${booking.serviceDisplay} (no contact info)`;
  const screen = (tracking.abandonmentScreen as BookingScreenId | "NA") || "NA";
  const screenLabel = SCREEN_LABELS[screen] || screen;
  return `bounced at ${screenLabel}`;
}

