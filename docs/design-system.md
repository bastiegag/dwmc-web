# Design System

## Ownership and structure

The design system is implemented in the application rather than distributed as
a separate package.

- `src/components/ui/` contains shadcn-style primitives backed by Base UI where
  an accessible headless primitive is useful, plus semantic native HTML
  components for layout and content. Primitives are grouped by category:
  `actions/`, `forms/`, `overlays/`, `navigation/`, `feedback/`,
  `data-display/`, `disclosure/`, and `layout/`. Each file is PascalCase and
  exports one component family. Stories and focused behavior tests are
  colocated beside components where they provide useful coverage; not every
  styling-only primitive needs a separate test file.
- Interactive `DatePicker` belongs in `forms/`; the reusable `Calendar`
  primitive it composes remains in `data-display/`.
- Import primitives from the root barrel `@/components/ui`, which re-exports
  each category barrel. Inside `src/components/ui/`, primitives import sibling
  or cross-category files by relative path (for example `../actions/Button`)
  and never import the root barrel, which avoids circular imports.
- `CurrencyInput` lives in `src/components/form/` and is not part of the UI
  barrel.
- `src/components/form/` contains reusable labeled inputs and form feedback.
- `src/components/layout/` contains navigation and application shell elements.
- `src/features/*/components/` contains domain-specific compositions.
- `src/stories/foundations/` documents tokens such as colors, typography,
  spacing, and surfaces.
- Component stories remain beside their components; foundation stories remain in
  `src/stories/foundations/` because they do not belong to one component.

Prefer existing primitives and feature patterns before adding a new component.
Do not duplicate a shared primitive inside a feature.

The shared primitive library includes overlays and interactions (dialog, drawer,
sheet, dropdown menu, combobox, tooltip, accordion, and number field), form
foundations (field, fieldset, input group, color picker, icon picker, and
currency input), and semantic content primitives (table, pagination,
separator, skeleton, and scroll area).
These components own accessibility and interaction behavior, but not feature
data fetching or business rules. Currency input values use decimal strings (or
`null` for empty) so callers can preserve monetary precision without relying on
binary floating-point values.

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
subtle variants, plus dedicated `link` and `link-hover` tokens. Components
should consume semantic tokens instead of hardcoded colors. Link text remains
underlined by default so links are distinguishable without relying on color.

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
disabled states, and both light and dark themes in stories and tests. Muted
foreground and link tokens are selected to preserve readable text contrast
against their respective surfaces.

## Choosing native HTML or Base UI

Use native HTML for content, layout, and simple controls where the browser
already provides correct semantics and keyboard behavior (buttons, links,
tables, lists, native inputs, and separators). Use Base UI for behavior that
needs managed state and focus, such as dialogs, menus, comboboxes, tooltips,
accordions, and number fields. Wrappers in `src/components/ui/` should add only
styling and token-based defaults; they should not hide the Base UI API.

## Form fields and currency input

Use the composed fields exported from `src/components/form/` for the
recommended form composition: `TextField`, `PasswordField`, `CurrencyInput`,
`CheckboxField`, `SwitchField`, `TextareaField`, `SelectField`,
`ComboboxField`, `RadioGroupField`, `NumberInputField`, `DatePickerField`,
`ColorPickerField`, and `IconPickerField`. These provide the field label,
description, validation message, and accessibility relationships alongside
their existing UI controls. Use the lower-level `Field`, `FieldLabel`,
`FieldDescription`, `FieldError`, and `Fieldset`/`FieldLegend` primitives when
a custom composition is needed; do not wrap an already-composed field in
another field wrapper.

`SelectField` accepts `options` and `groups` for common choices, or custom
popup `children` when option rendering needs more control. `ComboboxField`
accepts string `options` and supports custom option rendering or popup
children, while keeping the existing Combobox filtering and keyboard behavior.
For React Hook Form, use `Controller` when a control's value or callback
contract differs from a native input, such as `CurrencyInput`, select-like
controls, pickers, and date controls. Connect labels, descriptions, and errors
through the composed field props rather than duplicating their markup.

Account and section colors use the finite semantic color options in
`src/shared/semantic-colors.ts`; account and category icons use the shared
finance icon registry in `src/shared/finance-icons.ts`. Pickers and feature
displays must resolve from these registries rather than accepting arbitrary CSS
colors or maintaining separate icon maps.

