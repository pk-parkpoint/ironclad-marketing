function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function buildRouteMarkdownMap(source: string): Map<string, string> {
  const matches = [...source.matchAll(/^`\/guides\/([^`]+)`$/gm)];
  const entries = new Map<string, string>();

  matches.forEach((match, index) => {
    const slug = match[1];
    const matchIndex = match.index ?? 0;
    const lineEnd = source.indexOf("\n", matchIndex);
    const blockStart = lineEnd === -1 ? matchIndex + match[0].length : lineEnd + 1;
    const blockEnd = index + 1 < matches.length ? matches[index + 1].index ?? source.length : source.length;
    entries.set(slug, source.slice(blockStart, blockEnd).trim());
  });

  return entries;
}

function trimTrailingPageBoundary(markdownSource: string): string {
  return markdownSource
    .replace(
      /^# (?:PART|PAGE|ARTICLE|ARTICLES|COMPARISON|GUIDES HUB PAGE|IMPLEMENTATION NOTES)\b[\s\S]*$/m,
      "",
    )
    .trim();
}

function removeSection(markdownSource: string, heading: string): string {
  const pattern = new RegExp(`^## ${escapeRegex(heading)}\\n[\\s\\S]*?(?=^## |\\Z)`, "gm");
  return markdownSource.replace(pattern, "").trim();
}

export function sanitizeGuideMarkdown(markdownSource: string, slug: string): string {
  let sanitized = trimTrailingPageBoundary(markdownSource)
    .replace(/^## H1:.*$/gm, "")
    .replace(/^\[If applicable,.*$/gm, "")
    .replace(/^\[INSERT.*$/gm, "")
    .replace(/^## TLDR$/gm, "## Quick Answer")
    .replace(/^# Ironclad Open Price Guide.*$/gm, "")
    .replace(/^## Services [0-9-]+$/gm, "")
    .replace(/^Ironclad Plumbing publishes this guide because /gm, "Ironclad Plumbing publishes this guide because ")
    .trim();

  if (slug === "after-the-plumber-leaves") {
    sanitized = sanitized.replace(
      /^Ironclad Plumbing put this prep checklist together because 5 minutes of preparation before the tech arrives can save you time and money on the visit\.\n+/m,
      "",
    );
  }

  if (slug === "what-plumbing-costs-austin") {
    const blockedSections = [
      "Updated Quick-Scan Table (Full 30 Services)",
      "Additional Quick-Scan Table Rows",
      "Updated Quick-Scan Table Rows (Services 31-40)",
      "Updated Quick-Scan Table Rows (Services 41-50)",
      "Full Price Guide Now Covers 40 Services",
      "Full Price Guide Now Covers 50 Services",
    ];
    blockedSections.forEach((heading) => {
      sanitized = removeSection(sanitized, heading);
    });
  }

  return sanitized.replace(/\n{3,}/g, "\n\n").trim();
}

export function stripMarkdown(value: string): string {
  return value
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\[(.*?)\]\((.*?)\)/g, "$1")
    .replace(/[*_>#-]/g, " ")
    .replace(/\|/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function extractDescription(markdownSource: string, fallback: string): string {
  for (const line of markdownSource.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#") || trimmed.startsWith("|") || trimmed === "---") {
      continue;
    }
    const plain = stripMarkdown(trimmed);
    if (plain.length >= 80) {
      return plain;
    }
  }
  return fallback;
}
