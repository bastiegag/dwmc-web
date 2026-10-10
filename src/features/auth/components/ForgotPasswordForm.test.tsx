import { describe, it, expect, vi, beforeEach } from 'vitest'
import { axe } from 'vitest-axe'
import { render, screen, waitFor } from '@/test/utils/render'
import userEvent from '@testing-library/user-event'
import { ForgotPasswordForm } from '@/features/auth/components/ForgotPasswordForm'
import { useForgotPassword } from '@/features/auth/hooks'

vi.mock('@/features/auth/hooks', () => ({
    useForgotPassword: vi.fn(),
}))

describe('ForgotPasswordForm', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        vi.mocked(useForgotPassword).mockReturnValue({
            forgotPassword: vi.fn().mockResolvedValue(undefined),
            isPending: false,
            isSuccess: false,
            error: null,
        })
    })

    it('renders email field and send-reset-link button', () => {
        render(<ForgotPasswordForm />)
        expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
        expect(screen.getByRole('button', { name: /send reset link/i })).toBeInTheDocument()
    })

    it('renders a link back to sign in', () => {
        render(<ForgotPasswordForm />)
        expect(screen.getByRole('link', { name: /sign in/i })).toBeInTheDocument()
    })

    it('shows a validation error for an invalid email', async () => {
        const user = userEvent.setup()
        render(<ForgotPasswordForm />)
        await user.type(screen.getByLabelText(/email/i), 'not-an-email')
        await user.click(screen.getByRole('button', { name: /send reset link/i }))
        await waitFor(() => {
            const emailInput = screen.getByLabelText(/email/i)
            expect(screen.getByText(/valid email/i)).toBeInTheDocument()
            expect(emailInput).toHaveFocus()
        })
    })

    it('shows a success alert when isSuccess is true', () => {
        vi.mocked(useForgotPassword).mockReturnValue({
            forgotPassword: vi.fn(),
            isPending: false,
            isSuccess: true,
            error: null,
        })
        render(<ForgotPasswordForm />)
        expect(screen.getByRole('status')).toHaveFocus()
        expect(screen.getByText(/password reset link sent/i)).toBeInTheDocument()
    })

    it('shows loading text when isPending is true', async () => {
        vi.mocked(useForgotPassword).mockReturnValue({
            forgotPassword: vi.fn(),
            isPending: true,
            isSuccess: false,
            error: null,
        })
        render(<ForgotPasswordForm />)
        expect(screen.getByText(/sending reset link/i)).toBeInTheDocument()
    })

    it('has no accessibility violations', async () => {
        const { container } = render(<ForgotPasswordForm />)
        expect((await axe(container)).violations).toHaveLength(0)
    })

    it('success state has no accessibility violations', async () => {
        vi.mocked(useForgotPassword).mockReturnValue({
            forgotPassword: vi.fn(),
            isPending: false,
            isSuccess: true,
            error: null,
        })
        const { container } = render(<ForgotPasswordForm />)
        expect((await axe(container)).violations).toHaveLength(0)
    })
})
