# Frontend Routing and Navigation

## Overview

The app uses React Router with a protected application area and a separate auth area.

The protected shell is rendered by the app layout, while auth screens use a dedicated auth layout.

## Main App Routes

The current route map includes:

- `/dashboard`
- `/transactions`
- `/budgets`
- `/accounts`
- `/tools`
- `/style-guide`
- `/categories`
- `/login`
- `/signup`
- `/forgot-password`
- `/reset-password`

The root route redirects to `/login`.
The protected app index route redirects to `/dashboard`.
The `/tools/categories` path redirects to `/categories`.

## Month-Based Navigation

The selected month is stored in the URL query string as `month=YYYY-MM`.

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

## Bottom Navigation

The mobile bottom navigation links to the main app destinations and preserves the current month in each link.

Current destinations:

- Overview
- Budgets
- Accounts
- Tools

The active route is highlighted based on the current pathname.
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
- Style Guide
- Profile placeholder
- Settings placeholder

Categories and Style Guide currently link to real screens.
Profile and Settings are present as disabled placeholders and are not implemented routes.

## Style Guide Route

`/style-guide` is a protected, development-oriented reference page that documents the current UI foundation in-app.

- It renders inside the authenticated app layout.
- It reuses canonical components rather than duplicating primitives.
- It is intentionally useful on both desktop and mobile.
- It can be reached from the Tools page.

## Route Guidelines

- Use links for navigation.
- Use buttons for actions.
- Preserve month in app navigation where relevant.
- Keep route-level logic in pages or layouts, not low-level components.
- Avoid duplicating navigation config when a shared nav source already exists.

The local Vite server serves the SPA during development. Direct navigation and refreshes of nested routes should be covered by local browser tests.
