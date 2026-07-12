import Link from "next/link";
import { ArrowRight, Phone } from "lucide-react";
import type { LocalService, Pair } from "@/content/local-pages";
import { getServiceHref } from "@/content/local-pages";
import { SectionHeader } from "./local-section-header";

export function LocalKnowledgeSection({
  body,
  name,
  traits,
}: {
  name: string;
  body: string;
  traits: Pair[];
}) {
  return (
    <section className="local-band local-band-knowledge">
      <div className="local-inner local-split">
        <div>
          <SectionHeader kicker="Local Knowledge" title={`What We Know About ${name} Homes`} lead={body} />
        </div>
        <div className="local-card local-trait-card">
          {traits.map(([label, value]) => (
            <div className="local-trait-row" key={label}>
              <p className="local-trait-kicker">{label}</p>
              <p className="local-trait-value">{value}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function NumberedRowsSection({
  items,
  lead,
  phoneDisplay,
  phoneHref,
  title,
}: {
  title: string;
  lead: string;
  items: Pair[];
  phoneDisplay: string;
  phoneHref: string;
}) {
  return (
    <section className="local-band local-band-issues">
      <div className="local-inner">
        <SectionHeader kicker="Common Issues" title={title} lead={lead} />
        <div className="mt-8">
          {items.map(([itemTitle, body], index) => (
            <div className="local-row" key={itemTitle}>
              <div className="local-row-number">{String(index + 1).padStart(2, "0")}</div>
              <div>
                <h3 className="local-row-title">{itemTitle}</h3>
                <p className="local-row-body">{body}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="local-signs-callout">
          <span className="local-callout-mark" aria-hidden="true">
            <Phone className="local-icon-sticky" />
          </span>
          <div className="local-callout-copy">
            <h3 className="local-callout-title">Not sure what is going on?</h3>
            <p className="local-callout-body">Describe it and we will tell you what it takes to fix, free.</p>
          </div>
          <a className="local-button local-button-call local-callout-button" data-track-intent="phone" href={phoneHref}>
            Call {phoneDisplay}
          </a>
        </div>
      </div>
    </section>
  );
}

export function ServicesSection({
  cityName,
  services,
}: {
  cityName: string;
  services: LocalService[];
}) {
  return (
    <section className="local-band local-band-services">
      <div className="local-inner">
        <SectionHeader
          kicker="Popular Services"
          title={`Most-Requested Services in ${cityName}`}
          lead={`The repairs and upgrades ${cityName} homeowners call us for most, all backed by upfront pricing and a written warranty.`}
        />
        <div className="local-grid local-grid-3">
          {services.map((service) => (
            <Link className="local-card local-link-card" href={getServiceHref(service)} key={service[0]}>
              <span className="local-card-kicker">Service</span>
              <strong className="local-service-title">{service[0]}</strong>
              <span className="local-card-body">{service[1]}</span>
              <span className="local-card-action">
                View service <ArrowRight className="local-icon-sticky" />
              </span>
            </Link>
          ))}
        </div>
        <Link className="local-services-more" href="/plumbing">
          View all plumbing services <ArrowRight className="local-icon-sticky" />
        </Link>
      </div>
    </section>
  );
}

export function ProcessSection({ cityName }: { cityName: string }) {
  const steps = [
    ["Book in Minutes", `Call, text, or schedule online. Tell us what is happening at your ${cityName} home.`],
    ["Same-Day Dispatch", `A licensed Ironclad plumber heads to your ${cityName} address and calls ahead if timing changes.`],
    ["Upfront Diagnosis", "We inspect, explain the fix in plain language, and give a flat price before work begins."],
    ["Fixed & Guaranteed", "We complete the repair, clean up, and back the job in writing."],
  ];

  return (
    <section className="local-band local-band-process">
      <div className="local-inner">
        <SectionHeader kicker="Process" title={`Your ${cityName} Service, Step by Step`} />
        <div className="local-grid local-grid-4">
          {steps.map(([title, body], index) => (
            <div key={title}>
              <p className="local-process-number">{String(index + 1).padStart(2, "0")}</p>
              <h3 className="local-process-title">{title}</h3>
              <p className="local-process-body">{body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
