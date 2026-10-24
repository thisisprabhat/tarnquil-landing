import type { APIRoute } from "astro";
import { SITE, SITE_URL, PLAY_PACKAGE, PLAY_URL } from "../config/site";

export const prerender = true;

export const GET: APIRoute = async () => {
  const content = `# Tarnquil

> ${SITE.description}

Made by ${SITE.author} (${SITE.org.name}). Package: ${PLAY_PACKAGE}. ${SITE.minAndroid} (API 28).

## Key facts
- Replaces the icon grid with a quiet page of text; swipeable Today, Home and Progress pages.
- App limits: mindful pause, session picker ("How long do you want to spend here?"), daily limits, max opens.
- Focus schedules (work, study, sleep) and a Pomodoro timer.
- Short-video blocker for YouTube Shorts, Instagram Reels, Facebook Reels, Snapchat Spotlight (uses an Accessibility service, on-device only).
- Notification filter with scheduled digests, in-app grayscale, screen-time dashboard, weekly report, JSON backup.
- 7 themes, 4 fonts, text widgets (screen time, weather, calendar, to-do, notes), work-profile support.

## Links
- [Home page](${SITE_URL}/): overview, screenshots, download
- [Privacy policy](${SITE_URL}/privacy): what is and is not collected (nothing leaves the device)
- [Google Play](${PLAY_URL}): install
`;

  return new Response(content.trim() + "\n", {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
};
