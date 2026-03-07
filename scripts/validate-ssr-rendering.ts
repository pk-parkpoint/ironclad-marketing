import { readFileSync } from "node:fs";
import path from "node:path";

type PageAssertion = {
  label: string;
  relativeFile: string;
  requiredPatterns: RegExp[];
};

function fail(message: string): never {
  console.error(`ssr audit failed: ${message}`);
  process.exit(1);
}

function readBuiltHtml(relativeFile: string): string {
  const target = path.join(process.cwd(), ".next", "server", "app", relativeFile);
  try {
    return readFileSync(target, "utf8");
  } catch {
    fail(`missing built file: ${target}. Run \"npm run build\" first.`);
  }
}

function normalizeHtml(html: string): string {
  return html.replace(/<!-- -->/g, "").replace(/\s+/g, " ");
}

function assertMatches(haystack: string, pattern: RegExp, label: string) {
  if (!pattern.test(haystack)) {
    fail(`${label} is missing required SSR pattern: ${pattern.source}`);
  }
}

function main() {
  const checks: PageAssertion[] = [
    {
      label: "homepage",
      relativeFile: "index.html",
      requiredPatterns: [/The Plumber Austin Trusts\./i, /application\/ld\+json/i],
    },
    {
      label: "service page",
      relativeFile: "plumbing/repairs.html",
      requiredPatterns: [/Plumbing Repairs That Last/i, /application\/ld\+json/i, /Related Services and Resources/i],
    },
    {
      label: "city page",
      relativeFile: "service-area/austin-tx.html",
      requiredPatterns: [/FAQ for\s*Austin/i, /application\/ld\+json/i, /Request Service in Austin/i],
    },
  ];

  for (const check of checks) {
    const html = normalizeHtml(readBuiltHtml(check.relativeFile));
    if (html.length < 2000) {
      fail(`${check.label} HTML is unexpectedly small (${html.length} bytes)`);
    }

    for (const pattern of check.requiredPatterns) {
      assertMatches(html, pattern, check.label);
    }
  }

  console.log("ssr audit passed: homepage + service + city pages include rendered content and schema in built HTML");
}

main();
