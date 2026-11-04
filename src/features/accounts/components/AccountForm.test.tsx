import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@/test/utils/render'
import userEvent from '@testing-library/user-event'
import { AccountForm } from '@/features/accounts/components/AccountForm'
import { accountFormSchema } from '@/features/accounts/schemas/account.schema'

describe('AccountForm', () => {
    it('validates required fields', async () => {
        const onSubmit = vi.fn()
        render(<AccountForm submitLabel="Create" onSubmit={onSubmit} />)

        const user = userEvent.setup()
        await user.click(screen.getByRole('button', { name: /create/i }))

        // name is required; color and icon have defaults in the form so only name is required by default
        expect(await screen.findByText(/Account name is required/i)).toBeInTheDocument()
    })

    it('allows negative starting balance and empty savings goal', () => {
        expect(
            accountFormSchema.safeParse({
                name: 'Card',
                type: 'CREDIT_CARD',
                startingBalance: -850,
                goal: null,
                color: '#3b82f6',
                icon: 'credit-card',
            }).success,
        ).toBe(true)
    })

    it('shows and accepts a positive goal for savings accounts', async () => {
        const onSubmit = vi.fn()
        render(<AccountForm submitLabel="Create" onSubmit={onSubmit} />)

        const user = userEvent.setup()
        await user.type(screen.getByLabelText(/Account name/i), 'Emergency Fund')
        await user.selectOptions(screen.getByLabelText('Type'), 'SAVINGS')
        await user.type(screen.getByLabelText(/Savings goal/i), '10000')
        await user.click(screen.getByRole('button', { name: /create/i }))

        expect(onSubmit).toHaveBeenCalledWith(
            expect.objectContaining({ type: 'SAVINGS', goal: 10000 }),
        )
    })
})
