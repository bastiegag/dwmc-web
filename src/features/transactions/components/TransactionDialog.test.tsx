import { describe, expect, it, vi } from 'vitest'
import userEvent from '@testing-library/user-event'
import { render, screen } from '@/test/utils/render'
import { TransactionDialog } from '@/features/transactions/components/TransactionDialog'
import { createAccount } from '@/test/fixtures/domain'

describe('TransactionDialog', () => {
    it('does not close while a transaction submission is pending', async () => {
        const user = userEvent.setup()
        const onOpenChange = vi.fn()

        render(
            <TransactionDialog
                open
                mode="create"
                accounts={[createAccount()]}
                sections={[]}
                isPending
                onOpenChange={onOpenChange}
                onSubmit={vi.fn()}
            />,
        )

        const dialog = screen.getByRole('dialog', { name: 'New Transaction' })
        const closeButton = screen.getByRole('button', { name: 'Close transaction dialog' })

        expect(closeButton).toBeDisabled()
        await user.keyboard('{Escape}')

        expect(dialog).toBeInTheDocument()
        expect(onOpenChange).not.toHaveBeenCalledWith(false)
    })

    it('allows closing when no submission is pending', async () => {
        const user = userEvent.setup()
        const onOpenChange = vi.fn()

        render(
            <TransactionDialog
                open
                mode="edit"
                accounts={[createAccount()]}
                sections={[]}
                onOpenChange={onOpenChange}
                onSubmit={vi.fn()}
            />,
        )

        await user.click(screen.getByRole('button', { name: 'Close transaction dialog' }))

        expect(onOpenChange).toHaveBeenCalledWith(false)
    })
})
