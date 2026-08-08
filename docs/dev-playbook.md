# Developer Playbook

> **Project:** Dude, Where's My Cash?
>
> Version: 1.0
>
> Status: Living document
>
> This playbook defines how software is designed, implemented, reviewed, and maintained across the Dude, Where's My Cash? product.
>
> It is intended for both human developers and AI assistants (GitHub Copilot, ChatGPT, Claude, etc.).
>
> This document explains **how we build software**, not how individual systems work.
>
> Technical implementation details belong in the architecture documentation.

---

# 1. Purpose

The purpose of this playbook is to ensure that every feature developed for Dude, Where's My Cash? follows the same engineering standards.

Goals:

- produce maintainable software
- reduce regressions
- keep frontend and backend aligned
- maintain consistent architecture
- improve onboarding
- establish predictable development practices
- define what "Done" actually means

Every feature should follow this playbook from planning to release.

---

# 2. Product Overview

Dude, Where's My Cash? is a personal finance application.

Its objective is to help users understand where their money goes, organize finances, and make better budgeting decisions.

Core product domains include:

- Authentication
- User Profile
- Sections
- Categories
- Accounts
- Transactions
- Monthly Summary
- Dashboard
- Budgets

Additional features may be introduced over time while respecting the existing architecture.

---

# 3. Workspace

The product is split into two repositories.

```text
dwmc/
├── dwmc-web/
└── dwmc-api/
```

## dwmc-web

Responsibilities:

- User Interface
- User Experience
- Routing
- Forms
- Validation
- API consumption
- State management
- Accessibility
- Responsive design
- Storybook
- Frontend testing

The frontend owns presentation.

It does **not** own business rules.

---

## dwmc-api

Responsibilities:

- Business rules
- Authorization
- Validation
- Financial calculations
- Database access
- Persistence
- API contracts
- Security

The backend owns domain integrity.

---

# 4. Engineering Principles

These principles should guide every engineering decision.

## Prefer simplicity

Choose the simplest solution that correctly solves the problem.

Avoid unnecessary abstractions.

---

## Prefer maintainability

Code is read far more often than it is written.

Optimize for readability.

---

## Follow existing patterns

Before introducing a new pattern:

- inspect the repository
- understand the existing architecture
- reuse established conventions whenever appropriate

Consistency is usually more valuable than novelty.

---

## Avoid premature abstraction

Do not generalize code because it "might" be reused later.

Extract abstractions only when they become genuinely shared.

---

## Backend owns business rules

Financial rules belong to the backend.

Examples:

- account balances
- budget calculations
- ownership validation
- authorization
- monthly summaries

The frontend may display these values.

It should not independently reimplement them unless explicitly intended.

---

## Frontend owns user experience

The frontend is responsible for:

- usability
- accessibility
- responsiveness
- interactions
- optimistic feedback when appropriate
- loading states
- empty states
- error presentation

---

## Keep responsibilities clear

Routes should not become services.

Services should not become repositories.

Components should not become pages.

Context should not become global state.

Every layer should have a clear purpose.

---

## Small incremental improvements

Prefer many small improvements over large rewrites.

Leave the codebase slightly better after every change.

---

# 5. Development Lifecycle

Every feature follows the same lifecycle.

```text
Idea
 ↓
Planning
 ↓
Business Rules
 ↓
Backend Design
 ↓
Backend Implementation
 ↓
Frontend Implementation
 ↓
Integration
 ↓
Testing
 ↓
Documentation
 ↓
Feature Audit
 ↓
Release Review
 ↓
Closed
```

Skipping steps usually increases technical debt.

---

# 6. Planning

Every feature starts with planning.

Before writing code, answer:

- What problem does this solve?
- Who benefits?
- What is the user workflow?
- What is out of scope?
- Which existing features are affected?
- Which business rules apply?
- Which edge cases exist?

Planning should reduce uncertainty before implementation begins.

---

# 7. Feature Scope

Each feature should define:

## Product Goal

What user problem is solved?

---

## Scope

Exactly what will be implemented.

---

## Out of Scope

What is intentionally excluded.

Prevent scope creep.

---

## Dependencies

List affected domains.

Examples:

Transactions affect:

- Accounts
- Budgets
- Dashboard

Budgets depend on:

- Categories
- Transactions
- Selected Month

---

# 8. Business Rules

Business rules must be explicit.

Examples:

- budgets are monthly
- only expense transactions consume budgets
- transfers do not affect budgets
- users cannot access another user's data
- account balances are backend-owned

Never rely on undocumented assumptions.

---

# 9. Feature Design

Before implementation define:

User workflow

Success criteria

Failure scenarios

Edge cases

Loading behavior

Empty behavior

Error behavior

Accessibility expectations

Validation strategy

Testing strategy

Definition of Done

