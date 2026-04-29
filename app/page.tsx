import Image from "next/image";
import Link from "next/link";
import { DeferredReviewsSection } from "@/components/service/deferred-reviews-section";
import { HomeHero } from "@/components/home/home-hero";
import { FAQSection } from "@/components/layout/faq-section";
import { GuaranteeBar } from "@/components/layout/guarantee-bar";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { QuickAnswer } from "@/components/seo/quick-answer";
import { StructuredData } from "@/components/seo/structured-data";
import { HOME_FAQ_ITEMS } from "@/content/home-faqs";
import { LOCATIONS } from "@/content/locations";
import { REVIEWS } from "@/content/reviews";
import { SERVICES } from "@/content/services";
import { buildPageMetadata } from "@/lib/seo";
import {
  buildAggregateRatingSchema,
  buildFaqPageSchema,
  buildLocalBusinessSchema,
  buildOrganizationSchema,
  buildSchemaStack,
  buildWebSiteSchema,
} from "@/lib/structured-data";

export const metadata = buildPageMetadata({
  title: "Austin Plumber | Same-Day Plumbing, Drain, Water Heater & Leak Service",
  description:
    "Same-day Austin plumbing for repairs, drains, water heaters, leaks, and emergencies. Clear pricing, expert service, and easy online booking.",
  path: "/",
});

const GOOGLE_REVIEW_LINK = "/reviews";
const REVIEW_COUNT = 142;

const HOME_SERVICES_GRID = [
  {
    title: "Plumbing Repairs",
    description: "Leaky faucets, running toilets, burst pipes - repaired right the first time.",
    imageSrc: "/media/services/plumbing-repairs.jpg",
    alt: "Plumber repairing an outdoor water shutoff valve at a home",
    href: "/plumbing/repairs",
  },
  {
    title: "Drain Cleaning",
    description: "Slow drains and recurring clogs cleared fast with professional-grade equipment.",
    imageSrc: "/media/services/drain-cleaning.jpg",
    alt: "Plumber clearing a clogged drain under a commercial kitchen sink",
    href: "/plumbing/drain-cleaning",
  },
  {
    title: "Sewer Line Services",
    description: "Camera inspections, trenchless repair, and full-line replacement when you need it.",
    imageSrc: "/media/services/sewer-line-services.jpg",
    alt: "Plumber operating a sewer camera inspection monitor outdoors",
    href: "/plumbing/sewer-services",
  },
  {
    title: "Water Heaters",
    description: "Tank and tankless installation, repair, and maintenance to keep hot water flowing.",
    imageSrc: "/media/services/water-heaters.jpg",
    alt: "Technician installing a wall-mounted tankless water heater",
    href: "/plumbing/water-heaters",
  },
  {
    title: "Fixture Installation",
    description: "Faucets, toilets, sinks, showers, and garbage disposals installed with precision.",
    imageSrc: "/media/services/fixture-installation.jpg",
    alt: "Modern bathroom fixture installation in progress",
    href: "/plumbing/fixtures",
  },
  {
    title: "Emergency Plumbing",
    description: "Burst pipe at 2 AM? We're on call for urgent plumbing emergencies.",
    imageSrc: "/media/services/emergency-plumbing.jpg",
    alt: "Emergency plumbing call with technician arriving at a home at night",
    href: "/plumbing/emergency",
  },
] as const;

