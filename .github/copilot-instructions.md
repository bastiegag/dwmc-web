# Copilot Instructions for `dwmc-web`

## Project Overview

`dwmc-web` is the React/Vite frontend for Dude, Where's My Cash?. The sibling `../dwmc-api` repository owns persistence, authorization, financial calculations, and the API contract. Treat both repositories as one product when a change crosses the API boundary.

## General Frontend Principles

- Follow existing patterns before introducing new ones
- Prefer simple, maintainable code over clever abstractions
- Keep features modular
- Use TypeScript strictly
- Avoid `any`
- Avoid unnecessary dependencies
- Do not rewrite unrelated code
- Keep frontend and backend responsibilities separate
- Do not calculate backend-owned values on the frontend when the backend already returns them
- Do not store app domain data in `localStorage`

## Architecture

- Use a feature-based architecture
- Keep feature code inside `src/features/<feature-name>`
- Keep cross-feature logic inside `src/shared`
- Keep reusable layout components outside feature folders
- Keep API calls in `.api.ts` files
- Keep TanStack Query logic in hooks
- Keep form validation in Zod schemas
- Keep types in `.types.ts` files
- Treat `dwmc-web` and `dwmc-api` as a local-first V1 system: Supabase provides authentication, while local PostgreSQL through Prisma stores application data.

## Naming

- Components: PascalCase filenames and exports
- Hooks: kebab-case filenames, camelCase exports
- Types: `.types.ts`
- Schemas: `.schema.ts`
- API modules: `.api.ts`
- Contexts: `.context.ts`
- Provider components: `ProviderName.tsx`
- Use `.tsx` only when a file contains JSX
- Use `.ts` when there is no JSX

## React Fast Refresh

- Files exporting React components should only export React components
- Do not export raw React contexts from the same file as components
- Put contexts in `.context.ts`
- Put provider components in separate `.tsx` files
- Put hooks in `.ts` files unless they contain JSX

Example:

```
src/shared/primary-action/
    context/primary-action.context.ts
    context/PrimaryActionProvider.tsx
    hooks/use-primary-action.ts
    types/primary-action.types.ts
```

## System Invariants

These invariants define the app's non-negotiable contracts. Violating one is a bug, not a style issue.

### Auth

- All backend requests must use the shared `apiClient`. Never call `fetch` directly or use the Supabase client for domain data.
- `apiClient` attaches the Supabase access token automatically. Do not attach it manually in feature code.
- Never read or decode the Supabase session outside of `authService` or `apiClient`.
- Protected routes must always redirect unauthenticated users to `/login`.

### Month

- The selected month lives exclusively in the URL query param `?month=YYYY-MM`. It is never stored in state, context, `localStorage`, or any other mechanism.
- A missing or invalid `month` param falls back silently to the current calendar month. Never throw or surface this to the user.
- Navigation links between Dashboard, Transactions, and Budgets must preserve the `month` param - use `useSelectedMonth` to read it and build links with `?month=<value>`.
- Query keys for data that varies by month must include the `month` value. Omitting it means the query will not refetch when the month changes.

### Query Invalidation

- After every mutation, call `invalidateQueries` for all affected keys before the mutation hook resolves.
- Never call `refetch()` manually after a mutation. Invalidation is the mechanism.
- Never hardcode query key strings inline. Reference the `*QueryKeys` constants from the relevant hook file.
- Cross-feature invalidation is intentional: creating a transaction also invalidates accounts; creating a budget also invalidates the dashboard.

### Feature Boundaries

- Import only from a feature's public `index.ts` barrel, never from its internal files.
- Cross-feature logic belongs in `src/shared`, not in any feature folder.
- If a symbol is not exported from `index.ts`, treat it as an internal detail that may change without notice.

## API and Auth

- Use the shared `apiClient` for backend requests
- Do not call `fetch` directly from components
- Do not call Supabase directly for app domain data
- Supabase Auth is used for authentication
- Backend requests include the Supabase access token
- Handle API errors with the existing error envelope

## TanStack Query

- Query keys must be stable
- Include filters like `month` in query keys
- Use query hooks for reads
- Use mutation hooks for creates, updates, and archives
- Invalidate affected queries after mutations
- Prefer precise invalidation over manual refetch

## Forms

- Use React Hook Form
- Use Zod for validation
- Keep schemas outside components
- Show clear validation messages
- Show API errors in a user-friendly way
- Reset dialog forms when appropriate

## Month Navigation

- The selected month comes from the URL query param `month=YYYY-MM`
- Do not store selected month in `localStorage`
- Preserve the selected month when navigating between app screens
- Dashboard, Transactions, and Budgets should use the selected month
- Transaction creation should default to a date inside the selected month

### Navigation

- Mobile global navigation has four primary destinations: Overview, Budgets, Accounts, and Tools.
- Transactions is not a mobile Bottom Navigation destination. It remains the independent `src/features/transactions` feature and `/transactions` route, exposed through Dashboard secondary navigation.
- Dashboard secondary navigation is route-driven between `/dashboard` (Overview) and `/transactions` (Transactions); do not replace these routes with local tab state.
- Keep the Dashboard global navigation item active while viewing `/transactions`.
- Preserve `?month=YYYY-MM` when navigating between Dashboard and Transactions.

## Contextual Primary Action

- The floating `+` button is contextual
- Dashboard and Transactions: add transaction
- Budgets: add budget using the selected month
- Accounts: add account
- Tools: hide by default unless there is a clear action
- Clear registered actions when pages unmount

## UI and Accessibility

- Use shadcn/ui components where appropriate
- Use Tailwind CSS
- Keep components small and focused
- Add accessible labels to icon buttons
- Use proper dialog titles
- Do not rely only on color for state
- Keep keyboard focus visible

## Testing

- Add or update tests for meaningful behavior
- Test month navigation
- Test contextual primary actions
- Test form validation
- Test query invalidation behavior where practical
- Use existing test utilities
- Do not add a new test framework

## Documentation

- Treat the docs folder as the source of truth for frontend implementation details.
- Update the frontend README when adding major features.
- Keep README content concise and link to the deeper docs instead of duplicating them.
- Document new environment variables and scripts when they affect setup or development.
- Keep `docs/frontend-architecture.md`, `docs/frontend-routing.md`, `docs/frontend-api.md`, `docs/testing.md`, `docs/development-playbook.md`, `docs/engineering-standards.md`, and `docs/roadmap.md` aligned with the actual code.
- `dwmc-web` and `dwmc-api` run locally for V1. Application data uses local PostgreSQL through Prisma; Supabase is used only for Auth.
- Treat every `VITE_*` value as browser-visible. Backend secrets never belong in this repository's frontend runtime configuration.
- Keep local API and Supabase Auth URLs configuration-driven. Do not introduce deployment infrastructure unless explicitly requested.
- Move planned but unfinished features to `docs/roadmap.md` instead of presenting them as shipped.
