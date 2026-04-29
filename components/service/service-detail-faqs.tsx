import { FaqAccordion, type FaqAccordionItem } from "@/components/service/faq-accordion";

type ServiceDetailFaqsProps = {
  items: FaqAccordionItem[];
  serviceTitle: string;
};

export function ServiceDetailFaqs({ items, serviceTitle }: ServiceDetailFaqsProps) {
  return (
    <section className="section-block bg-soft-background">
      <div className="container-shell">
        <h2 className="h2-display">Common Questions About {serviceTitle}</h2>
        <div className="mt-6">
          <FaqAccordion
            cta={{
              description: "Need a direct answer before booking? Send the issue and we will route it quickly.",
              heading: "Not sure what you need?",
              href: "/contact",
              label: "Ask Ironclad",
            }}
            ctaEvery={2}
            items={items}
            singleOpen
          />
        </div>
      </div>
    </section>
  );
}
