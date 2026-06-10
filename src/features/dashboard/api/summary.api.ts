import { apiClient } from '@/lib/api-client'
import type {
    MonthlySummary,
    GetMonthlySummaryParams,
} from '@/features/dashboard/types/summary.types'

function buildQuery(params?: GetMonthlySummaryParams) {
    if (!params) return ''
    const qs = new URLSearchParams()
    if (params.month) qs.set('month', params.month)
    if (typeof params.recentLimit === 'number') qs.set('recentLimit', String(params.recentLimit))
    const s = qs.toString()
    return s ? `?${s}` : ''
}

export async function getMonthlySummary(params?: GetMonthlySummaryParams): Promise<MonthlySummary> {
    const response = await apiClient<{ data: MonthlySummary }>(
        `/api/v1/summary/monthly${buildQuery(params)}`,
    )
    return response.data
}
