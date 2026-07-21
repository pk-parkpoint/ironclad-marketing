import { expect, test } from "@playwright/test";

test("records a final anonymous page-duration event on client navigation", async ({ page }) => {
  await page.goto("/?utm_source=google&utm_medium=cpc");

  await expect.poll(async () => page.evaluate(() =>
    (window.dataLayer ?? []).filter((entry) => entry.event === "page_view").length,
  )).toBeGreaterThan(0);

  await page.locator('a[href^="/plumbing?"]:visible').first().click();
  await expect(page).toHaveURL(/\/plumbing$/);

  const readEvent = () => page.evaluate(() => {
    const entries = window.dataLayer ?? [];
    for (const entry of entries) {
      const args = Array.from(entry as unknown as ArrayLike<unknown>);
      const payload = args[2] as Record<string, unknown> | undefined;
      if (
        args[0] === "event"
        && args[1] === "page_engagement"
        && payload?.page_path === "/"
        && payload?.exit_reason === "route_change"
        && payload?.is_final === 1
      ) {
        return payload;
      }
    }
    return null;
  });

  await expect.poll(async () => Boolean(await readEvent())).toBe(true);
  const event = await readEvent();

  expect(event?.next_page).toBe("/plumbing");
  expect(event?.send_to).toBe("G-PAGEENGAGEMENT");
  expect(event?.site_session_id).toMatch(/^site_/);
  expect(event?.page_view_id).toMatch(/^page_/);
  expect(event?.utm_source).toBe("google");
  expect(event?.utm_medium).toBe("cpc");
  expect(Number(event?.elapsed_time_ms)).toBeGreaterThanOrEqual(0);
  expect(Number(event?.active_time_ms)).toBeGreaterThanOrEqual(0);
});
