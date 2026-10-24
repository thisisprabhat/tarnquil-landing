import { test, expect } from "@playwright/test";

test("content visible without JS", async ({ browser }) => {
  const ctx = await browser.newContext({ javaScriptEnabled: false });
  const page = await ctx.newPage();
  await page.goto("/");
  for (const id of ["hero", "how", "features", "themes", "privacy", "faq", "download"]) {
    await expect(page.locator(`#${id} h1, #${id} h2`).first()).toBeVisible();
  }
  await expect(page.locator("[data-pause-options] button").first()).toBeVisible();
  await ctx.close();
});

test("video: no preload, poster is set", async ({ page }) => {
  await page.goto("/");
  const v = page.locator("video[data-inview]");
  await expect(v).toHaveAttribute("preload", "none");
  await expect(v).toHaveAttribute("poster", /.+/);
});

test("pause demo reveals options after ~3s and replays", async ({ page }) => {
  await page.goto("/#how");
  const opts = page.locator("[data-pause-options] button");
  await expect(opts).toHaveCount(5);
  await expect(opts.first()).toBeVisible({ timeout: 4500 });
  await page.locator("[data-pause-replay]").click();
  // Should still have 5 options
  await expect(opts).toHaveCount(5);
});

test("reduced motion: no reveal transform, no autoplay", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  const t = await page.locator("[data-reveal]").first().evaluate((e) => getComputedStyle(e).transform);
  expect(t === "none" || t === "matrix(1, 0, 0, 1, 0, 0)").toBe(true);
  await page.locator("video[data-inview]").scrollIntoViewIfNeeded();
  expect(await page.locator("video[data-inview]").evaluate((v: HTMLVideoElement) => v.paused)).toBe(true);
});

test("reveal adds is-visible on scroll", async ({ page }) => {
  await page.goto("/");
  const el = page.locator("#download [data-reveal]").first();
  await el.scrollIntoViewIfNeeded();
  await expect(el).toHaveClass(/is-visible/);
});
