import Link from "next/link";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { CtaBanner } from "@/components/layout/cta-banner";
import { Hero } from "@/components/layout/hero";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { QuickAnswer } from "@/components/seo/quick-answer";
import { StructuredData } from "@/components/seo/structured-data";
import { FaqAccordion } from "@/components/service/faq-accordion";
import { ServiceGridTile } from "@/components/service/service-grid-tile";
import { LOCATIONS } from "@/content/locations";
import { SERVICES } from "@/content/services";
import { getPublicContactInfo } from "@/lib/contact";
import { buildPageMetadata } from "@/lib/seo";
import {
  buildBreadcrumbItems,
  buildBreadcrumbListSchema,
  buildFaqPageSchema,
  buildSchemaStack,
} from "@/lib/structured-data";

export const metadata = buildPageMetadata({
  title: "Areas We Serve | Ironclad Plumbing - Greater Austin, TX",
  description:
    "Ironclad Plumbing serves Austin and surrounding communities with licensed service, upfront pricing, and reliable scheduling.",
  path: "/service-area",
  ogTemplate: "location",
});

const SERVICE_AREA_FAQS = [
  {
    question: "Do you offer same-day plumbing in all service areas?",
    answer:
      "Same-day windows are available in most of our service area, based on technician load and route demand. We prioritize urgent situations and provide the clearest possible ETA when you contact us.",
  },
  {
    question: "Can I book online if I live outside Austin city limits?",
    answer:
      "Yes. Use the online booking form and include your city and issue details. If your property is near the edge of our coverage zone, our team will confirm availability and routing immediately.",
  },
  {
    question: "Do your prices change by city?",
    answer:
      "Pricing is driven by job scope and complexity, not by zip code. We provide written estimates before work begins so you can approve confidently.",
  },
  {
    question: "What if I am between two listed service areas?",
    answer:
      "Contact us anyway. We regularly serve neighborhoods between listed cities and can confirm scheduling options based on your exact address.",
  },
];

export default function ServiceAreaHubPage() {
  const contactInfo = getPublicContactInfo();
  const schemas = buildSchemaStack(
    buildBreadcrumbListSchema(buildBreadcrumbItems("/service-area", "Service Areas")),
    buildFaqPageSchema(SERVICE_AREA_FAQS),
  );

  return (
    <>
      <SiteHeader />
      <StructuredData data={schemas} id="ld-service-area-hub" />
      <main>
        <Hero
          actions={[
            { href: "/book", label: "Book Service", variant: "primary" },
            { href: contactInfo.phoneHref, label: `Call ${contactInfo.phoneDisplay}`, variant: "secondary" },
            { href: contactInfo.smsHref, label: "Text Us", variant: "text" },
          ]}
          alignment="left"
          backgroundType="gradient"
          eyebrow="Service Areas"
          heading="Local Plumbing Service Across Greater Austin"
          subtitle="Ironclad supports homeowners across Travis, Williamson, and Hays county corridors with fast dispatch, clear communication, and warranty-backed work."
          trustChips={["19+ Service Area Pages", "Emergency Availability", "Licensed and Insured"]}
        />

        <section className="bg-soft-background pt-6">
          <div className="container-shell">
            <Breadcrumbs
              currentPath="/service-area"
              items={[
                { label: "Home", href: "/" },
                { label: "Service Areas" },
              ]}
            />
            <QuickAnswer className="mt-6">
              Ironclad Plumbing serves Austin and surrounding communities across Travis, Williamson, and Hays county
              corridors. Homeowners get the same licensed technicians, written pricing, warranty-backed work, and clear
              dispatch communication whether the job is in Austin, Round Rock, Georgetown, Cedar Park, or nearby cities.
            </QuickAnswer>
          </div>
        </section>

        <section className="section-block">
          <div className="container-shell grid gap-8 lg:grid-cols-[3fr_2fr] lg:gap-10">
            <div>
              <h2 className="h2-display">One Standard Across Every City We Serve</h2>
              <div className="mt-5 space-y-4">
                <p className="text-sm text-body md:text-base">
                  Every location page is backed by the same operating model: licensed technicians, upfront written
                  pricing, jobsite respect, and fully tested work before closeout.
                </p>
                <p className="text-sm text-body md:text-base">
                  While each city has unique infrastructure and water-quality patterns, our process stays consistent so
                  homeowners always know what to expect from booking through completion.
                </p>
              </div>
            </div>
            <div className="card-shell bg-soft-background p-6 md:p-7">
              <h3 className="text-xl font-semibold text-ink">Coverage Highlights</h3>
              <ul className="mt-4 m-0 list-none space-y-3 p-0">
                <li className="text-sm text-body md:text-base">Austin core and surrounding suburbs</li>
                <li className="text-sm text-body md:text-base">Northern growth corridor up through Georgetown and beyond</li>
                <li className="text-sm text-body md:text-base">Western and Hill Country communities</li>
                <li className="text-sm text-body md:text-base">Southern route coverage including Buda and Kyle</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="section-block bg-soft-background">
          <div className="container-shell">
            <h2 className="h2-display">City-by-City Service Area Pages</h2>
            <div className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {LOCATIONS.map((location) => (
                <Link
                  className="focus-ring card-shell block p-5 transition-colors hover:border-cta-blue hover:no-underline"
                  href={`/service-area/${location.slug}`}
                  key={location.slug}
                >
                  <p className="text-base font-semibold text-ink">{location.cityName}</p>
                  <p className="mt-1 text-sm text-muted">{location.metaDescription}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="section-block">
          <div className="container-shell">
            <h2 className="h2-display">Most Requested Services Across Our Service Area</h2>
            <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {SERVICES.slice(0, 8).map((service) => (
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
          <div className="container-shell">
            <h2 className="h2-display">Service Area FAQs</h2>
            <div className="mt-6">
              <FaqAccordion
                cta={{
                  description: "We can confirm route coverage and booking windows in under a minute.",
                  heading: "Need to confirm your address?",
                  href: "/contact",
                  label: "Contact Ironclad",
                }}
                ctaEvery={2}
                items={SERVICE_AREA_FAQS}
                singleOpen
              />
            </div>
          </div>
        </section>

        <CtaBanner
          actions={[
            { href: "/book", label: "Book Service", variant: "primary" },
            { href: contactInfo.phoneHref, label: `Call ${contactInfo.phoneDisplay}`, variant: "secondary" },
            { href: contactInfo.smsHref, label: "Text Us", variant: "text" },
          ]}
          heading="Need service in your city?"
          subtitle="Choose your city page for local details or book now and we will route your request immediately."
          variant="dark"
        />
      </main>
      <SiteFooter />
    </>
  );
}
