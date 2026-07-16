import { beforeEach, describe, expect, it, vi } from 'vitest'
import { render, screen } from '@/test/utils/render'
import { AccountsPage } from '@/features/accounts/pages/AccountsPage'
import { createAccount } from '@/test/fixtures/domain'
import type { Account } from '@/features/accounts/types/account.types'

const createMock = vi.fn().mockResolvedValue(undefined)
const updateMock = vi.fn().mockResolvedValue(undefined)
const deleteMock = vi.fn().mockResolvedValue(undefined)

let accountsData: Account[] = []
let isLoading = false
let isError = false
let error: Error | null = null

vi.mock('@/features/accounts/hooks', () => ({
    useAccounts: () => ({
        data: accountsData,
        isLoading,
        isError,
        error,
    }),
    useCreateAccount: () => ({ mutateAsync: createMock, isPending: false }),
    useUpdateAccount: () => ({ mutateAsync: updateMock, isPending: false }),
    useDeleteAccount: () => ({ mutateAsync: deleteMock, isPending: false }),
}))

describe('AccountsPage', () => {
    beforeEach(() => {
        accountsData = []
        isLoading = false
        isError = false
        error = null
    })

    it('shows loading state while accounts are being fetched', async () => {
        isLoading = true

        render(<AccountsPage />)

        expect(screen.getByLabelText(/loading accounts/i)).toBeInTheDocument()
    })

    it('shows empty state when no accounts exist', async () => {
        render(<AccountsPage />)

        expect(await screen.findByText(/no accounts yet/i)).toBeInTheDocument()
    })

    it('renders accounts from API response', async () => {
        accountsData = [createAccount()]

        render(<AccountsPage />)

        expect(await screen.findByText(createAccount().name)).toBeInTheDocument()
        // match numeric portion allowing for non-breaking spaces and locale separators
        const matches = await screen.findAllByText(/1\s*250[.,]\s*75/)
        expect(matches.length).toBeGreaterThanOrEqual(1)
    })
})
