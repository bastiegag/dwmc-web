# Copilot Instructions for dwmc-web

## Project Overview

`dwmc-web` is a React/TypeScript single-page application with Supabase-backed authentication. The app currently includes a full auth flow (login, signup, forgot password, reset password) and a protected dashboard page.

## Tech Stack

| Concern | Technology |
|---|---|
| UI | React 18, React Router v6 |
| Language | TypeScript 5 |
| Build | Vite 6 |
| Styling | Tailwind CSS v4 (via `@tailwindcss/vite` plugin) |
| Component primitives | Radix UI |
| Server state | TanStack React Query v5 |
| Forms | React Hook Form + Zod |
| Backend / Auth | Supabase |
| Unit tests | Vitest + Testing Library + MSW |
| E2E tests | Playwright |
| Component docs | Storybook 8 |
| Linting | ESLint 9 (flat config) |
| Formatting | Prettier |
| Pre-commit hooks | Husky + lint-staged |

## Essential Commands

```bash
# Install dependencies
npm ci

# Development server (port 5182)
npm run dev

# Type-check only (no emit)
npm run typecheck

# Lint (zero warnings policy)
npm run lint
npm run lint:fix      # auto-fix

# Format
npm run format        # write
npm run format:check  # check only

# Unit tests
npm run test
npm run test:watch
npm run test:coverage

# E2E tests
npm run test:e2e

# Build
npm run build         # tsc -b && vite build

# Storybook
npm run storybook     # dev server on port 6006
npm run build-storybook
```

**Always run `npm run typecheck && npm run lint && npm run test` before committing.**

## Directory Structure

```
src/
├── app/
│   ├── layouts/          # AppLayout, AuthLayout (react-router Outlet wrappers)
│   ├── providers/        # AppProviders (QueryClientProvider + ThemeProvider + Toaster)
│   └── router/           # AppRouter (BrowserRouter + route definitions)
├── components/
│   ├── feedback/         # ErrorBoundary, LoadingSpinner
│   ├── form/             # TextField, PasswordField, FormError, FormSubmitButton, FormField
│   ├── layout/           # ThemeProvider
│   └── ui/               # Radix/shadcn-style primitives: Button, Card, Input, Label, Toast, etc.
├── features/
│   └── auth/
│       ├── components/   # LoginForm, SignupForm, ForgotPasswordForm, ResetPasswordForm
│       ├── hooks/        # useAuth, useLogin, useSignup, useLogout, useForgotPassword, useResetPassword
│       ├── pages/        # LoginPage, SignupPage, ForgotPasswordPage, ResetPasswordPage, DashboardPage
│       ├── routes/       # ProtectedRoute (redirects unauthenticated users to /login)
│       ├── schemas/      # Zod schemas and inferred types for all auth forms
│       ├── services/     # authService (wraps Supabase auth calls)
│       └── types/        # Auth TypeScript types (LoginCredentials, SignupCredentials, etc.)
├── lib/
│   ├── api/              # Axios/fetch client
│   ├── query/            # TanStack Query client instance
│   ├── supabase/         # Supabase client (reads VITE_SUPABASE_URL + VITE_SUPABASE_ANON_KEY)
│   └── utils.ts          # cn() helper (clsx + tailwind-merge)
├── stories/              # Storybook stories
└── test/
    ├── mocks/
    │   ├── handlers/     # MSW request handlers (auth.ts, …)
    │   └── server.ts     # MSW server setup
    ├── setup.ts          # Global test setup (jest-dom, MSW lifecycle, env stubs)
    └── utils/            # Custom render helpers
```

## Architecture Conventions

### Path Alias
`@/` maps to `src/`. Always use this alias instead of relative paths that traverse up directories.

### Feature Modules
New features go under `src/features/<feature-name>/` following the same sub-directory pattern as `auth` (`components`, `hooks`, `pages`, `routes`, `schemas`, `services`, `types`). Each sub-directory should have an `index.ts` barrel file.

### Routing
- Auth (unauthenticated) routes live under `<AuthLayout>`.
- Protected routes are wrapped in `<ProtectedRoute>` then `<AppLayout>`.
- All pages are lazy-loaded with `React.lazy`.
- Add new routes to `src/app/router/router.tsx`.

### State Management
- Server/async state → TanStack React Query (`useMutation`, `useQuery`).
- Auth state → `useAuth` hook (subscribes to Supabase `onAuthStateChange`).
- Form state → React Hook Form with Zod validation via `@hookform/resolvers/zod`.
- No global client-state library; use React context or co-located state.

### Forms
- All form schemas live in `src/features/<feature>/schemas/`.
- Use `zodResolver` from `@hookform/resolvers/zod`.
- Reuse shared form primitives from `src/components/form/` (`TextField`, `PasswordField`, `FormError`, `FormSubmitButton`).

### UI Components
- Low-level primitives (Button, Input, etc.) are in `src/components/ui/`. These follow the shadcn/ui pattern built on Radix UI.
- The `cn()` utility (`src/lib/utils.ts`) merges Tailwind classes.

### Toasts
- Import `toast` from `@/components/ui/use-toast`.
- The `<Toaster />` is mounted in `AppProviders`.

## Code Style

Enforced by Prettier and ESLint — **do not disable rules unless absolutely necessary**.

- No semicolons
- Single quotes
- Trailing commas everywhere
- 4-space indentation
- 100-character line width
- Arrow function parens always

## Environment Variables

| Variable | Description | Required |
|---|---|---|
| `VITE_SUPABASE_URL` | Supabase project URL | Yes |
| `VITE_SUPABASE_ANON_KEY` | Supabase anon/public key | Yes |

In tests, these are stubbed automatically in `vitest.config.ts` and `src/test/setup.ts`. You do **not** need a `.env` file to run tests.

For local development, create a `.env.local` file (gitignored) with real values.

## Testing Guidelines

- Unit/integration tests use **Vitest** + **@testing-library/react** + **MSW**.
- Place tests in `__tests__/` sub-directories next to the code under test (e.g., `src/features/auth/components/__tests__/LoginForm.test.tsx`).
- MSW handlers are in `src/test/mocks/handlers/`. Add a new handler file per feature and register it in `src/test/mocks/server.ts`.
- Use the custom render helpers from `src/test/utils/` when components need providers.
- The global test setup (`src/test/setup.ts`) starts/resets/closes the MSW server automatically.

## Supabase Auth Flow

1. `authService` (`src/features/auth/services/authService.ts`) is the single integration point for all Supabase auth calls.
2. Mutation hooks (`useLogin`, `useSignup`, etc.) wrap `authService` calls with `useMutation` and handle toast notifications.
3. `useAuth` subscribes to `supabase.auth.onAuthStateChange` and exposes `{ user, session, isLoading, isAuthenticated }`.
4. `ProtectedRoute` reads `useAuth()` and redirects to `/login` when unauthenticated, preserving the attempted URL in `location.state.from`.

## Common Errors & Workarounds

- **`VITE_SUPABASE_*` not defined at runtime**: The Supabase client falls back to placeholder values to avoid crashes at import time. During tests, `vitest.config.ts` injects test values via `define`. For real usage, ensure `.env.local` is present.
- **Tailwind v4 with Vite**: Uses `@tailwindcss/vite` plugin (not PostCSS). Do not add a `tailwind.config.*` file — configuration lives in CSS.
- **ESLint flat config**: `eslint.config.js` uses the new flat config format (ESLint 9). The `ignores` array replaces `.eslintignore`.
- **Husky / lint-staged**: `prepare` script is guarded so it doesn't fail in CI environments where `husky` is absent.
