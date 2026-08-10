import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@/test/utils/render'
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
})
