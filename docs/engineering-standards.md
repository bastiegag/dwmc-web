# Frontend Engineering Standards

## Boundaries

- Keep domain operations in `dwmc-api`; the frontend must not connect to PostgreSQL.
- Use Supabase only for browser authentication and session management.
- Send authenticated domain requests through the shared `apiClient`.
- Keep the local API and Supabase Auth URLs configuration-driven.
- Treat every `VITE_*` variable as public browser configuration.
- Never add database credentials, `SUPABASE_SERVICE_ROLE_KEY`, or other backend secrets to frontend configuration.

## Code Organization

- Keep feature code inside `src/features/<feature-name>`.
- Keep cross-feature behavior in `src/shared`.
- Keep backend calls in feature `.api.ts` files and server state in TanStack Query hooks.
- Preserve the public `index.ts` boundary of each feature.
- Follow the naming and Fast Refresh conventions in `frontend-conventions.md`.

## Validation

- Prefer focused tests for behavior changes.
- Run `npm run validate` before merging.
- Keep route, environment, and local development documentation aligned with implementation.
