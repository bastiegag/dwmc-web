import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@/test/utils/render'
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

const mockNavigate = vi.fn()

vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom')
    return {
        ...actual,
        useNavigate: () => mockNavigate,
    }
})

function renderNav(props?: Partial<React.ComponentProps<typeof AppNav>>) {
    const defaults = { onLogout: vi.fn(), isLoggingOut: false }
    return render(
        <ThemeProvider storageKey="test-theme">
            <AppNav {...defaults} {...props} />
        </ThemeProvider>,
    )
}

describe('AppNav', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        localStorage.clear()
        document.documentElement.classList.remove('dark', 'light')
    })

    it('renders brand link', () => {
        renderNav()
        expect(screen.getByRole('link', { name: /dwmc/i })).toBeInTheDocument()
    })

    it('renders Dashboard navigation link', () => {
        renderNav()
        expect(screen.getByRole('link', { name: /dashboard/i })).toBeInTheDocument()
    })

    it('renders Categories navigation link', () => {
        renderNav()
        expect(screen.getByRole('link', { name: /categories/i })).toBeInTheDocument()
    })

    it('renders Sign out button', () => {
        renderNav()
        expect(screen.getByRole('button', { name: /sign out/i })).toBeInTheDocument()
    })

    it('calls onLogout when Sign out is clicked', async () => {
        const user = userEvent.setup()
        const onLogout = vi.fn()
        renderNav({ onLogout })
        await user.click(screen.getByRole('button', { name: /sign out/i }))
        expect(onLogout).toHaveBeenCalledOnce()
    })

    it('shows "Signing out..." and disables the button when isLoggingOut is true', () => {
        renderNav({ isLoggingOut: true })
        const btn = screen.getByRole('button', { name: /signing out/i })
        expect(btn).toBeInTheDocument()
        expect(btn).toBeDisabled()
    })
})
