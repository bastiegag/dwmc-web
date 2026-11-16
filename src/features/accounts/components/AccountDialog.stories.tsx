import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import { AccountDialog } from './AccountDialog'
import type { AccountFormValues } from '@/features/accounts/schemas/account.schema'

const editValues: AccountFormValues = {
    name: 'Emergency savings',
    type: 'SAVINGS',
    startingBalance: 4200,
    goal: 6000,
    color: '#7cb2ac',
    icon: 'landmark',
}

const meta = {
    title: 'Design System/Product/Accounts/Account Dialog',
    component: AccountDialog,
    tags: ['autodocs'],
    args: {
        open: true,
        mode: 'create',
        onOpenChange: fn(),
        onSubmit: fn(),
    },
    parameters: {
        docs: {
            description: {
                component:
                    'Controlled account create/edit dialog. Save errors keep the dialog open; pending saves prevent duplicate submissions and dismissal.',
            },
        },
    },
} satisfies Meta<typeof AccountDialog>

export default meta
type Story = StoryObj<typeof meta>

export const Create: Story = { args: {} }

export const Edit: Story = { args: { mode: 'edit', initialValues: editValues } }

export const Controlled: Story = {
    render: function ControlledRender() {
        const [open, setOpen] = useState(true)

        return (
            <>
                <button type="button" onClick={() => setOpen(true)}>
                    Open account dialog
                </button>
                <AccountDialog open={open} mode="create" onOpenChange={setOpen} onSubmit={fn()} />
            </>
        )
    },
}

export const Pending: Story = { args: { isPending: true } }

export const Error: Story = {
    args: { errorMessage: 'Unable to save this account. Please try again.' },
}
