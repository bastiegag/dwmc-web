import { describe, expect, it, vi } from 'vitest'
import { render } from '@/test/utils/render'
import { Toaster } from './sonner'

const themeState = { current: undefined as string | undefined }

vi.mock('@/components/layout/useTheme', () => ({
    useTheme: () => ({ theme: themeState.current }),
}))

vi.mock('sonner', () => ({
    Toaster: ({ theme }: { theme: string }) => (
        <div data-sonner-toaster="true" data-theme={theme} />
    ),
}))

describe('Toaster', () => {
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
})
