# PulseBoard — Frontend Implementation Plan

> Dashboard SPA for poll creators: create polls, manage questions, view real-time responses, and analyze audience insights.

---

## Table of Contents

1. [Current State](#1-current-state)
2. [Dependencies to Add](#2-dependencies-to-add)
3. [Design System Bridge](#3-design-system-bridge)
4. [File Structure](#4-file-structure)
5. [Routing Plan](#5-routing-plan)
6. [Pages & Wireframes](#6-pages--wireframes)
7. [State Management (Zustand)](#7-state-management-zustand)
8. [API Layer](#8-api-layer)
9. [Real-Time (Socket.IO)](#9-real-time-socketio)
10. [Charts & Graphs](#10-charts--graphs)
11. [shadcn Components to Install](#11-shadcn-components-to-install)
12. [Implementation Order](#12-implementation-order)

---

## 1. Current State

| Aspect | Value |
|---|---|
| Framework | React 19.2.4 + Vite 7.3.1 |
| Language | TypeScript 5.9.3 |
| Styling | Tailwind CSS v4 (`@tailwindcss/vite` plugin) |
| UI Library | shadcn (`radix-nova` style, `neutral` base, `lucide` icons) |
| State | Zustand 5.0.13 |
| Fonts | Inter Variable (body `--font-sans`), Geist Variable (headings `--font-heading`) |
| Theme | ThemeProvider with light/dark/system toggle (keyboard `d`) |
| Components | Only `Button` installed from shadcn |
| Router | **Not installed yet** |
| Path alias | `@/` → `./src/` |

---

## 2. Dependencies to Add

```bash
# Routing
bun add react-router-dom

# Charts (shadcn's chart component wraps Recharts)
bun add recharts

# Real-time
bun add socket.io-client

# Date formatting
bun add date-fns
```

No other dependencies needed — shadcn, Zustand, Tailwind, and lucide-react are already installed.

---

## 3. Design System Bridge

The aesthetic DNA skill file defines the visual language. Here's how it maps to the existing shadcn setup:

### Color Mapping

The shadcn theme uses oklch CSS variables. The PulseBoard aesthetic colors map as follows:

| Aesthetic DNA | Hex | Usage in Dashboard |
|---|---|---|
| Page Background | `#FAFAF7` | `--background` (light mode override) |
| Card Background | `#FFFFFF` | `--card` |
| Primary Text | `#1A1A2E` | `--foreground` |
| Secondary Text | `#6B7280` | `--muted-foreground` |
| Tertiary Text | `#9CA3AF` | Used directly via Tailwind |
| Success Green | `#22C55E` | `--chart-1` override + utility class |
| Info Blue | `#3B82F6` | `--chart-2` override + utility class |
| Warning Orange | `#F97316` | `--chart-3` override + utility class |
| Purple Accent | `#8B5CF6` | `--chart-4` override + utility class |

### Custom CSS Variables to Add in `index.css`

```css
/* PulseBoard accent tokens (add inside :root) */
--pb-green: #22C55E;
--pb-blue: #3B82F6;
--pb-orange: #F97316;
--pb-purple: #8B5CF6;
--pb-bg: #FAFAF7;
--pb-text: #1A1A2E;
--pb-text-secondary: #6B7280;
--pb-text-tertiary: #9CA3AF;
```

### Border Radius

Current `--radius: 0.625rem` (10px). The aesthetic DNA calls for 20-24px on cards.
- Cards/containers: use `rounded-2xl` (16px) or `rounded-3xl` (24px) directly
- Buttons/inputs: keep shadcn default (`rounded-lg` = 12px via radius scale) — matches aesthetic DNA
- Badges/pills: `rounded-full`

### Shadows

Add custom utility classes in `index.css`:

```css
@utility shadow-ambient {
  box-shadow: 0 1px 3px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.03);
}
@utility shadow-elevated {
  box-shadow: 0 4px 12px rgba(0,0,0,0.06), 0 20px 40px rgba(0,0,0,0.04);
}
```

### Micro-Interactions

Apply from aesthetic DNA:
- **Cards hover**: `hover:-translate-y-1 transition-all duration-300 ease-out`
- **Buttons hover**: `hover:-translate-y-px transition-all duration-200`
- **Scroll fade-in**: Custom `useFadeInOnScroll` hook using IntersectionObserver
- **Stat count-up**: Custom `useCountUp` hook for animating numbers
- **Page transitions**: CSS `@keyframes fade-in-up` with stagger via `animation-delay`

---

## 4. File Structure

```
src/
├── main.tsx                          # BrowserRouter + App mount
├── App.tsx                           # RouterProvider / route definitions
├── index.css                         # Tailwind + shadcn + PulseBoard tokens
│
├── components/
│   ├── ui/                           # shadcn components (auto-generated)
│   │   ├── button.tsx                ✅ exists
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   ├── label.tsx
│   │   ├── textarea.tsx
│   │   ├── select.tsx
│   │   ├── switch.tsx
│   │   ├── badge.tsx
│   │   ├── dialog.tsx
│   │   ├── dropdown-menu.tsx
│   │   ├── tabs.tsx
│   │   ├── table.tsx
│   │   ├── skeleton.tsx
│   │   ├── separator.tsx
│   │   ├── tooltip.tsx
│   │   ├── chart.tsx                 # shadcn chart wrapper for Recharts
│   │   ├── sidebar.tsx
│   │   └── sonner.tsx                # toast notifications
│   │
│   ├── theme-provider.tsx            ✅ exists
│   │
│   ├── layout/
│   │   ├── dashboard-layout.tsx      # Sidebar + topbar + <Outlet />
│   │   ├── app-sidebar.tsx           # Sidebar with dynamic poll list
│   │   └── topbar.tsx                # Top bar with breadcrumb + theme toggle
│   │
│   ├── poll/
│   │   ├── poll-card.tsx             # Poll summary card (used in list view)
│   │   ├── poll-status-badge.tsx     # DRAFT/ACTIVE/CLOSED/PUBLISHED badge
│   │   ├── question-card.tsx         # Question display/edit card
│   │   ├── option-item.tsx           # Single option within a question
│   │   └── share-modal.tsx           # Share link modal with UTM links
│   │
│   ├── analytics/
│   │   ├── stat-card.tsx             # Single stat (total responses, avg time, etc.)
│   │   ├── response-trend-chart.tsx  # Line chart — responses over time
│   │   ├── question-breakdown.tsx    # Horizontal bar chart per question
│   │   ├── device-pie-chart.tsx      # Pie/donut — device type distribution
│   │   ├── browser-pie-chart.tsx     # Pie/donut — browser distribution
│   │   ├── source-bar-chart.tsx      # Bar chart — UTM source breakdown
│   │   ├── response-heatmap.tsx      # Heatmap — responses by hour of day
│   │   ├── rating-distribution.tsx   # Bar chart — 1-5 star distribution
│   │   └── feedback-list.tsx         # Scrollable list of feedback comments
│   │
│   └── common/
│       ├── empty-state.tsx           # Empty state with illustration
│       ├── loading-skeleton.tsx      # Page-level skeleton loader
│       └── error-boundary.tsx        # Error boundary wrapper
│
├── pages/
│   ├── dashboard.tsx                 # Home — poll list + overview stats
│   ├── create-poll.tsx               # Create new poll form
│   ├── edit-poll.tsx                 # Edit poll + manage questions
│   ├── poll-detail.tsx               # Single poll overview (questions + status)
│   ├── poll-analytics.tsx            # Full analytics dashboard for a poll
│   ├── poll-live.tsx                 # Live real-time response view
│   ├── poll-responses.tsx            # Individual response table (authenticated polls)
│   └── settings.tsx                  # User profile/settings (future)
│
├── hooks/
│   ├── use-fade-in.ts               # IntersectionObserver scroll animation
│   ├── use-count-up.ts              # Animated number count-up
│   ├── use-socket.ts                # Socket.IO connection + room management
│   └── use-copy-to-clipboard.ts     # Copy + "Copied!" feedback
│
├── stores/
│   ├── poll-store.ts                # Zustand — polls list, current poll, CRUD
│   ├── analytics-store.ts           # Zustand — analytics data for current poll
│   └── socket-store.ts              # Zustand — socket connection state
│
├── services/
│   ├── api.ts                       # Base fetch/axios config (baseURL, headers)
│   ├── poll-api.ts                  # Poll CRUD API calls
│   ├── analytics-api.ts             # Analytics data fetching
│   └── socket.ts                    # Socket.IO client singleton
│
├── types/
│   └── index.ts                     # TypeScript types mirroring Prisma models
│
└── lib/
    └── utils.ts                     ✅ exists (cn utility)
```

---

## 5. Routing Plan

Using `react-router-dom` v7 with `createBrowserRouter`:

```
/                           → Dashboard (poll list)
/polls/create               → Create Poll
/polls/:pollId              → Poll Detail (overview + questions)
/polls/:pollId/edit         → Edit Poll + manage questions
/polls/:pollId/analytics    → Analytics Dashboard
/polls/:pollId/live         → Live Real-Time View
/polls/:pollId/responses    → Individual Responses Table
/settings                   → User Settings (future)
```

All routes wrapped in `DashboardLayout` which provides the sidebar + topbar shell.

### Router Setup (App.tsx)

```tsx
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import DashboardLayout from "@/components/layout/dashboard-layout";

const router = createBrowserRouter([
  {
    element: <DashboardLayout />,
    children: [
      { index: true, element: <Dashboard /> },
      { path: "polls/create", element: <CreatePoll /> },
      { path: "polls/:pollId", element: <PollDetail /> },
      { path: "polls/:pollId/edit", element: <EditPoll /> },
      { path: "polls/:pollId/analytics", element: <PollAnalytics /> },
      { path: "polls/:pollId/live", element: <PollLive /> },
      { path: "polls/:pollId/responses", element: <PollResponses /> },
      { path: "settings", element: <Settings /> },
    ],
  },
]);
```

---

## 6. Pages & Wireframes

### 6.0 Sidebar (Persistent — All Pages)

The sidebar is visible on every page. It dynamically lists the user's polls so they can jump between them instantly.

```
┌───────────────────────────┐
│  ◻ PulseBoard             │  ← Logo + name
│                           │
│  ── MAIN ──────────────── │
│  📊 Dashboard             │  ← / (active: bg-accent)
│  ➕ Create Poll           │  ← /polls/create
│                           │
│  ── YOUR POLLS ────────── │  ← Fetched from poll store
│  • Product Survey  ACTIVE │  ← /polls/:id (click → detail)
│  • Team Feedback   DRAFT  │  ← Status badge inline
│  • Q2 Retro        CLOSED │
│  • Community Vote  PUBLD  │
│                           │
│  (scrollable if 10+ polls)│
│                           │
│  ── BOTTOM ────────────── │
│  ⚙ Settings              │  ← /settings
│  ◯ User Avatar            │  ← Clerk UserButton (future)
└───────────────────────────┘
```

**Behavior:**
- Poll list fetched on sidebar mount via `pollStore.fetchPolls()`
- Each poll item shows title (truncated) + status badge (colored dot or pill)
- Clicking a poll navigates to `/polls/:pollId` (detail page)
- Active route is highlighted with `bg-accent` background
- If 10+ polls, the "YOUR POLLS" section becomes scrollable (shadcn `ScrollArea`)
- Sidebar collapses to icons on mobile (shadcn `Sidebar` component handles this)

**Components:** shadcn `Sidebar`, `SidebarContent`, `SidebarGroup`, `SidebarMenu`, `SidebarMenuItem`, `SidebarMenuButton`, `Badge`, `ScrollArea`, `Avatar`

---

### 6.1 Dashboard — Poll List (`/`)

The home page. Shows all polls created by the user with key stats and a searchable list.

```
┌─────────────────────────────────────────────────────────────────────┐
│ SIDEBAR  │  TOPBAR: "Dashboard"                   [Theme] [Avatar] │
│ (see 6.0)│─────────────────────────────────────────────────────────  │
│          │                                                          │
│          │  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐        │
│          │  │ Total Polls │ │ Active Polls│ │ Total       │        │
│          │  │     12      │ │      3      │ │ Responses   │        │
│          │  │             │ │             │ │    847      │        │
│          │  └─────────────┘ └─────────────┘ └─────────────┘        │
│          │                                                          │
│          │  ┌────────────────────────────────────────────┐ [+ New]  │
│          │  │ Search polls...              [Filter ▼]   │          │
│          │  └────────────────────────────────────────────┘          │
│          │                                                          │
│          │  ┌──────────────────────────────────────────────────┐    │
│          │  │ Product Feature Survey        ACTIVE  │ 234 resp │    │
│          │  │ Created 3 days ago            ────────┘          │    │
│          │  │ Expires in 4 days          [Analytics] [Edit] ▸  │    │
│          │  └──────────────────────────────────────────────────┘    │
│          │  ┌──────────────────────────────────────────────────┐    │
│          │  │ Team Satisfaction Q2          DRAFT   │ 0 resp   │    │
│          │  │ Created today                ────────┘           │    │
│          │  │ Expires in 14 days         [Analytics] [Edit] ▸  │    │
│          │  └──────────────────────────────────────────────────┘    │
│          │  ┌──────────────────────────────────────────────────┐    │
│          │  │ Community Topic Vote         CLOSED  │ 89 resp   │    │
│          │  │ Created 2 weeks ago          ────────┘           │    │
│          │  │ Expired                    [Analytics] [View] ▸  │    │
│          │  └──────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────┘
```

**Components used:**
- `stat-card.tsx` (3 overview cards with count-up animation)
- `poll-card.tsx` (each poll row)
- `poll-status-badge.tsx` (DRAFT/ACTIVE/CLOSED/PUBLISHED)
- shadcn: `Card`, `Badge`, `Input`, `Button`, `Select`, `Skeleton`

**Data:** `GET /api/polls` (list all polls for authenticated user — **new endpoint needed**)

---

### 6.2 Create Poll (`/polls/create`)

Multi-section form to create a new poll.

```
┌─────────────────────────────────────────────────────────────────────┐
│ SIDEBAR │  TOPBAR: "Create Poll"                  [Theme] [Avatar] │
│         │─────────────────────────────────────────────────────────── │
│         │                                                          │
│         │  ┌─── Poll Details ──────────────────────────────────┐   │
│         │  │                                                    │   │
│         │  │  Title *          [________________________]       │   │
│         │  │  Slug *           [________________________] Auto  │   │
│         │  │  Description      [________________________]       │   │
│         │  │                   [________________________]       │   │
│         │  │                                                    │   │
│         │  │  Expires At *     [____/____/____] [__:__]         │   │
│         │  │                                                    │   │
│         │  │  ┌──────────────────────────────────────────┐     │   │
│         │  │  │ Public poll          [  Toggle  ]        │     │   │
│         │  │  │ Allow anonymous      [  Toggle  ]        │     │   │
│         │  │  └──────────────────────────────────────────┘     │   │
│         │  │                                                    │   │
│         │  └────────────────────────────────────────────────────┘   │
│         │                                                          │
│         │           [Cancel]  [Create Poll & Add Questions →]      │
│         │                                                          │
└─────────────────────────────────────────────────────────────────────┘
```

**Flow:** After successful creation → redirect to `/polls/:pollId/edit` to add questions.

**Components used:** shadcn `Card`, `Input`, `Label`, `Textarea`, `Switch`, `Button`

**Data:** `POST /api/poll` (createPoll)

---

### 6.3 Edit Poll (`/polls/:pollId/edit`)

Manage poll metadata + add/edit/reorder questions.

```
┌─────────────────────────────────────────────────────────────────────┐
│ SIDEBAR │  TOPBAR: "Edit: Product Feature Survey"  [Theme] [Avatar]│
│         │─────────────────────────────────────────────────────────── │
│         │                                                          │
│         │  ┌─── Poll Settings (collapsible) ───────────────────┐   │
│         │  │  Title: Product Feature Survey    Status: DRAFT    │   │
│         │  │  [Edit Settings]                  [Activate Poll]  │   │
│         │  └────────────────────────────────────────────────────┘   │
│         │                                                          │
│         │  Questions (3)                          [+ Add Question]  │
│         │                                                          │
│         │  ┌─── Q1 ────────────────────────────────────────────┐   │
│         │  │  ≡  "Which feature matters most to you?"          │   │
│         │  │     ○ Dark mode                                    │   │
│         │  │     ○ API integrations                             │   │
│         │  │     ○ Mobile app                                   │   │
│         │  │     ○ Team collaboration                           │   │
│         │  │     Required · 4 options         [Edit] [Delete]   │   │
│         │  └────────────────────────────────────────────────────┘   │
│         │                                                          │
│         │  ┌─── Q2 ────────────────────────────────────────────┐   │
│         │  │  ≡  "How often do you use our product?"           │   │
│         │  │     ○ Daily   ○ Weekly   ○ Monthly   ○ Rarely     │   │
│         │  │     Required · 4 options         [Edit] [Delete]   │   │
│         │  └────────────────────────────────────────────────────┘   │
│         │                                                          │
│         │  ┌─── Q3 ────────────────────────────────────────────┐   │
│         │  │  ≡  "Any additional feedback?"                    │   │
│         │  │     (open text)                                    │   │
│         │  │     Optional                     [Edit] [Delete]   │   │
│         │  └────────────────────────────────────────────────────┘   │
│         │                                                          │
│         │      [Preview Poll]  [Share Poll]  [Activate & Go Live] │
│         │                                                          │
└─────────────────────────────────────────────────────────────────────┘
```

**Components used:**
- `question-card.tsx` (each question with drag handle ≡)
- `option-item.tsx` (individual options within questions)
- `share-modal.tsx` (triggered by "Share Poll")
- shadcn: `Card`, `Dialog`, `Input`, `Label`, `Switch`, `Button`, `Badge`, `Separator`

**Data:**
- `GET /api/poll/:pollId` (getPoll — includes questions)
- `POST /api/poll/:pollId/questions/add` (addQuestion)
- `POST /api/poll/:pollId/questions/update` (updateQuestion)
- `PATCH /api/poll/:pollId/status` (updatePollStatus)

---

### 6.4 Poll Detail (`/polls/:pollId`)

Read-only overview of a poll. Gateway to analytics, live view, and responses.

```
┌─────────────────────────────────────────────────────────────────────┐
│ SIDEBAR │  TOPBAR: "Product Feature Survey"       [Theme] [Avatar] │
│         │─────────────────────────────────────────────────────────── │
│         │                                                          │
│         │  ┌─── Poll Info ─────────────────────────────────────┐   │
│         │  │                                                    │   │
│         │  │  Product Feature Survey         Status: ● ACTIVE   │   │
│         │  │  "Help us decide which features to build next"     │   │
│         │  │                                                    │   │
│         │  │  Created: May 10, 2026    Expires: May 24, 2026   │   │
│         │  │  Public: Yes              Anonymous: Yes           │   │
│         │  │                                                    │   │
│         │  │  [Edit] [Share] [View Analytics] [Go Live]         │   │
│         │  │                                                    │   │
│         │  └────────────────────────────────────────────────────┘   │
│         │                                                          │
│         │  ┌────────────┐ ┌────────────┐ ┌────────────┐           │
│         │  │ Responses  │ │ Completion │ │ Avg Time   │           │
│         │  │    234     │ │   87%      │ │   2m 34s   │           │
│         │  └────────────┘ └────────────┘ └────────────┘           │
│         │                                                          │
│         │  ┌─── Questions (3) ─────────────────────────────────┐   │
│         │  │  1. Which feature matters most to you?  (4 opts)  │   │
│         │  │  2. How often do you use our product?   (4 opts)  │   │
│         │  │  3. Any additional feedback?            (optional) │   │
│         │  └────────────────────────────────────────────────────┘   │
│         │                                                          │
└─────────────────────────────────────────────────────────────────────┘
```

**Components used:** `stat-card.tsx`, `poll-status-badge.tsx`, shadcn `Card`, `Badge`, `Button`, `Separator`

---

### 6.5 Poll Analytics (`/polls/:pollId/analytics`)

The core analytics dashboard. This is the most complex page.

```
┌─────────────────────────────────────────────────────────────────────┐
│ SIDEBAR │  TOPBAR: "Analytics: Product Feature Survey"   [Avatar]  │
│         │─────────────────────────────────────────────────────────── │
│         │                                                          │
│         │  ── Row 1: Overview Stats ──────────────────────────────  │
│         │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐   │
│         │  │ Total    │ │Completion│ │ Avg Time │ │ Avg      │   │
│         │  │Responses │ │ Rate     │ │ Spent    │ │ Rating   │   │
│         │  │   234    │ │  87%     │ │  2m 34s  │ │ 4.2/5    │   │
│         │  │ +12 today│ │          │ │          │ │ ★★★★☆    │   │
│         │  └──────────┘ └──────────┘ └──────────┘ └──────────┘   │
│         │                                                          │
│         │  ── Row 2: Response Trend (Line Chart) ─────────────────  │
│         │  ┌──────────────────────────────────────────────────────┐ │
│         │  │  Responses Over Time                    [Day|Week]  │ │
│         │  │                                                      │ │
│         │  │       ╱╲                                             │ │
│         │  │    ╱╱    ╲╲        ╱╲                                │ │
│         │  │  ╱╱        ╲╲  ╱╱    ╲╲    ╱╱                       │ │
│         │  │╱╱            ╲╱        ╲╲╱╱                          │ │
│         │  │  May 10    May 11    May 12    May 13               │ │
│         │  └──────────────────────────────────────────────────────┘ │
│         │                                                          │
│         │  ── Row 3: Question-wise Breakdown ─────────────────────  │
│         │  ┌──────────────────────────────────────────────────────┐ │
│         │  │  Q1: "Which feature matters most to you?"           │ │
│         │  │                                                      │ │
│         │  │  Dark mode          ████████████████████  42% (98)  │ │
│         │  │  API integrations   ████████████         28% (66)  │ │
│         │  │  Mobile app         ████████             18% (42)  │ │
│         │  │  Team collaboration ██████               12% (28)  │ │
│         │  │                                                      │ │
│         │  │  234 responses · 0 skipped                          │ │
│         │  └──────────────────────────────────────────────────────┘ │
│         │  ┌──────────────────────────────────────────────────────┐ │
│         │  │  Q2: "How often do you use our product?"            │ │
│         │  │                                                      │ │
│         │  │  Daily    ████████████████████████████    55% (129) │ │
│         │  │  Weekly   ████████████                    25% (59)  │ │
│         │  │  Monthly  ██████                          12% (28)  │ │
│         │  │  Rarely   ████                             8% (18)  │ │
│         │  │                                                      │ │
│         │  │  234 responses · 0 skipped                          │ │
│         │  └──────────────────────────────────────────────────────┘ │
│         │                                                          │
│         │  ── Row 4: Audience Insights (Pie Charts) ──────────────  │
│         │  ┌────────────────────┐ ┌────────────────────┐          │
│         │  │  Device Type       │ │  Browser           │          │
│         │  │                    │ │                     │          │
│         │  │    ┌──────┐        │ │    ┌──────┐         │          │
│         │  │    │Mobile│ 68%    │ │    │Chrome│ 55%     │          │
│         │  │    │Desk  │ 28%    │ │    │Safari│ 25%     │          │
│         │  │    │Tablet│  4%    │ │    │Firefx│ 12%     │          │
│         │  │    └──────┘        │ │    │Edge  │  8%     │          │
│         │  │                    │ │    └──────┘         │          │
│         │  └────────────────────┘ └────────────────────┘          │
│         │  ┌────────────────────┐ ┌────────────────────┐          │
│         │  │  OS Distribution   │ │  Locale / Region   │          │
│         │  │    ┌──────┐        │ │    ┌──────┐         │          │
│         │  │    │Androi│ 45%    │ │    │en-IN │ 60%     │          │
│         │  │    │iOS   │ 23%    │ │    │en-US │ 25%     │          │
│         │  │    │Wndws │ 20%    │ │    │en-GB │ 10%     │          │
│         │  │    │macOS │  8%    │ │    │Other │  5%     │          │
│         │  │    │Linux │  4%    │ │    └──────┘         │          │
│         │  │    └──────┘        │ │                     │          │
│         │  └────────────────────┘ └────────────────────┘          │
│         │                                                          │
│         │  ── Row 5: Engagement Insights ─────────────────────────  │
│         │  ┌──────────────────────┐ ┌────────────────────────────┐ │
│         │  │  Response Heatmap    │ │  Response Source (UTM)      │ │
│         │  │  by Hour of Day      │ │                             │ │
│         │  │                      │ │  Twitter    ██████████ 45% │ │
│         │  │  ░░░░▓▓▓▓████▓▓░░   │ │  WhatsApp   ████████   30% │ │
│         │  │  12am  6am 12pm 6pm  │ │  Email      ██████     20% │ │
│         │  │                      │ │  LinkedIn   ██          5% │ │
│         │  │  Peak: 2-4pm         │ │                             │ │
│         │  └──────────────────────┘ └────────────────────────────┘ │
│         │                                                          │
│         │  ── Row 6: Feedback ────────────────────────────────────  │
│         │  ┌──────────────────────┐ ┌────────────────────────────┐ │
│         │  │  Rating Distribution │ │  Recent Feedback           │ │
│         │  │                      │ │                             │ │
│         │  │  5★ ████████████ 45% │ │  ★★★★★ "Great survey!"    │ │
│         │  │  4★ ████████    30%  │ │  ★★★★☆ "Needs more opts" │ │
│         │  │  3★ ████        15%  │ │  ★★★★★ "Very relevant"   │ │
│         │  │  2★ ██           7%  │ │  ★★★☆☆ "Too short"       │ │
│         │  │  1★ █            3%  │ │  ... [View all]            │ │
│         │  │                      │ │                             │ │
│         │  │  Avg: 4.2 ★★★★☆     │ │                             │ │
│         │  └──────────────────────┘ └────────────────────────────┘ │
│         │                                                          │
└─────────────────────────────────────────────────────────────────────┘
```

**Charts breakdown:**

| Chart | Type | Library Component | Data Source |
|---|---|---|---|
| Response Trend | Line/Area chart | `<AreaChart>` from Recharts | Aggregated submissions by date |
| Question Breakdown | Horizontal bar | `<BarChart layout="vertical">` | SubmissionAnswer counts per option |
| Device Type | Donut chart | `<PieChart>` with inner radius | SubmissionMetaData.deviceType |
| Browser | Donut chart | `<PieChart>` with inner radius | SubmissionMetaData.browser |
| OS Distribution | Donut chart | `<PieChart>` with inner radius | SubmissionMetaData.os |
| Locale/Region | Donut chart | `<PieChart>` with inner radius | SubmissionMetaData.locale |
| Response Heatmap | Custom grid | Custom component with CSS grid | Submissions grouped by hour |
| Source (UTM) | Horizontal bar | `<BarChart layout="vertical">` | SubmissionMetaData.utmSource |
| Rating Distribution | Horizontal bar | `<BarChart layout="vertical">` | Submission.rating grouped |
| Feedback List | Scrollable list | Custom (no chart) | Submission.feedback |

**Data:** `GET /api/poll/:pollId/analytics` — single endpoint returns all analytics data (overview, trend, questions, audience, sources, feedback). See Section 8.4 for full response shape.

---

### 6.6 Poll Live (`/polls/:pollId/live`)

Real-time view for the poll creator to watch responses as they come in.

```
┌─────────────────────────────────────────────────────────────────────┐
│ SIDEBAR │  TOPBAR: "Live: Product Feature Survey"  ● LIVE [Avatar] │
│         │─────────────────────────────────────────────────────────── │
│         │                                                          │
│         │  ┌── Live Stats ──────────────────────────────────────┐  │
│         │  │  Responses: 234 (+3 in last min)    ● Connected    │  │
│         │  └────────────────────────────────────────────────────┘  │
│         │                                                          │
│         │  ┌── Real-Time Response Trend ────────────────────────┐  │
│         │  │                                                     │  │
│         │  │  (Area chart updating live via WebSocket)            │  │
│         │  │                                                     │  │
│         │  │       ╱╲                                            │  │
│         │  │    ╱╱    ╲╲        ╱╲    ╱                          │  │
│         │  │  ╱╱        ╲╲  ╱╱    ╲╲╱  ← new data point         │  │
│         │  │╱╱            ╲╱                                     │  │
│         │  │                                                     │  │
│         │  └─────────────────────────────────────────────────────┘  │
│         │                                                          │
│         │  ┌── Live Question Results ───────────────────────────┐  │
│         │  │                                                     │  │
│         │  │  Q1: "Which feature matters most to you?"           │  │
│         │  │                                                     │  │
│         │  │  Dark mode          ████████████████████  42%       │  │
│         │  │  API integrations   ████████████         28%       │  │
│         │  │  Mobile app         ████████             18%   ← ! │  │
│         │  │  Team collaboration ██████               12%       │  │
│         │  │                                                     │  │
│         │  │  (Bars animate/grow when new votes arrive)          │  │
│         │  │                                                     │  │
│         │  └─────────────────────────────────────────────────────┘  │
│         │                                                          │
│         │  ┌── Recent Submissions Feed ─────────────────────────┐  │
│         │  │  ● Anonymous · just now · 4 questions answered      │  │
│         │  │  ● Anonymous · 2 min ago · 4 questions answered     │  │
│         │  │  ● john@example.com · 5 min ago · 3 of 4 answered  │  │
│         │  │  ...                                                │  │
│         │  └─────────────────────────────────────────────────────┘  │
│         │                                                          │
└─────────────────────────────────────────────────────────────────────┘
```

**Real-time mechanics:**
- On mount: join Socket.IO room `poll:<pollId>`
- Listen for `new-response` event → update chart data, increment counter, prepend to feed
- Live indicator with pulse animation (green dot + "LIVE" badge)
- Charts use smooth CSS transitions for bar width changes

**Components used:**
- `response-trend-chart.tsx` (with live update mode)
- `question-breakdown.tsx` (with animated transitions)
- shadcn: `Card`, `Badge`, `Separator`

---

### 6.7 Poll Responses (`/polls/:pollId/responses`)

Table view of individual responses. Only for authenticated polls.

```
┌─────────────────────────────────────────────────────────────────────┐
│ SIDEBAR │  TOPBAR: "Responses: Product Feature Survey"    [Avatar] │
│         │─────────────────────────────────────────────────────────── │
│         │                                                          │
│         │  234 responses                          [Export CSV]      │
│         │                                                          │
│         │  ┌─────────────────────────────────────────────────────┐ │
│         │  │ # │ Respondent      │ Submitted   │ Rating │ Status│ │
│         │  │───│─────────────────│─────────────│────────│───────│ │
│         │  │ 1 │ john@email.com  │ 2h ago      │ ★★★★★  │ Done  │ │
│         │  │ 2 │ Anonymous       │ 3h ago      │ ★★★★☆  │ Done  │ │
│         │  │ 3 │ jane@email.com  │ 5h ago      │ ★★★☆☆  │ Done  │ │
│         │  │ 4 │ Anonymous       │ 1d ago      │ —      │ Done  │ │
│         │  │ 5 │ bob@email.com   │ 1d ago      │ ★★★★★  │ Done  │ │
│         │  │   │                 │             │        │       │ │
│         │  │   │  [← Prev]  Page 1 of 12  [Next →]              │ │
│         │  └─────────────────────────────────────────────────────┘ │
│         │                                                          │
│         │  ── Expanded Row (click to expand) ─────────────────────  │
│         │  ┌─────────────────────────────────────────────────────┐ │
│         │  │  Q1: Which feature? → "Dark mode"                   │ │
│         │  │  Q2: How often?     → "Daily"                       │ │
│         │  │  Q3: Feedback?      → "Love the product, keep..."   │ │
│         │  │                                                      │ │
│         │  │  Meta: Chrome · macOS · Desktop · en-US             │ │
│         │  │  Source: twitter (social)                            │ │
│         │  │  Time spent: 2m 14s                                 │ │
│         │  └─────────────────────────────────────────────────────┘ │
│         │                                                          │
└─────────────────────────────────────────────────────────────────────┘
```

**Components used:** shadcn `Table`, `Badge`, `Button`, `Card`

**Data:** `GET /api/poll/:pollId/responses` — paginated individual submissions (**new endpoint needed**)

---

## 7. State Management (Zustand)

### 7.1 Poll Store (`stores/poll-store.ts`)

```ts
interface PollStore {
  // List
  polls: Poll[];
  isLoading: boolean;
  fetchPolls: () => Promise<void>;

  // Current poll being viewed/edited
  currentPoll: Poll | null;
  fetchPoll: (pollId: string) => Promise<void>;

  // CRUD
  createPoll: (data: CreatePollInput) => Promise<Poll>;
  updatePollStatus: (pollId: string, status: PollStatus) => Promise<void>;

  // Questions
  addQuestion: (pollId: string, data: AddQuestionInput) => Promise<void>;
  updateQuestion: (pollId: string, data: UpdateQuestionInput) => Promise<void>;
}
```

### 7.2 Analytics Store (`stores/analytics-store.ts`)

```ts
interface AnalyticsStore {
  overview: OverviewStats | null;
  trend: TrendDataPoint[];
  questionBreakdowns: QuestionBreakdown[];
  audienceData: AudienceData | null;
  sourceData: SourceBreakdown[];
  feedbackList: FeedbackItem[];

  isLoading: boolean;

  fetchAnalytics: (pollId: string) => Promise<void>;

  // Real-time updates
  incrementResponseCount: () => void;
  updateQuestionBreakdown: (questionId: string, optionId: string) => void;
}
```

### 7.3 Socket Store (`stores/socket-store.ts`)

```ts
interface SocketStore {
  isConnected: boolean;
  currentRoom: string | null;

  connect: () => void;
  disconnect: () => void;
  joinRoom: (pollId: string) => void;
  leaveRoom: () => void;
}
```

---

## 8. API Layer

### 8.1 Base Config (`services/api.ts`)

```ts
const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { "Content-Type": "application/json", ...options?.headers },
    credentials: "include",
    ...options,
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}
```

### 8.2 Existing Backend Endpoints

| Method | Path | Controller | Status |
|---|---|---|---|
| POST | `/api/poll` | createPoll | Implemented |
| POST | `/api/poll/:pollId/questions/add` | addQuestion | Implemented |
| POST | `/api/poll/:pollId/questions/update` | updateQuestion | Implemented |
| POST | `/api/poll/:pollId/response` | submitResponse | **Stub** |
| GET | `/api/poll/:pollId` | getPoll | Implemented |
| GET | `/api/poll/:pollId/results` | getResults | Implemented |
| PATCH | `/api/poll/:pollId/status` | updatePollStatus | Implemented |

### 8.3 New Endpoints Needed

| Method | Path | Purpose | Priority |
|---|---|---|---|
| GET | `/api/polls` | List all polls for auth user | **Must-have** |
| GET | `/api/poll/:pollId/analytics` | **Single endpoint** — all analytics data | **Must-have** |
| GET | `/api/poll/:pollId/responses` | Paginated individual submissions | Nice-to-have |
| DELETE | `/api/poll/:pollId` | Delete poll | Nice-to-have |
| DELETE | `/api/poll/:pollId/questions/:questionId` | Delete question | Nice-to-have |

### 8.4 Analytics Endpoint — Single Response Shape

One request, one response. Backend runs all aggregation queries in parallel via `Promise.all`.

```
GET /api/poll/:pollId/analytics

Response:
{
  "overview": {
    "totalResponses": 234,
    "completionRate": 87,
    "avgTimeSeconds": 154,
    "avgRating": 4.2
  },
  "trend": [
    { "date": "2026-05-10", "count": 45 },
    { "date": "2026-05-11", "count": 78 },
    ...
  ],
  "questions": [
    {
      "questionId": "...",
      "title": "Which feature matters most?",
      "totalResponses": 234,
      "skipCount": 0,
      "options": [
        { "optionId": "...", "name": "Dark mode", "count": 98, "pct": 42 },
        { "optionId": "...", "name": "API integrations", "count": 66, "pct": 28 },
        ...
      ]
    },
    ...
  ],
  "audience": {
    "devices": { "mobile": 159, "desktop": 66, "tablet": 9 },
    "browsers": { "Chrome": 129, "Safari": 59, "Firefox": 28, "Edge": 18 },
    "os": { "Android": 105, "iOS": 54, "Windows": 47, "macOS": 19, "Linux": 9 },
    "locales": { "en-IN": 140, "en-US": 59, "en-GB": 23, "other": 12 }
  },
  "sources": [
    { "source": "twitter", "medium": "social", "count": 105 },
    { "source": "whatsapp", "medium": "chat", "count": 70 },
    ...
  ],
  "feedback": {
    "ratings": { "1": 7, "2": 16, "3": 35, "4": 70, "5": 106 },
    "comments": [
      { "rating": 5, "text": "Great survey!", "submittedAt": "2026-05-13T..." },
      ...
    ]
  }
}
```

**Why single endpoint:**
- One request, all charts render together — no waterfall loading
- Backend batches queries with `Promise.all` — no wasted round-trips
- One loading state, one error boundary
- Aggregated data is small (few KB even for 1000+ responses)

---

## 9. Real-Time (Socket.IO)

### Client Setup (`services/socket.ts`)

```ts
import { io, Socket } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:3000";

let socket: Socket | null = null;

export function getSocket(): Socket {
  if (!socket) {
    socket = io(SOCKET_URL, { autoConnect: false });
  }
  return socket;
}
```

### Hook (`hooks/use-socket.ts`)

```ts
function useSocket(pollId: string) {
  // Connect on mount
  // Join room: socket.emit("join-poll", pollId)
  // Listen: socket.on("new-response", callback)
  // Leave room + disconnect on unmount
}
```

### Events

| Event | Direction | Payload | Triggered When |
|---|---|---|---|
| `join-poll` | Client → Server | `{ pollId }` | Creator opens live view |
| `leave-poll` | Client → Server | `{ pollId }` | Creator leaves live view |
| `new-response` | Server → Client | `{ submissionId, questionAnswers, metadata }` | Respondent submits |
| `poll-status-changed` | Server → Client | `{ pollId, status }` | Poll status updates |

### Pages Using Real-Time

- **Poll Live** (`/polls/:pollId/live`): Full real-time — chart updates, counter, feed
- **Poll Analytics** (`/polls/:pollId/analytics`): Optional — show "X new responses since you loaded" banner with refresh button

---

## 10. Charts & Graphs

Using **Recharts** via shadcn's `Chart` component wrapper. All charts follow the PulseBoard color palette.

### Chart Color Palette

```ts
const CHART_COLORS = {
  primary: "#3B82F6",   // blue — main data
  secondary: "#22C55E", // green — positive/success
  tertiary: "#F97316",  // orange — warning/attention
  quaternary: "#8B5CF6",// purple — variety
  quinary: "#EC4899",   // pink — additional
  muted: "#9CA3AF",     // gray — neutral/other
};
```

### Chart Specifications

#### 1. Response Trend (Area Chart)
- **Type**: `<AreaChart>` with gradient fill
- **X-axis**: Date/time labels
- **Y-axis**: Response count
- **Style**: Soft blue gradient fill (`#3B82F6` at 20% opacity), blue stroke
- **Tooltip**: Custom styled with rounded-xl, shadow-ambient
- **Live mode**: New data points append with smooth transition

#### 2. Question Breakdown (Horizontal Bar)
- **Type**: `<BarChart layout="vertical">`
- **Bars**: Rounded ends (`radius={[0, 6, 6, 0]}`)
- **Colors**: Cycle through chart palette per option
- **Labels**: Option name left-aligned, percentage + count right-aligned
- **Animation**: `animationDuration={800}` on mount, CSS transition on live update

#### 3. Audience Pie Charts (Donut)
- **Type**: `<PieChart>` with `innerRadius={60} outerRadius={80}`
- **Colors**: Chart palette
- **Center text**: Top value (e.g., "68% Mobile")
- **Legend**: Below chart, horizontal layout
- **Hover**: Segment lifts slightly (`activeShape` with larger radius)

#### 4. Source Bar Chart (Horizontal Bar)
- Same as question breakdown but grouped by UTM source
- Stacked variant optional: source + medium

#### 5. Rating Distribution (Horizontal Bar)
- 5 bars for 1-5 stars
- Color gradient from red (1★) → yellow (3★) → green (5★)
- Star icons as Y-axis labels

#### 6. Response Heatmap (Custom)
- CSS Grid: 24 columns (hours) × 7 rows (days of week)
- Cell color intensity maps to response count
- Gradient from `#F5F5F3` (0 responses) → `#3B82F6` (max responses)
- Tooltip on hover showing exact count

### Chart Container Pattern

All charts wrapped in a consistent card:

```tsx
<Card className="rounded-2xl shadow-ambient border border-black/[0.06] p-6">
  <div className="flex items-center justify-between mb-6">
    <h3 className="font-heading text-lg font-semibold text-[#1A1A2E]">
      {title}
    </h3>
    {/* Optional controls: date range, toggle */}
  </div>
  <div className="h-[300px]">
    <ResponsiveContainer width="100%" height="100%">
      {/* Recharts component */}
    </ResponsiveContainer>
  </div>
</Card>
```

---

## 11. shadcn Components to Install

Run these commands to install needed shadcn components:

```bash
bunx shadcn@latest add card
bunx shadcn@latest add input
bunx shadcn@latest add label
bunx shadcn@latest add textarea
bunx shadcn@latest add select
bunx shadcn@latest add switch
bunx shadcn@latest add badge
bunx shadcn@latest add dialog
bunx shadcn@latest add dropdown-menu
bunx shadcn@latest add tabs
bunx shadcn@latest add table
bunx shadcn@latest add skeleton
bunx shadcn@latest add separator
bunx shadcn@latest add tooltip
bunx shadcn@latest add chart
bunx shadcn@latest add sidebar
bunx shadcn@latest add sonner
bunx shadcn@latest add avatar
bunx shadcn@latest add popover
```

---

## 12. Implementation Order

### Phase 1: Shell & Routing (Day 1)

1. `bun add react-router-dom react-router date-fns recharts socket.io-client`
2. Set up `createBrowserRouter` in `App.tsx`
3. Build `DashboardLayout` with sidebar + topbar
4. Install shadcn components: `card`, `sidebar`, `separator`, `avatar`, `badge`, `dropdown-menu`, `skeleton`, `tooltip`
5. Create placeholder pages for all routes
6. Add PulseBoard custom tokens to `index.css` (colors, shadows, animations)

### Phase 2: Poll CRUD (Day 1-2)

7. Build TypeScript types (`types/index.ts`) mirroring Prisma models
8. Build API service layer (`services/api.ts`, `services/poll-api.ts`)
9. Build Zustand poll store
10. Install shadcn: `input`, `label`, `textarea`, `select`, `switch`, `dialog`, `sonner`
11. Implement **Dashboard** page (poll list + stats)
12. Implement **Create Poll** page
13. Implement **Edit Poll** page (questions management)
14. Implement **Poll Detail** page

### Phase 3: Analytics (Day 2-3)

15. Install shadcn: `chart`, `tabs`, `table`
16. Build analytics API service
17. Build analytics Zustand store
18. Implement **stat-card** with count-up animation
19. Implement **response-trend-chart** (area chart)
20. Implement **question-breakdown** (horizontal bar)
21. Implement **device/browser/OS pie charts** (donut charts)
22. Implement **source-bar-chart** (UTM breakdown)
23. Implement **rating-distribution** + **feedback-list**
24. Implement **response-heatmap** (custom grid)
25. Assemble **Poll Analytics** page

### Phase 4: Real-Time (Day 3)

26. Set up Socket.IO client singleton
27. Build `useSocket` hook
28. Build Socket Zustand store
29. Implement **Poll Live** page with live-updating charts
30. Add live response feed component
31. Add "new responses" banner to analytics page

### Phase 5: Responses & Polish (Day 3-4)

32. Implement **Poll Responses** page (table + expandable rows)
33. Implement **Share Modal** with UTM link generation
34. Add scroll animations (`useFadeInOnScroll` hook)
35. Add loading skeletons for all pages
36. Add empty states for no-data scenarios
37. Responsive breakpoints testing
38. Dark mode polish for all charts and components

---

## Backend Endpoints Summary (Required for Frontend)

### Must-have before frontend can function:

```
GET    /api/polls                              → List user's polls (NEW)
GET    /api/poll/:pollId                       → Poll detail with questions + options (existing, needs include)
POST   /api/poll                               → Create poll (existing)
POST   /api/poll/:pollId/questions/add          → Add question (existing)
POST   /api/poll/:pollId/questions/update       → Update question (existing)
PATCH  /api/poll/:pollId/status                → Update status (existing)
GET    /api/poll/:pollId/analytics             → Single endpoint — all analytics data (NEW)
```

### Nice-to-have:

```
GET    /api/poll/:pollId/responses             → Paginated submissions with answers + metadata
DELETE /api/poll/:pollId                       → Delete poll
DELETE /api/poll/:pollId/questions/:questionId → Delete question
```
