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

- `.github/workflows/release.yml` runs on pushes to `main`, validates the project, and creates or updates the Changesets Version PR.
- `.github/workflows/release-tags.yml` runs for `v*` tags, validates the project, and creates GitHub Releases/tags through Changesets.

The frontend workflow does not publish to npm. The frontend and backend repositories have independent versions and workflows; coordinate only when a shared API contract changes.

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
