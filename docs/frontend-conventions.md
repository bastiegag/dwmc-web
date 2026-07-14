# Frontend Conventions

## Naming Conventions

### Components

- Use PascalCase filenames.
- Use PascalCase exports.
- Use `.tsx` when the file contains JSX.

Examples:

- `BudgetCard.tsx`
- `MonthNavigator.tsx`
- `PrimaryActionButton.tsx`

### Hooks

- Use kebab-case filenames for custom hooks.
- Export the hook with camelCase.
- Use `.ts` unless the file contains JSX.

Examples:

- `use-selected-month.ts` exports `useSelectedMonth`
- `use-primary-action.ts` exports `usePrimaryAction`
- `use-budgets.ts` exports `useBudgets`

### Types

- Use `.types.ts` for domain types.

Examples:

- `budget.types.ts`
- `transaction.types.ts`

### Schemas

- Use `.schema.ts` for Zod schemas.

Examples:

- `budget.schema.ts`
- `transaction.schema.ts`

### API Files

- Use `.api.ts` for backend calls.

Examples:

- `budgets.api.ts`
- `transactions.api.ts`

### Contexts

- Use `.context.ts` for raw React context values.

Example:

- `primary-action.context.ts`

### Providers

- Use PascalCase `.tsx` files for provider components.

Example:

- `PrimaryActionProvider.tsx`

## TypeScript Conventions

- Prefer explicit types for public exports.
- Avoid `any`.
- Keep domain-specific types inside feature folders.
- Keep API response types close to the feature that uses them.
- Use type-only imports when possible.

## React Fast Refresh

Files that export React components should only export React components.

To keep Fast Refresh reliable:

- Put raw contexts in `.context.ts`.
- Put provider components in separate `.tsx` files.
- Put hooks in `.ts` files unless they contain JSX.

This avoids the `react-refresh/only-export-components` rule from becoming a problem.

Example structure:

```text
src/shared/primary-action/
  context/
    primary-action.context.ts
    PrimaryActionProvider.tsx
  hooks/
    use-primary-action.ts
  types/
    primary-action.types.ts
```

## Component Conventions

- Keep components focused.
- Prefer composition over large components.
- Pass data and callbacks through props.
- Avoid API calls directly inside UI components.
- Keep route pages responsible for orchestration.
- Extract reusable UI only after there is clear reuse.

## Form Conventions

- Use React Hook Form.
- Use Zod schemas for validation.
- Keep schemas outside components.
- Show field-level validation messages.
- Show API errors in user-friendly language.
- Reset dialog forms when closing if the form should start clean on the next open.

## API Conventions

- Components should not call `fetch` directly.
- Feature API files should use the shared `apiClient`.
- API files should not contain UI logic.
- Hooks should wrap API calls with TanStack Query.

## Styling Conventions

- Use shadcn/ui components when available.
- Use Tailwind utility classes.
- Reuse existing theme tokens.
- Avoid hardcoded colors when theme tokens already exist.
- Keep responsive behavior intentional.

## Accessibility Conventions

- Icon buttons need an `aria-label`.
- Dialogs need titles.
- Forms need labels.
- Error messages should be clear.
- Do not rely only on color to communicate state.
- Keep keyboard focus visible.
