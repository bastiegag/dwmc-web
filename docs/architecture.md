# Frontend Architecture

## Responsibility and boundaries

`dwmc-web` owns the browser experience: routing, layouts, forms, presentation,
accessibility, Supabase Auth integration, and coordination of backend server
state. It does not authorize users, persist domain data, or replace backend
financial calculations.

```text
Browser -> dwmc-web -> dwmc-api -> Prisma -> local PostgreSQL
                   \-> Supabase Auth -> access token -> dwmc-api
```

The backend remains authoritative for ownership, validation, persistence,
balances, budgets, and summaries. Frontend route protection improves user
experience but is not authorization. See the sibling repository's
[API documentation](../../dwmc-api/docs/api.md) and
[authentication documentation](../../dwmc-api/docs/domains/auth.md) for server
implementation details.

## Application flow

```text
page
→ feature hook
→ feature API module
→ src/lib/api-client.ts
→ dwmc-api
```

Supabase Auth provides the browser session. The shared API client reads the
session and sends the access token to the backend; feature code must not attach
headers manually or call `fetch` for domain requests.

## Source layout

| Path                       | Responsibility                                                                                                      |
| -------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| `src/app/`                 | Bootstrap, router, layouts, providers, and app-level pages.                                                         |
| `src/components/ui/`       | Shared shadcn-style primitives.                                                                                     |
| `src/components/form/`     | Reusable form fields and validation presentation.                                                                   |
| `src/components/layout/`   | Application shell, navigation, and layout elements.                                                                 |
| `src/components/feedback/` | Loading, error, and query-state components.                                                                         |
| `src/features/`            | Domain vertical slices such as auth, dashboard, accounts, transactions, budgets, categories, profile, and settings. |
| `src/lib/`                 | API client, Supabase client, QueryClient, formatting, and low-level helpers.                                        |
| `src/shared/`              | Cross-feature systems such as month navigation, date helpers, theme, errors, and contextual actions.                |
| `src/styles/`              | Global CSS, Tailwind theme tokens, typography, radius, and utilities.                                               |
| `src/stories/`             | Foundation and pattern Storybook stories.                                                                           |
| `src/test/`                | Shared Vitest setup, fixtures, MSW handlers, render helpers, and test utilities.                                    |

Feature folders commonly contain `api/`, `components/`, `hooks/`, `pages/`,
`schemas/`, `types/`, and a public `index.ts`. The exact folders vary by
feature; follow the existing slice rather than creating empty layers. Imports
between features should use the public `index.ts` boundary.

## Providers and routing

`src/main.tsx` validates frontend environment configuration, then mounts the
error boundary, application providers, and router. Providers currently include
TanStack Query, the theme provider, Supabase auth-session synchronization, and
the toast renderer. Routes are lazy-loaded and render through auth or
application layouts.

The root route redirects to `/login`. Protected application routes include:

- `/dashboard`
- `/transactions`
- `/budgets`
- `/accounts`
- `/categories`
- `/tools`
- `/tools/profile`
- `/tools/settings`

Anonymous auth routes are `/login`, `/signup`, and `/forgot-password`.
`/reset-password` remains available for an authenticated recovery session.
`/tools/categories` redirects to `/categories`; unmatched routes render the
not-found page.

## State ownership

| State                                                 | Owner                                                        |
| ----------------------------------------------------- | ------------------------------------------------------------ |
| Supabase session                                      | Supabase Auth, synchronized into TanStack Query.             |
| Accounts, categories, sections, transactions, budgets | Backend plus TanStack Query.                                 |
| Monthly summary                                       | Backend plus TanStack Query.                                 |
| Selected month                                        | URL query parameter `month=YYYY-MM`.                         |
| Form inputs and validation                            | React Hook Form plus Zod.                                    |
| Dialog visibility and temporary UI state              | Local component state.                                       |
| Contextual primary action                             | Shared primary-action context registered by the active page. |
| Theme preference                                      | Existing ThemeProvider and its storage key.                  |
| Last transaction date per month                       | Local-storage UX helper.                                     |

TanStack Query keys include every response-changing filter, including `month`
and the dashboard summary's `recentLimit`. Mutations invalidate affected query
families rather than manually refetching. Cross-feature invalidation is
intentional when a transaction affects accounts, budgets, or dashboard data.

## Month and navigation rules

The selected month is URL state on dashboard, transactions, and budgets routes.
Missing or invalid values fall back to the current local calendar month without
rewriting the URL. Month navigation uses replacement history and preserves
unrelated query parameters. Application links preserve the selected month.

Mobile global navigation exposes Overview, Budgets, Accounts, and Tools.
Transactions remains an independent route exposed through dashboard secondary
navigation. Desktop navigation also includes Transactions. The contextual
floating action is registered by the active page and rendered by the layout.

## Feature boundaries

- Keep backend calls in feature `.api.ts` modules.
- Keep server state in feature query and mutation hooks.
- Keep schemas outside React components.
- Keep feature-specific logic inside its feature.
- Put genuinely cross-feature behavior in `src/shared/`.
- Keep reusable UI primitives outside feature folders.
- Keep backend-derived financial values authoritative in API responses.

For frontend conventions, testing, API integration, routing details, and design
system rules, see [development](development.md), [testing](testing.md),
[API integration](api.md), [routing](frontend-routing.md), and
[design system](design-system.md).
