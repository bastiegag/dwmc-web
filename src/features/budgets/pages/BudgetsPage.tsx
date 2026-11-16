import { useMemo, useState, useCallback } from 'react'
import { Alert, Button, Card } from '@/components/ui'
import { QueryState } from '@/components/feedback'
import {
    useBudgets,
    useCreateBudget,
    useUpdateBudget,
    useDeleteBudget,
} from '@/features/budgets/hooks'
import { useSections } from '@/features/categories'
import BudgetList from '@/features/budgets/components/BudgetList'
import BudgetDialog from '@/features/budgets/components/BudgetDialog'
import EmptyBudgetsState from '@/features/budgets/components/EmptyBudgetsState'
import { formatCurrency, sumCurrency } from '@/lib/format-currency'
import type { Budget } from '@/features/budgets/types/budget.types'
import type { BudgetFormInput, BudgetFormValues } from '@/features/budgets/schemas/budget.schema'
import { useSelectedMonth } from '@/shared/month'
import { usePrimaryAction } from '@/shared/primary-action'
import { PageHeader } from '@/components/layout'
import { getErrorMessage } from '@/shared/errors'

export const BudgetsPage = () => {
    const { month } = useSelectedMonth()

    const [activeBudget, setActiveBudget] = useState<Budget | null>(null)
    const budgetsQuery = useBudgets({ month })
    const sectionsQuery = useSections({ includeArchived: Boolean(activeBudget) })

    const createMutation = useCreateBudget()
    const updateMutation = useUpdateBudget()
    const deleteMutation = useDeleteBudget()

    const [isDialogOpen, setDialogOpen] = useState(false)
    const [formError, setFormError] = useState<string | null>(null)

    const openCreate = useCallback(() => {
        setActiveBudget(null)
        setFormError(null)
        setDialogOpen(true)
    }, [])

    usePrimaryAction({
        label: 'Add budget',
        onClick: openCreate,
    })

    const budgets = useMemo(() => budgetsQuery.data ?? [], [budgetsQuery.data])

    const totals = useMemo(() => {
        const totalPlanned = sumCurrency(budgets.map((budget) => budget.amount))
        const totalSpent = sumCurrency(budgets.map((budget) => budget.spent))
        const totalRemaining = sumCurrency(budgets.map((budget) => budget.remaining))
        return { totalPlanned, totalSpent, totalRemaining }
    }, [budgets])
    const hasBudgetsData = budgetsQuery.data !== undefined

    const openEdit = (b: Budget) => {
        setActiveBudget(b)
        setFormError(null)
        setDialogOpen(true)
    }

    const handleSubmit = async (values: BudgetFormValues) => {
        setFormError(null)
        try {
            if (activeBudget) {
                await updateMutation.mutateAsync({ id: activeBudget.id, input: values })
            } else {
                await createMutation.mutateAsync(values)
            }
            setDialogOpen(false)
        } catch (err) {
            setFormError(getErrorMessage(err, 'Unable to save budget. Please try again.'))
        }
    }

    const handleArchive = (b: Budget) => deleteMutation.mutateAsync(b.id)

    const dialogInitialValues = useMemo<BudgetFormInput | undefined>(() => {
        if (!activeBudget) return undefined
        return {
            categoryId: activeBudget.category.id,
            month: activeBudget.month,
            amount: String(activeBudget.amount),
        }
    }, [activeBudget])

    const handleDialogOpenChange = useCallback((open: boolean) => {
        if (!open) {
            setDialogOpen(false)
            setActiveBudget(null)
            setFormError(null)
        }
    }, [])

    const summaryItems = [
        { label: 'Total planned', value: formatCurrency(totals.totalPlanned) },
        { label: 'Total spent', value: formatCurrency(totals.totalSpent) },
        { label: 'Total remaining', value: formatCurrency(totals.totalRemaining) },
    ]

    return (
        <section className="space-y-6" aria-labelledby="budgets-heading">
            <PageHeader
                id="budgets-heading"
                title="Budgets"
                description="Manage monthly spending targets by category."
                actions={
                    <Button className="hidden lg:inline-flex" onClick={openCreate}>
                        Add budget
                    </Button>
                }
            />

            {hasBudgetsData ? (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    {summaryItems.map(({ label, value }) => (
                        <Card key={label} className="min-w-0">
                            <h2 className="text-sm text-muted-foreground">{label}</h2>
                            <p className="break-words text-2xl font-semibold tabular-nums">
                                {value}
                            </p>
                        </Card>
                    ))}
                </div>
            ) : null}

            <QueryState
                isLoading={budgetsQuery.isLoading && !hasBudgetsData}
                isError={budgetsQuery.isError && !hasBudgetsData}
                loadingLabel="Loading budgets"
                errorTitle="Could not load budgets"
                errorMessage={getErrorMessage(budgetsQuery.error, '')}
                fallbackErrorMessage="Please refresh and try again."
                onRetry={() => void budgetsQuery.refetch()}
            />

            {budgetsQuery.isError && hasBudgetsData ? (
                <Alert
                    variant="warning"
                    role="status"
                    title="Budget list refresh failed"
                    description={
                        getErrorMessage(budgetsQuery.error, '') || 'Please try again in a moment.'
                    }
                    action={{
                        label: 'Retry',
                        disabled: budgetsQuery.isFetching,
                        onClick: () => void budgetsQuery.refetch(),
                    }}
                    className="mb-0"
                />
            ) : null}

            {hasBudgetsData && budgets.length === 0 ? <EmptyBudgetsState month={month} /> : null}

            {hasBudgetsData && budgets.length > 0 ? (
                <BudgetList budgets={budgets} onEdit={openEdit} onArchive={handleArchive} />
            ) : null}

            <BudgetDialog
                open={isDialogOpen}
                mode={activeBudget ? 'edit' : 'create'}
                sections={sectionsQuery.data ?? []}
                initialValues={dialogInitialValues}
                defaultMonth={month}
                isCategoriesLoading={sectionsQuery.isLoading}
                isPending={createMutation.isPending || updateMutation.isPending}
                errorMessage={formError}
                onOpenChange={handleDialogOpenChange}
                onSubmit={handleSubmit}
            />
        </section>
    )
}

export default BudgetsPage
