# Releasing

This project uses Semantic Versioning, Changesets, Conventional Commits, and GitHub Actions to manage releases.

## Versioning Model

Versions follow SemVer:

- `patch` for bug fixes and small internal improvements with no user-facing API change
- `minor` for backward-compatible features
- `major` for breaking changes

The app is currently in the `0.x.x` range, so breaking changes may still land before `1.0.0`, but they should still be documented clearly with a major changeset when they affect users.

## Conventional Commits

Commit messages must follow Conventional Commits so release intent is easy to read and review.

Examples:

- `feat(auth): add forgot password`
- `fix(budget): recalculate totals`
- `docs(readme): update installation guide`
- `refactor(api): simplify request handling`
- `test(accounts): add integration tests`
- `chore(deps): update dependencies`
- `ci(github): improve release workflow`
- `perf(transactions): optimize rendering`

The repo enforces this with Commitlint in the Husky `commit-msg` hook.

## When A Changeset Is Needed

Create a changeset when a change should appear in the next release notes or should bump the app version.

Usually required:

- new user-facing features
- bug fixes
- breaking changes
- changes that should be visible in the changelog

Usually not required:

- internal refactoring with no user-visible impact
- CI changes
- documentation-only updates
- dependency maintenance that does not affect users

If you are unsure, prefer adding a changeset. It is safer to document a release-worthy change than to miss one.

## Creating A Changeset

From the repository root:

```bash
npm run changeset
```

Choose one of:

- `patch`
- `minor`
- `major`

Then write a short user-facing summary of the change.

Keep the description focused on what a user would notice, not implementation details.

## How Version PRs Work

The main release workflow runs on pushes to `main` and uses Changesets to maintain a Version PR.

When there are pending changesets, GitHub Actions creates or updates a PR named `chore(release): version packages`.

That PR contains:

- the version bump
- the generated changelog entry
- any updated dependency ranges for internal package relationships

Merge the Version PR after review. That merge is what drives the final release step.

## How GitHub Releases Are Generated

After the Version PR is merged, the tag-based release workflow runs on `v*` tags.

That workflow:

- installs dependencies with `npm ci`
- runs the project validation script
- uses Changesets to create Git tags and GitHub Releases

The workflow never publishes anything to npm.

## Changesets Configuration

The repo is configured as a private application:

- `access: restricted`
- `baseBranch: main`
- `updateInternalDependencies: patch`
- `privatePackages.version: true`
- `privatePackages.tag: true`

This keeps the app versioned locally while still allowing Git tags and GitHub Releases.

## Editing Or Removing A Changeset

Before the Version PR is merged, you can edit or delete changeset files in `.changeset/`.

Use this when:

- the change was described incorrectly
- the SemVer bump level was wrong
- the change no longer belongs in the upcoming release

If you remove the changeset entirely, the next release PR update will reflect that automatically.

## Hotfixes

For a hotfix:

1. Branch from `main`
2. Make the fix
3. Add a `patch` changeset
4. Open a PR with a Conventional Commit message
5. Merge it
6. Let the release workflow update the Version PR

If the hotfix is urgent, keep the changeset description short and user-facing.

## Breaking Changes

For breaking changes:

1. Add a `major` changeset
2. Clearly describe the user impact
3. Update any docs or migration notes that explain the change

Even in the `0.x.x` range, use a major changeset when the change is not backward compatible.

## Verifying Git Tags

After a release, check that tags were created in the repository:

```bash
git fetch --tags
git tag --list
```

You can also inspect the latest tag locally:

```bash
git describe --tags --abbrev=0
```

## Recovering From A Failed Release

If the workflow fails before the Version PR is merged, fix the underlying issue and push again.

If the Version PR was merged but the tag/release workflow failed:

1. Fix the workflow or repository issue
2. Re-run the failed workflow from GitHub Actions, or push a new tag if needed
3. Confirm the GitHub Release was created

Do not manually publish to npm. This project is intentionally configured to avoid npm publication.

## Local Commands

- `npm run changeset` - create a new changeset
- `npm run version` - run the versioning command used by the release workflow
- `npm run release` - create git tags for the current release state
- `npm run validate` - run the main quality gate locally
