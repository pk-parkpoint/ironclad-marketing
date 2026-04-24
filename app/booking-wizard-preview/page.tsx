"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { BookingWizard } from "@/components/booking/booking-wizard";

export default function BookingWizardPreview() {
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(true);

  useEffect(() => setMounted(true), []);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <main className="max-w-xl text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-gray-500">
          Ironclad Plumbing
        </p>
        <h1 className="mt-3 text-3xl font-semibold text-gray-950">
          Request plumbing service
        </h1>
        <p className="mt-3 text-sm text-gray-600">
          Book online or open the embedded booking wizard.
        </p>
        <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link className="primary-button px-6 py-3 text-sm" href="/book">
            Book Service
          </Link>
          <Link className="secondary-button px-6 py-3 text-sm" href="/book">
            Schedule Online
          </Link>
        </div>
      </main>
      {!open && (
        <button
          className="primary-button fixed bottom-6 right-6 px-6 py-3 text-sm"
          onClick={() => setOpen(true)}
          type="button"
        >
          Open Booking Wizard
        </button>
      )}
      {mounted && <BookingWizard open={open} onOpenChange={setOpen} />}
    </div>
  );
}
