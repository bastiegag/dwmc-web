# Copilot Instructions for dwmc-web

## Project Overview

**dwmc-web** is a React + TypeScript single-page application (SPA) bootstrapped with Vite. It currently implements a full authentication flow (login, signup, forgot password, reset password) backed by Supabase Auth.

---

## Tech Stack

| Concern | Library / Tool |
|---|---|
| Framework | React 18 + TypeScript 5 |
| Build | Vite 6 |
| CSS | Tailwind CSS v4 (via `@tailwindcss/vite` plugin) |
| UI primitives | Radix UI (dialog, dropdown, label, slot, toast) |
| Component variants | class-variance-authority (CVA) — shadcn/ui pattern |
| Routing | React Router DOM v6 (lazy-loaded routes) |
| Server state | TanStack React Query v5 |
| Forms | React Hook Form v7 + Zod v3 |
| Backend / Auth | Supabase JS SDK v2 |
| Testing | Vitest + Testing Library + MSW v2 |
| E2E | Playwright |
| Component explorer | Storybook 8 |
| Linting | ESLint 9 (TypeScript + React Hooks + React Refresh) |
| Formatting | Prettier 3 |
| Pre-commit | Husky + lint-staged |

---

## Essential Commands

Always run these from the repository root:

```bash
npm ci                   # install dependencies (deterministic)
npm run dev              # dev server at http://localhost:5182
npm run build            # typecheck + Vite production build
npm run typecheck        # TypeScript check only (no emit)
npm run lint             # ESLint — zero warnings allowed
npm run lint:fix         # auto-fix ESLint issues
npm run format           # Prettier write
npm run format:check     # Prettier check (CI-safe)
npm run test             # Vitest run (all tests once)
npm run test:watch       # Vitest watch mode
npm run test:coverage    # coverage report (text + JSON + HTML)
npm run test:e2e         # Playwright end-to-end tests
npm run storybook        # Storybook dev server at :6006
npm run build-storybook  # Storybook production build
```

**Validation workflow before every commit:** `npm run typecheck && npm run lint && npm run test`

---

## Environment Variables

The app reads the following `VITE_` prefixed variables at build time:

| Variable | Purpose | Required |
|---|---|---|
| `VITE_SUPABASE_URL` | Supabase project REST/Auth URL | Yes |
| `VITE_SUPABASE_ANON_KEY` | Supabase public anon key | Yes |

For local development create a `.env.local` file (gitignored). The Supabase client falls back to placeholder values if the variables are absent so the app still compiles; API calls will fail at runtime without real values.

In tests, Vitest injects `https://test.supabase.co` and `test-anon-key` via `vitest.config.ts` `define` block — no `.env` needed for tests.

---

## Directory Structure

```
src/
├── app/
│   ├── layouts/          # AppLayout, AuthLayout (Outlet wrappers)
│   ├── providers/        # AppProviders — QueryClient + ThemeProvider + Toaster
│   └── router/           # AppRouter (BrowserRouter + lazy Routes)
│
├── components/           # Shared, feature-agnostic components
│   ├── feedback/         # ErrorBoundary, LoadingSpinner
│   ├── form/             # Reusable form primitives
│   │   ├── FormField.tsx
│   │   ├── FormError.tsx
│   │   ├── FormSubmitButton.tsx
│   │   ├── PasswordField.tsx  # Toggle show/hide password
│   │   └── TextField.tsx
│   ├── layout/           # AppNav, ThemeProvider, ThemeToggle
│   └── ui/               # Low-level shadcn-style primitives
│       └── button, card, input, label, toast, toaster, use-toast
│
├── features/             # Feature modules (vertical slices)
│   └── auth/
│       ├── components/   # LoginForm, SignupForm, ForgotPasswordForm, ResetPasswordForm
│       ├── hooks/        # useAuth, useLogin, useLogout, useSignup, useForgotPassword, useResetPassword
│       ├── pages/        # LoginPage, SignupPage, ForgotPasswordPage, ResetPasswordPage, DashboardPage
│       ├── routes/       # ProtectedRoute (redirects unauthenticated users)
│       ├── schemas/      # Zod validation schemas (loginSchema, signupSchema, etc.)
│       ├── services/     # authService — thin wrapper over Supabase auth calls
│       └── types/        # TypeScript interfaces (LoginCredentials, SignupCredentials, AuthState, …)
│
├── lib/
│   ├── api/              # Generic API client placeholder
│   ├── query/            # Shared QueryClient instance
│   ├── supabase/         # Supabase client singleton
│   └── utils.ts          # `cn()` helper (clsx + tailwind-merge)
│
├── stories/              # Storybook stories (Button, LoginForm, PasswordField)
├── styles/globals.css    # Tailwind base + CSS custom properties for theming
└── test/
    ├── mocks/
    │   ├── handlers/auth.ts  # MSW request handlers for Supabase auth endpoints
    │   └── server.ts         # MSW server setup
    ├── setup.ts              # Vitest global setup — starts MSW, stubs env vars
    └── utils/render.tsx      # Custom `render` with QueryClient + MemoryRouter wrappers
```

