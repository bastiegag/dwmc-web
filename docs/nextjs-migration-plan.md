# Vite + React Router to Next.js App Router Migration Plan

**Status:** Proposed; documentation and planning only  
**Branch:** `feat/migrate-to-nextjs`  
**Repository:** `bastiegag/dwmc-web`  
**Backend:** [`bastiegag/dwmc-api`](https://github.com/bastiegag/dwmc-api)  
**Baseline checked:** `feat/migrate-to-nextjs` at `ee85c50`, aligned with `main` and
`origin/main` at `2dd253a` on 2026-10-13

## 1. Executive Summary

`dwmc-web` is a mature Vite SPA with a useful feature boundary, a tested
component system, and an independent API. The recommended migration is not a
rewrite of domain features. It is an incremental shell and infrastructure
migration:

1. Establish Next.js configuration and a compatibility-safe app shell.
2. Introduce cookie-based Supabase SSR clients and server-verified protected
   routing.
3. Move route composition from React Router to `src/app`, preserving feature
   page components initially as Client Components where needed.
4. Migrate API access and TanStack Query deliberately, with authenticated cache
   isolation.
5. Migrate Storybook, Vitest, Playwright, CI, and environment configuration.
6. Cut over only after route, auth, financial, accessibility, and responsive
   acceptance suites pass.

The first implementation PR should be a **foundation/auth spike**: add the
Next.js shell, `@supabase/ssr` client factories, middleware/session refresh,
environment validation, and one protected proof-of-concept route without
moving all features. It must demonstrate that a login, refresh, logout, and
server redirect work while the existing API remains unchanged.

## 2. Current Architecture

### Confirmed runtime and dependencies

| Area              | Current implementation                                                                   |
| ----------------- | ---------------------------------------------------------------------------------------- |
| Runtime           | React `19.2.7`, TypeScript `6.0.3`, Node `>=24 <25`                                      |
| Build/dev         | Vite `8.1.3`, `@vitejs/plugin-react`, Tailwind CSS v4 Vite plugin                        |
| Routing           | React Router DOM `7.15.1`, lazy route modules, nested layouts                            |
| Server state      | TanStack Query `5.62.2`, 5-minute default `staleTime`, retry policy                      |
| Auth              | Browser `@supabase/supabase-js`, session from browser storage, client guards             |
| API               | `src/lib/api-client.ts`; bearer token; `/api/v1`; `{ error: { code, message, issues } }` |
| Forms             | React Hook Form, Zod, `@hookform/resolvers`                                              |
| UI                | Tailwind v4, Radix primitives, shadcn-generated components, Sonner                       |
| Tests             | Vitest + RTL/jsdom, Storybook Vitest browser/Playwright, Playwright E2E, MSW, axe        |
| Docs/UI reference | Storybook Design System / Foundations, Components, Patterns, Product                     |
| CI                | Node 24; format, lint, typecheck, unit tests, Vite build; separate E2E workflow          |

### Application bootstrap and routing

`src/main.tsx` validates browser environment variables, mounts `ErrorBoundary`,
`AppProviders`, and `AppRouter`, and imports global CSS. The router currently
defines `/login`, `/signup`, `/forgot-password`, `/reset-password`, protected
`/dashboard`, `/transactions`, `/budgets`, `/accounts`, `/categories`, and
`/tools/{profile,settings}` routes. `/` redirects to `/login`; protected
anonymous behavior is implemented by `ProtectedRoute` and `AnonymousRoute`.
`AppLayout` owns the authenticated shell, while `AuthLayout` owns auth screens.
Pages are lazy-loaded and use a shared loading spinner.

### Auth and API

`src/lib/supabase/client.ts` creates a browser Supabase client from
`VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`, including recovery callback
handling through `sessionStorage`. `AuthSyncProvider` listens for auth changes
and removes non-session queries when the identity changes or signs out.
`apiClient` reads the browser session, forwards `Authorization: Bearer ...`,
maps network failures to `ApiError`, signs out on HTTP 401, and preserves the
backend error envelope.

This is a strong client experience but is not a sufficient server authorization
boundary. The migration must add a server client and server verification rather
than merely wrapping the existing guard in a Next.js page.

### Features and shared state

Features are under `src/features/{accounts,budgets,categories,dashboard,profile,settings,transactions,auth}` with API, hooks, components, forms, pages, and tests colocated where applicable. Shared concerns include dialogs, primary actions, theme, and selected month. Month utilities and `useSelectedMonth` make `?month=YYYY-MM` a cross-feature contract; dashboard, transactions, and budgets must retain it during navigation.

### Quality and delivery

`.storybook/main.ts` uses `@storybook/react-vite` with a11y, themes, docs, and
Vitest addons. `.storybook/preview.ts` supplies global styles/decorators and MSW.
Vitest runs jsdom tests and Storybook browser tests in separate projects.
Playwright covers desktop and mobile smoke flows. CI runs format, lint,
typecheck, unit tests, and build; E2E runs with explicit Vite/Supabase/API
environment variables.

## 3. Migration Goals and Non-Goals

### Goals

- Adopt App Router and meaningful Server Component boundaries.
- Preserve every current route, feature, visual contract, accessibility behavior,
  URL contract, API contract, and test quality gate.
- Add server-side session refresh and protected-route redirects.
- Keep `dwmc-api` independent and authoritative for authz and financial logic.
- Preserve TanStack Query for interactive data and cache invalidation.
- Keep Storybook as the design system source of truth.
- Make future extraction of platform-neutral types/schemas/utilities possible.

### Non-goals

- No Prisma, PostgreSQL, financial calculations, or domain endpoints in Next.js.
- No React Native, Expo, monorepo, shared package, or new product feature.
- No wholesale feature rewrite or speculative server-action architecture.
- No replacement of Storybook, TanStack Query, Vitest, RTL, MSW, or Playwright
  without a migration-blocking compatibility issue.

## 4. Confirmed Findings from the Repository

1. The working branch is already `feat/migrate-to-nextjs`; no application changes
   are required to switch branches.
2. `main` and `origin/main` point to the same observed baseline, so the plan
   reflects the latest locally available main rather than an unverified claim
   about a remote fetch.
3. Vite proxies `/api/v1` to `http://localhost:3000`; production API origin
   behavior must be made explicit for Next.js.
4. `VITE_*` values currently contain both browser-safe Supabase public values and
   the API path/app URL. They must be classified, not mechanically renamed.
5. Auth route protection is client-side today. The new protected layout must
   verify the session server-side.
6. `apiClient` has a stable error type and envelope worth preserving.
7. TanStack Query cache cleanup on auth transitions is intentional and must not
   be lost.
8. Storybook already has browser interaction tests, a11y, themes, docs, and MSW;
   this is a framework adapter change, not a design-system replacement.
9. Node 24 is enforced locally and in GitHub Actions. Next.js and Storybook
   versions must be selected against that constraint.
10. Existing docs describe the Vite architecture and must not be edited to
    imply that Next.js is already adopted.

## 5. Target Next.js Architecture

Use App Router routes as thin composition files. Keep feature behavior in
`src/features` and reusable UI in `src/components`.

```text
src/
  app/
    layout.tsx
    providers.tsx
    globals.css
    error.tsx
    not-found.tsx
    (auth)/
      layout.tsx
      login/page.tsx
      signup/page.tsx
      forgot-password/page.tsx
      reset-password/page.tsx
    (protected)/
      layout.tsx
      dashboard/page.tsx
      transactions/page.tsx
      budgets/page.tsx
      accounts/page.tsx
      categories/page.tsx
      tools/page.tsx
      tools/profile/page.tsx
      tools/settings/page.tsx
  components/
  features/
  lib/
    api-client.ts
    api-client.server.ts
    query/
    supabase/
      browser.ts
      server.ts
  shared/
  test/
```

`src/app/layout.tsx` owns document metadata, global CSS, and stable HTML
structure. `src/app/providers.tsx` is a small `'use client'` boundary for
TanStack Query, theme, auth synchronization, and Toaster. The protected layout
gets the server user and redirects to `/login?next=...` (with same-origin
validation) before rendering the shell. The auth layout renders anonymous
screens and redirects authenticated users server-side.

Use `loading.tsx` for route-segment pending UI, `error.tsx` for recoverable
segment errors, and `not-found.tsx` for unmatched routes. Keep the existing
accessible `LoadingSpinner`, error boundary visual language, and skip-link
behavior instead of creating parallel primitives.

## 6. Proposed Directory Structure

| Target location  | Responsibility                                     | Migration rule                                  |
| ---------------- | -------------------------------------------------- | ----------------------------------------------- |
| `src/app`        | URLs, layouts, metadata, loading/errors, providers | Thin; no domain API/mutation logic              |
| `src/features`   | Domain UI, hooks, API functions, forms             | Preserve feature boundaries                     |
| `src/components` | Shared UI/layout/feedback                          | Keep stories and tests beside components        |
| `src/shared`     | Month, theme, dialogs, primary actions             | Keep browser-only hooks below client boundaries |
| `src/lib`        | API, Supabase, query, formatting, utilities        | Split server-only and browser-safe modules      |
| `src/test`       | RTL render helpers, MSW handlers, fixtures         | Add server/request helpers only as needed       |
| `public`         | `mockServiceWorker.js`, static assets              | Preserve worker registration and asset paths    |

Do not move files simply to make the tree look “Next-like.” Move route entry
points first; migrate feature files only when a server/client boundary or
import restriction requires it.

## 7. Server vs Client Component Strategy

### Server by default

Make route `page.tsx`, protected/auth layouts, metadata, redirects, and
server-only API orchestration Server Components unless they need browser APIs,
state, effects, event handlers, or client hooks.

Good initial Server Component candidates are route composition, auth checks,
static page headings, and layout structure. A page may render an existing
feature page as a Client Component during the first pass. Do not force a
feature into server rendering before its data and interaction model are clear.

### Client boundaries

These remain Client Components initially:

- TanStack `QueryClientProvider` and auth event synchronization.
- Theme provider/toggle, Toaster, dialogs, forms, charts, date pickers, and
  interactive Radix components.
- Navigation controls using `usePathname`, `useRouter`, or search-param state.
- Existing feature screens that use hooks, mutations, browser storage, or
  event handlers.

Use `'use client'` at the smallest stable boundary. Do not import server-only
Supabase or environment modules from client code. If a component needs both
server data and client interaction, pass serializable initial data or render a
client child rather than making the entire route a client boundary.

### Rendering and caching

Authenticated financial views should be dynamic/request-scoped until cache
behavior is proven safe. Do not use static generation or shared ISR for
user-specific data. Server fetches should opt out of shared caching where
appropriate, and TanStack Query keys must include the relevant identity or be
cleared on identity changes. Document any later revalidation exception with
security tests.

## 8. Authentication and Security Strategy

Install and configure `@supabase/ssr` in a dedicated auth PR. Keep two clients:

- `src/lib/supabase/browser.ts`: `createBrowserClient` with public Supabase
  URL/publishable key; used by interactive forms and auth listeners.
- `src/lib/supabase/server.ts`: `createServerClient` backed by request cookies;
  used by Server Components, Route Handlers, and middleware.

Use Next.js middleware (or the current framework-supported equivalent at the
time of implementation) to refresh the session and write refreshed cookies to
the response. The protected layout must call a server verification operation
(`getUser`/`getClaims` according to the current Supabase guidance), not trust
unverified client state. A missing/invalid user redirects before private data
is fetched.

### Auth flows

| Flow              | Target behavior                                                                                                  |
| ----------------- | ---------------------------------------------------------------------------------------------------------------- |
| Login/signup      | Client form submits through browser Supabase client; success lands at validated `next` or dashboard              |
| Anonymous pages   | Server layout redirects an existing user to dashboard                                                            |
| Protected pages   | Server layout verifies cookie session and redirects unauthenticated users                                        |
| Refresh           | Middleware refreshes cookies; API requests use the current access token                                          |
| Logout            | Sign out browser session, clear user-scoped Query cache, redirect to login                                       |
| Password recovery | Preserve callback semantics without relying on a Vite hash-only entrypoint; validate callback and recovery state |
| Reset password    | Keep reset form client-side, with server-safe callback route and no token logging                                |

The API remains the authorization boundary: Next.js forwards the Supabase
access token to `dwmc-api`, which validates it and applies ownership rules.
Never add a Supabase service-role key to Next.js browser or server runtime
unless a separately approved backend integration requires it; it is not needed
for the normal user flow.

### Cache isolation validation

Add tests proving that user A cannot see user B data after logout/login, a
server response is not reused across identities, 401s clear stale client data,
and a refreshed cookie is sent on subsequent requests. Make cache directives
and query key ownership explicit in code review.

## 9. Backend API Integration Strategy

### Recommendation: direct backend contract, dual client adapters

Keep the existing API contract and create:

1. A server adapter that reads the request-scoped Supabase session and sends
   `Authorization: Bearer <access_token>` to the configured API origin.
2. A browser adapter that uses the browser Supabase client and the public API
   base path/origin for interactive queries and mutations.

Share response/error parsing (`ApiError`, the `{ error }` envelope) in a
browser-safe module. Do not share a module that imports server cookies into
Client Components.

Direct browser-to-API requests remain appropriate if deployment CORS and
security policy allow them. Server requests are appropriate for protected
initial rendering. Use a same-origin Next.js rewrite only for operational
routing convenience; it is not an auth boundary.

### Alternatives

| Strategy                | Decision                                                                                                              |
| ----------------------- | --------------------------------------------------------------------------------------------------------------------- |
| Direct browser API      | Retain for interactive client operations where CORS/configuration support it                                          |
| Server-side API request | Use for protected initial data and server composition                                                                 |
| Route Handler BFF       | Reserve for cookie orchestration, same-origin constraints, or a concrete aggregation need                             |
| Server Actions          | Do not use for ordinary CRUD yet; add only when it removes meaningful client complexity without duplicating API rules |

Every request must define the API origin, auth forwarding behavior, timeout/
failure behavior, and cache policy. Preserve status codes and error codes so
existing forms and query invalidation continue to work.

## 10. Data Fetching and Caching Strategy

Retain TanStack Query for client-owned server state. Preserve the existing
5-minute stale time, mutation `retry: false`, and retry policy unless a
route-specific reason is documented. Keep feature query keys and invalidation
near their current API modules.

For server-prefetched data:

1. Verify the current user in the same request.
2. Fetch from the backend with the request token.
3. Mark the response dynamic/no-store unless it is demonstrably safe.
4. Dehydrate only serializable, user-scoped data.
5. Hydrate into a new request/client QueryClient; never use a process-global
   QueryClient for user data.

For the first migration, prefer client fetching behind a server-verified
protected shell over premature dehydration. Add SSR prefetching per feature
only when it improves loading UX and has cache-isolation tests.

The `?month=YYYY-MM` value is a URL input, not global mutable state. Parse and
validate it at the route boundary, preserve it with `Link`/router navigation,
and include it in feature query keys. Invalid values should use the existing
current-month fallback or a documented validation response consistently.

## 11. Routing and Navigation Migration

| Current route      | App Router route                      | Notes                                           |
| ------------------ | ------------------------------------- | ----------------------------------------------- |
| `/`                | `src/app/page.tsx`                    | Server redirect to `/login` or dashboard policy |
| `/login`           | `(auth)/login/page.tsx`               | Anonymous layout                                |
| `/signup`          | `(auth)/signup/page.tsx`              | Anonymous layout                                |
| `/forgot-password` | `(auth)/forgot-password/page.tsx`     | Anonymous layout                                |
| `/reset-password`  | `(auth)/reset-password/page.tsx`      | Recovery callback handling                      |
| `/dashboard`       | `(protected)/dashboard/page.tsx`      | Preserve month search param                     |
| `/transactions`    | `(protected)/transactions/page.tsx`   | Preserve month                                  |
| `/budgets`         | `(protected)/budgets/page.tsx`        | Preserve month                                  |
| `/accounts`        | `(protected)/accounts/page.tsx`       | Authenticated                                   |
| `/categories`      | `(protected)/categories/page.tsx`     | Authenticated                                   |
| `/tools`           | `(protected)/tools/page.tsx`          | Authenticated                                   |
| `/tools/profile`   | `(protected)/tools/profile/page.tsx`  | Authenticated                                   |
| `/tools/settings`  | `(protected)/tools/settings/page.tsx` | Authenticated                                   |

Replace React Router `Link`, `Navigate`, `Outlet`, `useNavigate`,
`useLocation`, and `useSearchParams` usages with `next/link`, `redirect`/
`permanentRedirect` where server-side, and `useRouter`, `usePathname`, and
`useSearchParams` only in Client Components. Keep a small navigation helper for
month-preserving links so dashboard, transactions, and budgets cannot silently
drop the query parameter.

Retain desktop sidebar, mobile bottom navigation, dashboard secondary
navigation, contextual floating action buttons, focus behavior, active state,
skip link, and responsive breakpoints. Verify browser back/forward, direct
deep links, refresh, auth redirects, and invalid paths.

## 12. Feature Preservation Requirements

| Feature/surface     | Required preservation                                                        |
| ------------------- | ---------------------------------------------------------------------------- |
| Dashboard           | Month selection, summaries, secondary navigation, loading/error/empty states |
| Transactions        | Month filter, list/table behavior, forms, mutation invalidation              |
| Budgets             | Month filter, budget forms, category relationships, invalidation             |
| Accounts            | CRUD dialogs/forms, validation, errors, responsive cards                     |
| Categories/sections | Existing list and navigation behavior                                        |
| Profile/settings    | Authenticated tools routes, forms, theme/preferences                         |
| Auth screens        | Login/signup/recovery/reset, validation, redirects, accessible errors        |
| Shell               | Desktop sidebar, mobile nav, top bar, FABs, skip link, focus management      |
| Design system       | Story categories, tokens, Radix behavior, themes, a11y                       |

No feature should gain a second API client or a second source of truth for
business rules during migration.

## 13. Storybook and Design System Migration

Keep the existing story taxonomy and colocated stories. After the app runtime
is stable, change `.storybook/main.ts` from `@storybook/react-vite` to the
official Storybook Next.js-compatible framework selected for the installed
Storybook 10 release (validate whether `@storybook/nextjs` or
`@storybook/nextjs-vite` is the supported choice at implementation time).
Do not add legacy router addons without a concrete need.

Preserve:

- `Design System / Foundations`
- `Design System / Components`
- `Design System / Patterns`
- `Design System / Product`
- a11y, themes, docs, Vitest browser integration, and MSW
- Tailwind v4 styles and theme decorators

Router-dependent stories should use a lightweight decorator or framework
mock, not import the full protected application. Server-only modules should be
wrapped by a test seam or represented with serialized props. MSW handlers must
remain deterministic and must not use real financial or auth data.

### Storybook acceptance criteria

- `npm run storybook` and `npm run build-storybook` succeed under the migrated
  framework.
- Existing stories render with the same titles, states, themes, and accessible
  names unless a change is explicitly approved.
- a11y checks remain enabled and report no new serious/critical violations.
- Storybook Vitest browser tests pass in Chromium.
- MSW handlers intercept expected API calls without network leakage.
- At least one router-dependent and one form/mutation story are verified.

## 14. Testing and Quality Assurance

Do not introduce Jest. Preserve the existing split:

| Layer             | Migration work and required coverage                                                     |
| ----------------- | ---------------------------------------------------------------------------------------- |
| Vitest/RTL        | Update aliases, env setup, Next navigation mocks, provider wrappers, and component tests |
| Storybook Vitest  | Keep browser project, framework plugin, themes, MSW, and a11y                            |
| Playwright        | Change dev/build server command and base URL; retain desktop/mobile projects             |
| MSW               | Keep browser worker and Node server; add server adapter handlers only where needed       |
| axe               | Keep component and E2E accessibility checks                                              |
| TypeScript        | Keep strict/no-unused settings; add Next-generated types without loosening checks        |
| ESLint/Prettier   | Add Next rules/config only when compatible; retain zero-warning and format gates         |
| Husky/lint-staged | Preserve staged TS/TSX and documentation formatting hooks                                |
| CI                | Run format, lint, typecheck, unit/storybook tests, Next build, and E2E                   |

Required regression scenarios:

- login, signup, logout, password recovery, reset, expired/invalid session;
- protected deep-link redirect and validated return destination;
- user A logout then user B login cannot see user A cache/data;
- dashboard/transactions/budgets preserve valid and invalid month params;
- account, transaction, budget, category, profile, and settings mutations
  invalidate and refetch the expected queries;
- desktop and mobile navigation, keyboard focus, dialogs, forms, and themes;
- direct refresh of every route and API/network error states;
- API 401, 4xx validation envelope, 5xx, empty response, and network failure;
- Storybook a11y and interaction suites;
- production Next build and Playwright against the production-like server.

## 15. Environment and Build Configuration

Replace Vite scripts/configuration with Next scripts (`next dev`, `next build`,
`next start`) and remove Vite only after all consumers are migrated. Keep the
existing port contract where possible so E2E and local workflows remain stable.

Classify variables:

| Current                  | Target role                                                                                |
| ------------------------ | ------------------------------------------------------------------------------------------ |
| `VITE_SUPABASE_URL`      | `NEXT_PUBLIC_SUPABASE_URL` (public)                                                        |
| `VITE_SUPABASE_ANON_KEY` | `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` (public; follow current Supabase naming)            |
| `VITE_API_URL`           | `NEXT_PUBLIC_API_URL` only if browser access is required; server-only API origin otherwise |
| `VITE_APP_URL`           | `NEXT_PUBLIC_APP_URL` for browser redirect construction, or server URL where possible      |

Use server-only names for private values and validate them at the boundary.
Never expose database credentials, backend secrets, service-role keys, or
private API tokens. Update `.env.example`, CI, Playwright config, auth callback
URLs, and deployment documentation together; do not leave a mixed Vite/Next
contract after cutover.

Port the Tailwind v4 integration, alias configuration, global CSS, public
assets, fonts, bundle-size reporting, and static `mockServiceWorker.js`.
Review `next.config` for API rewrites, image/font policy, headers, and bundle
analysis. Prefer a documented rewrite over an opaque proxy, and do not rely on
Next caching for authenticated API data.

## 16. Dependency Compatibility

Do not upgrade unrelated packages. Before implementation, verify the supported
stable Next.js version against Node 24, React 19, TypeScript 6, Tailwind v4,
Storybook 10, Vitest 4, Playwright, ESLint 9, and the current Supabase package.
Add only the minimum packages required:

- `next`
- `@supabase/ssr`
- the Storybook Next framework adapter, if required
- any official Next ESLint integration needed by the chosen Next version

Remove `vite`, `@vitejs/plugin-react`, and `react-router-dom` only after no
runtime, Storybook, Vitest, or script references remain. Re-lock dependencies
and review bundle/build output in the same PR that changes manifests.

## 17. Incremental Migration Phases

### Phase 0 — Baseline and migration guardrails

**Prerequisites:** Clean worktree; current branch rebased/verified against
approved `main`.  
**Files:** `package.json`, lockfile, `README.md`, `docs/*`, CI only as needed.  
**Steps:** Capture current validation outputs, record route/API/env contracts,
add migration documentation, and define a route-by-route acceptance matrix.  
**Risks:** Baseline drift or undocumented env assumptions.  
**Tests:** Existing `npm run validate`, Storybook build, Playwright smoke.  
**Done:** Baseline is reproducible and this plan/ADR is reviewed.  
**Rollback:** Revert documentation-only changes.

### Phase 1 — Next shell and auth proof of concept

**Prerequisites:** Phase 0 approved.  
**Files:** `package.json`, `next.config.*`, `tsconfig*.json`, `src/app/layout.tsx`,
`src/app/providers.tsx`, `src/lib/supabase/{browser,server}.ts`,
`middleware.ts`, env examples, focused auth tests.  
**Steps:** Add Next scripts/config, global CSS, provider boundary, SSR clients,
cookie refresh, server verification, and one protected proof-of-concept route.  
**Risks:** Cookie refresh, Node/runtime mismatch, accidental server imports.  
**Tests:** Auth unit tests, middleware tests, login/logout/refresh Playwright.  
**Done:** A protected route redirects server-side; login and logout work; no
backend endpoint changes; Vite path remains available as rollback if practical.  
**Rollback:** Revert shell/auth PR and retain Vite entrypoint.

### Phase 2 — Route composition and navigation

**Prerequisites:** Phase 1 auth contract passes.  
**Files:** `src/app/**`, layout/navigation components, feature page entrypoints,
navigation tests.  
**Steps:** Add auth/protected route groups, route layouts, loading/error/not-found
files, and replace React Router navigation while preserving month params.  
**Risks:** Lost search params, focus regressions, route redirect loops.  
**Tests:** Direct route/refresh/back-forward/deep-link and responsive E2E.  
**Done:** Every current route resolves with correct auth behavior and no route
imports React Router.  
**Rollback:** Route-by-route revert; keep feature internals unchanged.

### Phase 3 — API adapters and Query integration

**Prerequisites:** Protected layout and navigation are stable.  
**Files:** `src/lib/api-client*`, `src/lib/query/*`, feature API/hooks,
`src/test/mocks/*`, cache/auth tests.  
**Steps:** Split browser/server adapters, preserve `ApiError`, define origin and
cache policy, then migrate initial data only where justified.  
**Risks:** Token forwarding, stale cross-user cache, duplicate API logic.  
**Tests:** API envelope/status tests, auth isolation tests, mutation invalidation,
MSW contract tests, server request tests.  
**Done:** All features use one documented contract and user data never crosses
identity boundaries.  
**Rollback:** Keep browser adapter and disable server prefetch per feature.

### Phase 4 — Feature and UX parity

**Prerequisites:** Route and API foundations pass.  
**Files:** Feature route pages/components only where needed, month/navigation
helpers, forms, metadata, loading/error states.  
**Steps:** Migrate dashboard, transactions, budgets, accounts, categories,
profile, settings, and auth pages in small feature PRs.  
**Risks:** Business behavior changes hidden in page rewrites.  
**Tests:** Existing feature tests plus route-level acceptance matrix.  
**Done:** All feature preservation requirements pass at desktop/mobile sizes.  
**Rollback:** Revert only the affected feature PR.

### Phase 5 — Storybook and test tooling

**Prerequisites:** Runtime imports and client/server boundaries are stable.  
**Files:** `.storybook/*`, `vitest.config.ts`, `src/test/*`, Playwright config,
test scripts.  
**Steps:** Switch Storybook framework, update decorators/mocks, preserve browser
project, and move test server commands to Next.  
**Risks:** Storybook-only imports and router mocks hide runtime problems.  
**Tests:** Storybook build, Vitest projects, a11y, MSW, Playwright.  
**Done:** Existing design-system acceptance criteria pass with no test-suite
replacement.  
**Rollback:** Pin/revert framework adapter while runtime remains Next.

### Phase 6 — CI, production build, and cutover

**Prerequisites:** Phases 1–5 accepted.  
**Files:** workflows, env docs, scripts, `next.config`, README links.  
**Steps:** Add Next build/start validation, production-like E2E, deployment
headers/rewrites, bundle reporting, then remove Vite/React Router dependencies.  
**Risks:** Deployment runtime, API origin, cache headers, missing env values.  
**Tests:** Full validation matrix on CI and production-like deployment.  
**Done:** CI is green, all acceptance criteria pass, rollback artifact/runbook
exists, and the migration is approved for main.  
**Rollback:** Redeploy last Vite artifact and revert cutover PR; backend remains
unchanged.

## 18. File-Level Migration Checklist

- [ ] `package.json` scripts, dependencies, engines, and lockfile.
- [ ] `next.config.*`, `tsconfig` references, aliases, global CSS, public assets.
- [ ] `src/app/layout.tsx`, route groups, pages, loading/error/not-found files.
- [ ] `src/app/providers.tsx` and client-only provider boundaries.
- [ ] `middleware.ts` and `src/lib/supabase/browser.ts`/`server.ts`.
- [ ] `src/lib/api-client.ts` shared error parsing and server adapter.
- [ ] `src/lib/query/*` QueryClient lifecycle and hydration policy.
- [ ] Auth forms/services/hooks, callback and recovery storage behavior.
- [ ] Navigation components and month-preserving link helper.
- [ ] Feature route entrypoints; feature internals only when required.
- [ ] `.storybook/main.ts`, `.storybook/preview.ts`, router/theme/MSW decorators.
- [ ] `vitest.config.ts`, `src/test/setup.ts`, render helpers, MSW handlers.
- [ ] `playwright.config.ts`, auth fixtures, base URL, dev/build server.
- [ ] `.env.example`, CI workflow env, release/deployment documentation.
- [ ] ESLint, Prettier, Husky, lint-staged, bundle-size script.
- [ ] README links and this plan/ADR status after approval.

## 19. Risks and Mitigations

| Risk                                             | Mitigation                                                                |
| ------------------------------------------------ | ------------------------------------------------------------------------- |
| Cookie/session refresh breaks recovery or logout | Dedicated auth spike; browser and Playwright coverage; no token logging   |
| User-specific data is cached across users        | Dynamic/no-store defaults; request-scoped clients; identity cache tests   |
| Client/server import violations                  | Separate module filenames and strict lint/typecheck boundaries            |
| Month query is dropped                           | Central URL helper and route-level navigation tests                       |
| API contract diverges                            | Reuse `ApiError` envelope and MSW contract tests; no backend edits        |
| Storybook framework hides runtime issues         | Run Storybook plus Next build and Playwright; avoid broad mocks           |
| Node/dependency incompatibility                  | Validate exact versions before manifest change; no unrelated upgrades     |
| Deployment API origin differs from local proxy   | Explicit env matrix, rewrite documentation, production-like E2E           |
| Migration becomes a rewrite                      | Small PRs, thin route files, preserve feature modules and rollback points |

## 20. Acceptance Criteria

The migration is complete only when:

- all current URLs, redirects, query params, features, layouts, and responsive
  behavior work in a production Next build;
- protected routes verify sessions server-side and anonymous routes redirect;
- auth refresh, recovery, logout, and cross-user cache isolation are tested;
- `dwmc-api` remains independent and receives the same authorized contract;
- no server secret is browser-visible;
- dashboard, transactions, and budgets preserve valid `?month=YYYY-MM`;
- API errors, 401s, validation, loading, empty, and error states remain usable;
- Storybook categories, themes, a11y, MSW, and browser tests pass;
- Vitest/RTL, Playwright desktop/mobile, TypeScript, ESLint, Prettier, Husky,
  and CI gates pass without introducing Jest;
- documentation, env examples, and rollback instructions are current.

## 21. Rollback Strategy

Keep the last known-good Vite deployment available until the Next.js cutover
has passed a full observation window. Each phase must be independently
revertible and must not require backend schema or endpoint changes. Preserve
the previous environment variable mapping and deployment command. If auth,
API, or cache isolation fails, redeploy the Vite artifact, revert only the
affected frontend PR, invalidate affected sessions/caches if needed, and
investigate without changing `dwmc-api`.

## 22. Future React Native Considerations

Keep API contracts, Zod schemas, domain types, and pure month/currency
utilities free of Next.js, browser storage, DOM, and React Router imports.
Do not create a shared package or monorepo in this migration. A future Expo app
can reuse platform-neutral modules or generate its own client from the same
backend contract while using a platform-specific auth/session adapter.

## 23. Open Questions and Architectural Decisions

These must be answered in implementation PRs, not guessed in route code:

1. Which deployment platform and API origin will production use, and is direct
   browser API access permitted by CORS?
2. Does the chosen Next.js deployment support the required Node 24 runtime and
   middleware runtime behavior?
3. Does the installed Storybook 10 release recommend `@storybook/nextjs` or
   `@storybook/nextjs-vite` for this exact setup?
4. Which auth callback URL should Supabase use for local, preview, and
   production environments?
5. Which first feature benefits enough from server prefetching to justify
   hydration complexity?
6. What are the deployment cache/header defaults, and how will authenticated
   responses be prevented from shared caching?

The default answers are: preserve direct API contracts, use request-scoped
server calls, keep authenticated data dynamic, and defer BFF/server actions
until a measured need exists.

## 24. Recommended First Implementation PR

Create a focused PR titled **“Add Next.js shell and SSR auth foundation”**.
It should:

1. Add the compatible Next.js and `@supabase/ssr` dependencies only.
2. Add `next.config`, scripts, strict TypeScript integration, and env
   validation without deleting Vite yet.
3. Add browser/server Supabase factories and middleware cookie refresh.
4. Add root/providers/auth/protected layout scaffolding.
5. Convert one small protected proof-of-concept route, ideally `/tools`, while
   leaving feature internals intact.
6. Add tests for server redirect, login, refresh, logout, and invalid session.
7. Document local commands and keep the existing API and Storybook workflows
   green where they are not yet migrated.

Definition of done: the Next dev/build path renders the proof-of-concept,
protected access is server-verified, auth cookies refresh safely, no user data
is shared across sessions, existing Vite validation remains a rollback signal,
and the PR does not migrate all features or remove React Router.

### Official documentation to re-check during implementation

- [Next.js App Router](https://nextjs.org/docs/app)
- [Next.js authentication](https://nextjs.org/docs/app/building-your-application/authentication)
- [Next.js route handlers](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)
- [Next.js environment variables](https://nextjs.org/docs/app/building-your-application/configuring/environment-variables)
- [Supabase server-side auth](https://supabase.com/docs/guides/auth/server-side)
- [Storybook Next.js/Vite framework](https://storybook.js.org/docs/get-started/frameworks/nextjs-vite)
