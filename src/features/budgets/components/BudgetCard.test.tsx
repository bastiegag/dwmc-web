import { describe, it, expect, vi } from 'vitest'
import { screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { render } from '@/test/utils/render'
import BudgetCard from '@/features/budgets/components/BudgetCard'
import { createBudget } from '@/test/fixtures/domain'
import { formatCurrency } from '@/lib/format-currency'

const budget = createBudget()
const normalizeText = (text: string) => text.replace(/\s+/g, ' ').trim()
const findText = (text: string) =>
    screen.getByText(
        (_, element) =>
            element?.tagName === 'P' &&
            normalizeText(element.textContent ?? '') === normalizeText(text),
    )

describe('BudgetCard', () => {
    it('renders financial values and accessible progress details', async () => {
        const user = userEvent.setup()
        const onEdit = vi.fn()
        render(<BudgetCard budget={budget} onEdit={onEdit} onArchive={vi.fn()} />)

        expect(screen.getByRole('heading', { name: 'Groceries' })).toBeInTheDocument()
        expect(screen.getByText('Planned')).toBeInTheDocument()
        expect(findText(formatCurrency(500))).toBeInTheDocument()
        expect(screen.getByText('Spent')).toBeInTheDocument()
        expect(findText(formatCurrency(600))).toBeInTheDocument()
        expect(findText(`Over budget: ${formatCurrency(100)}`)).toBeInTheDocument()
        expect(screen.getByText('120% used')).toBeInTheDocument()
        expect(
            screen.getByRole('progressbar', { name: 'Budget usage for Groceries' }),
        ).toHaveAttribute('aria-valuetext', '120% used. The progress bar is capped at 100%.')
        expect(
            screen.getByRole('progressbar', { name: 'Budget usage for Groceries' }),
        ).toHaveAttribute('aria-valuenow', '100')

        await user.click(screen.getByRole('button', { name: 'Edit Groceries' }))
        expect(onEdit).toHaveBeenCalledWith(budget)
    })

    it.each([
        {
            label: 'no spending',
            budget: createBudget({
                amount: 100,
                spent: 0,
                remaining: 100,
                progress: 0,
                isOverBudget: false,
                transactionCount: 0,
            }),
            progressText: '0% used',
        },
        {
            label: 'fully used',
            budget: createBudget({
                amount: 100,
                spent: 100,
                remaining: 0,
                progress: 100,
                isOverBudget: false,
            }),
            progressText: '100% used',
        },
        {
            label: 'over budget',
            budget: createBudget({
                amount: 100,
                spent: 125,
                remaining: -25,
                progress: 125,
                isOverBudget: true,
            }),
            progressText: '125% used',
        },
    ])('renders the actual percentage for $label', ({ budget: state, progressText }) => {
        render(<BudgetCard budget={state} onEdit={vi.fn()} onArchive={vi.fn()} />)

        expect(screen.getByText(progressText)).toBeInTheDocument()
    })

    it('handles zero limits without presenting the clamped bar as 100% used', () => {
        const zeroLimitBudget = createBudget({
            amount: 0,
            spent: 25,
            remaining: -25,
            progress: 100,
            isOverBudget: true,
        })

        render(<BudgetCard budget={zeroLimitBudget} onEdit={vi.fn()} onArchive={vi.fn()} />)

        expect(
            screen.getByText('Percentage unavailable for a zero budget limit'),
        ).toBeInTheDocument()
        expect(findText(`Over budget: ${formatCurrency(25)}`)).toBeInTheDocument()
        expect(
            screen.getByRole('progressbar', { name: 'Budget usage for Groceries' }),
        ).toHaveAttribute(
            'aria-valuetext',
            `Over budget by ${formatCurrency(25)}. Percentage unavailable because the budget limit is zero.`,
        )
        expect(screen.queryByText('100% used')).not.toBeInTheDocument()
    })

    it('formats large values, handles long category labels, and avoids NaN text', () => {
        const longName = 'A very long category name that should wrap without overflowing'
        const largeBudget = createBudget({
            amount: 9_876_543_210.99,
            spent: 123_456_789.01,
            remaining: 9_753_086_421.98,
            progress: Number.NaN,
            isOverBudget: false,
            category: {
                ...budget.category,
                name: longName,
            },
        })

        render(<BudgetCard budget={largeBudget} onEdit={vi.fn()} onArchive={vi.fn()} />)

        expect(screen.getByRole('heading', { name: longName })).toBeInTheDocument()
        expect(findText(formatCurrency(9_876_543_210.99))).toBeInTheDocument()
        expect(findText(formatCurrency(123_456_789.01))).toBeInTheDocument()
        expect(screen.getByText('0% used')).toBeInTheDocument()
        expect(screen.queryByText(/NaN/)).not.toBeInTheDocument()
    })

    it('keeps the confirmation open and reports archive failures', async () => {
        const user = userEvent.setup()
        const onArchive = vi.fn().mockRejectedValue(new Error('Archive failed'))

        render(<BudgetCard budget={budget} onEdit={vi.fn()} onArchive={onArchive} />)

        await user.click(screen.getByRole('button', { name: /Archive Groceries/i }))
        const dialog = screen.getByRole('alertdialog')
        expect(dialog).toHaveAccessibleName('Archive budget?')
        expect(dialog).toHaveAccessibleDescription(/This will archive the budget/i)
        await user.click(within(dialog).getByRole('button', { name: /^Archive$/i }))

        await waitFor(() =>
            expect(within(dialog).getByRole('alert')).toHaveTextContent('Archive failed'),
        )
        expect(screen.getByRole('alertdialog')).toBeInTheDocument()
        expect(onArchive).toHaveBeenCalledTimes(1)
    })

    it('prevents duplicate archive requests and dismissals while pending, then restores focus', async () => {
        const user = userEvent.setup()
        let finishArchive: (() => void) | undefined
        const onArchive = vi.fn(
            () =>
                new Promise<void>((resolve) => {
                    finishArchive = resolve
                }),
        )

        render(<BudgetCard budget={budget} onEdit={vi.fn()} onArchive={onArchive} />)

        const archiveTrigger = screen.getByRole('button', { name: 'Archive Groceries' })
        await user.click(archiveTrigger)
        const dialog = screen.getByRole('alertdialog')
        const confirmButton = within(dialog).getByRole('button', { name: /^Archive$/i })
        await user.click(confirmButton)
        await waitFor(() => expect(confirmButton).toBeDisabled())

        await user.click(confirmButton)
        await user.keyboard('{Escape}')
        await user.click(document.body)

        expect(screen.getByRole('alertdialog')).toBeInTheDocument()
        expect(within(dialog).getByRole('button', { name: 'Cancel' })).toBeDisabled()
        expect(onArchive).toHaveBeenCalledTimes(1)

        finishArchive?.()
        await waitFor(() => expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument())
        expect(archiveTrigger).toHaveFocus()
    })
})
