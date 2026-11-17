import { useState } from 'react'
import { QueryState } from '@/components/feedback'
import SummaryCards from '@/features/dashboard/components/SummaryCards'
import CategoryBreakdownCard from '@/features/dashboard/components/CategoryBreakdownCard'
import AccountBreakdownCard from '@/features/dashboard/components/AccountBreakdownCard'
import RecentTransactionsCard from '@/features/dashboard/components/RecentTransactionsCard'
import { Activity } from 'lucide-react'
import { Alert, EmptyState } from '@/components/ui'
import { useMonthlySummary } from '@/features/dashboard/hooks/use-monthly-summary'
import { useSelectedMonth } from '@/shared/month'
import { usePrimaryAction } from '@/shared/primary-action'
import { useAccounts } from '@/features/accounts'
import { useSections } from '@/features/categories'
import {
    TransactionDialog,
    TransactionOptionsState,
    toCreateTransactionPayload,
    useCreateTransaction,
    type TransactionFormValues,
    rememberTransactionDate,
} from '@/features/transactions'
import { useAuth } from '@/features/auth'
import { getErrorMessage } from '@/shared/errors'

export const DashboardPage = () => {
    const { month } = useSelectedMonth()
    const { user } = useAuth()
    const summaryQuery = useMonthlySummary({ month, recentLimit: 5 })
    const accountsQuery = useAccounts()
    const sectionsQuery = useSections()
    const createTransaction = useCreateTransaction()

    const [isCreateOpen, setCreateOpen] = useState(false)
    const [formError, setFormError] = useState<string | null>(null)

    usePrimaryAction({
        label: 'Add transaction',
        onClick: () => {
            setFormError(null)
            setCreateOpen(true)
        },
    })

    const data = summaryQuery.data
    const isEmpty = data?.totals.transactionCount === 0
    const transactionOptionsState = (
        <TransactionOptionsState
            accounts={{
                hasData: accountsQuery.data !== undefined,
                isLoading: accountsQuery.isLoading,
                isFetching: accountsQuery.isFetching,
                error: accountsQuery.error,
                onRetry: () => void accountsQuery.refetch(),
            }}
            categories={{
                hasData: sectionsQuery.data !== undefined,
                isLoading: sectionsQuery.isLoading,
                isFetching: sectionsQuery.isFetching,
                error: sectionsQuery.error,
                onRetry: () => void sectionsQuery.refetch(),
            }}
            showLoading={isCreateOpen}
        />
    )

    const handleCreateTransaction = async (values: TransactionFormValues) => {
        try {
            await createTransaction.mutateAsync(toCreateTransactionPayload(values))
            rememberTransactionDate(user?.id, month, values.date)
            setCreateOpen(false)
        } catch (err) {
            setFormError(getErrorMessage(err, 'Unable to create transaction.'))
        }
    }

    return (
        <>
            <section className="space-y-6" aria-labelledby="dashboard-heading">
                <h1 id="dashboard-heading" className="sr-only">
                    Dashboard
                </h1>
                <QueryState
                    isLoading={summaryQuery.isLoading}
                    isError={summaryQuery.isError && !data}
                    loadingLabel="Loading summary"
                    errorTitle="Could not load summary"
                    errorMessage={getErrorMessage(summaryQuery.error, '')}
                    fallbackErrorMessage="Please refresh and try again."
                    onRetry={() => void summaryQuery.refetch()}
                />

                {summaryQuery.isError && data ? (
                    <Alert
                        variant="destructive"
                        role="status"
                        title="Summary refresh failed"
                        description={
                            getErrorMessage(summaryQuery.error, '') ||
                            'Please try again in a moment.'
                        }
                        action={{
                            label: 'Retry',
                            disabled: summaryQuery.isFetching,
                            onClick: () => void summaryQuery.refetch(),
                        }}
                        className="mb-0"
                    />
                ) : null}

                {!isCreateOpen ? transactionOptionsState : null}

                {!summaryQuery.isLoading && data && isEmpty ? (
                    <EmptyState
                        icon={Activity}
                        title="No activity this month"
                        description="Add a transaction to see your dashboard summary."
                    />
                ) : null}

                {!summaryQuery.isLoading && data && !isEmpty ? (
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
            <TransactionDialog
                open={isCreateOpen}
                mode="create"
                accounts={accountsQuery.data ?? []}
                sections={sectionsQuery.data ?? []}
                optionsState={transactionOptionsState}
                isPending={createTransaction.isPending}
                errorMessage={formError}
                onOpenChange={setCreateOpen}
                onSubmit={handleCreateTransaction}
            />
        </>
    )
}

export default DashboardPage
