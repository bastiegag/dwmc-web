import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@/test/utils/render'
import { ResetPasswordPage } from '@/features/auth/pages/ResetPasswordPage'

vi.mock('@/features/auth/hooks', () => ({
    usePasswordRecovery: vi.fn(),
    useResetPassword: vi.fn(() => ({
        resetPassword: vi.fn(),
        isPending: false,
        isSuccess: false,
        error: null,
    })),
}))

async function mockRecovery(state: { isLoading: boolean; isValid: boolean }) {
    const { usePasswordRecovery } = await import('@/features/auth/hooks')
    vi.mocked(usePasswordRecovery).mockReturnValue(state)
}

describe('ResetPasswordPage', () => {
    it('shows a loading spinner while the recovery session is being verified', async () => {
        await mockRecovery({ isLoading: true, isValid: false })
        render(<ResetPasswordPage />)
        expect(screen.getByRole('status', { name: /verifying reset link/i })).toBeInTheDocument()
        expect(screen.queryByText(/reset your password/i)).not.toBeInTheDocument()
    })

    it('renders the reset password form for a valid recovery session', async () => {
        await mockRecovery({ isLoading: false, isValid: true })
        render(<ResetPasswordPage />)
        expect(screen.getByRole('heading', { name: /reset your password/i })).toBeInTheDocument()
        expect(screen.getByRole('button', { name: /update password/i })).toBeInTheDocument()
    })

    it('shows an invalid-link message for direct navigation without a token', async () => {
        await mockRecovery({ isLoading: false, isValid: false })
        render(<ResetPasswordPage />)
        expect(
            screen.getByRole('heading', { name: /link expired or invalid/i }),
        ).toBeInTheDocument()
        expect(screen.getByRole('link', { name: /request a new password reset/i })).toHaveAttribute(
            'href',
            '/forgot-password',
        )
        expect(screen.queryByRole('button', { name: /update password/i })).not.toBeInTheDocument()
    })
})
