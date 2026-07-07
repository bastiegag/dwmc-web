import { useState } from 'react'
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'
import { LoadingSpinner } from '@/components/feedback/LoadingSpinner'
import DashboardPageHeader from '@/features/dashboard/components/DashboardPageHeader'
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

function toErrorMessage(error: unknown, fallback: string) {
    if (error && typeof error === 'object' && 'message' in error) {
        return (error as { message?: string }).message ?? fallback
    }
    if (error instanceof Error) return error.message
    return fallback
}

export function DashboardPage() {
    const { month } = useSelectedMonth()
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
            localStorage.setItem(`last-tx-date-${month}`, values.date)
            setCreateOpen(false)
        } catch (err) {
            setFormError(toErrorMessage(err, 'Unable to create transaction.'))
        }
    }

    return (
        <>
            <section className="space-y-6" aria-labelledby="dashboard-heading">
                <DashboardPageHeader />

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
