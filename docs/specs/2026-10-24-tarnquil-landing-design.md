# Tarnquil Landing Page — Design Spec

**Date:** 2026-10-24
**Site:** https://tarnquil.waygosquad.com (canonical host; 301 any other host to it)
**Product:** Tarnquil, a free, text-only minimalist Android launcher (source: `/Users/prabhatkumar/Projects/creations/apps/DetoxDesk`)
**Asset source:** `/Users/prabhatkumar/Projects/creations/apps/DetoxDesk/assets`

---

## 0. Open decision: Play Store package id

The brief says the Play id is **`com.waygosquad.tranquil`**. The app (`app/build.gradle.kts:16`), the privacy policy, `llms.txt`, the JSON-LD and the listing files all say **`com.waygosquad.tarnquil`**.

The id is permanent once an app is published on Play, and a Play link with the wrong id returns a 404. The site keeps the id in **one constant** (`PLAY_PACKAGE` in `src/config/site.ts`). Every Play URL, JSON-LD field and `llms.txt` line is built from it. **Confirm the id before launch.** Until then the default is `com.waygosquad.tarnquil`, because that is what the build will upload.

---

## 1. Goals

1. **Convert:** a visitor from search or a shared link understands the product within 5 seconds and taps "Get it on Google Play".
2. **Rank:** target the keywords in `assets/seo/keywords.md`. Primary: *minimalist launcher android*, *reduce screen time app*, *digital detox launcher*.
3. **Reassure:** show plainly that there is no data collection and explain why the Accessibility permission is needed. That permission is the main install objection.
4. **Feel like the app:** calm, text-first, near-black, Lora serif, concentric-arc motif. The page should feel like a Tarnquil home screen.

**Non-goals:** blog, i18n, accounts, analytics SDKs, cookie banner, CMS. A launcher that sells "nothing leaves your phone" should not track its own visitors. If traffic numbers are ever needed, use server access logs or a cookieless counter. That is out of scope for v1.

## 2. Audience

People who already feel their phone use is compulsive and are searching for a fix: "stop doomscrolling", "block reels", "minimalist launcher". They are mostly on Android phones, so **design for mobile first**. Desktop visitors are often reading a shared link. They need the Play link, a QR code is unnecessary, and a short line telling them to open the page on their phone is enough.

## 3. Information architecture

Single page `/`, plus `/privacy` and `/404`.

| # | Section (`id`) | Purpose | Heading (H2 unless noted) |
|---|---|---|---|
| 1 | `hero` | Promise + CTA | **H1:** "Use your phone on purpose." Sub: "Tarnquil is a quiet, text-only launcher for Android. App limits, a Reels and Shorts blocker, and honest screen time, all on your phone." |
| 2 | `how` | The core loop, shown in the real app | "The launcher that pauses first." Three steps: **Pause** → **Choose a session** → **See your day**, beside the tour video |
| 3 | `features` | Scannable feature grid (6) | "Fewer taps, more days." |
| 4 | `themes` | Personalisation, shown with real captures | "A quieter home screen, your way." |
| 5 | `privacy` | Trust | "Nothing leaves your phone." |
| 6 | `faq` | Objections + FAQ rich result | "Questions" |
| 7 | `download` | Final CTA | "Ready for a calmer phone?" |
| — | footer | Privacy, source/licence, WayGoSquad, contact | — |

Navigation: a slim header with the wordmark, two anchor links (Features, Privacy) and a small "Get the app" button. No hamburger menu: there are only three items.

### Feature grid (section 3): exactly these six, in this order

| Feature | One-liner (≤ 14 words) | Visual |
|---|---|---|
| App limits | Daily limits, a mindful pause and a session timer you set yourself. | `phone/06-app-limits.png` |
| Reels & Shorts blocker | Steps you out of YouTube Shorts, Instagram Reels, Facebook Reels and Snapchat Spotlight. | `phone/11-micro-videos.png` |
| Focus schedules | Work, Study and Sleep routines plus a built-in Pomodoro timer. | `phone/08-schedules.png` |
| Notification digests | Hold noisy notifications and get them in batches, at times you pick. | text only |
| Grayscale | One tap to drain the colour from feeds and games. | text only |
| Honest screen time | Screen time, unlocks, streaks and a weekly report, kept on device. | text only (the Progress screen is already in the hero) |

Three cards carry a screenshot and three are text-only. **This is deliberate.** A screenshot is used only where it shows something the copy cannot.

### FAQ (section 6)

Use the six Q&As in `assets/seo/structured-data/faq.json` **verbatim**, so the visible text and the JSON-LD match (Google requires this). Render them as `<details>/<summary>` elements so the page needs no JS.

## 4. Visual system

Taken from `assets/landing-page/README.md`. These are the app's own values.

| Token | Dark (default) | Light (`prefers-color-scheme: light`) |
|---|---|---|
| `--bg` | `#0D0F11` | `#F4F3EF` |
| `--surface` | `#15181B` | `#ECEAE4` |
| `--text` | `#F0F2F5` | `#16181A` |
| `--muted` | `#8C929A` | `#5E636A` |
| `--hairline` | `#26292D` | `#D9D6CE` |

