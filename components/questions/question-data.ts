import FAQ_TOPICS_SOURCE from "@/content/questions/faq-data";
import FAQ_META_SOURCE from "@/content/questions/faq-meta";
import FAQ_POSTS_SOURCE from "@/content/questions/faq-posts";

export type FaqCta = { h: string; p: string; btn: string; href: string };
export type FaqQuestion = { n: number; q: string; quick: string; next: string };
export type FaqTopic = {
  key: string;
  name: string;
  mdName: string;
  hero: string;
  blurb: string;
  cta: FaqCta;
  slug: string;
  questions: FaqQuestion[];
};
export type FaqContentBlock = { h: string; intro: string; items: Array<{ t: string; d: string }> };
export type FaqPost = {
  key: string;
  n: number;
  topic: string;
  title: string;
  sub: string;
  hero: string;
  read: string;
  quick: string;
  sections: Array<{ h: string; ps: string[] }>;
  steps?: FaqContentBlock;
  list?: FaqContentBlock;
  quote: string;
  bottom: string;
  cta: FaqCta;
};

type FaqMeta = {
  order: string[];
  topics: Record<string, Omit<FaqTopic, "key" | "slug" | "questions">>;
};

const FAQ_TOPICS = FAQ_TOPICS_SOURCE as Array<{ name: string; questions: FaqQuestion[] }>;
const FAQ_META = FAQ_META_SOURCE as FaqMeta;
const FAQ_POSTS = FAQ_POSTS_SOURCE as Record<string, FaqPost>;

export const SITE_ORIGIN = "https://ironcladtexas.com";
export const PHONE_DISPLAY = "(512) 516-2470";
export const PHONE_TEL = "tel:+15125162470";
export const TOPIC_SLUGS: Record<string, string> = {
  leaks: "leaks",
  clogs: "clogs-and-drains",
  toilets: "toilets",
  "water-heaters": "water-heaters",
  "water-pressure": "water-pressure",
  pipes: "pipes-and-shutoffs",
  sewer: "sewer-and-main-line",
  fixtures: "fixtures-and-kitchens",
  "water-quality": "water-quality",
  "gas-safety": "gas-and-safety",
  planning: "planning-and-costs",
};
export const POST_SLUGS: Record<string, string> = {
  "dripping-faucet": "why-is-my-faucet-dripping",
  "burst-pipe": "what-to-do-when-a-pipe-bursts",
  "slab-leak-signs": "signs-of-a-slab-leak",
  "slow-sink-drain": "sink-draining-slowly",
  "chemical-drain-cleaner": "should-you-use-chemical-drain-cleaner",
  "multiple-drains": "multiple-drains-backing-up",
  "flushable-wipes": "are-flushable-wipes-flushable",
  "running-toilet": "toilet-keeps-running",
  "no-hot-water": "no-hot-water",
  "water-heater-lifespan": "how-long-do-water-heaters-last",
  "tankless-worth-it": "is-tankless-worth-it",
  "low-water-pressure": "low-water-pressure",
  "sewer-line-clogged": "sewer-line-clogged",
  "smell-gas": "what-to-do-if-you-smell-gas",
  "high-water-bill": "water-bill-suddenly-high",
};

export function topicPath(topicKey: string): string {
  return `/questions/${TOPIC_SLUGS[topicKey]}`;
}

export function postPath(post: FaqPost): string {
  return `${topicPath(post.topic)}/${POST_SLUGS[post.key]}`;
}

export function assetPath(source: string): string {
  return `/${source.replace(/^\/+/, "")}`;
}

export function localHref(href: string): string {
  return href.replace(SITE_ORIGIN, "");
}

export function topicBySlug(slug: string): FaqTopic | null {
  const key = Object.keys(TOPIC_SLUGS).find((item) => TOPIC_SLUGS[item] === slug);
  return key ? getTopic(key) : null;
}

export function postBySlug(topicSlug: string, postSlug: string): { topic: FaqTopic; post: FaqPost } | null {
  const topic = topicBySlug(topicSlug);
  const post = Object.values(FAQ_POSTS).find((item) => item.topic === topic?.key && POST_SLUGS[item.key] === postSlug);
  return post && topic ? { topic, post } : null;
}

export function allTopics(): FaqTopic[] {
  return FAQ_META.order.map(getTopic);
}

export function allPosts(): FaqPost[] {
  return Object.values(FAQ_POSTS);
}

export function allPostRouteParams(): Array<{ topic: string; post: string }> {
  return allPosts().map((post) => ({
    topic: TOPIC_SLUGS[post.topic],
    post: POST_SLUGS[post.key],
  }));
}

export function getTopic(key: string): FaqTopic {
  const meta = FAQ_META.topics[key];
  const topicQuestions = FAQ_TOPICS.find((topic) => topic.name === meta.mdName)?.questions || [];
  return { ...meta, key, slug: TOPIC_SLUGS[key], questions: topicQuestions };
}

export function featuredPostForQuestion(questionNumber: number): FaqPost | null {
  const post = Object.values(FAQ_POSTS).find((item) => item.n === questionNumber);
  return post || null;
}

export function nearestQuestions(topic: FaqTopic, questionNumber: number): FaqQuestion[] {
  return topic.questions
    .filter((question) => question.n !== questionNumber)
    .sort((a, b) => Math.abs(a.n - questionNumber) - Math.abs(b.n - questionNumber))
    .slice(0, 3)
    .sort((a, b) => a.n - b.n);
}

export function formatNumber(value: number): string {
  return String(value).padStart(2, "0");
}

export const QUESTION_ROUTE_PATHS = [
  "/questions",
  ...allTopics().map((topic) => topicPath(topic.key)),
  ...allPosts().map(postPath),
];
