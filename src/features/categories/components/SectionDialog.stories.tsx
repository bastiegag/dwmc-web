import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import { SectionDialog } from './SectionDialog'

const meta = {
    title: 'Design System/Product/Categories/Section Dialog',
    component: SectionDialog,
    tags: ['autodocs'],
    args: {
        open: true,
        mode: 'create',
        onOpenChange: fn(),
        onSubmit: fn(),
    },
} satisfies Meta<typeof SectionDialog>

export default meta
type Story = StoryObj<typeof meta>

export const Create: Story = { args: {} }

export const Edit: Story = {
    args: { mode: 'edit', initialValues: { name: 'Needs', color: 'secondary' } },
}

export const Controlled: Story = {
    render: function ControlledRender() {
        const [open, setOpen] = useState(true)

        return (
            <>
                <button type="button" onClick={() => setOpen(true)}>
                    Open section dialog
                </button>
                <SectionDialog open={open} mode="create" onOpenChange={setOpen} onSubmit={fn()} />
            </>
        )
    },
}

export const Pending: Story = { args: { isPending: true } }

export const Error: Story = {
    args: { errorMessage: 'The section could not be saved. Please try again.' },
}
