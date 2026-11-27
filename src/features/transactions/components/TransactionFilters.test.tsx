import userEvent from '@testing-library/user-event'
import { act, fireEvent, waitFor } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
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
    afterEach(() => {
        vi.useRealTimers()
    })

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
                        color: 'primary',
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
                        color: 'primary',
                        isArchived: false,
                        createdAt: '',
                        updatedAt: '',
                        categories: [
                            {
                                id: 'category-1',
                                name: 'Groceries',
                                icon: 'shopping-cart',
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

        await waitFor(() => {
            expect(onChange).toHaveBeenLastCalledWith({
                type: 'INCOME',
                accountId: 'account-1',
                categoryId: 'category-1',
                search: 'groceries',
            })
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

    it('updates the search input immediately and applies only the latest value after 300ms', async () => {
        vi.useFakeTimers()
        const onChange = vi.fn()

        render(<TransactionFilters accounts={[]} sections={[]} onChange={onChange} />)

        const searchInput = screen.getByLabelText('Search')
        fireEvent.change(searchInput, { target: { value: 'coffee' } })

        expect(searchInput).toHaveValue('coffee')
        expect(onChange).toHaveBeenLastCalledWith({})

        await act(async () => {
            await vi.advanceTimersByTimeAsync(299)
        })
        expect(onChange).toHaveBeenLastCalledWith({})

        await act(async () => {
            await vi.advanceTimersByTimeAsync(1)
        })
        expect(onChange).toHaveBeenLastCalledWith({ search: 'coffee' })
        expect(onChange.mock.calls.filter(([filters]) => 'search' in filters)).toHaveLength(1)
    })

    it('applies other filters immediately without losing a pending search', async () => {
        vi.useFakeTimers()
        const onChange = vi.fn()

        render(<TransactionFilters accounts={[]} sections={[]} onChange={onChange} />)

        fireEvent.change(screen.getByLabelText('Search'), { target: { value: 'coffee' } })
        fireEvent.click(screen.getByRole('combobox', { name: 'Type' }))
        const incomeOption = screen.getByRole('option', { name: 'Income' })
        fireEvent.pointerDown(incomeOption, { button: 0, pointerId: 1, pointerType: 'mouse' })
        fireEvent.click(incomeOption, { button: 0, detail: 1 })

        expect(onChange).toHaveBeenLastCalledWith({ type: 'INCOME' })

        await act(async () => {
            await vi.advanceTimersByTimeAsync(300)
        })
        expect(onChange).toHaveBeenLastCalledWith({ type: 'INCOME', search: 'coffee' })
    })

    it('clears filters immediately and does not apply an outdated pending search', async () => {
        vi.useFakeTimers()
        const onChange = vi.fn()

        render(<TransactionFilters accounts={[]} sections={[]} onChange={onChange} />)

        const searchInput = screen.getByLabelText('Search')
        fireEvent.change(searchInput, { target: { value: 'outdated' } })
        fireEvent.click(screen.getByRole('button', { name: 'Clear' }))

        expect(searchInput).toHaveValue('')
        expect(onChange).toHaveBeenLastCalledWith({})

        await act(async () => {
            await vi.advanceTimersByTimeAsync(300)
        })

        expect(onChange).toHaveBeenLastCalledWith({})
        expect(onChange.mock.calls.filter(([filters]) => 'search' in filters)).toHaveLength(0)
    })

    it('cancels a pending search update when unmounted', async () => {
        vi.useFakeTimers()
        const onChange = vi.fn()

        const { unmount } = render(
            <TransactionFilters accounts={[]} sections={[]} onChange={onChange} />,
        )

        fireEvent.change(screen.getByLabelText('Search'), { target: { value: 'pending' } })
        unmount()

        await act(async () => {
            await vi.advanceTimersByTimeAsync(300)
        })

        expect(onChange.mock.calls.filter(([filters]) => 'search' in filters)).toHaveLength(0)
        expect(vi.getTimerCount()).toBe(0)
    })
})
