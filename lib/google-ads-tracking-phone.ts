import type { AttributionData } from "@/lib/analytics";

const PUBLIC_PHONE = process.env.NEXT_PUBLIC_PHONE?.trim() || "(512) 506-2470";
const TRACKING_PHONE = process.env.NEXT_PUBLIC_GOOGLE_ADS_TRACKING_PHONE?.trim() || "";
const GOOGLE_ADS_ID = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID?.trim() || "AW-18207846861";
const WEBSITE_CALL_LABEL =
  process.env.NEXT_PUBLIC_GOOGLE_ADS_WEBSITE_CALL_CONVERSION_LABEL?.trim() || "";

const EMPTY_MARKERS = new Set(["", "na", "n/a", "none", "null", "undefined", "unknown"]);
const PAID_MEDIA = new Set(["cpc", "paid", "paid_search", "paid-search", "paid search", "ppc"]);

function meaningful(value: string | undefined): boolean {
  return !EMPTY_MARKERS.has((value || "").trim().toLowerCase());
}

function phoneHref(value: string): string | null {
  const digits = value.replace(/\D/g, "").slice(-10);
  return digits.length === 10 ? `tel:+1${digits}` : null;
}

export function isGoogleAdsAttribution(attribution: AttributionData): boolean {
  if (meaningful(attribution.gclid) || meaningful(attribution.gbraid) || meaningful(attribution.wbraid)) {
    return true;
  }

  return (attribution.utm_source || "").trim().toLowerCase() === "google"
    && PAID_MEDIA.has((attribution.utm_medium || "").trim().toLowerCase());
}

function replacePublicPhoneText(anchor: HTMLAnchorElement) {
  const walker = document.createTreeWalker(anchor, NodeFilter.SHOW_TEXT);
  let node = walker.nextNode();
  while (node) {
    if (node.textContent?.includes(PUBLIC_PHONE)) {
      node.textContent = node.textContent.replaceAll(PUBLIC_PHONE, TRACKING_PHONE);
    }
    node = walker.nextNode();
  }
}

export function routeGoogleAdsPhoneAnchor(
  anchor: HTMLAnchorElement,
  attribution: AttributionData,
): boolean {
  const publicHref = phoneHref(PUBLIC_PHONE);
  const trackingHref = phoneHref(TRACKING_PHONE);
  if (!publicHref || !trackingHref || !isGoogleAdsAttribution(attribution)) return false;

  const href = anchor.getAttribute("href");
  if (!href || phoneHref(href) !== publicHref) return false;

  anchor.setAttribute("href", trackingHref);
  replacePublicPhoneText(anchor);
  return true;
}

export function applyGoogleAdsTrackingPhone(attribution: AttributionData) {
  if (!isGoogleAdsAttribution(attribution)) return;

  let changed = false;
  for (const anchor of document.querySelectorAll<HTMLAnchorElement>('a[href^="tel:"]')) {
    changed = routeGoogleAdsPhoneAnchor(anchor, attribution) || changed;
  }

  if (
    changed
    && WEBSITE_CALL_LABEL
    && !WEBSITE_CALL_LABEL.startsWith("replace-with-")
    && typeof window.gtag === "function"
  ) {
    window.gtag("config", `${GOOGLE_ADS_ID}/${WEBSITE_CALL_LABEL}`, {
      phone_conversion_number: TRACKING_PHONE,
    });
  }
}
