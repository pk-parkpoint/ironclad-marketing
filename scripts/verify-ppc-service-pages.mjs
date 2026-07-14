import { chromium } from "@playwright/test";
import fs from "node:fs/promises";
import path from "node:path";

const baseUrl = process.env.BASE_URL || "http://127.0.0.1:3030";
const repoRoot = process.cwd();
const variantsPath = path.join(repoRoot, "content/ppc-service-variants.json");
const outputDir = path.join(repoRoot, "design-handoff/screens/service-page/qa/ppc-content");
const stateDir = path.join(repoRoot, "design-handoff/screens/service-page/states");
const serviceAssetPrefix = "assets/services/";
const desktopViewport = { width: 1440, height: 900 };
const mobileViewport = { width: 390, height: 844 };
const sweepWidths = [768, 1024, 639, 640, 641, 819, 820, 821, 1079, 1080, 1081, 1239, 1240, 1241];
const interactionStates = [
  ["hero-call-hover", ".dc-hero-ctas .dc-btn--call", "hover"],
  ["hero-call-focus", ".dc-hero-ctas .dc-btn--call", "focus"],
  ["hero-outline-hover", ".dc-hero-ctas .dc-btn--outline", "hover"],
  ["service-card-hover", ".dc-service-card", "hover"],
  ["ink-button-hover", ".dc-btn--ink", "hover"],
  ["reviews-link-focus", ".dc-inline-link", "focus"],
  ["faq-summary-hover", ".dc-faq-item summary", "hover"],
  ["faq-summary-focus", ".dc-faq-item summary", "focus"],
  ["area-schedule-hover", ".dc-area-copy .dc-btn--schedule", "hover"],
  ["final-call-focus", ".dc-final-cta .dc-btn--white", "focus"],
];

function routePath(slug) {
  return slug === "plumbing" ? "/plumbing" : `/plumbing/${slug}`;
}

function imagePath(assetPath) {
  if (!assetPath.startsWith(serviceAssetPrefix)) {
    return assetPath;
  }
  return `/media/services/${assetPath.slice(serviceAssetPrefix.length)}`;
}

