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

- **`BaseLayout.astro`** — The shell for every page. Provides: `<head>` with SEO/OG meta, JSON-LD Person schema, desktop sidebar (nav + social links + resume button + theme toggle), mobile top bar, mobile bottom tab bar, and a `<slot />` for page content. Accepts `title`, `description`, and `page` (nav highlight ID) props.
- **`BlogLayout.astro`** — Wraps `BaseLayout` for blog posts. Adds article header (title, date, tags), prose styling for rendered markdown, a "Back to Writing" link, and inline `<script>` that adds copy-to-clipboard buttons to `<pre>` blocks.

### Pages (file-based routing)

| Route | File | Notes |
|-------|------|-------|
| `/` | `src/pages/index.astro` | Home — bio, stat cards, `CurrentProject` React island |
| `/about` | `src/pages/about.astro` | Skills (tabbed panels), education, experience — all static data |
| `/projects` | `src/pages/projects.astro` | Project cards + `GhCalendar` React island (`client:visible`) |
| `/writing` | `src/pages/writing.astro` | Blog index from content collection |
| `/blog/[slug]` | `src/pages/blog/[slug]/index.astro` | Dynamic route via `getStaticPaths`, renders markdown via `BlogLayout` |
| `/404` | `src/pages/404.astro` | Random joke from hardcoded array |

**Note:** `src/pages/projects/` is gitignored — individual project pages are generated or managed separately.

### React components (`src/components/`)

- **`current-project.tsx`** — Static project card for "Deneb" with feature checklist. Uses React for the JSX structure but has no interactivity beyond hover states handled by Tailwind.
- **`GhCalendar.tsx`** — GitHub contribution heatmap via `react-github-calendar`. Uses `useState` + `MutationObserver` on `data-theme` to switch between light/dark calendar themes reactively.

### Theming

Custom CSS properties on `:root` and `[data-theme="dark"]` in `src/styles/tailwind.css`. Key variables: `--bg`, `--text`, `--muted`, `--muted-foreground`, `--border`, `--accent`, `--surface`. The Tailwind `@theme inline` block maps these to utility classes like `bg-[var(--surface)]`, `text-[var(--accent)]`, etc.

Theme toggle is handled by vanilla JS in `public/script.js`: reads/writes `localStorage.theme`, sets `data-theme` on `<html>`, and syncs toggle knob position across both mobile and desktop buttons. The `astro:page-load` event re-runs init for SPA navigation.

### Content collection

`src/content/config.ts` defines a `blog` collection with Zod schema: `title`, `description`, `pubDate` (coerced date), optional `updatedDate`, `tags` (string array, default `[]`), `draft` (boolean, default `false`). Draft posts are filtered out on the writing index page.

### Deployment

GitHub Actions workflow (`.github/workflows/nginx_deploy.yml`) deploys on push to `main`. The site runs on EC2 behind Nginx (config at `.github/workflows/sjrah.net.conf`) which reverse-proxies `:4321`. Site URL is `https://sjrah.net`.

### Static assets

- `public/resume.pdf` — linked from sidebar and mobile nav
- `public/favicon-v2.svg` — site icon
- `public/owl.svg` — theme toggle indicator
- `public/script.js` — minified theme + joke init script
- `public/robots.txt` — allows all crawlers
