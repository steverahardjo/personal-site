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

// Active Nav Link Highlight on Scroll (for home page sections)
(function() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    if (sections.length === 0 || !window.location.pathname.endsWith('index.html') && window.location.pathname !== '/') return;
    
    const observerOptions = {
        root: null,
        rootMargin: '-100px 0px -60% 0px',
        threshold: 0
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${entry.target.id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, observerOptions);
    
    sections.forEach(section => observer.observe(section));
})();

// Reading Progress Bar (for writing page / blog posts)
(function() {
    const writingPage = document.querySelector('.writing-page');
    const blogPost = document.querySelector('.blog-post');
    const progressBar = document.getElementById('progressBar');
    
    if (!writingPage && !blogPost) return;
    if (!progressBar) return;

    window.addEventListener('scroll', () => {
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight - windowHeight;
        const scrolled = window.scrollY;
        const progress = (scrolled / documentHeight) * 100;

        progressBar.style.width = `${progress}%`;
    });
})();

// Copy Email on Click
(function() {
    const emailLinks = document.querySelectorAll('a[href^="mailto:"]');
    
    emailLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const email = link.getAttribute('href').replace('mailto:', '');
            
            navigator.clipboard.writeText(email).then(() => {
                const originalText = link.textContent;
                link.textContent = 'Copied!';
                link.style.color = 'var(--red)';
                
                setTimeout(() => {
                    link.textContent = originalText;
                    link.style.color = '';
                }, 1500);
            }).catch(() => {
                // Fallback: let default mailto behavior happen
            });
        });
    });
})();

// Page fade-in on load
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});
