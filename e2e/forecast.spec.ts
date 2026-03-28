import { expect, test } from "@playwright/test";

test("loads forecast for a location and displays weather cards", async ({ page }) => {
  await page.goto("/");

  // Should see the app title
  await expect(page.locator("h1")).toHaveText("Tempora");

  // Should see the empty state prompt
  await expect(page.getByText("Enter a location")).toBeVisible();

  // Type a location and submit
  const input = page.locator("#location-input");
  await input.fill("New York");
  await input.press("Enter");

  // Wait for forecast to load (weather card or resolved address appears)
  await expect(page.getByText(/Outdoor Score/i).first()).toBeVisible({ timeout: 15000 });

  // Should show at least one weather card with a score bar
  await expect(page.getByRole("progressbar").first()).toBeVisible();

  // Should show day selector chips
  await expect(page.getByRole("button", { name: "Mon" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Fri" })).toBeVisible();

  // Should show time range chips
  await expect(page.getByRole("button", { name: "Morning" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Afternoon" })).toBeVisible();

  // Click a different day and verify forecast updates
  await page.getByRole("button", { name: "Sat" }).click();
  await expect(page.getByText(/Outdoor Score/i).first()).toBeVisible({ timeout: 15000 });
});
