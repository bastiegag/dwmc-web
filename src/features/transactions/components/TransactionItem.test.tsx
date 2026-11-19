import { describe, expect, it, vi } from 'vitest'
import userEvent from '@testing-library/user-event'
import { render, screen, waitFor, within } from '@/test/utils/render'
import TransactionItem from '@/features/transactions/components/TransactionItem'
import { createTransaction } from '@/test/fixtures/domain'
import { formatCurrency } from '@/lib/format-currency'

describe('TransactionItem', () => {
    it('renders fallback descriptions and transfer account labels', () => {
        const transaction = createTransaction({
            type: 'TRANSFER',
            date: 'not-a-date',
            merchant: null,
            note: null,
            account: null,
            fromAccount: null,
            toAccount: null,
        })

        render(<TransactionItem transaction={transaction} onEdit={vi.fn()} onArchive={vi.fn()} />)

        expect(screen.getByText('not-a-date')).toBeInTheDocument()
        expect(screen.getByText('No description')).toBeInTheDocument()
        expect(screen.getByText('From → To')).toBeInTheDocument()
    })

    it('renders a note and account for non-transfer transactions and supports editing', async () => {
        const user = userEvent.setup()
        const onEdit = vi.fn()
        const transaction = createTransaction({ merchant: null, note: 'Opening balance' })

        render(<TransactionItem transaction={transaction} onEdit={onEdit} onArchive={vi.fn()} />)

        expect(screen.getByText('Opening balance')).toBeInTheDocument()
        expect(screen.getByText('Checking')).toBeInTheDocument()
        await user.click(screen.getByRole('button', { name: 'Edit transaction tx-1' }))
        expect(onEdit).toHaveBeenCalledWith(transaction)
    })

    it.each([
        ['INCOME', 'INCOME', 1250.5],
        ['EXPENSE', 'EXPENSE', 87.25],
        ['TRANSFER', 'TRANSFER', 500],
        ['ADJUSTMENT', 'ADJUSTMENT', -125.75],
    ] as const)('renders %s with a formatted amount and text label', (type, label, amount) => {
        render(
            <TransactionItem
                transaction={createTransaction({ type, amount })}
                onEdit={vi.fn()}
                onArchive={vi.fn()}
            />,
        )

        expect(screen.getByText(label)).toBeInTheDocument()
        expect(
            screen.getByText((_, element) => element?.textContent === formatCurrency(amount)),
        ).toBeInTheDocument()
    })

    it('shows long category names and an accessible name for row actions', () => {
        const transaction = createTransaction({
            category: {
                id: 'category-long',
                name: 'A very long category name that should remain readable on narrow screens',
                icon: 'shopping-bag',
                sectionId: 'section-1',
            },
            categoryId: 'category-long',
        })

        render(<TransactionItem transaction={transaction} onEdit={vi.fn()} onArchive={vi.fn()} />)

        expect(
            screen.getByText(
                'A very long category name that should remain readable on narrow screens',
            ),
        ).toBeInTheDocument()
        expect(screen.getByRole('button', { name: 'Edit transaction tx-1' })).toBeInTheDocument()
    })

    it('requires confirmation before archiving and supports cancel and Escape', async () => {
        const user = userEvent.setup()
        const onArchive = vi.fn()
        const transaction = createTransaction()

        render(<TransactionItem transaction={transaction} onEdit={vi.fn()} onArchive={onArchive} />)

        const archiveButton = screen.getByRole('button', { name: 'Archive transaction tx-1' })
        await user.click(archiveButton)

        const dialog = screen.getByRole('alertdialog')
        const cancelButton = within(dialog).getByRole('button', { name: 'Cancel' })

        await waitFor(() => expect(cancelButton).toHaveFocus())
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
        await waitFor(() => expect(reopenedCancelButton).toHaveFocus())
        await user.click(reopenedConfirmButton)

        await waitFor(() => expect(onArchive).toHaveBeenCalledWith(transaction))
        expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument()
    })

    it('keeps the confirmation open and announces an archive failure', async () => {
        const user = userEvent.setup()
        const onArchive = vi.fn().mockRejectedValue(new Error('Archive request failed'))

        render(
            <TransactionItem
                transaction={createTransaction()}
                onEdit={vi.fn()}
                onArchive={onArchive}
            />,
        )

        await user.click(screen.getByRole('button', { name: 'Archive transaction tx-1' }))
        const dialog = screen.getByRole('alertdialog')
        await user.click(within(dialog).getByRole('button', { name: 'Archive' }))

        expect(await within(dialog).findByRole('alert')).toHaveTextContent('Archive request failed')
        expect(dialog).toBeInTheDocument()
        expect(within(dialog).getByRole('button', { name: 'Archive' })).toBeEnabled()
        expect(onArchive).toHaveBeenCalledTimes(1)
    })

    it('prevents Escape from dismissing the archive confirmation while pending', async () => {
        const user = userEvent.setup()
        let resolveArchive: (() => void) | undefined
        const onArchive = vi.fn(
            () =>
                new Promise<void>((resolve) => {
                    resolveArchive = resolve
                }),
        )

        render(
            <TransactionItem
                transaction={createTransaction()}
                onEdit={vi.fn()}
                onArchive={onArchive}
            />,
        )

        await user.click(screen.getByRole('button', { name: 'Archive transaction tx-1' }))
        const dialog = screen.getByRole('alertdialog')
        await user.click(within(dialog).getByRole('button', { name: 'Archive' }))
        await waitFor(() =>
            expect(within(dialog).getByRole('button', { name: 'Cancel' })).toBeDisabled(),
        )

        await user.keyboard('{Escape}')

        expect(screen.getByRole('alertdialog')).toBeInTheDocument()
        expect(onArchive).toHaveBeenCalledTimes(1)

        resolveArchive?.()
        await waitFor(() => expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument())
    })

    it('prevents outside-click dismissal while the archive request is pending', async () => {
        const user = userEvent.setup()
        let resolveArchive: (() => void) | undefined
        const onArchive = vi.fn(
            () =>
                new Promise<void>((resolve) => {
                    resolveArchive = resolve
                }),
        )

        render(
            <TransactionItem
                transaction={createTransaction()}
                onEdit={vi.fn()}
                onArchive={onArchive}
            />,
        )

        await user.click(screen.getByRole('button', { name: 'Archive transaction tx-1' }))
        const dialog = screen.getByRole('alertdialog')
        await user.click(within(dialog).getByRole('button', { name: 'Archive' }))
        await waitFor(() =>
            expect(within(dialog).getByRole('button', { name: 'Cancel' })).toBeDisabled(),
        )

        await user.click(document.body)

        expect(screen.getByRole('alertdialog')).toBeInTheDocument()
        expect(onArchive).toHaveBeenCalledTimes(1)

        resolveArchive?.()
        await waitFor(() => expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument())
    })
})
