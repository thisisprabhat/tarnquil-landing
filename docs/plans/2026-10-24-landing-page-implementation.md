# Tarnquil Landing Page Implementation Plan

**Goal:** Build a static, SEO-first, single-page marketing site for the Tarnquil Android launcher with a `/privacy` page. Every visit should end in a Google Play install.

**Architecture:** An Astro static build with plain scoped CSS and no UI framework. All copy is server-rendered HTML. One inline script (< 5 KB gz) adds the scroll reveals, the in-view video playback and the pause demo. All URLs, ids and copy constants live in `src/config/site.ts`, and JSON-LD, `sitemap.xml` and `llms.txt` are generated from that one file.

**Tech Stack:** Node 20 (installed: v20.20.2), pnpm, Astro 5.x (pin the exact version `pnpm create astro` installs), `@fontsource/lora`, `@fontsource/inter`, Playwright, `@axe-core/playwright`, `html-validate`, `@lhci/cli`.

**Spec:** `docs/specs/2026-10-24-tarnquil-landing-design.md`. Read it first. Section references below (§n) point into it.

## Global Constraints

- Canonical origin: `https://tarnquil.waygosquad.com`. `trailingSlash: "never"`, `build.format: "directory"`.
- Play package: the single constant `PLAY_PACKAGE`, default `"com.waygosquad.tarnquil"` (see spec §0, **to be confirmed by the owner before launch**). The literal string `com.waygosquad.` appears in no file except `src/config/site.ts`.
- Play URL: `https://play.google.com/store/apps/details?id=${PLAY_PACKAGE}`
- Title: `Tarnquil — Minimalist Android Launcher to Reduce Screen Time`
- Meta description: `Tarnquil is a free, text-only Android launcher that helps you cut screen time and stop mindless scrolling: app limits, short-video blocker, focus schedules. No ads, fully private.`
- H1: `Use your phone on purpose.`
- Colour tokens and type scale exactly as spec §4. Motion durations and easings exactly as spec §5.
- No analytics, trackers, cookies, third-party requests at runtime, or CDN fonts. Everything is self-hosted.
- No `aggregateRating` in JSON-LD.
- Animate only `opacity` and `transform`. Everything is honoured under `prefers-reduced-motion: reduce`.
- All page content is visible with JS disabled.
- Source assets are read only from `/Users/prabhatkumar/Projects/creations/apps/DetoxDesk/assets` through the allowlist in `scripts/sync-assets.mjs`, and are copied into this repo (not symlinked) so CI and deploys build without the app repo.

## Review Focus

1. **JS disabled or failed:** every section, FAQ answer and image is visible, and the pause demo shows its options statically. *Test:* `tests/motion.spec.ts › content visible without JS` (Task 6).
2. **Reduced motion:** no transforms animate, the arcs are static, the video does not autoplay and the demo shows its options immediately. *Test:* `tests/motion.spec.ts › reduced motion` (Task 6).
3. **Narrow phones (320px) and the themes strip:** the 7-phone scroll row must not cause horizontal page scroll. *Test:* `tests/responsive.spec.ts › no horizontal overflow` (Task 7).
4. **Wrong or drifting Play id:** a stale package string hard-coded in JSON-LD, `llms.txt` or a badge would ship a 404 install link. *Test:* `tests/seo.spec.ts › every play link uses PLAY_PACKAGE` (Task 2), plus the grep gate in Task 7.
5. **Light-mode visitors:** they must get light captures and readable contrast, not dark screenshots on a light page. *Test:* `tests/sections.spec.ts › light scheme swaps captures` (Task 3) + the axe run under both schemes (Task 7).

---

## File Structure

