import fs from "node:fs";
import path from "node:path";
import {
  DRAIN_CLEANING_TEMPLATE,
  type DrainCleaningTemplateContent,
} from "@/components/service-template/drain-cleaning-data";
import type { ServiceEntry } from "@/content/services";

export type PpcServiceVariant = {
  content: DrainCleaningTemplateContent;
  service: ServiceEntry;
  slug: string;
};

const VARIANT_FILES = [
  "01-drain-cleaning.md",
  "02-clogged-drain.md",
  "03-toilet-repair.md",
  "04-emergency-plumber.md",
  "05-burst-pipe-repair.md",
  "06-leak-repair.md",
  "07-water-heater-repair.md",
  "08-garbage-disposal-repair.md",
  "09-sump-pump-repair.md",
  "10-faucet-repair.md",
  "11-water-heater-installation.md",
  "12-tankless-installation.md",
  "13-repiping.md",
  "14-leak-detection.md",
  "15-slab-leak-repair.md",
  "16-sewer-line-repair.md",
  "17-hydro-jetting.md",
  "18-gas-line-service.md",
  "19-bathroom-plumbing.md",
  "20-water-treatment.md",
] as const;

const VARIANT_DIR = path.join(process.cwd(), "design-handoff/ppc-variants/pages");
const SERVICE_CARD_MEDIA = DRAIN_CLEANING_TEMPLATE.services.cards.map((card) => ({
  caption: card[2],
  imageSrc: card[3],
}));
let cache: PpcServiceVariant[] | undefined;

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function requiredMatch(markdown: string, pattern: RegExp, label: string, fileName: string): string {
  const match = markdown.match(pattern);
  if (!match) {
    throw new Error(`PPC variant ${fileName} is missing ${label}`);
  }
  return match[1].trim();
}

function requiredField(markdown: string, label: string, fileName: string): string {
  const pattern = new RegExp(`- \\*\\*${escapeRegExp(label)}:\\*\\*\\s*(.+)`);
  return requiredMatch(markdown, pattern, label, fileName);
}

function markdownBlock(markdown: string, headingPrefix: string, fileName: string): string {
  const start = markdown.search(new RegExp(`^## ${escapeRegExp(headingPrefix)}`, "m"));
  if (start < 0) {
    throw new Error(`PPC variant ${fileName} is missing ${headingPrefix}`);
  }
  const rest = markdown.slice(start);
  const next = rest.slice(1).search(/^## /m);
  return next < 0 ? rest : rest.slice(0, next + 1);
}

function numberedPairs(block: string, count: number, label: string, fileName: string): Array<readonly [string, string]> {
  const pairs = [...block.matchAll(/^\s*\d+\. \*\*(.+?)\*\*\s+\u2014\s+(.+)$/gm)].map(
    (match) => [match[1].trim(), match[2].trim()] as const,
  );
  if (pairs.length !== count) {
    throw new Error(`PPC variant ${fileName} expected ${count} ${label}, found ${pairs.length}`);
  }
  return pairs;
}

function parseVariant(fileName: string): PpcServiceVariant {
  const markdown = fs.readFileSync(path.join(VARIANT_DIR, fileName), "utf8");
  const slug = requiredMatch(markdown, /\*\*Suggested page slug:\*\*\s+`\/plumbing\/([^`]+)`/, "slug", fileName);
  const titleTag = requiredField(markdown, "Title tag", fileName);
  const metaDescription = requiredField(markdown, "Meta description", fileName);
  const heroTitle = requiredField(markdown, "H1 (keyword)", fileName);
  const serviceTitle = requiredMatch(markdown, /^#\s+\d+\.\s+(.+?)\s+\u2014/m, "service title", fileName);
  const signsBlock = markdownBlock(markdown, "Section 2", fileName);
  const servicesBlock = markdownBlock(markdown, "Section 3", fileName);
  const servicePairs = numberedPairs(servicesBlock, 6, "service cards", fileName);

  const content: DrainCleaningTemplateContent = {
    ...DRAIN_CLEANING_TEMPLATE,
    hero: {
      ...DRAIN_CLEANING_TEMPLATE.hero,
      subhead: requiredField(markdown, "Subhead (pun)", fileName),
      supportLine: requiredField(markdown, "Support line", fileName),
      title: heroTitle,
    },
    services: {
      cards: servicePairs.map(
        ([title, body], index) =>
          [title, body, SERVICE_CARD_MEDIA[index]?.caption ?? "Photo pending", SERVICE_CARD_MEDIA[index]?.imageSrc] as const,
      ),
      intro: requiredField(servicesBlock, "Intro", fileName),
      title: requiredField(servicesBlock, "Heading", fileName),
    },
    signs: {
      intro: requiredField(signsBlock, "Intro", fileName),
      items: numberedPairs(signsBlock, 4, "sign rows", fileName),
      title: requiredField(signsBlock, "Heading", fileName),
    },
  };

  return {
    content,
    service: {
      h1: heroTitle,
      metaDescription,
      slug,
      title: serviceTitle,
      titleTag,
    },
    slug,
  };
}

export function getPpcServiceVariants(): PpcServiceVariant[] {
  cache ??= VARIANT_FILES.map(parseVariant);
  return cache;
}

export function getPpcServiceVariant(slug: string): PpcServiceVariant | undefined {
  return getPpcServiceVariants().find((variant) => variant.slug === slug);
}

export function getPpcServiceVariantSlugs(): string[] {
  return getPpcServiceVariants().map((variant) => variant.slug);
}
