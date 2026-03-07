import { FAQ_ENTRIES } from "@/content/faqs";

export const HOME_FAQ_ITEMS = FAQ_ENTRIES.slice(0, 10).map((entry) => ({
  answer: entry.answer,
  question: entry.question,
}));
