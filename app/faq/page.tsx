import Link from "next/link";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { IroncladMotionRoot } from "@/components/motion/ironclad-motion";
import { QuickAnswer } from "@/components/seo/quick-answer";
import { StructuredData } from "@/components/seo/structured-data";
import { FAQ_CATEGORIES, FAQ_ENTRIES, type FaqCategoryId } from "@/content/faqs";
import { buildPageMetadata } from "@/lib/seo";
import {
  buildBreadcrumbItems,
  buildBreadcrumbListSchema,
  buildFaqPageSchema,
} from "@/lib/structured-data";

export const dynamicParams = false;

export function generateMetadata() {
  return buildPageMetadata({
    title: "Plumbing FAQ | Ironclad Plumbing - Austin, TX",
    description:
      "Answers to common Austin plumbing questions, from slab leaks to hard-water maintenance.",
    path: "/faq",
    ogTemplate: "blog",
  });
}

function groupFaqs() {
  const byCategory = new Map<FaqCategoryId, typeof FAQ_ENTRIES>();
  for (const category of FAQ_CATEGORIES) {
    byCategory.set(category.id, []);
  }
  for (const entry of FAQ_ENTRIES) {
    byCategory.get(entry.category)?.push(entry);
  }
  return byCategory;
}

export default function FaqHubPage() {
  const faqsByCategory = groupFaqs();
  const schemas: Record<string, unknown>[] = [
    buildBreadcrumbListSchema(buildBreadcrumbItems("/faq", "FAQ")),
    buildFaqPageSchema(FAQ_ENTRIES),
  ];

  return (
    <>
      <SiteHeader />
      <StructuredData data={schemas} id="ld-faq-hub" />
      <IroncladMotionRoot>
        <section className="section-block bg-soft-background">
          <div className="container-shell" data-entrance>
            <p className="text-sm font-semibold uppercase tracking-[0.12em] text-muted">Education</p>
            <h1 className="h1-display mt-4 max-w-[var(--max-readable-width)]">
              Frequently Asked <span className="ic-underline">Questions</span>
            </h1>
            <p className="body-large mt-4 max-w-[var(--max-readable-width)] text-muted">
              Find straight answers about plumbing service and what to expect when you work with Ironclad—covering{" "}
              <span aria-hidden="true" className="ic-rot">
                <span data-rotate='["pricing.","scheduling.","drains.","leaks.","water heaters."]'>pricing.</span>
              </span>
              <span className="sr-only">pricing, scheduling, drains, leaks, and water heaters.</span>
            </p>
            <QuickAnswer className="ic-glass mt-6">
              Ironclad Plumbing answers common Austin plumbing questions with direct guidance on pricing, scheduling,
              repairs, drains, leaks, water heaters, and what happens during a service visit. Use this page to compare
              options before you book or call.
            </QuickAnswer>

            <div className="ic-glass mt-6 inline-flex items-center gap-3 rounded-full border border-white/70 bg-white/70 px-5 py-3 shadow-sm">
              <strong className="ic-count text-2xl leading-none text-cta-blue" data-count={FAQ_ENTRIES.length}>
                {FAQ_ENTRIES.length}
              </strong>
              <span className="text-sm font-semibold text-ink">straight answers across {FAQ_CATEGORIES.length} topics</span>
            </div>

            <div className="mt-8 flex flex-wrap gap-2">
              {FAQ_CATEGORIES.map((category) => (
                <a
                  key={category.id}
                  className="ic-glass focus-ring rounded-full border border-border bg-background px-4 py-2 text-sm font-semibold text-ink hover:bg-white"
                  data-reveal
                  href={`#category-${category.id}`}
                >
                  {category.label}
                </a>
              ))}
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link className="ic-cta focus-ring primary-button" href="/book">
                <span className="ic-sheen" aria-hidden="true" />
                Book Service
              </Link>
              <Link className="focus-ring secondary-button" href="/contact">
                Contact Team
              </Link>
            </div>
          </div>
        </section>

        <section className="section-block">
          <div className="container-shell space-y-10">
            {FAQ_CATEGORIES.map((category) => {
              const entries = faqsByCategory.get(category.id) ?? [];
              if (entries.length === 0) {
                return null;
              }

              return (
                <section key={category.id} id={`category-${category.id}`} className="scroll-mt-28">
                  <h2 className="h2-display">{category.label}</h2>
                  <div className="ic-glass mt-6 overflow-hidden rounded-[var(--radius-card)] border border-border bg-background">
                    {entries.map((faq) => (
                      <details
                        key={faq.question}
                        className="group border-b border-border last:border-b-0"
                      >
                        <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-6 py-4 text-sm font-semibold text-ink md:text-base">
                          {faq.question}
                          <span className="text-muted group-open:rotate-180" aria-hidden="true">
                            ⌄
                          </span>
                        </summary>
                        <div className="px-6 pb-5 text-sm text-muted md:text-base" data-speakable="faq-answer">{faq.answer}</div>
                      </details>
                    ))}
                  </div>
                </section>
              );
            })}
          </div>
        </section>

        <section className="section-block bg-ink">
          <div className="container-shell text-white" data-reveal>
            <h2 className="font-display text-3xl font-bold tracking-tight md:text-4xl">
              Still have questions?
            </h2>
            <p className="mt-3 max-w-[var(--max-readable-width)] text-sm text-white/70 md:text-base">
              Call, text, or book online. We&apos;ll get you a clear answer and upfront pricing.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link className="focus-ring primary-button" href="/book">
                Book Service Online
              </Link>
              <Link className="focus-ring secondary-button border-white/40 text-white hover:bg-white/10" href="/contact">
                Contact Team
              </Link>
            </div>
          </div>
        </section>
      </IroncladMotionRoot>
      <SiteFooter />
    </>
  );
}
