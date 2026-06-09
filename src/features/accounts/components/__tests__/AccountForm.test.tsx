import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@/test/utils/render'
import userEvent from '@testing-library/user-event'
import { AccountForm } from '@/features/accounts/components/AccountForm'

describe('AccountForm', () => {
    it('validates required fields', async () => {
        const onSubmit = vi.fn()
        render(<AccountForm submitLabel="Create" onSubmit={onSubmit} />)

        const user = userEvent.setup()
        await user.click(screen.getByRole('button', { name: /create/i }))

        // name is required; color and icon have defaults in the form so only name is required by default
        expect(await screen.findByText(/Account name is required/i)).toBeInTheDocument()
    })

    it('allows negative starting balance and empty goal', async () => {
        const onSubmit = vi.fn()
        render(<AccountForm submitLabel="Create" onSubmit={onSubmit} />)

        const user = userEvent.setup()
        await user.type(screen.getByLabelText(/Account name/i), 'Card')
        await user.type(screen.getByLabelText(/Starting balance/i), '-850')
        // leave goal empty
        await user.type(screen.getByLabelText(/Icon/i), 'credit-card')
        await user.click(screen.getByRole('button', { name: /create/i }))

        expect(onSubmit).toHaveBeenCalled()
    })
})