export default function Home() {
  const sortedLocations = [...LOCATIONS].sort((a, b) => a.cityName.localeCompare(b.cityName));
  const schemas = buildSchemaStack(
    buildLocalBusinessSchema("/"),
    buildWebSiteSchema(),
    buildOrganizationSchema(),
    buildAggregateRatingSchema(REVIEWS),
    buildFaqPageSchema(HOME_FAQ_ITEMS),
  );

  return (
    <>
      <a className="focus-ring sr-only focus:not-sr-only" href="#main-content">
        Skip to content
      </a>
      <SiteHeader />
      <StructuredData data={schemas} id="ld-home-business" />
      <main id="main-content">
        <HomeHero reviewCount={REVIEW_COUNT} reviewHref={GOOGLE_REVIEW_LINK} />
        <GuaranteeBar />
        <section className="bg-white py-8">
          <div className="container-shell">
            <QuickAnswer>
              Ironclad Plumbing is an Austin residential plumber for same-day repairs, drains, water heaters, leaks,
              fixtures, sewer issues, and emergency plumbing. We publish homeowner guides, give written pricing before
              work starts, and back completed work with clear guarantees.
            </QuickAnswer>
          </div>
        </section>
        <section className="bg-[#F9FAFB] pt-16 pb-20 home-deferred-section">
          <div className="mx-auto w-full max-w-[1280px] px-6">
            <h2 className="mb-10 text-center text-[32px] font-bold leading-[1.2] text-[#2563EB]">
              Our Services
            </h2>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {HOME_SERVICES_GRID.map((service) => (
                <Link
                  className="focus-ring group block cursor-pointer overflow-hidden rounded-[8px] border border-[#E5E7EB] bg-white shadow-[0_1px_3px_rgba(0,0,0,0.06)] transition-[box-shadow,transform] duration-200 ease-out hover:-translate-y-[2px] hover:shadow-[0_4px_12px_rgba(0,0,0,0.1)] hover:no-underline"
                  href={service.href}
                  key={service.href}
                >
                  <div className="relative aspect-[3/2] overflow-hidden">
                    <Image
                      alt={service.alt}
                      className="object-cover transition-transform duration-[400ms] ease-out group-hover:scale-[1.03]"
                      fill
                      sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                      src={service.imageSrc}
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="mb-2 text-[20px] font-semibold leading-tight text-[#2563EB]">
                      {service.title}
                    </h3>
                    <p className="mb-4 overflow-hidden text-[15px] font-normal leading-[1.6] text-[#4B5563] [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:2]">
                      {service.description}
                    </p>
                    <span className="inline-flex items-center text-[14px] font-semibold text-[#2563EB] transition-colors duration-200 group-hover:text-[#1D4ED8] group-hover:underline group-hover:underline-offset-4">
                      Explore Service
                      <span
                        aria-hidden="true"
                        className="ml-1 inline-block transition-transform duration-200 group-hover:translate-x-1"
                      >
                        →
                      </span>
                    </span>
                  </div>
                </Link>
              ))}
            </div>
            <div className="mt-10 text-center">
              <Link
                className="focus-ring inline-flex items-center gap-2 rounded-full border-2 border-[#2563EB] bg-transparent px-8 py-[14px] text-[16px] font-semibold text-[#2563EB] transition-colors hover:bg-[#2563EB] hover:text-white hover:no-underline"
                href="/plumbing"
              >
                View All {SERVICES.length} Services
                <span aria-hidden="true" className="ml-1">→</span>
              </Link>
            </div>
          </div>
        </section>
        <DeferredReviewsSection />
        <section className="section-block home-deferred-section">
          <div className="container-shell">
            <div className="relative overflow-hidden rounded-[var(--radius-card)] border border-border bg-[#ECEEF1]">
              <div
                aria-hidden="true"
                className="absolute inset-0"
                style={{
                  backgroundImage: [
                    "linear-gradient(0deg, rgba(209,213,219,0.5) 1px, transparent 1px)",
                    "linear-gradient(90deg, rgba(209,213,219,0.5) 1px, transparent 1px)",
                    "linear-gradient(0deg, rgba(209,213,219,0.25) 1px, transparent 1px)",
                    "linear-gradient(90deg, rgba(209,213,219,0.25) 1px, transparent 1px)",
                    "linear-gradient(35deg, transparent 48%, rgba(190,196,206,0.3) 48%, rgba(190,196,206,0.3) 52%, transparent 52%)",
                    "linear-gradient(-25deg, transparent 46%, rgba(190,196,206,0.25) 46%, rgba(190,196,206,0.25) 54%, transparent 54%)",
                    "linear-gradient(60deg, transparent 47%, rgba(190,196,206,0.2) 47%, rgba(190,196,206,0.2) 53%, transparent 53%)",
                  ].join(", "),
                  backgroundSize: "200px 200px, 200px 200px, 50px 50px, 50px 50px, 300px 300px, 400px 400px, 350px 350px",
                }}
              />
              <div className="relative px-6 py-8 md:px-10">
                <h2 className="text-center text-[32px] font-bold leading-[1.2] text-[#2563EB]">
                  Proudly Serving These Areas
                </h2>
                <details className="group mt-6 overflow-hidden rounded-[var(--radius-card)] border border-border bg-white/90">
                  <summary className="flex h-[58px] cursor-pointer list-none items-center justify-between gap-4 bg-cta-blue px-5 text-sm font-semibold text-white">
                    <span>See All Areas We Are Serving</span>
                    <span className="text-white/80 transition group-open:rotate-180" aria-hidden="true">
                      ⌄
                    </span>
                  </summary>
                  <div className="px-5 py-6">
                    <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                      {sortedLocations.map((location) => (
                        <Link
                          className="text-sm font-medium text-ink hover:underline"
                          href={`/service-area/${location.slug}`}
                          key={location.slug}
                        >
                          {location.cityName}
                        </Link>
                      ))}
                    </div>
                    <div className="mt-6 flex flex-wrap gap-3">
                      <Link className="focus-ring secondary-button" href="/service-area">
                        See All Service Areas
                      </Link>
                    </div>
                  </div>
                </details>
              </div>
            </div>
          </div>
        </section>
        <FAQSection />
      </main>
      <SiteFooter />
    </>
  );
}
