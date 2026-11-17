import { useMemo, useState, useCallback } from 'react'
import { Alert, Button } from '@/components/ui'
import { QueryState } from '@/components/feedback'
import {
    useTransactions,
    useCreateTransaction,
    useUpdateTransaction,
    useDeleteTransaction,
} from '@/features/transactions/hooks'
import { useAccounts } from '@/features/accounts'
import { useSections } from '@/features/categories'
import TransactionFilters from '@/features/transactions/components/TransactionFilters'
import TransactionList from '@/features/transactions/components/TransactionList'
import TransactionDialog from '@/features/transactions/components/TransactionDialog'
import { TransactionOptionsState } from '@/features/transactions/components/TransactionOptionsState'
import EmptyTransactionsState from '@/features/transactions/components/EmptyTransactionsState'
import { PaginationControls } from '@/features/transactions/components/PaginationControls'
import type { Transaction } from '@/features/transactions/types/transaction.types'
import type { GetTransactionsParams } from '@/features/transactions/types/transaction.types'
import type { TransactionFormValues } from '@/features/transactions/schemas/transaction.schema'
import { useSelectedMonth } from '@/shared/month'
import { usePrimaryAction } from '@/shared/primary-action'
import { PageHeader } from '@/components/layout'
import { useAuth } from '@/features/auth'
import {
    getRememberedTransactionDate,
    rememberTransactionDate,
} from '@/features/transactions/utils/transaction-date-storage'
import { toCreateTransactionPayload } from '@/features/transactions'
import { formatLocalDate } from '@/shared/date'
import { getErrorMessage } from '@/shared/errors'

export const TransactionsPage = () => {
    const { month } = useSelectedMonth()
    const { user } = useAuth()
    const [filters, setFilters] = useState<Omit<GetTransactionsParams, 'month'>>({})
    const [paginationState, setPaginationState] = useState({ month, page: 1 })
    const page = paginationState.month === month ? paginationState.page : 1

    const [isDialogOpen, setDialogOpen] = useState(false)
    const [activeTransaction, setActiveTransaction] = useState<Transaction | null>(null)
    const [formError, setFormError] = useState<string | null>(null)

    const accountsQuery = useAccounts({ includeArchived: Boolean(activeTransaction) })
    const sectionsQuery = useSections({ includeArchived: Boolean(activeTransaction) })
    const transactionsQuery = useTransactions({ ...filters, month, page })

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

    const transactions = transactionsQuery.data?.data ?? []
    const pagination = transactionsQuery.data?.meta
    const hasTransactionsData = transactionsQuery.data !== undefined
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
            showLoading={isDialogOpen}
        />
    )

    const handleFiltersChange = useCallback(
        (nextFilters: GetTransactionsParams) => {
            setFilters(nextFilters)
            setPaginationState({ month, page: 1 })
        },
        [month],
    )

    const handlePageChange = (nextPage: number) => {
        setPaginationState({ month, page: nextPage })
    }

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
                await createMutation.mutateAsync(toCreateTransactionPayload(values))
                rememberTransactionDate(user?.id, month, values.date)
            }

            setDialogOpen(false)
        } catch (err) {
            setFormError(getErrorMessage(err, 'Unable to save transaction. Please try again.'))
        }
    }

    const handleArchive = (t: Transaction) => deleteMutation.mutateAsync(t.id)

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
        const lastDate = getRememberedTransactionDate(user?.id, month)
        const today = formatLocalDate()
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
    }, [activeTransaction, month, user?.id])

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
            <PageHeader
                id="transactions-heading"
                title="Transactions"
                description="Log and manage your transactions"
                actions={
                    <Button className="hidden lg:inline-flex" onClick={openCreate}>
                        Add transaction
                    </Button>
                }
            />

            <div className="pt-4">
                <TransactionFilters
                    accounts={accounts}
                    sections={sections}
                    onChange={handleFiltersChange}
                />
            </div>

            {!isDialogOpen ? transactionOptionsState : null}

            <QueryState
                isLoading={transactionsQuery.isLoading && !hasTransactionsData}
                isError={transactionsQuery.isError && !hasTransactionsData}
                loadingLabel="Loading transactions"
                errorTitle="Could not load transactions"
                errorMessage={getErrorMessage(transactionsQuery.error, '')}
                fallbackErrorMessage="Please refresh and try again in a moment."
                onRetry={() => {
                    void transactionsQuery.refetch()
                }}
            />

            {transactionsQuery.isError && hasTransactionsData ? (
                <Alert
                    variant="destructive"
                    role="status"
                    title="Transaction list refresh failed"
                    description={
                        getErrorMessage(transactionsQuery.error, '') ||
                        'Please try again in a moment.'
                    }
                    action={{
                        label: 'Retry',
                        disabled: transactionsQuery.isFetching,
                        onClick: () => void transactionsQuery.refetch(),
                    }}
                    className="mb-0"
                />
            ) : null}

            {hasTransactionsData && transactions.length === 0 ? <EmptyTransactionsState /> : null}

            {hasTransactionsData && transactions.length > 0 ? (
                <TransactionList
                    transactions={transactions}
                    onEdit={openEdit}
                    onArchive={handleArchive}
                />
            ) : null}

            {hasTransactionsData && pagination ? (
                <PaginationControls
                    page={pagination.page}
                    totalPages={pagination.totalPages}
                    total={pagination.total}
                    onPageChange={handlePageChange}
                />
            ) : null}

            <TransactionDialog
                open={isDialogOpen}
                mode={activeTransaction ? 'edit' : 'create'}
                accounts={accounts}
                sections={sections}
                optionsState={transactionOptionsState}
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
