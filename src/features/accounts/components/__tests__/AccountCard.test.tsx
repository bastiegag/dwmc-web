import { describe, expect, it, vi } from 'vitest'
import userEvent from '@testing-library/user-event'
import { render, screen } from '@/test/utils/render'
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
        expect(screen.getByRole('progressbar')).toBeInTheDocument()
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

    it('confirms archiving and calls the archive callback', async () => {
        const user = userEvent.setup()
        const onArchive = vi.fn().mockResolvedValue(undefined)
        const account = createAccount()

        render(<AccountCard account={account} onEdit={vi.fn()} onArchive={onArchive} />)
        await user.click(screen.getByRole('button', { name: `Archive ${account.name}` }))
        await user.click(screen.getByRole('alertdialog').querySelector('button:last-child')!)

        expect(onArchive).toHaveBeenCalledWith(account)
        expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument()
    })
})
