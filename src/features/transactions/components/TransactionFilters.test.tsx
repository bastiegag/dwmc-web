import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@/test/utils/render'
import TransactionFilters from '@/features/transactions/components/TransactionFilters'

const chooseOption = async (
    user: ReturnType<typeof userEvent.setup>,
    label: string,
    value: string,
) => {
    await user.click(screen.getByRole('combobox', { name: label }))
    await user.click(await screen.findByRole('option', { name: value }))
}

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

        await chooseOption(user, 'Type', 'Income')
        await chooseOption(user, 'Account', 'Checking')
        await chooseOption(user, 'Category', 'Groceries')
        await user.type(screen.getByLabelText('Search'), 'groceries')

        expect(onChange).toHaveBeenLastCalledWith({
            type: 'INCOME',
            accountId: 'account-1',
            categoryId: 'category-1',
            search: 'groceries',
        })
    })

    it('clears all selected filters', async () => {
        const user = userEvent.setup()
        const onChange = vi.fn()

        render(<TransactionFilters accounts={[]} sections={[]} onChange={onChange} />)

        await chooseOption(user, 'Type', 'Income')
        await user.click(screen.getByRole('button', { name: 'Clear' }))

        expect(onChange).toHaveBeenLastCalledWith({})
        expect(screen.getByRole('combobox', { name: 'Type' })).toHaveTextContent('All')
    })
})
