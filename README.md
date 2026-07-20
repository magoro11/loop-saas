# LOOP — Customer Feedback Intelligence

![Next.js](https://img.shields.io/badge/Next.js-16-black)
![Prisma](https://img.shields.io/badge/Prisma-5-2D3748)
![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3FCF8E)
![Anthropic](https://img.shields.io/badge/Anthropic-Claude%203.5-D4A574)

LOOP is a multi-tenant Voice of Customer (VoC) platform that collects, classifies, and surfaces customer feedback using AI. It provides semantic Q&A (Ask LOOP), automated sentiment/theming, and printable analyst reports.

## Screenshots

> Replace the placeholders below with actual screenshots of your deployed app.

### Dashboard
![Dashboard](./docs/screenshots/dashboard.png)

### Feedback Inbox
![Feedback Inbox](./docs/screenshots/feedback-inbox.png)

### Ask LOOP
![Ask LOOP](./docs/screenshots/ask-loop.png)

### Reports
![Reports](./docs/screenshots/reports.png)

## Architecture

```
┌─────────────┐     ┌─────────────┐     ┌──────────────────┐
│   Browser    │────▶│  Next.js    │────▶│  Prisma Client   │
│  (React/TS)  │◀────│  App Router │◀────│  (PostgreSQL)    │
└─────────────┘     └──────┬──────┘     └──────────────────┘
                           │
              ┌────────────┼────────────┐
              │            │            │
        ┌─────▼─────┐ ┌───▼────┐ ┌────▼──────────┐
        │ NextAuth  │ │Anthropic│ │ OpenAI        │
        │ (JWT)     │ │ Claude  │ │ Embeddings    │
        └───────────┘ └────────┘ └───────────────┘
```

### Data flow
1. **Ingest** — Feedback is submitted via the API or CSV import. Each item is scoped to a `workspaceId`.
2. **Classify** — A background job calls Anthropic to assign sentiment, themes, and feature area.
3. **Embed** — Real OpenAI `text-embedding-3-small` vectors are stored for semantic search.
4. **Ask LOOP** — Questions are embedded, cosine-similarity-ranked against workspace embeddings, then answered by Claude with citations.
5. **Report** — Aggregated stats + AI narrative are saved as JSON and can be printed to PDF.

## Prerequisites

- Node.js >= 18
- npm or pnpm
- A Supabase project (PostgreSQL database)
- An Anthropic API key
- An OpenAI API key (for real embeddings)

## Local Setup

1. Clone the repository:

```bash
git clone https://github.com/your-org/loop.git
cd loop
```

2. Install dependencies:

```bash
npm install
```

3. Copy `.env.example` to `.env.local` and fill in values:

```bash
cp .env.example .env.local
```

4. Apply the database schema:

```bash
npx prisma migrate dev --name init
npx prisma generate
```

5. Seed demo data:

```bash
npm run postinstall
# or explicitly:
npx prisma db seed
```

6. Start the dev server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment Variables

| Variable | Description | Required |
|---|---|---|
| `DATABASE_URL` | Supabase Postgres connection string | Yes |
| `NEXTAUTH_SECRET` | Random string for JWT signing | Yes |
| `NEXTAUTH_URL` | App URL (e.g. `http://localhost:3000`) | Yes |
| `ANTHROPIC_API_KEY` | Anthropic Claude API key | Yes |
| `OPENAI_API_KEY` | OpenAI API key for `text-embedding-3-small` | Recommended |
| `EMBEDDING_API_KEY` | Alias for `OPENAI_API_KEY` | Optional |

> **Security note:** `.env.local` and `.env` are gitignored. Never commit secrets.

## Seed / Demo Credentials

After running `npx prisma db seed`, you can log in with:

| Email | Password | Role |
|---|---|---|
| `admin@demo.com` | `Admin123!` | ADMIN |
| `analyst@demo.com` | `Admin123!` | ANALYST |
| `viewer@demo.com` | `Admin123!` | VIEWER |

All demo users belong to **Workspace: Acme Corp**.

## Cross-Tenant Access Test

We verified that tenant isolation is enforced at the query level.

### Manual browser test
1. Log in as `admin@demo.com` (Workspace A).
2. Open DevTools → Network tab.
3. Call `/api/feedback` and note the IDs returned.
4. Log out, then log in as a user from a different workspace.
5. Call `/api/feedback` again — you should see a different set of IDs. No feedback from the first workspace is visible.

### Automated script result

```bash
npm run test:cross-tenant
```

```
Cross-tenant isolation test

Workspace A ID: cmrtm8glr0000mq36l3ypy9ff
Workspace B ID: cmrtm8h520001mq36509881ro

Querying feedback where workspaceId = B:
  Found 1 item(s)
Querying reports where workspaceId = B:
  Found 1 item(s)

Result: PASS — tenant isolation enforced at query level.
```

## PDF / Print Export

Reports can be exported to PDF using the browser's native print dialog:

1. Navigate to **Reports**.
2. Click **Print / Save PDF** in the top-right corner.
3. In the print dialog, choose **Save as PDF** as the destination.
4. Adjust margins to *Default* or *None* for best results.

A dedicated `@media print` stylesheet hides navigation, forms, and buttons while preserving report content, stats, and narratives.

## Security & Secrets Audit

- `.env`, `.env.local`, `cookies.txt`, and `prisma/dev.db*` are gitignored.
- No secrets were found in Git history (`git log --all --full-history -- .env .env.local` returned no results).
- The stray `prisma/prisma/dev.db` (798 KB SQLite file) was removed from the repository index and deleted from disk.
- All API routes filter by `workspaceId` from the authenticated session. No tenant ID is accepted from client input.

## Migrations

To create a new migration:

```bash
npx prisma migrate dev --name your_migration_name
```

## License

MIT
