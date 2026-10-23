import { expect, test, type Page } from "@playwright/test";
import { writeFile } from "node:fs/promises";
import { entryReviewPages } from "./entry-review-pages";
import { isolateBookingTraffic } from "./entry-review-safety";
import { completeEntryBooking } from "./entry-review-flow";

type Entry = {
  index: number;
  href: string;
  text: string;
  mode: "link" | "mobile-menu" | "keyboard";
  rendered: boolean;
  surface: string;
};

async function inventory(page: Page): Promise<Entry[]> {
  return page.locator("a[href]").evaluateAll((anchors): Entry[] => anchors.flatMap((element, index) => {
    const anchor = element as HTMLAnchorElement;
    const text = anchor.textContent?.replace(/\s+/g, " ").trim() || "";
    const bookingText = /^(?:Book|Schedule)\b/i.test(text);
    if (!["http:", "https:"].includes(new URL(anchor.href).protocol) && !bookingText) return [];
    const bookingIntent = anchor.dataset.trackIntent === "book" || bookingText;
    if (!/^\/book\/?$/.test(new URL(anchor.href).pathname) && !bookingIntent) return [];
    const menu = anchor.closest('[aria-label="Mobile navigation"]');
    const keyboard = anchor.classList.contains("dd-a11y-book");
    const rect = anchor.getBoundingClientRect();
    const style = getComputedStyle(anchor);
    return [{
      index, href: anchor.getAttribute("href")!, text,
      mode: menu ? "mobile-menu" : keyboard ? "keyboard" : "link",
      rendered: keyboard || (!anchor.closest('[inert], [aria-hidden="true"]') && rect.width > 1 && rect.height > 1
        && style.visibility !== "hidden" && style.display !== "none"),
      surface: menu ? "mobile navigation" : keyboard ? "keyboard booking link"
        : anchor.closest("header") ? "header" : anchor.classList.contains("promo-bar") ? "promotion bar"
          : anchor.closest("main") ? "page content" : "shared bottom/navigation control",
    }];
  }));
}

async function visit(page: Page, path: string) {
  const response = await page.goto(path, { waitUntil: "load" });
  expect(response?.status()).toBe(path === "/entry-review-missing-page" ? 404 : 200);
  await page.evaluate(() => new Promise<void>((resolve) => requestAnimationFrame(() => requestAnimationFrame(() => resolve()))));
  if (path === "/booking-wizard-preview") {
    const preview = page.getByRole("dialog", { name: "Request an Appointment", exact: true });
    await expect(preview).toBeVisible();
    await preview.getByRole("button", { name: "Close booking modal", exact: true }).first().click();
    await expect(preview).toBeHidden();
  }
}

function expectedBookingPath(source: URL, href: string): string {
  const target = new URL(href, source);
  if (!target.searchParams.has("service")) {
    const service = /^\/plumbing\/([^/]+)$/.exec(source.pathname)?.[1]
      || (["/plumbing", "/commercial-plumbing"].includes(source.pathname) ? source.pathname.slice(1) : "");
    if (service) target.searchParams.set("service", decodeURIComponent(service));
  }
  return target.pathname + target.search + target.hash;
}

for (const path of entryReviewPages()) {
  test(`every booking control: ${path}`, async ({ page }, testInfo) => {
    const events = await isolateBookingTraffic(page);
    const results: Array<Record<string, unknown>> = [];
    const failures: string[] = [];
    let entries: Entry[] = [];
    let testFailure: string | undefined;
    try {
      await visit(page, path);
      if (new URL(page.url()).pathname === "/book") {
        const result = await completeEntryBooking(page, events, 0);
        results.push({ source: path, mode: "direct", ...result });
      } else {
        entries = await inventory(page);
        const mobileMenu = page.getByRole("button", { name: "Open navigation menu", exact: true });
        const hasMenu = await mobileMenu.isVisible();
        const selected = entries.filter((entry) => entry.rendered || (entry.mode === "mobile-menu" && hasMenu));
        expect(selected.length, `No reachable booking control on ${path}`).toBeGreaterThan(0);
        expect.soft(selected.some((entry) => entry.mode !== "keyboard"),
          `No visible/tappable booking entry on ${path}; a clipped keyboard-only link is insufficient`).toBe(true);
        for (const [position, entry] of selected.entries()) {
          try {
            if (position > 0) await visit(page, path);
            const source = new URL(page.url());
            expect(new URL(entry.href, source).origin, "Booking remains on this website").toBe(source.origin);
            expect(new URL(entry.href, source).pathname, `Booking control points outside /book: ${entry.text}`).toMatch(/^\/book\/?$/);
            const expected = expectedBookingPath(source, entry.href);
            const control = page.locator("a[href]").nth(entry.index);
            await expect(control).toHaveAttribute("href", entry.href);
            if (entry.mode === "mobile-menu") {
              await page.getByRole("button", { name: "Open navigation menu", exact: true }).click();
              await expect(page.getByRole("dialog", { name: "Mobile navigation", exact: true })).toBeVisible();
            }
            const offset = events.actions.length;
            const notificationOffset = events.notifications.length;
            if (entry.mode === "keyboard") {
              await control.focus();
              await control.press("Enter");
            } else {
              await control.click({ timeout: 8_000 });
            }
            await expect(page).toHaveURL((url) => url.pathname + url.search + url.hash === expected);
            expect(events.notifications.slice(notificationOffset).filter((event) => event.status === "abandoned")).toHaveLength(0);
            const result = await completeEntryBooking(page, events, offset);
            results.push({ ...entry, expected, finalUrl: page.url(), ...result });
          } catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            failures.push(`${entry.surface} ${entry.text} (${entry.href}): ${message}`);
            const diagnostics = await Promise.allSettled([
              page.screenshot({ path: testInfo.outputPath(`entry-${entry.index}-failure.png`), animations: "disabled", timeout: 5000 }),
              page.getByRole("dialog", { name: "Request an Appointment", exact: true }).count(),
            ]);
            results.push({ ...entry, error: message, finalUrl: page.url(),
              diagnostics: diagnostics.map((result) => result.status === "fulfilled"
                ? { status: result.status, value: typeof result.value === "number" ? result.value : "screenshot saved" }
                : { status: result.status, error: String(result.reason) }) });
          }
        }
        if (path === "/booking-wizard-preview") {
          await visit(page, path);
          const offset = events.actions.length;
          await page.getByRole("button", { name: "Open Booking Wizard", exact: true }).click({ timeout: 8000 });
          const result = await completeEntryBooking(page, events, offset);
          results.push({ source: path, mode: "embedded button", ...result });
        }
      }
      expect(events.unexpectedWrites, "Unrecognized writes were blocked").toEqual([]);
      expect(events.pageErrors, "Browser runtime errors").toEqual([]);
      expect(failures).toEqual([]);
      expect(results.flatMap((result) => (result.findings as string[]) || [])).toEqual([]);
    } catch (error) {
      testFailure = error instanceof Error ? error.message : String(error);
      throw error;
    } finally {
      const record = { source: path, project: testInfo.project.name, origin: testInfo.project.use.baseURL,
        entries, results, failures, testFailure, blockedWrites: events.unexpectedWrites, pageErrors: events.pageErrors,
        simulatedBookings: events.actions.filter((event) => event.action === "book").length };
      const file = testInfo.outputPath("entry-coverage.json");
      await writeFile(file, JSON.stringify(record, null, 2));
      await testInfo.attach("entry-coverage", { path: file, contentType: "application/json" });
    }
  });
}
