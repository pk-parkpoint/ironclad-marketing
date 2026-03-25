"use client";

import type { AttributionData } from "@/lib/analytics";
import {
  BOOKING_SCREEN_IDS,
  type BookingFieldKey,
  type BookingAttemptSession,
  type BookingScreenId,
  type BookingSiteSession,
} from "@/lib/booking-lead";
import type { WizardFormData } from "@/components/booking/booking-wizard";
import { getDeviceType } from "@/lib/analytics-page-context";

const ACTIVE_ATTEMPT_KEY = "ironclad_booking_attempt_v1";
const RETURNING_VISITOR_KEY = "ironclad_booking_returning_v1";
const SITE_SESSION_KEY = "ironclad_booking_site_session_v1";

function createId(prefix: string): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return `${prefix}_${crypto.randomUUID()}`;
  }
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}

function safeParse<T>(value: string | null): T | null {
  if (!value) return null;
  try {
    return JSON.parse(value) as T;
  } catch {
    return null;
  }
}

function readSiteSession(): BookingSiteSession | null {
  if (typeof window === "undefined") return null;
  return safeParse<BookingSiteSession>(window.sessionStorage.getItem(SITE_SESSION_KEY));
}

function writeSiteSession(session: BookingSiteSession) {
  if (typeof window === "undefined") return;
  window.sessionStorage.setItem(SITE_SESSION_KEY, JSON.stringify(session));
}

function readAttempt(): BookingAttemptSession | null {
  if (typeof window === "undefined") return null;
  return safeParse<BookingAttemptSession>(window.sessionStorage.getItem(ACTIVE_ATTEMPT_KEY));
}

function writeAttempt(session: BookingAttemptSession) {
  if (typeof window === "undefined") return;
  window.sessionStorage.setItem(ACTIVE_ATTEMPT_KEY, JSON.stringify(session));
}

function detectBrowser(userAgent: string): string {
  if (/edg/i.test(userAgent)) return "Edge";
  if (/chrome|crios/i.test(userAgent) && !/edg/i.test(userAgent)) return "Chrome";
  if (/safari/i.test(userAgent) && !/chrome|crios|android/i.test(userAgent)) return "Safari";
  if (/firefox|fxios/i.test(userAgent)) return "Firefox";
  return "Other";
}

function detectOperatingSystem(userAgent: string): string {
  if (/iphone|ipad|ipod/i.test(userAgent)) return "iOS";
  if (/android/i.test(userAgent)) return "Android";
  if (/mac os x|macintosh/i.test(userAgent)) return "macOS";
  if (/windows/i.test(userAgent)) return "Windows";
  if (/linux/i.test(userAgent)) return "Linux";
  return "Other";
}

function normalizeSource({
  referrerUrl,
  utmSource,
}: {
  referrerUrl: string;
  utmSource?: string;
}): string {
  const haystack = `${utmSource || ""} ${referrerUrl}`.toLowerCase();
  if (!referrerUrl && !utmSource) return "Direct";
  if (haystack.includes("google")) return "Google";
  if (haystack.includes("facebook") || haystack.includes("instagram") || haystack.includes("fb")) return "Facebook";
  if (haystack.includes("yelp")) return "Yelp";
  if (haystack.includes("nextdoor")) return "Nextdoor";
  return "Other";
}

function pageLabel(pathname: string, search: string): string {
  return search ? `${pathname}?${search}` : pathname;
}

