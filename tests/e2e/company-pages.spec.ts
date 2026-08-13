import { expect, test } from "@playwright/test";

const PAGES = [
  {
    route: "/about",
    slug: "about",
    heading: "Family Owned, Austin Grown",
    rowsHeading: "What That Actually Means",
    processHeading: "What Hiring Ironclad Looks Like",
    whyHeading: "Why Austin Keeps Calling",
    faqHeading: "About Ironclad, Answered",
  },
  {
    route: "/guarantees",
    slug: "guarantees",
    heading: "The Ironclad Guarantee",
    rowsHeading: "The Five Guarantees",
    processHeading: "How to Use a Guarantee",
    whyHeading: "Why We Care About This",
    faqHeading: "Guarantee Questions, Answered",
  },
  {
    route: "/careers",
    slug: "careers",
    heading: "Build a Career With a Family That Works",
    rowsHeading: "What We Look For",
    processHeading: "How Hiring Works Here",
    whyHeading: "Why Our Techs Stay",
    faqHeading: "Careers Questions, Answered",
  },
] as const;

const CURRENT_PHONE_HREF = "tel:+15125062470";
const CAREERS_EMAIL_HREF = "mailto:info@ironcladtexas.com?subject=Ironclad%20Careers";

function isProtectedShellWarning(message: string) {
  return message.includes("two children with the same key") && message.includes("/service-area/austin-tx");
}

for (const pageConfig of PAGES) {
  test(`${pageConfig.route} renders the complete approved company-page design`, async ({ page }) => {
    const runtimeErrors: string[] = [];
    page.on("pageerror", (error) => runtimeErrors.push(error.message));
    page.on("console", (message) => {
      if (message.type() === "error") runtimeErrors.push(message.text());
    });

    const response = await page.goto(pageConfig.route);
    expect(response?.status()).toBe(200);

    const root = page.locator(`[data-company-page="${pageConfig.slug}"]`);
    await expect(root).toBeVisible();
    await expect(root.getByRole("heading", { level: 1, name: pageConfig.heading })).toBeVisible();
    await expect(root.getByRole("heading", { level: 2, name: pageConfig.rowsHeading })).toBeVisible();
    await expect(root.getByRole("heading", { level: 2, name: pageConfig.processHeading })).toBeVisible();
    await expect(root.getByRole("heading", { level: 2, name: pageConfig.whyHeading })).toBeVisible();
    await expect(root.getByRole("heading", { level: 2, name: pageConfig.faqHeading })).toBeVisible();
    await expect(root.locator("details")).toHaveCount(6);

    const designMetrics = await root.evaluate((element) => {
      const heading = element.querySelector("h1");
      const image = element.querySelector("img");
      const pillars = element.querySelector('[data-company-section="pillars"]');
      const rows = element.querySelector('[data-company-section="rows"]');
      const process = element.querySelector('[data-company-section="process"]');
      const why = element.querySelector('[data-company-section="why"]');
      const faq = element.querySelector('[data-company-section="faq"]');
      const final = element.querySelector('[data-company-section="final"]');
      if (!heading || !image || !pillars || !rows || !process || !why || !faq || !final) {
        throw new Error("Company design contract is incomplete");
      }

      const countColumns = (container: Element | null) => {
        if (!container) throw new Error("Company grid is incomplete");
        return getComputedStyle(container).gridTemplateColumns.split(" ").length;
      };

      return {
        headingSize: getComputedStyle(heading).fontSize,
        imagePosition: getComputedStyle(image).objectPosition,
        pillarBackground: getComputedStyle(pillars).backgroundColor,
        pillarColumns: countColumns(pillars.querySelector("article")?.parentElement ?? null),
        rowCount: rows.querySelectorAll("article").length,
        processBackground: getComputedStyle(process).backgroundColor,
        processColumns: countColumns(process.querySelector("article")?.parentElement ?? null),
        whyBackground: getComputedStyle(why).backgroundColor,
        whyItemCount: why.querySelectorAll("article").length,
        statCount: why.querySelectorAll("strong").length,
        faqCount: faq.querySelectorAll("details").length,
        finalBackground: getComputedStyle(final).backgroundColor,
        contentOverflow: element.scrollWidth > element.clientWidth,
      };
    });

    expect(designMetrics).toMatchObject({
      headingSize: "50px",
      imagePosition: "72% 53%",
      pillarBackground: "rgb(22, 32, 43)",
      pillarColumns: 4,
      processBackground: "rgb(30, 42, 56)",
      processColumns: 4,
      whyBackground: "rgb(18, 24, 31)",
      whyItemCount: 4,
      statCount: 3,
      faqCount: 6,
      finalBackground: "rgb(22, 32, 43)",
      contentOverflow: false,
    });
    expect(designMetrics.rowCount).toBe(pageConfig.slug === "guarantees" ? 5 : 4);
    expect(runtimeErrors.filter((message) => !isProtectedShellWarning(message))).toEqual([]);
  });
}

