import type { AttributionData } from "@/lib/analytics";
import type { WizardFormData } from "@/components/booking/booking-wizard";

export const BOOKING_BUSINESS_KEY = "ironclad-plumbing";
export const BOOKING_TIME_CAP_MS = 5 * 60 * 1000;

export const BOOKING_SCREEN_IDS = [
  "select_issue",
  "schedule_time",
  "contact_info",
  "confirm_details",
] as const;

export type BookingScreenId = (typeof BOOKING_SCREEN_IDS)[number];
export type BookingLeadStatus = "completed" | "abandoned";
export type BookingFieldKey = keyof WizardFormData;

// Which wizard screen each form field lives on. Used by the abandoned-lead
// builder to distinguish "user saw the screen and skipped this field" (NA)
// from "user abandoned before this screen was ever rendered" (Not Presented).
export const BOOKING_FIELD_SCREENS: Record<BookingFieldKey, BookingScreenId> = {
  serviceCategory: "select_issue",
  serviceDetail: "select_issue",
  selectedDate: "schedule_time",
  timeOfDay: "schedule_time",
  selectedWindowId: "schedule_time",
  selectedOfferId: "schedule_time",
  selectedStartTime: "schedule_time",
  selectedEndTime: "schedule_time",
  selectedWindowLabel: "schedule_time",
  holdId: "schedule_time",
  firstName: "contact_info",
  lastName: "contact_info",
  phone: "contact_info",
  email: "contact_info",
  addressFormatted: "contact_info",
  street: "contact_info",
  city: "contact_info",
  state: "contact_info",
  zip: "contact_info",
  latitude: "contact_info",
  longitude: "contact_info",
  propertyType: "confirm_details",
  ownershipStatus: "confirm_details",
  gateCode: "confirm_details",
  petsOnPremise: "confirm_details",
  contactPreference: "confirm_details",
  additionalNotes: "confirm_details",
};

export type BookingSiteSession = {
  attribution: AttributionData;
  browser: string;
  deviceType: "mobile" | "tablet" | "desktop";
  entryPage: string;
  lastPage: string;
  operatingSystem: string;
  pagesVisited: string[];
  referrerUrl: string;
  returningVisitor: boolean;
  siteSessionId: string;
  siteStartedAt: number;
  source: string;
};

export type BookingAttemptSession = {
  abandonmentScreen: BookingScreenId | "NA";
  bookingApiSubmitted: boolean;
  bookingEntryPage: string;
  bookingId?: string;
  bookingOpenedAt: number;
  currentScreen: BookingScreenId;
  draft: WizardFormData;
  screensVisited: BookingScreenId[];
  sessionId: string;
  siteSessionId: string;
  status: "active" | BookingLeadStatus;
  touchedFields: BookingFieldKey[];
};

export type BookingLeadPayload = {
  booking: {
    address: string;
    bookingId: string;
    contactPreference: string;
    customerName: string;
    email: string;
    firstName: string;
    gateCode: string;
    lastName: string;
    notes: string;
    ownershipStatus: string;
    petsOnPremise: string;
    phone: string;
    photos: string;
    preferredDate: string;
    preferredWindow: string;
    propertyType: string;
    serviceCategory: string;
    serviceDetail: string;
    serviceDisplay: string;
    state: string;
    street: string;
    city: string;
    zip: string;
  };
  businessKey: string;
  serverContext: {
    approximateZip: string;
    city: string;
    ipAddress: string;
    state: string;
  };
  sessionId: string;
  siteSessionId: string;
  status: BookingLeadStatus;
  tracking: {
    abandonmentScreen: string;
    bookingApiSubmitted: string;
    bookingEntryPage: string;
    browser: string;
    completionStatus: BookingLeadStatus;
    deviceType: string;
    entryPage: string;
    fbclid: string;
    firstReferrerUrl: string;
    gbraid: string;
    gclid: string;
    lastPageBeforeExit: string;
    msclkid: string;
    operatingSystem: string;
    pagesVisited: string[];
    returningVisitor: string;
    screensVisited: string[];
    source: string;
    timeInBookingMs: number;
    timeOnSiteBeforeBookingMs: number;
    totalSessionDurationMs: number;
    utmCampaign: string;
    utmContent: string;
    utmMedium: string;
    utmSource: string;
    utmTerm: string;
    wbraid: string;
  };
};

// Sentinels for abandoned-lead field state. Exported so the email + Conduit
// notifier render them consistently.
export const BOOKING_NA = "NA";
export const BOOKING_NOT_PRESENTED = "Not Presented";
const NA = BOOKING_NA;
const NOT_PRESENTED = BOOKING_NOT_PRESENTED;

const TIME_LABELS: Record<string, string> = {
  afternoon: "Afternoon",
  flexible: "Flexible",
  morning: "Morning",
};

