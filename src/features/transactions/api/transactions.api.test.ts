import { beforeEach, describe, expect, it, vi } from 'vitest'
import {
    createTransaction,
    deleteTransaction,
    getTransaction,
    getTransactions,
    updateTransaction,
} from './transactions.api'
import { apiClient } from '@/lib/api-client'
import { createTransaction as createTransactionFixture } from '@/test/fixtures/domain'

vi.mock('@/lib/api-client', () => ({
    apiClient: vi.fn(),
}))

describe('transactions API', () => {
    beforeEach(() => {
        vi.mocked(apiClient).mockReset()
    })

    it('serializes transaction filters and pagination', async () => {
        const response = { data: [], meta: { page: 2, totalPages: 3, total: 25 } }
        vi.mocked(apiClient).mockResolvedValue(response)

        await expect(
            getTransactions({
                type: 'EXPENSE',
                accountId: 'account-1',
                categoryId: 'category-1',
                fromAccountId: 'account-2',
                toAccountId: 'account-3',
                month: '2026-06',
                startDate: '2026-06-01',
                endDate: '2026-06-30',
                search: 'market',
                includeArchived: false,
                page: 2,
                pageSize: 10,
            }),
        ).resolves.toEqual(response)

        expect(apiClient).toHaveBeenCalledWith(
            '/transactions?type=EXPENSE&accountId=account-1&categoryId=category-1&fromAccountId=account-2&toAccountId=account-3&month=2026-06&startDate=2026-06-01&endDate=2026-06-30&search=market&includeArchived=false&page=2&pageSize=10',
        )
    })

    it('supports an empty transaction query', async () => {
        vi.mocked(apiClient).mockResolvedValue({ data: [] })

        await getTransactions()
        await getTransactions({})

        expect(apiClient).toHaveBeenNthCalledWith(1, '/transactions')
        expect(apiClient).toHaveBeenNthCalledWith(2, '/transactions')
    })

    it('unwraps single transaction responses and sends CRUD requests', async () => {
        const transaction = createTransactionFixture()
        vi.mocked(apiClient)
            .mockResolvedValueOnce({ data: transaction })
            .mockResolvedValueOnce({ data: transaction })
            .mockResolvedValueOnce({ data: transaction })
            .mockResolvedValueOnce({ data: undefined })

        await expect(getTransaction(transaction.id)).resolves.toEqual(transaction)
        await expect(
            createTransaction({
                type: 'EXPENSE',
                amount: 25,
                date: '2026-06-01',
                accountId: 'account-1',
            }),
        ).resolves.toEqual(transaction)
        await expect(updateTransaction(transaction.id, { amount: 30 })).resolves.toEqual(
            transaction,
        )
        await expect(deleteTransaction(transaction.id)).resolves.toBeUndefined()

        expect(apiClient).toHaveBeenNthCalledWith(2, '/transactions', {
            method: 'POST',
            body: {
                type: 'EXPENSE',
                amount: 25,
                date: '2026-06-01',
                accountId: 'account-1',
            },
        })
        expect(apiClient).toHaveBeenNthCalledWith(3, `/transactions/${transaction.id}`, {
            method: 'PATCH',
            body: { amount: 30 },
        })
        expect(apiClient).toHaveBeenNthCalledWith(4, `/transactions/${transaction.id}`, {
            method: 'DELETE',
        })
    })
})
