export const ATTRIBUTION_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
  "gclid",
  "fbclid",
  "msclkid",
] as const;

export const ATTRIBUTION_STORAGE_KEY = "ironclad_attribution_v1";

export const SCROLL_DEPTH_THRESHOLDS = [25, 50, 75, 100] as const;

export type AttributionKey = (typeof ATTRIBUTION_KEYS)[number];
export type AttributionData = Partial<Record<AttributionKey, string>>;

type TrackLeadSubmitSuccessInput = {
  city?: string;
  formType: "booking_wizard" | "contact_form" | "commercial_form";
  pageUrl?: string;
  service?: string;
};

export function parseAttribution(searchParams: URLSearchParams): AttributionData {
  const attribution: AttributionData = {};
  for (const key of ATTRIBUTION_KEYS) {
    const value = searchParams.get(key);
    if (value) {
      attribution[key] = value;
    }
  }
  return attribution;
}

export function mergeAttribution({
  stored,
  incoming,
}: {
  stored: AttributionData;
  incoming: AttributionData;
}): AttributionData {
  return {
    ...stored,
    ...incoming,
  };
}

export function hasAttribution(data: AttributionData): boolean {
  return ATTRIBUTION_KEYS.some((key) => Boolean(data[key]));
}

export function isInternalHref(href: string): boolean {
  if (!href.startsWith("/")) {
    return false;
  }
  if (href.startsWith("//")) {
    return false;
  }
  return !href.startsWith("/_next/");
}

export function appendAttributionToInternalHref({
  href,
  attribution,
}: {
  href: string;
  attribution: AttributionData;
}): string {
  if (!isInternalHref(href)) {
    return href;
  }

  const [pathAndQuery, hash = ""] = href.split("#", 2);
  const [pathname = "/", query = ""] = pathAndQuery.split("?", 2);
  const params = new URLSearchParams(query);
  let changed = false;

  for (const key of ATTRIBUTION_KEYS) {
    const value = attribution[key];
    if (value && !params.has(key)) {
      params.set(key, value);
      changed = true;
    }
  }

  if (!changed) {
    return href;
  }

  const queryString = params.toString();
  const withQuery = queryString ? `${pathname}?${queryString}` : pathname;
  return hash ? `${withQuery}#${hash}` : withQuery;
}

export function applyAttributionToInternalAnchors(attribution: AttributionData) {
  if (!hasAttribution(attribution)) {
    return;
  }

  const anchors = document.querySelectorAll<HTMLAnchorElement>("a[href]");
  for (const anchor of anchors) {
    const href = anchor.getAttribute("href");
    if (!href || href.startsWith("#")) {
      continue;
    }

    const nextHref = appendAttributionToInternalHref({ href, attribution });
    if (nextHref !== href) {
      anchor.setAttribute("href", nextHref);
    }
  }
}

function readStoredAttribution(): AttributionData {
  try {
    const raw = window.localStorage.getItem(ATTRIBUTION_STORAGE_KEY);
    if (!raw) {
      return {};
    }
    const parsed = JSON.parse(raw) as Record<string, unknown>;
    const attribution: AttributionData = {};
    for (const key of ATTRIBUTION_KEYS) {
      const value = parsed[key];
      if (typeof value === "string" && value.trim()) {
        attribution[key] = value;
      }
    }
    return attribution;
  } catch {
    return {};
  }
}

export function trackLeadSubmitSuccess({
  city = "",
  formType,
  pageUrl = "",
  service = "",
}: TrackLeadSubmitSuccessInput) {
  if (typeof window === "undefined") {
    return;
  }

  const searchParams = new URLSearchParams(window.location.search);
  const attribution = mergeAttribution({
    incoming: parseAttribution(searchParams),
    stored: readStoredAttribution(),
  });
  const payload: Record<string, unknown> = {
    city,
    device_type: window.innerWidth < 768 ? "mobile" : window.innerWidth < 1024 ? "tablet" : "desktop",
    form_type: formType,
    page_url: pageUrl || `${window.location.pathname}${window.location.search}`,
    service,
  };

  for (const key of ATTRIBUTION_KEYS) {
    const value = attribution[key];
    if (value) {
      payload[key] = value;
    }
  }

  window.dataLayer = window.dataLayer ?? [];
  window.dataLayer.push({ event: "lead_submit_success", ...payload });

  if (typeof window.gtag === "function") {
    window.gtag("event", "lead_submit_success", payload);
  }
}
