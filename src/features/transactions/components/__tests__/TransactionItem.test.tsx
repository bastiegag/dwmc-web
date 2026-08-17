import { describe, expect, it, vi } from 'vitest'
import userEvent from '@testing-library/user-event'
import { render, screen, waitFor, within } from '@/test/utils/render'
import TransactionItem from '@/features/transactions/components/TransactionItem'
import { createTransaction } from '@/test/fixtures/domain'

describe('TransactionItem', () => {
    it('requires confirmation before archiving and supports cancel, Escape, and focus wrapping', async () => {
        const user = userEvent.setup()
        const onArchive = vi.fn()
        const transaction = createTransaction()

        render(<TransactionItem transaction={transaction} onEdit={vi.fn()} onArchive={onArchive} />)

        const archiveButton = screen.getByRole('button', { name: 'Archive transaction tx-1' })
        await user.click(archiveButton)

        const dialog = screen.getByRole('alertdialog')
        const cancelButton = within(dialog).getByRole('button', { name: 'Cancel' })

        expect(cancelButton).toHaveFocus()
        await user.click(cancelButton)
        expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument()
        expect(onArchive).not.toHaveBeenCalled()

        await user.click(archiveButton)
        expect(screen.getByRole('alertdialog')).toBeInTheDocument()
        await user.keyboard('{Escape}')
        expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument()
        expect(archiveButton).toHaveFocus()

        await user.click(archiveButton)
        const reopenedDialog = screen.getByRole('alertdialog')
        const reopenedCancelButton = within(reopenedDialog).getByRole('button', { name: 'Cancel' })
        const reopenedConfirmButton = within(reopenedDialog).getByRole('button', {
            name: 'Archive',
        })
        expect(reopenedCancelButton).toHaveFocus()
        await user.tab({ shift: true })
        expect(reopenedConfirmButton).toHaveFocus()
        await user.click(reopenedConfirmButton)

        await waitFor(() => expect(onArchive).toHaveBeenCalledWith(transaction))
        expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument()
    })
})
