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

| Path              | Responsibility                                                                                                      |
| ----------------- | ------------------------------------------------------------------------------------------------------------------- |
| `src/app/`        | Bootstrap, router, layouts, providers, and app-level pages.                                                         |
| `src/components/` | Reusable UI, layout, feedback, form, and shadcn-style primitives.                                                   |
| `src/features/`   | Domain vertical slices such as auth, dashboard, accounts, transactions, budgets, categories, profile, and settings. |
| `src/lib/`        | API client, Supabase client, QueryClient, formatting, and low-level helpers.                                        |
| `src/shared/`     | Cross-feature systems such as month navigation and contextual primary actions.                                      |
| `src/test/`       | Vitest setup, MSW handlers, fixtures, render helpers, and test utilities.                                           |
| `src/stories/`    | Storybook stories.                                                                                                  |
| `src/styles/`     | Global styles and theme tokens.                                                                                     |

Feature folders commonly contain `api/`, `components/`, `hooks/`, `pages/`, `schemas/`, `types/`, and a public `index.ts`. The exact folders vary by feature; follow the existing slice rather than creating empty layers.

## Providers and Router

`main.tsx` validates required frontend environment configuration, then mounts the error boundary, `AppProviders`, and `AppRouter`. Providers currently include TanStack Query, the theme provider, Supabase auth-session synchronization, and the toast renderer. Routes are lazy-loaded where configured and render through auth or application layouts.

Anonymous-only routes (`/login`, `/signup`, and `/forgot-password`) redirect an
authenticated user to `/dashboard`. The recovery route (`/reset-password`) remains
available to an authenticated recovery session so Supabase password-reset callbacks
can complete. Supabase provider failures are converted by the auth service into
stable, safe user-facing messages before they reach forms.

## State Ownership

| State                                                 | Owner                                                                             |
| ----------------------------------------------------- | --------------------------------------------------------------------------------- |
| Supabase session                                      | Supabase Auth, synchronized into TanStack Query.                                  |
| Accounts, categories, sections, transactions, budgets | Backend plus TanStack Query.                                                      |
| Monthly summary                                       | Backend plus TanStack Query.                                                      |
| Selected month                                        | URL query parameter `month=YYYY-MM`.                                              |
| Form inputs and validation                            | React Hook Form plus Zod.                                                         |
| Dialog visibility and temporary UI state              | Local component state.                                                            |
| Contextual primary action                             | Primary-action React Context because the layout renders it and pages register it. |
| Theme preference                                      | Existing ThemeProvider and the namespaced `dwmc-theme` storage key.               |
| Last transaction date per month                       | `localStorage` UX helper.                                                         |

### Navigation Context

The selected month is URL state on month-aware application routes:

- `dashboard`, `transactions`, and `budgets` consume `?month=YYYY-MM`.
- A valid query value is used as-is; a missing or invalid value falls back to the current UTC month without rewriting the URL.
- Previous and next month controls replace the query value and preserve unrelated query parameters.
- Month changes use replacement history intentionally: moving between months does not add one Back/Forward entry per click. Browser history remains focused on route and document navigation.
- Application navigation links carry the selected month so a route change does not silently reset the month. The transaction-date helper may remember a valid date per month in `localStorage`, but it never overrides the URL month.

The layout renders the shared `MonthNavigator` on month-aware routes. Mobile global navigation exposes four primary destinations: Overview, Budgets, Accounts, and Tools. The Dashboard section also renders secondary navigation between Overview (`/dashboard`) and Transactions (`/transactions`). Transactions remains an independent feature and route even though it belongs to the Dashboard section in the information architecture. The mobile bar reserves a dedicated slot for the contextual action, while the layout owns that mobile action slot. Desktop navigation retains a separate Transactions link.

Contextual primary actions are registered by the current page and rendered by the layout. Current actions are Add transaction on Dashboard and Transactions, Add budget on Budgets, and Add account on Accounts. Categories registers Add category or Add section based on its current data; Tools do not register an action. Registration cleanup is scoped to the registering page so an unmount cannot clear a newer page action.

The Profile experience is nested under the existing Tools route at `/tools/profile`. It uses the shared API client and a stable `['profile']` TanStack Query key; email is read from the Supabase session and profile mutations send only application fields.

The Settings experience is nested under `/tools/settings` and currently owns only the
device-local theme preference (`system`, `light`, or `dark`). It reuses the existing
ThemeProvider; Settings does not duplicate Profile identity fields or preferred currency,
and no backend Settings resource exists until an account-level preference needs
cross-device persistence. Invalid stored theme values fall back to the provider default.

TanStack Query hooks wrap feature API functions. Query keys include filters that change the response, including `month` and the dashboard summary's `recentLimit`. Mutations use query invalidation rather than manual `refetch()` when the affected key is known.

The current observed invalidation rules are:

| Mutation                            | Invalidated keys                                                     |
| ----------------------------------- | -------------------------------------------------------------------- |
| Transaction create, update, archive | Transaction lists, account lists, budget lists, and dashboard lists. |
| Budget create, update, archive      | Budget lists and dashboard lists.                                    |
| Account create, update, archive     | Account lists and dashboard lists.                                   |
| Category create, update, archive    | Category lists, section lists, and dashboard lists.                  |
| Section create, update, archive     | Section lists, category lists, and dashboard lists.                  |
| Dashboard retry                     | Dashboard lists.                                                     |

This table describes current implementation, not a promise that every derived view is already invalidated. When changing a mutation, inspect the relevant hooks and backend effects across both repositories.

Do not put backend collections, selected month, or form state in React Context. Do not use `localStorage` for domain records or authorization. Small browser preferences and the transaction-date helper are the current exceptions.

See [API integration](api.md) for API transport and contract rules.

## Design Boundary

Pages orchestrate feature hooks and dialogs. Components should not call `fetch` or Supabase tables directly. Feature API modules call the shared client, while shared code remains genuinely cross-feature. When changing an API-dependent feature, inspect `../dwmc-api` when available before assuming the contract.