---

# 10. Backend Development Workflow

Typical backend sequence:

1. Data model
2. Validation schemas
3. Repository
4. Service
5. Routes
6. Tests
7. Documentation

Do not skip authorization.

Do not expose database models directly.

Business rules belong in services.

Repositories only access persistence.

Routes remain thin.

---

# 11. Frontend Development Workflow

Typical frontend sequence:

1. Types
2. API module
3. Query hooks
4. Schemas
5. Forms
6. Components
7. Page integration
8. Tests
9. Storybook
10. Documentation

Pages orchestrate features.

Components remain reusable whenever practical.

---

# 12. Definition Before Coding

Before writing production code confirm:

- business rules understood
- backend ownership identified
- frontend ownership identified
- API contract defined
- UX states identified
- testing approach identified

If these answers are unclear, continue planning before implementation.

---

# 13. Engineering Mindset

Every implementation should aim to improve one or more of:

- correctness
- readability
- maintainability
- consistency
- developer experience
- user experience

Avoid implementing features that simply "work."

Aim for software that remains easy to evolve months later.

---

# 14. Golden Rules

Always remember:

- The backend owns business integrity.
- The frontend owns user experience.
- The codebase is the source of truth.
- Documentation must reflect reality.
- Simplicity beats cleverness.
- Consistency beats personal preference.
- Technical debt should be explicit.
- Finished is better than perfect.
- Features are closed only after review.

# 15. Frontend Engineering Standards

The frontend should remain predictable, maintainable, and easy to evolve.

Technology choices should reinforce consistency rather than introduce unnecessary complexity.

---

## Feature-Based Architecture

Business logic belongs inside feature modules.

Typical structure:

```text
features/
    transactions/
    budgets/
    dashboard/
    accounts/
    auth/
```

Each feature owns:

- API layer
- hooks
- components
- schemas
- types
- pages

Avoid creating dependencies between unrelated features.

---

## Shared Code

Shared code should only contain functionality used across multiple features.

Examples:

```text
shared/
    month/
    primary-action/
```

Do not move code into `shared` simply because two files look similar.

Only extract code that is truly cross-feature.

---

## Components

Components should have a single responsibility.

Prefer:

Small

Composable

Reusable

Avoid "God Components" that manage:

- API calls
- business rules
- routing
- dialogs
- rendering

all in one place.

---

## State Ownership

Every state should have one owner.

Server state:

TanStack Query

Form state:

React Hook Form

Navigation state:

URL

Temporary UI state:

React Component

Cross-layout UI state:

React Context

Small UX preferences:

localStorage

Avoid duplicating state.

---

## URL State

Navigation state belongs in the URL whenever it affects navigation or shareable application state.

Example:

```text
?month=2026-06
```

The selected month is considered application navigation.

It should not be duplicated inside Context.

---

## Local Storage

Use localStorage only for user convenience.

Examples:

- dismissed banner
- preferred theme
- last transaction date

Never use localStorage as the source of truth for:

- transactions
- budgets
- accounts
- authentication
- financial calculations

---

## React Context

Context should remain lightweight.

Good examples:

Theme

Primary Action

Small layout concerns

Avoid storing server state inside Context.

---

## React Components

Prefer:

composition

over

inheritance

Components should remain mostly presentational.

Business rules belong elsewhere.

---

## Effects

Avoid unnecessary useEffect.

Before adding one, ask:

Can this be computed?

Can this be derived?

Can React Query own it?

Can React Hook Form own it?

Effects should synchronize with external systems, not manage application state.

---

## Forms

All forms should use:

React Hook Form

and

Zod

Validation should be centralized.

Avoid duplicating validation logic.

---

## API Calls

Components should never call fetch directly.

Always go through:

Feature API module

↓

TanStack Query hook

↓

Component

This separation makes testing significantly easier.

---

## Query Keys

Query keys should be stable.

Include all meaningful filters.

Example:

```text
transactions
transactions + selected month
transactions + account
```

Avoid unstable object references.

---

## Cache Invalidation

Mutations must invalidate every affected query.

Think beyond the modified entity.

Example:

Creating a transaction affects:

- transactions
- accounts
- budgets
- dashboard

Failure to invalidate dependent queries creates stale UI.

---

## Money

Money formatting belongs to shared utilities.

Avoid duplicating:

Intl.NumberFormat

throughout the application.

Use the shared formatter.

---

## Dates

Use shared date utilities.

Avoid creating multiple implementations for:

- month formatting
- parsing
- ranges

Date consistency is critical for financial software.

---

# 16. Backend Engineering Standards

The backend protects the integrity of the application.

It is the authoritative source for financial rules.

---

## Layer Responsibilities

Routes

↓

Services

↓

Repositories

↓

Database

Each layer should remain focused.

---

## Routes

