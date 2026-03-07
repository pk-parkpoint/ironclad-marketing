import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { StructuredData } from "@/components/seo/structured-data";
import { ContactForm } from "@/components/layout/contact-form";
import { ReviewsSection } from "@/components/service/review-carousel";
import { ServiceRelatedLinks } from "@/components/service/service-related-links";
import { BLOG_POSTS } from "@/content/blog-posts";
import { LOCATIONS } from "@/content/locations";
import { SERVICES } from "@/content/services";
import { getServiceDetail } from "@/content/service-details";
import { getPublicContactInfo } from "@/lib/contact";
import { buildPageMetadata } from "@/lib/seo";
import {
  buildBreadcrumbItems,
  buildBreadcrumbListSchema,
  buildImageObjectSchema,
  buildLocalBusinessSchema,
  buildServiceSchema,
  buildSchemaStack,
  buildServiceFaqSchema,
} from "@/lib/structured-data";

type RouteParams = {
  slug: string;
};
type RouteProps = {
  params: Promise<RouteParams>;
};

export const dynamicParams = false;

export function generateStaticParams(): RouteParams[] {
  return SERVICES.map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({ params }: RouteProps) {
  const { slug } = await params;
  const service = SERVICES.find((entry) => entry.slug === slug);

  if (!service) {
    return {};
  }

  return buildPageMetadata({
    title: service.titleTag,
    description: service.metaDescription,
    path: `/plumbing/${service.slug}`,
  });
}

/* Map slugs to hero background images */
const HERO_IMAGES: Record<string, string> = {
  repairs: "/media/services/plumbing-repairs.jpg",
  "drain-cleaning": "/media/services/drain-cleaning.jpg",
  "sewer-services": "/media/services/sewer-line-services.jpg",
  "water-heaters": "/media/services/water-heaters.jpg",
  fixtures: "/media/services/fixture-installation.jpg",
  emergency: "/media/services/emergency-plumbing.jpg",
};

const HERO_IMAGE_ALTS: Partial<Record<string, string>> = {
  repairs: "Technician repairing residential plumbing hardware in Austin",
  "drain-cleaning": "Drain cleaning service clearing a household line in Austin",
  "sewer-services": "Sewer camera and service equipment staged for line diagnostics",
  "water-heaters": "Technician servicing a residential water heater system",
  fixtures: "Plumber installing updated plumbing fixtures in a bathroom",
  emergency: "Emergency plumbing technician responding to urgent home service call",
};

function TrustIcon() {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      height="18"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      viewBox="0 0 24 24"
      width="18"
    >
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <path d="M22 4 12 14.01 9 11.01" />
    </svg>
  );
}

