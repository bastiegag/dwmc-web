import { describe, it, expect, vi } from 'vitest'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { render } from '@/test/utils/render'
import { LoginForm } from '@/features/auth/components/LoginForm'

vi.mock('@/features/auth/hooks/useLogin', () => ({
    useLogin: vi.fn(() => ({
        login: vi.fn().mockResolvedValue(undefined),
        isPending: false,
        error: null,
    })),
}))

vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom')
    return {
        ...actual,
        useNavigate: () => vi.fn(),
        useLocation: () => ({ state: null, pathname: '/login' }),
    }
})

describe('LoginForm', () => {
    it('renders email and password fields', () => {
        render(<LoginForm />)
        expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
        expect(screen.getByLabelText(/^password/i)).toBeInTheDocument()
    })

    it('renders sign in button', () => {
        render(<LoginForm />)
        expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument()
    })

    it('renders link to sign up', () => {
        render(<LoginForm />)
        expect(screen.getByRole('link', { name: /sign up/i })).toBeInTheDocument()
    })

    it('renders link to forgot password', () => {
        render(<LoginForm />)
        expect(screen.getByRole('link', { name: /forgot your password/i })).toBeInTheDocument()
    })

    it('shows validation error for invalid email', async () => {
        const user = userEvent.setup()
        render(<LoginForm />)
        await user.type(screen.getByLabelText(/email/i), 'invalid-email')
        await user.click(screen.getByRole('button', { name: /sign in/i }))
        await waitFor(() => {
            expect(screen.getByText(/please enter a valid email/i)).toBeInTheDocument()
        })
    })
})
