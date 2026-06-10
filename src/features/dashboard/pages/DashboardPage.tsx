import { useState } from 'react'
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'
import { LoadingSpinner } from '@/components/feedback/LoadingSpinner'
import DashboardPageHeader from '@/features/dashboard/components/DashboardPageHeader'
import MonthSelector from '@/features/dashboard/components/MonthSelector'
import SummaryCards from '@/features/dashboard/components/SummaryCards'
import CategoryBreakdownCard from '@/features/dashboard/components/CategoryBreakdownCard'
import AccountBreakdownCard from '@/features/dashboard/components/AccountBreakdownCard'
import RecentTransactionsCard from '@/features/dashboard/components/RecentTransactionsCard'
import EmptyDashboardState from '@/features/dashboard/components/EmptyDashboardState'
import { useMonthlySummary } from '@/features/dashboard/hooks/use-monthly-summary'

export function DashboardPage() {
    const defaultMonth = new Date().toISOString().slice(0, 7)
    const [month, setMonth] = useState<string>(defaultMonth)

    const summaryQuery = useMonthlySummary({ month, recentLimit: 5 })

    const data = summaryQuery.data

    const isEmpty = data ? data.totals.transactionCount === 0 : false

    return (
        <section className="space-y-6" aria-labelledby="dashboard-heading">
            <div className="flex items-center justify-between">
                <DashboardPageHeader />
                <MonthSelector month={month} onChange={setMonth} />
            </div>

            {summaryQuery.isLoading ? (
                <div className="py-6" role="status" aria-live="polite">
                    <LoadingSpinner aria-label="Loading summary" />
                </div>
            ) : null}

            {summaryQuery.isError ? (
                <Alert variant="destructive">
                    <AlertTitle>Could not load summary</AlertTitle>
                    <AlertDescription>
                        {summaryQuery.error instanceof Error
                            ? summaryQuery.error.message
                            : 'Please refresh and try again.'}
                        <div className="mt-2">
                            <button
                                className="text-sm text-primary"
                                onClick={() => summaryQuery.refetch()}
                            >
                                Retry
                            </button>
                        </div>
                    </AlertDescription>
                </Alert>
            ) : null}

            {!summaryQuery.isLoading && !summaryQuery.isError && data && isEmpty ? (
                <EmptyDashboardState />
            ) : null}

            {!summaryQuery.isLoading && !summaryQuery.isError && data && !isEmpty ? (
                <div className="space-y-6">
                    <SummaryCards totals={data.totals} />

                    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                        <div className="lg:col-span-2">
                            <CategoryBreakdownCard
                                title="Top expense categories"
                                items={data.topExpenseCategories}
                            />
                        </div>
                        <div>
                            <AccountBreakdownCard items={data.accountBreakdown} />
                        </div>
                    </div>

                    <RecentTransactionsCard transactions={data.recentTransactions} />
                </div>
            ) : null}
        </section>
    )
}

export default DashboardPage
