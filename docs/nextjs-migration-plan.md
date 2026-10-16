# Vite + React Router to Next.js App Router Migration Plan

**Status:** Phase 5 implementation complete; Phase 6 pending
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

The first implementation milestone should be a **Next.js shell only**:
introduce the Next runtime and the new root/app structure without changing
authentication behavior or migrating feature routes. Authentication and a
protected proof-of-concept route follow as separate milestones. This keeps the
first review limited to framework bootstrapping and makes its validation
independent.

### Phase 1 implementation status

Phase 1 is implemented on `feat/migrate-to-nextjs`:

- Next.js `16.4.0` is the active `dev`, `build`, and `start` runtime on port
  `5182`.
- The App Router shell is in `src/app` with metadata, global styles, Tailwind
  v4 PostCSS integration, theme/toast providers, and a deliberately public
  root page.
- The former Vite bootstrap/router is retained under `src/legacy-app`.
- `dev:legacy`, `build:legacy`, and `preview:legacy` rebuild or run the Vite
  rollback runtime. They are not run concurrently with Next.
- Next rewrites `/api/v1/*` to `DWMC_API_URL` (defaulting to the independent
  backend at `http://localhost:3000/api/v1`). No API client or auth flow uses
  this rewrite yet.
- Next does not expose the existing login, protected, financial, tools, or
  settings routes yet. Those routes remain available through the Vite rollback
  runtime and are intentionally deferred to later phases.
- Playwright continues to launch `dev:legacy` so existing feature E2E tests
  remain meaningful until App Router route migration.

The next milestone is Phase 2: SSR authentication and a protected
proof-of-concept route. This phase must not be inferred from the public shell.

### Phase 3 implementation status

Phase 3 is implemented:

- Auth and protected route groups are available through `src/app/(auth)` and
  `src/app/(protected)`.
- Dashboard, transactions, budgets, accounts, categories, tools, profile, and
  settings entrypoints reuse existing feature pages.
- The protected layout keeps server-side Supabase verification and renders
  month-aware desktop, section, and mobile navigation.
- Shared `?month=YYYY-MM` behavior, invalid-value fallback, history replacement,
  and direct navigation are preserved without localStorage.
- Loading, error, and not-found boundaries were added. The legacy Vite runtime
  and React Router implementation remain available through the rollback
  scripts.

The maintainer's successful Phase 2 local integration validation is
maintainer-reported and was not rerun by this implementation.

Phase 4 remains responsible for API adapter and data-fetching architecture
improvements. No server-side financial fetching or Server Actions were added
in Phase 3.

#### Phase 3 month-navigation correction

Month navigation now uses explicit runtime providers rather than conditional
router hooks. `NextMonthProvider` owns App Router query updates, while
`LegacyMonthProvider` owns React Router query updates. Shared feature consumers
continue to use the same `useSelectedMonth` interface and shared month
validation/calculation utilities.

### Phase 4 implementation status

Phase 4 is implemented:

- Browser API access is configured explicitly by the Next and legacy runtime
  providers without importing server-only modules into Client Components.
- Server API access verifies the request-scoped Supabase user and matching
  access-token subject before forwarding requests to `dwmc-api`.
- Browser and server adapters share response parsing and `ApiError`
  construction, including network, empty, malformed, and structured error
  responses.
- Authenticated requests use explicit cache behavior, and QueryClient requests
  are cancelled before user-sensitive cache cleanup on identity changes and
  logout.
- Existing feature API contracts, query keys, mutation invalidation, and the
  Vite rollback runtime remain intact.

Phase 5 is responsible for feature or UX work beyond API infrastructure.

### Phase 5 implementation status

Phase 5 is implemented for the migrated feature surface:

- Next.js feature pages continue to reuse the established feature hooks,
  forms, API contracts, and backend-owned calculations rather than duplicating
  domain logic in route files.
- The Next runtime now configures the shared authentication service with the
  Next SSR-compatible browser client. The legacy runtime continues to configure
  the same service with the Vite Supabase client; feature code no longer
  imports the Vite client during Next route evaluation.
- Transaction date persistence is safe during server rendering and remains
  browser-only at runtime.
- The deterministic Next E2E mock boundary covers accounts, sections,
  categories, transactions, budgets, summaries, and profiles. New regression
  workflows cover dashboard month navigation, month-preserving navigation,
  feature CRUD flows, tools routes, mobile navigation, and dialog Escape
  behavior.

