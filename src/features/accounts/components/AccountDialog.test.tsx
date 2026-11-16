import { describe, expect, it, vi } from 'vitest'
import { useState } from 'react'
import userEvent from '@testing-library/user-event'
import { render, screen, waitFor } from '@/test/utils/render'
import { AccountDialog } from './AccountDialog'

const ControlledAccountDialog = () => {
    const [open, setOpen] = useState(false)

    return (
        <>
            <button type="button" onClick={() => setOpen(true)}>
                Open account dialog
            </button>
            <AccountDialog open={open} mode="create" onOpenChange={setOpen} onSubmit={vi.fn()} />
        </>
    )
}

describe('AccountDialog', () => {
    it('restores focus to its opener after closing', async () => {
        const user = userEvent.setup()
        render(<ControlledAccountDialog />)

        const opener = screen.getByRole('button', { name: 'Open account dialog' })
        await user.click(opener)
        expect(screen.getByRole('dialog', { name: 'Create account' })).toBeInTheDocument()

        await user.click(screen.getByRole('button', { name: 'Close account dialog' }))

        await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())
        expect(opener).toHaveFocus()
    })

    it('does not close while a save is pending', async () => {
        const user = userEvent.setup()
        const onOpenChange = vi.fn()
        render(
            <AccountDialog
                open
                mode="create"
                isPending
                onOpenChange={onOpenChange}
                onSubmit={vi.fn()}
            />,
        )

        expect(screen.getByRole('button', { name: 'Close account dialog' })).toBeDisabled()
        await user.keyboard('{Escape}')

        expect(onOpenChange).not.toHaveBeenCalled()
        expect(screen.getByRole('dialog', { name: 'Create account' })).toBeInTheDocument()
    })
})
