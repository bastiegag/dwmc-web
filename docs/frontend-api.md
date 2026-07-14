# Frontend API Integration

## Overview

Frontend features talk to the backend through feature API files and a shared `apiClient`.

The pattern is:

```text
page or hook
→ feature API file
→ shared apiClient
→ backend endpoint
```

## API Client

The shared API client lives in `src/lib/api-client.ts`.

It:

- reads the backend base URL from `VITE_API_URL`
- attaches the Supabase access token when a session exists
- serializes JSON request bodies for non-GET requests
- parses JSON responses when the response is JSON
- normalizes backend errors into a typed `ApiError`

The client throws a network error if the request cannot be completed and a structured API error when the backend responds with a failure status.

## Auth Header

When a session exists, the client sends:

```http
Authorization: Bearer <Supabase access token>
```

Supabase Auth handles sign in and session management, while the backend validates the token on protected endpoints.

## Supabase Client

The Supabase client is configured in `src/lib/supabase/client.ts`.

It requires:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

Auth flows also use `VITE_APP_URL` for redirect targets.

## Response Format

The app expects backend responses to follow a common envelope shape.

Success responses generally look like:

```json
{
    "data": {}
}
```

Error responses generally look like:

```json
{
    "error": {
        "code": "string",
        "message": "string",
        "issues": []
    }
}
```

## Feature API Files

Each feature owns its own backend calls.

Current examples include:

- `src/features/budgets/api/budgets.api.ts`
- `src/features/transactions/api/transactions.api.ts`
- `src/features/accounts/api/accounts.api.ts`
- `src/features/dashboard/api/summary.api.ts`
- `src/features/categories/api/categories.api.ts`
- `src/features/categories/api/sections.api.ts`

## Query Hooks

API calls are wrapped by TanStack Query hooks.

Use hooks instead of calling API files directly from components when you need server state.

Examples:

- `useBudgets`
- `useCreateBudget`
- `useTransactions`
- `useCreateTransaction`
- `useAccounts`
- `useMonthlySummary`

## Query Keys

Query keys should be stable and should include filters.

Month-scoped queries must include the month value so they refetch when the selected month changes.

Examples:

- budgets list for `{ month: '2026-06' }`
- transactions list for `{ month: '2026-06' }`
- dashboard summary for `{ month: '2026-06', recentLimit: 5 }`

## Mutation Invalidation

Current invalidation patterns in the app:

- Transaction create, update, and delete mutations invalidate transaction lists and account lists.
- Budget create, update, and delete mutations invalidate budget lists and dashboard summary data.
- Account create, update, and delete mutations invalidate account lists.
- Category and section mutations invalidate category and section queries.

The current implementation uses query invalidation instead of manual refetching after writes.

## Error Handling

API errors are converted into user-friendly messages before they reach the UI.

- Do not expose raw transport or JSON parsing errors directly to users.
- Use the backend message when it is available.
- Fall back to a clear local message when the backend does not provide one.

## API Integration Guidelines

- Do not call `fetch` directly in components.
- Do not call Supabase tables directly for app domain data.
- Keep API types close to the feature.
- Keep frontend calculations minimal when the backend already returns derived values.
- Do not duplicate backend-derived fields in the UI when the backend already provides them.
