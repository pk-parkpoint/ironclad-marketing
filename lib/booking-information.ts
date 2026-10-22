import type { BookingLeadPayload } from "@/lib/booking-lead";

export type BookingInformation = Partial<Record<keyof BookingLeadPayload["booking"], string>>;
const CONTACT_FIELDS = ["customerName", "firstName", "lastName", "phone", "email", "address",
  "street", "city", "state", "zip", "gateCode", "propertyType", "ownershipStatus",
  "petsOnPremise", "contactPreference", "notes", "photos"] as const;

function meaningful(value: string): boolean {
  return !["", "na", "n/a", "not presented"].includes(value.trim().toLowerCase());
}

/** Page/service prefill and the default calendar day are context, not new input. */
export function bookingInformation(payload: BookingLeadPayload): BookingInformation {
  const information: BookingInformation = {};
  const fields: Array<keyof BookingLeadPayload["booking"]> = [...CONTACT_FIELDS];
  if (meaningful(payload.booking.preferredWindow)) fields.push("preferredDate", "preferredWindow");
  if (payload.tracking.screensVisited.includes("select_issue")) fields.push("serviceCategory", "serviceDetail");
  for (const key of fields) {
    const value = payload.booking[key];
    if (!meaningful(value)) continue;
    information[key] = key === "phone" ? value.replace(/\D/g, "").replace(/^1(?=\d{10}$)/, "")
      : value.trim().replace(/\s+/g, " ").toLowerCase();
  }
  return information;
}
