# Frontend Development Playbook

## Daily Workflow

1. Start the local `dwmc-api` service.
2. Copy `.env.example` to `.env.local` and configure the local Supabase Auth values.
3. Run `npm run dev` in `dwmc-web`.
4. Use the local Vite proxy at `/api/v1`; do not hardcode an API service URL in frontend source.
5. Run focused tests while developing, then `npm run validate` before opening a pull request.

The local flow is:

```text
dwmc-web -> local dwmc-api -> configured Supabase environment
```

## Pull Requests

Keep changes focused and use Conventional Commit messages. Update the canonical documentation when behavior, routes, environment variables, scripts, or architectural boundaries change. CI runs formatting, linting, typechecking, unit tests, and the production build; Playwright runs in a separate workflow.

## Environment Boundaries

`VITE_*` values are browser-visible. Backend secrets, database credentials, service-role keys, and deployment credentials belong outside this repository.

## Backend Changes

Frontend domain calls go through the local `dwmc-api`. Prisma migrations and backend database procedures belong to the API repository. When a frontend change depends on a new backend contract, coordinate the API change first, then validate both repositories locally.
