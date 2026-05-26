import { describe, it, expect, vi } from 'vitest'
import { axe } from 'vitest-axe'
import { render, screen, waitFor } from '@/test/utils/render'
import userEvent from '@testing-library/user-event'
import { SignupForm } from '@/features/auth/components/SignupForm'

vi.mock('@/features/auth/hooks', () => ({
    useSignup: vi.fn(() => ({
        signup: vi.fn().mockResolvedValue(undefined),
        isPending: false,
        isSuccess: false,
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
        const { useSignup } = await import('@/features/auth/hooks')
        const signup = vi.fn().mockImplementation(async () => {
            vi.mocked(useSignup).mockReturnValue({
                signup,
                isPending: false,
                isSuccess: true,
                error: null,
            })
        })
        vi.mocked(useSignup).mockReturnValue({
            signup,
            isPending: false,
            isSuccess: false,
            error: null,
        })
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
            isSuccess: false,
            error: null,
        })
        render(<SignupForm />)
        expect(screen.getByText(/creating account/i)).toBeInTheDocument()
    })

    it('has no accessibility violations', async () => {
        const { container } = render(<SignupForm />)
        expect(await axe(container)).toHaveNoViolations()
    })

    it('links email validation error to the field via aria attributes', async () => {
        const { useSignup } = await import('@/features/auth/hooks')
        vi.mocked(useSignup).mockReturnValue({
            signup: vi.fn().mockResolvedValue(undefined),
            isPending: false,
            isSuccess: false,
            error: null,
        })
        const user = userEvent.setup()
        render(<SignupForm />)
        await user.click(screen.getByRole('button', { name: /create account/i }))
        await waitFor(() => {
            const emailInput = screen.getByLabelText(/email/i)
            expect(emailInput).toHaveAttribute('aria-invalid', 'true')
            expect(emailInput).toHaveAttribute('aria-describedby', 'email-error')
        })
    })

    it('server error renders as an accessible alert', async () => {
        const { useSignup } = await import('@/features/auth/hooks')
        vi.mocked(useSignup).mockReturnValue({
            signup: vi.fn().mockRejectedValue(new Error('User already registered')),
            isPending: false,
            isSuccess: false,
            error: null,
        })
        const user = userEvent.setup()
        render(<SignupForm />)
        await user.type(screen.getByLabelText(/email/i), 'existing@example.com')
        await user.type(screen.getByLabelText(/^password/i), 'Password123')
        await user.type(screen.getByLabelText(/confirm password/i), 'Password123')
        await user.click(screen.getByRole('button', { name: /create account/i }))
        await waitFor(() => {
            const alert = screen.getByRole('alert')
            expect(alert).toBeInTheDocument()
            expect(alert).toHaveTextContent(/user already registered/i)
        })
    })
})
