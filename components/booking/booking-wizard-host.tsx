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
  { loading: () => <BookingWizardLoadingShell />, ssr: false },
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

function BookingWizardLoadingShell() {
  return (
    <div
      aria-labelledby="booking-wizard-loading-title"
      aria-modal="true"
      className="fixed inset-0 z-[1000] grid min-h-[100dvh] place-items-center overflow-hidden bg-[radial-gradient(circle_at_18%_0%,#dbeafe,transparent_52%),linear-gradient(180deg,#eef5ff,#dbe7f7)] px-4 py-10"
      role="dialog"
    >
      <div className="w-full max-w-[640px] rounded-[27px] bg-[linear-gradient(150deg,#fffffff2,#bfdbfeb3_32%,#2563eb73_62%,#ffffffe6)] p-[1.5px] shadow-[0_34px_90px_-22px_rgba(22,35,58,0.38),0_4px_18px_rgba(22,35,58,0.10)]">
        <div className="rounded-[25.5px] border border-white/55 bg-white/75 px-6 py-8 text-center shadow-sm backdrop-blur-xl">
          <p className="mx-auto h-12 w-12 animate-pulse rounded-full bg-blue-100" aria-hidden="true" />
          <h2 id="booking-wizard-loading-title" className="mt-5 text-xl font-semibold text-[#16233a]">
            Opening booking
          </h2>
          <p className="mt-2 text-sm font-medium text-[#4b5f7a]">
            Loading available appointment steps...
          </p>
          <div className="mt-6 grid grid-cols-4 gap-3" aria-hidden="true">
            {[0, 1, 2, 3].map((index) => (
              <span className="h-2 rounded-full bg-blue-100" key={index} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
