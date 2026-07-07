"use client";

import { usePathname, useRouter } from "next/navigation";
import { getPublicContactInfo } from "@/lib/contact";
import { dispatchOpenBookingModal } from "@/lib/booking-events";

export function MobileBottomBar() {
  const router = useRouter();
  const pathname = usePathname();
  const { smsHref } = getPublicContactInfo();

  function handleBookService() {
    if (!dispatchOpenBookingModal({}, { queueIfUnhandled: true })) {
      router.push("/book");
    }
  }

  if (pathname === "/plumbing/drain-cleaning" || pathname === "/reviews") {
    return null;
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
