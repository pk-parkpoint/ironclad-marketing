import Link from "next/link";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { QuickAnswer } from "@/components/seo/quick-answer";
import { StructuredData } from "@/components/seo/structured-data";
import type { GuidePageData } from "@/content/guide-pages";
import { GuideProgressBar } from "@/components/guides/guide-progress-bar";
import { GuideTableOfContents } from "@/components/guides/guide-table-of-contents";
import {
  buildArticleSchema,
  buildBreadcrumbItems,
  buildBreadcrumbListSchema,
  buildSchemaStack,
} from "@/lib/structured-data";

function GuideRailVideo() {
  return (
    <div className="guide-rail-card guide-rail-card--media">
      <video autoPlay className="guide-rail-video" loop muted playsInline poster="/hero/ironclad-hero-poster.jpg" preload="none">
        <source src="/hero/ironclad-hero-bg.webm" type="video/webm" />
        <source src="/media/hero-video.mp4" type="video/mp4" />
      </video>
      <p className="guide-rail-note">Need a straight answer? Call or text <a href="tel:+18335971932">(833) 597-1932</a>.</p>
    </div>
  );
}

export function GuidePageTemplate({ page }: { page: GuidePageData }) {
  const hasQuickAnswerSection = page.html.includes(">Quick Answer<");
  const schemas = buildSchemaStack(
    buildBreadcrumbListSchema(buildBreadcrumbItems(page.path, page.title)),
    buildArticleSchema({
      title: page.title,
      description: page.description,
      path: page.path,
      body: page.articleText,
      authorName: "Ironclad Plumbing",
      datePublished: page.publishedDate,
      dateModified: page.updatedDate,
    }),
  );

  return (
    <>
      <SiteHeader />
      <GuideProgressBar />
      <StructuredData data={schemas} id={`ld-guide-${page.slug}`} />
      <main className="guide-page-shell">
        <section className="guide-hero">
          <div className="guide-hero__inner">
            <Breadcrumbs
              currentPath={page.path}
              items={[
                { label: "Home", href: "/" },
                { label: "Guides", href: "/guides" },
                { label: page.routeLabel },
              ]}
            />
            <span className="guide-hero__eyebrow">{page.eyebrow}</span>
            <h1 className="guide-hero__title">{page.title}</h1>
            <p className="guide-hero__dek" data-speakable="hero">
              {page.description}
            </p>
            <p className="guide-hero__meta">
              Published {page.publishedLabel} <span aria-hidden="true">•</span> Updated {page.updatedLabel}
            </p>
          </div>
        </section>

        <section className="guide-layout-section">
          <div className="guide-layout-frame">
            <article className="guide-article-card">
              {hasQuickAnswerSection ? null : (
                <QuickAnswer className="m-8 mb-0">
                  {page.description}
                </QuickAnswer>
              )}
              <div className="guide-article-content" dangerouslySetInnerHTML={{ __html: page.html }} />

              {page.relatedGuides.length > 0 ? (
                <section className="guide-related-block">
                  <p className="guide-related-block__eyebrow">Explore more on</p>
                  <div className="guide-chip-row">
                    {page.relatedGuides.map((guide) => (
                      <Link href={`/guides/${guide.slug}`} key={guide.slug}>
                        {guide.routeLabel}
                      </Link>
                    ))}
                  </div>
                </section>
              ) : null}

              <section className="guide-support-grid">
                <div className="guide-support-card">
                  <h2>About these guides</h2>
                  <p>
                    Ironclad publishes this library for Austin homeowners who want straight answers before they book,
                    approve, or compare plumbing work.
                  </p>
                  <p>No form fill. No signup wall. Use the pages on any plumber, including us.</p>
                </div>
                <div className="guide-support-card">
                  <h2>Questions this guide did not answer?</h2>
                  <p>
                    Call or text <a href="tel:+18335971932">(833) 597-1932</a>. We will give you a direct answer
                    whether you hire us or not.
                  </p>
                  <p>No service visit fees. No pressure to book.</p>
                </div>
              </section>

              <nav className="guide-next-prev" aria-label="Guide pagination">
                <div className="guide-next-prev__card guide-next-prev__card--prev">
                  <span>Previous guide</span>
                  {page.prevGuide ? <Link href={`/guides/${page.prevGuide.slug}`}>{page.prevGuide.routeLabel}</Link> : <span>None</span>}
                </div>
                <div className="guide-next-prev__card guide-next-prev__card--next">
                  <span>Next guide</span>
                  {page.nextGuide ? <Link href={`/guides/${page.nextGuide.slug}`}>{page.nextGuide.routeLabel}</Link> : <span>None</span>}
                </div>
              </nav>
            </article>

            <aside className="guide-rail">
              <GuideRailVideo />
              <GuideTableOfContents items={page.toc} />
              {page.relatedGuides.length > 0 ? (
                <div className="guide-rail-card">
                  <p className="guide-rail-card__eyebrow">Helpful resources</p>
                  <ul className="guide-resource-list">
                    {page.relatedGuides.map((guide) => (
                      <li key={guide.slug}>
                        <Link href={`/guides/${guide.slug}`}>{guide.routeLabel}</Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </aside>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
