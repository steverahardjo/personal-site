# Personal Website

A minimalist, multi-page personal website with clean sans-serif typography.

## Structure

```
personal-website/
├── index.html              # Landing page (hero + image + nav)
├── about.html              # About page with skills
├── projects.html           # Projects listing page
├── blog.html               # Blog listing page
├── resume.html             # Resume page (red button)
├── contact.html            # Contact page
├── styles.css              # All styles
├── script.js               # Theme toggle + jokes
├── project-*.html          # Individual project detail pages
├── blog/                   # Svelte blog (optional)
└── cv.pdf                  # Your CV (add this)
```

## Features

- ✅ **Separate pages** for About, Projects, Blog, Resume, Contact
- ✅ **Dark/Light mode toggle** (persisted in localStorage)
- ✅ **Red Resume button** in navigation
- ✅ **Right-aligned image box** with placeholder
- ✅ **Programmer jokes** rotator
- ✅ **"current: sleep deprived"** status below image
- ✅ **Sans-serif typography** (Inter font)
- ✅ **Black & white** color scheme
- ✅ **Code snippet component** with copy button
- ✅ **Responsive design**

## Quick Start

```bash
# Using Python
python -m http.server 8000

# Using Node.js
npx serve
```

Then visit `http://localhost:8000`

## Customization

### index.html
- Replace `[Your Photo Here]` with an actual `<img>` tag
- Update the "current:" status text
- Modify navigation links

### resume.html
- Add your actual work experience
- Update education details
- Add `cv.pdf` to the root directory for download

### Adding Blog Posts
Create new HTML files in `blog/` folder or use the Svelte setup:

```bash
cd blog
npm install
npm run dev
```

## Deployment

Deploy to any static hosting:
- **GitHub Pages**: Push to `gh-pages` branch
- **Netlify**: Drag & drop the folder
- **Vercel**: Connect the repository

## Tech Stack

- **HTML/CSS/JS**: Vanilla, no frameworks
- **Fonts**: Inter (Google Fonts)
- **Icons**: Emoji

## License

MIT
