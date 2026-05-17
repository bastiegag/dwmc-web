# dwmc-web

React + TypeScript single-page application with a full authentication flow (login, signup, forgot password, reset password) backed by Supabase Auth.

---

## Tech Stack

| Concern            | Library / Tool                      |
| ------------------ | ----------------------------------- |
| Framework          | React 19 + TypeScript 6             |
| Build              | Vite 8                              |
| CSS                | Tailwind CSS v4                     |
| Routing            | React Router DOM v7                 |
| Server state       | TanStack React Query v5             |
| Forms              | React Hook Form v7 + Zod v4         |
| Backend / Auth     | Supabase JS SDK v2                  |
| Testing            | Vitest 4 + Testing Library + MSW v2 |
| E2E                | Playwright 1.49                     |
| Component explorer | Storybook 10                        |

---

## Getting Started

```bash
# Install dependencies
npm ci

# Add environment variables
cp .env.example .env.local
# Fill in VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY

# Start dev server
npm run dev
# http://localhost:5182
```

---

## Environment Variables

| Variable                 | Purpose                                 | Required |
| ------------------------ | --------------------------------------- | -------- |
| `VITE_SUPABASE_URL`      | Supabase project REST/Auth URL          | Yes      |
| `VITE_SUPABASE_ANON_KEY` | Supabase public anon key                | Yes      |
| `VITE_APP_URL`           | App origin for auth email redirect URLs | Yes      |

---

## Commands

```bash
npm run dev              # dev server at http://localhost:5182
npm run build            # typecheck + production build
npm run typecheck        # TypeScript check only
npm run lint             # ESLint (zero warnings)
npm run lint:fix         # auto-fix ESLint issues
npm run format           # Prettier write
npm run format:check     # Prettier check
npm run test             # Vitest (all tests once)
npm run test:watch       # Vitest watch mode
npm run test:coverage    # coverage report
npm run test:e2e         # Playwright E2E tests
npm run storybook        # Storybook at http://localhost:6006
```

**Before committing:** `npm run typecheck && npm run lint && npm run test`

---

## Project Structure

```
e2e/                  # Playwright E2E specs
src/
  app/
    layouts/          # AppLayout, AuthLayout
    providers/        # QueryClient + ThemeProvider + Toaster
    router/           # Lazy-loaded routes
  components/
    feedback/         # ErrorBoundary, LoadingSpinner
    form/             # TextField, PasswordField, FormError, FormSubmitButton
    layout/           # AppNav, ThemeProvider, ThemeToggle
    ui/               # shadcn-style primitives (button, card, input, label, toast, alert)
  features/
    auth/             # Vertical slice: components, hooks, pages, schemas, services, types
  lib/
    api/              # API client
    query/            # Shared QueryClient
    supabase/         # Supabase client singleton
    utils.ts          # cn() helper
  styles/globals.css  # Tailwind base + CSS custom properties
  test/               # Vitest setup, MSW handlers, custom render
```

---

## Testing

Unit and component tests use Vitest + Testing Library + MSW. All Supabase calls are intercepted by MSW — no real backend needed.

E2E tests use Playwright and mock Supabase via `page.route()`. Run against a local dev server that starts automatically.

```bash
npm run test             # 136 unit/component tests
npm run test:e2e         # 19 E2E tests (Chromium)
```

---

## CI

GitHub Actions runs on every push and pull request to `main`:

- Typecheck, lint, unit tests (with coverage artifact)
- E2E tests on Chromium (Playwright report artifact on failure)
