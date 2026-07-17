(function () {
  "use strict";

  const jokes = [
    "Why do programmers prefer dark mode? Light attracts bugs.",
    "Arrays start at 0, not 1. Fight me.",
    "Sleep is a blocking call with indefinite timeout.",
    "My code works, I have no idea why.",
    "Debugging: being a detective and a murderer in the same story.",
  ];

  function showRandomJoke() {
    var el = document.getElementById("joke");
    if (el) {
      el.textContent = jokes[Math.floor(Math.random() * jokes.length)];
    }
  }

  function init() {
    showRandomJoke();
  }

  document.addEventListener("DOMContentLoaded", init);
  document.addEventListener("astro:page-load", init);
})();
