# Iloilo Tourist Guide

Responsive React + Vite + TypeScript foundation for a locally curated Iloilo tourism guide.

## Milestone 1

- Responsive public shell with desktop navigation and mobile bottom navigation
- Functional home page using clearly labeled demonstration content
- Placeholder surfaces for Explore, Discover, Phrasebook, Events, Account, and Assistant
- Role-aware admin workspace UI at `/admin`
- Supabase client configuration and initial migration with core tables, RLS, and media buckets

## Run locally

```bash
npm install
copy .env.example .env
npm run dev
```

Supabase is optional for the foundation UI. Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` to `.env` before connecting a project. Never put a service-role key in the browser bundle.

Apply the SQL migration with the Supabase CLI or SQL editor:

`supabase/migrations/20261115000000_initial_schema.sql`

## Verification

```bash
npm run lint
npm run build
```

The sample images, dishes, and events are demonstration placeholders. They must be replaced with locally reviewed records and properly licensed media before launch.