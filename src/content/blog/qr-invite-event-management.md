---
title: 'QR Invite: Event Management with Go and QR Codes'
description: 'A Go backend for managing event invitations via WhatsApp and email, with QR code generation, admin scanning, and attendance tracking.'
pubDate: 2026-03-10
tags: ['Go', 'PostgreSQL', 'QR Code', 'WhatsApp API', 'JWT']
---

# QR Invite: Event Management with Go and QR Codes

QR Invite is a backend system for managing event invitations through QR codes. Guests receive invites via WhatsApp or email, view their invite with a generated QR code, and admins scan the QR code at the door to mark attendance.

## Flow

1. **Admin adds participants** — CSV upload or individual entry via admin dashboard
2. **Admin sends invites** — Bulk or individual invites via WhatsApp (Meta Graph API) or email (Resend)
3. **Guest receives invite** — WhatsApp message or email with a unique link containing their `external_id`
4. **Guest opens link** — Sees their invite details and QR code
5. **Admin scans QR code at door** — Marks participant as attended
6. **Admin monitors** — Real-time dashboard showing check-in status

## Architecture

```
┌──────────────────────────────────────────────────────────┐
│                    HTTP Server                           │
│  ┌──────────┐  ┌────────────┐  ┌──────────┐  ┌────────┐ │
│  │ Public   │  │ Auth       │  │ Admin    │  │ Invite │ │
│  │ Handlers │  │ Handlers   │  │ Handlers │  │Handlers│ │
│  └────┬─────┘  └─────┬──────┘  └────┬─────┘  └───┬────┘ │
│       │              │              │            │      │
│  ┌────┴─────┐  ┌─────┴──────┐  ┌────┴─────┐  ┌───┴────┐ │
│  │ Public   │  │ JwtService │  │ admin    │  │ Invite │ │
│  │ Service  │  │            │  │ Store    │  │ Service│ │
│  └────┬─────┘  └────────────┘  └────┬─────┘  └───┬────┘ │
│       └──────────────┬──────────────┴────────────┘      │
│                      ▼                                   │
│               ┌──────────────┐                           │
│               │  PostgreSQL  │                           │
│               └──────────────┘                           │
└──────────────────────────────────────────────────────────┘
```

## Tech Stack

- **Language:** Go 1.22+ (using `http.ServeMux` with method-based routing)
- **Database:** PostgreSQL via `pgx` driver + sqlc code generation
- **Auth:** JWT (HS256) + bcrypt for admin passwords
- **QR Code:** `skip2/go-qrcode` for PNG generation
- **Messaging:** Meta/Facebook Graph API (WhatsApp), Resend (Email)
- **Logging:** Uber Zap (structured logging)

## Database Schema

A single `participants` table with sqlc-generated queries:

```sql
CREATE TABLE participants (
    id SERIAL PRIMARY KEY,
    external_id UUID DEFAULT gen_random_uuid() UNIQUE,
    name TEXT NOT NULL,
    email TEXT,
    wa_number TEXT,
    sent BOOLEAN DEFAULT false,
    accessed BOOLEAN DEFAULT false,
    attended BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT NOW()
);
```

The `external_id` is a UUID used in invite links and QR codes — it's the public-facing identifier, while `id` is the internal primary key.

## API Design

### Public Endpoints

- `GET /api/invite/{token}` — Guest invite page data
- `GET /api/qr?participant_id={uuid}` — QR code PNG generation
- `GET /api/user?id={uuid}` — Participant lookup

### Auth Endpoints

- `POST /api/admin/login` — JWT token issuance

### Admin Endpoints (JWT required)

- `GET /api/admin/participants` — List all participants
- `POST /api/admin/participants` — Add a participant
- `POST /api/admin/attendance` — Mark attendance via QR scan

### Invite Endpoints

- `POST /api/bulk-invite` — Send invites to all unsent participants (batched at 50 with 500ms throttle)
- `GET /api/send-invite` — Send invite to a specific participant

## Key Design Decisions

1. **sqlc over an ORM** — Type-safe Go code generated from SQL queries, no runtime reflection overhead. Query intent is visible in the `.sql` files.
2. **UUID external IDs** — Separates internal primary keys from public identifiers, preventing enumeration attacks on the participant list.
3. **Batched invite sending** — Bulk invites are sent in batches of 50 with rate limiting to avoid API throttling from WhatsApp/Resend.
4. **Method-based routing** — Uses Go 1.22's `http.ServeMux` with `GET`, `POST` patterns instead of a third-party router, keeping dependencies minimal.

## Frontend

The frontend uses Vite + React + Rolldown with a TypeScript codebase, featuring:
- Guest invite page with QR code display
- Admin login and dashboard
- Admin QR scanner for door check-in

## Key Learnings

1. **sqlc is a great middle ground** — You write SQL directly, get generated Go types, and avoid ORM abstraction leaks.
2. **Go 1.22 routing is sufficient for most APIs** — The built-in `ServeMux` with method patterns handles RESTful routing cleanly without Gorilla Mux or Chi.
3. **WhatsApp API delivery is fragile** — The Meta Graph API has strict template requirements and phone number verification. Email via Resend was more reliable as a fallback.
4. **QR code scanning in-browser works well** — The frontend uses a JS QR scanner library for the admin door-check interface, eliminating the need for a native app.