Feature parity matrix (the legacy Vite runtime remains the reference and its
existing Playwright coverage is preserved):

| Feature                           | Route/auth                      | Reads and states                                | Mutations                        | Month/query behavior                                | Responsive/accessibility                                      | Next coverage         | Status                |
| --------------------------------- | ------------------------------- | ----------------------------------------------- | -------------------------------- | --------------------------------------------------- | ------------------------------------------------------------- | --------------------- | --------------------- |
| Dashboard                         | `/dashboard`, protected         | Summary, empty, loading, error, charts/cards    | Create transaction action        | Summary key includes month; navigation preserves it | Shared shell and primary action                               | Unit + Next E2E       | Fully functional      |
| Transactions                      | `/transactions`, protected      | Filters, pagination, empty/loading/error        | Create, edit, archive            | Query key and default date include month            | Forms and archive dialog covered by legacy tests              | Unit + Next E2E smoke | Fully functional      |
| Budgets                           | `/budgets`, protected           | Monthly totals, progress, over-budget rendering | Create, edit, archive            | Budget key includes month                           | Dialog and progress states covered by legacy tests            | Unit + Next E2E smoke | Fully functional      |
| Accounts                          | `/accounts`, protected          | Empty/loading/error, balances                   | Create, edit, archive            | Non-month-scoped list preserves current URL         | Mobile dialog workflow covered by Next E2E                    | Unit + Next E2E smoke | Fully functional      |
| Categories and sections           | `/categories`, protected        | Cursor aggregation, empty/loading/error         | Create, edit, archive            | Historical archived relations preserved by hooks    | Dialog focus and archive confirmation covered by legacy tests | Unit + Next E2E smoke | Fully functional      |
| Tools/profile/settings            | `/tools/*`, protected           | Profile/settings states                         | Profile update, theme preference | Navigation preserves month                          | Mobile navigation and settings covered by Next/legacy E2E     | Next + legacy E2E     | Fully functional      |
| Authentication/protected routes   | auth and protected route groups | SSR redirects, session refresh, errors          | Login, logout, recovery          | Callback destinations remain constrained            | Keyboard-accessible forms and logout                          | Next auth E2E         | Fully functional      |
| Live backend/Supabase integration | all protected routes            | Not run in normal CI                            | Requires external services       | Contract inspected, not live-verified               | Requires non-production credentials                           | Live suite opt-in     | Requires verification |

Phase 5 does not claim live Supabase or `dwmc-api` verification. The opt-in
live suite remains an environment-dependent prerequisite before a production
cutover and before starting Phase 6.

Phase 5.1 implementation acceptance is complete. Phase 6 is not ready to
begin until the maintainer runs the live suite with dedicated non-production
credentials and accepts its results.

Phase 5 validation on the migration branch:

- Formatting, ESLint, and TypeScript checks pass.
- Vitest passes: 122 files and 437 tests.
- Next production build, legacy Vite build, and Storybook build pass.
- Next E2E passes: 10 tests, including the new feature parity workflows.
- Legacy Playwright passes: 54 tests.

#### Phase 5.1 legacy failure resolution

The six failures from the initial Phase 5.1 run were reproduced and classified:

| Failure                                                 | Classification               | Resolution                                                                                                                |
| ------------------------------------------------------- | ---------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| `e2e/app-layout.spec.ts` centered mobile primary action | Genuine responsive defect    | Centered the floating action and reserved a center gap in mobile navigation for both runtimes.                            |
| `e2e/forgot-password.spec.ts` accessibility             | Genuine accessibility defect | Corrected muted and primary color tokens and made auth links visibly underlined.                                          |
| `e2e/login.spec.ts` accessibility                       | Genuine accessibility defect | Same contrast and link-distinguishability correction.                                                                     |
| `e2e/reset-password.spec.ts` accessibility              | Genuine accessibility defect | Same contrast and link-distinguishability correction.                                                                     |
| `e2e/signup.spec.ts` accessibility                      | Genuine accessibility defect | Same contrast and link-distinguishability correction.                                                                     |
| `e2e/logout.spec.ts` previous-user summary              | Outdated test assumption     | Scoped the assertion to the Income card instead of the entire summary grid; the cache-isolation behavior remained intact. |

