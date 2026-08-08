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

The backend remains authoritative for ownership, validation, persistence, balances, budget spending, and summaries. See the backend repository's API and authentication documentation for server implementation details.

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

- TanStack Query owns backend server state.
- React Hook Form and Zod own form input and validation.
- The URL owns navigational state such as the selected month.
- Components own transient UI state such as dialog visibility.
- React Context is reserved for justified cross-layout concerns such as theme, auth synchronization, and the contextual primary action.
- `localStorage` stores small UX preferences only, such as theme and the last transaction date per month.

See [state management](frontend-state-management.md) for the ownership matrix and [API integration](frontend-api.md) for query and mutation rules.

## Design Boundary

Pages orchestrate feature hooks and dialogs. Components should not call `fetch` or Supabase tables directly. Feature API modules call the shared client, while shared code remains genuinely cross-feature. When changing an API-dependent feature, inspect `../dwmc-api` when available before assuming the contract.
