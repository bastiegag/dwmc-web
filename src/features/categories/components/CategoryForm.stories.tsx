import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import { CategoryForm } from './CategoryForm'
import type { SectionWithCategories } from '@/features/categories/types'

const sections: SectionWithCategories[] = [
    {
        id: 'section-needs',
        name: 'Needs',
        color: '#7cb2ac',
        isArchived: false,
        createdAt: '2026-01-01T00:00:00.000Z',
        updatedAt: '2026-01-01T00:00:00.000Z',
        categories: [],
    },
]

const meta = {
    title: 'Design System/Product/Categories/Category Form',
    component: CategoryForm,
    tags: ['autodocs'],
    args: { sections, submitLabel: 'Create category', onSubmit: fn() },
} satisfies Meta<typeof CategoryForm>

export default meta
type Story = StoryObj<typeof meta>

export const Create: Story = { args: {} }

export const Edit: Story = {
    args: {
        initialValues: {
            name: 'Groceries',
            icon: 'shopping-cart',
            sectionId: 'section-needs',
        },
        submitLabel: 'Save changes',
    },
}

export const ValidationErrors: Story = {
    play: async ({ canvas, userEvent }) => {
        await userEvent.click(canvas.getByRole('button', { name: 'Create category' }))
    },
}

export const Pending: Story = { args: { isPending: true } }

export const ServerError: Story = {
    args: { errorMessage: 'The category could not be saved. Please try again.' },
}

export const ArchivedSection: Story = {
    args: {
        sections: [
            {
                ...sections[0],
                id: 'section-archived',
                name: 'Archived section',
                isArchived: true,
                categories: [],
            },
        ],
        initialValues: {
            name: 'Historical category',
            icon: 'tags',
            sectionId: 'section-archived',
        },
        submitLabel: 'Save changes',
    },
}
