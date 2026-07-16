# Frontend State Management

## Overview

The app separates state by responsibility:

- URL state
- Server state
- Form state
- Local UI state
- Small browser UX helpers

## URL State

The selected month belongs in the URL.

Examples:

- `?month=2026-06`

URL state is the source of truth for navigational state that should survive refreshes and sharing.

## Server State

Backend data is managed with TanStack Query.

Current server-backed domains include:

- transactions
- budgets
- accounts
- categories and sections
- monthly summary data

Rules:

- Query keys must include filters such as `month`.
- Mutations invalidate affected queries after success.
- Prefer invalidation over manual refetches whenever a shared query key exists.
- Use exported query-key helpers instead of raw string literals.
- The current dashboard retry behavior invalidates `dashboardQueryKeys.lists()`.

Examples of invalidation behavior in the current app:

- Transaction mutations invalidate `transactionQueryKeys.lists()` and `accountQueryKeys.lists()`.
- Budget mutations invalidate `budgetQueryKeys.lists()` and `dashboardQueryKeys.lists()`.
- Account mutations invalidate `accountQueryKeys.lists()`.
- Category mutations invalidate `categoryQueryKeys.lists()` and `sectionQueryKeys.lists()`.
- Section mutations invalidate `sectionQueryKeys.lists()`.

Current feature key factories follow the same shape:

- `accountQueryKeys`
- `budgetQueryKeys`
- `categoryQueryKeys`
- `dashboardQueryKeys`
- `sectionQueryKeys`
- `transactionQueryKeys`

## Form State

React Hook Form owns form input state.
Zod owns validation.

- Form state should not be stored globally.
- Form schemas live outside components.
- Dialog forms should reset when they close if the next open should start fresh.

## Local UI State

Local state is appropriate for dialog open and close behavior, selected item editing, and temporary error messages.

Examples:

- create/edit dialogs on the budgets, transactions, accounts, and categories screens
- inline loading and error states
- temporary archive and submit error messages

## React Context

React context is reserved for shared cross-layout concerns.

Current acceptable use cases:

- auth/session sync provider
- contextual primary action state
- theme provider

Avoid using context for:

- server data that TanStack Query already owns
- large feature datasets
- state that belongs in the URL

## LocalStorage

LocalStorage is only used for small browser UX helpers.

Do not store app domain data or the selected month in localStorage.

Current uses in the codebase:

- theme preference
- the last transaction date per month, used to prefill the next transaction entry

Example shape for the transaction date helper:

```json
{
    "2026-05": "2026-05-14",
    "2026-06": "2026-06-08"
}
```

## State Ownership Rules

| State                           | Owner                    |
| ------------------------------- | ------------------------ |
| selected month                  | URL                      |
| transactions                    | backend + TanStack Query |
| budgets                         | backend + TanStack Query |
| accounts                        | backend + TanStack Query |
| categories and sections         | backend + TanStack Query |
| form inputs                     | React Hook Form          |
| dialog open state               | local component state    |
| contextual `+` action           | PrimaryAction context    |
| last transaction date per month | localStorage UX helper   |
