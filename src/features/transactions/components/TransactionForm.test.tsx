import { describe, expect, it, vi } from 'vitest'
import userEvent from '@testing-library/user-event'
import { render, screen, waitFor } from '@/test/utils/render'
import TransactionForm from '@/features/transactions/components/TransactionForm'
import { createAccount, createCategory, createSectionWithCategories } from '@/test/fixtures/domain'

const chooseOption = async (
    user: ReturnType<typeof userEvent.setup>,
    label: string,
    value: string,
) => {
    await user.click(screen.getByRole('combobox', { name: label }))
    await user.click(await screen.findByRole('option', { name: value }))
}

describe('TransactionForm', () => {
    it('preserves an archived account when editing a historical transaction', async () => {
        const user = userEvent.setup()
        const archivedAccount = createAccount({ id: 'archived-account', isArchived: true })

        render(
            <TransactionForm
                accounts={[archivedAccount]}
                sections={[]}
                initialValues={{
                    type: 'EXPENSE',
                    amount: 20,
                    date: '2026-06-01',
                    accountId: archivedAccount.id,
                    fromAccountId: null,
                    toAccountId: null,
                    categoryId: null,
                    merchant: null,
                    note: null,
                }}
                onSubmit={vi.fn()}
            />,
        )

        await user.click(screen.getByRole('combobox', { name: 'Account' }))
        expect(await screen.findByRole('option', { name: archivedAccount.name })).not.toBeDisabled()
    })

    it('preserves an archived category when editing a historical transaction', async () => {
        const user = userEvent.setup()
        const archivedCategory = createCategory({ isArchived: true })
        const archivedSection = createSectionWithCategories([archivedCategory], {
            isArchived: true,
        })

        render(
            <TransactionForm
                accounts={[createAccount()]}
                sections={[archivedSection]}
                initialValues={{
                    type: 'EXPENSE',
                    amount: 20,
                    date: '2026-06-01',
                    accountId: 'a1',
                    fromAccountId: null,
                    toAccountId: null,
                    categoryId: archivedCategory.id,
                    merchant: null,
                    note: null,
                }}
                onSubmit={vi.fn()}
            />,
        )

        await user.click(screen.getByRole('combobox', { name: 'Category (optional)' }))
        const option = await screen.findByRole('option', { name: /groceries \(archived\)/i })
        expect(option).not.toBeDisabled()
    })

    it('clears expense-only fields when changing to a transfer', async () => {
        const user = userEvent.setup()
        const onSubmit = vi.fn()
        const category = createCategory()

        render(
            <TransactionForm
                accounts={[createAccount(), createAccount({ id: 'a2', name: 'Savings' })]}
                sections={[createSectionWithCategories([category])]}
                initialValues={{
                    type: 'EXPENSE',
                    amount: 20,
                    date: '2026-06-01',
                    accountId: 'a1',
                    fromAccountId: null,
                    toAccountId: null,
                    categoryId: category.id,
                    merchant: 'Market',
                    note: null,
                }}
                onSubmit={onSubmit}
            />,
        )

        await chooseOption(user, 'Type', 'Transfer')
        await chooseOption(user, 'From account', 'Checking')
        await chooseOption(user, 'To account', 'Savings')
        await user.click(screen.getByRole('button', { name: 'Save' }))

        await waitFor(() => expect(onSubmit).toHaveBeenCalledTimes(1))
        expect(onSubmit).toHaveBeenCalledWith(
            expect.objectContaining({
                type: 'TRANSFER',
                accountId: null,
                categoryId: null,
                merchant: null,
                fromAccountId: 'a1',
                toAccountId: 'a2',
            }),
        )
    })

    it('clears transfer-only fields when changing to an expense', async () => {
        const user = userEvent.setup()
        const onSubmit = vi.fn()

        render(
            <TransactionForm
                accounts={[createAccount(), createAccount({ id: 'a2', name: 'Savings' })]}
                sections={[]}
                initialValues={{
                    type: 'TRANSFER',
                    amount: 20,
                    date: '2026-06-01',
                    accountId: null,
                    fromAccountId: 'a1',
                    toAccountId: 'a2',
                    categoryId: null,
                    merchant: null,
                    note: 'Move money',
                }}
                onSubmit={onSubmit}
            />,
        )

        await chooseOption(user, 'Type', 'Expense')
        await chooseOption(user, 'Account', 'Checking')
        await user.click(screen.getByRole('button', { name: 'Save' }))

        await waitFor(() => expect(onSubmit).toHaveBeenCalledTimes(1))
        expect(onSubmit).toHaveBeenCalledWith(
            expect.objectContaining({
                type: 'EXPENSE',
                accountId: 'a1',
                fromAccountId: null,
                toAccountId: null,
            }),
        )
    })

    it('clears category and merchant when changing income to an adjustment', async () => {
        const user = userEvent.setup()
        const onSubmit = vi.fn()
        const category = createCategory()

        render(
            <TransactionForm
                accounts={[createAccount()]}
                sections={[createSectionWithCategories([category])]}
                initialValues={{
                    type: 'INCOME',
                    amount: 20,
                    date: '2026-06-01',
                    accountId: 'a1',
                    fromAccountId: null,
                    toAccountId: null,
                    categoryId: category.id,
                    merchant: 'Employer',
                    note: null,
                }}
                onSubmit={onSubmit}
            />,
        )

        await chooseOption(user, 'Type', 'Adjustment')
        await user.click(screen.getByRole('button', { name: 'Save' }))

        await waitFor(() => expect(onSubmit).toHaveBeenCalledTimes(1))
        expect(onSubmit).toHaveBeenCalledWith(
            expect.objectContaining({
                type: 'ADJUSTMENT',
                accountId: 'a1',
                categoryId: null,
                merchant: null,
                fromAccountId: null,
                toAccountId: null,
            }),
        )
    })

    it('keeps adjustment fields valid when changing to income', async () => {
        const user = userEvent.setup()
        const onSubmit = vi.fn()
        const category = createCategory()

        render(
            <TransactionForm
                accounts={[createAccount()]}
                sections={[createSectionWithCategories([category])]}
                initialValues={{
                    type: 'ADJUSTMENT',
                    amount: 20,
                    date: '2026-06-01',
                    accountId: 'a1',
                    fromAccountId: null,
                    toAccountId: null,
                    categoryId: null,
                    merchant: null,
                    note: 'Opening correction',
                }}
                onSubmit={onSubmit}
            />,
        )

        await chooseOption(user, 'Type', 'Income')
        await chooseOption(user, 'Category (optional)', category.name)
        await user.type(screen.getByLabelText('Merchant (optional)'), 'Refund')
        await user.click(screen.getByRole('button', { name: 'Save' }))

        await waitFor(() => expect(onSubmit).toHaveBeenCalledTimes(1))
        expect(onSubmit).toHaveBeenCalledWith(
            expect.objectContaining({
                type: 'INCOME',
                accountId: 'a1',
                categoryId: category.id,
                merchant: 'Refund',
                fromAccountId: null,
                toAccountId: null,
            }),
        )
    })

    it('parses decimal currency input as a numeric transaction amount', async () => {
        const user = userEvent.setup()
        const onSubmit = vi.fn()

        render(
            <TransactionForm
                accounts={[createAccount()]}
                sections={[]}
                initialValues={{
                    type: 'EXPENSE',
                    amount: 20,
                    date: '2026-06-01',
                    accountId: 'a1',
                    fromAccountId: null,
                    toAccountId: null,
                    categoryId: null,
                    merchant: null,
                    note: null,
                }}
                onSubmit={onSubmit}
            />,
        )

        const amount = screen.getByLabelText('Amount')
        await user.clear(amount)
        await user.type(amount, '123.45')
        await user.click(screen.getByRole('button', { name: 'Save' }))

        await waitFor(() => expect(onSubmit).toHaveBeenCalledTimes(1))
        expect(onSubmit).toHaveBeenCalledWith(expect.objectContaining({ amount: 123.45 }))
    })

    it('allows clearing an optional category without changing transaction type', async () => {
        const user = userEvent.setup()
        const onSubmit = vi.fn()
        const category = createCategory()

        render(
            <TransactionForm
                accounts={[createAccount()]}
                sections={[createSectionWithCategories([category])]}
                initialValues={{
                    type: 'EXPENSE',
                    amount: 20,
                    date: '2026-06-01',
                    accountId: 'a1',
                    fromAccountId: null,
                    toAccountId: null,
                    categoryId: category.id,
                    merchant: null,
                    note: null,
                }}
                onSubmit={onSubmit}
            />,
        )

        await chooseOption(user, 'Category (optional)', 'No category')
        await user.click(screen.getByRole('button', { name: 'Save' }))

        await waitFor(() => expect(onSubmit).toHaveBeenCalledTimes(1))
        expect(onSubmit).toHaveBeenCalledWith(expect.objectContaining({ categoryId: null }))
    })

    it('shows an accessible error when a transfer uses the same account twice', async () => {
        const user = userEvent.setup()

        render(
            <TransactionForm
                accounts={[createAccount()]}
                sections={[]}
                initialValues={{
                    type: 'TRANSFER',
                    amount: 20,
                    date: '2026-06-01',
                    accountId: null,
                    fromAccountId: 'a1',
                    toAccountId: 'a1',
                    categoryId: null,
                    merchant: null,
                    note: null,
                }}
                onSubmit={vi.fn()}
            />,
        )

        await user.click(screen.getByRole('button', { name: 'Save' }))

        expect(
            await screen.findByText('From and To accounts must be different'),
        ).toBeInTheDocument()
        expect(screen.getByRole('combobox', { name: 'To account' })).toHaveAttribute(
            'aria-describedby',
            'toAccountId-error',
        )
    })

    it('prevents a second submit while the first submission is pending', async () => {
        const user = userEvent.setup()
        let resolveSubmission: (() => void) | undefined
        const onSubmit = vi.fn(
            () =>
                new Promise<void>((resolve) => {
                    resolveSubmission = resolve
                }),
        )

        render(
            <TransactionForm
                accounts={[createAccount()]}
                sections={[]}
                initialValues={{
                    type: 'EXPENSE',
                    amount: 20,
                    date: '2026-06-01',
                    accountId: 'a1',
                    fromAccountId: null,
                    toAccountId: null,
                    categoryId: null,
                    merchant: null,
                    note: null,
                }}
                onSubmit={onSubmit}
            />,
        )

        const saveButton = screen.getByRole('button', { name: 'Save' })
        await user.click(saveButton)
        await waitFor(() => expect(saveButton).toHaveAttribute('aria-disabled', 'true'))
        await user.click(saveButton)

        expect(onSubmit).toHaveBeenCalledTimes(1)
        resolveSubmission?.()
        await waitFor(() => expect(saveButton).not.toHaveAttribute('aria-disabled', 'true'))
    })
})
