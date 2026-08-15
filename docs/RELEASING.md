# Releasing

`dwmc-web` is a private application repository versioned independently from `dwmc-api`. Changesets, Conventional Commits, Husky, and GitHub Actions support release bookkeeping; this repository is not published as an npm package.

## Quality Gate

The `validate` script runs:

```bash
npm run format:check
npm run lint
npm run typecheck
npm run test
npm run build
```

The release workflows install with `npm ci` and run this validation before release automation proceeds.

## Changesets

Create a changeset for user-visible or release-worthy frontend changes:

```bash
npm run changeset
```

Documentation-only, CI-only, and internal changes normally do not need a changeset. The repository configuration versions private packages and creates tags while keeping package publication restricted.

## GitHub Workflows

- `.github/workflows/deploy.yml` runs the reusable quality gates, deploys same-repository pull requests to Vercel Preview, and deploys pushes to `main` to Vercel Production.
- `.github/workflows/e2e.yml`, `.github/workflows/chromatic.yml`, and security workflows remain separate checks.

The frontend workflow does not publish to npm. The frontend and backend repositories have independent versions and workflows; coordinate only when a shared API contract changes.

## Vercel Deployment

GitHub Actions is the deployment owner. A merge to `main` follows this path:

```text
main merge
	-> quality gates (format, lint, typecheck, unit tests, build)
	-> GitHub Actions: vercel pull, vercel build --prod, vercel deploy --prebuilt --prod
	-> smoke verification
```

Pull requests from this repository receive a Preview deployment after the same quality gates pass. Pull requests from forks still run quality checks, but do not deploy because GitHub does not expose deployment secrets to untrusted fork code. Production deployments only run for pushes to `main`.

### GitHub secrets

Add these repository or environment secrets in GitHub. They are consumed only by the deployment workflow:

| Secret              | Where to obtain it                                                          |
| ------------------- | --------------------------------------------------------------------------- |
| `VERCEL_TOKEN`      | Vercel account settings, under Tokens.                                      |
| `VERCEL_ORG_ID`     | Vercel project settings or the `orgId` returned by `vercel project ls`.     |
| `VERCEL_PROJECT_ID` | Vercel project settings or the `projectId` returned by `vercel project ls`. |

The `preview` and `production` GitHub Environments are used by the workflow. Configure production approval rules there if required. Do not put frontend application variables in GitHub Actions YAML.

### Vercel environment variables

Configure these variables in the Vercel project under each environment. Values are pulled by `vercel pull` before Vercel builds the bundle:

| Variable                 | Development                            | Preview                       | Production                        |
| ------------------------ | -------------------------------------- | ----------------------------- | --------------------------------- |
| `VITE_APP_URL`           | `http://localhost:5182`                | The Preview deployment origin | The production application origin |
| `VITE_API_URL`           | `/api/v1` through the local Vite proxy | Staging API base URL          | Production API base URL           |
| `VITE_SUPABASE_URL`      | Development Supabase project           | Staging Supabase project      | Production Supabase project       |
| `VITE_SUPABASE_ANON_KEY` | Development project anon key           | Staging project anon key      | Production project anon key       |

Only browser-safe Supabase anon keys belong in the frontend. Never configure service-role keys, database credentials, or other backend secrets in Vercel frontend environments. Preview must use staging infrastructure so it cannot access production financial data.

### Duplicate deployment prevention

Disable Vercel's automatic Git deployments for this project, or otherwise configure its Git integration not to deploy the `main` and pull-request refs handled by `.github/workflows/deploy.yml`. Keeping both enabled would deploy the same commit twice and can make the GitHub status and production target ambiguous. This repository cannot verify or change that Vercel dashboard setting automatically.

### Troubleshooting and redeploying

Inspect the failed job in the repository's Actions tab first. Quality failures stop before any Vercel command; Vercel build or deployment failures are reported by the deployment job. After correcting the issue, push a new commit or re-run the failed workflow from GitHub Actions. A production redeploy must still be performed from `main`; do not deploy arbitrary branches with production credentials.

### Production smoke check

After a production deployment, use a dedicated safe test account and verify:

1. Open the application.
2. Direct-load a nested route such as `/app/dashboard` and refresh it.
3. Log in.
4. Confirm Dashboard loads and the API connection works.
5. Switch month.
6. Navigate to Transactions and Budgets.
7. Log out.

Do not automate this check against real production financial data without a dedicated safe test account.

## Commit and Review Expectations

Use Conventional Commit messages such as `feat(transactions): ...`, `fix(budgets): ...`, or `docs(readme): ...`. Review user impact, API compatibility with `dwmc-api`, migrations on the backend side, tests, and documentation before merging.

## Local Commands

```bash
npm run validate
npm run changeset
npm run version
npm run release
```

`version` consumes pending changesets and updates the repository version/changelog. `release` is the Changesets tag command used by the release process. Do not manually publish this private application to npm.
