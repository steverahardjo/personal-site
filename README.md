# Personal Website

Minimalist single-page personal website.

## Structure

```
personal-website/
├── index.html      # Single page (hero, projects, contact)
├── styles.css      # ~250 lines CSS
├── script.js       # Theme toggle + jokes
├── resume.pdf      # Add your CV here
└── README.md
```

## Features

- Single page, no routing
- Dark/light mode toggle
- Red Resume button
- Right-aligned image box
- Programmer jokes rotator
- "current: sleep deprived" status
- ~250 lines CSS, ~30 lines JS

## Run

```bash
python -m http.server 8000
```

Visit `http://localhost:8000`

## Customize

- Add `resume.pdf` to root
- Replace `[Photo]` with `<img src="your-photo.jpg">`
- Update email/GitHub links in `index.html`

## Deploy

Drag & drop to Netlify, or push to GitHub Pages.
