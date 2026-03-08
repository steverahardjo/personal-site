# Personal Website

A minimalist, academic-inspired personal website with a Svelte-powered blog.

## Design Philosophy

- **Clean & Minimal**: Focus on content and typography
- **Academic Aesthetic**: Inspired by university professor websites
- **Black & White**: Monochrome color scheme with dark/light mode toggle
- **Elegant Typography**: Inter Tight font family throughout
- **Subtle Separators**: Clean line dividers between sections

## Features

- ✅ Responsive design
- ✅ Dark/Light mode toggle (persisted)
- ✅ Programmer jokes rotator
- ✅ CV link in header
- ✅ Right-aligned image box
- ✅ Project detail pages
- ✅ Code snippet component with copy
- ✅ Svelte-powered blog
- ✅ Print-friendly styles
- ✅ Accessible semantic HTML

## Structure

```
personal-website/
├── index.html              # Main landing page
├── styles.css              # All styles (black/white theme)
├── script.js               # Theme toggle, jokes, copy functionality
├── project-*.html          # Individual project pages
├── blog/                   # Svelte blog
│   ├── App.svelte
│   ├── BlogLayout.svelte
│   ├── CodeSnippet.svelte
│   ├── main.js
│   ├── index.html
│   └── package.json
└── cv.pdf                  # Your CV (add this)
```

## Quick Start

### Static Pages

Open `index.html` in your browser, or use a local server:

```bash
# Using Python
python -m http.server 8000

# Using Node.js
npx serve
```

Then visit `http://localhost:8000`

### Blog (Svelte)

```bash
cd blog
npm install
npm run dev
```

The blog will be available at `http://localhost:5173`

To build for production:

```bash
npm run build
```

## Customization

### Main Page (`index.html`)
- Replace `[Your Photo Here]` with an actual `<img>` tag
- Update contact links (email, GitHub, LinkedIn)
- Add your CV as `cv.pdf` in the root directory
- Modify project descriptions

### Blog Posts (`blog/App.svelte`)
Edit the `posts` array to add new blog posts:

```javascript
const posts = [
  {
    slug: 'my-new-post',
    title: 'My New Post',
    date: 'March 2026',
    readTime: '5 min read',
    excerpt: 'Brief description...',
    content: `<p>Your content here...</p>`,
    code: {
      language: 'python',
      code: `def hello():\n    print("world")`
    }
  }
];
```

### Theme
The theme toggle uses CSS custom properties. Edit `:root` and `[data-theme="dark"]` in `styles.css`.

## Deployment

### Static Pages Only
Deploy to any static hosting:
- **GitHub Pages**: Push to `gh-pages` branch
- **Netlify**: Drag & drop the folder
- **Vercel**: Connect the repository

### With Blog
Build the Svelte blog first, then deploy the entire folder:

```bash
cd blog
npm run build
cd ..

# Now deploy the entire directory
```

## Tech Stack

- **HTML/CSS/JS**: Vanilla, no frameworks
- **Fonts**: Inter Tight (Google Fonts)
- **Blog**: Svelte 5 + Vite
- **Icons**: Emoji (🌙 ☀️)

## License

MIT
