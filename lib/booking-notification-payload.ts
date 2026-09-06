import { BOOKING_BUSINESS_KEY, type BookingLeadPayload, type BookingLeadStatus } from "@/lib/booking-lead";

const BOOKING_STRINGS = [
  "address", "bookingId", "contactPreference", "customerName", "email", "firstName",
  "gateCode", "lastName", "notes", "ownershipStatus", "petsOnPremise", "phone", "photos",
  "preferredDate", "preferredWindow", "propertyType", "serviceCategory", "serviceDetail",
  "serviceDisplay", "state", "street", "city", "zip",
];
const TRACKING_STRINGS = [
  "abandonmentScreen", "bookingApiSubmitted", "bookingEntryPage", "browser", "completionStatus",
  "deviceType", "entryPage", "fbclid", "firstReferrerUrl", "gbraid", "gclid", "lastPageBeforeExit",
  "msclkid", "operatingSystem", "returningVisitor", "source", "utmCampaign", "utmContent",
  "utmMedium", "utmSource", "utmTerm", "wbraid",
];
function object(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}
function strings(value: unknown, keys: string[]): value is Record<string, string> {
  return object(value) && keys.every((key) => typeof value[key] === "string" && value[key].length <= 16_384);
}
function identifier(value: unknown): value is string {
  return typeof value === "string" && /^[a-zA-Z0-9_-]{1,128}$/.test(value);
}
export function isBookingNotificationPayload(value: unknown, status: BookingLeadStatus): value is BookingLeadPayload {
  if (!object(value) || value.status !== status || value.businessKey !== BOOKING_BUSINESS_KEY) return false;
  if (!identifier(value.sessionId) || !identifier(value.siteSessionId)) return false;
  if (!strings(value.booking, BOOKING_STRINGS) || !strings(value.tracking, TRACKING_STRINGS)) return false;
  if (!strings(value.serverContext, ["approximateZip", "city", "ipAddress", "state"])) return false;
  const tracking = value.tracking as Record<string, unknown>;
  if (tracking.completionStatus !== status) return false;
  return ["pagesVisited", "screensVisited"].every((key) => {
    const entries = tracking[key];
    return Array.isArray(entries) && entries.length <= 256 && entries.every((entry) => typeof entry === "string" && entry.length <= 16_384);
  }) && ["timeInBookingMs", "timeOnSiteBeforeBookingMs", "totalSessionDurationMs"].every((key) =>
    typeof tracking[key] === "number" && Number.isFinite(tracking[key]) && tracking[key] >= 0,
  );
}
