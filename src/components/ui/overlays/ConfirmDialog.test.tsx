import { useState } from 'react'
import { describe, expect, it, vi } from 'vitest'
import userEvent from '@testing-library/user-event'
import { render, screen, waitFor, within } from '@/test/utils/render'
import { ConfirmDialog } from './ConfirmDialog'

const renderConfirmDialog = (
    onConfirm: () => Promise<void> | void = vi.fn(),
    initiallyOpen = false,
    errorFallback?: string,
) => {
    const Harness = () => {
        const [open, setOpen] = useState(initiallyOpen)

        return (
            <>
                <button type="button" onClick={() => setOpen(true)}>
                    Open confirmation
                </button>
                <ConfirmDialog
                    open={open}
                    onOpenChange={setOpen}
                    title="Archive account?"
                    description={
                        <>
                            This will archive <strong>Daily checking</strong>.
                        </>
                    }
                    confirmLabel="Archive"
                    pendingLabel="Archiving..."
                    errorFallback={errorFallback}
                    variant="destructive"
                    onConfirm={onConfirm}
                />
            </>
        )
    }

    render(<Harness />)
    return screen.getByRole('button', { name: 'Open confirmation' })
}

const openDialog = async (user: ReturnType<typeof userEvent.setup>, trigger: HTMLElement) => {
    await user.click(trigger)
    return screen.findByRole('alertdialog')
}

const createDeferred = () => {
    let resolve: (() => void) | undefined
    const promise = new Promise<void>((complete) => {
        resolve = complete
    })
    return { promise, resolve: () => resolve?.() }
}

describe('ConfirmDialog', () => {
    it('opens with an accessible title and description', async () => {
        const user = userEvent.setup()
        const trigger = renderConfirmDialog()
        const dialog = await openDialog(user, trigger)

        expect(dialog).toHaveAccessibleName('Archive account?')
        expect(dialog).toHaveAccessibleDescription('This will archive Daily checking.')
    })

    it('closes on cancel and restores focus to the opener', async () => {
        const user = userEvent.setup()
        const trigger = renderConfirmDialog()
        const dialog = await openDialog(user, trigger)

        await user.click(within(dialog).getByRole('button', { name: 'Cancel' }))

        await waitFor(() => expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument())
        expect(trigger).toHaveFocus()
    })

    it('runs confirmation once and closes after success', async () => {
        const user = userEvent.setup()
        const onConfirm = vi.fn()
        const trigger = renderConfirmDialog(onConfirm)
        const dialog = await openDialog(user, trigger)

        await user.click(within(dialog).getByRole('button', { name: 'Archive' }))

        await waitFor(() => expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument())
        expect(onConfirm).toHaveBeenCalledTimes(1)
        expect(trigger).toHaveFocus()
    })

    it('closes after an asynchronous confirmation succeeds', async () => {
        const user = userEvent.setup()
        const deferred = createDeferred()
        const onConfirm = vi.fn(() => deferred.promise)
        const trigger = renderConfirmDialog(onConfirm)
        const dialog = await openDialog(user, trigger)

        await user.click(within(dialog).getByRole('button', { name: 'Archive' }))
        expect(within(dialog).getByRole('button', { name: 'Archiving...' })).toBeDisabled()

        deferred.resolve()
        await waitFor(() => expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument())
        expect(onConfirm).toHaveBeenCalledTimes(1)
    })

    it('keeps the dialog open and announces confirmation failures', async () => {
        const user = userEvent.setup()
        const onConfirm = vi.fn().mockRejectedValue(new Error('Archive unavailable'))
        const trigger = renderConfirmDialog(onConfirm)
        const dialog = await openDialog(user, trigger)

        await user.click(within(dialog).getByRole('button', { name: 'Archive' }))

        expect(await within(dialog).findByRole('alert')).toHaveTextContent('Archive unavailable')
        expect(dialog).toBeInTheDocument()
        expect(within(dialog).getByRole('button', { name: 'Archive' })).toBeEnabled()
    })

    it('uses the supplied fallback for errors without a message', async () => {
        const user = userEvent.setup()
        const onConfirm = vi.fn().mockRejectedValue({})
        const trigger = renderConfirmDialog(
            onConfirm,
            false,
            'Unable to archive this account. Please try again.',
        )
        const dialog = await openDialog(user, trigger)

        await user.click(within(dialog).getByRole('button', { name: 'Archive' }))

        expect(await within(dialog).findByRole('alert')).toHaveTextContent(
            'Unable to archive this account. Please try again.',
        )
    })

    it('prevents duplicate confirmations and dismissal while pending', async () => {
        const user = userEvent.setup()
        const deferred = createDeferred()
        const onConfirm = vi.fn(() => deferred.promise)
        const trigger = renderConfirmDialog(onConfirm)
        const dialog = await openDialog(user, trigger)
        const confirm = within(dialog).getByRole('button', { name: 'Archive' })
        const cancel = within(dialog).getByRole('button', { name: 'Cancel' })

        await user.click(confirm)

        const pendingConfirm = within(dialog).getByRole('button', { name: 'Archiving...' })
        expect(pendingConfirm).toBeDisabled()
        expect(cancel).toBeDisabled()

        await user.click(pendingConfirm)
        await user.click(cancel)
        await user.keyboard('{Escape}')
        await user.click(document.body)

        expect(screen.getByRole('alertdialog')).toBeInTheDocument()
        expect(onConfirm).toHaveBeenCalledTimes(1)

        deferred.resolve()
        await waitFor(() => expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument())
    })

    it('clears a previous error when the dialog is reopened', async () => {
        const user = userEvent.setup()
        const onConfirm = vi
            .fn()
            .mockRejectedValueOnce(new Error('Archive unavailable'))
            .mockResolvedValue(undefined)
        const trigger = renderConfirmDialog(onConfirm)
        const dialog = await openDialog(user, trigger)

        await user.click(within(dialog).getByRole('button', { name: 'Archive' }))
        expect(await within(dialog).findByRole('alert')).toHaveTextContent('Archive unavailable')
        await user.click(within(dialog).getByRole('button', { name: 'Cancel' }))
        await waitFor(() => expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument())

        await openDialog(user, trigger)
        expect(screen.queryByRole('alert')).not.toBeInTheDocument()
    })
})
