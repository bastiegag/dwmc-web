# Frontend Development

## Local workflow

1. Start the local `dwmc-api` service.
2. Copy `.env.example` to `.env.local`.
3. Configure `VITE_APP_URL`, `VITE_API_URL`, `VITE_SUPABASE_URL`, and
   `VITE_SUPABASE_ANON_KEY`.
4. Run `npm run dev`.
5. Run focused tests while developing, then `npm run validate` before opening a
   pull request.

The local Vite proxy forwards `/api/v1` to `dwmc-api` on port `3000`.
Supabase is used for Auth only. All `VITE_*` values are browser-visible;
database credentials, service-role keys, and deployment secrets never belong in
this repository.

## Conventions

- Use PascalCase filenames for application React components.
- Preserve kebab-case filenames for shadcn/ui primitives.
- Use the repository's kebab-case convention for hook filenames.
- Use `.types.ts`, `.schema.ts`, `.api.ts`, and `.context.ts` suffixes for
  types, schemas, API modules, and contexts.
- Keep provider components in PascalCase `.tsx` files.
- Keep React contexts separate from provider components so Fast Refresh can
  identify component exports.
- Keep feature code in `src/features/<feature-name>`.
- Use feature public `index.ts` exports across feature boundaries.
- Keep cross-feature code in `src/shared`.

Tests mirror their source filename and are colocated with the source. Shared
fixtures, MSW handlers, setup, and test utilities remain under `src/test/`.
Storybook stories remain beside components, while Playwright workflows remain
under `e2e/`.

## Forms and server state

Use React Hook Form with Zod schemas outside components. Show accessible
validation and API errors. Use TanStack Query hooks for server state, include
response-changing filters in query keys, and invalidate every affected key
before a mutation resolves.

Use the shared `apiClient` for backend requests. Do not call `fetch` directly
from feature components or use Supabase tables for domain data. Backend-owned
financial calculations and authorization must not be reimplemented in the
frontend.

## Pull requests and quality gates

Keep changes focused and use Conventional Commit messages. Update the canonical
documentation when routes, environment variables, scripts, contracts,
architecture, or workflows change.

Run:

```bash
npm run format:check
npm run lint
npm run typecheck
npm run test
npm run build
```

The CI workflow runs these checks on pushes and pull requests targeting `main`.
Playwright runs separately. The product-wide process and definition of done are
maintained in the [shared Developer Playbook](dev-playbook.md).
