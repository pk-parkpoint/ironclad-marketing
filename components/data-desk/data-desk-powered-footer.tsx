import Link from "next/link";
import { HeadquartersAddress } from "@/components/layout/headquarters-address";
import { SiteLogo } from "@/components/layout/site-logo";

export function DataDeskPoweredFooter() {
  return (
    <footer className="dd-powered">
      <Link href="/" aria-label="Powered by Ironclad Plumbing">
        <span>Powered by</span>
        <SiteLogo theme="light" />
      </Link>
      <HeadquartersAddress className="mt-2 text-center text-[11px] leading-4 text-[#7E8C99]" />
    </footer>
  );
}
