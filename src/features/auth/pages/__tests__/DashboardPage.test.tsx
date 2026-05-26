import { describe, it, expect, vi } from 'vitest'
import { screen } from '@testing-library/react'
import { render } from '@/test/utils/render'
import { DashboardPage } from '@/features/auth/pages/DashboardPage'

vi.mock('@/features/auth/hooks', () => ({
    useAuth: vi.fn(() => ({ user: null, session: null, isLoading: false, isAuthenticated: false })),
}))

describe('DashboardPage (unauthenticated)', () => {
    it('renders the dashboard heading', () => {
        render(<DashboardPage />)
        expect(screen.getByRole('heading', { name: /dashboard/i, level: 1 })).toBeInTheDocument()
    })

    it('shows a fallback greeting when user is null', () => {
        render(<DashboardPage />)
        expect(screen.getByText(/welcome back, there!/i)).toBeInTheDocument()
    })

    it('renders the coming-soon card', () => {
        render(<DashboardPage />)
        expect(screen.getByText(/transaction tracking/i)).toBeInTheDocument()
    })
})

describe('DashboardPage (authenticated)', () => {
    it('shows the user email in the greeting', async () => {
        const { useAuth } = await import('@/features/auth/hooks')
        vi.mocked(useAuth).mockReturnValue({
            user: { email: 'alice@example.com' } as never,
            session: null,
            isLoading: false,
            isAuthenticated: true,
        })
        render(<DashboardPage />)
        expect(screen.getByText(/welcome back, alice@example\.com!/i)).toBeInTheDocument()
    })
})
