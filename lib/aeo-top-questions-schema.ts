import {
  OFFICIAL_SOURCE_REFERENCES,
  TOP_PLUMBING_QUESTIONS,
  TOP_QUESTIONS_GUIDE_DESCRIPTION,
  TOP_QUESTIONS_GUIDE_LAST_UPDATED,
  TOP_QUESTIONS_GUIDE_PATH,
  TOP_QUESTIONS_GUIDE_TITLE,
} from "@/content/aeo-top-questions";
import {
  buildArticleSchema,
  buildBreadcrumbItems,
  buildBreadcrumbListSchema,
  buildSchemaStack,
  toAbsoluteUrl,
} from "@/lib/structured-data";

function buildArticleBody(): string {
  return TOP_PLUMBING_QUESTIONS
    .map((entry) => `${entry.question} ${entry.answer} ${entry.urgentNote}`)
    .join("\n\n");
}

function buildTopQuestionsArticleSchema() {
  return {
    ...buildArticleSchema({
      title: TOP_QUESTIONS_GUIDE_TITLE,
      description: TOP_QUESTIONS_GUIDE_DESCRIPTION,
      path: TOP_QUESTIONS_GUIDE_PATH,
      body: buildArticleBody(),
      authorName: "Ironclad Plumbing",
      datePublished: TOP_QUESTIONS_GUIDE_LAST_UPDATED,
      dateModified: TOP_QUESTIONS_GUIDE_LAST_UPDATED,
    }),
    citation: OFFICIAL_SOURCE_REFERENCES.map((entry) => entry.url),
    about: [
      "Austin plumbing",
      "Texas plumbing licensing",
      "Plumbing permits",
      "Emergency plumbing",
      "Water heater repair",
      "Drain cleaning",
      "Leak detection",
    ],
    mentions: TOP_PLUMBING_QUESTIONS.flatMap((entry) => [
      entry.service.label,
      entry.guide.label,
      ...entry.variants,
    ]).slice(0, 40),
  };
}

function buildTopQuestionsItemListSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "@id": `${toAbsoluteUrl(TOP_QUESTIONS_GUIDE_PATH)}#top-questions`,
    name: TOP_QUESTIONS_GUIDE_TITLE,
    itemListElement: TOP_PLUMBING_QUESTIONS.map((entry, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: entry.question,
      url: `${toAbsoluteUrl(TOP_QUESTIONS_GUIDE_PATH)}#q-${index + 1}`,
    })),
  };
}

export function buildTopQuestionsSchemas() {
  return buildSchemaStack(
    buildBreadcrumbListSchema(buildBreadcrumbItems(TOP_QUESTIONS_GUIDE_PATH, TOP_QUESTIONS_GUIDE_TITLE)),
    buildTopQuestionsArticleSchema(),
    buildTopQuestionsItemListSchema(),
  );
}
