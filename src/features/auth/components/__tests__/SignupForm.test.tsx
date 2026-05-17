import { describe, it, expect, vi } from 'vitest'
import { render, screen, waitFor } from '@/test/utils/render'
import userEvent from '@testing-library/user-event'
import { SignupForm } from '@/features/auth/components/SignupForm'

vi.mock('@/features/auth/hooks', () => ({
    useSignup: vi.fn(() => ({
        signup: vi.fn().mockResolvedValue(undefined),
        isPending: false,
        error: null,
    })),
}))

describe('SignupForm', () => {
    it('renders email, password, and confirm-password fields', () => {
        render(<SignupForm />)
        expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
        expect(screen.getByLabelText(/^password/i)).toBeInTheDocument()
        expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument()
    })

    it('renders a "Create account" submit button', () => {
        render(<SignupForm />)
        expect(screen.getByRole('button', { name: /create account/i })).toBeInTheDocument()
    })

    it('renders a link to /login', () => {
        render(<SignupForm />)
        expect(screen.getByRole('link', { name: /sign in/i })).toBeInTheDocument()
    })

    it('shows a validation error when passwords do not match', async () => {
        const user = userEvent.setup()
        render(<SignupForm />)
        await user.type(screen.getByLabelText(/email/i), 'new@example.com')
        await user.type(screen.getByLabelText(/^password/i), 'Password123')
        await user.type(screen.getByLabelText(/confirm password/i), 'Different123')
        await user.click(screen.getByRole('button', { name: /create account/i }))
        await waitFor(() => {
            expect(screen.getByText(/passwords do not match/i)).toBeInTheDocument()
        })
    })

    it('shows a success alert after successful submission', async () => {
        const user = userEvent.setup()
        render(<SignupForm />)
        await user.type(screen.getByLabelText(/email/i), 'new@example.com')
        await user.type(screen.getByLabelText(/^password/i), 'Password123')
        await user.type(screen.getByLabelText(/confirm password/i), 'Password123')
        await user.click(screen.getByRole('button', { name: /create account/i }))
        await waitFor(() => {
            expect(screen.getByText(/account created/i)).toBeInTheDocument()
        })
    })

    it('shows loading text when isPending is true', async () => {
        const { useSignup } = await import('@/features/auth/hooks')
        vi.mocked(useSignup).mockReturnValue({
            signup: vi.fn(),
            isPending: true,
            error: null,
        })
        render(<SignupForm />)
        expect(screen.getByText(/creating account/i)).toBeInTheDocument()
    })
})
