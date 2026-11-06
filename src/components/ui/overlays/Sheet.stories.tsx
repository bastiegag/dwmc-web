import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetTitle,
    SheetTrigger,
} from './Sheet'
import { Button } from '../actions/Button'
import { Input } from '../forms/Input'
import { Label } from '../forms/Label'

const meta = {
    title: 'Design System/Components/Overlays/Sheet',
    component: Sheet,
    tags: ['autodocs'],
    parameters: {
        layout: 'fullscreen',
        docs: {
            description: {
                component:
                    'Side-anchored dialog for detail panels and forms. Set `side` on `SheetContent` to choose the edge. Escape and backdrop click close it, focus stays inside while open, and focus returns to the trigger.',
            },
        },
    },
} satisfies Meta<typeof Sheet>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
    render: () => (
        <Sheet>
            <SheetTrigger render={<Button />}>Open sheet</SheetTrigger>
            <SheetContent>
                <SheetTitle>Account details</SheetTitle>
                <SheetDescription>Review the account before making changes.</SheetDescription>
                <SheetClose render={<Button variant="outlined" className="mt-4" />}>
                    Close
                </SheetClose>
            </SheetContent>
        </Sheet>
    ),
}

export const Controlled: Story = {
    render: function ControlledRender() {
        const [open, setOpen] = useState(false)
        return (
            <div className="space-y-2">
                <Button onClick={() => setOpen(true)}>Open from outside</Button>
                <p className="text-sm text-muted-foreground">Sheet is {open ? 'open' : 'closed'}</p>
                <Sheet open={open} onOpenChange={setOpen}>
                    <SheetContent>
                        <SheetTitle>Controlled sheet</SheetTitle>
                        <SheetDescription>State is owned by the parent component.</SheetDescription>
                    </SheetContent>
                </Sheet>
            </div>
        )
    },
}

export const Placements: Story = {
    render: () => (
        <div className="flex flex-wrap gap-2">
            {(['top', 'right', 'bottom', 'left'] as const).map((side) => (
                <Sheet key={side}>
                    <SheetTrigger render={<Button variant="outlined" />}>{side}</SheetTrigger>
                    <SheetContent side={side}>
                        <SheetTitle>Sheet from {side}</SheetTitle>
                        <SheetDescription>Anchored to the {side} edge.</SheetDescription>
                    </SheetContent>
                </Sheet>
            ))}
        </div>
    ),
}

export const FormContent: Story = {
    render: () => (
        <Sheet>
            <SheetTrigger render={<Button />}>Edit account</SheetTrigger>
            <SheetContent>
                <SheetTitle>Edit account</SheetTitle>
                <SheetDescription>Update the account name.</SheetDescription>
                <form className="mt-4 space-y-4" onSubmit={(event) => event.preventDefault()}>
                    <div className="space-y-1.5">
                        <Label htmlFor="sheet-account-name">Account name</Label>
                        <Input id="sheet-account-name" defaultValue="Checking" />
                    </div>
                    <div className="flex justify-end gap-2">
                        <SheetClose render={<Button variant="outlined" />}>Cancel</SheetClose>
                        <Button type="submit">Save</Button>
                    </div>
                </form>
            </SheetContent>
        </Sheet>
    ),
}
