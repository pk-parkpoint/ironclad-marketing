import FaqHub from "@/components/questions/FaqHub";
import { allPosts } from "@/components/questions/question-data";
import { buildQuestionHubSchema } from "@/components/questions/question-schema";
import { StructuredData } from "@/components/seo/structured-data";
import { buildPageMetadata } from "@/lib/seo";

export const metadata = buildPageMetadata({
  title: "Plumbing Questions, Answered — 200 Homeowner FAQs | Ironclad Plumbing",
  description: "Straight answers to 200 homeowner plumbing questions from Ironclad Plumbing in Austin, TX.",
  path: "/questions",
  ogTemplate: "blog",
});

export default function QuestionsPage() {
  return (
    <>
      <StructuredData data={buildQuestionHubSchema()} id="ld-question-hub" />
      <FaqHub posts={allPosts()} />
    </>
  );
}
