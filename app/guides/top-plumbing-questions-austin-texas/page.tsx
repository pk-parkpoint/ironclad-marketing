import Link from "next/link";
import { PageScaffold } from "@/components/layout/page-scaffold";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { StructuredData } from "@/components/seo/structured-data";
import {
  OFFICIAL_SOURCE_REFERENCES,
  TOP_PLUMBING_QUESTIONS,
  TOP_QUESTIONS_GUIDE_DESCRIPTION,
  TOP_QUESTIONS_GUIDE_LAST_UPDATED,
  TOP_QUESTIONS_GUIDE_PATH,
  TOP_QUESTIONS_GUIDE_TITLE,
} from "@/content/aeo-top-questions";
import { buildTopQuestionsSchemas } from "@/lib/aeo-top-questions-schema";
import { buildPageMetadata } from "@/lib/seo";

export function generateMetadata() {
  return buildPageMetadata({
    title: `${TOP_QUESTIONS_GUIDE_TITLE} | Ironclad Plumbing`,
    description: TOP_QUESTIONS_GUIDE_DESCRIPTION,
    path: TOP_QUESTIONS_GUIDE_PATH,
    ogTemplate: "blog",
    ogType: "article",
  });
}

export default function TopPlumbingQuestionsPage() {
  return (
    <>
      <SiteHeader />
      <StructuredData data={buildTopQuestionsSchemas()} id="ld-top-plumbing-questions" />
      <PageScaffold
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Guides", href: "/guides" },
          { label: "Top Plumbing Questions" },
        ]}
        description={TOP_QUESTIONS_GUIDE_DESCRIPTION}
        eyebrow="Austin Homeowner Guide"
        pathLabel={TOP_QUESTIONS_GUIDE_PATH}
        title={TOP_QUESTIONS_GUIDE_TITLE}
      >
        <div className="space-y-10">
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-ink">Read this first</h2>
            <p className="text-sm text-body md:text-base">
              Licensing is Texas-wide, but permits, water quality, dispatch timing, and service availability are local.
              Ironclad serves Greater Austin, so this page separates statewide rules from Austin-specific homeowner
              decisions.
            </p>
            <div className="grid gap-3 md:grid-cols-2">
              {TOP_PLUMBING_QUESTIONS.map((entry, index) => (
                <a
                  className="rounded-[var(--radius-card)] border border-border bg-soft-background p-4 text-sm font-semibold text-ink transition hover:border-brand-blue"
                  href={`#q-${index + 1}`}
                  key={entry.question}
                >
                  {index + 1}. {entry.question}
                </a>
              ))}
            </div>
          </section>

          {TOP_PLUMBING_QUESTIONS.map((entry, index) => (
            <section className="space-y-4 border-t border-border pt-8" id={`q-${index + 1}`} key={entry.question}>
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">Question {index + 1}</p>
              <h2 className="text-2xl font-semibold text-ink">{entry.question}</h2>
              <p className="text-sm text-body md:text-base" data-speakable="article-body">
                {entry.answer}
              </p>
              <div className="rounded-[var(--radius-card)] border border-border bg-soft-background p-4">
                <p className="text-sm font-semibold text-ink">If this is happening now</p>
                <p className="mt-2 text-sm text-body">{entry.urgentNote}</p>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <h3 className="text-base font-semibold text-ink">People also ask this as</h3>
                  <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-body">
                    {entry.variants.map((variant) => (
                      <li key={variant}>{variant}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="text-base font-semibold text-ink">Next useful pages</h3>
                  <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-body">
                    <li>
                      Service: <Link href={entry.service.path}>{entry.service.label}</Link>
                    </li>
                    <li>
                      Deeper guide: <Link href={entry.guide.path}>{entry.guide.label}</Link>
                    </li>
                  </ul>
                </div>
              </div>
              <div>
                <h3 className="text-base font-semibold text-ink">Sources and official references</h3>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-body">
                  {entry.sources.map((source) => (
                    <li key={`${entry.question}-${source.url}`}>
                      <a href={source.url} rel="noreferrer" target="_blank">
                        {source.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </section>
          ))}

          <section className="space-y-4 border-t border-border pt-8">
            <h2 className="text-2xl font-semibold text-ink">Official source list</h2>
            <p className="text-sm text-body md:text-base">
              Last reviewed {TOP_QUESTIONS_GUIDE_LAST_UPDATED}. Use these official references to verify licensing,
              permit, water-quality, safety, and efficiency details before approving major plumbing work.
            </p>
            <ul className="list-disc space-y-1 pl-5 text-sm text-body">
              {OFFICIAL_SOURCE_REFERENCES.map((source) => (
                <li key={source.url}>
                  <a href={source.url} rel="noreferrer" target="_blank">
                    {source.label}
                  </a>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </PageScaffold>
      <SiteFooter />
    </>
  );
}
