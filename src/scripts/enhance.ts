import { sieve, relay, plot, padlock, query, turntable, dish, settle } from "@lucasmarkes/hairline";

const figureMap: Record<string, any> = {
  sieve,
  relay,
  plot,
  padlock,
  query,
  turntable,
  dish,
  settle,
};

export function initHairlineFigures() {
  const elements = document.querySelectorAll<HTMLElement>("[data-hairline-figure]");
  if (!elements.length) return;

  const getTheme = (): "light" | "dark" => {
    const attr = document.documentElement.getAttribute("data-theme");
    if (attr === "light" || attr === "dark") return attr;
    return window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
  };

  const instances: Array<{ update: (opts: any) => void; destroy: () => void }> = [];

  elements.forEach((el) => {
    const type = el.getAttribute("data-hairline-figure");
    if (!type || !figureMap[type]) return;

    const fn = figureMap[type];
    const intensity = parseFloat(el.getAttribute("data-intensity") || "0.5");
    const play = el.getAttribute("data-play") === "true";
    const label = el.getAttribute("data-label") || undefined;

    try {
      const instance = fn(el, {
        intensity,
        play,
        label,
        theme: getTheme(),
      });
      instances.push(instance);
    } catch (e) {
      console.warn("Hairline figure failed to initialize:", e);
    }
  });

  // Listen for theme toggle to update all figures
  const observer = new MutationObserver(() => {
    const theme = getTheme();
    instances.forEach((inst) => inst.update({ theme }));
  });
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });

  window.matchMedia("(prefers-color-scheme: light)").addEventListener("change", () => {
    const theme = getTheme();
    instances.forEach((inst) => inst.update({ theme }));
  });
}

export function initThemeToggle() {
  const toggleBtn = document.getElementById("theme-toggle");
  if (!toggleBtn) return;

  const getPreferredTheme = () => {
    const saved = localStorage.getItem("tarnquil_theme");
    if (saved === "light" || saved === "dark") return saved;
    return window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
  };

  const setTheme = (theme: "light" | "dark") => {
    document.documentElement.setAttribute("data-theme", theme);
    try {
      localStorage.setItem("tarnquil_theme", theme);
    } catch (e) {}
  };

  toggleBtn.addEventListener("click", () => {
    const current = document.documentElement.getAttribute("data-theme") || getPreferredTheme();
    const next = current === "light" ? "dark" : "light";
    setTheme(next);
  });
}

export function initReveal() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return;
  }

  const elements = document.querySelectorAll("[data-reveal]");
  if (!elements.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      }
    },
    { threshold: 0.15 }
  );

  elements.forEach((el) => observer.observe(el));
}

export function initInViewVideo(video: HTMLVideoElement) {
  const phoneFrame = video.closest(".phone-frame") || video.parentElement;

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    video.setAttribute("controls", "true");
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          video.play().then(() => {
            phoneFrame?.classList.add("is-playing");
          }).catch(() => {});
        } else {
          video.pause();
        }
      }
    },
    { threshold: 0.5 }
  );

  observer.observe(video);
}

export function initPauseDemo(demo: HTMLElement) {
  const progressBar = demo.querySelector<HTMLElement>("[data-pause-bar]");
  const options = demo.querySelectorAll<HTMLElement>("[data-pause-options] button");
  const replayBtn = demo.querySelector<HTMLElement>("[data-pause-replay]");
  const breathText = demo.querySelector<HTMLElement>("[data-pause-text]");

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    if (progressBar) progressBar.style.transform = "scaleX(0)";
    options.forEach((btn) => btn.classList.add("is-in"));
    return;
  }

  let animationId: number | null = null;
  let startTime: number | null = null;
  const DURATION = 3000;

  function runDemo() {
    if (animationId) cancelAnimationFrame(animationId);
    startTime = null;

    if (progressBar) {
      progressBar.style.transform = "scaleX(1)";
      progressBar.style.transition = "none";
    }
    options.forEach((btn) => {
      btn.classList.remove("is-in");
      btn.style.transitionDelay = "0ms";
    });
    if (breathText) breathText.textContent = "Take a breath…";

    function step(timestamp: number) {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / DURATION, 1);
      const remaining = 1 - progress;

      if (progressBar) {
        progressBar.style.transform = `scaleX(${remaining})`;
      }

      if (progress < 1) {
        animationId = requestAnimationFrame(step);
      } else {
        if (breathText) breathText.textContent = "Take a breath… Ready.";
        options.forEach((btn, index) => {
          btn.style.transitionDelay = `${index * 60}ms`;
          btn.classList.add("is-in");
        });
      }
    }

    animationId = requestAnimationFrame(step);
  }

  replayBtn?.addEventListener("click", (e) => {
    e.preventDefault();
    runDemo();
  });

  // Start on load / in view
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          runDemo();
          observer.unobserve(demo);
        }
      }
    },
    { threshold: 0.3 }
  );

  observer.observe(demo);
}

export function init() {
  document.documentElement.classList.add("js");
  initThemeToggle();
  initReveal();
  initHairlineFigures();

  const video = document.querySelector<HTMLVideoElement>("video[data-inview]");
  if (video) initInViewVideo(video);

  const demo = document.querySelector<HTMLElement>("[data-pause-demo]");
  if (demo) initPauseDemo(demo);
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
