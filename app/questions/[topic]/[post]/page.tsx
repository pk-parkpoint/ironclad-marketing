import { notFound } from "next/navigation";
import FaqPost from "@/components/questions/FaqPost";
import { allPostRouteParams, postBySlug, postPath } from "@/components/questions/question-data";
import { buildQuestionPostSchema } from "@/components/questions/question-schema";
import { StructuredData } from "@/components/seo/structured-data";
import { buildPageMetadata } from "@/lib/seo";

type RouteProps = { params: Promise<{ topic: string; post: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return allPostRouteParams();
}

export async function generateMetadata({ params }: RouteProps) {
  const { topic, post } = await params;
  const match = postBySlug(topic, post);
  if (!match) return {};
  return buildPageMetadata({
    title: `${match.post.title} | Ironclad Plumbing`,
    description: match.post.sub,
    path: postPath(match.post),
    ogTemplate: "blog",
    ogType: "article",
  });
}

export default async function QuestionPostPage({ params }: RouteProps) {
  const { topic, post } = await params;
  const match = postBySlug(topic, post);
  if (!match) notFound();
  return (
    <>
      <StructuredData data={buildQuestionPostSchema(match.post)} id={`ld-question-post-${match.post.key}`} />
      <FaqPost topic={match.topic} post={match.post} />
    </>
  );
}
