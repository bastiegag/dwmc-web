export type Category = {
    id: string
    name: string
    icon: string
    sectionId: string
    isArchived: boolean
    createdAt: string
    updatedAt: string
}

export type CreateCategoryInput = Pick<Category, 'name' | 'icon' | 'sectionId'>
export type UpdateCategoryInput = Partial<CreateCategoryInput>
