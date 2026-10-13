import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ThemeProvider, useTheme } from '@/shared/theme'

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

    it('falls back to defaultTheme for an invalid stored value', () => {
        localStorage.setItem('test-theme', 'sepia')
        render(
            <ThemeProvider defaultTheme="light" storageKey="test-theme">
                <ThemeDisplay />
            </ThemeProvider>,
        )
        expect(screen.getByTestId('theme')).toHaveTextContent('light')
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

    it('applies a dark system preference and responds to changes', () => {
        let matches = true
        let changeHandler: (() => void) | undefined
        vi.spyOn(window, 'matchMedia').mockImplementation((query: string) => ({
            get matches() {
                return matches
            },
            media: query,
            onchange: null,
            addEventListener: (_event: string, listener: EventListenerOrEventListenerObject) => {
                changeHandler = listener as () => void
            },
            removeEventListener: vi.fn(),
            addListener: vi.fn(),
            removeListener: vi.fn(),
            dispatchEvent: vi.fn(),
        }))

        render(
            <ThemeProvider defaultTheme="system" storageKey="test-theme">
                <ThemeDisplay />
            </ThemeProvider>,
        )

        expect(document.documentElement.classList.contains('dark')).toBe(true)

        matches = false
        changeHandler?.()

        expect(document.documentElement.classList.contains('light')).toBe(true)
    })

    it('lets an explicit theme override the system preference', async () => {
        const user = userEvent.setup()
        vi.spyOn(window, 'matchMedia').mockImplementation(() => ({
            matches: true,
            media: '(prefers-color-scheme: dark)',
            onchange: null,
            addEventListener: vi.fn(),
            removeEventListener: vi.fn(),
            addListener: vi.fn(),
            removeListener: vi.fn(),
            dispatchEvent: vi.fn(),
        }))

        render(
            <ThemeProvider defaultTheme="system" storageKey="test-theme">
                <ThemeControl />
            </ThemeProvider>,
        )

        await user.click(screen.getByRole('button', { name: 'Set Light' }))

        expect(document.documentElement.classList.contains('light')).toBe(true)
        expect(document.documentElement.classList.contains('dark')).toBe(false)
    })
})
