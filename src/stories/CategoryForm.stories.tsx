import type { Meta, StoryObj } from '@storybook/react-vite'
import { CategoryForm } from '@/features/categories/components'
import { createSection } from '@/test/fixtures/domain'

const sections = [
    {
        ...createSection(),
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
