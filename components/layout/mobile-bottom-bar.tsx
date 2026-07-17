"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { getPublicContactInfo } from "@/lib/contact";

export function MobileBottomBar() {
  const pathname = usePathname();
  const { phoneHref } = getPublicContactInfo();
  const emergencyPage = pathname === "/plumbing/emergency";

  if (pathname?.startsWith("/data")) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-[998] border-t border-border bg-background/95 backdrop-blur md:hidden">
      <div className="container-shell flex gap-2 py-3">
        <a className="focus-ring primary-button flex-1 justify-center px-4 py-3" data-track-intent="phone" href={phoneHref}>
          Call Now
        </a>
        {!emergencyPage ? (
          <Link className="focus-ring secondary-button flex-1 justify-center px-4 py-3" data-track-intent="book" href="/book">
            Book Online
          </Link>
        ) : null}
      </div>
    </div>
  );
}
