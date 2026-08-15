# Copilot Instructions for `dwmc-web`

## Project Overview

`dwmc-web` is the React/Vite frontend for Dude, Where's My Cash?. The sibling `../dwmc-api` repository owns persistence, authorization, financial calculations, and the API contract. Treat both repositories as one product when a change crosses the API boundary.

## Documentation Hierarchy

Consult documentation in this order before making design decisions:

1. [Developer Playbook](../docs/dev-playbook.md) for development principles and feature workflow.
2. [Engineering Audit Playbook](../docs/engineering-audit-playbook.md) for review scope, severity, and closure criteria.
3. [Frontend Architecture](../docs/architecture.md) and [backend architecture](../../dwmc-api/docs/architecture.md) for responsibilities and boundaries.
4. [API integration](../docs/api.md), [backend API design](../../dwmc-api/docs/api.md), and relevant [backend domain docs](../../dwmc-api/docs/domains/) for contracts and business rules.
5. ADRs, when present, for decisions that constrain the implementation.
6. The relevant [README](../README.md) and package scripts for setup, commands, and repository orientation.

Also consult [frontend testing](../docs/testing.md), [backend testing](../../dwmc-api/docs/testing.md), and [releasing](../docs/releasing.md) or [backend releasing](../../dwmc-api/docs/releasing.md) when the change affects those areas. The roadmap is context, not a specification: do not implement planned or placeholder work without confirmed scope.

## Development Expectations

- Inspect the nearest existing implementation and its tests before adding a pattern.
- Follow the documented architecture and existing feature boundaries; prefer consistency over cleverness.
- Reuse existing components, helpers, API modules, query patterns, and public feature exports.
- Keep pages orchestration-focused and keep domain code inside its feature.
- Keep frontend and backend changes aligned. Verify request/response shapes, authentication, ownership, dates, money, and downstream query effects in both repositories.
- Avoid unrelated refactors, duplicate business logic, unnecessary abstractions, and breaking changes.

## Documentation Expectations

Update the relevant documentation in the same task whenever code changes affect architecture, API contracts, business rules, engineering workflow, developer conventions, testing, release behavior, or roadmap status. Link to the canonical document instead of duplicating its content. Never leave documentation describing behavior that the implementation no longer provides.

## Engineering Expectations

Preserve separated responsibilities: the frontend coordinates presentation and server state; the backend validates, authorizes, persists, and calculates authoritative financial values. Preserve existing business rules and accessibility behavior. Prefer small, comprehensible changes that fit the codebase over speculative generalization.

## Code Generation Rules

- Read existing code, tests, and relevant documentation first.
- Match local naming, file layout, formatting, and testing style.
- Modify existing code when appropriate instead of rewriting working paths.
- Minimize breaking changes and preserve compatibility unless an intentional migration is documented.
- Add meaningful behavior or regression tests; use Storybook for reusable UI states where appropriate.

## Feature Development

For a new feature, consult the Developer Playbook, relevant frontend and backend architecture, the applicable domain/API documentation, and the testing guidance. Implement both sides together when needed, then update tests, Storybook coverage where appropriate, and affected documentation. Do not calculate backend-owned balances, spending, or summaries independently in the frontend.

## Engineering Audits

Before considering a feature complete, follow the Engineering Audit Playbook. Evaluate implementation against documented standards, inspect integration and cross-feature effects, report evidence-based findings using its severity levels, and conclude with `READY TO CLOSE` or `NOT READY TO CLOSE` as defined there.

## General Rules

Copilot must not invent undocumented requirements, duplicate project documentation, introduce architectural patterns without justification, ignore existing conventions, or leave implementation and documentation inconsistent. When documentation and assumptions conflict, inspect the code and tests, identify the discrepancy, and update the appropriate source and documentation together.
