import type { Category } from './category.types'

export type Section = {
    id: string
    name: string
    color: string
    isArchived: boolean
    createdAt: string
    updatedAt: string
}

export type SectionWithCategories = Section & {
    categories: Category[]
}

export type CreateSectionInput = Pick<Section, 'name' | 'color'>
export type UpdateSectionInput = Partial<CreateSectionInput>