```
astro.config.mjs              site, trailingSlash, build.format, image service
package.json                  scripts: dev, build, preview, sync:assets, test, lint:html, lhci
playwright.config.ts          webServer = build + preview on :4321
lighthouserc.json             budgets from spec §8
.htmlvalidate.json
scripts/sync-assets.mjs       allowlist copy from the app repo → src/assets, public, src/content
src/config/site.ts            ALL constants (urls, ids, copy strings, faq)
src/lib/jsonld.ts             buildJsonLd(): object[]
src/layouts/Base.astro        <html>, <head> (Seo), header, footer, inline script slot
src/components/Seo.astro
src/components/Header.astro
src/components/Footer.astro
src/components/PlayBadge.astro
src/components/PhoneFrame.astro     CSS device frame around <Picture>/<video>
src/components/Arcs.astro           inline SVG concentric arcs
src/components/PauseDemo.astro
src/components/sections/{Hero,How,Features,Themes,Privacy,Faq,Download}.astro
src/styles/tokens.css  src/styles/global.css
src/scripts/enhance.ts              reveal + video in-view + pause demo (bundled inline)
src/pages/index.astro  src/pages/privacy.astro  src/pages/404.astro
src/pages/sitemap.xml.ts  src/pages/llms.txt.ts
src/content/privacy-policy.md        (synced)
src/assets/{images,screens,themes,video}/…   (synced, optimised at build)
public/{favicons/,images/og-*.png,images/twitter-*.png,robots.txt,site.webmanifest,browserconfig.xml,humans.txt,.well-known/security.txt,badges/}
tests/{seo,sections,motion,responsive,a11y}.spec.ts
```

---

### Task 1: Scaffold, asset sync, config, smoke test

**Files:**
- Create: everything at the root config level above, `scripts/sync-assets.mjs`, `src/config/site.ts`, a minimal `src/pages/index.astro`, `tests/seo.spec.ts`

**Interfaces:**
- Produces, in `src/config/site.ts`:
  ```ts
  export const SITE_URL = "https://tarnquil.waygosquad.com";
  export const PLAY_PACKAGE = "com.waygosquad.tarnquil";
  export const PLAY_URL: string;            // built from PLAY_PACKAGE
  export const SITE: { name: "Tarnquil"; title: string; description: string; h1: string;
                       themeDark: "#0D0F11"; themeLight: "#F4F3EF"; author: "Prabhat Kumar";
                       org: { name: "WayGoSquad"; url: "https://waygosquad.com"; email: "contact@waygosquad.com" };
                       minAndroid: "Android 9 or later"; version: "0.1.0" };
  export const FAQ: ReadonlyArray<{ q: string; a: string }>; // the 6 items from faq.json, verbatim
  ```
- Produces: `pnpm sync:assets`, which copies the allowlist and exits 1, naming every missing source file.

- [ ] **Step 1:** `git init`, then `pnpm create astro@latest . --template minimal --typescript strict --no-install`, `pnpm i`, add the dev deps from Tech Stack, and `npx playwright install chromium`. Add a `.gitignore` covering `node_modules`, `dist`, `.astro`, `test-results` and `.lighthouseci`.
- [ ] **Step 2:** Write `scripts/sync-assets.mjs` with an explicit `[src, dest]` allowlist built from spec §6 "Used". Add `privacy-policy.md` from the app repo root → `src/content/privacy-policy.md`, and `assets/seo/{robots.txt,site.webmanifest,browserconfig.xml,humans.txt,well-known/security.txt}` → `public/`. Do **not** copy `sitemap.xml`, `llms.txt` or `head-snippet.html`, because those are generated or inlined. Run it and expect "copied N files". Rename a source temporarily and expect exit 1 naming it.
- [ ] **Step 3:** Write `src/config/site.ts` per Interfaces.
- [ ] **Step 4:** Write the failing test in `tests/seo.spec.ts`:
  ```ts
  test("home has title, one h1, lang", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(SITE.title);
    await expect(page.locator("h1")).toHaveCount(1);
    await expect(page.locator("h1")).toHaveText(SITE.h1);
    await expect(page.locator("html")).toHaveAttribute("lang", "en");
  });
  ```
  Configure `playwright.config.ts` with `webServer: { command: "pnpm build && pnpm preview --port 4321", url: "http://localhost:4321" }`, `baseURL` set to the same URL, and projects `mobile` (Pixel 7) and `desktop` (1280×800). Run `pnpm test`. Expected: FAIL (default template title).
