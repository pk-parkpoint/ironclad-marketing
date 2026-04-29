import { readFileSync } from "node:fs";
import path from "node:path";

function read(relativePath: string): string {
  return readFileSync(path.join(process.cwd(), relativePath), "utf8");
}

function assertContains(fileLabel: string, source: string, pattern: string) {
  if (!source.includes(pattern)) {
    throw new Error(`${fileLabel} is missing required pattern: ${pattern}`);
  }
}

function main() {
  const envExample = read(".env.example");
  const layout = read("app/layout.tsx");
  const analyticsRuntime = read("components/analytics/analytics-bootstrap.tsx");
  const analyticsEvents = read("components/analytics/analytics-events.ts");
  const analyticsLib = read("lib/analytics.ts");
  const aiReferrers = read("lib/ai-referrers.ts");
  const siteHeader = read("components/layout/site-header.tsx");
  const mobileBottomBar = read("components/layout/mobile-bottom-bar.tsx");
  const servicePage = read("app/plumbing/[slug]/page.tsx");

  assertContains(".env.example", envExample, "NEXT_PUBLIC_GA4_MEASUREMENT_ID");
  assertContains(".env.example", envExample, "NEXT_PUBLIC_GTM_ID");

  assertContains("app/layout.tsx", layout, "AnalyticsBootstrap");
  assertContains("app/layout.tsx", layout, "NEXT_PUBLIC_GTM_ID");
  assertContains("app/layout.tsx", layout, "NEXT_PUBLIC_GA4_MEASUREMENT_ID");

  for (const eventName of [
    "page_view",
    "cta_click",
    "phone_click",
    "text_click",
    "lead_submit_success",
    "booking_funnel_event",
    "scroll_depth",
    "faq_expand",
    "ai_referral_visit",
  ]) {
    const source = eventName === "lead_submit_success" ? analyticsLib : `${analyticsRuntime}\n${analyticsEvents}`;
    const fileLabel = eventName === "lead_submit_success" ? "lib/analytics.ts" : "analytics runtime";
    assertContains(fileLabel, source, eventName);
  }

  for (const aiHost of ["chatgpt.com", "gemini.google.com", "perplexity.ai"]) {
    assertContains("lib/ai-referrers.ts", aiReferrers, aiHost);
  }

  for (const attributionKey of [
    "utm_source",
    "utm_medium",
    "utm_campaign",
    "utm_term",
    "utm_content",
    "gclid",
    "fbclid",
    "msclkid",
  ]) {
    assertContains("lib/analytics.ts", analyticsLib, attributionKey);
  }

  assertContains("site-header.tsx", siteHeader, 'data-track-intent="phone"');
  assertContains("site-header.tsx", siteHeader, 'data-track-intent="book"');
  assertContains("mobile-bottom-bar.tsx", mobileBottomBar, 'data-track-intent="text"');
  assertContains("plumbing/[slug]/page.tsx", servicePage, 'data-track-intent="phone"');

  console.log("analytics audit passed: GA4/GTM bootstrap, runtime events, lead success tracking, UTM keys, and CTA intents wired");
}

main();
