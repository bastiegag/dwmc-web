/**
 * Returns the current month in YYYY-MM format.
 */
export const getCurrentMonth = (): string => {
    return new Date().toISOString().slice(0, 7)
}

/**
 * Validates if a string is a valid month in YYYY-MM format.
 * @param value The string to validate.
 * @returns True if the string is a valid month, false otherwise.
 */
export const isValidMonth = (value: unknown): value is string => {
    if (typeof value !== 'string') {
        return false
    }
    return /^\d{4}-(0[1-9]|1[0-2])$/.test(value)
}

/**
 * Formats a month string (YYYY-MM) into a human-readable label.
 * @param month The month string to format.
 * @param locale The locale to use for formatting.
 * @returns The formatted month label (e.g., "June 2026").
 */
export const formatMonthLabel = (month: string, locale = 'fr-CA'): string => {
    const [year, monthIndex] = month.split('-').map(Number)
    const date = new Date(year, monthIndex - 1)
    return new Intl.DateTimeFormat(locale, {
        month: 'long',
        year: 'numeric',
        timeZone: 'UTC', // Ensure consistent month formatting regardless of user's timezone
    }).format(date)
}

/**
 * Adds a specified number of months to a given month string.
 * @param month The starting month in YYYY-MM format.
 * @param delta The number of months to add (can be negative).
 * @returns The new month in YYYY-MM format.
 */
export const addMonths = (month: string, delta: number): string => {
    const [year, monthIndex] = month.split('-').map(Number)
    const date = new Date(Date.UTC(year, monthIndex - 1, 1))
    date.setUTCMonth(date.getUTCMonth() + delta)
    return date.toISOString().slice(0, 7)
}
