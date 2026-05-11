import { expect, test } from "@playwright/test";

test.describe("Privacy Policy page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/privacy-policy");
  });

  test("returns 200 and renders a single H1 with the page title", async ({
    page,
  }) => {
    const h1 = page.getByRole("heading", { level: 1 });
    await expect(h1).toHaveCount(1);
    await expect(h1).toHaveText(/privacy policy/i);
  });

  test("renders the breadcrumb", async ({ page }) => {
    await expect(
      page.getByRole("navigation", { name: /breadcrumb/i }),
    ).toBeVisible();
    await expect(page.getByRole("link", { name: /home/i })).toBeVisible();
  });

  test("renders the last-updated line", async ({ page }) => {
    await expect(page.getByText(/last updated:/i)).toBeVisible();
  });

  test("renders core sections", async ({ page }) => {
    await expect(
      page.getByRole("heading", { name: /information we collect/i }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: /data security/i }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: /contact and grievance redressal/i }),
    ).toBeVisible();
  });

  test("marketing footer links to /terms", async ({ page }) => {
    await page
      .getByRole("contentinfo")
      .getByRole("link", { name: /terms & conditions/i })
      .click();
    await expect(page).toHaveURL(/\/terms$/);
  });

  test("header logo link returns to home", async ({ page }) => {
    await page.getByRole("link", { name: /freshterra home/i }).click();
    await expect(page).toHaveURL(/\/$/);
  });
});

test.describe("Terms & Conditions page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/terms");
  });

  test("returns 200 and renders a single H1", async ({ page }) => {
    const h1 = page.getByRole("heading", { level: 1 });
    await expect(h1).toHaveCount(1);
    await expect(h1).toHaveText(/terms & conditions/i);
  });

  test("renders core sections", async ({ page }) => {
    await expect(
      page.getByRole("heading", { name: /payments and commercial terms/i }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: /governing law and jurisdiction/i }),
    ).toBeVisible();
  });

  test("marketing footer links to /privacy-policy", async ({ page }) => {
    await page
      .getByRole("contentinfo")
      .getByRole("link", { name: /privacy policy/i })
      .click();
    await expect(page).toHaveURL(/\/privacy-policy$/);
  });
});

test.describe("Coming Soon → policy navigation", () => {
  test("clicking Privacy Policy on / lands on /privacy-policy", async ({
    page,
  }) => {
    await page.goto("/");
    await page
      .getByRole("link", { name: /privacy policy/i })
      .first()
      .click();
    await expect(page).toHaveURL(/\/privacy-policy$/);
    await expect(
      page.getByRole("heading", { level: 1, name: /privacy policy/i }),
    ).toBeVisible();
  });
});
