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
        '/accounts',
    ])('rejects unsafe destination %s', (destination) => {
        expect(getSafeAuthRedirect(destination)).toBe(fallbackPath)
    })

    it('preserves a safe internal destination with query and hash', () => {
        expect(getSafeAuthRedirect('/protected-proof?source=recovery#recent')).toBe(
            '/protected-proof?source=recovery#recent',
        )
    })

    it('requires the recovery flow marker before allowing reset-password', () => {
        expect(getSafeAuthCallbackDestination('/reset-password', null)).toBe(fallbackPath)
        expect(getSafeAuthCallbackDestination('/reset-password', 'login')).toBe(fallbackPath)
        expect(getSafeAuthCallbackDestination('/reset-password', 'recovery')).toBe(
            '/reset-password',
        )
    })
})
