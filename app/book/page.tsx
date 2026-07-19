import { Suspense } from "react";
import { BookingPageClient } from "@/components/booking/booking-page-client";
import { buildPageMetadata, NOINDEX_FOLLOW_ROBOTS } from "@/lib/seo";

export const metadata = buildPageMetadata({
  title: "Book a Plumber in Austin | Ironclad Plumbing",
  description:
    "Book an Ironclad Plumbing appointment online for Austin-area plumbing repairs, drains, water heaters, leaks, and emergency service.",
  path: "/book",
  ogTemplate: "default",
  robots: NOINDEX_FOLLOW_ROBOTS,
});

export default function BookPage() {
  return (
    <Suspense fallback={null}>
      <BookingPageClient />
    </Suspense>
  );
}