- [ ] **Step 5:** Make the minimal `index.astro` render `SITE.title` and the H1 with `lang="en"`. Configure `astro.config.mjs` (`site: SITE_URL`, `trailingSlash: "never"`, `build: { format: "directory" }`). Run `pnpm test`. Expected: PASS.
- [ ] **Step 6:** Commit: `chore: scaffold astro site, asset sync and config`.

### Task 2: Base layout, SEO head, JSON-LD, generated root files

**Files:**
- Create: `src/layouts/Base.astro`, `src/components/Seo.astro`, `src/lib/jsonld.ts`, `src/pages/sitemap.xml.ts`, `src/pages/llms.txt.ts`
- Test: `tests/seo.spec.ts`

**Interfaces:**
- Consumes: `SITE`, `SITE_URL`, `PLAY_URL`, `PLAY_PACKAGE`, `FAQ`
- Produces: `<Base title? description? path="/" noindex?={false}>` with slots `default` and `head`. `buildJsonLd(): object[]` returns `[SoftwareApplication, WebSite, Organization, FAQPage]`.

- [ ] **Step 1:** Write failing tests:
  ```ts
  test("head meta", async ({ page }) => {
    await page.goto("/");
    const m = (s: string) => page.locator(s);
    await expect(m('link[rel=canonical]')).toHaveAttribute("href", `${SITE_URL}/`);
    await expect(m('meta[name=description]')).toHaveAttribute("content", SITE.description);
    await expect(m('meta[property="og:image"]')).toHaveAttribute("content", `${SITE_URL}/images/og-image-1200x630.png`);
    await expect(m('meta[name="twitter:card"]')).toHaveAttribute("content", "summary_large_image");
    await expect(m('meta[name=theme-color]')).toHaveCount(2);
    await expect(m('meta[name=keywords]')).toHaveCount(0);
    await expect(m('meta[name="google-play-app"]')).toHaveAttribute("content", `app-id=${PLAY_PACKAGE}`);
  });
  test("json-ld parses and has the four types, no rating", async ({ page }) => {
    await page.goto("/");
    const blocks = await page.locator('script[type="application/ld+json"]').allTextContents();
    const types = blocks.map(b => JSON.parse(b)["@type"]);
    expect(types.sort()).toEqual(["FAQPage","Organization","SoftwareApplication","WebSite"]);
    expect(blocks.join()).not.toContain("aggregateRating");
  });
  test("every play link uses PLAY_PACKAGE", async ({ page, request }) => {
    await page.goto("/");
    const html = await page.content() + await (await request.get("/llms.txt")).text();
    const ids = [...html.matchAll(/details\?id=([\w.]+)/g)].map(x => x[1]);
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
  ```
  Run: `pnpm test tests/seo.spec.ts`. Expected: FAIL.
- [ ] **Step 2:** Implement `Seo.astro` from `assets/seo/head-snippet.html`, applying the changes in spec §7 (drop keywords and the android-app alternate, add google-play-app, use two `theme-color` tags with `media`). Preload only the Lora 400 woff2. Do not preload the hero PNG: Astro's `<Picture>` gets `fetchpriority="high"` instead (Task 3).
- [ ] **Step 3:** Implement `buildJsonLd()` from `assets/seo/structured-data/*.json`, with URLs from config and `screenshot` set to the absolute URLs of the optimised images (`getImage()` results).
- [ ] **Step 4:** Implement `sitemap.xml.ts` (both URLs, `lastmod` = build date `YYYY-MM-DD`, the OG `image:image`) and `llms.txt.ts` (the text of `assets/seo/llms.txt`, with the package and Play URL from config). Both are `prerender = true` endpoints.
- [ ] **Step 5:** Run `pnpm test tests/seo.spec.ts`. Expected: PASS.
- [ ] **Step 6:** Commit: `feat: base layout, seo head, json-ld, sitemap, llms.txt`.

