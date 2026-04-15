function initSite() {
  // ========================
  // Theme Toggle
  // ========================
  const btn = document.getElementById("themeToggle");
  const html = document.documentElement;

  if (btn && !btn.dataset.bound) {
    btn.dataset.bound = "true";

    const icons = {
      light: { src: "/swallow.svg", alt: "Swallow icon" },
      dark: { src: "/owl_v2.svg", alt: "Owl icon" },
    };

    const ensureIcon = () => {
      let icon = btn.querySelector("img");
      if (!icon) {
        icon = document.createElement("img");
        icon.width = 24;
        icon.height = 24;
        icon.style.objectFit = "contain";
        btn.replaceChildren(icon);
      }
      return icon;
    };

    const setTheme = (theme) => {
      const icon = ensureIcon();
      const data = theme === "dark" ? icons.dark : icons.light;

      icon.src = data.src;
      icon.alt = data.alt;

      btn.setAttribute(
        "aria-label",
        theme === "dark" ? "Switch to light mode" : "Switch to dark mode",
      );
    };

    const saved = localStorage.getItem("theme") || "light";
    html.setAttribute("data-theme", saved);
    setTheme(saved);

    btn.addEventListener("click", () => {
      const current = html.getAttribute("data-theme");
      const next = current === "dark" ? "light" : "dark";

      html.setAttribute("data-theme", next);
      localStorage.setItem("theme", next);
      setTheme(next);
    });
  }

  // ========================
  // Mobile Menu
  // ========================
  const menuBtn = document.getElementById("mobileMenuBtn");
  const mobileNav = document.getElementById("mobileNav");

  if (menuBtn && mobileNav && !menuBtn.dataset.bound) {
    menuBtn.dataset.bound = "true";

    menuBtn.addEventListener("click", () => {
      menuBtn.classList.toggle("active");
      mobileNav.classList.toggle("open");
    });

    mobileNav.querySelectorAll(".mobile-nav-link").forEach((link) => {
      link.addEventListener("click", () => {
        menuBtn.classList.remove("active");
        mobileNav.classList.remove("open");
      });
    });
  }

  // ========================
  // Joke (runs once per page)
  // ========================
  const jokes = [
    "Why do programmers prefer dark mode? Light attracts bugs. 🐛",
    "Arrays start at 0, not 1. Fight me. 🥊",
    "Sleep is a blocking call with indefinite timeout. 😴",
    "My code works, I have no idea why. 🤷",
    "Debugging: detective + murderer. 🔍",
  ];

  const jokeEl = document.getElementById("joke");
  if (jokeEl) {
    jokeEl.textContent = jokes[Math.floor(Math.random() * jokes.length)];
  }

  // ========================
  // Active Nav (Home only)
  // ========================
  const isHome = document.body.classList.contains("home");

  if (isHome) {
    const sections = document.querySelectorAll("section[id]");
    const navLinks = document.querySelectorAll(".nav-link");

    if (sections.length) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;

            navLinks.forEach((link) => {
              link.classList.toggle(
                "active",
                link.getAttribute("href") === `#${entry.target.id}`,
              );
            });
          });
        },
        {
          rootMargin: "-100px 0px -60% 0px",
        },
      );

      sections.forEach((s) => observer.observe(s));
    }
  }

  // ========================
  // Reading Progress
  // ========================
  const progressBar = document.getElementById("progressBar");
  const isReadingPage =
    document.querySelector(".writing-page") ||
    document.querySelector(".blog-post");

  if (progressBar && isReadingPage) {
    window.addEventListener(
      "scroll",
      () => {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        const percent = (window.scrollY / max) * 100;
        progressBar.style.width = `${percent}%`;
      },
      { passive: true },
    );
  }

  // ========================
  // Copy Email
  // ========================
  document.querySelectorAll('a[href^="mailto:"]').forEach((link) => {
    if (link.dataset.bound) return;
    link.dataset.bound = "true";

    link.addEventListener("click", async (e) => {
      e.preventDefault();

      const email = link.getAttribute("href").replace("mailto:", "");

      try {
        await navigator.clipboard.writeText(email);

        const old = link.textContent;
        link.textContent = "Copied!";
        link.style.color = "var(--red)";

        setTimeout(() => {
          link.textContent = old;
          link.style.color = "";
        }, 1200);
      } catch {
        window.location.href = link.href;
      }
    });
  });

  // ========================
  // Page ready
  // ========================
  document.body.classList.add("loaded");
}

// Run normally
document.addEventListener("DOMContentLoaded", initSite);

// Run again for SPA / transitions (Astro / PJAX safe)
document.addEventListener("astro:page-load", initSite);
document.addEventListener("turbo:load", initSite);
