# Frontend

React + TypeScript frontend for a personal budget app. It focuses on a polished, portfolio-quality user experience for managing accounts, budgets, transactions, categories, sections, and monthly summaries.

Detailed implementation notes live in the docs folder:

- [Frontend architecture](docs/frontend-architecture.md)
- [Frontend conventions](docs/frontend-conventions.md)
- [Routing and navigation](docs/frontend-routing.md)
- [State management](docs/frontend-state-management.md)
- [API integration](docs/frontend-api.md)
- [Testing](docs/testing.md)
- [Roadmap](docs/roadmap.md)

## Overview

This app helps users manage:

- accounts
- categories and sections
- transactions
- monthly summaries
- budgets
- month-based navigation

## Releases

This repository uses Changesets, Conventional Commits, and GitHub Actions to manage releases.

See [Releasing](docs/RELEASING.md) for the full workflow.

Authentication is handled with Supabase Auth. Once signed in, the frontend uses the Supabase session to protect app routes and attach access tokens to backend API requests.

## Features

### Authentication

- Supabase Auth integration for sign in, sign up, forgot password, and reset password flows
- Protected app routes that redirect unauthenticated users to `/login`
- Supabase access token attached to backend API requests through the shared API client

### Dashboard

- Monthly summary view
- Income and expense totals
- Recent transactions
- Account breakdown
- Category breakdown

### Transactions

- Create, edit, and archive transactions
- Income, expense, transfer, and adjustment transaction types
- Month filtering through the global selected month
- Default transaction date based on the selected month
- Last transaction date per month stored in `localStorage` for small UX improvements

### Budgets

- Monthly budgets by category
- Planned amount
- Spent amount
- Remaining amount
- Progress tracking
- Over-budget state

### Accounts

- Account list
- Account creation and editing
- Starting balance
- Current balance
- Goal, icon, and color support

### Categories and Sections

- Section management
- Category management
- Section colors
- Category icons

### Navigation

- Global selected month stored in the URL
- Bottom navigation for core app areas
- Contextual floating `+` action
- Global month navigation shown on Dashboard, Transactions, and Budgets

## Tech Stack

- React
- TypeScript
- Vite
- React Router
- TanStack Query
- React Hook Form
- Zod
- shadcn/ui
- Tailwind CSS
- Supabase Auth
- Storybook
- Vitest
- Playwright
- ESLint
- Prettier

## Project Structure

```
e2e/                        # Playwright end-to-end specs
src/
  app/
    layouts/                # AppLayout and AuthLayout
    pages/                  # App-level pages such as NotFoundPage and ToolsPage
    providers/              # AppProviders, AuthSyncProvider
    router/                 # Lazy-loaded route tree and protected route wiring
  components/
    feedback/               # ErrorBoundary, LoadingSpinner
    form/                   # Reusable form primitives
    layout/                 # App chrome, theme, page headers, contextual action button
    ui/                     # shadcn-style primitives
  features/
    accounts/               # Account CRUD feature
    auth/                   # Authentication feature
    budgets/                # Monthly budget feature
    categories/             # Sections and categories feature
    dashboard/              # Monthly summary feature
    transactions/           # Transaction feature
  shared/
    month/                  # Global month navigation and helpers
    primary-action/         # Contextual floating action button state
  lib/
    api-client.ts           # Shared API client
    format-currency.ts      # Currency formatting helper
    query/                  # Shared QueryClient instance
    supabase/               # Supabase client singleton
    utils.ts                # cn() helper
  stories/                  # Storybook stories
  styles/globals.css        # Tailwind base and theme tokens
  test/                     # Vitest setup, mocks, and render helpers
```

## Feature Folder Convention

Features follow the same vertical-slice structure:

```
src/features/budgets/
  api/
    budgets.api.ts
  components/
    BudgetCard.tsx
    BudgetDialog.tsx
  hooks/
    use-budgets.ts
    use-create-budget.ts
  pages/
    BudgetsPage.tsx
  schemas/
    budget.schema.ts
  types/
    budget.types.ts
  index.ts
```

