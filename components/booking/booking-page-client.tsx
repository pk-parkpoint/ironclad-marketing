"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { BookingWizard } from "@/components/booking/booking-wizard";

export function BookingPageClient() {
  const router = useRouter();
  const [open, setOpen] = useState(true);

  function handleOpenChange(nextOpen: boolean) {
    setOpen(nextOpen);
    if (!nextOpen) {
      router.push("/");
    }
  }

  return <BookingWizard onOpenChange={handleOpenChange} open={open} />;
}
