# ADR 0001: Adopt Next.js App Router

- **Status:** Proposed
- **Date:** 2026-10-13
- **Decision owners:** Frontend maintainers
- **Related:** [Next.js migration plan](../nextjs-migration-plan.md)

## Context

`dwmc-web` is currently a React 19 and TypeScript application built with Vite and
React Router. It has a feature-oriented source tree, TanStack Query, browser
Supabase authentication, React Hook Form/Zod, Tailwind CSS v4, Radix/shadcn
components, Storybook 10, Vitest, MSW, and Playwright. The local Vite server
proxies `/api/v1` to the independently maintained `dwmc-api` Node.js service.

The application is a portfolio project and would benefit from demonstrating
Next.js App Router, server-rendered route composition, and server-side
authentication checks. The backend already owns JWT validation, authorization,
financial rules, Prisma, PostgreSQL, and the API contract. Moving those
responsibilities into Next.js would create a second backend and is out of
scope.

The current browser-only Supabase client and client-side route guards are not
sufficient as the only server-side access-control boundary. The migration must
also preserve financial data isolation, the existing feature behavior, the
design system, accessibility, and the independent backend boundary.

## Decision

Adopt Next.js App Router incrementally while preserving the existing feature
modules and backend API.

The target application will:

1. Put route composition in `src/app`, using route groups such as `(auth)` and
   `(protected)`, layouts, `loading.tsx`, `error.tsx`, and `not-found.tsx`.
2. Keep domain features in `src/features`, shared UI in `src/components`, shared
   cross-feature concerns in `src/shared`, infrastructure in `src/lib`, and
   test utilities in `src/test`.
3. Use `@supabase/ssr` browser and server clients with cookie-backed sessions.
   The Next.js 16+ `proxy.ts` convention will refresh/synchronize the session
   cookies only. Protected layouts and Server Components will verify the
   authenticated user on the server before rendering user-specific data.
4. Keep `dwmc-api` as the source of truth for authorization and business logic.
   Server requests will forward the Supabase bearer token to the API. Client
   requests will continue to use the browser client where interactivity requires
   it. A Next.js Route Handler is permitted only for a concrete same-origin,
   security, or cookie orchestration need.
5. Continue using TanStack Query for interactive client data, mutations, and
   invalidation. Any server-prefetched data must be explicitly scoped to the
   authenticated user and hydrated into the client cache without shared
   user-specific caching.
6. Preserve the `?month=YYYY-MM` URL contract and all current routes, forms,
   navigation surfaces, responsive behavior, and test suites.
7. Migrate Storybook to the compatible Next.js framework only after the
   application runtime is stable; retain the existing Design System /
   Foundations, Components, Patterns, and Product organization.

The transition is a controlled cutover on `feat/migrate-to-nextjs`, not two
parallel applications. Next claims the existing `src/app` directory when the
shell milestone lands. The current Vite bootstrap/router may temporarily live
under `src/legacy-app` only to rebuild a rollback artifact; feature modules are
not duplicated. Vite and Next use port 5182 at different times, while
`dwmc-api` remains on port 3000. The first implementation PR is shell-only.
SSR authentication and the first protected route are a subsequent milestone,
followed by route composition migration.

## Alternatives considered

### Keep Vite and React Router

This has the lowest migration risk and is a valid fallback if the portfolio
or server-rendering goals are withdrawn. It does not provide the desired
App Router/server-component experience or a natural server-side auth boundary.

### Use a separate SSR framework or a second frontend

This would duplicate routing and deployment knowledge and would not justify
the additional operational cost for this application.

### Move the API and domain logic into Next.js

Rejected. It would duplicate or replace `dwmc-api`, split authorization and
financial rules across repositories, and violate the requirement that the
backend remain independently maintainable.

### Add a full Next.js BFF proxy for every API request

Rejected as the default. It adds latency, error translation, cache semantics,
and duplicated request plumbing without improving the existing backend
contract. Route Handlers remain an explicit, narrowly scoped option.

## Reasons for adopting Next.js

- App Router gives route-level layouts, loading UI, error boundaries, and
  server-side redirects that map well to the authenticated shell.
- Server Components can compose stable page chrome and server-verified auth
  without turning every reusable component into a Client Component.
