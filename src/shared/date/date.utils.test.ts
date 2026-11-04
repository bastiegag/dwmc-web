import { describe, expect, it } from 'vitest'
import { formatLocalDate, isValidDateOnly, parseDateOnly } from '@/shared/date'

describe('date utilities', () => {
    it('formats a date using the local calendar date', () => {
        expect(formatLocalDate(new Date(2026, 0, 1, 23, 30))).toBe('2026-01-01')
    })

    it('validates date-only values without UTC rollover', () => {
        expect(isValidDateOnly('2026-02-28')).toBe(true)
        expect(isValidDateOnly('2026-02-29')).toBe(false)
        expect(parseDateOnly('2026-12-31').getFullYear()).toBe(2026)
    })
})
