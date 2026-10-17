# Frontend Routing and Navigation

## Overview

The active runtime uses Next.js App Router route groups under `src/app`.

The protected shell is rendered by the app layout, while auth screens use a dedicated auth layout.

## Main App Routes

The current route map includes:

- `/dashboard`
- `/transactions`
- `/budgets`
- `/accounts`
- `/tools`
- `/categories`
- `/login`
- `/signup`
- `/forgot-password`
- `/reset-password`

The Next.js routes use `(auth)` and `(protected)` groups. The protected layout
performs the server-side Supabase user check once, while client feature pages
retain TanStack Query and browser interaction behavior.
The `/tools/categories` path redirects to `/categories`.

## Phase 3 Route Migration Matrix

| Legacy path         | Next path          | Layout        | Auth            | Entry component    | Client boundary | Query state       | Coverage      |
| ------------------- | ------------------ | ------------- | --------------- | ------------------ | --------------- | ----------------- | ------------- |
| `/`                 | `/`                | root          | redirect        | root redirect      | server          | none              | auth E2E      |
| `/login`            | `/login`           | `(auth)`      | anonymous       | `AuthForm`         | client form     | `error`           | auth E2E      |
| `/signup`           | `/signup`          | `(auth)`      | anonymous       | `AuthForm`         | client form     | none              | auth E2E      |
| `/forgot-password`  | `/forgot-password` | `(auth)`      | anonymous       | `AuthForm`         | client form     | none              | auth E2E      |
| `/reset-password`   | `/reset-password`  | `(auth)`      | public recovery | reset form         | client form     | recovery hash     | auth E2E      |
| `/dashboard`        | `/dashboard`       | `(protected)` | required        | `DashboardPage`    | client page     | `month`           | unit + E2E    |
| `/transactions`     | `/transactions`    | `(protected)` | required        | `TransactionsPage` | client page     | `month`           | unit + E2E    |
| `/budgets`          | `/budgets`         | `(protected)` | required        | `BudgetsPage`      | client page     | `month`           | unit + E2E    |
| `/accounts`         | `/accounts`        | `(protected)` | required        | `AccountsPage`     | client page     | `month` preserved | unit          |
| `/categories`       | `/categories`      | `(protected)` | required        | `CategoriesPage`   | client page     | `month` preserved | unit          |
| `/tools`            | `/tools`           | `(protected)` | required        | `ToolsPage`        | client page     | `month`           | unit          |
| `/tools/profile`    | `/tools/profile`   | `(protected)` | required        | `ProfilePage`      | client page     | `month` preserved | unit          |
| `/tools/settings`   | `/tools/settings`  | `(protected)` | required        | `SettingsPage`     | client page     | `month` preserved | unit          |
| `/tools/categories` | `/categories`      | `(protected)` | required        | redirect           | server/client   | `month`           | legacy router |

## Month-Based Navigation

The selected month is stored in the URL query string as `month=YYYY-MM`.

Month URL state has explicit runtime providers:

- `NextMonthProvider` uses `useSearchParams`, `usePathname`, and
  `router.replace()` in the active App Router shell.
- Feature components consume the framework-independent `useSelectedMonth`
  context interface and do not import either router.

Both providers preserve unrelated query parameters and keep the URL as the
single source of truth. No direct History API mutation or runtime router
detection is used.

Rules:

- If `month` is missing, the app falls back to the current month.
- If `month` is invalid, the app falls back to the current month.
- The month is not stored in localStorage.
- Dashboard, Transactions, and Budgets use the selected month.
- Navigation links preserve the current month.

Examples:

- `/dashboard?month=2026-06`
- `/transactions?month=2026-06`
- `/budgets?month=2026-06`

## Month Navigator

The shared month navigator appears in the app layout on the dashboard, transactions, and budgets screens.

It uses the selected month from the URL and moves one month backward or forward at a time.
Navigation updates the query string with `replace: true` so month changes do not create extra history entries.
The Next runtime uses the App Router replacement API, including back/forward and
direct URL access.

## Bottom Navigation

The mobile bottom navigation links to the main app destinations and preserves the current month in each link.

Current mobile global destinations:

- Overview
- Budgets
- Accounts
- Tools

Transactions is not a mobile global destination. It remains an independent
`/transactions` route and feature, exposed through the Dashboard section's
secondary navigation alongside `/dashboard`.

The Dashboard global item is active on both `/dashboard` and `/transactions`.
Within the secondary navigation, Overview is active on `/dashboard` and
Transactions is active on `/transactions`. The active route is highlighted
based on the current pathname.
Tools uses prefix matching so nested tool routes remain active when the user drills into them.

Example:

If the current URL is `/budgets?month=2026-05`, tapping Accounts navigates to `/accounts?month=2026-05`.

## Desktop Navigation

The desktop sidebar shows the same main destinations plus Transactions.
It also preserves the month in its links and highlights the active route.

## Contextual Floating Action

The shared floating `+` button is registered by the active page and rendered by the app layout.

Current behavior:

- Dashboard: add transaction
- Transactions: add transaction
- Budgets: add budget
- Accounts: add account
- Categories: add section or add category, depending on whether any sections exist
- Tools: hidden unless a page registers an action

The action is page-driven so the layout can stay generic.

## Tools Route

The current Tools page contains:

- Categories
- Profile
- Settings

Categories links to `/categories`; Profile and Settings link to `/tools/profile`
and `/tools/settings`. Profile owns the user's application profile fields, while
Settings currently owns the device-local theme preference.

## Route Guidelines

- Use links for navigation.
- Use buttons for actions.
- Preserve month in app navigation where relevant.
- Keep route-level logic in pages or layouts, not low-level components.
- Avoid duplicating navigation config when a shared nav source already exists.

The local Next.js server serves the App Router during development. Direct
navigation and refreshes of nested routes should be covered by local browser
tests.

## Phase 5 route verification

The Next deterministic browser suite verifies protected deep links and
month-preserving navigation between Dashboard, Transactions, and Budgets. It
also exercises the migrated Accounts, Categories, Tools/Profile, and Settings
routes through the shared feature pages. Broader CRUD, validation, responsive,
and accessibility coverage is maintained in component and feature tests.
