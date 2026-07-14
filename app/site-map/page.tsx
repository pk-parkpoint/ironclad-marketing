import Link from "next/link";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { allPosts, allTopics, postPath, topicPath } from "@/components/questions/question-data";
import { BLOG_POSTS } from "@/content/blog-posts";
import { GUIDE_ENTRIES } from "@/content/guides";
import { LOCAL_CITY_PAGES, LOCAL_NEIGHBORHOOD_PAGES } from "@/content/local-pages";
import { getPpcServiceRouteEntries } from "@/content/ppc-service-variants";
import { SERVICES } from "@/content/services";
import { buildPageMetadata } from "@/lib/seo";

type SiteMapLink = {
  href: string;
  label: string;
};

const CORE_LINKS: SiteMapLink[] = [
  { href: "/", label: "Home" },
  { href: "/plumbing", label: "All Plumbing Services" },
  { href: "/service-area", label: "All Service Areas" },
  { href: "/guides", label: "Guides" },
  { href: "/questions", label: "Top Plumbing Questions" },
  { href: "/reviews", label: "Reviews" },
  { href: "/guarantees", label: "Guarantees" },
  { href: "/book", label: "Book Service" },
  { href: "/contact", label: "Contact" },
];

export const metadata = buildPageMetadata({
  title: "Site Map | Ironclad Plumbing",
  description:
    "Find Ironclad Plumbing service pages, Austin-area city pages, homeowner guides, reviews, and booking links.",
  path: "/site-map",
});

function SiteMapSection({ links, title }: { links: SiteMapLink[]; title: string }) {
  return (
    <section className="rounded-lg border border-border bg-white p-6">
      <h2 className="text-xl font-semibold text-ink">{title}</h2>
      <ul className="mt-4 grid m-0 list-none gap-2 p-0 sm:grid-cols-2 lg:grid-cols-3">
        {links.map((link) => (
          <li key={link.href}>
            <Link className="text-sm font-medium text-cta-blue hover:underline" href={link.href}>
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default function SiteMapPage() {
  const serviceLinks = [
    ...new Map([
      ...SERVICES.map((service) => [
        `/plumbing/${service.slug}`,
        { href: `/plumbing/${service.slug}`, label: service.title },
      ] as const),
      ...getPpcServiceRouteEntries()
        .filter((entry) => entry.path !== "/plumbing")
        .map((entry) => [entry.path, { href: entry.path, label: entry.service.title }] as const),
    ]).values(),
  ];
  const cityLinks = LOCAL_CITY_PAGES.map((page) => ({ href: page.path, label: `${page.name} Plumber` }));
  const neighborhoodLinks = LOCAL_NEIGHBORHOOD_PAGES.map((page) => ({
    href: page.path,
    label: `${page.name} Plumbing`,
  }));
  const guideLinks = GUIDE_ENTRIES.map((guide) => ({ href: `/guides/${guide.slug}`, label: guide.routeLabel }));
  const questionLinks = [
    ...allTopics().map((topic) => ({ href: topicPath(topic.key), label: topic.name })),
    ...allPosts().map((post) => ({ href: postPath(post), label: post.title })),
  ];
  const articleLinks = BLOG_POSTS.map((post) => ({ href: `/blog/${post.slug}`, label: post.title }));

  return (
    <>
      <SiteHeader />
      <main className="bg-soft-background py-12">
        <div className="container-shell">
          <p className="text-sm font-semibold uppercase tracking-[0.08em] text-cta-blue">Site Map</p>
          <h1 className="mt-3 text-4xl font-bold text-ink md:text-5xl">Find Every Ironclad Page</h1>
          <p className="mt-4 max-w-[760px] text-base text-body">
            Browse the main service, service-area, guide, article, question, and booking pages from one crawlable index.
          </p>
          <div className="mt-8 space-y-6">
            <SiteMapSection links={CORE_LINKS} title="Core Pages" />
            <SiteMapSection links={serviceLinks} title="Plumbing Services" />
            <SiteMapSection links={cityLinks} title="City Service Areas" />
            <SiteMapSection links={neighborhoodLinks} title="Austin Neighborhood Pages" />
            <SiteMapSection links={guideLinks} title="Homeowner Guides" />
            <SiteMapSection links={questionLinks} title="Questions and Answers" />
            <SiteMapSection links={articleLinks} title="Articles" />
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
