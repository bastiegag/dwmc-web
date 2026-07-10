# Copilot Instructions for dwmc-web

## Frontend Project Context

dwmc-web is the frontend for a personal budget app built with React, Vite, TypeScript, React Router, TanStack Query, React Hook Form, Zod, shadcn/ui, Tailwind CSS, Supabase Auth, Storybook, Vitest, Playwright, ESLint, and Prettier.

The goal is to keep the app maintainable, accessible, type-safe, and polished enough for a senior frontend portfolio project.

## General Frontend Principles

- Follow existing patterns before introducing new ones
- Prefer simple, maintainable code over clever abstractions
- Keep features modular
- Use TypeScript strictly
- Avoid `any`
- Avoid unnecessary dependencies
- Do not rewrite unrelated code
- Keep frontend and backend responsibilities separate
- Do not calculate backend-owned values on the frontend when the backend already returns them
- Do not store app domain data in `localStorage`

## Architecture

- Use a feature-based architecture
- Keep feature code inside `src/features/<feature-name>`
- Keep cross-feature logic inside `src/shared`
- Keep reusable layout components outside feature folders
- Keep API calls in `.api.ts` files
- Keep TanStack Query logic in hooks
- Keep form validation in Zod schemas
- Keep types in `.types.ts` files

## Naming

- Components: PascalCase filenames and exports
- Hooks: kebab-case filenames, camelCase exports
- Types: `.types.ts`
- Schemas: `.schema.ts`
- API modules: `.api.ts`
- Contexts: `.context.ts`
- Provider components: `ProviderName.tsx`
- Use `.tsx` only when a file contains JSX
- Use `.ts` when there is no JSX

## React Fast Refresh

- Files exporting React components should only export React components
- Do not export raw React contexts from the same file as components
- Put contexts in `.context.ts`
- Put provider components in separate `.tsx` files
- Put hooks in `.ts` files unless they contain JSX

Example:

```
src/shared/primary-action/
    context/primary-action.context.ts
    context/PrimaryActionProvider.tsx
    hooks/use-primary-action.ts
    types/primary-action.types.ts
```

## API and Auth

- Use the shared `apiClient` for backend requests
- Do not call `fetch` directly from components
- Do not call Supabase directly for app domain data
- Supabase Auth is used for authentication
- Backend requests include the Supabase access token
- Handle API errors with the existing error envelope

## TanStack Query

- Query keys must be stable
- Include filters like `month` in query keys
- Use query hooks for reads
- Use mutation hooks for creates, updates, and archives
- Invalidate affected queries after mutations
- Prefer precise invalidation over manual refetch

## Forms

- Use React Hook Form
- Use Zod for validation
- Keep schemas outside components
- Show clear validation messages
- Show API errors in a user-friendly way
- Reset dialog forms when appropriate

## Month Navigation

- The selected month comes from the URL query param `month=YYYY-MM`
- Do not store selected month in `localStorage`
- Preserve the selected month when navigating between app screens
- Dashboard, Transactions, and Budgets should use the selected month
- Transaction creation should default to a date inside the selected month

## Contextual Primary Action

- The floating `+` button is contextual
- Dashboard and Transactions: add transaction
- Budgets: add budget using the selected month
- Accounts: add account
- Tools: hide by default unless there is a clear action
- Clear registered actions when pages unmount

## UI and Accessibility

- Use shadcn/ui components where appropriate
- Use Tailwind CSS
- Keep components small and focused
- Add accessible labels to icon buttons
- Use proper dialog titles
- Do not rely only on color for state
- Keep keyboard focus visible

## Testing

- Add or update tests for meaningful behavior
- Test month navigation
- Test contextual primary actions
- Test form validation
- Test query invalidation behavior where practical
- Use existing test utilities
- Do not add a new test framework

## Documentation

- Update the frontend README when adding major features
- Document new environment variables
- Document new scripts
- Keep docs aligned with actual code
- Move planned but unfinished features to Roadmap
