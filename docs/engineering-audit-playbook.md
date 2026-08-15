# Engineering Audit Playbook

> **Project:** Dude, Where's My Cash?
>
> Version: 1.0
>
> Status: Living document
>
> This playbook defines how engineering audits are performed across the project.
>
> Its purpose is to evaluate implementation quality, verify correctness, reduce regressions, and determine whether a feature is ready to be considered complete.
>
> This document describes **how software is evaluated**, not how it is implemented.

---

# 1. Purpose

Engineering audits exist to protect product quality.

Their objectives are to:

- verify correctness
- detect regressions
- validate business rules
- verify frontend/backend integration
- identify architectural drift
- evaluate maintainability
- ensure consistency across the project
- determine release readiness

An audit is not intended to criticize implementation.

It exists to improve software quality.

---

# 2. Audit Philosophy

Every audit follows the same principles.

## The code is the source of truth.

Never assume behavior.

Always verify.

---

## Evaluate implementation.

Not intentions.

Not TODO comments.

Not future plans.

Only the implemented behavior matters.

---

## Focus on user impact.

Always prioritize issues that affect users.

Examples:

- incorrect calculations
- broken workflows
- security issues
- authorization bugs
- inconsistent data

before

- formatting
- naming
- minor refactors

---

## Correctness before elegance.

Correct software always has priority over elegant software.

---

## Consistency over preference.

Do not request changes simply because another implementation would also work.

Prefer consistency with the existing project.

---

## Evidence-based findings.

Every finding should include:

- what was inspected
- what was observed
- why it matters
- recommended action

Avoid subjective opinions.

---

# 3. Audit Workflow

Every completed feature follows the same review process.

```text
Feature Complete
        ↓
Engineering Audit
        ↓
Findings
        ↓
Fixes
        ↓
Re-Audit
        ↓
Release Audit
        ↓
READY TO CLOSE
```

If significant issues remain, the feature is **not ready to close**.

---

# 4. Audit Scope

An audit may inspect:

- frontend
- backend
- API contracts
- integration
- database
- testing
- accessibility
- documentation
- architecture
- developer experience

Not every audit must inspect every area.

The scope depends on the feature.

---

# 5. Audit Types

Several audit types exist.

---

## Feature Audit

Evaluates one feature.

Example:

Authentication

Transactions

Budgets

Dashboard

---

## Integration Audit

Evaluates interactions between multiple features.

Example:

Transaction

↓

Account

↓

Budget

↓

Dashboard

---

## Accessibility Audit

Evaluates usability.

Examples:

Keyboard navigation

Focus management

ARIA

Screen readers

Contrast

---

## Performance Audit

Evaluates efficiency.

Examples:

Bundle size

React rendering

Lazy loading

Query usage

Animations

---

## Security Audit

Evaluates:

Authentication

Authorization

Input validation

Secrets

Ownership

---

## Documentation Audit

Evaluates:

README

Architecture docs

Playbooks

Copilot instructions

Roadmaps

---

## Release Audit

Final verification before closing a feature.

---

# 6. Audit Principles

Every audit should answer five questions.

## Is it correct?

Does the software behave correctly?

---

## Is it complete?

Are all expected workflows implemented?

---

## Is it maintainable?

Would another developer understand this implementation?

---

## Is it consistent?

Does it follow project conventions?

---

## Is it production-ready?

Would this implementation be acceptable in production?

If the answer is "no", explain why.

---

# 7. Severity Levels

Every finding must have a severity.

---

## Critical

Examples:

Data corruption

Security vulnerability

Authorization bypass

Financial calculation errors

Application crash

Loss of user data

Critical findings block release.

---

## High

Examples:

Broken user workflow

Incorrect API contract

Incorrect cache invalidation

Broken integration

Missing required validation

High findings must be resolved before closing the feature.

---

## Medium

Examples:

Poor UX

Missing tests

Architecture inconsistency

Accessibility issue

Medium findings require engineering judgment.

---

## Low

Examples:

Minor duplication

Naming inconsistency

Small refactor

Minor documentation issue

Low findings should normally become backlog work.

---

## Suggestion

Examples:

Possible simplification

Future abstraction

Alternative implementation

Additional Storybook stories

Suggestions never block release.

---

# 8. Audit Mindset

The objective is not to find as many issues as possible.

The objective is to identify the issues that matter.

