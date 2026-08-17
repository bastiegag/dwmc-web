import { describe, expect, it } from 'vitest'
import {
    getRememberedTransactionDate,
    isValidTransactionDate,
    rememberTransactionDate,
} from './transaction-date-storage'

describe('transaction date storage', () => {
    it.each([
        ['2026-02-28', true],
        ['2024-02-29', true],
        ['2026-02-29', false],
        ['2026-04-31', false],
        ['2026-2-01', false],
        ['2026-06-01T00:00:00.000Z', false],
        ['', false],
        [null, false],
    ])('validates %s as %s', (value, expected) => {
        expect(isValidTransactionDate(value)).toBe(expected)
    })

    it('scopes remembered dates by user and month', () => {
        const storage = new Map<string, string>()
        const adapter = {
            getItem: (key: string) => storage.get(key) ?? null,
            setItem: (key: string, value: string) => storage.set(key, value),
        }

        rememberTransactionDate('user-1', '2026-05', '2026-05-17', adapter)

        expect(getRememberedTransactionDate('user-1', '2026-05', adapter)).toBe('2026-05-17')
        expect(getRememberedTransactionDate('user-2', '2026-05', adapter)).toBeNull()
        expect(getRememberedTransactionDate('user-1', '2026-06', adapter)).toBeNull()
    })

    it('ignores malformed, cross-month, and unauthenticated values', () => {
        const storage = new Map<string, string>([
            ['last-tx-date:user-1:2026-05', '2026-05-31'],
            ['last-tx-date:user-1:2026-06', '2026-02-30'],
            ['last-tx-date:user-1:2026-07', '2026-06-15'],
        ])
        const adapter = {
            getItem: (key: string) => storage.get(key) ?? null,
            setItem: (key: string, value: string) => storage.set(key, value),
        }

        expect(getRememberedTransactionDate('user-1', '2026-05', adapter)).toBe('2026-05-31')
        expect(getRememberedTransactionDate('user-1', '2026-06', adapter)).toBeNull()
        expect(getRememberedTransactionDate('user-1', '2026-07', adapter)).toBeNull()
        expect(getRememberedTransactionDate(null, '2026-05', adapter)).toBeNull()
    })

    it('does not persist invalid dates', () => {
        const setItem = () => {
            throw new Error('should not persist')
        }
        const storage = { getItem: () => null, setItem }

        rememberTransactionDate('user-1', '2026-05', '2026-02-30', storage)
        rememberTransactionDate('user-1', '2026-05', '2026-06-01', storage)
        rememberTransactionDate(null, '2026-05', '2026-05-01', storage)
    })
})
