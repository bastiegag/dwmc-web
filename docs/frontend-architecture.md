# Frontend Architecture

## Overview

This frontend is a React + TypeScript budget app built around a feature-based architecture.
The codebase keeps application setup, reusable UI, domain features, shared cross-feature utilities, and low-level clients separated so each layer has a clear responsibility.

## Runtime Boundaries

The frontend runs on the local Vite development server. The local `dwmc-api` owns domain operations, JWT validation, authorization, Prisma, and PostgreSQL access. Supabase is used for Auth only; the browser never connects to application data storage.

```text
Browser -> local dwmc-web -> local dwmc-api -> Prisma -> local PostgreSQL
                       \-> Supabase Auth -> access token -> dwmc-api
```

`VITE_API_URL` selects the local API origin. Financial and domain requests go
through the shared API client. The frontend must never connect directly to
PostgreSQL or contain service-role, database, or other backend credentials.

## Application Structure

The current `src/` tree is organized like this:

```text
src/
  app/
  components/
  features/
  lib/
  shared/
  stories/
  styles/
  test/
```

### Folder Roles

- `app`: application bootstrap, router, layouts, and top-level providers.
- `components`: shared UI and layout components used across features.
- `features`: domain code for auth, dashboard, accounts, transactions, budgets, and categories.
- `shared`: cross-feature utilities and state such as month navigation and contextual primary actions.
- `lib`: low-level clients and general helpers such as the API client, Supabase client, and query client setup.
- `stories`: Storybook stories for reusable UI states.
- `styles`: global styling.
- `test`: shared test setup, fixtures, and helpers.

## Feature-Based Architecture

Feature folders follow the same general pattern:

```text
src/features/budgets/
  api/
  components/
  hooks/
  pages/
  schemas/
  types/
  index.ts
```

The exact subfolders vary by feature, but the responsibilities are consistent:

- `api/` contains backend calls for that feature.
- `hooks/` contains TanStack Query hooks and mutation logic.
- `schemas/` contains Zod schemas for forms and validation.
- `types/` contains feature-specific TypeScript types.
- `components/` contains feature UI.
- `pages/` contains route-level screens.

Examples of the current feature organization:

- `src/features/auth`
- `src/features/dashboard`
- `src/features/accounts`
- `src/features/transactions`
- `src/features/budgets`
- `src/features/categories`

## Shared Code

The `shared` folder is for code that is reused across multiple features but does not belong to a single domain.

Current examples include:

- Month navigation state and helpers.
- The contextual primary action context and provider.
- Shared cross-feature UI primitives when needed.

What should not go in `shared`:

- Feature-specific forms.
- Feature-specific API calls.
- Logic that only one domain uses.

## Data Flow

The typical data flow is:

```text
Page component
→ feature hook
→ feature API file
→ shared apiClient
→ backend API
```

For example, the dashboard summary flow is:

```text
DashboardPage
→ useMonthlySummary({ month, recentLimit: 5 })
→ getMonthlySummary({ month, recentLimit: 5 })
→ apiClient
→ GET /summary/monthly?month=YYYY-MM&recentLimit=5
```

## Authentication Flow

Authentication is handled by Supabase Auth.

- Supabase owns sign in, sign up, password recovery, session lookup, and sign out.
- The frontend reads the current session through the auth service.
- The shared `apiClient` sends the Supabase access token to the backend in an Authorization header.
- App domain data comes from the backend API, not directly from Supabase tables.

The auth session is also mirrored into TanStack Query so auth-aware hooks can react to session changes.

## Server State

Server state is managed with TanStack Query.

- Query hooks own reads from the backend.
- Query keys include relevant filters such as `month`.
- Mutations invalidate affected query keys after they succeed.
- In the current dashboard implementation, `dashboardQueryKeys.monthlySummary({ month, recentLimit: 5 })` is the read key and `dashboardQueryKeys.lists()` is the base key used for invalidation.
- The app avoids manual refetches after writes when invalidation is sufficient.

## Form State

React Hook Form manages form input state.
Zod handles form validation.

- Form schemas live outside components.
- Dialog forms keep their own local state and validation errors.
- Feature pages pass initial values and submit handlers into feature dialogs.

## UI State

UI-only state stays local unless it needs to be shared across the layout.

- Dialog open and close state usually lives in the page component.
- The contextual floating `+` action uses shared context because it is rendered by the layout and registered by the active page.
- The selected month is URL state, not local component state.

## Architecture Principles

- Keep components focused.
- Keep API logic out of components.
- Keep feature code close to the feature.
- Keep shared code genuinely reusable.
- Avoid unnecessary abstractions.
- Follow existing patterns before introducing new ones.
