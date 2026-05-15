# PulseBoard — Real-Time Polling & Audience Intelligence Platform

PulseBoard lets you create polls, share them with a single link, and watch responses stream in live. But unlike basic poll tools that just count votes, PulseBoard automatically captures device, browser, location, and traffic source metadata from every response — giving poll creators a full picture of **who** is responding, not just **what** they picked.

**Live demo:** [pulseboard.dosomething.qzz.io](https://pulseboard.dosomething.qzz.io)
**Dashboard:** [dash-pulseboard.dosomething.qzz.io](https://dash-pulseboard.dosomething.qzz.io)

---

## The Problem

Teams, educators, and community managers constantly need quick feedback — feature prioritization, satisfaction checks, event topic votes. Existing tools either give you a bare-bones pie chart with zero context, or charge enterprise pricing for analytics that actually help you make decisions.

You end up knowing that 60% picked Option A, but you have no idea whether those responses came from mobile or desktop, which channel drove the most engagement, or what time of day your audience is most active. You're making decisions on incomplete data.

## What PulseBoard Does Differently

1. **Zero-friction response collection** — Respondents just answer questions and optionally leave feedback. No extra form fields, no sign-up walls (unless the creator wants authentication).

2. **Automatic metadata capture** — Every submission silently collects device type, browser, OS, screen resolution, locale, timezone, referrer, and UTM source. The respondent fills out nothing extra. The creator gets rich audience insights.

3. **Real-time live dashboard** — Responses stream in via WebSocket the moment someone submits. No polling, no refresh. Watch your response count, question breakdowns, and recent activity update live.

4. **Full analytics suite** — Response trends over time, question-wise breakdowns with percentages and skip rates, device/browser/OS distribution, traffic source attribution (UTM tracking), response heatmap by hour, feedback ratings, and exportable response data.

5. **Flexible access control** — Public polls, private polls with access codes, anonymous submissions, authenticated-only responses — configurable per poll.

---

## Features

- **Poll creation** with multiple questions, ordered options, optional/mandatory toggle, expiry dates, and draft/publish workflow
- **Shareable links** with built-in UTM parameter support for tracking which channel drives the most responses
- **Live responses page** — real-time feed of incoming responses with per-question option counts updating live via Socket.IO
- **Analytics dashboard** with 7 sections:
  - Overview cards (total responses, completion rate, avg time, avg rating)
  - Response trend chart (daily submission counts)
  - Question-wise breakdown (option counts, percentages, skip rates)
  - Audience insights (device, browser, OS, locale distribution)
  - Traffic source attribution (UTM source/medium breakdown)
  - Feedback summary (rating distribution + recent comments)
  - Response heatmap (submissions by day-of-week and hour)
- **Individual response viewer** with full answer details and submission metadata
- **CSV export** for response data
- **Dark mode** across the entire dashboard
- **Authentication** via Clerk (sign-in, sign-up, session management)

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Landing Page** | Next.js 16, React 19, Tailwind CSS 4, Clerk Auth |
| **Dashboard (SPA)** | React 19, Vite 7, React Router 7, TanStack React Query, Recharts, Radix UI, Tailwind CSS 4, Zustand, Socket.IO Client |
| **Backend API** | Express 5, Bun runtime, Socket.IO, Clerk Express SDK, Joi validation |
| **Database** | PostgreSQL (Neon), Prisma ORM 7 with pg adapter |
| **Auth** | Clerk (handles sign-up, sign-in, session tokens, webhooks) |
| **Real-time** | Socket.IO (WebSocket with room-based broadcasting per poll) |
| **Deployment** | VPS with Caddy reverse proxy, PM2 process manager |

---

## Architecture

```
┌──────────────────┐     ┌──────────────────┐     ┌──────────────────┐
│   Landing Page   │     │    Dashboard      │     │   Poll Response  │
│   (Next.js 16)   │     │  (React + Vite)   │     │     Page         │
│                  │     │                  │     │  (Public link)   │
└────────┬─────────┘     └────────┬─────────┘     └────────┬─────────┘
         │                        │                        │
         │              ┌─────────┴──────────┐             │
         │              │  Socket.IO Client   │             │
         │              │  (live responses)   │             │
         │              └─────────┬──────────┘             │
         │                        │                        │
         ▼                        ▼                        ▼
┌─────────────────────────────────────────────────────────────────────┐
│                        Express 5 + Bun                              │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐  ┌──────────────┐  │
│  │ Poll CRUD  │  │ Submit     │  │ Analytics  │  │ Clerk        │  │
│  │ Routes     │  │ Routes     │  │ Aggregation│  │ Webhooks     │  │
│  └────────────┘  └────────────┘  └────────────┘  └──────────────┘  │
│                                                                     │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │  Socket.IO Server (room per poll, broadcasts new responses)  │   │
│  └──────────────────────────────────────────────────────────────┘   │
└───────────────────────────────┬─────────────────────────────────────┘
                                │
                                ▼
                    ┌──────────────────────┐
                    │  PostgreSQL (Neon)    │
                    │  via Prisma ORM      │
                    └──────────────────────┘
```

---

## Database Schema

```
User ─────────< Poll ─────────< Question ─────────< Option
                  │                   │                  │
                  │                   │                  │
                  ▼                   ▼                  ▼
             Submission ──────< SubmissionAnswer >───────┘
                  │
                  ▼
          SubmissionMetaData
          (device, browser, OS, locale,
           timezone, UTM params, referrer,
           screen resolution, user agent)
```

Key design decisions:
- **Metadata is a separate table** (1:1 with Submission) to keep the submission record clean and the metadata extensible
- **SubmissionAnswer** links each answer to both a Question and an Option, with a unique constraint on `(submissionId, questionId)` to prevent duplicate answers
- **Soft deletes** on polls, questions, and options — nothing is permanently destroyed
- **`submittedBy` is nullable** — allows anonymous submissions while still supporting authenticated tracking

---

## Real-Time Flow

When a respondent submits a poll:

1. Backend saves the submission, answers, and metadata to the database
2. Backend emits a `new-response` event to the Socket.IO room for that poll
3. Every dashboard client watching that poll's live page receives the event instantly
4. The live page updates: total count increments, per-question bars adjust, the response appears in the activity feed

The poll creator sees all of this happen without refreshing the page.

---

## Project Structure

```
pulse-board/
├── backend/           # Express 5 API + Socket.IO server (Bun runtime)
│   ├── index.ts                  # Server entry point
│   ├── prisma/schema.prisma      # Database schema
│   └── src/
│       ├── common/middleware/     # Auth, error handling
│       ├── common/utils/         # Prisma client, API response helpers
│       └── module/
│           ├── poll/             # CRUD + analytics aggregation
│           ├── response/         # Submit + fetch responses
│           └── webhooks/         # Clerk user sync
│
├── frontend/          # Dashboard SPA (React + Vite)
│   └── src/
│       ├── api/                  # Axios API client
│       ├── components/           # UI components (analytics charts, layout, poll forms)
│       ├── hooks/                # Custom hooks (socket, queries)
│       ├── pages/                # Route pages (dashboard, create, analytics, live, responses)
│       ├── queries/              # TanStack Query hooks
│       └── types/                # TypeScript interfaces
│
└── landing/           # Marketing landing page (Next.js 16)
    └── src/app/                  # App router pages and layout
```

---

## Local Development

### Prerequisites

- [Bun](https://bun.sh) (v1.2+)
- PostgreSQL database (or a [Neon](https://neon.tech) free tier)
- [Clerk](https://clerk.com) account (free tier)

### Setup

```bash
# Clone the repo
git clone https://github.com/your-username/pulse-board.git
cd pulse-board

# Backend
cd backend
bun install
cp .env.example .env        # Fill in DATABASE_URL, Clerk keys
bun --bun run prisma migrate deploy
bun --bun run prisma generate
bun run index.ts

# Frontend (new terminal)
cd frontend
bun install
cp .env.example .env        # Set VITE_API_URL, VITE_SOCKET_URL, Clerk publishable key
bun run dev

# Landing page (new terminal)
cd landing
bun install
cp .env.example .env        # Set Clerk keys, API URL
bun run dev
```

### Environment Variables

**Backend** (`.env`):
```
DATABASE_URL=postgresql://...
CLERK_PUBLISHABLE_KEY=pk_...
CLERK_SECRET_KEY=sk_...
PORT=8000
FRONTEND_URL=http://localhost:5173
LANDING_PAGE_URL=http://localhost:3000
```

**Frontend** (`.env`):
```
VITE_API_URL=http://localhost:8000
VITE_SOCKET_URL=http://localhost:8000
VITE_CLERK_PUBLISHABLE_KEY=pk_...
VITE_MOCK_SOCKET=false
```

---

## What Makes This a Hackathon-Worthy Project

- **Full-stack depth** — Not a CRUD app with a chart. Server-side analytics aggregation computes 7 distinct insight sections from raw submission data using parallel Prisma queries.
- **Real-time infrastructure** — Socket.IO with room-based broadcasting. Responses appear on the live dashboard the instant they're submitted. Not faked with polling.
- **Implicit data collection** — The metadata capture strategy (UA parsing, UTM tracking, locale/timezone detection) demonstrates product thinking, not just engineering. Respondents fill out zero extra fields; creators get audience intelligence.
- **Production deployed** — Running on a VPS with Caddy, PM2, Neon Postgres, and Clerk auth. Not just a localhost demo.
- **Three coordinated apps** — Landing page (Next.js SSR), dashboard (React SPA), and backend API — all sharing auth and communicating in real-time.

---

Built for the 100xDevs Cohort Hackathon, May 2026.