- API functions live in `api/` and call the shared `apiClient`
- TanStack Query hooks live in `hooks/`
- Zod schemas live in `schemas/`
- Types live in `types/`
- Feature UI components live in `components/`
- Route pages live in `pages/`

See [Frontend architecture](docs/frontend-architecture.md) and [Frontend conventions](docs/frontend-conventions.md) for the full set of folder and naming rules used in the codebase.

## Naming Conventions

- React component files use PascalCase filenames: `BudgetCard.tsx`, `MonthNavigator.tsx`
- Hooks use kebab-case filenames and camelCase exports: `use-selected-month.ts` exports `useSelectedMonth`
- Types use `.types.ts`: `budget.types.ts`
- Schemas use `.schema.ts`: `budget.schema.ts`
- API modules use `.api.ts`: `budgets.api.ts`
- Contexts use `.context.ts`: `primary-action.context.ts`
- Provider components use `ProviderName.tsx`: `PrimaryActionProvider.tsx`
- Files with JSX use `.tsx`
- Files without JSX use `.ts`

## React Fast Refresh Convention

React Fast Refresh works best when files exporting React components only export components.

Therefore:

- Do not export raw React contexts from the same file as a React component
- Put raw contexts in `.context.ts` files
- Put provider components in separate `.tsx` files
- Put hooks in `.ts` files unless they contain JSX

Example:

```
src/shared/primary-action/
  context/
    primary-action.context.ts
    PrimaryActionProvider.tsx
  hooks/
    use-primary-action.ts
  types/
    primary-action.types.ts
```

This avoids the Fast Refresh warning:

`Fast refresh only works when a file only exports components.`

## API Client

The frontend uses a shared `apiClient` in `src/lib/api-client.ts`.

- The client reads the backend base URL from `VITE_API_URL`
- In local development, set `VITE_API_URL=/api/v1` and let Vite proxy that path to the backend to avoid CORS
- It attaches the Supabase access token as `Authorization: Bearer <token>`
- Feature API modules should use the shared `apiClient`
- Components should not call `fetch` directly
- Supabase should not be called directly for app domain data

See [Frontend API integration](docs/frontend-api.md) for the full request, auth, and error-handling contract.

Expected response shape:

Success:

```json
{
    "data": {}
}
```

Error:

```json
{
    "error": {
        "code": "string",
        "message": "string",
        "issues": []
    }
}
```

## Authentication

- Users sign in with Supabase Auth
- Supabase returns a session with an access token
- The frontend reads the token from the current session
- Protected routes require an authenticated user
- Backend API requests include the access token
- App data is loaded from backend endpoints, not directly from Supabase tables

## TanStack Query

- API calls live in feature API files
- Query hooks wrap API calls
- Query keys should be stable
- Query keys should include filters such as `month`
- Mutations should invalidate affected queries
- Prefer invalidation over manual refetch when possible

Examples:

- Creating a transaction should invalidate transactions and any dependent dashboard or budget data
- Creating a budget should invalidate budgets and any dependent dashboard/monthly summary data

See [Frontend state management](docs/frontend-state-management.md) for query ownership and invalidation rules.

## Forms

- Forms use React Hook Form
- Validation uses Zod
- Schemas live in `.schema.ts`
- Form components should display validation errors
- API errors should be shown in a user-friendly way
- Avoid duplicating validation logic inside components

See [Frontend conventions](docs/frontend-conventions.md) for the form, component, and accessibility rules used across the app.

## Month Navigation

- Selected month comes from the URL query param `?month=YYYY-MM`
- If missing, default to the current month
- If invalid, fall back to the current month
- Do not store the selected month in `localStorage`
- Navigation links should preserve the selected month
- Dashboard, Transactions, and Budgets use the same selected month

Examples:

- `/dashboard?month=2026-06`
- `/transactions?month=2026-06`
- `/budgets?month=2026-06`

Accounts can preserve the month in the URL, but it does not need to filter by month.

## Transaction Date UX

- Creating a transaction uses the selected month to choose the default date
- If the selected month is the current month, default to today
- If the selected month is not the current month, default to the first day of that month
- The user can still change the date manually
- The last transaction date per month may be stored in `localStorage` for faster batch entry

