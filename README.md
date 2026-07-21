# LOOP — AI Customer-Feedback Intelligence Platform

LOOP is a multi-tenant web application that turns scattered customer feedback — support tickets, app-store reviews, NPS surveys, sales notes, and social mentions — into ranked, evidence-backed insight. It automatically classifies and clusters incoming feedback, detects trending themes, answers plain-English questions grounded in real feedback data, and generates Voice-of-Customer reports.

Built for the Zidio Development Web Development Track internship.

**Live demo:** https://loop-saas-omega.vercel.app
**Repository:** https://github.com/magoro11/loop-saas

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Database & Seed Data](#database--seed-data)
- [Demo Credentials](#demo-credentials)
- [Project Structure](#project-structure)
- [Known Limitations](#known-limitations)

---

## Features

### Core
- **Multi-tenant workspaces** with three roles: Admin, Analyst, Viewer, enforced server-side.
- **Feedback ingestion** via single-entry form, CSV bulk upload, and a simulated channel source.
- **Feedback inbox** with full-text search, filters (channel, sentiment, theme, status, date range), and server-side pagination.
- **Status workflow**: NEW → REVIEWED → ACTIONED.
- **Analytics dashboard**: volume over time, sentiment breakdown, top themes, and channel distribution (Recharts).

### AI (powered by the Anthropic Claude API)
- **Auto-classification** — every feedback item is tagged with sentiment, sentiment score, theme(s), and a feature-area label on ingest.
- **Theme clustering & trends** — feedback is grouped into named themes, with a trends view that flags themes spiking versus the prior period.
- **Ask LOOP** — a natural-language Q&A assistant that retrieves the most relevant feedback before answering, and cites the feedback items it used.
- **Voice-of-Customer reports** — one-click, period-based reports combining pre-computed statistics with an AI-written narrative.

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js (App Router) + TypeScript |
| Styling | Tailwind CSS, Framer Motion |
| Database | PostgreSQL (Supabase) |
| ORM | Prisma |
| Auth | NextAuth (Auth.js) + Prisma adapter, bcrypt |
| AI | Anthropic Claude API (`claude-3-5-haiku-20241022`) |
| Charts | Recharts |
| Validation | Zod |
| Deployment | Vercel |

## Architecture

LOOP follows a three-tier architecture. The browser only ever calls the app's own API routes; those routes are the sole layer permitted to talk to PostgreSQL and to the Claude API, so credentials never reach the client.

```
Client (Next.js pages/components)
        │
        ▼
API routes (app/api/*)
  — session + role checks
  — Zod validation
  — workspace-scoped queries
        │
        ▼
Prisma ──► PostgreSQL
        │
        ▼
lib/ai.ts ──► Anthropic Claude API
```

Every tenant-owned table (`Feedback`, `Theme`, `Report`, etc.) carries a `workspaceId` foreign key, and every query in the API layer filters on the authenticated user's `workspaceId`, so one workspace can never read another's data.

## Getting Started

### Prerequisites
- Node.js 18+
- A PostgreSQL database (a free [Supabase](https://supabase.com) project works well)
- An [Anthropic API key](https://console.anthropic.com)

### Local setup

```bash
# 1. Clone and install
git clone https://github.com/magoro11/loop-saas.git
cd loop-saas
npm install

# 2. Configure environment variables
cp .env.example .env.local
# then fill in DATABASE_URL, NEXTAUTH_SECRET, ANTHROPIC_API_KEY (see below)

# 3. Set up the database
npx prisma generate
npx prisma migrate dev --name init
npx prisma db seed

# 4. Run locally
npm run dev
# App runs at http://localhost:3000
```

### Deploying to Vercel
1. Push the repository to GitHub.
2. Import the project into Vercel.
3. Add the environment variables below in the Vercel project settings.
4. Deploy using the default Next.js build command (`npm run build`).

## Environment Variables

Copy `.env.example` to `.env.local` and set:

| Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string (Supabase: Settings → Database). Use the pooled port (6543) for serverless/Vercel. |
| `NEXTAUTH_SECRET` | A random secret used to sign session tokens. Generate with `openssl rand -base64 32`. |
| `NEXTAUTH_URL` | The app's base URL (`http://localhost:3000` locally, your Vercel URL in production). |
| `ANTHROPIC_API_KEY` | Your Anthropic API key, used server-side only for all AI features. |
| `EMBEDDING_API_KEY` | Optional — reserved for a dedicated embeddings provider (see [Known Limitations](#known-limitations)). |

**Never commit `.env` or `.env.local` to version control.**

## Database & Seed Data

The schema (`prisma/schema.prisma`) defines `Workspace`, `User`, `Feedback`, `Theme`, `FeedbackTheme`, `Embedding`, and `Report` models, plus the `Account`/`Session`/`VerificationToken` tables required by NextAuth.

Running `npx prisma db seed` populates:
- 1 demo workspace
- 3 users, one per role (see [Demo Credentials](#demo-credentials))
- 130 realistic feedback items across 6 channels (support, app store, NPS, sales calls, social, email)
- 10 themes with feedback already clustered and classified

## Demo Credentials

The live deployment and local seed both use the same demo workspace:

| Role | Email | Password |
|---|---|---|
| Admin | `admin@demo.com` | `Admin123!` |
| Analyst | `analyst@demo.com` | `Admin123!` |
| Viewer | `viewer@demo.com` | `Admin123!` |

> These are demo-only credentials for a seeded, non-production workspace. Do not reuse this password anywhere else.

## Project Structure

```
loop-saas/
  app/
    (auth)/login, signup
    dashboard/            # inbox, analytics, themes/trends, ask-loop, reports
    api/
      auth/               # NextAuth + signup
      feedback/           # CRUD, CSV import, seed, status, classify
      themes/             # theme list + trends
      ask-loop/           # grounded Q&A
      reports/            # Voice-of-Customer report generation
  lib/
    ai.ts                 # all Claude API calls (classify, embed, answer, report)
    auth.ts / nextauth.ts # session + role guards
    tenant.ts             # workspace-scoped query helpers
    prisma.ts             # Prisma client singleton
  prisma/
    schema.prisma
    seed.ts
  middleware.ts           # redirects unauthenticated requests
```

## Known Limitations

Documented transparently as scope for future iteration:

- **Embeddings**: `generateEmbedding()` currently asks the Claude chat model to return a 384-number JSON array (with a deterministic fallback if that fails), rather than using a dedicated embeddings model or `pgvector`. This is sufficient for demo purposes but is less semantically reliable than a purpose-built embeddings endpoint.
- **Report export**: Voice-of-Customer reports are viewable as an in-app page but are not yet exportable to PDF.
- **Model choice**: AI features currently use `claude-3-5-haiku-20241022` for cost/latency efficiency; a larger model can be swapped in via `lib/ai.ts` where higher accuracy is preferred over speed.

---

Built by [Brighton Magoro](https://github.com/magoro11) for the Zidio Development internship program.
