export const SITE_URL = "https://tarnquil.waygosquad.com";
export const PLAY_PACKAGE = "com.waygosquad.tarnquil";
export const PLAY_URL = `https://play.google.com/store/apps/details?id=${PLAY_PACKAGE}`;

export const SITE = {
  name: "Tarnquil",
  title: "Tarnquil — Minimalist Android Launcher to Reduce Screen Time",
  description:
    "Tarnquil is a free, text-only Android launcher that helps you cut screen time and stop mindless scrolling: app limits, short-video blocker, focus schedules. No ads, fully private.",
  h1: "Use your phone on purpose.",
  tagline: "The launcher that pauses first.",
  heroSub:
    "Tarnquil is a quiet, text-only launcher for Android. App limits, a Reels and Shorts blocker, and honest screen time, all on your phone.",
  themeDark: "#0D0F11",
  themeLight: "#F4F3EF",
  surfaceDark: "#15181B",
  surfaceLight: "#ECEAE4",
  textDark: "#F0F2F5",
  textLight: "#16181A",
  mutedDark: "#8C929A",
  mutedLight: "#5E636A",
  hairlineDark: "#26292D",
  hairlineLight: "#D9D6CE",
  author: "Prabhat Kumar",
  org: {
    name: "WayGoSquad",
    url: "https://waygosquad.com",
    email: "contact@waygosquad.com",
  },
  minAndroid: "Android 9 or later",
  version: "0.1.0",
} as const;

export const FAQ = [
  {
    q: "What is Tarnquil?",
    a: "Tarnquil is a free, text-only minimalist launcher for Android. It replaces your icon grid with a quiet page of text and adds pauses, app limits and short-video blocking so you use your phone on purpose.",
  },
  {
    q: "Does Tarnquil collect my data?",
    a: "No. There are no accounts, ads or analytics. Usage stats, notifications, limits and notes stay on your device.",
  },
  {
    q: "Why does Tarnquil need the Accessibility permission?",
    a: "It is used only to detect which app or short-video screen is open so your limits and Reels/Shorts blocking can work. It never reads what you type, and nothing is stored or sent off the device.",
  },
  {
    q: "Can it block Instagram Reels and YouTube Shorts?",
    a: "Yes. Tarnquil detects short-video feeds in YouTube, Instagram, Facebook and Snapchat and steps you out of them, while leaving messages and regular posts alone.",
  },
  {
    q: "Is Tarnquil free?",
    a: "Yes. It is free with no ads, subscriptions or paywalls.",
  },
  {
    q: "Which Android versions are supported?",
    a: "Android 9 (API 28) and later.",
  },
] as const;

export const FEATURES = [
  {
    title: "App limits",
    description: "Daily limits, a mindful pause and a session timer you set yourself.",
    image: "06-app-limits.png",
    alt: "App limits list with Chrome, Gmail and YouTube rules",
  },
  {
    title: "Reels & Shorts blocker",
    description: "Steps you out of YouTube Shorts, Instagram Reels, Facebook Reels and Snapchat Spotlight.",
    image: "11-micro-videos.png",
    alt: "Toggles to block YouTube Shorts, Instagram Reels, Facebook Reels and Snapchat Spotlight",
  },
  {
    title: "Focus schedules",
    description: "Work, Study and Sleep routines plus a built-in Pomodoro timer.",
    image: "08-schedules.png",
    alt: "Pomodoro and Work, Study and Sleep focus schedules",
  },
  {
    title: "Notification digests",
    description: "Hold noisy notifications and get them in batches, at times you pick.",
    figure: "sieve",
    label: "Isometric batch filter holding and releasing notification streams",
  },
  {
    title: "Grayscale",
    description: "One tap to drain the colour from feeds and games.",
    figure: "relay",
    label: "Isometric switch draining saturation and stepping into focus",
  },
  {
    title: "Honest screen time",
    description: "Screen time, unlocks, streaks and a weekly report, kept on device.",
    figure: "plot",
    label: "Isometric calibrated timeline tracking honest screen time on device",
  },
] as const;

export const THEMES = [
  { name: "Mono Dark", file: "theme-mono-dark.png" },
  { name: "Mono Light", file: "theme-mono-light.png" },
  { name: "Paper", file: "theme-paper.png" },
  { name: "Slate", file: "theme-slate.png" },
  { name: "Sepia Night", file: "theme-sepia-night.png" },
  { name: "Dusk", file: "theme-dusk.png" },
  { name: "Sage", file: "theme-sage.png" },
] as const;
