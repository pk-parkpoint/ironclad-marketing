/**
 * Booking Email Notifications
 *
 * Writes to the Firestore `mail` collection using Firebase Admin SDK,
 * which triggers the conduit `sendEmail` Cloud Function (Gmail SMTP).
 * Same pattern used by team invite emails in the main conduit app.
 */

import { initializeApp, getApps, applicationDefault } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { formatDurationMs, normalizeValue, type BookingLeadPayload } from "@/lib/booking-lead";

function initAdmin() {
  if (getApps().length) return getFirestore();
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "conduit-external-dev";
  try {
    initializeApp({ credential: applicationDefault(), projectId });
  } catch {
    initializeApp({ projectId });
  }
  return getFirestore();
}

const BUSINESS_EMAILS = (process.env.BOOKING_NOTIFY_EMAILS || "peter@ironcladtexas.com")
  .split(",")
  .map((e) => e.trim())
  .filter(Boolean);

type BookingDetails = {
  booking: BookingLeadPayload["booking"];
  serverContext: BookingLeadPayload["serverContext"];
  status: BookingLeadPayload["status"];
  tracking: BookingLeadPayload["tracking"];
};

function formatDate(iso: string): string {
  const [y, m, d] = iso.split("-");
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${d}-${months[parseInt(m, 10) - 1]}-${y}`;
}

function formatValue(value: string | undefined | null): string {
  return normalizeValue(value);
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function row(label: string, value: string | undefined | null): string {
  const display = formatValue(value);
  const color = display === "NA" ? "#9ca3af" : "#1f2937";
  return `<tr><td style="padding:6px 12px;font-weight:600;color:#374151;white-space:nowrap">${escapeHtml(label)}</td><td style="padding:6px 12px;color:${color}">${escapeHtml(display)}</td></tr>`;
}

function textRow(label: string, value: string | undefined | null): string {
  return `${label}: ${formatValue(value)}`;
}

function buildEmail(details: BookingDetails) {
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

  const subject = details.status === "completed"
    ? `New Booking: ${formatValue(details.booking.customerName)} - ${formatValue(details.booking.serviceDisplay)}`
    : `Abandoned Booking: ${formatValue(details.booking.customerName !== "NA" ? details.booking.customerName : details.booking.phone)}`;

  return { subject, html, text: textLines };
}

export async function sendBusinessNotification(
  details: BookingDetails,
): Promise<boolean> {
  try {
    const db = initAdmin();
    const { subject, html, text } = buildEmail(details);

    for (const recipient of BUSINESS_EMAILS) {
      await db.collection("mail").add({
        to: recipient,
        from: '"Ironclad Booking" <noreply@mainconduit.com>',
        message: { subject, html, text },
      });
    }
    return true;
  } catch (err) {
    console.error("[booking-email] Failed to queue email:", err);
    return false;
  }
}
