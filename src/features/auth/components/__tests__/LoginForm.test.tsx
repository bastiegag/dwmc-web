import { describe, it, expect, vi, beforeEach } from 'vitest'
import { axe } from 'vitest-axe'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { render } from '@/test/utils/render'
import { LoginForm } from '@/features/auth/components/LoginForm'
import { useLogin } from '@/features/auth/hooks'

const { locationState, navigateMock } = vi.hoisted(() => ({
    locationState: { current: null as unknown },
    navigateMock: vi.fn(),
}))

vi.mock('@/features/auth/hooks/use-login', () => ({
    useLogin: vi.fn(),
}))

vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom')
    return {
        ...actual,
        useNavigate: () => navigateMock,
        useLocation: () => ({ state: locationState.current, pathname: '/login' }),
    }
})

beforeEach(() => {
    vi.clearAllMocks()
    locationState.current = null
    vi.mocked(useLogin).mockReturnValue({
        login: vi.fn().mockResolvedValue(undefined),
        isPending: false,
        error: null,
    })
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

    it('has no accessibility violations', async () => {
        const { container } = render(<LoginForm />)
        expect((await axe(container)).violations).toHaveLength(0)
    })

    it('links validation error to the email field via aria attributes', async () => {
        const user = userEvent.setup()
        render(<LoginForm />)
        await user.click(screen.getByRole('button', { name: /sign in/i }))
        await waitFor(() => {
            const emailInput = screen.getByLabelText(/email/i)
            expect(emailInput).toHaveAttribute('aria-invalid', 'true')
            expect(emailInput).toHaveAttribute('aria-describedby', 'email-error')
        })
    })

    it('shows the login error returned by the auth service', async () => {
        const user = userEvent.setup()
        vi.mocked(useLogin).mockReturnValue({
            login: vi.fn().mockRejectedValue(new Error('Invalid credentials')),
            isPending: false,
            error: null,
        })

        render(<LoginForm />)
        await user.type(screen.getByLabelText(/email/i), 'test@example.com')
        await user.type(screen.getByLabelText(/^password/i), 'Password123')
        await user.click(screen.getByRole('button', { name: /sign in/i }))

        expect(await screen.findByRole('alert')).toHaveTextContent('Invalid credentials')
    })

    it('redirects to a string return location after login', async () => {
        const user = userEvent.setup()
        locationState.current = { from: '/transactions?month=2026-06' }

        render(<LoginForm />)
        await user.type(screen.getByLabelText(/email/i), 'test@example.com')
        await user.type(screen.getByLabelText(/^password/i), 'Password123')
        await user.click(screen.getByRole('button', { name: /sign in/i }))

        expect(navigateMock).toHaveBeenCalledWith('/transactions?month=2026-06', { replace: true })
    })

    it('reconstructs a structured return location after login', async () => {
        const user = userEvent.setup()
        locationState.current = {
            from: { pathname: '/accounts', search: '?archived=true', hash: '#list' },
        }

        render(<LoginForm />)
        await user.type(screen.getByLabelText(/email/i), 'test@example.com')
        await user.type(screen.getByLabelText(/^password/i), 'Password123')
        await user.click(screen.getByRole('button', { name: /sign in/i }))

        expect(navigateMock).toHaveBeenCalledWith('/accounts?archived=true#list', { replace: true })
    })

    it('submit button is disabled with loading label while pending', async () => {
        vi.mocked(useLogin).mockReturnValue({ login: vi.fn(), isPending: true, error: null })
        render(<LoginForm />)
        expect(screen.getByRole('button', { name: /signing in/i })).toBeDisabled()
    })
})