### Task 3: Design tokens, fonts, chrome, Hero

**Files:**
- Create: `src/styles/{tokens,global}.css`, `Header.astro`, `Footer.astro`, `PlayBadge.astro`, `PhoneFrame.astro`, `Arcs.astro`, `sections/Hero.astro`; add the Play badge file to `public/badges/`
- Test: `tests/sections.spec.ts`

**Interfaces:**
- Produces:
  - `<PlayBadge size?: "sm" | "lg" />`: an `<a href={PLAY_URL}>` wrapping the official badge `<img alt="Get it on Google Play">`, at least 48px tall at `lg`.
  - `<PhoneFrame src? lightSrc? alt? loading?="lazy" widths?={[360,540,720]}>`: the CSS frame from spec §4. With `src` (ImageMetadata), it renders `<picture>` with AVIF/WebP and adds a `(prefers-color-scheme: light)` source when `lightSrc` is given. Without `src`, it renders its default slot (used for the `<video>` in Task 4).
  - `<Arcs breathing?: boolean />`: inline SVG, `aria-hidden="true"`.

- [ ] **Step 1:** Get the official en-US "Get it on Google Play" badge from https://play.google.com/intl/en_us/badges/ and save it as `public/badges/google-play-en.png` (or `.svg` if you have the Partner Marketing Hub version).
- [ ] **Step 2:** Write failing tests:
  ```ts
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
    for (const id of ["features", "privacy"]) await expect(page.locator(`header a[href="#${id}"]`)).toHaveCount(1);
  });
  test("light scheme swaps captures", async ({ page }) => {
    await page.emulateMedia({ colorScheme: "light" });
    await page.goto("/");
    const src = await page.locator("#how picture img").first().evaluate((i: HTMLImageElement) => i.currentSrc);
    expect(src).toMatch(/light-home/);
  });
  ```
  (The last test passes once Task 4 adds `#how`. Mark it `test.fixme` until then.) Run and expect FAIL.
- [ ] **Step 3:** Implement the tokens (spec §4 table: dark on `:root`, light under `@media (prefers-color-scheme: light)`), the type scale, and `@fontsource/lora/400.css` + `@fontsource/inter/{400,500}.css` imported in `global.css`. Add the header (inline mark SVG via `currentColor`, the two anchors, `<PlayBadge size="sm">`) and the footer (links to `/privacy`, the source/licence "Apache-2.0", waygosquad.com and the `mailto:contact@waygosquad.com`).
- [ ] **Step 4:** Implement `Hero.astro`: `<Arcs breathing>` behind, then the H1, the sub line (spec §3), the badge, and on ≥ 900px the line "On a computer? Open this page on your Android phone." Below that comes `<Picture src={hero} widths={[640,960,1280,1920,2400]} formats={["avif","webp"]} sizes="(min-width: 1120px) 1120px, 100vw" loading="eager" fetchpriority="high">`. The arcs breathe per spec §5.2 with a CSS `@keyframes` gated by `@media (prefers-reduced-motion: no-preference)`.
- [ ] **Step 5:** Run `pnpm test tests/sections.spec.ts`. Expected: PASS (except the fixme).
- [ ] **Step 6:** Commit: `feat: design tokens, header/footer, hero`.

### Task 4: "How it works": pause demo + tour video

**Files:**
- Create: `PauseDemo.astro`, `sections/How.astro`, `src/scripts/enhance.ts` (first two modules)
- Test: `tests/motion.spec.ts`, `tests/sections.spec.ts`

**Interfaces:**
- Produces in `enhance.ts`: `initPauseDemo(root: HTMLElement): void` and `initInViewVideo(video: HTMLVideoElement): void`. They are wired from one `init()` that runs on `DOMContentLoaded` and first sets `document.documentElement.classList.add("js")`.
- DOM contract: `[data-pause-demo]` has children `[data-pause-bar]`, `[data-pause-options] > button` ×5 (`1 min`, `5 min`, `10 min`, `15 min`, `30 min`) and `[data-pause-replay]`. The video is `video[data-inview]`.

