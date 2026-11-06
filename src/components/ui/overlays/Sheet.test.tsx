import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React from 'react'
import { describe, expect, it, vi } from 'vitest'
import { Button } from '../actions/Button'
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetTitle,
    SheetTrigger,
} from './Sheet'

const renderSheet = (props: { open?: boolean; onOpenChange?: (open: boolean) => void } = {}) =>
    render(
        <Sheet open={props.open} onOpenChange={props.onOpenChange}>
            <SheetTrigger render={<Button />}>Open sheet</SheetTrigger>
            <SheetContent>
                <SheetTitle>Account details</SheetTitle>
                <SheetDescription>Review the account.</SheetDescription>
                <SheetClose render={<Button variant="outlined" />}>Close</SheetClose>
            </SheetContent>
        </Sheet>,
    )

describe('Sheet', () => {
    it('exposes an accessible dialog name and description when opened', async () => {
        const user = userEvent.setup()
        renderSheet()

        await user.click(screen.getByRole('button', { name: 'Open sheet' }))
        const dialog = await screen.findByRole('dialog', { name: 'Account details' })

        expect(dialog).toHaveAccessibleDescription('Review the account.')
    })

    it('closes with Escape and restores focus to the trigger', async () => {
        const user = userEvent.setup()
        renderSheet()
        const trigger = screen.getByRole('button', { name: 'Open sheet' })

        await user.click(trigger)
        await screen.findByRole('dialog')
        await user.keyboard('{Escape}')

        await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())
        expect(trigger).toHaveFocus()
    })

    it('moves focus into the dialog when opened', async () => {
        const user = userEvent.setup()
        renderSheet()

        await user.click(screen.getByRole('button', { name: 'Open sheet' }))
        const dialog = await screen.findByRole('dialog')

        expect(dialog).toBeInTheDocument()
        await waitFor(() => expect(dialog.contains(document.activeElement)).toBe(true))
    })

    it('respects controlled open state', async () => {
        const onOpenChange = vi.fn()
        const { rerender } = renderSheet({ open: false, onOpenChange })
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument()

        rerender(
            <Sheet open onOpenChange={onOpenChange}>
                <SheetContent>
                    <SheetTitle>Controlled</SheetTitle>
                </SheetContent>
            </Sheet>,
        )
        expect(await screen.findByRole('dialog', { name: 'Controlled' })).toBeInTheDocument()
    })

    it('closes through the close control', async () => {
        const user = userEvent.setup()
        const onOpenChange = vi.fn()
        const Controlled = () => {
            const [open, setOpen] = React.useState(true)
            return (
                <Sheet
                    open={open}
                    onOpenChange={(next) => {
                        onOpenChange(next)
                        setOpen(next)
                    }}
                >
                    <SheetContent>
                        <SheetTitle>Controlled</SheetTitle>
                        <SheetClose render={<Button variant="outlined" />}>Close</SheetClose>
                    </SheetContent>
                </Sheet>
            )
        }
        render(<Controlled />)

        await user.click(screen.getByRole('button', { name: 'Close' }))
        await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())
        expect(onOpenChange).toHaveBeenLastCalledWith(false)
    })
})
