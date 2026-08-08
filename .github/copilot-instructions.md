# Copilot Instructions for `dwmc-web`

## Context

This is the React/Vite frontend for Dude, Where's My Cash?, a personal budgeting application. It uses TypeScript, React Router, TanStack Query, React Hook Form, Zod, Supabase Auth, shadcn-style UI, Tailwind CSS, Vitest, Testing Library, MSW, Playwright, and Storybook. Verify versions and scripts in `package.json`.

The sibling `../dwmc-api` repository owns the backend API, persistence, authorization, financial calculations, and response contract. When implementing or changing an API-dependent feature, inspect `../dwmc-api` when available before assuming the contract.

## Architecture

- Keep domain code in `src/features/<feature>`.
- Keep app setup, layouts, providers, and routing in `src/app`.
- Keep reusable UI and layout primitives in `src/components`.
- Keep cross-feature systems in `src/shared`.
- Keep API client, Supabase client, QueryClient, and low-level helpers in `src/lib`.
- Keep API calls in feature `.api.ts` modules and server-state logic in TanStack Query hooks.

Follow existing feature structure. Do not refactor unrelated code or rename legacy files only to match a convention.

## Naming and Fast Refresh

- Components and providers use PascalCase filenames and exports.
- Hooks use kebab-case filenames and camelCase exports.
- Use `.types.ts`, `.schema.ts`, `.api.ts`, and `.context.ts` for their respective roles.
- Use `.tsx` only when JSX exists.
- Keep raw React contexts separate from provider components to satisfy `react-refresh/only-export-components`.

## API and Auth

- Use `src/lib/api-client.ts` through a feature API module.
- Do not call `fetch` directly from components or call Supabase tables for domain data.
- Let `apiClient` attach the Supabase access token.
- Treat backend response and error envelopes as authoritative; see `dwmc-api/docs/api.md`.
- Do not calculate backend-owned balances, spending, or summaries in the frontend.

## State and Month Navigation

- TanStack Query owns backend data.
- React Hook Form plus Zod owns forms.
- Local component state owns transient UI such as dialogs.
- The selected month is URL state: `?month=YYYY-MM`; use `useSelectedMonth` and preserve the parameter in app navigation.
- Do not store domain data or selected month in `localStorage`.
- Use React Context only for justified cross-layout concerns such as theme and contextual primary actions.
- Include response-changing filters such as `month` in query keys.
- Use existing query-key helpers and invalidate the keys observed in the mutation hooks. Do not claim broader invalidation without verifying source.

## UI and Accessibility

Use existing shadcn/Radix primitives and Tailwind tokens. Keep components focused. Icon buttons need accessible labels, dialogs need titles, forms need labels, state must not rely on color alone, and keyboard focus must remain visible.

The contextual primary action is page-registered and layout-rendered. Preserve cleanup on unmount and inspect neighboring registrations before adding a new one.

## Testing and Storybook

Prefer behavior-focused tests with accessible queries. Use Vitest and Testing Library for utilities/components/integration flows, MSW for network mocks, Playwright for user workflows, and Storybook for reusable UI states. Add regression coverage for meaningful bugs and cross-feature behavior; do not chase coverage numbers without behavioral value.

## Documentation

Keep the README concise. Update the relevant document under `docs/` when routes, state ownership, API usage, testing commands, setup variables, release behavior, or roadmap status changes. Do not document planned work as implemented.