`CurrencyInput` uses a `string | null` contract:

- `"12.50"`, `"0"`, and `"-25.99"` are decimal strings; `null` means empty.
  Empty is never converted to zero.
- Values are never rounded or truncated. Extra fraction digits are rejected
  while typing, and only up to the currency's fraction digits are accepted.
- Arithmetic must stay outside the component using decimal-safe logic. Do not
  use floating-point numbers as the source of truth.
- Focus shows an editable decimal with `.` as the separator. Blur shows
  `Intl.NumberFormat` currency output for the `locale` and `currency` props.
  Display formatting is never the source of truth.
- Intermediate input such as `-` or `12.` is preserved while focused and is
  normalised on commit (`12.` becomes `"12"`). Incomplete text is reverted on
  blur.
- Negative values are accepted only with `allowNegative`. `min` and `max` are
  validated against the decimal value; the range message appears after blur
  unless an `error` is supplied.

## Storybook

Run `npm run storybook` for local component development or
`npm run build-storybook` for a production Storybook build. Stories should
represent implemented states, including light/dark themes, hover/focus,
disabled, loading, empty, error, and validation states where relevant. Use
deterministic data and avoid live API calls.

Keep story files colocated with their implementations; use explicit `title`
metadata to organize the sidebar independently from source directories. The
Storybook hierarchy distinguishes:

- **Foundations** (`Design System/Foundations/*`) for design tokens and visual
  foundations.
- **Primitives** (`Design System/Primitives/*`) for low-level controls and
  building blocks that consumers can combine into custom compositions.
- **Form Fields** (`Design System/Form Fields/*`) for recommended ready-to-use
  controls with integrated labels, descriptions, validation, and accessibility
  behavior.
- **Patterns** (`Design System/Patterns/*`) for reusable interactions and
  multi-component examples, such as form validation and loading states.
- **Product** (`Design System/Product/*`) for real DWMC feature components and
  domain-specific compositions.

Use `tags: ['autodocs']` on component stories and document public props and
composition guidance in their story metadata. `.storybook/preview.ts` defines
the top-level order and alphabetizes entries within each group. Keep primitive
and composed-field stories separate; avoid duplicating the same example under
both categories.

### Design workspace

- **Foundations** show the live token values read from the CSS: primitive
  palettes, semantic colors with light and dark columns, radius, shadows,
  borders, breakpoints, motion, spacing, typography, surfaces, and icons.
- **Primitives** document the standalone controls and layout, navigation,
  overlay, feedback, data-display, and disclosure building blocks.
- **Form Fields** document complete field components, including
  `PasswordField`, beside `TextField`, `CurrencyInput`, and the other composed
  fields.
- **Patterns** compose primitives and form fields into loading, form-validation,
  error, and empty states using deterministic data.
- **Product** documents feature-level components from accounts, budgets,
  categories, dashboard, transactions, authentication, profile, and settings.
- **Viewports** use the presets in `.storybook/preview.ts`: small mobile (320),
  large mobile (430), tablet (768), and desktop (1280). Select one from the
  Storybook toolbar.
- **Theme** is toggled from the toolbar (light or dark). Storybook has no
  "system" option, so the OS preference is not previewed automatically.

Where to edit each kind of value:

| Change                              | File                        |
| ----------------------------------- | --------------------------- |
| Primitive palettes, semantic colors | `src/styles/colors.css`     |
| Font families and text styles       | `src/styles/typography.css` |
| Base radius                         | `src/styles/radius.css`     |
| Shared utilities and motion guard   | `src/styles/utilities.css`  |
| Component variants and states       | the component's `.tsx` file |
| Storybook layout or viewports       | `.storybook/preview.ts`     |

Token decisions:

- The `sidebar-*` and `chart-*` color mappings were removed. Nothing in the app
  or Storybook used them, and the chart components use the primary color
  directly. Add tokens only when a component needs them.
- `--card-foreground` is defined in both themes.

Remaining gap:

- `--color-white` comes from Tailwind's default theme, not from DWMC tokens.

The final visual design is owned by the developer. The foundation and pattern
stories document the current implementation; they are not a design proposal.
