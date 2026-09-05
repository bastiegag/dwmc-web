import { describe, it, expect, beforeEach, vi } from 'vitest'
import { screen } from '@testing-library/react'
import { render } from '@/test/utils/render'
import userEvent from '@testing-library/user-event'
import { ThemeProvider } from '@/shared/theme'
import { ThemeToggle } from '@/components/layout'

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

const renderWithTheme = (defaultTheme: 'light' | 'dark' | 'system' = 'light') => {
    return render(
        <ThemeProvider defaultTheme={defaultTheme} storageKey="test-theme">
            <ThemeToggle />
        </ThemeProvider>,
    )
}

describe('ThemeToggle', () => {
    beforeEach(() => {
        localStorage.clear()
        document.documentElement.classList.remove('dark', 'light')
    })

    it('renders a button', () => {
        renderWithTheme()
        expect(screen.getByRole('button')).toBeInTheDocument()
    })

    it('has aria-label "Switch to dark mode" when theme is light', () => {
        renderWithTheme('light')
        expect(screen.getByRole('button')).toHaveAttribute('aria-label', 'Switch to dark mode')
    })

    it('has aria-label "Switch to system theme" when theme is dark', () => {
        renderWithTheme('dark')
        expect(screen.getByRole('button')).toHaveAttribute('aria-label', 'Switch to system theme')
    })

    it('has aria-label "Switch to light mode" when theme is system', () => {
        renderWithTheme('system')
        expect(screen.getByRole('button')).toHaveAttribute('aria-label', 'Switch to light mode')
    })

    it('cycles light → dark on click', async () => {
        const user = userEvent.setup()
        renderWithTheme('light')
        await user.click(screen.getByRole('button'))
        expect(document.documentElement.classList.contains('dark')).toBe(true)
    })

    it('cycles dark → system on click (matchMedia returns light)', async () => {
        const user = userEvent.setup()
        renderWithTheme('dark')
        await user.click(screen.getByRole('button'))
        // matchMedia mock has matches:false → system resolves to light
        expect(document.documentElement.classList.contains('light')).toBe(true)
    })

    it('cycles system → light on click', async () => {
        const user = userEvent.setup()
        renderWithTheme('system')
        await user.click(screen.getByRole('button'))
        expect(document.documentElement.classList.contains('light')).toBe(true)
    })
})
