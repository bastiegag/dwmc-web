import { describe, expect, it } from 'vitest'
import { categoryFormSchema } from './category.schema'
import { sectionFormSchema } from './section.schema'

describe('sectionFormSchema', () => {
    it('trims names and accepts backend-supported values', () => {
        expect(sectionFormSchema.parse({ name: '  Food  ', color: '#22c55e' })).toEqual({
            name: 'Food',
            color: '#22c55e',
        })
    })

    it('rejects empty names, names over 80 characters, and colors over 40 characters', () => {
        expect(sectionFormSchema.safeParse({ name: '  ', color: '#22c55e' }).success).toBe(false)
        expect(
            sectionFormSchema.safeParse({ name: 's'.repeat(81), color: '#22c55e' }).success,
        ).toBe(false)
        expect(sectionFormSchema.safeParse({ name: 'Food', color: 'x'.repeat(41) }).success).toBe(
            false,
        )
    })
})

describe('categoryFormSchema', () => {
    const validCategory = {
        name: 'Groceries',
        icon: 'shopping-cart',
        sectionId: 'section-1',
    }

    it('trims values and preserves the selected section id', () => {
        expect(
            categoryFormSchema.parse({
                ...validCategory,
                name: ' Groceries ',
                icon: ' shopping-cart ',
            }),
        ).toEqual(validCategory)
    })

    it('rejects empty or overlong fields and a missing section', () => {
        expect(categoryFormSchema.safeParse({ ...validCategory, name: '  ' }).success).toBe(false)
        expect(
            categoryFormSchema.safeParse({ ...validCategory, name: 'c'.repeat(81) }).success,
        ).toBe(false)
        expect(
            categoryFormSchema.safeParse({ ...validCategory, icon: 'i'.repeat(81) }).success,
        ).toBe(false)
        expect(categoryFormSchema.safeParse({ ...validCategory, sectionId: '' }).success).toBe(
            false,
        )
    })
})
