(function () {
  "use strict";

  const jokes = [
    "Why do programmers prefer dark mode? Light attracts bugs.",
    "Arrays start at 0, not 1. Fight me.",
    "Sleep is a blocking call with indefinite timeout.",
    "My code works, I have no idea why.",
    "Debugging: being a detective and a murderer in the same story.",
  ];

  var STORAGE_KEY = "theme";
  var KNOB_SELECTOR = "#themeIcon, .theme-knob";
  var TOGGLE_PREFIX = "themeToggle";

  function getPreferredTheme() {
    var stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "dark" || stored === "light") return stored;
    // Optional: respect OS preference
    // return window.matchMedia("(prefers-color-scheme: dark)").matches
    //   ? "dark"
    //   : "light";
    return "light";
  }

  function setTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem(STORAGE_KEY, theme);
    updateToggleLabels(theme);
  }

  function updateToggleLabels(theme) {
    var label =
      theme === "dark" ? "Switch to light mode" : "Switch to dark mode";
    var btns = document.querySelectorAll('[id^="' + TOGGLE_PREFIX + '"]');
    for (var i = 0; i < btns.length; i++) {
      btns[i].setAttribute("aria-label", label);
    }
  }

  function setKnobPosition(theme, animated) {
    // toggle is w-11 = 2.75rem = 44px
    // knob is w-4 = 1rem = 16px
    // offset = 44 - 16 - 2*2px(px-0.5) = 24px = 1.5rem
    var translate = theme === "dark" ? "translateX(1.5rem)" : "translateX(0)";
    var knobs = document.querySelectorAll(KNOB_SELECTOR);
    for (var i = 0; i < knobs.length; i++) {
      if (animated) {
        knobs[i].style.transition =
          "transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)";
      } else {
        knobs[i].style.transition = "none";
      }
      knobs[i].style.transform = translate;
    }
  }

  function bindToggle(btn) {
    if (btn.dataset.bound) return;
    btn.dataset.bound = "true";

    btn.addEventListener("click", function () {
      var html = document.documentElement;
      var current = html.getAttribute("data-theme") || "light";
      var next = current === "dark" ? "light" : "dark";
      setTheme(next);
      setKnobPosition(next, true);
    });
  }

  function showRandomJoke() {
    var el = document.getElementById("joke");
    if (el) {
      el.textContent = jokes[Math.floor(Math.random() * jokes.length)];
    }
  }

  function init() {
    var theme = getPreferredTheme();
    setTheme(theme);
    setKnobPosition(theme, false);

    var btns = document.querySelectorAll('[id^="' + TOGGLE_PREFIX + '"]');
    for (var i = 0; i < btns.length; i++) {
      bindToggle(btns[i]);
    }

    showRandomJoke();
  }

  document.addEventListener("DOMContentLoaded", init);
  document.addEventListener("astro:page-load", init);
})();
