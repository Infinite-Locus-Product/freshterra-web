import { test, expect } from "@playwright/test";

test.describe("PDP mobile layout", () => {
  test.use({ viewport: { width: 393, height: 852 } });

  test("does not expand past the viewport width", async ({ page }) => {
    await page.goto("/p/organic-tomatoes", { waitUntil: "networkidle" });

    const scrollWidth = await page.evaluate(
      () => document.documentElement.scrollWidth,
    );
    const clientWidth = await page.evaluate(
      () => document.documentElement.clientWidth,
    );

    expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 1);
  });

  test("uses a product grid for similar products on mWeb", async ({ page }) => {
    await page.goto("/p/organic-tomatoes", { waitUntil: "networkidle" });

    const grid = page.locator(
      'section[aria-labelledby="similar-products-title"] ul.grid',
    );
    await expect(grid).toBeVisible();
    await expect(grid.locator("li")).not.toHaveCount(0);
  });
});
