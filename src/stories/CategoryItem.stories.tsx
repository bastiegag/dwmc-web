import type { Meta, StoryObj } from '@storybook/react-vite'
import { CategoryItem } from '@/features/categories/components'

const category = {
    id: 'cat-1',
    name: 'Groceries',
    icon: 'shopping-cart',
    sectionId: 'section-1',
    isArchived: false,
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
}

const meta: Meta<typeof CategoryItem> = {
    title: 'Categories/CategoryItem',
    component: CategoryItem,
    args: {
        category,
        onEdit: () => {},
        onArchive: async () => {},
    },
    tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
