import { describe, expect, it } from 'vitest'
import { categoryFormSchema } from './category.schema'
import { sectionFormSchema } from './section.schema'

describe('sectionFormSchema', () => {
    it('trims names and accepts backend-supported values', () => {
        expect(sectionFormSchema.parse({ name: '  Food  ', color: 'success' })).toEqual({
            name: 'Food',
            color: 'success',
        })
    })

    it('rejects empty names, overlong names, and colors outside the semantic token set', () => {
        expect(sectionFormSchema.safeParse({ name: '  ', color: 'success' }).success).toBe(false)
        expect(
            sectionFormSchema.safeParse({ name: 's'.repeat(81), color: 'success' }).success,
        ).toBe(false)
        expect(sectionFormSchema.safeParse({ name: 'Food', color: '#22c55e' }).success).toBe(false)
        expect(sectionFormSchema.safeParse({ name: 'Food', color: 'unknown' }).success).toBe(false)
    })
})

describe('categoryFormSchema', () => {
    const validCategory = {
        name: 'Groceries',
        icon: 'shopping-cart',
        sectionId: 'section-1',
    }

    it('trims the category name and preserves the selected icon and section id', () => {
        expect(
            categoryFormSchema.parse({
                ...validCategory,
                name: ' Groceries ',
            }),
        ).toEqual(validCategory)
    })

    it('rejects invalid names, icons, and missing sections', () => {
        expect(categoryFormSchema.safeParse({ ...validCategory, name: '  ' }).success).toBe(false)
        expect(
            categoryFormSchema.safeParse({ ...validCategory, name: 'c'.repeat(81) }).success,
        ).toBe(false)
        expect(categoryFormSchema.safeParse({ ...validCategory, icon: 'tag' }).success).toBe(false)
        expect(
            categoryFormSchema.safeParse({ ...validCategory, icon: ' shopping-cart ' }).success,
        ).toBe(false)
        expect(categoryFormSchema.safeParse({ ...validCategory, icon: '' }).success).toBe(false)
        expect(categoryFormSchema.safeParse({ ...validCategory, sectionId: '' }).success).toBe(
            false,
        )
    })
})
