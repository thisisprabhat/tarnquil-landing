import { SITE, SITE_URL, PLAY_URL, FAQ } from "../config/site";

export function buildJsonLd() {
  const softwareApp = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: SITE.name,
    alternateName: "Tarnquil: Minimalist Launcher",
    description: SITE.description,
    applicationCategory: "UtilitiesApplication",
    operatingSystem: SITE.minAndroid,
    url: `${SITE_URL}/`,
    downloadUrl: PLAY_URL,
    installUrl: PLAY_URL,
    softwareVersion: SITE.version,
    image: `${SITE_URL}/images/og-image-1200x630.png`,
    screenshot: [
      `${SITE_URL}/images/hero-3-phones-2400x1350.png`,
    ],
    featureList: [
      "Icon-free text home screen",
      "App limits with mindful pause and session picker",
      "Short-video (Reels, Shorts) blocker",
      "Focus schedules and Pomodoro",
      "Notification digests",
      "Screen time dashboard and weekly report",
      "Private: no ads, no tracking, on-device only",
    ],
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    author: { "@type": "Person", name: SITE.author, url: SITE.org.url },
    publisher: { "@type": "Organization", name: SITE.org.name, url: SITE.org.url },
  };

  const webSite = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE.name,
    url: `${SITE_URL}/`,
    inLanguage: "en",
    publisher: { "@type": "Organization", name: SITE.org.name, url: SITE.org.url },
  };

  const organization = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE.org.name,
    url: SITE.org.url,
    logo: `${SITE_URL}/favicons/android-chrome-512x512.png`,
    founder: { "@type": "Person", name: SITE.author },
    email: SITE.org.email,
  };

  const faqPage = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a,
      },
    })),
  };

  return [softwareApp, webSite, organization, faqPage];
}