Avoid:

- inventing requirements
- proposing unnecessary abstractions
- requesting stylistic rewrites
- blocking releases for cosmetic improvements

Prefer practical engineering judgment.

---

# 9. Evidence

Every finding should include evidence.

Examples:

Observed behavior

Expected behavior

Potential impact

Recommendation

Avoid vague statements.

Instead of:

"This architecture could be improved."

Prefer:

"Transaction creation invalidates the transaction list but does not invalidate the dashboard summary, which can display stale monthly totals."

# 10. Feature Audit

The Feature Audit is the primary engineering review performed before a feature can be considered complete.

Its objective is to verify that the feature behaves correctly, integrates properly with the rest of the application, follows project conventions, and is production-ready.

Every feature should receive a Feature Audit before being closed.

---

# 11. Feature Audit Checklist

A complete Feature Audit should evaluate the following areas.

---

## Functionality

Verify that the feature works as expected.

Questions:

- Are all primary workflows functional?
- Are all expected actions implemented?
- Are edge cases handled?
- Are user-facing errors understandable?
- Are success states visible?

---

## Business Rules

Business rules are one of the highest priorities.

Verify:

- Rules match product expectations.
- Backend remains authoritative.
- No frontend-only business logic exists unless intentionally designed.
- Financial calculations are correct.
- Invalid operations are rejected.

---

## User Experience

Evaluate the complete user experience.

Verify:

Loading

Empty

Error

Success

Pending

Disabled

Responsive

Keyboard

Accessibility

A feature is not complete if only the happy path works.

---

## Frontend Architecture

Inspect the frontend implementation.

Examples:

- Feature boundaries respected
- Shared code used appropriately
- No duplicated business logic
- Correct use of React Query
- Proper form handling
- Components remain focused
- Existing patterns respected

---

## Backend Architecture

Inspect backend responsibilities.

Verify:

- Routes remain thin
- Services own business rules
- Repositories own persistence
- Validation occurs before business logic
- Authorization is enforced
- Database responsibilities remain clear

---

## Integration

Verify frontend and backend work together correctly.

Inspect:

- API contracts
- Request payloads
- Response models
- Error responses
- Authentication
- Authorization
- Ownership
- Date handling
- Money serialization

---

## State Management

Verify correct ownership.

Examples:

Server state

↓

TanStack Query

Form state

↓

React Hook Form

Navigation

↓

URL

Temporary UI

↓

Component state

Shared lightweight UI

↓

React Context

Avoid duplicated state.

---

## Cache Consistency

Every mutation should update every affected area.

Examples:

Create Transaction

↓

Transactions

↓

Accounts

↓

Budgets

↓

Dashboard

↓

Reports

If dependent views remain stale, report it.

---

## Navigation

Verify:

- routing
- deep links
- URL state
- selected month
- browser navigation
- refresh behavior

Navigation should remain predictable.

---

## Accessibility

Inspect:

- labels
- keyboard navigation
- focus management
- dialogs
- icon buttons
- screen reader support
- visible focus
- color usage

Accessibility should be considered part of feature completeness.

---

## Performance

Inspect only meaningful performance risks.

Examples:

- excessive rendering
- unnecessary API calls
- duplicated requests
- expensive calculations
- unnecessary effects

Avoid premature optimization findings.

---

## Testing

Evaluate existing automated tests.

Verify:

Unit

Component

Integration

E2E

Regression coverage

Missing tests should be reported when they reduce confidence.

---

## Storybook

Verify reusable components.

Questions:

- Are reusable UI components documented?
- Do stories cover important states?
- Are visual regressions easier to detect?

Pages generally do not require Storybook.

---

## Documentation

Verify that documentation reflects implementation.

Examples:

README

Architecture

API docs

Playbooks

Roadmap

Copilot instructions

Documentation should describe reality.

---

# 12. Integration Audit

Some features require an additional Integration Audit.

Its objective is to verify interactions between multiple domains.

Examples:

Transaction

↓

Account

↓

Budget

↓

Dashboard

↓

Reports

The implementation may be correct in isolation while still failing as a complete workflow.

---

## API Contracts

Verify:

- request shape
- response shape
- nullable fields
- enums
- identifiers
- pagination
- filtering
- dates

Frontend and backend must agree.

---

## Authentication

Verify:

Supabase Session

↓

Access Token

↓

