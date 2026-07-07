import { describe, it, expect, vi } from 'vitest'
import { axe } from 'vitest-axe'
import { render, screen, waitFor } from '@/test/utils/render'
import userEvent from '@testing-library/user-event'
import { ResetPasswordForm } from '@/features/auth/components/ResetPasswordForm'

vi.mock('@/features/auth/hooks', () => ({
    useResetPassword: vi.fn(() => ({
        resetPassword: vi.fn().mockResolvedValue(undefined),
        isPending: false,
        isSuccess: false,
        error: null,
    })),
}))

describe('ResetPasswordForm', () => {
    it('renders new-password and confirm-new-password fields', () => {
        render(<ResetPasswordForm />)
        expect(screen.getByLabelText(/^new password/i)).toBeInTheDocument()
        expect(screen.getByLabelText(/confirm new password/i)).toBeInTheDocument()
    })

    it('renders an "Update password" button', () => {
        render(<ResetPasswordForm />)
        expect(screen.getByRole('button', { name: /update password/i })).toBeInTheDocument()
    })

    it('shows a validation error when passwords do not match', async () => {
        const user = userEvent.setup()
        render(<ResetPasswordForm />)
        await user.type(screen.getByLabelText(/^new password/i), 'Password123')
        await user.type(screen.getByLabelText(/confirm new password/i), 'Different123')
        await user.click(screen.getByRole('button', { name: /update password/i }))
        await waitFor(() => {
            expect(screen.getByText(/passwords do not match/i)).toBeInTheDocument()
        })
    })

    it('shows a success alert when isSuccess is true', async () => {
        const { useResetPassword } = await import('@/features/auth/hooks')
        vi.mocked(useResetPassword).mockReturnValue({
            resetPassword: vi.fn(),
            isPending: false,
            isSuccess: true,
            error: null,
        })
        render(<ResetPasswordForm />)
        expect(screen.getByText(/password updated successfully/i)).toBeInTheDocument()
    })

    it('shows loading text when isPending is true', async () => {
        const { useResetPassword } = await import('@/features/auth/hooks')
        vi.mocked(useResetPassword).mockReturnValue({
            resetPassword: vi.fn(),
            isPending: true,
            isSuccess: false,
            error: null,
        })
        render(<ResetPasswordForm />)
        expect(screen.getByText(/updating password/i)).toBeInTheDocument()
    })

    it('has no accessibility violations', async () => {
        const { container } = render(<ResetPasswordForm />)
        expect((await axe(container)).violations).toHaveLength(0)
    })

    it('marks password field as invalid and links error when validation fails', async () => {
        const { useResetPassword } = await import('@/features/auth/hooks')
        vi.mocked(useResetPassword).mockReturnValue({
            resetPassword: vi.fn(),
            isPending: false,
            isSuccess: false,
            error: null,
        })
        const user = userEvent.setup()
        render(<ResetPasswordForm />)
        await user.click(screen.getByRole('button', { name: /update password/i }))
        await waitFor(() => {
            const passwordInput = screen.getByLabelText(/^new password/i)
            expect(passwordInput).toHaveAttribute('aria-invalid', 'true')
            expect(passwordInput).toHaveAttribute('aria-describedby', 'password-error')
        })
    })
})