export function recordBookingSiteVisit({
  attribution,
  pathname,
  search,
}: {
  attribution: AttributionData;
  pathname: string;
  search: string;
}): BookingSiteSession | null {
  if (typeof window === "undefined") return null;

  const page = pageLabel(pathname, search);
  const userAgent = window.navigator.userAgent || "";
  const returningVisitor = window.localStorage.getItem(RETURNING_VISITOR_KEY) === "1";
  let session = readSiteSession();

  if (!session) {
    session = {
      attribution,
      browser: detectBrowser(userAgent),
      deviceType: getDeviceType(),
      entryPage: page,
      lastPage: page,
      operatingSystem: detectOperatingSystem(userAgent),
      pagesVisited: [page],
      referrerUrl: document.referrer || "",
      returningVisitor,
      siteSessionId: createId("site"),
      siteStartedAt: Date.now(),
      source: normalizeSource({ referrerUrl: document.referrer || "", utmSource: attribution.utm_source }),
    };
  } else {
    if (session.pagesVisited[session.pagesVisited.length - 1] !== page) {
      session.pagesVisited = [...session.pagesVisited, page];
    }
    session.lastPage = page;
    session.deviceType = getDeviceType();
    session.browser = detectBrowser(userAgent);
    session.operatingSystem = detectOperatingSystem(userAgent);
    session.attribution = { ...session.attribution, ...attribution };
    session.source = normalizeSource({ referrerUrl: session.referrerUrl, utmSource: session.attribution.utm_source });
  }

  window.localStorage.setItem(RETURNING_VISITOR_KEY, "1");
  writeSiteSession(session);

  const attempt = readAttempt();
  if (attempt) {
    attempt.status = attempt.status === "completed" ? "completed" : "active";
    writeAttempt(attempt);
  }

  return session;
}

export function getBookingSiteSession(): BookingSiteSession | null {
  return readSiteSession();
}

export function startBookingAttempt(initialDraft: WizardFormData): BookingAttemptSession | null {
  const siteSession = readSiteSession();
  if (!siteSession || typeof window === "undefined") return null;

  const attempt: BookingAttemptSession = {
    abandonmentScreen: "NA",
    bookingApiSubmitted: false,
    bookingEntryPage: pageLabel(window.location.pathname, window.location.search.replace(/^\?/, "")),
    bookingOpenedAt: Date.now(),
    currentScreen: BOOKING_SCREEN_IDS[0],
    draft: initialDraft,
    screensVisited: [BOOKING_SCREEN_IDS[0]],
    sessionId: createId("booking"),
    siteSessionId: siteSession.siteSessionId,
    status: "active",
    touchedFields: [],
  };

  writeAttempt(attempt);
  return attempt;
}

export function getActiveBookingAttempt(): BookingAttemptSession | null {
  return readAttempt();
}

export function updateBookingAttemptDraft(
  draft: WizardFormData,
  touchedKeys: BookingFieldKey[] = [],
): BookingAttemptSession | null {
  const attempt = readAttempt();
  if (!attempt) return null;
  attempt.draft = draft;
  if (touchedKeys.length > 0) {
    const seen = new Set(attempt.touchedFields);
    for (const key of touchedKeys) {
      seen.add(key);
    }
    attempt.touchedFields = Array.from(seen);
  }
  writeAttempt(attempt);
  return attempt;
}

export function markBookingScreenVisited(screen: BookingScreenId): BookingAttemptSession | null {
  const attempt = readAttempt();
  if (!attempt) return null;
  attempt.currentScreen = screen;
  if (attempt.screensVisited[attempt.screensVisited.length - 1] !== screen) {
    attempt.screensVisited = [...attempt.screensVisited, screen];
  }
  writeAttempt(attempt);
  return attempt;
}

export function markBookingApiSubmitted(bookingId?: string): BookingAttemptSession | null {
  const attempt = readAttempt();
  if (!attempt) return null;
  attempt.bookingApiSubmitted = true;
  if (bookingId) attempt.bookingId = bookingId;
  writeAttempt(attempt);
  return attempt;
}

export function markBookingCompleted(bookingId?: string): BookingAttemptSession | null {
  const attempt = readAttempt();
  if (!attempt) return null;
  attempt.status = "completed";
  if (bookingId) attempt.bookingId = bookingId;
  writeAttempt(attempt);
  return attempt;
}

export function markBookingAbandoned(screen?: BookingScreenId): BookingAttemptSession | null {
  const attempt = readAttempt();
  if (!attempt) return null;
  attempt.status = "abandoned";
  attempt.abandonmentScreen = screen || attempt.currentScreen;
  writeAttempt(attempt);
  return attempt;
}

export function clearBookingAttempt() {
  if (typeof window === "undefined") return;
  window.sessionStorage.removeItem(ACTIVE_ATTEMPT_KEY);
}

export function isBookingScreenId(value: string): value is BookingScreenId {
  return (BOOKING_SCREEN_IDS as readonly string[]).includes(value);
}
