import { describe, expect, it, vi } from 'vitest'
import userEvent from '@testing-library/user-event'
import { render, screen, waitFor, within } from '@/test/utils/render'
import AccountCard from '@/features/accounts/components/AccountCard'
import { createAccount } from '@/test/fixtures/domain'

describe('AccountCard', () => {
    it('renders a savings goal with clamped progress and supports editing', async () => {
        const user = userEvent.setup()
        const onEdit = vi.fn()
        const account = createAccount({
            type: 'SAVINGS',
            goal: 100,
            currentBalance: 150,
        })

        render(<AccountCard account={account} onEdit={onEdit} onArchive={vi.fn()} />)

        expect(screen.getByText(/savings goal/i)).toHaveTextContent('100,00')
        expect(
            screen.getByRole('progressbar', {
                name: `Progress toward savings goal for ${account.name}`,
            }),
        ).toHaveAttribute('aria-valuetext', '100% complete')
        expect(screen.getByRole('progressbar').firstElementChild).toHaveStyle({
            transform: 'translateX(-0%)',
        })
        await user.click(screen.getByRole('button', { name: `Edit ${account.name}` }))
        expect(onEdit).toHaveBeenCalledWith(account)
    })

    it('uses fallback icon and hides invalid or non-savings goals', () => {
        const account = createAccount({ icon: 'unknown-icon', goal: 0 })

        const { container } = render(
            <AccountCard account={account} onEdit={vi.fn()} onArchive={vi.fn()} />,
        )

        expect(screen.queryByText(/savings goal/i)).not.toBeInTheDocument()
        expect(container.querySelector('.lucide-wallet')).toBeInTheDocument()
    })

    it('formats zero, negative, and large balances and wraps long account names', () => {
        const account = createAccount({
            name: 'A very long account name for responsive layout validation',
            currentBalance: -1234567.89,
        })
        const zeroAccount = createAccount({ name: 'Zero balance', currentBalance: 0 })

        render(
            <>
                <AccountCard account={account} onEdit={vi.fn()} onArchive={vi.fn()} />
                <AccountCard account={zeroAccount} onEdit={vi.fn()} onArchive={vi.fn()} />
            </>,
        )

        expect(
            screen.getByRole('heading', {
                name: 'A very long account name for responsive layout validation',
            }),
        ).toBeInTheDocument()
        expect(screen.getByText(/-1\s*234\s*567,89/)).toBeInTheDocument()
        expect(screen.getByText(/0,00/)).toBeInTheDocument()
    })

    it('confirms archiving and calls the archive callback', async () => {
        const user = userEvent.setup()
        const onArchive = vi.fn().mockResolvedValue(undefined)
        const account = createAccount()

        render(<AccountCard account={account} onEdit={vi.fn()} onArchive={onArchive} />)
        await user.click(screen.getByRole('button', { name: `Archive ${account.name}` }))
        const dialog = await screen.findByRole('alertdialog')
        await user.click(within(dialog).getByRole('button', { name: /^Archive$/ }))

        expect(onArchive).toHaveBeenCalledWith(account)
        expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument()
    })

    it('keeps the confirmation open after a failed archive', async () => {
        const user = userEvent.setup()
        const account = createAccount()
        const onArchive = vi.fn().mockRejectedValue(new Error('Archive unavailable'))

        render(<AccountCard account={account} onEdit={vi.fn()} onArchive={onArchive} />)
        await user.click(screen.getByRole('button', { name: `Archive ${account.name}` }))
        const dialog = await screen.findByRole('alertdialog')
        await user.click(within(dialog).getByRole('button', { name: /^Archive$/ }))

        expect(await within(dialog).findByRole('alert')).toHaveTextContent('Archive unavailable')
        expect(screen.getByRole('alertdialog')).toBeInTheDocument()
    })

    it('prevents a second archive request while one is pending and restores focus on success', async () => {
        const user = userEvent.setup()
        const account = createAccount()
        let finishArchive: (() => void) | undefined
        const onArchive = vi.fn(
            () =>
                new Promise<void>((resolve) => {
                    finishArchive = resolve
                }),
        )

        render(<AccountCard account={account} onEdit={vi.fn()} onArchive={onArchive} />)
        const archiveTrigger = screen.getByRole('button', { name: `Archive ${account.name}` })
        await user.click(archiveTrigger)
        const dialog = await screen.findByRole('alertdialog')
        const confirm = within(dialog).getByRole('button', { name: /^Archive$/ })
        await user.click(confirm)

        expect(onArchive).toHaveBeenCalledTimes(1)
        expect(confirm).toBeDisabled()
        expect(within(dialog).getByRole('button', { name: 'Cancel' })).toBeDisabled()
        finishArchive?.()

        await waitFor(() => expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument())
        expect(archiveTrigger).toHaveFocus()
    })

    it('prevents Escape from dismissing an archive request while pending', async () => {
        const user = userEvent.setup()
        const account = createAccount()
        let finishArchive: (() => void) | undefined
        const onArchive = vi.fn(
            () =>
                new Promise<void>((resolve) => {
                    finishArchive = resolve
                }),
        )

        render(<AccountCard account={account} onEdit={vi.fn()} onArchive={onArchive} />)
        await user.click(screen.getByRole('button', { name: `Archive ${account.name}` }))
        const dialog = await screen.findByRole('alertdialog')
        await user.click(within(dialog).getByRole('button', { name: /^Archive$/ }))
        await user.keyboard('{Escape}')

        expect(screen.getByRole('alertdialog')).toBeInTheDocument()
        expect(onArchive).toHaveBeenCalledTimes(1)
        finishArchive?.()
        await waitFor(() => expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument())
    })

    it('prevents outside clicks from dismissing an archive request while pending', async () => {
        const user = userEvent.setup()
        const account = createAccount()
        let finishArchive: (() => void) | undefined
        const onArchive = vi.fn(
            () =>
                new Promise<void>((resolve) => {
                    finishArchive = resolve
                }),
        )

        render(<AccountCard account={account} onEdit={vi.fn()} onArchive={onArchive} />)
        await user.click(screen.getByRole('button', { name: `Archive ${account.name}` }))
        const dialog = await screen.findByRole('alertdialog')
        await user.click(within(dialog).getByRole('button', { name: /^Archive$/ }))
        await user.click(document.body)

        expect(screen.getByRole('alertdialog')).toBeInTheDocument()
        expect(onArchive).toHaveBeenCalledTimes(1)
        finishArchive?.()
        await waitFor(() => expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument())
    })
})
