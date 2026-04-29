import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { QuickAnswer } from "@/components/seo/quick-answer";
import { StructuredData } from "@/components/seo/structured-data";
import { getBlogArticleDetails } from "@/content/blog-article-details";
import { BLOG_POSTS } from "@/content/blog-posts";
import { getBlogPostBody } from "@/content/blog-post-bodies";
import { SERVICES } from "@/content/services";
import { buildPageMetadata } from "@/lib/seo";
import {
  buildArticleSchema,
  buildBreadcrumbItems,
  buildBreadcrumbListSchema,
  buildFaqPageSchema,
  buildSchemaStack,
} from "@/lib/structured-data";

type RouteParams = {
  slug: string;
};
type RouteProps = {
  params: Promise<RouteParams>;
};

export const dynamicParams = false;

function toAnchorId(heading: string): string {
  return heading.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

export function generateStaticParams(): RouteParams[] {
  return BLOG_POSTS.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: RouteProps) {
  const { slug } = await params;
  const post = BLOG_POSTS.find((entry) => entry.slug === slug);
  if (!post) {
    return {};
  }

  return buildPageMetadata({
    title: post.titleTag,
    description: post.metaDescription,
    path: `/blog/${post.slug}`,
    ogTemplate: "blog",
    ogType: "article",
  });
}

export default async function BlogPostDetailPage({ params }: RouteProps) {
  const { slug } = await params;
  const post = BLOG_POSTS.find((entry) => entry.slug === slug);
  const body = getBlogPostBody(slug);
  const details = getBlogArticleDetails(slug);
  if (!post || !body || !details) {
    notFound();
  }

  const relatedServices = details.relatedServiceSlugs
    .map((serviceSlug) => SERVICES.find((service) => service.slug === serviceSlug))
    .filter((service): service is (typeof SERVICES)[number] => Boolean(service));
  const articleBodyText = body.sections
    .map((section) => `${section.heading}\n${section.paragraphs.join("\n")}\n${(section.bullets ?? []).join("\n")}`)
    .join("\n\n");
  const schemas = buildSchemaStack(
    buildBreadcrumbListSchema(buildBreadcrumbItems(`/blog/${slug}`, post.title)),
    buildArticleSchema({
      title: post.h1,
      description: post.metaDescription,
      path: `/blog/${slug}`,
      body: articleBodyText,
      authorName: details.author,
      datePublished: details.publishedAt,
      dateModified: details.updatedAt,
    }),
    buildFaqPageSchema(details.faq),
  );

  return (
    <>
      <SiteHeader />
      <StructuredData data={schemas} id={`ld-blog-${slug}`} />
      <main>
        <section className="bg-soft-background pt-6">
          <div className="container-shell">
            <Breadcrumbs
              currentPath={`/blog/${slug}`}
              items={[
                { label: "Home", href: "/" },
                { label: "Blog", href: "/blog" },
                { label: post.title },
              ]}
            />
          </div>
        </section>

        <section className="section-block bg-soft-background">
          <div className="container-shell">
            <p className="text-sm font-semibold uppercase tracking-[0.12em] text-muted">Plumbing Guide</p>
            <h1 className="h1-display mt-4 max-w-[var(--max-readable-width)]">{post.h1}</h1>
            <p className="body-large mt-4 max-w-[var(--max-readable-width)] text-muted" data-speakable="hero">{body.dek}</p>
            <QuickAnswer className="mt-6">
              {body.dek}
            </QuickAnswer>
            <p className="mt-6 text-sm text-muted">
              Published {details.publishedAt} | Updated {details.updatedAt} | Author: {details.author} | Technical
              Review: {details.reviewer}
            </p>
          </div>
        </section>

        <section className="section-block">
          <div className="container-shell grid gap-10 lg:grid-cols-[1fr_300px]">
            <article className="space-y-10">
              {body.sections.map((section) => {
                const anchorId = toAnchorId(section.heading);
                return (
                  <section className="space-y-4" id={anchorId} key={section.heading}>
                    <h2 className="h2-display text-[clamp(1.5rem,3vw,2rem)]">{section.heading}</h2>
                    {section.paragraphs.map((paragraph) => (
                      <p className="text-sm text-body md:text-base" data-speakable="article-body" key={paragraph}>
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
                );
              })}

              <section className="space-y-4">
                <h2 className="h2-display text-[clamp(1.5rem,3vw,2rem)]">FAQ</h2>
                <div className="overflow-hidden rounded-[var(--radius-card)] border border-border bg-background">
                  {details.faq.map((item) => (
                    <details className="group border-b border-border last:border-b-0" key={item.question}>
                      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-6 py-4 text-sm font-semibold text-ink md:text-base">
                        {item.question}
                        <span className="text-muted group-open:rotate-180" aria-hidden="true">
                          ⌄
                        </span>
                      </summary>
                      <div className="px-6 pb-5 text-sm text-muted md:text-base" data-speakable="faq-answer">{item.answer}</div>
                    </details>
                  ))}
                </div>
              </section>
            </article>

            <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
              <div className="card-shell p-5">
                <h2 className="text-lg font-semibold text-ink">Table of Contents</h2>
                <ul className="mt-4 m-0 list-none space-y-2 p-0">
                  {body.sections.map((section) => (
                    <li key={section.heading}>
                      <a className="text-sm font-medium text-cta-blue hover:underline" href={`#${toAnchorId(section.heading)}`}>
                        {section.heading}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="card-shell p-5">
                <h2 className="text-lg font-semibold text-ink">Related Services</h2>
                <ul className="mt-4 m-0 list-none space-y-2 p-0">
                  {relatedServices.map((service) => (
                    <li key={service.slug}>
                      <Link className="text-sm font-medium text-cta-blue hover:underline" href={`/plumbing/${service.slug}`}>
                        {service.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </aside>
          </div>
        </section>

        <section className="section-block bg-ink">
          <div className="container-shell text-white">
            <h2 className="font-display text-3xl font-bold tracking-tight md:text-4xl">Need this fixed by a pro?</h2>
            <p className="mt-3 max-w-[var(--max-readable-width)] text-sm text-white/70 md:text-base">
              Book service online, call, or text for a clear diagnosis and upfront options.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link className="focus-ring primary-button" href="/book">
                Book Service Online
              </Link>
              <Link className="focus-ring secondary-button border-white/40 text-white hover:bg-white/10" href="/plumbing">
                Explore Plumbing Services
              </Link>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
