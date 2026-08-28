import { describe, expect, it } from 'vitest'
import { transactionFormSchema } from './transaction.schema'

const validExpense = {
    type: 'EXPENSE' as const,
    amount: 25,
    date: '2026-06-01',
    accountId: 'account-1',
    categoryId: null,
    merchant: null,
    note: null,
}

describe('transactionFormSchema', () => {
    it('allows an adjustment with a zero amount', () => {
        const result = transactionFormSchema.safeParse({
            ...validExpense,
            type: 'ADJUSTMENT',
            amount: 0,
        })

        expect(result.success).toBe(true)
    })

    it('requires positive amounts for ordinary transactions', () => {
        const result = transactionFormSchema.safeParse({ ...validExpense, amount: 0 })

        expect(result.success).toBe(false)
        if (result.success) throw new Error('Expected transaction validation to fail')
        expect(result.error.issues).toContainEqual(
            expect.objectContaining({
                path: ['amount'],
                message: 'Amount must be greater than 0',
            }),
        )
    })

    it('validates both transfer accounts and rejects the same account', () => {
        const missingAccounts = transactionFormSchema.safeParse({
            ...validExpense,
            type: 'TRANSFER',
            accountId: null,
            fromAccountId: null,
            toAccountId: null,
        })
        expect(missingAccounts.success).toBe(false)
        if (missingAccounts.success) throw new Error('Expected transfer validation to fail')
        expect(missingAccounts.error.issues.map((issue) => issue.message)).toEqual(
            expect.arrayContaining(['From account is required', 'To account is required']),
        )

        const sameAccount = transactionFormSchema.safeParse({
            ...validExpense,
            type: 'TRANSFER',
            accountId: null,
            fromAccountId: 'account-1',
            toAccountId: 'account-1',
        })
        expect(sameAccount.success).toBe(false)
        if (sameAccount.success) throw new Error('Expected same-account transfer to fail')
        expect(sameAccount.error.issues).toContainEqual(
            expect.objectContaining({
                path: ['toAccountId'],
                message: 'From and To accounts must be different',
            }),
        )
    })

    it('rejects a category on a transfer and overlong optional text', () => {
        const result = transactionFormSchema.safeParse({
            ...validExpense,
            type: 'TRANSFER',
            accountId: null,
            fromAccountId: 'account-1',
            toAccountId: 'account-2',
            categoryId: 'category-1',
            merchant: 'm'.repeat(121),
            note: 'n'.repeat(501),
        })

        expect(result.success).toBe(false)
        if (result.success) throw new Error('Expected transfer validation to fail')
        expect(result.error.issues.map((issue) => issue.message)).toEqual(
            expect.arrayContaining([
                'Category is not allowed for transfers',
                'Merchant must be 120 characters or fewer',
                'Note must be 500 characters or fewer',
            ]),
        )
    })
})