- [ ] **Step 1:** Write failing tests:
  ```ts
  test("pause demo reveals options after ~3s and replays", async ({ page }) => {
    await page.goto("/#how");
    const opts = page.locator("[data-pause-options] button");
    await expect(opts).toHaveCount(5);
    await expect(opts.first()).toBeHidden();          // before countdown ends (under html.js)
    await expect(opts.last()).toBeVisible({ timeout: 4500 });
    await page.locator("[data-pause-replay]").click();
    await expect(opts.first()).toBeHidden();
  });
  test("video: no preload, plays in view, pauses out of view", async ({ page }) => {
    await page.goto("/");
    const v = page.locator("video[data-inview]");
    await expect(v).toHaveAttribute("preload", "none");
    await expect(v).toHaveAttribute("poster", /.+/);
    await v.scrollIntoViewIfNeeded();
    await expect.poll(() => v.evaluate((e: HTMLVideoElement) => !e.paused)).toBe(true);
    await page.locator("#faq").scrollIntoViewIfNeeded();
    await expect.poll(() => v.evaluate((e: HTMLVideoElement) => e.paused)).toBe(true);
  });
  ```
  Expected: FAIL.
- [ ] **Step 2:** Build `How.astro`. On the left, three numbered steps (H3s): **Pause** — "A short, deliberate pause before a distracting app opens." **Choose a session** — "Decide how long you'll stay: 1, 5, 10, 15 or 30 minutes." **See your day** — "Screen time, unlocks and streaks, without judgement." Below them sits `<PauseDemo app="Instagram">`. On the right, a `<PhoneFrame>` holds `<video data-inview muted loop playsinline preload="none" width="720" height="1600" poster={optimised phone/01-home} aria-label="Tarnquil walkthrough: home, progress, today, drawer, search, pause and session picker">` with `<source src={tour.mp4} type="video/mp4">`. Import the MP4 from `src/assets/video` with `?url` so it is fingerprinted. In light mode the poster is a `<picture>` fallback using `light-home`.
- [ ] **Step 3:** Implement `initPauseDemo` (spec §5.3: bar `scaleX` 1→0 over 3000ms linear, then options get `.is-in` with a 60ms stagger via `transition-delay`, and replay resets the bar and options) and `initInViewVideo` (an IntersectionObserver at threshold 0.5 calls `play()`/`pause()` and swallows the `play()` promise rejection). Under `matchMedia("(prefers-reduced-motion: reduce)")`, the demo shows its options immediately and the video never auto-plays; set `controls` on it instead. The hidden option state is CSS under `html.js` only.
- [ ] **Step 4:** Remove the `fixme` from "light scheme swaps captures". Run `pnpm test`. Expected: PASS.
- [ ] **Step 5:** Commit: `feat: how-it-works section with pause demo and in-view tour video`.

### Task 5: Features + Themes

**Files:**
- Create: `sections/Features.astro`, `sections/Themes.astro`
- Test: `tests/sections.spec.ts`

**Interfaces:**
- Consumes: `<PhoneFrame>`
- Produces: `#features` with `article.feature` ×6 and `#themes` with `ul[data-themes] > li` ×7

- [ ] **Step 1:** Write failing tests:
  ```ts
  test("six features in spec order, exactly three with screenshots", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("#features article.feature h3")).toHaveText([
      "App limits","Reels & Shorts blocker","Focus schedules","Notification digests","Grayscale","Honest screen time"]);
    const imgs = page.locator("#features article.feature img");
    await expect(imgs).toHaveCount(3);
    for (const i of await imgs.all()) await expect(i).toHaveAttribute("loading", "lazy");
  });
  test("seven themes with alt text", async ({ page }) => {
    await page.goto("/");
    const alts = await page.locator("#themes [data-themes] img").evaluateAll(n => n.map(i => (i as HTMLImageElement).alt));
    expect(alts).toEqual(["Mono Dark","Mono Light","Paper","Slate","Sepia Night","Dusk","Sage"]
      .map(t => `Tarnquil home screen in the ${t} theme`));
  });
  ```
  Expected: FAIL.
