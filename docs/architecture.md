# Frontend Architecture

## Responsibility

`dwmc-web` owns the browser experience: routing, layouts, forms, presentation, accessibility, Supabase Auth integration, and coordination of backend server state. It does not authorize users or replace backend financial calculations.

## Application Flow

```text
page
→ feature hook
→ feature API module
→ src/lib/api-client.ts
→ dwmc-api
```

Authentication follows this flow:

```text
Supabase Auth session
→ access token
→ apiClient Authorization header
→ dwmc-api auth middleware
```

The backend remains authoritative for ownership, validation, persistence, balances, budget spending, and summaries. See the backend repository's [API](../../dwmc-api/docs/api.md) and [authentication](../../dwmc-api/docs/domains/auth.md) documentation for server implementation details.

## Source Layout

| Path              | Responsibility                                                                                                |
| ----------------- | ------------------------------------------------------------------------------------------------------------- |
| `src/app/`        | Bootstrap, router, layouts, providers, and app-level pages.                                                   |
| `src/components/` | Reusable UI, layout, feedback, form, and shadcn-style primitives.                                             |
| `src/features/`   | Domain vertical slices such as auth, dashboard, accounts, transactions, budgets, categories, and style guide. |
| `src/lib/`        | API client, Supabase client, QueryClient, formatting, and low-level helpers.                                  |
| `src/shared/`     | Cross-feature systems such as month navigation and contextual primary actions.                                |
| `src/test/`       | Vitest setup, MSW handlers, fixtures, render helpers, and test utilities.                                     |
| `src/stories/`    | Storybook stories.                                                                                            |
| `src/styles/`     | Global styles and theme tokens.                                                                               |

Feature folders commonly contain `api/`, `components/`, `hooks/`, `pages/`, `schemas/`, `types/`, and a public `index.ts`. The exact folders vary by feature; follow the existing slice rather than creating empty layers.

## Providers and Router

`main.tsx` validates required frontend environment configuration, then mounts the error boundary, `AppProviders`, and `AppRouter`. Providers currently include TanStack Query, the theme provider, Supabase auth-session synchronization, and the toast renderer. Routes are lazy-loaded where configured and render through auth or application layouts.

## State Ownership

- State belongs to the smallest owner that can provide the required lifetime and sharing.

| State                                                 | Owner                                                                             |
| ----------------------------------------------------- | --------------------------------------------------------------------------------- |
| Supabase session                                      | Supabase Auth, synchronized into TanStack Query.                                  |
| Accounts, categories, sections, transactions, budgets | Backend plus TanStack Query.                                                      |
| Monthly summary                                       | Backend plus TanStack Query.                                                      |
| Selected month                                        | URL query parameter `month=YYYY-MM`.                                              |
| Form inputs and validation                            | React Hook Form plus Zod.                                                         |
| Dialog visibility and temporary UI state              | Local component state.                                                            |
| Contextual primary action                             | Primary-action React Context because the layout renders it and pages register it. |
| Theme preference                                      | Existing ThemeProvider and its storage key.                                       |
| Last transaction date per month                       | `localStorage` UX helper.                                                         |

TanStack Query hooks wrap feature API functions. Query keys include filters that change the response, including `month` and the dashboard summary's `recentLimit`. Mutations use query invalidation rather than manual `refetch()` when the affected key is known.

The current observed invalidation rules are:

| Mutation                            | Invalidated keys                     |
| ----------------------------------- | ------------------------------------ |
| Transaction create, update, archive | Transaction lists and account lists. |
| Budget create, update, archive      | Budget lists and dashboard lists.    |
| Account create, update, archive     | Account lists.                       |
| Category create, update, archive    | Category lists and section lists.    |
| Section create, update, archive     | Section lists.                       |
| Dashboard retry                     | Dashboard lists.                     |

This table describes current implementation, not a promise that every derived view is already invalidated. When changing a mutation, inspect the relevant hooks and backend effects across both repositories.

Do not put backend collections, selected month, or form state in React Context. Do not use `localStorage` for domain records or authorization. Small browser preferences and the transaction-date helper are the current exceptions.

See [API integration](api.md) for API transport and contract rules.

## Design Boundary

Pages orchestrate feature hooks and dialogs. Components should not call `fetch` or Supabase tables directly. Feature API modules call the shared client, while shared code remains genuinely cross-feature. When changing an API-dependent feature, inspect `../dwmc-api` when available before assuming the contract.
