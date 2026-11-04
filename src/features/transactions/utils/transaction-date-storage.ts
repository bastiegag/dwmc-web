import { isValidDateOnly } from '@/shared/date'

const transactionDateKey = (userId: string, month: string) => `last-tx-date:${userId}:${month}`

type TransactionDateStorage = Pick<Storage, 'getItem' | 'setItem'>

export const isValidTransactionDate = (value: string | null | undefined): value is string => {
    return Boolean(value && isValidDateOnly(value))
}

export const getRememberedTransactionDate = (
    userId: string | null | undefined,
    month: string,
    storage: TransactionDateStorage = localStorage,
) => {
    if (!userId) return null

    const value = storage.getItem(transactionDateKey(userId, month))
    return isValidTransactionDate(value) && value.startsWith(`${month}-`) ? value : null
}

export const rememberTransactionDate = (
    userId: string | null | undefined,
    month: string,
    date: string,
    storage: TransactionDateStorage = localStorage,
) => {
    if (!userId || !isValidTransactionDate(date) || !date.startsWith(`${month}-`)) return

    storage.setItem(transactionDateKey(userId, month), date)
}

export { transactionDateKey }
