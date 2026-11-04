import { format, isValid, parse } from 'date-fns'

export const formatLocalDate = (date: Date = new Date()): string => format(date, 'yyyy-MM-dd')

export const parseDateOnly = (value: string): Date => {
    const parsed = parse(value, 'yyyy-MM-dd', new Date())
    return isValid(parsed) ? parsed : new Date(Number.NaN)
}

export const isValidDateOnly = (value: string): boolean => {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false
    const parsed = parseDateOnly(value)
    return isValid(parsed) && format(parsed, 'yyyy-MM-dd') === value
}
