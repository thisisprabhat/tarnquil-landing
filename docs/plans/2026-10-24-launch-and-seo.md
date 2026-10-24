# Tarnquil Landing — Deploy, Launch & SEO Follow-through Plan

**Goal:** Put the built site live at `https://tarnquil.waygosquad.com`, wire it to the Play listing, and get it indexed.

**Architecture:** Serve the static `dist/` folder from nginx (a Coolify "static site" from this repo, `pnpm build`, publish dir `dist`). Any static host works; only the headers and redirects below matter.

**Spec:** `docs/specs/2026-10-24-tarnquil-landing-design.md` · **Depends on:** `docs/plans/2026-10-24-landing-page-implementation.md` (`pnpm check` green)

## Global Constraints

- Canonical host `tarnquil.waygosquad.com`, HTTPS only. Every other host (`www.`, `tarnquil.waygosquad.tech` if served) returns **301** to it, keeping the path.
- `/privacy` must return 200 at that exact URL. It is the Play Console privacy-policy URL.
- `PLAY_PACKAGE` is confirmed by the owner (spec §0) **before** the first public deploy.

---

### Task 1: Confirm the package id 🔒 owner

- [ ] Ask the owner: is the Play id `com.waygosquad.tarnquil` (what the app builds) or `com.waygosquad.tranquil` (from the brief)? If it is `tranquil`, the **app's** `applicationId` must change before the first Play upload. Then update `PLAY_PACKAGE` in `src/config/site.ts` and run `pnpm check`.

### Task 2: Server config (headers, redirects, caching)

**Files:** Create `deploy/nginx.conf` (or the host's equivalent `_headers`/`_redirects`)

- [ ] **Step 1:** Headers on all responses: `Strict-Transport-Security: max-age=31536000; includeSubDomains`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy: camera=(), microphone=(), geolocation=(), interest-cohort=()`, and `Content-Security-Policy: default-src 'self'; img-src 'self' data:; media-src 'self'; style-src 'self' 'unsafe-inline'; script-src 'self' 'sha256-<inline enhance hash>'; frame-ancestors 'none'; base-uri 'self'`. Compute the hash from `dist/index.html` at build time, or drop the inline script for a hashed external file if that is simpler.
- [ ] **Step 2:** Caching: `/_astro/*` and `/fonts/*` get `Cache-Control: public, max-age=31536000, immutable`. HTML, `sitemap.xml`, `robots.txt` and `llms.txt` get `no-cache`. Serve gzip and brotli for text, and `video/mp4` with byte-range support (the nginx default).
- [ ] **Step 3:** Error page: `error_page 404 /404.html`, so the status stays 404.
- [ ] **Step 4:** Verify locally: `docker run --rm -p 8080:80 -v $PWD/dist:/usr/share/nginx/html:ro -v $PWD/deploy/nginx.conf:/etc/nginx/conf.d/default.conf:ro nginx:1.27-alpine`, then `curl -sI localhost:8080/ | grep -i -E 'strict|content-security|cache'` (expect all three), `curl -sI localhost:8080/nope` (expect `404`), and `curl -sI localhost:8080/privacy` (expect `200`). Open the page and confirm the console shows no CSP violations.
- [ ] **Step 5:** Commit: `chore: nginx config with security headers and caching`.

### Task 3: Deploy 🔒 owner

- [ ] **Step 1:** Push the repo to the owner's Git remote (ask which one).
- [ ] **Step 2:** Create the app in Coolify (or the chosen host) with build `pnpm install --frozen-lockfile && pnpm build`, publish `dist`, the custom nginx config from Task 2, and domain `tarnquil.waygosquad.com`.
- [ ] **Step 3:** DNS: add a `CNAME`/`A` record for `tarnquil` → the host, plus the 301 hosts. Wait for the TLS certificate to issue.
- [ ] **Step 4:** Verify live: `curl -sI https://tarnquil.waygosquad.com/` returns 200 with the headers from Task 2. `curl -sI http://tarnquil.waygosquad.com/` returns 301 to https. Each alias host returns 301 to the canonical host. Run `pnpm lhci` against the live URL with the same budgets.

### Task 4: Wire to Google Play 🔒 owner

- [ ] In Play Console → Store settings, set Website `https://tarnquil.waygosquad.com` and Privacy policy `https://tarnquil.waygosquad.com/privacy`. Set Contact email `contact@waygosquad.com`.
- [ ] After the listing goes live, open the site's badge on an Android phone. It must open the Play app on the Tarnquil listing. On desktop it must open the web listing.

### Task 5: Indexing & validation 🔒 owner

- [ ] Google Search Console: add a Domain property for `waygosquad.com` (or a URL-prefix property for the subdomain), verify with a DNS TXT record, submit `https://tarnquil.waygosquad.com/sitemap.xml`, and request indexing for `/`.
- [ ] Bing Webmaster Tools: import from GSC and submit the sitemap.
- [ ] Rich Results Test on `/`: FAQ and SoftwareApplication detected with no errors.
- [ ] Share previews: check the Facebook Sharing Debugger, LinkedIn Post Inspector and an X post preview. Each shows the OG image, title and description.
- [ ] Link the landing page from the app's About screen, the GitHub README (already present), and the waygosquad.com projects page. These are the first backlinks.

### Task 6: Post-launch upkeep (recurring)

- [ ] When app UI changes: re-run `python3 -I assets/tools/generate_assets.py` in the app repo, then `pnpm sync:assets && pnpm check` here, then redeploy.
- [ ] When real Play reviews exist (≥ 5): add `aggregateRating` to `SoftwareApplication` with the real values, and update it on each release.
- [ ] Each release: bump `SITE.version`. The sitemap `lastmod` updates on build.
- [ ] At 4 weeks: review GSC queries. If "block reels" or "app blocker" queries get impressions without clicks, consider dedicated pages (`/block-reels-and-shorts`, `/minimalist-launcher`) and add them to the sitemap. That is a new spec, not part of this one.