export default async function ServiceDetailPage({ params }: RouteProps) {
  const { slug } = await params;
  const service = SERVICES.find((entry) => entry.slug === slug);

  if (!service) {
    notFound();
  }

  const { phoneDisplay, phoneHref } = getPublicContactInfo();
  const detail = getServiceDetail(service);
  const heroImage = HERO_IMAGES[service.slug] || "/media/services/plumbing-repairs.jpg";
  const pagePath = `/plumbing/${service.slug}`;
  const labelText = `Austin ${service.title} Services`.toUpperCase();
  const relatedServices = SERVICES.filter((entry) => entry.slug !== service.slug).slice(0, 4);
  const relatedCities = LOCATIONS.slice(0, 5);
  const relatedGuides = BLOG_POSTS.slice(0, 3);
  const showCommercialCrossover = ["drain-cleaning", "gas-line-services", "repairs", "sewer-services"].includes(
    service.slug,
  );
  const schemas = buildSchemaStack(
    buildBreadcrumbListSchema(buildBreadcrumbItems(pagePath, service.title)),
    buildLocalBusinessSchema(pagePath),
    buildServiceSchema(service),
    buildServiceFaqSchema(service.slug, detail.faqs),
    buildImageObjectSchema({
      alt: `${service.title} service in Austin, Texas`,
      height: 900,
      path: heroImage,
      width: 1600,
    }),
  );

  /* Build sign cards from symptoms (take first 4 for the 2-col grid) */
  const signCards = detail.symptoms.slice(0, 4).map((symptom) => ({
    title: symptom.split(" ").slice(0, 3).join(" "),
    description: symptom,
  }));

  return (
    <>
      <SiteHeader />
      <StructuredData data={schemas} id={`ld-service-${service.slug}`} />
      <main>
        <section className="bg-soft-background pt-6">
          <div className="container-shell">
            <Breadcrumbs
              currentPath={pagePath}
              items={[
                { label: "Home", href: "/" },
                { label: "Plumbing", href: "/plumbing" },
                { label: service.title },
              ]}
            />
          </div>
        </section>

        {/* ── Section 1: Photo Hero ── */}
        <section className="relative isolate min-h-[480px] overflow-hidden md:min-h-[532px]">
          <Image
            alt={HERO_IMAGE_ALTS[service.slug] ?? `${service.title} in Austin, Texas`}
            className="object-cover"
            fill
            priority
            sizes="100vw"
            src={heroImage}
          />
          <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(0,37,89,0.82)_0%,rgba(0,37,89,0.62)_100%)]" />

          <div className="relative mx-auto flex min-h-[480px] w-full max-w-[1280px] items-center px-6 py-12 md:min-h-[532px] md:py-16">
            <div className="max-w-[700px]">
              <span className="mb-4 inline-block border border-white/50 px-3 py-1.5 text-[13px] font-bold uppercase tracking-[0.12em] text-white">
                {labelText}
              </span>
              <h1
                className="text-[36px] font-bold leading-[1.15] tracking-[-0.02em] text-white md:text-[48px]"
                style={{ textShadow: "0 2px 8px rgba(0,0,0,0.3)" }}
              >
                {service.h1}
              </h1>
              <p className="mt-4 max-w-[560px] text-[16px] leading-[1.7] text-white/85 md:text-[17px]">
                {detail.heroDescription}
              </p>
              <div className="mt-6 flex flex-wrap items-center gap-4 text-[14px] font-semibold text-white/90">
                <span className="flex items-center gap-2">
                  <TrustIcon />
                  Licensed &amp; Insured
                </span>
                <span className="flex items-center gap-2">
                  <TrustIcon />
                  Upfront Pricing
                </span>
                <span className="flex items-center gap-2">
                  <TrustIcon />
                  5-Star Google Reviews
                </span>
              </div>

              <div className="mt-10 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
                <a
                  className="focus-ring inline-flex items-center justify-center rounded-full border-2 border-transparent bg-[#D03E04] px-7 py-[14px] text-[16px] font-semibold text-white transition-colors hover:border-[#D03E04] hover:bg-white hover:text-[#D03E04] hover:no-underline"
                  data-track-intent="phone"
                  href={phoneHref}
                >
                  Call {phoneDisplay}
                </a>
                <Link
                  className="focus-ring inline-flex items-center justify-center rounded-full border-2 border-white bg-transparent px-7 py-[14px] text-[16px] font-semibold text-white transition-colors hover:bg-white hover:text-[#1E2A38] hover:no-underline"
                  data-track-intent="book"
                  href="/book"
                >
                  Schedule Online
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ── Section 2: Content + Contact Form ── */}
        <section className="bg-white py-16 md:py-20">
          <div className="mx-auto grid w-full max-w-[1280px] gap-12 px-6 lg:grid-cols-[1fr_400px]">
            {/* Left column — service content */}
            <div>
              <h2 className="text-[32px] font-bold leading-[1.2] text-[#111827]">
                {detail.symptomsHeading}
              </h2>
              <p className="mt-4 text-[16px] leading-[1.7] text-[#374151]">
                We see these symptoms most often in Austin homes and use them to scope a repair plan that
                solves root cause, not just the immediate failure.
              </p>

              <div className="mt-10 grid gap-8 sm:grid-cols-2">
                {signCards.map((sign) => (
                  <div key={sign.title}>
                    <h3 className="text-[18px] font-bold uppercase text-[#2563EB]">
                      {sign.title}
                    </h3>
                    <p className="mt-2 text-[15px] leading-[1.65] text-[#374151]">
                      {sign.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right column — contact form (sticky) */}
            <div className="lg:sticky lg:top-[160px] lg:self-start">
              <div className="rounded-lg border border-[#E5E7EB] bg-white p-8 shadow-[0_4px_24px_rgba(0,0,0,0.08)]">
                <h3 className="text-center text-[28px] font-bold leading-[1.2] text-[#2563EB]">
                  Get In Touch Today!
                </h3>
                <ContactForm
                  idPrefix={`service-${service.slug}`}
                  pageType="service"
                  serviceInterest={service.title}
                  urgent={service.slug === "emergency"}
                />
              </div>
            </div>
          </div>
        </section>

        <ServiceRelatedLinks
          relatedCities={relatedCities}
          relatedGuides={relatedGuides}
          relatedServices={relatedServices}
          showCommercialCrossover={showCommercialCrossover}
        />

        {/* ── Section 3: Reviews ── */}
        <ReviewsSection />
      </main>
      <SiteFooter />
    </>
  );
}
