import { notFound } from "next/navigation";
import { GuidePlaceholderShell } from "@/components/guides/guide-placeholder-shell";
import { GUIDE_ENTRIES, GUIDE_ENTRY_BY_SLUG } from "@/content/guides";
import { buildPageMetadata } from "@/lib/seo";

type GuideRouteProps = {
  params: Promise<{ slug: string }>;
};

const GUIDE_PLACEHOLDER_ROBOTS = {
  index: false,
  follow: false,
} as const;

export const dynamicParams = false;

export function generateStaticParams() {
  return GUIDE_ENTRIES.map((entry) => ({
    slug: entry.slug,
  }));
}

export async function generateMetadata({ params }: GuideRouteProps) {
  const { slug } = await params;
  const guide = GUIDE_ENTRY_BY_SLUG.get(slug);

  if (!guide) {
    return {};
  }

  return buildPageMetadata({
    title: `${guide.title} | Ironclad Plumbing`,
    description: `Placeholder route for ${guide.title}. Ironclad Plumbing is preparing the full guide content for this page.`,
    path: `/guides/${guide.slug}`,
    ogTemplate: "blog",
    robots: GUIDE_PLACEHOLDER_ROBOTS,
  });
}

export default async function GuidePlaceholderPage({ params }: GuideRouteProps) {
  const { slug } = await params;
  const guide = GUIDE_ENTRY_BY_SLUG.get(slug);

  if (!guide) {
    notFound();
  }

  return (
    <GuidePlaceholderShell path={`/guides/${guide.slug}`} title={guide.title}>
      <div className="space-y-4">
        <p className="text-sm font-semibold uppercase tracking-[0.12em] text-muted">{guide.routeLabel}</p>
        <p className="max-w-[var(--max-readable-width)] text-sm text-body md:text-base">
          Content implementation for this guide is queued. The final guide template, schema, TOC behavior, and article
          content are intentionally deferred until the UX phase begins.
        </p>
      </div>
    </GuidePlaceholderShell>
  );
}
