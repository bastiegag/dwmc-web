# Dude, Where's My Cash? Web

Dude, Where's My Cash? is a local-first personal budgeting app for understanding monthly cash flow, organizing accounts and categories, tracking transactions, and working with budgets and summaries. This repository contains the user-facing web application.

> **Visual preview:** `SCREENSHOTS MISSING` - no checked-in product screenshots are currently available. Capture the authenticated dashboard, accounts, transactions, and budget views at desktop and mobile widths, redact personal data, and add the selected images under `docs/assets/` before linking them here.

The companion backend is [`dwmc-api`](https://github.com/bastiegag/dwmc-api). The frontend is the primary portfolio entry point; the API repository documents persistence, authorization, and the HTTP contract.

## Features

- Review monthly income, spending, and account balances.
- Create and organize accounts, sections, and categories.
- Record, edit, archive, and filter transactions.
- Plan budgets and compare activity with monthly summaries.
- Sign up and sign in with Supabase Auth while keeping application data in the local API.

## Architecture

The frontend runs on the local Vite development server and communicates with the local `dwmc-api` service. Supabase provides browser-side Auth only; Prisma and domain data access belong to `dwmc-api` and local PostgreSQL.

```text
Browser -> local dwmc-web -> local dwmc-api -> Prisma -> local PostgreSQL
					   \-> Supabase Auth -> access token -> dwmc-api
```

The frontend sends Supabase access tokens to `dwmc-api` as `Authorization: Bearer <token>`. It never connects directly to PostgreSQL or receives backend secrets.

## Engineering Highlights

- Feature-based React structure with route-driven navigation and URL-backed month state.
- TanStack Query for server state, with a shared API client that owns authentication headers and response handling.
- React Hook Form and Zod for typed form validation at the UI boundary.
- shadcn/ui, Radix primitives, and Tailwind CSS for a consistent responsive interface.
- Accessibility-focused component tests, unit tests, Playwright end-to-end coverage, and Storybook stories.
- CI validates formatting, linting, types, tests, and production builds; active CodeQL and Dependency Review workflows run for this repository.

## Stack

React, TypeScript, Vite, React Router, TanStack Query, React Hook Form, Zod, shadcn/ui, Tailwind CSS, Supabase Auth, Vitest, Testing Library, Playwright, Storybook, ESLint, and Prettier.

## Setup

Use Node.js 24.x for local development and validation. Start `dwmc-api` first
and complete its local PostgreSQL and Supabase Auth setup.

```bash
npm ci
cp .env.example .env.local
npm run dev
```

Set these values in `.env.local`:

```dotenv
VITE_APP_URL=http://localhost:5182
VITE_API_URL=/api/v1
VITE_SUPABASE_URL=https://<project-ref>.supabase.co
VITE_SUPABASE_ANON_KEY=<publishable-anon-key>
```

`VITE_API_URL=/api/v1` uses the Vite proxy to reach `dwmc-api` at
`http://localhost:3000`. Use the same Supabase project and browser-safe anon
key configured for the API. All `VITE_*` values are bundled into browser code
and are public; never put database credentials, service-role keys, or other
backend secrets in them.

Open `http://localhost:5182`, sign up with Email/password, and then create a
section, category, account, and transaction. Supabase handles authentication;
the resulting application data is persisted by the local API in local
PostgreSQL.

## Commands

```bash
npm run dev
npm run build
npm run preview
npm run validate
npm run test
npm run test:e2e
npm run storybook
npm run build-storybook
```

`npm run validate` runs the formatting check, lint, typecheck, tests, and
production build. `npm run test:e2e` requires the local API and the configured
Supabase Auth test environment. Storybook is available for isolated component
development.

## Documentation

- [Frontend architecture](docs/frontend-architecture.md)
- [Engineering standards](docs/engineering-standards.md)
- [API integration](docs/frontend-api.md)
- [Authentication and routing](docs/frontend-routing.md)
- [Testing](docs/testing.md)
- [Shared developer playbook](docs/dev-playbook.md)
- [Development playbook](docs/development-playbook.md)
- [Development and releases](docs/RELEASING.md)
- [Engineering audit playbook](docs/engineering-audit-playbook.md)
- [Roadmap](docs/roadmap.md)
- [Backend repository](https://github.com/bastiegag/dwmc-api)

Domain behavior is documented alongside the relevant feature implementation. There is currently no ADR directory; meaningful architectural decisions should be added there when one is introduced.
