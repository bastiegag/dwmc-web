import { describe, it, expect, vi } from 'vitest'
import { screen } from '@testing-library/react'
import { render } from '@/test/utils/render'
import { SignupPage } from '@/features/auth/pages/SignupPage'

vi.mock('@/features/auth/hooks/use-signup', () => ({
    useSignup: vi.fn(() => ({ signup: vi.fn(), isPending: false, isSuccess: false, error: null })),
}))

vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom')
    return { ...actual, useNavigate: () => vi.fn() }
})

vi.mock('sonner', () => ({
    toast: Object.assign(vi.fn(), { success: vi.fn(), error: vi.fn() }),
}))

describe('SignupPage', () => {
    it('renders the card title', () => {
        render(<SignupPage />)
        expect(screen.getByText('Create an account')).toBeInTheDocument()
    })

    it('renders the signup form', () => {
        render(<SignupPage />)
        expect(screen.getByRole('button', { name: /create account/i })).toBeInTheDocument()
    })

    it('has a visually-hidden h1', () => {
        render(<SignupPage />)
        expect(
            screen.getByRole('heading', { level: 1, name: /create account/i }),
        ).toBeInTheDocument()
    })
})
