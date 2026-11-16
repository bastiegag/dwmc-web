import type { Meta, StoryObj } from '@storybook/react-vite'
import { CategoryBreakdownCard } from './CategoryBreakdownCard'
import type { SummaryCategoryBreakdown } from '@/features/dashboard/types/summary.types'

const meta = {
    title: 'Design System/Product/Dashboard/Category Breakdown Card',
    component: CategoryBreakdownCard,
    tags: ['autodocs'],
    parameters: {
        docs: {
            description: {
                component:
                    'Displays category totals and percentages provided by the monthly summary API.',
            },
        },
    },
} satisfies Meta<typeof CategoryBreakdownCard>

export default meta
type Story = StoryObj<typeof meta>

const categories: SummaryCategoryBreakdown[] = [
    {
        categoryId: 'category-groceries',
        name: 'Groceries',
        icon: 'shopping-bag',
        section: { id: 'section-needs', name: 'Needs', color: '#7cb2ac' },
        total: 720,
        transactionCount: 8,
        percentage: 42.5,
    },
    {
        categoryId: 'category-household',
        name: 'Household supplies and other recurring home essentials',
        icon: null,
        section: { id: 'section-needs', name: 'Needs', color: '#7cb2ac' },
        total: 125,
        transactionCount: 3,
        percentage: 7.4,
    },
]

export const Default: Story = {
    args: { title: 'Top expense categories', items: categories },
}
export const Empty: Story = {
    args: { title: 'Top expense categories', items: [] },
}
export const ZeroSpending: Story = {
    args: {
        title: 'Top expense categories',
        items: [{ ...categories[0], total: 0, transactionCount: 0, percentage: 0 }],
    },
}
export const LongCategoryName: Story = {
    args: {
        title: 'Top expense categories',
        items: [
            {
                ...categories[0],
                name: 'An exceptionally long category name used to check wrapping at narrow widths',
                total: 123456789.99,
                percentage: 100,
            },
        ],
    },
}
