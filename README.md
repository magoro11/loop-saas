# LOOP — Customer Feedback Intelligence (scaffold)

This repo contains the Phase 1 scaffold for LOOP.

Local dev:

```bash
npm install
npm run dev
```

Deploy to Vercel:

1. Push this repository to Git (GitHub/GitLab).
2. Import the project in Vercel and set environment variables from `.env.example`.
3. Use the default Next.js build settings (`npm run build`).

Database & Prisma (Supabase)

1. Create a Supabase project and copy the Postgres connection string.
2. Set `DATABASE_URL` in `.env.local` to the Supabase Postgres URL.
3. Install dependencies and initialize Prisma:

```bash
npm install
npx prisma generate
npx prisma migrate dev --name init
```

This will create the database schema defined in `prisma/schema.prisma` and generate the Prisma client.

Notes:
- The schema includes `workspaceId` on tenant-owned tables to enforce per-workspace scoping.
- The `Embedding.vector` field is currently stored as `Float[]`; later phases will migrate to `pgvector` for fast similarity search.
