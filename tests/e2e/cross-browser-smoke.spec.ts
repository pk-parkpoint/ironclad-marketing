import { expect, test } from "@playwright/test";

test("IC-075 homepage and booking modal smoke without runtime errors", async ({ page }) => {
  const runtimeErrors: string[] = [];

  page.on("pageerror", (error) => {
    runtimeErrors.push(error.message);
  });

  page.on("console", (message) => {
    if (message.type() === "error") {
      runtimeErrors.push(message.text());
    }
  });

  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 }).first()).toBeVisible();

  await page.setViewportSize({ width: 390, height: 844 });
  await page.getByRole("button", { name: "Book Service" }).click();
  await expect(page.getByRole("dialog", { name: "Request an Appointment" })).toBeVisible();

  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog", { name: "Request an Appointment" })).toBeHidden();

  const fatalErrors = runtimeErrors.filter(
    (entry) => !entry.includes("Cross origin request detected") && !entry.includes("favicon.ico"),
  );

  expect(fatalErrors).toEqual([]);
});
