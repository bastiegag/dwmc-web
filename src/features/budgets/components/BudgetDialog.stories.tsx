import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import { BudgetDialog } from './BudgetDialog'
import type { BudgetFormInput } from '@/features/budgets/schemas/budget.schema'
import type { SectionWithCategories } from '@/features/categories/types'

const sections: SectionWithCategories[] = [
    {
        id: 'section-needs',
        name: 'Needs',
        color: 'secondary',
        isArchived: false,
        createdAt: '2026-01-01T00:00:00.000Z',
        updatedAt: '2026-01-01T00:00:00.000Z',
        categories: [
            {
                id: 'category-groceries',
                name: 'Groceries',
                icon: 'shopping-cart',
                sectionId: 'section-needs',
                isArchived: false,
                createdAt: '2026-01-01T00:00:00.000Z',
                updatedAt: '2026-01-01T00:00:00.000Z',
            },
        ],
    },
]

const editValues: BudgetFormInput = {
    categoryId: 'category-groceries',
    month: '2026-06',
    amount: '600',
}

const meta = {
    title: 'Design System/Product/Budgets/Budget Dialog',
    component: BudgetDialog,
    tags: ['autodocs'],
    args: {
        open: true,
        mode: 'create',
        sections,
        defaultMonth: '2026-06',
        onOpenChange: fn(),
        onSubmit: fn(),
    },
    parameters: {
        docs: {
            description: {
                component:
                    'Controlled create/edit dialog. Failed saves remain open, while pending saves prevent duplicate submissions and dismissal.',
            },
        },
    },
} satisfies Meta<typeof BudgetDialog>

export default meta
type Story = StoryObj<typeof meta>

export const Create: Story = { args: {} }

export const Edit: Story = {
    args: { mode: 'edit', initialValues: editValues },
}

export const Controlled: Story = {
    render: function ControlledRender() {
        const [open, setOpen] = useState(true)

        return (
            <>
                <button type="button" onClick={() => setOpen(true)}>
                    Open budget dialog
                </button>
                <BudgetDialog
                    open={open}
                    mode="create"
                    sections={sections}
                    defaultMonth="2026-06"
                    onOpenChange={setOpen}
                    onSubmit={fn()}
                />
            </>
        )
    },
}

export const Pending: Story = { args: { isPending: true } }

export const Error: Story = {
    args: { errorMessage: 'A budget already exists for this category and month.' },
}
