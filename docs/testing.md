# Frontend Testing

## Stack and Layers

- **Vitest** runs unit, component, and integration tests.
- **Testing Library** exercises React through user-visible behavior.
- **MSW** supplies network mocks for tests and Storybook.
- **Playwright** covers browser workflows and accessibility checks.
- **Storybook** documents reusable component states; it does not replace tests.

Tests and shared helpers live under `src/test/`; browser tests live under `e2e/`.

Authentication browser tests use deterministic Supabase response routes from
`e2e/auth-fixtures.ts`. The fixture also mocks the protected summary, account, and
section requests needed to render authenticated pages. Keep protected API mocks
explicit and add a handler for each endpoint a workflow needs; do not globally
bypass unexpected `/api` requests.

The authentication E2E boundary includes successful login, anonymous-only route
redirects, logout protection and cache isolation, invalid and valid password
recovery links, and authenticated API page rendering. Password recovery tests use
a JWT-shaped fixture token and the same token in the mocked session and callback
hash so the browser lifecycle remains deterministic.

## What to Test

Unit-test pure month/date utilities, formatters, storage helpers, schemas, and transformations. Component and integration tests should cover forms, loading/error/empty states, navigation, dialog flows, query behavior, contextual actions, and API-error presentation. End-to-end tests should cover important authenticated workflows such as sign-in, transaction and budget entry, month navigation, responsive navigation, and the contextual action.

Category and Section tests should also cover cursor-page consumption, archived Category preservation in historical Transaction and Budget edits, disabled archived options for new selections, and keyboard focus management for dialogs and archive confirmations.

Prioritize behavior, accessibility, ownership of state, month boundaries, validation, and regressions. Avoid brittle implementation-detail assertions and meaningless coverage chasing.

## Existing Cross-Feature Coverage

When changing these areas, preserve or extend the relevant behavior:

- Month navigation defaults and invalid-value fallback.
- Navigation links preserve the selected month.
- Transaction forms use the selected month for default dates.
- Budget progress and over-budget states render backend values.
- Mutation hooks invalidate every known affected query family, including cross-feature dependencies.
- The contextual primary action registers and clears page actions.
- Auth flows expose accessible validation and error states.

## Commands

```bash
npm run test
npm run test:watch
npm run test:coverage
npm run test:e2e
npm run test:e2e:ui
npm run storybook
npm run build-storybook
```

Use MSW or the existing test helpers for API behavior. Do not add another test framework without a documented reason.
