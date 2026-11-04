import { describe, expect, it } from 'vitest'
import { toCreateTransactionPayload } from '@/features/transactions/utils/to-create-transaction-payload'
import type { TransactionFormValues } from '@/features/transactions/schemas/transaction.schema'

const values = (overrides: Partial<TransactionFormValues>): TransactionFormValues => ({
    type: 'EXPENSE',
    amount: 12.5,
    date: '2026-05-15',
    accountId: 'account-1',
    fromAccountId: null,
    toAccountId: null,
    categoryId: null,
    merchant: null,
    note: null,
    ...overrides,
})

describe('toCreateTransactionPayload', () => {
    it.each([
        ['INCOME', { accountId: 'account-1', categoryId: 'category-1', merchant: 'Pay' }],
        ['EXPENSE', { accountId: 'account-1', categoryId: 'category-1', merchant: 'Store' }],
    ] as const)('maps %s fields', (type, fields) => {
        expect(toCreateTransactionPayload(values({ type, ...fields }))).toMatchObject({
            type,
            ...fields,
            amount: 12.5,
            date: '2026-05-15',
        })
    })

    it('maps transfers without unrelated fields', () => {
        expect(
            toCreateTransactionPayload(
                values({
                    type: 'TRANSFER',
                    accountId: null,
                    fromAccountId: 'from',
                    toAccountId: 'to',
                    categoryId: 'ignored',
                    merchant: 'ignored',
                }),
            ),
        ).toEqual({
            type: 'TRANSFER',
            amount: 12.5,
            date: '2026-05-15',
            fromAccountId: 'from',
            toAccountId: 'to',
            note: undefined,
        })
    })

    it('maps adjustments and reports missing required accounts', () => {
        expect(
            toCreateTransactionPayload(
                values({ type: 'ADJUSTMENT', accountId: 'account-1', amount: -5 }),
            ),
        ).toMatchObject({ type: 'ADJUSTMENT', amount: -5, accountId: 'account-1' })
        expect(() =>
            toCreateTransactionPayload(values({ type: 'ADJUSTMENT', accountId: null })),
        ).toThrow('Account is required')
    })
})
