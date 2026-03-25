"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useMemo } from "react";
import {
  applyAttributionToInternalAnchors,
  ATTRIBUTION_KEYS,
  ATTRIBUTION_STORAGE_KEY,
  type AttributionData,
  hasAttribution,
  mergeAttribution,
  parseAttribution,
} from "@/lib/analytics";
import { derivePageContext, getDeviceType } from "@/lib/analytics-page-context";
import { recordBookingSiteVisit } from "@/lib/booking-session";
import { useScrollDepthTracking } from "@/components/analytics/use-scroll-depth-tracking";

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
const FAQ_KEY_PREFIX = "ironclad_faq_engaged:";

function readStoredAttribution(): AttributionData {
  try {
    const raw = window.localStorage.getItem(ATTRIBUTION_STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as Record<string, unknown>;
    const data: AttributionData = {};
    for (const key of ATTRIBUTION_KEYS) {
      const value = parsed[key];
      if (typeof value === "string" && value.trim()) data[key] = value;
    }
    return data;
  } catch {
    return {};
  }
}

function writeStoredAttribution(data: AttributionData) {
  try {
    window.localStorage.setItem(ATTRIBUTION_STORAGE_KEY, JSON.stringify(data));
  } catch {
    // no-op
  }
}

function withAttribution(payload: Record<string, unknown>, attribution: AttributionData) {
  const next: Record<string, unknown> = { ...payload };
  for (const key of ATTRIBUTION_KEYS) {
    if (attribution[key]) next[key] = attribution[key];
  }
  return next;
}

function getCtaPosition(element: Element): string {
  if (element.closest("header")) return "header";
  if (element.closest("footer")) return "footer";
  if (element.closest("aside")) return "sidebar";
  return "body";
}

function trackEvent(event: string, payload: Record<string, unknown>) {
  window.dataLayer = window.dataLayer ?? [];
  window.dataLayer.push({ event, ...payload });
  if (!HAS_GTM && typeof window.gtag === "function") {
    window.gtag("event", event, payload);
  }
}

function markFaqEngaged(pathname: string) {
  try {
    window.sessionStorage.setItem(`${FAQ_KEY_PREFIX}${pathname}`, "1");
  } catch {
    // no-op
  }
}

function faqPrecedesConversion(pathname: string): boolean {
  try {
    return window.sessionStorage.getItem(`${FAQ_KEY_PREFIX}${pathname}`) === "1";
  } catch {
    return false;
  }
}

function trackFaqEvent({
  open,
  pathname,
  question,
  search,
  attribution,
}: {
  open: boolean;
  pathname: string;
  question: string;
  search: string;
  attribution: AttributionData;
}) {
  const context = derivePageContext(pathname);
  if (open) markFaqEngaged(pathname);
  trackEvent(
    open ? "faq_expand" : "faq_collapse",
    withAttribution(
      {
        page_url: `${pathname}${search ? `?${search}` : ""}`,
        page_template: context.pageTemplate,
        page_family: context.pageFamily,
        service: context.service,
        city: context.city,
        source_page_family: context.pageFamily,
        device_type: getDeviceType(),
        question,
      },
      attribution,
    ),
  );
}

export function AnalyticsBootstrap() {
  const pathname = usePathname() ?? "/";
  const searchParams = useSearchParams();
  const search = useMemo(() => searchParams.toString(), [searchParams]);

  useScrollDepthTracking({
    resetKey: `${pathname}?${search}`,
    onThreshold: (threshold) => {
      const context = derivePageContext(pathname);
      trackEvent(
        "scroll_depth",
        withAttribution(
          {
            page_url: `${pathname}${search ? `?${search}` : ""}`,
            page_template: context.pageTemplate,
            source_page_family: context.pageFamily,
            device_type: getDeviceType(),
            percent: threshold,
          },
          readStoredAttribution(),
        ),
      );
    },
  });

  useEffect(() => {
    const incoming = parseAttribution(new URLSearchParams(search));
    const merged = mergeAttribution({ stored: readStoredAttribution(), incoming });
    if (hasAttribution(merged)) {
      writeStoredAttribution(merged);
      applyAttributionToInternalAnchors(merged);
    }

    recordBookingSiteVisit({
      attribution: merged,
      pathname,
      search,
    });

    const context = derivePageContext(pathname);
    trackEvent(
      "page_view",
      withAttribution(
        {
          page_url: `${pathname}${search ? `?${search}` : ""}`,
          page_template: context.pageTemplate,
          page_family: context.pageFamily,
          service: context.service,
          city: context.city,
          source_page_family: context.pageFamily,
          device_type: getDeviceType(),
        },
        merged,
      ),
    );
  }, [pathname, search]);

  useEffect(() => {
    const clickListener = (event: MouseEvent) => {
      const target = event.target as Element | null;
      if (!target) return;

      const anchor = target.closest("a[href]");
      if (!(anchor instanceof HTMLAnchorElement)) return;

      const href = anchor.getAttribute("href") ?? "";
      const label = anchor.textContent?.trim() ?? "";
      const context = derivePageContext(pathname);
      const attribution = readStoredAttribution();
      const payload = withAttribution(
        {
          page_url: `${pathname}${search ? `?${search}` : ""}`,
          page_template: context.pageTemplate,
          page_family: context.pageFamily,
          service: context.service,
          city: context.city,
          source_page_family: context.pageFamily,
          device_type: getDeviceType(),
          cta_label: label,
          cta_position: getCtaPosition(anchor),
          href,
          faq_precedes_conversion: faqPrecedesConversion(pathname),
        },
        attribution,
      );

      trackEvent("cta_click", payload);
      if (href.startsWith("tel:")) trackEvent("phone_click", payload);
      if (href.startsWith("sms:")) trackEvent("text_click", payload);
      if (href.startsWith("/book")) {
        trackEvent("book_click", payload);
        trackEvent("booking_funnel_event", { ...payload, step: "entry_click" });
      }
      if (href.startsWith("/plumbing/")) trackEvent("service_card_click", payload);
      if (href.startsWith("/service-area/")) trackEvent("city_card_click", payload);
      if (href.includes("/financing")) trackEvent("financing_click", payload);
      if (href.includes("/special-offers")) trackEvent("offer_click", payload);
      if (href.includes("/plumbing/emergency") || label.toLowerCase().includes("emergency")) {
        trackEvent("emergency_cta_click", payload);
      }
    };

    const submitListener = (event: Event) => {
      const form = event.target;
      if (!(form instanceof HTMLFormElement)) return;

      const context = derivePageContext(pathname);
      const attribution = readStoredAttribution();
      trackEvent(
        "form_submit",
        withAttribution(
          {
            page_url: `${pathname}${search ? `?${search}` : ""}`,
            page_template: context.pageTemplate,
            page_family: context.pageFamily,
            service: context.service,
            city: context.city,
            source_page_family: context.pageFamily,
            device_type: getDeviceType(),
            cta_position: getCtaPosition(form),
            form_action: form.getAttribute("action") ?? pathname,
            faq_precedes_conversion: faqPrecedesConversion(pathname),
          },
          attribution,
        ),
      );
      trackEvent(
        "booking_funnel_event",
        withAttribution(
          {
            page_url: `${pathname}${search ? `?${search}` : ""}`,
            step: "submit_attempt",
            source_page_family: context.pageFamily,
          },
          attribution,
        ),
      );
    };

    const detailsToggleListener = (event: Event) => {
      const target = event.target;
      if (!(target instanceof HTMLDetailsElement)) return;
      const summaryText = target.querySelector("summary")?.textContent?.trim();
      if (!summaryText) return;
      trackFaqEvent({
        open: target.open,
        pathname,
        question: summaryText,
        search,
        attribution: readStoredAttribution(),
      });
    };

    const customFaqListener = (event: Event) => {
      const custom = event as CustomEvent<{ question: string; open: boolean }>;
      if (!custom.detail?.question) return;
      trackFaqEvent({
        open: Boolean(custom.detail.open),
        pathname,
        question: custom.detail.question,
        search,
        attribution: readStoredAttribution(),
      });
    };

    document.addEventListener("click", clickListener, true);
    document.addEventListener("submit", submitListener, true);
    document.addEventListener("toggle", detailsToggleListener, true);
    window.addEventListener("ironclad:faq-toggle", customFaqListener as EventListener);
    return () => {
      document.removeEventListener("click", clickListener, true);
      document.removeEventListener("submit", submitListener, true);
      document.removeEventListener("toggle", detailsToggleListener, true);
      window.removeEventListener("ironclad:faq-toggle", customFaqListener as EventListener);
    };
  }, [pathname, search]);
  return null;
}
