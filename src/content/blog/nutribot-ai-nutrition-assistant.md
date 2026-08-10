---
title: 'Nutribot: Multi-Agent AI Nutrition Assistant'
description: 'Building a supervisor-based multi-agent nutrition platform with Django + LangGraph and a Go + Google ADK backend — meal logging, photo analysis, weekly analytics, and a React dashboard.'
pubDate: 2026-07-01
tags: ['LangGraph', 'Google ADK', 'Django', 'Go', 'React', 'Multi-Agent']
---

# Nutribot: Multi-Agent AI Nutrition Assistant

Nutribot is a full-stack, multi-agent nutrition assistant that lets users log meals, plan diets, and get data-driven insights through natural conversation — backed by a supervisor-based agent architecture.

## Architecture

```
                    ┌─────────────────────┐
   User Message ──▶ │  Supervisor Agent   │ Intent classification + routing
                    └─────────┬───────────┘
                              │
          ┌─────────┬─────────┼─────────┬─────────┬─────────┐
          ▼         ▼         ▼         ▼         ▼         ▼
     Log VLM   Log LLM    Meal Plan  Aggregator  Eatery    Direct
     (photo)   (text)     (weekly)   (analytics) (nearby)  Response
          │         │         │         │         │         │
          └─────────┴─────────┴─────────┴─────────┴─────────┘
                              │
                              ▼
                    ┌─────────────────────┐
                    │  Formatter Agent    │ Internal → Frontend mode
                    └─────────────────────┘
```

The **Supervisor** classifies user intent and routes to a specialized agent. Each agent has its own LLM pipeline, tool access, and structured output. All responses pass through the **Formatter** — a universal output layer that converts internal `{ type, data }` blocks into the frontend's mode-based format.

## Two Backend Implementations

| Backend | Framework | Agent Runtime | DB Layer |
|---------|-----------|--------------|----------|
| Python | Django + LangGraph + LiteLLM | LangGraph StateGraph | Django ORM |
| Go | Google ADK v2 | ADK LLM Agent Tree + `adkrest` | sqlc + pgx/v5 |

Both share the same database schema and follow the same agent topology: a **General Agent (Supervisor)** detects intent and delegates to five specialized agents.

### Agent Tree

- **Supervisor** — Intent classification + routing (chat mode)
- **Log Agent LLM** — Parses free-text meal descriptions, matches against 7,323-item Food DB, returns nutrition-calculated meal cards
- **Log Agent VLM** — Analyzes food photos via vision model, identifies ingredients with confidence scores
- **Meal Planner** — Weekly meal plan generation (prompts and tools ready)
- **Aggregator** — 7-day analytics with adherence/trend/macros, generates LLM-written weekly insights
- **Eatery Search** — Nearby restaurant ranking via Google Places API

### Shared Tools

| Tool | Purpose |
|------|---------|
| `search_foods` | Tokenized + ranked food search across 7,323 items |
| `create_meal_log` | Persist meal entries with nutrition calculation |
| `get_day_intake` / `get_week_intake` | Daily and weekly nutrition aggregation |
| `get_profile` | User profile with BMI, goals, macro targets |
| `get_recent_meals` | Recent meal history with pagination |
| `search_restaurants` | Google Places proximity search (stub) |

## Frontend State Engine

The backend returns JSON with a `mode` field. The frontend `EngineRouter` dispatches to the matching React component:

| mode | Component | Description |
|------|-----------|-------------|
| `markdown` | ReactMarkdown | Text, conversation, insights |
| `chart` | ChartRenderer | Bar, line, pie, area via Recharts |
| `meal_card` | MealCard | Calories, macro bars, food items |
| `restaurant_map` | RestaurantMap | Leaflet map with markers |
| `profile` | ProfileCard | BMI grid, goal badge, macro progress |
| `current_plan` | CurrentPlan | Numbered meals with calorie totals |
| `expenses` | ExpensesCard | Donut chart + category breakdown |
| `loading` | LoadingSkeleton | Pulse placeholder |
| `error` | ErrorAlert | Destructive banner |

Chart colors use an Okabe-Ito colorblind-safe palette with separate light/dark mode values.

## Go Backend: ADK v2 Implementation

The Go backend uses Google ADK v2 with `llmagent`, `functiontool`, and the built-in `adkrest` server:

```go
agent, err := llmagent.New(llmagent.Config{
    Name:        "supervisor",
    Model:       model,
    Description: "Classify user intent and delegate to sub-agents",
    Instruction: prompts.SupervisorInstruction,
    SubAgents:   []agent.Agent{logAgent, plannerAgent, aggregatorAgent},
})
```

The DB layer uses **sqlc** for type-safe PostgreSQL queries generated from `.sql` files, paired with **pgx/v5** for connection pooling. A multi-provider model factory supports Gemini, OpenAI-compatible (DeepSeek, Qwen), and other providers.

## Key Learnings

1. **Structured output is non-negotiable** — every agent must return typed data, not free text, for the frontend to render correctly.
2. **Formatter layer decouples backend from frontend** — agents return `{ type, data }`, the formatter maps to `{ mode, payload }`, allowing independent evolution of both sides.
3. **LangGraph StateGraph works well but adds complexity** — the Go ADK implementation is simpler for this specific agent topology since delegation is built-in.
4. **Food database seeding matters** — 7,323 items from Edamam with per-100g nutrition data makes the LLM matching accurate and grounded.
5. **Vision models need confidence thresholds** — VLM food photo analysis returns ingredient lists with confidence scores; filtering below 0.7 avoids hallucinated items.

## Tech Stack

- **Backend (Python):** Django 6.0, DRF, LangGraph, LiteLLM, PostgreSQL
- **Backend (Go):** Google ADK v2, sqlc, pgx/v5, Zap logger
- **Frontend:** React 19, React Router v7, Tailwind CSS v4, shadcn/ui, Recharts, Leaflet
- **Runtime:** Bun 1.3+
