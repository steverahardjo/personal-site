---
title: 'Skilltune: Agentic Resume Tailoring via Chrome Extension'
description: 'A Chrome extension powered by LangChain agents that scans job postings and generates tailored Typst resumes — bridging browser context with AI document generation.'
pubDate: 2026-05-15
tags: ['Chrome Extension', 'LangChain', 'Typst', 'React', 'DeepSeek']
---

# Skilltune: Agentic Resume Tailoring via Chrome Extension

Skilltune is a Chrome extension that reads job postings in the browser, analyzes them with AI agents, and generates a tailored `.typ` (Typst) resume compiled to PDF — all without leaving the page.

## How It Works

1. **Onboarding** — Enter your name, target roles, industry, and path to your base resume file (`.typ`).
2. **Scan** — Browse a job posting, open the extension popup, click "Scan this page" to capture the page text.
3. **Analyze** — Click "Analyze posting" to have an AI agent extract job title, company, skills, requirements, and responsibilities.
4. **Write** — Click "Write tailored resume" to generate a customized `.typ` file using your resume as a style reference, compiled to PDF via Typst CLI.

## Architecture

```
┌─────────────────────┐  chrome.runtime      ┌───────────────────────┐
│   Chrome Extension   │ sendMessage(API_CALL)  │   Python Server        │
│                     │ ──────────────────────→ │   (localhost:3721)     │
│  Popup (React)      │ ←────────────────────── │                        │
│  Service Worker     │     JSON response       │  LangChain Agents:     │
│  Content Script     │                         │  - posting-analysis   │
│                     │                         │  - resume-generation  │
└─────────────────────┘                         └───────────────────────┘
```

### Chrome Extension Components

- **Popup (React)** — User interface for scanning, analyzing, and generating
- **Service Worker** — Background script handling API communication
- **Content Script** — Captures page text from job posting tabs

### Python Backend Agents

- **Posting Analysis Agent** — Extracts structured data (title, company, skills, requirements, responsibilities) from raw page text using LangChain + DeepSeek.
- **Resume Generation Agent** — Takes the extracted job data and the user's base `.typ` resume, then generates a tailored version that emphasizes relevant skills and experiences.

## Typst as Resume Format

Typst was chosen over LaTeX or Word for several reasons:

- **Fast compilation** — Typst CLI compiles to PDF in milliseconds
- **Clean syntax** — More readable than LaTeX, easier for LLMs to generate correctly
- **Programmatic control** — The agent can modify sections, reorder bullet points, and adjust emphasis while maintaining consistent formatting
- **Local rendering** — No cloud rendering needed; `typst compile` runs locally

## Key Design Decisions

1. **Local Python server over cloud API** — Keeps resume data on-device, avoids sending personal documents to third parties.
2. **Two-agent pipeline** — Separation of concerns: one agent analyzes the job, another generates the resume. This allows independent improvement and testing.
3. **Screenshot-based page capture** — More reliable than DOM scraping for complex job board layouts.
4. **Style reference preservation** — The generation agent uses the existing `.typ` file as a template, ensuring consistent formatting across all tailored resumes.

## Tech Stack

- **Extension:** React, Chrome Extension APIs (runtime, tabs, scripting)
- **Backend:** Python, LangChain, DeepSeek API
- **Document Format:** Typst (`.typ` → PDF via `typst compile`)
