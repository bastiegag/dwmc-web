import { afterEach, describe, expect, it, vi } from 'vitest'
import { addMonths, getCurrentMonth, isValidMonth } from '@/shared/month'

describe('month utilities', () => {
    afterEach(() => {
        vi.useRealTimers()
    })

    it('returns the current UTC month', () => {
        vi.useFakeTimers()
        vi.setSystemTime(new Date('2026-08-10T23:30:00.000Z'))

        expect(getCurrentMonth()).toBe('2026-08')
    })

    it.each([
        ['2026-01', true],
        ['2026-12', true],
        ['2026-6', false],
        ['2026-00', false],
        ['2026-13', false],
        ['abc', false],
        ['', false],
        [undefined, false],
    ])('validates %s as %s', (value, expected) => {
        expect(isValidMonth(value)).toBe(expected)
    })

    it.each([
        ['2026-01', -1, '2025-12'],
        ['2026-12', 1, '2027-01'],
        ['2026-01', 12, '2027-01'],
        ['2027-01', -13, '2025-12'],
    ])('adds months across year boundaries: %s %+d -> %s', (month, delta, expected) => {
        expect(addMonths(month, delta)).toBe(expected)
    })
})
