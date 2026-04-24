const GOOGLEBOT_UA =
  "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)";

type LiveCheck = {
  label: string;
  path: string;
  requiredPatterns: RegExp[];
};

function fail(message: string): never {
  console.error(`phase0 live audit failed: ${message}`);
  process.exit(1);
}

function normalizeHtml(html: string): string {
  return html.replace(/<!-- -->/g, "").replace(/\s+/g, " ");
}

async function fetchHtml(baseUrl: string, path: string): Promise<string> {
  const response = await fetch(`${baseUrl}${path}`, {
    headers: {
      "user-agent": GOOGLEBOT_UA,
      accept: "text/html",
    },
    redirect: "follow",
  });

  if (!response.ok) {
    fail(`request failed for ${path}: ${response.status} ${response.statusText}`);
  }

  const html = await response.text();
  if (html.length < 1200) {
    fail(`${path} response too small (${html.length} bytes)`);
  }
  return normalizeHtml(html);
}

function assertMatches(html: string, pattern: RegExp, checkLabel: string) {
  if (!pattern.test(html)) {
    fail(`${checkLabel} missing required pattern: ${pattern.source}`);
  }
}

async function main() {
  const baseUrl = (process.env.AUDIT_BASE_URL ?? "https://ironcladtexas.com").replace(/\/$/, "");

  const indexablePaths = ["/about", "/book", "/careers", "/contact", "/reviews"];
  for (const path of indexablePaths) {
    const html = await fetchHtml(baseUrl, path);
    if (/meta name="robots" content="noindex/i.test(html)) {
      throw new Error(`${path} should be indexable but has noindex`);
    }
  }

  const ssrChecks: LiveCheck[] = [
    {
      label: "homepage",
      path: "/",
      requiredPatterns: [/The Plumber Austin Trusts\./i, /application\/ld\+json/i, /View All \d+ Services/i],
    },
    {
      label: "service page (core)",
      path: "/plumbing/repairs",
      requiredPatterns: [/Plumbing Repairs That Last/i, /application\/ld\+json/i, /Related Services and Resources/i],
    },
    {
      label: "service page (new)",
      path: "/plumbing/slab-leak-repair",
      requiredPatterns: [/Slab Leak Repair/i, /application\/ld\+json/i, /data-speakable/i],
    },
    {
      label: "city page",
      path: "/service-area/austin-tx",
      requiredPatterns: [/FAQ for\s*Austin/i, /application\/ld\+json/i, /Request Service in Austin/i],
    },
    {
      label: "FAQ hub",
      path: "/faq",
      requiredPatterns: [/Frequently Asked Questions/i, /application\/ld\+json/i],
    },
  ];

  for (const check of ssrChecks) {
    const html = await fetchHtml(baseUrl, check.path);
    for (const pattern of check.requiredPatterns) {
      assertMatches(html, pattern, check.label);
    }
  }

  console.log(`phase0 live audit passed for ${baseUrl}`);
}

main().catch((error) => {
  fail(error instanceof Error ? error.message : "unknown error");
});
