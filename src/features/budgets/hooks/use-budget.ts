import { useQuery } from '@tanstack/react-query'
import { getBudget } from '@/features/budgets/api/budgets.api'
import { budgetQueryKeys } from './use-budgets'

export function useBudget(id: string) {
    return useQuery({
        queryKey: budgetQueryKeys.detail(id),
        queryFn: () => getBudget(id),
    })
}
