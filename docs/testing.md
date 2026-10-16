# Frontend Testing

## Bundle profiling

Run `npm run profile:build` to build the production bundle and list the ten largest generated assets. The command also identifies assets above the 600 kB warning threshold so bundle work can be based on measured output rather than source import counts.

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

Transaction form tests should cover archived Account preservation when editing a historical record. Archived accounts may remain selected for existing transactions, but must be disabled for new account selections.

Account form tests should cover savings-only positive goals, empty goals, and the distinction between the setup starting balance and later adjustment transactions.

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
- Browser and server API adapter tests cover token forwarding, request origins,
  authenticated cache policy, malformed/empty responses, network failures, and
  mismatched session identities.

## Commands

Use the package scripts that exist in `package.json`.

- `npm run test`
- `npm run test:watch`
- `npm run test:coverage`
- `npm run test:e2e`
- `npm run test:e2e:ui`
- `npm run test:e2e:next`
- `npm run test:e2e:live`
- `npm run storybook`
- `npm run build-storybook`

Phase 3 route coverage should include Next deep links, anonymous redirects,
active desktop/mobile navigation, query-string month preservation, invalid
month fallback, and loading/error/not-found boundaries. The legacy Vite
Playwright suite remains part of the rollback compatibility check.

CI runs formatting, linting, typechecking, unit tests, and the production build in `.github/workflows/ci.yml`. `npm run test:e2e` runs the legacy suite against Vite. The dedicated
`npm run test:e2e:next` suite starts Next.js plus a local deterministic mock
Supabase/API boundary and validates SSR cookies, protected rendering, bearer
forwarding, refresh, logout, callback errors, and user isolation.

`npm run test:e2e:live` is opt-in and requires a production-like Next build,
running Supabase Auth and `dwmc-api`, and dedicated non-production
`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `DWMC_API_URL`,
`E2E_TEST_EMAIL`, and `E2E_TEST_PASSWORD` values. Never use production
credentials or financial data. The live config fails clearly when variables
are missing; it must not be reported as passed in that case.

The normal Vitest and Playwright suites use mocks and do not require a running
PostgreSQL database or live Supabase credentials. Playwright installs or uses
its configured browser and starts Vite automatically; local E2E runs use the
deterministic Auth and API route fixtures in `e2e/`.

Phase 2 SSR authentication also requires integration coverage against a
running Next.js server, Supabase Auth, and `dwmc-api`. Unit tests can validate
redirect allowlists, schemas, cache cleanup, and API error parsing, but they
cannot prove cookie refresh, code exchange, or backend JWT verification.
Those flows must be reported separately from mocked tests.

The deterministic Next suite does not prove Supabase JWT validation or the
real backend database contract. The live suite is the required validation for
that boundary.

The Next deterministic suite also covers the Phase 5 parity boundary:
dashboard month navigation and query preservation, protected navigation,
account/category/transaction/budget workflows, tools/profile/settings routes,
mobile navigation, and Escape-key dialog dismissal. Its mock boundary serves
the same REST resource shapes used by feature API modules; it is not a
replacement for live backend integration.

The Next.js reset flow requires both a successful callback code exchange and
the short-lived, HttpOnly `dwmc-recovery` cookie set by that callback. An
ordinary authenticated session without that marker must remain on the invalid
link state. The marker is cleared after a successful password update.

## Testing Guidelines

- Prefer user behavior over implementation details.
- Use accessible queries when possible.
- Avoid brittle snapshots.
- Mock network calls consistently.
- Keep tests focused and readable.
- Do not add a new testing framework without a clear reason.
