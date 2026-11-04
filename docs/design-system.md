# Design System

## Ownership and structure

The design system is implemented in the application rather than distributed as
a separate package.

- `src/components/ui/` contains shadcn/ui and Radix-based primitives.
- `src/components/form/` contains reusable labeled inputs and form feedback.
- `src/components/layout/` contains navigation and application shell elements.
- `src/features/*/components/` contains domain-specific compositions.
- `src/stories/foundations/` documents tokens such as colors, typography,
  spacing, and surfaces.
- Component stories remain beside their components; foundation stories remain in
  `src/stories/foundations/` because they do not belong to one component.

Prefer existing primitives and feature patterns before adding a new component.
Do not duplicate a shared primitive inside a feature.

## Tailwind and tokens

Tailwind CSS v4 is configured through CSS imports in
`src/styles/globals.css`. The theme is split into:

- `colors.css` for primitive OKLCH colors and semantic tokens.
- `typography.css` for the Montserrat font, type scale, and text utilities.
- `radius.css` for the base radius and derived radius tokens.
- `utilities.css` for shared CSS utilities.

Primitive tokens describe the palette, while semantic tokens describe usage:
background, foreground, card, border, input, ring, primary, secondary,
destructive, success, warning, info, muted, accent, and their foreground or
subtle variants. Components should consume semantic tokens instead of
hardcoded colors.

Both `:root`/`.light` and `.dark` define the semantic surface and status
tokens. The existing identity uses lavender primary colors, teal secondary
colors, and distinct status colors.

## Themes and accessibility

`ThemeProvider` supports `light`, `dark`, and `system` preferences and persists
the existing storage key. System mode responds to operating-system theme
changes. Use the provider rather than adding a competing theme implementation.

All interactive controls need visible keyboard focus. Icon-only controls need
accessible labels. Dialogs need an accessible title and description, trap focus,
restore focus on close, and expose validation or API errors. Do not rely on
color alone to communicate state. Check text contrast, interactive states,
disabled states, and both light and dark themes in stories and tests.

## Storybook

Run `npm run storybook` for local component development or
`npm run build-storybook` for a production Storybook build. Stories should
represent implemented states, including light/dark themes, hover/focus,
disabled, loading, empty, error, and validation states where relevant. Use
deterministic data and avoid live API calls.