The focused six-file regression run passed 35/35 tests, followed by the full
legacy suite passing 54/54. No failures were skipped or weakened.

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
9. Node 24 is enforced locally and in GitHub Actions. The current stable
   Next.js documentation is version 16.4.0; its Node minimum is 20.9, so the
   repository's Node 24 constraint is compatible. Next.js and Storybook
   versions must still be selected against that constraint.
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

### Controlled cutover and transitional structure

The migration will use a **controlled cutover on `feat/migrate-to-nextjs`**, not
two complete applications running in parallel. The existing Vite application
already uses `src/app` as an application-architecture directory, which is also
the conventional Next.js App Router directory. Maintaining a second live route
tree under another name would duplicate layouts, routing, providers, and
feature entrypoints while making parity and cache/auth testing less reliable.

During the transition:

```text
src/
  app/                 # Next App Router after the shell cutover
  legacy-app/          # temporary Vite bootstrap/router/layout adapters only
  features/            # shared feature code; migrate entrypoints incrementally
  components/
  lib/
  shared/
  test/
```

`legacy-app/` is a temporary compatibility location for the current Vite
bootstrap/router files if the Vite rollback build needs them after `src/app`
is claimed by Next. It must not become a second feature implementation. Feature
pages, API modules, UI components, and domain utilities remain shared wherever
their browser/runtime requirements allow. If a Vite rollback is no longer
needed, `legacy-app/` is removed in the cutover cleanup PR.

The repository will not run Vite and Next against the same checkout at the same
time as two user-facing applications. Until the Next shell is ready, `dev`,
`build`, and `preview` remain Vite commands. Once the shell cutover lands,
`dev`, `build`, and `start` become Next commands; temporary `dev:legacy`,
`build:legacy`, and `preview:legacy` commands may remain only to produce a
rollback artifact from the legacy entrypoint. The existing Vite and React
Router dependencies are removed only after the Next runtime, tests, and
rollback artifact are accepted.

Both application runtimes use port `5182` when run, but never concurrently.
The independent `dwmc-api` remains on `localhost:3000`. Before cutover, Vite
continues proxying `/api/v1` to that backend. After cutover, Next uses an
explicit rewrite or server-only `DWMC_API_URL` for the same backend contract;
the choice must not silently change auth headers or cache behavior. Storybook
continues on `6006`.

For the controlled cutover, keep both environment namespaces only while the
legacy build exists: `VITE_*` for the rollback Vite build and `NEXT_PUBLIC_*`
plus server-only `DWMC_*` values for Next. CI runs the active runtime's checks
and a legacy build check until the rollback artifact is retired. TypeScript
includes shared source plus the active runtime configs; separate Vite/Next
config files must not weaken strictness. ESLint and Prettier run over both
configurations, with framework-specific rules added only after compatibility is
verified. Existing Vitest/RTL tests remain usable through a Vite-compatible
test project until their Next aliases/env setup is migrated; Storybook and
Playwright are switched after the runtime cutover, not duplicated indefinitely.

This strategy is preferable to parallel runtimes because it keeps one source of
truth for features, one active user-facing runtime, and one migration path.
Rollback is achieved by reverting/redeploying the last Vite artifact or
reverting the cutover PR, not by operating two production applications.

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
  used by Server Components, Route Handlers, and `proxy.ts`.

Use the root-level `proxy.ts` convention required by Next.js 16+ (not the
deprecated `middleware.ts`) to refresh the session and synchronize refreshed
cookies on the response. Proxy is Node.js-only in current Next.js 16 and
should be limited to request/session plumbing. Its matcher must exclude static
assets and other paths that do not need auth handling. Proxy redirects or
rewrites are not the application's authorization boundary.

Protected Server Components and layouts must independently verify the
authenticated identity with the current Supabase server guidance:
`supabase.auth.getUser()` performs an Auth-server verification request, while
`getSession()` reads cookie state and must not be treated as proof of identity.
Use `getClaims()` only where the current Supabase guidance and token-validation
requirements make that verification appropriate. A missing/invalid user
redirects before private data is fetched. Server Functions, Route Handlers,
and API adapters must repeat their own authorization checks rather than relying
on Proxy having run.

### Explicit responsibility boundaries

