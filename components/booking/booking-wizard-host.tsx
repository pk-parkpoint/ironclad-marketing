"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { usePathname, useSearchParams } from "next/navigation";
import type { BookingWizardProps } from "./booking-wizard";
import {
  OPEN_BOOKING_MODAL_EVENT,
  takePendingOpenBookingModal,
  type OpenBookingModalDetail,
} from "@/lib/booking-events";

let bookingWizardImport: Promise<typeof import("./booking-wizard")> | null = null;

function preloadBookingWizard() {
  bookingWizardImport ??= import("./booking-wizard");
  return bookingWizardImport;
}

const LazyBookingWizard = dynamic<BookingWizardProps>(
  () => preloadBookingWizard().then((mod) => mod.BookingWizard),
  { loading: () => null, ssr: false },
);

export function BookingWizardHost() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const search = searchParams.toString();
  const [open, setOpen] = useState(false);
  const [initialServiceSlug, setInitialServiceSlug] = useState<string | undefined>();

  useEffect(() => {
    function openWithDetail(detail?: OpenBookingModalDetail) {
      void preloadBookingWizard();
      setInitialServiceSlug(detail?.serviceSlug);
      setOpen(true);
    }

    function onOpen(event: Event) {
      const ce = event as CustomEvent<OpenBookingModalDetail>;
      event.preventDefault();
      openWithDetail(ce.detail);
    }

    window.addEventListener(OPEN_BOOKING_MODAL_EVENT, onOpen as EventListener);
    const pendingDetail = takePendingOpenBookingModal();
    if (pendingDetail) openWithDetail(pendingDetail);
    return () => window.removeEventListener(OPEN_BOOKING_MODAL_EVENT, onOpen as EventListener);
  }, []);

  useEffect(() => {
    if (pathname !== "/book") return;
    void preloadBookingWizard();
    const query = new URLSearchParams(search);
    setInitialServiceSlug(query.get("service") || undefined);
    setOpen(true);
  }, [pathname, search]);

  useEffect(() => {
    function preloadOnIntent(event: Event) {
      const target = event.target instanceof Element ? event.target : null;
      const link = target?.closest('a[href^="/book"], a[href*="ironcladtexas.com/book"]');
      if (link) void preloadBookingWizard();
    }

    document.addEventListener("pointerover", preloadOnIntent, { passive: true });
    document.addEventListener("focusin", preloadOnIntent);
    document.addEventListener("touchstart", preloadOnIntent, { passive: true });

    const idleId =
      "requestIdleCallback" in window
        ? window.requestIdleCallback(() => {
            void preloadBookingWizard();
          }, { timeout: 2500 })
        : globalThis.setTimeout(() => {
            void preloadBookingWizard();
          }, 1800);

    return () => {
      document.removeEventListener("pointerover", preloadOnIntent);
      document.removeEventListener("focusin", preloadOnIntent);
      document.removeEventListener("touchstart", preloadOnIntent);
      if ("cancelIdleCallback" in window && typeof idleId === "number") {
        window.cancelIdleCallback(idleId);
      } else {
        globalThis.clearTimeout(idleId);
      }
    };
  }, []);

  if (!open && pathname !== "/book") {
    return null;
  }

  return <LazyBookingWizard initialServiceSlug={initialServiceSlug} onOpenChange={setOpen} open={open} />;
}