- **Dark is the default.** The brand and almost every capture are dark. Light mode follows the visitor's OS setting and swaps in the `light-*` captures (see §6). There is no theme toggle.
- **Type:** Lora for headings and app-name lists, mirroring the app. Inter for body and UI. Both are self-hosted woff2 with `font-display: swap`, and only weight 400 of Lora is preloaded. Use a fluid scale: H1 `clamp(2.5rem, 6vw + 1rem, 5rem)`, H2 `clamp(1.75rem, 3vw + 1rem, 2.75rem)`, body 1.0625rem with a 1.6 line height.
- **Layout:** single column on mobile with 20px gutters. From 900px wide, text and phone sit side by side. Max content width is 1120px.
- **Motif:** the concentric arcs from the app wallpaper and hero, drawn as one inline SVG of hairline circles behind the hero and the final CTA. There are no other decorative graphics, gradients or emoji.
- **Phone frame:** raw captures (1080×2400) sit in a **CSS** device frame: `border-radius: 2.25rem`, a 6px `--hairline` border, black inner background and `aspect-ratio: 9/20`. Pre-framed images are not used on the page, because their captions are baked into the pixels. Baked-in text duplicates the page copy and is invisible to search engines.
- **CTA:** the official "Get it on Google Play" badge (SVG, from Google's badge generator, en-US), used under Google's brand guidelines. It is at least 48px tall and keeps its clear space. Do not restyle it.

## 5. Motion principles

"Clean, intuitive, minimal" means motion that explains something or eases attention, and nothing that performs for its own sake.

1. **Reveal on scroll:** each section's content fades from `opacity: 0; translateY(12px)` to rest over **480ms** with `cubic-bezier(.2,.7,.2,1)`. It runs once and never on re-scroll. It is driven by one `IntersectionObserver` (threshold 0.15) that adds `.is-visible`. **Without JS, content is visible:** the hidden state applies only under `html.js`.
2. **Breathing arcs:** the hero arcs scale between 1 and 1.03 and fade opacity 0.5→0.8 over a **9s** ease-in-out loop. They move slowly enough to read as calm rather than motion.
3. **Pause demo** (signature moment, in `#how`): a small pure-CSS/JS replica of the session picker. A thin progress line drains over 3s with the text "Take a breath…", then the 1 / 5 / 10 / 15 / 30 min options fade in one by one, 60ms apart. It replays when tapped. It is the only interactive flourish on the page, and it shows the product's core idea better than any screenshot.
4. **Tour video:** plays only while at least 50% of it is on screen and pauses when it leaves (`IntersectionObserver`).
5. **Hover/focus:** links underline-offset transition 150ms, the badge lifts 2px, and focus rings are always visible (`:focus-visible`, 2px `--text` outline, 3px offset).
6. **`prefers-reduced-motion: reduce`:** turns off reveals (content shown), arcs (static), the pause demo countdown (options shown at once) and video autoplay (poster image plus a play button).

Animate only `opacity` and `transform`. There is no animation library, scroll-jacking, parallax, cursor effect or typing effect.

## 6. Asset usage map

Rule: **each asset on the page earns its place by showing something the copy cannot.** Everything is optimised at build time to AVIF/WebP with `srcset`. No raw PNG is served to the page except the social cards.

### Used

| Asset (relative to `assets/`) | Where | Notes |
|---|---|---|
| `landing-page/images/hero-3-phones-2400x1350.png` | Hero, below the CTA | This is the LCP image. Serve `fetchpriority="high"`, `loading="eager"`, widths 640/960/1280/1920/2400 and AVIF+WebP. Alt: "Tarnquil's app drawer, home screen and Progress page side by side". |
| `landing-page/video/tarnquil-tour.mp4` | `#how`, inside the CSS phone frame | `muted loop playsinline preload="none"`, poster = optimised `playstore/screenshots/phone/01-home.png` (the tour starts on Home, so the poster matches the first frame), explicit `width=720 height=1600`. |
| `playstore/screenshots/phone/06-app-limits.png`, `11-micro-videos.png`, `08-schedules.png` | Feature cards | Raw captures in the CSS frame, `loading="lazy"`. Alt text comes from `seo/keywords.md`. |
| `landing-page/screenshots/theme-{mono-dark,paper,slate,sepia-night,dusk,sage}.png` + `light-home.png` (as "mono light") | `#themes` strip | Seven frames in a horizontally scrollable, `scroll-snap` row on mobile and a fanned row on desktop. Lazy loaded at width ≤ 360px. Alt: "Tarnquil home screen in the <Theme> theme". |
| `landing-page/screenshots/light-{home,progress,drawer}.png` | Light-mode variants of the hero-adjacent and `#how` poster images | Use `<picture>` with `media="(prefers-color-scheme: light)"`. This is what the light captures exist for. |
| `brand/logo/tarnquil-mark.svg` | Header wordmark, footer, 404 | Inline SVG using `currentColor`. |
| `landing-page/favicons/*`, `seo/site.webmanifest`, `seo/browserconfig.xml` | `/favicons/`, `/` | As in `seo/head-snippet.html`. |
| `landing-page/images/og-image-1200x630.png`, `twitter-card-1200x600.png` | `/images/` | Social meta only. Served as PNG (social scrapers). |
| `seo/robots.txt`, `sitemap.xml`, `humans.txt`, `llms.txt`, `well-known/security.txt` | site root | `sitemap.xml` and `llms.txt` are generated so the Play id and dates stay in sync (see §7). |
| `landing-page/fonts/Lora-Regular.ttf` | — | Replaced by the same family from `@fontsource/lora` (woff2, subset). The TTF stays unused because it is ~5× larger. |

### Deliberately not used

| Asset | Why |
|---|---|
| `landing-page/gif/tarnquil-tour.gif` | The MP4 shows the same tour at half the size with better quality. Keep the GIF for README/GitHub only. |
| `landing-page/screenshots/framed-*.png`, `playstore/screenshots/phone-framed/*` | Their baked-in captions would duplicate the page headings (see §4). |
| `playstore/screenshots/tablet-*/*` | Tablet captures add nothing for a launcher used on phones. |
| `playstore/feature-graphic/*`, `playstore/icon/*` | These are Play Console–only formats. |
| `brand/icons/ic_launcher-*` | The favicons already cover every size. |
| `phone/02-session-picker.png` | Replaced by the live pause demo (§5.3), which shows the same screen with its motion. |
| `phone/03-drawer`, `04-progress`, `05-today`, `07-settings`, `09-search`, `10-appearance`, `12-about` | Covered by the hero image, or not useful to a first-time visitor. |

## 7. SEO requirements

- **Static HTML**: every word of copy is in the server-rendered HTML. JS only enhances the page (reveals, video, demo).
- `<title>`: "Tarnquil — Minimalist Android Launcher to Reduce Screen Time" (≤ 60 chars).
- Meta description: the 160-char text in `seo/keywords.md`.
- Exactly **one H1** per page and an ordered heading outline (H1 → H2 → H3, no skipped levels).
- Canonical: `https://tarnquil.waygosquad.com/` (and `/privacy`). No trailing-slash ambiguity: set `trailingSlash: "never"` and build `/privacy` as `privacy/index.html`.
- OG/Twitter tags as in `seo/head-snippet.html`, except:
  - drop `<meta name="keywords">` (search engines ignore it) and `<link rel="alternate" href="android-app://…">` (it is for deep-linking app content, and this page has none).
  - add `<meta name="google-play-app" content="app-id=PLAY_PACKAGE">`.
- JSON-LD: `SoftwareApplication`, `WebSite`, `Organization` and `FAQPage`, from `seo/structured-data/*.json`. They are generated from `src/config/site.ts` so the Play URLs use `PLAY_PACKAGE`. Point `screenshot` at the optimised images we actually ship. **No `aggregateRating`** until there are real Play reviews.
- `sitemap.xml`: `/` and `/privacy` with `lastmod` set to the build date and the OG image as an `image:image`.
- Every `<img>` has `width`/`height` (no CLS) and meaningful `alt`. Decorative SVG has `aria-hidden="true"`.
- `lang="en"`, `theme-color` `#0D0F11` (dark) / `#F4F3EF` (light) via two `media`-qualified tags.
- `/privacy` is rendered from the app repo's `privacy-policy.md` and is the URL submitted to Play Console.
- Internal links use descriptive text. External links to Play open in the same tab, because on Android this hands off to the Play app.

## 8. Quality bars (acceptance)

| Metric | Target (mobile, Lighthouse, `astro preview`) |
|---|---|
| Performance | ≥ 95 |
| Accessibility | 100 |
| Best Practices | 100 |
| SEO | 100 |
| LCP | < 2.0s (simulated Slow 4G) |
| CLS | < 0.02 |
| Total JS shipped | < 5 KB gzipped |
| Initial page weight (before scroll) | < 350 KB |

Also required: valid HTML (`html-validate`), passing the Rich Results Test for FAQ + SoftwareApplication, WCAG AA contrast in both colour schemes, full keyboard operability, and correct rendering at 360px, 768px, 1280px and 1920px widths.

## 9. Tech choice

**Astro (static output)**, with plain CSS and no UI framework.
- Ships zero JS by default. The page's ~2 KB of behaviour is one inline `<script>`.
- `astro:assets` turns the 1080×2400 PNGs into responsive AVIF/WebP with dimensions. Hand-optimising ~15 images is not a good use of time.
- Markdown rendering for `/privacy`, and `@astrojs/sitemap` is not needed because the sitemap is a two-URL static endpoint.
- The output is a folder of static files that deploys anywhere (Coolify/nginx, Cloudflare Pages, Netlify).

Testing: Playwright (built-HTML assertions + browser behaviour) and Lighthouse CI (budgets in §8).
