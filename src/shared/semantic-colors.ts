export const SEMANTIC_COLOR_OPTIONS = [
    {
        value: 'primary',
        label: 'Primary',
        swatchClassName: 'bg-primary',
        selectedTextClassName: 'data-checked:text-primary-foreground',
    },
    {
        value: 'secondary',
        label: 'Secondary',
        swatchClassName: 'bg-secondary',
        selectedTextClassName: 'data-checked:text-secondary-foreground',
    },
    {
        value: 'success',
        label: 'Success',
        swatchClassName: 'bg-success',
        selectedTextClassName: 'data-checked:text-success-foreground',
    },
    {
        value: 'info',
        label: 'Info',
        swatchClassName: 'bg-info',
        selectedTextClassName: 'data-checked:text-info-foreground',
    },
    {
        value: 'warning',
        label: 'Warning',
        swatchClassName: 'bg-warning',
        selectedTextClassName: 'data-checked:text-warning-foreground',
    },
    {
        value: 'destructive',
        label: 'Destructive',
        swatchClassName: 'bg-destructive',
        selectedTextClassName: 'data-checked:text-destructive-foreground',
    },
] as const

export type SemanticColor = (typeof SEMANTIC_COLOR_OPTIONS)[number]['value']

export const isSemanticColor = (value: unknown): value is SemanticColor =>
    typeof value === 'string' && SEMANTIC_COLOR_OPTIONS.some((option) => option.value === value)

export const getSemanticColorClassName = (value: string): string | undefined =>
    SEMANTIC_COLOR_OPTIONS.find((option) => option.value === value)?.swatchClassName