| Layer                             | Responsibility                                                                                                                                  | Explicitly not responsible for                                                                      |
| --------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| Next.js `proxy.ts`                | Refresh the Supabase SSR session and synchronize cookies; perform narrowly scoped request redirects/rewrites                                    | Primary authorization, resource ownership, financial rules, database access, or user-data decisions |
| Next.js Server Components/layouts | Verify the authenticated identity before rendering or fetching private data; use request-scoped clients and non-shared cache behavior           | Reimplementing backend authorization or trusting unverified cookie/session payloads                 |
| Client authentication             | Reflect session changes in UI, drive logout/navigation, submit auth forms, and clear TanStack Query data on identity changes                    | Final security decisions or access control                                                          |
| `dwmc-api`                        | Validate Supabase JWTs, enforce resource ownership and authorization, apply financial rules, perform database operations, and own API contracts | Frontend route composition or presentation                                                          |

The browser may optimistically know that a session exists for UX, but every
private backend request is still authorized by `dwmc-api`. Authenticated
financial responses must be request-scoped or explicitly non-shared; neither
Proxy nor a Server Component may create a process-global user cache.

### Auth flows

| Flow              | Target behavior                                                                                                                           |
| ----------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| Login/signup      | Client form submits through browser Supabase client; success lands at validated `next` or dashboard                                       |
| Anonymous pages   | Server layout redirects an existing user to dashboard                                                                                     |
| Protected pages   | Server layout verifies cookie session and redirects unauthenticated users                                                                 |
| Refresh           | `proxy.ts` refreshes/synchronizes cookies; Server Components verify identity; API requests use the current access token                   |
| Logout            | Client signs out, clears the previous user's Query cache, navigates to login; subsequent server requests see no valid cookie              |
| Password recovery | Auth callback exchanges the code for a cookie-backed session through a server route; validate same-origin return paths and recovery state |
| Reset password    | Keep reset form client-side, with server-safe callback route and no token logging                                                         |

The authentication lifecycle is therefore: the browser submits login/signup;
Supabase issues the session; `proxy.ts` refreshes cookies on later requests;
the protected layout verifies the user before private rendering; the server or
browser API adapter forwards the current bearer token; `dwmc-api` validates and
authorizes every request; logout clears the client session and cache. Switching
accounts must remove the prior user's queries before the next user's data is
rendered. Recovery uses the Supabase code-exchange callback and then follows
the same verified protected flow.

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

Replace the active Vite scripts/configuration with Next scripts
(`next dev`, `next build`, `next start`) at the controlled cutover. Before that
cutover, retain the existing Vite scripts as the active commands and expose
only explicitly named legacy commands if a rollback artifact must be rebuilt.
Do not make developers or CI choose between two live applications for normal
development. Keep port `5182` for the active frontend and `3000` for
`dwmc-api`; run only one frontend server at a time.

Classify variables:

| Current                  | Target role                                                                                         |
| ------------------------ | --------------------------------------------------------------------------------------------------- |
| `VITE_SUPABASE_URL`      | `NEXT_PUBLIC_SUPABASE_URL` (public)                                                                 |
| `VITE_SUPABASE_ANON_KEY` | `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` (public; follow current Supabase naming)                     |
| `VITE_API_URL`           | `NEXT_PUBLIC_API_URL` only if browser access is required; `DWMC_API_URL` for server-only API origin |
| `VITE_APP_URL`           | `NEXT_PUBLIC_APP_URL` for browser redirect construction, or server URL where possible               |

Use server-only names for private values and validate them at the boundary.
Never expose database credentials, backend secrets, service-role keys, or
private API tokens. Update `.env.example`, CI, Playwright config, auth callback
URLs, and deployment documentation together; do not leave a mixed Vite/Next
contract after cutover.

Port the Tailwind v4 integration, alias configuration, global CSS, public
assets, fonts, bundle-size reporting, and static `mockServiceWorker.js`.
Review `next.config` for API rewrites, image/font policy, headers, and bundle
analysis. Prefer a documented rewrite over an opaque proxy, and do not rely on
Next caching for authenticated API data. `proxy.ts` is a request boundary for
cookie/session work; it is not a replacement for an API proxy or authorization
layer.

## 16. Dependency Compatibility

Do not upgrade unrelated packages. The current stable Next.js documentation
identifies version 16.4.0, whose Node minimum is `>=20.9.0`; Node 24 satisfies
that requirement. Before implementation, verify the exact installable stable
version against React 19, TypeScript 6, Tailwind v4, Storybook 10, Vitest 4,
Playwright, ESLint 9, and the current Supabase package.
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

