/**
 * Booking Email Notifications
 *
 * Writes to the Firestore `mail` collection using Firebase Admin SDK,
 * which triggers the conduit `sendEmail` Cloud Function (Gmail SMTP).
 * Same pattern used by team invite emails in the main conduit app.
 */

import { initializeApp, getApps, cert, applicationDefault } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

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
  customerName?: string;
  phone?: string;
  email?: string;
  serviceCategory?: string;
  serviceDetail?: string;
  preferredDate?: string;
  preferredWindow?: string;
  address?: string;
  notes?: string;
  propertyType?: string;
  ownershipStatus?: string;
  gateCode?: string;
  petsOnPremise?: boolean;
  contactPreference?: string;
  unitOrGateCode?: string;
};

function formatDate(iso: string): string {
  const [y, m, d] = iso.split("-");
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${d}-${months[parseInt(m, 10) - 1]}-${y}`;
}

function formatValue(value: string | undefined | null): string {
  if (!value) return "N/A";
  const mapped: Record<string, string> = {
    own: "Property Owner",
    other: "Someone Else",
    residential: "Residential",
    commercial: "Commercial",
    call: "Call",
    text: "Text",
    either: "Either",
    morning: "Morning",
    afternoon: "Afternoon",
    flexible: "Flexible",
  };
  return mapped[value] || value;
}

function row(label: string, value: string | undefined | null, optional = false): string {
  if (!value && !optional) return "";
  const display = formatValue(value);
  const color = value ? "#1f2937" : "#9ca3af";
  return `<tr><td style="padding:6px 12px;font-weight:600;color:#374151;white-space:nowrap">${label}</td><td style="padding:6px 12px;color:${color}">${display}</td></tr>`;
}

function textRow(label: string, value: string | undefined | null, optional = false): string {
  if (!value && !optional) return "";
  return `${label}: ${formatValue(value)}`;
}

function buildEmail(details: BookingDetails, type: "completed" | "abandoned") {
  const heading = type === "completed" ? "New Booking Submission" : "Abandoned Booking (incomplete)";
  const color = type === "completed" ? "#059669" : "#d97706";
  const dateDisplay = details.preferredDate && /^\d{4}-\d{2}-\d{2}$/.test(details.preferredDate)
    ? formatDate(details.preferredDate)
    : details.preferredDate;

  const htmlRows = [
    row("Customer", details.customerName),
    row("Phone", details.phone),
    row("Email", details.email, true),
    row("Service", details.serviceCategory),
    row("Preferred Date", dateDisplay),
    row("Time Window", details.preferredWindow),
    row("Address", details.address),
    row("Gate Code", details.unitOrGateCode || details.gateCode, true),
    row("Property Type", details.propertyType, true),
    row("Ownership", details.ownershipStatus, true),
    row("Pets on Premise", details.petsOnPremise ? "Yes" : "No", true),
    row("Contact Preference", details.contactPreference, true),
    row("Notes", details.notes, true),
  ].filter(Boolean).join("");

  const textLines = [
    heading,
    "---",
    textRow("Customer", details.customerName),
    textRow("Phone", details.phone),
    textRow("Email", details.email, true),
    textRow("Service", details.serviceCategory),
    textRow("Preferred Date", dateDisplay),
    textRow("Time Window", details.preferredWindow),
    textRow("Address", details.address),
    textRow("Gate Code", details.unitOrGateCode || details.gateCode, true),
    textRow("Property Type", details.propertyType, true),
    textRow("Ownership", details.ownershipStatus, true),
    textRow("Pets on Premise", details.petsOnPremise ? "Yes" : "No", true),
    textRow("Contact Preference", details.contactPreference, true),
    textRow("Notes", details.notes, true),
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
      <p style="font-size:12px;color:#9ca3af;margin-top:12px">Sent from Ironclad Booking Widget</p>
    </div>
  `;

  const subject = type === "completed"
    ? `New Booking: ${details.customerName || "Unknown"} - ${details.serviceCategory || "Service"}`
    : `Abandoned Booking: ${details.customerName || details.phone || "Unknown visitor"}`;

  return { subject, html, text: textLines };
}

export async function sendBusinessNotification(
  details: BookingDetails,
  type: "completed" | "abandoned",
): Promise<boolean> {
  try {
    const db = initAdmin();
    const { subject, html, text } = buildEmail(details, type);

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
