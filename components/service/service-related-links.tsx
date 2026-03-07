import Link from "next/link";
import type { BlogEntry } from "@/content/blog-posts";
import type { LocationEntry } from "@/content/locations";
import type { ServiceEntry } from "@/content/services";

type ServiceRelatedLinksProps = {
  relatedServices: ServiceEntry[];
  relatedCities: LocationEntry[];
  relatedGuides: BlogEntry[];
  showCommercialCrossover: boolean;
};

export function ServiceRelatedLinks({
  relatedServices,
  relatedCities,
  relatedGuides,
  showCommercialCrossover,
}: ServiceRelatedLinksProps) {
  return (
    <section className="bg-[#F9FAFB] py-16 md:py-20">
      <div className="mx-auto w-full max-w-[1280px] space-y-10 px-6">
        <div>
          <h2 className="text-[30px] font-bold leading-[1.2] text-[#111827]">Related Services and Resources</h2>
          <p className="mt-3 text-[16px] leading-[1.7] text-[#374151]">
            Explore related service pages, service-area coverage, and practical homeowner guides.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {relatedServices.map((entry) => (
            <Link
              className="focus-ring rounded-lg border border-[#E5E7EB] bg-white p-5 text-[15px] font-semibold text-[#2563EB] hover:no-underline"
              href={`/plumbing/${entry.slug}`}
              key={entry.slug}
            >
              {entry.title}
            </Link>
          ))}
        </div>

        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
          {relatedCities.map((location) => (
            <Link
              className="focus-ring rounded-lg border border-[#E5E7EB] bg-white p-4 text-[14px] font-semibold text-[#1F2937] hover:no-underline"
              href={`/service-area/${location.slug}`}
              key={location.slug}
            >
              {location.cityName}
            </Link>
          ))}
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {relatedGuides.map((guide) => (
            <Link
              className="focus-ring rounded-lg border border-[#E5E7EB] bg-white p-5 text-[14px] text-[#374151] hover:no-underline"
              href={`/blog/${guide.slug}`}
              key={guide.slug}
            >
              <p className="font-semibold text-[#111827]">{guide.title}</p>
              <p className="mt-2">{guide.metaDescription}</p>
            </Link>
          ))}
        </div>

        {showCommercialCrossover ? (
          <div className="rounded-lg border border-[#BFDBFE] bg-[#EFF6FF] p-5">
            <p className="text-[14px] text-[#1E3A8A]">
              Need similar support for a business property?{" "}
              <Link className="font-semibold underline" href="/commercial-plumbing/austin-tx">
                Visit our commercial plumbing page.
              </Link>
            </p>
          </div>
        ) : null}
      </div>
    </section>
  );
}