test("company pages keep the approved two-column mobile pillar layout without overflow", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });

  for (const pageConfig of PAGES) {
    await page.goto(pageConfig.route);
    const root = page.locator(`[data-company-page="${pageConfig.slug}"]`);
    const metrics = await root.evaluate((element) => {
      const heading = element.querySelector("h1");
      const pillars = element.querySelector("section:nth-of-type(2) > div > div");
      if (!heading || !pillars) throw new Error("Responsive company layout is incomplete");
      return {
        headingSize: getComputedStyle(heading).fontSize,
        pillarColumns: getComputedStyle(pillars).gridTemplateColumns.split(" ").length,
        bodyOverflow: document.body.scrollWidth > window.innerWidth,
      };
    });

    expect(metrics).toEqual({ headingSize: "37px", pillarColumns: 2, bodyOverflow: false });
  }
});

for (const pageConfig of PAGES) {
  test(`${pageConfig.route} body buttons are actionable and target live destinations`, async ({ page }) => {
    await page.goto(pageConfig.route);
    const root = page.locator(`[data-company-page="${pageConfig.slug}"]`);
    const actions = await root.locator("a[href]").evaluateAll((anchors) =>
      anchors.map((anchor) => ({
        href: anchor.getAttribute("href") ?? "",
        label: anchor.textContent?.trim().replace(/\s+/g, " ") ?? "",
      })),
    );

    expect(actions.length).toBe(pageConfig.slug === "careers" ? 9 : 6);
    expect(actions.every((action) => action.href.length > 0 && action.label.length > 0)).toBe(true);
    expect(actions.filter((action) => action.href.startsWith("tel:")).every((action) => action.href === CURRENT_PHONE_HREF)).toBe(true);
    expect(actions.filter((action) => action.href.startsWith("mailto:")).every((action) => action.href === CAREERS_EMAIL_HREF)).toBe(true);

    for (let index = 0; index < actions.length; index += 1) {
      await page.goto(pageConfig.route);
      const action = page.locator(`[data-company-page="${pageConfig.slug}"] a[href]`).nth(index);
      const href = await action.getAttribute("href");
      expect(href).toBe(actions[index].href);

      if (href?.startsWith("tel:") || href?.startsWith("mailto:")) {
        await page.evaluate(() => {
          (window as typeof window & { __companyActionClick?: string }).__companyActionClick = undefined;
          document.addEventListener("click", (event) => {
            const target = event.target instanceof Element ? event.target.closest("a[href]") : null;
            if (!(target instanceof HTMLAnchorElement)) return;
            if (!target.href.startsWith("tel:") && !target.href.startsWith("mailto:")) return;
            event.preventDefault();
            (window as typeof window & { __companyActionClick?: string }).__companyActionClick = target.getAttribute("href") ?? "";
          }, { capture: true, once: true });
        });
        await action.click();
        await expect.poll(() => page.evaluate(() =>
          (window as typeof window & { __companyActionClick?: string }).__companyActionClick,
        )).toBe(href);
        continue;
      }

      await action.click();
      await expect(page).toHaveURL(new RegExp(`${href?.replace("/", "\\/")}(?:\\?.*)?$`));
    }

    await page.goto(pageConfig.route);
    const faqItems = page.locator(`[data-company-page="${pageConfig.slug}"] details`);
    for (let index = 0; index < 6; index += 1) {
      const item = faqItems.nth(index);
      if (await item.evaluate((details) => (details as HTMLDetailsElement).open)) {
        await item.locator("summary").click();
      }
      await item.locator("summary").click();
      await expect(item).toHaveJSProperty("open", true);
    }
  });
}
