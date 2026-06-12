import { useMemo, useState, useCallback } from 'react'
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'
import { LoadingSpinner } from '@/components/feedback/LoadingSpinner'
import {
    useBudgets,
    useCreateBudget,
    useUpdateBudget,
    useDeleteBudget,
} from '@/features/budgets/hooks'
import { useSections } from '@/features/categories/hooks/use-sections'
import BudgetsPageHeader from '@/features/budgets/components/BudgetsPageHeader'
import BudgetMonthSelector from '@/features/budgets/components/BudgetMonthSelector'
import BudgetList from '@/features/budgets/components/BudgetList'
import BudgetDialog from '@/features/budgets/components/BudgetDialog'
import EmptyBudgetsState from '@/features/budgets/components/EmptyBudgetsState'
import { formatCurrency } from '@/lib/format-currency'
import type {
    Budget,
    CreateBudgetPayload,
    UpdateBudgetPayload,
} from '@/features/budgets/types/budget.types'

function toErrorMessage(error: unknown, fallback: string) {
    if (error && typeof error === 'object' && 'message' in error) {
        const e = error as { message?: string }
        return e.message ?? fallback
    }
    if (error instanceof Error) return error.message
    return fallback
}

export function BudgetsPage() {
    const defaultMonth = new Date().toISOString().slice(0, 7)
    const [month, setMonth] = useState<string>(defaultMonth)

    const budgetsQuery = useBudgets({ month })
    const sectionsQuery = useSections()

    const createMutation = useCreateBudget()
    const updateMutation = useUpdateBudget()
    const deleteMutation = useDeleteBudget()

    const [isDialogOpen, setDialogOpen] = useState(false)
    const [activeBudget, setActiveBudget] = useState<Budget | null>(null)
    const [formError, setFormError] = useState<string | null>(null)
    const [archiveError, setArchiveError] = useState<string | null>(null)

    const budgets = useMemo(() => budgetsQuery.data ?? [], [budgetsQuery.data])

    const totals = useMemo(() => {
        const totalPlanned = budgets.reduce((s, b) => s + b.amount, 0)
        const totalSpent = budgets.reduce((s, b) => s + b.spent, 0)
        const totalRemaining = budgets.reduce((s, b) => s + b.remaining, 0)
        return { totalPlanned, totalSpent, totalRemaining }
    }, [budgets])

    const openCreate = () => {
        setActiveBudget(null)
        setFormError(null)
        setDialogOpen(true)
    }

    const openEdit = (b: Budget) => {
        setActiveBudget(b)
        setFormError(null)
        setDialogOpen(true)
    }

    const handleSubmit = async (values: CreateBudgetPayload | UpdateBudgetPayload) => {
        try {
            if (activeBudget) {
                await updateMutation.mutateAsync({ id: activeBudget.id, input: values })
            } else {
                await createMutation.mutateAsync(values as CreateBudgetPayload)
            }
            setDialogOpen(false)
        } catch (err) {
            setFormError(toErrorMessage(err, 'Unable to save budget. Please try again.'))
        }
    }

    const handleArchive = async (b: Budget) => {
        try {
            setArchiveError(null)
            await deleteMutation.mutateAsync(b.id)
        } catch (err) {
            setArchiveError(toErrorMessage(err, 'Unable to archive budget. Please try again.'))
        }
    }

    const dialogInitialValues = useMemo(() => {
        if (!activeBudget) return undefined
        return {
            categoryId: activeBudget.category.id,
            month: activeBudget.month,
            amount: activeBudget.amount,
        }
    }, [activeBudget])

    const handleDialogOpenChange = useCallback((open: boolean) => {
        if (!open) {
            setDialogOpen(false)
            setActiveBudget(null)
            setFormError(null)
        }
    }, [])

    return (
        <section className="space-y-6" aria-labelledby="budgets-heading">
            <div className="flex items-center justify-between">
                <BudgetsPageHeader onCreate={openCreate} />
                <BudgetMonthSelector month={month} onChange={setMonth} />
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div className="rounded-lg border bg-card p-4">
                    <div className="text-sm text-muted-foreground">Total planned</div>
                    <div className="text-2xl font-semibold">
                        {formatCurrency(totals.totalPlanned)}
                    </div>
                </div>
                <div className="rounded-lg border bg-card p-4">
                    <div className="text-sm text-muted-foreground">Total spent</div>
                    <div className="text-2xl font-semibold">
                        {formatCurrency(totals.totalSpent)}
                    </div>
                </div>
                <div className="rounded-lg border bg-card p-4">
                    <div className="text-sm text-muted-foreground">Total remaining</div>
                    <div className="text-2xl font-semibold">
                        {formatCurrency(totals.totalRemaining)}
                    </div>
                </div>
            </div>

            {budgetsQuery.isLoading ? (
                <div className="py-6" role="status" aria-live="polite">
                    <LoadingSpinner aria-label="Loading budgets" />
                </div>
            ) : null}

            {budgetsQuery.isError ? (
                <Alert variant="destructive">
                    <AlertTitle>Could not load budgets</AlertTitle>
                    <AlertDescription>
                        {toErrorMessage(budgetsQuery.error, 'Please refresh and try again.')}
                    </AlertDescription>
                </Alert>
            ) : null}

            {archiveError ? (
                <Alert variant="destructive">
                    <AlertTitle>Archive failed</AlertTitle>
                    <AlertDescription>{archiveError}</AlertDescription>
                </Alert>
            ) : null}

            {!budgetsQuery.isLoading && !budgetsQuery.isError && budgets.length === 0 ? (
                <EmptyBudgetsState month={month} onCreate={openCreate} />
            ) : null}

            {!budgetsQuery.isLoading && !budgetsQuery.isError && budgets.length > 0 ? (
                <BudgetList budgets={budgets} onEdit={openEdit} onArchive={handleArchive} />
            ) : null}

            <BudgetDialog
                open={isDialogOpen}
                mode={activeBudget ? 'edit' : 'create'}
                sections={sectionsQuery.data ?? []}
                initialValues={dialogInitialValues}
                defaultMonth={month}
                isPending={createMutation.isPending || updateMutation.isPending}
                errorMessage={formError}
                onOpenChange={handleDialogOpenChange}
                onSubmit={handleSubmit}
            />
        </section>
    )
}

export default BudgetsPage
