import { notFound, permanentRedirect } from "next/navigation";
import { GuidePageTemplate } from "@/components/guides/guide-page-template";
import { BLOG_POSTS } from "@/content/blog-posts";
import { getGuidePageData } from "@/content/guide-pages";
import { GUIDE_ENTRIES } from "@/content/guides";
import { buildPageMetadata } from "@/lib/seo";

type GuideRouteProps = {
  params: Promise<{ slug: string }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  const slugs = new Set([
    ...GUIDE_ENTRIES.map((entry) => entry.slug),
    ...BLOG_POSTS.map((post) => post.slug),
  ]);

  return [...slugs].map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: GuideRouteProps) {
  const { slug } = await params;
  const page = getGuidePageData(slug);
  const blogPost = BLOG_POSTS.find((entry) => entry.slug === slug);

  if (blogPost && !page) {
    return buildPageMetadata({
      title: blogPost.titleTag,
      description: blogPost.metaDescription,
      path: `/blog/${blogPost.slug}`,
      ogTemplate: "blog",
      ogType: "article",
    });
  }

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
  const blogPost = BLOG_POSTS.find((entry) => entry.slug === slug);

  if (!page) {
    if (blogPost) {
      permanentRedirect(`/blog/${blogPost.slug}`);
    }
    notFound();
  }

  return <GuidePageTemplate page={page} />;
}
