import { expect, test, type Page } from "@playwright/test";
import variantRecords from "../../content/ppc-service-variants.json";

const serviceRoute = "/plumbing/drain-clearing";
const localRoutes = ["/service-area/austin-tx", "/service-area/austin-tx/barton-creek"];

async function expectExcludedEffects(page: Page) {
  await expect(page.locator(".ic-underline, .ic-glass, [data-rotate], .ic-pulse-icon")).toHaveCount(0);
}

async function expectFastScrollCompletion(page: Page) {
  await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
  await expect.poll(() => page.locator("[data-reveal]:not([data-icr])").count()).toBe(0);
}

test("motion rollout covers all PPC service variants", () => {
  expect(variantRecords).toHaveLength(38);
  expect(new Set(variantRecords.map((variant) => variant.slug)).size).toBe(38);
});

test("service template carries the complete approved motion hook map", async ({ page }) => {
  await page.goto(serviceRoute);

  await expect(page.locator("[data-motion-root]")).toHaveClass(/ic-anim/);
  await expect(page.locator("[data-entrance]")).toHaveCount(1);
  await expect(page.locator(".ic-nudge")).toHaveCount(1);
  await expect(page.locator(".ic-pulse-dot")).toHaveCount(1);
  await expect(page.locator(".ic-sheen")).toHaveCount(2);
  await expectExcludedEffects(page);

  await expect(page.locator(".dc-guarantee-grid > [data-reveal]")).toHaveCount(4);
  await expect(page.locator(".dc-sign-row[data-reveal]")).toHaveCount(0);
  await expect(page.locator(".dc-service-card[data-reveal]")).toHaveCount(6);
  await expect(page.locator(".dc-review-card[data-reveal]")).toHaveCount(3);
  await expect(page.locator(".dc-why-item[data-reveal]")).toHaveCount(4);
  await expect(page.locator(".dc-process-step[data-reveal]")).toHaveCount(4);
  await expect(page.locator(".dc-radar[data-reveal]")).toHaveCount(1);
  await expect(page.locator(".dc-area-chip[data-reveal]")).toHaveCount(12);
  await expect(page.locator(".dc-faq-item[data-reveal]")).toHaveCount(0);
  await expect(page.locator(".dc-chrome-footer [data-reveal], .dc-sticky-cta [data-reveal]")).toHaveCount(0);
  expect(await page.locator("[data-count]").evaluateAll((nodes) => nodes.map((node) => node.getAttribute("data-count")))).toEqual([
    "142",
    "4.9",
    "19",
  ]);
  await expect(page.locator(".dc-stat-number").last()).toHaveText("19+");
  expect(await page.evaluate(() => typeof window.icMotionScan)).toBe("function");

  await page.evaluate(() => {
    const probe = document.createElement("div");
    probe.id = "motion-rescan-probe";
    probe.setAttribute("data-reveal", "");
    probe.style.height = "1px";
    document.querySelector("[data-motion-root]")?.prepend(probe);
  });
  await expect(page.locator("#motion-rescan-probe")).toHaveAttribute("data-icm", /reveal/);
  await expect(page.locator("#motion-rescan-probe")).toHaveAttribute("data-icr", "");

  await expectFastScrollCompletion(page);
});

test("city and neighborhood templates carry the approved local-page hook map", async ({ page }) => {
  for (const route of localRoutes) {
    await page.goto(route);

    await expect(page.locator("[data-motion-root]")).toHaveClass(/ic-anim/);
    await expect(page.locator("[data-entrance]")).toHaveCount(1);
    await expect(page.locator(".ic-nudge")).toHaveCount(1);
    await expect(page.locator(".ic-pulse-dot")).toHaveCount(1);
    await expect(page.locator(".ic-sheen")).toHaveCount(2);
    await expectExcludedEffects(page);

    await expect(page.locator(".local-guarantee-strip .local-grid > [data-reveal]")).toHaveCount(4);
    await expect(page.locator(".local-row[data-reveal]")).toHaveCount(0);
    await expect(page.locator(".local-band-services .local-link-card[data-reveal]")).toHaveCount(3);
    await expect(page.locator(".local-band-process .local-grid > [data-reveal]")).toHaveCount(4);
    await expect(page.locator(".local-why-item[data-reveal]")).toHaveCount(4);
    await expect(page.locator(".local-review-card[data-reveal]")).toHaveCount(3);
    await expect(page.locator(".local-area-ring")).toHaveCount(3);
    expect(await page.locator(".local-chip-list li[data-reveal]").count()).toBeGreaterThan(0);
    expect(await page.locator(".local-near-card[data-reveal]").count()).toBeGreaterThan(0);
    await expect(page.locator(".local-faq details[data-reveal]")).toHaveCount(0);
    await expect(page.locator(".local-footer [data-reveal], .local-sticky-bar [data-reveal]")).toHaveCount(0);
    await expect(page.locator(".local-band-knowledge [data-reveal]")).toHaveCount(0);
    expect(await page.locator("[data-count]").evaluateAll((nodes) => nodes.map((node) => node.getAttribute("data-count")))).toEqual([
      "142",
      "4.9",
      "142",
    ]);
    await expect(page.locator(".local-stat-item").filter({ hasText: "Emergency Service" }).locator("[data-count]")).toHaveCount(0);
    expect(await page.evaluate(() => typeof window.icMotionScan)).toBe("function");

    await expectFastScrollCompletion(page);
  }
});

test("service and local content is final and visible with reduced motion", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });

  for (const route of [serviceRoute, localRoutes[0]]) {
    await page.goto(route);
    await expect(page.locator("[data-motion-root]")).not.toHaveClass(/ic-anim/);
    await expect(page.locator("[data-reveal]").first()).toBeVisible();
    await expect(page.locator("[data-reveal]").first()).toHaveCSS("opacity", "1");
  }

  await expect(page.locator('[data-count="142"]').first()).toHaveText("142");
});

test("service and local content remains visible without JavaScript", async ({ browser }, testInfo) => {
  const baseURL = testInfo.project.use.baseURL as string;
  const context = await browser.newContext({ baseURL, javaScriptEnabled: false });
  const page = await context.newPage();

  for (const route of [serviceRoute, localRoutes[0]]) {
    await page.goto(route, { waitUntil: "domcontentloaded" });
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(page.locator("[data-reveal]").first()).toBeVisible();
    await expect(page.locator("[data-reveal]").first()).toHaveCSS("opacity", "1");
  }

  await context.close();
});
