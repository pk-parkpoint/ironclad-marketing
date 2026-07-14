import { chromium } from "@playwright/test";
import fs from "node:fs/promises";
import path from "node:path";
import pixelmatch from "pixelmatch";
import { PNG } from "pngjs";

const baseUrl = process.env.BASE_URL || "http://127.0.0.1:3027";
const pagePath = "/plumbing/drain-clearing";
const screenDir = path.join(process.cwd(), "design-handoff/screens/service-page");
const qaDir = path.join(screenDir, "qa");
const stateDir = path.join(screenDir, "states");

const baseScreens = [
  {
    name: "desktop",
    viewport: { width: 1440, height: 900 },
    reference: path.join(screenDir, "reference-desktop.png"),
  },
  {
    name: "mobile",
    viewport: { width: 390, height: 844 },
    reference: path.join(screenDir, "reference-mobile.png"),
  },
];

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

function whitePng(width, height) {
  const image = new PNG({ width, height });
  for (let index = 0; index < image.data.length; index += 4) {
    image.data[index] = 255;
    image.data[index + 1] = 255;
    image.data[index + 2] = 255;
    image.data[index + 3] = 255;
  }
  return image;
}

async function readPng(filePath) {
  const buffer = await fs.readFile(filePath);
  return PNG.sync.read(buffer);
}

async function diffImages(referencePath, actualPath, diffPath) {
  const reference = await readPng(referencePath);
  const actual = await readPng(actualPath);
  const width = Math.max(reference.width, actual.width);
  const height = Math.max(reference.height, actual.height);
  const referenceCanvas = whitePng(width, height);
  const actualCanvas = whitePng(width, height);
  const diff = new PNG({ width, height });

  PNG.bitblt(reference, referenceCanvas, 0, 0, reference.width, reference.height, 0, 0);
  PNG.bitblt(actual, actualCanvas, 0, 0, actual.width, actual.height, 0, 0);

  const mismatchedPixels = pixelmatch(referenceCanvas.data, actualCanvas.data, diff.data, width, height, {
    threshold: 0.1,
  });
  await fs.writeFile(diffPath, PNG.sync.write(diff));

  return {
    actualHeight: actual.height,
    actualWidth: actual.width,
    diffPath,
    mismatchedPixels,
    percent: (mismatchedPixels / (width * height)) * 100,
    referenceHeight: reference.height,
    referenceWidth: reference.width,
  };
}

async function preparePage(browser, viewport) {
  const context = await browser.newContext({
    deviceScaleFactor: 1,
    reducedMotion: "reduce",
    viewport,
  });
  const page = await context.newPage();
  await page.goto(`${baseUrl}${pagePath}`, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  await page.addStyleTag({
    content:
      "*,*::before,*::after{animation:none!important;transition:none!important;scroll-behavior:auto!important;}",
  });
  await page.waitForTimeout(250);
  return { context, page };
}

async function captureBaseScreens(browser) {
  const results = [];
  for (const screen of baseScreens) {
    const { context, page } = await preparePage(browser, screen.viewport);
    const actual = path.join(screenDir, `actual-${screen.name}.png`);
    const diff = path.join(screenDir, `diff-residual-${screen.name}.png`);
    await page.screenshot({ fullPage: true, path: actual });
    const result = await diffImages(screen.reference, actual, diff);
    results.push({ ...result, actual, name: screen.name });
    await context.close();
  }
  return results;
}

async function captureSweep(browser) {
  const results = [];
  for (const width of sweepWidths) {
    const { context, page } = await preparePage(browser, { width, height: 900 });
    const screenshot = path.join(qaDir, `sweep-${width}.png`);
    await page.screenshot({ fullPage: true, path: screenshot });
    const metrics = await page.evaluate(() => ({
      clientWidth: document.documentElement.clientWidth,
      scrollWidth: document.documentElement.scrollWidth,
      viewportWidth: window.innerWidth,
    }));
    results.push({
      horizontalOverflow: metrics.scrollWidth > metrics.clientWidth + 1,
      screenshot,
      width,
      ...metrics,
    });
    await context.close();
  }
  return results;
}

async function captureInteractionStates(browser) {
  const { context, page } = await preparePage(browser, { width: 1440, height: 900 });
  const results = [];

  for (const [name, selector, action] of interactionStates) {
    await page.evaluate(() => {
      if (document.activeElement instanceof HTMLElement) document.activeElement.blur();
      window.scrollTo(0, 0);
    });
    const locator = page.locator(selector).first();
    await locator.scrollIntoViewIfNeeded();
    if (action === "hover") {
      await locator.hover();
    } else {
      await locator.focus();
    }
    const screenshot = path.join(stateDir, `${name}.png`);
    await page.screenshot({ fullPage: false, path: screenshot });
    results.push({ action, name, screenshot, selector });
  }

  await context.close();
  return results;
}

await fs.mkdir(qaDir, { recursive: true });
await fs.mkdir(stateDir, { recursive: true });

const browser = await chromium.launch();
try {
  const base = await captureBaseScreens(browser);
  const sweep = await captureSweep(browser);
  const states = await captureInteractionStates(browser);
  const summary = { base, states, sweep };
  await fs.writeFile(path.join(screenDir, "verification-summary.json"), `${JSON.stringify(summary, null, 2)}\n`);
  console.log(JSON.stringify(summary, null, 2));
} finally {
  await browser.close();
}