---

## Path Alias

The `@` alias maps to `src/`. Use it for all intra-project imports:

```ts
import { cn } from '@/lib/utils'
import { useAuth } from '@/features/auth/hooks'
```

---

## Coding Conventions

### Component style
- Functional components with named exports (not default exports in feature files).
- Each feature subdirectory has an `index.ts` barrel that re-exports its public API.
- UI primitive components follow the shadcn/ui pattern: `cva` for variant definitions, `cn()` for className merging, `React.forwardRef` where needed.

### Forms
- All forms use `react-hook-form` with `zodResolver`.
- Validation schemas live in `features/<feature>/schemas/index.ts` and export both the schema and the inferred `z.infer<>` type.
- Reusable form building blocks (`TextField`, `PasswordField`, `FormError`, `FormSubmitButton`) are in `src/components/form/`.

### Data fetching / mutations
- Use TanStack Query mutations (`useMutation`) for auth actions; the hooks are in `features/auth/hooks/`.
- The shared `QueryClient` instance lives in `src/lib/query/client.ts`.

### Routing
- Routes are lazy-loaded with `React.lazy` + `Suspense`.
- Protected routes are wrapped in `<ProtectedRoute>` which uses `useAuth()` to redirect.
- Auth pages use `<AuthLayout>`, app pages use `<AppLayout>`.

### TypeScript
- Strict mode is on (`tsconfig.app.json`).
- Unused variables starting with `_` are allowed; all others trigger an error.
- Zero ESLint warnings are tolerated (`--max-warnings 0`).

### Theming
- Light/dark/system themes are supported via `ThemeProvider` (CSS class on `<html>`).
- Theme preference is persisted to `localStorage` under the key `dwmc-theme`.
- Colors use CSS custom properties defined in `src/styles/globals.css`.

---

## Testing Conventions

### Unit / component tests (Vitest)
- Test files live in `__tests__/` subdirectories next to the code they test.
- **Always import `render` from `@/test/utils/render`**, not from `@testing-library/react` directly — the custom render wraps the component in `QueryClientProvider` + `MemoryRouter`.
- Vitest globals are enabled; no need to import `describe`, `it`, `expect`, `vi`, etc.
- MSW intercepts Supabase API calls:
  - Valid test credentials: `test@example.com` / `Password123`
  - Pre-existing user email: `existing@example.com`
  - Supabase URL in tests: `https://test.supabase.co`

### Adding MSW handlers
Add new handlers in `src/test/mocks/handlers/` and register them in `src/test/mocks/server.ts`.

### E2E tests (Playwright)
- Run with `npm run test:e2e`.
- Config lives in `playwright.config.ts` (if present) or Playwright defaults.

---

## Known Constraints & Workarounds

- **Supabase client in tests**: The client is a singleton created at module load time. The Vitest config overrides `import.meta.env` via `define` to point at the MSW-intercepted URL. Do not mock the Supabase client module directly — rely on MSW handlers instead.
- **`husky` in CI**: The `prepare` script silently skips Husky installation when it is not available, so `npm ci` works in CI without error.
- **Tailwind v4**: Uses the new `@tailwindcss/vite` Vite plugin instead of a PostCSS plugin. There is no `tailwind.config.js`; configuration is done via CSS in `globals.css`.

---

## Adding a New Feature

Follow the vertical-slice pattern already used by `features/auth`:

1. Create `src/features/<name>/` with subdirectories: `components/`, `hooks/`, `pages/`, `routes/` (if needed), `schemas/`, `services/`, `types/`.
2. Add barrel `index.ts` files.
3. Register pages in `src/app/router/router.tsx` using `React.lazy`.
4. Wrap pages in `<AppLayout>` and `<ProtectedRoute>` if they require authentication.
5. Add MSW handlers for any new API endpoints under `src/test/mocks/handlers/`.
6. Write Vitest component tests and, optionally, Storybook stories.
