# Frontend Routing

The router in `src/app/router/router.tsx` uses React Router with an authenticated application shell and a separate authentication shell.

## Route Map

| Route               | Access                 | Behavior                         |
| ------------------- | ---------------------- | -------------------------------- |
| `/`                 | Public                 | Redirects to `/login`.           |
| `/login`            | Public                 | Sign-in screen.                  |
| `/signup`           | Public                 | Account creation screen.         |
| `/forgot-password`  | Public                 | Password recovery request.       |
| `/reset-password`   | Public                 | Password reset screen.           |
| `/dashboard`        | Protected              | Monthly summary dashboard.       |
| `/transactions`     | Protected              | Transaction list and management. |
| `/budgets`          | Protected              | Monthly budgets.                 |
| `/accounts`         | Protected              | Account management.              |
| `/categories`       | Protected              | Section and category management. |
| `/tools`            | Protected              | Tools index.                     |
| `/tools/categories` | Protected              | Redirects to `/categories`.      |
| `/style-guide`      | Protected              | In-app UI reference page.        |
| any unmatched path  | Public router fallback | Not-found page.                  |

The protected application index redirects to `/dashboard`. `ProtectedRoute` is responsible for redirecting unauthenticated users to `/login`.

## Selected Month

The selected month is represented by the URL query parameter `month=YYYY-MM`.

Examples:

- `/dashboard?month=2026-06`
- `/transactions?month=2026-06`
- `/budgets?month=2026-06`

`useSelectedMonth` is the source of truth. A missing or invalid value is read as the current calendar month; the hook does not rewrite the URL until the user changes month. Month navigation uses `replace: true`, and navigation links preserve the current month when they build their destination.

Dashboard, Transactions, and Budgets consume the selected month. Transaction entry uses it when choosing a default date. Other routes may preserve the query parameter without using it for their own data.

## Application Navigation

- `MonthNavigator` provides previous and next month controls in the layouts where monthly views need them.
- `DesktopSidebar` includes Overview, Budgets, Transactions, Accounts, and Tools.
- `AppBottomNavigation` includes Overview, Budgets, Accounts, and Tools, with the center slot reserved for the contextual action.
- Tools uses pathname-prefix matching so nested tools remain active.
- `ContextualFloatingActionButton` renders the action registered by the active page. Current registrations include transaction, budget, account, and category creation actions; Tools has no default action.

The Tools page links Categories and the Style Guide. Profile and Settings remain placeholders and are not documented as implemented screens.
