import type { APIRoute } from "astro";
import { SITE_URL } from "../config/site";

export const prerender = true;

export const GET: APIRoute = async () => {
  const buildDate = new Date().toISOString().split("T")[0];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
  <url>
    <loc>${SITE_URL}/</loc>
    <lastmod>${buildDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
    <image:image>
      <image:loc>${SITE_URL}/images/og-image-1200x630.png</image:loc>
      <image:title>Tarnquil Minimalist Android Launcher</image:title>
    </image:image>
  </url>
  <url>
    <loc>${SITE_URL}/privacy</loc>
    <lastmod>${buildDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>
</urlset>`;

  return new Response(xml.trim(), {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
    },
  });
};
