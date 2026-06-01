import { describe, it, expect, vi } from 'vitest'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { render } from '@/test/utils/render'
import { AppLayout } from '@/app/layouts/AppLayout'

const mockNavigate = vi.fn()
const mockLogout = vi.fn()

vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom')
    return { ...actual, useNavigate: () => mockNavigate }
})

vi.mock('@/features/auth/hooks/useLogout', () => ({
    useLogout: vi.fn(() => ({ logout: mockLogout, isPending: false })),
}))

vi.mock('sonner', () => ({
    toast: Object.assign(vi.fn(), { success: vi.fn(), error: vi.fn() }),
}))

vi.mock('@/components/layout/ThemeToggle', () => ({
    ThemeToggle: () => null,
}))

describe('AppLayout', () => {
    it('renders the navigation', () => {
        render(<AppLayout />)
        expect(screen.getByRole('navigation', { name: /main navigation/i })).toBeInTheDocument()
        expect(screen.getByRole('link', { name: /categories/i })).toBeInTheDocument()
    })

    it('calls logout and redirects to /login when Sign out is clicked', async () => {
        mockLogout.mockResolvedValueOnce(undefined)
        const user = userEvent.setup()
        render(<AppLayout />)
        await user.click(screen.getByRole('button', { name: /sign out/i }))
        await waitFor(() => {
            expect(mockLogout).toHaveBeenCalledOnce()
            expect(mockNavigate).toHaveBeenCalledWith('/login')
        })
    })

    it('disables the Sign out button while logging out', async () => {
        const { useLogout } = await import('@/features/auth/hooks/useLogout')
        vi.mocked(useLogout).mockReturnValue({ logout: mockLogout, isPending: true })
        render(<AppLayout />)
        expect(screen.getByRole('button', { name: /signing out/i })).toBeDisabled()
    })
})
