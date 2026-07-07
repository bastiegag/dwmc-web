import { useMemo, useState, useCallback, useEffect } from 'react'
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'
import { LoadingSpinner } from '@/components/feedback/LoadingSpinner'
import {
    useTransactions,
    useCreateTransaction,
    useUpdateTransaction,
    useDeleteTransaction,
} from '@/features/transactions/hooks'
import { useAccounts } from '@/features/accounts/hooks/use-accounts'
import { useSections } from '@/features/categories/hooks/use-sections'
import TransactionsPageHeader from '@/features/transactions/components/TransactionsPageHeader'
import TransactionFilters from '@/features/transactions/components/TransactionFilters'
import TransactionList from '@/features/transactions/components/TransactionList'
import TransactionDialog from '@/features/transactions/components/TransactionDialog'
import EmptyTransactionsState from '@/features/transactions/components/EmptyTransactionsState'
import type { Transaction } from '@/features/transactions/types/transaction.types'
import type { GetTransactionsParams } from '@/features/transactions/types/transaction.types'
import type { TransactionFormValues } from '@/features/transactions/schemas/transaction.schema'
import { useSelectedMonth } from '@/shared/month'
import { usePrimaryAction } from '@/shared/primary-action'

function toErrorMessage(error: unknown, fallback: string) {
    if (error && typeof error === 'object' && 'message' in error)
        return (error as { message?: string }).message ?? fallback
    if (error instanceof Error) return error.message
    return fallback
}

export function TransactionsPage() {
    const { month } = useSelectedMonth()
    const [filters, setFilters] = useState<Omit<GetTransactionsParams, 'month'>>({})

    useEffect(() => {
        // When the global month changes, we could reset local filters if needed.
        // For now, we just let the transactionsQuery refetch with the new month.
    }, [month])

    const [isDialogOpen, setDialogOpen] = useState(false)
    const [activeTransaction, setActiveTransaction] = useState<Transaction | null>(null)
    const [formError, setFormError] = useState<string | null>(null)
    const [archiveError, setArchiveError] = useState<string | null>(null)

    const accountsQuery = useAccounts()
    const sectionsQuery = useSections()
    const transactionsQuery = useTransactions({ ...filters, month })

    const createMutation = useCreateTransaction()
    const updateMutation = useUpdateTransaction()
    const deleteMutation = useDeleteTransaction()

    const openCreate = useCallback(() => {
        setActiveTransaction(null)
        setFormError(null)
        setDialogOpen(true)
    }, [])

    usePrimaryAction({
        label: 'Add transaction',
        onClick: openCreate,
    })

    const accounts = accountsQuery.data ?? []
    const sections = sectionsQuery.data ?? []

    const transactions = useMemo<Transaction[]>(
        () => transactionsQuery.data?.data ?? [],
        [transactionsQuery.data],
    )

    const openEdit = (t: Transaction) => {
        setActiveTransaction(t)
        setFormError(null)
        setDialogOpen(true)
    }

    const handleSubmit = async (values: TransactionFormValues) => {
        try {
            if (activeTransaction) {
                await updateMutation.mutateAsync({ id: activeTransaction.id, input: values })
            } else {
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

                await createMutation.mutateAsync(payload)
                localStorage.setItem(`last-tx-date-${month}`, values.date)
            }

            setDialogOpen(false)
        } catch (err) {
            setFormError(toErrorMessage(err, 'Unable to save transaction. Please try again.'))
        }
    }

    const handleArchive = async (t: Transaction) => {
        try {
            setArchiveError(null)
            await deleteMutation.mutateAsync(t.id)
        } catch (err) {
            setArchiveError(toErrorMessage(err, 'Unable to archive transaction. Please try again.'))
        }
    }

    const dialogInitialValues = useMemo<TransactionFormValues | undefined>(() => {
        if (activeTransaction) {
            return {
                type: activeTransaction.type,
                amount: activeTransaction.amount,
                date: activeTransaction.date.slice(0, 10),
                accountId: activeTransaction.accountId ?? null,
                fromAccountId: activeTransaction.fromAccountId ?? null,
                toAccountId: activeTransaction.toAccountId ?? null,
                categoryId: activeTransaction.categoryId ?? null,
                merchant: activeTransaction.merchant ?? null,
                note: activeTransaction.note ?? null,
            }
        }
        // Default date logic for new transactions
        const lastDate = localStorage.getItem(`last-tx-date-${month}`)
        const today = new Date().toISOString().slice(0, 10)
        const firstDayOfMonth = `${month}-01`
        const isCurrentMonth = month === today.slice(0, 7)

        let defaultDate = isCurrentMonth ? today : firstDayOfMonth
        if (lastDate && lastDate.startsWith(month)) {
            defaultDate = lastDate
        }

        return {
            type: 'EXPENSE',
            amount: 0,
            date: defaultDate,
            accountId: null,
            fromAccountId: null,
            toAccountId: null,
            categoryId: null,
            merchant: null,
            note: null,
        }
    }, [activeTransaction, month])

    const handleDialogOpenChange = useCallback(
        (open: boolean) => {
            if (!open) {
                setDialogOpen(false)
                setActiveTransaction(null)
                setFormError(null)
            }
        },
        [setDialogOpen, setActiveTransaction, setFormError],
    )

    return (
        <section className="space-y-6" aria-labelledby="transactions-heading">
            <TransactionsPageHeader />

            <div className="pt-4">
                <TransactionFilters accounts={accounts} sections={sections} onChange={setFilters} />
            </div>

            {transactionsQuery.isLoading ? (
                <div className="py-6" role="status" aria-live="polite">
                    <LoadingSpinner aria-label="Loading transactions" />
                </div>
            ) : null}

            {transactionsQuery.isError ? (
                <Alert variant="destructive">
                    <AlertTitle>Could not load transactions</AlertTitle>
                    <AlertDescription>
                        {toErrorMessage(
                            transactionsQuery.error,
                            'Please refresh and try again in a moment.',
                        )}
                    </AlertDescription>
                </Alert>
            ) : null}

            {archiveError ? (
                <Alert variant="destructive">
                    <AlertTitle>Archive failed</AlertTitle>
                    <AlertDescription>{archiveError}</AlertDescription>
                </Alert>
            ) : null}

            {!transactionsQuery.isLoading &&
            !transactionsQuery.isError &&
            transactions.length === 0 ? (
                <EmptyTransactionsState />
            ) : null}

            {!transactionsQuery.isLoading &&
            !transactionsQuery.isError &&
            transactions.length > 0 ? (
                <TransactionList
                    transactions={transactions as Transaction[]}
                    onEdit={openEdit}
                    onArchive={handleArchive}
                />
            ) : null}

            <TransactionDialog
                open={isDialogOpen}
                mode={activeTransaction ? 'edit' : 'create'}
                accounts={accounts}
                sections={sections}
                initialValues={dialogInitialValues}
                isPending={createMutation.isPending || updateMutation.isPending}
                errorMessage={formError}
                onOpenChange={handleDialogOpenChange}
                onSubmit={handleSubmit}
            />
        </section>
    )
}

export default TransactionsPage
