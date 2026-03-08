# Personal Website

Minimalist multi-page personal website.

## Structure

```
personal-website/
├── index.html          # Home page with animated blue hue
├── about.html          # About page
├── projects.html       # Projects page
├── writing.html        # Writing page (Times New Roman)
├── styles.css          # Styles
├── script.js           # Theme toggle + jokes
└── resume.pdf          # Add your CV
```

## Features

- Separate pages: Home, About, Projects, Writing
- Animated blue hue on home page
- Dark/light mode toggle
- Times New Roman for Writing section
- Helvetica Bold for headings
- Red Resume button
- Programmer jokes rotator

## Run

```bash
python -m http.server 8000
```

Visit `http://localhost:8000`

## Customize

- Add `resume.pdf` to root
- Replace `[Photo]` with `<img src="your-photo.jpg">`
- Update email/GitHub links

## Deploy

Drag & drop to Netlify, or push to GitHub Pages.
