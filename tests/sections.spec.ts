import { test, expect } from "@playwright/test";
import { SITE, PLAY_URL } from "../src/config/site";

test("hero: h1, sub, badge, LCP image", async ({ page }) => {
  await page.goto("/");
  const hero = page.locator("#hero");
  await expect(hero.locator("h1")).toHaveText(SITE.h1);
  await expect(hero.locator(`a[href="${PLAY_URL}"] img[alt="Get it on Google Play"]`)).toBeVisible();
  const img = hero.locator("picture img").first();
  await expect(img).toHaveAttribute("fetchpriority", "high");
  await expect(img).toHaveAttribute("alt", "Tarnquil's app drawer, home screen and Progress page side by side");
  expect(await img.getAttribute("width")).toBeTruthy();
});

test("header nav anchors resolve", async ({ page }) => {
  await page.goto("/");
  for (const id of ["features", "privacy"]) {
    await expect(page.locator(`header a[href="/#${id}"]`)).toHaveCount(1);
  }
});

test("six features in spec order, exactly three with screenshots", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("#features article.feature h3")).toHaveText([
    "App limits",
    "Reels & Shorts blocker",
    "Focus schedules",
    "Notification digests",
    "Grayscale",
    "Honest screen time",
  ]);
  const imgs = page.locator("#features article.feature img");
  await expect(imgs).toHaveCount(3);
  for (const i of await imgs.all()) {
    await expect(i).toHaveAttribute("loading", "lazy");
  }
});

test("seven themes with alt text", async ({ page }) => {
  await page.goto("/");
  const alts = await page
    .locator("#themes [data-themes] img")
    .evaluateAll((n) => n.map((i) => (i as HTMLImageElement).alt));
  expect(alts).toEqual(
    ["Mono Dark", "Mono Light", "Paper", "Slate", "Sepia Night", "Dusk", "Sage"].map(
      (t) => `Tarnquil home screen in the ${t} theme`
    )
  );
});

test("faq text matches json-ld exactly", async ({ page }) => {
  await page.goto("/");
  const ld = (await page.locator('script[type="application/ld+json"]').allTextContents())
    .map((t) => JSON.parse(t))
    .find((j) => j["@type"] === "FAQPage");
  const qs = await page.locator("#faq details summary span").allTextContents();
  expect(qs.map((s) => s.trim())).toEqual(ld.mainEntity.map((e: any) => e.name));
});

test("theme toggle works and persists", async ({ page }) => {
  await page.goto("/");
  const toggle = page.locator("#theme-toggle");
  await expect(toggle).toBeVisible();

  // Initial theme (default dark or prefers-color-scheme)
  await toggle.click();
  const theme = await page.locator("html").getAttribute("data-theme");
  expect(theme === "light" || theme === "dark").toBe(true);

  // Reload and check persistence
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-theme", theme!);
});