`localStorage` is allowed for small UX helpers, but not as the source of truth for app data.

## Contextual Primary Action

- Dashboard: `+` opens create transaction
- Transactions: `+` opens create transaction
- Budgets: `+` opens create budget with the selected month
- Accounts: `+` opens create account
- Tools: hide the action by default unless there is a clear primary action

Architecture:

- `PrimaryActionProvider` stores the current page action
- Pages register their primary action through `usePrimaryAction`
- The layout renders the floating action button
- Actions are cleared on unmount to avoid stale actions

## System Rules

These rules are invariants. Breaking one requires a deliberate decision and a clear rationale, not a shortcut.

### Auth

1. All backend requests must go through `apiClient`. Never call `fetch` directly and never use the Supabase client for domain data.
2. The Supabase access token is attached automatically by `apiClient`. Do not attach it manually in feature code.
3. Never read or decode the Supabase session outside of `authService` or `apiClient`.
4. Protected routes always redirect unauthenticated users to `/login`. Do not add route-level auth bypasses.

### Month

5. The selected month is always read from the URL query param `?month=YYYY-MM`. It is never stored in component state, context, `localStorage`, or any other mechanism.
6. A missing or invalid `month` param falls back silently to the current calendar month. Do not throw an error or surface it to the user.
7. Navigation links between Dashboard, Transactions, and Budgets must preserve the `month` param.
8. Query keys for data that varies by month must include the `month` value. A query without `month` in its key will not refetch when the month changes.

### Query Invalidation

9. After every mutation, invalidate all affected query keys before the hook resolves. Do not leave stale data in the cache.
10. Never manually trigger a refetch after a mutation. Use `invalidateQueries` so all dependents re-fetch automatically.
11. Never hardcode query key strings inline. Always reference the `*QueryKeys` constants exported from the relevant hook file.
12. Cross-feature invalidation is intentional. `useCreateTransaction` invalidates both transactions and accounts. `useCreateBudget` invalidates both budgets and the dashboard.

### Feature Boundaries

13. Features must not import from another feature's internal files. Only import from a feature's public `index.ts` barrel.
14. Cross-feature logic belongs in `src/shared`, not inside any feature folder.
15. A feature's public API is its `index.ts`. Anything not exported there is an implementation detail and may change without notice.

## Styling and UI

- Use shadcn/ui components when appropriate
- Use Tailwind utility classes
- Follow the existing theme tokens
- Keep UI accessible
- Do not rely only on color to communicate status
- Use clear labels and accessible dialogs

## Accessibility

- Buttons must have accessible names
- Icon-only buttons must use `aria-label`
- Active navigation states should be clear
- Dialogs must have titles
- Forms must have labels and errors
- Over-budget states should not rely only on color
- Keyboard focus should remain visible

## Environment Variables

| Variable                 | Purpose                                 | Required |
| ------------------------ | --------------------------------------- | -------- |
| `VITE_SUPABASE_URL`      | Supabase project REST/Auth URL          | Yes      |
| `VITE_SUPABASE_ANON_KEY` | Supabase public anon key                | Yes      |
| `VITE_APP_URL`           | App origin for auth email redirect URLs | Yes      |
| `VITE_API_URL`           | Backend API base URL                    | Yes      |

## Available Scripts

```bash
npm run dev
npm run build
npm run preview
npm run typecheck
npm run lint
npm run lint:fix
npm run format
npm run format:check
npm run test
npm run test:watch
npm run test:coverage
npm run test:e2e
npm run storybook
npm run build-storybook
```

## Running Locally

```bash
npm ci
cp .env.example .env.local
npm run dev
```

## Testing

- Vitest for unit and component tests
- Testing Library for component interaction tests
- Playwright for end-to-end tests
- Storybook for UI documentation and isolated component work

## Roadmap

Planned frontend improvements only:

- Reports and charts
- Better dashboard budget overview
- Recurring transaction UI
- CSV import UI
- Demo mode
- Deployment polish
- Improved responsive desktop layout
- More Storybook coverage
