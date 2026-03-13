import { notFound } from "next/navigation";
import { GuidePageTemplate } from "@/components/guides/guide-page-template";
import { getGuidePageData } from "@/content/guide-pages";
import { GUIDE_ENTRIES } from "@/content/guides";
import { buildPageMetadata } from "@/lib/seo";

type GuideRouteProps = {
  params: Promise<{ slug: string }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return GUIDE_ENTRIES.map((entry) => ({ slug: entry.slug }));
}

export async function generateMetadata({ params }: GuideRouteProps) {
  const { slug } = await params;
  const page = getGuidePageData(slug);

  if (!page) {
    return {};
  }

  return buildPageMetadata({
    title: `${page.title} | Ironclad Plumbing`,
    description: page.description,
    path: page.path,
    ogTemplate: "blog",
    ogType: "article",
  });
}

export default async function GuideDetailPage({ params }: GuideRouteProps) {
  const { slug } = await params;
  const page = getGuidePageData(slug);

  if (!page) {
    notFound();
  }

  return <GuidePageTemplate page={page} />;
}
