import Link from "next/link";
import { SiteLogo } from "@/components/layout/site-logo";

export function DataDeskPoweredFooter() {
  return (
    <footer className="dd-powered">
      <Link href="/" aria-label="Powered by Ironclad Plumbing">
        <span>Powered by</span>
        <SiteLogo theme="light" />
      </Link>
    </footer>
  );
}
