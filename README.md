# DWMC Web

DWMC Web is the React frontend for a personal budgeting application. It provides authentication, account, category, transaction, budget, and monthly summary workflows.

## Architecture

The frontend is hosted by Vercel and communicates with the separately deployed `dwmc-api` service. Supabase provides browser-side Auth and PostgreSQL; Prisma and domain data access belong to `dwmc-api`.

```text
Local:       dwmc-web -> local dwmc-api -> configured Supabase environment
Staging:     Vercel Preview -> Render staging API -> Supabase staging
Production:  Vercel production -> Render production API -> Supabase production
```

The frontend sends Supabase access tokens to `dwmc-api` as `Authorization: Bearer <token>`. It never connects directly to PostgreSQL or receives backend secrets.

## Stack

React, TypeScript, Vite, React Router, TanStack Query, React Hook Form, Zod, shadcn/ui, Tailwind CSS, Supabase Auth, Vitest, Testing Library, Playwright, Storybook, ESLint, and Prettier.

## Setup

```bash
npm ci
cp .env.example .env.local
npm run dev
```

<<<<<<< HEAD
Local Vite development proxies `/api/v1` to `http://localhost:3000`. Set the Supabase values and `VITE_APP_URL` for the environment being used. All `VITE_*` values are bundled into browser code and are public; never put database credentials, service-role keys, or deployment tokens in them.

## Commands

```bash
npm run dev
npm run build
npm run preview
npm run validate
npm run test
npm run test:e2e
npm run storybook
npm run build-storybook
```

## Documentation

- [Frontend architecture](docs/frontend-architecture.md)
- [Frontend conventions](docs/frontend-conventions.md)
- [API integration](docs/frontend-api.md)
- [Authentication and routing](docs/frontend-routing.md)
- [State management](docs/frontend-state-management.md)
- [Testing](docs/testing.md)
- [Development playbook](docs/development-playbook.md)
- [Engineering standards](docs/engineering-standards.md)
- [Releasing and deployment](docs/RELEASING.md)
- [Engineering audit playbook](docs/engineering-audit-playbook.md)
- [Roadmap](docs/roadmap.md)

Domain behavior is documented alongside the relevant feature implementation. There is currently no ADR directory; meaningful architectural decisions should be added there when one is introduced.
