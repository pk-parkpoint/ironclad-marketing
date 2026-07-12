import { expect, test } from "@playwright/test";

test("canonical FAQ hub motion initializes without layout shift or runtime errors", async ({ page }) => {
  const runtimeErrors: string[] = [];
  await page.addInitScript(() => {
    (window as Window & { __faqCls?: number }).__faqCls = 0;
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        const shift = entry as PerformanceEntry & { hadRecentInput?: boolean; value?: number };
        if (!shift.hadRecentInput) {
          (window as Window & { __faqCls?: number }).__faqCls! += shift.value ?? 0;
        }
      }
    }).observe({ type: "layout-shift", buffered: true });
  });
  page.on("pageerror", (error) => runtimeErrors.push(error.message));

  await page.goto("/questions");

  const root = page.locator("[data-motion-root]");
  await expect(root).toHaveClass(/ic-anim/);
  expect(await page.evaluate(() => typeof (window as Window & { icMotionScan?: () => void }).icMotionScan)).toBe(
    "function",
  );
  const sharedHeader = page.locator("header");
  await expect(sharedHeader).toHaveCount(1);
  if ((page.viewportSize()?.width ?? 1440) >= 1080) {
    await expect(sharedHeader.getByRole("link", { name: "Schedule Now" })).toBeVisible();
  } else {
    await expect(sharedHeader.getByRole("button", { name: "Open navigation menu" })).toBeVisible();
  }
  await expect(page.getByText("Schedule Now | 24/7")).toHaveCount(0);
  const headingParts = await page.getByRole("heading", { level: 1 }).evaluate((heading) =>
    Array.from(heading.childNodes)
      .map((node) => (node.nodeName === "BR" ? "<br>" : node.textContent?.trim()))
      .filter(Boolean),
  );
  expect(headingParts).toEqual(["Plumbing answers that", "<br>", "actually", "hold water."]);
  await expect(page.locator("[data-count]")).toHaveText("200");
  const rotatingWord = page.locator("[data-rotate]");
  const rotatingWrapper = rotatingWord.locator("..");
  await expect(rotatingWord).toHaveText("weak pressure");
  await expect(rotatingWord).toHaveCSS("color", "rgb(255, 255, 255)");
  expect(await rotatingWord.evaluate((word) => word.closest("p")?.textContent)).toContain(
    "weak pressure: what it usually is, what to do next, and when it's time to call.",
  );
  const initialRotatingWidth = (await rotatingWrapper.boundingBox())?.width ?? 0;
  await expect(rotatingWord).toHaveText("leaks", { timeout: 4_000 });
  await expect.poll(async () => (await rotatingWrapper.boundingBox())?.width ?? 0).toBeLessThan(initialRotatingWidth);
  if (await page.evaluate(() => window.matchMedia("(hover: hover) and (pointer: fine)").matches)) {
    await expect(page.locator(".ic-shine").first()).toBeAttached();
  } else {
    await expect(page.locator(".ic-shine")).toHaveCount(0);
  }
  await expect(page.locator(".ic-sheen")).toHaveCount(1);
  await expect(page.locator(".ic-pulse-dot")).toHaveCount(1);
  await expect(page.locator(".ic-nudge")).toHaveCount(1);

  const firstTopicCard = page.locator("[data-reveal]").first();
  await firstTopicCard.scrollIntoViewIfNeeded();
  await expect(firstTopicCard).toHaveAttribute("data-icm", /reveal/);
  await expect(firstTopicCard).toHaveAttribute("data-icr", "");
  await expect(firstTopicCard).toHaveClass(/ic-revealed/);

  await firstTopicCard.evaluate((element) => element.classList.remove("ic-revealed"));
  await expect(firstTopicCard).toHaveCSS("opacity", "1");

  await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
  await expect
    .poll(() => page.locator("[data-reveal]:not([data-icr])").count())
    .toBe(0);

  const cls = await page.evaluate(() => (window as Window & { __faqCls?: number }).__faqCls ?? 0);
  expect(cls).toBeLessThanOrEqual(0.01);
  expect(runtimeErrors).toEqual([]);
});

