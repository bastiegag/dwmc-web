import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@/test/utils/render'
import { Routes, Route } from 'react-router-dom'
import { ProtectedRoute } from '@/features/auth/routes/ProtectedRoute'

vi.mock('@/features/auth/hooks', () => ({
    useAuth: vi.fn(() => ({ isAuthenticated: false, isLoading: false, user: null, session: null })),
}))

function renderWithRoutes(initialEntries = ['/app']) {
    return render(
        <Routes>
            <Route element={<ProtectedRoute />}>
                <Route path="/app" element={<div>Protected content</div>} />
            </Route>
            <Route path="/login" element={<div>Login page</div>} />
        </Routes>,
        { initialEntries },
    )
}

describe('ProtectedRoute', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('redirects to /login when not authenticated', async () => {
        const { useAuth } = await import('@/features/auth/hooks')
        vi.mocked(useAuth).mockReturnValue({
            isAuthenticated: false,
            isLoading: false,
            user: null,
            session: null,
        })
        renderWithRoutes()
        expect(screen.getByText('Login page')).toBeInTheDocument()
        expect(screen.queryByText('Protected content')).not.toBeInTheDocument()
    })

    it('renders outlet content when authenticated', async () => {
        const { useAuth } = await import('@/features/auth/hooks')
        vi.mocked(useAuth).mockReturnValue({
            isAuthenticated: true,
            isLoading: false,
            user: { id: 'mock-user-id', email: 'test@example.com' } as never,
            session: {} as never,
        })
        renderWithRoutes()
        expect(screen.getByText('Protected content')).toBeInTheDocument()
        expect(screen.queryByText('Login page')).not.toBeInTheDocument()
    })

    it('shows a loading spinner when isLoading is true', async () => {
        const { useAuth } = await import('@/features/auth/hooks')
        vi.mocked(useAuth).mockReturnValue({
            isAuthenticated: false,
            isLoading: true,
            user: null,
            session: null,
        })
        renderWithRoutes()
        expect(screen.getByRole('status')).toBeInTheDocument()
        expect(screen.queryByText('Protected content')).not.toBeInTheDocument()
        expect(screen.queryByText('Login page')).not.toBeInTheDocument()
    })
})
