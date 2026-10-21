# Website Optimization Log

Record of the performance and search-indexing work shipped in commit `7221576`
(`perf: remove React islands and fix sitemap/indexing`).

| Field | Value |
| --- | --- |
| Site | https://sjrah.net |
| Stack | Astro 7, Tailwind CSS 4, GitHub Pages, Cloudflare |
| Date | 2026-10-20 |
| Commit | `7221576` |
| Deploy | GitHub Actions run `39437340935` (success) |

## TL;DR

| Metric | Before | After |
| --- | ---: | ---: |
| Home-page JavaScript (raw) | ~216 KB | ~4.2 KB |
| Home-page JavaScript (gzipped) | ≥56 KB (React client alone) | ~2 KB |
| Projects-page JavaScript (raw) | ~268 KB | ~7.5 KB |
| Projects-page HTML | 77 KB | 27 KB |
| CSS | 44 KB | 40 KB |
| Favicon | 102 KB SVG | 6.4 KB PNG |
| Sitemap URLs | 13 (3 project pages missing) | 17 |
| Blog posts with duplicate `<h1>` | 8 of 8 | 0 |
| Live project pages returning 404 | 3 | 0 |

## 1. Reported symptoms

- Google Search Console reported indexing problems.
- First page load felt unnecessarily heavy for a mostly static personal site.

The investigation found three independent indexing causes and one large
JavaScript cause, all of which are fixed in commit `7221576`.

## 2. Indexing root causes and fixes

### 2.1 The advertised sitemap returned 404

`robots.txt` advertised `https://sjrah.net/sitemap.xml`, but the Astro sitemap
integration only writes `sitemap-index.xml` and `sitemap-0.xml`.

Observed on production before the fix:

```text
GET /sitemap.xml        -> 404
GET /sitemap-index.xml  -> 200
```

**Fix**

- Added [`public/sitemap.xml`](public/sitemap.xml), a valid sitemap index that
  points at `https://sjrah.net/sitemap-0.xml`.
