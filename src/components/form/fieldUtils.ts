export const getFieldDescribedBy = (
    id: string,
    ariaDescribedBy: string | undefined,
    description: string | undefined,
    error: string | undefined,
): string | undefined =>
    [ariaDescribedBy, description && `${id}-description`, error && `${id}-error`]
        .filter(Boolean)
        .join(' ') || undefined