### Phase 1 — Next shell and controlled runtime cutover

**Objective:** Make Next the active runtime without changing auth or migrating
feature behavior yet.
**Prerequisites:** Phase 0 approved; a captured Vite validation result and a
known-good Vite rollback artifact.
**Files:** `package.json`, `next.config.*`, `tsconfig*.json`, `src/app/**`,
`src/legacy-app/**` only if needed for rollback, `src/main.tsx` or its retained
legacy entrypoint, `src/app/layout.tsx`, `src/app/providers.tsx`, env examples,
CI scripts.
**Steps:** Add the compatible Next package/config, establish the Next root
layout and provider boundary, move only the conflicting Vite bootstrap/router
files to the temporary legacy location if required, and make `next dev/build/
start` the active commands. Keep a separately named legacy build command; do
not run both servers concurrently.
**Dependencies:** No Supabase SSR dependency or route migration is required
for this milestone beyond compile-safe placeholders and existing public UI.
**Acceptance criteria:** Next starts on `5182`, the API remains on `3000`, the
root route renders a stable shell, global CSS and public assets load, shared
feature imports still typecheck, the Vite rollback artifact can be rebuilt,
and no `dwmc-api` endpoint changes are needed.
**Testing:** Next development and production build/start smoke test; existing
Vite validation; TypeScript, ESLint, formatting, and a minimal browser smoke
test for the shell.
**Done:** Next renders the public shell on port `5182`; global styles, aliases,
and metadata compile; the Vite rollback artifact rebuilds; the API remains
unchanged; and no authentication or private route is exposed by Next.
**Rollback:** Run `npm run dev:legacy`, rebuild with `npm run build:legacy`, or
redeploy the last Vite artifact. Do not run both frontend runtimes concurrently.

### Phase 2 — SSR authentication and protected proof-of-concept

**Objective:** Add cookie-backed Supabase SSR and prove the security boundary
on one route without migrating every feature.
**Prerequisites:** Phase 1 active runtime and rollback artifact accepted.
**Files:** `proxy.ts`, `src/lib/supabase/{browser,server}.ts`,
`src/app/(auth)/**`, `src/app/(protected)/layout.tsx`, one small protected
route, auth callback route, env examples, focused auth tests.
**Steps:** Add `@supabase/ssr`, implement `proxy.ts` for refresh/cookie
sync only, verify identity in the protected layout with the current Supabase
server API, and implement one callback/login/logout proof. Keep
`dwmc-api` authorization unchanged.
**Dependencies:** Phase 1; Supabase redirect URLs and local cookie behavior
must be available.
**Acceptance criteria:** Anonymous access redirects before private fetching;
authenticated access renders the proof route; refresh updates cookies; logout
removes the session; recovery callback exchanges the code safely; no client
session payload is used as the final authorization decision; user-specific
responses are not shared.
**Testing:** Proxy cookie tests, server identity verification tests, login,
refresh, logout, recovery, invalid-session, and cross-user cache-isolation
Playwright scenarios.
**Rollback:** Revert the auth PR and redeploy the Phase 1 shell/Vite artifact;
do not weaken the backend or leave an unverified protected route enabled.

**Implementation summary:** The proof implementation uses
`src/lib/supabase/browser.ts` for interactive auth and
`src/lib/supabase/server.ts` for request-scoped cookie access. Root-level
`proxy.ts` refreshes cookies only. The protected layout verifies identity with
`getUser()`, and `/protected-proof` calls the existing
`GET /api/v1/auth/me` contract through a server adapter that forwards
`Authorization: Bearer <access-token>` with `cache: 'no-store'`. The callback
exchanges a Supabase code for a cookie-backed session and accepts only
same-origin relative `next` paths. Logout clears the Supabase session through a
server route. Password recovery redirects include an explicit recovery flow
value; after a successful code exchange, the callback sets a short-lived
HttpOnly `dwmc-recovery` marker. The reset page requires that marker and a
currently verified Supabase user, then clears the marker after a successful
password update. A normal authenticated session cannot open the reset form
without completing the recovery callback.

