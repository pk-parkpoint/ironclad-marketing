import {
  SITE_ORIGIN,
  assetPath,
  localHref,
  postPath,
  topicPath,
  type FaqPost,
  type FaqTopic,
} from "./question-data";

export function buildQuestionHubSchema(): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Plumbing Questions, Answered",
    url: `${SITE_ORIGIN}/questions`,
  };
}

export function buildQuestionTopicSchema(topic: FaqTopic): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: topic.questions.map((question) => ({
      "@type": "Question",
      name: question.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: `${question.quick} What to do next: ${question.next}`,
      },
    })),
    url: `${SITE_ORIGIN}${localHref(topicPath(topic.key))}`,
  };
}

export function buildQuestionPostSchema(post: FaqPost): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.sub,
    author: { "@type": "Organization", name: "Ironclad Plumbing" },
    datePublished: "2026-07-11",
    dateModified: "2026-07-11",
    image: `${SITE_ORIGIN}${assetPath(post.hero)}`,
    mainEntityOfPage: `${SITE_ORIGIN}${postPath(post)}`,
  };
}
