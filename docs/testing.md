# Frontend Testing

## Overview

The project uses a layered testing setup with:

- Vitest for unit and component tests
- Testing Library for user-focused React tests
- Playwright for end-to-end tests
- Storybook for interactive UI documentation
- MSW for request mocking in tests and stories

## Unit Tests

Use unit tests for pure utilities and validation logic.

Good candidates include:

- month helpers
- date helpers
- formatters
- storage helpers
- Zod schemas
- small data transformations

## Component Tests

Use component tests for isolated UI behavior such as:

- forms
- cards
- lists
- empty states
- loading states
- error states
- navigation components
- the contextual primary action button

## Integration Tests

Use integration tests for flows that combine UI, hooks, and mocked API data.

Good examples:

- page-level render flows with mocked backend data
- TanStack Query behavior
- dialog open and submit flows
- query invalidation after mutations when practical

When asserting query invalidation, prefer the shared query-key helpers used by the implementation, such as `budgetQueryKeys.lists()` and `dashboardQueryKeys.lists()`.

For month-aware navigation assertions, prefer the shared test helper in `src/test/utils/render.tsx`:

- `renderMonthAwareNavigation(ui, month, initialPath?)`
- `MonthLocationProbe`

Use that helper for bottom navigation and desktop sidebar tests so the setup stays identical.

## E2E Tests

Playwright is available for end-to-end coverage.

Useful flows include:

- sign in
- create a transaction
- create a budget
- change the selected month
- verify transactions reflect the selected month
- verify budget progress updates
- navigate with the bottom navigation
- use the contextual `+` button

## Storybook

Storybook is used for reusable UI states.

Use stories for:

- cards
- forms
- empty states
- navigation elements
- design-system-like UI pieces

Stories document component behavior, but they do not replace tests.

The in-app Style Guide has a different role: it shows the complete UI foundation in one authenticated page, while Storybook stays focused on isolated components and states.

Use tests for the Style Guide itself to cover route rendering, key section headings, navigation entry points, and a few interactive examples like theme toggles and toast triggers.

## What To Test By Feature

### Month Navigation

- Defaults to the current month.
- Rejects invalid month values.
- Previous and next controls work.
- Other query params are preserved when applicable.
- Bottom navigation and desktop sidebar tests should use the shared month-aware navigation helper.

### Budgets

- Shows planned, spent, remaining, and progress data.
- Shows over-budget states when relevant.
- Validates required form fields.
- Displays duplicate or API errors clearly.
- Invalidates budget lists and dashboard summary data after create, update, and delete mutations.

### Accounts

- Invalidates the accounts list after create, update, and delete mutations.

### Categories and Sections

- Invalidates category and section list queries after create, update, and delete mutations.

### Transactions

- Validates form fields.
- Uses the selected month when choosing a default date.
- Restores the last transaction date per month when available.
- Invalidates the affected queries after create, update, and delete.

### Primary Action

- Dashboard registers Add transaction.
- Transactions registers Add transaction.
- Budgets registers Add budget.
- Accounts registers Add account.
- Categories registers the appropriate create action.
- The action clears when the page unmounts.

## Commands

Use the package scripts that exist in `package.json`.

- `npm run test`
- `npm run test:watch`
- `npm run test:coverage`
- `npm run test:e2e`
- `npm run test:e2e:ui`
- `npm run storybook`
- `npm run build-storybook`

CI runs formatting, linting, typechecking, unit tests, and the production build in `.github/workflows/ci.yml`. Playwright runs separately in `.github/workflows/e2e.yml`; it starts the local Vite server and uses the configured local proxy, so authenticated backend smoke tests require suitable test environment setup.

## Testing Guidelines

- Prefer user behavior over implementation details.
- Use accessible queries when possible.
- Avoid brittle snapshots.
- Mock network calls consistently.
- Keep tests focused and readable.
- Do not add a new testing framework without a clear reason.
