"use client";

import type { AttributionData } from "@/lib/analytics";
import type { BookingSiteSession } from "@/lib/booking-lead";

const HEARTBEAT_INTERVAL_MS = 15_000;
const GA4_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID?.trim();

type ExitReason =
  | "component_unmount"
  | "heartbeat"
  | "pagehide"
  | "route_change"
  | "tab_hidden"
  | "window_blur";

type PageVisit = {
  activeStartedAt: number | null;
  accumulatedActiveMs: number;
  attribution: AttributionData;
  pagePath: string;
  pageSequence: number;
  pageViewId: string;
  sentFinal: boolean;
  siteSession: BookingSiteSession;
  startedAt: number;
};

let currentVisit: PageVisit | null = null;
let lifecycleCleanup: (() => void) | null = null;

function createId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return `page_${crypto.randomUUID()}`;
  }
  return `page_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}

function canSendToGa4(): boolean {
  return Boolean(
    GA4_MEASUREMENT_ID
      && !GA4_MEASUREMENT_ID.includes("XXXXXXXXXX")
      && typeof window.gtag === "function",
  );
}

function isActivelyViewed(): boolean {
  return document.visibilityState === "visible" && document.hasFocus();
}

function activeTimeAt(visit: PageVisit, now: number): number {
  const currentActiveWindow = visit.activeStartedAt === null
    ? 0
    : Math.max(0, now - visit.activeStartedAt);
  return Math.max(0, Math.round(visit.accumulatedActiveMs + currentActiveWindow));
}

function pauseActiveTimer(now = Date.now()) {
  if (!currentVisit || currentVisit.activeStartedAt === null) return;
  currentVisit.accumulatedActiveMs = activeTimeAt(currentVisit, now);
  currentVisit.activeStartedAt = null;
}

function resumeActiveTimer(now = Date.now()) {
  if (!currentVisit || currentVisit.sentFinal || currentVisit.activeStartedAt !== null) return;
  if (isActivelyViewed()) currentVisit.activeStartedAt = now;
}

function emitPageEngagement({
  final,
  nextPage = "",
  reason,
}: {
  final: boolean;
  nextPage?: string;
  reason: ExitReason;
}) {
  const visit = currentVisit;
  if (!visit || visit.sentFinal || !canSendToGa4()) return;

  const now = Date.now();
  const payload: Record<string, unknown> = {
    active_time_ms: activeTimeAt(visit, now),
    browser: visit.siteSession.browser,
    device_type: visit.siteSession.deviceType,
    elapsed_time_ms: Math.max(0, now - visit.startedAt),
    exit_reason: reason,
    is_final: final ? 1 : 0,
    next_page: nextPage,
    operating_system: visit.siteSession.operatingSystem,
    page_path: visit.pagePath,
    page_sequence: visit.pageSequence,
    page_view_id: visit.pageViewId,
    returning_visitor: visit.siteSession.returningVisitor ? 1 : 0,
    send_to: GA4_MEASUREMENT_ID,
    site_session_id: visit.siteSession.siteSessionId,
    traffic_source: visit.siteSession.source,
    transport_type: "beacon",
  };

  for (const [key, value] of Object.entries(visit.attribution)) {
    if (value) payload[key] = value;
  }

  window.gtag?.("event", "page_engagement", payload);
  if (final) visit.sentFinal = true;
}

export function startPageEngagement({
  attribution,
  pagePath,
  siteSession,
}: {
  attribution: AttributionData;
  pagePath: string;
  siteSession: BookingSiteSession;
}) {
  if (typeof window === "undefined") return;

  if (currentVisit && !currentVisit.sentFinal) {
    emitPageEngagement({ final: true, nextPage: pagePath, reason: "route_change" });
  }

  const now = Date.now();
  currentVisit = {
    accumulatedActiveMs: 0,
    activeStartedAt: isActivelyViewed() ? now : null,
    attribution,
    pagePath,
    pageSequence: siteSession.pagesVisited.length,
    pageViewId: createId(),
    sentFinal: false,
    siteSession,
    startedAt: now,
  };
}

export function installPageEngagementLifecycle(): () => void {
  if (typeof window === "undefined") return () => undefined;
  if (lifecycleCleanup) return lifecycleCleanup;

  const handleVisibilityChange = () => {
    if (document.visibilityState === "hidden") {
      pauseActiveTimer();
      emitPageEngagement({ final: false, reason: "tab_hidden" });
      return;
    }
    resumeActiveTimer();
  };
  const handleBlur = () => {
    pauseActiveTimer();
    emitPageEngagement({ final: false, reason: "window_blur" });
  };
  const handleFocus = () => resumeActiveTimer();
  const handlePageHide = (event: PageTransitionEvent) => {
    pauseActiveTimer();
    emitPageEngagement({ final: !event.persisted, reason: "pagehide" });
  };
  const heartbeat = window.setInterval(() => {
    emitPageEngagement({ final: false, reason: "heartbeat" });
  }, HEARTBEAT_INTERVAL_MS);

  document.addEventListener("visibilitychange", handleVisibilityChange);
  window.addEventListener("blur", handleBlur);
  window.addEventListener("focus", handleFocus);
  window.addEventListener("pagehide", handlePageHide);

  lifecycleCleanup = () => {
    window.clearInterval(heartbeat);
    document.removeEventListener("visibilitychange", handleVisibilityChange);
    window.removeEventListener("blur", handleBlur);
    window.removeEventListener("focus", handleFocus);
    window.removeEventListener("pagehide", handlePageHide);
    emitPageEngagement({ final: true, reason: "component_unmount" });
    currentVisit = null;
    lifecycleCleanup = null;
  };
  return lifecycleCleanup;
}
