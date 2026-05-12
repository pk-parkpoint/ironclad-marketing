"use client";

/**
 * @deprecated
 * Legacy 5-step booking modal host. Superseded by `BookingWizardHost`
 * (`./booking-wizard-host.tsx`) which mounts the current `BookingWizard`
 * with full abandon/notify telemetry and the AI scheduling facade.
 *
 * This file is intentionally kept for git history reference. As of
 * 2026-05-07 (PR #15 / commit b64ce8e) nothing imports it — `app/layout.tsx`
 * mounts `<BookingWizardHost />` only. Do not import or mount this; do not
 * audit booking behavior from this file. Delete it whenever convenient.
 */

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { BookingModal } from "@/components/booking/booking-modal";
import { OPEN_BOOKING_MODAL_EVENT } from "@/components/layout/mobile-bottom-bar";

type BookingModalOpenDetail = {
  serviceSlug?: string;
};

/** @deprecated Use `BookingWizardHost` instead. See file header. */
export function BookingModalHost() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [initialServiceSlug, setInitialServiceSlug] = useState<string | undefined>(undefined);

  useEffect(() => {
    function onOpenBookingModal(event: Event) {
      const customEvent = event as CustomEvent<BookingModalOpenDetail>;
      event.preventDefault();
      setInitialServiceSlug(customEvent.detail?.serviceSlug);
      setOpen(true);
    }

    window.addEventListener(OPEN_BOOKING_MODAL_EVENT, onOpenBookingModal as EventListener);
    return () => {
      window.removeEventListener(OPEN_BOOKING_MODAL_EVENT, onOpenBookingModal as EventListener);
    };
  }, []);

  useEffect(() => {
    if (pathname !== "/book") return;
    const query = new URLSearchParams(window.location.search);
    setInitialServiceSlug(query.get("service") || undefined);
    setOpen(true);
  }, [pathname]);

  return (
    <BookingModal
      initialServiceSlug={initialServiceSlug}
      onOpenChange={setOpen}
      open={open}
    />
  );
}
