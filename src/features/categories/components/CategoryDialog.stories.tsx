import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import { CategoryDialog } from './CategoryDialog'
import type { SectionWithCategories } from '@/features/categories/types'

const sections: SectionWithCategories[] = [
    {
        id: 'section-needs',
        name: 'Needs',
        color: 'secondary',
        isArchived: false,
        createdAt: '2026-01-01T00:00:00.000Z',
        updatedAt: '2026-01-01T00:00:00.000Z',
        categories: [],
    },
]

const meta = {
    title: 'Design System/Product/Categories/Category Dialog',
    component: CategoryDialog,
    tags: ['autodocs'],
    args: {
        open: true,
        mode: 'create',
        sections,
        onOpenChange: fn(),
        onSubmit: fn(),
    },
} satisfies Meta<typeof CategoryDialog>

export default meta
type Story = StoryObj<typeof meta>

export const Create: Story = { args: {} }

export const Edit: Story = {
    args: {
        mode: 'edit',
        initialValues: {
            name: 'Groceries',
            icon: 'shopping-cart',
            sectionId: 'section-needs',
        },
    },
}

export const Controlled: Story = {
    render: function ControlledRender() {
        const [open, setOpen] = useState(true)

        return (
            <>
                <button type="button" onClick={() => setOpen(true)}>
                    Open category dialog
                </button>
                <CategoryDialog
                    open={open}
                    mode="create"
                    sections={sections}
                    onOpenChange={setOpen}
                    onSubmit={fn()}
                />
            </>
        )
    },
}

export const Pending: Story = { args: { isPending: true } }

export const Error: Story = {
    args: { errorMessage: 'The category could not be saved. Please try again.' },
}
