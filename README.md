# DWMC Web

DWMC Web is the React frontend for a personal budgeting application. It provides authentication, account, category, transaction, budget, and monthly summary workflows.

## Architecture

The frontend runs on the local Vite development server and communicates with the local `dwmc-api` service. Supabase provides browser-side Auth only; Prisma and domain data access belong to `dwmc-api` and local PostgreSQL.

```text
Browser -> local dwmc-web -> local dwmc-api -> Prisma -> local PostgreSQL
					   \-> Supabase Auth -> access token -> dwmc-api
```

The frontend sends Supabase access tokens to `dwmc-api` as `Authorization: Bearer <token>`. It never connects directly to PostgreSQL or receives backend secrets.

## Stack

React, TypeScript, Vite, React Router, TanStack Query, React Hook Form, Zod, shadcn/ui, Tailwind CSS, Supabase Auth, Vitest, Testing Library, Playwright, Storybook, ESLint, and Prettier.

## Setup

Use Node.js 24.x for local development and validation. Start `dwmc-api` first
and complete its local PostgreSQL and Supabase Auth setup.

```bash
npm ci
cp .env.example .env.local
npm run dev
```

Set these values in `.env.local`:

```dotenv
VITE_APP_URL=http://localhost:5182
VITE_API_URL=/api/v1
VITE_SUPABASE_URL=https://<project-ref>.supabase.co
VITE_SUPABASE_ANON_KEY=<publishable-anon-key>
```

`VITE_API_URL=/api/v1` uses the Vite proxy to reach `dwmc-api` at
`http://localhost:3000`. Use the same Supabase project and browser-safe anon
key configured for the API. All `VITE_*` values are bundled into browser code
and are public; never put database credentials, service-role keys, or other
backend secrets in them.

Open `http://localhost:5182`, sign up with Email/password, and then create a
section, category, account, and transaction. Supabase handles authentication;
the resulting application data is persisted by the local API in local
PostgreSQL.

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
- [Engineering standards](docs/engineering-standards.md)
- [API integration](docs/frontend-api.md)
- [Authentication and routing](docs/frontend-routing.md)
- [Testing](docs/testing.md)
- [Shared developer playbook](docs/dev-playbook.md)
- [Development playbook](docs/development-playbook.md)
- [Development and releases](docs/RELEASING.md)
- [Engineering audit playbook](docs/engineering-audit-playbook.md)
- [Roadmap](docs/roadmap.md)

Domain behavior is documented alongside the relevant feature implementation. There is currently no ADR directory; meaningful architectural decisions should be added there when one is introduced.
