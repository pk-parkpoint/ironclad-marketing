"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { BookingModal } from "@/components/booking/booking-modal";
import { OPEN_BOOKING_MODAL_EVENT } from "@/components/layout/mobile-bottom-bar";

type BookingModalOpenDetail = {
  serviceSlug?: string;
};

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
