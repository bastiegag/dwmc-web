import type { Category } from './category.types'
import type { SemanticColor } from '@/shared/semantic-colors'

export type Section = {
    id: string
    name: string
    color: SemanticColor
    isArchived: boolean
    createdAt: string
    updatedAt: string
}

export type SectionWithCategories = Section & {
    categories: Category[]
}

export type CreateSectionInput = Pick<Section, 'name' | 'color'>
export type UpdateSectionInput = Partial<CreateSectionInput>
