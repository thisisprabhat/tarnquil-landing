import { test, expect } from "@playwright/test";
import { SITE, SITE_URL, PLAY_PACKAGE } from "../src/config/site";

test("home has title, one h1, lang", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle(SITE.title);
  await expect(page.locator("h1")).toHaveCount(1);
  await expect(page.locator("h1")).toHaveText(SITE.h1);
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
});

test("head meta", async ({ page }) => {
  await page.goto("/");
  const m = (s: string) => page.locator(s);
  await expect(m('link[rel="canonical"]')).toHaveAttribute("href", `${SITE_URL}/`);
  await expect(m('meta[name="description"]')).toHaveAttribute("content", SITE.description);
  await expect(m('meta[property="og:image"]')).toHaveAttribute("content", `${SITE_URL}/images/og-image-1200x630.png`);
  await expect(m('meta[name="twitter:card"]')).toHaveAttribute("content", "summary_large_image");
  await expect(m('meta[name="theme-color"]')).toHaveCount(2);
  await expect(m('meta[name="keywords"]')).toHaveCount(0);
  await expect(m('meta[name="google-play-app"]')).toHaveAttribute("content", `app-id=${PLAY_PACKAGE}`);
});

test("json-ld parses and has the four types, no rating", async ({ page }) => {
  await page.goto("/");
  const blocks = await page.locator('script[type="application/ld+json"]').allTextContents();
  const types = blocks.map((b) => JSON.parse(b)["@type"]);
  expect(types.sort()).toEqual(["FAQPage", "Organization", "SoftwareApplication", "WebSite"]);
  expect(blocks.join()).not.toContain("aggregateRating");
});

test("every play link uses PLAY_PACKAGE", async ({ page, request }) => {
  await page.goto("/");
  const html = (await page.content()) + (await (await request.get("/llms.txt")).text());
  const ids = [...html.matchAll(/details\?id=([\w.]+)/g)].map((x) => x[1]);
  expect(ids.length).toBeGreaterThan(0);
  expect(new Set(ids)).toEqual(new Set([PLAY_PACKAGE]));
});

test("root files", async ({ request }) => {
  expect((await request.get("/robots.txt")).ok()).toBe(true);
  const sm = await (await request.get("/sitemap.xml")).text();
  expect(sm).toContain(`<loc>${SITE_URL}/</loc>`);
  expect(sm).toContain(`<loc>${SITE_URL}/privacy</loc>`);
  expect((await request.get("/.well-known/security.txt")).ok()).toBe(true);
  expect((await request.get("/site.webmanifest")).ok()).toBe(true);
});
