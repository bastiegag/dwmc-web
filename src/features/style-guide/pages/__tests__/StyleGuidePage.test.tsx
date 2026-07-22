import { beforeEach, describe, expect, it, vi } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { render } from '@/test/utils/render'
import { ThemeProvider } from '@/components/layout/ThemeProvider'
import { StyleGuidePage } from '@/features/style-guide'

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

const renderPage = () => {
    return render(
        <ThemeProvider defaultTheme="light" storageKey="test-theme">
            <StyleGuidePage />
        </ThemeProvider>,
        { initialEntries: ['/style-guide?month=2026-06'] },
    )
}

describe('StyleGuidePage', () => {
    beforeEach(() => {
        localStorage.clear()
        document.documentElement.classList.remove('dark', 'light')
    })

    it('renders the main style guide sections', () => {
        renderPage()

        expect(screen.getByRole('heading', { name: 'Style Guide' })).toBeInTheDocument()
        expect(screen.getByRole('heading', { name: 'Design tokens' })).toBeInTheDocument()
        expect(screen.getByRole('heading', { name: 'Form controls' })).toBeInTheDocument()
        expect(screen.getByRole('heading', { name: 'Cards and surfaces' })).toBeInTheDocument()
    })

    it('toggles the theme without crashing', async () => {
        const user = userEvent.setup()
        renderPage()

        await user.click(screen.getByRole('button', { name: 'Switch to dark mode' }))
        expect(document.documentElement.classList.contains('dark')).toBe(true)
    })

    it('triggers local toast examples without making fetch calls', async () => {
        const user = userEvent.setup()
        const fetchSpy = vi.spyOn(globalThis, 'fetch')
        renderPage()

        await user.click(screen.getByRole('button', { name: /trigger success toast/i }))
        expect(fetchSpy).not.toHaveBeenCalled()
    })
})
