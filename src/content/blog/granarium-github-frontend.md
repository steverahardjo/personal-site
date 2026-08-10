---
title: 'Granarium: A Read-Only GitHub Frontend with Dev-Tool Aesthetic'
description: 'Building a premium GitHub code browser with Shiki syntax highlighting, file trees, diff viewers, commit graph visualization, and server-proxied API calls — all on Bun + React.'
pubDate: 2026-08-08
tags: ['Bun', 'React', 'GitHub API', 'Shiki', 'TypeScript']
---

# Granarium: A Read-Only GitHub Frontend with Dev-Tool Aesthetic

Granarium is a hyper-performant, stylish alternative to browsing repos on github.com. It consumes the GitHub REST API, renders repos, files, commits, and pull requests with server-proxied API calls and a Pierre Computer Company–inspired design language.

**No backend. No database.** Pure Bun + React + GitHub API.

## Architecture

```
┌─────────────────────────────────────────────────────┐
│                    Bun Server                       │
│                                                     │
│  ┌────────────────────────────────────────────┐     │
│  │  API Proxy Routes (src/index.ts)           │     │
│  │  /api/github/:owner/:repo/*                │     │
│  │  → @octokit/rest (GITHUB_TOKEN hidden)     │     │
│  └────────────────────────────────────────────┘     │
│                                                     │
│  ┌────────────────────────────────────────────┐     │
│  │  Static File Server                        │     │
│  │  → dist/ (production) or src/ (dev)        │     │
│  └────────────────────────────────────────────┘     │
└─────────────────────────────────────────────────────┘
         ▲
         │
┌─────────────────────────────────────────────────────┐
│  React SPA (src/App.tsx)                           │
│  ├── RepoHeader (stats, languages, topics)          │
│  ├── BranchTagSelector (branches + tags dropdown)   │
│  ├── FileTreePanel (@pierre/trees wrapper)          │
│  ├── CodeViewer (Shiki lazy highlighter)            │
│  ├── InfiniteCommitList (virtual scroll)            │
│  ├── PullRequestPage (PR list + detail)             │
│  ├── CommitPage (diff + stats)                      │
│  └── NetworkGraphPage (React Flow DAG)              │
└─────────────────────────────────────────────────────┘
```

## URL Routes

| URL Pattern | Page |
|---|---|
| `/owner/repo` | Repo browser (Code tab) |
| `/owner/repo/pulls` | PR list with state tabs |
| `/owner/repo/pull/N` | Single PR + comments |
| `/owner/repo/commit/SHA` | Commit detail with diff |
| `/owner/repo/network` | Interactive commit graph |

## File Viewer Pipeline

Files are classified by extension and routed through the appropriate viewer:

| Extension | Mode | Viewer |
|---|---|---|
| `.js`, `.ts`, `.py`, `.go`, etc. | `code` | Shiki CodeViewer |
| `.md`, `.txt` | `markdown` | MarkdownRenderer |
| `.pdf` | `pdf` | iframe (raw.githubusercontent.com) |
| `.png`, `.jpg`, `.svg` | `image` | Image viewer |
| `.csv`, `.tsv` | `table` | TableRenderer (auto-delimiter, 2000 row cap) |
| Other binaries | `binary` | "Cannot preview" message |

## Key Features

- **Code browser** — Syntax highlighting via Shiki, file tree with `@pierre/trees` (40+ colored icons, virtualized, compact density)
- **Diff viewer** — Side-by-side diffs for commits and PRs with `@pierre/diffs`
- **Pull requests** — Infinite scroll PR list with state tabs, slide-in comments panel
- **Commit graph** — Interactive DAG visualization with React Flow, branch-colored nodes, zoom/pan, dagre left-to-right layout
- **Branch/tag selector** — Switch branches, browse refs, protected branch badges
- **Dark/light theme** — OLED black default (`#050505`), glass-morphism panels, purple/emerald accents
- **Caching** — IndexedDB with TTL-based expiry per category
- **GitHub OAuth** — Optional login for higher rate limits (60 → 5,000 req/hr)

## Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Bun 1.3 (native TS, HTML imports, built-in bundler) |
| UI | React 19, Tailwind CSS v4 |
| Syntax highlighting | Shiki (lazy singleton, 30+ languages) |
| File tree | `@pierre/trees` |
| Diffs | `@pierre/diffs` |
| Commit graph | `@xyflow/react` (React Flow v12) + `@dagrejs/dagre` |
| GitHub API | `@octokit/rest` v22, server-proxied |
| Cache | IndexedDB with TTL |
| Icons | `@phosphor-icons/react` |

## Design System

The design uses OLED black backgrounds with purple (`#8b5cf6`) and emerald (`#10b981`) accents, glass-morphism panels with low-opacity borders, and spring-physics transitions (`cubic-bezier(0.32, 0.72, 0, 1)`). Font sizes are bumped up globally: `text-xs` → 13px, `text-sm` → 15px, `text-base` → 17px, using DM Sans for body text and JetBrains Mono for code.

## Key Learnings

1. **Bun's HTML imports eliminate build complexity** — importing `.tsx` directly from HTML with `Bun.serve()` removes the need for Vite, esbuild, or webpack in development.
2. **Server-side API proxying keeps tokens safe** — the GitHub token lives in `GITHUB_TOKEN` env var, proxied through Bun routes, never reaching the client.
3. **`@pierre/trees` prepared input is opaque** — the tree input object has internal markers that break when serialized through JSON, so preparation must happen client-side after fetching data.
4. **React Flow handles DAG layout well with dagre** — the commit graph uses `@dagrejs/dagre` with left-to-right layout for horizontal git-like lanes, with custom `CommitNode` components showing avatars, SHAs, and branch pills.
5. **Rate limits are the real bottleneck** — unauthenticated GitHub API caps at 60 req/hr. Adding a `GITHUB_TOKEN` jumps to 5,000, which is the difference between a broken and usable browsing experience.
