import { describe, expect, it } from 'vitest'
import { fallbackPath, getSafeAuthRedirect } from './auth-redirect'

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
})
