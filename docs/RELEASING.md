# Releasing and Deployment

## Deployment Ownership

`dwmc-web` is a Vite frontend hosted by Vercel. `dwmc-api` is deployed separately on Render. Supabase provides Auth and PostgreSQL; Prisma migrations and database procedures belong to `dwmc-api`.

This repository contains no Vercel deployment workflow or tracked `vercel.json`. The authoritative deployment path for the frontend is therefore the Vercel project integration configured outside this repository. GitHub Actions provides CI and does not deploy the frontend.

## Environments

```text
Local:       dwmc-web -> local dwmc-api -> configured Supabase environment
Staging:     Vercel Preview -> Render staging API -> Supabase staging
Production:  Vercel production -> Render production API -> Supabase production
```

Configure these actual frontend variables separately for each environment:

| Variable                 | Purpose                                          | Required | Browser-visible |
| ------------------------ | ------------------------------------------------ | -------- | --------------- |
| `VITE_APP_URL`           | Frontend origin used for Supabase Auth redirects | Yes      | Yes             |
| `VITE_API_URL`           | `dwmc-api` origin used by the shared API client  | Yes      | Yes             |
| `VITE_SUPABASE_URL`      | Supabase project URL for browser Auth            | Yes      | Yes             |
| `VITE_SUPABASE_ANON_KEY` | Supabase public anon key                         | Yes      | Yes             |

Local development uses `VITE_API_URL=/api/v1`, which Vite proxies to `http://localhost:3000`. Vercel Preview must use the Render staging API and staging Supabase project. Production must use the production API and Supabase project. Do not introduce an `APP_ENV` frontend variable solely to mirror backend configuration.

Every `VITE_*` value is bundled into browser code. Never configure `DATABASE_URL`, PostgreSQL credentials, `SUPABASE_SERVICE_ROLE_KEY`, Vercel tokens, Render credentials, or other backend secrets in Vercel frontend variables.

## Authentication Redirects

Supabase Auth redirect configuration must allow the frontend origins needed by implemented flows:

- local signup confirmation and password recovery
- Vercel Preview/Staging authentication redirects
- the Vercel Production origin

`VITE_APP_URL` is the frontend origin used to construct signup and password-reset redirect URLs. Configure the corresponding URLs in Supabase Auth without hardcoding final domains in this repository.

## Release Flow

1. Create a feature branch and open a pull request.
2. Let CI run formatting, linting, typechecking, unit tests, and the production build.
3. Validate the Vercel Preview against the Render staging API and Supabase staging.
4. Merge to `main` after review.
5. Allow the Vercel project integration to deploy the production frontend.
6. Run the production smoke test below.

When a frontend change depends on a backend contract or database migration, coordinate the change with `dwmc-api` first:

```text
Database migration -> Render API deployment -> API health verification -> Vercel frontend deployment
```

Do not duplicate Prisma migration procedures in this repository.

## SPA Routing

The app uses React Router with nested routes such as `/dashboard`, `/transactions`, `/budgets`, `/accounts`, `/tools`, `/categories`, and `/style-guide`. Verify that direct navigation and browser refresh work for a nested route after deployment. SPA fallback behavior is owned by the Vercel project configuration; this repository does not currently contain a tracked `vercel.json`.

## CORS

The frontend sends requests to `VITE_API_URL` and includes `Authorization: Bearer <Supabase access token>` when a session exists. `dwmc-api` owns CORS policy, allowed frontend origins, preflight handling, methods, and headers. A CORS failure is therefore an API or deployment configuration issue, not a Vite setting to solve in the frontend.

## Smoke Test

After a deployment, verify:

- the application loads
- a nested route works on direct navigation and refresh
- Supabase login and logout work
- an authenticated request reaches the configured API
- Dashboard loads
- Accounts load
- Transactions load
- Budgets load
- Categories load
- password recovery and reset redirects use the correct frontend origin

A staging Render Free service may spin down after inactivity. Its first API request can be slower while the service starts; do not add frontend keep-alive requests or classify that delay automatically as a frontend performance defect.

## Troubleshooting

- Check that `VITE_API_URL` targets the correct environment.
- Check that the frontend and API environments use matching Supabase projects.
- Check Supabase Auth redirect allowlists for the exact local, Preview, and Production origins.
- Check Render CORS configuration when browser requests fail preflight.
- Check the Render API health and deployment logs before debugging frontend request code.
- Check the Vercel build logs and project SPA fallback configuration for deployment or refresh failures.

## Local Commands

```bash
npm run validate
npm run build
npm run preview
```

Versioning and release notes are maintained through normal repository changes and Git tags. This frontend does not use Changesets.