function titleCaseWords(value: string): string {
  return value
    .split(/[\s_-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function normalizeValue(value: string | number | boolean | null | undefined): string {
  if (typeof value === "boolean") {
    return value ? "Yes" : "No";
  }
  if (typeof value === "number") {
    return Number.isFinite(value) ? String(value) : NA;
  }
  if (typeof value !== "string") {
    return NA;
  }
  const trimmed = value.trim();
  return trimmed ? trimmed : NA;
}

export function humanizeServiceValue(value: string | null | undefined): string {
  if (!value) return NA;
  return titleCaseWords(value);
}

export function joinServiceDisplay(formData: WizardFormData): string {
  const parts = [humanizeServiceValue(formData.serviceCategory), humanizeServiceValue(formData.serviceDetail)].filter(
    (value) => value !== NA,
  );
  return parts.length > 0 ? parts.join(" > ") : NA;
}

export function normalizeContactPreference(value: string[]): string {
  const first = value[0] || "";
  const normalized = first.toLowerCase();
  if (normalized === "call") return "Call";
  if (normalized === "text") return "Text";
  if (normalized === "either") return "Either";
  return NA;
}

export function normalizePropertyType(value: WizardFormData["propertyType"]): string {
  if (!value) return NA;
  return value === "commercial" ? "Commercial" : "Residential";
}

export function normalizeOwnershipStatus(value: WizardFormData["ownershipStatus"]): string {
  if (!value) return NA;
  return value === "other" ? "Someone Else" : "Property Owner";
}

export function normalizePreferredWindow(formData: WizardFormData): string {
  if (formData.selectedWindowLabel?.trim()) return formData.selectedWindowLabel.trim();
  const value = formData.timeOfDay;
  if (!value) return NA;
  return TIME_LABELS[value] || titleCaseWords(value);
}

export function formatDurationMs(value: number): string {
  if (!Number.isFinite(value) || value <= 0) return "0s";
  const totalSeconds = Math.floor(value / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  if (minutes === 0) return `${seconds}s`;
  if (seconds === 0) return `${minutes}m`;
  return `${minutes}m ${seconds}s`;
}

// Resolves a single booking-lead field for the abandoned/completed email.
// Rules per CTO 2026-05-11:
//   completed       -> always render the formatted value (no sentinels)
//   abandoned + touched at least one source field -> render the formatted value
//   abandoned + never touched + screen WAS visited -> "NA"   (saw + skipped)
//   abandoned + never touched + screen NOT visited -> "Not Presented" (never saw)
function resolveBookingField({
  formatted,
  sourceFields,
  abandoned,
  touchedFields,
  screensVisited,
}: {
  formatted: string;
  sourceFields: BookingFieldKey[];
  abandoned: boolean;
  touchedFields: Set<BookingFieldKey>;
  screensVisited: Set<BookingScreenId>;
}): string {
  if (!abandoned) return formatted;
  if (sourceFields.some((field) => touchedFields.has(field))) return formatted;
  const screen = BOOKING_FIELD_SCREENS[sourceFields[0]];
  return screen && screensVisited.has(screen) ? NA : NOT_PRESENTED;
}

function combineServiceDisplay(category: string, detail: string): string {
  // Mirror the field-resolution rules at the composite level. If BOTH parts
  // were never presented, the display is also Not Presented. If one is missing
  // (NA/Not Presented) but the other is a real value, fall back to the real
  // half so an abandoned-at-detail-pick lead still shows the category.
  const sentinels = new Set([NA, NOT_PRESENTED]);
  const categoryReal = !sentinels.has(category);
  const detailReal = !sentinels.has(detail);
  if (categoryReal && detailReal) return `${category} > ${detail}`;
  if (categoryReal) return category;
  if (detailReal) return detail;
  if (category === NOT_PRESENTED && detail === NOT_PRESENTED) return NOT_PRESENTED;
  return NA;
}

export function buildBookingLeadPayload({
  attempt,
  bookingId,
  formData,
  siteSession,
  status,
}: {
  attempt: BookingAttemptSession;
  bookingId?: string;
  formData: WizardFormData;
  siteSession: BookingSiteSession;
  status: BookingLeadStatus;
}): BookingLeadPayload {
  const now = Date.now();
  const bookingTime = Math.min(Math.max(now - attempt.bookingOpenedAt, 0), BOOKING_TIME_CAP_MS);
  const totalSessionDurationMs = Math.max(now - siteSession.siteStartedAt, 0);
  const timeOnSiteBeforeBookingMs = Math.max(attempt.bookingOpenedAt - siteSession.siteStartedAt, 0);
  const customerNameRaw = `${formData.firstName} ${formData.lastName}`.trim();
  const screensVisited = new Set(attempt.screensVisited);
  const touchedFields = new Set<BookingFieldKey>(attempt.touchedFields);
  const abandoned = status === "abandoned";
  const resolveCtx = { abandoned, touchedFields, screensVisited };
  const resolve = (formatted: string, sourceFields: BookingFieldKey[]) =>
    resolveBookingField({ formatted, sourceFields, ...resolveCtx });

  // Contact-info screen (step 3)
  const customerName = resolve(normalizeValue(customerNameRaw), ["firstName", "lastName"]);
  const firstName = resolve(normalizeValue(formData.firstName), ["firstName"]);
  const lastName = resolve(normalizeValue(formData.lastName), ["lastName"]);
  const phone = resolve(normalizeValue(formData.phone), ["phone"]);
  const email = resolve(normalizeValue(formData.email), ["email"]);
  const address = resolve(normalizeValue(formData.addressFormatted), ["addressFormatted"]);
  // street/city/state/zip are only populated by Google Places when the user
  // selects a suggestion; if they typed free-form, those stay blank. Tie all
  // four to the same address-field touch so they share Not Presented vs NA.
  const street = resolve(normalizeValue(formData.street), ["addressFormatted", "street"]);
  const city = resolve(normalizeValue(formData.city), ["addressFormatted", "city"]);
  const stateField = resolve(normalizeValue(formData.state), ["addressFormatted", "state"]);
  const zip = resolve(normalizeValue(formData.zip), ["addressFormatted", "zip"]);

  // Select-issue screen (step 1)
  const serviceCategory = resolve(humanizeServiceValue(formData.serviceCategory), ["serviceCategory"]);
  const serviceDetail = resolve(humanizeServiceValue(formData.serviceDetail), ["serviceDetail"]);
  const serviceDisplay = combineServiceDisplay(serviceCategory, serviceDetail);

  // Schedule-time screen (step 2)
  const preferredDate = resolve(normalizeValue(formData.selectedDate), ["selectedDate"]);
  // preferredWindow keys on whether the schedule screen was reached at all
  // (the customer may pick a date but skip a window, in which case the visit
  // counts as "saw and skipped" via selectedWindowLabel/timeOfDay).
  const preferredWindow = resolve(normalizePreferredWindow(formData), [
    "selectedWindowLabel",
    "selectedWindowId",
    "timeOfDay",
    "selectedDate",
  ]);

  // Confirm-details screen (step 4) — only reachable after a successful book.
  // Customers who abandon before submission will see these as Not Presented.
  const notes = resolve(normalizeValue(formData.additionalNotes), ["additionalNotes"]);
  const gateCode = resolve(normalizeValue(formData.gateCode), ["gateCode"]);
  const propertyType = resolve(normalizePropertyType(formData.propertyType), ["propertyType"]);
  const ownershipStatus = resolve(normalizeOwnershipStatus(formData.ownershipStatus), ["ownershipStatus"]);
  const petsOnPremise = resolve(normalizeValue(formData.petsOnPremise), ["petsOnPremise"]);
  const contactPreference = resolve(normalizeContactPreference(formData.contactPreference), ["contactPreference"]);

  return {
    booking: {
      address,
      bookingId: normalizeValue(bookingId || attempt.bookingId),
      city,
      contactPreference,
      customerName,
      email,
      firstName,
      gateCode,
      lastName,
      notes,
      ownershipStatus,
      petsOnPremise,
      phone,
      // No photo-upload control is rendered in the wizard, so the field is
      // never offered to the customer.
      photos: abandoned ? NOT_PRESENTED : NA,
      preferredDate,
      preferredWindow,
      propertyType,
      serviceCategory,
      serviceDetail,
      serviceDisplay,
      state: stateField,
      street,
      zip,
    },
    businessKey: BOOKING_BUSINESS_KEY,
    serverContext: {
      approximateZip: NA,
      city: NA,
      ipAddress: NA,
      state: NA,
    },
    sessionId: attempt.sessionId,
    siteSessionId: siteSession.siteSessionId,
    status,
    tracking: {
      abandonmentScreen: status === "abandoned" ? attempt.abandonmentScreen : NA,
      bookingApiSubmitted: attempt.bookingApiSubmitted ? "Yes" : "No",
      bookingEntryPage: normalizeValue(attempt.bookingEntryPage),
      browser: normalizeValue(siteSession.browser),
      completionStatus: status,
      deviceType: normalizeValue(siteSession.deviceType),
      entryPage: normalizeValue(siteSession.entryPage),
      fbclid: normalizeValue(siteSession.attribution.fbclid),
      firstReferrerUrl: normalizeValue(siteSession.referrerUrl),
      gbraid: normalizeValue(siteSession.attribution.gbraid),
      gclid: normalizeValue(siteSession.attribution.gclid),
      lastPageBeforeExit: normalizeValue(siteSession.lastPage),
      msclkid: normalizeValue(siteSession.attribution.msclkid),
      operatingSystem: normalizeValue(siteSession.operatingSystem),
      pagesVisited: siteSession.pagesVisited.length > 0 ? siteSession.pagesVisited : [NA],
      returningVisitor: siteSession.returningVisitor ? "Returning" : "New",
      screensVisited: attempt.screensVisited.length > 0 ? attempt.screensVisited : [NA],
      source: normalizeValue(siteSession.source),
      timeInBookingMs: bookingTime,
      timeOnSiteBeforeBookingMs,
      totalSessionDurationMs,
      utmCampaign: normalizeValue(siteSession.attribution.utm_campaign),
      utmContent: normalizeValue(siteSession.attribution.utm_content),
      utmMedium: normalizeValue(siteSession.attribution.utm_medium),
      utmSource: normalizeValue(siteSession.attribution.utm_source),
      utmTerm: normalizeValue(siteSession.attribution.utm_term),
      wbraid: normalizeValue(siteSession.attribution.wbraid),
    },
  };
}
