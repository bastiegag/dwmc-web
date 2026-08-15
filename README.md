# Dude, Where's My Cash?

`dwmc-web` is the React frontend for Dude, Where's My Cash?, a personal budgeting application for reviewing accounts, transactions, categories, sections, budgets, and monthly summaries.

## Overview

The frontend owns the authenticated user experience, navigation, forms, presentation, accessibility, Supabase Auth integration, and client-side server-state coordination. Financial records and authorization remain backend responsibilities in the sibling `dwmc-api` repository.

## Current Features

- Supabase sign-in, sign-up, password recovery, and password reset flows.
- Protected dashboard, transactions, budgets, accounts, categories, tools, and style-guide routes.
- Monthly dashboard summary with totals, account/category breakdowns, and recent transactions.
- Transaction creation, editing, filtering, and archiving for income, expense, transfer, and adjustment records.
- Account creation, editing, archiving, starting balances, computed balances, goals, colors, and icons.
- Section and category management.
- Monthly category budgets with spent, remaining, progress, and over-budget values.
- URL-based month navigation, desktop sidebar navigation, mobile bottom navigation, and contextual primary actions.

Profile editing and device-local theme Settings are available from the Tools area. Reports, recurring transactions, imports, and exports are not implemented.

## Tech Stack

The versions are maintained in [`package.json`](package.json). The application uses React, TypeScript, Vite, React Router, TanStack Query, React Hook Form, Zod, shadcn-style components, Radix UI, Tailwind CSS, Supabase Auth, Storybook, Vitest, Testing Library, MSW, Playwright, ESLint, Prettier, Husky, lint-staged, and Changesets.

## Getting Started

Prerequisites:

- Node.js compatible with the installed toolchain.
- A Supabase project for authentication.
- The sibling `dwmc-api` repository running locally for domain data.

```bash
npm install
cp .env.example .env.local
npm run dev
```

Vite starts on port `5182` by default. The local Vite proxy forwards `/api/v1` to `http://localhost:3000`; start the backend separately and configure its environment as described in the backend repository.

## Environment Variables

Set these in `.env.local`:

| Variable                 | Purpose                                               |
| ------------------------ | ----------------------------------------------------- |
| `VITE_APP_URL`           | Frontend origin used for Supabase email redirects.    |
| `VITE_SUPABASE_URL`      | Supabase project URL.                                 |
| `VITE_SUPABASE_ANON_KEY` | Browser-safe Supabase anonymous key.                  |
| `VITE_API_URL`           | API client base URL, `/api/v1` for local development. |

Do not put service-role keys or other backend secrets in frontend environment files.

For hosted deployments, Vercel owns these variables separately for its Development,
Preview, and Production environments. Configure Preview with the staging API and
Supabase project, and Production with the production API and Supabase project.
Deployment details and the required GitHub secrets are documented in
[`docs/RELEASING.md`](docs/RELEASING.md).

## Scripts

| Command             | Purpose                                                             |
| ------------------- | ------------------------------------------------------------------- |
| `npm run dev`       | Start Vite.                                                         |
| `npm run build`     | Type-check with project references and build the production bundle. |
| `npm run preview`   | Preview the production build.                                       |
| `npm run lint`      | Run ESLint with zero warnings.                                      |
| `npm run typecheck` | Run TypeScript without emitting files.                              |
| `npm run test`      | Run Vitest once.                                                    |
| `npm run test:e2e`  | Run Playwright end-to-end tests.                                    |
| `npm run storybook` | Start Storybook on port 6006.                                       |
| `npm run validate`  | Run formatting, lint, typecheck, unit tests, and build.             |

Additional formatting, coverage, UI, Changesets, and release commands are listed in `package.json` and the linked documentation.

## Documentation

- [Frontend architecture](docs/architecture.md)
- [API integration](docs/api.md)
- [Testing](docs/testing.md)
- [Roadmap](docs/roadmap.md)
- [Releasing](docs/releasing.md)

The backend implementation and API source of truth live in the sibling `dwmc-api` repository.
