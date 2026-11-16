import { beforeEach, describe, expect, it, vi } from 'vitest'
import userEvent from '@testing-library/user-event'
import { render, screen } from '@/test/utils/render'
import { AccountsPage } from '@/features/accounts/pages/AccountsPage'
import { createAccount } from '@/test/fixtures/domain'
import type { Account } from '@/features/accounts/types/account.types'

const createMock = vi.fn().mockResolvedValue(undefined)
const updateMock = vi.fn().mockResolvedValue(undefined)
const deleteMock = vi.fn().mockResolvedValue(undefined)
const refetchMock = vi.fn()

let accountsData: Account[] | undefined = []
let isLoading = false
let isError = false
let error: Error | null = null

vi.mock('@/features/accounts/hooks', () => ({
    useAccounts: () => ({
        data: accountsData,
        isLoading,
        isError,
        error,
        isFetching: false,
        refetch: refetchMock,
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
        refetchMock.mockClear()
    })

    it('shows loading state while accounts are being fetched', async () => {
        isLoading = true

        render(<AccountsPage />)

        expect(screen.getByRole('status')).toHaveTextContent(/loading accounts/i)
    })

    it('shows empty state when no accounts exist', async () => {
        render(<AccountsPage />)

        expect(await screen.findByText(/no accounts yet/i)).toBeInTheDocument()
    })

    it('shows an error state when loading accounts fails', async () => {
        isError = true
        error = new Error('Accounts unavailable')
        accountsData = undefined

        render(<AccountsPage />)

        expect(await screen.findByText('Accounts unavailable')).toBeInTheDocument()
        expect(screen.queryByText(/no accounts yet/i)).not.toBeInTheDocument()
        await userEvent.setup().click(screen.getByRole('button', { name: 'Retry' }))
        expect(refetchMock).toHaveBeenCalledTimes(1)
    })

    it('preserves account cards when a background refresh fails', () => {
        accountsData = [createAccount()]
        isError = true
        error = new Error('Refresh unavailable')

        render(<AccountsPage />)

        expect(screen.getByText('Refresh unavailable')).toBeInTheDocument()
        expect(screen.getByRole('heading', { name: /checking/i, level: 2 })).toBeInTheDocument()
        expect(screen.getByRole('status')).toHaveTextContent(/refresh failed/i)
    })

    it('renders accounts from API response', async () => {
        accountsData = [createAccount()]

        render(<AccountsPage />)

        expect(await screen.findByText(createAccount().name)).toBeInTheDocument()
        // match numeric portion allowing for non-breaking spaces and locale separators
        const matches = await screen.findAllByText(/1\s*250[.,]\s*75/)
        expect(matches.length).toBeGreaterThanOrEqual(1)
    })

    it('offers an inline create action from the empty state', async () => {
        const user = userEvent.setup()
        render(<AccountsPage />)

        await user.click(await screen.findByRole('button', { name: 'Create your first account' }))

        expect(screen.getByRole('dialog', { name: 'Create account' })).toBeInTheDocument()
    })
})
