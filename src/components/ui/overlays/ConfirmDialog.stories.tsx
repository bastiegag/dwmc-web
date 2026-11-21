import { useState, type ReactNode } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import { Button } from '../actions/Button'
import { ConfirmDialog } from './ConfirmDialog'

const meta = {
    title: 'Design System/Components/Overlays/Confirm Dialog',
    component: ConfirmDialog,
    tags: ['autodocs'],
    args: {
        open: false,
        onOpenChange: fn(),
        title: 'Confirm action?',
        description: 'This action cannot be undone.',
        onConfirm: fn(),
    },
} satisfies Meta<typeof ConfirmDialog>

export default meta
type Story = StoryObj<typeof meta>

type ConfirmationExampleProps = {
    title?: ReactNode
    description?: ReactNode
    confirmLabel?: string
    variant?: 'default' | 'destructive'
    onConfirm?: () => Promise<void> | void
}

const ConfirmationExample = ({
    title = 'Confirm action?',
    description = 'This action cannot be undone.',
    confirmLabel = 'Confirm',
    variant = 'default',
    onConfirm = () => undefined,
}: ConfirmationExampleProps) => {
    const [open, setOpen] = useState(false)

    return (
        <div className="flex justify-center">
            <Button onClick={() => setOpen(true)}>Open confirmation</Button>
            <ConfirmDialog
                open={open}
                onOpenChange={setOpen}
                title={title}
                description={description}
                confirmLabel={confirmLabel}
                variant={variant}
                onConfirm={onConfirm}
            />
        </div>
    )
}

const pendingConfirmation = () =>
    new Promise<void>((resolve) => {
        void resolve
    })

export const Default: Story = {
    render: () => <ConfirmationExample />,
}

export const Destructive: Story = {
    render: () => (
        <ConfirmationExample
            title="Archive account?"
            description={
                <>
                    This will archive <strong>Daily checking</strong>.
                </>
            }
            confirmLabel="Archive"
            variant="destructive"
        />
    ),
}

export const AsyncPending: Story = {
    render: () => (
        <ConfirmationExample
            title="Archive account?"
            description="Confirm to see the pending state. This demo intentionally remains pending."
            confirmLabel="Archive"
            variant="destructive"
            onConfirm={pendingConfirmation}
        />
    ),
}

export const AsyncSuccess: Story = {
    render: () => (
        <ConfirmationExample
            title="Archive account?"
            description="The confirmation closes after the operation succeeds."
            confirmLabel="Archive"
            variant="destructive"
            onConfirm={async () => undefined}
        />
    ),
}

export const AsyncError: Story = {
    render: () => (
        <ConfirmationExample
            title="Archive account?"
            description="The operation fails, so the dialog remains open."
            confirmLabel="Archive"
            variant="destructive"
            onConfirm={async () => {
                throw new Error('The account could not be archived.')
            }}
        />
    ),
}

export const LongDescription: Story = {
    render: () => (
        <ConfirmationExample
            title="Archive category?"
            description={
                <>
                    This will archive <strong>Household essentials</strong>. Existing transactions
                    and budgets will remain associated with this category and continue to appear in
                    historical views.
                </>
            }
            confirmLabel="Archive"
            variant="destructive"
        />
    ),
}
