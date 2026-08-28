import { beforeEach, describe, expect, it, vi } from 'vitest'
import userEvent from '@testing-library/user-event'
import { render, screen, waitFor } from '@/test/utils/render'
import { within } from '@testing-library/react'
import { AccountsPage } from '@/features/accounts/pages/AccountsPage'
import { PrimaryActionButton } from '@/shared/primary-action'
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

    it('creates an account from the primary action', async () => {
        const user = userEvent.setup()
        render(
            <>
                <AccountsPage />
                <PrimaryActionButton />
            </>,
        )

        await user.click(screen.getByRole('button', { name: /add account/i }))
        await user.type(screen.getByLabelText('Account name'), 'Savings')
        await user.click(screen.getByRole('button', { name: 'Create account' }))

        await waitFor(() =>
            expect(createMock).toHaveBeenCalledWith(
                expect.objectContaining({
                    name: 'Savings',
                }),
            ),
        )
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    })

    it('edits an existing account with its initial values', async () => {
        const user = userEvent.setup()
        render(<AccountsPage />)

        await user.click(screen.getByRole('button', { name: 'Edit Checking' }))
        expect(screen.getByRole('heading', { name: 'Edit account' })).toBeInTheDocument()
        expect(screen.getByLabelText('Account name')).toHaveValue('Checking')
        await user.clear(screen.getByLabelText('Account name'))
        await user.type(screen.getByLabelText('Account name'), 'Updated checking')
        await user.click(screen.getByRole('button', { name: 'Save changes' }))

        await waitFor(() =>
            expect(updateMock).toHaveBeenCalledWith(
                expect.objectContaining({
                    id: 'a1',
                    input: expect.objectContaining({ name: 'Updated checking' }),
                }),
            ),
        )
    })

    it('shows an archive error when archiving fails', async () => {
        const user = userEvent.setup()
        deleteMock.mockRejectedValueOnce(new Error('Archive unavailable'))
        render(<AccountsPage />)

        await user.click(screen.getByRole('button', { name: /Archive Checking/i }))
        const dialog = await screen.findByRole('alertdialog')
        await user.click(within(dialog).getByRole('button', { name: /Archive/i }))

        expect(await screen.findByText('Archive unavailable')).toBeInTheDocument()
    })
})
