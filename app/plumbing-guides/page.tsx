import Link from "next/link";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { StructuredData } from "@/components/seo/structured-data";
import { BLOG_POSTS } from "@/content/blog-posts";
import { buildPageMetadata } from "@/lib/seo";
import { buildBreadcrumbItems, buildBreadcrumbListSchema } from "@/lib/structured-data";

export const dynamicParams = false;

export function generateMetadata() {
  return buildPageMetadata({
    title: "Plumbing Guides & Tips | Ironclad Plumbing - Austin, TX",
    description:
      "Practical Austin homeowner guides covering maintenance, emergency prep, and upgrades.",
    path: "/plumbing-guides",
    ogTemplate: "blog",
  });
}

export default function PlumbingGuidesHubPage() {
  const breadcrumbs = buildBreadcrumbListSchema(
    buildBreadcrumbItems("/plumbing-guides", "Plumbing Guides"),
  );

  return (
    <>
      <SiteHeader />
      <StructuredData data={breadcrumbs} id="ld-breadcrumb-plumbing-guides" />
      <main>
        <section className="section-block bg-soft-background">
          <div className="container-shell">
            <p className="text-sm font-semibold uppercase tracking-[0.12em] text-muted">Education</p>
            <h1 className="h1-display mt-4 max-w-[var(--max-readable-width)]">Homeowner Plumbing Guides</h1>
            <p className="body-large mt-4 max-w-[var(--max-readable-width)] text-muted">
              Practical Austin homeowner guides covering maintenance, emergency prep, and upgrades.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link className="focus-ring primary-button" href="/book">
                Book Service
              </Link>
              <Link className="focus-ring secondary-button" href="/contact">
                Contact Team
              </Link>
            </div>
          </div>
        </section>

        <section className="section-block">
          <div className="container-shell">
            <div className="grid gap-4 md:grid-cols-2">
              {BLOG_POSTS.map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="focus-ring card-shell block p-6 transition hover:-translate-y-0.5 hover:shadow-[0_22px_50px_-28px_rgba(15,23,42,0.35)]"
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-cta-blue">
                    Guide
                  </p>
                  <h2 className="mt-3 text-xl font-semibold text-ink">{post.title}</h2>
                  <p className="mt-3 text-sm text-muted md:text-base">{post.metaDescription}</p>
                  <p className="mt-5 text-sm font-semibold text-cta-blue">Read the guide</p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="section-block bg-ink">
          <div className="container-shell text-white">
            <h2 className="font-display text-3xl font-bold tracking-tight md:text-4xl">
              Want a pro to take a look?
            </h2>
            <p className="mt-3 max-w-[var(--max-readable-width)] text-sm text-white/70 md:text-base">
              Upfront pricing. On-time windows. Written warranty. Book online or contact the team.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link className="focus-ring primary-button" href="/book">
                Book Service Online
              </Link>
              <Link
                className="focus-ring secondary-button border-white/40 text-white hover:bg-white/10"
                href="/plumbing"
              >
                Explore Services
              </Link>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
