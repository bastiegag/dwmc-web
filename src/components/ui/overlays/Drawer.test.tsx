import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { Button } from '../actions/Button'
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerTitle,
    DrawerTrigger,
} from './Drawer'

const renderDrawer = () =>
    render(
        <Drawer>
            <DrawerTrigger render={<Button />}>Open drawer</DrawerTrigger>
            <DrawerContent>
                <DrawerTitle>Transaction filters</DrawerTitle>
                <DrawerDescription>Narrow the transaction list.</DrawerDescription>
                <DrawerClose render={<Button variant="outlined" />}>Done</DrawerClose>
            </DrawerContent>
        </Drawer>,
    )

describe('Drawer', () => {
    it('exposes an accessible dialog name and description when opened', async () => {
        const user = userEvent.setup()
        renderDrawer()

        await user.click(screen.getByRole('button', { name: 'Open drawer' }))
        const dialog = await screen.findByRole('dialog', { name: 'Transaction filters' })

        expect(dialog).toHaveAccessibleDescription('Narrow the transaction list.')
    })

    it('closes with Escape and restores focus to the trigger', async () => {
        const user = userEvent.setup()
        renderDrawer()
        const trigger = screen.getByRole('button', { name: 'Open drawer' })

        await user.click(trigger)
        await screen.findByRole('dialog')
        await user.keyboard('{Escape}')

        await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())
        expect(trigger).toHaveFocus()
    })

    it('closes through the close control', async () => {
        const user = userEvent.setup()
        renderDrawer()

        await user.click(screen.getByRole('button', { name: 'Open drawer' }))
        await user.click(await screen.findByRole('button', { name: 'Done' }))

        await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())
    })
})
