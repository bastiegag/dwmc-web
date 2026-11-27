import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { TextField } from '@/components/form'
import { Button } from '../actions/Button'
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from './Dialog'

const meta = {
    title: 'Design System/Primitives/Overlays/Dialog',
    component: Dialog,
    tags: ['autodocs'],
} satisfies Meta<typeof Dialog>

export default meta
type Story = StoryObj<typeof meta>

const ProfileForm = () => {
    const [submitted, setSubmitted] = useState(false)

    return (
        <>
            <form
                className="space-y-4"
                onSubmit={(event) => {
                    event.preventDefault()
                    setSubmitted(true)
                }}
            >
                <TextField
                    id="dialog-display-name"
                    name="displayName"
                    label="Display name"
                    required
                />
                <DialogFooter>
                    <Button type="submit">Save changes</Button>
                </DialogFooter>
            </form>
            {submitted && (
                <p role="status" className="text-sm text-muted-foreground">
                    Profile changes submitted.
                </p>
            )}
        </>
    )
}

export const Default: Story = {
    render: () => (
        <Dialog>
            <DialogTrigger render={<Button />}>Open dialog</DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Dialog title</DialogTitle>
                    <DialogDescription>
                        Dialog content is modal and keyboard accessible.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <DialogClose render={<Button type="button" variant="outlined" />}>
                        Close dialog
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    ),
}

export const FormDialog: Story = {
    render: () => (
        <Dialog>
            <DialogTrigger render={<Button />}>Open form</DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Update profile</DialogTitle>
                    <DialogDescription>Change your display name.</DialogDescription>
                </DialogHeader>
                <ProfileForm />
            </DialogContent>
        </Dialog>
    ),
}

export const LoadingState: Story = {
    render: () => (
        <Dialog>
            <DialogTrigger render={<Button />}>Open loading dialog</DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Saving changes</DialogTitle>
                    <DialogDescription>Please wait while your changes are saved.</DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button type="button" disabled>
                        Saving...
                    </Button>
                </DialogFooter>
                <p role="status" className="text-sm text-muted-foreground">
                    Saving your changes. Please wait.
                </p>
            </DialogContent>
        </Dialog>
    ),
}

export const Controlled: Story = {
    render: function ControlledDialog() {
        const [open, setOpen] = useState(false)
        return (
            <>
                <Button onClick={() => setOpen(true)}>Open controlled dialog</Button>
                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Controlled dialog</DialogTitle>
                            <DialogDescription>
                                This dialog is controlled by its parent.
                            </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                            <DialogClose render={<Button variant="outlined" />}>
                                Close dialog
                            </DialogClose>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </>
        )
    },
}

export const LongContent: Story = {
    render: () => (
        <Dialog>
            <DialogTrigger render={<Button />}>Open long dialog</DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Review transaction details</DialogTitle>
                    <DialogDescription>
                        This example demonstrates a dialog with content that exceeds a short
                        viewport.
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                    {Array.from({ length: 12 }, (_, index) => (
                        <p key={index}>
                            Transaction detail {index + 1}: review the date, account, category, and
                            amount before saving.
                        </p>
                    ))}
                </div>
                <DialogFooter>
                    <DialogClose render={<Button variant="outlined" />}>Close dialog</DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    ),
}
