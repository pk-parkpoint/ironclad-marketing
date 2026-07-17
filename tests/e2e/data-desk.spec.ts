import { expect, test } from "@playwright/test";
import { DATA_DESK_EXPERIENCES, DATA_DESK_PRODUCTS } from "../../content/data-desk";

test("Data Desk hub exposes all 25 products through the Guides navigation", async ({ page }) => {
  await page.goto("/data");
  await expect(page.getByRole("heading", { level: 1, name: "Austin Home Data Desk" })).toBeVisible();
  await expect(page.locator("main .dd-hub-card")).toHaveCount(25);
  await expect(page.locator('nav[aria-label="Primary"] a[href="/data"]')).toHaveCount(1);
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", /\/data$/);
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
});

test("every product has stable metadata, interactive content, related products and current guides", async ({ request }) => {
  for (const product of DATA_DESK_PRODUCTS) {
    const response = await request.get(`/data/${product.slug}`);
    expect(response.status(), product.slug).toBe(200);
    const html = await response.text();
    const escapedTitle = product.metaTitle.replaceAll("&", "&amp;");
    expect(html, `${product.slug} title`).toContain(`<title>${escapedTitle}</title>`);
    expect(html, `${product.slug} description`).toContain(`content="${product.metaDescription}"`);
    expect(html, `${product.slug} canonical`).toMatch(new RegExp(`<link rel="canonical" href="[^"]*/data/${product.slug}"`));
    expect(html, `${product.slug} robots`).toMatch(/<meta name="robots" content="[^"]*noindex[^"]*follow/);
    expect(html, `${product.slug} preview`).toContain("Interactive preview");
    expect(html, `${product.slug} related products`).toContain("Related Data Desk products");
    expect(html, `${product.slug} current guides`).toContain("Published guidance available now");
  }
});

test("gauge, select and picker controls update their documented result", async ({ page }) => {
  await page.goto("/data/austin-freeze-pipe-risk");
  await page.getByRole("button", { name: "Moderate", exact: true }).click();
  await expect(page.locator(".dd-gauge strong")).toHaveText("46");

  await page.goto("/data/austin-plumbing-cost-index");
  await page.getByLabel("Choose a completed job type").selectOption("slab-leak-repair");
  await expect(page.locator(".dd-result-rows dd").first()).toHaveText("$6,900");

  await page.goto("/data/austin-plumbing-emergency-pulse");
  await page.getByRole("button", { name: "Water-heater failures" }).click();
  await expect(page.locator(".dd-result-rows dd").first()).toHaveText("12% above normal");
});

test("search controls expose an 850ms checking state and deterministic results", async ({ page }) => {
  await page.goto("/data/austin-home-plumbing-risk-report");
  await page.getByLabel("Search an Austin address").fill("1600 Tinnin Ford Rd");
  await page.getByRole("button", { name: "Search", exact: true }).click();
  await expect(page.getByText("Checking records for 1600 Tinnin Ford Rd…")).toBeVisible();
  await expect(page.getByText("Mapped flood-hazard context nearby")).toBeVisible();
});

test("both calculators recompute live without a submit step", async ({ page }) => {
  await page.goto("/data/austin-leak-cost-calculator", { waitUntil: "networkidle" });
  await page.getByLabel("Enter observed drips per minute").fill("300");
  await expect(page.locator(".dd-result-rows dd").nth(2)).toHaveText("$10.93");

  await page.goto("/data/water-heater-decision-lab", { waitUntil: "networkidle" });
  await page.getByLabel("Installation year").fill("2000");
  await page.getByRole("button", { name: "Tankless" }).click();
  await expect(page.locator(".dd-status")).toHaveText("Replace now");
});

test("motion runs normally and resolves to fully visible static content when reduced", async ({ page }) => {
  await page.goto("/data/austin-freeze-pipe-risk");
  await expect(page.locator("[data-motion-root]")).toHaveClass(/ic-anim/);
  await expect(page.locator(".dd-gauge-fill")).toHaveCSS("animation-name", "dd-gauge-draw");
  await expect(page.locator(".dd-icon-tile")).toHaveCSS("animation-name", "dd-float");

  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.reload();
  await expect(page.locator("[data-motion-root]")).not.toHaveClass(/ic-anim/);
  await expect(page.locator(".dd-gauge-fill")).toHaveCSS("animation-name", "none");
  await expect(page.locator("[data-reveal]").first()).toHaveCSS("opacity", "1");
});

test("all 25 mobile routes fit the viewport and retain the phone action", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  for (const product of DATA_DESK_PRODUCTS) {
    await page.goto(`/data/${product.slug}`, { waitUntil: "domcontentloaded" });
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(page.locator(".dd-phone")).toBeVisible();
    await expect(page.locator(".dd-nav")).toBeHidden();
    const widths = await page.evaluate(() => ({ client: document.documentElement.clientWidth, scroll: document.documentElement.scrollWidth }));
    expect(widths.scroll, `${product.slug} horizontal overflow`).toBeLessThanOrEqual(widths.client);
  }
});

