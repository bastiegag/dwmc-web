import type { Meta, StoryObj } from '@storybook/react-vite'
import { CategoryItem } from '@/features/categories/components'
import { createCategory } from '@/test/fixtures/domain'

const meta: Meta<typeof CategoryItem> = {
    title: 'Categories/CategoryItem',
    component: CategoryItem,
    args: {
        category: createCategory(),
        onEdit: () => {},
        onArchive: async () => {},
    },
    tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
