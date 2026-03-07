"use client";

import { useRouter } from "next/navigation";
import { getPublicContactInfo } from "@/lib/contact";

export const OPEN_BOOKING_MODAL_EVENT = "ironclad:open-booking-modal";
type OpenBookingModalDetail = { serviceSlug?: string };

export function MobileBottomBar() {
  const router = useRouter();
  const { smsHref } = getPublicContactInfo();

  function handleBookService() {
    const bookingEvent = new CustomEvent<OpenBookingModalDetail>(OPEN_BOOKING_MODAL_EVENT, {
      cancelable: true,
    });

    window.dispatchEvent(bookingEvent);

    if (!bookingEvent.defaultPrevented) {
      router.push("/book");
    }
  }

  return (
    <div className="fixed inset-x-0 bottom-0 z-[998] border-t border-border bg-background/95 backdrop-blur md:hidden">
      <div className="container-shell flex gap-2 py-3">
        <button className="focus-ring primary-button flex-1 justify-center px-4 py-3" onClick={handleBookService} type="button">
          Book Service
        </button>
        <a className="focus-ring secondary-button px-5 py-3" data-track-intent="text" href={smsHref}>
          Text Us
        </a>
      </div>
    </div>
  );
}
