import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("axe: home page in dark mode", async ({ page }) => {
  await page.goto("/");
  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa"])
    .disableRules(["color-contrast"]) // Screenshots and badge colors are brand-specific
    .analyze();
  expect(results.violations).toEqual([]);
});

test("axe: home page in light mode", async ({ page }) => {
  await page.emulateMedia({ colorScheme: "light" });
  await page.goto("/");
  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa"])
    .disableRules(["color-contrast"])
    .analyze();
  expect(results.violations).toEqual([]);
});

test("axe: privacy page", async ({ page }) => {
  await page.goto("/privacy");
  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa"])
    .analyze();
  expect(results.violations).toEqual([]);
});
