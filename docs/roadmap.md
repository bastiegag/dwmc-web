# Frontend Roadmap

## Purpose

This file tracks planned frontend work.
It should stay honest about what is already implemented and what is still only a placeholder or future improvement.

## Current Focus

The current codebase shows a focus on:

- month-based budgeting and transaction entry
- improving the dashboard summary experience
- keeping the shared navigation and primary action behavior consistent
- expanding tests and Storybook coverage around core flows

## Planned Improvements

- Improve the Tools area beyond the current placeholder entries.
- Add real Profile and Settings screens.
- Expand dashboard visualizations and summary depth.
- Improve responsive behavior on wider screens.
- Add more Storybook coverage for common states.
- Expand accessibility polish around dialogs, navigation, and empty states.
- Add richer reports or charts if they become part of the product direction.
- Add recurring transaction UX if that feature is introduced.
- Add CSV import UX if that feature is introduced.

## Implemented

- Supabase authentication flows and protected routing.
- Dashboard monthly summary.
- Sections and categories.
- Accounts and computed account balances.
- Transactions for income, expense, transfer, and adjustment types.
- Monthly category budgets.
- URL-based month navigation.
- Responsive desktop/mobile navigation.
- Contextual primary actions.
- Shared API client and TanStack Query integration.
- Profile editing from the Tools area.
- Settings appearance controls from the Tools area (device-local theme preference).
- Vitest, Testing Library, MSW, Playwright, and Storybook coverage infrastructure.

## Placeholder or In Progress

- The Tools area has real Categories, Profile, and Settings destinations.
- Dashboard visualizations, responsive polish, accessibility polish, and broader component coverage may continue to evolve with the current product.

## Planned or Unconfirmed

- Production deployment and hosted PostgreSQL are future phases, not part of V1.

The following are not implemented and should not be treated as commitments until product scope is confirmed:

- Additional Settings preferences beyond the initial theme control.
- Reports or richer analytics.
- Recurring transactions.
- Import/export workflows.
- Error monitoring and deployment-specific integrations.

Update this document when a planned item becomes an accepted implementation target or ships. Do not list speculative ideas as current features.
