// Theme Toggle Functionality
(function() {
    const themeToggle = document.getElementById('themeToggle');
    const html = document.documentElement;
    
    // Check for saved theme preference or default to light
    const savedTheme = localStorage.getItem('theme') || 'light';
    html.setAttribute('data-theme', savedTheme);
    
    themeToggle.addEventListener('click', function() {
        const currentTheme = html.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        html.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    });
})();

// Joke Rotator
const jokes = [
    "Why do programmers prefer dark mode? Because light attracts bugs. 🐛",
    "Why do Java developers wear glasses? Because they don't C#. 👓",
    "How many programmers does it take to change a light bulb? None, that's a hardware problem. 💡",
    "Why did the developer go broke? Because he used up all his cache. 💸",
    "I would tell you a UDP joke, but you might not get it. 📦",
    "Why do programmers hate nature? It has too many bugs. 🌿",
    "What's a programmer's favorite hangout place? The Foo Bar. 🍺",
    "Why did the function break up with the variable? It had too many issues. 💔",
    "Sleep is just a blocking call with an indefinite timeout. 😴",
    "My code doesn't work, I have no idea why. My code works, I have no idea why. 🤷",
    "Arrays start at 0, not 1. Fight me. 🥊",
    "I don't always test my code, but when I do, it's in production. 🚀"
];

const jokeElement = document.getElementById('joke');

if (jokeElement) {
    // Change joke on each page load
    const randomIndex = Math.floor(Math.random() * jokes.length);
    jokeElement.textContent = jokes[randomIndex];
}

// Code Copy Functionality
document.querySelectorAll('.code-copy-btn').forEach(function(btn) {
    btn.addEventListener('click', function() {
        const codeBlock = this.closest('.code-snippet').querySelector('pre');
        const codeText = codeBlock.textContent;
        
        navigator.clipboard.writeText(codeText).then(function() {
            const originalText = btn.textContent;
            btn.textContent = 'Copied!';
            
            setTimeout(function() {
                btn.textContent = originalText;
            }, 2000);
        }).catch(function(err) {
            console.error('Failed to copy:', err);
            btn.textContent = 'Failed';
        });
    });
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href !== '#' && href.length > 1) {
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
    });
});
