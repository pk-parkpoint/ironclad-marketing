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
  };
};

const NA = "NA";

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
  return value === "commercial" ? "Commercial" : "Residential";
}

export function normalizeOwnershipStatus(value: WizardFormData["ownershipStatus"]): string {
  return value === "other" ? "Someone Else" : "Property Owner";
}

export function normalizePreferredWindow(value: string | null): string {
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
  const customerName = `${formData.firstName} ${formData.lastName}`.trim();
  const screensVisited = new Set(attempt.screensVisited);
  const touchedFields = new Set<BookingFieldKey>(attempt.touchedFields);
  const abandoned = status === "abandoned";

  const serviceCategory =
    abandoned && !touchedFields.has("serviceCategory") ? NA : humanizeServiceValue(formData.serviceCategory);
  const serviceDetail =
    abandoned && !touchedFields.has("serviceDetail") ? NA : humanizeServiceValue(formData.serviceDetail);
  const serviceDisplayParts = [serviceCategory, serviceDetail].filter((value) => value !== NA);
  const preferredDate =
    abandoned && !touchedFields.has("selectedDate") ? NA : normalizeValue(formData.selectedDate);
  const preferredWindow =
    abandoned && !screensVisited.has("schedule_time") ? NA : normalizePreferredWindow(formData.timeOfDay);
  const notes =
    abandoned && !touchedFields.has("additionalNotes") ? NA : normalizeValue(formData.additionalNotes);
  const gateCode =
    abandoned && !touchedFields.has("gateCode") ? NA : normalizeValue(formData.gateCode);
  const propertyType =
    abandoned && !touchedFields.has("propertyType") ? NA : normalizePropertyType(formData.propertyType);
  const ownershipStatus =
    abandoned && !touchedFields.has("ownershipStatus") ? NA : normalizeOwnershipStatus(formData.ownershipStatus);
  const petsOnPremise =
    abandoned && !touchedFields.has("petsOnPremise") ? NA : normalizeValue(formData.petsOnPremise);
  const contactPreference =
    abandoned && !touchedFields.has("contactPreference") ? NA : normalizeContactPreference(formData.contactPreference);

  return {
    booking: {
      address: normalizeValue(formData.addressFormatted),
      bookingId: normalizeValue(bookingId || attempt.bookingId),
      city: normalizeValue(formData.city),
      contactPreference,
      customerName: normalizeValue(customerName),
      email: normalizeValue(formData.email),
      firstName: normalizeValue(formData.firstName),
      gateCode,
      lastName: normalizeValue(formData.lastName),
      notes,
      ownershipStatus,
      petsOnPremise,
      phone: normalizeValue(formData.phone),
      photos: NA,
      preferredDate,
      preferredWindow,
      propertyType,
      serviceCategory,
      serviceDetail,
      serviceDisplay: serviceDisplayParts.length > 0 ? serviceDisplayParts.join(" > ") : NA,
      state: normalizeValue(formData.state),
      street: normalizeValue(formData.street),
      zip: normalizeValue(formData.zip),
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
    },
  };
}
