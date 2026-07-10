import { beforeEach, describe, expect, it, vi } from 'vitest'
import userEvent from '@testing-library/user-event'
import { render, screen, waitFor } from '@/test/utils/render'
import { within } from '@testing-library/react'
import { AccountsPage } from '@/features/accounts/pages/AccountsPage'
import type { Account } from '@/features/accounts/types/account.types'
import { createAccount } from '@/test/fixtures/domain'

const createMock = vi.fn().mockResolvedValue(undefined)
const updateMock = vi.fn().mockResolvedValue(undefined)
const deleteMock = vi.fn().mockResolvedValue(undefined)

let accountsData: Account[] = []

vi.mock('@/features/accounts/hooks', () => ({
    useAccounts: () => ({ data: accountsData, isLoading: false, isError: false, error: null }),
    useCreateAccount: () => ({ mutateAsync: createMock, isPending: false }),
    useUpdateAccount: () => ({ mutateAsync: updateMock, isPending: false }),
    useDeleteAccount: () => ({ mutateAsync: deleteMock, isPending: false }),
}))

describe('accounts forms and actions', () => {
    beforeEach(() => {
        accountsData = [createAccount()]
        createMock.mockClear()
        updateMock.mockClear()
        deleteMock.mockClear()
    })

    it('archives an account after confirmation', async () => {
        render(<AccountsPage />)
        const user = userEvent.setup()

        // click Archive button on the card
        await user.click(screen.getByRole('button', { name: /Archive Checking/i }))
        // confirm archive in dialog
        // find the confirmation dialog and click the Archive button inside it
        const dialog = await screen.findByRole('alertdialog')
        const confirm = within(dialog).getByRole('button', { name: /Archive/i })
        await user.click(confirm)

        // wait for the async mutation to be invoked
        await waitFor(() => {
            expect(deleteMock).toHaveBeenCalledWith('a1')
        })
    })
})
