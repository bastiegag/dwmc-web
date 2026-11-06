import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerTitle,
    DrawerTrigger,
} from './Drawer'
import { Button } from '../actions/Button'
import { Input } from '../forms/Input'
import { Label } from '../forms/Label'

const meta = {
    title: 'Design System/Components/Overlays/Drawer',
    component: Drawer,
    tags: ['autodocs'],
    parameters: {
        layout: 'fullscreen',
        docs: {
            description: {
                component:
                    'Bottom-anchored dialog for mobile-first secondary tasks. Built on the Base UI dialog, so Escape closes it, focus is trapped while open, and focus returns to the trigger on close. Provide `DrawerTitle` and `DrawerDescription` for the accessible name and description.',
            },
        },
    },
} satisfies Meta<typeof Drawer>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
    render: () => (
        <Drawer>
            <DrawerTrigger render={<Button />}>Open drawer</DrawerTrigger>
            <DrawerContent>
                <DrawerTitle>Mobile panel</DrawerTitle>
                <DrawerDescription>Secondary content for small screens.</DrawerDescription>
                <DrawerClose render={<Button variant="outlined" className="mt-4" />}>
                    Close
                </DrawerClose>
            </DrawerContent>
        </Drawer>
    ),
}

export const Controlled: Story = {
    render: function ControlledRender() {
        const [open, setOpen] = useState(false)
        return (
            <div className="space-y-2">
                <Button onClick={() => setOpen(true)}>Open from outside</Button>
                <p className="text-sm text-muted-foreground">
                    Drawer is {open ? 'open' : 'closed'}
                </p>
                <Drawer open={open} onOpenChange={setOpen}>
                    <DrawerContent>
                        <DrawerTitle>Controlled drawer</DrawerTitle>
                        <DrawerDescription>
                            State is owned by the parent component.
                        </DrawerDescription>
                        <DrawerClose render={<Button variant="outlined" className="mt-4" />}>
                            Done
                        </DrawerClose>
                    </DrawerContent>
                </Drawer>
            </div>
        )
    },
}

export const FormContent: Story = {
    render: () => (
        <Drawer>
            <DrawerTrigger render={<Button />}>Add transaction</DrawerTrigger>
            <DrawerContent>
                <DrawerTitle>Add transaction</DrawerTitle>
                <DrawerDescription>Enter the payee and amount.</DrawerDescription>
                <form className="mt-4 space-y-4" onSubmit={(event) => event.preventDefault()}>
                    <div className="space-y-1.5">
                        <Label htmlFor="drawer-payee">Payee</Label>
                        <Input id="drawer-payee" placeholder="Grocery store" />
                    </div>
                    <div className="flex justify-end gap-2">
                        <DrawerClose render={<Button variant="outlined" />}>Cancel</DrawerClose>
                        <Button type="submit">Save</Button>
                    </div>
                </form>
            </DrawerContent>
        </Drawer>
    ),
}

export const KeyboardInteraction: Story = {
    render: () => (
        <div className="max-w-sm space-y-2 text-sm text-muted-foreground">
            <p>Tab moves focus within the open drawer. Escape closes it and returns focus here.</p>
            <Drawer>
                <DrawerTrigger render={<Button />}>Open with keyboard</DrawerTrigger>
                <DrawerContent>
                    <DrawerTitle>Keyboard panel</DrawerTitle>
                    <DrawerDescription>Press Escape to close.</DrawerDescription>
                    <Button className="mt-4">First action</Button>
                </DrawerContent>
            </Drawer>
        </div>
    ),
}
