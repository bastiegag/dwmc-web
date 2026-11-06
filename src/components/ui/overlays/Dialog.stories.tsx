import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button } from '../actions/Button'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from './Dialog'

const meta = {
    title: 'Design System/Components/Overlays/Dialog',
    component: Dialog,
    tags: ['autodocs'],
} satisfies Meta<typeof Dialog>

export default meta
type Story = StoryObj<typeof meta>

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
                    <Button type="button">Save changes</Button>
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
                <label className="grid gap-2 text-sm font-medium">
                    Display name
                    <input className="h-10 rounded-md border bg-background px-3" />
                </label>
                <DialogFooter>
                    <Button type="submit">Save</Button>
                </DialogFooter>
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
                    </DialogContent>
                </Dialog>
            </>
        )
    },
}