- [ ] **Step 2:** Implement `Features.astro` using the six titles and one-liners from spec §3. Use the alt text from `assets/seo/keywords.md` for the three image cards, a 3-column grid at ≥ 900px, and text-only cards that keep the same height rhythm with no image placeholder.
- [ ] **Step 3:** Implement `Themes.astro`: a heading, one line "Seven calm themes and four typefaces. Pick one, then forget about it.", and a `ul` that is `display:flex; overflow-x:auto; scroll-snap-type:x mandatory` on mobile. The row scrolls inside itself (`overscroll-behavior-x: contain`, `max-width: 100%`). At ≥ 900px it becomes a fanned row (`transform: rotate()` per item, no scroll). Images use `widths={[240,360]}` and lazy loading. Keyboard: the `ul` gets `tabindex="0"` and `aria-label="Theme previews"` so it is scrollable by keyboard.
- [ ] **Step 4:** Run `pnpm test`. Expected: PASS.
- [ ] **Step 5:** Commit: `feat: features grid and themes strip`.

### Task 6: Privacy, FAQ, Download sections + reveal motion

**Files:**
- Create: `sections/{Privacy,Faq,Download}.astro`; add `initReveal()` to `enhance.ts`
- Test: `tests/sections.spec.ts`, `tests/motion.spec.ts`

**Interfaces:**
- Consumes: `FAQ`, `<PlayBadge size="lg">`, `<Arcs>`
- Produces: `initReveal(): void`, which observes `[data-reveal]` and adds `.is-visible` once

