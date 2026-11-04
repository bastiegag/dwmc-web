import type { TransactionFormValues } from '@/features/transactions/schemas/transaction.schema'
import type { CreateTransactionPayload } from '@/features/transactions/types/transaction.types'

const required = (value: string | null | undefined, field: string): string => {
    if (!value) throw new Error(`${field} is required`)
    return value
}

export const toCreateTransactionPayload = (
    values: TransactionFormValues,
): CreateTransactionPayload => {
    switch (values.type) {
        case 'TRANSFER':
            return {
                type: values.type,
                amount: values.amount,
                date: values.date,
                fromAccountId: required(values.fromAccountId, 'From account'),
                toAccountId: required(values.toAccountId, 'To account'),
                note: values.note ?? undefined,
            }
        case 'ADJUSTMENT':
            return {
                type: values.type,
                amount: values.amount,
                date: values.date,
                accountId: required(values.accountId, 'Account'),
                note: values.note ?? undefined,
            }
        case 'INCOME':
        case 'EXPENSE':
            return {
                type: values.type,
                amount: values.amount,
                date: values.date,
                accountId: required(values.accountId, 'Account'),
                categoryId: values.categoryId ?? undefined,
                merchant: values.merchant ?? undefined,
                note: values.note ?? undefined,
            }
    }
}
