import { useQuery } from '@tanstack/react-query'
import { getMonthlySummary } from '@/features/dashboard/api/summary.api'
import type {
    GetMonthlySummaryParams,
    MonthlySummary,
} from '@/features/dashboard/types/summary.types'

export const dashboardQueryKeys = {
    all: ['dashboard'] as const,
    lists: () => dashboardQueryKeys.all,
    monthlySummary: (params: GetMonthlySummaryParams = {}) =>
        [
            ...dashboardQueryKeys.all,
            'monthly-summary',
            {
                month: params.month ?? null,
                recentLimit: params.recentLimit ?? null,
            },
        ] as const,
}

export const useMonthlySummary = (params?: GetMonthlySummaryParams) => {
    return useQuery<MonthlySummary>({
        queryKey: dashboardQueryKeys.monthlySummary(params),
        queryFn: () => getMonthlySummary(params),
    })
}
