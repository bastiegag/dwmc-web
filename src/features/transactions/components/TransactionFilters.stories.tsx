import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, userEvent, within } from 'storybook/test'
import TransactionFilters from './TransactionFilters'

const accounts = [
    {
        id: 'account-chequing',
        name: 'Chequing',
        type: 'CHECKING' as const,
        startingBalance: 1200,
        currentBalance: 1200,
        goal: null,
        color: '#ed6a5a',
        icon: 'wallet',
        isArchived: false,
        createdAt: '2026-10-01T00:00:00.000Z',
        updatedAt: '2026-10-01T00:00:00.000Z',
    },
]

const sections = [
    {
        id: 'section-needs',
        name: 'Needs',
        color: '#ed6a5a',
        isArchived: false,
        createdAt: '2026-10-01T00:00:00.000Z',
        updatedAt: '2026-10-01T00:00:00.000Z',
        categories: [
            {
                id: 'category-groceries',
                name: 'Groceries',
                icon: 'shopping-cart',
                sectionId: 'section-needs',
                isArchived: false,
                createdAt: '2026-10-01T00:00:00.000Z',
                updatedAt: '2026-10-01T00:00:00.000Z',
            },
        ],
    },
]

const meta = {
    title: 'Design System/Product/Transactions/Transaction Filters',
    component: TransactionFilters,
    tags: ['autodocs'],
    args: { accounts, sections, onChange: fn() },
} satisfies Meta<typeof TransactionFilters>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
export const SelectedFilters: Story = {
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement.ownerDocument.body)
        await userEvent.click(canvas.getByRole('combobox', { name: 'Type' }))
        await userEvent.click(await canvas.findByRole('option', { name: 'Expense' }))
        await userEvent.click(canvas.getByRole('combobox', { name: 'Account' }))
        await userEvent.click(await canvas.findByRole('option', { name: 'Chequing' }))
        await userEvent.type(canvas.getByLabelText('Search'), 'market')
        await expect(canvas.getByLabelText('Search')).toHaveValue('market')
    },
}
