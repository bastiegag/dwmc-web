const transactionDateKey = (userId: string, month: string) => `last-tx-date:${userId}:${month}`

type TransactionDateStorage = Pick<Storage, 'getItem' | 'setItem'>
const browserStorage = (): TransactionDateStorage | null =>
    typeof window === 'undefined' ? null : window.localStorage

export const isValidTransactionDate = (value: string | null | undefined): value is string => {
    if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false

    const [year, month, day] = value.split('-').map(Number)
    const date = new Date(Date.UTC(year, month - 1, day))

    return (
        date.getUTCFullYear() === year &&
        date.getUTCMonth() === month - 1 &&
        date.getUTCDate() === day
    )
}

export const getRememberedTransactionDate = (
    userId: string | null | undefined,
    month: string,
    storage: TransactionDateStorage | null = browserStorage(),
) => {
    if (!userId || !storage) return null

    const value = storage.getItem(transactionDateKey(userId, month))
    return isValidTransactionDate(value) && value.startsWith(`${month}-`) ? value : null
}

export const rememberTransactionDate = (
    userId: string | null | undefined,
    month: string,
    date: string,
    storage: TransactionDateStorage | null = browserStorage(),
) => {
    if (!storage || !userId || !isValidTransactionDate(date) || !date.startsWith(`${month}-`))
        return

    storage.setItem(transactionDateKey(userId, month), date)
}

export { transactionDateKey }
