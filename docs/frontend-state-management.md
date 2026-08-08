# Frontend State Management

State belongs to the smallest owner that can provide the required lifetime and sharing.

| State                                                 | Owner                                                                             |
| ----------------------------------------------------- | --------------------------------------------------------------------------------- |
| Supabase session                                      | Supabase Auth, synchronized into TanStack Query.                                  |
| Accounts, categories, sections, transactions, budgets | Backend plus TanStack Query.                                                      |
| Monthly summary                                       | Backend plus TanStack Query.                                                      |
| Selected month                                        | URL query parameter `month=YYYY-MM`.                                              |
| Form inputs and validation                            | React Hook Form plus Zod.                                                         |
| Dialog visibility and temporary UI state              | Local component state.                                                            |
| Contextual primary action                             | Primary-action React Context because the layout renders it and pages register it. |
| Theme preference                                      | Existing ThemeProvider and its storage key.                                       |
| Last transaction date per month                       | `localStorage` UX helper.                                                         |

## TanStack Query

Query hooks wrap feature API functions. Query keys include filters that change the response, including `month` and the dashboard summary's `recentLimit`. Mutations use query invalidation rather than manual `refetch()` when the affected key is known.

The current observed invalidation rules are:

| Mutation                            | Invalidated keys                     |
| ----------------------------------- | ------------------------------------ |
| Transaction create, update, archive | Transaction lists and account lists. |
| Budget create, update, archive      | Budget lists and dashboard lists.    |
| Account create, update, archive     | Account lists.                       |
| Category create, update, archive    | Category lists and section lists.    |
| Section create, update, archive     | Section lists.                       |
| Dashboard retry                     | Dashboard lists.                     |

This table describes current implementation, not a promise that every derived view is already invalidated. When changing a mutation, inspect the relevant hooks and backend effects across both repositories.

## Context and Storage Boundaries

Do not put backend collections, selected month, or form state in React Context. Do not use `localStorage` for domain records or authorization. Small browser preferences and the transaction-date helper are the current exceptions.
