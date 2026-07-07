import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ThemeProvider, useTheme } from '@/components/layout/ThemeProvider'

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
const ThemeDisplay = () => {
    const { theme } = useTheme()
    return <p data-testid="theme">{theme}</p>
}

const ThemeControl = () => {
    const { setTheme } = useTheme()
    return (
        <>
            <button onClick={() => setTheme('light')}>Set Light</button>
            <button onClick={() => setTheme('dark')}>Set Dark</button>
            <button onClick={() => setTheme('system')}>Set System</button>
        </>
    )
}

describe('ThemeProvider', () => {
    beforeEach(() => {
        localStorage.clear()
        document.documentElement.classList.remove('dark', 'light')
    })

    it('uses defaultTheme when no stored value exists', () => {
        render(
            <ThemeProvider defaultTheme="light" storageKey="test-theme">
                <ThemeDisplay />
            </ThemeProvider>,
        )
        expect(screen.getByTestId('theme')).toHaveTextContent('light')
    })

    it('reads the stored theme from localStorage on init', () => {
        localStorage.setItem('test-theme', 'dark')
        render(
            <ThemeProvider defaultTheme="light" storageKey="test-theme">
                <ThemeDisplay />
            </ThemeProvider>,
        )
        expect(screen.getByTestId('theme')).toHaveTextContent('dark')
    })

    it('applies the theme class to document.documentElement', async () => {
        const user = userEvent.setup()
        render(
            <ThemeProvider defaultTheme="light" storageKey="test-theme">
                <ThemeDisplay />
                <ThemeControl />
            </ThemeProvider>,
        )
        await user.click(screen.getByRole('button', { name: 'Set Dark' }))
        expect(document.documentElement.classList.contains('dark')).toBe(true)
    })

    it('persists the selected theme to localStorage', async () => {
        const user = userEvent.setup()
        render(
            <ThemeProvider defaultTheme="light" storageKey="test-theme">
                <ThemeControl />
            </ThemeProvider>,
        )
        await user.click(screen.getByRole('button', { name: 'Set Dark' }))
        expect(localStorage.getItem('test-theme')).toBe('dark')
    })
})
