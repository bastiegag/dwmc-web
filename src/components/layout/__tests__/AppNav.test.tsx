import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@/test/utils/render'
import userEvent from '@testing-library/user-event'
import { ThemeProvider } from '@/components/layout/ThemeProvider'
import { AppNav } from '@/components/layout/AppNav'

// jsdom does not implement window.matchMedia; provide a minimal stub
Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation((query: string) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
    })),
})

const mockLogout = vi.fn()
const mockNavigate = vi.fn()

vi.mock('@/features/auth/hooks/useLogout', () => ({
    useLogout: vi.fn(() => ({ logout: mockLogout, isPending: false })),
}))

vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom')
    return {
        ...actual,
        useNavigate: () => mockNavigate,
    }
})

function renderNav() {
    return render(
        <ThemeProvider storageKey="test-theme">
            <AppNav />
        </ThemeProvider>,
    )
}

describe('AppNav', () => {
    beforeEach(async () => {
        vi.clearAllMocks()
        mockLogout.mockResolvedValue(undefined)
        localStorage.clear()
        document.documentElement.classList.remove('dark', 'light')
        const { useLogout } = await import('@/features/auth/hooks/useLogout')
        vi.mocked(useLogout).mockReturnValue({ logout: mockLogout, isPending: false })
    })

    it('renders brand link', () => {
        renderNav()
        expect(screen.getByRole('link', { name: /dwmc/i })).toBeInTheDocument()
    })

    it('renders Dashboard navigation link', () => {
        renderNav()
        expect(screen.getByRole('link', { name: /dashboard/i })).toBeInTheDocument()
    })

    it('renders Sign out button', () => {
        renderNav()
        expect(screen.getByRole('button', { name: /sign out/i })).toBeInTheDocument()
    })

    it('calls logout then navigates to /login when Sign out is clicked', async () => {
        const user = userEvent.setup()
        renderNav()
        await user.click(screen.getByRole('button', { name: /sign out/i }))
        await waitFor(() => {
            expect(mockLogout).toHaveBeenCalledOnce()
            expect(mockNavigate).toHaveBeenCalledWith('/login')
        })
    })

    it('shows "Signing out..." and disables the button when isPending is true', async () => {
        const { useLogout } = await import('@/features/auth/hooks/useLogout')
        vi.mocked(useLogout).mockReturnValue({ logout: mockLogout, isPending: true })
        renderNav()
        const btn = screen.getByRole('button', { name: /signing out/i })
        expect(btn).toBeInTheDocument()
        expect(btn).toBeDisabled()
    })
})