test("canonical FAQ content stays final and static with reduced motion", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/questions");

  await expect(page.locator("[data-motion-root]")).not.toHaveClass(/ic-anim/);
  expect(await page.evaluate(() => typeof (window as Window & { icMotionScan?: () => void }).icMotionScan)).toBe(
    "undefined",
  );
  await expect(page.locator("[data-count]")).toHaveText("200");
  await expect(page.locator(".ic-shine")).toHaveCount(0);

  const topicCard = page.locator("[data-reveal]").first();
  await expect(topicCard).toBeVisible();
  await expect(topicCard).toHaveCSS("opacity", "1");
});

test("canonical FAQ content remains visible when JavaScript is disabled", async ({ browser }, testInfo) => {
  const baseURL = testInfo.project.use.baseURL as string;
  const context = await browser.newContext({ baseURL, javaScriptEnabled: false });
  const page = await context.newPage();

  await page.goto("/questions", { waitUntil: "domcontentloaded" });
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await expect(page.locator("[data-reveal]").first()).toBeVisible();
  await expect(page.locator("[data-count]")).toHaveText("200");

  await context.close();
});

test("FAQ topic and post motion stays within the reading-page budget", async ({ page }) => {
  await page.goto("/questions/leaks/");
  await expect(page.locator("[data-motion-root]")).toHaveClass(/ic-anim/);
  await expect(page.locator("[data-entrance]")).toHaveCount(1);
  await expect(page.locator('[id^="q-"][data-reveal]')).toHaveCount(0);
  await expect(page.locator("[data-reveal]")).toHaveCount(2);
  await expect(page.locator("[data-reveal]").first()).toHaveAttribute("data-icm", /reveal/);

  await page.goto("/questions/leaks/what-to-do-when-a-pipe-bursts/");
  await expect(page.locator(".ic-pulse-icon")).toHaveCount(1);
  await expect(page.locator("[data-entrance]")).toHaveCount(1);
  expect(await page.locator("[data-reveal]").count()).toBeGreaterThanOrEqual(3);
});

test("FAQ motion rescans content added after a client render", async ({ page }) => {
  await page.goto("/questions");
  await expect(page.locator("[data-count]")).toHaveText("200");
  await expect(page.locator("[data-reveal]").first()).toHaveAttribute("data-icm", /reveal/);
  await page.locator("[data-motion-root]").evaluate((root) => {
    const reveal = document.createElement("div");
    reveal.id = "spa-motion-probe";
    reveal.dataset.reveal = "";
    reveal.textContent = "SPA motion probe";
    reveal.style.height = "24px";
    root.appendChild(reveal);
  });

  const probe = page.locator("#spa-motion-probe");
  await expect(probe).toHaveAttribute("data-icm", /reveal/);
  await probe.scrollIntoViewIfNeeded();
  await expect(probe).toHaveAttribute("data-icr", "");
  await expect(probe).toHaveClass(/ic-revealed/);
});

test("legacy FAQ accordions retain progressive motion behavior", async ({ page }) => {
  await page.goto("/faq");
  await expect(page.locator("[data-motion-root]")).toHaveClass(/ic-anim/);
  await expect(page.locator("header")).toHaveCount(1);
  await expect(page.locator("[data-motion-root] .ic-pulse-dot")).toHaveCount(1);
  await expect(page.locator("[data-motion-root] .ic-nudge")).toHaveCount(1);
  const firstFaq = page.locator("#category-general details").first();
  await firstFaq.locator("summary").click();
  await expect(firstFaq).toHaveAttribute("open", "");
  await expect(firstFaq.locator('[data-speakable="faq-answer"]')).toBeVisible();
});
