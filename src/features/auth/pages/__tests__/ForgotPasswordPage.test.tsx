import { describe, it, expect, vi } from 'vitest'
import { screen } from '@testing-library/react'
import { render } from '@/test/utils/render'
import { ForgotPasswordPage } from '@/features/auth/pages/ForgotPasswordPage'

vi.mock('@/features/auth/hooks/use-forgot-password', () => ({
    useForgotPassword: vi.fn(() => ({
        forgotPassword: vi.fn(),
        isPending: false,
        isSuccess: false,
        error: null,
    })),
}))

vi.mock('sonner', () => ({
    toast: Object.assign(vi.fn(), { success: vi.fn(), error: vi.fn() }),
}))

describe('ForgotPasswordPage', () => {
    it('renders the card title', () => {
        render(<ForgotPasswordPage />)
        expect(screen.getByText('Forgot password?')).toBeInTheDocument()
    })

    it('renders the forgot password form', () => {
        render(<ForgotPasswordPage />)
        expect(screen.getByRole('button', { name: /send reset link/i })).toBeInTheDocument()
    })

    it('has a visually-hidden h1', () => {
        render(<ForgotPasswordPage />)
        expect(
            screen.getByRole('heading', { level: 1, name: /reset password/i }),
        ).toBeInTheDocument()
    })
})
