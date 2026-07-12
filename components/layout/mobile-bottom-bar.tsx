"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { getPublicContactInfo } from "@/lib/contact";

const LOCAL_CITY_PATHS = new Set([
  "/service-area/austin-tx",
  "/service-area/round-rock-tx",
  "/service-area/georgetown-tx",
  "/service-area/pflugerville-tx",
  "/service-area/cedar-park-tx",
  "/service-area/leander-tx",
  "/service-area/lakeway-tx",
  "/service-area/bee-cave-tx",
  "/service-area/west-lake-hills-tx",
  "/service-area/rollingwood-tx",
]);

export function MobileBottomBar() {
  const pathname = usePathname();
  const { smsHref } = getPublicContactInfo();

  if (
    pathname === "/plumbing/drain-cleaning" ||
    pathname === "/reviews" ||
    LOCAL_CITY_PATHS.has(pathname || "") ||
    pathname?.startsWith("/service-area/austin-tx/")
  ) {
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