function normalizeText(value) {
  return value.replace(/\s+/g, " ").trim();
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

async function readVariants() {
  const source = await fs.readFile(variantsPath, "utf8");
  return JSON.parse(source);
}

async function prepareLoadedPage(page, route) {
  await page.goto(`${baseUrl}${route}`, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  await page.addStyleTag({
    content: "*,*::before,*::after{animation:none!important;transition:none!important;scroll-behavior:auto!important;}",
  });
  await page.evaluate(async () => {
    const step = Math.max(240, Math.floor(window.innerHeight * 0.7));
    for (let y = 0; y <= document.documentElement.scrollHeight; y += step) {
      window.scrollTo(0, y);
      await new Promise((resolve) => window.setTimeout(resolve, 35));
    }
    window.scrollTo(0, 0);
  });
  await page.waitForLoadState("networkidle");
  await page.waitForTimeout(100);
}

async function prepareLayoutPage(page, route) {
  await page.goto(`${baseUrl}${route}`, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  await page.addStyleTag({
    content: "*,*::before,*::after{animation:none!important;transition:none!important;scroll-behavior:auto!important;}",
  });
  await page.waitForTimeout(50);
}

async function loadPage(browser, route, viewport) {
  const context = await browser.newContext({
    deviceScaleFactor: 1,
    reducedMotion: "reduce",
    viewport,
  });
  const page = await context.newPage();
  await prepareLoadedPage(page, route);
  return { context, page };
}

async function textContent(page, selector) {
  return normalizeText((await page.locator(selector).first().textContent()) || "");
}

async function verifyVariantAtViewport(browser, variant, viewportName, viewport) {
  const route = routePath(variant.slug);
  const { context, page } = await loadPage(browser, route, viewport);

  try {
    const title = await page.title();
    const h1 = await textContent(page, "[data-slot='hero-title']");
    const signsTitle = await textContent(page, "[data-slot='signs-title']");
    const servicesTitle = await textContent(page, "[data-slot='services-title']");
    const faqTitle = await textContent(page, ".dc-container--faq h2");
    const finalTitle = await textContent(page, "[data-slot='cta-title']");
    const bookingHref = await page.locator(`a[href*="/book?service=${variant.slug}"]`).first().getAttribute("href");
    const serviceCards = await page.locator(".dc-service-card").count();
    const imageInfo = await page.locator(".dc-service-card-img").evaluateAll((images) =>
      images.map((image) => ({
        complete: image.complete,
        naturalHeight: image.naturalHeight,
        naturalWidth: image.naturalWidth,
        src: decodeURIComponent(image.currentSrc || image.src),
      })),
    );
    const overflow = await page.evaluate(() => {
      const root = document.querySelector("#dc-root");
      if (!(root instanceof HTMLElement)) {
        throw new Error("missing #dc-root");
      }
      return {
        bodyScrollWidth: document.body.scrollWidth,
        clientWidth: document.documentElement.clientWidth,
        docScrollWidth: document.documentElement.scrollWidth,
        rootClientWidth: root.clientWidth,
        rootScrollWidth: root.scrollWidth,
        viewportWidth: window.innerWidth,
      };
    });
    const screenshot = path.join(outputDir, `${variant.slug}-${viewportName}.png`);

    await page.screenshot({ fullPage: true, path: screenshot });

    assert(title === variant.seoTitle, `${route} ${viewportName}: title mismatch`);
    assert(h1 === variant.h1, `${route} ${viewportName}: H1 mismatch`);
    assert(signsTitle === variant.signsHeading, `${route} ${viewportName}: signs heading mismatch`);
    assert(servicesTitle === variant.servicesHeading, `${route} ${viewportName}: services heading mismatch`);
    assert(faqTitle === variant.faqHeading, `${route} ${viewportName}: FAQ heading mismatch`);
    assert(finalTitle === variant.finalHeading, `${route} ${viewportName}: final CTA heading mismatch`);
    assert(Boolean(bookingHref), `${route} ${viewportName}: missing booking href for service=${variant.slug}`);
    assert(serviceCards === 6, `${route} ${viewportName}: expected 6 service cards, found ${serviceCards}`);
    assert(imageInfo.length === 6, `${route} ${viewportName}: expected 6 service images, found ${imageInfo.length}`);

    const expectedImages = variant.services.map((service) => imagePath(service.image));
    for (const expected of expectedImages) {
      assert(
        imageInfo.some((image) => image.src.includes(expected) && image.complete && image.naturalWidth > 0),
        `${route} ${viewportName}: missing loaded image ${expected}`,
      );
    }

    const rootOverflow = overflow.rootScrollWidth - overflow.rootClientWidth;
    assert(rootOverflow <= 1, `${route} ${viewportName}: service body horizontal overflow`);

    return {
      documentHorizontalOverflow: overflow.docScrollWidth > overflow.clientWidth + 1,
      route,
      screenshot,
      serviceCards,
      title,
      viewport: viewportName,
    };
  } finally {
    await context.close();
  }
}

async function verifySweep(browser, variants) {
  const results = [];

  for (const width of sweepWidths) {
    console.log(`sweep width ${width}`);
    const context = await browser.newContext({
      deviceScaleFactor: 1,
      reducedMotion: "reduce",
      viewport: { width, height: 900 },
    });
    const page = await context.newPage();

    try {
      for (const variant of variants) {
        const route = routePath(variant.slug);
        await prepareLayoutPage(page, route);
        const metrics = await page.evaluate(() => {
          const root = document.querySelector("#dc-root");
          if (!(root instanceof HTMLElement)) {
            throw new Error("missing #dc-root");
          }
          return {
            bodyScrollWidth: document.body.scrollWidth,
            clientWidth: document.documentElement.clientWidth,
            docScrollWidth: document.documentElement.scrollWidth,
            rootClientWidth: root.clientWidth,
            rootScrollWidth: root.scrollWidth,
            viewportWidth: window.innerWidth,
          };
        });
        const serviceBodyHorizontalOverflow = metrics.rootScrollWidth > metrics.rootClientWidth + 1;

        assert(!serviceBodyHorizontalOverflow, `${route} ${width}px: service body horizontal overflow`);
        results.push({
          route,
          width,
          ...metrics,
          documentHorizontalOverflow: metrics.docScrollWidth > metrics.clientWidth + 1,
          serviceBodyHorizontalOverflow,
        });
      }
    } finally {
      await context.close();
    }
  }

  return results;
}

async function styleSnapshot(locator) {
  return locator.evaluate((element) => {
    const style = window.getComputedStyle(element);
    return {
      backgroundColor: style.backgroundColor,
      borderColor: style.borderColor,
      boxShadow: style.boxShadow,
      color: style.color,
      filter: style.filter,
      outlineColor: style.outlineColor,
      outlineStyle: style.outlineStyle,
      outlineWidth: style.outlineWidth,
      transform: style.transform,
    };
  });
}

function styleChanged(before, after) {
  return Object.keys(before).some((key) => before[key] !== after[key]);
}

async function verifyInteractionStates(browser) {
  const route = "/plumbing/drain-clearing";
  const { context, page } = await loadPage(browser, route, desktopViewport);
  const results = [];

  try {
    for (const [name, selector, action] of interactionStates) {
      await page.evaluate(() => {
        if (document.activeElement instanceof HTMLElement) document.activeElement.blur();
        window.scrollTo(0, 0);
      });
      const locator = page.locator(selector).first();
      await locator.scrollIntoViewIfNeeded();
      const before = await styleSnapshot(locator);

      if (action === "hover") {
        await locator.hover();
      } else {
        await locator.focus();
      }

      const after = await styleSnapshot(locator);
      const screenshot = path.join(stateDir, `${name}.png`);
      await page.screenshot({ fullPage: false, path: screenshot });
      results.push({
        action,
        changed: styleChanged(before, after),
        name,
        screenshot,
        selector,
      });
    }
  } finally {
    await context.close();
  }

  return results;
}

await fs.mkdir(outputDir, { recursive: true });
await fs.mkdir(stateDir, { recursive: true });

const variants = await readVariants();
assert(Array.isArray(variants) && variants.length === 31, `expected 31 variants, found ${variants.length}`);

const browser = await chromium.launch();
try {
  const base = [];
  for (const variant of variants) {
    console.log(`checking base ${variant.slug}`);
    base.push(await verifyVariantAtViewport(browser, variant, "desktop", desktopViewport));
    base.push(await verifyVariantAtViewport(browser, variant, "mobile", mobileViewport));
  }
  console.log("checking responsive sweep");
  const sweep = await verifySweep(browser, variants);
  console.log("checking interaction states");
  const states = await verifyInteractionStates(browser);
  const failedStates = states.filter((state) => !state.changed);
  assert(failedStates.length === 0, `interaction states did not change: ${failedStates.map((state) => state.name).join(", ")}`);

  const summary = {
    base,
    checkedAt: new Date().toISOString(),
    formats: ["desktop", "mobile"],
    interactions: states,
    routeCount: variants.length,
    sweep,
  };
  const summaryPath = path.join(outputDir, "verification-summary.json");
  await fs.writeFile(summaryPath, `${JSON.stringify(summary, null, 2)}\n`);
  console.log(JSON.stringify({
    baseScreenshots: base.length,
    interactionStates: states.length,
    routeCount: variants.length,
    summaryPath,
    sweepChecks: sweep.length,
  }, null, 2));
} finally {
  await browser.close();
}
