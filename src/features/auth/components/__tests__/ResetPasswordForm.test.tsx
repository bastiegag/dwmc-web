import { describe, it, expect, vi } from 'vitest'
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
        const { container } = render(<ResetPasswordForm />)
        expect(container.querySelector('input[name="password"]')).toBeInTheDocument()
        expect(container.querySelector('input[name="confirmPassword"]')).toBeInTheDocument()
    })

    it('renders an "Update password" button', () => {
        render(<ResetPasswordForm />)
        expect(screen.getByRole('button', { name: /update password/i })).toBeInTheDocument()
    })

    it('shows a validation error when passwords do not match', async () => {
        const user = userEvent.setup()
        const { container } = render(<ResetPasswordForm />)
        const passwordInput = container.querySelector('input[name="password"]')!
        const confirmInput = container.querySelector('input[name="confirmPassword"]')!
        await user.type(passwordInput, 'Password123')
        await user.type(confirmInput, 'Different123')
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
})
