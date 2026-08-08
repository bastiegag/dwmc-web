# Frontend Conventions

Follow the closest existing feature pattern before introducing a new abstraction. These are conventions for new work; existing legacy names do not need to be renamed solely to match them.

## Names and Extensions

| Kind         | Convention                            | Example                                      |
| ------------ | ------------------------------------- | -------------------------------------------- |
| Components   | PascalCase filename and export        | `BudgetCard.tsx`                             |
| Hooks        | kebab-case filename, camelCase export | `use-selected-month.ts` → `useSelectedMonth` |
| Types        | `.types.ts`                           | `budget.types.ts`                            |
| Schemas      | `.schema.ts`                          | `budget.schema.ts`                           |
| API modules  | `.api.ts`                             | `budgets.api.ts`                             |
| Raw contexts | `.context.ts`                         | `primary-action.context.ts`                  |
| Providers    | PascalCase `.tsx` component file      | `PrimaryActionProvider.tsx`                  |

Use `.tsx` only when JSX exists. Use `.ts` for non-JSX modules.

## Feature Boundaries

Keep domain code in `src/features/<feature>`. Pages orchestrate hooks and components. API modules contain transport calls, hooks contain TanStack Query integration, schemas contain validation, and types remain close to their feature. Use public feature exports where they exist; do not reach into another feature's internals without a concrete reason.

Reusable layout, feedback, form, and UI primitives belong in `src/components`. Cross-feature systems belong in `src/shared`. Low-level clients belong in `src/lib`.

## Fast Refresh

Do not export a raw React context from the same file as a component when that violates `react-refresh/only-export-components`.

```text
context/primary-action.context.ts
PrimaryActionProvider.tsx
hooks/use-primary-action.ts
```

Keep providers and contexts separate, and keep hooks in `.ts` files unless they contain JSX.

## Forms, API, and UI

- Use React Hook Form with Zod schemas for forms.
- Use `apiClient` through feature API modules; components must not call `fetch` directly for domain data.
- Keep backend-derived calculations in the backend response.
- Use existing shadcn/Radix primitives and Tailwind tokens before adding custom UI.
- Give icon buttons accessible labels, dialogs titles, and forms labels.
- Do not rely on color alone to communicate state, and preserve visible keyboard focus.

## Money and Dates

Use the existing currency-formatting helpers and backend-provided numeric values. Use the shared month utilities for `YYYY-MM` navigation and preserve the selected month when building app links.
