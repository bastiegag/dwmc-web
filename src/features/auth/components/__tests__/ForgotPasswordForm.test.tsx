import { describe, it, expect, vi } from 'vitest'
import { render, screen, waitFor } from '@/test/utils/render'
import userEvent from '@testing-library/user-event'
import { ForgotPasswordForm } from '@/features/auth/components/ForgotPasswordForm'

vi.mock('@/features/auth/hooks', () => ({
    useForgotPassword: vi.fn(() => ({
        forgotPassword: vi.fn().mockResolvedValue(undefined),
        isPending: false,
        isSuccess: false,
        error: null,
    })),
}))

describe('ForgotPasswordForm', () => {
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
            expect(screen.getByText(/valid email/i)).toBeInTheDocument()
        })
    })

    it('shows a success alert when isSuccess is true', async () => {
        const { useForgotPassword } = await import('@/features/auth/hooks')
        vi.mocked(useForgotPassword).mockReturnValue({
            forgotPassword: vi.fn(),
            isPending: false,
            isSuccess: true,
            error: null,
        })
        render(<ForgotPasswordForm />)
        expect(screen.getByText(/password reset link sent/i)).toBeInTheDocument()
    })

    it('shows loading text when isPending is true', async () => {
        const { useForgotPassword } = await import('@/features/auth/hooks')
        vi.mocked(useForgotPassword).mockReturnValue({
            forgotPassword: vi.fn(),
            isPending: true,
            isSuccess: false,
            error: null,
        })
        render(<ForgotPasswordForm />)
        expect(screen.getByText(/sending reset link/i)).toBeInTheDocument()
    })
})
