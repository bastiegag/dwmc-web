import { useState } from 'react'
import { QueryState } from '@/components/feedback'
import SummaryCards from '@/features/dashboard/components/SummaryCards'
import CategoryBreakdownCard from '@/features/dashboard/components/CategoryBreakdownCard'
import AccountBreakdownCard from '@/features/dashboard/components/AccountBreakdownCard'
import RecentTransactionsCard from '@/features/dashboard/components/RecentTransactionsCard'
import EmptyDashboardState from '@/features/dashboard/components/EmptyDashboardState'
import { useMonthlySummary } from '@/features/dashboard/hooks/use-monthly-summary'
import { useSelectedMonth } from '@/shared/month'
import { usePrimaryAction } from '@/shared/primary-action'
import { useAccounts } from '@/features/accounts/hooks'
import { useSections } from '@/features/categories/hooks'
import { TransactionDialog, useCreateTransaction } from '@/features/transactions'
import type { TransactionFormValues } from '@/features/transactions/schemas/transaction.schema'
import { PageHeader } from '@/components/layout'
import { useAuth } from '@/features/auth/hooks'
import { rememberTransactionDate } from '@/features/transactions/utils/transaction-date-storage'

const toErrorMessage = (error: unknown, fallback: string) => {
    if (error && typeof error === 'object' && 'message' in error) {
        return (error as { message?: string }).message ?? fallback
    }
    if (error instanceof Error) return error.message
    return fallback
}

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
    const isEmpty = data ? data.totals.transactionCount === 0 : false

    const handleCreateTransaction = async (values: TransactionFormValues) => {
        try {
            const payload =
                values.type === 'TRANSFER'
                    ? {
                          type: 'TRANSFER' as const,
                          amount: values.amount,
                          date: values.date,
                          fromAccountId: values.fromAccountId!,
                          toAccountId: values.toAccountId!,
                          note: values.note ?? undefined,
                      }
                    : values.type === 'ADJUSTMENT'
                      ? {
                            type: 'ADJUSTMENT' as const,
                            amount: values.amount,
                            date: values.date,
                            accountId: values.accountId!,
                            note: values.note ?? undefined,
                        }
                      : {
                            type: values.type as 'INCOME' | 'EXPENSE',
                            amount: values.amount,
                            date: values.date,
                            accountId: values.accountId!,
                            categoryId: values.categoryId ?? undefined,
                            merchant: values.merchant ?? undefined,
                            note: values.note ?? undefined,
                        }
            await createTransaction.mutateAsync(payload)
            rememberTransactionDate(user?.id, month, values.date)
            setCreateOpen(false)
        } catch (err) {
            setFormError(toErrorMessage(err, 'Unable to create transaction.'))
        }
    }

    return (
        <>
            <section className="space-y-6" aria-labelledby="dashboard-heading">
                <PageHeader
                    id="dashboard-heading"
                    title="Dashboard"
                    description="Overview of your finances for the selected month."
                />

                <QueryState
                    isLoading={summaryQuery.isLoading}
                    isError={summaryQuery.isError}
                    loadingLabel="Loading summary"
                    errorTitle="Could not load summary"
                    errorMessage={toErrorMessage(summaryQuery.error, '')}
                    fallbackErrorMessage="Please refresh and try again."
                    onRetry={() => void summaryQuery.refetch()}
                />

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
            <TransactionDialog
                open={isCreateOpen}
                mode="create"
                accounts={accountsQuery.data ?? []}
                sections={sectionsQuery.data ?? []}
                isPending={createTransaction.isPending}
                errorMessage={formError}
                onOpenChange={setCreateOpen}
                onSubmit={handleCreateTransaction}
            />
        </>
    )
}

export default DashboardPage
