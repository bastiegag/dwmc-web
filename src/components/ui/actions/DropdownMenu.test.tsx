import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuTrigger,
} from './DropdownMenu'

const renderBasicMenu = (onRename = vi.fn(), onArchive = vi.fn()) =>
    render(
        <DropdownMenu>
            <DropdownMenuTrigger>Actions</DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuItem onClick={onRename}>Rename</DropdownMenuItem>
                <DropdownMenuItem disabled onClick={onArchive}>
                    Archive
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>,
    )

describe('DropdownMenu', () => {
    it('opens on click and closes on Escape, restoring focus to the trigger', async () => {
        const user = userEvent.setup()
        renderBasicMenu()
        const trigger = screen.getByRole('button', { name: 'Actions' })

        await user.click(trigger)
        expect(await screen.findByRole('menu')).toBeInTheDocument()
        expect(screen.getByRole('menuitem', { name: 'Rename' })).toBeInTheDocument()

        await user.keyboard('{Escape}')
        await waitFor(() => expect(screen.queryByRole('menu')).not.toBeInTheDocument())
        expect(trigger).toHaveFocus()
    })

    it('supports keyboard navigation and activates the focused item with Enter', async () => {
        const user = userEvent.setup()
        const onRename = vi.fn()
        renderBasicMenu(onRename)

        screen.getByRole('button', { name: 'Actions' }).focus()
        await user.keyboard('{ArrowDown}')
        expect(await screen.findByRole('menu')).toBeInTheDocument()
        await user.keyboard('{Enter}')

        expect(onRename).toHaveBeenCalledTimes(1)
    })

    it('marks disabled actions and does not invoke them', async () => {
        const user = userEvent.setup()
        const onArchive = vi.fn()
        renderBasicMenu(vi.fn(), onArchive)

        await user.click(screen.getByRole('button', { name: 'Actions' }))
        const archive = await screen.findByRole('menuitem', { name: 'Archive' })

        expect(archive).toHaveAttribute('aria-disabled', 'true')
        await user.click(archive)
        expect(onArchive).not.toHaveBeenCalled()
    })

    it('toggles checkbox items and reports the new checked state', async () => {
        const user = userEvent.setup()
        const onCheckedChange = vi.fn()
        const Controlled = () => {
            const [checked, setChecked] = React.useState(false)
            return (
                <DropdownMenu>
                    <DropdownMenuTrigger>View</DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuCheckboxItem
                            checked={checked}
                            onCheckedChange={(next) => {
                                onCheckedChange(next)
                                setChecked(next)
                            }}
                        >
                            Show archived
                        </DropdownMenuCheckboxItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        }
        render(<Controlled />)

        await user.click(screen.getByRole('button', { name: 'View' }))
        const item = await screen.findByRole('menuitemcheckbox', { name: 'Show archived' })
        expect(item).toHaveAttribute('aria-checked', 'false')

        await user.click(item)
        expect(onCheckedChange).toHaveBeenCalledWith(true)
        await waitFor(() => expect(item).toHaveAttribute('aria-checked', 'true'))
    })

    it('selects a radio item within its group', async () => {
        const user = userEvent.setup()
        const onValueChange = vi.fn()
        render(
            <DropdownMenu>
                <DropdownMenuTrigger>Period</DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuRadioGroup value="month" onValueChange={onValueChange}>
                        <DropdownMenuRadioItem value="month">Month</DropdownMenuRadioItem>
                        <DropdownMenuRadioItem value="year">Year</DropdownMenuRadioItem>
                    </DropdownMenuRadioGroup>
                </DropdownMenuContent>
            </DropdownMenu>,
        )

        await user.click(screen.getByRole('button', { name: 'Period' }))
        expect(await screen.findByRole('menuitemradio', { name: 'Month' })).toHaveAttribute(
            'aria-checked',
            'true',
        )

        await user.click(screen.getByRole('menuitemradio', { name: 'Year' }))
        expect(onValueChange).toHaveBeenCalledWith('year', expect.anything())
    })
})
