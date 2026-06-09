import { z } from 'zod'
import type { TransactionType } from '@/features/transactions/types/transaction.types'

const baseSchema = z.object({
    type: z.enum(['INCOME', 'EXPENSE', 'TRANSFER', 'ADJUSTMENT'] as const),
    amount: z.preprocess((v) => {
        if (v === '' || v === null || v === undefined) return 0
        if (typeof v === 'string') return Number(v)
        return v
    }, z.number()),
    date: z.string().min(1, 'Date is required'),
    accountId: z.string().nullable().optional(),
    fromAccountId: z.string().nullable().optional(),
    toAccountId: z.string().nullable().optional(),
    categoryId: z.string().nullable().optional(),
    merchant: z.string().nullable().optional(),
    note: z.string().nullable().optional(),
})

export const transactionFormSchema = baseSchema.superRefine((data, ctx) => {
    const type = data.type as TransactionType

    // Amount rules
    if (type === 'ADJUSTMENT') {
        if (typeof data.amount !== 'number')
            ctx.addIssue({
                code: z.ZodIssueCode.invalid_type,
                message: 'Amount is required',
                path: ['amount'],
            })
    } else {
        if (typeof data.amount !== 'number' || !(data.amount > 0)) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'Amount must be greater than 0',
                path: ['amount'],
            })
        }
    }

    // Account requirements
    if (type === 'TRANSFER') {
        if (!data.fromAccountId)
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'From account is required',
                path: ['fromAccountId'],
            })
        if (!data.toAccountId)
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'To account is required',
                path: ['toAccountId'],
            })
        if (data.fromAccountId && data.toAccountId && data.fromAccountId === data.toAccountId) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'From and To accounts must be different',
                path: ['toAccountId'],
            })
        }
        // Transfer should not use category
        if (data.categoryId)
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'Category is not allowed for transfers',
                path: ['categoryId'],
            })
    } else if (type === 'INCOME' || type === 'EXPENSE' || type === 'ADJUSTMENT') {
        if (!data.accountId)
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'Account is required',
                path: ['accountId'],
            })
    }

    // Merchant and note trimming + length
    if (typeof data.merchant === 'string') {
        const trimmed = data.merchant.trim()
        if (trimmed.length > 120)
            ctx.addIssue({
                code: z.ZodIssueCode.too_big,
                message: 'Merchant must be 120 characters or fewer',
                path: ['merchant'],
            })
    }
    if (typeof data.note === 'string') {
        const trimmed = data.note.trim()
        if (trimmed.length > 500)
            ctx.addIssue({
                code: z.ZodIssueCode.too_big,
                message: 'Note must be 500 characters or fewer',
                path: ['note'],
            })
    }
})

export type TransactionFormValues = z.infer<typeof transactionFormSchema>

export const defaultTransactionFormValues: TransactionFormValues = {
    type: 'EXPENSE',
    amount: 0,
    date: new Date().toISOString().slice(0, 10),
    accountId: null,
    fromAccountId: null,
    toAccountId: null,
    categoryId: null,
    merchant: null,
    note: null,
}

export default transactionFormSchema
