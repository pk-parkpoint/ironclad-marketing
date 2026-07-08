"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { getPublicContactInfo } from "@/lib/contact";

export function MobileBottomBar() {
  const pathname = usePathname();
  const { smsHref } = getPublicContactInfo();

  if (pathname === "/plumbing/drain-cleaning" || pathname === "/reviews") {
    return null;
  }

  return (
    <div className="fixed inset-x-0 bottom-0 z-[998] border-t border-border bg-background/95 backdrop-blur md:hidden">
      <div className="container-shell flex gap-2 py-3">
        <Link className="focus-ring primary-button flex-1 justify-center px-4 py-3" href="/book">
          Book Service
        </Link>
        <a className="focus-ring secondary-button px-5 py-3" data-track-intent="text" href={smsHref}>
          Text Us
        </a>
      </div>
    </div>
  );
}
