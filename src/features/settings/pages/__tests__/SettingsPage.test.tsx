import { beforeEach, describe, expect, it, vi } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ThemeProvider } from '@/components/layout/ThemeProvider'
import { render } from '@/test/utils/render'
import { SettingsPage } from '../SettingsPage'

describe('SettingsPage', () => {
    beforeEach(() => {
        localStorage.clear()
        Object.defineProperty(window, 'matchMedia', {
            writable: true,
            value: vi.fn().mockImplementation((query: string) => ({
                matches: false,
                media: query,
                onchange: null,
                addEventListener: vi.fn(),
                removeEventListener: vi.fn(),
            })),
        })
    })

    it('renders the current theme and changes it immediately', async () => {
        const user = userEvent.setup()

        render(
            <ThemeProvider defaultTheme="system" storageKey="dwmc-theme">
                <SettingsPage />
            </ThemeProvider>,
        )

        expect(screen.getByRole('radio', { name: /system/i })).toBeChecked()
        await user.click(screen.getByRole('radio', { name: /dark/i }))

        expect(screen.getByRole('radio', { name: /dark/i })).toBeChecked()
        expect(localStorage.getItem('dwmc-theme')).toBe('dark')
    })
})
