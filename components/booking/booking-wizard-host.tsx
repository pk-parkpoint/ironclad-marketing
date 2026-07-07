"use client";

import { useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { BookingWizard } from "./booking-wizard";
import {
  OPEN_BOOKING_MODAL_EVENT,
  takePendingOpenBookingModal,
  type OpenBookingModalDetail,
} from "@/lib/booking-events";

export function BookingWizardHost() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const search = searchParams.toString();
  const [open, setOpen] = useState(false);
  const [initialServiceSlug, setInitialServiceSlug] = useState<string | undefined>();

  useEffect(() => {
    function openWithDetail(detail?: OpenBookingModalDetail) {
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
    const query = new URLSearchParams(search);
    setInitialServiceSlug(query.get("service") || undefined);
    setOpen(true);
  }, [pathname, search]);

  return <BookingWizard initialServiceSlug={initialServiceSlug} onOpenChange={setOpen} open={open} />;
}