- [ ] **Step 1:** Write failing tests:
  ```ts
  test("faq text matches json-ld exactly", async ({ page }) => {
    await page.goto("/");
    const ld = (await page.locator('script[type="application/ld+json"]').allTextContents())
      .map(t => JSON.parse(t)).find(j => j["@type"] === "FAQPage");
    const qs = await page.locator("#faq details summary").allTextContents();
    expect(qs.map(s => s.trim())).toEqual(ld.mainEntity.map((e: any) => e.name));
  });
  test("content visible without JS", async ({ browser }) => {
    const ctx = await browser.newContext({ javaScriptEnabled: false });
    const page = await ctx.newPage(); await page.goto("/");
    for (const id of ["hero","how","features","themes","privacy","faq","download"])
      await expect(page.locator(`#${id} h1, #${id} h2`).first()).toBeVisible();
    await expect(page.locator("[data-pause-options] button").first()).toBeVisible();
  });
  test("reduced motion: no reveal transform, no autoplay", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");
    const t = await page.locator("[data-reveal]").first().evaluate(e => getComputedStyle(e).transform);
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
  ```
  Expected: FAIL.
- [ ] **Step 2:** `Privacy.astro`: the heading "Nothing leaves your phone." and four plain facts as a `dl`: **No accounts** · **No ads or analytics** · **On-device only** (usage, notifications, limits and notes stay on your phone) · **Open source** (Apache-2.0). Add one paragraph on the Accessibility permission, using the FAQ answer's wording, and a link "Read the privacy policy" → `/privacy`. There are no images.
- [ ] **Step 3:** `Faq.astro`: renders `FAQ` as `<details><summary>q</summary><p>a</p></details>`. `Download.astro`: `<Arcs>` (static), the heading "Ready for a calmer phone?", "Free. No ads. Android 9 and later." and `<PlayBadge size="lg">`.
- [ ] **Step 4:** Add `data-reveal` to each section's inner wrapper (not the hero, which must render instantly for LCP). Implement `initReveal()` per spec §5.1. Gate the CSS hidden state behind `html.js` **and** `@media (prefers-reduced-motion: no-preference)`. Inline the bundled `enhance.ts` with `<script is:inline>` via Vite `?raw` + esbuild, or the Astro default hoisted script if its output is a single small file. Check that the gz size is < 5 KB in Task 7.
- [ ] **Step 5:** Run `pnpm test`. Expected: PASS.
- [ ] **Step 6:** Commit: `feat: privacy, faq, download sections and scroll reveal`.

### Task 7: `/privacy`, 404, quality gates

**Files:**
- Create: `src/pages/privacy.astro`, `src/pages/404.astro`, `lighthouserc.json`, `.htmlvalidate.json`, `tests/{a11y,responsive}.spec.ts`
- Modify: `package.json` scripts

**Interfaces:**
- Consumes: `<Base>` and `src/content/privacy-policy.md`
- Produces: `pnpm check`, which runs `astro check && pnpm build && pnpm lint:html && pnpm test && pnpm lhci`. This is the single gate the launch plan relies on.

- [ ] **Step 1:** Write failing tests:
  ```ts
  // seo.spec.ts
  test("privacy page", async ({ page }) => {
    await page.goto("/privacy");
    await expect(page.locator("h1")).toHaveText("Privacy Policy for Tarnquil");
    await expect(page.locator("link[rel=canonical]")).toHaveAttribute("href", `${SITE_URL}/privacy`);
  });
  test("404 is noindex and links home", async ({ page }) => {
    const r = await page.goto("/does-not-exist");
    expect(r?.status()).toBe(404);
    await expect(page.locator('meta[name=robots]')).toHaveAttribute("content", /noindex/);
    await expect(page.locator('a[href="/"]').first()).toBeVisible();
  });
  // responsive.spec.ts — run at 320, 360, 768, 1280, 1920 widths
  test("no horizontal overflow", async ({ page }) => {
    for (const w of [320, 360, 768, 1280, 1920]) {
      await page.setViewportSize({ width: w, height: 800 }); await page.goto("/");
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    }
  });
  // a11y.spec.ts — for "/" and "/privacy", in both colour schemes
  test("axe: no violations", async ({ page }) => { /* AxeBuilder(page).withTags(["wcag2a","wcag2aa"]).analyze() → violations toEqual([]) */ });
  // js budget: gzip size of every .js file under dist/ plus the inline <script> text in dist/index.html, summed → < 5120
  test("js budget", async () => { /* use fs + zlib.gzipSync */ });
  ```
  Expected: FAIL.
- [ ] **Step 2:** `privacy.astro` renders the synced Markdown inside `<Base path="/privacy" title="Privacy Policy — Tarnquil">` with readable prose styles (max 68ch). The Markdown's own H1 is the page H1. `404.astro` uses `<Base noindex>`, the mark, the line "This page took a break." and a link home.
- [ ] **Step 3:** `.htmlvalidate.json` extends `html-validate:recommended` and runs as `html-validate "dist/**/*.html"`. `lighthouserc.json`: `staticDistDir: "./dist"`, URLs `/` and `/privacy`, mobile preset, assertions `categories:performance ≥ 0.95`, `accessibility = 1`, `best-practices = 1`, `seo = 1`, `largest-contentful-paint ≤ 2000`, `cumulative-layout-shift ≤ 0.02`, and `total-byte-weight` at a warning above 350000 (initial-viewport weight, spec §8).
- [ ] **Step 4:** Grep gate in `pnpm check`: `! grep -rn "com\.waygosquad\." src public --exclude=site.ts`. It must output nothing.
- [ ] **Step 5:** Run `pnpm check`. Expected: every step exits 0. Fix any regressions in the owning component, not with test exceptions.
- [ ] **Step 6:** Commit: `feat: privacy page, 404 and quality gates`.

---

## Done when

`pnpm check` passes, a manual pass on a real Android phone (Chrome, dark and light) looks right, and the Play badge opens the Play app on the correct listing. Deploy and launch steps are in `docs/plans/2026-10-24-launch-and-seo.md`.
