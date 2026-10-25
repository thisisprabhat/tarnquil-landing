import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
// Path to a checkout of the app repo (github.com/thisisprabhat/DetoxDesk); override with TARNQUIL_APP_ROOT.
const APP_ROOT = path.resolve(process.env.TARNQUIL_APP_ROOT ?? path.join(ROOT, "../../apps/DetoxDesk"));
const ASSETS_ROOT = path.join(APP_ROOT, "assets");

// Allowlist map: [source path relative to APP_ROOT or ASSETS_ROOT, dest path relative to ROOT]
const copies = [
  // Privacy Policy from app root
  [path.join(APP_ROOT, "privacy-policy.md"), path.join(ROOT, "src/content/privacy-policy.md")],

  // Root / SEO files to public/
  [path.join(ASSETS_ROOT, "seo/robots.txt"), path.join(ROOT, "public/robots.txt")],
  [path.join(ASSETS_ROOT, "seo/site.webmanifest"), path.join(ROOT, "public/site.webmanifest")],
  [path.join(ASSETS_ROOT, "seo/browserconfig.xml"), path.join(ROOT, "public/browserconfig.xml")],
  [path.join(ASSETS_ROOT, "seo/humans.txt"), path.join(ROOT, "public/humans.txt")],
  [path.join(ASSETS_ROOT, "seo/well-known/security.txt"), path.join(ROOT, "public/.well-known/security.txt")],

  // Favicons
  [path.join(ASSETS_ROOT, "landing-page/favicons/favicon.ico"), path.join(ROOT, "public/favicon.ico")],
  [path.join(ASSETS_ROOT, "landing-page/favicons/favicon-16x16.png"), path.join(ROOT, "public/favicons/favicon-16x16.png")],
  [path.join(ASSETS_ROOT, "landing-page/favicons/favicon-32x32.png"), path.join(ROOT, "public/favicons/favicon-32x32.png")],
  [path.join(ASSETS_ROOT, "landing-page/favicons/favicon-48x48.png"), path.join(ROOT, "public/favicons/favicon-48x48.png")],
  [path.join(ASSETS_ROOT, "landing-page/favicons/apple-touch-icon.png"), path.join(ROOT, "public/favicons/apple-touch-icon.png")],
  [path.join(ASSETS_ROOT, "landing-page/favicons/android-chrome-192x192.png"), path.join(ROOT, "public/favicons/android-chrome-192x192.png")],
  [path.join(ASSETS_ROOT, "landing-page/favicons/android-chrome-512x512.png"), path.join(ROOT, "public/favicons/android-chrome-512x512.png")],
  [path.join(ASSETS_ROOT, "landing-page/favicons/maskable-512x512.png"), path.join(ROOT, "public/favicons/maskable-512x512.png")],
  [path.join(ASSETS_ROOT, "landing-page/favicons/mstile-150x150.png"), path.join(ROOT, "public/favicons/mstile-150x150.png")],
  [path.join(ASSETS_ROOT, "landing-page/favicons/tarnquil-mark.svg"), path.join(ROOT, "public/favicons/tarnquil-mark.svg")],

  // Social cards to public/images/
  [path.join(ASSETS_ROOT, "landing-page/images/og-image-1200x630.png"), path.join(ROOT, "public/images/og-image-1200x630.png")],
  [path.join(ASSETS_ROOT, "landing-page/images/twitter-card-1200x600.png"), path.join(ROOT, "public/images/twitter-card-1200x600.png")],

  // Logo / Marks to src/assets/images and public/
  [path.join(ASSETS_ROOT, "brand/logo/tarnquil-mark.svg"), path.join(ROOT, "src/assets/images/tarnquil-mark.svg")],
  [path.join(ASSETS_ROOT, "brand/logo/tarnquil-icon.svg"), path.join(ROOT, "src/assets/images/tarnquil-icon.svg")],

  // Hero image to src/assets/images/
  [path.join(ASSETS_ROOT, "landing-page/images/hero-3-phones-2400x1350.png"), path.join(ROOT, "src/assets/images/hero-3-phones-2400x1350.png")],

  // Tour video to src/assets/video/ and public/video/
  [path.join(ASSETS_ROOT, "landing-page/video/tarnquil-tour.mp4"), path.join(ROOT, "src/assets/video/tarnquil-tour.mp4")],

  // Accessibility prominent-disclosure video, served at /video/accessibility-disclosure.mp4 (linked from the Play Console declaration)
  [path.join(ASSETS_ROOT, "landing-page/video/accessibility-disclosure.mp4"), path.join(ROOT, "public/video/accessibility-disclosure.mp4")],

  // Screenshots: phone captures for How poster, Features
  [path.join(ASSETS_ROOT, "playstore/screenshots/phone/01-home.png"), path.join(ROOT, "src/assets/screens/01-home.png")],
  [path.join(ASSETS_ROOT, "playstore/screenshots/phone/06-app-limits.png"), path.join(ROOT, "src/assets/screens/06-app-limits.png")],
  [path.join(ASSETS_ROOT, "playstore/screenshots/phone/11-micro-videos.png"), path.join(ROOT, "src/assets/screens/11-micro-videos.png")],
  [path.join(ASSETS_ROOT, "playstore/screenshots/phone/08-schedules.png"), path.join(ROOT, "src/assets/screens/08-schedules.png")],

  // Light captures
  [path.join(ASSETS_ROOT, "landing-page/screenshots/light-home.png"), path.join(ROOT, "src/assets/screens/light-home.png")],
  [path.join(ASSETS_ROOT, "landing-page/screenshots/light-progress.png"), path.join(ROOT, "src/assets/screens/light-progress.png")],
  [path.join(ASSETS_ROOT, "landing-page/screenshots/light-drawer.png"), path.join(ROOT, "src/assets/screens/light-drawer.png")],

  // Themes (7 themes)
  [path.join(ASSETS_ROOT, "landing-page/screenshots/theme-mono-dark.png"), path.join(ROOT, "src/assets/themes/theme-mono-dark.png")],
  [path.join(ASSETS_ROOT, "landing-page/screenshots/light-home.png"), path.join(ROOT, "src/assets/themes/theme-mono-light.png")],
  [path.join(ASSETS_ROOT, "landing-page/screenshots/theme-paper.png"), path.join(ROOT, "src/assets/themes/theme-paper.png")],
  [path.join(ASSETS_ROOT, "landing-page/screenshots/theme-slate.png"), path.join(ROOT, "src/assets/themes/theme-slate.png")],
  [path.join(ASSETS_ROOT, "landing-page/screenshots/theme-sepia-night.png"), path.join(ROOT, "src/assets/themes/theme-sepia-night.png")],
  [path.join(ASSETS_ROOT, "landing-page/screenshots/theme-dusk.png"), path.join(ROOT, "src/assets/themes/theme-dusk.png")],
  [path.join(ASSETS_ROOT, "landing-page/screenshots/theme-sage.png"), path.join(ROOT, "src/assets/themes/theme-sage.png")],
];

console.log(`Syncing ${copies.length} files from DetoxDesk assets...`);
const missing = [];

for (const [src, dest] of copies) {
  if (!fs.existsSync(src)) {
    missing.push(src);
  }
}

if (missing.length > 0) {
  console.error("Missing source files:\n" + missing.map((m) => ` - ${m}`).join("\n"));
  process.exit(1);
}

for (const [src, dest] of copies) {
  const dir = path.dirname(dest);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.copyFileSync(src, dest);
}

console.log(`Successfully copied ${copies.length} files.`);
