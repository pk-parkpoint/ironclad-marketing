import { notFound } from "next/navigation";
import Link from "next/link";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { CtaBanner } from "@/components/layout/cta-banner";
import { Hero } from "@/components/layout/hero";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { ContactForm } from "@/components/layout/contact-form";
import { StructuredData } from "@/components/seo/structured-data";
import { CityRelatedGuides } from "@/components/service/city-related-guides";
import { FaqAccordion } from "@/components/service/faq-accordion";
import { LocalProof } from "@/components/service/local-proof";
import { ServiceGridTile } from "@/components/service/service-grid-tile";
import { BLOG_POSTS } from "@/content/blog-posts";
import { getLocationDetail } from "@/content/location-details";
import { LOCATIONS } from "@/content/locations";
import { getLocalProofData } from "@/content/local-proof";
import { SERVICES } from "@/content/services";
import { getPublicContactInfo } from "@/lib/contact";
import { buildPageMetadata } from "@/lib/seo";
import {
  buildBreadcrumbItems,
  buildBreadcrumbListSchema,
  buildCityFaqSchema,
  buildLocalBusinessSchema,
  buildLocationServiceSchema,
  buildSchemaStack,
} from "@/lib/structured-data";

type RouteParams = {
  slug: string;
};
type RouteProps = {
  params: Promise<RouteParams>;
};

export const dynamicParams = false;

export function generateStaticParams(): RouteParams[] {
  return LOCATIONS.map((location) => ({ slug: location.slug }));
}

export async function generateMetadata({ params }: RouteProps) {
  const { slug } = await params;
  const location = LOCATIONS.find((entry) => entry.slug === slug);

  if (!location) {
    return {};
  }

  return buildPageMetadata({
    title: location.titleTag,
    description: location.metaDescription,
    path: `/service-area/${location.slug}`,
  });
}

function getNearbyLocations(currentSlug: string, count = 6) {
  const currentIndex = LOCATIONS.findIndex((entry) => entry.slug === currentSlug);
  if (currentIndex < 0) {
    return LOCATIONS.slice(0, count);
  }

  const rotated = [...LOCATIONS.slice(currentIndex + 1), ...LOCATIONS.slice(0, currentIndex)];
  return rotated.filter((entry) => entry.slug !== currentSlug).slice(0, count);
}

