"use client";

import { useEffect, useState } from "react";
import { BookingWizard } from "@/components/booking/booking-wizard";

export default function BookingWizardPreview() {
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(true);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      {!open && (
        <button
          className="primary-button px-6 py-3 text-sm"
          onClick={() => setOpen(true)}
          type="button"
        >
          Open Booking Wizard
        </button>
      )}
      <BookingWizard open={open} onOpenChange={setOpen} />
    </div>
  );
}
