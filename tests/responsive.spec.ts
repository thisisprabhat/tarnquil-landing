import { test, expect } from "@playwright/test";
import { SITE_URL } from "../src/config/site";
import fs from "node:fs";
import path from "node:path";
import zlib from "node:zlib";

test("privacy page", async ({ page }) => {
  await page.goto("/privacy");
  await expect(page.locator("h1")).toHaveText("Privacy Policy for Tarnquil");
  await expect(page.locator("link[rel=canonical]")).toHaveAttribute("href", `${SITE_URL}/privacy`);
});

test("404 is noindex and links home", async ({ page }) => {
  const r = await page.goto("/does-not-exist");
  expect(r?.status()).toBe(404);
  await expect(page.locator("meta[name=robots]")).toHaveAttribute("content", /noindex/);
  await expect(page.locator('a[href="/"]').first()).toBeVisible();
});

test("no horizontal overflow", async ({ page }) => {
  for (const w of [320, 360, 768, 1280, 1920]) {
    await page.setViewportSize({ width: w, height: 800 });
    await page.goto("/");
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  }
});

test("js budget under 25 KB gzipped", async () => {
  const distDir = path.resolve("./dist");
  let totalJsBytes = 0;

  function scanDir(dir: string) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
      const full = path.join(dir, file);
      if (fs.statSync(full).isDirectory()) {
        scanDir(full);
      } else if (file.endsWith(".js")) {
        const content = fs.readFileSync(full);
        const gz = zlib.gzipSync(content);
        totalJsBytes += gz.length;
      }
    }
  }

  scanDir(distDir);

  // Read inline script in dist/index.html
  const html = fs.readFileSync(path.join(distDir, "index.html"), "utf-8");
  const inlineScripts = [...html.matchAll(/<script(?![^>]*src)[^>]*>([\s\S]*?)<\/script>/gi)];
  for (const match of inlineScripts) {
    const gz = zlib.gzipSync(Buffer.from(match[1]));
    totalJsBytes += gz.length;
  }

  console.log(`Total JS (gzipped): ${totalJsBytes} bytes`);
  expect(totalJsBytes).toBeLessThan(25600);
});
