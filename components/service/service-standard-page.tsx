import Image from "next/image";
import Link from "next/link";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { ContactForm } from "@/components/layout/contact-form";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { QuickAnswer } from "@/components/seo/quick-answer";
import { ReviewsSection } from "@/components/service/review-carousel";
import { ServiceDetailFaqs } from "@/components/service/service-detail-faqs";
import { getServiceHeroAlt, getServiceHeroImage } from "@/components/service/service-hero-images";
import { ServiceRelatedLinks } from "@/components/service/service-related-links";
import { TrustIcon } from "@/components/service/trust-icon";
import { BLOG_POSTS } from "@/content/blog-posts";
import { LOCATIONS } from "@/content/locations";
import type { ServiceDetail } from "@/content/service-details";
import { SERVICES, type ServiceEntry } from "@/content/services";

type ServiceStandardPageProps = {
  detail: ServiceDetail;
  phoneDisplay: string;
  phoneHref: string;
  service: ServiceEntry;
};

export function ServiceStandardPage({ detail, phoneDisplay, phoneHref, service }: ServiceStandardPageProps) {
  const heroImage = getServiceHeroImage(service.slug);
  const pagePath = `/plumbing/${service.slug}`;
  const labelText = `Austin ${service.title} Services`.toUpperCase();
  const relatedServices = SERVICES.filter((entry) => entry.slug !== service.slug).slice(0, 4);
  const relatedCities = LOCATIONS.slice(0, 5);
  const relatedGuides = BLOG_POSTS.slice(0, 3);
  const showCommercialCrossover = ["drain-cleaning", "gas-line-services", "repairs", "sewer-services"].includes(
    service.slug,
  );
  const signCards = detail.symptoms.slice(0, 4).map((symptom) => ({
    title: symptom.split(" ").slice(0, 3).join(" "),
    description: symptom,
  }));

  return (
    <>
      <SiteHeader />
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
            <QuickAnswer className="mt-6">
              Ironclad provides {service.title.toLowerCase()} in Greater Austin with diagnosis first, written pricing before
              work starts, and warranty-backed workmanship. We scope the cause, explain practical options, complete tested
              work, and document next steps so homeowners know exactly what was done.
            </QuickAnswer>
          </div>
        </section>

        <section className="relative isolate min-h-[480px] overflow-hidden md:min-h-[532px]">
          <Image
            alt={getServiceHeroAlt(service.slug, service.title)}
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
              <p className="mt-4 max-w-[560px] text-[16px] leading-[1.7] text-white/85 md:text-[17px]" data-speakable="hero">
                {detail.heroDescription}
              </p>
              <div className="mt-6 flex flex-wrap items-center gap-4 text-[14px] font-semibold text-white/90" data-speakable="trust">
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
                  className="focus-ring inline-flex items-center justify-center rounded-full border-2 border-transparent bg-[#D03E04] px-7 py-[14px] text-[16px] font-semibold text-white shadow-[0_16px_32px_rgba(0,0,0,0.35),0_4px_10px_rgba(0,0,0,0.22)] transition-[background-color,border-color,color,box-shadow,transform] hover:-translate-y-0.5 hover:border-[#D03E04] hover:bg-white hover:text-[#D03E04] hover:shadow-[0_20px_40px_rgba(0,0,0,0.42),0_6px_14px_rgba(0,0,0,0.26)] hover:no-underline"
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
                  Schedule Now
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white py-16 md:py-20">
          <div className="mx-auto grid w-full max-w-[1280px] gap-12 px-6 lg:grid-cols-[1fr_400px]">
            <div>
              <h2 className="text-[32px] font-bold leading-[1.2] text-[#111827]">{detail.symptomsHeading}</h2>
              <p className="mt-4 text-[16px] leading-[1.7] text-[#374151]">
                We see these symptoms most often in Austin homes and use them to scope a repair plan that solves root cause,
                not just the immediate failure.
              </p>
              <div className="mt-10 grid gap-8 sm:grid-cols-2">
                {signCards.map((sign) => (
                  <div key={sign.title}>
                    <h3 className="text-[18px] font-bold uppercase text-[#2563EB]">{sign.title}</h3>
                    <p className="mt-2 text-[15px] leading-[1.65] text-[#374151]">{sign.description}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:sticky lg:top-[160px] lg:self-start">
              <div className="rounded-lg border border-[#E5E7EB] bg-white p-8 shadow-[0_4px_24px_rgba(0,0,0,0.08)]">
                <h3 className="text-center text-[28px] font-bold leading-[1.2] text-[#2563EB]">Get In Touch Today!</h3>
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

        <section className="bg-[#F9FAFB] py-16 md:py-20">
          <div className="mx-auto w-full max-w-[1280px] px-6">
            <h2 className="text-center text-[32px] font-bold leading-[1.2] text-[#111827]">{detail.processHeading}</h2>
            <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {detail.processSteps.slice(0, 4).map((step) => (
                <div key={step.number} className="text-center">
                  <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#2563EB] text-[20px] font-bold text-white">
                    {step.number}
                  </span>
                  <h3 className="mt-4 text-[18px] font-bold text-[#111827]">{step.title}</h3>
                  <p className="mt-2 text-[15px] leading-[1.65] text-[#374151]" data-speakable="service-desc">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <ServiceRelatedLinks
          relatedCities={relatedCities}
          relatedGuides={relatedGuides}
          relatedServices={relatedServices}
          showCommercialCrossover={showCommercialCrossover}
        />
        <ReviewsSection />
        <ServiceDetailFaqs items={detail.faqs} serviceTitle={service.title} />
      </main>
      <SiteFooter />
    </>
  );
}
