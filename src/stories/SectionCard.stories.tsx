import type { Meta, StoryObj } from '@storybook/react-vite'
import { SectionCard } from '@/features/categories/components'

const section = {
    id: 'section-1',
    name: 'Food',
    color: '#22c55e',
    isArchived: false,
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
    categories: [
        {
            id: 'cat-1',
            name: 'Groceries',
            icon: 'shopping-cart',
            sectionId: 'section-1',
            isArchived: false,
            createdAt: '2024-01-01T00:00:00.000Z',
            updatedAt: '2024-01-01T00:00:00.000Z',
        },
    ],
}

const meta: Meta<typeof SectionCard> = {
    title: 'Categories/SectionCard',
    component: SectionCard,
    args: {
        section,
        onEditSection: () => {},
        onArchiveSection: async () => {},
        onEditCategory: () => {},
        onArchiveCategory: async () => {},
    },
    tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