- Kept [`public/robots.txt`](public/robots.txt#L5) pointing at
  `https://sjrah.net/sitemap.xml`, so the previously submitted URL now works.
- Removed the unsupported `Crawl-delay` directive.

Both `/sitemap.xml` and `/sitemap-index.xml` now return 200.

### 2.2 Three project pages were never deployed

The repository ignored the whole project-pages directory:

```gitignore
src/pages/projects/
```

Git keeps already-tracked files ignored, so two project pages stayed in the
repository while three newer pages (`gitaegis`, `iot-pipeline`, `skilltune`)
were never added. They were built locally, but the GitHub Actions checkout did
not contain them, so production returned 404 while `/projects/` linked to them.

Observed on production before the fix:

```text
/projects/gitaegis/      -> 404
/projects/iot-pipeline/  -> 404
/projects/skilltune/     -> 404
```

**Fix**

- Removed `src/pages/projects/` from [`.gitignore`](.gitignore).
- Added all three pages to git.
- Added `page="projects"` to every project page so the navigation highlights
  correctly.

All three URLs now return 200 in production.

### 2.3 Canonical URLs pointed at redirects

The site used `trailingSlash: "never"`, but GitHub Pages serves directory routes
with a trailing slash and 301s the slash-less form:

```text
/about -> 301 -> /about/
```

Meanwhile canonical tags, the sitemap, and internal links used `/about`. Google
was therefore told that the canonical version of a page was a URL that
redirects, which can produce "Page with redirect" and canonical-mismatch
reports.

**Fix**

- Changed [`astro.config.mjs`](astro.config.mjs#L12) to
  `trailingSlash: "always"`.
- Updated every internal page link to end with `/`.
- Canonical URLs are built from `Astro.site` and always end with `/`
  ([`BaseLayout.astro`](src/layouts/BaseLayout.astro#L22)).
- The sitemap now contains the same trailing-slash URLs.

Slash-less URLs still 301 to the slash version, so old links keep working, but
sitemap and canonical URLs now point directly at the 200 response.

### 2.4 Every blog post had two `<h1>` elements

Each markdown file started with `# Title`, while
[`BlogLayout.astro`](src/layouts/BlogLayout.astro) also renders the frontmatter
title as an `<h1>`.

**Fix**

- Removed the leading `# Title` line from all eight posts in
  `src/content/blog/`.
- Verified each built post now has exactly one `<h1>`.

### 2.5 The 404 page was indexable

[`src/pages/404.astro`](src/pages/404.astro) rendered the default
`index, follow` robots meta tag and a canonical URL.

**Fix**

- Added a `noindex` prop to [`BaseLayout.astro`](src/layouts/BaseLayout.astro#L44).
- The 404 page now emits `noindex, follow` and no canonical tag.

### 2.6 Draft posts and article metadata

- [`src/pages/blog/[slug]/index.astro`](src/pages/blog/[slug]/index.astro)
  now filters `data.draft` posts in `getStaticPaths`.
- [`src/layouts/BlogLayout.astro`](src/layouts/BlogLayout.astro#L28) now emits
  `BlogPosting` JSON-LD plus `article:published_time`, `article:modified_time`,
  `article:author`, and one `article:tag` per tag.
- `updatedDate` is passed through when present.

### 2.7 Smaller SEO fixes

- Home page title changed to `Steve Jevon Rahardjo | Backend & Data Engineer`
  with a longer description.
- Projects page now has its own meta description.
- `twitter:*` tags use `name=`, not `property=`.
- Added `og:site_name`, `og:locale`, `og:image:width`, `og:image:height`, and
  `og:image:alt`.
- `Person` JSON-LD uses the trailing-slash site URL and includes a description.
- "Five projects" corrected to "Six projects".
- The link-less DSH-Usage project now renders as a `<div>` instead of an `<a>`
  with no `href`.

## 3. Performance root causes and fixes

### 3.1 React was shipped to render a theme picker

`ThemePicker` was a React island mounted with `client:load` in
[`BaseLayout.astro`](src/layouts/BaseLayout.astro), so **every page** downloaded
and hydrated React 19 just to show four colour buttons.

Measured before:

```text
client.BadKmK4E.js   180,623 B  (56,200 B gzipped)
+ React/chunk files  ~35 KB
```

**Fix**

- Replaced `ThemePicker.tsx` with a server-rendered
  [`ThemePicker.astro`](src/components/ThemePicker.astro) using ~1.3 KB of
  vanilla JavaScript.
- Removed `@astrojs/react`, `react`, `react-dom`, and the React type packages.
- Removed the React ESLint plugin and the React JSX settings in `tsconfig.json`.
- No `astro-island` elements remain in the built HTML.

The picker still supports opening/closing, outside click, Escape, focus return,
`aria-expanded`, `aria-pressed`, and `localStorage` persistence.

### 3.2 The GitHub calendar shipped a framework and a large placeholder

`react-github-calendar` was mounted with `client:visible`. It still server-
rendered a full-year placeholder into the projects page:

```text
projects/index.html  76,980 B, including ~57 KB of placeholder SVG
Tooltip chunk        ~48 KB
```

**Fix**

- Replaced `GhCalendar.tsx` with
  [`GhCalendar.astro`](src/components/GhCalendar.astro).
- The server renders a 109 px skeleton; a small script fetches the contribution
  data only when the section is within 200 px of the viewport.
- The calendar is drawn as a compact SVG with month labels, native `<title>`
  tooltips, a legend, a total count, and colour levels derived from the active
  theme via `color-mix()`.
- Fetch failures show a link to the GitHub profile instead of an empty box.
- A 10 s `AbortController` timeout prevents a permanently loading skeleton.
- The skeleton and final SVG use the same height, so there is no layout shift.

The data endpoint is:

```text
https://github-contributions-api.jogruber.de/v4/<username>?y=last
```

### 3.3 The favicon was a 102 KB SVG

`favicon-v2.svg` is a detailed vector illustration, but at 16 px it was
downloaded on every page view.

**Fix**

- Generated a 64×64 [`public/favicon.png`](public/favicon.png) (6.4 KB) and a
  180×180 [`public/apple-touch-icon.png`](public/apple-touch-icon.png).
- Updated the icon links and the header image, with explicit `width`/`height`
  to prevent layout shift.
- The original SVG is kept in `public/` as source artwork but is no longer
  referenced by any page.

### 3.4 Fonts, prefetch, and request trimming

- Preloaded the Latin body font so the LCP text can render sooner:
  [`BaseLayout.astro`](src/layouts/BaseLayout.astro#L64).
- Added Astro prefetch on hover for nav, project, and blog links; the runtime is
  a 2.5 KB shared chunk.
- Inlined the 532-byte joke script into `BaseLayout.astro` and deleted
  `public/script.js`, removing one request.
- Added `aria-current="page"` to the active nav item.
- Fonts already used `font-display: swap`; this was verified in the built CSS.

### 3.5 Dependency cleanup

Removed from [`package.json`](package.json):

```text
@astrojs/react
react
react-dom
react-github-calendar
@types/react
@types/react-dom
eslint-plugin-react
```

`bun.lock` was regenerated and `bun install --frozen-lockfile --dry-run` passes.

## 4. Before/after detail

### Home page

| Asset | Before | After |
| --- | ---: | ---: |
| HTML | ~13–16 KB | 14.7 KB (4.2 KB gzipped) |
| JavaScript | ~216 KB | ~4.2 KB |
| React runtime | 180.6 KB | 0 |
| CSS | 44 KB | 40 KB (10.3 KB gzipped) |
| Favicon | 102 KB SVG | 6.4 KB PNG |

### Projects page

| Asset | Before | After |
| --- | ---: | ---: |
| HTML | 77 KB | 27.4 KB (6.8 KB gzipped) |
| JavaScript | ~268 KB | ~7.5 KB |
| Placeholder calendar markup | ~57 KB | 109 px skeleton |
| Tooltip bundle | ~48 KB | 0 |

## 5. Verification performed

Build and lint:

```bash
bun install
bun run build          # 18 pages
bun run lint
bun install --frozen-lockfile --dry-run
```

All passed.

Sitemap and routing:

- All 17 sitemap URLs return 200 with a trailing slash.
- `/sitemap.xml`, `/sitemap-index.xml`, `/sitemap-0.xml`, and `/robots.txt`
  return 200.
- `/projects/gitaegis/`, `/projects/iot-pipeline/`, and `/projects/skilltune/`
  return 200.
- `/about` still 301s to `/about/`.
- The 404 response returns HTTP 404 with `noindex, follow` and no canonical.

Browser tests in headless Chrome:

- Theme picker opens, selects Dracula, updates `data-theme`, writes
  `localStorage`, closes, and restores the theme after reload.
- GitHub calendar loads 407 contributions, 12 month labels, and completes with
  `aria-busy="false"`.
- No console errors.

Live production checks after deploy:

- All project pages 200.
- Blog pages have one `<h1>`, a trailing-slash canonical, and `BlogPosting`
  JSON-LD.
- Home page contains no `astro-island` and references the small
  `/_astro/page.*.js` chunk and `/favicon.png`.

## 6. Deployment and Search Console checklist

Deployment is automatic: pushing to `main` triggers
`.github/workflows/deploy.yml`.

After a deploy, the remaining Search Console steps are account-level:

1. **Sitemaps** → submit or resubmit `https://sjrah.net/sitemap.xml`.
2. **URL Inspection** → request indexing for:
   - `https://sjrah.net/projects/gitaegis/`
   - `https://sjrah.net/projects/iot-pipeline/`
   - `https://sjrah.net/projects/skilltune/`
3. Keep the old `https://sjrah.net/sitemap-index.xml` submission if present; it
   still works.

Google still needs to recrawl before historical alerts clear. Cloudflare
currently caches HTML, `robots.txt`, and sitemaps for about 10 minutes, so use a
cache-busting query string when verifying immediately after a deploy.

## 7. Maintenance notes

- Do **not** add `src/pages/projects/` back to `.gitignore`; project pages are
  authored source, not build output.
- Keep internal page links trailing-slashed. The build is configured with
  `trailingSlash: "always"` to match GitHub Pages.
- If another host is used later, re-check its trailing-slash behaviour before
  changing that setting.
- When adding a theme, update both the theme list in the head script in
  [`BaseLayout.astro`](src/layouts/BaseLayout.astro) and the `themes` array in
  [`ThemePicker.astro`](src/components/ThemePicker.astro).
- New blog posts should not repeat the title as a `# Heading`; the layout already
  renders the frontmatter title as the page `<h1>`.
- The calendar API allows roughly 10 requests per 10 seconds and is only called
  when the calendar scrolls into view.
- `public/sitemap.xml` is a manual index that points at `sitemap-0.xml`. If the
  site ever grows past 50,000 URLs, the generated sitemap will split into
  multiple files and this alias must be updated.
- `public/favicon-v2.svg` is retained as source artwork and is intentionally
  unreferenced.

## 8. Rollback

The optimization commit is self-contained:

```bash
git revert 7221576
```

Reverting restores React, the old calendar, the slash-less canonical URLs, and
the ignored project directory. The three project pages would need to be
restored explicitly if only `.gitignore` is reverted.