test("all 25 desktop routes render their default tool state without overflow", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  for (const product of DATA_DESK_PRODUCTS) {
    await page.goto(`/data/${product.slug}`, { waitUntil: "domcontentloaded" });
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(page.locator(".dd-control-card")).toBeVisible();
    await expect(page.locator(".dd-result-card")).toBeVisible();
    await expect(page.locator(".dd-nav")).toBeVisible();
    const widths = await page.evaluate(() => ({ client: document.documentElement.clientWidth, scroll: document.documentElement.scrollWidth }));
    expect(widths.scroll, `${product.slug} desktop horizontal overflow`).toBeLessThanOrEqual(widths.client);
  }
});

test("desktop and mobile computed styles match the handoff numeric contract", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/data/austin-freeze-pipe-risk");
  const desktop = await page.evaluate(() => {
    const h1 = getComputedStyle(document.querySelector(".dd-hero h1")!);
    const hero = getComputedStyle(document.querySelector(".dd-hero")!);
    const grid = getComputedStyle(document.querySelector(".dd-four-grid")!);
    return { fontFamily: h1.fontFamily, fontSize: h1.fontSize, fontWeight: h1.fontWeight, lineHeight: h1.lineHeight, heroTop: hero.paddingTop, heroBottom: hero.paddingBottom, columns: grid.gridTemplateColumns.split(" ").length };
  });
  expect(desktop).toEqual(expect.objectContaining({ fontFamily: expect.stringContaining("Schibsted Grotesk"), fontSize: "50px", fontWeight: "800", lineHeight: "52px", heroTop: "56px", heroBottom: "66px", columns: 4 }));

  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/data/austin-plumbing-cost-index");
  const mobile = await page.evaluate(() => {
    const h1 = getComputedStyle(document.querySelector(".dd-hero h1")!);
    const nav = getComputedStyle(document.querySelector(".dd-nav")!);
    const grid = getComputedStyle(document.querySelector(".dd-four-grid")!);
    const rows = getComputedStyle(document.querySelector(".dd-result-rows > div")!);
    return { fontSize: h1.fontSize, nav: nav.display, columns: grid.gridTemplateColumns.split(" ").length, rowColumns: rows.gridTemplateColumns.split(" ").length };
  });
  expect(mobile).toEqual({ fontSize: "38px", nav: "none", columns: 1, rowColumns: 2 });
});

test("all experience definitions are represented by their static route", async ({ request }) => {
  expect(DATA_DESK_EXPERIENCES).toHaveLength(25);
  for (const experience of DATA_DESK_EXPERIENCES) {
    const response = await request.get(`/data/${experience.slug}`);
    expect(await response.text(), experience.slug).toContain(experience.headline);
  }
});

test("product content remains visible without JavaScript", async ({ browser }) => {
  const context = await browser.newContext({ baseURL: "http://127.0.0.1:4010", javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto("/data/austin-freeze-pipe-risk");
  await expect(page.getByRole("heading", { name: "Four signals, one usable local picture." })).toBeVisible();
  await expect(page.locator("[data-reveal]").first()).toHaveCSS("opacity", "1");
  await context.close();
});

test("Guides hub links prominently to the Data Desk", async ({ page }) => {
  await page.goto("/guides");
  await expect(page.getByRole("link", { name: /Explore 25 planned Austin home-data products/ })).toHaveAttribute("href", "/data");
});
