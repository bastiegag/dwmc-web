export type BudgetCategory = {
    id: string
    name: string
    icon: string
    sectionId: string
    section: {
        id: string
        name: string
        color: string
    }
}

export type Budget = {
    id: string
    month: string
    amount: number
    spent: number
    remaining: number
    progress: number
    isOverBudget: boolean
    transactionCount: number
    isArchived: boolean
    createdAt: string
    updatedAt: string
    category: BudgetCategory
}

export type GetBudgetsParams = {
    month?: string
    categoryId?: string
    includeArchived?: boolean
}

export type CreateBudgetPayload = {
    categoryId: string
    month: string
    amount: number
}

export type UpdateBudgetPayload = {
    categoryId?: string
    month?: string
    amount?: number
    isArchived?: boolean
}