**Backend integration risks and recommendations:** `dwmc-api` currently allows
one exact `APP_ORIGIN` for CORS and its checked-in CORS test uses
`http://localhost:5173`, while the web examples use `http://localhost:5182`.
Set `APP_ORIGIN` to the actual browser origin for each environment (or
explicitly broaden the backend allowlist in a separate backend change) before
direct browser API requests. This phase does not modify `dwmc-api`.
The backend only validates bearer tokens and does not read Next.js cookies, so
future SSR adapters must continue forwarding the access token. A valid token
only authenticates the Supabase identity; local profile existence, ownership,
and domain authorization remain backend responsibilities. Existing backend
401 responses cover absent/malformed/invalid/expired bearer tokens; resource
lookups may intentionally return not-found rather than exposing cross-user
ownership. No backend change is required for this SSR proof.

**Phase 2 acceptance evaluation:**

- [x] Anonymous access to `/protected-proof` redirects before private API
      fetching.
- [x] Authenticated access renders a server-verified proof route and forwards
      a matching bearer token to `dwmc-api`.
- [x] `proxy.ts` refreshes and synchronizes Supabase cookies without adding
      authorization rules.
- [x] Login, signup, forgot-password, reset-password, callback, and logout
      routes exist in Next.js.
- [x] Callback redirects allow only `/protected-proof` and `/reset-password`;
      external, protocol-relative, backslash, malformed, and auth-loop
      destinations fall back safely.
- [x] Reset-password access requires a successful recovery callback marker in
      addition to a verified current Supabase user; ordinary sessions cannot
      silently enter the form.
- [x] Logout clears the browser session and user-specific TanStack Query data.
- [x] Server API requests use `getUser()`, matching token identity, and
      `cache: 'no-store'`.
- [x] Unit, type, lint, format, Next build, legacy build, and Storybook checks
      pass. The deterministic Next authentication E2E suite passes 7/7.
- [ ] Live Supabase + `dwmc-api` browser integration is not proven in this
      local run; `npm run test:e2e:live` now fails closed unless configured
      credentials, redirect URLs, and both services are available.
- [x] A separate `playwright.next.config.ts` launches Next on port `5182`
      with a deterministic mock boundary; the existing Playwright command
      still launches the Vite rollback app.
- [ ] The selected legacy auth subset completed 16/20 tests; four existing
      accessibility/data assertions failed there and do not exercise the new
      Next SSR routes.

Phase 2 implementation and deterministic local validation are complete, with
live external-service browser integration remaining an explicit prerequisite
before production cutover. Phase 3 route composition and financial feature
migration must not begin until that integration coverage is executed and
passes.

An independent security review of the Phase 2 authentication boundary found no
exploitable vulnerabilities in the reviewed web or backend integration code.
The remaining limitation is runtime verification with real Supabase and API
services, not an identified security defect.

### Phase 3 — Route composition and navigation

**Objective:** Replace React Router route composition with App Router routes
while preserving feature internals and the month URL contract.
**Prerequisites:** Phase 2 auth contract passes.
**Files:** `src/app/**`, navigation/layout components, feature page entrypoints,
month navigation helper, navigation tests; remove temporary legacy route files
only when no rollback build needs them.
**Steps:** Add auth/protected route groups, route layouts, loading/error/not-found
files, and replace React Router navigation while preserving month params.
**Dependencies:** Phase 2 protected layout and callback behavior.
**Acceptance criteria:** Every current route resolves with correct auth behavior,
direct refresh/deep links work, dashboard/transactions/budgets preserve
`?month=YYYY-MM`, and no active route imports React Router.
**Testing:** Direct route, refresh, browser back/forward, redirect, keyboard
focus, and responsive E2E coverage.
**Rollback:** Revert route PR and redeploy the previous runtime; keep feature
internals unchanged.

### Phase 4 — API adapters and Query integration

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
**Rollback:** Keep the browser adapter and disable server prefetch per feature;
redeploy the previous runtime if the active API path is affected.

### Phase 5 — Feature and UX parity

**Prerequisites:** Route and API foundations pass.
**Files:** Feature route pages/components only where needed, month/navigation
helpers, forms, metadata, loading/error states.
**Steps:** Migrate dashboard, transactions, budgets, accounts, categories,
profile, settings, and auth pages in small feature PRs.
**Risks:** Business behavior changes hidden in page rewrites.
**Tests:** Existing feature tests plus route-level acceptance matrix.
**Done:** All feature preservation requirements pass at desktop/mobile sizes.
**Rollback:** Revert only the affected feature PR.

