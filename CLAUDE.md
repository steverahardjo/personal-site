# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

| Task | Command |
|------|---------|
| Dev server | `bun dev` (starts at `localhost:4321`) |
| Production build | `bun build` (outputs to `dist/`) |
| Preview build | `bun preview` |
| Lint | `bun lint` |
| Lint + auto-fix | `bun lint:fix` |

**Package manager:** Bun (see `bun.lock`). Use `bun add` / `bun add -d` for dependencies.

## Tech Stack

- **Framework:** Astro 5 (SSG with file-based routing)
- **UI islands:** React 19 (`@astrojs/react`), mounted with `client:load` or `client:visible`
- **Styling:** Tailwind CSS 4 via `@tailwindcss/vite` plugin
- **Content:** Astro content collections (blog posts as markdown in `src/content/blog/`)
- **TypeScript:** Strict mode, path alias `@/*` → `./src/*`
- **SEO:** `@astrojs/sitemap`, JSON-LD structured data, canonical URLs, OG/Twitter meta tags

## Architecture

### Layout hierarchy

Two layouts, both in `src/layouts/`:

- **`BaseLayout.astro`** — The shell for every page. Provides: `<head>` with SEO/OG meta, JSON-LD Person schema, a pre-paint theme script, a top header with nav tabs + Resume link, footer with social links + copyright, the `ThemePicker` React island, and a `<slot />` for page content. Accepts `title`, `description`, and `page` (nav highlight ID) props.
- **`BlogLayout.astro`** — Wraps `BaseLayout` for blog posts. Adds article header (title, date, tags), prose styling for rendered markdown, a "Back to Writing" link, and inline `<script>` that adds copy-to-clipboard buttons to `<pre>` blocks plus optional Mermaid/Typst rendering.

### Pages (file-based routing)

| Route | File | Notes |
|-------|------|-------|
| `/` | `src/pages/index.astro` | Home — bio, stat cards, `CurrentProject` static card |
| `/about` | `src/pages/about.astro` | Skills (tabbed panels), education, experience — all static data |
| `/projects` | `src/pages/projects.astro` | Project cards + `GhCalendar` React island (`client:visible`) |
| `/writing` | `src/pages/writing.astro` | Blog index from content collection |
| `/blog/[slug]` | `src/pages/blog/[slug]/index.astro` | Dynamic route via `getStaticPaths`, renders markdown via `BlogLayout` |
| `/404` | `src/pages/404.astro` | Random joke picked client-side from hardcoded array |

**Note:** `src/pages/projects/` is gitignored — individual project pages are generated or managed separately.

### Components (`src/components/`)

- **`CurrentProject.astro`** — Static project card for "Nutribot" with feature checklist. Pure Astro markup, no hydration.
- **`GhCalendar.tsx`** — GitHub contribution heatmap via `react-github-calendar`. Uses `useState` + `MutationObserver` on `data-theme` to switch between light/dark calendar themes reactively.
- **`ThemePicker.tsx`** — Floating palette switcher (React island, `client:load`). Reads/writes `localStorage["theme-palette"]`, sets `data-theme` on `<html>`, and highlights the active palette.
- **`JsonLd.astro`** — Person schema emitted as `<script type="application/ld+json">` via `set:html`.

### Theming

Palettes live in `src/styles/themes/*.css`, each scoped to `[data-theme="X"]` (e.g. `original`, `tokyo-midnight`, `dracula`, `blood-moon`). `original.css` also defines `:root` so an invalid stored value falls back gracefully. Key variables: `--bg`, `--text`, `--muted`, `--muted-foreground`, `--border`, `--accent`, `--surface`. The Tailwind `@theme inline` block maps these to utility classes like `bg-[var(--surface)]`, `text-[var(--accent)]`, etc.

A pre-paint inline `<script is:inline>` in `BaseLayout`'s head sets `data-theme` from `localStorage` (validated against the known palette ids) before first render. The `ThemePicker` React island handles switching afterward.

### Content collection

`src/content/config.ts` defines a `blog` collection with Zod schema: `title`, `description`, `pubDate` (coerced date), optional `updatedDate`, `tags` (string array, default `[]`), `draft` (boolean, default `false`). Draft posts are filtered out on the writing index page.

### Deployment

GitHub Actions workflow (`.github/workflows/deploy.yml`) deploys on push to `main` via `withastro/action` + `actions/deploy-pages` to **GitHub Pages**. Site URL is `https://sjrah.net`.

### Static assets

- `public/resume.pdf` — linked from header nav
- `public/favicon-v2.svg` — site icon
- `public/og-image.png` — OG/Twitter share image
- `public/script.js` — home page joke init script
- `public/robots.txt` — allows all crawlers
