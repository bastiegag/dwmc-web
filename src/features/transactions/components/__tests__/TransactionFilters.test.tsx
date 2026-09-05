import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@/test/utils/render'
import TransactionFilters from '@/features/transactions/components/TransactionFilters'

describe('TransactionFilters', () => {
    it('reports selected type, account, category, and search filters', async () => {
        const user = userEvent.setup()
        const onChange = vi.fn()

        render(
            <TransactionFilters
                accounts={[
                    {
                        id: 'account-1',
                        name: 'Checking',
                        type: 'CHECKING',
                        startingBalance: 0,
                        currentBalance: 0,
                        goal: null,
                        color: '#000000',
                        icon: 'wallet',
                        isArchived: false,
                        createdAt: '',
                        updatedAt: '',
                    },
                ]}
                sections={[
                    {
                        id: 'section-1',
                        name: 'Living',
                        color: '#000000',
                        isArchived: false,
                        createdAt: '',
                        updatedAt: '',
                        categories: [
                            {
                                id: 'category-1',
                                name: 'Groceries',
                                icon: 'cart',
                                sectionId: 'section-1',
                                isArchived: false,
                                createdAt: '',
                                updatedAt: '',
                            },
                        ],
                    },
                ]}
                onChange={onChange}
            />,
        )

        await user.selectOptions(screen.getByLabelText('Type'), 'INCOME')
        await user.selectOptions(screen.getByLabelText('Account'), 'account-1')
        await user.selectOptions(screen.getByLabelText('Category'), 'category-1')
        await user.type(screen.getByLabelText('Search'), 'groceries')

        expect(onChange).toHaveBeenLastCalledWith({
            type: 'INCOME',
            accountId: 'account-1',
            categoryId: 'category-1',
            search: 'groceries',
        })
    })
})
