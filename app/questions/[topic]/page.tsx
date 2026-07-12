import { notFound } from "next/navigation";
import FaqTopic from "@/components/questions/FaqTopic";
import { allTopics, topicBySlug, topicPath } from "@/components/questions/question-data";
import { buildQuestionTopicSchema } from "@/components/questions/question-schema";
import { StructuredData } from "@/components/seo/structured-data";
import { buildPageMetadata } from "@/lib/seo";

type RouteProps = { params: Promise<{ topic: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return allTopics().map((topic) => ({ topic: topic.slug }));
}

export async function generateMetadata({ params }: RouteProps) {
  const topic = topicBySlug((await params).topic);
  if (!topic) return {};
  return buildPageMetadata({
    title: `${topic.name}: every question, answered | Ironclad Plumbing`,
    description: topic.blurb,
    path: topicPath(topic.key),
    ogTemplate: "blog",
  });
}

export default async function QuestionTopicPage({ params }: RouteProps) {
  const topic = topicBySlug((await params).topic);
  if (!topic) notFound();
  return (
    <>
      <StructuredData data={buildQuestionTopicSchema(topic)} id={`ld-question-topic-${topic.slug}`} />
      <FaqTopic topic={topic} />
    </>
  );
}
