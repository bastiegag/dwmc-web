import { beforeEach, describe, expect, it, vi } from 'vitest'
import { render } from '@/test/utils/render'
import { Toaster } from '@/components/ui'

const themeState = {
    current: undefined as string | undefined,
    override: undefined as string | undefined,
}

vi.mock('@/shared/theme', () => ({
    useTheme: () => ({
        theme: themeState.current,
        toastThemeOverride: themeState.override,
    }),
}))

vi.mock('sonner', () => ({
    Toaster: ({ theme, className }: { theme: string; className: string }) => (
        <div data-sonner-toaster="true" data-theme={theme} className={className} />
    ),
}))

describe('Toaster', () => {
    beforeEach(() => {
        themeState.current = undefined
        themeState.override = undefined
    })

    it('uses the system theme when no theme is provided', () => {
        render(<Toaster />)

        expect(document.querySelector('[data-sonner-toaster]')).toHaveAttribute(
            'data-theme',
            'system',
        )
    })

    it('passes through an explicitly selected theme', () => {
        themeState.current = 'dark'

        render(<Toaster />)

        expect(document.querySelector('[data-sonner-toaster]')).toHaveAttribute(
            'data-theme',
            'dark',
        )
    })

    it('uses the forced theme and scopes its color tokens', () => {
        themeState.current = 'dark'
        themeState.override = 'light'

        render(<Toaster />)

        const toaster = document.querySelector('[data-sonner-toaster]')
        expect(toaster).toHaveAttribute('data-theme', 'light')
        expect(toaster).toHaveClass('light')
    })
})