Routes are responsible for:

- request parsing
- authentication
- validation
- calling services
- returning responses

Routes should remain thin.

---

## Services

Services contain business rules.

Examples:

- balance calculations
- budget rules
- ownership validation
- transaction logic

Services coordinate work.

---

## Repositories

Repositories communicate with persistence.

They should not:

- contain business rules
- perform authorization
- implement workflows

Keep repositories database-focused.

---

## Validation

Every external request should be validated.

Validation should occur before business logic.

Never trust client input.

---

## Authorization

The backend owns authorization.

Never rely on frontend restrictions.

Every user-owned resource must be validated.

---

## Financial Calculations

Financial calculations belong on the backend.

Examples:

Current balance

Budget spent

Budget remaining

Monthly totals

The frontend displays these values.

---

## API Responses

Maintain consistent response shapes.

Successful requests should look predictable.

Errors should also follow one structure.

Consistency reduces frontend complexity.

---

## Database

The database reflects the product model.

Do not expose persistence details directly through the API.

Protect historical financial data.

---

# 17. Integration Principles

Frontend and backend should evolve together.

Neither side should guess the other's behavior.

---

## API Contracts

API contracts are shared agreements.

Changing one side requires verifying the other.

Examples:

New field

Renamed enum

Nullable value

Different money format

Different date format

These changes require integration review.

---

## Authentication

Authentication flow:

Supabase

↓

Frontend Session

↓

Access Token

↓

API

↓

Backend Validation

↓

Authorized Request

Authentication is not authorization.

Authorization always belongs to the backend.

---

## Financial Integrity

Frontend never computes authoritative financial values independently.

The backend defines:

Balances

Budgets

Monthly summaries

The frontend renders them.

---

## Query Invalidation

Whenever data changes, verify downstream consumers.

Example:

Transaction

↓

Account

↓

Budget

↓

Dashboard

↓

Reports

Think in dependencies, not isolated features.

---

## Cross-Feature Awareness

Every feature should identify:

Depends On

Affects

Used By

This prevents accidental regressions.

---

# 18. User Experience Standards

Every feature should support the complete experience.

Never optimize only for the happy path.

Every screen should consider:

Loading

Empty

Success

Error

Disabled

Pending

Offline (when relevant)

Mobile

Desktop

Keyboard

Accessibility

---

## Loading

Loading should clearly communicate progress.

Avoid layout shifts whenever possible.

---

## Empty

Empty states should explain what the user can do next.

Avoid blank pages.

---

## Errors

Errors should be actionable.

Avoid exposing technical implementation details.

---

## Success

Provide clear confirmation after successful actions.

Users should never wonder whether something worked.

---

## Accessibility

Every feature should be keyboard accessible.

Forms require labels.

Dialogs require focus management.

Icon-only buttons require accessible names.

Never communicate information using color alone.

---

## Responsive Design

Every feature should function on:

Mobile

Tablet

Desktop

Layouts should adapt gracefully without sacrificing usability.

# 19. Testing Strategy

Testing protects behavior, not implementation details.

The goal is confidence.

Not coverage for the sake of coverage.

---

## Testing Pyramid

The project follows a layered testing strategy.

```text
           E2E
      Integration
      Component
         Unit
```

Each level has a different purpose.

---

## Unit Tests

Unit tests verify isolated logic.

Examples:

- utility functions
- calculations
- date helpers
- formatters
- validation logic

Unit tests should be:

Fast

Independent

Deterministic

---

## Component Tests

Component tests verify UI behavior.

Examples:

- buttons
- forms
- dialogs
- cards
- navigation

Test behavior rather than implementation.

Avoid asserting internal state whenever possible.

---

## Integration Tests

Integration tests verify collaboration.

Examples:

- forms with API
- query invalidation
- dialog workflows
- routing
- authentication

These tests provide the highest confidence for application behavior.

---

## End-to-End Tests

E2E tests validate complete user workflows.

Examples:

Authentication

Create Account

Create Transaction

Create Budget

Navigate Months

Logout

The objective is confidence, not exhaustive UI coverage.

---

## Regression Tests

Every significant bug should receive a regression test whenever practical.

The test should fail before the fix.

Then pass after the fix.

---

## Storybook

Storybook is documentation.

It is not a replacement for testing.

Stories should demonstrate:

Default

Loading

Empty

Error

Disabled

Edge cases

Only reusable UI components require Storybook stories.

---

# 20. Documentation Standards

Documentation is part of the product.

It must evolve alongside the code.

---

## Update Documentation When

Documentation should be updated whenever a change affects:

Architecture

Routing

Business rules

API contracts

State ownership

Developer workflow

Engineering conventions

Do not leave documentation behind.

---

## Source of Truth

The codebase is the source of truth.

Documentation explains the code.

