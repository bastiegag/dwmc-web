# Design System

## Ownership and structure

The design system is implemented in the application rather than distributed as
a separate package.

- `src/components/ui/` contains shadcn-style primitives backed by Base UI where
  an accessible headless primitive is useful, plus semantic native HTML
  components for layout and content. Primitives are grouped by category:
  `actions/`, `forms/`, `overlays/`, `navigation/`, `feedback/`,
  `data-display/`, `disclosure/`, and `layout/`. Each file is PascalCase and
  exports one component family, with its `*.stories.tsx` and `*.test.tsx`
  colocated beside it.
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
foundations (field, fieldset, input group, and currency input), and semantic
content primitives (table, pagination, separator, skeleton, and scroll area).
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

Compose form fields with `Field`, `FieldLabel`, `FieldDescription`,
`FieldError`, and `Fieldset`/`FieldLegend` from `src/components/form/`. The
label, description, and error are linked to the control with `htmlFor` and
`aria-describedby`; set `aria-invalid` on the control when `invalid` is true.
Use `Controller` from React Hook Form for `CurrencyInput` and other controls
that do not expose a native `ref` value.

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

Each primitive has its own colocated `*.stories.tsx` beside its implementation
(for example `src/components/ui/forms/Combobox.stories.tsx`). Titles follow
`Design System/Components/<Category>/<Name>`. Use `tags: ['autodocs']` and
document public props in the component's story metadata. Navigate to a single
primitive in Storybook by its name under the category, and add a new story file
rather than extending a shared catalogue.

### Design workspace

- **Foundations** (`Design System/Foundations/*`) show the live token values
  read from the CSS: primitive palettes, semantic colors with light and dark
  columns, radius, shadows, borders, breakpoints, motion, spacing, typography,
  surfaces, and icons.
- **Patterns** (`Design System/Patterns/*`) compose primitives into loading,
  form-validation, error, and empty states using deterministic data.
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

Known token gaps to resolve before the visual design work:

- `--sidebar-*` and `--chart-1` to `--chart-5` are mapped in `colors.css` but
  not defined, so they resolve to nothing. The Semantic Colors story lists them.
- `--card-foreground` is defined only in `.dark`, so `text-card-foreground` has
  no value in light mode.
- `--color-white` comes from Tailwind's default theme, not from DWMC tokens.

The final visual design is owned by the developer. The foundation and pattern
stories document the current implementation; they are not a design proposal.
