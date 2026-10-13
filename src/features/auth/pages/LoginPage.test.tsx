import { describe, it, expect, vi } from 'vitest'
import { screen } from '@testing-library/react'
import { render } from '@/test/utils/render'
import { LoginPage } from '@/features/auth/pages/LoginPage'

vi.mock('@/features/auth/hooks/useLogin', () => ({
    useLogin: vi.fn(() => ({ login: vi.fn(), isPending: false, error: null })),
}))

vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom')
    return {
        ...actual,
        useNavigate: () => vi.fn(),
        useLocation: () => ({ state: null, pathname: '/login' }),
    }
})

describe('LoginPage', () => {
    it('renders the card title', () => {
        render(<LoginPage />)
        expect(screen.getByText('Welcome back')).toBeInTheDocument()
    })

    it('renders the login form', () => {
        render(<LoginPage />)
        expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument()
    })

    it('has a visually-hidden h1', () => {
        render(<LoginPage />)
        expect(screen.getByRole('heading', { level: 1, name: /sign in/i })).toBeInTheDocument()
    })
})
