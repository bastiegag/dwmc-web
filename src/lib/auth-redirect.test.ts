import { describe, expect, it } from 'vitest'
import { fallbackPath, getSafeAuthCallbackDestination, getSafeAuthRedirect } from './auth-redirect'

describe('getSafeAuthRedirect', () => {
    it.each([
        null,
        '',
        '//evil.example',
        'https://evil.example',
        '/\\evil',
        '/login',
        '/signup',
        '/tools/unknown',
    ])('rejects unsafe destination %s', (destination) => {
        expect(getSafeAuthRedirect(destination)).toBe(fallbackPath)
    })

    it('preserves a safe internal destination with query and hash', () => {
        expect(getSafeAuthRedirect('/transactions?month=2026-06#recent')).toBe(
            '/transactions?month=2026-06#recent',
        )
    })

    it('falls back to the dashboard for missing or unsupported destinations', () => {
        expect(getSafeAuthRedirect(null)).toBe('/dashboard')
        expect(getSafeAuthRedirect('/accounts')).toBe('/accounts')
        expect(getSafeAuthRedirect('/reset-password')).toBe(fallbackPath)
    })

    it('requires the recovery flow marker before allowing reset-password', () => {
        expect(getSafeAuthCallbackDestination('/reset-password', null)).toBe(fallbackPath)
        expect(getSafeAuthCallbackDestination('/reset-password', 'login')).toBe(fallbackPath)
        expect(getSafeAuthCallbackDestination('/reset-password', 'recovery')).toBe(
            '/reset-password',
        )
    })
})
