import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { CtaBanner } from "@/components/layout/cta-banner";
import { Hero } from "@/components/layout/hero";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { FaqAccordion } from "@/components/service/faq-accordion";
import { ServiceGridTile } from "@/components/service/service-grid-tile";
import { FAQ_ENTRIES } from "@/content/faqs";
import { SERVICES } from "@/content/services";
import { getPublicContactInfo } from "@/lib/contact";
import { buildPageMetadata } from "@/lib/seo";

export const metadata = buildPageMetadata({
  title: "Plumbing Services in Austin, TX | Ironclad Plumbing",
  description:
    "Full-service plumbing in Greater Austin with upfront pricing, licensed technicians, and written workmanship warranties.",
  path: "/plumbing",
  ogTemplate: "service",
});

const SERVICE_HUB_FAQS = FAQ_ENTRIES.filter((entry) =>
  ["general", "pricing", "scheduling", "water-heaters", "drains-sewers", "leaks"].includes(entry.category),
).slice(0, 6);

export default function PlumbingHubPage() {
  const contactInfo = getPublicContactInfo();

  return (
    <>
      <SiteHeader />
      <main>
        <Hero
          actions={[
            { href: "/book", label: "Book Plumbing Service", variant: "primary" },
            { href: contactInfo.phoneHref, label: `Call ${contactInfo.phoneDisplay}`, variant: "secondary" },
            { href: contactInfo.smsHref, label: "Text Us", variant: "text" },
          ]}
          alignment="left"
          backgroundType="gradient"
          eyebrow="Plumbing Hub"
          heading="Complete Plumbing Services Across Greater Austin"
          subtitle="From emergency repairs to full system upgrades, Ironclad delivers licensed plumbing with clear pricing, clean workmanship, and a written warranty."
          trustChips={["Same-Day Availability", "Upfront Pricing", "Warranty-Backed Work"]}
        />

        <section className="bg-soft-background pt-6">
          <div className="container-shell">
            <Breadcrumbs
              currentPath="/plumbing"
              items={[
                { label: "Home", href: "/" },
                { label: "Plumbing" },
              ]}
            />
          </div>
        </section>

        <section className="section-block">
          <div className="container-shell grid gap-8 lg:grid-cols-[3fr_2fr] lg:gap-10">
            <div>
              <h2 className="h2-display">What You Can Expect on Every Plumbing Visit</h2>
              <div className="mt-5 space-y-4">
                <p className="text-sm text-body md:text-base">
                  Every service starts with diagnosis, not assumptions. We identify root cause, explain options in plain
                  language, and provide written pricing before work begins.
                </p>
                <p className="text-sm text-body md:text-base">
                  Whether you need a minor repair, a major replacement, or emergency response, our team follows the same
                  standard: arrive in your window, protect your home, complete tested work, and leave clear documentation.
                </p>
              </div>
            </div>
            <div className="card-shell bg-soft-background p-6 md:p-7">
              <h3 className="text-xl font-semibold text-ink">Our Service Standard</h3>
              <ul className="mt-4 m-0 list-none space-y-3 p-0">
                <li className="text-sm text-body md:text-base">Licensed, insured, and code-aligned workmanship</li>
                <li className="text-sm text-body md:text-base">Written estimates and option-based recommendations</li>
                <li className="text-sm text-body md:text-base">Photo-ready cleanup and post-work system testing</li>
                <li className="text-sm text-body md:text-base">Warranty details provided before closeout</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="section-block bg-soft-background">
          <div className="container-shell">
            <h2 className="h2-display">All Plumbing Services</h2>
            <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {SERVICES.map((service) => (
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
            <h2 className="h2-display">Austin-Specific Plumbing Realities We Plan For</h2>
            <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <div className="card-shell p-6">
                <p className="text-base font-semibold text-ink">Hard Water Scale</p>
                <p className="mt-2 text-sm text-muted md:text-base">
                  Mineral-heavy water impacts heaters, fixtures, and flow over time. We build preventive treatment into
                  recommendations where it delivers value.
                </p>
              </div>
              <div className="card-shell p-6">
                <p className="text-base font-semibold text-ink">Expansive Clay Soil</p>
                <p className="mt-2 text-sm text-muted md:text-base">
                  Soil movement increases slab and underground line stress. Leak detection and sewer diagnostics are scoped
                  with these regional conditions in mind.
                </p>
              </div>
              <div className="card-shell p-6">
                <p className="text-base font-semibold text-ink">Rapid Growth and Remodels</p>
                <p className="mt-2 text-sm text-muted md:text-base">
                  Homes are being expanded and reconfigured across the metro. We verify capacity, pressure, and fixture
                  compatibility before upgrades move forward.
                </p>
              </div>
              <div className="card-shell p-6">
                <p className="text-base font-semibold text-ink">Extreme Weather Swings</p>
                <p className="mt-2 text-sm text-muted md:text-base">
                  Heat and freeze cycles expose weak points quickly. We include risk-reduction guidance so your plumbing is
                  better prepared year-round.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="section-block">
          <div className="container-shell">
            <h2 className="h2-display">Plumbing Service FAQs</h2>
            <div className="mt-6">
              <FaqAccordion
                cta={{
                  description: "Need help selecting the right service? Our team can route you quickly.",
                  heading: "Not sure which service you need?",
                  href: "/contact",
                  label: "Contact Ironclad",
                }}
                ctaEvery={3}
                items={SERVICE_HUB_FAQS.map((faq) => ({ question: faq.question, answer: faq.answer }))}
                singleOpen
              />
            </div>
          </div>
        </section>

        <CtaBanner
          actions={[
            { href: "/book", label: "Book Plumbing Service", variant: "primary" },
            { href: contactInfo.phoneHref, label: `Call ${contactInfo.phoneDisplay}`, variant: "secondary" },
            { href: contactInfo.smsHref, label: "Text Us", variant: "text" },
          ]}
          heading="Need plumbing help now?"
          subtitle="Book in under a minute or connect with our team by phone or text."
          variant="dark"
        />
      </main>
      <SiteFooter />
    </>
  );
}
