import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ThemeProvider } from '@/components/layout/ThemeProvider'
import { ThemeToggle } from '@/components/layout/ThemeToggle'

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

function renderWithTheme(defaultTheme: 'light' | 'dark' = 'light') {
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

    it('has aria-label "Switch to light mode" when theme is dark', () => {
        renderWithTheme('dark')
        expect(screen.getByRole('button')).toHaveAttribute('aria-label', 'Switch to light mode')
    })

    it('adds "dark" class to documentElement when clicking from light', async () => {
        const user = userEvent.setup()
        renderWithTheme('light')
        await user.click(screen.getByRole('button'))
        expect(document.documentElement.classList.contains('dark')).toBe(true)
    })

    it('adds "light" class to documentElement when clicking from dark', async () => {
        const user = userEvent.setup()
        renderWithTheme('dark')
        await user.click(screen.getByRole('button'))
        expect(document.documentElement.classList.contains('light')).toBe(true)
    })
})
