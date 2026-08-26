# Development and Releases

This repository is a local-first V1. There is no staging or production deployment pipeline.

## Local Workflow

1. Start the local `dwmc-api` service.
2. Configure `.env.local` from `.env.example`.
3. Run `npm run dev` to start the Vite development server.
4. Run `npm run validate` before opening a pull request.

The Vite server proxies `/api/v1` to `http://localhost:3000`. Supabase is used
for Auth only. Domain requests carry the Supabase access token to the local API,
which validates it and reads application data from local PostgreSQL through Prisma.

## Quality Gate

GitHub Actions runs formatting, linting, typechecking, unit tests, and the build
on pull requests and pushes to `main`. The E2E workflow starts the local Vite
server. CI does not deploy, run remote migrations, or require hosted database
credentials.

## Environment

The frontend requires `VITE_APP_URL`, `VITE_API_URL`, `VITE_SUPABASE_URL`, and
`VITE_SUPABASE_ANON_KEY`. All `VITE_*` values are browser-visible.

See [frontend API integration](frontend-api.md), [testing](testing.md), and the
repository README for setup details. Future production deployment is deliberate
future work and is not configured here.