- Next.js provides a production build and deployment model suitable for the
  portfolio objective.
- The framework offers a clear place for server-only environment variables and
  request-scoped cookies while retaining React 19 and the current component
  library.

## Reasons for retaining the independent Node.js backend

- `dwmc-api` owns JWT validation, authorization, financial calculations, Prisma,
  PostgreSQL, and domain endpoints.
- The API can continue serving future clients, including React Native/Expo.
- Independent deployment and testing boundaries reduce the blast radius of a
  frontend migration.

## Tradeoffs

The migration introduces server/client boundaries, two Supabase client
implementations, cookie refresh behavior, a controlled runtime cutover, and
more deployment configuration.
Some current browser-only modules will need explicit `'use client'` boundaries.
Server-side rendering also creates cache-isolation obligations that do not exist
in the same form in a purely browser-rendered Vite app.

The benefit is a server-aware routing and authentication model without
duplicating the backend. The incremental plan keeps each change reviewable and
allows the Vite application to remain the rollback artifact until the controlled
cutover is accepted. Parallel production runtimes are intentionally rejected.

## Security considerations

- Only the Supabase public/publishable key may be exposed to the browser.
- No API secret, service-role key, database credential, or backend token belongs
  in `NEXT_PUBLIC_*` variables or client bundles.
- `proxy.ts` refreshes cookies only; protected server code verifies the user
  before user-specific work. Do not treat a decoded client session as
  authorization.
- Server Components and layouts use the current Supabase server verification
  API before rendering or fetching private data. Client auth state is retained
  for UI updates, logout/navigation, and TanStack Query cache cleanup, not as
  the final security boundary.
- The backend must continue validating the forwarded JWT and enforcing domain
  authorization, ownership, and financial rules. Client auth is for UX and
  cache cleanup, not the final security boundary.
- Dynamic authenticated responses must not enter a shared cache. Query keys and
  server fetches must be scoped to the user/request where applicable.
- Auth callback redirect destinations must be same-origin and validated.
- Logout and user changes must clear the TanStack Query cache for the previous
  identity before rendering data for another identity.

## Consequences

Positive:

- A production-minded App Router architecture with meaningful Server Component
  boundaries.
- Server-side redirects and auth checks reduce reliance on client guards.
- The existing backend, feature boundaries, UI system, and test investment are
  preserved.

Negative:

- Migration work is required for routing hooks, environment names, auth
  callbacks, test bootstrapping, and Storybook framework configuration.
- The team must understand Next.js caching and request lifecycle semantics.
- Some integration tests need separate browser and server test seams.

## Risks

The highest risks are auth cookie refresh regressions, accidental user-data
cache sharing, API origin misconfiguration, hidden React Router assumptions in
components and tests, and confusion from maintaining two runtime entrypoints.
These are addressed by a shell-only first PR, a separate SSR auth milestone,
explicit no-cache defaults for authenticated data, route-by-route acceptance
tests, and a controlled cutover with rollback to the Vite artifact rather than
parallel production runtimes.

The first implementation milestone is intentionally limited to the Next shell
and controlled runtime cutover. Its independent definition of done is a
working Next build/start path, strict checks, stable shared imports, and a
rebuildable Vite rollback artifact. It does not claim to provide SSR
authentication until the following milestone.

## Validation references

The migration plan is based on the repository at `feat/migrate-to-nextjs` and
the current `main`/`origin/main` commit observed on 2026-10-13. Framework
behavior should be checked against the official documentation before each
implementation PR:

- [Next.js App Router documentation](https://nextjs.org/docs/app)
- [Next.js 16.4.0 Proxy documentation](https://nextjs.org/docs/app/api-reference/file-conventions/proxy)
- [Next.js authentication guidance](https://nextjs.org/docs/app/building-your-application/authentication)
- [Next.js Route Handlers](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)
- [Supabase SSR package](https://supabase.com/docs/guides/auth/server-side)
- [Storybook Next.js framework](https://storybook.js.org/docs/get-started/frameworks/nextjs-vite)

The current Next.js documentation identifies version 16.4.0 and requires Node
`>=20.9.0`; this repository's Node 24 constraint is compatible. The exact
stable package version must still be rechecked before the dependency PR.