It should never describe behavior that no longer exists.

---

## Avoid Duplication

Each document should have one responsibility.

Use links instead of repeating the same information.

Example:

README

↓

Architecture Docs

↓

API Docs

↓

Playbook

---

## Living Documentation

Documentation should be reviewed continuously.

Small updates are preferred over large rewrites.

---

# 21. Technical Debt

Technical debt is inevitable.

Hidden technical debt is unacceptable.

---

## Acceptable Technical Debt

Temporary compromises are acceptable when:

The tradeoff is understood.

The impact is documented.

The solution is scheduled.

---

## Unacceptable Technical Debt

Do not accept debt that:

Introduces incorrect financial calculations.

Weakens authorization.

Creates inconsistent API contracts.

Makes future development unpredictable.

---

## Recording Debt

Technical debt should become:

Issue

Backlog item

Roadmap entry

ADR

Avoid leaving permanent TODO comments without context.

---

# 22. Feature Closure

A feature should not remain open forever.

The objective is production quality, not perfection.

---

## Must Fix Before Closing

Examples:

Broken workflow

Incorrect calculations

Authorization issue

Critical accessibility issue

Data corruption

Security issue

Missing required business rule

---

## Should Fix Before Closing

Examples:

Minor UX inconsistency

Missing Storybook story

Small refactor

Additional tests

Minor documentation improvement

These should be addressed whenever practical.

---

## Backlog

Examples:

Future enhancements

Nice-to-have animations

Additional filters

Extra visual polish

Alternative workflows

Do not block feature completion for backlog items.

---

# 23. Definition of Done

A feature is considered Done when:

✅ Primary user workflows function correctly

✅ Business rules are enforced

✅ Frontend and backend contracts match

✅ Authorization is correct

✅ Server state stays synchronized

✅ Query invalidation is correct

✅ Loading states exist

✅ Empty states exist

✅ Error states exist

✅ Important edge cases are handled

✅ Accessibility blockers are resolved

✅ Responsive layouts are functional

✅ Meaningful automated tests exist

✅ Storybook exists where appropriate

✅ Documentation reflects reality

✅ TypeScript passes

✅ Lint passes

✅ Build passes

✅ No known Critical issues remain

A feature does not need to be perfect.

It must be trustworthy.

---

# 24. Release Readiness

Before a feature is released, verify:

Frontend:

- typecheck
- lint
- tests
- build

Backend:

- typecheck
- lint
- tests
- build

If applicable:

- Storybook
- E2E
- database migrations
- release notes

Release quality is a team responsibility.

---

# 25. Code Review Philosophy

Reviews exist to improve software.

Not to criticize people.

Good reviews are:

Specific

Constructive

Respectful

Actionable

When reviewing:

Focus on correctness.

Maintainability.

Architecture.

Business rules.

User experience.

Avoid subjective style debates when conventions already exist.

---

# 26. Continuous Improvement

Every completed feature teaches something.

When a recurring problem appears:

Improve:

Architecture

Documentation

Playbook

Conventions

Testing

Automation

The process should evolve with the product.

---

# 27. Engineering Checklist

Before considering a feature complete, verify:

## Product

- [ ] Scope completed
- [ ] Business rules respected
- [ ] Out-of-scope work avoided

## Backend

- [ ] Validation complete
- [ ] Authorization verified
- [ ] Services contain business logic
- [ ] Repositories remain focused
- [ ] API contract finalized

## Frontend

- [ ] UI completed
- [ ] Responsive
- [ ] Accessible
- [ ] Loading states
- [ ] Empty states
- [ ] Error states
- [ ] Forms validated

## Integration

- [ ] API contract verified
- [ ] Authentication verified
- [ ] Query invalidation verified
- [ ] Cross-feature impacts verified

## Quality

- [ ] Unit tests
- [ ] Integration tests
- [ ] E2E tests where appropriate
- [ ] Storybook updated
- [ ] Documentation updated

## Engineering

- [ ] TypeScript passes
- [ ] Lint passes
- [ ] Build passes

---

# 28. Guiding Principles

When making engineering decisions, remember:

Prefer correctness over cleverness.

Prefer explicit code over hidden behavior.

Prefer maintainability over premature optimization.

Prefer consistency over personal preference.

Prefer composition over duplication.

Prefer small improvements over large rewrites.

Prefer documented decisions over tribal knowledge.

Prefer solving today's problem well over guessing tomorrow's.

Software is never finished.

It is continuously improved.

Every feature should leave the project in a better state than it was before.

---

# Final Reminder

This playbook defines **how we build software**.

It should evolve as the project evolves.

When the engineering process changes, update this document.

When the architecture changes, update the architecture documentation.

When coding conventions change, update the engineering standards.

When in doubt:

Build software that your future self—and your teammates—will be happy to maintain.
