# Frontend API Integration

The frontend consumes `dwmc-api` through feature API modules and the shared `src/lib/api-client.ts`:

```text
page or hook
→ feature API module
→ apiClient
→ dwmc-api
```

The backend API documentation is the contract authority. See the sibling repository's `docs/api.md`, `docs/domains/auth.md`, and relevant domain documentation for server-side details.

## Client Behavior

`apiClient`:

- Reads `VITE_API_URL` and joins it with the requested path.
- Reads the current Supabase session and sends `Authorization: Bearer <access token>` when available.
- Serializes non-GET bodies as JSON.
- Parses JSON responses when the response content type is JSON.
- Returns the parsed successful response to the caller.
- Converts failed responses into `ApiError` with `status`, optional `code`, and optional `issues`.
- Converts network failures into `ApiError` with code `NETWORK_ERROR` and status `0`.

Feature code should not attach auth headers manually, call Supabase tables, or call `fetch` directly.

## Backend Contract

The backend uses `/api/v1` resource paths. Successful responses generally use:

```json
{ "data": {} }
```

Cursor-paginated section and category lists use:

```json
{ "data": [], "nextCursor": null }
```

Transactions use offset metadata:

```json
{ "data": [], "meta": { "page": 1, "pageSize": 20, "total": 0, "totalPages": 0 } }
```

Errors use:

```json
{ "error": { "code": "VALIDATION_ERROR", "message": "Validation failed", "issues": {} } }
```

The exact request schemas, filters, status codes, and resource endpoints are maintained in `dwmc-api/docs/api.md` and the backend route/schema files.

## Feature Modules and Queries

Feature API modules live under feature `api/` directories for accounts, categories, sections, dashboard summary, transactions, and budgets. TanStack Query hooks wrap those functions for reads and mutations.

Month-scoped query keys include the selected month. The dashboard summary request currently includes `recentLimit: 5` from the page.

Section and category list clients consume the backend cursor contract internally and fetch all pages for selector-facing data. The UI keeps active Sections and Categories as the default; historical Transaction and Budget edit flows may request archived relations so an existing archived Category remains identifiable and selectable for that record.

Current invalidation behavior is documented in [frontend architecture](architecture.md). Mutation hooks invalidate the known dependent query families, including cross-feature views such as budgets and the dashboard when transactions change.

## Authentication Boundary

Supabase owns browser authentication. The backend validates the access token and scopes domain data to the authenticated user's `UserProfile`. Frontend route protection improves UX but is not authorization; the backend remains authoritative.

The backend auth contract includes bearer-token validation on protected routes and `GET /api/v1/auth/me` profile synchronization. See `../dwmc-api/docs/domains/auth.md` for the canonical behavior.

On logout or any auth event that removes the session, the frontend removes cached user-sensitive domain queries while preserving the auth-session query so protected-route loading can settle correctly.

When changing an API-dependent feature, inspect `../dwmc-api` when available before changing request types, response handling, filters, or mutation behavior.
