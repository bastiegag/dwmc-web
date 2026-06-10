import { useQuery } from '@tanstack/react-query'
import { getMonthlySummary } from '@/features/dashboard/api/summary.api'
import type {
    GetMonthlySummaryParams,
    MonthlySummary,
} from '@/features/dashboard/types/summary.types'

export const dashboardQueryKeys = {
    all: ['dashboard'] as const,
    monthlySummary: (params?: GetMonthlySummaryParams) =>
        [...dashboardQueryKeys.all, 'monthly-summary', params ?? {}] as const,
}

export function useMonthlySummary(params?: GetMonthlySummaryParams) {
    return useQuery<MonthlySummary>({
        queryKey: dashboardQueryKeys.monthlySummary(params),
        queryFn: () => getMonthlySummary(params),
    })
}