export default async function LocationDetailPage({ params }: RouteProps) {
  const { slug } = await params;
  const location = LOCATIONS.find((entry) => entry.slug === slug);
  const contactInfo = getPublicContactInfo();

  if (!location) {
    notFound();
  }

  const detail = getLocationDetail(location);
  const pagePath = `/service-area/${location.slug}`;
  const schemas = buildSchemaStack(
    buildBreadcrumbListSchema(buildBreadcrumbItems(pagePath, location.cityName)),
    buildLocalBusinessSchema(pagePath),
    buildLocationServiceSchema(location),
    buildCityFaqSchema(location.slug, detail.faqs),
  );
  const featuredServices = detail.featuredServiceSlugs
    .map((serviceSlug) => SERVICES.find((service) => service.slug === serviceSlug))
    .filter((service): service is (typeof SERVICES)[number] => Boolean(service));
  const nearbyLocations = getNearbyLocations(location.slug, 6);
  const localProof = getLocalProofData(location.slug, location.cityName);
  const relatedGuides = BLOG_POSTS.slice(0, 2);

  return (
    <>
      <SiteHeader />
      <StructuredData data={schemas} id={`ld-location-${location.slug}`} />
      <main>
        <Hero
          actions={[
            { href: `/book?location=${location.slug}`, label: `Book in ${location.cityName}`, variant: "primary" },
            { href: contactInfo.phoneHref, label: `Call ${contactInfo.phoneDisplay}`, variant: "secondary" },
            { href: contactInfo.smsHref, label: "Text Us", variant: "text" },
          ]}
          alignment="left"
          backgroundType="gradient"
          eyebrow="Service Area"
          heading={location.h1}
          locationBadge={{ text: `${location.cityName}, Texas` }}
          subtitle={detail.heroDescription}
        />

        <section className="bg-soft-background pt-6">
          <div className="container-shell">
            <Breadcrumbs
              currentPath={`/service-area/${location.slug}`}
              items={[
                { label: "Home", href: "/" },
                { label: "Service Areas", href: "/service-area" },
                { label: location.cityName },
              ]}
            />
          </div>
        </section>

        <section className="section-block">
          <div className="container-shell grid gap-8 lg:grid-cols-[3fr_2fr] lg:gap-10">
            <div>
              <h2 className="h2-display">{detail.overviewHeading}</h2>
              <div className="mt-5 space-y-4">
                {detail.overviewParagraphs.map((paragraph) => (
                  <p key={paragraph} className="text-sm text-body md:text-base">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
            <div className="card-shell bg-soft-background p-6 md:p-7">
              <h3 className="text-xl font-semibold text-ink">{detail.commonIssuesHeading}</h3>
              <ul className="mt-4 m-0 list-none space-y-3 p-0">
                {detail.commonIssues.map((issue) => (
                  <li key={issue} className="text-sm text-body md:text-base">
                    {issue}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className="section-block bg-soft-background">
          <div className="container-shell">
            <h2 className="h2-display">{detail.featuredServicesHeading}</h2>
            <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {featuredServices.map((service) => (
                <ServiceGridTile
                  description={service.metaDescription}
                  href={`/plumbing/${service.slug}`}
                  key={service.slug}
                  title={service.title}
                  variant="card"
                />
              ))}
            </div>
          </div>
        </section>

        <section className="section-block">
          <div className="container-shell grid gap-8 lg:grid-cols-2 lg:gap-10">
            <div className="card-shell p-6 md:p-7">
              <h2 className="h2-display text-[clamp(1.5rem,3vw,2rem)]">{detail.neighborhoodHeading}</h2>
              <p className="mt-4 text-sm text-body md:text-base">{detail.neighborhoodBody}</p>
              <ul className="mt-5 m-0 list-none space-y-2 p-0">
                {detail.neighborhoods.map((neighborhood) => (
                  <li key={neighborhood} className="text-sm text-muted md:text-base">
                    {neighborhood}
                  </li>
                ))}
              </ul>
            </div>
            <div className="card-shell p-6 md:p-7">
              <h2 className="h2-display text-[clamp(1.5rem,3vw,2rem)]">{detail.homeownerTipsHeading}</h2>
              <ul className="mt-5 m-0 list-none space-y-3 p-0">
                {detail.homeownerTips.map((tip) => (
                  <li key={tip} className="text-sm text-body md:text-base">
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className="section-block">
          <div className="container-shell">
            <h2 className="h2-display">{detail.processHeading}</h2>
            <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {detail.processSteps.map((step) => (
                <div key={step.number} className="card-shell p-6 md:p-7">
                  <p className="text-sm font-semibold text-cta-blue">Step {step.number}</p>
                  <p className="mt-2 text-lg font-semibold text-ink">{step.title}</p>
                  <p className="mt-2 text-sm text-muted md:text-base">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="section-block bg-soft-background">
          <div className="container-shell">
            <h2 className="h2-display">Why Homeowners in {location.cityName} Choose Ironclad</h2>
            <div className="mt-6 grid gap-4 md:grid-cols-3">
              {detail.trustPoints.map((point) => (
                <div key={point.title} className="card-shell bg-background p-6 md:p-7">
                  <p className="text-base font-semibold text-ink">{point.title}</p>
                  <p className="mt-2 text-sm text-muted md:text-base">{point.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <LocalProof cityName={location.cityName} data={localProof} />

        <section className="section-block">
          <div className="container-shell">
            <h2 className="h2-display">FAQ for {location.cityName}</h2>
            <div className="mt-6">
              <FaqAccordion
                cta={{
                  description: `Need help now in ${location.cityName}? Call or text our team for the next available appointment.`,
                  heading: "Need immediate help?",
                  href: "/contact",
                  label: "Contact Ironclad",
                }}
                ctaEvery={2}
                items={detail.faqs}
                singleOpen
              />
            </div>
          </div>
        </section>

        <CityRelatedGuides cityName={location.cityName} guides={relatedGuides} />

        <section className="section-block">
          <div className="container-shell">
            <div className="card-shell p-6 md:p-7">
              <h2 className="h2-display">Request Service in {location.cityName}</h2>
              <p className="mt-3 text-sm text-muted md:text-base">
                Share your issue and preferred timing. We route city requests with your service area attached.
              </p>
              <ContactForm idPrefix={`city-${location.slug}`} pageType="city" serviceArea={location.cityName} />
            </div>
          </div>
        </section>

        <section className="section-block bg-soft-background">
          <div className="container-shell">
            <h2 className="h2-display">Nearby Service Areas</h2>
            <div className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {nearbyLocations.map((nearbyLocation) => (
                <Link
                  className="focus-ring card-shell block p-5 transition-colors hover:border-cta-blue hover:no-underline"
                  href={`/service-area/${nearbyLocation.slug}`}
                  key={nearbyLocation.slug}
                >
                  <p className="text-base font-semibold text-ink">{nearbyLocation.cityName}</p>
                  <p className="mt-1 text-sm text-muted">Plumbing services in {nearbyLocation.cityName}, Texas.</p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <CtaBanner
          actions={[
            { href: `/book?location=${location.slug}`, label: `Book in ${location.cityName}`, variant: "primary" },
            { href: contactInfo.phoneHref, label: `Call ${contactInfo.phoneDisplay}`, variant: "secondary" },
            { href: contactInfo.smsHref, label: "Text Us", variant: "text" },
          ]}
          heading={`Need a plumber in ${location.cityName}?`}
          subtitle="Book online in under a minute or contact our team directly by phone or text."
          variant="dark"
        />
      </main>
      <SiteFooter />
    </>
  );
}
