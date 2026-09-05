import { describe, it, expect } from 'vitest'
import { cn } from '@/lib/utils'

describe('cn', () => {
    it('merges two class names', () => {
        expect(cn('foo', 'bar')).toBe('foo bar')
    })

    it('filters out falsy conditionals', () => {
        const condition = false
        expect(cn('foo', condition && 'bar')).toBe('foo')
    })

    it('deduplicates Tailwind classes (last wins)', () => {
        expect(cn('p-4', 'p-2')).toBe('p-2')
    })

    it('ignores undefined and null', () => {
        expect(cn('foo', undefined, null)).toBe('foo')
    })

    it('returns empty string with no args', () => {
        expect(cn()).toBe('')
    })

    it('supports object syntax', () => {
        expect(cn({ 'text-red-500': true, 'text-blue-500': false })).toBe('text-red-500')
    })
})
