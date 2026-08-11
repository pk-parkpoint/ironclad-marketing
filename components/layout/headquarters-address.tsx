import { HEADQUARTERS_ADDRESS } from "@/lib/contact";

export function HeadquartersAddress({ className = "" }: { className?: string }) {
  return (
    <address className={`not-italic ${className}`}>
      <span className="block font-semibold text-white">HQ</span>
      <span>{HEADQUARTERS_ADDRESS}</span>
    </address>
  );
}
