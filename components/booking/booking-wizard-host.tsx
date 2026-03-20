"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { BookingWizard } from "./booking-wizard";
import { OPEN_BOOKING_MODAL_EVENT } from "@/components/layout/mobile-bottom-bar";

type BookingModalOpenDetail = {
  serviceSlug?: string;
};

export function BookingWizardHost() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [initialServiceSlug, setInitialServiceSlug] = useState<string | undefined>();

  useEffect(() => {
    function onOpen(event: Event) {
      const ce = event as CustomEvent<BookingModalOpenDetail>;
      event.preventDefault();
      setInitialServiceSlug(ce.detail?.serviceSlug);
      setOpen(true);
    }
    window.addEventListener(OPEN_BOOKING_MODAL_EVENT, onOpen as EventListener);
    return () => window.removeEventListener(OPEN_BOOKING_MODAL_EVENT, onOpen as EventListener);
  }, []);

  useEffect(() => {
    if (pathname !== "/book") return;
    const query = new URLSearchParams(window.location.search);
    setInitialServiceSlug(query.get("service") || undefined);
    setOpen(true);
  }, [pathname]);

  return <BookingWizard initialServiceSlug={initialServiceSlug} onOpenChange={setOpen} open={open} />;
}
