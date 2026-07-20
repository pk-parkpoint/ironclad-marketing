"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { BookingWizard } from "@/components/booking/booking-wizard";

export function BookingPageClient() {
  const router = useRouter();
  const [open, setOpen] = useState(true);

  useEffect(() => {
    if (open) window.__ironcladHideBookingPreboot?.();
  }, [open]);

  function handleOpenChange(nextOpen: boolean) {
    setOpen(nextOpen);
    if (!nextOpen) {
      router.push("/");
    }
  }

  return <BookingWizard onOpenChange={handleOpenChange} open={open} />;
}