### Phase 6 — Storybook and test tooling

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

### Phase 7 — CI cleanup and Vite/React Router removal

**Prerequisites:** Phases 1–5 accepted.
**Files:** workflows, env docs, scripts, `next.config`, README links.
**Steps:** Add Next build/start validation, production-like E2E, deployment
headers/rewrites, bundle reporting, retire the legacy Vite artifact, then
remove Vite/React Router dependencies and temporary legacy files.
**Risks:** Deployment runtime, API origin, cache headers, missing env values.
**Tests:** Full validation matrix on CI and production-like deployment.
**Done:** CI is green, all acceptance criteria pass, rollback artifact/runbook
exists, and the migration is approved for main.
**Rollback:** Redeploy last Vite artifact and revert cutover PR; backend remains
unchanged.

## 18. File-Level Migration Checklist

- [x] `package.json` scripts, dependencies, engines, and lockfile for the shell.
- [x] `next.config.*`, `tsconfig` references, aliases, global CSS, public assets.
- [x] `src/app/layout.tsx`, the public shell page, and provider boundary.
- [x] `src/app/providers.tsx` and client-only provider boundary.
- [ ] Root-level `proxy.ts` and `src/lib/supabase/browser.ts`/`server.ts`.
- [ ] `src/lib/api-client.ts` shared error parsing and server adapter.
- [ ] `src/lib/query/*` QueryClient lifecycle and hydration policy.
- [ ] Auth forms/services/hooks, callback and recovery storage behavior.
- [ ] Navigation components and month-preserving link helper.
- [ ] Feature route entrypoints; feature internals only when required.
- [ ] `.storybook/main.ts`, `.storybook/preview.ts`, router/theme/MSW decorators.
- [ ] `vitest.config.ts`, `src/test/setup.ts`, render helpers, MSW handlers.
- [ ] `playwright.config.ts`, auth fixtures, base URL, dev/build server.
- [x] `.env.example` and CI rollback-build configuration; deployment docs remain
      pending the target platform decision.
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
- `proxy.ts` refreshes/synchronizes cookies only, while protected layouts and
  Server Components verify sessions server-side before private work;
- `dwmc-api` remains the sole authority for JWT validation, ownership,
  authorization, financial rules, database operations, and API contracts;
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

Keep the last known-good Vite deployment available until the Next.js runtime
and authentication cutover have passed a full observation window. Each phase
must be independently revertible and must not require backend schema or
endpoint changes. Preserve both environment mappings and the previous
deployment command while the legacy artifact exists. If auth, API, or cache
isolation fails, redeploy the Vite artifact or revert the affected frontend PR;
do not operate both runtimes in production and do not change `dwmc-api`.

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
   `proxy.ts` runtime behavior?
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

## 24. Recommended First Implementation Milestones

The original “shell + SSR auth + protected route” proposal is too broad for
one reviewable PR. Use these sequential milestones instead:

1. **Next shell and controlled runtime cutover** — the Phase 1 milestone above.
   It can be built and validated independently with no auth behavior change.
2. **SSR authentication foundation** — the Phase 2 milestone above. It adds
   `@supabase/ssr`, `proxy.ts`, server verification, and one proof route only.
3. **Route migration** — the Phase 3 milestone above. It moves route composition
   and navigation after the auth boundary is proven.

The first implementation PR should therefore be titled **“Add Next.js shell and
controlled runtime cutover”**, not an auth migration. Its definition of done
is a working Next shell on port `5182`, a rebuildable Vite rollback artifact,
strict checks passing, unchanged backend behavior, and no new security claim.

### Official documentation to re-check during implementation

- [Next.js App Router](https://nextjs.org/docs/app)
- [Next.js 16.4.0 Proxy documentation](https://nextjs.org/docs/app/api-reference/file-conventions/proxy)
- [Next.js authentication](https://nextjs.org/docs/app/building-your-application/authentication)
- [Next.js route handlers](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)
- [Next.js environment variables](https://nextjs.org/docs/app/building-your-application/configuring/environment-variables)
- [Supabase server-side auth](https://supabase.com/docs/guides/auth/server-side)
- [Storybook Next.js/Vite framework](https://storybook.js.org/docs/get-started/frameworks/nextjs-vite)