Authorization Header

↓

Backend Validation

↓

Authorized User

↓

User-owned Resources

Authentication failures should be handled gracefully.

---

## Authorization

Verify:

Every user can only access their own resources.

Ownership must always be enforced by the backend.

Frontend restrictions are not sufficient.

---

## Money

Verify:

Amounts

Signs

Currency formatting

Decimal precision

Balance calculations

Budget calculations

Never assume calculations are correct.

Verify them.

---

## Dates

Inspect:

Timezone assumptions

Selected month

Month filtering

Transaction dates

Boundary conditions

Financial applications require predictable date handling.

---

## Query Invalidation

One of the most common sources of regressions.

After every mutation ask:

What else depends on this data?

Example:

Create Budget

↓

Budgets

↓

Dashboard

↓

Budget Progress

↓

Monthly Summary

All affected queries should remain synchronized.

---

# 13. Documentation Audit

Documentation is part of the product.

Inspect:

README

Architecture

Conventions

Routing

State management

API documentation

Playbooks

Roadmaps

Copilot instructions

Examples should match the implementation.

Outdated documentation should be reported.

---

# 14. Testing Audit

Evaluate confidence.

Not just coverage.

Questions:

Are important workflows tested?

Are business rules tested?

Are regressions protected?

Are API contracts validated?

Are error cases tested?

Are accessibility behaviors covered where appropriate?

Favor meaningful tests over large numbers of tests.

---

# 15. Accessibility Audit

Accessibility is evaluated separately when necessary.

Checklist:

- semantic HTML
- labels
- headings
- landmarks
- keyboard navigation
- focus order
- dialogs
- ARIA attributes
- form validation
- error announcements
- contrast
- touch targets
- reduced motion where appropriate

Accessibility issues should be classified according to user impact.

---

# 16. Performance Audit

Performance audits focus on measurable issues.

Inspect:

- unnecessary renders
- expensive computations
- repeated requests
- oversized bundles
- lazy loading
- memoization where justified
- React Query configuration

Avoid recommending optimization without measurable benefit.

---

# 17. Security Audit

Security reviews focus on protecting users and financial data.

Verify:

Authentication

Authorization

Ownership

Input validation

Output encoding

Secrets management

Sensitive logging

Unsafe client assumptions

Backend validation

Financial applications should default to secure behavior.

# 18. Release Audit

The Release Audit is the final engineering review performed before a feature is considered complete.

Its objective is not to re-review the implementation.

Its objective is to ensure that the feature is safe to ship.

A successful Release Audit results in one of three outcomes:

- GO
- GO WITH NON-BLOCKING ISSUES
- NO-GO

---

# 19. Release Checklist

Before approving a release, verify the following.

## Product

- Feature scope completed
- User workflows verified
- Business rules respected
- No unfinished core functionality

---

## Frontend

Verify:

- TypeScript passes
- ESLint passes
- Build succeeds
- Responsive layouts work
- Accessibility blockers resolved
- Loading states exist
- Error states exist
- Empty states exist

---

## Backend

Verify:

- TypeScript passes
- Build succeeds
- Validation complete
- Authorization verified
- Database migrations validated
- No breaking API changes without coordination

---

## Integration

Verify:

- API contracts match
- Authentication works
- Authorization works
- Query invalidation complete
- Money calculations correct
- Date handling correct

---

## Testing

Verify:

- Unit tests
- Component tests
- Integration tests
- End-to-end tests (where appropriate)
- Regression tests for important bugs

The goal is confidence.

Not 100% coverage.

---

## Documentation

Verify:

README

Architecture

Conventions

API documentation

Playbooks

Copilot Instructions

Roadmap

Documentation should accurately reflect the implementation being released.

---

# 20. Audit Report

Every audit should produce a structured report.

Recommended format:

```text
Executive Summary

Scope

Strengths

Critical Findings

High Findings

Medium Findings

Low Findings

Suggestions

Must Fix

Should Fix

Backlog

Risks

Final Verdict
```

A consistent report format makes audits easier to compare over time.

---

# 21. Findings

Every finding should contain enough information for another engineer to understand and reproduce the issue.

Each finding should include:

Description

Evidence

Impact

Recommendation

Severity

Example:

