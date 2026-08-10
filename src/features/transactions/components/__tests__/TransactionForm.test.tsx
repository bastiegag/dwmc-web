import { describe, expect, it, vi } from 'vitest'
import userEvent from '@testing-library/user-event'
import { render, screen, waitFor } from '@/test/utils/render'
import TransactionForm from '@/features/transactions/components/TransactionForm'
import { createAccount, createCategory, createSectionWithCategories } from '@/test/fixtures/domain'

describe('TransactionForm', () => {
    it('preserves an archived account when editing a historical transaction', () => {
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

        expect(screen.getByRole('option', { name: archivedAccount.name })).not.toBeDisabled()
    })

    it('preserves an archived category when editing a historical transaction', () => {
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

        const option = screen.getByRole('option', { name: /groceries \(archived\)/i })
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

        await user.selectOptions(screen.getByLabelText('Type'), 'TRANSFER')
        await user.selectOptions(screen.getByLabelText('From account'), 'a1')
        await user.selectOptions(screen.getByLabelText('To account'), 'a2')
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

        await user.selectOptions(screen.getByLabelText('Type'), 'EXPENSE')
        await user.selectOptions(screen.getByLabelText('Account'), 'a1')
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

        await user.selectOptions(screen.getByLabelText('Type'), 'ADJUSTMENT')
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

        await user.selectOptions(screen.getByLabelText('Type'), 'INCOME')
        await user.selectOptions(screen.getByLabelText('Category (optional)'), category.id)
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
})
