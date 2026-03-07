import { ContactForm } from "@/components/layout/contact-form";
import type { MarketingPageContent } from "@/content/marketing-page-content";

type MarketingPageContentProps = {
  content: MarketingPageContent;
  path: string;
};

export function MarketingPageContent({ content, path }: MarketingPageContentProps) {
  return (
    <div className="space-y-8">
      <p className="body-large max-w-[var(--max-readable-width)] text-muted">{content.intro}</p>

      {content.sections.map((section) => (
        <section className="space-y-4" key={section.heading}>
          <h2 className="text-2xl font-semibold text-ink">{section.heading}</h2>
          {section.paragraphs.map((paragraph) => (
            <p className="text-sm text-body md:text-base" key={paragraph}>
              {paragraph}
            </p>
          ))}
          {section.bullets ? (
            <ul className="m-0 list-none space-y-2 p-0">
              {section.bullets.map((bullet) => (
                <li className="text-sm text-body md:text-base" key={bullet}>
                  {bullet}
                </li>
              ))}
            </ul>
          ) : null}
        </section>
      ))}

      {content.showContactForm ? (
        <section className="rounded-[var(--radius-card)] border border-border bg-soft-background p-6">
          <h2 className="text-2xl font-semibold text-ink">Send a Request</h2>
          <p className="mt-2 text-sm text-muted md:text-base">
            Share your details and we will follow up as quickly as possible.
          </p>
          <ContactForm idPrefix={`marketing-${path.replace(/\//g, "-")}`} pageType={content.pageType} />
        </section>
      ) : null}

      <section className="rounded-[var(--radius-card)] border border-border bg-soft-background p-6">
        <h2 className="text-2xl font-semibold text-ink">{content.ctaHeading}</h2>
        <p className="mt-2 text-sm text-muted md:text-base">{content.ctaBody}</p>
      </section>
    </div>
  );
}
