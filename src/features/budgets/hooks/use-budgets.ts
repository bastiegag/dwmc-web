import { useQuery } from '@tanstack/react-query'
import { getBudgets } from '@/features/budgets/api/budgets.api'
import type { GetBudgetsParams } from '@/features/budgets/types/budget.types'

export const budgetQueryKeys = {
    all: ['budgets'] as const,
    lists: () => [...budgetQueryKeys.all, 'list'] as const,
    list: (filters?: GetBudgetsParams) => [...budgetQueryKeys.lists(), filters ?? {}] as const,
    detail: (id: string) => [...budgetQueryKeys.all, 'detail', id] as const,
}

export const useBudgets = (params?: GetBudgetsParams) => {
    return useQuery({
        queryKey: budgetQueryKeys.list(params),
        queryFn: () => getBudgets(params),
    })
}