```text
Title

Dashboard summary is not invalidated after creating a transaction.

Evidence

Creating a transaction updates the transaction list but the monthly summary remains stale until a page refresh.

Impact

Users may see incorrect monthly totals.

Severity

High

Recommendation

Invalidate the monthly summary query whenever transaction mutations succeed.
```

Avoid vague statements.

Recommendations should be actionable.

---

# 22. Closure Rules

A feature may only be closed after the engineering review is complete.

---

## Critical

Critical findings always block closure.

Examples:

Security vulnerability

Data corruption

Incorrect financial calculations

Authorization bypass

Application crash

---

## High

High findings normally block closure.

Examples:

Broken workflows

Incorrect API contracts

Incorrect cache invalidation

Missing ownership validation

Broken integrations

---

## Medium

Medium findings require engineering judgment.

Examples:

Missing tests

Minor accessibility issues

Architecture inconsistencies

Small UX problems

Medium findings should be fixed whenever practical.

Remaining items should be documented.

---

## Low

Low findings never block closure by themselves.

Examples:

Minor duplication

Naming inconsistencies

Documentation improvements

Refactoring opportunities

Move these items to the backlog if appropriate.

---

## Suggestions

Suggestions are ideas.

Not requirements.

Examples:

Possible simplification

Alternative implementation

Additional Storybook coverage

Extra documentation

Suggestions should never delay a release.

---

# 23. Final Verdict

Every audit ends with one clear verdict.

Only one verdict should be returned.

---

## READY TO CLOSE

Requirements:

- No Critical findings
- No High findings
- Feature behaves correctly
- Business rules respected
- Integration verified
- Documentation updated
- Quality gates passed

The feature may proceed to Release Audit.

---

## NOT READY TO CLOSE

Returned whenever blocking issues remain.

The audit should include:

Must Fix Before Closing

Should Fix Before Closing

Backlog

Developers should know exactly what remains.

---

# 24. Continuous Improvement

Engineering audits are not only about finding defects.

They also improve the engineering process.

When recurring issues appear, consider improving:

Architecture

Documentation

Testing

Playbooks

Developer tooling

Automation

Coding conventions

An audit should leave the project stronger than before.

---

# 25. Audit Anti-Patterns

Avoid the following during reviews.

---

## Inventing Requirements

Do not fail an audit because of requirements that never existed.

Audit the implemented product.

Not an imaginary one.

---

## Personal Preferences

Do not request changes because you would have implemented them differently.

Only report meaningful engineering concerns.

---

## Chasing Perfection

Every project has technical debt.

The objective is production quality.

Not perfection.

---

## Cosmetic Blocking

Do not block a release for:

Formatting

Import ordering

Minor naming differences

Stylistic preferences

unless they violate established project conventions.

---

## Architecture by Opinion

Do not recommend abstractions simply because they are fashionable.

Every abstraction should solve an existing problem.

---

# 26. Audit Checklist

Use this checklist before closing any feature.

## Functionality

- [ ] Primary workflows complete
- [ ] Business rules respected
- [ ] Edge cases handled

---

## Frontend

- [ ] Architecture respected
- [ ] Components focused
- [ ] State ownership correct
- [ ] Query invalidation complete
- [ ] Responsive
- [ ] Accessible

---

## Backend

- [ ] Validation complete
- [ ] Authorization enforced
- [ ] Business logic correctly placed
- [ ] Persistence isolated
- [ ] API contract stable

---

## Integration

- [ ] Authentication verified
- [ ] API contract verified
- [ ] Cross-feature impacts verified
- [ ] Dates verified
- [ ] Money verified

---

## Quality

- [ ] Tests
- [ ] Storybook (when applicable)
- [ ] Documentation updated

---

## Engineering

- [ ] TypeScript passes
- [ ] Lint passes
- [ ] Build passes

---

# 27. Engineering Philosophy

Engineering audits exist to increase confidence.

Not fear.

A successful audit should answer one question:

> **Can another engineer confidently maintain this feature six months from now?**

If the answer is yes, the feature is likely ready.

If the answer is no, identify why and provide actionable recommendations.

The goal of every audit is to make the software—and the engineering team—better than before.

---

# Final Reminder

An audit is not a search for perfection.

It is a structured engineering review that balances:

- correctness
- maintainability
- consistency
- user impact
- engineering judgment

Every finding should help improve the product.

Every audit should make future development easier.

Quality is not achieved by preventing change.

Quality is achieved by making change safe.
