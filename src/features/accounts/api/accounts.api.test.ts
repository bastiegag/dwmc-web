import { beforeEach, describe, expect, it, vi } from 'vitest'
import { apiClient } from '@/lib/api-client'
import { createAccount as createAccountFixture } from '@/test/fixtures/domain'
import {
    createAccount,
    deleteAccount,
    getAccount,
    getAccounts,
    updateAccount,
} from './accounts.api'

vi.mock('@/lib/api-client', () => ({
    apiClient: vi.fn(),
}))

describe('accounts API', () => {
    beforeEach(() => {
        vi.mocked(apiClient).mockReset()
    })

    it('serializes account filters and supports an empty query', async () => {
        vi.mocked(apiClient).mockResolvedValue({ data: [] })

        await expect(getAccounts({ type: 'SAVINGS', includeArchived: true })).resolves.toEqual([])
        await expect(getAccounts({})).resolves.toEqual([])
        await expect(getAccounts()).resolves.toEqual([])

        expect(apiClient).toHaveBeenNthCalledWith(1, '/accounts?type=SAVINGS&includeArchived=true')
        expect(apiClient).toHaveBeenNthCalledWith(2, '/accounts')
        expect(apiClient).toHaveBeenNthCalledWith(3, '/accounts')
    })

    it('unwraps account responses and sends CRUD requests', async () => {
        const account = createAccountFixture()
        vi.mocked(apiClient)
            .mockResolvedValueOnce({ data: account })
            .mockResolvedValueOnce({ data: account })
            .mockResolvedValueOnce({ data: account })
            .mockResolvedValueOnce({ data: account })
            .mockResolvedValueOnce({ data: account })

        await expect(getAccount(account.id)).resolves.toEqual(account)
        await expect(
            createAccount({
                name: 'Savings',
                type: 'SAVINGS',
                startingBalance: 0,
                goal: null,
                color: '#ffffff',
                icon: 'wallet',
            }),
        ).resolves.toEqual(account)
        await expect(updateAccount(account.id, { name: 'Updated' })).resolves.toEqual(account)
        await expect(deleteAccount(account.id)).resolves.toBeUndefined()

        expect(apiClient).toHaveBeenNthCalledWith(
            2,
            '/accounts',
            expect.objectContaining({ method: 'POST' }),
        )
        expect(apiClient).toHaveBeenNthCalledWith(3, `/accounts/${account.id}`, {
            method: 'PATCH',
            body: { name: 'Updated' },
        })
        expect(apiClient).toHaveBeenNthCalledWith(4, `/accounts/${account.id}`, {
            method: 'DELETE',
        })
    })
})
