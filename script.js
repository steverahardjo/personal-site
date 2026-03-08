// Theme Toggle
(function() {
    const btn = document.getElementById('themeToggle');
    const html = document.documentElement;
    const saved = localStorage.getItem('theme') || 'light';
    html.setAttribute('data-theme', saved);
    
    btn?.addEventListener('click', () => {
        const current = html.getAttribute('data-theme');
        const next = current === 'dark' ? 'light' : 'dark';
        html.setAttribute('data-theme', next);
        localStorage.setItem('theme', next);
    });
})();

// Joke Rotator
const jokes = [
    "Why do programmers prefer dark mode? Light attracts bugs. 🐛",
    "Arrays start at 0, not 1. Fight me. 🥊",
    "Sleep is a blocking call with indefinite timeout. 😴",
    "My code works, I have no idea why. 🤷",
    "Debugging: being detective and murderer in the same story. 🔍"
];

const jokeEl = document.getElementById('joke');
if (jokeEl) {
    jokeEl.textContent = jokes[Math.floor(Math.random() * jokes.length)];
}
