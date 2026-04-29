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
