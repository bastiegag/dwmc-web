import type { Meta, StoryObj } from '@storybook/react-vite'
import { CategoryForm } from '@/features/categories/components'

const sections = [
    {
        id: 'section-1',
        name: 'Food',
        color: '#22c55e',
        isArchived: false,
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z',
        categories: [],
    },
]

const meta: Meta<typeof CategoryForm> = {
    title: 'Categories/CategoryForm',
    component: CategoryForm,
    args: {
        sections,
        submitLabel: 'Create category',
        onSubmit: async () => {},
    },
    tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
