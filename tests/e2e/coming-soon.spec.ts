import { expect, test } from "@playwright/test";

test.describe("Coming Soon — root /", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("has a single H1 heading", async ({ page }) => {
    await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
  });

  test("renders headline, sub-copy, CTA, and policy links", async ({
    page,
  }) => {
    await expect(
      page.getByRole("heading", { name: /fresh\. wholesome\. gourmet\./i }),
    ).toBeVisible();
    await expect(page.getByText(/five-star quality/i)).toBeVisible();
    await expect(
      page.getByRole("link", { name: /get notified/i }),
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: /terms & conditions/i }),
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: /privacy policy/i }),
    ).toBeVisible();
  });

  test("CTA navigates to /notify", async ({ page }) => {
    await page.getByRole("link", { name: /get notified/i }).click();
    await expect(page).toHaveURL(/\/notify$/);
  });
});

test.describe("Coming Soon — /notify form", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/notify");
  });

  test("renders both inputs, consent checkbox, and submit", async ({
    page,
  }) => {
    await expect(page.getByLabel(/^email$/i)).toBeVisible();
    await expect(page.getByLabel(/^phone$/i)).toBeVisible();
    await expect(
      page.getByRole("checkbox", { name: /marketing emails/i }),
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: /get notified/i }),
    ).toBeVisible();
  });

  test("keeps submit disabled when phone is incomplete", async ({ page }) => {
    const submit = page.getByRole("button", { name: /get notified/i });
    await expect(submit).toBeDisabled();
    await page.getByLabel(/^email$/i).fill("user@example.com");
    await expect(submit).toBeDisabled();
  });

  test("keeps submit disabled when email is empty (phone alone is not enough)", async ({
    page,
  }) => {
    const submit = page.getByRole("button", { name: /get notified/i });
    await page.getByLabel(/^phone$/i).click();
    await page.getByLabel(/^phone$/i).fill("9876543210");
    await expect(submit).toBeDisabled();
  });

  test("blocks submit on invalid email when phone is valid", async ({
    page,
  }) => {
    await page.getByLabel(/^phone$/i).click();
    await page.getByLabel(/^phone$/i).fill("9876543210");
    await page.getByLabel(/^email$/i).fill("not-an-email");
    await page.getByRole("button", { name: /get notified/i }).click();
    await expect(page.getByText(/valid email/i)).toBeVisible();
  });

  test("submits successfully and navigates to /notify/success", async ({
    page,
  }) => {
    await page.route("**/api/leads", (route) =>
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: '{"ok":true}',
      }),
    );
    await page.getByLabel(/^phone$/i).click();
    await page.getByLabel(/^phone$/i).fill("9876543210");
    await page.getByLabel(/^email$/i).fill("user@example.com");
    await page.getByRole("button", { name: /get notified/i }).click();
    await expect(page).toHaveURL(/\/notify\/success$/);
    await expect(
      page.getByRole("heading", { level: 1, name: /you're on the list/i }),
    ).toBeVisible();
    await expect(page.getByText(/we'll reach out soon/i)).toBeVisible();
  });

  test("shows a server error message when Web3Forms fails", async ({
    page,
  }) => {
    await page.route("**/api/leads", (route) =>
      route.fulfill({
        status: 502,
        contentType: "application/json",
        body: '{"ok":false}',
      }),
    );
    await page.getByLabel(/^phone$/i).click();
    await page.getByLabel(/^phone$/i).fill("9876543210");
    await page.getByLabel(/^email$/i).fill("user@example.com");
    await page.getByRole("button", { name: /get notified/i }).click();
    await expect(page.getByText(/something went wrong/i)).toBeVisible();
  });

  test("is keyboard navigable", async ({ page }) => {
    await page.keyboard.press("Tab");
    await expect(page.locator(":focus")).toBeVisible();
  });
});
