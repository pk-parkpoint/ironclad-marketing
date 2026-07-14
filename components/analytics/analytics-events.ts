"use client";

type GtagFunction = (
  command: "event" | "config" | "js",
  idOrEvent: string | Date,
  params?: Record<string, unknown>,
) => void;

declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown>>;
    gtag?: GtagFunction;
  }
}

const HAS_GTM = Boolean(process.env.NEXT_PUBLIC_GTM_ID);
const GOOGLE_ADS_ID = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID?.trim() || "AW-18207846861";
const GOOGLE_ADS_PHONE_CONVERSION_LABEL =
  process.env.NEXT_PUBLIC_GOOGLE_ADS_PHONE_CONVERSION_LABEL?.trim() || "2WRhCLCe388cEM3jlupD";

export function getCtaPosition(element: Element): string {
  if (element.closest("header")) return "header";
  if (element.closest("footer")) return "footer";
  if (element.closest("aside")) return "sidebar";
  return "body";
}

export function trackEvent(event: string, payload: Record<string, unknown>) {
  window.dataLayer = window.dataLayer ?? [];
  window.dataLayer.push({ event, ...payload });
  if (!HAS_GTM && typeof window.gtag === "function") {
    window.gtag("event", event, payload);
  }
}

export function trackGoogleAdsPhoneConversion() {
  if (typeof window.gtag !== "function") return;
  window.gtag("event", "conversion", {
    send_to: `${GOOGLE_ADS_ID}/${GOOGLE_ADS_PHONE_CONVERSION_LABEL}`,
  });
}
