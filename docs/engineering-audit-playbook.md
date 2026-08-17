# Frontend Engineering Audit Playbook

## Scope

An audit evaluates the frontend repository against its implementation, deployment boundary, security model, documentation ownership, and quality gates. It is not an invitation to refactor working application code.

## Method

1. Inventory tracked files, directories, configuration, workflows, documentation, and generated artifacts.
2. Inspect implementation anchors for routing, authentication, API transport, environment variables, tests, and deployment configuration.
3. Search all references before moving or deleting an artifact.
4. Classify findings as aligned, code drift, documentation drift, or ambiguous.
5. Classify cleanup candidates as KEEP, UPDATE, MERGE, DELETE, or REVIEW.
6. Delete only when imports, tooling, configuration, tests, documentation, and architectural purpose have been checked.
7. Update one canonical documentation owner and add cross-references rather than duplicating procedures.
8. Run formatting, lint, typecheck, tests, build, and any affected Storybook or Playwright checks.
9. Review the final diff for accidental application changes, secrets, broken references, and generated churn.

## Closure Criteria

An audit is complete when current Local, Staging/Preview, and Production boundaries are documented; frontend secrets are excluded; no known deleted-path or documentation references remain; high-confidence obsolete artifacts are removed; REVIEW items are recorded; and available quality gates pass.

## Evidence Rules

Preserve meaningful domain documentation, feature boundaries, test fixtures, Storybook stories, MSW handlers, configuration, CI workflows, and ADR history unless concrete evidence proves they are obsolete. Temporary audit output is not canonical documentation and should be removed or moved into the relevant standard when it contains reusable guidance.
